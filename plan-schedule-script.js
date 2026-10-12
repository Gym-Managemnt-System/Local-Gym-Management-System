function getToken() {
  return localStorage.getItem('token') || sessionStorage.getItem('token');
}

const token = getToken();
if (!token) {
  window.location.href = 'login.html';
}

// ---- Generic custom-select wiring (Class Type + Trainer) ----
function wireCustomSelect(selectId, triggerId, valueId, optionsId, hiddenInputId) {
  const select = document.getElementById(selectId);
  const trigger = document.getElementById(triggerId);
  const valueEl = document.getElementById(valueId);
  const options = document.getElementById(optionsId);
  const hiddenInput = document.getElementById(hiddenInputId);

  trigger.addEventListener('click', function(e){
    e.stopPropagation();
    document.querySelectorAll('.custom-select').forEach(function(other){
      if (other !== select) other.classList.remove('open');
    });
    select.classList.toggle('open');
  });

  options.addEventListener('click', function(e){
    const li = e.target.closest('li');
    if (!li || !li.dataset.value) return;

    options.querySelectorAll('li').forEach(item => item.classList.remove('selected'));
    li.classList.add('selected');

    valueEl.textContent = li.textContent;
    hiddenInput.value = li.dataset.value;
    trigger.classList.add('filled');

    select.classList.remove('open');
  });
}

wireCustomSelect('classTypeSelect', 'classTypeTrigger', 'classTypeValue', 'classTypeOptions', 'classTypeInput');
wireCustomSelect('trainerSelect', 'trainerTrigger', 'trainerValue', 'trainerOptions', 'trainerInput');

document.addEventListener('click', function(){
  document.querySelectorAll('.custom-select').forEach(function(select){
    select.classList.remove('open');
  });
});

// ---- Load trainers into the Trainer dropdown ----
async function loadTrainers() {
  const trainerOptions = document.getElementById('trainerOptions');
  try {
    const response = await fetch('http://localhost:5000/api/trainers', {
      headers: { 'Authorization': 'Bearer ' + token }
    });

    if (response.status === 401 || response.status === 403) {
      window.location.href = 'login.html';
      return;
    }

    const trainers = await response.json();

    trainerOptions.innerHTML = '';
    if (trainers.length === 0) {
      trainerOptions.innerHTML = '<li data-value="">No trainers available</li>';
      return;
    }

    trainers.forEach(function(t) {
      const li = document.createElement('li');
      li.dataset.value = t.id;
      li.textContent = t.full_name;
      trainerOptions.appendChild(li);
    });
  } catch (err) {
    trainerOptions.innerHTML = '<li data-value="">Could not load trainers</li>';
  }
}

loadTrainers();

// ---- Convert 24h "HH:MM" time input into "H:MM AM/PM" for storage ----
function formatTime12hr(value) {
  const [hourStr, minute] = value.split(':');
  let hour = parseInt(hourStr, 10);
  const period = hour >= 12 ? 'PM' : 'AM';
  hour = hour % 12;
  if (hour === 0) hour = 12;
  return `${hour}:${minute} ${period}`;
}

// ---- Form submission ----
document.getElementById('scheduleForm').addEventListener('submit', async function(e){
  e.preventDefault();

  const className = document.getElementById('className').value.trim();
  const timeValue = document.getElementById('classTime').value;
  const category = document.getElementById('classTypeInput').value;
  const trainerId = document.getElementById('trainerInput').value;
  const duration = document.getElementById('duration').value;
  const capacity = document.getElementById('capacity').value;
  const err = document.getElementById('errorMsg');

  if (!className || !timeValue || !category || !trainerId) {
    err.textContent = 'Please fill in all required fields.';
    err.classList.add('show');
    return;
  }

  err.classList.remove('show');

  try {
    const response = await fetch('http://localhost:5000/api/classes', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + token
      },
      body: JSON.stringify({
        class_name: className,
        category: category,
        trainer_id: parseInt(trainerId, 10),
        start_time: formatTime12hr(timeValue),
        duration_minutes: duration ? parseInt(duration, 10) : undefined,
        max_capacity: capacity ? parseInt(capacity, 10) : undefined
      })
    });

    const data = await response.json();

    if (!response.ok) {
      err.textContent = data.message || 'Failed to create class.';
      err.classList.add('show');
      return;
    }

    alert('Class created successfully.');
    window.location.href = 'classes.html';

  } catch (networkErr) {
    err.textContent = 'Could not reach the server. Is the backend running?';
    err.classList.add('show');
  }
});