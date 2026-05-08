# Especificação: SubTrack — Subscription Management App

O objetivo é criar uma aplicação web completa (Node.js + Express + SQLite) que permita ao utilizador gerir as suas subscrições recorrentes, calcular custos mensais e acompanhar pagamentos futuros.

---

## Entidade Principal: `subscriptions`

A aplicação gira em torno de uma única tabela SQLite com os seguintes campos obrigatórios:

1. `id` — Chave primária auto-incremental (INTEGER)
2. `name` — Nome da subscrição, ex: "Netflix" (TEXT, NOT NULL)
3. `price` — Preço conforme inserido pelo utilizador (REAL, NOT NULL)
4. `billingCycle` — Ciclo de faturação: apenas `'monthly'` ou `'yearly'` (TEXT, NOT NULL)
5. `nextPayment` — Data do próximo pagamento no formato `YYYY-MM-DD` (TEXT, NOT NULL)
6. `category` — Categoria: `'entertainment'`, `'fitness'`, `'software'`, `'other'` (TEXT, DEFAULT `'other'`)
7. `createdAt` — Data de criação, definida automaticamente pela base de dados (TEXT, DEFAULT `datetime('now')`)

---

## Regras de Negócio:

1. O campo `name` é obrigatório e não pode estar vazio
2. O campo `price` deve ser um número positivo (> 0)
3. O `billingCycle` só aceita os valores `'monthly'` ou `'yearly'` — qualquer outro valor deve ser rejeitado
4. O `nextPayment` deve ser uma data válida no formato ISO `YYYY-MM-DD`
5. A `category` é opcional; se omitida, assume o valor `'other'`
6. O `createdAt` nunca é definido pelo código da aplicação — é sempre o default da base de dados

---

## Normalização de Custos (Regra Crítica):

1. As subscrições com `billingCycle = 'yearly'` são normalizadas a custo mensal dividindo o `price` por 12
2. Esta normalização acontece **apenas na camada de serviço** (`subscriptionService.js`) — o valor original é sempre preservado na base de dados
3. O total mensal (`GET /summary/monthly`) soma todos os custos já normalizados
4. Exemplo: Netflix €120/ano → exibido como €10/mês no resumo

---

## Algoritmo de Pagamentos Futuros:

1. Calcular a diferença em dias entre hoje (`Date()` sem horas) e o `nextPayment` de cada subscrição
2. Filtrar apenas as subscrições onde essa diferença seja ≥ 0 e ≤ N (onde N vem do query param `?days=`, default 7)
3. Ordenar o resultado por `nextPayment` ascendente (mais próximo primeiro)
4. O cálculo de dias está isolado em `server/utils/dateUtils.js` — `daysUntil(dateStr)`

---

## Endpoints da API:

1. `GET    /api/subscriptions`                — Lista todas as subscrições
2. `GET    /api/subscriptions/:id`            — Detalhe de uma subscrição
3. `POST   /api/subscriptions`               — Cria nova subscrição
4. `PUT    /api/subscriptions/:id`           — Atualiza subscrição existente
5. `DELETE /api/subscriptions/:id`           — Remove subscrição
6. `GET    /api/subscriptions/summary/monthly` — Total mensal normalizado
7. `GET    /api/subscriptions/upcoming?days=7` — Pagamentos nos próximos N dias
8. `GET    /api/subscriptions/stats`          — Agrupamento por categoria + totais

> ⚠️ As rotas específicas (`/summary/monthly`, `/upcoming`, `/stats`) devem ser registadas **antes** da rota paramétrica (`/:id`) no ficheiro de rotas, para evitar conflitos de matching no Express.

---

## Formato de Resposta da API:

Todas as respostas seguem o envelope padrão:

```json
// Sucesso
{ "success": true, "data": <payload> }

// Erro
{ "success": false, "error": "Mensagem legível pelo utilizador" }
```

---

## Arquitetura de Camadas (obrigatória):

```
Routes → Controllers → Services → Repositories → SQLite
```

1. **Routes** — apenas registo de URLs e delegação ao controller
2. **Controllers** — validação do input HTTP, formatação da resposta
3. **Services** — toda a lógica de negócio (normalização, cálculos, agrupamentos)
4. **Repositories** — queries SQL parametrizadas, devolve objetos simples
5. **Utils** — funções puras sem dependências externas (`mathUtils.js`, `dateUtils.js`)

---

## Exemplos:

### Subscrição válida (POST body):
```json
{
  "name": "Spotify",
  "price": 9.99,
  "billingCycle": "monthly",
  "nextPayment": "2026-05-15",
  "category": "entertainment"
}
```

### Subscrição inválida — deve ser rejeitada:
```json
{ "name": "", "price": -5, "billingCycle": "weekly", "nextPayment": "not-a-date" }
```

### Resposta do summary/monthly (exemplo):
```json
{
  "success": true,
  "data": {
    "totalMonthly": 34.99,
    "count": 4,
    "currency": "EUR"
  }
}
```
