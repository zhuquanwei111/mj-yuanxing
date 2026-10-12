// 本地预览服务：把原型文件夹用 http://127.0.0.1 提供出来。
// 原因：内置浏览器只允许打开 http/https/about:blank，file:// 被安全策略直接拦下，
// 因此本机 HTML 必须先经由 HTTP 才能查看、截图和点击验证。
// 用法：node tools/serve-local.mjs [--root <目录>] [--port 8788] [--open] [页面相对路径]
import { createServer } from 'node:http';
import { createReadStream, existsSync, readdirSync, statSync, writeFileSync } from 'node:fs';
import { spawn } from 'node:child_process';
import { dirname, extname, join, normalize, resolve, sep } from 'node:path';
import { fileURLToPath } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));
const DEFAULT_ROOT = resolve(here, '..');
const DEFAULT_PORT = 8788;
const PROTO_PAGE = '明镜/1_产品原型/明镜产品原型.html';

const argv = process.argv.slice(2);
const flag = (name, fallback) => {
  const i = argv.indexOf(name);
  return i === -1 ? fallback : argv[i + 1];
};
const rootArg = flag('--root', null);
const portArg = Number(flag('--port', DEFAULT_PORT));
const open = argv.includes('--open');
const page = argv.find(a => !a.startsWith('--') && a !== rootArg && a !== String(portArg)) || PROTO_PAGE;
const root = resolve(rootArg || DEFAULT_ROOT);

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.htm': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.mjs': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.map': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.gif': 'image/gif',
  '.ico': 'image/x-icon',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.ttf': 'font/ttf',
  '.txt': 'text/plain; charset=utf-8',
  '.md': 'text/plain; charset=utf-8',
  '.pdf': 'application/pdf',
  '.mp4': 'video/mp4',
  '.webm': 'video/webm',
  '.mp3': 'audio/mpeg',
};

const resolveTarget = (urlPath) => {
  let p;
  try {
    p = decodeURIComponent(urlPath.split('?')[0]);
  } catch {
    return null;
  }
  const abs = normalize(join(root, p));
  if (abs !== root && !abs.startsWith(root + sep)) return null;
  return abs;
};

const listDir = (abs, urlPath) => {
  const base = urlPath.endsWith('/') ? urlPath : urlPath + '/';
  const rows = [];
  for (const name of [...readdirSafe(abs)]) {
    const child = join(abs, name);
    const isDir = statSync(child).isDirectory();
    rows.push(`<li><a href="${base}${encodeURIComponent(name)}${isDir ? '/' : ''}">${name}${isDir ? '/' : ''}</a></li>`);
  }
  return `<!doctype html><meta charset="utf-8"><title>${base}</title>
<body style="font:14px/1.6 system-ui;padding:24px"><h3>${base}</h3><ul>${rows.sort().join('')}</ul></body>`;
};

const readdirSafe = (abs) => {
  try {
    return readdirSync(abs).filter(name => name !== '.preview-state.json');
  } catch {
    return [];
  }
};

const stamp = () => new Date().toTimeString().slice(0, 8);

const server = createServer((req, res) => {
  const urlPath = req.url || '/';
  if (urlPath === '/favicon.ico') {
    res.writeHead(204).end();
    return;
  }
  if (urlPath === '/__local_preview__') {
    // 身份探针：让重复启动的实例能认出「这里已经有本工具的服务」，而不会在 Windows 上把端口抢过来再绑一次。
    res
      .writeHead(200, { 'content-type': 'application/json; charset=utf-8', 'cache-control': 'no-store' })
      .end(JSON.stringify({ app: 'serve-local', root, port: server.address()?.port, pid: process.pid }));
    return;
  }
  const abs = resolveTarget(urlPath);
  if (!abs) {
    res.writeHead(403, { 'content-type': 'text/plain; charset=utf-8' }).end('路径越界');
    console.log(`${stamp()} 403 ${urlPath}`);
    return;
  }
  let info = null;
  try {
    info = statSync(abs);
  } catch {}
  if (!info) {
    res.writeHead(404, { 'content-type': 'text/plain; charset=utf-8' }).end('未找到：' + urlPath);
    console.log(`${stamp()} 404 ${urlPath}`);
    return;
  }
  if (info.isDirectory()) {
    const body = listDir(abs, urlPath);
    res.writeHead(200, { 'content-type': 'text/html; charset=utf-8', 'cache-control': 'no-store' }).end(body);
    console.log(`${stamp()} 200 ${urlPath} (目录)`);
    return;
  }
  const headers = {
    'content-type': MIME[extname(abs).toLowerCase()] || 'application/octet-stream',
    'content-length': info.size,
    'cache-control': 'no-store',
  };
  res.writeHead(200, headers);
  if (req.method === 'HEAD') return res.end();
  console.log(`${stamp()} 200 ${urlPath} (${info.size}B)`);
  createReadStream(abs).on('error', () => res.destroy()).pipe(res);
});

