/* ============================================================
   Trainers page – Gym Membership Management System
   Sample data only: swap `trainers` for fetch() calls to your API.
   ============================================================ */

let trainers = [
  { id: 1, name: "Dilan Ranasinghe",   spec: "HIIT & Strength",       classes: 6, members: 142, rating: 4.9, active: true },
  { id: 2, name: "Sanduni Madushani",  spec: "Yoga & Mobility",       classes: 5, members: 98,  rating: 4.8, active: true },
  { id: 3, name: "Harsha Jayasinghe",  spec: "Cardio & Spin",         classes: 7, members: 116, rating: 4.7, active: true },
  { id: 4, name: "Nadeesha Perera",    spec: "Pilates",               classes: 4, members: 74,  rating: 4.6, active: true },
  { id: 5, name: "Kasun Fernando",     spec: "Boxing & Conditioning", classes: 5, members: 89,  rating: 4.5, active: true },
  { id: 6, name: "Thilini Silva",      spec: "Yoga & Mobility",       classes: 3, members: 52,  rating: 4.7, active: true },
  { id: 7, name: "Ruwan Wickramasinghe", spec: "HIIT & Strength",     classes: 6, members: 105, rating: 4.4, active: true },
  { id: 8, name: "Amaya Gunawardena",  spec: "Pilates",               classes: 4, members: 67,  rating: 4.6, active: true },
];
let nextId = 9;

const state = {
  query: "", filter: "All", page: 1, perPage: 5,
  selected: new Set(), openMenu: null,
  editingId: null, deleteIds: [],
};

const $ = (s) => document.querySelector(s);
const esc = (s) =>
  String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
const initials = (n) => n.split(/\s+/).filter(Boolean).slice(0, 2).map((w) => w[0].toUpperCase()).join("");

// stable colour per name so avatars look distinct
function avatarBg(name) {
  let h = 0;
  for (const ch of name) h = (h * 31 + ch.charCodeAt(0)) % 360;
  return `radial-gradient(circle at 35% 30%, hsl(${h} 25% 45%), hsl(${h} 30% 12%))`;
}

/* ---------- Derived data ---------- */
function filtered() {
  const q = state.query.trim().toLowerCase();
  return trainers.filter(
    (t) =>
      (state.filter === "All" || t.spec === state.filter) &&
      (!q || t.name.toLowerCase().includes(q) || t.spec.toLowerCase().includes(q))
  );
}
const specs = () => [...new Set(trainers.map((t) => t.spec))].sort();

/* ---------- Render ---------- */
function render() {
  const all = filtered();
  const pages = Math.max(1, Math.ceil(all.length / state.perPage));
  state.page = Math.min(state.page, pages);
  const slice = all.slice((state.page - 1) * state.perPage, state.page * state.perPage);

  // header summary
  const active = trainers.filter((t) => t.active);
  const types = new Set(active.map((t) => t.spec)).size;
  $("#summary").textContent =
    `${active.length} active trainer${active.length === 1 ? "" : "s"} across ${types} class type${types === 1 ? "" : "s"}`;

  // filter dropdown (keeps selection)
  const f = $("#filter");
  const opts = ["All", ...specs()];
  if (!opts.includes(state.filter)) state.filter = "All";
  f.innerHTML = opts.map((o) => `<option ${o === state.filter ? "selected" : ""}>${esc(o)}</option>`).join("");
  $("#specList").innerHTML = specs().map((s) => `<option value="${esc(s)}">`).join("");

  // rows
  $("#list").innerHTML = slice.map(rowHTML).join("");
  $("#empty").hidden = all.length > 0;

  renderBulk();
  renderPager(pages);
}

