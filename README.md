# Ammayi Cooks — Kitchen Dashboard

A simple, no-backend dashboard for the Ammayi Cooks cloud kitchen.

It's a **single page** (`index.html`) with three screens you navigate between — the URL changes to `#costs`, `#orders`, `#profit` and the browser back button works, but it's one file so all screens share the same saved data (works whether you double-click the file or host it).

**Screens:**
- **Home** — logo, About Us, and 3 navigation tiles.
- **Costing / Expenses** (`#costs`) — log groceries/vegetables/meat/oil with quantity, unit & unit price. Type or pick a product from the suggestions; totals add up automatically. (Prefilled from the Maruti Grocery Store bill.)
- **Orders** (`#orders`) — each order has its own **order number**, date, customer and **multiple dishes** (e.g. 2× Pav Bhaji + 2× Dal+Sabji). Pick a dish and the price auto-fills; order + overall totals roll up.
- **Profit** (`#profit`) — live Total Sales − Total Cost = Net Profit, plus margin.

**Files:** `index.html` (all screens), `app.js` (logic + navigation), `store.js` (data + cloud sync), `firebase-init.js` (Firebase config), `styles.css`.

## Login & shared data (Firebase)
The dashboard is gated by a **login screen** (Firebase Authentication, email/password) and the costs/orders are stored in **Firebase Realtime Database**, so you and Deepti see the same live numbers across devices in real time. localStorage is kept only as an instant-paint cache / offline fallback.

The `apiKey` in `firebase-init.js` is **public by design** — security comes from Auth + database rules, not from hiding it.

**Realtime Database rules** (set these in Firebase console → Realtime Database → Rules):
```json
{
  "rules": {
    ".read": "auth != null",
    ".write": "auth != null"
  }
}
```
Add users in Firebase console → Authentication → Users → Add user.

"Reset all data" restores the starter data **for everyone** (it writes to the shared database).

## Add your logo
Save your logo image as **`assets/logo.png`** (square works best). Until then a styled text fallback shows.

## Run locally
Just double-click `index.html` to open it in a browser — everything works offline, no server needed.

## Host free on GitHub Pages
1. Create a new GitHub repo, e.g. `ammayi-cooks`.
2. Push these files:
   ```bash
   git add .
   git commit -m "Ammayi Cooks dashboard"
   git branch -M main
   git remote add origin https://github.com/<your-username>/ammayi-cooks.git
   git push -u origin main
   ```
3. On GitHub: **Settings → Pages → Build and deployment → Source: Deploy from a branch → Branch: `main` / `root` → Save.**
4. Your site goes live at `https://<your-username>.github.io/ammayi-cooks/` in a minute or two.

## Customise (all in `store.js`)
- **Currency:** edit `const CUR = "£";`.
- **Menu items / prices:** edit the `MENU` array.
- **Ingredient suggestions:** edit the `INGREDIENTS` array.
- **Starter rows:** edit `SEED_COSTS` / `SEED_ORDERS`.
