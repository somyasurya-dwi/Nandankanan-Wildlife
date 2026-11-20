import urllib.request
import json
import urllib.parse

def search_commons(query):
    url = f"https://commons.wikimedia.org/w/api.php?action=query&generator=search&gsrsearch={urllib.parse.quote(query)}&gsrnamespace=6&prop=imageinfo&iiprop=url|mime|size&format=json"
    req = urllib.request.Request(url, headers={'User-Agent': 'NandankananWildlife/1.0 (https://nandankanan.org; admin@nandankanan.org) Python-urllib'})
    try:
        with urllib.request.urlopen(req, timeout=10) as r:
            data = json.loads(r.read().decode('utf-8'))
            pages = data.get('query', {}).get('pages', {})
            results = []
            for page_id, page in pages.items():
                title = page.get('title')
                imageinfo = page.get('imageinfo', [{}])[0]
                mime = imageinfo.get('mime', '')
                file_url = imageinfo.get('url', '')
                if 'video' in mime or file_url.endswith(('.mp4', '.webm', '.ogv')):
                    results.append((title, mime, file_url))
            return results
    except Exception as e:
        print(f"Error: {e}")
        return []

queries = [
    "tiger walking video",
    "Bengal tiger walking",
    "Panthera tigris walk",
    "tiger in forest video",
    "tiger safari video"
]

for q in queries:
    res = search_commons(q)
    print(f"=== {q} ({len(res)} results) ===")
    for title, mime, u in res[:4]:
        print(f"  {title}: {u}")

