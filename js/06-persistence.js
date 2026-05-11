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
    _persistBg(dataUrl, file.name);
  };
  reader.readAsDataURL(file);
  input.value = '';
}

function _persistBg(dataUrl, filename) {
  // Tentative 1 : stockage direct
  try {
    localStorage.setItem('fiche-bg', dataUrl);
    localStorage.removeItem('fiche-bg-name');
    _hideBgNotice();
    showStatus('Fond importé et sauvegardé ✓');
    return;
  } catch {}

  // Tentative 2 : compression JPEG progressive via canvas
  const img = new Image();
  img.onload = () => {
    const canvas = document.createElement('canvas');
    canvas.width  = img.naturalWidth;
    canvas.height = img.naturalHeight;
    canvas.getContext('2d').drawImage(img, 0, 0);
    for (const q of [0.8, 0.6, 0.4, 0.2]) {
      const compressed = canvas.toDataURL('image/jpeg', q);
      try {
        localStorage.setItem('fiche-bg', compressed);
        localStorage.removeItem('fiche-bg-name');
        _hideBgNotice();
        showStatus(`Fond sauvegardé (qualité réduite à ${Math.round(q * 100)} %) ✓`);
        return;
      } catch {}
    }
    // Toujours trop grand : retenir le nom du fichier pour l'invite
    try { localStorage.setItem('fiche-bg-name', filename); } catch {}
    _showBgNotice(filename);
    showStatus('Fond chargé pour cette session uniquement');
  };
  img.src = dataUrl;
}

function _showBgNotice(name) {
  const n = el('bg-notice');
  if (n) { n.textContent = `⚠ Fond non persisté ("${name}") — cliquer sur 🖼`; n.style.display = 'inline'; }
}

function _hideBgNotice() {
  const n = el('bg-notice');
  if (n) { n.style.display = 'none'; n.textContent = ''; }
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
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(a.href);
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
      if (edMode) exitEditor();
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
