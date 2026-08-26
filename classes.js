const classGrid = document.getElementById('classGrid');
const classCards = classGrid.querySelectorAll('.class-card');

// Search filter
const searchInput = document.getElementById('searchInput');
searchInput.addEventListener('input', function(){
  const query = this.value.toLowerCase();
  classCards.forEach(card => {
    const matches = card.dataset.name.includes(query);
    card.style.display = matches ? '' : 'none';
  });
});

// Status filter (based on booking fill %)
const statusFilter = document.getElementById('statusFilter');
statusFilter.addEventListener('change', function(){
  const value = this.value;
  classCards.forEach(card => {
    const fill = parseFloat(card.querySelector('.progress-fill').style.width);
    let show = true;
    if(value === 'full') show = fill >= 90;
    else if(value === 'low') show = fill < 50;
    else if(value === 'upcoming') show = true; // placeholder: all count as upcoming for now
    card.style.display = show ? '' : 'none';
  });
});

// Card menu (⋮) button — placeholder actions
classGrid.querySelectorAll('.menu-btn').forEach(btn => {
  btn.addEventListener('click', function(e){
    e.stopPropagation();
    const card = this.closest('.class-card');
    const name = card.querySelector('.class-name').textContent;
    console.log('Open menu for:', name);
    alert('Options for "' + name + '": Edit / Cancel / View roster');
    // Hook: replace with a real dropdown menu (Edit, Cancel, View roster, etc.)
  });
});

// Plan Schedule button
document.getElementById('planBtn').addEventListener('click', function(){
  window.location.href = 'schedule.html';
});

// Pagination (placeholder)
document.querySelectorAll('.page-num').forEach(btn => {
  btn.addEventListener('click', function(){
    document.querySelectorAll('.page-num').forEach(b => b.classList.remove('active'));
    this.classList.add('active');
    console.log('Go to page', this.textContent.trim());
    // Hook: fetch and render the corresponding page of classes here
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
