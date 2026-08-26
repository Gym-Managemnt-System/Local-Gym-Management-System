document.querySelectorAll('.custom-dropdown').forEach(function(dropdown){
  const trigger = dropdown.querySelector('.custom-dropdown-trigger');
  const label = dropdown.querySelector('.custom-dropdown-label');
  const options = dropdown.querySelector('.custom-dropdown-options');

  trigger.addEventListener('click', function(e){
    e.stopPropagation();
    document.querySelectorAll('.custom-dropdown').forEach(function(other){
      if(other !== dropdown) other.classList.remove('open');
    });
    dropdown.classList.toggle('open');
  });

  options.addEventListener('click', function(e){
    const li = e.target.closest('li');
    if(!li) return;

    options.querySelectorAll('li').forEach(item => item.classList.remove('selected'));
    li.classList.add('selected');
    label.textContent = li.textContent;
    dropdown.dataset.value = li.dataset.value;

    dropdown.classList.remove('open');
  });
});

document.addEventListener('click', function(){
  document.querySelectorAll('.custom-dropdown').forEach(function(dropdown){
    dropdown.classList.remove('open');
  });
});