/**
 * 07-init.js — Point d'entrée, chargé en dernier
 * Dépend de : tous les fichiers précédents
 */

if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('./sw.js');
}

window.addEventListener('load', () => {
  const bg = localStorage.getItem('fiche-bg');
  if (bg) el('sheet-img').src = bg;

  if (loadLayout()) renderAll();

  const raw = localStorage.getItem('fiche-data');
  if (raw) _applyData(JSON.parse(raw));

});
