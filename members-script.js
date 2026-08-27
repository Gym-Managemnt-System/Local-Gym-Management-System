let allMembers = [];
let currentSort = 'name-asc';
let currentPlan = 'all';
let currentStatus = 'all';

// FETCH MEMBERS FROM BACKEND
async function loadMembers(){
  const subtitle = document.getElementById('membersSubtitle');
  const token = localStorage.getItem('token') || sessionStorage.getItem('token');

  if(!token){
    document.getElementById('membersTableBody').innerHTML = '<tr><td colspan="7">You must be logged in as an admin to view members.</td></tr>';
    subtitle.textContent = '';
    return;
  }

  try{
    const response = await fetch('http://localhost:5000/api/members', {
      headers: { 'Authorization': 'Bearer ' + token }
    });

    const members = await response.json();

    if(!response.ok){
      document.getElementById('membersTableBody').innerHTML = '<tr><td colspan="7">' + (members.message || 'Failed to load members.') + '</td></tr>';
      subtitle.textContent = '';
      return;
    }

    allMembers = members;
    subtitle.textContent = allMembers.length + ' total';
    applyFilters();

  } catch(err){
    document.getElementById('membersTableBody').innerHTML = '<tr><td colspan="7">Could not reach the server. Is the backend running?</td></tr>';
    subtitle.textContent = '';
  }
}

// COMBINE SEARCH + PLAN + STATUS + SORT, THEN RENDER
function applyFilters(){
  const term = searchInput.value.trim().toLowerCase();

  let list = allMembers.slice();

  if(term){
    list = list.filter(function(m){
      return m.full_name.toLowerCase().includes(term);
    });
  }

  if(currentPlan !== 'all'){
    list = list.filter(function(m){
      return (m.plan_name || '').toLowerCase() === currentPlan;
    });
  }

  if(currentStatus !== 'all'){
    if(currentStatus === 'expiring'){
      list = list.filter(function(m){
        if(!m.membership_end) return false;
        const daysLeft = (new Date(m.membership_end) - new Date()) / (1000 * 60 * 60 * 24);
        return m.status === 'active' && daysLeft >= 0 && daysLeft <= 14;
      });
    } else {
      list = list.filter(function(m){
        return m.status === currentStatus;
      });
    }
  }

  renderMembers(sortMembers(list, currentSort));
}

// RENDER A GIVEN LIST OF MEMBERS INTO THE TABLE
function renderMembers(list){
  const tbody = document.getElementById('membersTableBody');

  if(list.length === 0){
    tbody.innerHTML = '<tr><td colspan="7">No members match these filters.</td></tr>';
    return;
  }

  tbody.innerHTML = list.map(function(m){
    const initials = m.full_name.split(' ').map(function(w){ return w[0]; }).join('').slice(0, 2).toUpperCase();
    const statusClass = m.status === 'active' ? 'status-active'
      : m.status === 'expired' ? 'status-expired'
      : 'status-warning';

    return `
      <tr>
        <td class="checkbox-col"><input type="checkbox" /></td>
        <td class="member-cell">
          <span class="avatar-badge" style="background:#e3573f">${initials}</span>
          <span class="member-name">${m.full_name}</span>
        </td>
        <td>${m.plan_name || 'No plan'}</td>
        <td>${m.membership_start ? m.membership_start.slice(0, 10) : '-'}</td>
        <td>${m.membership_end ? m.membership_end.slice(0, 10) : '-'}</td>
        <td><span class="status ${statusClass}">${m.status}</span></td>
        <td class="menu-col" data-member-id="${m.id}">
          ⋮
          <div class="row-menu">
            <button type="button" class="row-menu-item edit-btn" data-id="${m.id}">Edit</button>
            <button type="button" class="row-menu-item deactivate-btn" data-id="${m.id}">Deactivate</button>
            <button type="button" class="row-menu-item delete-btn" data-id="${m.id}">Delete</button>
          </div>
        </td>
      </tr>
    `;
  }).join('');

  attachRowMenuHandlers();
}

// SORTING
function sortMembers(list, sortValue){
  const copy = list.slice();
  if(sortValue === 'name-asc'){
    copy.sort(function(a, b){ return a.full_name.localeCompare(b.full_name); });
  } else if(sortValue === 'name-desc'){
    copy.sort(function(a, b){ return b.full_name.localeCompare(a.full_name); });
  } else if(sortValue === 'joined-newest'){
    copy.sort(function(a, b){ return new Date(b.membership_start) - new Date(a.membership_start); });
  } else if(sortValue === 'joined-oldest'){
    copy.sort(function(a, b){ return new Date(a.membership_start) - new Date(b.membership_start); });
  }
  return copy;
}

