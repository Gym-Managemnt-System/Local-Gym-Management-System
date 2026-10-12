// Highlight active nav item on click
document.querySelectorAll('.nav-item').forEach(item => {
  item.addEventListener('click', function(e){
    e.preventDefault();
    document.querySelectorAll('.nav-item').forEach(i => i.classList.remove('active'));
    this.classList.add('active');
  });
});

// Animate attendance bars on load
window.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('.bar').forEach(bar => {
    const target = bar.style.height;
    bar.style.height = '0%';
    requestAnimationFrame(() => {
      bar.style.transition = 'height .6s ease';
      setTimeout(() => { bar.style.height = target; }, 50);
    });
  });
});

// Placeholder handlers for "View all" / "Schedule" links
document.querySelectorAll('.link').forEach(link => {
  link.addEventListener('click', function(e){
    e.preventDefault();
    console.log('Navigate to:', this.textContent.trim());
  });
});
