import urllib.request
import re

url = 'https://www.pexels.com/search/videos/tiger%20walking/'
req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'})
try:
    with urllib.request.urlopen(req, timeout=10) as r:
        html = r.read().decode('utf-8', errors='ignore')
        matches = list(set(re.findall(r'https://(?:video-previews|player\.vimeo|assets)\.[^\s"\'<>]+\.mp4[^\s"\'<>]*', html)))
        print('Found mp4 links:', len(matches))
        for m in matches[:5]:
            print(m)
        if not matches:
            # check for video IDs or src
            srcs = re.findall(r'src="(https://[^\"]+)"', html)
            print('Found srcs:', [s for s in srcs if 'video' in s or 'mp4' in s][:5])
except Exception as e:
    print('Error:', e)

