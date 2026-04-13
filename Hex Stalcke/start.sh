#!/bin/bash

# Este script inicia a aplicação Hex Stalcke no Linux (Ubuntu)

echo "========================================"
echo "    Iniciando o Hex Stalcke Server..."
echo "========================================"

# Verifica e ativa o ambiente virtual correto
if [ -d "venv" ]; then
    echo "[*] Ativando ambiente virtual: venv"
    source venv/bin/activate
elif [ -d "hexstrike_env" ]; then
    echo "[*] Ativando ambiente virtual: hexstrike_env"
    source hexstrike_env/bin/activate
else
    echo "[!] Erro: Nenhum ambiente virtual encontrado (venv ou hexstrike_env)."
    echo "    Você pode criar um usando: python3 -m venv venv"
    exit 1
fi

# (Opcional) Descomente as linhas abaixo se quiser instalar os requirements sempre que rodar o script
# echo "[*] Verificando dependências..."
# pip3 install -r requirements.txt

# Inicia o servidor Python
echo "[*] Executando hexstalcke_server.py..."
python3 hexstalcke_server.py

# Caso o servidor pare, o script chega aqui
echo "[*] Servidor finalizado."
