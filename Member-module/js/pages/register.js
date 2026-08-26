(function () {
  var form = document.getElementById('register-form');
  var errorBox = document.getElementById('error');
  var submitBtn = document.getElementById('submit-btn');

  form.addEventListener('submit', async function (e) {
    e.preventDefault();
    errorBox.hidden = true;
    submitBtn.disabled = true;
    submitBtn.textContent = 'Creating account…';
    try {
      await window.Auth.register({
        full_name: document.getElementById('full_name').value,
        email: document.getElementById('reg-email').value,
        password: document.getElementById('reg-password').value
      });
      window.location.href = 'dashboard.html';
    } catch (err) {
      errorBox.textContent = err.message || 'Registration failed.';
      errorBox.hidden = false;
      submitBtn.disabled = false;
      submitBtn.textContent = 'Sign Up';
    }
  });
})();
