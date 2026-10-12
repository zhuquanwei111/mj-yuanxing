# ds2-work/gatecheck.py —— 四条硬门槛的机器核验
# 1) 文字预算：默认可见汉字（由 measure.mjs 逐状态量测）
# 2) 色板不共用：各方向色值集合两两交集（纯黑/白/灰豁免）
# 3) 结构差异：DOM（标签+类名）序列的词频余弦
# 4) 灰度/彩色身份：色值本身的灰度判定
import io, re, sys, json, math, glob, os

FILES = [
    ("d1 台账", "ds2-d1-台账.html"),
    ("d2 时刻", "ds2-d2-时刻.html"),
    ("d3 灯盘", "ds2-d3-灯盘.html"),
    ("d4 人阵", "ds2-d4-人阵.html"),
    ("d5 标图", "ds2-d5-标图.html"),
]

def read(p): return io.open(p, encoding="utf-8").read()

def colors(src):
    """取出所有十六进制色值（含 3/6 位、含 8 位 alpha 的前 6 位）"""
    out = set()
    for m in re.finditer(r"#([0-9a-fA-F]{3,8})\b", src):
        h = m.group(1)
        if len(h) == 3: h = "".join(c * 2 for c in h)
        if len(h) >= 6: out.add("#" + h[:6].lower())
    return out

def is_gray(h):
    r, g, b = (int(h[i:i + 2], 16) for i in (1, 3, 5))
    return max(r, g, b) - min(r, g, b) <= 8

def body_tokens(src):
    """标签+类名 token 序列（拿掉 script/style），做词频向量"""
    body = src.split("<body", 1)[-1]
    body = re.sub(r"<script[\s\S]*?</script>", " ", body)
    body = re.sub(r"<style[\s\S]*?</style>", " ", body)
    toks = []
    for m in re.finditer(r"<([a-zA-Z][a-zA-Z0-9]*)([^>]*)>", body):
        tag, attrs = m.group(1).lower(), m.group(2)
        cls = re.search(r'class="([^"]*)"', attrs)
        if cls:
            for c in cls.group(1).split():
                toks.append(tag + "." + c)
        else:
            toks.append(tag)
    return toks

def cosine(a, b):
    if not a or not b: return 0.0
    keys = set(a) | set(b)
    dot = sum(a.get(k, 0) * b.get(k, 0) for k in keys)
    na = math.sqrt(sum(v * v for v in a.values())); nb = math.sqrt(sum(v * v for v in b.values()))
    return dot / (na * nb) if na and nb else 0.0

def freq(toks):
    d = {}
    for t in toks: d[t] = d.get(t, 0) + 1
    return d

print("=" * 78)
print("① 色板")
info = {}
for name, f in FILES:
    src = read(f)
    cols = colors(src)
    chr_ = {c for c in cols if not is_gray(c)}
    gray = {c for c in cols if is_gray(c)}
    info[name] = (cols, chr_, gray)
    print(f"  {name}: 全部 {len(cols)} 色 ｜ 彩色 {len(chr_)} ｜ 灰阶 {len(gray)}")
    if not chr_:
        print("     → 零彩色方向（纯靠排版/字重/留白/线条）")

print("\n② 两两交集（共用色值必须为 0；纯黑/白/灰豁免）")
names = [n for n, _ in FILES]
worst_all = worst_chr = 0
for i in range(len(names)):
    for j in range(i + 1, len(names)):
        a, b = names[i], names[j]
        both = info[a][0] & info[b][0]
        chr_i = info[a][1] & info[b][1]
        print(f"  {a} × {b}: 全部共用 {len(both)} {sorted(both) if both else ''} ｜ 彩色共用 {len(chr_i)} {sorted(chr_i) if chr_i else ''}")
        worst_all = max(worst_all, len(both)); worst_chr = max(worst_chr, len(chr_i))
print(f"  → 最大共用：全部 {worst_all} 个，彩色 {worst_chr} 个")

print("\n③ 结构差异：DOM 词频余弦（1.000=同一份标记）")
toks = {}
for name, f in FILES:
    t = body_tokens(read(f)); toks[name] = t
    print(f"  {name}: {len(t)} 个 token，{len(set(t))} 种")
mx = 0
for i in range(len(names)):
    for j in range(i + 1, len(names)):
        c = cosine(freq(toks[names[i]]), freq(toks[names[j]]))
        mx = max(mx, c)
        print(f"  {names[i]} × {names[j]}: {c:.3f}")
print(f"  → 最高相似度 {mx:.3f}")

# 骨架并排页里的五个骨架也各算一次
src = read("ds2-wire.html")
print("\n③b 灰度骨架相互余弦（并排自检用）")
sk = {}
for n in ["w1", "w2", "w3", "w4", "w5"]:
    i = src.find('<div class="sk ' + n + '">')
    if i < 0: continue
    depth, j = 0, i
    while True:
        m = re.search(r"<div\b|</div>", src[j:])
        if not m: break
        j += m.end()
        depth += 1 if m.group(0).startswith("<div") else -1
        if depth == 0: break
    sk[n] = body_tokens(src[i:j])
    print(f"  {n}: {len(sk[n])} token")
for a in sk:
    for b in sk:
        if a < b: print(f"  {a} × {b}: {cosine(freq(sk[a]), freq(sk[b])):.3f}")

print("\n④ 交付物清单")
for f in sorted(glob.glob("ds2-*.html") + glob.glob("ds2-*.md") + glob.glob("ds2-*.json")):
    print(f"  {f}  {os.path.getsize(f)/1024:.1f} KB")
print(f"  ds2-shots/ 共 {len(glob.glob('ds2-shots/*.png'))} 张 PNG")
