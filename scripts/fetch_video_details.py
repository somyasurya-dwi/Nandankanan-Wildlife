import urllib.request
import re

url = 'https://www.pexels.com/video/29640886/'
req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'})
try:
    with urllib.request.urlopen(req, timeout=10) as r:
        html = r.read().decode('utf-8', errors='ignore')
        matches = list(set(re.findall(r'https://[^\s"\'<>]+\.mp4[^\s"\'<>]*', html)))
        print('Matches:', len(matches))
        for m in matches:
            print(m)
except Exception as e:
    print('Error:', e)

