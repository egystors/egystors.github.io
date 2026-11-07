import { db } from "./fb.js";
import { collection, addDoc, updateDoc, doc, serverTimestamp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";
import { state, say, pName, pImage } from "./state.js";
import { loadProducts } from "./admin-list.js";

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

export function resetForm() {
  state.editingId = null;
  formTitle.textContent = "إضافة منتج";
  nameEl.value = "";
  newCatEl.value = "";
  priceEl.value = "";
  stockEl.value = "";
  imageEl.value = "";
  cancelBtn.style.display = "none";
  saveBtn.textContent = "حفظ المنتج";
}

function startEdit(id) {
  const p = state.products[id];
  if (!p) return;
  state.editingId = id;
  formTitle.textContent = "تعديل منتج";
  nameEl.value = pName(p);
  if (p.category) catEl.value = p.category;
  newCatEl.value = "";
