#!/bin/bash
# Edge 无头原生截图薄包装（Git Bash 直接 spawn Edge 会立即退出，须经 PowerShell 启动）
# 用法: shoot.sh <html路径> <输出png绝对路径> [宽] [高] [dsf] [query串]
EDGE='C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe'
PROF='C:\Users\admin\AppData\Local\Temp\glm-edge-prof'
HTML="$1"; OUT="$2"; W="${3:-390}"; H="${4:-844}"; DSF="${5:-1}"; Q="$6"
URL=$(python -c "import pathlib,sys; print(pathlib.Path(sys.argv[1]).resolve().as_uri())" "$HTML") || exit 1
[ -n "$Q" ] && URL="$URL?$Q"
powershell -NoProfile -Command "Start-Process -FilePath '$EDGE' -ArgumentList '--headless=new','--disable-gpu','--hide-scrollbars','--window-size=$W,$H','--force-device-scale-factor=$DSF','--virtual-time-budget=6000','--user-data-dir=$PROF','--screenshot=$OUT','$URL' -Wait -WindowStyle Hidden" >/dev/null 2>&1
if [ -s "$OUT" ]; then echo "OK  $OUT ($(stat -c%s "$OUT") bytes)"; else echo "FAIL $OUT"; exit 1; fi
