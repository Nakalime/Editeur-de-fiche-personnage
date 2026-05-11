/**
 * 01-model.js — État global, constantes, utilitaires DOM
 * Chargé en premier. Aucune dépendance externe.
 */

'use strict';

// ── État global ──
let controls = [];   // tableau de tous les contrôles du formulaire
let _uid     = 1;    // compteur d'identifiants uniques
let selId    = null; // id du contrôle sélectionné (mode éditeur)
let edMode   = false; // true = mode éditeur actif

// ── Gabarits par type ──
const DEFS = {
  text:    { w: 14,  h: 2.5, fs: 1.1 },
  number:  { w: 3.5, h: 3.5, fs: 1.4 },
  'cb-sq': { w: 1.5, h: 1.9, fs: 1.0 },
  'cb-di': { w: 1.5, h: 1.9, fs: 1.0 },
};

// ── Utilitaires ──
function uid()      { return 'c' + (_uid++); }
function byId(id)   { return controls.find(c => c.id === id); }
function el(id)     { return document.getElementById(id); }
function ctrlEl(id) { return el('ctrl-' + id); }
function isCb(c)    { return c.type === 'cb-sq' || c.type === 'cb-di'; }
