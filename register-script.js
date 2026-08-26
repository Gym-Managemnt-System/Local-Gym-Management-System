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

// FORM SUBMISSION
document.getElementById('registerForm').addEventListener('submit', function(e){
  e.preventDefault();
  const fullname = document.getElementById('fullname').value.trim();
  const email = document.getElementById('email').value.trim();
  const phone = document.getElementById('phone').value.trim();
  const dob = document.getElementById('dob').value;
  const gender = document.getElementById('gender').value;
  const username = document.getElementById('username').value.trim();
  const password = document.getElementById('password').value;
  const plan = document.getElementById('selectedPlan').value;
  const err = document.getElementById('errorMsg');

  const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  if(!fullname || !emailOk || !phone || !dob || !gender || !username || !password){
    err.classList.add('show');
    err.style.display = 'block';
    return;
  }
  err.classList.remove('show');
  err.style.display = 'none';

  // TODO: replace with a real API call to your backend
  alert('Member account created (wire this up to your backend).\nName: ' + fullname + '\nPlan: ' + plan);
});