const attendanceBody = document.getElementById('attendanceBody');
const rows = attendanceBody.querySelectorAll('tr');

// Select all checkbox
const selectAll = document.getElementById('selectAll');
const rowChecks = attendanceBody.querySelectorAll('.row-check');

selectAll.addEventListener('change', function(){
  rowChecks.forEach(cb => cb.checked = this.checked);
});

rowChecks.forEach(cb => {
  cb.addEventListener('change', () => {
    selectAll.checked = Array.from(rowChecks).every(c => c.checked);
  });
});

// Search filter
const searchInput = document.getElementById('searchInput');
searchInput.addEventListener('input', function(){
  const query = this.value.toLowerCase();
  rows.forEach(row => {
    const matches = row.dataset.name.includes(query);
    row.style.display = matches ? '' : 'none';
  });
});

// Status filter
const statusFilter = document.getElementById('statusFilter');
statusFilter.addEventListener('change', function(){
  const value = this.value;
  rows.forEach(row => {
    const matches = value === 'all' || row.dataset.status === value;
    row.style.display = matches ? '' : 'none';
  });
});

// Date filter (placeholder — hook up real date-range data fetching)
const dateFilter = document.getElementById('dateFilter');
dateFilter.addEventListener('change', function(){
  console.log('Load attendance for:', this.value);
  // Hook: fetch attendance data for the selected date range here
});

// Row menu button
attendanceBody.querySelectorAll('.menu-btn').forEach(btn => {
  btn.addEventListener('click', function(e){
    e.stopPropagation();
    const row = this.closest('tr');
    const name = row.querySelector('.member-cell').textContent.trim();
    console.log('Open menu for:', name);
    alert('Options for "' + name + '": Check in now / Edit time / View history');
    // Hook: replace with a real dropdown menu
  });
});

// Manual check-in button
document.getElementById('checkinBtn').addEventListener('click', function(){
  window.location.href = 'checkin.html';
});

// Export CSV
document.getElementById('exportBtn').addEventListener('click', function(){
  const csvRows = [['Member', 'Plan', 'Check-in time', 'Status']];
  rows.forEach(row => {
    if(row.style.display === 'none') return;
    const member = row.querySelector('.member-cell').textContent.trim();
    const plan = row.children[2].textContent.trim();
    const time = row.children[3].textContent.trim();
    const status = row.querySelector('.status').textContent.trim();
    csvRows.push([member, plan, time, status]);
  });

  const csvContent = csvRows.map(r => r.join(',')).join('\n');
  const blob = new Blob([csvContent], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'attendance.csv';
  a.click();
  URL.revokeObjectURL(url);
});

// Pagination (placeholder)
document.querySelectorAll('.page-num').forEach(btn => {
  btn.addEventListener('click', function(){
    document.querySelectorAll('.page-num').forEach(b => b.classList.remove('active'));
    this.classList.add('active');
    console.log('Go to page', this.textContent.trim());
    // Hook: fetch and render the corresponding page of attendance records here
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
