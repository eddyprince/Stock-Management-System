# Fix: MongoDB connection refused (use Atlas in 5 minutes)

Your backend fails because **MongoDB is not running** on your PC. Use **MongoDB Atlas** (free cloud) so you don’t need to install anything.

---

## 1. Create a free cluster

1. Go to **https://www.mongodb.com/cloud/atlas**
2. Sign up or log in.
3. Click **“Build a Database”** → choose **FREE** (M0) → **Create**.
4. Choose a cloud provider/region (any is fine) → **Create Cluster**.

---

## 2. Create a database user

1. When asked **“How would you like to authenticate?”**, choose **Username and Password**.
2. Set a username (e.g. `stockuser`) and password (e.g. `MyPass123`) — **remember the password**.
3. Click **Create User**.
4. Under **“Where would you like to connect from?”** → **Add My Current IP Address** (or **Allow Access from Anywhere**: `0.0.0.0/0` for simplicity).
5. Click **Finish and Close**.

---

## 3. Get the connection string

1. In Atlas, click **“Database”** in the left menu.
2. On your cluster, click **“Connect”**.
3. Choose **“Drivers”** (or “Connect your application”).
4. Copy the connection string. It looks like:
   ```text
   mongodb+srv://stockuser:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
   ```
5. Replace **`<password>`** with your real password (the one you set for the user). Remove the `<` and `>`.

Example after replacing:
```text
mongodb+srv://stockuser:MyPass123@cluster0.abc12.mongodb.net/?retryWrites=true&w=majority
```

Add the database name before the `?` so the app uses a specific DB:
```text
mongodb+srv://stockuser:MyPass123@cluster0.abc12.mongodb.net/stock_management?retryWrites=true&w=majority
```
(Use your real host name instead of `cluster0.abc12.mongodb.net`.)

---

## 4. Put it in your backend `.env`

1. Open the file: **`backend\.env`** (in your project folder).
2. Set or replace the line:
   ```env
   MONGODB_URI=mongodb+srv://stockuser:YOUR_PASSWORD@cluster0.xxxxx.mongodb.net/stock_management?retryWrites=true&w=majority
   ```
   Use **your** username, password, and cluster URL from step 3.
3. Save the file.

Example `.env`:
```env
PORT=3000
MONGODB_URI=mongodb+srv://stockuser:MyPass123@cluster0.abc12.mongodb.net/stock_management?retryWrites=true&w=majority
JWT_SECRET=any-random-string-here
```

---

## 5. Start the backend again

In the terminal (from `backend` folder):

```powershell
npm run dev
```

Or run **“Start Backend (Node)”** from Run and Debug in Cursor.

You should see:
- **MongoDB connected**
- **Server running on http://localhost:3000**

Then run the seed once to create the admin user:

```powershell
npm run seed
```

---

## If you prefer to install MongoDB on Windows

1. Download: https://www.mongodb.com/try/download/community (Windows MSI).
2. Install (you can leave “Install as a Service” checked).
3. Start the service: open **Services** (Win + R → `services.msc`), find **MongoDB**, right‑click → **Start**.
4. Or in PowerShell (as Administrator): `Start-Service MongoDB`
5. Keep `MONGODB_URI=mongodb://localhost:27017/stock_management` in `.env` and run the backend again.
