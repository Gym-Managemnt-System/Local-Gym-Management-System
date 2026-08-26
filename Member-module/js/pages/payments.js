UI.requireMember(async function (member) {
  var content = document.getElementById('content');

  content.innerHTML =
    UI.pageHeader('Payments', member.plan_name ? member.plan_name + ' plan' : 'Payment history') +
    '<div id="stats"></div>' +
    '<div class="panel"><div class="panel-header"><h3>Payment history</h3>' +
    '<button class="link-accent" id="download-btn">Download full report (PDF)</button></div>' +
    '<p id="error" style="color:var(--red)" hidden></p>' +
    '<div id="table"><p style="color:var(--text-muted)">Loading…</p></div></div>';

  var errorBox = document.getElementById('error');

  var payments = [];
  try {
    payments = await window.API.getMemberPayments(member.id);
  } catch (err) {
    errorBox.textContent = 'Could not load payment history.';
    errorBox.hidden = false;
  }

  var totalPaid = payments
    .filter(function (p) {
      return p.status === 'paid';
    })
    .reduce(function (sum, p) {
      return sum + Number(p.amount);
    }, 0);

  document.getElementById('stats').innerHTML = UI.statGrid([
    {
      label: 'Total paid',
      value: UI.money(totalPaid),
      hint: 'Across ' + payments.length + ' payment(s)'
    },
    {
      label: 'Plan',
      value: member.plan_name || '—',
      hint: member.membership_end ? 'Renews ' + member.membership_end : ''
    },
    { label: 'Status', value: member.status || '—', hint: '' }
  ]);

  document.getElementById('table').innerHTML = payments.length
    ? '<div class="table-wrap"><table class="data-table"><thead><tr><th>Date</th><th>Method</th>' +
      '<th>Amount</th><th>Status</th></tr></thead><tbody>' +
      payments
        .map(function (p) {
          return (
            '<tr><td>' +
            UI.escapeHtml(p.payment_date) +
            '</td><td>' +
            UI.escapeHtml(p.payment_method || '—') +
            '</td><td>' +
            UI.money(p.amount) +
            '</td><td>' +
            UI.statusBadge(p.status === 'paid' ? 'Paid' : p.status) +
            '</td></tr>'
          );
        })
        .join('') +
      '</tbody></table></div>'
    : '<p style="color:var(--text-muted)">No payments recorded yet.</p>';

  var downloadBtn = document.getElementById('download-btn');
  downloadBtn.addEventListener('click', async function () {
    downloadBtn.disabled = true;
    downloadBtn.textContent = 'Preparing…';
    try {
      await window.API.downloadTransferReport(member.id);
    } catch (err) {
      errorBox.textContent = 'Could not generate the report.';
      errorBox.hidden = false;
    } finally {
      downloadBtn.disabled = false;
      downloadBtn.textContent = 'Download full report (PDF)';
    }
  });
});
