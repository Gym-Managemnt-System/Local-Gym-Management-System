document.addEventListener('DOMContentLoaded', () => {
  // Load initial trainer data from the backend
  fetchTrainers();

  // --- 1. SPECIALTY SELECTION CHIPS ---
  const specialtyChips = document.querySelectorAll('.specialties-container .chip, .specialties span, .specialty-btn');
  let selectedSpecialties = [];

  specialtyChips.forEach(chip => {
    chip.addEventListener('click', () => {
      chip.classList.toggle('active');
      const val = chip.textContent.trim();
      
      if (selectedSpecialties.includes(val)) {
        selectedSpecialties = selectedSpecialties.filter(s => s !== val);
      } else {
        selectedSpecialties.push(val);
      }
    });
  });

  // --- 2. USERNAME & PASSWORD GENERATORS ---
  const btnGenerateUsername = document.getElementById('btn-generate-username') || document.querySelector('.btn-gen-username');
  const btnGeneratePassword = document.getElementById('btn-generate-password') || document.querySelector('.btn-gen-password');

  if (btnGenerateUsername) {
    btnGenerateUsername.addEventListener('click', (e) => {
      e.preventDefault();
      const fullNameInput = document.getElementById('full_name') || document.querySelector('input[placeholder*="Full name"]');
      const fullName = fullNameInput ? fullNameInput.value.trim() : 'trainer';
      const cleanName = fullName.toLowerCase().replace(/[^a-z0-9]/g, '');
      const randomNum = Math.floor(1000 + Math.random() * 9000);
      const generatedUser = `${cleanName || 'trainer'}${randomNum}`;

      const usernameInput = document.getElementById('username') || document.querySelector('input[placeholder*="Username"]');
      if (usernameInput) {
        usernameInput.value = generatedUser;
      }
      alert(`Generated Username: ${generatedUser}`);
    });
  }

  if (btnGeneratePassword) {
    btnGeneratePassword.addEventListener('click', (e) => {
      e.preventDefault();
      const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*';
      let pass = '';
      for (let i = 0; i < 10; i++) {
        pass += chars.charAt(Math.floor(Math.random() * chars.length));
      }

      const passwordInput = document.getElementById('password') || document.querySelector('input[placeholder*="Password"]');
      if (passwordInput) {
        passwordInput.value = pass;
      }
      alert(`Generated Password: ${pass}`);
    });
  }

  // --- 3. FORM SUBMISSION TO BACKEND ---
  const form = document.querySelector('form') || document.querySelector('.create-trainer-form');
  
  if (form) {
    form.addEventListener('submit', handleTrainerSubmit);
  } else {
    const submitBtn = document.getElementById('btn-submit') || document.querySelector('.btn-submit');
    if (submitBtn) {
      submitBtn.addEventListener('click', handleTrainerSubmit);
    }
  }

  async function handleTrainerSubmit(e) {
    e.preventDefault();

    const token = localStorage.getItem('token') || sessionStorage.getItem('token');
    if (!token) {
      alert('You must be logged in as an Admin to create a trainer.');
      return;
    }

    const fullNameVal = (document.getElementById('full_name') || document.querySelector('input[name="full_name"]'))?.value.trim();
    const emailVal = (document.getElementById('email') || document.querySelector('input[name="email"]'))?.value.trim();
    const phoneVal = (document.getElementById('phone') || document.querySelector('input[name="phone"]'))?.value.trim();
    const dobVal = (document.getElementById('dob') || document.querySelector('input[name="dob"]'))?.value;
    const addressVal = (document.getElementById('address') || document.querySelector('input[name="address"]'))?.value.trim();
    const usernameVal = (document.getElementById('username') || document.querySelector('input[name="username"]'))?.value.trim();
    const passwordVal = (document.getElementById('password') || document.querySelector('input[name="password"]'))?.value;
    
    const genderDropdown = document.querySelector('#genderDropdown') || document.querySelector('.gender-dropdown');
    const genderVal = genderDropdown?.dataset.value || document.getElementById('gender')?.value || null;

    if (!fullNameVal || !emailVal || !passwordVal) {
      alert('Please fill in required fields: Full Name, Email, and Password.');
      return;
    }

    const payload = {
      full_name: fullNameVal,
      email: emailVal,
      phone: phoneVal || null,
      dob: dobVal || null,
      gender: genderVal || null,
      address: addressVal || null,
      username: usernameVal || null,
      password: passwordVal,
      specialization: selectedSpecialties.join(', ') || null
    };

    try {
      const response = await fetch('http://localhost:5000/api/trainers/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + token
        },
        body: JSON.stringify(payload)
      });

      const data = await response.json();

      if (response.ok) {
        alert('Trainer account created successfully!');
        window.location.href = 'trainers.html';
      } else {
        alert('Error: ' + (data.message || 'Failed to create trainer.'));
      }
    } catch (err) {
      console.error('Registration error:', err);
      alert('Could not reach the backend server.');
    }
  }
});

// --- FETCH & DISPLAY TRAINERS FROM BACKEND ---
async function fetchTrainers() {
  const token = localStorage.getItem('token') || sessionStorage.getItem('token');
  const trainerListContainer = document.querySelector('.trainer-list');

  if (!trainerListContainer) return;

  try {
    const response = await fetch('http://localhost:5000/api/trainers', {
      headers: {
        'Authorization': 'Bearer ' + token
      }
    });

    if (!response.ok) {
      throw new Error('Failed to fetch trainer data');
    }

    const trainers = await response.json();
    renderTrainerList(trainers);
  } catch (err) {
    console.error('Error fetching trainers:', err);
  }
}

