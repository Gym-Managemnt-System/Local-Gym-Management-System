UI.requireMember(function (member) {
  var initials = (member.full_name || '')
    .split(' ')
    .slice(0, 2)
    .map(function (p) {
      return p[0] || '';
    })
    .join('')
    .toUpperCase();

  var fields = [
    { label: 'Full name', value: member.full_name || '' },
    { label: 'Email', value: member.email || '' },
    { label: 'Plan', value: member.plan_name || '—' },
    { label: 'Status', value: member.status || '—' },
    { label: 'Member ID', value: member.id == null ? '' : member.id },
    { label: 'Member since', value: member.join_date || '' }
  ];

  document.getElementById('content').innerHTML =
    UI.pageHeader('My profile', 'Your account details') +
    '<div class="panel"><div class="profile-header"><div class="avatar gold">' +
    UI.escapeHtml(initials || '—') +
    '</div><div><h2>' +
    UI.escapeHtml(member.full_name) +
    '</h2><a href="mailto:' +
    UI.escapeHtml(member.email) +
    '">' +
    UI.escapeHtml(member.email) +
    '</a></div></div>' +
    '<div class="form-grid">' +
    fields
      .map(function (f) {
        return (
          '<div class="field"><label>' +
          f.label +
          '</label><input value="' +
          UI.escapeHtml(f.value) +
          '" disabled /></div>'
        );
      })
      .join('') +
    '</div>' +
    '<p style="color:var(--text-faint);font-size:12.5px;margin-top:16px">These fields are ' +
    "read-only — the backend doesn't currently support members editing their own profile. " +
    'Contact the front desk for changes.</p>' +
    '<div class="form-actions"><button class="btn btn-outline" id="logout-profile">Log out</button></div></div>';

  document.getElementById('logout-profile').addEventListener('click', window.Auth.logout);
});
