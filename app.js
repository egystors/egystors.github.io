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
}

function esc(s) {
  return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) {
    return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
  });
}

// يقرأ اسم المنتج حتى لو الحقل مكتوب بمسافة زيادة ("name ")
function pName(p) {
  if (p.name) return p.name;
  const k = Object.keys(p).find(function (key) { return key.trim() === "name"; });
  return k ? p[k] : "";
}

// يقرأ الصورة من imageUrl أو image
function pImage(p) {
  return p.imageUrl || p.image || "";
}

function cartCount() {
  return Object.values(cart).reduce(function (a, b) { return a + b; }, 0);
}

function cartTotal() {
  let t = 0;
  Object.keys(cart).forEach(function (id) {
    if (products[id]) t += (Number(products[id].price) || 0) * cart[id];
  });
  return t;
}

function allCats() {
  const list = DEFAULT_CATS.slice();
  extraCats.forEach(function (c) { if (list.indexOf(c) === -1) list.push(c); });
  return list;
}

function renderChips() {
  const cats = ["الكل"].concat(allCats());
  chipsEl.innerHTML = "";
  cats.forEach(function (c) {
    const b = document.createElement("button");
    b.className = "chip" + (c === activeCat ? " on" : "");
    b.textContent = c;
    b.onclick = function () {
      activeCat = c;
      renderChips();
      renderProducts();
    };
    chipsEl.appendChild(b);
  });
}

function renderProducts() {
  const q = searchEl.value.trim().toLowerCase();
  const ids = Object.keys(products).filter(function (id) {
    const p = products[id];
    if (activeCat !== "الكل" && p.category !== activeCat) return false;
    if (q && String(pName(p)).toLowerCase().indexOf(q) === -1) return false;
    return true;
  });
  grid.innerHTML = "";
  if (ids.length === 0) {
    message.style.display = "block";
    message.textContent = "مفيش منتجات هنا دلوقتي.";
    return;
  }
  message.style.display = "none";
  ids.forEach(function (id) {
    const p = products[id];
    const stock = Number(p.stock);
    const out = !isNaN(stock) && stock <= 0;
    const img = pImage(p);
    const card = document.createElement("div");
    card.className = "card";
    card.innerHTML =
      (img ? '<img src="' + esc(img) + '" alt="' + esc(pName(p)) + '">' : '<img alt="">') +
      '<div class="info">' +
      '<div class="name">' + esc(pName(p)) + '</div>' +
      '<div class="category">' + esc(p.category) + '</div>' +
      '<div class="price">' + esc(p.price) + ' جنيه</div>' +
      '<div class="stock">' + (out ? "غير متوفر" : (isNaN(stock) ? "" : "المتاح: " + stock)) + '</div>' +
      '<button class="add"' + (out ? " disabled" : "") + '>أضف للسلة</button>' +
      '</div>';
    card.querySelector(".add").onclick = function () { addToCart(id); };
    grid.appendChild(card);
  });
}

function addToCart(id) {
  const p = products[id];
  if (!p) return;
  const stock = Number(p.stock);
  const cur = cart[id] || 0;
  if (!isNaN(stock) && cur + 1 > stock) return;
  cart[id] = cur + 1;
  saveCart();
  renderCart();
}

function changeQty(id, delta) {
  const p = products[id];
  const stock = p ? Number(p.stock) : NaN;
  const next = (cart[id] || 0) + delta;
  if (next <= 0) {
    delete cart[id];
  } else if (!isNaN(stock) && next > stock) {
    return;
  } else {
    cart[id] = next;
  }
  saveCart();
  renderCart();
}

