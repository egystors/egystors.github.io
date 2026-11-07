    return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
  });
}

function say(el, text, color) {
  el.style.color = color || "#6b7385";
  el.textContent = text;
}

// يقرأ الاسم حتى لو الحقل القديم مكتوب بمسافة زيادة
function pName(p) {
  if (p.name) return p.name;
  const k = Object.keys(p).find(function (key) { return key.trim() === "name"; });
  return k ? p[k] : "";
}

function pImage(p) {
  return p.imageUrl || p.image || "";
}

// ---------- تسجيل الدخول والخروج ----------
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
