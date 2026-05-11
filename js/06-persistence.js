/**
 * 06-persistence.js — Sauvegarde et chargement (layout, données, fond)
 * Dépend de : 01-model.js, 02-render.js
 */

// ═══════════════════════════════════════════
//  FOND D'ÉCRAN
// ═══════════════════════════════════════════

function importBackground(input) {
  const file = input.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = e => {
    const dataUrl = e.target.result;
    el('sheet-img').src = dataUrl;
    try {
      localStorage.setItem('fiche-bg', dataUrl);
      showStatus('Fond importé et sauvegardé ✓');
    } catch {
      // Image trop grande pour localStorage (> ~5 Mo)
      showStatus('Fond chargé (trop grand pour persister — copier le fichier à côté du HTML)');
    }
  };
  reader.readAsDataURL(file);
  input.value = '';
}

// ═══════════════════════════════════════════
//  LAYOUT (structure des contrôles)
// ═══════════════════════════════════════════

function saveLayout() {
  localStorage.setItem('fiche-layout', JSON.stringify({ controls, uid: _uid }));
}

function loadLayout() {
  const raw = localStorage.getItem('fiche-layout');
  if (!raw) return false;
  const d = JSON.parse(raw);
  controls = d.controls || [];
  _uid     = d.uid || (controls.length + 1);
  return true;
}

function exportSheet() {
  const blob = new Blob(
    [JSON.stringify({ version: 1, layout: { controls, uid: _uid }, data: gatherData() }, null, 2)],
    { type: 'application/json' }
  );
  const a = document.createElement('a');
  a.href     = URL.createObjectURL(blob);
  a.download = 'fiche-personnage.json';
  a.click();
  showStatus('Exporté ✓');
}

function importSheet(input) {
  const file = input.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = e => {
    try {
      const d = JSON.parse(e.target.result);
      if (d.version) {
        controls = (d.layout && d.layout.controls) || [];
        _uid     = (d.layout && d.layout.uid) || (controls.length + 1);
        saveLayout();
        renderAll();
        if (d.data) _applyData(d.data);
      } else {
        controls = d.controls || [];
        _uid     = d.uid || (controls.length + 1);
        saveLayout();
        renderAll();
      }
      showStatus('Importé ✓');
    } catch {
      showStatus('Erreur JSON ✗');
    }
  };
  reader.readAsText(file);
  input.value = '';
}

// ═══════════════════════════════════════════
//  DONNÉES (valeurs des champs)
// ═══════════════════════════════════════════

function gatherData() {
  const d = {};
  controls.forEach(c => {
    d[c.id] = isCb(c) ? c.checked : c.value;
  });
  return d;
}

function _applyData(d) {
  controls.forEach(c => {
    const v = d[c.id];
    if (v === undefined) return;
    if (isCb(c)) {
      c.checked = !!v;
    } else {
      c.value = v || '';
    }
    const w = ctrlEl(c.id);
    if (!w) return;
    const inp = w.querySelector('input[type="text"], input[type="number"]');
    if (inp) inp.value = c.value;
    const cb = w.querySelector('.ctrl-cb');
    if (cb) cb.classList.toggle('checked', c.checked);
  });
}

function autoSave() {
  localStorage.setItem('fiche-data', JSON.stringify(gatherData()));
}

function saveSheet() {
  autoSave();
  showStatus('Sauvegardé ✓');
}

function loadSheet() {
  const raw = localStorage.getItem('fiche-data');
  if (!raw) { showStatus('Aucune sauvegarde.'); return; }
  _applyData(JSON.parse(raw));
  showStatus('Chargé ✓');
}

function resetValues() {
  if (!confirm('Réinitialiser tous les champs ?')) return;

  controls.forEach(c => {
    c.value   = '';
    c.checked = false;
    const w = ctrlEl(c.id);
    if (!w) return;
    const inp = w.querySelector('input[type="text"], input[type="number"]');
    if (inp) inp.value = '';
    const cb = w.querySelector('.ctrl-cb');
    if (cb) cb.classList.remove('checked');
  });

  localStorage.removeItem('fiche-data');
  showStatus('Réinitialisé ✓');
}

// ═══════════════════════════════════════════
//  STATUT
// ═══════════════════════════════════════════

function showStatus(msg) {
  el('status').textContent = msg;
  setTimeout(() => el('status').textContent = '', 3000);
}
