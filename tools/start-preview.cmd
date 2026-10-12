@echo off
chcp 65001 >nul
setlocal
cd /d "%~dp0.."
node "%~dp0serve-local.mjs" --root "%CD%" --open %*
endlocal
