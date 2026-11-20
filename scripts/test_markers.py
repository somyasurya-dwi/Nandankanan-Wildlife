import urllib.request
import json

url = 'http://localhost:8000/api/markers/'
req = urllib.request.Request(url)
with urllib.request.urlopen(req, timeout=5) as r:
    data = json.loads(r.read().decode('utf-8'))
    print(f"Total markers from API: {len(data)}")
    for m in data[:6]:
        print(f"  {m['title']}: {m['latitude']}, {m['longitude']} | photo: {m.get('photo_url')} | emoji: {m.get('emoji')}")

