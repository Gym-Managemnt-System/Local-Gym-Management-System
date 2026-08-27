const params = new URLSearchParams(window.location.search);
const memberId = params.get('id');
const token = localStorage.getItem('token') || sessionStorage.getItem('token');

// Generic custom dropdown wiring (same pattern as members-script.js)
function setupDropdown(id, onSelect){
  const dropdown = document.getElementById(id);
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
    if(onSelect) onSelect(li.dataset.value);
    dropdown.classList.remove('open');
  });

  return {
    setValue: function(value){
      const li = options.querySelector('li[data-value="' + value + '"]');
      if(li){
        options.querySelectorAll('li').forEach(item => item.classList.remove('selected'));
        li.classList.add('selected');
        label.textContent = li.textContent;
        dropdown.dataset.value = value;
      }
    },
    getValue: function(){
      return dropdown.dataset.value;
    }
  };
}

const planDropdown = setupDropdown('planDropdownEdit');
const statusDropdown = setupDropdown('statusDropdownEdit');

document.addEventListener('click', function(){
  document.querySelectorAll('.custom-dropdown').forEach(function(dropdown){
    dropdown.classList.remove('open');
  });
});

async function loadMember(){
  const nameEl = document.getElementById('editMemberName');

  if(!token || !memberId){
    nameEl.textContent = 'Missing member ID or not logged in.';
    return;
  }

  try{
    const response = await fetch('http://localhost:5000/api/members/' + memberId, {
      headers: { 'Authorization': 'Bearer ' + token }
    });
    const data = await response.json();

    if(!response.ok){
      nameEl.textContent = data.message || 'Could not load member.';
      return;
    }

    nameEl.textContent = data.full_name;
    document.getElementById('editStart').value = data.membership_start ? data.membership_start.slice(0, 10) : '';
    document.getElementById('editEnd').value = data.membership_end ? data.membership_end.slice(0, 10) : '';
    statusDropdown.setValue(data.status || 'active');
    if(data.plan_name){
      planDropdown.setValue(data.plan_name.toLowerCase());
    }

  } catch(err){
    nameEl.textContent = 'Could not reach the server.';
  }
}

document.getElementById('editMemberForm').addEventListener('submit', async function(e){
  e.preventDefault();
  const err = document.getElementById('errorMsg');

  const body = {
    plan_name: planDropdown.getValue(),
    membership_start: document.getElementById('editStart').value,
    membership_end: document.getElementById('editEnd').value,
    status: statusDropdown.getValue()
  };

  try{
    const response = await fetch('http://localhost:5000/api/members/' + memberId, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + token
      },
      body: JSON.stringify(body)
    });

    const data = await response.json();

    if(!response.ok){
      err.textContent = data.message || 'Failed to update member.';
      err.style.display = 'block';
      return;
    }

    window.location.href = 'members.html';

  } catch(networkErr){
    err.textContent = 'Could not reach the server.';
    err.style.display = 'block';
  }
});

loadMember();