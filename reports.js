document.querySelectorAll('.report-type-pill').forEach(function(pill){
  pill.addEventListener('click', function(){
    document.querySelectorAll('.report-type-pill').forEach(function(p){
      p.classList.remove('active');
    });
    pill.classList.add('active');
    // TODO: swap chart/table data based on pill.dataset.report
  });
});

document.getElementById('exportPdf').addEventListener('click', function(e){
  e.preventDefault();
  alert('Export PDF triggered (hook up to your backend/report generator).');
});

document.getElementById('exportCsv').addEventListener('click', function(e){
  e.preventDefault();
  alert('Export CSV triggered (hook up to your backend/report generator).');
});