/**
 * 02-render.js — Construction et mise à jour des contrôles dans le DOM
 * Dépend de : 01-model.js
 * Les références à startDrag, startRotate, selectCtrl, autoSave sont des
 * globals résolus à l'exécution (dans des closures d'event listeners).
 */

// ── Rendu complet ──
function renderAll() {
  el('overlay').innerHTML = '';
  controls.forEach(renderCtrl);
}

// ── Rendu d'un contrôle ──
function renderCtrl(c) {
  const wrap = document.createElement('div');
  wrap.id        = 'ctrl-' + c.id;
  wrap.className = 'ctrl-wrap' + (c.id === selId ? ' sel' : '');
  applyGeom(wrap, c);

  // Contenu selon le type
  let inner;
  if (c.type === 'text' || c.type === 'number') {
    inner = document.createElement('input');
    inner.type  = c.type;
    inner.value = c.value || '';
    applyStyle(inner, c);
    if (!edMode) {
      inner.addEventListener('input', () => { c.value = inner.value; autoSave(); });
    }
  } else {
    inner = document.createElement('div');
    inner.className = 'ctrl-cb' + (c.checked ? ' checked' : '');
    inner.style.color = c.color || '#1a0e00';
    if (!edMode) {
      inner.addEventListener('click', () => {
        c.checked = !c.checked;
        inner.classList.toggle('checked', c.checked);
        autoSave();
      });
    }
  }
  wrap.appendChild(inner);

  // Éléments éditeur (toujours créés, visibles via CSS en mode editor)
  const lbl = document.createElement('div');
  lbl.className   = 'ctrl-label';
  lbl.textContent = c.name || c.id;
  wrap.appendChild(lbl);

  const line = document.createElement('div');
  line.className = 'rot-line';
  wrap.appendChild(line);

  const rotH = document.createElement('div');
  rotH.className   = 'rot-handle';
  rotH.textContent = '↻';
  rotH.title       = 'Glisser pour tourner';
  wrap.appendChild(rotH);

  // Interactions éditeur
  if (edMode) {
    wrap.addEventListener('mousedown', e => {
      if (e.target === rotH) return;
      e.preventDefault();
      selectCtrl(c.id);
      startDrag(e, c, wrap);
    });
    rotH.addEventListener('mousedown', e => {
      e.preventDefault();
      e.stopPropagation();
      startRotate(e, c, wrap);
    });
  }

  el('overlay').appendChild(wrap);
}

// ── Géométrie (position / taille / rotation) ──
function applyGeom(wrap, c) {
  wrap.style.left   = c.left   + '%';
  wrap.style.top    = c.top    + '%';
  wrap.style.width  = c.width  + '%';
  wrap.style.height = c.height + '%';
  const base = c.type === 'cb-di' ? 45 : 0;
  const deg  = base + (c.rotation || 0);
  wrap.style.transform = deg ? `rotate(${deg}deg)` : '';
}

// ── Style texte ──
function applyStyle(input, c) {
  input.style.fontSize   = (c.fontSize || 1.1) + 'vw';
  input.style.color      = c.color || '#1a0e00';
  input.style.textAlign  = c.type === 'number' ? 'center' : 'left';
  input.style.fontWeight = c.bold ? '600' : '400';
}

// ── Mise à jour partielle (sans recréer le DOM) ──
function refreshCtrl(c) {
  const wrap = ctrlEl(c.id);
  if (!wrap) return;

  applyGeom(wrap, c);

  const input = wrap.querySelector('input');
  if (input) applyStyle(input, c);

  const cb = wrap.querySelector('.ctrl-cb');
  if (cb) cb.style.color = c.color || '#1a0e00';

  const lbl = wrap.querySelector('.ctrl-label');
  if (lbl) lbl.textContent = c.name || c.id;
}
