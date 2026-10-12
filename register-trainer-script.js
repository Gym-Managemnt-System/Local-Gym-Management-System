document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('registerTrainerForm');
  const errorMsg = document.getElementById('errorMsg');
  
  // Specialty Chips Logic
  const specialtyChips = document.querySelectorAll('.chip-card');
  let selectedSpecialties = [];

  specialtyChips.forEach(chip => {
    chip.addEventListener('click', () => {
      chip.classList.toggle('selected');
      const val = chip.getAttribute('data-value');
      
      if (selectedSpecialties.includes(val)) {
        selectedSpecialties = selectedSpecialties.filter(item => item !== val);
      } else {
        selectedSpecialties.push(val);
      }
    });
  });

  // Custom Dropdown for Gender
  const genderSelect = document.getElementById('genderSelect');
  const genderTrigger = document.getElementById('genderTrigger');
  const genderValue = document.getElementById('genderValue');
  const genderInput = document.getElementById('gender');
  const genderOptions = document.getElementById('genderOptions');

  genderTrigger.addEventListener('click', (e) => {
    e.stopPropagation();
    genderSelect.classList.toggle('open');
  });

  genderOptions.querySelectorAll('li').forEach(option => {
    option.addEventListener('click', () => {
      const val = option.getAttribute('data-value');
      genderInput.value = val;
      genderValue.textContent = option.textContent;
      if(val) genderTrigger.classList.add('filled');
      else genderTrigger.classList.remove('filled');
      
      genderOptions.querySelectorAll('li').forEach(li => li.classList.remove('selected'));
      option.classList.add('selected');
      genderSelect.classList.remove('open');
    });
  });

  document.addEventListener('click', () => {
    genderSelect.classList.remove('open');
  });

  // Generator Buttons
  document.getElementById('genUsername').addEventListener('click', () => {
    const name = document.getElementById('fullname').value.trim();
    const cleanName = name.toLowerCase().replace(/[^a-z0-9]/g, '');
    const rand = Math.floor(1000 + Math.random() * 9000);
    document.getElementById('username').value = `${cleanName || 'trainer'}${rand}`;
  });

  document.getElementById('genPassword').addEventListener('click', () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*';
    let pass = '';
    for (let i = 0; i < 10; i++) {
      pass += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    document.getElementById('password').value = pass;
  });

  // Submit to Backend Endpoint
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    errorMsg.style.display = 'none';

    const token = localStorage.getItem('token') || sessionStorage.getItem('token');
    if (!token) {
      errorMsg.textContent = 'You must be logged in as an admin.';
      errorMsg.style.display = 'block';
      return;
    }

    const fullname = document.getElementById('fullname').value.trim();
    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value;

    if (!fullname || !email || !password) {
      errorMsg.textContent = 'Please fill in required fields: Full Name, Email, and Password.';
      errorMsg.style.display = 'block';
      return;
    }

    const payload = {
      full_name: fullname,
      email: email,
      phone: document.getElementById('phone').value.trim() || null,
      dob: document.getElementById('dob').value || null,
      gender: genderInput.value || null,
      address: document.getElementById('address').value.trim() || null,
      username: document.getElementById('username').value.trim() || null,
      password: password,
      specialization: selectedSpecialties.join(', ') || null
    };

    try {
      const res = await fetch('http://localhost:5000/api/trainers/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + token
        },
        body: JSON.stringify(payload)
      });

      const data = await res.json();

      if (res.ok) {
        alert('Trainer created successfully!');
        window.location.href = 'trainers.html';
      } else {
        errorMsg.textContent = data.message || 'Failed to create trainer.';
        errorMsg.style.display = 'block';
      }
    } catch (err) {
      errorMsg.textContent = 'Could not reach server.';
      errorMsg.style.display = 'block';
    }
  });
});