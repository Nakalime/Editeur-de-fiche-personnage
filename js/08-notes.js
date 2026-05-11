/**
 * 08-notes.js — Carnet de notes paginé
 * Dépend de : 01-model.js (el)
 */

let _notesPages   = [''];
let _notesCurrent = 0;

function _saveCurrentPage() {
  _notesPages[_notesCurrent] = el('notes-area').value;
}

function _persistNotes() {
  localStorage.setItem('fiche-notes', JSON.stringify({
    pages:   _notesPages,
    current: _notesCurrent,
  }));
}

function _showPage(i) {
  _notesCurrent = i;
  el('notes-area').value = _notesPages[i];
  el('notes-page-label').textContent = (i + 1) + ' / ' + _notesPages.length;
  el('notes-prev').disabled = i === 0;
  el('notes-next').disabled = i === _notesPages.length - 1;
}

function notesPrev() {
  if (_notesCurrent === 0) return;
  _saveCurrentPage();
  _persistNotes();
  _showPage(_notesCurrent - 1);
}

function notesNext() {
  if (_notesCurrent === _notesPages.length - 1) return;
  _saveCurrentPage();
  _persistNotes();
  _showPage(_notesCurrent + 1);
}

function notesAddPage() {
  _saveCurrentPage();
  _notesPages.push('');
  _persistNotes();
  _showPage(_notesPages.length - 1);
  el('notes-area').focus();
}

function _syncNotesHeight() {
  const panel = el('notes-panel');
  if (window.innerWidth > 900) {
    const h = el('sheet-wrapper').clientHeight;
    if (h > 0) panel.style.height = h + 'px';
  } else {
    panel.style.height = '';
  }
}

window.addEventListener('load', () => {
  // Restaurer les notes
  const raw = localStorage.getItem('fiche-notes');
  if (raw) {
    try {
      const d = JSON.parse(raw);
      if (d && Array.isArray(d.pages) && d.pages.length) {
        _notesPages   = d.pages;
        _notesCurrent = Math.min(d.current || 0, d.pages.length - 1);
      }
    } catch {
      // ancien format texte brut
      _notesPages = [raw];
    }
  }
  _showPage(_notesCurrent);

  // Auto-save à chaque frappe
  el('notes-area').addEventListener('input', () => {
    _saveCurrentPage();
    _persistNotes();
  });

  // Sync hauteur avec la fiche
  new ResizeObserver(_syncNotesHeight).observe(el('sheet-wrapper'));
  _syncNotesHeight();
});
