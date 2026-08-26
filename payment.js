const form = document.getElementById('paymentForm');
const errorMsg = document.getElementById('errorMsg');
const methodButtons = document.querySelectorAll('.method-btn');
const paymentMethodInput = document.getElementById('paymentMethod');
const cancelBtn = document.getElementById('cancelBtn');

// Payment method selection
methodButtons.forEach(btn => {
  btn.addEventListener('click', function(){
    methodButtons.forEach(b => b.classList.remove('selected'));
    this.classList.add('selected');
    paymentMethodInput.value = this.dataset.method;
  });
});

// Form submit
form.addEventListener('submit', function(e){
  e.preventDefault();

  const member = document.getElementById('member').value.trim();
  const plan = document.getElementById('plan').value;
  const status = document.getElementById('status').value;
  const amount = document.getElementById('amount').value;
  const method = paymentMethodInput.value;
  const note = document.getElementById('note').value.trim();

  if(!member || !plan || !status || !amount || !method){
    errorMsg.style.display = 'block';
    return;
  }
  errorMsg.style.display = 'none';

  const payment = { member, plan, status, amount, method, note };

  // Replace this with a real API call, e.g. fetch('/api/payments', { method: 'POST', body: JSON.stringify(payment) })
  console.log('Recording payment:', payment);
  alert('Payment recorded for ' + member + ' — Rs ' + amount);

  form.reset();
  methodButtons.forEach(b => b.classList.remove('selected'));
  paymentMethodInput.value = '';
});

// Cancel button
cancelBtn.addEventListener('click', function(){
  const confirmed = confirm('Discard this payment entry?');
  if(confirmed){
    form.reset();
    methodButtons.forEach(b => b.classList.remove('selected'));
    paymentMethodInput.value = '';
    errorMsg.style.display = 'none';
    // Hook: navigate back to payments list here
  }
});
