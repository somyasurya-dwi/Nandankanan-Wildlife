import urllib.request
import json

def get_category_videos(cat):
    url = f"https://commons.wikimedia.org/w/api.php?action=query&list=categorymembers&cmtitle=Category:{urllib.parse.quote(cat)}&cmtype=file&cmlimit=50&format=json"
    req = urllib.request.Request(url, headers={'User-Agent': 'NandankananWildlife/1.0 (https://nandankanan.org; admin@nandankanan.org) Python-urllib'})
    try:
        with urllib.request.urlopen(req, timeout=10) as r:
            data = json.loads(r.read().decode('utf-8'))
            return [m['title'] for m in data.get('query', {}).get('categorymembers', [])]
    except Exception as e:
        print("Err:", e)
        return []

cats = ["Panthera_tigris_videos", "Videos_of_Panthera_tigris", "Tigers_in_art", "Videos_of_animals_walking"]
for c in cats:
    members = get_category_videos(c)
    print(f"Cat {c}: {len(members)} items")
    for m in members[:10]:
        print("  ", m)

