# Éditeur de Fiche Personnage

Outil générique pour créer des fiches de personnage RPG interactives : une image de fiche sert de fond, et des champs de formulaire transparents sont positionnés par-dessus via un éditeur visuel intégré.

## Démarrage rapide

**Via GitHub Pages (recommandé)** — ouvrir l'URL du site, cliquer sur "Installer" dans la barre du navigateur pour l'ajouter comme application.

**En local** — ouvrir `index.html` directement dans un navigateur (aucun serveur requis).

Dans les deux cas, charger une image de fond via **🖼 Changer le fond** pour commencer.

> **Image de fond non fournie** — apporte ta propre image de fiche (scan, photo, export PDF…). L'image n'est jamais envoyée sur un serveur : elle reste dans ton navigateur.

## Utilisation

### Mode normal (remplissage)

Cliquer sur un champ et taper. Les cases à cocher s'activent au clic. Les valeurs sont sauvegardées automatiquement dans le navigateur à chaque frappe.

| Bouton | Action |
| --- | --- |
| 🗑️ Réinitialiser | Efface toutes les valeurs saisies (confirmation requise) |
| 🖨️ Imprimer | Lance l'impression (Ctrl+P fonctionne aussi) |
| 📤 Export JSON | Sauvegarde layout + valeurs dans un fichier portable |
| 📥 Import JSON | Restaure un fichier exporté précédemment |
| ✏️ Éditeur | Passe en mode éditeur pour modifier la disposition |

### Mode éditeur (placement des champs)

Cliquer sur **✏️ Éditeur** pour entrer dans le mode éditeur.

- **Ajouter un champ** : boutons `+ Texte`, `+ Nombre`, `+ Case □`, `+ Losange ◇`
- **Déplacer** : glisser-déposer le champ
- **Repositionner précisément** : modifier les valeurs dans le panneau de propriétés (à droite)
- **Pivoter** : glisser la poignée bleue `↻` au-dessus du champ, ou saisir une valeur dans le champ `rotation`
- **Touches flèches** : déplace le champ sélectionné de 0,1 % (+ Shift = 0,5 %)
- **Suppr / Backspace** : supprime le champ sélectionné
- **⧉ Dupliquer** : disponible dans la barre et dans le panneau de propriétés
- **✅ Terminer** : quitte le mode éditeur

Les losanges (`◇`) ont une rotation de base de 45° ; le champ `rotation` s'ajoute à ce décalage.

L'image de fond peut être remplacée via **🖼 Changer le fond** (stockée dans le navigateur si < ~5 Mo).

## Persistance

| Mécanisme | Ce qui est stocké | Portabilité |
| --- | --- | --- |
| Navigateur (automatique) | Layout + valeurs + fond | Local uniquement |
| Export / Import JSON | Layout + valeurs | Fichier transférable entre appareils |

Pour partager ou archiver une fiche complète, utiliser **📤 Export JSON** — le fichier contient à la fois la disposition des champs et toutes les valeurs saisies.

## Format JSON

```json
{
  "version": 1,
  "layout": {
    "uid": 3,
    "controls": [
      {
        "id": "c1",
        "type": "text",
        "name": "nom_personnage",
        "left": 23.4, "top": 8.1,
        "width": 30.0, "height": 3.2,
        "rotation": 0,
        "fontSize": 1.4,
        "color": "#1a0e00",
        "bold": true
      }
    ]
  },
  "data": {
    "c1": "Nom du personnage",
    "c2": false
  }
}
```

Les fichiers exportés avec un ancien format (sans champ `version`) sont acceptés à l'import — seul le layout est restauré.

## Structure des fichiers

```text
editeur-fiche-personnage/
├── index.html            Point d'entrée
├── style.css             Styles (mode normal, éditeur, impression)
├── manifest.json         Manifeste PWA
├── sw.js                 Service worker (cache hors-ligne)
├── assets/
│   └── icon.svg          Icône de l'application
└── js/
    ├── 01-model.js       État global et utilitaires
    ├── 02-render.js      Rendu des contrôles dans le DOM
    ├── 03-drag.js        Déplacement et rotation
    ├── 04-props-panel.js Panneau de propriétés et raccourcis clavier
    ├── 05-editor.js      Mode éditeur (CRUD des contrôles)
    ├── 06-persistence.js localStorage, export/import JSON
    └── 07-init.js        Restauration au chargement
```

Les fichiers JS sont chargés en ordre de dépendance via `<script>` classiques, sans bundler (compatible `file://`).

## Impression

Bouton **🖨️ Imprimer** ou `Ctrl+P`. Mise en page A4 paysage, barre d'outils et éléments de l'éditeur masqués.
