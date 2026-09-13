import sys
import os
os.environ['PYTHONIOENCODING'] = 'utf-8'
if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8')
if hasattr(sys.stderr, 'reconfigure'):
    sys.stderr.reconfigure(encoding='utf-8')

import json
import time
import argparse
import torch
import torch.nn as nn
from torch.utils.data import DataLoader
from torchvision import datasets, transforms, models
import onnx

TRAIN_DIR = os.path.join('ml', 'data', 'train')
VAL_DIR = os.path.join('ml', 'data', 'val')
WEIGHTS_DIR = os.path.join('ml', 'weights')
CLASSES_META_PATH = os.path.join('ml', 'data', 'classes_metadata.json')

def get_data_transforms():
    """
    Augmentation pipeline faithful to datasets/dataset/cv_training_augmentation_spec.json
    simulating tourist phone cameras: angle distortions, lighting changes, sensor noise, occlusions.
    """
    train_transform = transforms.Compose([
        transforms.RandomResizedCrop(224, scale=(0.75, 1.0)),
        transforms.RandomHorizontalFlip(p=0.5),
        transforms.RandomPerspective(distortion_scale=0.25, p=0.6),
        transforms.ColorJitter(brightness=0.3, contrast=0.3, saturation=0.2),
        transforms.ToTensor(),
        transforms.Normalize(mean=[0.485, 0.456, 0.406], std=[0.229, 0.224, 0.225]),
        transforms.RandomErasing(p=0.3, scale=(0.02, 0.2), value='random')
    ])

    val_transform = transforms.Compose([
        transforms.Resize(256),
        transforms.CenterCrop(224),
        transforms.ToTensor(),
        transforms.Normalize(mean=[0.485, 0.456, 0.406], std=[0.229, 0.224, 0.225])
    ])

    return train_transform, val_transform

def build_model(num_classes: int):
    # Lightweight MobileNetV3 Small (2.5M params, ~10MB)
    model = models.mobilenet_v3_small(weights=models.MobileNet_V3_Small_Weights.DEFAULT)

    # Replace classifier head for our exact monument count
    in_features = model.classifier[3].in_features
    model.classifier[3] = nn.Sequential(
        nn.Dropout(p=0.25),
        nn.Linear(in_features, num_classes)
    )
    return model

import sys
if sys.platform == 'win32':
    try:
        sys.stdout.reconfigure(encoding='utf-8')
    except Exception:
        pass

