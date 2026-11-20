import urllib.request
import os

headers = {'User-Agent': 'NandankananWildlife/1.0 (https://nandankanan.org; admin@nandankanan.org) Python-urllib'}

videos = [
    ("frontend/public/videos/tiger_walking_pacing.webm", "https://upload.wikimedia.org/wikipedia/commons/0/04/Siberian_tiger_%28Panthera_tigris_altaica%29_pacing_around.webm"),
    ("frontend/public/videos/tiger_walking_zoo.webm", "https://upload.wikimedia.org/wikipedia/commons/8/89/Walking_Tiger_in_Zoo.webm"),
    ("frontend/public/videos/tiger_walk_tigress.webm", "https://upload.wikimedia.org/wikipedia/commons/b/b2/A_walk_with_the_Tigress.webm")
]

for dest, url in videos:
    print(f"Downloading {dest}...")
    try:
        req = urllib.request.Request(url, headers=headers)
        with urllib.request.urlopen(req, timeout=30) as resp, open(dest, 'wb') as f:
            f.write(resp.read())
        print(f"Downloaded {dest}: {os.path.getsize(dest)} bytes")
    except Exception as e:
        print(f"Failed {dest}: {e}")

