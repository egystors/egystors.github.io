import { db } from "./fb.js";
import { collection, getDocs, deleteDoc, doc } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";
import { DEFAULT_CATS, state, esc, say, pName } from "./state.js";

const catEl = document.getElementById("pCategory");
const listEl = document.getElementById("list");
const listMsg = document.getElementById("listMsg");

export async function loadProducts() {
  say(listMsg, "جاري التحميل...");
  try {
    const snap = await getDocs(collection(db, "Products"));
    state.products = {};
    const extra = [];
    snap.forEach(function (d) {
      const data = d.data();
      state.products[d.id] = data;
      if (data.category && DEFAULT_CATS.indexOf(data.category) === -1 && extra.indexOf(data.category) === -1) {
        extra.push(data.category);
      }
    });
    try {
      const catSnap = await getDocs(collection(db, "categories"));
      catSnap.forEach(function (d) {
        const n = d.data().name || d.id;
        if (DEFAULT_CATS.indexOf(n) === -1 && extra.indexOf(n) === -1) extra.push(n);
      });
    } catch (e) {}
    fillCategories(DEFAULT_CATS.concat(extra));
    renderList();
    say(listMsg, "");
  } catch (e) {
    say(listMsg, "حصلت مشكلة في تحميل المنتجات.", "#c0392b");
  }
}
