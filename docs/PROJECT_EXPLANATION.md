# Stock Management Control System — Project Explanation

This document explains **what** the system does, **how** it is built technically, and **how it matches** the AUCA mid‑term requirements (architecture, security, UX, accessibility, diagrams, and tools like Vue/Pinia/MongoDB).

---

## 1. High‑level system description

The Stock Management Control System is a **role‑based web application** that helps an organization track stock items:

- **In stock / available**
- **Out of stock**
- **Expired**
- **Damaged**

Users log in with different roles:

- **Admin** – full access, user management, configuration.
- **Stock Manager** – manages products, suppliers, stock movements (in/out/damaged).
- **Director** – reads dashboards and reports only (no editing).
- **Account** – personal account area (basic user).

After login, each role sees a **dashboard** and menu focused on its responsibilities. All stock and user data is stored in **MongoDB**, behind a **Node.js + Express API**. The frontend is a **Vue 3 Single Page Application (SPA)** using **Vue Router** for navigation and **Pinia** for global state.

---

## 2. Technology stack and purpose of each tool

### 2.1 Frontend

- **Vue 3 (Composition API)**  
  - Core UI framework, component‑based architecture.  
  - Used to build pages (`views`) like `LandingView`, `LoginView`, `DashboardView`, `ProductsView`, `ReportsView`, `AccountView`, `UsersView`.  
  - Composition API (`<script setup>`, `ref`, `computed`, `onMounted`) is used to group related logic together (state, actions, computed values inside each component).

- **Vite**  
  - Build and dev server tool.  
  - Handles bundling, hot‑module reload, and proxying `/api` requests to the backend (`http://localhost:3000`).  
  - Config: `frontend/vite.config.js` (`server.port = 5173`).

- **Vue Router**  
  - Manages **client‑side routing** (SPA).  
  - File: `frontend/src/router/index.js`.  
  - Routes:
    - `/` → `LandingView` (public marketing/landing page).
    - `/login`, `/register` → authentication screens.
    - `/dashboard`, `/products`, `/reports`, `/account`, `/users` → protected pages with `meta.requiresAuth` and `meta.roles` where applicable.
  - Uses a **navigation guard** (`router.beforeEach`) to:
    - Redirect unauthenticated users to `/login` for protected routes.
    - Prevent logged‑in users from revisiting `/` / `/login` / `/register` and redirect them to their dashboard based on role (Director → Reports, others → Dashboard).

- **Pinia**  
  - Centralized **state management** replacing Vuex.  
  - Stores:
    - `auth` (`frontend/src/stores/auth.js`) – JWT, current user, login/logout/register, `updateProfile`, `changePassword`, `fetchMe`.
    - `products` (`frontend/src/stores/products.js`) – list of products, filters (`all`, `in_stock`, `out_of_stock`, `expired`), actions to fetch/add/update products and stock transactions, error state.
    - `suppliers` (`frontend/src/stores/suppliers.js`) – list of suppliers and create supplier.
  - Components do **not** talk to `axios` directly; instead they call store actions (e.g. `productsStore.fetchProducts()`). This decouples UI from data logic.

- **Axios**  
  - HTTP client; file `frontend/src/api/client.js`.  
  - Configures base URL (`/api`) and automatically attaches the JWT from `localStorage` in the `Authorization: Bearer <token>` header.  
  - Interceptor: if backend returns 401, clears token and redirects to `/login`.

- **Tailwind CSS**  
  - Utility‑first CSS.  
  - Config in `frontend/tailwind.config.js` with custom color palette:
    - `primary` (teal) for buttons and highlight.
    - `accent` (amber) and dark `surface` colors.  
  - Used heavily in:
    - **Landing page**: purple gradient hero, yellow CTAs, responsive layout.  
    - **Dashboard**: dark‑mode, neon‑style cards and sidebar, similar to the reference design screenshot.  
    - Forms and tables: consistent spacing, borders, focus rings, responsive grids.

### 2.2 Backend

- **Node.js + Express**  
  - REST API layer. File: `backend/src/server.js`.  
  - Endpoints (all prefixed with `/api`):
    - `/auth` – login, register, get current user, update profile, change password.
    - `/products` – CRUD for products and stock transactions.
    - `/suppliers` – CRUD for suppliers.
    - `/reports` – summary of stock (expired, damaged, totals) for Director/Admin.
    - `/users` – list/create users (Admin only).
  - Uses CORS and JSON body parsing.

