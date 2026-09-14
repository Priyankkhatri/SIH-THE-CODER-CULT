import sys
import os
os.environ['PYTHONIOENCODING'] = 'utf-8'
if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8')
if hasattr(sys.stderr, 'reconfigure'):
    sys.stderr.reconfigure(encoding='utf-8')

import json
import base64
import argparse
from io import BytesIO
import numpy as np
from PIL import Image
import onnxruntime as ort

EXTERNAL_MODELS_DIR = r'F:\models\heritage_vision'
LOCAL_WEIGHTS_DIR = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'weights')

# Intelligently select latest model weights between external drive and local workspace
local_model = os.path.join(LOCAL_WEIGHTS_DIR, 'heritage_vision_model.onnx')
ext_model = os.path.join(EXTERNAL_MODELS_DIR, 'heritage_vision_model.onnx')

if os.path.exists(ext_model) and os.path.exists(local_model):
    try:
        if os.path.getmtime(local_model) >= os.path.getmtime(ext_model):
            WEIGHTS_DIR = LOCAL_WEIGHTS_DIR
        else:
            WEIGHTS_DIR = EXTERNAL_MODELS_DIR
    except Exception:
        WEIGHTS_DIR = LOCAL_WEIGHTS_DIR
elif os.path.exists(ext_model):
    WEIGHTS_DIR = EXTERNAL_MODELS_DIR
else:
    WEIGHTS_DIR = LOCAL_WEIGHTS_DIR

ONNX_MODEL_PATH = os.path.join(WEIGHTS_DIR, 'heritage_vision_model.onnx')
CLASSES_JSON_PATH = os.path.join(WEIGHTS_DIR, 'classes.json')


def analyze_surface_complexity(pil_image: Image.Image) -> dict:
    """
    Analyzes visual entropy and edge complexity to detect plain walls, flat surfaces,
    or low-information non-monumental frames before or alongside neural classification.
    """
    gray = pil_image.convert('L').resize((160, 160))
    arr = np.array(gray, dtype=np.float32)

    # 3x3 discrete Laplacian filter to estimate edge variance
    h, w = arr.shape
    lap_resp = (
        arr[0:h-2, 1:w-1] + arr[2:h, 1:w-1] + arr[1:h-1, 0:w-2] + arr[1:h-1, 2:w]
        - 4.0 * arr[1:h-1, 1:w-1]
    )
    edge_variance = float(np.var(lap_resp))

    # Color variance across RGB channels
    rgb = np.array(pil_image.resize((64, 64)), dtype=np.float32)
    std_r = float(np.std(rgb[:, :, 0]))
    std_g = float(np.std(rgb[:, :, 1]))
    std_b = float(np.std(rgb[:, :, 2]))
    avg_color_std = (std_r + std_g + std_b) / 3.0

    # A flat wall or blank surface typically has edge_variance < 35 and avg_color_std < 22
    is_flat_surface = (edge_variance < 35.0 and avg_color_std < 22.0) or (edge_variance < 18.0)

    return {
        'edge_variance': round(edge_variance, 2),
        'color_std': round(avg_color_std, 2),
        'is_flat_surface': is_flat_surface
    }


