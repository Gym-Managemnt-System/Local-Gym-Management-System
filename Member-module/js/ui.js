/* Shared UI helpers: icons, page header, stat pills, badges, sidebar,
   and the auth/membership guards. Replaces the React shared components. */
(function () {
  var SVG_ATTRS =
    'viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" ' +
    'stroke-linecap="round" stroke-linejoin="round"';

  function icon(name, size) {
    var s = size || 18;
    var paths = {
      overview:
        '<rect x="3" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="3" width="7" height="7" rx="1.5"/>' +
        '<rect x="3" y="14" width="7" height="7" rx="1.5"/><rect x="14" y="14" width="7" height="7" rx="1.5"/>',
      calendar:
        '<rect x="3" y="4.5" width="18" height="16" rx="2"/><path d="M3 9.5h18"/><path d="M8 2.5v4M16 2.5v4"/>',
      attendance: '<circle cx="12" cy="8" r="3.4"/><path d="M5 20c0-3.6 3.1-6.2 7-6.2s7 2.6 7 6.2"/>',
      payments:
        '<rect x="2.5" y="5.5" width="19" height="13" rx="2.2"/><path d="M2.5 9.5h19"/><path d="M6 14.5h4"/>',
      reports:
        '<path d="M6 3h9l4 4v14a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1Z"/>' +
        '<path d="M14.5 3v4.5H19"/><path d="M8 13l2 2 4-4.2"/>',
      profile: '<circle cx="12" cy="8" r="3.6"/><path d="M4.5 20c0-4 3.4-6.8 7.5-6.8s7.5 2.8 7.5 6.8"/>',
      chevron: '<path d="M9 6l6 6-6 6"/>'
    };
    return (
      '<svg width="' + s + '" height="' + s + '" ' + SVG_ATTRS + '>' + (paths[name] || '') + '</svg>'
    );
  }

  function escapeHtml(value) {
    return String(value == null ? '' : value).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }

  function pageHeader(title, subtitle) {
    return (
      '<div class="page-header"><div class="page-header-row"><div><h1>' +
      escapeHtml(title) +
      '</h1>' +
      (subtitle ? '<p>' + escapeHtml(subtitle) + '</p>' : '') +
      '</div></div></div>'
    );
  }

  function statGrid(stats) {
    return (
      '<div class="stat-grid">' +
      stats
        .map(function (s) {
          return (
            '<div class="stat-pill"><div class="stat-label">' +
            escapeHtml(s.label) +
            '</div><div class="stat-value">' +
            escapeHtml(s.value) +
            '</div><div class="stat-hint">' +
            escapeHtml(s.hint || '') +
            '</div></div>'
          );
        })
        .join('') +
      '</div>'
    );
  }

  function statusBadge(status) {
    var positive = ['Booked', 'Attended', 'Paid'].indexOf(status) !== -1;
    return '<span class="badge ' + (positive ? 'green' : 'red') + '">' + escapeHtml(status) + '</span>';
  }

  var NAV = {
    account: [
      { href: 'dashboard.html', label: 'Overview', icon: 'overview' },
      { href: 'book-a-class.html', label: 'Book a class', icon: 'calendar' },
      { href: 'attendance.html', label: 'My Attendance', icon: 'attendance' },
      { href: 'payments.html', label: 'Payments', icon: 'payments' },
      { href: 'reports.html', label: 'Reports', icon: 'reports' }
    ],
    profile: [{ href: 'profile.html', label: 'My Profile', icon: 'profile' }]
  };

  function currentFile() {
    var parts = window.location.pathname.split('/');
    return parts[parts.length - 1] || 'index.html';
  }

  function navGroup(label, links) {
    var here = currentFile();
    return (
      '<div><div class="nav-section-label">' +
      label +
      '</div><ul class="nav-list">' +
      links
        .map(function (l) {
          var active = l.href === here ? ' active' : '';
          return (
            '<li><a class="nav-link' +
            active +
            '" href="' +
            l.href +
            '">' +
            icon(l.icon) +
            l.label +
            '</a></li>'
          );
        })
        .join('') +
      '</ul></div>'
    );
  }

  function renderSidebar(member) {
    var el = document.getElementById('sidebar');
    if (!el) return;
    var name = (member && member.full_name) || 'Member';
    var parts = name.split(' ');
    var initials = parts
      .slice(0, 2)
      .map(function (p) {
        return p[0] || '';
      })
      .join('')
      .toUpperCase();
    var shortName = (parts[0] + ' ' + (parts[1] ? parts[1][0] + '.' : '')).trim();
    var role =
      member && member.status === 'active' ? 'Active member' : (member && member.status) || 'Member';

    el.className = 'sidebar';
    el.innerHTML =
      '<div class="brand">Fitness Center</div>' +
      navGroup('My Account', NAV.account) +
      navGroup('Profile', NAV.profile) +
      '<div class="sidebar-spacer"></div>' +
      '<div class="sidebar-user"><div class="avatar gold">' +
      escapeHtml(initials) +
      '</div><div style="flex:1"><div class="sidebar-user-name">' +
      escapeHtml(shortName) +
      '</div><div class="sidebar-user-role">' +
      escapeHtml(role) +
      '</div></div>' +
      '<button class="sidebar-logout" id="logout-btn" title="Log out">&#9099;</button></div>';

    document.getElementById('logout-btn').addEventListener('click', window.Auth.logout);
  }

  /* Guards + member loading. Calls done(member) only when the visitor is
     logged in AND has a membership linked to the account. */
  async function requireMember(done) {
    if (!window.Auth.isAuthenticated()) {
      window.location.replace('login.html');
      return;
    }
    var member;
    try {
      member = await window.API.getMyMember();
    } catch (err) {
      if (err.status === 404) {
        window.location.replace('no-membership.html');
      } else if (err.status === 401) {
        window.location.replace('login.html');
      } else {
        var content = document.querySelector('.content');
        if (content) {
          content.innerHTML =
            '<div class="panel" style="color:var(--red)">Could not load your membership. Please refresh and try again.</div>';
        }
      }
      return;
    }
    renderSidebar(member);
    done(member);
  }

  window.UI = {
    icon: icon,
    escapeHtml: escapeHtml,
    pageHeader: pageHeader,
    statGrid: statGrid,
    statusBadge: statusBadge,
    renderSidebar: renderSidebar,
    requireMember: requireMember,
    money: function (value) {
      return 'Rs ' + Number(value || 0).toLocaleString();
    }
  };
})();