function renderCart() {
  Object.keys(cart).forEach(function (id) { if (!products[id]) delete cart[id]; });
  countEl.textContent = cartCount();
  cartItemsEl.innerHTML = "";
  Object.keys(cart).forEach(function (id) {
    const p = products[id];
    const row = document.createElement("div");
    row.className = "item";
    row.innerHTML =
      '<div>' + esc(pName(p)) + '<br><small>' + esc(p.price) + ' جنيه</small></div>' +
      '<div class="controls"><button class="minus">-</button><span>' + cart[id] + '</span><button class="plus">+</button></div>';
    row.querySelector(".minus").onclick = function () { changeQty(id, -1); };
    row.querySelector(".plus").onclick = function () { changeQty(id, 1); };
    cartItemsEl.appendChild(row);
  });
  totalEl.textContent = cartCount() ? "الإجمالي: " + cartTotal() + " جنيه" : "السلة فاضية";
  orderBtn.disabled = cartCount() === 0;
}

function openCart() { overlay.style.display = "block"; panel.style.display = "block"; }
function closeCart() { overlay.style.display = "none"; panel.style.display = "none"; }

document.getElementById("cartBtn").onclick = openCart;
document.getElementById("closeBtn").onclick = closeCart;
overlay.onclick = closeCart;
searchEl.oninput = renderProducts;

orderBtn.onclick = async function () {
  const customerName = document.getElementById("custName").value.trim();
  const phone = document.getElementById("custPhone").value.trim();
  const address = document.getElementById("custAddress").value.trim();
  if (!customerName || !phone || !address) {
    statusEl.style.color = "#c0392b";
    statusEl.textContent = "من فضلك اكتب الاسم والتليفون والعنوان.";
    return;
  }
  if (phone.length <= 5) {
    statusEl.style.color = "#c0392b";
    statusEl.textContent = "رقم التليفون مش كامل.";
    return;
  }
  const items = Object.keys(cart).map(function (id) {
    return { id: id, name: pName(products[id]), price: Number(products[id].price) || 0, qty: cart[id] };
  });
  const total = cartTotal();
  orderBtn.disabled = true;
  statusEl.style.color = "#6b7385";
  statusEl.textContent = "جاري إرسال الطلب...";
  try {
    await addDoc(collection(db, "orders"), {
      customerName: customerName, phone: phone, address: address,
      items: items, total: total,
      status: "new", createdAt: serverTimestamp()
    });
    let msg = "طلب جديد من EgyStors\n\nالاسم: " + customerName + "\nالتليفون: " + phone + "\nالعنوان: " + address + "\n\n";
    items.forEach(function (i) { msg += "- " + i.name + " × " + i.qty + " = " + (i.price * i.qty) + " جنيه\n"; });
    msg += "\nالإجمالي: " + total + " جنيه";
    const link = "https://wa.me/" + STORE_WHATSAPP + "?text=" + encodeURIComponent(msg);
    statusEl.style.color = "#1e8449";
    statusEl.innerHTML = 'تم تسجيل طلبك ✔<a class="wa" href="' + link + '" target="_blank">كمّل على واتساب</a>';
    cart = {};
    saveCart();
    renderCart();
  } catch (e) {
    statusEl.style.color = "#c0392b";
    statusEl.textContent = "حصلت مشكلة في إرسال الطلب، جرّب تاني.";
    orderBtn.disabled = false;
  }
};

async function loadProducts() {
  try {
    const snap = await getDocs(collection(db, "Products"));
    snap.forEach(function (d) {
      const data = d.data();
      products[d.id] = data;
      if (data.category && DEFAULT_CATS.indexOf(data.category) === -1 && extraCats.indexOf(data.category) === -1) {
        extraCats.push(data.category);
      }
    });
    try {
      const catSnap = await getDocs(collection(db, "categories"));
      catSnap.forEach(function (d) {
        const n = d.data().name || d.id;
        if (DEFAULT_CATS.indexOf(n) === -1 && extraCats.indexOf(n) === -1) extraCats.push(n);
      });
    } catch (e) {}
    renderChips();
    renderProducts();
    renderCart();
  } catch (e) {
    message.style.display = "block";
    message.textContent = "حصلت مشكلة في تحميل المنتجات.";
  }
}

renderChips();
renderCart();
loadProducts();
