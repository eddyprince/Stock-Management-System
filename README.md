# Stock Management Control System

A web application for managing stock information: **in stock**, **out of stock**, **expired**, and **damaged** quantities. Built with **Vue 3**, **Vite**, **Tailwind CSS**, **Pinia**, **Vue Router** (frontend) and **Node.js**, **Express**, **MongoDB** (backend), following the Task-Buddy / Web Technologies module approach.

## Features

- **Login** with role-based access: **Account**, **Stock Manager**, **Admin**, **Director**
- **Dashboard**: overview of in stock, out of stock, expired, damaged
- **Products**: add/edit products with **supplier (where from)** and **total supplied amount**; record in/out/damaged movements
- **Reports** (Director/Admin): expired items, in stock, damaged summary, totals
- **User management** (Admin only): create users with roles
- **Account** page for current user info

## Default admin login

- **Username:** `admin`
- **Password:** `123`

## Project structure

```
StockManagementSystem/
├── docs/                 # System documentation and diagrams
│   ├── SYSTEM_OVERVIEW.md   # How the system works, use case, DFD, class diagram
│   └── DIAGRAMS.md          # Mermaid diagrams reference
├── backend/               # Express + MongoDB API
│   ├── src/
│   │   ├── config/        # DB connection
│   │   ├── models/        # User, Product, Supplier, StockTransaction
│   │   ├── routes/        # auth, products, suppliers, reports, users
│   │   ├── middleware/   # JWT auth, requireRole
│   │   ├── server.js
│   │   └── seed.js       # Creates admin user admin/123
│   └── package.json
├── frontend/              # Vue 3 SPA
│   ├── src/
│   │   ├── api/          # Axios client with JWT
│   │   ├── components/   # LoginForm, StockTable, AppNav
│   │   ├── views/        # Login, Dashboard, Products, Reports, Account, Users
│   │   ├── stores/       # Pinia: auth, products, suppliers
│   │   ├── router/       # Routes + auth guard
│   │   ├── App.vue
│   │   └── main.js
│   └── package.json
├── other/                 # Unrelated documents (place here if any)
└── README.md
```

## How to run

### Prerequisites

- Node.js 18+
- **MongoDB** – either running locally on port 27017, or a MongoDB Atlas connection string in backend `.env`

**If the system does not start:** the backend exits when it cannot connect to MongoDB. See **[RUNNING.md](RUNNING.md)** for why it fails and how to fix it (local MongoDB or Atlas).

### Backend

```bash
cd backend
npm install
cp .env.example .env
# Edit .env if needed (MONGODB_URI, JWT_SECRET)
npm run seed    # Create admin user admin / 12345678
npm run dev     # Server on http://localhost:3000
```

### Frontend

```bash
cd frontend
npm install
npm run dev     # App on http://localhost:5173 (proxies /api to backend)
```

Open http://localhost:5173, log in with `admin` / `12345678`, and use Dashboard, Products, Reports, Users, Account as per your role.

## Documentation (Software engineer view)

See **`docs/SYSTEM_OVERVIEW.md`** for:

- How the system works (SPA, roles, stock data flow)
- **Use case diagram** (Mermaid)
- **Data flow diagram** (Level 0 and Level 1)
- **Class diagram** (User, Product, Supplier, StockTransaction, Report)
- **Sequence diagram** (login and view stock)
- **Component architecture** (Vue)

Diagrams are in Mermaid format and can be viewed on GitHub or in any Mermaid-compatible viewer.

## Tech alignment (Task-Buddy / Web Tech)

- **Vue 3 Composition API**: components with `setup`, `ref`, `computed`, `onMounted`
- **Props / Emit**: parent→child data (props), child→parent events (emit)
- **Pinia**: global state (auth, products, suppliers); actions and getters
- **Vue Router**: routes and navigation guards (`requiresAuth`, `roles`)
- **Async/await**: all API calls; UI waits for responses
- **Tailwind CSS**: utility-first styling; custom primary (teal) and accent (amber) colours

## Security notes

- Passwords hashed with bcrypt (backend)
- JWT for session; stored in `localStorage` (frontend)
- Role checks on API routes (admin, stock_manager, director)
- CORS and `JWT_SECRET` should be set properly in production; never commit `.env` with real secrets
