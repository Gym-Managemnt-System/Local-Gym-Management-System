let allAttendance = [];

const colors = ['#e3573f', '#4c8c4a', '#c9a227', '#e08a2b', '#8a5fd6'];

function getInitials(name){
  return name.split(' ').map(function(w){ return w[0]; }).join('').slice(0, 2).toUpperCase();
}

async function loadTodayAttendance(){
  const tbody = document.querySelector('.attendance-table tbody');
  const subtitle = document.querySelector('.page-subtitle');
  const token = localStorage.getItem('token') || sessionStorage.getItem('token');

  if(!token){
    tbody.innerHTML = '<tr><td colspan="6">You must be logged in as an admin to view attendance.</td></tr>';
    return;
  }

  try{
    const response = await fetch('http://localhost:5000/api/attendance/today', {
      headers: { 'Authorization': 'Bearer ' + token }
    });

    const data = await response.json();

    if(!response.ok){
      tbody.innerHTML = '<tr><td colspan="6">' + (data.message || 'Failed to load attendance.') + '</td></tr>';
      return;
    }

    allAttendance = data;
    const checkedInCount = data.filter(function(r){ return r.check_in_time; }).length;
    const today = new Date().toLocaleDateString('en-US', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
    subtitle.textContent = today + ' | ' + checkedInCount + ' checked-in today';

    renderAttendance(allAttendance);

  } catch(err){
    tbody.innerHTML = '<tr><td colspan="6">Could not reach the server. Is the backend running?</td></tr>';
  }
}

function formatTime(timeStr){
  if(!timeStr) return '—';
  const [h, m] = timeStr.split(':');
  const hour = parseInt(h, 10);
  const period = hour >= 12 ? 'PM' : 'AM';
  const displayHour = hour % 12 === 0 ? 12 : hour % 12;
  return displayHour + ':' + m + ' ' + period;
}

function renderAttendance(list){
  const tbody = document.querySelector('.attendance-table tbody');

  if(list.length === 0){
    tbody.innerHTML = '<tr><td colspan="6">No members found.</td></tr>';
    return;
  }

  tbody.innerHTML = list.map(function(row, i){
    const initials = getInitials(row.full_name);
    const color = colors[i % colors.length];
    const isCheckedIn = !!row.check_in_time;

    return `
      <tr>
        <td class="checkbox-col"><input type="checkbox" /></td>
        <td class="member-cell">
          <span class="avatar-badge" style="background:${color}">${initials}</span>
          <span class="member-name">${row.full_name}</span>
        </td>
        <td>${row.plan_name || 'No plan'}</td>
        <td>${formatTime(row.check_in_time)}</td>
        <td><span class="status ${isCheckedIn ? 'status-active' : 'status-warning'}">${isCheckedIn ? 'Checked in' : 'Not checked in'}</span></td>
        <td class="menu-col">
          <div class="action-menu-container" style="position: relative; display: inline-block;">
            <button class="more-btn" onclick="toggleMenu(event)" style="background: none; border: none; color: #fff; font-size: 18px; cursor: pointer;">⋮</button>
            <div class="dropdown-menu" style="display: none; position: absolute; right: 0; top: 100%; background-color: #222; border: 1px solid #444; border-radius: 4px; min-width: 140px; z-index: 100; box-shadow: 0 4px 8px rgba(0,0,0,0.3);">
              ${isCheckedIn 
                ? `<button onclick="toggleAttendanceStatus(${row.member_id}, 'undo')" style="width: 100%; text-align: left; padding: 8px 12px; background: none; border: none; color: #ddd; cursor: pointer; font-size: 14px;">Undo Check-in</button>` 
                : `<button onclick="toggleAttendanceStatus(${row.member_id}, 'checkin')" style="width: 100%; text-align: left; padding: 8px 12px; background: none; border: none; color: #ddd; cursor: pointer; font-size: 14px;">Mark Present</button>`
              }
              <button onclick="viewHistory(${row.member_id})" style="width: 100%; text-align: left; padding: 8px 12px; background: none; border: none; color: #ddd; cursor: pointer; font-size: 14px;">View History</button>
            </div>
          </div>
        </td>
      </tr>
    `;
  }).join('');
}

// TOGGLE ACTION MENU
function toggleMenu(event){
  event.stopPropagation();
  document.querySelectorAll('.dropdown-menu').forEach(function(menu){
    menu.style.display = 'none';
  });
  const menu = event.currentTarget.nextElementSibling;
  menu.style.display = 'block';
}

// CLOSE ACTION MENUS ON CLICK OUTSIDE
document.addEventListener('click', function(){
  document.querySelectorAll('.dropdown-menu').forEach(function(menu){
    menu.style.display = 'none';
  });
});

// MANUAL CHECK-IN / UNDO FUNCTION
async function toggleAttendanceStatus(memberId, action){
  const token = localStorage.getItem('token') || sessionStorage.getItem('token');
  if(!token) return alert('Session expired. Please log in again.');

  try {
    const response = await fetch('http://localhost:5000/api/attendance/checkin', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + token
      },
      body: JSON.stringify({ member_id: memberId, action: action })
    });

    const data = await response.json();
    if(response.ok){
      loadTodayAttendance();
    } else {
      alert(data.message || 'Action failed.');
    }
  } catch(err){
    alert('Server error occurred.');
  }
}

// VIEW HISTORY PLACEHOLDER
function viewHistory(memberId){
  window.location.href = `member-details.html?id=${memberId}`;
}

// SEARCH (client-side, filters the loaded list)
const searchInput = document.querySelector('.search-box input');
if(searchInput){
  searchInput.addEventListener('input', function(){
    const term = searchInput.value.trim().toLowerCase();
    if(!term){
      renderAttendance(allAttendance);
      return;
    }
    const matches = allAttendance.filter(function(r){
      return r.full_name.toLowerCase().includes(term);
    });
    renderAttendance(matches);
  });
}

// STATUS FILTER DROPDOWN (client-side)
document.addEventListener('click', function(e){
  const li = e.target.closest('#statusDropdown .custom-dropdown-options li');
  if(!li) return;
  const value = li.dataset.value;
  if(value === 'checked'){
    renderAttendance(allAttendance.filter(function(r){ return r.check_in_time; }));
  } else if(value === 'not-checked'){
    renderAttendance(allAttendance.filter(function(r){ return !r.check_in_time; }));
  } else {
    renderAttendance(allAttendance);
  }
});

loadTodayAttendance();

// CUSTOM DROPDOWNS (unchanged)
document.querySelectorAll('.custom-dropdown').forEach(function(dropdown){
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

    dropdown.classList.remove('open');
  });
});

document.addEventListener('click', function(){
  document.querySelectorAll('.custom-dropdown').forEach(function(dropdown){
    dropdown.classList.remove('open');
  });
});