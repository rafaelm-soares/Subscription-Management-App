# SubTrack 💳

Subscription management web application developed as a final project for a **Vibe Coding training program at Rumos**.

The application helps users manage subscriptions, track monthly expenses, and monitor upcoming payments in a simple and intuitive dashboard.

---

## 🚀 Features

* Add, edit, and remove subscriptions
* Calculate total monthly spending
* Track upcoming payments
* Categorize subscriptions
* Simple dashboard overview

---

## 🎓 Context

This project was developed as part of a **final assessment project** in a Vibe Coding training program at **Rumos**.

The goal was to apply full-stack development concepts, including:

* Backend API design
* Frontend development
* Database integration
* Software architecture principles

---

## 🧱 Tech Stack

**Frontend**

* HTML
* CSS
* Vanilla JavaScript

**Backend**

* Node.js
* Express

**Database**

* SQLite

---

## 📁 Project Structure

```id="v0s6qg"
subtrack/
│
├── server/
│   ├── routes/
│   ├── controllers/
│   ├── services/
│   ├── repositories/
│   ├── db/
│   └── utils/
│
├── client/
│   ├── css/
│   └── js/
│
├── README.md
└── package.json
```

---

## 📌 API Endpoints

### Subscriptions

* GET /api/subscriptions
* GET /api/subscriptions/:id
* POST /api/subscriptions
* PUT /api/subscriptions/:id
* DELETE /api/subscriptions/:id

### Insights

* GET /api/subscriptions/summary/monthly
* GET /api/subscriptions/upcoming
* GET /api/subscriptions/stats

---

## 📅 Development Plan

The project is developed in structured sprints:

### Sprint 1

* Project setup
* Architecture definition
* Documentation (memory-bank)

### Sprint 2

* Frontend prototype
* UI structure without backend integration

### Sprint 3

* Backend implementation
* SQLite integration
* Full system integration

---

## 🔒 Notes

* This is a learning project
* Focus is on architecture, structure, and clean implementation
* Not intended for production use

---

## 👨‍💻 Author

Developed as part of a Vibe Coding training program at Rumos.

---

## 📄 License

MIT
