/* ===== Ammayi Cooks — shared data + helpers (loaded on every page) ===== */

const CUR = "£"; // change to "₹" or "$" if needed
const money = n => CUR + (Number(n) || 0).toFixed(2);

/* ---- Ingredient suggestions for the Costing combobox ----
   {name, unit} — unit auto-fills when a matching name is picked.
   You can still type any custom product name (real bills vary). */
const INGREDIENTS = [
  // Vegetables
  ["Onion","kg"],["Tomato","kg"],["Potato","kg"],["Garlic","kg"],["Ginger","kg"],
  ["Green Chilli","kg"],["Coriander","bunch"],["Curry Leaves","bunch"],["Mint","bunch"],
  ["Coriander/Spinach/Methi","bunch"],["Carrot","kg"],["Beans","kg"],["Cauliflower","kg"],
  ["Cabbage","kg"],["Capsicum","kg"],["Chilli/Capsicum","kg"],["Peas","kg"],["Spinach","bunch"],
  ["Brinjal (Aubergine)","kg"],["Okra (Bhindi)","kg"],["Okra/Gawar/Karela/Tindora","pcs"],
  ["Bottle Gourd","kg"],["Cucumber","kg"],["Lemon","pcs"],["Drumstick","kg"],
  // Lentils / grains / staples
  ["Rice","kg"],["Toor Dal","kg"],["Moong Dal","kg"],["Chana Dal","kg"],["Urad Dal","kg"],
  ["Masoor Dal","kg"],["Chickpeas (Chana)","kg"],["Rajma","kg"],
  ["Wheat Flour (Atta)","kg"],["Maida","kg"],["Besan (Gram Flour)","kg"],["Semolina (Rava)","kg"],
  ["Idli/Dosa Batter Mix","pcs"],
  // Dairy
  ["Milk","ltr"],["Curd / Yogurt","kg"],["Paneer","pcs"],["Butter","kg"],["Ghee","kg"],
  ["Cheese","kg"],["Cream","ltr"],
  // Meat / poultry / fish / eggs
  ["Chicken","kg"],["Mutton / Lamb","kg"],["Fish","kg"],["Prawns","kg"],["Eggs","dozen"],
  // Oils
  ["Sunflower Oil","ltr"],["Vegetable Oil","ltr"],["Mustard Oil","ltr"],
  ["Coconut Oil","ltr"],["Olive Oil","ltr"],["Sesame Oil","ltr"],
  // Spices / sauces / dry
  ["Salt","kg"],["Table Salt","pcs"],["Sugar (Tate Lyle 1kg)","pcs"],["Sugar","kg"],
  ["Turmeric","kg"],["Red Chilli Powder","kg"],["Coriander Powder","kg"],
  ["Cumin/Jeera Whole","pcs"],["Mustard Seeds","kg"],["Kalonji Seeds (100g)","pcs"],
  ["Minced Ginger Garlic","pcs"],["Garam Masala","kg"],["Black Pepper","kg"],
  ["Bay Leaf","pkt"],["Cardamom","kg"],["Cloves","kg"],["Cinnamon","kg"],
  ["Asafoetida (Hing)","pkt"],["Tamarind","kg"],["Biryani Essence","pcs"],
  ["Ching's Green Chilli Sauce","pcs"],["Ching's Dark Soy Sauce 210g","pcs"],
  ["Ching's Schezwan Stir Fry Sauce","pcs"],
  ["Peanuts","kg"],["Cashew","kg"],["Coconut","pcs"],["Dry Coconut","kg"],
  // Packaging / misc
  ["Food Containers","pcs"],["Carry Bags","pcs"],["Foil / Cling Film","roll"],
  ["Napkins","pkt"],["Cutlery Sets","pcs"],["Gas Cylinder","unit"],["Other","unit"],
];
const UNITS = ["kg","gm","ltr","ml","pcs","dozen","bunch","pkt","roll","unit","box"];

