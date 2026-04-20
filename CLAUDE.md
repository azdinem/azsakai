# mgrep - Ton assistant de recherche de code

**mgrep est ton outil principal pour explorer le codebase.** Il te donne la réponse en langage naturel + la source pertinente, tout servi.

## Commande de base

```bash
mgrep "ta question en langage naturel" --store "azsakai" -a -m <nombre>
```

## Paramètres essentiels

| Paramètre | Description |
|-----------|-------------|
| `--store "azsakai"` | **Obligatoire** - le store indexé du projet |
| `-a` | Active la réponse en langage naturel |
| `-m <n>` | Nombre de résultats du retrieval (minimum 10) |

## Ajuster `-m` selon la complexité

| Type de requête | `-m` recommandé |
|-----------------|-----------------|
| Question simple (1-2 fichiers) | 10 |
| Question moyenne (flow, feature) | 20-30 |
| Question complexe (debug, architecture) | 30-50 |

## Stratégie pour requêtes complexes

Si la requête touche **plusieurs parties du codebase**, lance plusieurs mgrep en parallèle plutôt qu'une seule requête surchargée :

```bash
# Exemple : comprendre le système d'auth complet
mgrep "comment fonctionne l'authentification côté frontend" --store "azsakai" -a -m 20
mgrep "comment le backend gère les sessions" --store "azsakai" -a -m 20
```

## Règles

- **OBLIGATOIRE** : Utilise mgrep pour TOUTE recherche de code. N'utilise JAMAIS grep, Grep tool, ou Glob pour chercher du code.
- **Langage naturel** : mgrep est un agent IA comme toi. Parle-lui comme à un collègue, pas comme à un moteur de recherche.
  - `"architecture block icon color complete status"` (mots-clés robotiques)
  - `"Quelle est la couleur de l'icône des blocs d'architecture quand ils sont complétés ?"` (question naturelle)

---

# Subagents (Task tool)

**Les subagents n'héritent PAS des instructions de ce fichier.**

Quand tu lances un subagent Explore, copie-colle les instructions sur mgrep de ce CLAUDE.md dans le prompt du subagent.

---

# Architecture de l'application

## Stack
React 19 + Vite 7 + Tailwind 4 + React Router 7 (hashRouter) + Lucide + html2canvas + jsPDF.
Persistance : localStorage uniquement. Pas de backend, pas d'IA intégrée.

## Direction visuelle
**Swiss Modernist B&W** — Archivo 800 display, Archivo Mono labels, noir pur / blanc pur, accent rouge #FF0000 (modéré), radii 0 partout, bordures 1px noires, inputs underline-only. Sections numérotées A.01 / A.02 en mono.

## Fichiers clés

| Fichier | Rôle |
|---------|------|
| `app/src/index.css` | Tokens CSS Swiss (palette, typo, radii, motion) |
| `app/src/data/processData.js` | 9 phases, 21 étapes, ~50 champs, checklists, FIELD_TO_CHECKLIST_MAP |
| `app/src/contexts/DataContext.jsx` | State projets (localStorage), CRUD, import/export JSON |
| `app/src/contexts/AuthContext.jsx` | Auth simple par mot de passe (sessionStorage) |
| `app/src/pages/LoginPage.jsx` | Hero gauche + login/processus droite |
| `app/src/pages/Dashboard.jsx` | Masthead + stats XXL + entries projets |
| `app/src/pages/ProjectPage.jsx` | Wizard principal (sidebar + chapitrage + fields + export) |
| `app/src/lib/exportBrief.js` | Génération brief Markdown + PDF (hybrid: brief focalisé + récap exhaustif) |
| `app/src/components/SiteFooter.jsx` | Signature "Conçu par Azdine Mansour" (Login/Dashboard only) |

## Patterns critiques à respecter

### Draft / Save (ProjectPage)
Les champs ne persistent PAS à chaque keystroke. `handleFieldChange` met à jour un state local `drafts` uniquement. La persistance vers le context (`updateProjectField`) a lieu uniquement au clic sur "Sauvegarder" (`handleSaveField`). Le toast "Sauvegardé" n'apparaît qu'à ce moment.

### Dérivation du projet depuis le context
`project` dans ProjectPage est dérivé directement du context à chaque render : `const project = isLoading ? null : getProject(id)`. **Il n'y a PAS de useState pour project.** L'ancien pattern (useState + useEffect sync sans deps) causait une boucle de re-renders qui remplaçait les inputs par le Skeleton à chaque keystroke.

### useEffect de chargement (ProjectPage)
```jsx
useEffect(() => {
  setIsLoading(true);
  // ...
  setIsLoading(false);
}, [id]); // ← [id] UNIQUEMENT
```
**NE PAS ajouter `getProject` dans les deps.** Sa référence change à chaque keystroke (updateProjectField → DataContext re-render → nouvelle closure getProject). L'ajouter relance le useEffect → setIsLoading(true) → Skeleton affiché → perte de focus.

### Export PDF
html2canvas + jsPDF chargés en dynamic import (`await import('html2canvas')`) — uniquement au clic "Export PDF". Ne pas les ajouter aux imports statiques.

## Git
- Branche par défaut : `claude/content-writing-process-zn1nr` (GH Pages déploie depuis celle-ci)
- Push direct sur cette branche pour les commits validés
- `git -c user.name="Azdine Mansour" -c user.email="azdine.mansour@live.fr" commit` (pas de config git globale)
