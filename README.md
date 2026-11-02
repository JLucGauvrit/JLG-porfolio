# Portfolio · Jean-Luc Gauvrit

Site statique (HTML/CSS/JS, sans build) hébergé sur GitHub Pages.

## Structure
- `index.html` : contenu (FR/EN, bascule via le bouton en haut à droite)
- `assets/css/style.css` : styles (thème clair/sombre)
- `assets/js/main.js` : langue, thème, filtres de projets, animations
- `assets/img/photo.jpg` : photo de profil (à ajouter)
- `assets/cv/CV_Jean-Luc_Gauvrit.pdf` : CV téléchargeable (optionnel, le bouton n'apparaît que si le fichier existe)
- `CNAME` : nom de domaine personnalisé (à créer, une seule ligne, ex. `jeanlucgauvrit.fr`)

## Ajouter un projet
Copier un bloc `<article class="project">` dans `index.html`, renseigner `data-tags`
(`ia`, `green`, `hw`, `dev`) et les deux langues (`<span lang="fr">` / `<span lang="en">`).

## Prévisualiser en local
```bash
python3 -m http.server 8000
```
puis ouvrir http://localhost:8000
