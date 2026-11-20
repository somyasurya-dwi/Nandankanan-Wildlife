import urllib.request
import os

candidates = [
    # Mixkit & Pexels direct clips
    ("tiger_hero", "https://assets.mixkit.co/videos/42617/42617-720.mp4"),
    ("tiger_walking", "https://assets.mixkit.co/videos/preview/mixkit-tiger-in-the-forest-walking-slowly-42617-large.mp4"),
    ("lion", "https://assets.mixkit.co/videos/preview/mixkit-lion-resting-in-the-middle-of-the-savanna-43093-large.mp4"),
    ("elephant", "https://assets.mixkit.co/videos/preview/mixkit-elephant-walking-in-a-field-42994-large.mp4"),
    ("deer", "https://assets.mixkit.co/videos/preview/mixkit-fallow-deer-buck-in-the-woods-42921-large.mp4"),
    ("bear", "https://assets.mixkit.co/videos/preview/mixkit-brown-bear-walking-through-the-forest-43075-large.mp4"),
    ("birds", "https://assets.mixkit.co/videos/preview/mixkit-flock-of-birds-flying-over-a-lake-at-sunset-42958-large.mp4"),
]

for name, url in candidates:
    req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
    try:
        with urllib.request.urlopen(req, timeout=8) as resp:
            content_length = resp.headers.get("content-length")
            print(f"{name}: status={resp.status}, size={content_length}")
    except Exception as e:
        print(f"{name}: failed -> {e}")

