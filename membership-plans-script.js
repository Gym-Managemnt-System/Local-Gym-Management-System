let plans = [];
let editingId = null;   // null = adding a new plan

const grid = document.getElementById('plansGrid');
const subtitle = document.getElementById('plansSubtitle');
const modal = document.getElementById('planModal');
const form = document.getElementById('planForm');
const errorBox = document.getElementById('planError');

async function loadPlans(){
  try{
    const res = await apiFetch('/plans');
    const data = await res.json();
    if(!res.ok){ grid.innerHTML = '<p class="plans-message">' + escapeHtml(data.message || 'Failed to load plans.') + '</p>'; return; }
    plans = data;
    renderPlans();
  } catch(err){
    grid.innerHTML = '<p class="plans-message">' + escapeHtml(err.message || 'Could not reach the server. Is the backend running?') + '</p>';
    subtitle.textContent = '';
  }
}

function renderPlans(){
  const totalEnrolled = plans.reduce(function(sum, p){ return sum + Number(p.enrolled); }, 0);
  subtitle.textContent = plans.length + ' active plans | ' + totalEnrolled + ' members enrolled';

  if(plans.length === 0){
    grid.innerHTML = '<p class="plans-message">No plans yet. Click "+ Add plan" to create one.</p>';
    return;
  }

  const maxEnrolled = Math.max.apply(null, plans.map(function(p){ return Number(p.enrolled); }));

  grid.innerHTML = plans.map(function(p){
    const features = (p.description || '').split('\n')
      .map(function(l){ return l.trim(); }).filter(Boolean)
      .map(function(l){ return '<li>' + escapeHtml(l) + '</li>'; }).join('');
    const popular = (maxEnrolled > 0 && Number(p.enrolled) === maxEnrolled) ? '<span class="plan-badge">Most popular</span>' : '';
    const months = Number(p.duration_months);
    return '' +
      '<div class="plan-card" data-id="' + p.id + '">' + popular +
        '<div class="plan-tier">' + escapeHtml(p.plan_name) + '</div>' +
        '<div class="plan-price">Rs ' + Number(p.price).toLocaleString('en-US') + '<span>/ ' + months + ' mo</span></div>' +
        '<div class="plan-billing">' + (months === 1 ? 'Billed monthly' : 'Billed every ' + months + ' months') + '</div>' +
        '<ul class="plan-features">' + features + '</ul>' +
        '<div class="plan-enrolled">' + p.enrolled + ' members enrolled</div>' +
        '<div class="plan-actions">' +
          '<button type="button" class="btn-edit" data-id="' + p.id + '">Edit</button>' +
          '<button type="button" class="btn-archive" data-id="' + p.id + '">Archive</button>' +
        '</div>' +
      '</div>';
  }).join('');
}

function openModal(plan){
  editingId = plan ? plan.id : null;
  document.getElementById('planModalTitle').textContent = plan ? 'Edit plan' : 'Add plan';
  document.getElementById('planName').value = plan ? plan.plan_name : '';
  document.getElementById('planDuration').value = plan ? plan.duration_months : '';
  document.getElementById('planPrice').value = plan ? plan.price : '';
  document.getElementById('planDescription').value = plan ? (plan.description || '') : '';
  errorBox.textContent = '';
  modal.hidden = false;
}
function closeModal(){ modal.hidden = true; }

document.getElementById('addPlanBtn').addEventListener('click', function(){ openModal(null); });
document.getElementById('planCancel').addEventListener('click', closeModal);
modal.addEventListener('click', function(e){ if(e.target === modal) closeModal(); });

form.addEventListener('submit', async function(e){
  e.preventDefault();
  errorBox.textContent = '';

  const body = JSON.stringify({
    plan_name: document.getElementById('planName').value.trim(),
    duration_months: Number(document.getElementById('planDuration').value),
    price: Number(document.getElementById('planPrice').value),
    description: document.getElementById('planDescription').value
  });

  try{
    const res = await apiFetch(editingId ? '/plans/' + editingId : '/plans', {
      method: editingId ? 'PUT' : 'POST',
      body: body
    });
    const data = await res.json();
    if(!res.ok){ errorBox.textContent = data.message || 'Could not save plan.'; return; }
    closeModal();
    loadPlans();
  } catch(err){
    errorBox.textContent = err.message;
  }
});

// Cards are created dynamically, so listen on the grid (event delegation)
grid.addEventListener('click', async function(e){
  const editBtn = e.target.closest('.btn-edit');
  const archiveBtn = e.target.closest('.btn-archive');

  if(editBtn){
    const plan = plans.find(function(p){ return String(p.id) === editBtn.dataset.id; });
    if(plan) openModal(plan);
  }

  if(archiveBtn){
    const plan = plans.find(function(p){ return String(p.id) === archiveBtn.dataset.id; });
    if(!plan) return;
    if(!confirm('Archive the "' + plan.plan_name + '" plan? It will be hidden from new sign-ups. Existing members keep their plan.')) return;
    try{
      const res = await apiFetch('/plans/' + plan.id + '/archive', { method: 'PUT' });
      const data = await res.json();
      if(!res.ok){ alert(data.message || 'Could not archive plan.'); return; }
      loadPlans();
    } catch(err){ alert(err.message); }
  }
});

loadPlans();