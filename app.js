/* ===== Ammayi Cooks — single-page app (router + all views) ===== */

/* ---------- Router ---------- */
const VIEWS = ["home","costs","orders","profit"];
function renderCurrent(){
  const r = (location.hash.replace("#","") || "home");
  const view = VIEWS.includes(r) ? r : "home";
  if(view === "home")   renderHome();
  if(view === "costs")  renderCosts();
  if(view === "orders") renderOrders();
  if(view === "profit") renderProfit();
}
function route(){
  const r = (location.hash.replace("#","") || "home");
  const view = VIEWS.includes(r) ? r : "home";

  VIEWS.forEach(v => document.getElementById("view-"+v).hidden = (v !== view));
  document.getElementById("topbar").hidden = (view === "home");
  document.querySelectorAll(".navtabs .tab").forEach(t =>
    t.classList.toggle("active", t.dataset.route === view));

  renderCurrent();
  window.scrollTo(0,0);
}
window.addEventListener("hashchange", route);

/* ====================== HOME (dashboard overview) ====================== */
let menuRendered = false;
function renderHome(){
  const sales = totalSales(), cost = totalCost(), net = sales - cost;
  const kpis = [
    {label:"TOTAL SALES", val:money(sales), cls:"money-green", ico:"💷"},
    {label:"TOTAL COST",  val:money(cost),  cls:"money-red",   ico:"🧾"},
    {label:"NET PROFIT",  val:money(net),   cls:net>=0?"money-green":"money-red", ico:"📈"},
    {label:"ORDERS",      val:state.orders.length, cls:"", ico:"📋"},
  ];
  document.getElementById("homeKpis").innerHTML = kpis.map(k=>`
    <div class="kpi">
      <span class="kpi-ico">${k.ico}</span>
      <div><span class="kpi-label">${k.label}</span>
      <strong class="kpi-val ${k.cls}">${k.val}</strong></div>
    </div>`).join("");

  if(!menuRendered){
    document.getElementById("menuGrid").innerHTML =
      MENU.map(([n,p])=>`<div class="menu-item"><span>${n}</span><strong>${money(p)}</strong></div>`).join("");
    menuRendered = true;
  }
}

/* ====================== COSTING ====================== */
document.getElementById("ingredientList").innerHTML =
  INGREDIENTS.map(([n])=>`<option value="${n}">`).join("");

const costGrand = () => document.getElementById("costGrand");
let costWeekFilter = "all";   // "all" or a week key (Monday date / "undated")

function renderCosts(){
  const weeks = costsByWeek();

  // keep the dropdown in sync with available weeks
  const sel = document.getElementById("weekFilter");
  if(!weeks.some(w=>w.key===costWeekFilter)) costWeekFilter = "all";
  sel.innerHTML = `<option value="all">All weeks</option>` +
    weeks.map(w=>`<option value="${w.key}" ${w.key===costWeekFilter?"selected":""}>${w.label} — ${money(w.total)}</option>`).join("");

  // rows (filtered by selected week)
  const tb = document.querySelector("#costTable tbody");
  tb.innerHTML = "";
  let shown = 0, shownTotal = 0;
  state.costs.forEach((row,i)=>{
    if(costWeekFilter !== "all" && weekKey(row.date) !== costWeekFilter) return;
    tb.appendChild(costRow(row,i));
    shown++; shownTotal += (Number(row.qty)||0)*(Number(row.price)||0);
  });
  if(shown === 0){
    tb.innerHTML = `<tr><td colspan="7" class="empty">No items for this week.</td></tr>`;
  }

  // grand total reflects the current filter
  const allTotal = totalCost();
  if(costWeekFilter === "all"){
    document.getElementById("costGrandLabel").textContent = "GRAND TOTAL";
    costGrand().textContent = money(allTotal);
  }else{
    document.getElementById("costGrandLabel").textContent = "WEEK TOTAL";
    costGrand().textContent = money(shownTotal);
  }

  // spend-by-week breakdown
  document.getElementById("weeklyBreakdown").innerHTML = weeks.length
    ? weeks.map(w=>`
        <button class="weekly-item ${w.key===costWeekFilter?"on":""}" data-week="${w.key}">
          <span class="wk-label">${w.label}</span>
          <span class="wk-meta">${w.count} item${w.count!==1?"s":""}</span>
          <strong class="wk-total">${money(w.total)}</strong>
        </button>`).join("")
    : `<p class="empty">No costs yet.</p>`;
  document.querySelectorAll("#weeklyBreakdown .weekly-item").forEach(b=>{
    b.addEventListener("click", ()=>{
      costWeekFilter = (costWeekFilter===b.dataset.week) ? "all" : b.dataset.week;
      renderCosts();
    });
  });
}