- **MongoDB + Mongoose**  
  - Data store; models in `backend/src/models/*.js`:
    - `User` – username, hashed password, role, email, displayName, timestamps.
    - `Product` – name, sku, quantities, totalSupplied, supplier reference, expiry, unitPrice.
    - `Supplier` – supplier identity and contact.
    - `StockTransaction` – each “movement” (in/out/damaged) of stock with quantity/amount and user.  
  - `backend/src/config/db.js` connects using `MONGODB_URI` from `.env` (Atlas or localhost).  
  - Mongoose schemas enforce required fields and types; pre‑save hooks hash passwords.

- **JWT (jsonwebtoken)**  
  - Used for **authentication tokens**.  
  - On login, backend signs `{ userId, role }` with `JWT_SECRET` and sets an expiry (7 days).  
  - On each request, frontend sends JWT; backend middleware verifies token and attaches `req.user`.

- **bcryptjs**  
  - Password hashing.  
  - `User` model has a pre‑save hook that hashes `password` before storing it; `comparePassword()` checks a plain password against the hash.

### 2.3 Other utilities

- **Mermaid & PlantUML** (in `docs/`) – for generating diagrams.  
- **python-pptx** (optional, in `docs/create_presentation.py`) – script that builds a PowerPoint summary file.

---

## 3. How components and state work together

### 3.1 Router → Views → Components

- `App.vue`
  - Wraps the app and shows `AppNav` (top navigation) only when `auth.isAuthenticated` is true.
  - `RouterView` then loads the correct `View` based on the current route.

- **LandingView** (`/`)
  - Public, light‑mode hero section (purple gradient, yellow CTAs).  
  - Encourages users to **Sign in** or **Create account**, but does not display any stock data.

- **LoginView** (`/login`)
  - Contains `LoginForm` component.  
  - On success, uses auth store to navigate to **Dashboard** or **Reports** (for Director).  
  - Shows a small message after successful registration.

- **DashboardView** (`/dashboard`)
  - Dark, professional dashboard similar to your reference screenshot.  
  - Left sidebar (Dashboard, Charts, Stock status, Reports).  
  - Top search bar.  
  - KPI cards: In Stock, Out of Stock, Expired, Damaged (using computed `stats`).  
  - Pseudo bar chart for distribution (computed heights via `kpiHeight(value)`).  
  - Filter pills to control the stock table view by status.  
  - Products table (reuses `StockTable` component) and an empty‑state message.

- **ProductsView** (`/products`)
  - Form to **add/edit products** with supplier and total supplied.  
  - Quick section to add suppliers.  
  - Controls to record stock movements (in/out/damaged).  
  - Uses `productsStore` and `suppliersStore` to read/write data.

- **ReportsView** (`/reports`)
  - Summaries and tables for Director/Admin: counts, totals, expired items, damaged items.  
  - Uses backend `/reports` endpoint.

- **AccountView** (`/account`)
  - Personal profile page:
    - shows username, role, email, displayName.  
    - profile edit form (email, displayName) calling `auth.updateProfile`.  
    - change password form calling `auth.changePassword`.

- **UsersView** (`/users`)
  - Admin‑only view to list users and create new users with roles.

- **Reusable components**
  - `AppNav` – top navigation bar with links visible based on role; Logout calls `auth.logout()` and routes to `/login`.
  - `LoginForm` – handles login form state; emits `success` to parent.  
  - `StockTable` – reusable table for products. Takes `products` and `show-actions` props; emits `record` when the user wants to record a stock movement.

### 3.2 State flow (Pinia)

- **Auth store (`auth.js`)**
  - `token` and `user` are central pieces of state.  
  - `login(username, password)`:
    - Calls `/auth/login` (Axios).
    - Receives `{ token, user }` and stores these in the Pinia state and `localStorage`.  
  - `register` – calls `/auth/register` to create a new account (role `account`).  
  - `updateProfile(payload)` – calls `/auth/profile` and updates `user` state.  
  - `changePassword(currentPassword, newPassword)` – calls `/auth/change-password`.  
  - `isAdmin`, `isStockManager`, `isDirector` – computed booleans used in nav and guards.

- **Products store (`products.js`)**
  - `products` – array of products loaded from `/products`.  
  - `filter` – current filter (all / in_stock / out_of_stock / expired).  
  - `filteredProducts` – computed subset of `products` based on `filter`.  
  - `fetchProducts()` – GET `/products`, sets `products` and clears `productsError` or sets error if backend is down.  
  - `addProduct(payload)` – POST `/products`; updates `products` list.  
  - `updateProduct(id, payload)` – PUT `/products/:id`; updates one product.  
  - `addTransaction(productId, type, quantity, amount, note)` – POST `/products/:id/transaction`; backend adjusts quantities and logs `StockTransaction`.

- **Suppliers store (`suppliers.js`)**
  - `suppliers` – list from `/suppliers`.  
  - `fetchSuppliers`, `addSupplier` – simple actions to manage supplier list.

