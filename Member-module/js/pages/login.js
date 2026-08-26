(function () {
  var form = document.getElementById('login-form');
  var errorBox = document.getElementById('error');
  var submitBtn = document.getElementById('submit-btn');
  var forgotBtn = document.getElementById('forgot-btn');
  var forgotNote = document.getElementById('forgot-note');

  forgotBtn.addEventListener('click', function () {
    forgotNote.hidden = !forgotNote.hidden;
  });

  form.addEventListener('submit', async function (e) {
    e.preventDefault();
    errorBox.hidden = true;
    submitBtn.disabled = true;
    submitBtn.textContent = 'Signing in…';
    try {
      await window.Auth.login(
        document.getElementById('email').value,
        document.getElementById('password').value,
        document.getElementById('remember').checked
      );
      window.location.href = 'dashboard.html';
    } catch (err) {
      errorBox.textContent = err.message || 'Invalid email or password.';
      errorBox.hidden = false;
      submitBtn.disabled = false;
      submitBtn.textContent = 'Log In';
    }
  });
})();
