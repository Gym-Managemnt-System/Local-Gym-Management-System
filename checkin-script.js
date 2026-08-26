document.getElementById('checkinForm').addEventListener('submit', function(e){
  e.preventDefault();
  const member = document.getElementById('searchMember').value.trim();
  const time = document.getElementById('checkinTime').value;
  const note = document.getElementById('note').value.trim();
  const err = document.getElementById('errorMsg');

  if(!member || !time){
    err.classList.add('show');
    err.style.display = 'block';
    return;
  }
  err.classList.remove('show');
  err.style.display = 'none';

  // TODO: replace with a real API call to your backend
  alert('Check-in recorded (wire this up to your backend).\nMember: ' + member + '\nTime: ' + time + (note ? '\nNote: ' + note : ''));
});