// SEARCH WITH SUGGESTIONS
const searchInput = document.getElementById('searchInput');
const searchSuggestions = document.getElementById('searchSuggestions');

searchInput.addEventListener('input', function(){
  const term = searchInput.value.trim().toLowerCase();

  if(!term){
    searchSuggestions.classList.remove('open');
    applyFilters();
    return;
  }

  const matches = allMembers.filter(function(m){
    return m.full_name.toLowerCase().includes(term);
  });

  if(matches.length === 0){
    searchSuggestions.innerHTML = '<div class="search-suggestion-empty">Member not found.</div>';
  } else {
    searchSuggestions.innerHTML = matches.slice(0, 6).map(function(m){
      return `<div class="search-suggestion-item" data-id="${m.id}">${m.full_name}</div>`;
    }).join('');
  }

  searchSuggestions.classList.add('open');
  applyFilters();
});

searchSuggestions.addEventListener('click', function(e){
  const item = e.target.closest('.search-suggestion-item');
  if(!item) return;

  const id = item.dataset.id;
  const match = allMembers.find(function(m){ return String(m.id) === id; });
  if(match){
    searchInput.value = match.full_name;
    renderMembers([match]);
  }
  searchSuggestions.classList.remove('open');
});

document.addEventListener('click', function(e){
  if(!e.target.closest('.search-box')){
    searchSuggestions.classList.remove('open');
  }
});

// ROW MENU (⋮ → Edit / Deactivate / Delete)
function attachRowMenuHandlers(){
  document.querySelectorAll('.menu-col').forEach(function(menuCol){
    menuCol.addEventListener('click', function(e){
      e.stopPropagation();
      const menu = menuCol.querySelector('.row-menu');
      const isOpen = menu.classList.contains('open');
      document.querySelectorAll('.row-menu').forEach(function(m){ m.classList.remove('open'); });
      if(!isOpen){
        menu.classList.add('open');
      }
    });
  });

  document.querySelectorAll('.edit-btn').forEach(function(btn){
    btn.addEventListener('click', function(e){
      e.stopPropagation();
      window.location.href = 'edit-member.html?id=' + btn.dataset.id;
    });
  });

  document.querySelectorAll('.deactivate-btn').forEach(function(btn){
    btn.addEventListener('click', async function(e){
      e.stopPropagation();
      const id = btn.dataset.id;
      if(!confirm('Deactivate this member? They will lose active status but their record is kept.')) return;

      const token = localStorage.getItem('token') || sessionStorage.getItem('token');
      try{
        const response = await fetch('http://localhost:5000/api/members/' + id + '/deactivate', {
          method: 'PUT',
          headers: { 'Authorization': 'Bearer ' + token }
        });
        const data = await response.json();
        if(!response.ok){
          alert(data.message || 'Failed to deactivate member.');
          return;
        }
        loadMembers();
      } catch(err){
        alert('Could not reach the server.');
      }
    });
  });

  document.querySelectorAll('.delete-btn').forEach(function(btn){
    btn.addEventListener('click', async function(e){
      e.stopPropagation();
      const id = btn.dataset.id;
      if(!confirm('Permanently delete this member? This cannot be undone.')) return;

      const token = localStorage.getItem('token') || sessionStorage.getItem('token');
      try{
        const response = await fetch('http://localhost:5000/api/members/' + id, {
          method: 'DELETE',
          headers: { 'Authorization': 'Bearer ' + token }
        });
        const data = await response.json();
        if(!response.ok){
          alert(data.message || 'Failed to delete member.');
          return;
        }
        loadMembers();
      } catch(err){
        alert('Could not reach the server.');
      }
    });
  });
}

document.addEventListener('click', function(){
  document.querySelectorAll('.row-menu').forEach(function(m){ m.classList.remove('open'); });
});

loadMembers();

// CUSTOM DROPDOWNS (plan / status / sort / per-page)
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
    dropdown.dataset.value = li.dataset.value;

    if(dropdown.id === 'sortDropdown'){
      label.textContent = 'Sort: ' + li.textContent;
      currentSort = li.dataset.value;
      applyFilters();
    } else if(dropdown.id === 'planDropdown'){
      label.textContent = li.textContent;
      currentPlan = li.dataset.value;
      applyFilters();
    } else if(dropdown.id === 'statusDropdown'){
      label.textContent = li.textContent;
      currentStatus = li.dataset.value;
      applyFilters();
    } else {
      label.textContent = li.textContent;
    }

    dropdown.classList.remove('open');
  });
});

document.addEventListener('click', function(){
  document.querySelectorAll('.custom-dropdown').forEach(function(dropdown){
    dropdown.classList.remove('open');
  });
});