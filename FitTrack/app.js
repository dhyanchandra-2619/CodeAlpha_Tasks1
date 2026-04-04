/* ─── FitTrack App Logic ─── */

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const STORAGE_KEY = 'fittrack_v2';
const GOALS_KEY   = 'fittrack_goals_v2';

let selectedType = 'Running';
let selectedIcon = '🏃';

/* ── Storage helpers ── */
function getStorage() {
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]'); }
  catch { return []; }
}
function setStorage(d) {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(d)); } catch {}
}

function getGoals() {
  const def = { steps: 10000, cal: 500, time: 60, water: 2000 };
  try { return Object.assign(def, JSON.parse(localStorage.getItem(GOALS_KEY) || '{}')); }
  catch { return def; }
}
function setGoals(g) {
  try { localStorage.setItem(GOALS_KEY, JSON.stringify(g)); } catch {}
}

/* ── Date helpers ── */
function todayStr() { return new Date().toISOString().slice(0, 10); }

function weekDays() {
  const days = [];
  const now = new Date();
  for (let i = 6; i >= 0; i--) {
    const d = new Date(now);
    d.setDate(d.getDate() - i);
    days.push(d.toISOString().slice(0, 10));
  }
  return days;
}

function formatDate(d) {
  const dt = new Date(d + 'T00:00:00');
  return DAYS[dt.getDay()] + ' ' + dt.getDate() + '/' + (dt.getMonth() + 1);
}

function sumByDate(logs, date, field) {
  return logs.filter(l => l.date === date).reduce((a, b) => a + (b[field] || 0), 0);
}

function pct(val, goal) { return Math.min(100, Math.round(val / goal * 100)); }

/* ── Navigation ── */
function switchTab(tab, btn) {
  document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
  document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
  document.getElementById('screen-' + tab).classList.add('active');
  btn.classList.add('active');
  if (tab === 'history') refreshHistory();
  if (tab === 'goals') refreshGoals();
  if (tab === 'dashboard') refreshDashboard();
}

/* ── Activity type selector ── */
function selectType(btn, type, icon) {
  document.querySelectorAll('.type-btn').forEach(b => b.classList.remove('selected'));
  btn.classList.add('selected');
  selectedType = type;
  selectedIcon = icon;
}

/* ── Log Activity ── */
function logActivity() {
  const dur    = parseInt(document.getElementById('inp-duration').value)  || 0;
  const cal    = parseInt(document.getElementById('inp-calories').value)  || 0;
  const steps  = parseInt(document.getElementById('inp-steps').value)     || 0;
  const water  = parseInt(document.getElementById('inp-water').value)     || 0;
  const notes  = document.getElementById('inp-notes').value.trim();
  const errEl  = document.getElementById('log-err');
  const okEl   = document.getElementById('log-ok');

  if (!dur && !cal) {
    errEl.style.display = 'block';
    errEl.textContent   = '⚠ Enter at least a duration or calories burned.';
    return;
  }

  errEl.style.display = 'none';

  const logs = getStorage();
  logs.unshift({
    id: Date.now(),
    date: todayStr(),
    type: selectedType,
    icon: selectedIcon,
    dur, cal, steps, water, notes,
  });
  setStorage(logs);

  ['inp-duration', 'inp-calories', 'inp-steps', 'inp-water', 'inp-notes'].forEach(id => {
    document.getElementById(id).value = '';
  });

  okEl.style.display = 'block';
  setTimeout(() => { okEl.style.display = 'none'; }, 2800);

  refreshDashboard();
}

/* ── Delete log entry ── */
function deleteLog(id) {
  setStorage(getStorage().filter(l => l.id !== id));
  refreshHistory();
  refreshDashboard();
}

/* ── Save goals ── */
function saveGoals() {
  setGoals({
    steps: parseInt(document.getElementById('g-steps').value) || 10000,
    cal:   parseInt(document.getElementById('g-cal').value)   || 500,
    time:  parseInt(document.getElementById('g-time').value)  || 60,
    water: parseInt(document.getElementById('g-water').value) || 2000,
  });
  const msg = document.getElementById('goals-msg');
  msg.style.display = 'block';
  setTimeout(() => { msg.style.display = 'none'; }, 2200);
  refreshDashboard();
}

/* ── Render week bar chart ── */
function renderWeekBars(barsId, labelsId, field, color) {
  const logs   = getStorage();
  const days   = weekDays();
  const today  = todayStr();
  const vals   = days.map(d => sumByDate(logs, d, field));
  const maxVal = Math.max(...vals, 1);

  const barsEl   = document.getElementById(barsId);
  const labelsEl = document.getElementById(labelsId);
  barsEl.innerHTML   = '';
  labelsEl.innerHTML = '';

  days.forEach((d, i) => {
    const h       = Math.round((vals[i] / maxVal) * 100);
    const isToday = d === today;
    const dt      = new Date(d + 'T00:00:00');

    const col = document.createElement('div');
    col.className = 'week-col';
    col.innerHTML = `
      <div class="week-bar-wrap">
        <div class="week-bar ${isToday ? 'today' : ''}"
             style="height:${h}%; background:${color}; opacity:${isToday ? 1 : 0.32};">
        </div>
      </div>
      <div class="week-val">${vals[i] ? vals[i].toLocaleString() : ''}</div>`;
    barsEl.appendChild(col);

    const lbl = document.createElement('div');
    lbl.className = 'week-label-item' + (isToday ? ' today' : '');
    lbl.textContent = DAYS[dt.getDay()].toUpperCase().slice(0, 2);
    labelsEl.appendChild(lbl);
  });
}

