UI.requireMember(function (member) {
  var includes = [
    'Member profile & status',
    'Membership duration & plan',
    'Attendance percentage',
    'Payment history',
    'Classes attended & trainer',
    'Report generation date'
  ];

  document.getElementById('content').innerHTML =
    UI.pageHeader('Reports', 'Generate a Membership Transfer Report') +
    '<div class="panel"><div class="report-hero"><div class="report-icon">' +
    UI.icon('reports', 22) +
    '</div><div><h3>Membership Transfer Report</h3><p>Moving to a new gym? Download a PDF summary ' +
    'of your history — your new gym can use it to simplify registration and fitness assessment, ' +
    'without needing direct access to our system.</p></div></div>' +
    '<div class="includes-label">This report includes</div><div class="includes-grid">' +
    includes
      .map(function (item) {
        return '<div class="includes-row">' + item + UI.icon('chevron', 16) + '</div>';
      })
      .join('') +
    '</div>' +
    '<div class="report-summary">' +
    '<div class="report-summary-row"><span class="label">Member</span><span class="value">' +
    UI.escapeHtml(member.full_name) +
    ' — ID #' +
    UI.escapeHtml(member.id) +
    '</span></div>' +
    '<div class="report-summary-row"><span class="label">Current plan</span><span class="value">' +
    UI.escapeHtml(member.plan_name || '—') +
    '</span></div>' +
    '<div class="report-summary-row"><span class="label">Membership</span><span class="value">' +
    UI.escapeHtml(member.membership_start || '—') +
    ' – ' +
    UI.escapeHtml(member.membership_end || '—') +
    '</span></div></div>' +
    '<p id="error" style="color:var(--red);margin-bottom:12px" hidden></p>' +
    '<button class="btn btn-accent" id="generate-btn">Generate PDF</button>' +
    '<p class="report-note">The report reflects your account as of today. Generating a new report ' +
    'does not cancel or affect your current membership.</p></div>';

  var btn = document.getElementById('generate-btn');
  var errorBox = document.getElementById('error');

  btn.addEventListener('click', async function () {
    errorBox.hidden = true;
    btn.disabled = true;
    btn.textContent = 'Generating…';
    try {
      await window.API.downloadTransferReport(member.id);
    } catch (err) {
      errorBox.textContent = 'Could not generate the report. Please try again.';
      errorBox.hidden = false;
    } finally {
      btn.disabled = false;
      btn.textContent = 'Generate PDF';
    }
  });
});
