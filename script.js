/* Simple attendance JS: load sample, toggle, save to localStorage, export CSV, clear */
const SAMPLE = [
  { roll: '101', name: 'Alice' },
  { roll: '102', name: 'Bob' },
  { roll: '103', name: 'Charlie' },
  { roll: '104', name: 'Deepa' },
  { roll: '105', name: 'Ethan' }
];

function getTableBody() {
  return document.querySelector("#attendanceTable tbody");
}

function renderRows(students = SAMPLE, saved = null){
  const tbody = getTableBody();
  tbody.innerHTML = "";
  const fromStorage = saved || JSON.parse(localStorage.getItem('attendance')) || {};
  students.forEach((s, i) => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${s.roll}</td>
      <td>${s.name}</td>
      <td style="text-align:center">
        <label style="display:inline-flex;align-items:center;gap:8px">
          <input data-roll="${s.roll}" class="att-checkbox" type="checkbox" ${fromStorage[s.roll] ? 'checked' : ''}>
        </label>
      </td>
    `;
    tbody.appendChild(tr);
  });
}

function loadSample() {
  renderRows(SAMPLE);
}

function saveAttendance() {
  const boxes = document.querySelectorAll('.att-checkbox');
  const data = {};
  boxes.forEach(b => data[b.dataset.roll] = b.checked);
  localStorage.setItem('attendance', JSON.stringify(data));
  alert("Attendance saved locally!");
}

function loadSaved() {
  const saved = JSON.parse(localStorage.getItem('attendance') || '{}');
  // map saved into boolean for renderRows
  renderRows(SAMPLE, saved);
}

function clearAttendance() {
  if(confirm("Clear saved attendance?")) {
    localStorage.removeItem('attendance');
    loadSample();
  }
}

function exportCSV() {
  const rows = [['Roll No','Name','Present']];
  document.querySelectorAll('#attendanceTable tbody tr').forEach(tr => {
    const cols = tr.querySelectorAll('td');
    const roll = cols[0].textContent.trim();
    const name = cols[1].textContent.trim();
    const presentCheckbox = tr.querySelector('.att-checkbox');
    const present = presentCheckbox && presentCheckbox.checked ? 'Present' : 'Absent';
    rows.push([roll, name, present]);
  });
  const csv = rows.map(r => r.map(c => `"${c.replace(/"/g,'""')}"`).join(',')).join('\n');
  const blob = new Blob([csv], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'attendance.csv';
  a.click();
  URL.revokeObjectURL(url);
}

/* attach handlers if DOM present */
document.addEventListener('DOMContentLoaded', () => {
  const tb = document.querySelector('#attendanceTable tbody');
  if(tb){
    // initial render: try saved else sample
    const saved = JSON.parse(localStorage.getItem('attendance') || 'null');
    if(saved) renderRows(SAMPLE, saved);
    else loadSample();
  }

  const loadBtn = document.getElementById('loadSample');
  if(loadBtn) loadBtn.addEventListener('click', loadSample);

  const saveBtn = document.getElementById('saveBtn');
  if(saveBtn) saveBtn.addEventListener('click', saveAttendance);

  const clearBtn = document.getElementById('clearBtn');
  if(clearBtn) clearBtn.addEventListener('click', clearAttendance);

  const exportBtn = document.getElementById('exportBtn');
  if(exportBtn) exportBtn.addEventListener('click', exportCSV);
});
