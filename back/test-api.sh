#!/usr/bin/env bash

# Exemplo de como testar a API
# Certifique-se de ter uma imagem de teste disponível

echo "=== Testando API de Upload de Ícones ==="
echo

# Teste 1: Verificar se o servidor está rodando
echo "1. Testando endpoint raiz..."
curl -s http://localhost:3001/ | jq .
echo

# Teste 2: Upload de imagem (você precisa ter uma imagem para testar)
echo "2. Para testar o upload, execute:"
echo "curl -X POST \\"
echo "  -F \"icon=@/caminho/para/sua/imagem.png\" \\"
echo "  -F \"name=Minha App\" \\"
echo "  -F \"short_name=App\" \\"
echo "  http://localhost:3001/upload"
echo

# Teste 3: Baixar ícone gerado
echo "3. Para baixar um ícone gerado, execute:"
echo "curl -o android-chrome-192x192.png http://localhost:3001/android-chrome-192x192.png"
echo

echo "=== Fim dos testes ==="
