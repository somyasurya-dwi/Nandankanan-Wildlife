import urllib.request
import os

images = [
    # Tigers & White Tiger
    {
        "file": "frontend/public/images/royal_bengal_tiger.jpg",
        "url": "https://images.unsplash.com/photo-1561731216-c3a4d99437d5?auto=format&fit=crop&w=1200&q=85"
    },
    {
        "file": "frontend/public/images/white_tiger.jpg",
        "url": "https://images.unsplash.com/photo-1549480017-d76466a4b7e8?auto=format&fit=crop&w=1200&q=85"
    },
    {
        "file": "frontend/public/images/tiger_hero_poster.jpg",
        "url": "https://images.unsplash.com/photo-1534188753412-3e26d0d618d6?auto=format&fit=crop&w=1920&q=85"
    },
    # Lion
    {
        "file": "frontend/public/images/asiatic_lion.jpg",
        "url": "https://images.unsplash.com/photo-1546182990-dffeafbe841d?auto=format&fit=crop&w=1200&q=85"
    },
    # Elephant
    {
        "file": "frontend/public/images/asian_elephant.jpg",
        "url": "https://images.unsplash.com/photo-1557050543-4d5f4e07ef46?auto=format&fit=crop&w=1200&q=85"
    },
    # Spotted Deer
    {
        "file": "frontend/public/images/spotted_deer.jpg",
        "url": "https://images.unsplash.com/photo-1484406566174-9da000fda645?auto=format&fit=crop&w=1200&q=85"
    },
    # Sloth Bear
    {
        "file": "frontend/public/images/sloth_bear.jpg",
        "url": "https://images.unsplash.com/photo-1530595467537-0b5996c41f2d?auto=format&fit=crop&w=1200&q=85"
    },
    # Indian Peafowl / Birds
    {
        "file": "frontend/public/images/indian_peafowl.jpg",
        "url": "https://images.unsplash.com/photo-1517457373958-b7bdd4587205?auto=format&fit=crop&w=1200&q=85"
    },
    # Gharial / Crocodile
    {
        "file": "frontend/public/images/gharial.jpg",
        "url": "https://images.unsplash.com/photo-1527525443983-6e60c75fff46?auto=format&fit=crop&w=1200&q=85"
    },
    # Pangolin
    {
        "file": "frontend/public/images/pangolin.jpg",
        "url": "https://images.unsplash.com/photo-1574063413132-355dbfd83e25?auto=format&fit=crop&w=1200&q=85"
    },
    # Sanctuary / Kanjia Lake
    {
        "file": "frontend/public/images/kanjia_lake.jpg",
        "url": "https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=1600&q=85"
    },
    # Sanctuary Botanical Garden & Forest
    {
        "file": "frontend/public/images/sanctuary_forest.jpg",
        "url": "https://images.unsplash.com/photo-1511497584788-87676104235f?auto=format&fit=crop&w=1600&q=85"
    },
    # King Cobra
    {
        "file": "frontend/public/images/king_cobra.jpg",
        "url": "https://images.unsplash.com/photo-1531386151447-fd76ad50012f?auto=format&fit=crop&w=1200&q=85"
    },
    # Olive Ridley / Turtle
    {
        "file": "frontend/public/images/freshwater_turtle.jpg",
        "url": "https://images.unsplash.com/photo-1437622368342-7a3d73a34c8f?auto=format&fit=crop&w=1200&q=85"
    }
]

headers = {'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'}

for item in images:
    path = item["file"]
    if os.path.exists(path) and os.path.getsize(path) > 10000:
        continue
    try:
        req = urllib.request.Request(item["url"], headers=headers)
        with urllib.request.urlopen(req, timeout=15) as resp, open(path, 'wb') as f:
            f.write(resp.read())
        print(f"Downloaded {path} ({os.path.getsize(path)} bytes)")
    except Exception as e:
        print(f"Failed {path}: {e}")

