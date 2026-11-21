import os
import urllib.request
from PIL import Image

headers = {
    'User-Agent': 'NandankananWildlifeEducationalPortal/1.0 (https://nandankanan.org; conservation@nandankanan.org) Python-urllib'
}

base_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', 'frontend', 'public', 'images'))

targets = [
    {
        "name": "white_tiger.jpg",
        "url": "https://upload.wikimedia.org/wikipedia/commons/3/3b/White_tiger_Nandankanan.jpeg",
        "max_dim": 1600
    },
    {
        "name": "asian_elephant.jpg",
        "url": "https://upload.wikimedia.org/wikipedia/commons/f/f6/Asian_Elephant_Elephas_maximus.jpg",
        "max_dim": 1600
    },
    {
        "name": "spotted_deer.jpg",
        "url": "https://upload.wikimedia.org/wikipedia/commons/c/c0/Axis_axis_cheetal.jpg",
        "max_dim": 1600
    }
]

def download_and_optimize(t):
    dest = os.path.join(base_dir, t["name"])
    print(f"Downloading {t['name']} from {t['url']}...")
    req = urllib.request.Request(t["url"], headers=headers)
    with urllib.request.urlopen(req, timeout=30) as resp:
        raw = resp.read()
    temp_path = dest + ".tmp"
    with open(temp_path, 'wb') as f:
        f.write(raw)
    
    # Optimize size with PIL
    with Image.open(temp_path) as img:
        img = img.convert("RGB")
        w, h = img.size
        max_dim = t.get("max_dim", 1600)
        if max(w, h) > max_dim:
            if w > h:
                new_w = max_dim
                new_h = int(h * (max_dim / w))
            else:
                new_h = max_dim
                new_w = int(w * (max_dim / h))
            img = img.resize((new_w, new_h), Image.Resampling.LANCZOS)
        img.save(dest, "JPEG", quality=88, optimize=True)
    if os.path.exists(temp_path):
        os.remove(temp_path)
    print(f"  Saved {dest} ({os.path.getsize(dest)} bytes)")

for t in targets:
    try:
        download_and_optimize(t)
    except Exception as e:
        print(f"  Error on {t['name']}: {e}")

# Create 16:9 widescreen posters for hero and video players
def create_16x9_poster(src_path, out_path, top_bias=0.2):
    if not os.path.exists(src_path):
        print(f"Source not found: {src_path}")
        return
    with Image.open(src_path) as img:
        img = img.convert("RGB")
        w, h = img.size
        target_ratio = 16.0 / 9.0
        cur_ratio = w / h
        if cur_ratio > target_ratio:
            new_w = int(h * target_ratio)
            left = (w - new_w) // 2
            box = (left, 0, left + new_w, h)
        else:
            new_h = int(w / target_ratio)
            top = max(0, min(h - new_h, int((h - new_h) * top_bias)))
            box = (0, top, w, top + new_h)
        cropped = img.crop(box)
        resized = cropped.resize((1920, 1080), Image.Resampling.LANCZOS)
        resized.save(out_path, "JPEG", quality=90, optimize=True)
        print(f"Created 16:9 poster: {out_path} ({os.path.getsize(out_path)} bytes)")

# Asian Elephant 16:9 poster
create_16x9_poster(
    os.path.join(base_dir, "asian_elephant.jpg"),
    os.path.join(base_dir, "elephant_poster_16x9.jpg"),
    top_bias=0.15
)

# Indian Peafowl 16:9 poster
create_16x9_poster(
    os.path.join(base_dir, "indian_peafowl.jpg"),
    os.path.join(base_dir, "peafowl_poster_16x9.jpg"),
    top_bias=0.1
)

# Spotted Deer 16:9 poster
create_16x9_poster(
    os.path.join(base_dir, "spotted_deer.jpg"),
    os.path.join(base_dir, "deer_poster_16x9.jpg"),
    top_bias=0.2
)

print("All photos and posters processed successfully!")
