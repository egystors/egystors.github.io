export const DEFAULT_CATS = ["ملابس", "أحذية", "إلكترونيات", "أدوات منزلية", "مستحضرات تجميل", "إكسسوارات"];

export const state = { products: {}, editingId: null, onEdit: null, onReset: null };

export function esc(s) {
  return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) {
    return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
  });
}

export function say(el, text, color) {
  el.style.color = color || "#6b7385";
  el.textContent = text;
}

export function pName(p) {
  if (p.name) return p.name;
  const k = Object.keys(p).find(function (key) { return key.trim() === "name"; });
  return k ? p[k] : "";
}

export function pImage(p) {
  return p.imageUrl || p.image || "";
}

// ===== نهاية state.js =====
