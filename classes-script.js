// ---- Auth helper ----
function getToken() {
  return localStorage.getItem('token') || sessionStorage.getItem('token');
}

// ---- State ----
const classGrid = document.querySelector('.class-grid');
const searchInput = document.querySelector('.search-box input');
let allClasses = [];
let allTrainers = [];
let currentCategory = 'all';
let currentSearch = '';

// ---- Render ----
function renderClasses(classes) {
  classGrid.innerHTML = '';

  if (classes.length === 0) {
    classGrid.innerHTML = '<p style="color: var(--muted);">No classes found.</p>';
    return;
  }

  classes.forEach(function(cls) {
    const percent = cls.max_capacity > 0
      ? Math.round((cls.booked_count / cls.max_capacity) * 100)
      : 0;

    const card = document.createElement('div');
    card.className = 'class-card';
    card.dataset.id = cls.id;
    card.innerHTML = `
      <div class="class-card-top">
        <span class="class-time">${cls.start_time} — ${cls.duration_minutes} min</span>
        <div class="card-menu-wrap">
          <span class="class-menu" data-action="toggle-menu">⋮</span>
          <div class="card-menu-dropdown">
            <button type="button" data-action="edit">Edit</button>
            <button type="button" data-action="view-members">View booked members</button>
            <button type="button" data-action="delete" class="danger">Delete</button>
          </div>
        </div>
      </div>
      <div class="class-name">${cls.class_name}</div>
      <div class="class-trainer">Trainer: ${cls.trainer_name || 'Unassigned'}</div>
      <div class="class-progress">
        <div class="class-progress-fill" style="width:${percent}%"></div>
      </div>
      <div class="class-booked">${cls.booked_count} / ${cls.max_capacity} booked</div>
    `;
    classGrid.appendChild(card);
  });
}

function applyFilter() {
  let filtered = allClasses;

  if (currentCategory !== 'all') {
    filtered = filtered.filter(function(cls) {
      return cls.category === currentCategory;
    });
  }

  if (currentSearch.trim() !== '') {
    const term = currentSearch.trim().toLowerCase();
    filtered = filtered.filter(function(cls) {
      return cls.class_name.toLowerCase().includes(term) ||
             (cls.trainer_name && cls.trainer_name.toLowerCase().includes(term));
    });
  }

  renderClasses(filtered);
}

// ---- Fetch data ----
async function loadClasses() {
  const token = getToken();
  if (!token) {
    window.location.href = 'login.html';
    return;
  }

  try {
    const response = await fetch('http://localhost:5000/api/classes', {
      headers: { 'Authorization': 'Bearer ' + token }
    });

    if (response.status === 401 || response.status === 403) {
      window.location.href = 'login.html';
      return;
    }

    allClasses = await response.json();
    applyFilter();
  } catch (err) {
    classGrid.innerHTML = '<p style="color: var(--muted);">Could not load classes. Is the backend running?</p>';
  }
}

async function loadTrainers() {
  try {
    const response = await fetch('http://localhost:5000/api/trainers', {
      headers: { 'Authorization': 'Bearer ' + getToken() }
    });
    allTrainers = await response.json();
  } catch (err) {
    allTrainers = [];
  }
}

loadClasses();
loadTrainers();

// ---- Search box ----
searchInput.addEventListener('input', function(){
  currentSearch = searchInput.value;
  applyFilter();
});

// ---- Custom filter/pagination dropdowns ----
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

    if (dropdown.id === 'classTypeDropdown') {
      currentCategory = li.dataset.value;
      applyFilter();
    }
  });
});

document.addEventListener('click', function(){
  document.querySelectorAll('.custom-dropdown').forEach(function(dropdown){
    dropdown.classList.remove('open');
  });
  document.querySelectorAll('.card-menu-dropdown.open').forEach(d => d.classList.remove('open'));
});

// ---- Per-card menu (Edit / Delete / View Booked Members) ----
classGrid.addEventListener('click', function(e){
  const menuToggle = e.target.closest('[data-action="toggle-menu"]');
  if (menuToggle) {
    e.stopPropagation();
    const dropdown = menuToggle.parentElement.querySelector('.card-menu-dropdown');
    document.querySelectorAll('.card-menu-dropdown.open').forEach(function(d){
      if (d !== dropdown) d.classList.remove('open');
    });
    dropdown.classList.toggle('open');
    return;
  }

  const actionBtn = e.target.closest('[data-action]');
  if (!actionBtn) return;

  const card = e.target.closest('.class-card');
  const classId = card.dataset.id;
  const action = actionBtn.dataset.action;

  if (action === 'edit') {
    openEditModal(classId);
  } else if (action === 'delete') {
    handleDeleteClass(classId);
  } else if (action === 'view-members') {
    openMembersModal(classId);
  }

  document.querySelectorAll('.card-menu-dropdown.open').forEach(d => d.classList.remove('open'));
});

// ---- Time format helpers ("6:00 AM" <-> "06:00") ----
function to24Hour(timeStr) {
  const match = timeStr.match(/(\d+):(\d+)\s*(AM|PM)/i);
  if (!match) return '';
  let hour = parseInt(match[1], 10);
  const minute = match[2];
  const period = match[3].toUpperCase();
  if (period === 'PM' && hour !== 12) hour += 12;
  if (period === 'AM' && hour === 12) hour = 0;
  return String(hour).padStart(2, '0') + ':' + minute;
}