**Flow example (High‑level):**

1. User logs in → `auth.login` stores user/token.  
2. Router guard sees `auth.isAuthenticated` → allows access to `/dashboard`.  
3. `DashboardView` `onMounted` calls `productsStore.fetchProducts()` → Axios client sends token → backend `/products` → MongoDB → returns JSON.  
4. `DashboardView` uses `productsStore.products` to compute `stats` and pass `filteredProducts` to `StockTable`.

---

## 4. Mapping to AUCA requirements (summary)

- **Vue 3 Composition API** – used in all `views` and `components` (`<script setup>`, `ref`, `computed`, `onMounted`).  
- **Reusable Components, Props, Emits** – `LoginForm`, `StockTable`, `AppNav` with `props`, `$emit`, and event listeners like `@click`, `@submit`.  
- **Vue Router** – configured in `router/index.js` with **guards** enforcing auth and role‑based routes.  
- **Pinia** – `auth`, `products`, `suppliers` stores; views never directly store global state.  
- **At least two roles** – `account`, `stock_manager`, `admin`, `director`.  
- **Authentication simulation** – full login flow with JWT and login UI.  
- **Dashboard per role** – shared main Dashboard for most roles; Director’s primary dashboard is the `ReportsView`.  
- **CRUD** – products and suppliers have full CRUD + stock transactions (CUD history), and users can be created by admin.  
- **Proper folder structure** – `src/assets`, `src/components`, `src/views`, `src/router`, `src/stores`, plus optional `docs`, `plantuml`, etc.

---

## 5. UX and accessibility techniques

- **Clear navigation** – sidebar (Dashboard) and top nav (AppNav) that changes by role. Landing page offers direct “Sign in” and “Create account” buttons.  
- **Error & validation feedback** – login, register, profile, change password, and dashboard backend error states all show human‑friendly messages.  
- **Responsive design** – Tailwind responsive classes ensure good layout from mobile to desktop (flex column → grid → sidebars).  
- **Accessibility**:
  - Semantic `nav`, `main`, `header`, `footer` usage.  
  - Every input has a `<label for>`.  
  - Error messages use small, high‑contrast text (often with `role="alert"` or associated `aria-describedby`).  
  - Focus rings from Tailwind on buttons and links support keyboard navigation.  
  - Colors (dark background with bright `indigo`, `fuchsia`, `amber`, etc.) were chosen with contrast in mind.

---

## 6. Security mindset and secure coding decisions

- **Password security** – backend never stores plain passwords; bcrypt hashes are stored and `comparePassword` checks them.  
- **Authentication & Authorization** – JWT tokens are required for all data routes, and `requireRole` middleware restricts actions (e.g. only Admin can manage users, only Stock Manager/Admin can mutate products).  
- **Avoiding XSS** – All templates use `{{ }}` interpolation (Vue automatically escapes HTML). No un‑sanitized `v-html` usage.  
- **Input validation** – backend checks required fields (username/password for login/register, name/quantities for products) and returns 400/401/403 instead of trusting client.  
- **No secrets in Git** – `.env` files contain DB URI and JWT secret and are ignored by Git; docs explicitly warn not to commit them.  
- **Error handling** – backend consistently returns JSON with `message`, so the frontend can show safe text without leaking stack traces to the UI.

For the formal **Threat Modeling document** you can base your bullets on this section and extend them (assets, attackers, threats, mitigations).

---

## 7. How to explain this project in viva

When presenting, you should be able to describe:

1. **Architecture** – “We have a Vue 3 SPA frontend, Node/Express API, and MongoDB database. Vue Router handles views, Pinia manages state, and Axios connects frontend to backend.”  
2. **State flow** – “Auth store holds the token and user; views read from the store; actions in the store call the API. The dashboard uses computed properties from `productsStore` to calculate stats.”  
3. **Role‑based dashboards** – “The router guards redirect based on role so each persona (Admin, Stock Manager, Director, Account) sees only what they should.”  
4. **Why this folder structure** – “`components` are reusable building blocks, `views` are pages, `stores` centralize state and logic, `router` contains navigation rules. This keeps concerns separated and easier to test or change.”  
5. **Security and accessibility** – highlight password hashing, JWT, role checks, and semantic HTML with proper forms and high‑contrast design.

Use this document together with:

- `docs/SYSTEM_OVERVIEW.md` – high‑level system + diagrams (use case, DFD, class, sequence).  
- `docs/plantuml/` – PlantUML diagrams (easy to export as images for your report).  
- `docs/PRESENTATION_README.md` + `create_presentation.py` – to generate or refine your PowerPoint.

