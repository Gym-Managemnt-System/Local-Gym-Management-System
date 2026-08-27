// Get logged-in user from storage (set during login)
const storedUser = localStorage.getItem('user') || sessionStorage.getItem('user');

if(!storedUser){
  window.location.href = 'login.html';
} else {
  const user = JSON.parse(storedUser);
  const firstName = user.full_name.split(' ')[0];

  document.getElementById('welcomeTitle').textContent = 'Welcome back, ' + firstName;
  document.getElementById('welcomeBannerName').textContent = 'Welcome back, ' + firstName;
  document.getElementById('sidebarName').textContent = user.full_name;

  const initials = user.full_name.split(' ').map(function(w){ return w[0]; }).join('').slice(0, 2).toUpperCase();
  document.getElementById('sidebarInitials').textContent = initials;

  loadMyProfile();
}

async function loadMyProfile(){
  const token = localStorage.getItem('token') || sessionStorage.getItem('token');

  try{
    const response = await fetch('http://localhost:5000/api/members/me', {
      headers: { 'Authorization': 'Bearer ' + token }
    });

    const data = await response.json();

    if(!response.ok){
      document.getElementById('welcomeBannerPlan').textContent = data.message || 'Could not load plan.';
      return;
    }

    document.getElementById('welcomeBannerPlan').textContent =
      (data.plan_name || 'No plan') + ' plan';

    document.getElementById('welcomeBannerExpiry').textContent =
      data.membership_end ? formatDate(data.membership_end) : '-';

  } catch(err){
    document.getElementById('welcomeBannerPlan').textContent = 'Could not reach the server.';
  }
}

function formatDate(isoString){
  const d = new Date(isoString);
  return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
}