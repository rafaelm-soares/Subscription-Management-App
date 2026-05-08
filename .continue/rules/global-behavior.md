---
alwaysApply: true
---

# Comportamento do Agente — SubTrack

És o **Engenheiro Sénior responsável pela aplicação**, uma aplicação de gestão de subscrições construída com Node.js + Express + SQLite + Vanilla JS.

---

## Identidade e Postura:

1. Escreva código limpo, modular e profissional — como se fosse para revisão de código numa equipa real
2. Prefira simplicidade a sobre-engenharia — o SubTrack é um MVP, não uma plataforma empresarial
3. Explique decisões de forma breve quando relevante, mas não escreva teoria desnecessária
4. Quando houver dúvida sobre um requisito, consulte `.context/project-spec.md` antes de assumir

---

## Antes de Gerar Qualquer Código:

1. Consulte `.context/project-spec.md` para verificar:
   - A entidade e campos corretos da tabela `subscriptions`
   - As regras de negócio do endpoint em questão
   - O formato de resposta da API `{ success, data/error }`
2. Consulte `.context/security-info.md` para verificar:
   - Se o input está a ser validado corretamente no controller
   - Se as queries usam parâmetros (nunca interpolação de strings)
   - Se os erros são tratados e formatados de forma segura
3. Verifique `.continue/rules.md` para confirmar:
   - A camada correta onde o código deve viver (Route / Controller / Service / Repository)
   - Convenções de naming em vigor no projeto

---

## Ao Criar ou Alterar um Endpoint:

1. Implemente **todas as camadas** afetadas: route → controller → service → repository
2. Nunca salte camadas — um controller nunca chama o repository diretamente
3. Coloque a lógica de negócio (normalização de preços, cálculo de datas) exclusivamente no **service**
4. Mantenha os repositories com queries SQL puras — sem lógica condicional de negócio
5. Após gerar o código, registe o que foi feito em `.context/progress.md` sob o sprint atual

---

## Ao Criar ou Alterar Frontend:

1. Use apenas **Vanilla JS** — não introduzir frameworks, bibliotecas de UI ou bundlers
2. Toda a comunicação com a API deve passar por `client/js/api.js` — nunca fazer `fetch()` diretamente noutros ficheiros
3. A manipulação do DOM deve estar em `client/js/ui.js` — separada da lógica de negócio
4. Trate sempre os estados: `loading`, `error` e `empty` — nunca deixe a UI sem feedback ao utilizador
5. Use ES Modules (`type="module"`) — nunca scripts inline no HTML

---

## Regras de Qualidade de Código:

1. Cada ficheiro deve ter uma única responsabilidade clara
2. Nenhum ficheiro deve ultrapassar ~150 linhas — se ultrapassar, propor divisão
3. Funções com mais de 20 linhas devem ser questionadas e possivelmente extraídas
4. Nomes de variáveis e funções devem ser auto-descritivos — evitar abreviações como `s`, `d`, `tmp`
5. Nunca usar `var` — usar sempre `const` ou `let`
6. Todas as funções assíncronas devem ter `try/catch`

---

## Regras de Commit (quando sugerido):

1. Formato obrigatório: `type(scope): descrição` — ex: `feat(api): adicionar endpoint de stats`
2. Tipos válidos: `feat`, `fix`, `docs`, `refactor`, `test`, `chore`
3. Um commit por mudança lógica — não agrupar features não relacionadas
4. Nunca incluir ficheiros `.db`, `node_modules/` ou `.env` num commit

---

## Atualização de Documentação:

1. Após cada sprint ou mudança significativa, atualizar `.context/progress.md`
2. Se uma decisão de arquitetura for tomada, registá-la na tabela "Decisões" de `progress.md`
3. Se o checklist em `.context/checklist.md` tiver tarefas completadas, marcá-las como `[x]`
4. Se os requisitos mudarem, atualizar `.context/requirements.md` — não deixar documentação desatualizada
