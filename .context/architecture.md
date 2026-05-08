# SubTrack — Arquitetura

## Visão Geral

O SubTrack é uma aplicação web clássica renderizada no servidor + API REST. O servidor serve ficheiros estáticos e expõe uma API JSON. O frontend é uma aplicação ao estilo single-page totalmente conduzida por Vanilla JS que chama essa API através de `fetch()`.


Browser
│
├── GET / → serve client/index.html (estático)
├── GET /css/.css → serve client/css/
├── GET /js/.js → serve client/js/
│
└── /api/* → API REST (JSON)
│
├── Routes (server/routes/)
├── Controllers (server/controllers/)
├── Services (server/services/)
├── Repositories (server/repositories/)
└── SQLite DB (server/db/)


---

## Responsabilidades das Camadas

### Routes (`server/routes/subscriptionRoutes.js`)
- Registar padrões de URL com Express
- Apontar cada rota para o método correto do controller
- **Sem lógica aqui**

### Controllers (`server/controllers/subscriptionController.js`)
- Extrair dados de `req.params`, `req.query`, `req.body`
- Validação básica da estrutura do input (campos obrigatórios presentes, tipos corretos)
- Chamar o método Service apropriado
- Formatar e enviar a resposta JSON
- Capturar erros e devolver respostas de erro padronizadas

### Services (`server/services/subscriptionService.js`)
- Toda a lógica de negócio vive aqui
- Normalização de custo mensal: anual ÷ 12
- Cálculos de datas para pagamentos futuros
- Agrupamento por categorias e agregação de estatísticas
- Chama o Repository para todo o acesso a dados

### Repositories (`server/repositories/subscriptionRepository.js`)
- Queries SQLite diretas usando `better-sqlite3`
- Devolve objetos JS simples (sem lógica de negócio)
- Todas as queries são parametrizadas

### Camada DB (`server/db/`)
- `database.js` — abre/cria o ficheiro SQLite, exporta a instância `db`
- `migrate.js` — cria tabelas caso não existam (idempotente)

### Utils (`server/utils/`)
- `dateUtils.js` — helpers de datas (dias até pagamento, formatar datas)
- `mathUtils.js` — normalização de preços (conversão mensal/anual)

---

## Modelo de Dados

### Tabela: `subscriptions`

| Column | Type | Notes |
|--------|------|-------|
| `id` | INTEGER PK | Incremento automático |
| `name` | TEXT NOT NULL | ex.: "Netflix" |
| `price` | REAL NOT NULL | Sempre armazenado conforme introduzido |
| `billingCycle` | TEXT NOT NULL | `'monthly'` ou `'yearly'` |
| `nextPayment` | TEXT NOT NULL | String de data ISO `YYYY-MM-DD` |
| `category` | TEXT | `'entertainment'`, `'fitness'`, `'software'`, `'other'` |
| `createdAt` | TEXT | Datetime ISO, definido pelo valor por defeito da DB |

---

## Arquitetura do Frontend

Ficheiro HTML único (`client/index.html`) com módulos JS:


client/js/
├── api.js — todas as chamadas fetch() ao backend (fonte única de verdade)
├── ui.js — helpers de manipulação DOM (renderizar cartões, mostrar alertas)
├── app.js — controlador principal: liga eventos da UI às chamadas API
└── utils.js — helpers de formatação (moeda, datas)


Sem etapa de build. Sem bundler. Ficheiros carregados como módulos ES através de `<script type="module">`.

---

## Principais Decisões de Design

| Decision | Choice | Reason |
|----------|--------|--------|
| Biblioteca DB | `better-sqlite3` | API síncrona, mais simples do que callbacks `sqlite3` |
| Frontend | Módulos Vanilla JS | Sem tooling de build, amigável para iniciantes |
| Serviço de ficheiros estáticos | Middleware `static` do Express | Mantém a arquitetura simples (um servidor) |
| Normalização anual | Dividir por 12 no momento da query | Mantém os dados armazenados conforme introduzidos, cálculo na camada de serviço |
| Formato de erro | Envelope `{ success, data/error }` | Consistente, fácil de tratar no frontend |

---