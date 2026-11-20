import urllib.request
import os
import json

headers = {
    'User-Agent': 'NandankananWildlifePortal/1.0 (https://nandankanan.org; admin@nandankanan.org) Python-urllib'
}

videos = [
    {
        "id": "tiger_safari",
        "name": "Royal Bengal Tiger Safari",
        "url": "https://upload.wikimedia.org/wikipedia/commons/d/d0/Marvelous_sighting_of_tigers_in_the_afternoon_safari_at_Pilibhit_tiger_reserve.webm",
        "filename": "frontend/public/videos/tiger_safari.webm"
    },
    {
        "id": "tiger_hero",
        "name": "Bengal Tiger Slow Walk",
        "url": "https://upload.wikimedia.org/wikipedia/commons/6/6e/2023-08-18_ZOO_LJUBLJANA_-_Panthera_tigris_altaica.webm",
        "filename": "frontend/public/videos/tiger_hero.webm"
    },
    {
        "id": "tiger_hero2",
        "name": "Tiger Majestic Gaze",
        "url": "https://upload.wikimedia.org/wikipedia/commons/f/fb/2023-08-18_ZOO_LJUBLJANA_-_Panthera_tigris_altaica_2.webm",
        "filename": "frontend/public/videos/tiger_gaze.webm"
    },
    {
        "id": "lion_live",
        "name": "Asiatic Lion Sanctuary",
        "url": "https://upload.wikimedia.org/wikipedia/commons/5/5d/Lion_%28Panthera_leo%29.webm",
        "filename": "frontend/public/videos/lion_live.webm"
    },
    {
        "id": "elephant_live",
        "name": "Asian Elephant Habitat",
        "url": "https://upload.wikimedia.org/wikipedia/commons/a/a8/Elephant_shed%2C_Dharmasthala_%282025%29_01.webm",
        "filename": "frontend/public/videos/elephant_live.webm"
    },
    {
        "id": "deer_live",
        "name": "Spotted Deer Meadow",
        "url": "https://upload.wikimedia.org/wikipedia/commons/e/e2/Deer_-_%28Free_to_Use_HD_Stock_Video_Footage%29.webm",
        "filename": "frontend/public/videos/deer_live.webm"
    },
    {
        "id": "bear_live",
        "name": "Sloth Bear Rock Habitat",
        "url": "https://upload.wikimedia.org/wikipedia/commons/5/5a/Brown_Bear_%28Ursus_arctos%29.webm",
        "filename": "frontend/public/videos/bear_live.webm"
    },
    {
        "id": "birds_live",
        "name": "Indian Peafowl Aviary",
        "url": "https://upload.wikimedia.org/wikipedia/commons/0/05/Indian_peacock_%28Pavo_cristatus%29_displaying_for_peahen.webm",
        "filename": "frontend/public/videos/birds_live.webm"
    }
]

for v in videos:
    target = v["filename"]
    if os.path.exists(target) and os.path.getsize(target) > 50000:
        print(f"Skipping {target}, already downloaded ({os.path.getsize(target)} bytes)")
        continue
    print(f"Downloading {v['name']} -> {target}...")
    try:
        req = urllib.request.Request(v["url"], headers=headers)
        with urllib.request.urlopen(req, timeout=30) as resp, open(target, 'wb') as f:
            total = 0
            while True:
                chunk = resp.read(1024 * 1024)
                if not chunk:
                    break
                f.write(chunk)
                total += len(chunk)
                if total > 20 * 1024 * 1024:
                    print("  Capped at 20MB for fast loading")
                    break
            print(f"  Saved {target}: {total/(1024*1024):.2f} MB")
    except Exception as e:
        print(f"  Error on {v['name']}: {e}")

