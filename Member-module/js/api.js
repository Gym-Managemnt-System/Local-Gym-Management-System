/* Tiny fetch wrapper that replaces axios.
   Adds the Authorization header on every request. */
(function () {
  function getToken() {
    return localStorage.getItem('gym_token') || sessionStorage.getItem('gym_token');
  }

  async function request(path, options) {
    var opts = options || {};
    var headers = { Accept: 'application/json' };
    if (opts.body !== undefined) headers['Content-Type'] = 'application/json';
    var token = getToken();
    if (token) headers.Authorization = 'Bearer ' + token;

    var res = await fetch(window.API_BASE + path, {
      method: opts.method || 'GET',
      headers: headers,
      body: opts.body !== undefined ? JSON.stringify(opts.body) : undefined
    });

    if (!res.ok) {
      var message = 'Request failed.';
      try {
        var data = await res.json();
        if (data && data.message) message = data.message;
      } catch (e) {
        /* non-JSON error body */
      }
      var err = new Error(message);
      err.status = res.status;
      throw err;
    }

    if (opts.raw) return res;
    if (res.status === 204) return null;
    return res.json();
  }

  window.API = {
    getToken: getToken,
    request: request,
    get: function (path) {
      return request(path);
    },
    post: function (path, body) {
      return request(path, { method: 'POST', body: body });
    },

    // ---- Auth ----
    login: function (email, password) {
      return request('/auth/login', { method: 'POST', body: { email: email, password: password } });
    },
    register: function (payload) {
      return request('/auth/register', { method: 'POST', body: payload });
    },

    // ---- Members ----
    getMyMember: function () {
      return request('/members/me');
    },

    // ---- Attendance ----
    checkIn: function (memberId) {
      return request('/attendance/checkin', { method: 'POST', body: { member_id: memberId } });
    },
    getMemberAttendance: function (memberId) {
      return request('/attendance/member/' + memberId);
    },

    // ---- Classes ----
    getClasses: function () {
      return request('/classes');
    },
    enrollInClass: function (memberId, classId) {
      return request('/classes/enroll', {
        method: 'POST',
        body: { member_id: memberId, class_id: classId }
      });
    },

    // ---- Payments ----
    getMemberPayments: function (memberId) {
      return request('/payments/member/' + memberId);
    },

    // ---- Reports ----
    downloadTransferReport: async function (memberId) {
      var res = await request('/reports/transfer/' + memberId, { raw: true });
      var blob = await res.blob();
      var url = window.URL.createObjectURL(new Blob([blob], { type: 'application/pdf' }));
      var link = document.createElement('a');
      link.href = url;
      link.download = 'transfer-report-' + memberId + '.pdf';
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    }
  };
})();
