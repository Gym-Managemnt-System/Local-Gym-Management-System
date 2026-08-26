const trainerList = document.getElementById('trainerList');
const trainerCards = trainerList.querySelectorAll('.trainer-card');

// Search filter
const searchInput = document.getElementById('searchInput');
searchInput.addEventListener('input', function(){
  const query = this.value.toLowerCase();
  trainerCards.forEach(card => {
    const matches = card.dataset.name.includes(query);
    card.style.display = matches ? '' : 'none';
  });
});

// Specialty filter
const specialtyFilter = document.getElementById('specialtyFilter');
specialtyFilter.addEventListener('change', function(){
  const value = this.value;
  trainerCards.forEach(card => {
    const matches = value === 'all' || card.dataset.specialty === value;
    card.style.display = matches ? '' : 'none';
  });
});

// Menu button — placeholder actions
trainerList.querySelectorAll('.menu-btn').forEach(btn => {
  btn.addEventListener('click', function(e){
    e.stopPropagation();
    const card = this.closest('.trainer-card');
    const name = card.querySelector('.trainer-name').textContent;
    console.log('Open menu for:', name);
    alert('Options for "' + name + '": Edit profile / View schedule / Deactivate');
    // Hook: replace with a real dropdown menu (Edit, View schedule, Deactivate, etc.)
  });
});

// Add trainer button
document.getElementById('addBtn').addEventListener('click', function(){
  window.location.href = 'trainer-signup.html';
});

// Pagination (placeholder)
document.querySelectorAll('.page-num').forEach(btn => {
  btn.addEventListener('click', function(){
    document.querySelectorAll('.page-num').forEach(b => b.classList.remove('active'));
    this.classList.add('active');
    console.log('Go to page', this.textContent.trim());
    // Hook: fetch and render the corresponding page of trainers here
  });
});

document.getElementById('prevPage').addEventListener('click', () => console.log('Previous page'));
document.getElementById('nextPage').addEventListener('click', () => console.log('Next page'));

// Sidebar nav active state
document.querySelectorAll('.nav-item').forEach(item => {
  item.addEventListener('click', function(e){
    e.preventDefault();
    document.querySelectorAll('.nav-item').forEach(i => i.classList.remove('active'));
    this.classList.add('active');
  });
});
