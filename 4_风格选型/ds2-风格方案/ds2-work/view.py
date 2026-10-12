# ds2-work/view.py —— 把截图变成可读证据：调色板 ASCII 图 + 明度块面签名 + 色彩统计。
# 用法：python view.py <png> [--cols 78] [--palette "#c6402a=R,#17212b=K"] [--blocks 12] [--crop y0,y1]
import sys, argparse
import numpy as np
from PIL import Image

ap = argparse.ArgumentParser()
ap.add_argument("png")
ap.add_argument("--cols", type=int, default=78)
ap.add_argument("--palette", default="")
ap.add_argument("--blocks", type=int, default=0)
ap.add_argument("--crop", default="")
a = ap.parse_args()

im = Image.open(a.png).convert("RGB")
if a.crop:
    y0, y1 = [int(v) for v in a.crop.split(",")]
    im = im.crop((0, y0, im.size[0], min(im.size[1], y1)))
arr = np.asarray(im).astype(np.int16)
H, W, _ = arr.shape

pal = []
for part in [p for p in a.palette.split(",") if p.strip()]:
    hexv, ch = part.split("=")
    h = hexv.strip().lstrip("#")
    pal.append((np.array([int(h[i:i + 2], 16) for i in (0, 2, 4)]), ch.strip()))

cols = a.cols
rows = max(1, int(round(cols * H / W / 2)))
ys = (np.arange(rows) * H / rows).astype(int)
xs = (np.arange(cols) * W / cols).astype(int)
# 每个单元格取 3x3 邻域均值
cells = np.zeros((rows, cols, 3))
for dy in range(3):
    for dx in range(3):
        yy = np.clip(ys + dy - 1, 0, H - 1)[:, None]
        xx = np.clip(xs + dx - 1, 0, W - 1)[None, :]
        cells += arr[yy, xx]
cells /= 9

chars = []
for r in range(rows):
    line = []
    for c in range(cols):
        px = cells[r, c]
        mx, mn = int(px.max()), int(px.min())
        lum = int(px[0] * .299 + px[1] * .587 + px[2] * .114)
        ch = None
        if pal:
            best, bd = None, 1e18
            for col, chx in pal:
                d = float(((px - col) ** 2).sum())
                if d < bd: bd, best = d, chx
            if bd < 4200: ch = best
        if ch is None:
            if mx - mn < 16:
                ch = "@" if lum < 52 else "8" if lum < 100 else "o" if lum < 155 else ":" if lum < 205 else "." if lum < 245 else " "
            else:
                ch = "?"
        line.append(ch)
    chars.append("".join(line))
print(f"# {a.png}  {W}x{H} → {cols}x{rows}")
print("\n".join(chars))

# 统计
flat = arr.reshape(-1, 3)
sat = flat.max(1) - flat.min(1)
print(f"\n# 彩色像素占比（max-min>24）= {(sat > 24).mean() * 100:.2f}%    像素 {len(flat)}")
for col, chx in pal:
    d = ((flat - col) ** 2).sum(1)
    n = (d < 900).sum()
    print(f"   调色板 {chx} #{'%02x%02x%02x' % tuple(col)} 命中像素 {n:>7}  占比 {n / len(flat) * 100:5.2f}%")

if a.blocks:
    nb = a.blocks
    print(f"\n# 明度块面签名 {nb}x{nb * 2}（0 最暗 9 最亮）")
    for by in range(nb * 2):
        line = []
        for bx in range(nb):
            blk = arr[int(by * H / (nb * 2)):int((by + 1) * H / (nb * 2)), int(bx * W / nb):int((bx + 1) * W / nb)]
            lum = (blk[..., 0] * .299 + blk[..., 1] * .587 + blk[..., 2] * .114).mean()
            line.append(str(min(9, int(lum * 10 // 256))))
        print("".join(line))
