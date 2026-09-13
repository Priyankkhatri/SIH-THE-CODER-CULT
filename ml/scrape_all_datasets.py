import os
import re
import sys
import csv
import json
import time
import hashlib
import requests
from io import BytesIO
from PIL import Image

# Force UTF-8 on Windows
if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8', errors='replace')
if hasattr(sys.stderr, 'reconfigure'):
    sys.stderr.reconfigure(encoding='utf-8', errors='replace')

ROOT_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DATA_DIR = os.path.join(ROOT_DIR, 'ml', 'data')
TRAIN_DIR = os.path.join(DATA_DIR, 'train')
VAL_DIR = os.path.join(DATA_DIR, 'val')
WEIGHTS_DIR = os.path.join(ROOT_DIR, 'ml', 'weights')

DATASETS_DIR = os.path.join(ROOT_DIR, 'datasets', 'dataset')
INDIAN_HERITAGE_JSON = os.path.join(DATASETS_DIR, 'indian_heritage_dataset.json')
MONUMENTS_50_CSV = os.path.join(DATASETS_DIR, 'monuments_50_master_matrix.csv')
GUJARAT_ATLAS_JSON = os.path.join(DATASETS_DIR, 'gujarat_heritage_atlas_exhaustive.json')

HEADERS = {
    'User-Agent': 'YatraMonumentScraper/3.0 (SIH26204 Tourism ML Research; info@yatra.local)'
}

EXCLUDE_WORDS = [
    'map', 'locator', 'plan', 'diagram', 'icon', 'flag', 'logo',
    'symbol', 'drawing', 'sketch', 'stamp', 'chart', 'blueprint',
    'svg', 'pdf', 'blank', 'layout'
]

def clean_slug(name: str) -> str:
    cleaned = name.lower().replace('&', 'and').replace(':', ' ').replace('/', ' ').replace('\\', ' ')
    cleaned = re.sub(r'[^a-z0-9\s_]', '', cleaned)
    parts = [p for p in cleaned.split() if p]
    return '_'.join(parts[:4])

def get_image_hash(image: Image.Image) -> str:
    small = image.resize((64, 64)).convert('L')
    return hashlib.md5(small.tobytes()).hexdigest()

def get_unified_catalog():
    catalog = {}

    # 1. Load 146 master monuments
    if os.path.exists(INDIAN_HERITAGE_JSON):
        with open(INDIAN_HERITAGE_JSON, 'r', encoding='utf-8') as f:
            data = json.load(f)
            for item in data:
                name = item.get('name', '').strip()
                if not name:
                    continue
                slug = item.get('vision_class_label') or clean_slug(name)
                catalog[slug] = {
                    'class': slug,
                    'name': name,
                    'placeId': item.get('id', ''),
                    'query': re.sub(r'\(.*?\)', '', name).strip()
                }

    # 2. Load 50 Pan-India Master Matrix
    if os.path.exists(MONUMENTS_50_CSV):
        with open(MONUMENTS_50_CSV, 'r', encoding='utf-8') as f:
            reader = csv.DictReader(f)
            for row in reader:
                name = row['Monument_Name'].strip()
                slug = clean_slug(name)
                if slug not in catalog:
                    catalog[slug] = {
                        'class': slug,
                        'name': name,
                        'placeId': row.get('ASI_ID', ''),
                        'query': re.sub(r'\(.*?\)', '', name).strip()
                    }

    # 3. Load Gujarat Atlas
    if os.path.exists(GUJARAT_ATLAS_JSON):
        with open(GUJARAT_ATLAS_JSON, 'r', encoding='utf-8') as f:
            data = json.load(f)
            for item in data:
                name = item.get('name', '').strip()
                slug = clean_slug(name)
                if slug not in catalog:
                    catalog[slug] = {
                        'class': slug,
                        'name': name,
                        'placeId': item.get('id', ''),
                        'query': re.sub(r'\(.*?\)', '', name).strip()
                    }

    return catalog

