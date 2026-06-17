/* ===== Ammayi Cooks — single-page app (router + all views) ===== */

/* ---------- Router ---------- */
const VIEWS = ["home","costs","orders","profit"];
function route(){
  const r = (location.hash.replace("#","") || "home");
  const view = VIEWS.includes(r) ? r : "home";

  VIEWS.forEach(v => document.getElementById("view-"+v).hidden = (v !== view));
  document.getElementById("topbar").hidden = (view === "home");
  document.querySelectorAll(".navtabs .tab").forEach(t =>
    t.classList.toggle("active", t.dataset.route === view));

  if(view === "costs")  renderCosts();
  if(view === "orders") renderOrders();
  if(view === "profit") renderProfit();
  window.scrollTo(0,0);
}
window.addEventListener("hashchange", route);

/* ====================== COSTING ====================== */
document.getElementById("ingredientList").innerHTML =
  INGREDIENTS.map(([n])=>`<option value="${n}">`).join("");

const costGrand = () => document.getElementById("costGrand");

function renderCosts(){
  const tb = document.querySelector("#costTable tbody");
  tb.innerHTML = "";
  state.costs.forEach((row,i)=> tb.appendChild(costRow(row,i)));
  costGrand().textContent = money(totalCost());
}
function costRow(row, i){
  const tr = document.createElement("tr");
  tr.innerHTML = `
    <td><input class="cell-input f-name" list="ingredientList" placeholder="type or pick…" value="${row.name??""}"></td>
    <td class="num"><input class="cell-input f-qty" type="number" min="0" step="any" value="${row.qty??""}"></td>
    <td><select class="cell-select f-unit">${UNITS.map(u=>`<option ${u===row.unit?"selected":""}>${u}</option>`).join("")}</select></td>
    <td class="num"><input class="cell-input f-price" type="number" min="0" step="any" value="${row.price??""}"></td>
    <td class="num row-total f-line">${money((Number(row.qty)||0)*(Number(row.price)||0))}</td>
    <td class="act"><button class="del" title="Delete">🗑</button></td>`;

  const lineEl = tr.querySelector(".f-line");
  const unitSel = tr.querySelector(".f-unit");
  const recalc = ()=>{
    lineEl.textContent = money((Number(row.qty)||0)*(Number(row.price)||0));
    costGrand().textContent = money(totalCost());
  };
  tr.querySelector(".f-name").addEventListener("input", e=>{
    row.name = e.target.value;
    const found = INGREDIENTS.find(([n])=>n===row.name);
    if(found){ row.unit = found[1]; unitSel.value = found[1]; }
    save();
  });
  tr.querySelector(".f-qty").addEventListener("input", e=>{ row.qty = e.target.value; recalc(); save(); });
  tr.querySelector(".f-price").addEventListener("input", e=>{ row.price = e.target.value; recalc(); save(); });
  unitSel.addEventListener("change", e=>{ row.unit = e.target.value; save(); });
  tr.querySelector(".del").addEventListener("click", ()=>{ state.costs.splice(i,1); save(); renderCosts(); });
  return tr;
}
document.getElementById("addCostRow").addEventListener("click",()=>{
  state.costs.push({name:"",qty:1,unit:"kg",price:0}); save(); renderCosts();
});

/* ====================== ORDERS ====================== */
const menuOptions = sel =>
  ['<option value="">— select dish —</option>']
    .concat(MENU.map(([n,p])=>`<option value="${n}" ${n===sel?"selected":""}>${n} (${money(p)})</option>`))
    .join("");

