
(function () {
  const pills = Array.from(document.querySelectorAll('.report-type-pill'));
  const chartTitle = document.querySelector('.chart-panel .panel-heading');
  const chart = document.querySelector('.bar-chart');
  const tableTitle = document.querySelectorAll('.panel-heading')[1];
  const tableHead = document.querySelector('.reports-data-table thead');
  const tableBody = document.querySelector('.reports-data-table tbody');
  const pdfButton = document.getElementById('exportPdf');
  const csvButton = document.getElementById('exportCsv');

  let currentReport = 'growth';
  let reportRows = [];
  let chartRows = [];

  const reportNames = {
    growth: 'Membership Growth',
    revenue: 'Revenue Summary',
    attendance: 'Attendance Trends',
    trainer: 'Trainer Performance'
  };

  function formatMoney(value) {
    return 'Rs ' + Number(value || 0).toLocaleString('en-LK', {
      maximumFractionDigits: 2
    });
  }

  function formatDate(value) {
    if (!value) return 'N/A';
    return String(value).slice(0, 10);
  }

  async function getJson(path) {
    const response = await apiFetch(path);
    if (!response.ok) {
      throw new Error('Could not load ' + path + ' (HTTP ' + response.status + ')');
    }
    return response.json();
  }

  function showMessage(message) {
    tableBody.innerHTML = '';
    const row = document.createElement('tr');
    const cell = document.createElement('td');
    cell.colSpan = 4;
    cell.textContent = message;
    row.appendChild(cell);
    tableBody.appendChild(row);
  }

  function renderTable(headers, rows) {
    tableHead.innerHTML =
      '<tr>' + headers.map(function (h) {
        return '<th>' + escapeHtml(h) + '</th>';
      }).join('') + '</tr>';

    tableBody.innerHTML = '';

    if (!rows.length) {
      showMessage('No records available for this report.');
      return;
    }

    rows.forEach(function (record) {
      const tr = document.createElement('tr');

      record.forEach(function (value) {
        const td = document.createElement('td');
        td.textContent = value == null ? 'N/A' : String(value);
        tr.appendChild(td);
      });

      tableBody.appendChild(tr);
    });
  }

  function renderChart(title, items) {
    chartTitle.textContent = title;
    chart.innerHTML = '';

    if (!items.length) {
      chart.textContent = 'No data available for this chart.';
      return;
    }

    const maxValue = Math.max(1, ...items.map(function (item) {
      return Number(item.value) || 0;
    }));

    items.forEach(function (item) {
      const column = document.createElement('div');
      column.className = 'bar-col';

      const bar = document.createElement('div');
      bar.className = 'bar';
      const value = Math.max(0, Number(item.value) || 0);
      bar.style.height = Math.max(3, value / maxValue * 100) + '%';
      bar.title = item.label + ': ' + value;

      const label = document.createElement('div');
      label.className = 'bar-label';
      label.textContent = item.label;

      column.appendChild(bar);
      column.appendChild(label);
      chart.appendChild(column);
    });
  }

  async function loadGrowth() {
    const members = await getJson('/members');
    const validMembers = Array.isArray(members) ? members : [];

    const counts = {};
    validMembers.forEach(function (member) {
      const date = formatDate(member.membership_start);
      if (date !== 'N/A') {
        const month = date.slice(0, 7);
        counts[month] = (counts[month] || 0) + 1;
      }
    });

    const months = Object.keys(counts).sort().slice(-6);
    chartRows = months.map(function (month) {
      return { label: month, value: counts[month] };
    });

    reportRows = validMembers.map(function (member) {
      return [
        member.id,
        member.full_name,
        member.plan_name || 'N/A',
        member.status || 'N/A',
        formatDate(member.membership_start),
        formatDate(member.membership_end)
      ];
    });

    renderChart('Membership starts by month', chartRows);
    tableTitle.textContent = 'Membership Records';
    renderTable(
      ['Member ID', 'Member', 'Plan', 'Status', 'Start Date', 'End Date'],
      reportRows
    );
  }

  async function loadRevenue() {
    const rows = await getJson('/payments/report');
    const payments = Array.isArray(rows) ? rows : [];

    reportRows = payments.map(function (payment) {
      return [
        payment.full_name,
        formatMoney(payment.total_paid),
        payment.transactions
      ];
    });

    chartRows = payments.slice(0, 6).map(function (payment) {
      return {
        label: String(payment.full_name || 'Member').slice(0, 12),
        value: Number(payment.total_paid) || 0
      };
    });

    renderChart('Total paid by member (top 6)', chartRows);
    tableTitle.textContent = 'Payment Summary by Member';
    renderTable(['Member', 'Total Paid', 'Transactions'], reportRows);
  }

  async function loadAttendance() {
    const rows = await getJson('/attendance/report');
    const attendance = Array.isArray(rows) ? rows : [];
    const counts = {};

    attendance.forEach(function (record) {
      const date = formatDate(record.check_in_date);
      counts[date] = (counts[date] || 0) + 1;
    });

    const dates = Object.keys(counts).sort().slice(-6);
    chartRows = dates.map(function (date) {
      return { label: date, value: counts[date] };
    });

    reportRows = attendance.map(function (record) {
      return [
        record.member_id,
        record.full_name,
        formatDate(record.check_in_date),
        record.check_in_time || 'N/A'
      ];
    });

    renderChart('Check-ins by date (latest records)', chartRows);
    tableTitle.textContent = 'Attendance Records (latest 100)';
    renderTable(['Member ID', 'Member', 'Date', 'Check-in Time'], reportRows);
  }

  async function loadTrainer() {
    const results = await Promise.all([
      getJson('/trainers'),
      getJson('/classes')
    ]);

    const trainers = Array.isArray(results[0]) ? results[0] : [];
    const classes = Array.isArray(results[1]) ? results[1] : [];

    reportRows = trainers.map(function (trainer) {
      const trainerClasses = classes.filter(function (item) {
        return String(item.trainer_id) === String(trainer.id);
      });

      const bookings = trainerClasses.reduce(function (sum, item) {
        return sum + (Number(item.booked_count) || 0);
      }, 0);

      return [
        trainer.id,
        trainer.full_name,
        trainer.specialization || 'N/A',
        trainerClasses.length,
        bookings,
        Number(trainer.members_count) || 0
      ];
    });

    chartRows = reportRows.slice(0, 6).map(function (row) {
      return { label: String(row[1] || 'Trainer').slice(0, 12), value: row[4] };
    });

    renderChart('Class bookings by trainer', chartRows);
    tableTitle.textContent = 'Trainer and Class Summary';
    renderTable(
      ['Trainer ID', 'Trainer', 'Specialization', 'Classes', 'Bookings', 'Members'],
      reportRows
    );
  }

  async function loadReport(type) {
    currentReport = type;
    pills.forEach(function (pill) {
      pill.classList.toggle('active', pill.dataset.report === type);
    });

    showMessage('Loading report data...');
    chart.innerHTML = 'Loading chart...';

    try {
      if (type === 'growth') await loadGrowth();
      else if (type === 'revenue') await loadRevenue();
      else if (type === 'attendance') await loadAttendance();
      else if (type === 'trainer') await loadTrainer();
    } catch (error) {
      console.error('Report loading failed:', error);
      showMessage(error.message || 'Failed to load report data.');
      chart.textContent = 'Could not load chart data. Check login and backend.';
      reportRows = [];
      chartRows = [];
    }
  }

  
  function downloadFile(content, mimeType, filename) {
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');

    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    link.remove();

    // Give the browser time to start the download.
    setTimeout(function () {
      URL.revokeObjectURL(url);
    }, 1000);
  }

  function csvEscape(value) {
    const text = String(value == null ? '' : value);
    return '"' + text.replace(/"/g, '""') + '"';
  }

  function getReportHeaders() {
    if (currentReport === 'growth') {
      return [
        'Member ID', 'Member', 'Plan', 'Status',
        'Start Date', 'End Date'
      ];
    }

    if (currentReport === 'revenue') {
      return ['Member', 'Total Paid', 'Transactions'];
    }

    if (currentReport === 'attendance') {
      return ['Member ID', 'Member', 'Date', 'Check-in Time'];
    }

    return [
      'Trainer ID', 'Trainer', 'Specialization',
      'Classes', 'Bookings', 'Members'
    ];
  }

  csvButton.addEventListener('click', function (event) {
    event.preventDefault();

    if (!reportRows.length) {
      alert('No report data is available. Load a report first.');
      return;
    }

    const headers = getReportHeaders();

    const csv = [headers, ...reportRows]
      .map(function (row) {
        return row.map(csvEscape).join(',');
      })
      .join('\r\n');

    downloadFile(
      '\uFEFF' + csv,
      'text/csv;charset=utf-8;',
      currentReport + '-report.csv'
    );
  });

  pdfButton.addEventListener('click', function (event) {
    event.preventDefault();

    if (!reportRows.length) {
      alert('No report data is available. Load a report first.');
      return;
    }

    function pdfEscape(value) {
      return String(value)
        .replace(/\\/g, '\\\\')
        .replace(/\(/g, '\\(')
        .replace(/\)/g, '\\)')
        .replace(/[^\x20-\x7E]/g, '?');
    }

    // Prepare report content.
    const headers = getReportHeaders();

    const lines = [
      'RESET FITNESS CENTER',
      reportNames[currentReport],
      'Generated: ' + new Date().toLocaleString(),
      '',
      headers.join(' | '),
      ...reportRows.map(function (row) {
        return row.map(function (value) {
          return String(value == null ? '' : value);
        }).join(' | ');
      })
    ];

    // Wrap long lines so the content fits on the page.
    const wrappedLines = [];

    lines.forEach(function (line) {
      line = String(line);

      if (!line.length) {
        wrappedLines.push('');
        return;
      }

      while (line.length > 95) {
        wrappedLines.push(line.slice(0, 95));
        line = line.slice(95);
      }

      wrappedLines.push(line);
    });

    // Split the report into pages of 55 lines.
    const pageSize = 55;
    const pages = [];

    for (let i = 0; i < wrappedLines.length; i += pageSize) {
      pages.push(wrappedLines.slice(i, i + pageSize));
    }

    if (!pages.length) {
      pages.push(['No report data available.']);
    }

    // Create a multi-page PDF without an external library.
    const objects = [];
    const pageIds = [];

    objects.push({
      id: 1,
      body: '<< /Type /Catalog /Pages 2 0 R >>'
    });

    objects.push({
      id: 2,
      body: ''
    });

    objects.push({
      id: 3,
      body: '<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>'
    });

    pages.forEach(function (pageLines, pageIndex) {
      const pageId = 4 + pageIndex * 2;
      const streamId = pageId + 1;

      pageIds.push(pageId);

      const commands = [
        'BT',
        '/F1 9 Tf',
        '50 790 Td',
        '12 TL'
      ];

      pageLines.forEach(function (line, lineIndex) {
        if (lineIndex > 0) {
          commands.push('T*');
        }

        commands.push('(' + pdfEscape(line) + ') Tj');
      });

      commands.push('ET');

      const stream = commands.join('\n');

      objects.push({
        id: pageId,
        body:
          '<< /Type /Page /Parent 2 0 R ' +
          '/MediaBox [0 0 595 842] ' +
          '/Resources << /Font << /F1 3 0 R >> >> ' +
          '/Contents ' + streamId + ' 0 R >>'
      });

      objects.push({
        id: streamId,
        body:
          '<< /Length ' + stream.length + ' >>\n' +
          'stream\n' + stream + '\nendstream'
      });
    });

    objects[1].body =
      '<< /Type /Pages /Kids [' +
      pageIds.map(function (id) {
        return id + ' 0 R';
      }).join(' ') +
      '] /Count ' + pages.length + ' >>';

    // Build the PDF and its cross-reference table.
    objects.sort(function (a, b) {
      return a.id - b.id;
    });

    let pdf = '%PDF-1.4\n';
    const offsets = [0];

    objects.forEach(function (object) {
      offsets[object.id] = pdf.length;

      pdf += object.id + ' 0 obj\n' +
        object.body + '\nendobj\n';
    });

    const xrefOffset = pdf.length;
    const objectCount = objects.length + 1;

    pdf += 'xref\n0 ' + objectCount + '\n';
    pdf += '0000000000 65535 f \n';

    for (let id = 1; id < objectCount; id++) {
      pdf += String(offsets[id]).padStart(10, '0') +
        ' 00000 n \n';
    }

    pdf +=
      'trailer\n<< /Size ' + objectCount +
      ' /Root 1 0 R >>\n' +
      'startxref\n' + xrefOffset + '\n%%EOF';

    downloadFile(
      pdf,
      'application/pdf',
      currentReport + '-report.pdf'
    );
  });

  pills.forEach(function (pill) {
    pill.addEventListener('click', function () {
      loadReport(pill.dataset.report);
    });
  });

  loadReport('growth');
})();
