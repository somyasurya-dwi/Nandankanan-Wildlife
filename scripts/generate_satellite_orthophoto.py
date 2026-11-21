import math
import numpy as np
from PIL import Image, ImageDraw, ImageFilter

def generate_satellite_map():
    W, H = 1200, 560
    np.random.seed(42)

    # 1. Base Earth & Soil Texture with Multi-Scale Noise
    # Base terrain colors: rich deep forest soil, savanna grassland, and tropical green
    img_arr = np.zeros((H, W, 3), dtype=np.float32)

    # Coarse terrain variation (elevation & moisture zones)
    y_coords, x_coords = np.mgrid[0:H, 0:W]
    
    # Distance from center/ridge
    dist_ridge = np.sqrt(((x_coords - 700)/500)**2 + ((y_coords - 300)/300)**2)
    dist_stream = np.abs((y_coords - 450) + 0.3 * (x_coords - 200)) / 100.0

    # Layered Perlin-like noise using smoothed Gaussian/random grids
    noise1 = np.random.uniform(0.7, 1.3, (H // 20 + 1, W // 20 + 1))
    noise2 = np.random.uniform(0.85, 1.15, (H // 8 + 1, W // 8 + 1))
    
    from scipy.ndimage import zoom
    # We can use PIL resize for smoothing noise grids
    n1_img = Image.fromarray((noise1 * 100).astype(np.uint8)).resize((W, H), Image.Resampling.BICUBIC)
    n2_img = Image.fromarray((noise2 * 100).astype(np.uint8)).resize((W, H), Image.Resampling.BICUBIC)
    n1 = np.array(n1_img, dtype=np.float32) / 100.0
    n2 = np.array(n2_img, dtype=np.float32) / 100.0
    
    terrain_noise = n1 * 0.7 + n2 * 0.3

    # Base colors: Dark moss forest (#0B2E1B -> R:11, G:46, B:27), Savanna scrub (#283E1E -> R:40, G:62, B:30)
    base_r = 18 + 15 * terrain_noise + 10 * np.exp(-dist_ridge*1.2)
    base_g = 48 + 32 * terrain_noise + 12 * np.exp(-dist_ridge*0.8)
    base_b = 24 + 18 * terrain_noise

    img_arr[:, :, 0] = np.clip(base_r, 0, 255)
    img_arr[:, :, 1] = np.clip(base_g, 0, 255)
    img_arr[:, :, 2] = np.clip(base_b, 0, 255)

    base_pil = Image.fromarray(img_arr.astype(np.uint8)).convert('RGBA')
    draw = ImageDraw.Draw(base_pil)

    # 2. Draw Safari Earth Trails / Roads
    # Main safari trail: from (320, 380) curving to (840, 300)
    trail_points_1 = [
        (280, 410), (360, 380), (480, 350), (620, 330), (740, 310), (860, 305), (960, 315)
    ]
    # Branch trail up to Zone C: from (600, 130) down to (620, 330)
    trail_points_2 = [
        (600, 120), (590, 180), (610, 260), (620, 330)
    ]
    # Ridge trail in Zone A
    trail_points_3 = [
        (160, 440), (220, 420), (280, 410)
    ]

    for pts, w in [(trail_points_1, 24), (trail_points_2, 18), (trail_points_3, 16)]:
        # Outer soil shoulder (dusty ochre #4A4026)
        draw.line(pts, fill=(74, 64, 38, 180), width=w, joint='curve')
        # Center vehicle track (lighter dry sand #6A5B38)
        draw.line(pts, fill=(106, 91, 56, 210), width=w-6, joint='curve')
        # Inner ruts
        draw.line(pts, fill=(58, 48, 28, 140), width=w-12, joint='curve')

    # 3. Draw Water Stream in Zone A (winding natural forest stream)
    stream_pts = [
        (80, 430), (160, 420), (240, 415), (320, 430), (400, 485), (460, 520)
    ]
    # Sand / silt bed
    draw.line(stream_pts, fill=(88, 80, 52, 220), width=48, joint='curve')
    # Wet riparian banks
    draw.line(stream_pts, fill=(28, 55, 48, 220), width=38, joint='curve')
    # Water shallow edge (emerald turquoise #1B655C)
    draw.line(stream_pts, fill=(27, 101, 92, 240), width=28, joint='curve')
    # Deep water channel (rich deep azure/cerulean #0E4868)
    draw.line(stream_pts, fill=(14, 72, 104, 250), width=18, joint='curve')
    # Specular sun glints on water
    draw.line(stream_pts, fill=(56, 160, 190, 160), width=6, joint='curve')

    # Blur base trails & water smoothly into terrain
    base_pil = base_pil.filter(ImageFilter.GaussianBlur(radius=2))

    # 4. Dense Satellite Tree Canopy Clumps (Thousands of individual & clustered trees)
    tree_layer = Image.new('RGBA', (W, H), (0, 0, 0, 0))
    t_draw = ImageDraw.Draw(tree_layer)

    # Canopy clusters:
    # Cluster 1: Zone C (Thicket) at top center-left (x: 450-800, y: 50-240)
    # Cluster 2: Zone A dense forest around stream (x: 60-350, y: 260-500)
    # Cluster 3: Perimeter boundary forest all around
    # Scattered trees across Zone B (Savanna scrub)
    
    num_trees = 3800
    for _ in range(num_trees):
        # Choose position with realistic forest distribution
        r_type = np.random.rand()
        if r_type < 0.35:
            # Zone C dense thicket
            tx = np.random.normal(600, 150)
            ty = np.random.normal(120, 70)
        elif r_type < 0.65:
            # Zone A riparian forest
            tx = np.random.normal(240, 120)
            ty = np.random.normal(380, 90)
        elif r_type < 0.85:
            # Outer perimeter buffer
            edge = np.random.choice([0, 1, 2, 3])
            if edge == 0: # top
                tx, ty = np.random.uniform(0, W), np.random.uniform(0, 100)
            elif edge == 1: # bottom
                tx, ty = np.random.uniform(0, W), np.random.uniform(H-120, H)
            elif edge == 2: # left
                tx, ty = np.random.uniform(0, 150), np.random.uniform(0, H)
            else: # right
                tx, ty = np.random.uniform(W-180, W), np.random.uniform(0, H)
        else:
            # Scattered savanna trees in Zone B corridor
            tx = np.random.uniform(550, 1100)
            ty = np.random.uniform(180, 460)

        # Skip trees directly on the stream center
        if 80 <= tx <= 460 and abs(ty - (420 + 0.25*(tx-80))) < 18:
            continue

        radius = np.random.uniform(9, 26)
        # Tree color variation:
        # Dark forest canopy (#0D3D20), vibrant sal crown (#1A5928), olive teak (#2F5224), deep jungle (#092E16)
        c_choice = np.random.rand()
        if c_choice < 0.35:
            cr, cg, cb = np.random.randint(10, 22), np.random.randint(52, 75), np.random.randint(22, 38)
        elif c_choice < 0.70:
            cr, cg, cb = np.random.randint(22, 38), np.random.randint(70, 98), np.random.randint(28, 48)
        elif c_choice < 0.90:
            cr, cg, cb = np.random.randint(35, 55), np.random.randint(65, 88), np.random.randint(22, 40)
        else:
            cr, cg, cb = np.random.randint(14, 26), np.random.randint(42, 60), np.random.randint(18, 30)

        # Shadow cast to the south-east (sun from north-west)
        s_off_x = radius * 0.45
        s_off_y = radius * 0.45
        t_draw.ellipse(
            [tx - radius + s_off_x, ty - radius + s_off_y, tx + radius + s_off_x, ty + radius + s_off_y],
            fill=(4, 16, 8, 120)
        )
        # Main tree crown
        t_draw.ellipse(
            [tx - radius, ty - radius, tx + radius, ty + radius],
            fill=(cr, cg, cb, 235)
        )
        # Sunlit canopy highlight on north-west
        hl_r = radius * 0.55
        hl_x = tx - radius * 0.28
        hl_y = ty - radius * 0.28
        t_draw.ellipse(
            [hl_x - hl_r, hl_y - hl_r, hl_x + hl_r, hl_y + hl_r],
            fill=(min(255, cr + 28), min(255, cg + 34), min(255, cb + 18), 160)
        )

    # Composite tree layer over base terrain
    final_img = Image.alpha_composite(base_pil, tree_layer)

    # 5. Add Subtle Atmospheric Satellite Clarity & Fine Grid Scanlines
    scan_layer = Image.new('RGBA', (W, H), (0, 0, 0, 0))
    s_draw = ImageDraw.Draw(scan_layer)
    for y in range(0, H, 4):
        s_draw.line([(0, y), (W, y)], fill=(0, 0, 0, 18), width=1)
    
    final_img = Image.alpha_composite(final_img, scan_layer)
    final_rgb = final_img.convert('RGB')
    
    out_path = 'Nandankanan-Wildlife/frontend/public/images/enclosure_satellite_map.jpg'
    final_rgb.save(out_path, quality=94)
    print(f'Successfully generated satellite orthophoto: {out_path} ({W}x{H})')

if __name__ == '__main__':
    generate_satellite_map()
