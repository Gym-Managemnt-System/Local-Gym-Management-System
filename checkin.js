const form = document.getElementById('checkinForm');
const errorMsg = document.getElementById('errorMsg');
const memberInput = document.getElementById('member');
const suggestionsBox = document.getElementById('suggestions');
const cancelBtn = document.getElementById('cancelBtn');

// Sample member list — replace with a real API lookup
const members = [
  'Nadeesha Silva',
  'Kasun Perera',
  'Tharindu Wijayarathna',
  'Jayakodi Mohan',
  'Ishara Fernando',
  'Chamara De Silva',
  'Umesha Senanayake',
  'Ashan Kumara'
];

// Auto-fill current time on load
window.addEventListener('DOMContentLoaded', () => {
  const now = new Date();
  const hh = String(now.getHours()).padStart(2, '0');
  const mm = String(now.getMinutes()).padStart(2, '0');
  document.getElementById('checkinTime').value = `${hh}:${mm}`;
});

// Member search suggestions
memberInput.addEventListener('input', function(){
  const query = this.value.trim().toLowerCase();
  suggestionsBox.innerHTML = '';

  if(!query){
    suggestionsBox.classList.remove('open');
    return;
  }

  const matches = members.filter(m => m.toLowerCase().includes(query));

  if(matches.length === 0){
    suggestionsBox.classList.remove('open');
    return;
  }

  matches.forEach(name => {
    const item = document.createElement('div');
    item.className = 'suggestion-item';
    item.textContent = name;
    item.addEventListener('click', () => {
      memberInput.value = name;
      suggestionsBox.classList.remove('open');
    });
    suggestionsBox.appendChild(item);
  });

  suggestionsBox.classList.add('open');
});

// Close suggestions when clicking outside
document.addEventListener('click', function(e){
  if(!memberInput.contains(e.target) && !suggestionsBox.contains(e.target)){
    suggestionsBox.classList.remove('open');
  }
});

// Form submit
form.addEventListener('submit', function(e){
  e.preventDefault();

  const member = memberInput.value.trim();
  const checkinTime = document.getElementById('checkinTime').value;
  const note = document.getElementById('note').value.trim();

  if(!member || !checkinTime){
    errorMsg.style.display = 'block';
    return;
  }
  errorMsg.style.display = 'none';

  const checkin = { member, checkinTime, note };

  // Replace this with a real API call, e.g. fetch('/api/checkins', { method: 'POST', body: JSON.stringify(checkin) })
  console.log('Recording check-in:', checkin);
  alert('Checked in: ' + member + ' at ' + checkinTime);

  form.reset();
});

// Cancel button
cancelBtn.addEventListener('click', function(){
  const confirmed = confirm('Discard this check-in?');
  if(confirmed){
    form.reset();
    errorMsg.style.display = 'none';
    suggestionsBox.classList.remove('open');
    // Hook: navigate back to attendance list here
  }
});
