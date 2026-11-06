import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getFirestore, collection, getDocs, addDoc, serverTimestamp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

const STORE_WHATSAPP = "201043691626";

const firebaseConfig = {
  apiKey: "AIzaSyCaGkv321YEbehXKN0su-Rj7tEcwZse75M",
  authDomain: "egystors.firebaseapp.com",
  projectId: "egystors",
  storageBucket: "egystors.firebasestorage.app",
  messagingSenderId: "392113217944",
  appId: "1:392113217944:web:07f92ecc24e2c3bcb14bed"
};

// الأقسام الأساسية الستة، بتظهر دايمًا حتى لو فاضية
const DEFAULT_CATS = ["ملابس", "أحذية", "إلكترونيات", "أدوات منزلية", "مستحضرات تجميل", "إكسسوارات"];

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const message = document.getElementById("message");
const grid = document.getElementById("products");
const countEl = document.getElementById("count");
const overlay = document.getElementById("overlay");
const panel = document.getElementById("cartPanel");
const cartItemsEl = document.getElementById("cartItems");
const totalEl = document.getElementById("total");
const statusEl = document.getElementById("status");
const orderBtn = document.getElementById("orderBtn");
const searchEl = document.getElementById("search");
const chipsEl = document.getElementById("chips");

const products = {};
const extraCats = [];
let activeCat = "الكل";
let cart = {};
try { cart = JSON.parse(localStorage.getItem("egystors_cart") || "{}"); } catch (e) { cart = {}; }

function saveCart() {
  try { localStorage.setItem("egystors_cart", JSON.stringify(cart)); } catch (e) {}