/* ---- Menu for the Orders dropdown (prices in £, from the Ammayi Cooks menu) ---- */
const MENU = [
  ["Dal + Sabji",12],
  ["Rice + Dal + Sabji",15],
  ["Roti + Sabji + Dal",15],
  ["Rotis (10)",4],
  ["Peanut Chutney",10],
  ["Onion & Tomato Chutney",10],
  ["Coconut Chutney",10],
  ["Puri + Aloo Curry",12],
  ["Pav Bhaji",12],
  ["Mini Samosas (12 pcs)",8],
];
const menuPrice = name => (MENU.find(([n])=>n===name)||[,0])[1];

/* ---- Seed costs: from the Maruti Grocery Store bill (17-06-2026, £28.54) ---- */
const BILL_DATE = "2026-06-17";
const SEED_COSTS = [
  {name:"Sugar (Tate Lyle 1kg)",         qty:1, unit:"pcs",   price:1.39, date:BILL_DATE},
  {name:"Kalonji Seeds (100g)",          qty:1, unit:"pcs",   price:1.10, date:BILL_DATE},
  {name:"Paneer",                        qty:1, unit:"pcs",   price:2.49, date:BILL_DATE},
  {name:"Coriander/Spinach/Methi",       qty:2, unit:"bunch", price:1.00, date:BILL_DATE},
  {name:"Idli/Dosa Batter Mix",          qty:1, unit:"pcs",   price:3.50, date:BILL_DATE},
  {name:"Coconut",                       qty:1, unit:"pcs",   price:1.49, date:BILL_DATE},
  {name:"Cumin/Jeera Whole",             qty:1, unit:"pcs",   price:1.99, date:BILL_DATE},
  {name:"Ching's Green Chilli Sauce",    qty:1, unit:"pcs",   price:1.99, date:BILL_DATE},
  {name:"Table Salt",                    qty:1, unit:"pcs",   price:1.19, date:BILL_DATE},
  {name:"Minced Ginger Garlic",          qty:1, unit:"pcs",   price:1.89, date:BILL_DATE},
  {name:"Ching's Schezwan Stir Fry Sauce",qty:1, unit:"pcs",  price:2.49, date:BILL_DATE},
  {name:"Okra/Gawar/Karela/Tindora",     qty:1, unit:"pcs",   price:1.66, date:BILL_DATE},
  {name:"Ching's Dark Soy Sauce 210g",   qty:1, unit:"pcs",   price:1.99, date:BILL_DATE},
  {name:"Biryani Essence",               qty:1, unit:"pcs",   price:0.59, date:BILL_DATE},
  {name:"Chilli/Capsicum",               qty:1, unit:"pcs",   price:1.10, date:BILL_DATE},
  {name:"Okra/Gawar/Karela/Tindora",     qty:1, unit:"pcs",   price:1.68, date:BILL_DATE},
];

/* ---- One-time bill imports: appended to existing data once (never wipes) ----
   Each import runs once (tracked by id in state.imports), so opening the app
   adds these to the shared data without a reset. */
const IMPORTS = [
  { id:"bills_1", date:"2026-06-18", note:"Sainsbury's, Cardiff (paid £13.71)", items:[
    {name:"Soft Rolls (4-pack)",            qty:2,    unit:"pcs", price:0.90}, // 2 for £1.80
    {name:"Classic Tomatoes (x6)",          qty:2,    unit:"pcs", price:0.99},
    {name:"Closed Cup Mushrooms",           qty:1,    unit:"pcs", price:1.29},
    {name:"Sweeteners 300s",                qty:1,    unit:"pcs", price:2.15}, // £3.30 − £1.15 Nectar
    {name:"Ginger (loose)",                 qty:0.16, unit:"kg",  price:5.60},
    {name:"Carrots (1kg)",                  qty:1,    unit:"kg",  price:0.69},
    {name:"Baby Potatoes (1kg)",            qty:1,    unit:"kg",  price:1.05},
    {name:"Self Raising Flour (McDougalls)",qty:1,    unit:"pcs", price:1.85},
    {name:"Greeting Card",                  qty:1,    unit:"pcs", price:2.00},
  ]},
];

