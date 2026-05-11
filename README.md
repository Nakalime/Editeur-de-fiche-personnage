# Éditeur de Fiche Personnage

Outil générique pour créer des fiches de personnage RPG interactives : une image de fiche sert de fond, et des champs de formulaire transparents sont positionnés par-dessus via un éditeur visuel intégré.

## Démarrage rapide

Ouvrir `index.html` directement dans un navigateur (aucun serveur requis).

## Structure des fichiers

```text
fiche-algranir/
├── index.html            Point d'entrée
├── style.css             Tout le style (mode normal + éditeur + impression)
├── assets/
│   └── fond-algranir.jpg Image de fond de la fiche
└── js/
    ├── 01-model.js       État global, constantes, utilitaires (uid, byId, isCb…)
    ├── 02-render.js      Création et mise à jour des contrôles dans le DOM
    ├── 03-drag.js        Déplacement et rotation en mode éditeur
    ├── 04-props-panel.js Panneau de propriétés et raccourcis clavier
    ├── 05-editor.js      Entrée/sortie du mode éditeur, CRUD des contrôles
    ├── 06-persistence.js Sauvegarde localStorage, export/import JSON
    └── 07-init.js        Point d'entrée : restauration au chargement
```

Les fichiers JS sont chargés en ordre de dépendance via des balises `<script>` classiques (pas de modules ES, compatible `file://`).

## Utilisation

### Mode normal (remplissage)

Cliquer sur un champ et taper. Les cases à cocher s'activent au clic. Toutes les valeurs sont sauvegardées automatiquement dans le `localStorage` à chaque frappe.

Boutons de la barre d'outils :

| Bouton | Action |
| --- | --- |
| 💾 Sauvegarder | Sauvegarde explicite dans le localStorage |
| 📂 Charger | Recharge les dernières valeurs sauvegardées |
| 🗑️ Réinitialiser | Efface toutes les valeurs (confirmation requise) |
| 🖨️ Imprimer | Lance l'impression (Ctrl+P fonctionne aussi) |
| ✏️ Éditeur | Passe en mode éditeur |

### Mode éditeur (placement des champs)

Cliquer sur **✏️ Éditeur** pour entrer dans le mode éditeur.

- **Ajouter un champ** : boutons `+ Texte`, `+ Nombre`, `+ Case □`, `+ Losange ◇`
- **Déplacer** : glisser-déposer le champ
- **Redimensionner / repositionner précisément** : modifier les valeurs dans le panneau de propriétés (droite)
- **Pivoter** : glisser la poignée bleue `↻` au-dessus du champ, ou éditer le champ `rotation` dans les propriétés
- **Touches flèches** : déplace le champ sélectionné de 0,1 % (+ Shift = 0,5 %)
- **Suppr / Backspace** : supprime le champ sélectionné
- **Dupliquer** : bouton ⧉ dans la barre ou dans les propriétés
- **✅ Terminer** : quitte le mode éditeur

Les losanges (`cb-di`) ont une rotation de base de 45° ; le champ `rotation` s'ajoute à ce décalage.

Le champ `fond` peut être remplacé via le bouton **🖼 Changer le fond** (l'image est stockée dans le localStorage si elle fait moins de ~5 Mo).

## Format JSON d'export

Le bouton **📤 Export JSON** génère un fichier `fiche-personnage.json` contenant à la fois la disposition des champs et les valeurs saisies :

```json
{
  "version": 1,
  "layout": {
    "uid": 5,
    "controls": [
      {
        "id": "c1",
        "type": "text",
        "name": "nom_personnage",
        "left": 23.4,
        "top": 8.1,
        "width": 30.0,
        "height": 3.2,
        "rotation": 0,
        "fontSize": 1.4,
        "color": "#1a0e00",
        "bold": true,
        "value": "",
        "checked": false
      }
    ]
  },
  "data": {
    "c1": "Algranir",
    "c2": false
  }
}
```

**Compatibilité ascendante** : les anciens fichiers `algranir-layout.json` (format sans `version`) sont acceptés à l'import — la disposition est restaurée, les données étant absentes de l'ancien format.

## Persistance

| Mécanisme | Ce qui est stocké | Portabilité |
| --- | --- | --- |
| `localStorage` (automatique) | Layout + valeurs + fond | Navigateur local uniquement |
| Export JSON | Layout + valeurs | Fichier transférable |

Pour partager ou sauvegarder une fiche complète hors du navigateur, utiliser **📤 Export JSON** / **📥 Import JSON**.

## Impression

Utiliser le bouton **🖨️ Imprimer** ou `Ctrl+P`. La mise en page est configurée en A4 paysage (`@page { size: A4 landscape; margin: 0 }`). La barre d'outils et les éléments de l'éditeur sont masqués à l'impression.
