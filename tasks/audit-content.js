(function () {
  const mb = document.querySelector(".mbody");
  if (!mb) return { error: "no .mbody" };
  const out = { hash: location.hash };
  const txt = mb.innerText || "";
  out.badTokens = ["[object Object]", "undefined", "NaN"].filter(t => txt.includes(t));

  const rgba = c => {
    const m = String(c).match(/rgba?\(([^)]+)\)/);
    if (!m) return null;
    const p = m[1].split(",").map(x => parseFloat(x));
    return { r: p[0], g: p[1], b: p[2], a: p.length > 3 ? p[3] : 1 };
  };
  const bgOf = el => {
    let n = el;
    while (n && n !== document.documentElement) {
      const c = rgba(getComputedStyle(n).backgroundColor);
      if (c && c.a > 0.05) return c;
      n = n.parentElement;
    }
    return { r: 255, g: 255, b: 255, a: 1 };
  };
  const lum = c => {
    const f = v => { v /= 255; return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4); };
    return 0.2126 * f(c.r) + 0.7152 * f(c.g) + 0.0722 * f(c.b);
  };
  const ratio = (a, b) => { const l1 = lum(a), l2 = lum(b); const hi = Math.max(l1, l2), lo = Math.min(l1, l2); return (hi + 0.05) / (lo + 0.05); };

  const sizes = {}, lowContrast = [], tooSmall = [];
  let ellipsis = 0, minSize = 99;
  mb.querySelectorAll("*").forEach(el => {
    if (el.children.length) return;
    const t = (el.textContent || "").trim();
    if (!t) return;
    const cs = getComputedStyle(el);
    if (cs.textOverflow === "ellipsis" && cs.overflow === "hidden") ellipsis++;
    const fs = parseFloat(cs.fontSize);
    const k = fs + "px/" + cs.fontWeight;
    sizes[k] = (sizes[k] || 0) + 1;
    if (fs < minSize) minSize = fs;
    // 装饰字符（箭头/圆点）不参与可读性判定
    if (/^[›·✓✗×←→\u2022]+$/.test(t)) return;
    if (fs < 12) tooSmall.push({ fs, txt: t.slice(0, 20), cls: (el.className || "").toString().slice(0, 30) });
    const fg = rgba(cs.color);
    if (!fg) return;
    const r = ratio(fg, bgOf(el));
    const big = fs >= 18.66 || (fs >= 14 && parseInt(cs.fontWeight) >= 700);
    const need = big ? 3 : 4.5;
    if (r < need - 0.05) lowContrast.push({ fs, weight: cs.fontWeight, ratio: +r.toFixed(2), need, txt: t.slice(0, 24), cls: (el.className || "").toString().slice(0, 30), color: cs.color });
  });
  out.minFontSize = minSize;
  out.typeScale = Object.entries(sizes).sort((a, b) => parseFloat(b[0]) - parseFloat(a[0])).map(([k, n]) => k + " ×" + n);
  out.ellipsisCount = ellipsis;
  out.tooSmall = tooSmall.slice(0, 6);
  out.lowContrast = lowContrast.slice(0, 6);
  out.lowContrastCount = lowContrast.length;

  /* 首屏焦点：第一屏里出现的区块顺序与最大字号 */
  const R = el => el.getBoundingClientRect();
  const mbR = R(mb);
  const firstScreen = [...mb.children].filter(el => R(el).top - mbR.top < mb.clientHeight);
  out.firstScreenBlocks = firstScreen.map(el => ({
    cls: (el.className || "").toString().slice(0, 34) || el.tagName,
    h: Math.round(R(el).height),
    maxFs: Math.max(0, ...[...el.querySelectorAll("*")].filter(x => !x.children.length && (x.textContent || "").trim())
      .map(x => parseFloat(getComputedStyle(x).fontSize)).concat([0])),
    text: (el.innerText || "").replace(/\s+/g, " ").slice(0, 54)
  }));
  out.focusRecs = mb.querySelectorAll(".focusrec").length;
  out.primaryBtnsFirstScreen = firstScreen.reduce((a, el) => a + el.querySelectorAll(".btn.p").length, 0);
  out.namedViews = mb.querySelectorAll(".segview button[aria-selected], .ptab").length;
  return out;
})()