/* ---- Seed orders: bulk orders, each with an order number + multiple items ---- */
const SEED_ORDERS = [
  {no:1, date:"2026-06-16", customer:"Priya",
   items:[{item:"Pav Bhaji",qty:2,price:12},{item:"Dal + Sabji",qty:2,price:12}]},
  {no:2, date:"2026-06-17", customer:"Rahul",
   items:[{item:"Rice + Dal + Sabji",qty:3,price:15},{item:"Mini Samosas (12 pcs)",qty:1,price:8}]},
];

/* ---- State + persistence ----
   Source of truth = Firebase Realtime Database (shared across devices).
   localStorage is kept as an instant-paint cache + offline fallback. */
const KEY = "ammayi_data_v2";
const seedState = () => ({
  costs: structuredClone(SEED_COSTS),
  orders: structuredClone(SEED_ORDERS),
  nextOrderNo: 3,
});
let state = loadCache();

function loadCache(){
  try{
    const s = JSON.parse(localStorage.getItem(KEY));
    if(s && s.costs && s.orders) return s;
  }catch(e){}
  return seedState();
}
function cacheSave(){ localStorage.setItem(KEY, JSON.stringify(state)); }

/* ---- Cloud sync (Realtime Database) ---- */
const DB_PATH = "kitchen";          // single shared node both accounts read/write
let dbRef = null;
let writeTimer = null;
let suppressEcho = "";              // JSON we just wrote — ignore its echo
let pendingRemote = null;           // remote update deferred while user is typing

const isEditingApp = () => {
  const a = document.activeElement;
  return a && a.closest && a.closest("#view-costs, #view-orders");
};

function save(){
  cacheSave();
  if(!dbRef) return;                // not connected (offline/local mode)
  clearTimeout(writeTimer);
  writeTimer = setTimeout(()=>{
    const json = JSON.stringify(state);
    suppressEcho = json;
    dbRef.set(JSON.parse(json)).catch(err=>console.warn("cloud write failed", err));
  }, 350);
}

function connectCloud(onChange, onError, onReady){
  dbRef = fbDb.ref(DB_PATH);
  let first = true;
  dbRef.on("value", snap=>{
    const data = snap.val();
    if(!data){                       // first ever run → seed the cloud
      suppressEcho = JSON.stringify(state);
      dbRef.set(state).catch(err=> onError && onError(err));
    }else{
      const json = JSON.stringify(data);
      if(json !== suppressEcho && json !== JSON.stringify(state)) applyRemote(data, onChange);
    }
    if(first){ first = false; onReady && onReady(); }
  }, err=> onError && onError(err));
}

/* Append any not-yet-applied one-time bill imports. Returns true if it changed data. */
function applyImports(){
  if(!state.imports) state.imports = {};
  let changed = false;
  IMPORTS.forEach(imp=>{
    if(state.imports[imp.id]) return;
    imp.items.forEach(it=> state.costs.push({...it, date:imp.date, orderNo:null}));
    state.imports[imp.id] = true;
    changed = true;
  });
  if(changed) save();
  return changed;
}
function disconnectCloud(){
  if(dbRef){ dbRef.off(); dbRef = null; }
}
function applyRemote(data, onChange){
  if(isEditingApp()){ pendingRemote = {data, onChange}; return; } // don't clobber typing
  state = data; cacheSave(); onChange && onChange();
}
document.addEventListener("focusout", ()=>{
  setTimeout(()=>{
    if(pendingRemote && !isEditingApp()){
      const {data, onChange} = pendingRemote; pendingRemote = null;
      state = data; cacheSave(); onChange && onChange();
    }
  }, 120);
});

