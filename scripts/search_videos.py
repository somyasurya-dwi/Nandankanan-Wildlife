import urllib.request
import json

def search_commons(query):
    url = f"https://commons.wikimedia.org/w/api.php?action=query&generator=search&gsrsearch={urllib.parse.quote(query)}&gsrnamespace=6&prop=imageinfo&iiprop=url|mime|size&format=json"
    req = urllib.request.Request(url, headers={'User-Agent': 'NandankananApp/1.0 (edu; wildlife)'})
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
        print(f"Error searching {query}: {e}")
        return []

animals = ["Panthera tigris video", "tiger video", "lion Panthera leo video", "elephant Elephas maximus video", "deer video", "bear Ursus video", "peacock Pavo cristatus video"]
for a in animals:
    res = search_commons(a)
    print(f"=== Results for {a} ===")
    for title, mime, u in res[:3]:
        print(f"  {title} ({mime}): {u}")

