import { auth } from "./fb.js";
import { signInWithEmailAndPassword, signOut, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import { say } from "./state.js";
import { loadProducts } from "./admin-list.js";
import { resetForm } from "./admin-form.js";

const loginBox = document.getElementById("loginBox");
const appBox = document.getElementById("app");
const logoutBtn = document.getElementById("logoutBtn");
const loginBtn = document.getElementById("loginBtn");
const loginMsg = document.getElementById("loginMsg");

loginBtn.onclick = async function () {
  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value;
  if (!email || !password) {
    say(loginMsg, "اكتب الإيميل والباسورد.", "#c0392b");
    return;
  }
  loginBtn.disabled = true;
  say(loginMsg, "جاري الدخول...");
  try {
    await signInWithEmailAndPassword(auth, email, password);
    say(loginMsg, "");
  } catch (e) {
    say(loginMsg, "الإيميل أو الباسورد غلط، أو الحساب لسه متعملش.", "#c0392b");
  }
  loginBtn.disabled = false;
};

logoutBtn.onclick = function () { signOut(auth); };

onAuthStateChanged(auth, function (user) {
  if (user) {
    loginBox.style.display = "none";
    appBox.style.display = "block";
