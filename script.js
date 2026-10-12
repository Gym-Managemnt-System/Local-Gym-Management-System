const togglePassword = document.getElementById('togglePassword');
const loginPasswordInput = document.getElementById('login-password');

togglePassword.addEventListener('click', function(){
  const isPassword = loginPasswordInput.type === 'password';
  loginPasswordInput.type = isPassword ? 'text' : 'password';
  togglePassword.classList.toggle('showing', isPassword);
});

loginPasswordInput.addEventListener('input', function(){
  if(loginPasswordInput.value.length > 0){
    togglePassword.classList.add('visible');
  } else {
    togglePassword.classList.remove('visible');
  }
});

const loginEmailInput = document.getElementById('login-email');
const loginEmailError = document.getElementById('login-email-error');
const loginPasswordError = document.getElementById('login-password-error');

function clearFieldErrors(){
  loginEmailInput.classList.remove('invalid');
  loginPasswordInput.classList.remove('invalid');
  loginEmailError.textContent = '';
  loginPasswordError.textContent = '';
}

document.getElementById('login-form').addEventListener('submit', async function(e){
  e.preventDefault();
  const email = loginEmailInput.value.trim();
  const pw = loginPasswordInput.value;
  const err = document.getElementById('login-error');
  const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  clearFieldErrors();
  err.classList.remove('show');

  let hasError = false;

  if(!email){
    loginEmailInput.classList.add('invalid');
    loginEmailError.textContent = 'Email is required.';
    hasError = true;
  } else if(!emailOk){
    loginEmailInput.classList.add('invalid');
    loginEmailError.textContent = 'Enter a valid email address.';
    hasError = true;
  }

  if(!pw){
    loginPasswordInput.classList.add('invalid');
    loginPasswordError.textContent = 'Password is required.';
    hasError = true;
  } else if(pw.length < 6){
    loginPasswordInput.classList.add('invalid');
    loginPasswordError.textContent = 'Password must be at least 6 characters.';
    hasError = true;
  }

  if(hasError) return;

  try{
    const response = await fetch('http://localhost:5000/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: email, password: pw })
    });

    const data = await response.json();

    if(!response.ok){
      err.textContent = data.message || 'Login failed. Please try again.';
      err.classList.add('show');
      return;
    }

    err.classList.remove('show');

    const remember = document.getElementById('login-remember').checked;
    const storage = remember ? localStorage : sessionStorage;

    storage.setItem('token', data.token);
    storage.setItem('user', JSON.stringify(data.user));

        if(data.user.role === 'admin'){
      window.location.href = 'dashboard.html';
    } else if(data.user.role === 'trainer'){
      window.location.href = 'trainer-dashboard.html';
    } else {
      window.location.href = 'member-dashboard.html';
    }

  } catch(networkErr){
    err.textContent = 'Could not reach the server. Is the backend running?';
    err.classList.add('show');
  }
});

document.getElementById('forgotLink').addEventListener('click', function(e){
  e.preventDefault();
  alert('Wire this up to a password-reset flow.');
});