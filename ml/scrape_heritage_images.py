import os
import re
import sys
import json
import time
import hashlib
import requests
from io import BytesIO
from PIL import Image

import sys

# Ensure UTF-8 output on Windows consoles
if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8', errors='replace')
if hasattr(sys.stderr, 'reconfigure'):
    sys.stderr.reconfigure(encoding='utf-8', errors='replace')

ROOT_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
CLASSES_JSON = os.path.join(ROOT_DIR, 'ml', 'weights', 'classes.json')
DATA_DIR = os.path.join(ROOT_DIR, 'ml', 'data')
TRAIN_DIR = os.path.join(DATA_DIR, 'train')
VAL_DIR = os.path.join(DATA_DIR, 'val')

HEADERS = {
    'User-Agent': 'YatraHeritageExplorer/2.0 (SIH26204 Educational Project; info@yatra.local)'
}

EXCLUDE_KEYWORDS = [
    'map', 'locator', 'plan', 'diagram', 'icon', 'flag', 'logo',
    'symbol', 'drawing', 'sketch', 'stamp', 'chart', 'blueprint',
    'svg', 'pdf', 'blank', 'ground plan', 'elevation', 'layout'
]

def get_image_hash(image: Image.Image) -> str:
    """Compute MD5 hash of raw image pixels to prevent duplicates."""
    small = image.resize((64, 64)).convert('L')
    return hashlib.md5(small.tobytes()).hexdigest()

def clean_search_term(name: str) -> str:
    """Extract clean landmark title suitable for Wikimedia search."""
    cleaned = re.sub(r'\(.*?\)', '', name)
    cleaned = re.sub(r'^[A-Z0-9\-]+', '', cleaned)
    cleaned = ' '.join(cleaned.split())
    return cleaned

def fetch_image_candidates(query: str, limit: int = 15):
    """Query Wikimedia Commons search API for candidate images."""
    url = 'https://commons.wikimedia.org/w/api.php'
    params = {
        'action': 'query',
        'generator': 'search',
        'gsrnamespace': 6,
        'gsrsearch': query,
        'gsrlimit': min(limit * 2, 40),
        'prop': 'imageinfo',
        'iiprop': 'url|size|mime',
        'iiurlwidth': 960,
        'format': 'json'
    }
    try:
        r = requests.get(url, params=params, headers=HEADERS, timeout=12)
        if r.status_code != 200:
            return []
        data = r.json()
        pages = data.get('query', {}).get('pages', {})
        candidates = []
        for pid, page in pages.items():
            title = page.get('title', '').lower()
            if any(k in title for k in EXCLUDE_KEYWORDS):
                continue
            imageinfo = page.get('imageinfo', [])
            if not imageinfo:
                continue
            info = imageinfo[0]
            mime = info.get('mime', '')
            if mime not in ('image/jpeg', 'image/png'):
                continue
            width = info.get('width', 0)
            height = info.get('height', 0)
            if width < 300 or height < 300:
                continue
            ratio = width / max(1, height)
            if ratio < 0.45 or ratio > 2.4:
                continue
            thumb = info.get('thumburl') or info.get('url')
            if thumb:
                candidates.append((thumb, title))
        return candidates
    except Exception:
        return []

def download_and_process(url: str, title: str, known_hashes: set):
    """Download image, check for duplicates, resize and return PIL image."""
    try:
        r = requests.get(url, headers=HEADERS, timeout=15)
        if r.status_code != 200 or len(r.content) < 3000:
            return None
        img = Image.open(BytesIO(r.content))
        img = img.convert('RGB')
        imghash = get_image_hash(img)
        if imghash in known_hashes:
            return None
        known_hashes.add(imghash)
        img.thumbnail((800, 800), Image.Resampling.LANCZOS)
        return img
    except Exception:
        return None

def scrape_for_class(cinfo: dict, max_new: int, known_hashes: set):
    """Scrape and save images for a single monument class."""
    cname = cinfo['class']
    display_name = cinfo['name']
    search_query = clean_search_term(display_name)

    train_class_dir = os.path.join(TRAIN_DIR, cname)
    val_class_dir = os.path.join(VAL_DIR, cname)
    os.makedirs(train_class_dir, exist_ok=True)
    os.makedirs(val_class_dir, exist_ok=True)

    existing_train = [f for f in os.listdir(train_class_dir) if f.endswith(('.jpg', '.jpeg', '.png'))]
    existing_val = [f for f in os.listdir(val_class_dir) if f.endswith(('.jpg', '.jpeg', '.png'))]
    existing_total = len(existing_train) + len(existing_val)

    for f in existing_train:
        try:
            p = os.path.join(train_class_dir, f)
            with Image.open(p) as img:
                known_hashes.add(get_image_hash(img))
        except Exception:
            pass

    candidates = fetch_image_candidates(search_query, limit=max_new)
    if not candidates:
        fallback_query = cname.replace('_', ' ')
        candidates = fetch_image_candidates(fallback_query, limit=max_new)

    saved_count = 0
    next_idx = existing_total + 1

    for thumb_url, title in candidates:
        if saved_count >= max_new:
            break
        img = download_and_process(thumb_url, title, known_hashes)
        if img:
            target_dir = val_class_dir if (saved_count % 5 == 0) else train_class_dir
            dest_file = os.path.join(target_dir, f"{cname}_scraped_{next_idx}.jpg")
            img.save(dest_file, 'JPEG', quality=90)
            next_idx += 1
            saved_count += 1

    return cname, display_name, saved_count, existing_total + saved_count

def main():
    if not os.path.exists(CLASSES_JSON):
        print(f"Error: {CLASSES_JSON} not found!")
        sys.exit(1)

    with open(CLASSES_JSON, 'r', encoding='utf-8') as f:
        classes_data = json.load(f)

    import argparse
    parser = argparse.ArgumentParser()
    parser.add_argument('--limit', type=int, default=10, help='Max new images to scrape per class')
    parser.add_argument('--target', type=str, default='all', help='Comma-separated class names or "all"')
    args = parser.parse_args()

    target_classes = list(classes_data.values())
    if args.target != 'all':
        targets = [t.strip().lower().replace('_', ' ') for t in args.target.split(',')]
        target_classes = [
            c for c in target_classes
            if any(t in c['class'].lower().replace('_', ' ') or t in c['name'].lower() for t in targets)
        ]

    print("=" * 70)
    print(" [SCRAPER] YATRA HERITAGE VISION - DYNAMIC WEB SCRAPER & AUGMENTOR")
    print(f" Target Classes: {len(target_classes)} | Max Images Per Class: {args.limit}")
    print(" Source: Wikimedia Commons & Open Cultural Repositories (CC/Public Domain)")
    print("=" * 70)

    known_hashes = set()
    total_new_images = 0
    start_time = time.time()

    for idx, cinfo in enumerate(target_classes, 1):
        cname, dname, new_saved, total = scrape_for_class(cinfo, args.limit, known_hashes)
        total_new_images += new_saved
        status_icon = "[OK]" if new_saved > 0 else "[--]"
        print(f"[{idx:3d}/{len(target_classes):3d}] {status_icon} {dname[:40]:<40} | +{new_saved:2d} new photos (Total: {total:2d})", flush=True)
        time.sleep(0.12)

    duration = time.time() - start_time
    print("=" * 70)
    print(f"[DONE] Scraping Complete in {duration:.1f}s!")
    print(f"[STATS] Total New Monument Photos Added: {total_new_images}")
    print(f"[STATS] Dataset directories updated: {TRAIN_DIR} and {VAL_DIR}")
    print("=" * 70)

if __name__ == '__main__':
    main()
