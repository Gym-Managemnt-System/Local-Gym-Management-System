document.querySelectorAll('.btn-edit').forEach(function(btn){
  btn.addEventListener('click', function(){
    const card = btn.closest('.plan-card');
    const tier = card.querySelector('.plan-tier').textContent;
    alert('Edit plan: ' + tier);
  });
});

document.querySelectorAll('.btn-archive').forEach(function(btn){
  btn.addEventListener('click', function(){
    const card = btn.closest('.plan-card');
    const tier = card.querySelector('.plan-tier').textContent;
    if(confirm('Archive the "' + tier + '" plan? This will hide it from new signups.')){
      card.style.opacity = '0.4';
      card.style.pointerEvents = 'none';
    }
  });
});