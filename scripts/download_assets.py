import urllib.request
import os

headers = {'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'}

video_targets = [
    {
        "filename": "frontend/public/videos/tiger_hero.webm",
        "url": "https://upload.wikimedia.org/wikipedia/commons/6/6e/2023-08-18_ZOO_LJUBLJANA_-_Panthera_tigris_altaica.webm"
    },
    {
        "filename": "frontend/public/videos/tiger_pilibhit.webm",
        "url": "https://upload.wikimedia.org/wikipedia/commons/d/d0/Marvelous_sighting_of_tigers_in_the_afternoon_safari_at_Pilibhit_tiger_reserve.webm"
    },
    {
        "filename": "frontend/public/videos/lion_live.webm",
        "url": "https://upload.wikimedia.org/wikipedia/commons/5/5d/Lion_%28Panthera_leo%29.webm"
    },
    {
        "filename": "frontend/public/videos/deer_live.webm",
        "url": "https://upload.wikimedia.org/wikipedia/commons/e/e2/Deer_-_%28Free_to_Use_HD_Stock_Video_Footage%29.webm"
    },
    {
        "filename": "frontend/public/videos/bear_live.webm",
        "url": "https://upload.wikimedia.org/wikipedia/commons/5/5a/Brown_Bear_%28Ursus_arctos%29.webm"
    },
    {
        "filename": "frontend/public/videos/birds_live.webm",
        "url": "https://upload.wikimedia.org/wikipedia/commons/0/05/Indian_peacock_%28Pavo_cristatus%29_displaying_for_peahen.webm"
    }
]

for item in video_targets:
    path = item["filename"]
    url = item["url"]
    print(f"Downloading {path} from {url}...")
    try:
        req = urllib.request.Request(url, headers=headers)
        with urllib.request.urlopen(req, timeout=30) as resp, open(path, 'wb') as f:
            total_bytes = 0
            while True:
                chunk = resp.read(1024 * 1024)
                if not chunk:
                    break
                f.write(chunk)
                total_bytes += len(chunk)
                # Cap individual video downloads if larger than 25MB to keep builds fast
                if total_bytes > 25 * 1024 * 1024:
                    print("  Capped at 25MB")
                    break
            print(f"  Done: {total_bytes / (1024*1024):.2f} MB")
    except Exception as e:
        print(f"  Failed: {e}")