function renderSummary(){
  document.getElementById("sOrders").textContent = state.orders.length;
  document.getElementById("sItems").textContent  = totalItems();
  document.getElementById("sSales").textContent  = money(totalSales());
}
function renderOrders(){
  const list = document.getElementById("orderList");
  list.innerHTML = "";
  if(state.orders.length === 0)
    list.innerHTML = `<p class="empty">No orders yet. Click <strong>+ New Order</strong> to add one.</p>`;
  state.orders.forEach((o, oi)=> list.appendChild(orderCard(o, oi)));
  renderSummary();
}
function orderCard(o, oi){
  const card = document.createElement("div");
  card.className = "order-card";
  card.innerHTML = `
    <div class="order-top">
      <span class="order-no">Order #${pad(o.no)}</span>
      <label class="oc-field">Date <input class="cell-input f-date" type="date" value="${o.date||""}"></label>
      <span class="order-day">${dayOf(o.date)}</span>
      <label class="oc-field grow">Customer <input class="cell-input f-customer" placeholder="name (optional)" value="${o.customer??""}"></label>
      <button class="del-order" title="Delete order">Delete order</button>
    </div>
    <div class="table-wrap">
      <table class="order-items">
        <thead><tr><th>Dish</th><th class="num">Qty</th><th class="num">Price</th><th class="num">Line Total</th><th class="act"></th></tr></thead>
        <tbody></tbody>
      </table>
    </div>
    <div class="order-bottom">
      <button class="btn-soft f-add">+ Add dish</button>
      <div class="order-subtotal">Order Total <strong class="money-green sub">${money(orderTotal(o))}</strong></div>
    </div>`;

  const subEl = card.querySelector(".sub");
  const dayEl = card.querySelector(".order-day");
  const tbody = card.querySelector("tbody");

  card.querySelector(".f-date").addEventListener("change", e=>{ o.date = e.target.value; dayEl.textContent = dayOf(o.date); save(); });
  card.querySelector(".f-customer").addEventListener("input", e=>{ o.customer = e.target.value; save(); });
  card.querySelector(".del-order").addEventListener("click", ()=>{
    if(confirm(`Delete Order #${pad(o.no)}?`)){ state.orders.splice(oi,1); save(); renderOrders(); }
  });
  card.querySelector(".f-add").addEventListener("click", ()=>{ o.items.push({item:"",qty:1,price:0}); save(); renderOrders(); });

  o.items.forEach((it, ii)=> tbody.appendChild(orderItemRow(o, it, ii, subEl)));
  return card;
}
function orderItemRow(o, it, ii, subEl){
  const tr = document.createElement("tr");
  tr.innerHTML = `
    <td><select class="cell-select f-item">${menuOptions(it.item)}</select></td>
    <td class="num"><input class="cell-input f-qty" type="number" min="0" step="1" value="${it.qty??""}"></td>
    <td class="num f-price">${money(it.price)}</td>
    <td class="num row-total f-line">${money((Number(it.qty)||0)*(Number(it.price)||0))}</td>
    <td class="act"><button class="del" title="Remove dish">🗑</button></td>`;

  const priceEl = tr.querySelector(".f-price");
  const lineEl  = tr.querySelector(".f-line");
  const recalc = ()=>{
    lineEl.textContent = money((Number(it.qty)||0)*(Number(it.price)||0));
    subEl.textContent  = money(orderTotal(o));
    renderSummary();
  };
  tr.querySelector(".f-qty").addEventListener("input", e=>{ it.qty = e.target.value; recalc(); save(); });
  tr.querySelector(".f-item").addEventListener("change", e=>{
    it.item = e.target.value; it.price = menuPrice(it.item);
    priceEl.textContent = money(it.price); recalc(); save();
  });
  tr.querySelector(".del").addEventListener("click", ()=>{ o.items.splice(ii,1); save(); renderOrders(); });
  return tr;
}
document.getElementById("addOrder").addEventListener("click",()=>{
  const today = new Date().toISOString().slice(0,10);
  state.orders.push({no:state.nextOrderNo++, date:today, customer:"", items:[{item:"",qty:1,price:0}]});
  save(); renderOrders();
});

/* ====================== PROFIT ====================== */
function renderProfit(){
  const sales = totalSales(), cost = totalCost(), net = sales - cost;
  document.getElementById("pSales").textContent = money(sales);
  document.getElementById("pCost").textContent  = money(cost);
  const n = document.getElementById("pNet");
  n.textContent = money(net);
  n.className = net >= 0 ? "money-green" : "money-red";
  document.getElementById("pOrders").textContent = state.orders.length;
  document.getElementById("pItems").textContent  = totalItems();
  document.getElementById("pMargin").textContent = sales > 0 ? Math.round((net/sales)*100) + "%" : "—";
}

/* ====================== Reset + init ====================== */
document.getElementById("resetData").addEventListener("click",()=>{
  if(confirm("Reset all costs and orders back to the starter data?")){ resetData(); route(); }
});

route(); // initial render based on current hash
