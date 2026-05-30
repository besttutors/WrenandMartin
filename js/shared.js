/* ── Wren & Martin Grammar Portal — Shared JS ── */

// ── Auth Guard ────────────────────────────────────────────────────────────────
function requireRole(role) {
  const r = sessionStorage.getItem('wm_role');
  const u = sessionStorage.getItem('wm_user');
  if (!r || !u || r !== role) {
    window.location.href = '../index.html';
    return null;
  }
  return u;
}

function logout() {
  sessionStorage.removeItem('wm_role');
  sessionStorage.removeItem('wm_user');
  // Go up one level to index
  const depth = window.location.pathname.split('/').length - 2;
  const prefix = depth > 1 ? '../'.repeat(depth - 1) : '';
  window.location.href = prefix + '../index.html';
}

// ── Toggle Q&A ────────────────────────────────────────────────────────────────
function t(row) {
  var p = row.nextElementSibling, b = row.querySelector('.tb');
  var o = p.classList.toggle('o');
  b.textContent = o ? '▴' : '▾';
  b.classList.toggle('o', o);
}

function sa(id) {
  var c = document.getElementById('qa-' + id); if (!c) return;
  c.querySelectorAll('.ap').forEach(function(p) { p.classList.add('o'); });
  c.querySelectorAll('.tb').forEach(function(b) { b.textContent = '▴'; b.classList.add('o'); });
}

function ha(id) {
  var c = document.getElementById('qa-' + id); if (!c) return;
  c.querySelectorAll('.ap').forEach(function(p) { p.classList.remove('o'); });
  c.querySelectorAll('.tb').forEach(function(b) { b.textContent = '▾'; b.classList.remove('o'); });
}

// ── Search ────────────────────────────────────────────────────────────────────
function ds(q) {
  q = q.trim().toLowerCase();
  document.querySelectorAll('.qi').forEach(function(el) {
    el.classList.toggle('hidden', !!q && !el.dataset.s.includes(q));
  });
  document.querySelectorAll('.hs').forEach(function(s) {
    var v = s.querySelectorAll('.qi:not(.hidden)').length;
    s.classList.toggle('hidden-sec', !!q && v === 0);
  });
}

// ── Progress bar & Back to Top ────────────────────────────────────────────────
window.addEventListener('scroll', function() {
  var s = document.documentElement;
  var prog = document.getElementById('prog');
  var btt  = document.getElementById('btt');
  if (prog) prog.style.width = (s.scrollTop / (s.scrollHeight - s.clientHeight) * 100) + '%';
  if (btt)  btt.style.display = s.scrollTop > 400 ? 'flex' : 'none';
});

// ── Render exercises from WM_DATA ─────────────────────────────────────────────
function renderExercises(data, container, startHW, endHW) {
  if (!container) return;
  container.innerHTML = '';

  data.forEach(function(sec) {
    if (sec.num < startHW || sec.num > endHW) return;

    var section = document.createElement('section');
    section.className = 'hs';
    section.id = sec.id;

    var qHTML = '';
    sec.questions.forEach(function(q) {
      var ds_val = (q.q + ' ' + q.a).toLowerCase().replace(/"/g, '&quot;');
      qHTML += '<div class="qi" data-s="' + ds_val + '">' +
        '<div class="qr" onclick="t(this)">' +
        '<span class="qn">' + q.n + '</span>' +
        '<span class="qt">' + escH(q.q) + '</span>' +
        '<span class="tb">▾</span>' +
        '</div>' +
        '<div class="ap">' +
        '<div class="ab"><div class="al">✓ Answer</div><div class="at">' + escH(q.a) + '</div></div>' +
        '<div class="rb"><div class="rl">⚡ Reason</div><div class="rt">' + escH(q.r) + '</div></div>' +
        '</div></div>';
    });

    section.innerHTML =
      '<div class="hh">' +
        '<span class="hb">' + escH(sec.hw) + '</span>' +
        '<div><div class="ht">' + escH(sec.title) + '</div>' +
        '<div class="hu">' + sec.questions.length + ' questions</div></div>' +
      '</div>' +
      (sec.instruction ? '<div class="ins">' + escH(sec.instruction) + '</div>' : '') +
      '<div class="sc">' +
        '<button class="bs bsh" onclick="sa(\'' + sec.id + '\')">Show All</button>' +
        '<button class="bs bsh2" onclick="ha(\'' + sec.id + '\')">Hide All</button>' +
      '</div>' +
      '<div id="qa-' + sec.id + '">' + qHTML + '</div>';

    container.appendChild(section);
  });
}

function escH(str) {
  return String(str || '').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}

// ── Track student progress ─────────────────────────────────────────────────────
function markSeen(hwId) {
  var seen = JSON.parse(localStorage.getItem('wm_seen') || '{}');
  seen[hwId] = (seen[hwId] || 0) + 1;
  localStorage.setItem('wm_seen', JSON.stringify(seen));
}

function getProgress() {
  return JSON.parse(localStorage.getItem('wm_seen') || '{}');
}
