# Get your MongoDB URI from Atlas (fix connection error)

You’re on the right place: [MongoDB Cloud](https://cloud.mongodb.com/v2/6996c69ea22a89827cb9f991#/overview).

Do this:

---

## 1. Open the Connect dialog

- On the **Overview** page, find your **cluster** (e.g. Cluster0).
- Click the **“Connect”** button for that cluster.

---

## 2. Choose “Drivers”

- Select **“Drivers”** (or “Connect your application”).
- Copy the **connection string** shown (it looks like  
  `mongodb+srv://username:<password>@cluster0.xxxxx.mongodb.net/...`).

---

## 3. Edit the string

- Replace **`<password>`** with the **real password** of your database user (no `<` or `>`).
- Add the database name **`stock_management`** before the `?`:  
  change `...mongodb.net/` to `...mongodb.net/stock_management?`

**Example:**  
If you get:
```text
mongodb+srv://myuser:<password>@cluster0.abc12.mongodb.net/?retryWrites=true&w=majority
```
and your password is `Pass123`, use:
```text
mongodb+srv://myuser:Pass123@cluster0.abc12.mongodb.net/stock_management?retryWrites=true&w=majority
```

If your password has special characters (e.g. `#`, `@`, `%`), [URL-encode](https://www.w3schools.com/tags/ref_urlencode.asp) them (e.g. `#` → `%23`).

---

## 4. Create or edit `backend\.env`

1. In your project, open the **`backend`** folder.
2. If there is no **`.env`** file, copy **`.env.example`** and rename the copy to **`.env`**.
3. Open **`.env`** and set (or update) this line with your real URI:

```env
MONGODB_URI=mongodb+srv://YOUR_USER:YOUR_PASSWORD@cluster0.xxxxx.mongodb.net/stock_management?retryWrites=true&w=majority
PORT=3000
JWT_SECRET=any-random-string
```

4. Save the file.

---

## 5. Allow network access in Atlas

- In Atlas, go to **Network Access** (left menu).
- Add **“Add IP Address”**.
- Either add your current IP or choose **“Allow Access from Anywhere”** (`0.0.0.0/0`) for testing.
- Confirm.

---

## 6. Create a database user (if you don’t have one)

- Go to **Database Access** → **Add New Database User**.
- Set username and password (remember the password).
- Use it in the URI in step 4 as `YOUR_USER` and `YOUR_PASSWORD`.

---

## 7. Start the backend again

From the **`backend`** folder:

```powershell
npm run dev
```

You should see **MongoDB connected**. Then run once:

```powershell
npm run seed
```

After this, the connection error is fixed.
