# Icon Preview API

API para processar imagens e gerar ícones em diferentes tamanhos seguindo o padrão de manifest de PWA.

## Estrutura MVC

```
src/
├── controllers/     # Controladores (lógica de requisição/resposta)
├── models/         # Modelos de dados e interfaces
├── routes/         # Definição de rotas
├── services/       # Lógica de negócio
└── main.ts         # Arquivo principal
```

## Funcionalidades

- Upload de imagens (JPEG, PNG, GIF, WebP)
- Redimensionamento automático para diferentes tamanhos
- Geração de manifest no formato PWA
- Servir arquivos de ícone processados

## Endpoints

### POST /upload

Faz upload de uma imagem e retorna o manifest com os ícones gerados.

**Parâmetros:**
- `icon` (file): Arquivo de imagem (required)
- `name` (string): Nome da aplicação (optional)
- `short_name` (string): Nome curto da aplicação (optional)

**Exemplo de resposta:**
```json
{
  "name": "Minha App",
  "short_name": "App",
  "icons": [
    {
      "src": "/android-chrome-192x192.png",
      "sizes": "192x192",
      "type": "image/png"
    },
    {
      "src": "/android-chrome-512x512.png",
      "sizes": "512x512",
      "type": "image/png"
    }
  ]
}
```

### GET /:filename

Serve os arquivos de ícone gerados.

**Exemplo:** `GET /android-chrome-192x192.png`

## Como usar

1. Instalar dependências:
```bash
bun install
```

2. Executar o servidor:
```bash
bun run src/main.ts
```

3. Fazer upload de uma imagem:
```bash
curl -X POST \
  -F "icon=@/caminho/para/sua/imagem.png" \
  -F "name=Minha App" \
  -F "short_name=App" \
  http://localhost:3001/upload
```

## Tamanhos de ícones gerados

- 16x16 (favicon-16x16.png)
- 32x32 (favicon-32x32.png)
- 180x180 (apple-touch-icon.png)
- 192x192 (android-chrome-192x192.png)
- 512x512 (android-chrome-512x512.png)

## Limitações

- Tamanho máximo do arquivo: 5MB
- Formatos suportados: JPEG, PNG, GIF, WebP
