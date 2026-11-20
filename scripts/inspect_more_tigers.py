import urllib.request
import json
import urllib.parse

titles = [
    "File:Siberian tiger (Panthera tigris altaica).webm",
    "File:2017-10-01 AT Wien 13 Hietzing, Tiergarten Schönbrunn, Panthera tigris altaica.webm",
    "File:2024-06-01 LJUBLJANA ZOO LJUBLJANA - Panthera tigris altaica 2.webm",
    "File:Malayan tiger (Panthera tigris jacksoni) in a zoo.webm",
    "File:Wuppertal - Zoo - Panthera tigris altaica 01 (0) ies.webm"
]

for t in titles:
    url = f"https://commons.wikimedia.org/w/api.php?action=query&titles={urllib.parse.quote(t)}&prop=imageinfo&iiprop=url|size|mime&format=json"
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

