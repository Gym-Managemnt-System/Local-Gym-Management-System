UI.requireMember(async function (member) {
  var content = document.getElementById('content');
  var firstName = (member.full_name || 'there').split(' ')[0];

  content.innerHTML =
    UI.pageHeader('Welcome back, ' + firstName, "Here's your membership at a glance") +
    '<div class="panel"><div class="highlight-banner"><div><h3>Welcome back, ' +
    UI.escapeHtml(firstName) +
    '</h3><p>' +
    UI.escapeHtml(member.plan_name || 'No plan assigned') +
    '</p></div><div class="highlight-right"><strong>' +
    UI.escapeHtml(member.membership_end || '—') +
    '</strong><span>Membership end date</span></div></div></div>' +
    '<div style="height:20px"></div><div id="stats"></div>' +
    '<div class="panel"><div class="panel-header"><h3>Recent check-ins</h3></div>' +
    '<div id="recent"><p style="color:var(--text-muted)">Loading…</p></div></div>';

  var attendance = [];
  try {
    attendance = await window.API.getMemberAttendance(member.id);
  } catch (err) {
    document.getElementById('recent').innerHTML =
      '<p style="color:var(--red)">Could not load attendance.</p>';
  }

  var now = new Date();
  var thisMonth = attendance.filter(function (a) {
    var d = new Date(a.check_in_date);
    return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
  });
  var daysSinceJoin = Math.max(
    1,
    Math.ceil((now - new Date(member.join_date)) / (1000 * 60 * 60 * 24))
  );
  var avgPerWeek = ((attendance.length / daysSinceJoin) * 7).toFixed(1);

  document.getElementById('stats').innerHTML = UI.statGrid([
    { label: 'Visits this month', value: String(thisMonth.length), hint: 'Avg ' + avgPerWeek + ' / week' },
    { label: 'Total check-ins', value: String(attendance.length), hint: 'All time' },
    {
      label: 'Membership',
      value: member.status === 'active' ? 'Active' : member.status || '—',
      hint: member.membership_end ? 'Until ' + member.membership_end : ''
    }
  ]);

  var recent = attendance
    .slice()
    .sort(function (a, b) {
      return new Date(b.check_in_date) - new Date(a.check_in_date);
    })
    .slice(0, 5);

  document.getElementById('recent').innerHTML = recent.length
    ? recent
        .map(function (a) {
          return (
            '<div class="list-row"><div><div class="list-row-title">' +
            UI.escapeHtml(a.check_in_date) +
            '</div><div class="list-row-meta">Checked in at ' +
            UI.escapeHtml(a.check_in_time) +
            '</div></div></div>'
          );
        })
        .join('')
    : '<p style="color:var(--text-muted)">No check-ins recorded yet.</p>';
});
