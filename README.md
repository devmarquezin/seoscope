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
- analisar a presença, o conteúdo e o comprimento do Title;
- analisar a presença, o conteúdo e o comprimento da Meta Description;
- analisar a presença, a quantidade e o conteúdo dos headings H1;
- analisar a contagem e os saltos de hierarquia entre H1 e H6;
- contar imagens com e sem atributo `alt`, incluindo `alt` vazio separadamente;
- verificar ausência, preenchimento e duplicidade de tags canonical;
- verificar `og:title`, `og:description`, `og:image` e `og:url`;
- verificar se a URL final da página utiliza HTTPS;
- retornar os resultados no contrato comum `SEOCheckResult`;
- executar testes do endpoint completo e do carregamento seguro sem depender da internet;
- responder com erros HTTP legíveis para entradas inválidas e falhas externas.

Todos os oito analyzers do MVP estão implementados, assim como o score geral, a classificação e o resumo de resultados. O frontend também está configurado com React, TypeScript, Vite e Tailwind CSS. A Home valida a URL, chama a API e apresenta os estados de carregamento, erro e sucesso. Após a análise, a interface exibe o score, a classificação, o resumo e todas as verificações técnicas com suas mensagens e recomendações.

A suíte atual possui 65 testes unitários e de integração.

## Stack

### Backend atual

- Node.js 20+
- TypeScript
- Express
- Zod
- Fetch nativo
- ipaddr.js
- Cheerio

### Frontend atual

- React
- TypeScript
- Vite
- Tailwind CSS

## Estrutura atual

```text
SeoScope/
├── backend/
│   ├── src/
│   │   ├── app.integration.test.ts
│   │   ├── controllers/
│   │   │   └── analysisController.ts
│   │   ├── analyzers/
│   │   │   ├── canonicalAnalyzer.ts
│   │   │   ├── canonicalAnalyzer.test.ts
│   │   │   ├── descriptionAnalyzer.ts
│   │   │   ├── descriptionAnalyzer.test.ts
│   │   │   ├── h1Analyzer.ts
│   │   │   ├── h1Analyzer.test.ts
│   │   │   ├── headingAnalyzer.ts
│   │   │   ├── headingAnalyzer.test.ts
│   │   │   ├── httpsAnalyzer.ts
│   │   │   ├── httpsAnalyzer.test.ts
│   │   │   ├── imageAnalyzer.ts
│   │   │   ├── imageAnalyzer.test.ts
│   │   │   ├── openGraphAnalyzer.ts
│   │   │   ├── openGraphAnalyzer.test.ts
│   │   │   ├── titleAnalyzer.ts
│   │   │   └── titleAnalyzer.test.ts
│   │   ├── routes/
│   │   │   └── analysisRoutes.ts
│   │   ├── services/
│   │   │   ├── pageFetcher.ts
│   │   │   ├── pageFetcher.test.ts
│   │   │   └── seoAnalyzer.ts
│   │   ├── types/
│   │   │   └── analysis.ts
│   │   ├── utils/
│   │   │   ├── scoreCalculator.ts
│   │   │   └── scoreCalculator.test.ts
│   │   ├── app.ts
│   │   └── server.ts
│   ├── package.json
│   └── tsconfig.json
├── frontend/
│   ├── src/
│   │   ├── assets/
│   │   │   ├── favicon.ico
│   │   │   ├── fonts/
│   │   │   │   ├── sofia-pro-medium.woff
│   │   │   │   ├── sofia-pro-regular.woff
│   │   │   │   └── sofia-pro-semibold.woff
│   │   │   └── seoscope-logo.webp
│   │   ├── components/
│   │   │   ├── AnalysisResults.tsx
│   │   │   ├── AnalysisSummary.tsx
│   │   │   ├── CheckResultCard.tsx
│   │   │   ├── Header.tsx
│   │   │   ├── Hero.tsx
│   │   │   ├── LoadingAnalysis.tsx
│   │   │   ├── Logo.tsx
│   │   │   └── UrlForm.tsx
│   │   ├── pages/
│   │   │   └── Home.tsx
│   │   ├── services/
│   │   │   └── seoApi.ts
│   │   ├── types/
│   │   │   └── analysis.ts
│   │   ├── App.tsx
│   │   ├── index.css
│   │   └── main.tsx
│   ├── index.html
│   ├── package.json
│   ├── tsconfig.json
│   └── vite.config.ts
├── AGENTS.md
└── README.md
```

### Responsabilidade dos arquivos

