import os
import json
import time
import requests
from PIL import Image
from io import BytesIO
from concurrent.futures import ThreadPoolExecutor, as_completed

DATASET_JSON = os.path.join('datasets', 'dataset', 'indian_heritage_dataset.json')
OUTPUT_DIR = os.path.join('ml', 'data')
TRAIN_DIR = os.path.join(OUTPUT_DIR, 'train')
VAL_DIR = os.path.join(OUTPUT_DIR, 'val')

HEADERS = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36 YatraHeritageBot/1.0 (contact: info@yatra.local)'
}

# Flagship curated monuments with guaranteed rich multi-angle photography
CURATED_SUPPLEMENT = {
    'kumbhalgarh_fort': {
        'name': 'Kumbhalgarh Fort & The Great Wall of India',
        'placeId': 'IND-HER-26',
        'photos': [
            'https://upload.wikimedia.org/wikipedia/commons/thumb/1/13/Kumbhalgarh_055.jpg/800px-Kumbhalgarh_055.jpg',
            'https://upload.wikimedia.org/wikipedia/commons/thumb/f/fb/Gate_of_kumbhalgarh_fort.jpg/800px-Gate_of_kumbhalgarh_fort.jpg',
            'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e7/Aerial_view_of_Kumbhalgarh.jpg/800px-Aerial_view_of_Kumbhalgarh.jpg',
            'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f8/Boundary_wall_of_Kumbhalgarh_Fort%2C_Rajsamand%2C_Rajasthan%2CIndia.jpg/800px-Boundary_wall_of_Kumbhalgarh_Fort%2C_Rajsamand%2C_Rajasthan%2CIndia.jpg',
            'https://upload.wikimedia.org/wikipedia/commons/thumb/7/7b/Kumbhalgarh_Fort_Wall.jpg/800px-Kumbhalgarh_Fort_Wall.jpg',
            'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d4/Kumbhalgarh_Palace.jpg/800px-Kumbhalgarh_Palace.jpg',
            'https://upload.wikimedia.org/wikipedia/commons/thumb/0/00/Kumbhalgarh_Fort_Ramparts.jpg/800px-Kumbhalgarh_Fort_Ramparts.jpg',
            'https://upload.wikimedia.org/wikipedia/commons/thumb/5/52/Kumbhalgarh_Fort_view.jpg/800px-Kumbhalgarh_Fort_view.jpg'
        ]
    },
    'laxmi_vilas_palace': {
        'name': 'Laxmi Vilas Palace',
        'placeId': 'p1-laxmi-vilas',
        'photos': [
            'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e7/Lukshmi_Vilas_Palace_front.jpg/800px-Lukshmi_Vilas_Palace_front.jpg',
            'https://upload.wikimedia.org/wikipedia/commons/thumb/8/87/Laxmi_Vilas_Palace%2C_Vadodara.jpg/800px-Laxmi_Vilas_Palace%2C_Vadodara.jpg',
            'https://upload.wikimedia.org/wikipedia/commons/thumb/5/58/Laxmi_Vilas_Palace_Dome.jpg/800px-Laxmi_Vilas_Palace_Dome.jpg',
            'https://upload.wikimedia.org/wikipedia/commons/thumb/3/30/Laxmi_Vilas_Palace_Vadodara_Gujarat.jpg/800px-Laxmi_Vilas_Palace_Vadodara_Gujarat.jpg'
        ]
    }
}

import re

def clean_slug(text: str) -> str:
    cleaned = text.lower().replace('&', 'and').replace(':', ' ').replace('/', ' ').replace('\\', ' ')
    cleaned = re.sub(r'[^a-z0-9\s_]', '', cleaned)
    parts = [p for p in cleaned.split() if p]
    return '_'.join(parts[:4])

def download_image(url: str, dest_path: str) -> bool:
    try:
        resp = requests.get(url, headers=HEADERS, timeout=12)
        if resp.status_code == 200 and len(resp.content) > 1000:
            img = Image.open(BytesIO(resp.content))
            img = img.convert('RGB')
            # Resize maximum dimension to 800 to save space while retaining full architectural details
            img.thumbnail((800, 800), Image.Resampling.LANCZOS)
            img.save(dest_path, 'JPEG', quality=88)
            return True
    except Exception:
        pass
    return False

def main():
    os.makedirs(TRAIN_DIR, exist_ok=True)
    os.makedirs(VAL_DIR, exist_ok=True)

    with open(DATASET_JSON, 'r', encoding='utf-8') as f:
        monuments = json.load(f)

    # We will build classes for the top monuments across India & Gujarat
    # to keep training fast, focused, and ultra-accurate
    class_map = {}
    tasks = []

    print(f"Loaded {len(monuments)} monuments from {DATASET_JSON}")

    # 1. Process dataset monuments
    for item in monuments:
        name = item.get('name', '')
        raw_label = item.get('vision_class_label') or clean_slug(name)
        class_name = clean_slug(raw_label)
        place_id = item.get('id', '')

        photos = item.get('photos', [])
        # Add curated supplement if exists
        if class_name in CURATED_SUPPLEMENT:
            for p in CURATED_SUPPLEMENT[class_name]['photos']:
                if p not in photos:
                    photos.append(p)

        if photos and class_name not in class_map:
            class_map[class_name] = {
                'name': name,
                'placeId': place_id,
                'photos': photos
            }

    # Ensure curated entries are in class_map
    for cname, cdata in CURATED_SUPPLEMENT.items():
        if cname not in class_map:
            class_map[cname] = {
                'name': cdata['name'],
                'placeId': cdata['placeId'],
                'photos': cdata['photos']
            }

    # Filter to classes with at least 3 valid photos
    selected_classes = {k: v for k, v in class_map.items() if len(v['photos']) >= 3}
    print(f"Selected {len(selected_classes)} monuments with rich multi-angle photography.")

    # Create directories for each class
    for cname in selected_classes:
        os.makedirs(os.path.join(TRAIN_DIR, cname), exist_ok=True)
        os.makedirs(os.path.join(VAL_DIR, cname), exist_ok=True)

    # Build download queue
    download_jobs = []
    for cname, cinfo in selected_classes.items():
        photos = cinfo['photos']
        for idx, url in enumerate(photos):
            # 80% train, 20% val
            split_dir = VAL_DIR if (idx % 5 == 0) else TRAIN_DIR
            filename = f"{cname}_{idx+1}.jpg"
            dest = os.path.join(split_dir, cname, filename)
            download_jobs.append((url, dest, cname))

    print(f"Queued {len(download_jobs)} image downloads across {len(selected_classes)} classes.")

    # Execute downloads with thread pool
    success_count = 0
    with ThreadPoolExecutor(max_workers=8) as executor:
        futures = {executor.submit(download_image, url, dest): (cname, dest) for url, dest, cname in download_jobs}
        for future in as_completed(futures):
            cname, dest = futures[future]
            try:
                if future.result():
                    success_count += 1
                    if success_count % 25 == 0 or success_count == len(download_jobs):
                        print(f"Downloaded {success_count}/{len(download_jobs)} photos...")
            except Exception as e:
                pass

    # Save classes metadata
    classes_meta_path = os.path.join(OUTPUT_DIR, 'classes_metadata.json')
    with open(classes_meta_path, 'w', encoding='utf-8') as f:
        json.dump(selected_classes, f, indent=2)

    print(f"\n[DONE] Dataset preparation complete!")
    print(f"Successfully saved {success_count} photos.")
    print(f"Classes metadata saved to: {classes_meta_path}")

if __name__ == '__main__':
    main()
