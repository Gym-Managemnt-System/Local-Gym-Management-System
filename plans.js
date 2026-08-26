// Edit button — placeholder hook for opening an edit form/modal
document.querySelectorAll('.btn-edit').forEach(btn => {
  btn.addEventListener('click', function(){
    const plan = this.dataset.plan;
    console.log('Edit plan:', plan);
    alert('Open edit form for the ' + plan + ' plan.');
    // Hook: open a real edit modal or navigate to an edit page here
  });
});

// Archive button — confirm before archiving
document.querySelectorAll('.btn-archive').forEach(btn => {
  btn.addEventListener('click', function(){
    const plan = this.dataset.plan;
    const card = this.closest('.plan-card');
    const confirmed = confirm('Archive the ' + plan + ' plan? Members already on it will be unaffected.');
    if(confirmed){
      console.log('Archived plan:', plan);
      card.style.transition = 'opacity .3s ease, transform .3s ease';
      card.style.opacity = '0.4';
      card.style.transform = 'scale(0.98)';
      // Hook: send archive request to backend here
    }
  });
});

// Sidebar nav active state
document.querySelectorAll('.nav-item').forEach(item => {
  item.addEventListener('click', function(e){
    e.preventDefault();
    document.querySelectorAll('.nav-item').forEach(i => i.classList.remove('active'));
    this.classList.add('active');
  });
});
