# Why is the system not running?

The backend **requires MongoDB**. If MongoDB is not installed or not running, the server will fail to start with:

`MongoDB connection error: connect ECONNREFUSED 127.0.0.1:27017`

## Fix: use one of these options

### Option 1 – Install and run MongoDB locally

1. **Install MongoDB** (if not installed):
   - Windows: https://www.mongodb.com/try/download/community  
   - Or with Chocolatey: `choco install mongodb`
   - Or use MongoDB Atlas (cloud, no local install): https://www.mongodb.com/cloud/atlas (see Option 2)

2. **Start MongoDB**:
   - **Windows (Service):** Open Services, find "MongoDB", start it.  
   - **Or from terminal:** run `mongod` (if it’s on your PATH).

3. **Then start the app**:
   ```bash
   # Terminal 1 – Backend
   cd backend
   cp .env.example .env
   npm run seed
   npm run dev

   # Terminal 2 – Frontend
   cd frontend
   npm run dev
   ```
   Open http://localhost:5173 and log in with **admin** / **123**.

---

### Option 2 – Use MongoDB Atlas (no local MongoDB)

1. Go to https://www.mongodb.com/cloud/atlas and create a free cluster.
2. Create a database user and get the **connection string** (e.g. `mongodb+srv://user:pass@cluster.mongodb.net/stock_management`).
3. In the project **backend** folder, create a `.env` file (or copy from `.env.example`) and set:
   ```env
   MONGODB_URI=your_atlas_connection_string_here
   PORT=3000
   JWT_SECRET=any-long-random-string
   ```
4. Start backend and frontend as in Option 1 (step 3). Run `npm run seed` once to create the admin user.

---

## Quick checklist

| Step | Command / action |
|------|-------------------|
| 1. MongoDB running? | Start `mongod` or MongoDB service, or use Atlas URI in `.env` |
| 2. Backend .env | `cd backend` → copy `.env.example` to `.env` (set `MONGODB_URI` if using Atlas) |
| 3. Seed admin user | `cd backend` → `npm run seed` |
| 4. Start backend | `cd backend` → `npm run dev` (should show "MongoDB connected" and "Server running on http://localhost:3000") |
| 5. Start frontend | `cd frontend` → `npm run dev` (opens at http://localhost:5173) |
| 6. Login | Username: **admin**, Password: **123** |

If the backend still won’t start, check the exact error in the terminal; it will now appear within a few seconds instead of hanging.
