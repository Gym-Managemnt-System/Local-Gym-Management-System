const form = document.getElementById('trainerForm');
const errorMsg = document.getElementById('errorMsg');

// Specialty chip toggle (multi-select)
const chips = document.querySelectorAll('.chip');
chips.forEach(chip => {
  chip.addEventListener('click', function(){
    this.classList.toggle('selected');
  });
});

function getSelectedSpecialties(){
  return Array.from(chips).filter(c => c.classList.contains('selected')).map(c => c.dataset.value);
}

// Generate username from full name
const genUsernameBtn = document.getElementById('genUsername');
const genPasswordBtn = document.getElementById('genPassword');
const generatedBox = document.getElementById('generatedBox');
const genUsernameValue = document.getElementById('genUsernameValue');
const genPasswordValue = document.getElementById('genPasswordValue');

genUsernameBtn.addEventListener('click', function(){
  const fullName = document.getElementById('fullName').value.trim();
  if(!fullName){
    alert('Enter a full name first.');
    return;
  }
  const parts = fullName.toLowerCase().split(/\s+/);
  const randomNum = Math.floor(Math.random() * 900 + 100);
  const username = parts.join('.') + randomNum;
  genUsernameValue.textContent = username;
  generatedBox.style.display = 'block';
});

// Generate a random secure password
genPasswordBtn.addEventListener('click', function(){
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789!@#$%';
  let password = '';
  for(let i = 0; i < 12; i++){
    password += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  genPasswordValue.textContent = password;
  generatedBox.style.display = 'block';
});

// Form submit
form.addEventListener('submit', function(e){
  e.preventDefault();

  const fullName = document.getElementById('fullName').value.trim();
  const email = document.getElementById('email').value.trim();
  const phone = document.getElementById('phone').value.trim();

  if(!fullName || !email || !phone){
    errorMsg.style.display = 'block';
    return;
  }
  errorMsg.style.display = 'none';

  const trainer = {
    fullName,
    email,
    phone,
    dob: document.getElementById('dob').value,
    gender: document.getElementById('gender').value,
    address: document.getElementById('address').value.trim(),
    specialties: getSelectedSpecialties(),
    username: genUsernameValue.textContent || null,
    password: genPasswordValue.textContent || null
  };

  // Replace this with a real API call, e.g. fetch('/api/trainers', { method: 'POST', body: JSON.stringify(trainer) })
  console.log('Creating trainer account:', trainer);
  alert('Trainer account created for ' + fullName);
});
