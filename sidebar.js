fetch('sidebar.html')
  .then(res => res.text())
  .then(html => {
    document.getElementById('sidebar-placeholder').innerHTML = html;
    const current = document.body.dataset.page;
    document.querySelectorAll('.nav-item').forEach(link => {
      if (link.dataset.page === current) {
        link.classList.add('active');
      }
    });
  });