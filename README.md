# SeoScope

SeoScope é uma ferramenta de análise de SEO técnico. O usuário informa a URL de uma página, o backend carrega seu HTML e, ao final do MVP, retornará uma nota de 0 a 100, os problemas encontrados e recomendações de melhoria.

O projeto está sendo construído em etapas para manter o código simples, didático e adequado para portfólio.

> As verificações e os pesos descritos neste projeto são regras internas do SeoScope. Eles não representam regras oficiais ou garantias de posicionamento do Google.

## Estado atual

O backend inicial está funcionando e já consegue:

- receber uma URL em `POST /api/analyze`;
- validar o corpo da requisição com Zod;
- aceitar somente URLs HTTP e HTTPS;
- acessar uma única página com o `fetch` nativo do Node.js;
- seguir até três redirecionamentos, revalidando cada destino;
- rejeitar localhost, endereços de loopback e redes não públicas;
- aplicar timeout de 10 segundos;
- limitar a resposta a 2 MB;
- aceitar somente documentos HTML ou XHTML;
- retornar metadados básicos da página carregada;
- responder com erros HTTP legíveis para entradas inválidas e falhas externas.

Ainda não há analyzers, cálculo de score ou frontend.

## Stack

### Backend atual

- Node.js 20+
- TypeScript
- Express
- Zod
- Fetch nativo
- ipaddr.js

### Planejado para o MVP

- Cheerio para leitura e consulta do HTML
- React
- TypeScript
- Vite
- Tailwind CSS

## Estrutura atual

```text
SeoScope/
├── backend/
│   ├── src/
│   │   ├── controllers/
│   │   │   └── analysisController.ts
│   │   ├── routes/
│   │   │   └── analysisRoutes.ts
│   │   ├── services/
│   │   │   └── pageFetcher.ts
│   │   ├── types/
│   │   │   └── analysis.ts
│   │   ├── app.ts
│   │   └── server.ts
│   ├── package.json
│   └── tsconfig.json
├── AGENTS.md
└── README.md
```

### Responsabilidade dos arquivos

- `analysisController.ts`: valida a entrada, chama o serviço de carregamento e transforma falhas em respostas HTTP.
- `analysisRoutes.ts`: registra a rota `POST /api/analyze`.
- `pageFetcher.ts`: carrega uma página e concentra limites de rede e a proteção básica contra SSRF.
- `analysis.ts`: define os contratos TypeScript das futuras verificações e da análise completa.
- `app.ts`: configura o Express, o parser JSON, as rotas e a resposta 404.
- `server.ts`: inicia o servidor HTTP.

Pastas como `analyzers/` e `utils/` serão criadas quando tiverem implementações reais, evitando estrutura vazia ou código fictício.

## Como executar

### Requisitos

- Node.js 20 ou superior
- npm

### Instalação

```bash
cd backend
npm install
```

### Desenvolvimento

```bash
npm run dev
```

O servidor ficará disponível em `http://localhost:3000` por padrão. Outra porta pode ser definida pela variável de ambiente `PORT`.

### Outros comandos

```bash
npm run typecheck
npm run build
npm start
```

`npm start` executa o código compilado e deve ser usado depois de `npm run build`.

## API atual

### `POST /api/analyze`

Request:

```json
{
  "url": "https://example.com"
}
```

Resposta atual aproximada:

```json
{
  "url": "https://example.com/",
  "finalUrl": "https://example.com/",
  "statusCode": 200,
  "contentType": "text/html",
  "sizeInBytes": 559,
  "message": "Página carregada. Os analyzers serão adicionados na próxima etapa."
}
```

Teste no PowerShell:

```powershell
Invoke-RestMethod `
  -Uri "http://localhost:3000/api/analyze" `
  -Method Post `
  -ContentType "application/json" `
  -Body '{"url":"https://example.com"}'
```

A rota raiz `GET /` não foi criada. Portanto, acessar apenas `http://localhost:3000` no navegador retorna `404` intencionalmente.

## Contrato planejado da análise

Todos os analyzers retornarão o mesmo formato:

```ts
interface SEOCheckResult {
  id: string;
  name: string;
  status: "success" | "warning" | "error";
  score: number;
  maxScore: number;
  message: string;
  recommendation?: string;
  details?: unknown;
}
```

A resposta final de `POST /api/analyze` deverá seguir este formato geral:

```json
{
  "url": "https://example.com",
  "score": 82,
  "status": "good",
  "summary": {
    "passed": 6,
    "warnings": 2,
    "errors": 1
  },
  "results": []
}
```

## Score planejado

| Verificação | Peso |
| --- | ---: |
| Title | 20 |
| Meta description | 15 |
| H1 | 15 |
| Hierarquia de headings | 10 |
| Imagens com atributo `alt` | 15 |
| Canonical | 10 |
| Open Graph | 10 |
| HTTPS | 5 |
| **Total** | **100** |

Classificação interna:

- 90–100: Excellent
- 75–89: Good
- 50–74: Needs Improvement
- 0–49: Critical

## Segurança de URLs

Como o servidor acessa URLs fornecidas pelo usuário, o `pageFetcher` aplica uma proteção básica contra SSRF:

- restringe protocolos a HTTP e HTTPS;
- rejeita URLs com credenciais;
- resolve o domínio e verifica todos os endereços retornados;
- bloqueia endereços privados, locais, reservados e não públicos;
- usa redirects manuais e valida novamente cada destino;
- limita tempo, quantidade de redirects, tipo e tamanho da resposta.

Essas medidas reduzem o risco do MVP, mas não substituem controles adicionais de infraestrutura necessários para expor um serviço desse tipo em produção, como isolamento de rede, regras de egress e limitação de requisições.

## Roadmap do MVP

- [x] Configurar Node.js, TypeScript e Express
- [x] Criar `POST /api/analyze`
- [x] Validar a URL com Zod
- [x] Implementar o carregamento controlado de uma única página
- [x] Adicionar proteção básica contra SSRF
- [ ] Instalar o Cheerio e implementar o analyzer de Title
- [ ] Implementar Meta description
- [ ] Implementar H1
- [ ] Implementar hierarquia de headings
- [ ] Implementar análise de imagens sem `alt`
- [ ] Implementar Canonical
- [ ] Implementar Open Graph
- [ ] Implementar HTTPS
- [ ] Calcular score, classificação e resumo
- [ ] Adicionar testes automatizados do backend
- [ ] Criar o frontend com React, Vite e Tailwind CSS
- [ ] Integrar o formulário do frontend ao endpoint

## Fora do escopo inicial

Para preservar o foco do MVP, esta primeira versão não terá:

- banco de dados;
- autenticação;
- inteligência artificial;
- crawler de múltiplas páginas;
- histórico de análises;
- contas de usuário;
- Docker.

Essas funcionalidades só deverão ser consideradas depois que o fluxo básico de análise de uma única página estiver concluído e validado.
