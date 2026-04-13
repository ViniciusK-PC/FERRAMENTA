#!/bin/bash

# Define o diretório raiz automaticamente
ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

echo "======================================================"
echo "    🚀 INICIALIZANDO ECOSSISTEMA HEX STALCKE v6.5 (UBUNTU)"
echo "======================================================"

# 1. Backend
echo ""
echo "[1/4] Verificando dependencias do Python..."
cd "$ROOT/Hex Stalcke"
# Usamos o python3 do sistema diretamente para evitar erros com venvs incompletos
python3 -m pip install flask flask-cors requests psutil beautifulsoup4 selenium aiohttp werkzeug phonenumbers --quiet
echo "[+] Backend pronto!"

# 2. Frontend
echo ""
echo "[2/4] Verificando dependencias do Frontend (HexFront)..."
cd "$ROOT/HexFront"
PKG_MGR="npm"
if command -v pnpm &> /dev/null; then
    PKG_MGR="pnpm"
fi
if [ ! -d "node_modules" ]; then
    echo "[!] Instalando com $PKG_MGR..."
    $PKG_MGR install
fi
echo "[+] Frontend pronto!"

# 3. Discord Bot
echo ""
echo "[3/4] Verificando dependencias do Bot do Discord..."
cd "$ROOT/Bot"
if [ ! -d "node_modules" ]; then
    echo "[!] Instalando dependências do Bot..."
    npm install
fi
echo "[+] Bot pronto!"

# 4. Lançamento
echo ""
echo "[4/4] Lançando Backend, Interface e Bot em abas/janelas do terminal em 5 segundos..."
sleep 5

# Função para abrir numa nova janela do terminal
launch_terminal() {
    local name="$1"
    local dir="$2"
    local cmd="$3"
    
    # Tenta usar o gnome-terminal (Padrão do Ubuntu)
    if command -v gnome-terminal &> /dev/null; then
        gnome-terminal --title="$name" --working-directory="$dir" -- bash -c "$cmd; exec bash"
    # Fallback para outro emulador
    elif command -v x-terminal-emulator &> /dev/null; then
        x-terminal-emulator -e bash -c "cd \"$dir\" && $cmd; exec bash" &
    # Ultimo fallback (Roda no fundo na mesma tela)
    else
        echo "[!] Terminal visual não encontrado, rodando silenciosamente no fundo."
        (cd "$dir" && eval "$cmd") &
    fi
}

# Inicializa as variáveis de comando
cd "$ROOT/Hex Stalcke"
# Forçamos o uso do python3 do sistema para máxima compatibilidade
BACKEND_CMD="echo 'AGUARDANDO COMANDOS...' && python3 hexstalcke_server.py"

if [ "$PKG_MGR" = "pnpm" ]; then
    FRONTEND_CMD="echo 'INICIANDO INTERFACE...' && pnpm dev"
else
    FRONTEND_CMD="echo 'INICIANDO INTERFACE...' && npm run dev"
fi

BOT_CMD="echo 'INICIANDO BOT...' && npm run dev"

# Lança os terminais!
launch_terminal "HEX_BACKEND" "$ROOT/Hex Stalcke" "$BACKEND_CMD"
launch_terminal "HEX_FRONTEND" "$ROOT/HexFront" "$FRONTEND_CMD"
launch_terminal "HEX_BOT" "$ROOT/Bot" "$BOT_CMD"

echo ""
echo "======================================================"
echo "    ✅ SISTEMA ONLINE (3/3)"
echo ""
echo "    1. Backend: OK"
echo "    2. Frontend: http://localhost:3000"
echo "    3. Discord Bot: Conectando..."
echo "======================================================"