function resetData(){ state = seedState(); save(); }

/* ---- Derived totals (used by every page) ---- */
const orderTotal = o => o.items.reduce((s,it)=>s+(Number(it.qty)||0)*(Number(it.price)||0),0);
const totalSales = () => state.orders.reduce((s,o)=>s+orderTotal(o),0);
const totalCost  = () => state.costs.reduce((s,r)=>s+(Number(r.qty)||0)*(Number(r.price)||0),0);
const totalItems = () => state.orders.reduce((s,o)=>s+o.items.reduce((a,it)=>a+(Number(it.qty)||0),0),0);

/* ---- Misc helpers ---- */
const dayOf = d => d ? new Date(d+"T00:00:00").toLocaleDateString("en-GB",{weekday:"long"}) : "";
const pad = n => String(n).padStart(3,"0");

/* ---- Date helpers (local, no UTC shift) ---- */
const pad2 = n => String(n).padStart(2,"0");
const ymd = d => d.getFullYear()+"-"+pad2(d.getMonth()+1)+"-"+pad2(d.getDate());
const todayStr = () => ymd(new Date());

/* ---- Week helpers (weeks run Monday→Sunday, UK style) ---- */
const UNDATED = "undated";
function weekKey(dateStr){
  if(!dateStr) return UNDATED;
  const d = new Date(dateStr+"T00:00:00");
  if(isNaN(d)) return UNDATED;
  const day = (d.getDay()+6)%7;          // 0=Mon … 6=Sun
  d.setDate(d.getDate()-day);            // back to Monday
  return ymd(d);                         // Monday's date as the key (local)
}
function weekLabel(key){
  if(key === UNDATED) return "No date set";
  const mon = new Date(key+"T00:00:00");
  const sun = new Date(mon); sun.setDate(sun.getDate()+6);
  const opt = {day:"numeric", month:"short"};
  const sameMonth = mon.getMonth() === sun.getMonth();
  const monStr = mon.toLocaleDateString("en-GB", sameMonth ? {day:"numeric"} : opt);
  return `${monStr} – ${sun.toLocaleDateString("en-GB",opt)} ${sun.getFullYear()}`;
}
/* [{key, label, total, count}] sorted newest first, undated last */
const sortWeeks = (a,b)=> a.key===UNDATED ? 1 : b.key===UNDATED ? -1 : (a.key < b.key ? 1 : -1);
function costsByWeek(){
  const map = {};
  state.costs.forEach(r=>{
    const k = weekKey(r.date);
    (map[k] = map[k] || {key:k, total:0, count:0});
    map[k].total += (Number(r.qty)||0)*(Number(r.price)||0);
    map[k].count += 1;
  });
  return Object.values(map).map(w=>({...w, label:weekLabel(w.key)})).sort(sortWeeks);
}

/* Weekly profit & loss: [{key,label,sales,cost,net}] newest first */
function weeklyPL(){
  const map = {};
  const touch = k => (map[k] = map[k] || {key:k, sales:0, cost:0});
  state.orders.forEach(o=> touch(weekKey(o.date)).sales += orderTotal(o));
  state.costs.forEach(r=> touch(weekKey(r.date)).cost += (Number(r.qty)||0)*(Number(r.price)||0));
  return Object.values(map)
    .map(w=>({...w, net:w.sales-w.cost, label:weekLabel(w.key)})).sort(sortWeeks);
}

/* ---- Per-order cost linking ---- */
function orderLabel(o){
  const d = o.date ? new Date(o.date+"T00:00:00").toLocaleDateString("en-GB",{day:"numeric",month:"short"}) : "no date";
  return `#${pad(o.no)} · ${o.customer||"—"} · ${d}`;
}
const costForOrder = no => state.costs
  .filter(r => r.orderNo === no)
  .reduce((s,r)=> s + (Number(r.qty)||0)*(Number(r.price)||0), 0);
