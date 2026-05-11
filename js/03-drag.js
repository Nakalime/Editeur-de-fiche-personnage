/**
 * 03-drag.js — Déplacement et rotation des contrôles en mode éditeur
 * Dépend de : 01-model.js, (04-props-panel.js pour syncPropXY), (06-persistence.js pour saveLayout)
 */

// ── Déplacement (drag) ──
function startDrag(e, c, wrap) {
  const sw   = el('sheet-wrapper').getBoundingClientRect();
  const x0   = e.clientX, y0 = e.clientY;
  const l0   = c.left,    t0 = c.top;

  function onMove(e) {
    c.left = l0 + (e.clientX - x0) / sw.width  * 100;
    c.top  = t0 + (e.clientY - y0) / sw.height * 100;
    wrap.style.left = c.left.toFixed(3) + '%';
    wrap.style.top  = c.top.toFixed(3)  + '%';
    syncPropXY(c);
  }

  function onUp() {
    document.removeEventListener('mousemove', onMove);
    document.removeEventListener('mouseup',   onUp);
    saveLayout();
  }

  document.addEventListener('mousemove', onMove);
  document.addEventListener('mouseup',   onUp);
}

// ── Rotation ──
function startRotate(e, c, wrap) {
  const r    = wrap.getBoundingClientRect();
  const cx   = r.left + r.width  / 2;
  const cy   = r.top  + r.height / 2;
  const a0   = Math.atan2(e.clientY - cy, e.clientX - cx) * 180 / Math.PI;
  const rot0 = c.rotation || 0;

  function onMove(e) {
    const a    = Math.atan2(e.clientY - cy, e.clientX - cx) * 180 / Math.PI;
    c.rotation = Math.round(rot0 + (a - a0));
    const deg  = (c.type === 'cb-di' ? 45 : 0) + c.rotation;
    wrap.style.transform = deg ? `rotate(${deg}deg)` : '';
    const pRot = el('p-rotation');
    if (pRot) pRot.value = c.rotation;
  }

  function onUp() {
    document.removeEventListener('mousemove', onMove);
    document.removeEventListener('mouseup',   onUp);
    saveLayout();
  }

  document.addEventListener('mousemove', onMove);
  document.addEventListener('mouseup',   onUp);
}
