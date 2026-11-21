import os, math
from PIL import Image

src_path = r'c:/Users/binib/OneDrive/Desktop/Nandankanan-Wildlife-main - Copy/frontend/public/images/nandankanan_zoo_3d.jpg'
out_dir = r'c:/Users/binib/OneDrive/Desktop/Nandankanan-Wildlife-main - Copy/frontend/public/dz'
dzi_path = os.path.join(out_dir, 'nandankanan_zoo_3d.dzi')
files_dir = os.path.join(out_dir, 'nandankanan_zoo_3d_files')
os.makedirs(files_dir, exist_ok=True)

img = Image.open(src_path).convert('RGB')
w_orig, h_orig = img.size
print(f'Source image: {w_orig}x{h_orig}')

tile_size = 256
overlap = 1
max_dim = max(w_orig, h_orig)
max_level = int(math.ceil(math.log2(max_dim)))
print(f'Max level: {max_level}')

# Write .dzi XML
dzi_xml = f'''<?xml version="1.0" encoding="UTF-8"?>
<Image xmlns="http://schemas.microsoft.com/deepzoom/2008"
  Format="jpg"
  Overlap="{overlap}"
  TileSize="{tile_size}">
  <Size Width="{w_orig}" Height="{h_orig}"/>
</Image>'''

with open(dzi_path, 'w', encoding='utf-8') as f:
    f.write(dzi_xml)
print(f'Wrote DZI to {dzi_path}')

# Generate levels
total_tiles = 0
for level in range(max_level + 1):
    scale = math.pow(0.5, max_level - level)
    cur_w = max(1, int(math.ceil(w_orig * scale)))
    cur_h = max(1, int(math.ceil(h_orig * scale)))
    
    level_dir = os.path.join(files_dir, str(level))
    os.makedirs(level_dir, exist_ok=True)
    
    # Resize image for current level
    if level == max_level:
        level_img = img
    else:
        level_img = img.resize((cur_w, cur_h), Image.Resampling.LANCZOS)
        
    cols = int(math.ceil(cur_w / tile_size))
    rows = int(math.ceil(cur_h / tile_size))
    
    for col in range(cols):
        for row in range(rows):
            x = col * tile_size
            y = row * tile_size
            
            x1 = max(0, x - overlap)
            y1 = max(0, y - overlap)
            x2 = min(cur_w, x + tile_size + overlap)
            y2 = min(cur_h, y + tile_size + overlap)
            
            tile = level_img.crop((x1, y1, x2, y2))
            tile_path = os.path.join(level_dir, f'{col}_{row}.jpg')
            tile.save(tile_path, 'JPEG', quality=90)
            total_tiles += 1

print(f'Successfully generated {total_tiles} DZI tiles across {max_level + 1} levels!')
