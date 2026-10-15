/* ============================================================
   Reports page – Gym Membership Management System
   Sample data below; replace with fetch() calls to your backend.
   ============================================================ */

const fmtRs = (n) => "Rs " + Number(n).toLocaleString("en-LK");
const fmtNum = (n) => Number(n).toLocaleString("en-LK");
const fmtPct = (n) => n + "%";

/* ---------- Report definitions ---------- */
const REPORTS = {
  revenue: {
    chartTitle: "Revenue | Last 6 months",
    tableTitle: "Revenue | Last 6 months",
    unit: fmtRs,
    chart: {
      labels: ["Mar", "Apr", "May", "Jun", "Jul", "Aug"],
      values: [172000, 195000, 235000, 165000, 288000, 322350],
    },
    columns: ["Plan", "Members", "Monthly Revenue", "Share"],
    rows: [
      { Plan: "Standard", Members: 300, "Monthly Revenue": 171750 },
      { Plan: "Basic",    Members: 112, "Monthly Revenue": 93600 },
      { Plan: "Premium",  Members: 172, "Monthly Revenue": 57000 },
    ],
    // computes share column from revenue
    format(rows) {
      const total = rows.reduce((s, r) => s + r["Monthly Revenue"], 0);
      return rows.map((r) => [
        r.Plan,
        fmtNum(r.Members),
        fmtRs(r["Monthly Revenue"]),
        fmtPct(Math.round((r["Monthly Revenue"] / total) * 100)),
      ]);
    },
  },

  membership: {
    chartTitle: "Membership growth | Last 6 months",
    tableTitle: "New sign-ups vs cancellations",
    unit: (n) => fmtNum(n) + " members",
    chart: {
      labels: ["Mar", "Apr", "May", "Jun", "Jul", "Aug"],
      values: [38, 45, 52, 31, 64, 71], // net new sign-ups
    },
    columns: ["Month", "New Sign-ups", "Cancellations", "Net Growth"],
    rows: [
      { Month: "Mar", signups: 52, cancels: 14 },
      { Month: "Apr", signups: 60, cancels: 15 },
      { Month: "May", signups: 68, cancels: 16 },
      { Month: "Jun", signups: 47, cancels: 16 },
      { Month: "Jul", signups: 79, cancels: 15 },
      { Month: "Aug", signups: 85, cancels: 14 },
    ],
    format(rows) {
      return rows.map((r) => [r.Month, r.signups, r.cancels, "+" + (r.signups - r.cancels)]);
    },
  },

  attendance: {
    chartTitle: "Attendance Trends | Weekly pattern",
    tableTitle: "Check-ins by day of week",
    unit: (n) => fmtNum(n) + " check-ins",
    chart: {
      labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
      values: [410, 385, 360, 395, 340, 290, 180],
    },
    columns: ["Day", "Check-ins", "Peak Hour", "Share"],
    rows: [
      { Day: "Monday",    n: 410, peak: "6:00 – 7:00 PM" },
      { Day: "Tuesday",   n: 385, peak: "6:00 – 7:00 PM" },
      { Day: "Wednesday", n: 360, peak: "5:30 – 6:30 PM" },
      { Day: "Thursday",  n: 395, peak: "6:00 – 7:00 PM" },
      { Day: "Friday",    n: 340, peak: "5:00 – 6:00 PM" },
      { Day: "Saturday",  n: 290, peak: "8:00 – 9:00 AM" },
      { Day: "Sunday",    n: 180, peak: "9:00 – 10:00 AM" },
    ],
    format(rows) {
      const total = rows.reduce((s, r) => s + r.n, 0);
      return rows.map((r) => [r.Day, fmtNum(r.n), r.peak, fmtPct(Math.round((r.n / total) * 100))]);
    },
  },

  trainers: {
    chartTitle: "Trainer performance | Active members per trainer",
    tableTitle: "Load, rating & retention",
    unit: (n) => fmtNum(n) + " members",
    chart: {
      labels: ["Nimal", "Saman", "Ayesha", "Kamal", "Dilini", "Ruwan"],
      values: [48, 62, 55, 39, 71, 44],
    },
    columns: ["Trainer", "Active Members", "Rating", "Retention"],
    rows: [
      { name: "Nimal P.",  load: 48, rating: 4.6, ret: 88 },
      { name: "Saman K.",  load: 62, rating: 4.4, ret: 81 },
      { name: "Ayesha F.", load: 55, rating: 4.8, ret: 92 },
      { name: "Kamal D.",  load: 39, rating: 4.2, ret: 78 },
      { name: "Dilini S.", load: 71, rating: 4.7, ret: 90 },
      { name: "Ruwan J.",  load: 44, rating: 4.5, ret: 85 },
    ],
    format(rows) {
      return rows.map((r) => [r.name, r.load, r.rating.toFixed(1) + " ★", fmtPct(r.ret)]);
    },
  },
};