/* ── Dashboard ── */
function refreshDashboard() {
  const logs    = getStorage();
  const goals   = getGoals();
  const today   = todayStr();

  const todaySteps = sumByDate(logs, today, 'steps');
  const todayCal   = sumByDate(logs, today, 'cal');
  const todayTime  = sumByDate(logs, today, 'dur');
  const todayWater = sumByDate(logs, today, 'water');

  // Metric cards
  document.getElementById('d-steps').textContent = todaySteps.toLocaleString();
  document.getElementById('d-cal').textContent   = todayCal.toLocaleString();
  document.getElementById('d-time').textContent  = todayTime;
  document.getElementById('d-water').textContent = todayWater;

  // Percent sub-labels
  function setPct(id, val, goal) {
    const p = pct(val, goal);
    document.getElementById(id).innerHTML = `<span>${p}%</span> of daily goal`;
  }
  setPct('d-steps-pct', todaySteps, goals.steps);
  setPct('d-cal-pct',   todayCal,   goals.cal);
  setPct('d-time-pct',  todayTime,  goals.time);
  setPct('d-water-pct', todayWater, goals.water);

  // Progress bars
  function setBar(barId, txtId, pctId, val, goal, unit) {
    const p = pct(val, goal);
    document.getElementById(barId).style.width = p + '%';
    document.getElementById(txtId).textContent = val.toLocaleString() + ' / ' + goal.toLocaleString() + ' ' + unit;
    document.getElementById(pctId).textContent = p + '%';
  }
  setBar('prog-steps', 'prog-steps-txt', 'prog-steps-pct', todaySteps, goals.steps, 'steps');
  setBar('prog-cal',   'prog-cal-txt',   'prog-cal-pct',   todayCal,   goals.cal,   'kcal');
  setBar('prog-time',  'prog-time-txt',  'prog-time-pct',  todayTime,  goals.time,  'min');
  setBar('prog-water', 'prog-water-txt', 'prog-water-pct', todayWater, goals.water, 'ml');

  // Weekly total stats
  const days     = weekDays();
  const weekCal  = days.reduce((a, d) => a + sumByDate(logs, d, 'cal'), 0);
  const weekTime = days.reduce((a, d) => a + sumByDate(logs, d, 'dur'), 0);
  const activeDays = days.filter(d => logs.some(l => l.date === d)).length;

  document.getElementById('stat-week-cal').textContent  = weekCal.toLocaleString();
  document.getElementById('stat-week-time').textContent = weekTime;
  document.getElementById('stat-active-days').textContent = activeDays;

  // Week chart
  renderWeekBars('week-bars', 'week-labels', 'cal', '#b5f23a');

  // Streak dots
  const streakEl = document.getElementById('streak-dots');
  streakEl.innerHTML = '';
  let count = 0;
  days.forEach(d => {
    const had    = logs.some(l => l.date === d);
    const isToday = d === today;
    const dt     = new Date(d + 'T00:00:00');
    const dot    = document.createElement('div');
    dot.className = 'streak-dot' + (had ? ' done' : '') + (isToday ? ' today-dot' : '');
    dot.title    = d;
    dot.textContent = DAYS[dt.getDay()].slice(0, 2).toUpperCase();
    streakEl.appendChild(dot);
    if (had) count++;
  });

  document.getElementById('streak-text').textContent =
    count >= 6 ? '🔥 Crushing it! ' + count + '/7 days active' :
    count >= 4 ? '⚡ Great streak — ' + count + '/7 days active' :
    count >= 2 ? count + '/7 days active this week' :
    'Start logging to build your streak!';

  // Header streak badge
  const badge = document.getElementById('streak-badge');
  if (count >= 3) {
    badge.innerHTML = (count >= 5 ? '🔥' : '⚡') + ' ' + count + ' day streak';
    badge.classList.remove('hidden');
  } else {
    badge.classList.add('hidden');
  }
}

/* ── History ── */
function refreshHistory() {
  const logs = getStorage();
  const el   = document.getElementById('history-list');

  if (!logs.length) {
    el.innerHTML = `
      <div class="empty-state">
        <span class="empty-icon">🏁</span>
        No activities logged yet.<br>Head to <strong style="color:var(--neon)">Log Activity</strong> to get started!
      </div>`;
    return;
  }

  el.innerHTML = logs.slice(0, 60).map(l => `
    <div class="log-item">
      <div class="log-icon">${l.icon || '🏃'}</div>
      <div class="log-info">
        <div class="log-title">${l.type}</div>
        <div class="log-meta">${formatDate(l.date)} &nbsp;·&nbsp; ${l.dur || 0} min &nbsp;·&nbsp; ${(l.steps || 0).toLocaleString()} steps &nbsp;·&nbsp; ${l.water || 0} ml</div>
        ${l.notes ? `<div class="log-notes">"${l.notes}"</div>` : ''}
      </div>
      <div class="log-right">
        <div class="log-cal">${(l.cal || 0).toLocaleString()}</div>
        <div class="log-cal-unit">kcal</div>
        <button class="log-del" onclick="deleteLog(${l.id})">✕</button>
      </div>
    </div>
  `).join('');
}

/* ── Goals ── */
function refreshGoals() {
  const g = getGoals();
  document.getElementById('g-steps').value = g.steps;
  document.getElementById('g-cal').value   = g.cal;
  document.getElementById('g-time').value  = g.time;
  document.getElementById('g-water').value = g.water;

  renderWeekBars('week-bars-time', 'week-labels-time', 'dur', '#38bdf8');
}

/* ── Init ── */
function init() {
  const now = new Date();
  document.getElementById('today-label').textContent =
    now.toLocaleDateString('en-US', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });

  refreshDashboard();
  refreshHistory();
  refreshGoals();
}

document.addEventListener('DOMContentLoaded', init);