def search_wikimedia(query: str, limit: int = 12):
    url = 'https://commons.wikimedia.org/w/api.php'
    params = {
        'action': 'query',
        'generator': 'search',
        'gsrnamespace': 6,
        'gsrsearch': query,
        'gsrlimit': min(limit * 2, 30),
        'prop': 'imageinfo',
        'iiprop': 'url|size|mime',
        'iiurlwidth': 960,
        'format': 'json'
    }
    try:
        r = requests.get(url, params=params, headers=HEADERS, timeout=10)
        if r.status_code != 200:
            return []
        data = r.json()
        pages = data.get('query', {}).get('pages', {})
        results = []
        for pid, page in pages.items():
            title = page.get('title', '').lower()
            if any(w in title for w in EXCLUDE_WORDS):
                continue
            imageinfo = page.get('imageinfo', [])
            if not imageinfo:
                continue
            info = imageinfo[0]
            if info.get('mime') not in ('image/jpeg', 'image/png'):
                continue
            w, h = info.get('width', 0), info.get('height', 0)
            if w < 300 or h < 300:
                continue
            ratio = w / max(1, h)
            if ratio < 0.45 or ratio > 2.4:
                continue
            thumb = info.get('thumburl') or info.get('url')
            if thumb:
                results.append((thumb, title))
        return results
    except Exception:
        return []

def download_image(url: str, known_hashes: set):
    try:
        r = requests.get(url, headers=HEADERS, timeout=10)
        if r.status_code != 200 or len(r.content) < 3000:
            return None
        img = Image.open(BytesIO(r.content)).convert('RGB')
        imghash = get_image_hash(img)
        if imghash in known_hashes:
            return None
        known_hashes.add(imghash)
        img.thumbnail((800, 800), Image.Resampling.LANCZOS)
        return img
    except Exception:
        return None

def scrape_monument(entry: dict, max_images: int = 8, known_hashes: set = None):
    cname = entry['class']
    display_name = entry['name']
    query = entry['query']

    train_class_dir = os.path.join(TRAIN_DIR, cname)
    val_class_dir = os.path.join(VAL_DIR, cname)
    os.makedirs(train_class_dir, exist_ok=True)
    os.makedirs(val_class_dir, exist_ok=True)

    existing_train = [f for f in os.listdir(train_class_dir) if f.endswith(('.jpg', '.jpeg', '.png'))]
    existing_val = [f for f in os.listdir(val_class_dir) if f.endswith(('.jpg', '.jpeg', '.png'))]
    existing_total = len(existing_train) + len(existing_val)

    if known_hashes is None:
        known_hashes = set()

    for f in existing_train:
        try:
            with Image.open(os.path.join(train_class_dir, f)) as im:
                known_hashes.add(get_image_hash(im))
        except Exception:
            pass

    # If monument already has enough photos, skip to conserve time
    if existing_total >= max_images + 4:
        return cname, display_name, 0, existing_total

    candidates = search_wikimedia(query, limit=max_images)
    saved = 0
    next_idx = existing_total + 1

    for thumb_url, title in candidates:
        if saved >= max_images:
            break
        img = download_image(thumb_url, known_hashes)
        if img:
            dest_dir = val_class_dir if (saved % 4 == 0) else train_class_dir
            dest_file = os.path.join(dest_dir, f"{cname}_unified_{next_idx}.jpg")
            img.save(dest_file, 'JPEG', quality=88)
            next_idx += 1
            saved += 1

    return cname, display_name, saved, existing_total + saved

def main():
    import argparse
    parser = argparse.ArgumentParser()
    parser.add_argument('--offset', type=int, default=0, help='Start index of monuments to scrape')
    parser.add_argument('--count', type=int, default=6, help='How many monuments to scrape in this batch')
    parser.add_argument('--limit', type=int, default=8, help='Max images per monument in this batch')
    parser.add_argument('--targets', type=str, default='', help='Specific comma-separated targets')
    args = parser.parse_args()

    catalog = get_unified_catalog()
    all_monuments = list(catalog.values())

    if args.targets:
        tlist = [t.strip().lower() for t in args.targets.split(',')]
        selected = [m for m in all_monuments if any(t in m['class'] or t in m['name'].lower() for t in tlist)]
    else:
        selected = all_monuments[args.offset : args.offset + args.count]

    print("=" * 68)
    print(f" [LIVE SCRAPER] UNIFIED MULTI-DATASET HERITAGE HARVESTER")
    print(f" Catalog Size: {len(all_monuments)} | Processing: {len(selected)} monuments")
    print("=" * 68)

    known_hashes = set()
    total_added = 0

    for idx, m in enumerate(selected, 1):
        cname, dname, added, total = scrape_monument(m, max_images=args.limit, known_hashes=known_hashes)
        total_added += added
        icon = "[OK]" if added > 0 else "[--]"
        print(f" {icon} ({idx}/{len(selected)}) {dname[:38]:<38} | +{added:2d} photos (Total: {total:2d})", flush=True)

    print("=" * 68)
    print(f" Batch Complete! +{total_added} verified monument photos stored synchronously.")
    print("=" * 68)

if __name__ == '__main__':
    main()
