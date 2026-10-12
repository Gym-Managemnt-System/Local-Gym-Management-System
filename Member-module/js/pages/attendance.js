UI.requireMember(function (member) {
  var content = document.getElementById('content');
  var history = [];

  function render() {
    var todayStr = new Date().toISOString().slice(0, 10);
    var alreadyCheckedIn = history.some(function (h) {
      return h.check_in_date === todayStr;
    });

    var now = new Date();
    var thisMonth = history.filter(function (h) {
      var d = new Date(h.check_in_date);
      return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
    });
    var startOfWeek = new Date(now);
    startOfWeek.setDate(now.getDate() - now.getDay());
    var thisWeek = history.filter(function (h) {
      return new Date(h.check_in_date) >= startOfWeek;
    });

    var todayLabel = now.toLocaleDateString(undefined, {
      weekday: 'long',
      day: '2-digit',
      month: 'long',
      year: 'numeric'
    });

    var rows = history
      .slice()
      .sort(function (a, b) {
        return new Date(b.check_in_date) - new Date(a.check_in_date);
      })
      .map(function (row) {
        return (
          '<tr><td>' +
          UI.escapeHtml(row.check_in_date) +
          '</td><td>' +
          UI.escapeHtml(row.check_in_time) +
          '</td></tr>'
        );
      })
      .join('');

    content.innerHTML =
      UI.pageHeader('My attendance', history.length + ' total check-ins on record') +
      '<div class="panel"><div class="checkin-banner"><div class="checkin-left">' +
      '<h3>Check-in for today</h3><p>' +
      UI.escapeHtml(todayLabel) +
      '</p></div>' +
      (alreadyCheckedIn
        ? '<button class="btn btn-done">Checked in today</button>'
        : '<button class="btn btn-accent" id="checkin-btn">Check-in</button>') +
      '</div><p id="checkin-error" style="color:var(--red);margin-top:12px" hidden></p></div>' +
      '<div style="height:20px"></div>' +
      UI.statGrid([
        { label: 'This month', value: String(thisMonth.length), hint: 'Visits' },
        { label: 'This week', value: String(thisWeek.length), hint: 'Visits' },
        { label: 'All time', value: String(history.length), hint: 'Total check-ins' }
      ]) +
      '<div class="panel"><div class="panel-header"><h3>Attendance history</h3></div>' +
      (history.length
        ? '<div class="table-wrap"><table class="data-table"><thead><tr><th>Date</th><th>Check-in time</th></tr></thead><tbody>' +
          rows +
          '</tbody></table></div>'
        : '<p style="color:var(--text-muted)">No check-ins recorded yet.</p>') +
      '</div>';

    var btn = document.getElementById('checkin-btn');
    if (btn) {
      btn.addEventListener('click', async function () {
        btn.disabled = true;
        btn.textContent = 'Checking in…';
        try {
          await window.API.checkIn(member.id);
          await load();
        } catch (err) {
          var box = document.getElementById('checkin-error');
          box.textContent = err.message || 'Check-in failed.';
          box.hidden = false;
          btn.disabled = false;
          btn.textContent = 'Check-in';
        }
      });
    }
  }

  async function load() {
    try {
      history = await window.API.getMemberAttendance(member.id);
    } catch (err) {
      history = [];
    }
    render();
  }

  content.innerHTML = '<p style="color:var(--text-muted)">Loading…</p>';
  load();
});
