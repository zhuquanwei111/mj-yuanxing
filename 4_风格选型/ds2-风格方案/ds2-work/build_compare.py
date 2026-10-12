# ds2-work/build_compare.py —— 生成 ds2-compare.html：第一行灰度骨架并排，第二行上色小样并排
# 做法：从 ds2-wire.html 里按标记抽出五个骨架的 CSS 片段与标记；五个上色小样整份文档内联进 srcdoc。
import io, re, html, os

WIRE = "ds2-wire.html"
COLORED = [("d1", "台账", "ds2-d1-台账.html", "账本横栏表 · 主角＝条目与数字 · 零彩色"),
           ("d2", "时刻", "ds2-d2-时刻.html", "共享时间坐标条带 · 主角＝时间 · 冷调印刷"),
           ("d3", "灯盘", "ds2-d3-灯盘.html", "按“谁动手”分泳道 · 主角＝AI 三态 · 深底"),
           ("d4", "人阵", "ds2-d4-人阵.html", "网格／热力阵列 · 主角＝人 · 珐琅色块"),
           ("d5", "标图", "ds2-d5-标图.html", "图上作业＋引线编号 · 主角＝风险位置 · 深蓝图")]

wire = io.open(WIRE, encoding="utf-8").read()
css_all = re.search(r"<style>([\s\S]*?)</style>", wire).group(1)
shared = css_all.split("/* ============ w1")[0]
segs = {}
parts = re.split(r"/\* =+ (w\d) [^*]*\*/", css_all)
for i in range(1, len(parts), 2):
    segs[parts[i]] = parts[i + 1]
# 抓骨架标记（含外层 div.skN）
markup = {}
for n in range(1, 6):
    tag = f'<div class="sk w{n}">'
    i = wire.find(tag)
    depth, j = 0, i
    while True:
        m = re.search(r"<div\b|</div>", wire[j:])
        if not m: break
        j += m.end()
        depth += 1 if m.group(0).startswith("<div") else -1
        if depth == 0: break
    markup[f"w{n}"] = wire[i:j]

def srcdoc(doc):
    return html.escape(doc, quote=True)

def skel_doc(n):
    return ("<!doctype html><html lang=\"zh-CN\"><head><meta charset=\"utf-8\">"
            "<style>" + shared + "\nbody{padding:0;background:#fff;overflow:hidden}" + segs[f"w{n}"] + "</style></head>"
            "<body>" + markup[f"w{n}"] + "</body></html>")

def scaled(doc, h, scale):
    return (f'<div class="win" style="width:{round(390*scale)}px;height:{round(h*scale)}px">'
            f'<iframe sandbox="allow-scripts allow-same-origin" title="小样" srcdoc="{srcdoc(doc)}" '
            f'style="width:390px;height:{h}px;transform:scale({scale});transform-origin:top left"></iframe></div>')

SKEL_H, SKEL_S = 1200, .60
APP_H, APP_S = 844, .60
cols1 = []
for i, (cid, cn, f, desk) in enumerate(COLORED, start=1):
    cols1.append(f'''<figure class="col">
      <figcaption><b>{cid} {cn}</b><span>{desk}</span>
        <a href="{f}">打开上色小样 →</a> · <a href="{WIRE}">看真实骨架尺寸</a></figcaption>
      {scaled(skel_doc(i), SKEL_H, SKEL_S)}
    </figure>''')

cols2 = []
for cid, cn, f, desk in COLORED:
    doc = io.open(f, encoding="utf-8").read()
    cols2.append(f'''<figure class="col">
      <figcaption><b>{cid} {cn}</b><span>{desk}</span>
        <a href="{f}">直接打开（可点通）→</a></figcaption>
      {scaled(doc, APP_H, APP_S)}
    </figure>''')

out = f'''<!doctype html>
<html lang="zh-CN"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>ds2 风格对比 · 明镜 P20</title>
<style>
  body{{margin:0;padding:22px 20px 60px;background:#ececec;color:#111;
    font:13px/1.6 "Microsoft YaHei","PingFang SC",sans-serif;min-width:1320px}}
  h1{{margin:0 0 4px;font-size:18px}}
  .tips{{margin:0 0 14px;color:#444;max-width:1320px}}
  .tips b{{color:#111}}
  h2{{margin:26px 0 10px;font-size:15px;border-top:2px solid #111;padding-top:10px;max-width:1320px}}
  h2 span{{font-weight:400;color:#555;font-size:12.5px}}
  .row{{display:flex;gap:18px;align-items:flex-start}}
  .col{{margin:0;width:234px}}
  figcaption{{padding-bottom:8px;border-bottom:1px solid #bbb;margin-bottom:8px}}
  figcaption b{{display:block;font-size:14px}}
  figcaption span{{display:block;color:#555;font-size:12px;line-height:1.45}}
  figcaption a{{color:#111;font-size:12px}}
  .win{{overflow:hidden;background:#fff;box-shadow:0 0 0 1px #b9b9b9}}
  .win iframe{{border:0;display:block;background:#fff}}
  .note{{color:#555;font-size:12px;max-width:1320px}}
</style></head>
<body>
  <h1>ds2 风格对比 · 明镜 P20「运营工作台 · 今天」</h1>
  <p class="tips">第一行是<b>灰度骨架</b>（阶段一自检：先看结构，不看颜色）；第二行是<b>上色小样</b>（每张都可点通：班次切换、待办/已处理、草稿三态、KPI 下钻、群发通知）。
  每列缩放到 60% 并排；判断中文排版与字号时请点开单张，在 390 宽下按实际尺寸看。</p>

  <h2>① 灰度骨架并排 <span>—— 五个方向的页面组织方式不同，不是同一个页面换五套配色</span></h2>
  <div class="row">
    {''.join(cols1)}
  </div>

  <h2>② 上色小样并排 <span>—— 同一份语义、同一套交互，五种色彩与材质身份</span></h2>
  <div class="row">
    {''.join(cols2)}
  </div>

  <p class="note">另有一个可切换手机／桌面视口、逐张看方向卡信息的查看器：<a href="ds2-viewer.html">ds2-viewer.html</a>。
  动效、200% 局部与 P13 延展的证据图在 ds2-shots/。</p>
</body></html>
'''
io.open("ds2-compare.html", "w", encoding="utf-8").write(out)
print("ds2-compare.html 已生成：", os.path.getsize("ds2-compare.html") / 1024, "KB")
