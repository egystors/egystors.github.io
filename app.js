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
let activeCat = "الكل";
let cart = {};
try { cart = JSON.parse(localStorage.getItem("egystors_cart") || "{}"); } catch (e) { cart = {}; }

function saveCart() {
  try { localStorage.setItem("egystors_cart", JSON.stringify(cart)); } catch (e) {}
  renderCart();
}

function escapeHtml(s) {
  return String(s ?? "").replace(/[&<>"']/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
}

function renderCart() {
  const ids = Object.keys(cart).filter(id => products[id]);
  let total = 0, count = 0;
  cartItemsEl.innerHTML = "";
  if (ids.length === 0) {
    cartItemsEl.innerHTML = "<p>السلة فاضية</p>";
  }
  ids.forEach(id => {
    const p = products[id];
    const qty = cart[id];
    total += (p.price || 0) * qty;
    count += qty;
    const row = document.createElement("div");
    row.className = "item";
    row.innerHTML =
      "<div>" + escapeHtml(p.name) + "<br><small>" + (p.price || 0) + " ج.م</small></div>" +
      '<div class="controls">' +
      '<button data-act="dec" data-id="' + id + '">-</button>' +
      "<span>" + qty + "</span>" +
      '<button data-act="inc" data-id="' + id + '">+</button>' +
      "</div>";
    cartItemsEl.appendChild(row);
  });
  countEl.textContent = count;
  totalEl.textContent = ids.length ? "الإجمالي: " + total + " ج.م" : "";
  orderBtn.disabled = ids.length === 0;
}

cartItemsEl.addEventListener("click", (e) => {
  const btn = e.target.closest("button");
  if (!btn) return;
  const id = btn.dataset.id;
  if (btn.dataset.act === "inc") {
    const max = products[id].stock ?? Infinity;
    if (cart[id] < max) cart[id]++;
  } else {
    cart[id]--;
    if (cart[id] <= 0) delete cart[id];
  }
  saveCart();
});

function openCart() { overlay.style.display = "block"; panel.style.display = "block"; statusEl.textContent = ""; renderCart(); }
function closeCart() { overlay.style.display = "none"; panel.style.display = "none"; }
document.getElementById("cartBtn").onclick = openCart;
document.getElementById("closeBtn").onclick = closeCart;
overlay.onclick = closeCart;

function renderChips() {
  const cats = ["الكل"];
  Object.values(products).forEach(p => {
    if (p.category && !cats.includes(p.category)) cats.push(p.category);
  });
  chipsEl.innerHTML = "";
  cats.forEach(c => {
    const b = document.createElement("button");
    b.className = "chip" + (c === activeCat ? " on" : "");
    b.textContent = c;
    b.onclick = () => { activeCat = c; renderChips(); renderProducts(); };
    chipsEl.appendChild(b);
  });
}

function renderProducts() {
  const q = searchEl.value.trim().toLowerCase();
  grid.innerHTML = "";
  let shown = 0;
  Object.keys(products).forEach(id => {
    const p = products[id];
    if (activeCat !== "الكل" && p.category !== activeCat) return;
    if (q && !String(p.name || "").toLowerCase().includes(q)) return;
    shown++;
    const out = p.stock !== undefined && p.stock <= 0;
    const card = document.createElement("div");
    card.className = "card";
    card.innerHTML =
      '<img src="' + escapeHtml(p.imageUrl) + '" alt="' + escapeHtml(p.name) + '">' +
      '<div class="info">' +
      '<div class="name">' + escapeHtml(p.name || "بدون اسم") + "</div>" +
      '<div class="category">' + escapeHtml(p.category) + "</div>" +
      '<div class="price">' + (p.price !== undefined ? p.price + " ج.م" : "") + "</div>" +
      '<div class="stock">' + (p.stock !== undefined ? "المتاح: " + p.stock : "") + "</div>" +
      '<button class="add" data-id="' + id + '"' + (out ? " disabled" : "") + ">" + (out ? "غير متاح" : "أضف للسلة") + "</button>" +
      "</div>";
    grid.appendChild(card);
  });
  if (shown === 0) {
    message.style.display = "block";
    message.textContent = "مفيش منتجات مطابقة";
  } else {
    message.style.display = "none";
  }
}

searchEl.addEventListener("input", renderProducts);

async function loadProducts() {
  try {
    const snapshot = await getDocs(collection(db, "Products"));
    if (snapshot.empty) {
      message.textContent = "مفيش منتجات دلوقتي";
      return;
    }
    snapshot.forEach((d) => { products[d.id] = d.data(); });
    renderChips();
    renderProducts();
    renderCart();
  } catch (err) {
    message.textContent = "حصل خطأ في تحميل المنتجات";
    console.error(err);
  }
}

grid.addEventListener("click", (e) => {
  const btn = e.target.closest(".add");
  if (!btn) return;
  const id = btn.dataset.id;
  const max = products[id].stock ?? Infinity;
  const cur = cart[id] || 0;
  if (cur < max) cart[id] = cur + 1;
  saveCart();
  btn.textContent = "تمت الإضافة ✓";
  setTimeout(() => { btn.textContent = "أضف للسلة"; }, 900);
});

function buildWhatsAppLink(name, phone, address, items, total) {
  const lines = items.map(i => "- " + i.name + " × " + i.qty + " = " + (i.price * i.qty) + " ج.م");
  const text =
    "طلب جديد من EgyStors\n\n" +
    "الاسم: " + name + "\n" +
    "التليفون: " + phone + "\n" +
    "العنوان: " + address + "\n\n" +
    "المنتجات:\n" + lines.join("\n") + "\n\n" +
    "الإجمالي: " + total + " ج.م";
  return "https://wa.me/" + STORE_WHATSAPP + "?text=" + encodeURIComponent(text);
}

orderBtn.onclick = async () => {
  const name = document.getElementById("custName").value.trim();
  const phone = document.getElementById("custPhone").value.trim();
  const address = document.getElementById("custAddress").value.trim();
  if (!name || !phone || !address) {
    statusEl.style.color = "#c00";
    statusEl.textContent = "اكتب الاسم والتليفون والعنوان";
    return;
  }
  const items = Object.keys(cart).filter(id => products[id]).map(id => ({
    productId: id,
    name: products[id].name || "",
    price: products[id].price || 0,
    qty: cart[id]
  }));
  if (items.length === 0) return;
  const total = items.reduce((s, i) => s + i.price * i.qty, 0);

  orderBtn.disabled = true;
  statusEl.style.color = "#555";
  statusEl.textContent = "جاري إرسال الطلب...";
  try {
    await addDoc(collection(db, "orders"), {
      customerName: name,
      phone: phone,
      address: address,
      items: items,
      total: total,
      status: "new",
      createdAt: serverTimestamp()
    });
    const waLink = buildWhatsAppLink(name, phone, address, items, total);
    cart = {};
    saveCart();
    statusEl.style.color = "#0b8043";
    statusEl.innerHTML = "تم إرسال طلبك بنجاح ✓<br>دوس على الزرار تحت لإرسال تفاصيل الطلب على واتساب" +
      '<a class="wa" href="' + waLink + '" target="_blank" rel="noopener">إرسال الطلب على واتساب</a>';
    orderBtn.disabled = true;
  } catch (err) {
    console.error(err);
    statusEl.style.color = "#c00";
    statusEl.textContent = "حصل خطأ، حاول تاني";
    orderBtn.disabled = false;
  }
};

loadProducts();
