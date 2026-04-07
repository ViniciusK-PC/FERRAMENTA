@echo off
set "ROOT=%~dp0"
title HEX STALCKE - EXECUTOR MESTRE (FULL ECOSYSTEM)
color 0C

echo ======================================================
echo    🚀 INICIALIZANDO ECOSSISTEMA HEX STALCKE v6.5
echo ======================================================

:: 1. Backend
echo.
echo [1/4] Verificando dependencias do Python...
cd /d "%ROOT%Hex Stalcke"
python -m pip install flask flask-cors requests psutil beautifulsoup4 selenium aiohttp werkzeug --quiet
echo [+] Backend pronto!

:: 2. Frontend
echo.
echo [2/4] Verificando dependencias do Frontend (HexFront)...
cd /d "%ROOT%HexFront"
set "PKG_MGR=npm"
where pnpm >nul 2>nul
if %errorlevel% equ 0 set "PKG_MGR=pnpm"
if not exist "node_modules" (
    echo [!] Instalando com %PKG_MGR%...
    call %PKG_MGR% install
)
echo [+] Frontend pronto!

:: 3. Discord Bot
echo.
echo [3/4] Verificando dependencias do Bot do Discord...
cd /d "%ROOT%Bot"
if not exist "node_modules" (
    echo [!] Instalando dependencias do Bot...
    npm install
)
echo [+] Bot pronto!

:: 4. Lançamento
echo.
echo [4/4] Lancando Backend, Interface e Bot em 5 segundos...
timeout /t 5

:: Inicia o Backend
start "HEX_BACKEND" /d "%ROOT%Hex Stalcke" cmd /k "echo AGUARDANDO COMANDOS... && python hexstalcke_server.py"

:: Inicia o Frontend
start "HEX_FRONTEND" /d "%ROOT%HexFront" cmd /k "echo INICIANDO INTERFACE... && if \"%PKG_MGR%\"==\"pnpm\" (pnpm dev) else (npm run dev)"

:: Inicia o Bot (Usando ts-node ou npm start conforme definido no package.json)
start "HEX_BOT" /d "%ROOT%Bot" cmd /k "echo INICIANDO BOT... && npm run dev"

echo.
echo ======================================================
echo    ✅ SISTEMA ONLINE (3/3)
echo.
echo    1. Backend: OK
echo    2. Frontend: http://localhost:3000
echo    3. Discord Bot: Conectando...
echo ======================================================
cd /d "%ROOT%"
pause
