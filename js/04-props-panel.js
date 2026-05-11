/**
 * 04-props-panel.js — Panneau de propriétés et raccourcis clavier
 * Dépend de : 01-model.js, 02-render.js, (05-editor.js pour selectCtrl, deleteSel, duplicateSel)
 */

// ── Affichage du panel ──
function showProps(c) {
  const body = el('props-body');
  if (!c) {
    body.innerHTML = '<div class="p-empty">Sélectionne un champ<br>pour éditer ses propriétés</div>';
    return;
  }

  body.innerHTML = `
    <div class="p-section">Identité</div>
    <div class="p-row"><label>Nom</label>
      <input id="p-name" type="text" value="${esc(c.name || '')}"></div>
    <div class="p-row"><label>Type</label>
      <select id="p-type">
        <option value="text"   ${c.type === 'text'   ? 'selected' : ''}>Texte</option>
        <option value="number" ${c.type === 'number' ? 'selected' : ''}>Nombre</option>
        <option value="cb-sq"  ${c.type === 'cb-sq'  ? 'selected' : ''}>Case □</option>
        <option value="cb-di"  ${c.type === 'cb-di'  ? 'selected' : ''}>Losange ◇</option>
      </select></div>

    <div class="p-section">Position &amp; Taille</div>
    <div class="p-row"><label>left</label>    <input id="p-left"     type="number" step="0.1"  value="${f(c.left)}">    <span class="unit">%</span></div>
    <div class="p-row"><label>top</label>     <input id="p-top"      type="number" step="0.1"  value="${f(c.top)}">     <span class="unit">%</span></div>
    <div class="p-row"><label>width</label>   <input id="p-width"    type="number" step="0.1"  value="${f(c.width)}">   <span class="unit">%</span></div>
    <div class="p-row"><label>height</label>  <input id="p-height"   type="number" step="0.1"  value="${f(c.height)}">  <span class="unit">%</span></div>
    <div class="p-row"><label>rotation</label><input id="p-rotation" type="number" step="1"    value="${c.rotation || 0}"><span class="unit">°</span></div>

    <div class="p-section">Apparence</div>
    <div class="p-row"><label>police</label>  <input id="p-fs"    type="number" step="0.05" value="${f(c.fontSize || 1.1)}"><span class="unit">vw</span></div>
    <div class="p-row"><label>couleur</label> <input id="p-color" type="color"               value="${c.color || '#1a0e00'}"></div>
    <div class="p-row"><label>gras</label>    <input id="p-bold"  type="checkbox" ${c.bold ? 'checked' : ''}></div>

    <div class="p-actions">
      <button class="btn gold" onclick="duplicateSel()">⧉ Dupliquer</button>
      <button class="btn red"  onclick="deleteSel()">🗑 Supprimer</button>
    </div>`;

  // Liaisons propriété → contrôle
  bindProp('p-name',     'input',  v => { c.name     = v;   refreshCtrl(c); });
  bindProp('p-type',     'change', ()  => { c.type   = el('p-type').value; renderAll(); selectCtrl(c.id); });
  bindProp('p-left',     'input',  v => { c.left     = +v;  refreshCtrl(c); });
  bindProp('p-top',      'input',  v => { c.top      = +v;  refreshCtrl(c); });
  bindProp('p-width',    'input',  v => { c.width    = +v;  refreshCtrl(c); });
  bindProp('p-height',   'input',  v => { c.height   = +v;  refreshCtrl(c); });
  bindProp('p-rotation', 'input',  v => { c.rotation = +v;  refreshCtrl(c); });
  bindProp('p-fs',       'input',  v => { c.fontSize = +v;  refreshCtrl(c); });
  bindProp('p-color',    'input',  v => { c.color    = v;   refreshCtrl(c); });
  bindProp('p-bold',     'change', ()  => { c.bold   = el('p-bold').checked; refreshCtrl(c); });
}

// ── Liaison générique input → callback ──
function bindProp(id, evt, fn) {
  const e = el(id);
  if (!e) return;
  e.addEventListener(evt, () => { fn(e.value); saveLayout(); });
}

// ── Sync position dans le panel (pendant le drag) ──
function syncPropXY(c) {
  if (selId !== c.id) return;
  const pl = el('p-left'), pt = el('p-top');
  if (pl) pl.value = c.left.toFixed(2);
  if (pt) pt.value = c.top.toFixed(2);
}

// ── Helpers ──
function f(n)   { return (+(n || 0)).toFixed(2); }
function esc(s) { return String(s).replace(/"/g, '&quot;').replace(/</g, '&lt;'); }

// ── Flèches clavier pour nudger le contrôle sélectionné ──
document.addEventListener('keydown', e => {
  if (!selId || !edMode) return;
  if (['INPUT', 'TEXTAREA', 'SELECT'].includes(document.activeElement.tagName)) return;

  const c = byId(selId);
  if (!c) return;
  const step = e.shiftKey ? 0.5 : 0.1;

  if      (e.key === 'ArrowLeft')                          { c.left -= step; }
  else if (e.key === 'ArrowRight')                         { c.left += step; }
  else if (e.key === 'ArrowUp')                            { c.top  -= step; }
  else if (e.key === 'ArrowDown')                          { c.top  += step; }
  else if (e.key === 'Delete' || e.key === 'Backspace')    { deleteSel(); return; }
  else return;

  refreshCtrl(c);
  syncPropXY(c);
  saveLayout();
  e.preventDefault();
});
