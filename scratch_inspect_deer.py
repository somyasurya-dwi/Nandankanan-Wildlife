import subprocess
import os

ffmpeg = r"C:\Users\Asus\Desktop\Nandankanan1\node_modules\ffmpeg-static\ffmpeg.exe"

v1 = r"C:\Users\Asus\.gemini\antigravity\brain\30ecb546-6622-4ed9-b3e4-275a6187ba1a\.user_uploaded\media_1795205886219_97c4d868.mp4"
v2 = r"C:\Users\Asus\.gemini\antigravity\brain\30ecb546-6622-4ed9-b3e4-275a6187ba1a\.user_uploaded\media_1795205886205_cdcf8b89.mp4"
v3 = r"C:\Users\Asus\.gemini\antigravity\brain\30ecb546-6622-4ed9-b3e4-275a6187ba1a\.user_uploaded\media_1795205886183_3fc64dd5.mp4"

for name, path in [("deer_v1", v1), ("deer_v2", v2), ("deer_v3", v3)]:
    print(f"\n=== {name}: {os.path.basename(path)} ===")
    print("Size:", os.path.getsize(path))
    cmd = [ffmpeg, "-i", path]
    res = subprocess.run(cmd, stderr=subprocess.PIPE, text=True)
    for line in res.stderr.split('\n'):
        if 'Duration:' in line or 'Stream #0:0' in line:
            print(" ", line.strip())
