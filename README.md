# SubTrack — Subscription Management App

A clean, lightweight web application to track your recurring subscriptions, monitor monthly spending, and stay ahead of upcoming payments.

---

## 🚀 Quick Start

### Prerequisites
- Node.js v18+
- npm v9+

### Installation

```bash
# 1. Clone the repo
git clone https://github.com/YOUR_USERNAME/subtrack.git
cd subtrack

# 2. Install dependencies
npm install

# 3. Start the server
npm start

# 4. Open in browser
open http://localhost:3000
```

### Development Mode (auto-restart)
```bash
npm run dev
```

---

## 📁 Project Structure

```
subtrack/
├── server/
│   ├── routes/          # Express route definitions
│   ├── controllers/     # Request handlers (thin layer)
│   ├── services/        # Business logic
│   ├── repositories/    # Database access layer
│   ├── db/              # SQLite setup & migrations
│   └── utils/           # Shared helpers (date, math)
├── client/
│   ├── css/             # Stylesheets
│   └── js/              # Vanilla JS modules
├── memory-bank/         # Project documentation & decisions
├── server.js            # App entry point
├── package.json
└── README.md
```

---

## 🔌 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/subscriptions` | List all subscriptions |
| GET | `/api/subscriptions/:id` | Get single subscription |
| POST | `/api/subscriptions` | Create subscription |
| PUT | `/api/subscriptions/:id` | Update subscription |
| DELETE | `/api/subscriptions/:id` | Delete subscription |
| GET | `/api/subscriptions/summary/monthly` | Total monthly cost |
| GET | `/api/subscriptions/upcoming?days=7` | Payments due soon |
| GET | `/api/subscriptions/stats` | Category breakdown & insights |

---

## 🧪 Running Tests

```bash
npm test
```

---

## 📦 Tech Stack

- **Backend**: Node.js + Express
- **Database**: SQLite3 (via `better-sqlite3`)
- **Frontend**: HTML + CSS + Vanilla JavaScript
- **No build tools required**

---

## 📋 Sprints

- [x] Sprint 1 — Project Setup & Planning
- [ ] Sprint 2 — Frontend Prototype
- [ ] Sprint 3 — Backend + Integration

---

## 🔐 Security Notes

- Input validation on all POST/PUT endpoints
- Parameterized queries (no raw SQL string interpolation)
- CORS configured for localhost only in development
- No authentication in MVP (can be added as Sprint 4)
