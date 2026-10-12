# -*- coding: utf-8 -*-
"""Edge 原生无头截图薄包装（经 PowerShell 启动；Git Bash 直接 spawn 会立即退出）。
用法: python shoot.py <html路径> <输出png> [宽] [高] [dsf] [query串]
示例: python shoot.py glm-d1-电讯.html shots/d1-首屏.png 390 844 1 ""
      python shoot.py glm-d1-电讯.html shots/d1-三形态.png 390 1200 2 "panel=forms&shot=long"
"""
import subprocess, sys, tempfile, os, json, pathlib, socket

def free_port():
    s = socket.socket(); s.bind(('127.0.0.1', 0)); p = s.getsockname()[1]; s.close(); return p

def find_edge():
    for p in [
        r"C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe",
        r"C:\Program Files\Microsoft\Edge\Application\msedge.exe",
        r"C:\Program Files\Google\Chrome\Application\chrome.exe",
        os.environ.get("EDGE_PATH", ""),
    ]:
        if p and os.path.exists(p):
            return p
    raise SystemExit("没找到 Edge/Chrome")

def main():
    html, out = sys.argv[1], sys.argv[2]
    w = sys.argv[3] if len(sys.argv) > 3 else "390"
    h = sys.argv[4] if len(sys.argv) > 4 else "844"
    dsf = sys.argv[5] if len(sys.argv) > 5 else "1"
    query = sys.argv[6] if len(sys.argv) > 6 else ""
    budget = sys.argv[7] if len(sys.argv) > 7 else "6000"

    src = pathlib.Path(html).resolve()
    if not src.exists():
        raise SystemExit(f"找不到页面: {src}")
    url = src.as_uri()
    if query:
        url += "?" + query
    outp = pathlib.Path(out).resolve()
    outp.parent.mkdir(parents=True, exist_ok=True)
    prof = pathlib.Path(tempfile.gettempdir()) / "glm-edge-prof"
    prof.mkdir(exist_ok=True)
    edge = find_edge()

    args = [
        "--headless=new", "--disable-gpu", "--hide-scrollbars", "--no-first-run",
        f"--window-size={w},{h}",
        f"--force-device-scale-factor={dsf}",
        f"--virtual-time-budget={budget}",
        f"--user-data-dir={prof}",
        f"--screenshot={outp}",
        url,
    ]
    # PowerShell ArgumentList: 单引号数组元素，URL 已百分号编码，安全
    ps_list = ",".join("'" + a.replace("'", "''") + "'" for a in args)
    ps = f"Start-Process -FilePath '{edge}' -ArgumentList {ps_list} -Wait -WindowStyle Hidden"
    r = subprocess.run(["powershell", "-NoProfile", "-Command", ps],
                       capture_output=True, text=True, timeout=90)
    ok = outp.exists() and outp.stat().st_size > 1000
    print(json.dumps({
        "ok": ok, "out": str(outp), "size": outp.stat().st_size if outp.exists() else 0,
        "page": src.name, "query": query, "geom": f"{w}x{h}@{dsf}x",
        "err": (r.stderr or "")[:200],
    }, ensure_ascii=False))
    sys.exit(0 if ok else 1)

if __name__ == "__main__":
    main()
