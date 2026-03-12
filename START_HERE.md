# Start the app (fix “connection refused” and “unsupported”)

**localhost refused to connect** = nothing is running on that port. You must start both the **backend** and the **frontend** (and have **MongoDB** running for the backend).

**“Code launched is unsupported”** = don’t use “Run” on random files. Use the steps below.

---

## Step 1: MongoDB must be running

- **Option A – MongoDB Atlas (no install)**  
  Get a free connection string from https://www.mongodb.com/cloud/atlas  
  In `backend` folder, create `.env` with:
  ```env
  MONGODB_URI=your_atlas_connection_string_here
  ```
- **Option B – MongoDB on your PC**  
  Install MongoDB and start it (e.g. start the “MongoDB” service or run `mongod`).

---

## Step 2: Start backend (Terminal 1)

**In Cursor:** open a terminal (Terminal → New Terminal), then run:

```powershell
cd backend
npm run dev
```

Wait until you see:
- `MongoDB connected`
- `Server running on http://localhost:3000`

If you see **MongoDB connection error**, MongoDB is not running or `MONGODB_URI` is wrong. Fix that first.

**First time only:** in another terminal run:
```powershell
cd backend
npm run seed
```
(This creates the admin user **admin** / **123**.)

---

## Step 3: Start frontend (Terminal 2)

**Open a second terminal** (Terminal → New Terminal), then run:

```powershell
cd frontend
npm run dev
```

You should see something like: `Local: http://localhost:5173/`

---

## Step 4: Open the app

In your browser go to: **http://localhost:5173**

Log in with:
- Username: **admin**
- Password: **123**

---

## Using Run and Debug (optional)

- **Start Backend:** Press **F5** or Run → Start Debugging, and choose **“Start Backend (Node)”**.  
  Then start the frontend in a **terminal** (Step 3 above). You need both backend and frontend running.
- **Start Frontend from menu:** Terminal → Run Task → **“Start Frontend”**.

Do **not** use “Run” on `playground-1.mongodb.js` or other scripts from the Run button unless you have a proper launch config for them. Use the terminal: `node playground-1.mongodb.js` from project root.

---

## Quick checklist

| Step | What to do |
|------|------------|
| 1 | MongoDB running (Atlas or local) |
| 2 | Terminal 1: `cd backend` → `npm run dev` (see “MongoDB connected”) |
| 3 | Terminal 2: `cd frontend` → `npm run dev` |
| 4 | Browser: http://localhost:5173 → login admin / 12345678 |

If you skip Step 2 or 3, you get **ERR_CONNECTION_REFUSED** on localhost.
