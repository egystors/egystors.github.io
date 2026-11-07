import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyCaGkv321YEbehXKN0su-Rj7tEcwZse75M",
  authDomain: "egystors.firebaseapp.com",
  projectId: "egystors",
  storageBucket: "egystors.firebasestorage.app",
  messagingSenderId: "392113217944",
  appId: "1:392113217944:web:07f92ecc24e2c3bcb14bed"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);

// ===== نهاية fb.js =====