- `analysisController.ts`: valida a entrada, chama o serviço de carregamento e transforma falhas em respostas HTTP.
- `app.integration.test.ts`: testa o endpoint completo, validação, mapeamento de erros, score e rota 404 com servidor HTTP temporário.
- `canonicalAnalyzer.ts`: verifica ausência, preenchimento e duplicidade de tags canonical.
- `canonicalAnalyzer.test.ts`: testa canonical ausente, sem `href`, vazia, única, múltipla e variações do atributo `rel`.
- `descriptionAnalyzer.ts`: verifica se a Meta Description existe, se está preenchida e se seu comprimento atende à heurística interna.
- `descriptionAnalyzer.test.ts`: testa ausência, conteúdo vazio, limites de comprimento, capitalização e espaços irregulares.
- `h1Analyzer.ts`: verifica ausência, conteúdo e quantidade de headings H1.
- `h1Analyzer.test.ts`: testa H1 ausente, vazio, único, múltiplo e normalização de espaços.
- `headingAnalyzer.ts`: conta H1–H6 e detecta saltos ascendentes entre headings consecutivos.
- `headingAnalyzer.test.ts`: testa ausência, sequências válidas, saltos de nível, contagens e separação da regra de H1.
- `httpsAnalyzer.ts`: verifica se a URL final que entregou o HTML utiliza HTTPS.
- `httpsAnalyzer.test.ts`: testa HTTPS, HTTP, URLs completas e entrada inválida.
- `imageAnalyzer.ts`: conta imagens com, sem e com valor vazio no atributo `alt`, aplicando score proporcional.
- `imageAnalyzer.test.ts`: testa páginas sem imagens, atributos presentes, vazios, ausentes e detalhes das imagens afetadas.
- `openGraphAnalyzer.ts`: verifica o preenchimento das quatro propriedades Open Graph exigidas pelo MVP.
- `openGraphAnalyzer.test.ts`: testa propriedades ausentes, vazias, parciais, capitalizadas e duplicadas.
- `titleAnalyzer.ts`: verifica se o Title existe, se está preenchido e se seu comprimento atende à heurística interna.
- `titleAnalyzer.test.ts`: testa os cenários de Title ausente, vazio, curto, longo, adequado e com espaços irregulares.
- `analysisRoutes.ts`: registra a rota `POST /api/analyze`.
- `pageFetcher.ts`: carrega uma página e concentra limites de rede e a proteção básica contra SSRF.
- `pageFetcher.test.ts`: testa protocolos, IPs privados, redirects, tipo, tamanho e erros de resposta sem acessar a internet.
- `seoAnalyzer.ts`: carrega o HTML no Cheerio uma vez e coordena os analyzers implementados.
- `analysis.ts`: define os contratos TypeScript das verificações e da análise completa.
- `scoreCalculator.ts`: soma os pontos, classifica a nota e conta sucessos, avisos e erros.
- `scoreCalculator.test.ts`: testa soma, arredondamento, limites, classificações e resumo.
- `app.ts`: configura o Express, o parser JSON, as rotas e a resposta 404.
- `server.ts`: inicia o servidor HTTP.
- `frontend/src/assets/`: contém a logo, o favicon e os pesos utilizados da fonte Sofia Pro.
- `frontend/src/components/AnalysisSummary.tsx`: apresenta o score, a classificação, a URL final e o resumo da análise.
- `frontend/src/components/AnalysisResults.tsx`: organiza a lista de verificações técnicas retornadas pela API.
- `frontend/src/components/CheckResultCard.tsx`: apresenta status, pontuação, mensagem e recomendação de cada verificação.
- `frontend/src/components/`: também reúne a marca, o Header, o Hero, o formulário e o feedback de carregamento.
- `frontend/src/pages/Home.tsx`: coordena os estados da requisição e a composição da Home.
- `frontend/src/services/seoApi.ts`: centraliza a chamada a `POST /api/analyze` e normaliza falhas da API.
- `frontend/src/types/analysis.ts`: espelha o contrato público retornado pelo backend.
- `frontend/src/App.tsx`: monta a página principal da aplicação.
- `frontend/src/index.css`: importa o Tailwind CSS, registra a paleta e define os estilos globais mínimos.
- `frontend/src/main.tsx`: inicializa a aplicação React.
- `frontend/vite.config.ts`: configura os plugins do React e do Tailwind no Vite.

Novos arquivos só serão criados quando tiverem uma responsabilidade real, evitando estrutura vazia ou código fictício.

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

### Frontend

Em outro terminal:

