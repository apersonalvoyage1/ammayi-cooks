/* ===== Firebase init (Realtime Database + Auth) ===== */
/* The apiKey here is public by design — security comes from Auth + database
   rules, not from hiding this. Safe to commit. */
const firebaseConfig = {
  apiKey: "AIzaSyD6tBAtaG1f8258Vx1k5a43nMl5m1wzUNI",
  authDomain: "ammayi-cooks.firebaseapp.com",
  databaseURL: "https://ammayi-cooks-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "ammayi-cooks",
  storageBucket: "ammayi-cooks.firebasestorage.app",
  messagingSenderId: "323915897351",
  appId: "1:323915897351:web:bc90fda2e2d6bc567768a2",
  measurementId: "G-80LKVCSE8M"
};

firebase.initializeApp(firebaseConfig);
const fbAuth = firebase.auth();
const fbDb   = firebase.database();
// stay logged in across visits on this device
fbAuth.setPersistence(firebase.auth.Auth.Persistence.LOCAL).catch(()=>{});
