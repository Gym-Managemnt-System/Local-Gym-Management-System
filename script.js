const loginView = document.getElementById('login-view');
const signupView = document.getElementById('signup-view');

function showView(view){
  [loginView, signupView].forEach(v => v.classList.remove('active'));
  view.classList.add('active');
}

// If arriving via login.html#signup, open the signup view; otherwise default to login
if(window.location.hash === '#signup'){
  showView(signupView);
} else {
  showView(loginView);
}

document.getElementById('switch-to-signup').addEventListener('click', () => showView(signupView));
document.getElementById('switch-to-login').addEventListener('click', () => showView(loginView));

document.getElementById('login-form').addEventListener('submit', function(e){
  e.preventDefault();
  const email = document.getElementById('login-email').value.trim();
  const pw = document.getElementById('login-password').value;
  const err = document.getElementById('login-error');
  const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  if(!emailOk || pw.length < 6){
    err.classList.add('show');
    return;
  }
  err.classList.remove('show');
  // TODO: replace with a real API call to your auth endpoint
  alert('Login submitted (wire this up to your backend).\nEmail: ' + email);
});

document.getElementById('signup-form').addEventListener('submit', function(e){
  e.preventDefault();
  const name = document.getElementById('signup-name').value.trim();
  const email = document.getElementById('signup-email').value.trim();
  const pw = document.getElementById('signup-password').value;
  const err = document.getElementById('signup-error');
  const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  if(!name || !emailOk || pw.length < 6){
    err.classList.add('show');
    return;
  }
  err.classList.remove('show');
  // TODO: replace with a real API call to your auth endpoint
  alert('Account created (wire this up to your backend).\nName: ' + name + '\nEmail: ' + email);
});

document.getElementById('forgotLink').addEventListener('click', function(e){
  e.preventDefault();
  alert('Wire this up to a password-reset flow.');
});