// CDP 工具：诊断 + 截图（Node 24 内置 WebSocket，零依赖）
// 用法：
//   node cdp.mjs diag  <html路径> [query]         —— 输出视口/溢出/Alpine 状态诊断
//   node cdp.mjs shot  <html路径> <out.png> [宽] [高] [dsf] [query] [steps] [waitms]
// steps 语法: "click .sel; wait 300; click .sel2"
import { spawn } from 'node:child_process';
import { existsSync, mkdirSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';

const EDGE = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const PORT = 9337;
const [, , cmd, htmlPath, outPath, wArg, hArg, dsfArg, query, steps, waitArg] = process.argv;

const sleep = ms => new Promise(r => setTimeout(r, ms));
function fileUri(p) { return resolve(p).replace(/\\/g, '/').replace(/^([A-Za-z]:)/, 'file:///$1'); }

async function ensureEdge() {
  try { const r = await fetch(`http://127.0.0.1:${PORT}/json/version`); if (r.ok) return; } catch {}
  const prof = join(tmpdir(), 'glm-cdp-prof');
  mkdirSync(prof, { recursive: true });
  const cmdline = `"${EDGE}" --headless=new --remote-debugging-port=${PORT} --user-data-dir="${prof}" --no-first-run --disable-gpu --hide-scrollbars --mute-audio about:blank`;
  spawn('cmd.exe', ['/c', cmdline], { stdio: 'ignore', detached: true }).unref();
  const t0 = Date.now();
  while (Date.now() - t0 < 20000) {
    try { const r = await fetch(`http://127.0.0.1:${PORT}/json/version`); if (r.ok) return; } catch {}
    await sleep(300);
  }
  throw new Error('Edge CDP 20 秒内没有就绪');
}

await ensureEdge();
const created = await (await fetch(`http://127.0.0.1:${PORT}/json/new?url=about:blank`, { method: 'PUT' })).json();
const ws = new WebSocket(created.webSocketDebuggerUrl);
await new Promise((res, rej) => { ws.onopen = res; ws.onerror = e => rej(new Error('ws error')); });

let msgId = 0; const pending = new Map(); const loadFired = { v: false };
ws.onmessage = ev => {
  const m = JSON.parse(ev.data);
  if (m.id && pending.has(m.id)) { pending.get(m.id)(m); pending.delete(m.id); }
  else if (m.method === 'Page.loadEventFired') loadFired.v = true;
};
const send = (method, params = {}) => new Promise((res, rej) => {
  const id = ++msgId; pending.set(id, r => r.error ? rej(new Error(r.error.message)) : res(r.result));
  ws.send(JSON.stringify({ id, method, params }));
});
const evalIn = async (expr) => {
  const r = await send('Runtime.evaluate', { expression: expr, returnByValue: true, awaitPromise: true });
  if (r.exceptionDetails) throw new Error('eval: ' + (r.exceptionDetails.exception?.description || r.exceptionDetails.text));
  return r.result?.value;
};

await send('Page.enable'); await send('Runtime.enable');

let url = fileUri(htmlPath);
if (query) url += '?' + query;
const W = Number(wArg || 390), H = Number(hArg || 844), DSF = Number(dsfArg || 1);
await send('Emulation.setDeviceMetricsOverride', { width: W, height: H, deviceScaleFactor: DSF, mobile: W < 520 });
loadFired.v = false;
await send('Page.navigate', { url });
const t0 = Date.now();
while (!loadFired.v && Date.now() - t0 < 10000) await sleep(80);
await sleep(Number(waitArg || 900));

// 逐步执行交互
const errors = [];
for (const raw of (steps ? steps.split(';') : [])) {
  const s = raw.trim(); if (!s) continue;
  const m = s.match(/^(\w+)\s*(.*)$/);
  if (!m) continue;
  const [, c, rest] = m;
  try {
    if (c === 'wait') { await sleep(Number(rest)); continue; }
    if (c === 'scroll') { await evalIn(`window.scrollBy(0,${Number(rest) || 400})`); await sleep(250); continue; }
    if (c === 'click') {
      const ok = await evalIn(`(()=>{const el=document.querySelector(${JSON.stringify(rest.trim())});if(!el)return 'NOTFOUND';el.scrollIntoView({block:'center'});el.click();return 'OK';})()`);
      if (ok === 'NOTFOUND') errors.push('click 未找到: ' + rest.trim());
      await sleep(450); continue;
    }
    if (c === 'type') {
      const m2 = rest.match(/^(\S+)\s*([\s\S]*)$/);
      await evalIn(`(()=>{const el=document.querySelector(${JSON.stringify(m2[1])});el.focus();el.value=${JSON.stringify(m2[2] || '')};el.dispatchEvent(new Event('input',{bubbles:true}));})()`);
      await sleep(250); continue;
    }
  } catch (e) { errors.push(c + ': ' + e.message); }
}
await sleep(200);

if (cmd === 'diag') {
  const out = await evalIn(`(()=>{const d=document.documentElement,vw=d.clientWidth,sw=d.scrollWidth;
    const bad=[];document.querySelectorAll('body *').forEach(el=>{const r=el.getBoundingClientRect();
      if(r.width>0&&r.right>vw+1)bad.push(el.tagName+'.'+String(el.className).split(' ')[0]+' r='+Math.round(r.right));});
    const overflowY=document.querySelector('.flow')?document.querySelector('.flow').scrollHeight:0;
    return JSON.stringify({vw,sw,bad:bad.slice(0,10),flowH:overflowY,
      alpine:!!window.Alpine, appH:document.querySelector('.app')?.scrollHeight});})()`);
  console.log('DIAG ' + out);
} else if (cmd === 'shot') {
  if (process.argv.includes('full')) {
    const dim = await evalIn(`(()=>{const el=document.querySelector('.app')||document.body;return {h:el.scrollHeight,w:el.scrollWidth};})()`);
    await send('Emulation.setDeviceMetricsOverride', { width: Math.max(W, Math.min(dim.w, 500)), height: Math.min(dim.h + 90, 20000), deviceScaleFactor: DSF, mobile: W < 520 });
    await sleep(500);
  }
  const img = await send('Page.captureScreenshot', { format: 'png' });
  const out = resolve(outPath); mkdirSync(join(out, '..'), { recursive: true });
  writeFileSync(out, Buffer.from(img.data, 'base64'));
  console.log('SHOT ' + out + ' ' + (img.data.length * 3 / 4 | 0) + 'bytes errs=' + JSON.stringify(errors));
}
const list = await (await fetch(`http://127.0.0.1:${PORT}/json/list`)).json();
for (const t of list) if (t.id === created.id) await fetch(`http://127.0.0.1:${PORT}/json/close/${t.id}`);
ws.close(); process.exit(0);
