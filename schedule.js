const form = document.getElementById('scheduleForm');
const errorMsg = document.getElementById('errorMsg');

// Custom "Add members" dropdown
const memberToggle = document.getElementById('memberToggle');
const memberToggleLabel = document.getElementById('memberToggleLabel');
const memberDropdown = document.getElementById('memberDropdown');
const memberCheckboxes = memberDropdown.querySelectorAll('input[type="checkbox"]');

memberToggle.addEventListener('click', function(){
  memberDropdown.classList.toggle('open');
  memberToggle.classList.toggle('open');
});

// Close dropdown when clicking outside
document.addEventListener('click', function(e){
  if(!document.getElementById('memberSelect').contains(e.target)){
    memberDropdown.classList.remove('open');
    memberToggle.classList.remove('open');
  }
});

function updateMemberLabel(){
  const selected = Array.from(memberCheckboxes).filter(cb => cb.checked).map(cb => cb.value);
  if(selected.length === 0){
    memberToggleLabel.textContent = 'Select members';
    memberToggle.classList.remove('has-selection');
  } else if(selected.length <= 2){
    memberToggleLabel.textContent = selected.join(', ');
    memberToggle.classList.add('has-selection');
  } else {
    memberToggleLabel.textContent = selected.length + ' members selected';
    memberToggle.classList.add('has-selection');
  }
  return selected;
}

memberCheckboxes.forEach(cb => {
  cb.addEventListener('change', updateMemberLabel);
});

// Form submit
form.addEventListener('submit', function(e){
  e.preventDefault();

  const time = document.getElementById('time').value;
  const classType = document.getElementById('classType').value;
  const trainer = document.getElementById('trainer').value;
  const members = Array.from(memberCheckboxes).filter(cb => cb.checked).map(cb => cb.value);

  if(!time || !classType || !trainer){
    errorMsg.style.display = 'block';
    return;
  }
  errorMsg.style.display = 'none';

  const newClass = { time, classType, trainer, members };

  // Replace this with a real API call, e.g. fetch('/api/classes', { method: 'POST', body: JSON.stringify(newClass) })
  console.log('Creating class:', newClass);
  alert('Class scheduled: ' + classType + ' with ' + trainer);

  form.reset();
  memberCheckboxes.forEach(cb => cb.checked = false);
  updateMemberLabel();
});
