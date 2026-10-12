document.addEventListener('DOMContentLoaded', async () => {
  const token = localStorage.getItem('token') || sessionStorage.getItem('token');
  if (!token) {
    alert('You must be logged in as an Admin.');
    return;
  }

  // Setup custom selects
  setupCustomSelect('memberSelect', 'memberTrigger', 'memberOptions', 'memberValue', 'memberInput');
  setupCustomSelect('amountSelect', 'amountTrigger', 'amountOptions', 'amountValue', 'amountInput');
  setupCustomSelect('methodSelect', 'methodTrigger', 'methodOptions', 'methodValue', 'methodInput');
  setupCustomSelect('statusSelect', 'statusTrigger', 'statusOptions', 'statusValue', 'statusInput');

  // Fetch members to populate dropdown
  try {
    const res = await fetch('http://localhost:5000/api/members', {
      headers: { 'Authorization': 'Bearer ' + token }
    });
    if (res.ok) {
      const members = await res.json();
      const memberOptions = document.getElementById('memberOptions');
      memberOptions.innerHTML = ''; // clear loading
      members.forEach(m => {
        const li = document.createElement('li');
        li.dataset.value = m.id;
        li.textContent = `${m.full_name} (${m.email})`;
        memberOptions.appendChild(li);
      });
    }
  } catch (err) {
    console.error('Failed to fetch members:', err);
  }

  // Fetch plans to populate amount dropdown
  try {
    const res = await fetch('http://localhost:5000/api/plans', {
      headers: { 'Authorization': 'Bearer ' + token }
    });
    if (res.ok) {
      const plans = await res.json();
      const amountOptions = document.getElementById('amountOptions');
      amountOptions.innerHTML = ''; // clear loading
      plans.forEach(p => {
        const li = document.createElement('li');
        li.dataset.value = p.price;
        li.textContent = `${p.plan_name} - Rs ${p.price}`;
        amountOptions.appendChild(li);
      });
    }
  } catch (err) {
    console.error('Failed to fetch plans:', err);
  }
  // Fetch payment data and fill form
  const paymentId = new URLSearchParams(window.location.search).get('id');
  if (paymentId) {
    try {
      const res = await fetch(`http://localhost:5000/api/payments/${paymentId}`, {
        headers: { 'Authorization': 'Bearer ' + token }
      });
      if (res.ok) {
        const p = await res.json();
        
        document.getElementById('memberInput').value = p.member_id;
        document.getElementById('amountInput').value = p.amount;
        document.getElementById('paymentDate').value = p.payment_date ? p.payment_date.split('T')[0] : '';
        document.getElementById('methodInput').value = p.payment_method;
        document.getElementById('statusInput').value = p.status;

        // Visual updates
        document.getElementById('memberTrigger').classList.add('filled');
        document.getElementById('amountTrigger').classList.add('filled');
        document.getElementById('methodValue').textContent = p.payment_method;
        document.getElementById('statusValue').textContent = p.status;
      }
    } catch(err) {
      console.error(err);
    }
  }
});

function setupCustomSelect(selectId, triggerId, optionsId, valueId, inputId) {
  const selectEl = document.getElementById(selectId);
  const triggerEl = document.getElementById(triggerId);
  const optionsEl = document.getElementById(optionsId);
  const valueEl = document.getElementById(valueId);
  const inputEl = document.getElementById(inputId);

  if(!selectEl) return;

  triggerEl.addEventListener('click', (e) => {
    e.stopPropagation();
    document.querySelectorAll('.custom-select').forEach(sel => {
      if(sel !== selectEl) sel.classList.remove('open');
    });
    selectEl.classList.toggle('open');
  });

  optionsEl.addEventListener('click', (e) => {
    const li = e.target.closest('li');
    if(!li) return;
    
    valueEl.textContent = li.textContent;
    inputEl.value = li.dataset.value;
    triggerEl.classList.add('filled');
    
    optionsEl.querySelectorAll('li').forEach(item => item.classList.remove('selected'));
    li.classList.add('selected');
    selectEl.classList.remove('open');
  });
}

document.addEventListener('click', () => {
  document.querySelectorAll('.custom-select').forEach(sel => sel.classList.remove('open'));
});

document.getElementById('paymentForm').addEventListener('submit', async function(e) {
  e.preventDefault();

  const paymentId = new URLSearchParams(window.location.search).get('id');
  const amount = document.getElementById('amountInput').value;
  const payment_date = document.getElementById('paymentDate').value;
  const payment_method = document.getElementById('methodInput').value;
  const status = document.getElementById('statusInput').value;
  const errorMsg = document.getElementById('errorMsg');

  if (!amount || !payment_date) {
    errorMsg.style.display = 'block';
    return;
  }
  errorMsg.style.display = 'none';

  const token = localStorage.getItem('token') || sessionStorage.getItem('token');
  try {
    const response = await fetch(`http://localhost:5000/api/payments/${paymentId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + token
      },
      body: JSON.stringify({ amount, payment_date, payment_method, status })
    });

    const data = await response.json();
    if (response.ok) {
      alert('Payment updated successfully!');
      window.location.href = 'payments.html';
    } else {
      alert('Error: ' + (data.message || 'Failed to update payment.'));
    }
  } catch (err) {
    console.error('Error:', err);
    alert('Could not reach backend server.');
  }
});
