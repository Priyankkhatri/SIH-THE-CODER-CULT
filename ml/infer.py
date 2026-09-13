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

# Prioritize external hard disk (F:\models\heritage_vision)
if os.path.exists(os.path.join(EXTERNAL_MODELS_DIR, 'heritage_vision_model.onnx')):
    WEIGHTS_DIR = EXTERNAL_MODELS_DIR
else:
    WEIGHTS_DIR = LOCAL_WEIGHTS_DIR

ONNX_MODEL_PATH = os.path.join(WEIGHTS_DIR, 'heritage_vision_model.onnx')
CLASSES_JSON_PATH = os.path.join(WEIGHTS_DIR, 'classes.json')

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

    def predict(self, image_input, top_k=3):
        """
        image_input can be:
        - file path (str)
        - base64 string
        - PIL Image
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

        return results

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
    predictions = predictor.predict(image_input)

    if args.json:
        print(json.dumps(predictions))
    else:
        print("\n--- Monument Recognition Results ---")
        for rank, p in enumerate(predictions, 1):
            print(f"{rank}. {p['name']} ({p['class']}) - {p['confidence']}% [ID: {p['placeId']}]")