const listen = (port, triesLeft = 20) =>
  new Promise((ok, fail) => {
    server.once('error', (err) => {
      if (err.code === 'EADDRINUSE' && triesLeft > 0) return listen(port + 1, triesLeft - 1).then(ok, fail);
      fail(err);
    });
    server.listen(port, '127.0.0.1', () => ok(port));
  });

const stateFile = join(here, '.preview-state.json');
const pageUrlOn = (p) => `http://127.0.0.1:${p}/` + page.split(/[\\/]/).map(encodeURIComponent).join('/');
const openInBrowser = (url) => {
  // 用 rundll32 直接交给系统默认浏览器：不经过 cmd，地址里的 %E6%98%8E 这类转义不会被当成变量展开。
  spawn('rundll32.exe', ['url.dll,FileProtocolHandler', url], { stdio: 'ignore', detached: true }).unref();
};

// 某端口上有没有服务、是不是本工具。Windows 下 libuv 带 SO_REUSEADDR，第二个实例能「成功」绑到同一个端口，
// 所以必须先探测再绑，不能只靠 bind 报 EADDRINUSE。
const probe = async (p) => {
  try {
    const r = await fetch(`http://127.0.0.1:${p}/__local_preview__`, { signal: AbortSignal.timeout(900) });
    const info = r.ok ? await r.json().catch(() => null) : null;
    return { occupied: true, ours: info?.app === 'serve-local', pid: info?.pid, root: info?.root };
  } catch (err) {
    if (err.name === 'TimeoutError' || err.name === 'AbortError') return { occupied: true };
    return { occupied: false };
  }
};

const pickPort = async (allowReuse) => {
  for (let p = portArg; p < portArg + 20; p++) {
    const info = await probe(p);
    if (!info.occupied) return { port: p };
    // 已有自己的服务：允许复用时停在它上面；否则跳过它，换下一个真正空闲的端口。
    if (allowReuse && info.ours && resolve(info.root || '') === root) return { port: p, running: info };
  }
  return { port: portArg };
};

const pick = await pickPort(!argv.includes('--new'));
if (pick.running) {
  const url = pageUrlOn(pick.port);
  console.log(`已有预览服务在运行，直接复用（进程 ${pick.running.pid}）：${url}`);
  if (open && existsSync(join(root, page))) openInBrowser(url);
  process.exit(0);
}

const port = await listen(pick.port);
const base = `http://127.0.0.1:${port}/`;
const pageUrl = pageUrlOn(port);
const pageExists = existsSync(join(root, page));

writeFileSync(join(here, '.preview-state.json'), JSON.stringify({ url: base, page, pageUrl, root, port, pid: process.pid, startedAt: new Date().toISOString() }, null, 2));

console.log(`本地预览服务已启动（根目录：${root}）`);
console.log(`  目录首页：${base}`);
console.log(pageExists ? `  原型页面：${pageUrl}` : `  提示：未找到 ${page}，可自行拼接路径`);
console.log('  停止服务：Ctrl+C（或关闭本窗口）；重复启动会自动复用本服务');

if (open && pageExists) openInBrowser(pageUrl);
