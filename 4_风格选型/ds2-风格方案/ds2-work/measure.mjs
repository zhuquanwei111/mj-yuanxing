// ds2-work/measure.mjs —— 在真实浏览器里量测页面：文字预算、溢出、命中区、字号。
// 用法：node measure.mjs <文件.html> [--state app|p13|forms] [--width 390] [--height 844] [--zoom 1]
// 输出 JSON：{ file, state, cjk, longText:[], overflow:[], smallCjk:[], hit:[], size }
import { spawn, spawnSync } from "node:child_process";
import { existsSync, mkdtempSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";
import { createServer } from "node:http";
import { readFileSync } from "node:fs";

const args = process.argv.slice(2);
const file = args[0];
const opt = (name, dflt) => { const i = args.indexOf("--" + name); return i >= 0 ? args[i + 1] : dflt; };
const state = opt("state", "app");
const W = +opt("width", 390), H = +opt("height", 844), ZOOM = +opt("zoom", 1);

function findChrome() {
  const env = process.env.CHROME_PATH;
  if (env && existsSync(env)) return env;
  const cands = [
    `${process.env["LOCALAPPDATA"]}\\Google\\Chrome\\Application\\chrome.exe`,
    `${process.env["PROGRAMFILES"]}\\Google\\Chrome\\Application\\chrome.exe`,
    `${process.env["PROGRAMFILES(X86)"]}\\Microsoft\\Edge\\Application\\msedge.exe`,
  ];
  for (const c of cands) if (c && existsSync(c)) return c;
  throw new Error("找不到浏览器，设 CHROME_PATH");
}

const root = resolve(file, "..");
const server = createServer((req, res) => {
  try {
    const p = decodeURIComponent(req.url.split("?")[0]);
    const body = readFileSync(join(root, p));
    const ext = p.split(".").pop().toLowerCase();
    const type = ext === "html" ? "text/html" : ext === "css" ? "text/css" : ext === "js" ? "text/javascript" : "application/octet-stream";
    res.writeHead(200, { "content-type": type + "; charset=utf-8" }).end(body);
  } catch { res.writeHead(404).end(); }
});
await new Promise((ok) => server.listen(0, "127.0.0.1", ok));
const url = `http://127.0.0.1:${server.address().port}/${encodeURIComponent(file.split(/[\\/]/).pop())}?state=${state}`;

const profile = mkdtempSync(join(tmpdir(), "ds2-measure-"));
const chrome = spawn(findChrome(), [
  "--headless=new", "--enable-unsafe-swiftshader", "--remote-debugging-port=0", `--user-data-dir=${profile}`,
  "--no-first-run", "--no-default-browser-check", "--hide-scrollbars", "--mute-audio", "--disable-extensions", "about:blank",
], { stdio: ["ignore", "ignore", "pipe"] });

const wsUrl = await new Promise((ok, no) => {
  let buf = "";
  const t = setTimeout(() => no(new Error("浏览器没起来")), 20000);
  chrome.stderr.on("data", (d) => { buf += d; const m = buf.match(/DevTools listening on (ws:\/\/\S+)/); if (m) { clearTimeout(t); ok(m[1]); } });
});
const ws = new WebSocket(wsUrl);
await new Promise((ok, no) => { ws.onopen = ok; ws.onerror = () => no(new Error("ws 连不上")); });
let seq = 0; const pending = new Map();
ws.onmessage = (e) => { const m = JSON.parse(e.data); if (m.id && pending.has(m.id)) { const p = pending.get(m.id); pending.delete(m.id); m.error ? p.no(new Error(m.error.message)) : p.ok(m.result); } };
const send = (method, params = {}, sessionId) => new Promise((ok, no) => { const id = ++seq; pending.set(id, { ok, no }); ws.send(JSON.stringify({ id, method, params, sessionId })); });

const { targetId } = await send("Target.createTarget", { url: "about:blank" });
const { sessionId } = await send("Target.attachToTarget", { targetId, flatten: true });
await send("Emulation.setDeviceMetricsOverride", { width: W, height: H, deviceScaleFactor: ZOOM, mobile: true }, sessionId);
await send("Page.enable", {}, sessionId);
await send("Page.navigate", { url }, sessionId);
await new Promise((r) => setTimeout(r, 1200));

// ---- --steps：先做几步操作，再量测（验证交互后的真实状态）
const stepsArg = opt("steps", "");
if (stepsArg) {
  for (const raw of stepsArg.split(";")) {
    const st = raw.trim(); if (!st) continue;
    const sp = st.indexOf(" ");
    const cmd = sp < 0 ? st : st.slice(0, sp); let rest = sp < 0 ? "" : st.slice(sp + 1).trim();
    rest = rest.replace(/^[\"']|[\"']$/g, "");
    if (cmd === "click") {
      const ok = await send("Runtime.evaluate", { expression: `(()=>{const el=document.querySelector(${JSON.stringify(rest)}); if(!el) return 'MISS'; el.click(); return 'OK';})()`, returnByValue: true }, sessionId);
      if (ok.result.value !== "OK") console.log("STEP MISS click " + rest);
    } else if (cmd === "type") {
      const sp2 = rest.indexOf(" "), sel = rest.slice(0, sp2), text = rest.slice(sp2 + 1);
      await send("Runtime.evaluate", { expression: `(()=>{const el=document.querySelector(${JSON.stringify(sel)}); el.value=${JSON.stringify(text)}; el.dispatchEvent(new Event('input',{bubbles:true})); return 'OK';})()`, returnByValue: true }, sessionId);
    } else if (cmd === "wait") {
      await new Promise((r) => setTimeout(r, +rest || 200));
    }
  }
  await new Promise((r) => setTimeout(r, 250));
}

const expr = `(() => {
  const CJK = /[\\u3400-\\u4dbf\\u4e00-\\u9fff\\uf900-\\ufaff]/g;
  const cnt = (s) => (s.match(CJK) || []).length;
  const vis = (el) => {
    for (let n = el; n && n.nodeType === 1; n = n.parentElement) {
      const cs = getComputedStyle(n);
      if (cs.display === 'none' || cs.visibility === 'hidden' || +cs.opacity === 0) return false;
      if (n.hasAttribute && n.hasAttribute('hidden')) return false;
    }
    return true;
  };
  const path = (el) => {
    const bits = [];
    for (let n = el; n && n.nodeType === 1 && bits.length < 4; n = n.parentElement) {
      let s = n.tagName.toLowerCase();
      if (n.id) s += '#' + n.id;
      else if (n.className && typeof n.className === 'string') s += '.' + n.className.trim().split(/\\s+/).slice(0, 2).join('.');
      bits.unshift(s);
    }
    return bits.join('>');
  };
  let cjk = 0; const longText = []; const smallCjk = [];
  const walk = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
  let node;
  while ((node = walk.nextNode())) {
    const t = (node.textContent || '').replace(/\\s+/g, ' ').trim();
    if (!t) continue;
    const p = node.parentElement;
    if (!p || ['SCRIPT','STYLE','NOSCRIPT','TEMPLATE'].includes(p.tagName)) continue;
    if (!vis(p)) continue;
    const n = cnt(t);
    if (!n) continue;
    cjk += n;
    if (n > 24) longText.push({ n, t: t.slice(0, 44), at: path(p) });
    const fs = parseFloat(getComputedStyle(p).fontSize);
    if (fs < 12) smallCjk.push({ fs, n, t: t.slice(0, 22), at: path(p) });
  }
  const overflow = [];
  document.querySelectorAll('*').forEach((el) => {
    if (!vis(el)) return;
    if (el.scrollWidth > el.clientWidth + 1 && el.clientWidth > 0) {
      const cs = getComputedStyle(el);
      if (cs.overflowX === 'hidden' || cs.overflowX === 'clip' || cs.overflow === 'hidden') {
        overflow.push({ kind: 'clipped', w: el.clientWidth, sw: el.scrollWidth, at: path(el) });
      }
    }
    const r = el.getBoundingClientRect();
    if (r.width && (r.right > window.innerWidth + 1 || r.left < -1)) overflow.push({ kind: 'outside', l: Math.round(r.left), r: Math.round(r.right), at: path(el) });
  });
  const hit = [];
  document.querySelectorAll('button,a,[role=button],input,label').forEach((el) => {
    if (!vis(el)) return;
    const r = el.getBoundingClientRect();
    if (r.width === 0 || r.height === 0) return;
    if (r.height < 40 || r.width < 24) hit.push({ w: Math.round(r.width), h: Math.round(r.height), t: (el.textContent || '').trim().slice(0, 12), at: path(el) });
  });
  return {
    cjk, longText, overflow: overflow.slice(0, 30), smallCjk: smallCjk.slice(0, 30), hit: hit.slice(0, 30),
    doc: { w: document.documentElement.scrollWidth, h: document.documentElement.scrollHeight, vw: window.innerWidth },
  };
})()`;

const { result } = await send("Runtime.evaluate", { expression: expr, returnByValue: true }, sessionId);
console.log(JSON.stringify({ file, state, viewport: `${W}x${H}`, zoom: ZOOM, ...result.value }, null, 1));

// ---- --rects：把关键元素的位置尺寸打成表，代替肉眼看版面
const ev = opt("eval", "");
if (ev) {
  const r = await send("Runtime.evaluate", { expression: ev, returnByValue: true }, sessionId);
  console.log("EVAL " + JSON.stringify(r.result && r.result.value) + (r.exceptionDetails ? " EXC " + JSON.stringify(r.exceptionDetails.text) : ""));
}
const rectSel = opt("rects", "");
if (rectSel) {
  const list = rectSel.split(";");
  const expr1b = `(()=>{const s=document.getElementById("sheetKpi");const b=document.getElementById("kpiBody");return {hidden:s.hidden,cls:s.className,tr:getComputedStyle(s).transform,kv:b.children.length,txt:b.textContent.slice(0,80)};})()`;
 const rb = await send("Runtime.evaluate",{expression:expr1b,returnByValue:true},sessionId);
 console.log("PROBE "+JSON.stringify(rb.result.value));
 const expr2 = `(() => { const sels = ${JSON.stringify(list)}; const out = [];
    for (const s of sels) { document.querySelectorAll(s).forEach((el) => { const r = el.getBoundingClientRect();
      out.push({ sel: s, x: Math.round(r.x), y: Math.round(r.y), w: Math.round(r.width), h: Math.round(r.height),
        t: (el.textContent || "").replace(/\s+/g, " ").trim().slice(0, 30) }); }); }
    return out; })()`;
  const r2 = await send("Runtime.evaluate", { expression: expr2, returnByValue: true }, sessionId);
  console.log("RECTS " + JSON.stringify(r2.result.value, null, 0));
}

try { chrome.kill(); } catch {}
try { server.close(); } catch {}
setTimeout(() => { try { rmSync(profile, { recursive: true, force: true }); } catch {} process.exit(0); }, 300);
