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
const SEED_COSTS = [
  {name:"Sugar (Tate Lyle 1kg)",         qty:1, unit:"pcs",   price:1.39},
  {name:"Kalonji Seeds (100g)",          qty:1, unit:"pcs",   price:1.10},
  {name:"Paneer",                        qty:1, unit:"pcs",   price:2.49},
  {name:"Coriander/Spinach/Methi",       qty:2, unit:"bunch", price:1.00},
  {name:"Idli/Dosa Batter Mix",          qty:1, unit:"pcs",   price:3.50},
  {name:"Coconut",                       qty:1, unit:"pcs",   price:1.49},
  {name:"Cumin/Jeera Whole",             qty:1, unit:"pcs",   price:1.99},
  {name:"Ching's Green Chilli Sauce",    qty:1, unit:"pcs",   price:1.99},
  {name:"Table Salt",                    qty:1, unit:"pcs",   price:1.19},
  {name:"Minced Ginger Garlic",          qty:1, unit:"pcs",   price:1.89},
  {name:"Ching's Schezwan Stir Fry Sauce",qty:1, unit:"pcs",  price:2.49},
  {name:"Okra/Gawar/Karela/Tindora",     qty:1, unit:"pcs",   price:1.66},
  {name:"Ching's Dark Soy Sauce 210g",   qty:1, unit:"pcs",   price:1.99},
  {name:"Biryani Essence",               qty:1, unit:"pcs",   price:0.59},
  {name:"Chilli/Capsicum",               qty:1, unit:"pcs",   price:1.10},
  {name:"Okra/Gawar/Karela/Tindora",     qty:1, unit:"pcs",   price:1.68},
];

/* ---- Seed orders: bulk orders, each with an order number + multiple items ---- */
const SEED_ORDERS = [
  {no:1, date:"2026-06-16", customer:"Priya",
   items:[{item:"Pav Bhaji",qty:2,price:12},{item:"Dal + Sabji",qty:2,price:12}]},
  {no:2, date:"2026-06-17", customer:"Rahul",
   items:[{item:"Rice + Dal + Sabji",qty:3,price:15},{item:"Mini Samosas (12 pcs)",qty:1,price:8}]},
];

/* ---- State + persistence ---- */
const KEY = "ammayi_data_v2";
let state = load();

function load(){
  try{
    const s = JSON.parse(localStorage.getItem(KEY));
    if(s && s.costs && s.orders) return s;
  }catch(e){}
  return {
    costs: structuredClone(SEED_COSTS),
    orders: structuredClone(SEED_ORDERS),
    nextOrderNo: 3,
  };
}
function save(){ localStorage.setItem(KEY, JSON.stringify(state)); }
function resetData(){ localStorage.removeItem(KEY); state = load(); }

/* ---- Derived totals (used by every page) ---- */
const orderTotal = o => o.items.reduce((s,it)=>s+(Number(it.qty)||0)*(Number(it.price)||0),0);
const totalSales = () => state.orders.reduce((s,o)=>s+orderTotal(o),0);
const totalCost  = () => state.costs.reduce((s,r)=>s+(Number(r.qty)||0)*(Number(r.price)||0),0);
const totalItems = () => state.orders.reduce((s,o)=>s+o.items.reduce((a,it)=>a+(Number(it.qty)||0),0),0);

/* ---- Misc helpers ---- */
const dayOf = d => d ? new Date(d+"T00:00:00").toLocaleDateString("en-GB",{weekday:"long"}) : "";
const pad = n => String(n).padStart(3,"0");