/* ---------- DOM refs ---------- */
const $ = (sel) => document.querySelector(sel);
const chartEl = $("#chart");
const tooltip = $("#tooltip");
const thead = $("#dataTable thead");
const tbody = $("#dataTable tbody");
let currentKey = "revenue";

/* ---------- Rendering ---------- */
function renderChart(report) {
  const { labels, values } = report.chart;
  const max = Math.max(...values);
  chartEl.innerHTML = "";

  labels.forEach((label, i) => {
    const col = document.createElement("div");
    col.className = "bar-col";

    const bar = document.createElement("div");
    bar.className = "bar";
    bar.dataset.tip = `${label}: ${report.unit(values[i])}`;
    bar.tabIndex = 0;
    bar.setAttribute("aria-label", bar.dataset.tip);

    const text = document.createElement("div");
    text.className = "bar-label";
    text.textContent = label;

    col.append(bar, text);
    chartEl.appendChild(col);

    // animate after paint; leave room (~28px) for the label below
    requestAnimationFrame(() =>
      requestAnimationFrame(() => {
        bar.style.height = `calc(${(values[i] / max) * 100}% * 0.85)`;
      })
    );
  });
}

function renderTable(report) {
  thead.innerHTML =
    "<tr>" + report.columns.map((c) => `<th>${c}</th>`).join("") + "</tr>";
  tbody.innerHTML = report
    .format(report.rows)
    .map((cells) => "<tr>" + cells.map((c) => `<td>${c}</td>`).join("") + "</tr>")
    .join("");
}

function showReport(key) {
  const report = REPORTS[key];
  if (!report) return;
  currentKey = key;

  $("#chartTitle").textContent = report.chartTitle;
  $("#tableTitle").textContent = report.tableTitle;

  document.querySelectorAll(".tab").forEach((t) => {
    const active = t.dataset.report === key;
    t.classList.toggle("active", active);
    t.setAttribute("aria-selected", active);
  });

  renderChart(report);
  renderTable(report);
}

/* ---------- Exports ---------- */
function exportCSV() {
  const report = REPORTS[currentKey];
  const rows = [report.columns, ...report.format(report.rows)];
  const csv = rows
    .map((r) => r.map((c) => `"${String(c).replace(/"/g, '""')}"`).join(","))
    .join("\r\n");

  const blob = new Blob(["\ufeff" + csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `${currentKey}-report-${new Date().toISOString().slice(0, 10)}.csv`;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

function exportPDF() {
  // Uses the browser's print dialog -> "Save as PDF" (see @media print in CSS)
  const prev = document.title;
  document.title = `${currentKey}-report-${new Date().toISOString().slice(0, 10)}`;
  window.print();
  document.title = prev;
}

/* ---------- Events ---------- */
$("#reportTabs").addEventListener("click", (e) => {
  const tab = e.target.closest(".tab");
  if (tab) showReport(tab.dataset.report);
});

$("#exportCsv").addEventListener("click", exportCSV);
$("#exportPdf").addEventListener("click", exportPDF);

// Chart tooltip
function moveTip(e, bar) {
  tooltip.textContent = bar.dataset.tip;
  tooltip.style.left = e.clientX + "px";
  tooltip.style.top = e.clientY + "px";
  tooltip.classList.add("show");
}
chartEl.addEventListener("mousemove", (e) => {
  const bar = e.target.closest(".bar");
  bar ? moveTip(e, bar) : tooltip.classList.remove("show");
});
chartEl.addEventListener("mouseleave", () => tooltip.classList.remove("show"));
chartEl.addEventListener("focusin", (e) => {
  const bar = e.target.closest(".bar");
  if (!bar) return;
  const r = bar.getBoundingClientRect();
  moveTip({ clientX: r.left + r.width / 2, clientY: r.top }, bar);
});
chartEl.addEventListener("focusout", () => tooltip.classList.remove("show"));

/* ---------- Init ---------- */
showReport("revenue");
