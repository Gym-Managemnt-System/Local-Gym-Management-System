// Switch active report card on click
document.querySelectorAll('.report-card').forEach(card => {
  card.addEventListener('click', function(){
    document.querySelectorAll('.report-card').forEach(c => c.classList.remove('active'));
    this.classList.add('active');
    console.log('Selected report:', this.dataset.report);
    // Hook: load the corresponding report data/chart here
  });
});

// Animate revenue bars on load
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

// Export PDF button
document.getElementById('exportPdf').addEventListener('click', function(e){
  e.preventDefault();
  console.log('Export revenue chart as PDF');
  // Hook: trigger real PDF export/download here
  alert('Exporting revenue report as PDF...');
});

// Export CSV button
document.getElementById('exportCsv').addEventListener('click', function(e){
  e.preventDefault();

  const rows = [['Plan', 'Members', 'Monthly Revenue', 'Share']];
  document.querySelectorAll('.revenue-table tbody tr').forEach(tr => {
    const cells = Array.from(tr.querySelectorAll('td')).map(td => td.textContent.trim());
    rows.push(cells);
  });

  const csvContent = rows.map(r => r.join(',')).join('\n');
  const blob = new Blob([csvContent], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'revenue_report.csv';
  a.click();
  URL.revokeObjectURL(url);
});

// Sidebar nav active state
document.querySelectorAll('.nav-item').forEach(item => {
  item.addEventListener('click', function(e){
    e.preventDefault();
    document.querySelectorAll('.nav-item').forEach(i => i.classList.remove('active'));
    this.classList.add('active');
  });
});
