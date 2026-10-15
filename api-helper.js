const API_BASE = 'http://localhost:5000/api';

function getToken(){
  return localStorage.getItem('token') || sessionStorage.getItem('token');
}

async function apiFetch(path, options){
  options = options || {};
  const token = getToken();
  if(!token){ window.location.href = 'login.html'; throw new Error('Not logged in'); }

  options.headers = Object.assign({ 'Authorization': 'Bearer ' + token }, options.headers || {});
  if(options.body && !options.headers['Content-Type']){
    options.headers['Content-Type'] = 'application/json';
  }

  const res = await fetch(API_BASE + path, options);
  if(res.status === 401 || res.status === 403){
    const data = await res.json().catch(function(){ return {}; });
    throw new Error(data.message || 'Not allowed. Please log in as admin.');
  }
  return res;
}

function escapeHtml(str){
  return String(str == null ? '' : str).replace(/[&<>"']/g, function(c){
    return { '&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;', "'":'&#39;' }[c];
  });
}