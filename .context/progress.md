# SubTrack — Registo de Progresso

---

## Sprint 1 — Configuração do Projeto & Planeamento
**Estado**: ✅ Completo  
**Data**: 2026-05-08

### Entregues
- Estrutura completa de pastas do projeto
- `package.json` com todas as dependências necessárias
- `.gitignore`
- `README.md` com quick-start e referência da API
- `.context/rules.md` — standards e convenções de código
- `.context/architecture.md` — design do sistema, modelo de dados, responsabilidades das camadas
- `.context/checklist.md` — acompanhamento de tarefas sprint a sprint
- `.context/progress.md` — este ficheiro
- `.context/requirements.md` — requisitos funcionais e não funcionais

### Decisões Tomadas
| Decision | Rationale |
|----------|-----------|
| `better-sqlite3` em vez de `sqlite3` | A API síncrona é muito mais limpa — sem callback hell para uma ferramenta pessoal |
| ES Modules no frontend | Suporte nativo do browser, sem necessidade de bundler |
| `index.html` único + routing JS | O MVP não precisa de múltiplos ficheiros HTML; a troca de vistas é tratada por JS |
| `YYYY-MM-DD` para datas na DB | O formato ISO ordena corretamente como string; sem complexidade de datetime |

### Notas
- Sem decisões disruptivas; tudo reversível nesta fase
- Auth deliberadamente excluído do âmbito do MVP

---

## Sprint 2 — Protótipo Frontend
**Estado**: ⬜ Não Iniciado

---

## Sprint 3 — Backend + Integração
**Estado**: ⬜ Não Iniciado