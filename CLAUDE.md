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
