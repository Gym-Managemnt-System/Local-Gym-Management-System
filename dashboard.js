document.addEventListener('DOMContentLoaded', async () => {
  const token = localStorage.getItem('token') || sessionStorage.getItem('token');
  if (!token) {
    window.location.href = 'login.html';
    return;
  }

  try {
    const res = await fetch('http://localhost:5000/api/dashboard/stats', {
      headers: {
        'Authorization': 'Bearer ' + token
      }
    });

    if (res.status === 401 || res.status === 403) {
      window.location.href = 'login.html';
      return;
    }

    if (!res.ok) {
      console.error('Failed to load dashboard data');
      return;
    }

    const data = await res.json();
    renderDashboard(data);
  } catch (err) {
    console.error('Error fetching dashboard stats:', err);
  }
});

function renderDashboard(data) {
  const { stats, attendance, recent_members, classes, payments_due } = data;

  // 1. Stats
  if (stats) {
    const elActive = document.getElementById('statActiveMembers');
    if (elActive) elActive.textContent = stats.active_members;

    const elChecked = document.getElementById('statCheckedInToday');
    if (elChecked) elChecked.textContent = stats.checked_in_today;

    const elRev = document.getElementById('statRevenue');
    if (elRev) {
      const revToShow = stats.revenue_this_month > 0 ? stats.revenue_this_month : (stats.total_revenue || 0);
      elRev.textContent = 'Rs ' + revToShow.toLocaleString();
    }
    const elRevChange = document.getElementById('statRevenueTotal');
    if (elRevChange) {
      elRevChange.textContent = stats.revenue_this_month > 0
        ? `Total: Rs ${stats.total_revenue.toLocaleString()}`
        : 'Total collected';
    }

    const elExpiring = document.getElementById('statExpiring');
    if (elExpiring) elExpiring.textContent = stats.expiring_soon;
    const elExpSub = document.getElementById('statExpiringSub');
    if (elExpSub) {
      elExpSub.textContent = stats.expiring_soon > 0 ? 'needs follow up' : 'all up to date';
      if (stats.expiring_soon === 0) elExpSub.style.color = '#5fae4d';
    }
  }

  // 2. Attendance Bar Chart
  const chartEl = document.getElementById('dashboardAttendanceChart');
  if (chartEl && attendance && attendance.length > 0) {
    const maxVal = Math.max(...attendance.map(a => a.count), 1);
    chartEl.innerHTML = attendance.map(item => {
      const pct = item.count === 0 ? 8 : Math.max(15, Math.round((item.count / maxVal) * 100));
      return `
        <div class="bar" style="--h:${pct}%" title="${item.day} (${item.date}): ${item.count} check-ins">
          <span>${item.day}</span>
        </div>
      `;
    }).join('');
  }

  // 3. Recent Members
  const membersTbody = document.getElementById('dashboardRecentMembers');
  if (membersTbody) {
    if (!recent_members || recent_members.length === 0) {
      membersTbody.innerHTML = '<tr><td colspan="4" style="text-align:center; padding:15px; opacity:0.6;">No members registered yet.</td></tr>';
    } else {
      const colors = ['#e3573f', '#4c8c4a', '#c9a227', '#e08a2b', '#2a75d3'];
      membersTbody.innerHTML = recent_members.map((m, idx) => {
        const initials = m.full_name ? m.full_name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase() : '??';
        const color = colors[idx % colors.length];
        const dateStr = m.join_date ? new Date(m.join_date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }) : 'N/A';
        const planStr = (m.plan_name || 'Standard') + (m.duration_months ? ` - ${m.duration_months} mo` : '');

        let statusClass = 'status-active';
        let statusLabel = 'Active';
        if (m.status === 'expired') {
          statusClass = 'status-expired';
          statusLabel = 'Expired';
        } else if (m.status === 'deactivated') {
          statusClass = 'status-warning';
          statusLabel = 'Deactivated';
        }

        return `
          <tr>
            <td class="member-cell">
              <span class="avatar-badge" style="background:${color}">${initials}</span>
              ${escapeHtml(m.full_name || 'Unknown')}
            </td>
            <td>${escapeHtml(planStr)}</td>
            <td>${dateStr}</td>
            <td><span class="status ${statusClass}">${statusLabel}</span></td>
          </tr>
        `;
      }).join('');
    }
  }

  // 4. Today's Classes
  const classListEl = document.getElementById('dashboardClassList');
  if (classListEl) {
    if (!classes || classes.length === 0) {
      classListEl.innerHTML = '<li style="opacity:0.6; padding:10px 0;">No classes scheduled.</li>';
    } else {
      const dotColors = ['#e3573f', '#e0b12b', '#5fae4d', '#2a75d3'];
      classListEl.innerHTML = classes.map((c, idx) => {
        const dotColor = dotColors[idx % dotColors.length];
        const timeStr = c.start_time ? ` - ${c.start_time}` : '';
        const durStr = c.duration_minutes ? ` (${c.duration_minutes}m)` : '';
        return `
          <li>
            <span class="dot" style="background:${dotColor}"></span>
            <div>
              <div class="class-name">${escapeHtml(c.class_name)}${escapeHtml(timeStr)}</div>
              <div class="class-meta">Trainer: ${escapeHtml(c.trainer_name || 'Assigned')} · ${c.booked_count} booked${durStr}</div>
            </div>
          </li>
        `;
      }).join('');
    }
  }

  // 5. Payments Due
  const paymentsListEl = document.getElementById('dashboardPaymentsDue');
  if (paymentsListEl) {
    if (!payments_due || payments_due.length === 0) {
      paymentsListEl.innerHTML = '<li style="opacity:0.6; padding:10px 0;">No pending or overdue payments!</li>';
    } else {
      paymentsListEl.innerHTML = payments_due.map(p => {
        const isOverdue = (p.status || '').toLowerCase() === 'overdue';
        const planStr = p.plan_name ? `${p.plan_name} Plan` : 'Membership';
        const dateStr = p.payment_date ? new Date(p.payment_date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' }) : '';
        const dueText = isOverdue ? `Overdue (${dateStr})` : `Due: Rs ${Number(p.amount).toLocaleString()}`;
        return `
          <li>
            <div class="payment-name">${escapeHtml(p.full_name || 'Unknown')}</div>
            <div class="payment-meta" style="${isOverdue ? 'color:#ff4d4d;' : ''}">${escapeHtml(planStr)} · ${dueText}</div>
          </li>
        `;
      }).join('');
    }
  }
}

function escapeHtml(str) {
  return String(str == null ? '' : str).replace(/[&<>"']/g, c => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
  }[c]));
}
