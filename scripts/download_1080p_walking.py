import urllib.request
import os

url = "https://upload.wikimedia.org/wikipedia/commons/c/c0/2017-10-01_AT_Wien_13_Hietzing%2C_Tiergarten_Sch%C3%B6nbrunn%2C_Panthera_tigris_altaica.webm"
headers = {'User-Agent': 'NandankananWildlife/1.0 (https://nandankanan.org; admin@nandankanan.org) Python-urllib'}
dest = "frontend/public/videos/tiger_walking_1080p.webm"

print(f"Downloading 1080p walking tiger video from {url}...")
try:
    req = urllib.request.Request(url, headers=headers)
    with urllib.request.urlopen(req, timeout=40) as resp, open(dest, 'wb') as f:
        f.write(resp.read())
    print(f"Saved {dest}: {os.path.getsize(dest)/(1024*1024):.2f} MB")
except Exception as e:
    print(f"Error: {e}")

