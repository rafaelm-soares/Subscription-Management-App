# SubTrack — Requisitos

---

## Requisitos Funcionais

### FR-01: Gestão de Subscrições (CRUD)
- **FR-01.1** O utilizador pode criar uma subscrição com: nome, preço, ciclo de faturação (mensal/anual), próxima data de pagamento e categoria
- **FR-01.2** O utilizador pode visualizar uma lista de todas as suas subscrições
- **FR-01.3** O utilizador pode visualizar os detalhes de uma única subscrição
- **FR-01.4** O utilizador pode editar qualquer campo de uma subscrição existente
- **FR-01.5** O utilizador pode eliminar uma subscrição (com confirmação)

### FR-02: Resumo de Custos Mensais
- **FR-02.1** O sistema calcula o total de gastos mensais em todas as subscrições
- **FR-02.2** As subscrições anuais são normalizadas para custo mensal (preço ÷ 12)
- **FR-02.3** O dashboard apresenta o valor mensal total em destaque

### FR-03: Pagamentos Próximos
- **FR-03.1** O utilizador pode visualizar subscrições com pagamento previsto dentro de N dias (predefinição: 7)
- **FR-03.2** O dashboard mostra um alerta/painel para pagamentos previstos nos próximos 7 dias
- **FR-03.3** O limite de dias é configurável através de query param (`?days=N`)

### FR-04: Insights & Estatísticas
- **FR-04.1** O sistema agrupa subscrições por categoria
- **FR-04.2** O endpoint de estatísticas devolve: contagem total, total mensal e breakdown por categoria
- **FR-04.3** O dashboard mostra um resumo por categoria (ex.: "Entretenimento: €25/mês")

### FR-05: Navegação
- **FR-05.1** O utilizador pode navegar entre a vista Dashboard e a lista de Subscrições
- **FR-05.2** O utilizador pode abrir um formulário Adicionar/Editar a partir da vista Subscrições
- **FR-05.3** O formulário pode ser pré-preenchido para editar uma subscrição existente

---

## Requisitos Não Funcionais

### NFR-01: Performance
- As respostas da API devem ser devolvidas em < 200ms sob carga normal (utilizador único, SQLite)
- O frontend deve renderizar o dashboard em < 1 segundo no primeiro carregamento

### NFR-02: Usabilidade
- A aplicação deve ser utilizável sem qualquer documentação ou formação
- Todos os estados de erro devem mostrar uma mensagem legível para humanos (não stack traces)
- Os formulários devem indicar campos obrigatórios e validar antes do envio

### NFR-03: Fiabilidade
- O ficheiro da base de dados deve ser criado automaticamente na primeira execução (sem configuração manual)
- A aplicação deve sobreviver a um reinício do servidor sem perda de dados
- A eliminação de uma subscrição deve ser confirmada para evitar perda acidental de dados

### NFR-04: Manutenibilidade
- O código está organizado por camadas (routes → controllers → services → repositories)
- Cada ficheiro tem uma responsabilidade única e clara
- Nenhum ficheiro excede ~150 linhas de código
- A lógica de negócio está isolada na camada de serviços (fácil de testar)

### NFR-05: Segurança (nível MVP)
- Todas as queries DB utilizam statements parametrizados (sem concatenação de strings)
- O input do utilizador é validado antes de chegar à base de dados
- O CORS está configurado (apenas localhost em desenvolvimento)
- Nenhuma credencial sensível armazenada no código ou `.env` para o MVP (sem auth necessário)

### NFR-06: Compatibilidade
- Executa em Node.js 18+
- O frontend funciona nas versões mais recentes de Chrome, Firefox e Safari
- Sem necessidade de ferramentas de build — `npm install && npm start` é suficiente

### NFR-07: Portabilidade
- Toda a aplicação (incluindo a DB) executa localmente sem serviços externos
- O ficheiro SQLite é o único artefacto com estado

---

## Fora do Âmbito (MVP)

- Autenticação de utilizadores / suporte multi-utilizador
- Notificações por email ou push
- Tracking automático de renovação de subscrições
- Aplicação mobile nativa
- Exportação de dados (CSV/PDF)
- Conversão de moeda