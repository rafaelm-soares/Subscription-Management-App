# SubTrack — Progress Log

---

## Sprint 1 — Project Setup & Planning
**Status**: ✅ Complete

### Delivered
- Full project folder structure
- `package.json`, `.gitignore`, `README.md`
- `memory-bank/` — rules, architecture, checklist, requirements, project-spec, security-info, global-behavior

### Decisions
| Decision | Rationale |
|----------|-----------|
| `better-sqlite3` over `sqlite3` | Sync API = no callbacks |
| ES Modules on frontend | No bundler, native browser support |
| `YYYY-MM-DD` for dates | Sorts correctly as text |
| `{ success, data/error }` envelope | Uniform response shape |

---

## Sprint 2 — Frontend Prototype
**Status**: ✅ Complete

### Delivered
- `client/index.html` — full layout: sidebar, topbar, 3 views, 2 modals, toast
- `client/css/main.css` — complete design system (dark theme, Syne + DM Mono fonts, CSS variables)
- `client/js/utils.js` — pure helpers: formatCurrency, toMonthly, daysUntil, formatDate, iconColor, urgencyClass
- `client/js/api.js` — full mock data layer with in-memory store (5 sample subs), matching Sprint 3 API contract
- `client/js/ui.js` — all render functions: stats, alert strip, dashboard list, category breakdown, table, upcoming cards, toast
- `client/js/app.js` — full app controller: navigation, CRUD wiring, form validation, live preview, keyboard shortcuts

### UI Features Working (static / mock)
- Dashboard with 4 stat cards + animated category bars + alert strip
- Subscriptions table with edit/delete per row
- Upcoming payments view with urgency color coding (red/amber/green)
- Add/Edit modal with live monthly cost preview
- Delete confirmation modal
- Toast notifications (success/error)
- Escape key closes modals
- Click outside modal closes it

### Decisions
| Decision | Rationale |
|----------|-----------|
| Mock layer returns Promises with fake delay | Identical interface to real API; zero changes needed in app.js for Sprint 3 |
| `iconColor()` deterministic by name hash | Consistent colors per service, no DB storage needed |
| Category bar widths via CSS transition | Smooth animation on load, pure CSS |
| Separate `ui.js` render functions | Easy to test in isolation; no business logic mixed in |

---

## Sprint 3 — Backend + Integration
**Status**: ⬜ Not Started
