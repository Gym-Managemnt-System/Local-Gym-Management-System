// ── Dropdown toggle logic ───────────────────────────────────────────
document.querySelectorAll('.custom-dropdown').forEach(function(dropdown) {
  const trigger = dropdown.querySelector('.custom-dropdown-trigger');
  const label   = dropdown.querySelector('.custom-dropdown-label');
  const options = dropdown.querySelector('.custom-dropdown-options');

  trigger.addEventListener('click', function(e) {
    e.stopPropagation();
    document.querySelectorAll('.custom-dropdown').forEach(function(other) {
      if (other !== dropdown) other.classList.remove('open');
    });
    dropdown.classList.toggle('open');
  });

  options.addEventListener('click', function(e) {
    const li = e.target.closest('li');
    if (!li) return;

    options.querySelectorAll('li').forEach(item => item.classList.remove('selected'));
    li.classList.add('selected');
    label.textContent = li.textContent;

    dropdown.classList.remove('open');
    applyFilters();
  });
});

document.addEventListener('click', function() {
  document.querySelectorAll('.custom-dropdown').forEach(d => d.classList.remove('open'));
});

// ── State ────────────────────────────────────────────────────────────
let allPayments = [];

// ── Init ─────────────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  fetchPayments();
  const searchInput = document.querySelector('.search-box input');
  if (searchInput) searchInput.addEventListener('input', applyFilters);
});

// ── Fetch from backend ───────────────────────────────────────────────
async function fetchPayments() {
  const token = localStorage.getItem('token') || sessionStorage.getItem('token');
  if (!token) return;
  try {
    const res = await fetch('http://localhost:5000/api/payments', {
      headers: { 'Authorization': 'Bearer ' + token }
    });
    if (res.ok) {
      allPayments = await res.json();
      updateStats();
      applyFilters();
    }
  } catch (err) {
    console.error('Error fetching payments:', err);
  }
}

// ── Stat cards ───────────────────────────────────────────────────────
function updateStats() {
  let collected = 0, pending = 0, pendingCount = 0, overdue = 0, overdueCount = 0;
  let currentMonthCount = 0;

  allPayments.forEach(p => {
    const amt = parseFloat(p.amount) || 0;
    const isThisMonth = new Date(p.payment_date).getMonth() === new Date().getMonth();
    const st = (p.status || '').toLowerCase();

    if (st === 'paid') {
      if (isThisMonth) { collected += amt; currentMonthCount++; }
    } else if (st === 'pending') {
      pending += amt; pendingCount++;
    } else if (st === 'overdue') {
      overdue += amt; overdueCount++;
    }
  });

  const avg = currentMonthCount > 0 ? (collected / currentMonthCount) : 0;
  const statValues = document.querySelectorAll('.stat-card-value');
  const statNotes  = document.querySelectorAll('.stat-card-note');
  if (statValues.length >= 4) {
    statValues[0].textContent = 'Rs ' + collected.toLocaleString();
    statValues[1].textContent = 'Rs ' + pending.toLocaleString();
    if (statNotes[1]) statNotes[1].textContent = pendingCount + ' invoices';
    statValues[2].textContent = 'Rs ' + overdue.toLocaleString();
    if (statNotes[2]) statNotes[2].textContent = overdueCount + ' members';
    statValues[3].textContent = 'Rs ' + avg.toLocaleString(undefined, { maximumFractionDigits: 0 });
  }
}

// ── Filter & render ──────────────────────────────────────────────────
function getDropdownValue(id) {
  const el = document.getElementById(id);
  if (!el) return 'all';
  const selected = el.querySelector('li.selected');
  return selected ? selected.dataset.value : 'all';
}

function applyFilters() {
  const searchInput = document.querySelector('.search-box input');
  let filtered = [...allPayments];

  // Search
  if (searchInput && searchInput.value.trim()) {
    const q = searchInput.value.toLowerCase().trim();
    filtered = filtered.filter(p => (p.full_name || '').toLowerCase().includes(q));
  }

  // Status filter
  const statusVal = getDropdownValue('statusDropdown').toLowerCase();
  if (statusVal && statusVal !== 'all') {
    filtered = filtered.filter(p => (p.status || '').toLowerCase() === statusVal);
  }

  // Method filter
  const methodVal = getDropdownValue('methodDropdown').toLowerCase();
  if (methodVal && methodVal !== 'all') {
    filtered = filtered.filter(p => (p.payment_method || '').toLowerCase().includes(methodVal));
  }

  renderPaymentsTable(filtered);
}

