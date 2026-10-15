let allMembers = [];
const token = localStorage.getItem('token') || sessionStorage.getItem('token');

async function loadMembersForSearch(){
  if(!token) return;
  try{
    const response = await fetch('http://localhost:5000/api/members', {
      headers: { 'Authorization': 'Bearer ' + token }
    });
    const data = await response.json();
    if(response.ok){
      allMembers = data;
    }
  } catch(err){
    // fail silently, search just won't return results
  }
}

const searchInput = document.getElementById('searchMember');
const searchSuggestions = document.getElementById('searchSuggestions');
const selectedMemberIdInput = document.getElementById('selectedMemberId');

searchInput.addEventListener('input', function(){
  selectedMemberIdInput.value = '';
  const term = searchInput.value.trim().toLowerCase();

  if(!term){
    searchSuggestions.classList.remove('open');
    return;
  }

  const matches = allMembers.filter(function(m){
    return m.full_name.toLowerCase().includes(term);
  });

  if(matches.length === 0){
    searchSuggestions.innerHTML = '<div class="search-suggestion-empty">Member not found.</div>';
  } else {
    searchSuggestions.innerHTML = matches.slice(0, 6).map(function(m){
      return `<div class="search-suggestion-item" data-id="${m.id}" data-name="${m.full_name}">${m.full_name}</div>`;
    }).join('');
  }

  searchSuggestions.classList.add('open');
});

searchSuggestions.addEventListener('click', function(e){
  const item = e.target.closest('.search-suggestion-item');
  if(!item) return;
  searchInput.value = item.dataset.name;
  selectedMemberIdInput.value = item.dataset.id;
  searchSuggestions.classList.remove('open');
});

document.addEventListener('click', function(e){
  if(!e.target.closest('.field')){
    searchSuggestions.classList.remove('open');
  }
});

document.getElementById('checkinForm').addEventListener('submit', async function(e){
  e.preventDefault();
  const err = document.getElementById('errorMsg');
  const memberId = selectedMemberIdInput.value;

  if(!memberId){
    err.textContent = 'Please select a member from the list.';
    err.style.display = 'block';
    return;
  }

  err.style.display = 'none';

  try{
    const response = await fetch('http://localhost:5000/api/attendance/checkin', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + token
      },
      body: JSON.stringify({ member_id: memberId })
    });

    const data = await response.json();

    if(!response.ok){
      err.textContent = data.message || 'Failed to record check-in.';
      err.style.display = 'block';
      return;
    }

    alert('Check-in recorded for ' + searchInput.value + '.');
    window.location.href = 'attendance.html';

  } catch(networkErr){
    err.textContent = 'Could not reach the server. Is the backend running?';
    err.style.display = 'block';
  }
});

loadMembersForSearch();