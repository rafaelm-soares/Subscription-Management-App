# SubTrack — Project Rules

## Coding Standards

### General
- All files use 2-space indentation
- Use `const`/`let` (never `var`)
- Arrow functions for callbacks; named functions for module exports
- Always handle errors — never swallow exceptions silently
- Every async function wraps DB calls in try/catch

### Naming Conventions
| Layer | Convention | Example |
|-------|-----------|---------|
| Files | camelCase | `subscriptionService.js` |
| Variables | camelCase | `nextPayment` |
| Constants | UPPER_SNAKE | `MAX_DAYS_AHEAD` |
| DB columns | camelCase | `billingCycle` |
| API routes | kebab-case | `/api/subscriptions/summary/monthly` |

### Architecture Rules
1. **Routes** only call Controllers — no logic here
2. **Controllers** only call Services — validate request shape, format response
3. **Services** contain business logic — call Repositories for data
4. **Repositories** only talk to the database — return plain objects
5. **No cross-layer skipping** (Controller must not call Repository directly)

### API Response Shape
All API responses follow this envelope:
```json
// Success
{ "success": true, "data": <payload> }

// Error
{ "success": false, "error": "Human-readable message" }
```

### Database Rules
- Always use parameterized queries: `stmt.run({ id, name })` not string templates
- Migrations live in `server/db/migrate.js` — never modify the schema by hand
- `createdAt` is always set by the DB default, never by application code

## Git Rules
- Commit messages: `type(scope): description` — e.g. `feat(api): add upcoming payments endpoint`
- Types: `feat`, `fix`, `docs`, `refactor`, `test`, `chore`
- One logical change per commit
- Never commit `.db` files or `node_modules`

## Sprint Rules
- Each sprint ends with updated `memory-bank/progress.md`
- No Sprint N+1 work starts until Sprint N checklist is ✅ complete
- Any scope change is recorded in `memory-bank/progress.md` under "Decisions"
