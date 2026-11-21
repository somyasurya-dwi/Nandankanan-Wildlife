import subprocess
import os

ffmpeg = r"C:\Users\Asus\Desktop\Nandankanan1\node_modules\ffmpeg-static\ffmpeg.exe"
scratch = r"C:\Users\Asus\.gemini\antigravity\brain\30ecb546-6622-4ed9-b3e4-275a6187ba1a\scratch\deer_frames"
os.makedirs(scratch, exist_ok=True)

v1 = r"C:\Users\Asus\.gemini\antigravity\brain\30ecb546-6622-4ed9-b3e4-275a6187ba1a\.user_uploaded\media_1795205886219_97c4d868.mp4"
v2 = r"C:\Users\Asus\.gemini\antigravity\brain\30ecb546-6622-4ed9-b3e4-275a6187ba1a\.user_uploaded\media_1795205886205_cdcf8b89.mp4"
v3 = r"C:\Users\Asus\.gemini\antigravity\brain\30ecb546-6622-4ed9-b3e4-275a6187ba1a\.user_uploaded\media_1795205886183_3fc64dd5.mp4"

for name, path in [("cam1_14109", v1), ("cam2_14219", v2), ("cam3_14310", v3)]:
    out = os.path.join(scratch, f"{name}_contact.jpg")
    cmd = [
        ffmpeg, "-y",
        "-i", path,
        "-vf", "select='not(mod(n\\,15))',scale=160:280,tile=3x3",
        "-frames:v", "1",
        out
    ]
    subprocess.run(cmd, stdout=subprocess.PIPE, stderr=subprocess.PIPE)
    print("Generated", out)
