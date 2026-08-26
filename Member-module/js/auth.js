/* Session handling — replaces AuthContext.
   "Remember me" stores the token in localStorage (survives closing the
   browser); otherwise sessionStorage (clears when the tab closes). */
(function () {
  function readUser() {
    try {
      var raw = localStorage.getItem('gym_user') || sessionStorage.getItem('gym_user');
      return raw ? JSON.parse(raw) : null;
    } catch (e) {
      return null;
    }
  }

  var Auth = {
    getUser: readUser,
    getToken: function () {
      return localStorage.getItem('gym_token') || sessionStorage.getItem('gym_token');
    },
    isAuthenticated: function () {
      return Boolean(Auth.getToken());
    },
    login: async function (email, password, rememberMe) {
      var data = await window.API.login(email, password);
      var storage = rememberMe ? localStorage : sessionStorage;
      storage.setItem('gym_token', data.token);
      storage.setItem('gym_user', JSON.stringify(data.user));
      return data.user;
    },
    register: async function (payload) {
      // Members always self-register as 'member' — admin accounts are
      // provisioned separately, not through this public sign-up form.
      await window.API.register({
        full_name: payload.full_name,
        email: payload.email,
        password: payload.password,
        role: 'member'
      });
      return Auth.login(payload.email, payload.password, true);
    },
    logout: function () {
      ['gym_token', 'gym_user', 'gym_member_id'].forEach(function (key) {
        localStorage.removeItem(key);
        sessionStorage.removeItem(key);
      });
      window.location.href = 'login.html';
    }
  };

  window.Auth = Auth;
})();
