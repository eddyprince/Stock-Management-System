# Set your Atlas password in .env (3 steps)

The app is stopping because **REPLACE_WITH_YOUR_PASSWORD** in `backend\.env` must be your real MongoDB Atlas password.

---

## Step 1: Get or reset the password in Atlas

1. Go to **https://cloud.mongodb.com** and sign in.
2. In the left menu click **Database Access**.
3. Find the user **cyubahiroeddyprince_db_user**.
4. Click **Edit** (pencil) for that user.
5. Either:
   - **Remember the password** you used when you created this user, or  
   - Click **Edit Password** → set a **new password** (e.g. `MyAtlasPass123`) and save it somewhere safe.

---

## Step 2: Edit backend\.env

1. Open **`backend\.env`** in your editor.
2. Find this line:
   ```
   MONGODB_URI=mongodb+srv://cyubahiroeddyprince_db_user:REPLACE_WITH_YOUR_PASSWORD@cluster0...
   ```
3. **Delete** the text **REPLACE_WITH_YOUR_PASSWORD**.
4. **Type** your actual password in its place (no spaces, no quotes).

   **Example:** If your password is `MyAtlasPass123`, the line should look like:
   ```
   MONGODB_URI=mongodb+srv://cyubahiroeddyprince_db_user:MyAtlasPass123@cluster0.ytaavfx.mongodb.net/stock_management?retryWrites=true&w=majority
   ```

5. **Save** the file (Ctrl+S).

**If your password has special characters** (`#` `@` `%` `&` etc.), replace them like this:
- `#` → `%23`
- `@` → `%40`
- `%` → `%25`
- `&` → `%26`

---

## Step 3: Restart the backend

In the terminal (from the `backend` folder):

```powershell
npm run dev
```

You should see **MongoDB connected** and **Server running on http://localhost:3000**.

---

**If you prefer a new user:** In Atlas go to Database Access → Add New Database User, create a new username and password, then in `.env` replace both the username and the password in the `MONGODB_URI` line with the new ones.