function rowHTML(t) {
  return `
  <div class="row-wrap" data-id="${t.id}">
    <input type="checkbox" class="chk" aria-label="Select ${esc(t.name)}" ${state.selected.has(t.id) ? "checked" : ""} />
    <article class="card ${t.active ? "" : "inactive"}">
      <div class="avatar lg" style="background:${avatarBg(t.name)}">${esc(initials(t.name))}</div>
      <div class="info">
        <div class="name">${esc(t.name)}${t.active ? "" : '<span class="tag-off">Inactive</span>'}</div>
        <div class="spec">${esc(t.spec)}</div>
      </div>
      <div class="stats">
        <div class="stat"><b>${t.classes}</b><span>Classes</span></div>
        <div class="stat"><b>${t.members}</b><span>Members</span></div>
        <div class="stat"><b>${t.rating ? t.rating.toFixed(1) : "–"}</b><span>Ratings</span></div>
      </div>
      <button class="kebab" data-action="menu" aria-label="Actions for ${esc(t.name)}" aria-haspopup="true">⋮</button>
      ${state.openMenu === t.id ? `
      <div class="menu" role="menu">
        <button data-action="edit" role="menuitem">Edit</button>
        <button data-action="toggle" role="menuitem">${t.active ? "Deactivate" : "Activate"}</button>
        <button data-action="delete" class="danger" role="menuitem">Delete</button>
      </div>` : ""}
    </article>
  </div>`;
}

function renderBulk() {
  const n = state.selected.size;
  $("#bulk").hidden = n === 0;
  $("#bulkCount").textContent = `${n} selected`;
}

function pageList(cur, total) {
  if (total <= 5) return Array.from({ length: total }, (_, i) => i + 1);
  const set = new Set([1, total, cur, cur - 1, cur + 1].filter((p) => p >= 1 && p <= total));
  const arr = [...set].sort((a, b) => a - b);
  const out = [];
  arr.forEach((p, i) => {
    if (i && p - arr[i - 1] > 1) out.push("…");
    out.push(p);
  });
  return out;
}

function renderPager(pages) {
  const cur = state.page;
  $("#pager").innerHTML = `
    <button data-page="${cur - 1}" ${cur === 1 ? "disabled" : ""} aria-label="Previous page">‹</button>
    ${pageList(cur, pages).map((p) =>
      p === "…" ? '<span class="dots">…</span>'
        : `<button data-page="${p}" class="${p === cur ? "cur" : ""}" ${p === cur ? 'aria-current="page"' : ""}>${p}</button>`
    ).join("")}
    <button data-page="${cur + 1}" ${cur === pages ? "disabled" : ""} aria-label="Next page">›</button>
    <select id="perPage" aria-label="Rows per page">
      ${[5, 10, 20].map((n) => `<option value="${n}" ${n === state.perPage ? "selected" : ""}>${n}/Page</option>`).join("")}
    </select>`;
}

/* ---------- Toast ---------- */
let tt;
function toast(msg) {
  const t = $("#toast");
  t.textContent = msg;
  t.classList.add("show");
  clearTimeout(tt);
  tt = setTimeout(() => t.classList.remove("show"), 2200);
}

/* ---------- Add / Edit ---------- */
function openForm(t) {
  state.editingId = t ? t.id : null;
  $("#modalTitle").textContent = t ? "Edit trainer" : "Add trainer";
  $("#fName").value = t ? t.name : "";
  $("#fSpec").value = t ? t.spec : "";
  $("#fClasses").value = t ? t.classes : 0;
  $("#formError").textContent = "";
  $("#modal").hidden = false;
  $("#fName").focus();
}
const closeForm = () => ($("#modal").hidden = true);

$("#form").addEventListener("submit", (e) => {
  e.preventDefault();
  const name = $("#fName").value.trim();
  const spec = $("#fSpec").value.trim();
  const classes = Math.max(0, parseInt($("#fClasses").value, 10) || 0);
  if (!name) return ($("#formError").textContent = "Name is required.");
  if (!spec) return ($("#formError").textContent = "Class type is required.");

  if (state.editingId === null) {
    trainers.push({ id: nextId++, name, spec, classes, members: 0, rating: 0, active: true });
    toast(`${name} added`);
  } else {
    Object.assign(trainers.find((t) => t.id === state.editingId), { name, spec, classes });
    toast(`${name} updated`);
  }
  closeForm();
  render();
});

