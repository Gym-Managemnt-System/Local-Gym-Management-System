UI.requireMember(async function (member) {
  var content = document.getElementById('content');

  content.innerHTML =
    UI.pageHeader('Book a class', member.plan_name ? member.plan_name + ' plan' : 'Class schedule') +
    '<div class="panel" id="error" style="color:var(--red);margin-bottom:20px" hidden></div>' +
    '<div id="classes"><p style="color:var(--text-muted)">Loading classes…</p></div>';

  var errorBox = document.getElementById('error');
  var list = document.getElementById('classes');

  function showError(message) {
    errorBox.textContent = message;
    errorBox.hidden = false;
  }

  var classes = [];
  try {
    classes = await window.API.getClasses();
  } catch (err) {
    showError('Could not load classes.');
    list.innerHTML = '';
    return;
  }

  if (!classes.length) {
    list.innerHTML = '<p style="color:var(--text-muted)">No classes have been scheduled yet.</p>';
    return;
  }

  list.innerHTML =
    '<div class="class-grid">' +
    classes
      .map(function (c) {
        return (
          '<div class="class-card"><div class="class-time">' +
          UI.escapeHtml(c.schedule_day || '') +
          (c.schedule_time ? ' — ' + UI.escapeHtml(c.schedule_time) : '') +
          '</div><div class="class-name">' +
          UI.escapeHtml(c.class_name) +
          '</div><div class="class-trainer">Trainer: ' +
          UI.escapeHtml(c.trainer_name || 'Unassigned') +
          '</div><div class="class-booked-count">Capacity: ' +
          UI.escapeHtml(c.capacity) +
          '</div><button class="btn btn-accent full" data-class-id="' +
          c.id +
          '">Book class</button></div>'
        );
      })
      .join('') +
    '</div>';

  list.addEventListener('click', async function (e) {
    var btn = e.target.closest('button[data-class-id]');
    if (!btn) return;
    var classId = btn.getAttribute('data-class-id');
    btn.disabled = true;
    btn.textContent = 'Booking…';
    try {
      await window.API.enrollInClass(member.id, Number(classId));
      btn.className = 'btn btn-done full';
      btn.textContent = 'Booked';
    } catch (err) {
      showError(err.message || 'Could not book this class.');
      btn.disabled = false;
      btn.textContent = 'Book class';
    }
  });
});