def train(epochs=12, batch_size=16, lr=1e-3, resume=False):
    os.makedirs(WEIGHTS_DIR, exist_ok=True)
    device = torch.device('cuda' if torch.cuda.is_available() else 'cpu')
    print(f"\n=======================================================")
    print(f"[YATRA] HERITAGE VISION MODEL TRAINING PIPELINE")
    print(f"=======================================================")
    print(f"Device: {device}")
    print(f"Epochs: {epochs} | Batch Size: {batch_size} | Learning Rate: {lr}")

    train_tf, val_tf = get_data_transforms()

    train_dataset = datasets.ImageFolder(TRAIN_DIR, transform=train_tf)
    val_dataset = datasets.ImageFolder(VAL_DIR, transform=val_tf)

    train_loader = DataLoader(train_dataset, batch_size=batch_size, shuffle=True, num_workers=0)
    val_loader = DataLoader(val_dataset, batch_size=batch_size, shuffle=False, num_workers=0)

    classes = train_dataset.classes
    num_classes = len(classes)
    print(f"Total Heritage Monument Classes: {num_classes}")
    print(f"Train samples: {len(train_dataset)} | Val samples: {len(val_dataset)}")

    # Load metadata mapping for class details
    meta_mapping = {}
    if os.path.exists(CLASSES_META_PATH):
        with open(CLASSES_META_PATH, 'r', encoding='utf-8') as f:
            meta_mapping = json.load(f)

    # Save classes.json for inference
    classes_dict = {}
    for idx, cname in enumerate(classes):
        info = meta_mapping.get(cname, {})
        classes_dict[idx] = {
            'class': cname,
            'name': info.get('name', cname.replace('_', ' ').title()),
            'placeId': info.get('placeId', '')
        }

    classes_json_path = os.path.join(WEIGHTS_DIR, 'classes.json')
    with open(classes_json_path, 'w', encoding='utf-8') as f:
        json.dump(classes_dict, f, indent=2)
    print(f"Classes dictionary saved to: {classes_json_path}")

    model = build_model(num_classes).to(device)

    # Resume from previous best checkpoint if requested and shapes match
    if resume and os.path.exists(os.path.join(WEIGHTS_DIR, 'heritage_vision_model.pth')):
        try:
            prev_state = torch.load(os.path.join(WEIGHTS_DIR, 'heritage_vision_model.pth'), map_location=device)
            if 'classifier.3.1.weight' in prev_state and prev_state['classifier.3.1.weight'].shape[0] == num_classes:
                model.load_state_dict(prev_state)
                print("[RESUME] Loaded previous best model weights for progressive fine-tuning!")
        except Exception as e:
            print(f"[RESUME NOTE] Initializing fresh weights: {e}")

    # Label smoothing cross entropy prevents overconfident misclassification
    criterion = nn.CrossEntropyLoss(label_smoothing=0.1)

    # Differential learning rates: keep pretrained backbone stable while training new classification head
    backbone_params = [p for p in model.features.parameters()]
    classifier_params = [p for p in model.classifier.parameters()]

    optimizer = torch.optim.AdamW([
        {'params': backbone_params, 'lr': lr * 0.15},
        {'params': classifier_params, 'lr': lr}
    ], weight_decay=1e-4)
    scheduler = torch.optim.lr_scheduler.CosineAnnealingLR(optimizer, T_max=epochs, eta_min=1e-6)

    best_val_acc = 0.0
    start_time = time.time()

    for epoch in range(1, epochs + 1):
        epoch_start = time.time()

        # Training phase
        model.train()
        train_loss = 0.0
        train_correct = 0
        total_train = 0
        num_batches = len(train_loader)

        for batch_idx, (images, labels) in enumerate(train_loader, 1):
            images, labels = images.to(device), labels.to(device)

            optimizer.zero_grad()
            outputs = model(images)
            loss = criterion(outputs, labels)
            loss.backward()
            optimizer.step()

            train_loss += loss.item() * images.size(0)
            _, preds = torch.max(outputs, 1)
            train_correct += torch.sum(preds == labels.data).item()
            total_train += images.size(0)

            # Live batch progress update every 10 batches
            if batch_idx % 10 == 0 or batch_idx == num_batches:
                current_acc = (train_correct / total_train) * 100
                current_loss = train_loss / total_train
                print(f"  -> [Epoch {epoch:02d}/{epochs:02d}] Batch {batch_idx:2d}/{num_batches:2d} | Running Loss: {current_loss:.4f} | Running Acc: {current_acc:5.1f}%", flush=True)

        current_lr = scheduler.get_last_lr()[0] if hasattr(scheduler, 'get_last_lr') else lr
        scheduler.step()

        # Validation phase
        model.eval()
        val_loss = 0.0
        val_correct = 0
        total_val = 0

        with torch.no_grad():
            for images, labels in val_loader:
                images, labels = images.to(device), labels.to(device)
                outputs = model(images)
                loss = criterion(outputs, labels)

                val_loss += loss.item() * images.size(0)
                _, preds = torch.max(outputs, 1)
                val_correct += torch.sum(preds == labels.data).item()
                total_val += images.size(0)

        train_acc = (train_correct / total_train) * 100 if total_train > 0 else 0
        val_acc = (val_correct / total_val) * 100 if total_val > 0 else 0
        avg_train_loss = train_loss / total_train if total_train > 0 else 0
        avg_val_loss = val_loss / total_val if total_val > 0 else 0
        epoch_duration = time.time() - epoch_start

        best_marker = ""
        if val_acc >= best_val_acc:
            best_val_acc = val_acc
            pth_path = os.path.join(WEIGHTS_DIR, 'heritage_vision_model.pth')
            torch.save(model.state_dict(), pth_path)
            best_marker = " [★ NEW BEST MODEL SAVED]"

        print(f"==> Epoch [{epoch:02d}/{epochs:02d}] ({epoch_duration:.1f}s) | LR: {current_lr:.6f}\n"
              f"    Train Loss: {avg_train_loss:.4f} | Train Acc: {train_acc:5.1f}%\n"
              f"    Val Loss:   {avg_val_loss:.4f} | Val Acc:   {val_acc:5.1f}%{best_marker}\n", flush=True)

    total_duration = time.time() - start_time
    print(f"\n[DONE] Training completed in {total_duration:.1f} seconds! Top Val Acc: {best_val_acc:.1f}%", flush=True)

    # Export best model to ONNX for production edge & server deployment
    print("\n[EXPORT] Exporting to ONNX format (heritage_vision_model.onnx)...")
    model.eval()
    model.load_state_dict(torch.load(os.path.join(WEIGHTS_DIR, 'heritage_vision_model.pth'), map_location='cpu'))
    model.to('cpu')

    dummy_input = torch.randn(1, 3, 224, 224)
    onnx_path = os.path.join(WEIGHTS_DIR, 'heritage_vision_model.onnx')

    torch.onnx.export(
        model,
        dummy_input,
        onnx_path,
        export_params=True,
        opset_version=18,
        do_constant_folding=True,
        input_names=['input'],
        output_names=['output'],
        dynamic_axes={'input': {0: 'batch_size'}, 'output': {0: 'batch_size'}}
    )

    onnx_size_mb = os.path.getsize(onnx_path) / (1024 * 1024)
    print(f"[SUCCESS] ONNX export successful: {onnx_path} ({onnx_size_mb:.2f} MB)")
    print(f"[SUCCESS] Ready for instant mobile/server inference!\n")

if __name__ == '__main__':
    parser = argparse.ArgumentParser()
    parser.add_argument('--epochs', type=int, default=12)
    parser.add_argument('--batch-size', type=int, default=16)
    parser.add_argument('--lr', type=float, default=1e-3)
    parser.add_argument('--resume', action='store_true', help='Resume from previous best weights')
    args = parser.parse_args()

    train(epochs=args.epochs, batch_size=args.batch_size, lr=args.lr, resume=args.resume)