function costRow(row, i){
  const tr = document.createElement("tr");
  tr.innerHTML = `
    <td><input class="cell-input f-date" type="date" value="${row.date||""}"></td>
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
    costGrand().textContent = money(costWeekFilter==="all" ? totalCost()
      : state.costs.filter(r=>weekKey(r.date)===costWeekFilter)
                   .reduce((s,r)=>s+(Number(r.qty)||0)*(Number(r.price)||0),0));
  };
  // date change can move the row between weeks → full re-render
  tr.querySelector(".f-date").addEventListener("change", e=>{ row.date = e.target.value; save(); renderCosts(); });
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

document.getElementById("weekFilter").addEventListener("change", e=>{
  costWeekFilter = e.target.value; renderCosts();
});
document.getElementById("addCostRow").addEventListener("click",()=>{
  const today = todayStr();
  state.costs.push({name:"",qty:1,unit:"kg",price:0,date:today}); save(); renderCosts();
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
    <div class="order-head">
      <span class="order-no">Order #${pad(o.no)}</span>
      <span class="order-day">${dayOf(o.date)||"—"}</span>
      <button class="del-order" title="Delete this order">🗑 Delete</button>
    </div>
    <div class="order-fields">
      <label class="oc-field">Date <input class="cell-input f-date" type="date" value="${o.date||""}"></label>
      <label class="oc-field grow">Customer <input class="cell-input f-customer" placeholder="name (optional)" value="${o.customer??""}"></label>
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

  card.querySelector(".f-date").addEventListener("change", e=>{ o.date = e.target.value; dayEl.textContent = dayOf(o.date)||"—"; save(); });
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
  const today = todayStr();
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

/* ====================== Reset ====================== */
document.getElementById("resetData").addEventListener("click",()=>{
  if(confirm("Reset ALL shared costs and orders back to the starter data?\nThis affects everyone, on every device.")){
    resetData(); route();
  }
});

/* ====================== Auth gate + cloud sync ====================== */
const bootEl  = document.getElementById("boot");
const loginEl = document.getElementById("login");
const appEl   = document.querySelector(".app");
const cloudMode = (typeof firebase !== "undefined" && typeof fbAuth !== "undefined");
let cloudConnected = false;

function showApp(){
  bootEl.hidden = true; loginEl.hidden = true; appEl.hidden = false;
  route();
}
function showLogin(){
  bootEl.hidden = true; appEl.hidden = true; loginEl.hidden = false;
}

if(!cloudMode){
  // Offline / opened-as-file fallback: local-only, no login.
  document.getElementById("userBox").hidden = true;
  showApp();
} else {
  const authErr = code => ({
    "auth/invalid-email":"That email doesn't look right.",
    "auth/invalid-credential":"Wrong email or password.",
    "auth/wrong-password":"Wrong email or password.",
    "auth/user-not-found":"No account with that email.",
    "auth/too-many-requests":"Too many attempts — try again in a bit.",
    "auth/network-request-failed":"Network problem — check your connection.",
  }[code] || "Couldn't sign in. Please try again.");

  document.getElementById("loginForm").addEventListener("submit", async e=>{
    e.preventDefault();
    const btn = document.getElementById("loginBtn");
    const err = document.getElementById("loginErr");
    err.textContent = ""; btn.disabled = true; btn.textContent = "Signing in…";
    try{
      await fbAuth.signInWithEmailAndPassword(
        document.getElementById("loginEmail").value.trim(),
        document.getElementById("loginPass").value);
    }catch(ex){
      err.textContent = authErr(ex.code);
    }finally{
      btn.disabled = false; btn.textContent = "Sign in";
    }
  });

  document.getElementById("signOut").addEventListener("click", ()=>{
    disconnectCloud(); cloudConnected = false; fbAuth.signOut();
  });

  fbAuth.onAuthStateChanged(user=>{
    if(user){
      document.getElementById("userEmail").textContent = user.email;
      document.getElementById("userBox").hidden = false;
      showApp();                       // show the dashboard first, no matter what
      if(!cloudConnected){
        cloudConnected = true;
        try{ connectCloud(renderCurrent, cloudError); }
        catch(e){ cloudError(e); }
      }
    }else{
      document.getElementById("loginPass").value = "";
      showLogin();
    }
  });
}

function cloudError(err){
  const b = document.getElementById("cloudErr");
  if(!b) return;
  b.hidden = false;
  b.textContent = (err && (err.code === "PERMISSION_DENIED" || /permission/i.test(err.message||"")))
    ? "⚠ Signed in, but can't access the shared database. Publish your Realtime Database rules (see README), then refresh."
    : "⚠ Couldn't reach the shared database — showing this device's cached data.";
}

route(); // initial render based on current hash
