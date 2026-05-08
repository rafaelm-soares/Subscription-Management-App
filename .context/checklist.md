# SubTrack — Checklist de Sprint

---

## ✅ Sprint 1 — Configuração do Projeto & Planeamento

### Estrutura & Configuração
- [x] Estrutura de diretórios do projeto criada
- [x] `package.json` com as dependências corretas
- [x] `.gitignore` configurado
- [x] `README.md` escrito

### Documentação
- [x] `.context/rules.md`
- [x] `.context/architecture.md`
- [x] `.context/checklist.md` (este ficheiro)
- [x] `.context/progress.md`
- [x] `.context/security-info.md`
- [x] Requisitos funcionais documentados
- [x] Requisitos não funcionais documentados
- [x] Instruções de configuração do GitHub fornecidas

---

## ⬜ Sprint 2 — Protótipo Frontend

### HTML/CSS
- [ ] `client/index.html` — layout base com navegação
- [ ] `client/css/main.css` — sistema de design (variáveis, reset, base)
- [ ] `client/css/dashboard.css` — estilos específicos do dashboard
- [ ] `client/css/forms.css` — estilos de formulários
- [ ] Vista do dashboard renderiza corretamente (dados estáticos)
- [ ] Vista da lista de subscrições renderiza
- [ ] Modal/formulário de Adicionar/Editar renderiza

### JavaScript (sem backend ainda)
- [ ] `client/js/api.js` — stub com dados mock
- [ ] `client/js/ui.js` — funções de renderização
- [ ] `client/js/utils.js` — helpers de formatação
- [ ] `client/js/app.js` — inicialização da aplicação

### QA
- [ ] Plano de testes funcionais escrito
- [ ] Testes manuais para todos os estados da UI (vazio, loading, erro, preenchido)
- [ ] README atualizado

---

## ⬜ Sprint 3 — Backend + Integração

### Backend
- [ ] `server.js` — ponto de entrada da aplicação Express
- [ ] `server/db/database.js` — ligação SQLite
- [ ] `server/db/migrate.js` — criação de tabelas
- [ ] `server/repositories/subscriptionRepository.js` — todas as queries DB
- [ ] `server/services/subscriptionService.js` — lógica de negócio
- [ ] `server/controllers/subscriptionController.js` — handlers de requests
- [ ] `server/routes/subscriptionRoutes.js` — ligação das rotas
- [ ] `server/utils/dateUtils.js`
- [ ] `server/utils/mathUtils.js`

### Endpoints API
- [ ] `GET /api/subscriptions`
- [ ] `GET /api/subscriptions/:id`
- [ ] `POST /api/subscriptions`
- [ ] `PUT /api/subscriptions/:id`
- [ ] `DELETE /api/subscriptions/:id`
- [ ] `GET /api/subscriptions/summary/monthly`
- [ ] `GET /api/subscriptions/upcoming?days=7`
- [ ] `GET /api/subscriptions/stats`

### Integração
- [ ] `client/js/api.js` — chamadas fetch reais substituindo os mocks
- [ ] CRUD completo funcional end-to-end
- [ ] Painel de resumo a obter dados em tempo real
- [ ] Pagamentos futuros a obter dados em tempo real
- [ ] Estados de erro tratados na UI

### QA
- [ ] Todos os endpoints API testados com curl/Postman
- [ ] Teste manual end-to-end do fluxo completo do utilizador
- [ ] README atualizado com instruções finais de execução