```bash
cd frontend
npm install
npm run dev
```

O Vite informará no terminal o endereço local do frontend, normalmente `http://localhost:5173`.

### Outros comandos

```bash
npm run typecheck
npm test
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
  "score": 55,
  "status": "needs-improvement",
  "summary": {
    "passed": 4,
    "warnings": 1,
    "errors": 3
  },
  "statusCode": 200,
  "contentType": "text/html",
  "sizeInBytes": 559,
  "results": [
    {
      "id": "title",
      "name": "Title",
      "status": "warning",
      "score": 10,
      "maxScore": 20,
      "message": "O título tem 14 caracteres e pode ser pouco descritivo.",
      "recommendation": "Considere usar entre 30 e 60 caracteres.",
      "details": {
        "title": "Example Domain",
        "length": 14
      }
    },
    {
      "id": "meta-description",
      "name": "Meta Description",
      "status": "error",
      "score": 0,
      "maxScore": 15,
      "message": "A página não possui uma meta description.",
      "recommendation": "Adicione uma meta description que resuma o conteúdo da página.",
      "details": {
        "description": null,
        "length": 0
      }
    },
    {
      "id": "h1",
      "name": "H1",
      "status": "success",
      "score": 15,
      "maxScore": 15,
      "message": "A página possui um único H1 preenchido.",
      "details": {
        "count": 1,
        "headings": [
          "Example Domain"
        ]
      }
    },
    {
      "id": "heading-hierarchy",
      "name": "Heading Hierarchy",
      "status": "success",
      "score": 10,
      "maxScore": 10,
      "message": "A página possui 1 heading sem saltos de nível.",
      "details": {
        "total": 1,
        "counts": {
          "h1": 1,
          "h2": 0,
          "h3": 0,
          "h4": 0,
          "h5": 0,
          "h6": 0
        },
        "outline": [
          {
            "level": 1,
            "tag": "h1",
            "text": "Example Domain"
          }
        ],
        "skippedLevels": []
      }
    },
    {
      "id": "image-alt",
      "name": "Image Alt Text",
      "status": "success",
      "score": 15,
      "maxScore": 15,
      "message": "A página não possui imagens para verificar.",
      "details": {
        "total": 0,
        "withAlt": 0,
        "emptyAlt": 0,
        "withoutAlt": 0,
        "missingAltImages": []
      }
    },
    {
      "id": "canonical",
      "name": "Canonical",
      "status": "error",
      "score": 0,
      "maxScore": 10,
      "message": "A página não possui uma URL canonical.",
      "recommendation": "Adicione uma tag link com rel canonical e um href preenchido.",
      "details": {
        "count": 0,
        "urls": [],
        "emptyCount": 0
      }
    },
    {
      "id": "open-graph",
      "name": "Open Graph",
      "status": "error",
      "score": 0,
      "maxScore": 10,
      "message": "Nenhuma propriedade Open Graph obrigatória está preenchida.",
      "recommendation": "Adicione og:title, og:description, og:image e og:url com conteúdos válidos.",
      "details": {
        "required": [
          "og:title",
          "og:description",
          "og:image",
          "og:url"
        ],
        "present": 0,
        "missing": [
          "og:title",
          "og:description",
          "og:image",
          "og:url"
        ],
        "empty": [],
        "values": {
          "og:title": null,
          "og:description": null,
          "og:image": null,
          "og:url": null
        }
      }
    },
    {
      "id": "https",
      "name": "HTTPS",
      "status": "success",
      "score": 5,
      "maxScore": 5,
      "message": "A página está sendo entregue por HTTPS.",
      "details": {
        "url": "https://example.com/",
        "protocol": "https:"
      }
    }
  ]
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

## Contrato da análise

Todos os analyzers retornam o mesmo formato:

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

A resposta de `POST /api/analyze` segue este formato geral:

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

## Score

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
- [x] Instalar o Cheerio e implementar o analyzer de Title
- [x] Implementar Meta description
- [x] Implementar H1
- [x] Implementar hierarquia de headings
- [x] Implementar análise de imagens sem `alt`
- [x] Implementar Canonical
- [x] Implementar Open Graph
- [x] Implementar HTTPS
- [x] Calcular score, classificação e resumo
- [x] Adicionar testes unitários do backend
- [x] Adicionar testes de integração do endpoint e do carregamento de páginas
- [x] Criar o frontend com React, Vite e Tailwind CSS
- [x] Integrar o formulário do frontend ao endpoint
- [x] Implementar a visualização completa do relatório

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
