/**
 * 07-init.js — Point d'entrée, chargé en dernier
 * Dépend de : tous les fichiers précédents
 */

if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('./sw.js');
}

// Tout est auto-sauvegardé — on supprime le faux positif du navigateur
window.addEventListener('beforeunload', e => { delete e.returnValue; });

window.addEventListener('load', () => {
  const bg = localStorage.getItem('fiche-bg');
  if (bg) {
    el('sheet-img').src = bg;
  } else {
    const bgName = localStorage.getItem('fiche-bg-name');
    if (bgName) _showBgNotice(bgName);
  }

  if (loadLayout()) renderAll();

  const raw = localStorage.getItem('fiche-data');
  if (raw) _applyData(JSON.parse(raw));

});
