(function () {
  if (!window.Auth.isAuthenticated()) {
    window.location.replace('login.html');
    return;
  }

  var user = window.Auth.getUser();
  if (user && user.full_name) {
    document.getElementById('title').textContent = 'Almost there, ' + user.full_name.split(' ')[0];
  }

  document.getElementById('logout-link').addEventListener('click', window.Auth.logout);

  var btn = document.getElementById('refresh-btn');
  btn.addEventListener('click', async function () {
    btn.disabled = true;
    btn.textContent = 'Checking…';
    try {
      await window.API.getMyMember();
      window.location.href = 'dashboard.html';
    } catch (err) {
      btn.disabled = false;
      btn.textContent = 'Refresh';
    }
  });
})();
