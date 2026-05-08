---
alwaysApply: true
---

# Guardrails de Segurança — SubTrack

Estas regras aplicam-se a **todas** as gerações de código para o projeto SubTrack.
Nenhum código deve ser gerado que viole qualquer ponto abaixo.

---

## Validação de Input:

1. Todos os campos recebidos via `req.body` devem ser validados no **controller** antes de chegarem ao service
2. O campo `name` não pode ser string vazia, `null` ou `undefined`
3. O campo `price` deve ser do tipo `number` e estritamente maior que `0`
4. O campo `billingCycle` só aceita os valores literais `'monthly'` ou `'yearly'` — rejeitar qualquer outro valor com HTTP 400
5. O campo `nextPayment` deve ser uma data válida — validar com `!isNaN(new Date(value))` e verificar formato `YYYY-MM-DD`
6. Parâmetros de rota (`:id`) devem ser validados como inteiros positivos — rejeitar valores não numéricos com HTTP 400
7. Query params (`?days=`) devem ser convertidos para inteiro e limitados a um intervalo razoável (1–365)

---

## Proteção da API:

1. Usar sempre `express.json()` com limite de tamanho para evitar payloads excessivos: `express.json({ limit: '10kb' })`
2. O middleware `cors()` deve ser configurado explicitamente — em desenvolvimento, apenas `http://localhost:3000`
3. Nunca expor stack traces ao cliente — em produção, a resposta de erro deve ser genérica
4. Rotas inexistentes (`404`) devem retornar o envelope padrão `{ success: false, error: "Not found" }`, não a página default do Express
5. Métodos HTTP não suportados numa rota devem retornar HTTP 405

---

## Queries à Base de Dados:

1. **Proibido** usar interpolação de strings em queries SQL — usar sempre queries parametrizadas com `better-sqlite3`
2. Exemplo correto: `stmt.run({ name, price, billingCycle, nextPayment, category })`
3. Exemplo **proibido**: `` db.exec(`INSERT INTO subscriptions VALUES ('${name}', ...)`) ``
4. O ficheiro da base de dados (`subtrack.db`) não deve ser exposto como ficheiro estático
5. A pragma `journal_mode = WAL` deve estar ativa para evitar corrupção em leituras concorrentes

---

## Logging Seguro:

1. Nunca fazer `console.log(req.body)` completo em produção — pode expor dados do utilizador
2. Logs de erro devem registar o tipo de erro e o endpoint, mas não os valores dos campos
3. Exemplo correto: `console.error('[POST /api/subscriptions] Validation failed: missing name')`
4. Exemplo **proibido**: `console.error('Body received:', req.body)`
5. Não usar `console.log` para debug em código que vai para o repositório — usar comentários `// DEBUG:` e remover antes do commit

---

## Gestão de Erros:

1. Todos os controllers devem ter bloco `try/catch` envolvendo as chamadas ao service
2. Erros de validação devem retornar HTTP **400** com mensagem descritiva
3. Recursos não encontrados devem retornar HTTP **404** com `{ success: false, error: "Subscription not found" }`
4. Erros internos inesperados devem retornar HTTP **500** com mensagem genérica ao cliente (nunca a stack trace)
5. O handler global de erros do Express deve ser o último middleware registado em `server.js`

---

## Hardening:

1. A dependência `better-sqlite3` deve ser mantida atualizada — verificar `npm audit` antes de cada sprint
2. Não armazenar API keys, secrets ou passwords em nenhum ficheiro do repositório
3. O ficheiro `.env` (se criado no futuro) deve estar no `.gitignore`
4. O campo `createdAt` nunca deve ser aceite via `req.body` — é sempre definido pela base de dados
5. Não expor o caminho absoluto do ficheiro `.db` em mensagens de erro visíveis ao cliente

---

## Considerações de Privacidade:

1. O SubTrack é uma ferramenta local/pessoal — não recolhe dados de terceiros
2. Não implementar analytics, tracking ou telemetria no MVP
3. Os dados de subscrição (nomes, preços) pertencem ao utilizador — não devem ser transmitidos para serviços externos
4. Se no futuro for adicionada autenticação, as passwords devem ser sempre hashed com `bcrypt` (nunca texto plano)

---

## Controlo de Acesso (MVP):

1. No MVP não existe autenticação — a aplicação é de uso local single-user
2. Não bloquear rotas com middleware de auth no MVP, mas estruturar o código de forma a facilitar a adição futura
3. Quando a autenticação for implementada (Sprint 4+), usar JWT com expiração curta (ex: 1h) e refresh tokens
4. Nunca implementar autenticação básica (Basic Auth) com credenciais em texto no header
