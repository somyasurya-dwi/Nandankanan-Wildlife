import urllib.request
import json
import urllib.parse

# Query Overpass API for Nandankanan features
overpass_url = "https://overpass-api.de/api/interpreter"
query = """
[out:json][timeout:15];
(
  node["tourism"="zoo"](20.38,85.80,20.42,85.84);
  way["tourism"="zoo"](20.38,85.80,20.42,85.84);
  node["zoo"](20.38,85.80,20.42,85.84);
  way["zoo"](20.38,85.80,20.42,85.84);
  node["leisure"="nature_reserve"](20.38,85.80,20.42,85.84);
  node["water"="lake"](20.38,85.80,20.42,85.84);
  way["natural"="water"](20.38,85.80,20.42,85.84);
);
out center;
"""

try:
    data = urllib.parse.urlencode({'data': query}).encode('utf-8')
    req = urllib.request.Request(overpass_url, data=data, headers={'User-Agent': 'NandankananPortal/1.0'})
    with urllib.request.urlopen(req, timeout=12) as r:
        res = json.loads(r.read().decode('utf-8'))
        elements = res.get('elements', [])
        print(f"Found {len(elements)} elements in Nandankanan area:")
        for el in elements[:15]:
            lat = el.get('lat') or el.get('center', {}).get('lat')
            lon = el.get('lon') or el.get('center', {}).get('lon')
            tags = el.get('tags', {})
            name = tags.get('name', tags.get('zoo', tags.get('tourism', 'unknown')))
            print(f"  {name}: {lat}, {lon} (tags: {tags})")
except Exception as e:
    print(f"Overpass query error: {e}")