function to12Hour(timeStr) {
  const [hourStr, minute] = timeStr.split(':');
  let hour = parseInt(hourStr, 10);
  const period = hour >= 12 ? 'PM' : 'AM';
  hour = hour % 12;
  if (hour === 0) hour = 12;
  return `${hour}:${minute} ${period}`;
}

function populateTrainerSelect(selectEl, selectedId) {
  selectEl.innerHTML = '';
  allTrainers.forEach(function(t) {
    const opt = document.createElement('option');
    opt.value = t.id;
    opt.textContent = t.full_name;
    if (String(t.id) === String(selectedId)) opt.selected = true;
    selectEl.appendChild(opt);
  });
}

// ---- Edit modal ----
const editModalOverlay = document.getElementById('editModalOverlay');
const editClassForm = document.getElementById('editClassForm');

function openEditModal(classId) {
  const cls = allClasses.find(c => String(c.id) === String(classId));
  if (!cls) return;

  document.getElementById('editClassId').value = cls.id;
  document.getElementById('editClassName').value = cls.class_name;
  document.getElementById('editClassTime').value = to24Hour(cls.start_time);
  document.getElementById('editClassCategory').value = cls.category;
  document.getElementById('editClassDuration').value = cls.duration_minutes;
  document.getElementById('editClassCapacity').value = cls.max_capacity;
  populateTrainerSelect(document.getElementById('editClassTrainer'), cls.trainer_id);

  document.getElementById('editModalError').classList.remove('show');
  editModalOverlay.classList.add('open');
}

document.getElementById('editModalClose').addEventListener('click', function(){
  editModalOverlay.classList.remove('open');
});

editModalOverlay.addEventListener('click', function(e){
  if (e.target === editModalOverlay) editModalOverlay.classList.remove('open');
});

editClassForm.addEventListener('submit', async function(e){
  e.preventDefault();
  const id = document.getElementById('editClassId').value;
  const errEl = document.getElementById('editModalError');

  const body = {
    class_name: document.getElementById('editClassName').value.trim(),
    category: document.getElementById('editClassCategory').value,
    trainer_id: parseInt(document.getElementById('editClassTrainer').value, 10),
    start_time: to12Hour(document.getElementById('editClassTime').value),
    duration_minutes: parseInt(document.getElementById('editClassDuration').value, 10),
    max_capacity: parseInt(document.getElementById('editClassCapacity').value, 10)
  };

  try {
    const response = await fetch('http://localhost:5000/api/classes/' + id, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + getToken()
      },
      body: JSON.stringify(body)
    });

    const data = await response.json();

    if (!response.ok) {
      errEl.textContent = data.message || 'Failed to update class.';
      errEl.classList.add('show');
      return;
    }

    editModalOverlay.classList.remove('open');
    loadClasses();
  } catch (err) {
    errEl.textContent = 'Could not reach the server.';
    errEl.classList.add('show');
  }
});

// ---- Delete ----
async function handleDeleteClass(classId) {
  const cls = allClasses.find(c => String(c.id) === String(classId));
  const name = cls ? cls.class_name : 'this class';
  if (!confirm(`Delete "${name}"? This cannot be undone.`)) return;

  try {
    const response = await fetch('http://localhost:5000/api/classes/' + classId, {
      method: 'DELETE',
      headers: { 'Authorization': 'Bearer ' + getToken() }
    });

    const data = await response.json();

    if (!response.ok) {
      alert(data.message || 'Failed to delete class.');
      return;
    }

    loadClasses();
  } catch (err) {
    alert('Could not reach the server.');
  }
}

// ---- View booked members modal ----
const membersModalOverlay = document.getElementById('membersModalOverlay');
const membersModalBody = document.getElementById('membersModalBody');
const membersModalTitle = document.getElementById('membersModalTitle');

async function openMembersModal(classId) {
  const cls = allClasses.find(c => String(c.id) === String(classId));
  membersModalTitle.textContent = cls ? `Booked Members — ${cls.class_name}` : 'Booked Members';
  membersModalBody.innerHTML = '<p style="color: var(--muted);">Loading…</p>';
  membersModalOverlay.classList.add('open');

  try {
    const response = await fetch('http://localhost:5000/api/classes/' + classId + '/members', {
      headers: { 'Authorization': 'Bearer ' + getToken() }
    });
    const members = await response.json();

    if (!response.ok) {
      membersModalBody.innerHTML = '<p style="color: var(--muted);">' + (members.message || 'Failed to load members.') + '</p>';
      return;
    }

    if (members.length === 0) {
      membersModalBody.innerHTML = '<p style="color: var(--muted);">No members booked yet.</p>';
      return;
    }

    const list = document.createElement('ul');
    list.className = 'members-list';
    members.forEach(function(m) {
      const li = document.createElement('li');
      li.innerHTML = `
        <div>${m.full_name}</div>
        <div class="member-email">${m.email || ''}</div>
        <div class="member-phone">${m.phone || ''}</div>
      `;
      list.appendChild(li);
    });
    membersModalBody.innerHTML = '';
    membersModalBody.appendChild(list);
  } catch (err) {
    membersModalBody.innerHTML = '<p style="color: var(--muted);">Could not reach the server.</p>';
  }
}

document.getElementById('membersModalClose').addEventListener('click', function(){
  membersModalOverlay.classList.remove('open');
});

membersModalOverlay.addEventListener('click', function(e){
  if (e.target === membersModalOverlay) membersModalOverlay.classList.remove('open');
});