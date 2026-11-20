import urllib.request

headers = {'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'}

remaining = [
    ("frontend/public/images/sloth_bear.jpg", "https://images.unsplash.com/photo-1589656966895-2f33e7653819?auto=format&fit=crop&w=1200&q=80"),
    ("frontend/public/images/pangolin.jpg", "https://images.unsplash.com/photo-1548767797-d8c844163c4c?auto=format&fit=crop&w=1200&q=80"),
    ("frontend/public/images/sanctuary_forest.jpg", "https://images.unsplash.com/photo-1542273917363-3b1817f69a2d?auto=format&fit=crop&w=1600&q=80")
]

for path, url in remaining:
    try:
        req = urllib.request.Request(url, headers=headers)
        with urllib.request.urlopen(req, timeout=15) as resp, open(path, 'wb') as f:
            f.write(resp.read())
        print("Success:", path)
    except Exception as e:
        print("Error:", path, e)
