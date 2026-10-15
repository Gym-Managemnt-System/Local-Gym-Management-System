/* ============================================================
   Membership Plans page – Gym Membership Management System
   Sample data only: swap the `plans` array for fetch() calls.
   ============================================================ */

let plans = [
  {
    id: 1, name: "Basic", price: 3000, billing: "Billed monthly | no lock-in",
    features: ["Gym floor access", "Locker access", "2 group classes / week"],
    members: 112, popular: false,
  },
  {
    id: 2, name: "Standard", price: 2500, billing: "Billed every 3 months",
    features: ["Everything in Basic", "Unlimited group classes", "1 PT session / month"],
    members: 300, popular: true,
  },
  {
    id: 3, name: "Premium", price: 2000, billing: "Billed annually",
    features: ["Everything in Standard", "Unlimited PT sessions", "Priority class booking"],
    members: 172, popular: false,
  },
];
let nextId = 4;
let editingId = null;   // null = adding a new plan
let archivingId = null;

const $ = (s) => document.querySelector(s);
const esc = (s) =>
  String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
const rs = (n) => "Rs " + Number(n).toLocaleString("en-LK");

/* ---------- Render ---------- */
function render() {
  const wrap = $("#plans");
  wrap.innerHTML = plans
    .map(
      (p) => `
    <article class="plan ${p.popular ? "popular" : ""}" data-id="${p.id}">
      ${p.popular ? '<span class="badge">Most popular</span>' : ""}
      <div class="plan-name">${esc(p.name)}</div>
      <div class="plan-price">${rs(p.price)}<small>/mo</small></div>
      <div class="plan-billing">${esc(p.billing)}</div>
      <ul class="features">
        ${p.features.map((f) => `<li>${esc(f)}</li>`).join("")}
      </ul>
      <div class="enrolled">${p.members.toLocaleString("en-LK")} members enrolled</div>
      <div class="plan-actions">
        <button class="btn btn-grad" data-action="edit">Edit</button>
        <button class="btn btn-grad" data-action="archive">Archive</button>
      </div>
    </article>`
    )
    .join("");

  const total = plans.reduce((s, p) => s + p.members, 0);
  $("#summary").textContent =
    `${plans.length} active plan${plans.length === 1 ? "" : "s"} | ${total.toLocaleString("en-LK")} members enrolled`;
  $("#empty").hidden = plans.length > 0;
}

/* ---------- Toast ---------- */
let toastTimer;
function toast(msg) {
  const t = $("#toast");
  t.textContent = msg;
  t.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => t.classList.remove("show"), 2200);
}

/* ---------- Modal: add / edit ---------- */
function openForm(plan) {
  editingId = plan ? plan.id : null;
  $("#modalTitle").textContent = plan ? `Edit ${plan.name}` : "Add plan";
  $("#fName").value = plan ? plan.name : "";
  $("#fPrice").value = plan ? plan.price : "";
  $("#fBilling").value = plan ? plan.billing : "";
  $("#fFeatures").value = plan ? plan.features.join("\n") : "";
  $("#fPopular").checked = plan ? plan.popular : false;
  $("#formError").textContent = "";
  $("#modal").hidden = false;
  $("#fName").focus();
}
const closeForm = () => ($("#modal").hidden = true);

$("#planForm").addEventListener("submit", (e) => {
  e.preventDefault();
  const name = $("#fName").value.trim();
  const price = Number($("#fPrice").value);
  const billing = $("#fBilling").value.trim() || "Billed monthly";
  const features = $("#fFeatures").value.split("\n").map((s) => s.trim()).filter(Boolean);
  const popular = $("#fPopular").checked;

  if (!name) return ($("#formError").textContent = "Plan name is required.");
  if (!(price > 0)) return ($("#formError").textContent = "Enter a price greater than 0.");
  if (plans.some((p) => p.id !== editingId && p.name.toLowerCase() === name.toLowerCase()))
    return ($("#formError").textContent = "A plan with this name already exists.");

  // only one plan can be "Most popular"
  if (popular) plans.forEach((p) => (p.popular = false));

  if (editingId === null) {
    plans.push({ id: nextId++, name, price, billing, features, members: 0, popular });
    toast(`${name} plan added`);
  } else {
    Object.assign(plans.find((p) => p.id === editingId), { name, price, billing, features, popular });
    toast(`${name} plan updated`);
  }
  closeForm();
  render();
});

/* ---------- Archive ---------- */
function askArchive(plan) {
  archivingId = plan.id;
  $("#confirmText").textContent = plan.members
    ? `${plan.name} has ${plan.members} enrolled members. They keep their current membership, but new sign-ups will no longer be possible.`
    : `${plan.name} has no enrolled members and will be removed from the active list.`;
  $("#confirm").hidden = false;
  $("#confirmNo").focus();
}
const closeConfirm = () => { $("#confirm").hidden = true; archivingId = null; };

$("#confirmYes").addEventListener("click", () => {
  const plan = plans.find((p) => p.id === archivingId);
  plans = plans.filter((p) => p.id !== archivingId);
  closeConfirm();
  render();
  if (plan) toast(`${plan.name} plan archived`);
});
$("#confirmNo").addEventListener("click", closeConfirm);

/* ---------- Events ---------- */
$("#plans").addEventListener("click", (e) => {
  const btn = e.target.closest("[data-action]");
  if (!btn) return;
  const plan = plans.find((p) => p.id === Number(btn.closest(".plan").dataset.id));
  if (!plan) return;
  btn.dataset.action === "edit" ? openForm(plan) : askArchive(plan);
});

$("#addPlan").addEventListener("click", () => openForm(null));
$("#cancelBtn").addEventListener("click", closeForm);

// click backdrop / Esc closes dialogs
["modal", "confirm"].forEach((id) =>
  $("#" + id).addEventListener("click", (e) => {
    if (e.target.id === id) id === "modal" ? closeForm() : closeConfirm();
  })
);
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") { closeForm(); closeConfirm(); }
});

render();
