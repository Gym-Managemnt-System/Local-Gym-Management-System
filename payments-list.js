// Select all checkbox
const selectAll = document.getElementById('selectAll');
const rowChecks = document.querySelectorAll('.row-check');

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
const paymentsBody = document.getElementById('paymentsBody');

searchInput.addEventListener('input', function(){
  const query = this.value.toLowerCase();
  Array.from(paymentsBody.querySelectorAll('tr')).forEach(row => {
    const memberName = row.querySelector('.member-cell').textContent.toLowerCase();
    row.style.display = memberName.includes(query) ? '' : 'none';
  });
});

// Status filter
const statusFilter = document.getElementById('statusFilter');
statusFilter.addEventListener('change', function(){
  const value = this.value;
  Array.from(paymentsBody.querySelectorAll('tr')).forEach(row => {
    if(value === 'all'){ row.style.display = ''; return; }
    const statusEl = row.querySelector('.status');
    const matches = statusEl.className.includes('status-' + value);
    row.style.display = matches ? '' : 'none';
  });
});

// Method filter
const methodFilter = document.getElementById('methodFilter');
methodFilter.addEventListener('change', function(){
  const value = this.value;
  const labelMap = { card: 'card', bank: 'bank transfer', cash: 'cash' };
  Array.from(paymentsBody.querySelectorAll('tr')).forEach(row => {
    if(value === 'all'){ row.style.display = ''; return; }
    const methodCell = row.children[5].textContent.toLowerCase();
    row.style.display = methodCell.includes(labelMap[value]) ? '' : 'none';
  });
});

// Record Payment button
document.getElementById('recordBtn').addEventListener('click', function(){
  window.location.href = 'payment.html';
});

// Export CSV
document.getElementById('exportBtn').addEventListener('click', function(){
  const rows = [['Member', 'Plan', 'Amount', 'Date', 'Method', 'Status']];
  paymentsBody.querySelectorAll('tr').forEach(row => {
    if(row.style.display === 'none') return;
    const member = row.querySelector('.member-cell').textContent.trim();
    const cells = Array.from(row.querySelectorAll('td')).slice(2, 6).map(td => td.textContent.trim());
    rows.push([member, ...cells]);
  });

  const csvContent = rows.map(r => r.join(',')).join('\n');
  const blob = new Blob([csvContent], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'payments.csv';
  a.click();
  URL.revokeObjectURL(url);
});

// Pagination (placeholder)
document.querySelectorAll('.page-num').forEach(btn => {
  btn.addEventListener('click', function(){
    document.querySelectorAll('.page-num').forEach(b => b.classList.remove('active'));
    this.classList.add('active');
    console.log('Go to page', this.textContent.trim());
    // Hook: fetch and render the corresponding page of results here
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