function renderPaymentsTable(data) {
  const tbody = document.querySelector('.payments-data-table tbody');
  if (!tbody) return;

  if (data.length === 0) {
    tbody.innerHTML = '<tr><td colspan="7" style="text-align:center;padding:20px;opacity:0.6;">No payments found.</td></tr>';
    return;
  }

  tbody.innerHTML = data.map(p => {
    const initials   = (p.full_name || '??').substring(0, 2).toUpperCase();
    const plan       = (p.plan_name || 'N/A') + (p.duration_months ? ' - ' + p.duration_months + ' mo' : '');
    const st         = (p.status || '').toLowerCase();
    const statusText  = p.status ? p.status.charAt(0).toUpperCase() + p.status.slice(1).toLowerCase() : '-';

    let statusClass = 'status-active';           // green  → paid
    if (st === 'pending')  statusClass = 'status-warning';   // yellow → pending
    if (st === 'overdue')  statusClass = 'status-expired';   // red    → overdue
    if (!st)               statusClass = '';                  // blank  → no badge

    const dateStr = p.payment_date
      ? new Date(p.payment_date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
      : 'N/A';

    return `
      <tr>
        <td class="checkbox-col menu-col" style="position:relative;">
          <div style="cursor:pointer;padding:5px;" onclick="toggleMenu(event,${p.id})">⋮</div>
          <div class="action-menu" id="menu-${p.id}" style="display:none;position:absolute;left:25px;top:15px;background:rgba(20,20,20,0.95);border:1px solid rgba(255,255,255,0.1);border-radius:6px;z-index:50;width:100px;text-align:left;overflow:hidden;">
            <div style="padding:8px 12px;cursor:pointer;font-size:13px;color:#fff;" onmouseover="this.style.background='rgba(255,255,255,0.1)'" onmouseout="this.style.background='transparent'" onclick="editPayment(${p.id})">Edit</div>
            <div style="padding:8px 12px;cursor:pointer;font-size:13px;color:#ff4d4d;" onmouseover="this.style.background='rgba(255,0,0,0.1)'" onmouseout="this.style.background='transparent'" onclick="deletePayment(${p.id})">Delete</div>
          </div>
        </td>
        <td class="member-cell">
          <span class="avatar-badge" style="background:#4c8c4a">${initials}</span>
          <span class="member-name">${p.full_name || 'Unknown'}</span>
        </td>
        <td>${plan}</td>
        <td>Rs ${p.amount}</td>
        <td>${dateStr}</td>
        <td>${p.payment_method || '-'}</td>
        <td><span class="status ${statusClass}">${statusText}</span></td>
      </tr>
    `;
  }).join('');
}

// ── Action menu ──────────────────────────────────────────────────────
function toggleMenu(e, id) {
  e.stopPropagation();
  document.querySelectorAll('.action-menu').forEach(m => {
    m.style.display = (m.id === 'menu-' + id && m.style.display === 'none') ? 'block' : 'none';
  });
}

document.addEventListener('click', () => {
  document.querySelectorAll('.action-menu').forEach(m => m.style.display = 'none');
});

function editPayment(id) {
  window.location.href = `edit-payment.html?id=${id}`;
}

async function deletePayment(id) {
  if (!confirm('Are you sure you want to delete this payment?')) return;
  const token = localStorage.getItem('token') || sessionStorage.getItem('token');
  try {
    const res = await fetch(`http://localhost:5000/api/payments/${id}`, {
      method: 'DELETE',
      headers: { 'Authorization': 'Bearer ' + token }
    });
    if (res.ok) fetchPayments();
    else alert('Failed to delete payment.');
  } catch (err) {
    console.error(err);
  }
}

// ── Export CSV ───────────────────────────────────────────────────────
document.querySelector('.export-btn').addEventListener('click', () => {
  if (allPayments.length === 0) return alert('No data to export.');

  const headers = ['ID', 'Member', 'Plan', 'Amount', 'Date', 'Method', 'Status'];
  const rows = allPayments.map(p => {
    const plan    = (p.plan_name || 'N/A') + (p.duration_months ? ' - ' + p.duration_months + ' mo' : '');
    const dateStr = p.payment_date ? new Date(p.payment_date).toISOString().split('T')[0] : '';
    return [p.id, `"${p.full_name || ''}"`, `"${plan}"`, p.amount, dateStr, p.payment_method, p.status].join(',');
  });

  const csv  = [headers.join(','), ...rows].join('\n');
  const blob = new Blob([csv], { type: 'text/csv' });
  const url  = URL.createObjectURL(blob);
  const a    = Object.assign(document.createElement('a'), { href: url, download: 'payments.csv' });
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
});