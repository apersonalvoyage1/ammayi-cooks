# Ammayi Cooks — Kitchen Dashboard

A simple, no-backend dashboard for the Ammayi Cooks cloud kitchen.

**Pages:**
- `index.html` — landing page: logo, About Us, and 3 navigation tiles.
- `costs.html` — **Costing / Expenses**: log groceries/vegetables/meat/oil with quantity, unit & unit price. Type or pick a product from the suggestions; totals add up automatically. (Prefilled from the Maruti Grocery Store bill.)
- `orders.html` — **Orders**: each order has its own **order number**, date, customer and **multiple dishes** (e.g. 2× Pav Bhaji + 2× Dal+Sabji). Pick a dish and the price auto-fills; order + overall totals roll up.
- `profit.html` — **Profit**: live Total Sales − Total Cost = Net Profit, plus margin.

`store.js` holds the shared data, menu and ingredient list used by every page.

All data is saved in your browser (localStorage), so it persists between visits on that device. "Reset all data" restores the starter data.

## Add your logo
Save your logo image as **`assets/logo.png`** (square works best). Until then a styled text fallback shows.

## Run locally
Just open `index.html` in a browser. (Or `python3 -m http.server` then visit http://localhost:8000.)

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
