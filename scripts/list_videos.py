import os

for fname in os.listdir("frontend/public/videos"):
    path = os.path.join("frontend/public/videos", fname)
    print(f"{fname}: {os.path.getsize(path)/(1024*1024):.2f} MB")

