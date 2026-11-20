import urllib.request
import json
import urllib.parse

titles = [
    "File:A walk with the Tigress.webm",
    "File:Walking Tiger in Zoo.webm",
    "File:Siberian tiger (Panthera tigris altaica) pacing around.webm",
    "File:2024-06-01 LJUBLJANA ZOO LJUBLJANA - Panthera tigris altaica.webm",
    "File:Marvelous sighting of tigers in the afternoon safari at Pilibhit tiger reserve.webm"
]

for t in titles:
    url = f"https://commons.wikimedia.org/w/api.php?action=query&titles={urllib.parse.quote(t)}&prop=imageinfo&iiprop=url|size|mime|extmetadata&format=json"
    req = urllib.request.Request(url, headers={'User-Agent': 'NandankananWildlife/1.0 (https://nandankanan.org; admin@nandankanan.org) Python-urllib'})
    try:
        with urllib.request.urlopen(req, timeout=10) as r:
            data = json.loads(r.read().decode('utf-8'))
            page = list(data.get('query', {}).get('pages', {}).values())[0]
            info = page.get('imageinfo', [{}])[0]
            print(f"=== {t} ===")
            print(f"  URL: {info.get('url')}")
            print(f"  Size: {info.get('size')} bytes, {info.get('width')}x{info.get('height')}")
    except Exception as e:
        print(f"Error for {t}: {e}")