function renderTrainerList(trainers) {
  const container = document.querySelector('.trainer-list');
  if (!container) return;

  if (!trainers || trainers.length === 0) {
    container.innerHTML = '<p style="color: var(--muted); padding: 20px;">No trainers registered yet.</p>';
    return;
  }

  container.innerHTML = trainers.map((trainer, index) => {
    const photoUrl = trainer.photo_url || `../assets/T${(index % 3) + 1}.jpg`;
    const trainerId = trainer.trainer_id || trainer.id;

    return `
      <div class="trainer-card panel" data-id="${trainerId}">
        <input type="checkbox" class="trainer-check" />
        <img src="${photoUrl}" alt="${trainer.full_name}" class="trainer-photo" />
        <div class="trainer-info">
          <div class="trainer-name">${trainer.full_name}</div>
          <div class="trainer-specialty">${trainer.specialization || 'General Trainer'}</div>
        </div>
        <div class="trainer-divider"></div>
        <div class="trainer-stat">
          <div class="stat-num">${trainer.classes_count || 0}</div>
          <div class="stat-label">Classes</div>
        </div>
        <div class="trainer-stat">
          <div class="stat-num">${trainer.members_count || 0}</div>
          <div class="stat-label">Members</div>
        </div>
        <div class="trainer-stat">
          <div class="stat-num">${trainer.rating || '4.8'}</div>
          <div class="stat-label">Ratings</div>
        </div>
        
        <!-- ACTION DROPDOWN OVERLAY -->
        <div class="menu-col action-dropdown">
          <button type="button" class="action-btn" aria-label="Actions">⋮</button>
          <div class="action-menu">
            <button type="button" class="action-item edit-btn" data-id="${trainerId}">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
              Edit
            </button>
            <button type="button" class="action-item delete-btn" data-id="${trainerId}">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/><line x1="10" y1="11" x2="10" y2="17"/><line x1="14" y1="11" x2="14" y2="17"/></svg>
              Remove
            </button>
          </div>
        </div>
      </div>
    `;
  }).join('');
}

// --- GLOBAL EVENT LISTENERS FOR ACTION MENU, EDIT, AND DELETE ---
document.addEventListener('click', (e) => {
  const toggleBtn = e.target.closest('.action-btn');
  const activeDropdown = document.querySelector('.action-dropdown.active');

  // Close open action menu when clicking outside
  if (activeDropdown && (!toggleBtn || activeDropdown !== toggleBtn.closest('.action-dropdown'))) {
    activeDropdown.classList.remove('active');
  }

  // Toggle current action menu
  if (toggleBtn) {
    e.stopPropagation();
    const dropdown = toggleBtn.closest('.action-dropdown');
    dropdown.classList.toggle('active');
    return;
  }

  // Handle Edit Action
  const editBtn = e.target.closest('.edit-btn');
  if (editBtn) {
    const trainerId = editBtn.dataset.id;
    window.location.href = `register-trainer.html?id=${trainerId}`;
    return;
  }

  // Handle Remove Action
  const deleteBtn = e.target.closest('.delete-btn');
  if (deleteBtn) {
    const trainerId = deleteBtn.dataset.id;
    if (confirm('Are you sure you want to remove this trainer?')) {
      deleteTrainer(trainerId);
    }
  }
});

async function deleteTrainer(id) {
  const token = localStorage.getItem('token') || sessionStorage.getItem('token');
  try {
    const response = await fetch(`http://localhost:5000/api/trainers/${id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': 'Bearer ' + token
      }
    });

    if (response.ok) {
      alert('Trainer removed successfully.');
      fetchTrainers();
    } else {
      const data = await response.json();
      alert('Failed to remove trainer: ' + (data.message || 'Server error.'));
    }
  } catch (error) {
    console.error('Error removing trainer:', error);
    alert('Could not reach backend server.');
  }
}

// --- 4. CUSTOM DROPDOWNS ---
document.querySelectorAll('.custom-dropdown').forEach(function(dropdown){
  const trigger = dropdown.querySelector('.custom-dropdown-trigger');
  const label = dropdown.querySelector('.custom-dropdown-label');
  const options = dropdown.querySelector('.custom-dropdown-options');

  if (trigger) {
    trigger.addEventListener('click', function(e){
      e.stopPropagation();
      document.querySelectorAll('.custom-dropdown').forEach(function(other){
        if(other !== dropdown) other.classList.remove('open');
      });
      dropdown.classList.toggle('open');
    });
  }

  if (options) {
    options.addEventListener('click', function(e){
      const li = e.target.closest('li');
      if(!li) return;

      options.querySelectorAll('li').forEach(item => item.classList.remove('selected'));
      li.classList.add('selected');
      if (label) label.textContent = li.textContent;
      dropdown.dataset.value = li.dataset.value;

      dropdown.classList.remove('open');
    });
  }
});

document.addEventListener('click', function(){
  document.querySelectorAll('.custom-dropdown').forEach(function(dropdown){
    dropdown.classList.remove('open');
  });
});