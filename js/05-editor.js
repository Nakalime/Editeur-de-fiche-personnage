/**
 * 05-editor.js — Gestion du mode éditeur : CRUD des contrôles, sélection
 * Dépend de : 01-model.js, 02-render.js, 04-props-panel.js, (06-persistence.js pour saveLayout)
 */

// ── Entrée / sortie du mode éditeur ──
function enterEditor() {
  edMode = true;
  selId  = null;
  document.body.classList.add('editor');
  el('tb-normal').style.display = 'none';
  el('tb-editor').style.display = 'flex';
  renderAll();
  showProps(null);
}

function exitEditor() {
  edMode = false;
  selId  = null;
  document.body.classList.remove('editor');
  el('tb-normal').style.display = 'flex';
  el('tb-editor').style.display = 'none';
  renderAll();
}

// ── Ajout d'un contrôle ──
function addCtrl(type) {
  const d = DEFS[type] || DEFS.text;
  const sw = el('sheet-wrapper');
  const ratio = sw.clientHeight > 0 ? sw.clientWidth / sw.clientHeight : 1;
  const h = isCb({ type }) ? +(d.w * ratio).toFixed(2) : d.h;
  const c = {
    id:       uid(),
    type,
    name:     type + '_' + _uid,
    left:     40,   top:    40,
    width:    d.w,  height: h,
    rotation: 0,
    fontSize: d.fs,
    color:    '#1a0e00',
    bold:     false,
    value:    '',
    checked:  false,
  };
  controls.push(c);
  renderCtrl(c);
  selectCtrl(c.id);
  saveLayout();
}

// ── Suppression ──
function deleteSel() {
  if (!selId) return;
  if (!confirm('Supprimer ce champ ?')) return;
  controls = controls.filter(c => c.id !== selId);
  const w = ctrlEl(selId);
  if (w) w.remove();
  selId = null;
  showProps(null);
  saveLayout();
}

// ── Duplication ──
function duplicateSel() {
  if (!selId) return;
  const orig = byId(selId);
  if (!orig) return;
  const copy = { ...orig, id: uid(), name: orig.name + '_copie', left: orig.left + 2, top: orig.top + 2 };
  controls.push(copy);
  renderCtrl(copy);
  selectCtrl(copy.id);
  saveLayout();
}

// ── Sélection ──
function selectCtrl(id) {
  if (selId) {
    const prev = ctrlEl(selId);
    if (prev) prev.classList.remove('sel');
  }
  selId = id;
  if (id) {
    const w = ctrlEl(id);
    if (w) w.classList.add('sel');
  }
  showProps(byId(id));
}

// ── Clic sur le fond de l'overlay → désélectionner ──
el('overlay').addEventListener('mousedown', e => {
  if (edMode && e.target === el('overlay')) selectCtrl(null);
});
