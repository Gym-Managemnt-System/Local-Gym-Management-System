// MEMBERSHIP PLAN SELECTION
const planRow = document.getElementById('planRow');
const selectedPlanInput = document.getElementById('selectedPlan');

planRow.addEventListener('click', function(e){
  const btn = e.target.closest('.plan-card');
  if(!btn) return;
  document.querySelectorAll('.plan-card').forEach(c => c.classList.remove('selected'));
  btn.classList.add('selected');
  selectedPlanInput.value = btn.dataset.plan;
});

// GENERATE USERNAME / PASSWORD
function randomUsername(){
  const adjectives = ['Iron', 'Steel', 'Rapid', 'Prime', 'Active', 'Bold'];
  const nouns = ['Lifter', 'Runner', 'Athlete', 'Warrior', 'Trainer', 'Flex'];
  const num = Math.floor(100 + Math.random() * 900);
  const a = adjectives[Math.floor(Math.random() * adjectives.length)];
  const n = nouns[Math.floor(Math.random() * nouns.length)];
  return a + n + num;
}

function randomPassword(){
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789!@#$%';
  let pw = '';
  for(let i = 0; i < 12; i++){
    pw += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return pw;
}

document.getElementById('genUsername').addEventListener('click', function(){
  document.getElementById('username').value = randomUsername();
});

document.getElementById('genPassword').addEventListener('click', function(){
  document.getElementById('password').value = randomPassword();
});

// CUSTOM GENDER DROPDOWN
const genderSelect = document.getElementById('genderSelect');
const genderTrigger = document.getElementById('genderTrigger');
const genderValue = document.getElementById('genderValue');
const genderOptions = document.getElementById('genderOptions');
const genderInput = document.getElementById('gender');

genderTrigger.addEventListener('click', function(e){
  e.stopPropagation();
  genderSelect.classList.toggle('open');
});

genderOptions.addEventListener('click', function(e){
  const li = e.target.closest('li');
  if(!li) return;

  genderOptions.querySelectorAll('li').forEach(item => item.classList.remove('selected'));
  li.classList.add('selected');

  genderValue.textContent = li.textContent;
  genderInput.value = li.dataset.value;
  genderTrigger.classList.toggle('filled', li.dataset.value !== '');

  genderSelect.classList.remove('open');
});

document.addEventListener('click', function(){
  genderSelect.classList.remove('open');
});

// PREVENT ACCIDENTAL ENTER-KEY SUBMISSION
document.getElementById('registerForm').addEventListener('keydown', function(e){
  if(e.key === 'Enter' && e.target.tagName !== 'TEXTAREA'){
    if(e.target.type !== 'submit'){
      e.preventDefault();
    }
  }
});

// FORM SUBMISSION
document.getElementById('registerForm').addEventListener('submit', async function(e){
  e.preventDefault();

  const fullname = document.getElementById('fullname').value.trim();
  const email = document.getElementById('email').value.trim();
  const phone = document.getElementById('phone').value.trim();
  const dob = document.getElementById('dob').value;
  const gender = document.getElementById('gender').value;
  const address = document.getElementById('address').value.trim();
  const username = document.getElementById('username').value.trim();
  const password = document.getElementById('password').value;
  const plan = document.getElementById('selectedPlan').value;
  const err = document.getElementById('errorMsg');

  const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  if(!fullname || !emailOk || !password){
    err.textContent = 'Please fill in all required fields.';
    err.classList.add('show');
    err.style.display = 'block';
    return;
  }

  err.classList.remove('show');
  err.style.display = 'none';

  const token = localStorage.getItem('token') || sessionStorage.getItem('token');

  if(!token){
    err.textContent = 'You must be logged in as an admin to register members.';
    err.classList.add('show');
    err.style.display = 'block';
    return;
  }

  try{
    const response = await fetch('http://localhost:5000/api/members/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + token
      },
      body: JSON.stringify({
        full_name: fullname,
        email: email,
        phone: phone,
        dob: dob,
        gender: gender,
        address: address,
        username: username,
        password: password,
        plan_name: plan
      })
    });

    const data = await response.json();

    if(!response.ok){
      err.textContent = data.message || 'Failed to register member.';
      err.classList.add('show');
      err.style.display = 'block';
      return;
    }

    alert('Member registered successfully.');
    window.location.href = 'members.html';

  } catch(networkErr){
    err.textContent = 'Could not reach the server. Is the backend running?';
    err.classList.add('show');
    err.style.display = 'block';
  }
});