class HeritageVisionPredictor:
    def __init__(self, model_path=ONNX_MODEL_PATH, classes_path=CLASSES_JSON_PATH):
        if not os.path.exists(model_path):
            raise FileNotFoundError(f"Model not found at {model_path}. Train the model first.")

        self.session = ort.InferenceSession(model_path, providers=['CPUExecutionProvider'])
        self.input_name = self.session.get_inputs()[0].name

        with open(classes_path, 'r', encoding='utf-8') as f:
            self.classes = json.load(f)

    def preprocess(self, pil_image: Image.Image) -> np.ndarray:
        img = pil_image.convert('RGB')
        # Resize to 256 then center crop 224
        img = img.resize((256, 256), Image.Resampling.BILINEAR)
        left = (256 - 224) / 2
        top = (256 - 224) / 2
        img = img.crop((left, top, left + 224, top + 224))

        arr = np.array(img).astype(np.float32) / 255.0
        # Normalize with ImageNet mean and std
        mean = np.array([0.485, 0.456, 0.406], dtype=np.float32)
        std = np.array([0.229, 0.224, 0.225], dtype=np.float32)
        arr = (arr - mean) / std

        # HWC to CHW and add batch dimension
        arr = np.transpose(arr, (2, 0, 1))
        arr = np.expand_dims(arr, axis=0)
        return arr

    def softmax(self, x: np.ndarray) -> np.ndarray:
        e_x = np.exp(x - np.max(x))
        return e_x / e_x.sum()

    def predict(self, image_input, top_k=3) -> dict:
        """
        image_input can be:
        - file path (str)
        - base64 string
        - PIL Image

        Returns structured verification decision with monument validity gating.
        """
        if isinstance(image_input, str):
            if image_input.startswith('data:') or len(image_input) > 500:
                # Base64
                if 'base64,' in image_input:
                    image_input = image_input.split('base64,')[1]
                image_bytes = base64.b64decode(image_input)
                pil_image = Image.open(BytesIO(image_bytes))
            else:
                pil_image = Image.open(image_input)
        elif isinstance(image_input, Image.Image):
            pil_image = image_input
        else:
            raise ValueError("Unsupported image input type")

        # 1. Structural surface analysis (Physics-based wall / plain surface filter)
        surface = analyze_surface_complexity(pil_image)
        if surface['is_flat_surface']:
            return {
                'identified': False,
                'isMonument': False,
                'reason': 'plain_surface_detected',
                'message': 'No heritage monument detected in the frame.',
                'guidance': 'Please point your camera directly at an Indian heritage monument, temple, fortress, or museum artifact.',
                'class': 'non_monument',
                'name': 'Plain Surface / Wall',
                'placeId': '',
                'confidence': 0.0,
                'surfaceComplexity': surface,
                'predictions': []
            }

        # 2. Deep Neural Vision Model (MobileNetV3 ONNX)
        input_tensor = self.preprocess(pil_image)
        outputs = self.session.run(None, {self.input_name: input_tensor})[0]
        logits = outputs[0]
        probs = self.softmax(logits)

        top_indices = np.argsort(probs)[::-1][:top_k]
        results = []
        for idx in top_indices:
            idx_str = str(idx)
            class_info = self.classes.get(idx_str, {'class': f'class_{idx}', 'name': f'Class {idx}', 'placeId': ''})
            confidence_pct = round(float(probs[idx]) * 100, 2)
            results.append({
                'class': class_info['class'],
                'name': class_info['name'],
                'placeId': class_info['placeId'],
                'confidence': confidence_pct
            })

        top_match = results[0]
        is_neg_class = (
            top_match['class'] == 'non_monument' or
            'non-monument' in top_match['name'].lower() or
            'plain surface' in top_match['name'].lower()
        )

        # 3. Explicit Negative Class Rejection
        if is_neg_class:
            return {
                'identified': False,
                'isMonument': False,
                'reason': 'non_monument_detected',
                'message': 'No historical monument or artifact detected.',
                'guidance': 'Please point your camera at an Indian heritage site, monument, temple, fortress, or museum exhibit.',
                'class': 'non_monument',
                'name': 'Non-Monument / Everyday Scene',
                'placeId': '',
                'confidence': top_match['confidence'],
                'surfaceComplexity': surface,
                'predictions': results
            }

        # 4. Confidence Gating (Diffuse low-confidence probability across classes)
        # In a 128-class model, uniform random noise is ~0.78%.
        # A confident real-world match must achieve at least 25% top-1 margin.
        if top_match['confidence'] < 25.0:
            return {
                'identified': False,
                'isMonument': False,
                'reason': 'low_confidence',
                'message': 'Heritage site could not be confidently identified.',
                'guidance': 'Please steady your camera, move closer, and align with the monument facade or architectural feature.',
                'class': top_match['class'],
                'name': top_match['name'],
                'placeId': top_match['placeId'],
                'confidence': top_match['confidence'],
                'surfaceComplexity': surface,
                'predictions': results
            }

        # 5. Confirmed Monument Verification
        return {
            'identified': True,
            'isMonument': True,
            'class': top_match['class'],
            'name': top_match['name'],
            'placeId': top_match['placeId'],
            'confidence': top_match['confidence'],
            'surfaceComplexity': surface,
            'predictions': results
        }


if __name__ == '__main__':
    parser = argparse.ArgumentParser()
    parser.add_argument('--image', type=str, default=None, help='Path to test image or base64')
    parser.add_argument('--stdin', action='store_true', help='Read image base64 from stdin')
    parser.add_argument('--json', action='store_true', help='Output JSON format')
    args = parser.parse_args()

    image_input = None
    if args.stdin:
        image_input = sys.stdin.read().strip()
    elif args.image:
        image_input = args.image
    else:
        parser.error("Either --image or --stdin must be provided")

    predictor = HeritageVisionPredictor()
    result = predictor.predict(image_input)

    if args.json:
        print(json.dumps(result))
    else:
        print("\n--- Monument Recognition Results ---")
        if result['isMonument']:
            print(f"VERIFIED MONUMENT: {result['name']} ({result['class']}) - {result['confidence']}% [ID: {result['placeId']}]")
            for rank, p in enumerate(result['predictions'], 1):
                print(f"  {rank}. {p['name']} ({p['class']}) - {p['confidence']}% [ID: {p['placeId']}]")
        else:
            print(f"REJECTED: {result['message']}")
            print(f"Guidance: {result['guidance']}")
            print(f"Reason: {result['reason']} (Confidence: {result['confidence']}%)")
