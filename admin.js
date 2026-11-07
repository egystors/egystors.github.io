import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getAuth, signInWithEmailAndPassword, signOut, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import { getFirestore, collection, getDocs, addDoc, updateDoc, deleteDoc, doc, serverTimestamp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyCaGkv321YEbehXKN0su-Rj7tEcwZse75M",
  authDomain: "egystors.firebaseapp.com",
  projectId: "egystors",
  storageBucket: "egystors.firebasestorage.app",
  messagingSenderId: "392113217944",
  appId: "1:392113217944:web:07f92ecc24e2c3bcb14bed"
};

const DEFAULT_CATS = ["ملابس", "أحذية", "إلكترونيات", "أدوات منزلية", "مستحضرات تجميل", "إكسسوارات"];

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

const loginBox = document.getElementById("loginBox");
const appBox = document.getElementById("app");
const logoutBtn = document.getElementById("logoutBtn");
const loginBtn = document.getElementById("loginBtn");
const loginMsg = document.getElementById("loginMsg");
const formTitle = document.getElementById("formTitle");
const nameEl = document.getElementById("pName");
const catEl = document.getElementById("pCategory");
const newCatEl = document.getElementById("pNewCat");
const priceEl = document.getElementById("pPrice");
const stockEl = document.getElementById("pStock");
const imageEl = document.getElementById("pImage");
const saveBtn = document.getElementById("saveBtn");
const cancelBtn = document.getElementById("cancelBtn");
const formMsg = document.getElementById("formMsg");
const listEl = document.getElementById("list");
const listMsg = document.getElementById("listMsg");

let products = {};
let editingId = null;

function esc(s) {
