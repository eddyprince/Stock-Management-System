# How to run the app

**Never run `npm run dev` from `C:\Users\cyuba`.** There is no project there.

---

## Start the backend (Terminal 1)

```powershell
cd "C:\Users\cyuba\Desktop\WebTech Project\StockManagementSystem\backend"
npm run dev
```

Wait for: `MongoDB connected` and `Server running on http://localhost:3000`.

---

## Start the frontend (Terminal 2)

```powershell
cd "C:\Users\cyuba\Desktop\WebTech Project\StockManagementSystem\frontend"
npm run dev
```

Then open: **http://localhost:5173**

---

## One-time: create admin user

```powershell
cd "C:\Users\cyuba\Desktop\WebTech Project\StockManagementSystem\backend"
npm run seed
```

Login: **admin** / **123**
