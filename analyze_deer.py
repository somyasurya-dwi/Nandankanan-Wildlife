import os
from PIL import Image
import numpy as np

scratch = r"C:\Users\Asus\.gemini\antigravity\brain\30ecb546-6622-4ed9-b3e4-275a6187ba1a\scratch\deer_frames"

for fn in sorted(os.listdir(scratch)):
    fp = os.path.join(scratch, fn)
    im = Image.open(fp)
    arr = np.array(im)
    print(f"\n=== {fn} ({im.size}) ===")
    print("Mean RGB:", arr.mean(axis=(0,1)).astype(int))
    # Green grass / foliage: G > R and G > B
    green_mask = (arr[:,:,1] > arr[:,:,0]) & (arr[:,:,1] > arr[:,:,2])
    print(f"Green grass/foliage: {np.mean(green_mask)*100:.1f}%")
    # Brown/deer coat: R > 110, G > 70, B < 65
    deer_mask = (arr[:,:,0] > 110) & (arr[:,:,1] > 60) & (arr[:,:,1] < 130) & (arr[:,:,2] < 70)
    print(f"Deer coat pixels: {np.mean(deer_mask)*100:.1f}%")