/* ---------- Delete ---------- */
function askDelete(ids) {
  state.deleteIds = ids;
  $("#confirmText").textContent =
    ids.length === 1
      ? `${trainers.find((t) => t.id === ids[0]).name} will be permanently removed. This cannot be undone.`
      : `${ids.length} trainers will be permanently removed. This cannot be undone.`;
  $("#confirm").hidden = false;
  $("#confirmNo").focus();
}
const closeConfirm = () => { $("#confirm").hidden = true; state.deleteIds = []; };

$("#confirmYes").addEventListener("click", () => {
  const n = state.deleteIds.length;
  trainers = trainers.filter((t) => !state.deleteIds.includes(t.id));
  state.deleteIds.forEach((id) => state.selected.delete(id));
  closeConfirm();
  render();
  toast(`${n} trainer${n === 1 ? "" : "s"} deleted`);
});
$("#confirmNo").addEventListener("click", closeConfirm);

/* ---------- Events ---------- */
$("#list").addEventListener("click", (e) => {
  const wrap = e.target.closest(".row-wrap");
  if (!wrap) return;
  const id = Number(wrap.dataset.id);
  const t = trainers.find((x) => x.id === id);

  if (e.target.classList.contains("chk")) {
    e.target.checked ? state.selected.add(id) : state.selected.delete(id);
    return renderBulk();
  }
  const action = e.target.closest("[data-action]")?.dataset.action;
  if (!action) return;
  e.stopPropagation();

  if (action === "menu") { state.openMenu = state.openMenu === id ? null : id; return render(); }
  state.openMenu = null;
  if (action === "edit") { openForm(t); render(); }
  if (action === "toggle") { t.active = !t.active; render(); toast(`${t.name} ${t.active ? "activated" : "deactivated"}`); }
  if (action === "delete") { render(); askDelete([id]); }
});

// close kebab menu when clicking elsewhere
document.addEventListener("click", (e) => {
  if (state.openMenu !== null && !e.target.closest(".menu, .kebab")) {
    state.openMenu = null;
    render();
  }
});

$("#search").addEventListener("input", (e) => { state.query = e.target.value; state.page = 1; render(); });
$("#filter").addEventListener("change", (e) => { state.filter = e.target.value; state.page = 1; render(); });

$("#pager").addEventListener("click", (e) => {
  const b = e.target.closest("button[data-page]");
  if (b && !b.disabled) { state.page = Number(b.dataset.page); render(); }
});
$("#pager").addEventListener("change", (e) => {
  if (e.target.id === "perPage") { state.perPage = Number(e.target.value); state.page = 1; render(); }
});

// bulk actions
$("#bulkToggle").addEventListener("click", () => {
  const sel = trainers.filter((t) => state.selected.has(t.id));
  const makeInactive = sel.some((t) => t.active);
  sel.forEach((t) => (t.active = !makeInactive));
  toast(`${sel.length} trainer${sel.length === 1 ? "" : "s"} ${makeInactive ? "deactivated" : "activated"}`);
  state.selected.clear();
  render();
});
$("#bulkDelete").addEventListener("click", () => askDelete([...state.selected]));
$("#bulkClear").addEventListener("click", () => { state.selected.clear(); render(); });

$("#addTrainer").addEventListener("click", () => openForm(null));
$("#cancelBtn").addEventListener("click", closeForm);

["modal", "confirm"].forEach((id) =>
  $("#" + id).addEventListener("click", (e) => {
    if (e.target.id === id) id === "modal" ? closeForm() : closeConfirm();
  })
);
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") {
    closeForm(); closeConfirm();
    if (state.openMenu !== null) { state.openMenu = null; render(); }
  }
});

render();
