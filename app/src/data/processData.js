// Données du processus de rédaction SEO - 9 phases (0-8), ~21 étapes
// Basé sur la méthodologie Thot SEO

export const CONTENT_TYPES = [
  { id: 'article', label: 'Article', icon: 'FileText' },
  { id: 'landing', label: 'Landing Page', icon: 'Target' },
];

export const READER_PROFILES = [
  { id: 'decisionnaire', label: 'Décisionnaire', proximity: 'Très élevée', behavior: 'Prêt à acheter, compare les dernières options', cta: 'Achat direct, devis, contact commercial' },
  { id: 'convaincu', label: 'Convaincu en attente', proximity: 'Élevée', behavior: 'Sait ce qu\'il veut, cherche le bon moment/offre', cta: 'Inscription liste d\'attente, alerte promo' },
  { id: 'evaluateur', label: 'Évaluateur', proximity: 'Moyenne', behavior: 'Compare les solutions, pèse les avantages', cta: 'Comparatif, essai gratuit, démo' },
  { id: 'explorateur', label: 'Explorateur', proximity: 'Faible', behavior: 'Découvre le sujet, s\'informe', cta: 'Guide gratuit, newsletter, ressource éducative' },
];

export const FRAMEWORKS = [
  { id: 'pas', label: 'PAS (Problème-Agiter-Solution)', usage: 'Articles orientés pain points, problèmes utilisateur', structure: '1. Exposer le problème → 2. Amplifier la douleur → 3. Présenter la solution' },
  { id: 'aida', label: 'AIDA (Attention-Intérêt-Désir-Action)', usage: 'Pages hybrides article + conversion', structure: '1. Capter l\'attention → 2. Susciter l\'intérêt → 3. Créer le désir → 4. Appeler à l\'action' },
  { id: 'mece', label: 'MECE (Mutuellement Exclusif, Collectivement Exhaustif)', usage: 'Guides complets, contenus piliers', structure: 'Sections non chevauchantes couvrant 100% du sujet' },
  { id: 'pyramide', label: 'Pyramide inversée', usage: 'Actualités, réponses rapides', structure: 'Information essentielle d\'abord → Détails ensuite' },
];

export const SERP_ELEMENTS = [
  { id: 'featured_snippet', label: 'Featured snippet', subLabel: '(paragraphe / liste / tableau)' },
  { id: 'paa', label: 'People Also Ask (PAA)' },
  { id: 'images', label: 'Images dans les résultats' },
  { id: 'videos', label: 'Vidéos dans les résultats' },
  { id: 'knowledge_panel', label: 'Knowledge Panel' },
  { id: 'local', label: 'Résultats locaux' },
];

export const CONTENT_FORMATS = [
  { id: 'guide', label: 'Guide complet / tutoriel' },
  { id: 'liste', label: 'Liste (Top X, X conseils...)' },
  { id: 'definition', label: 'Définition / Explication' },
  { id: 'comparatif', label: 'Comparatif' },
  { id: 'etude_cas', label: 'Étude de cas' },
  { id: 'interview', label: 'Interview / Témoignage' },
];

export const INFO_GAIN_SOURCES = [
  { id: 'experience', label: 'Astuces personnelles / retour d\'expérience' },
  { id: 'data', label: 'Étude ou données propriétaires' },
  { id: 'case_study', label: 'Étude de cas client réel' },
  { id: 'expert', label: 'Citation ou interview d\'expert' },
  { id: 'tool', label: 'Outil interactif / calculateur' },
  { id: 'visual', label: 'Synthèse visuelle originale (infographie, schéma)' },
  { id: 'trends', label: 'Angle prospectif / tendances futures' },
  { id: 'methodology', label: 'Méthodologie exclusive' },
];

// Couleurs par phase
export const PHASE_COLORS = {
  phase0: { main: '#8b5cf6', light: '#f5f3ff', dark: '#7c3aed' },
  phase1: { main: '#3b82f6', light: '#eff6ff', dark: '#2563eb' },
  phase2: { main: '#06b6d4', light: '#ecfeff', dark: '#0891b2' },
  phase3: { main: '#6366f1', light: '#eef2ff', dark: '#4f46e5' },
  phase4: { main: '#10b981', light: '#ecfdf5', dark: '#059669' },
  phase5: { main: '#f59e0b', light: '#fffbeb', dark: '#d97706' },
  phase6: { main: '#ec4899', light: '#fdf2f8', dark: '#db2777' },
  phase7: { main: '#14b8a6', light: '#f0fdfa', dark: '#0d9488' },
  phase8: { main: '#64748b', light: '#f8fafc', dark: '#475569' },
};

// Mapping checklist -> champs pour auto-complétion
export const FIELD_TO_CHECKLIST_MAP = {
  // Phase 0
  'main_keyword': 'c0_1_1',
  'search_volume': 'c0_1_2',
  'business_objective': 'c0_1_3',
  'deadline': 'c0_1_4',
  // Phase 1
  'reader_profile': 'c1_1_1',
  'knowledge_level': 'c1_1_2',
  'main_question': 'c1_1_3',
  'main_cta': 'c1_1_4',
  'serp_elements': 'c1_2_2',
  'serp_analysis': 'c1_2_3',
  'dominant_format': 'c1_2_4',
  'framework': 'c1_3_2',
  'framework_justification': 'c1_3_3',
  // Phase 2
  'paa_list': 'c2_1_3',
  'content_plan': 'c2_2_4',
  'competitor_terms': 'c2_3_6',
  'info_gain_sources': 'c2_4_1',
  // Phase 3
  'brand_mission': 'c3_1_1',
  'brand_values': 'c3_1_2',
  'main_problem': 'c3_1_3',
  'tone_of_voice': 'c3_1_4',
  'qbst_terms': 'c3_2_1',
  'target_length': 'c3_3_1',
  // Phase 4
  'body_content': 'c4_1_9',
  'introduction': 'c4_2_4',
  'conclusion': 'c4_3_3',
  'snippet_content': 'c4_4_2',
  // Phase 5
  'visuals_list': 'c5_1_1',
  // Phase 7
  'internal_links': 'c7_1_1',
  'external_links': 'c7_2_1',
  // Phase 8
  'h1_title': 'c8_1_1',
  'meta_title': 'c8_1_2',
  'meta_description': 'c8_1_3',
  'target_url': 'c8_1_4',
  'kpis': 'c8_2_1',
  'smart_objective': 'c8_2_3',
};

export const PHASES = [
  {
    id: 'phase0',
    number: 0,
    title: 'Cadrage Initial',
    icon: 'Crosshair',
    color: 'phase0',
    description: 'Définir le mot-clé cible et l\'objectif du contenu',
    steps: [
      {
        id: 'step0_1',
        number: '0.1',
        title: 'Définir le mot-clé et l\'objectif',
        objective: 'Poser les bases du projet de contenu : mot-clé cible, objectif business et deadline.',
        deliverable: 'Fiche de cadrage complétée',
        checklist: [
          { id: 'c0_1_1', label: 'Mot-clé principal défini' },
          { id: 'c0_1_2', label: 'Volume de recherche vérifié' },
          { id: 'c0_1_3', label: 'Objectif business identifié' },
          { id: 'c0_1_4', label: 'Deadline de publication fixée' },
        ],
        fields: [
          { id: 'main_keyword', type: 'text', label: 'Mot-clé principal', placeholder: 'Ex: création de contenu SEO' },
          { id: 'secondary_keywords', type: 'textarea', label: 'Mots-clés secondaires', placeholder: 'Un mot-clé par ligne', rows: 3 },
          { id: 'search_volume', type: 'text', label: 'Volume de recherche mensuel', placeholder: 'Ex: 1 200' },
          { id: 'business_objective', type: 'select', label: 'Objectif business', options: [
            { id: 'traffic', label: 'Générer du trafic qualifié' },
            { id: 'leads', label: 'Générer des leads' },
            { id: 'sales', label: 'Générer des ventes' },
            { id: 'awareness', label: 'Développer la notoriété' },
            { id: 'authority', label: 'Établir l\'expertise / autorité' },
          ]},
          { id: 'deadline', type: 'date', label: 'Deadline de publication' },
          { id: 'notes', type: 'textarea', label: 'Notes complémentaires', rows: 3 },
        ],
      },
    ],
  },
  {
    id: 'phase1',
    number: 1,
    title: 'Définition du Scope',
    icon: 'Target',
    color: 'phase1',
    description: 'Définir le cadre, l\'audience et le format du contenu',
    steps: [
      {
        id: 'step1_1',
        number: '1.1',
        title: 'Identifier le profil lecteur cible',
        objective: 'Déterminer la proximité du lecteur avec l\'acte d\'achat pour adapter le discours.',
        deliverable: 'Fiche profil lecteur complétée',
        checklist: [
          { id: 'c1_1_1', label: 'Classifier le lecteur cible parmi les 4 typologies' },
          { id: 'c1_1_2', label: 'Définir le niveau de connaissance du sujet' },
          { id: 'c1_1_3', label: 'Identifier la question principale à laquelle répondre' },
          { id: 'c1_1_4', label: 'Définir le CTA principal prévu' },
        ],
        fields: [
          { id: 'reader_profile', type: 'select', label: 'Profil sélectionné', options: 'READER_PROFILES' },
          { id: 'knowledge_level', type: 'select', label: 'Niveau de connaissance', options: [
            { id: 'beginner', label: 'Débutant' },
            { id: 'intermediate', label: 'Intermédiaire' },
            { id: 'expert', label: 'Expert' },
          ]},
          { id: 'main_question', type: 'textarea', label: 'Question principale à laquelle répondre' },
          { id: 'main_cta', type: 'text', label: 'CTA principal prévu' },
        ],
      },
      {
        id: 'step1_2',
        number: '1.2',
        title: 'Analyser les SERPs comme cahier des charges',
        objective: 'Comprendre ce que Google considère comme la meilleure réponse actuelle.',
        deliverable: 'Grille d\'analyse SERP complétée',
        checklist: [
          { id: 'c1_2_1', label: 'Rechercher le mot-clé principal sur Google (navigation privée)' },
          { id: 'c1_2_2', label: 'Documenter les éléments enrichis présents' },
          { id: 'c1_2_3', label: 'Analyser les 5 premiers résultats organiques' },
          { id: 'c1_2_4', label: 'Identifier le format dominant' },
        ],
        fields: [
          { id: 'serp_elements', type: 'multicheck', label: 'Éléments enrichis présents', options: 'SERP_ELEMENTS' },
          { id: 'serp_analysis', type: 'table', label: 'Analyse des 5 premiers résultats', columns: ['Position', 'Type de contenu', 'Longueur estimée', 'Format dominant', 'Angle principal'] },
          { id: 'dominant_format', type: 'select', label: 'Format dominant identifié', options: 'CONTENT_FORMATS' },
          { id: 'paa_questions', type: 'textarea', label: 'Questions PAA relevées (4-6 premières)' },
        ],
      },
      {
        id: 'step1_3',
        number: '1.3',
        title: 'Sélectionner le framework de structure',
        objective: 'Choisir le modèle de structure adapté à l\'intention et au format identifié.',
        deliverable: 'Framework sélectionné et justifié',
        checklist: [
          { id: 'c1_3_1', label: 'Évaluer les différents frameworks possibles' },
          { id: 'c1_3_2', label: 'Sélectionner le framework le plus adapté' },
          { id: 'c1_3_3', label: 'Justifier le choix' },
        ],
        fields: [
          { id: 'framework', type: 'select', label: 'Framework choisi', options: 'FRAMEWORKS' },
          { id: 'framework_justification', type: 'textarea', label: 'Justification du choix' },
        ],
      },
    ],
  },
  {
    id: 'phase2',
    number: 2,
    title: 'Structuration Sémantique',
    icon: 'LayoutTemplate',
    color: 'phase2',
    description: 'Construire le plan et identifier les opportunités de valeur ajoutée',
    steps: [
      {
        id: 'step2_1',
        number: '2.1',
        title: 'Collecter les questions PAA',
        objective: 'Identifier les sous-intentions de recherche réelles des utilisateurs.',
        deliverable: 'Liste des PAA classifiées par priorité',
        checklist: [
          { id: 'c2_1_1', label: 'Noter toutes les questions PAA visibles sur la SERP' },
          { id: 'c2_1_2', label: 'Cliquer sur 2-3 questions pour révéler des questions supplémentaires' },
          { id: 'c2_1_3', label: 'Classifier les questions par type de réponse attendue' },
          { id: 'c2_1_4', label: 'Prioriser les questions (1-3)' },
        ],
        fields: [
          { id: 'paa_list', type: 'paa_table', label: 'Questions PAA collectées', columns: ['Question PAA', 'Type de réponse', 'Priorité (1-3)', 'Section prévue'] },
        ],
      },
      {
        id: 'step2_2',
        number: '2.2',
        title: 'Construire le plan selon le framework MECE',
        objective: 'Créer une structure exhaustive sans chevauchements.',
        deliverable: 'Plan structuré avec hiérarchie H2/H3',
        checklist: [
          { id: 'c2_2_1', label: 'Lister tous les sous-sujets à couvrir' },
          { id: 'c2_2_2', label: 'Vérifier que chaque section traite un aspect unique (Mutuellement Exclusif)' },
          { id: 'c2_2_3', label: 'Vérifier que l\'ensemble couvre 100% du sujet (Collectivement Exhaustif)' },
          { id: 'c2_2_4', label: 'Organiser les sections dans un ordre logique' },
        ],
        fields: [
          { id: 'content_plan', type: 'textarea', label: 'Plan structuré (H1, H2, H3)', placeholder: '# Titre H1\n\n## H2 : Section 1\n### H3 : Sous-section\n\n## H2 : Section 2\n...', rows: 12 },
          { id: 'plan_order', type: 'select', label: 'Type d\'organisation', options: [
            { id: 'general_particular', label: 'Du général au particulier' },
            { id: 'chronological', label: 'Chronologique' },
            { id: 'complexity', label: 'Par niveau de complexité' },
          ]},
        ],
      },
      {
        id: 'step2_3',
        number: '2.3',
        title: 'Valider et optimiser les titres Hn',
        objective: 'Garantir des titres explicites, descriptifs et optimisés pour les moteurs et les LLMs.',
        deliverable: 'Plan avec titres Hn validés',
        checklist: [
          { id: 'c2_3_1', label: 'Chaque titre est descriptif et explicite' },
          { id: 'c2_3_2', label: 'Chaque titre contient des termes clés pertinents' },
          { id: 'c2_3_3', label: 'Aucun titre vague ("Ce qu\'il faut savoir", "Tout comprendre")' },
          { id: 'c2_3_4', label: 'Aucun titre purement marketing ("Un choix gagnant")' },
          { id: 'c2_3_5', label: 'Chaque titre est compréhensible hors contexte (pour LLM)' },
          { id: 'c2_3_6', label: 'Comparaison effectuée avec les titres des concurrents' },
        ],
        fields: [
          { id: 'competitor_terms', type: 'textarea', label: 'Termes présents chez les concurrents mais absents de votre plan' },
          { id: 'unique_terms', type: 'textarea', label: 'Termes uniques à votre plan (différenciation)' },
        ],
      },
      {
        id: 'step2_4',
        number: '2.4',
        title: 'Intégrer l\'Information Gain (30% minimum)',
        objective: 'Garantir un apport de valeur unique par rapport aux contenus existants.',
        deliverable: 'Plan enrichi avec sources d\'Information Gain identifiées',
        checklist: [
          { id: 'c2_4_1', label: 'Au moins 3 sources de valeur unique identifiées' },
          { id: 'c2_4_2', label: 'Le contenu unique est réparti dans l\'ensemble du plan' },
          { id: 'c2_4_3', label: 'Le contenu apporte des informations introuvables ailleurs' },
        ],
        fields: [
          { id: 'info_gain_sources', type: 'info_gain_table', label: 'Sources de valeur unique', options: 'INFO_GAIN_SOURCES' },
        ],
      },
    ],
  },
  {
    id: 'phase3',
    number: 3,
    title: 'Préparation à la Rédaction',
    icon: 'ClipboardList',
    color: 'phase3',
    description: 'Établir le contexte de marque et préparer les éléments sémantiques',
    steps: [
      {
        id: 'step3_1',
        number: '3.1',
        title: 'Établir le contexte de marque',
        objective: 'Garantir la cohérence du contenu avec l\'identité de marque.',
        deliverable: 'Brief de contexte marque',
        checklist: [
          { id: 'c3_1_1', label: 'Mission de la marque documentée' },
          { id: 'c3_1_2', label: 'Valeurs principales identifiées' },
          { id: 'c3_1_3', label: 'Problème principal résolu pour les clients défini' },
          { id: 'c3_1_4', label: 'Tone of voice choisi' },
          { id: 'c3_1_5', label: 'Termes à utiliser/éviter listés' },
        ],
        fields: [
          { id: 'brand_mission', type: 'textarea', label: 'Mission de la marque' },
          { id: 'brand_values', type: 'textarea', label: 'Valeurs principales' },
          { id: 'main_problem', type: 'textarea', label: 'Problème principal résolu pour les clients' },
          { id: 'tone_of_voice', type: 'select', label: 'Tone of voice', options: [
            { id: 'formal', label: 'Formel' },
            { id: 'conversational', label: 'Conversationnel' },
            { id: 'expert', label: 'Expert' },
            { id: 'pedagogical', label: 'Pédagogue' },
          ]},
          { id: 'formal_informal', type: 'select', label: 'Niveau de tutoiement', options: [
            { id: 'vous', label: 'Vouvoiement' },
            { id: 'tu', label: 'Tutoiement' },
          ]},
          { id: 'terms_to_use', type: 'textarea', label: 'Termes à privilégier' },
          { id: 'terms_to_avoid', type: 'textarea', label: 'Termes à éviter' },
        ],
      },
      {
        id: 'step3_2',
        number: '3.2',
        title: 'Identifier les termes saillants (QBST)',
        objective: 'Lister les mots-clés, synonymes et concepts connexes essentiels.',
        deliverable: 'Liste des termes saillants avec plan d\'intégration',
        checklist: [
          { id: 'c3_2_1', label: 'Synonymes directs identifiés' },
          { id: 'c3_2_2', label: 'Termes associés / cooccurrences listés' },
          { id: 'c3_2_3', label: 'Entités liées identifiées (personnes, marques, lieux, concepts)' },
          { id: 'c3_2_4', label: 'Plan d\'intégration naturelle défini' },
        ],
        fields: [
          { id: 'qbst_terms', type: 'textarea', label: 'Termes saillants à intégrer', placeholder: 'Synonymes: ...\nTermes associés: ...\nEntités liées: ...', rows: 6 },
        ],
      },
      {
        id: 'step3_3',
        number: '3.3',
        title: 'Définir la stratégie de rédaction',
        objective: 'Choisir l\'approche adaptée à la longueur du contenu.',
        deliverable: 'Stratégie de rédaction documentée',
        checklist: [
          { id: 'c3_3_1', label: 'Longueur cible estimée' },
          { id: 'c3_3_2', label: 'Stratégie de rédaction choisie (one shot ou section par section)' },
          { id: 'c3_3_3', label: 'Ordre de rédaction des sections défini' },
        ],
        fields: [
          { id: 'target_length', type: 'select', label: 'Longueur cible', options: [
            { id: 'short', label: 'Court (<1200 mots) - Rédaction one shot' },
            { id: 'long', label: 'Long (>1200 mots) - Rédaction section par section' },
          ]},
          { id: 'section_planning', type: 'textarea', label: 'Planning des sections', placeholder: 'Introduction: 100-150 mots (dernière)\nSection 1: XXX mots (1er)\nSection 2: XXX mots (2ème)\n...', rows: 6 },
        ],
      },
    ],
  },
  {
    id: 'phase4',
    number: 4,
    title: 'Rédaction',
    icon: 'PenLine',
    color: 'phase4',
    description: 'Rédiger le contenu en suivant les bonnes pratiques',
    steps: [
      {
        id: 'step4_1',
        number: '4.1',
        title: 'Rédiger le corps du contenu',
        objective: 'Produire un contenu clair, scannable et optimisé.',
        deliverable: 'Sections rédigées et validées individuellement',
        checklist: [
          { id: 'c4_1_1', label: 'Longueur des phrases: 10-20 mots' },
          { id: 'c4_1_2', label: 'Voix active privilégiée' },
          { id: 'c4_1_3', label: 'Un concept par phrase' },
          { id: 'c4_1_4', label: 'Paragraphes de 3-5 lignes maximum' },
          { id: 'c4_1_5', label: 'Listes à puces pour énumérations (>3 éléments)' },
          { id: 'c4_1_6', label: 'Tableaux pour les comparaisons' },
          { id: 'c4_1_7', label: 'Gras limité: max 2 par section' },
          { id: 'c4_1_8', label: 'Pas de langage sensationnaliste' },
          { id: 'c4_1_9', label: 'Termes saillants intégrés naturellement' },
        ],
        fields: [
          { id: 'body_content', type: 'textarea', label: 'Corps du contenu', rows: 20 },
        ],
      },
      {
        id: 'step4_2',
        number: '4.2',
        title: 'Rédiger l\'introduction',
        objective: 'Capter l\'attention et annoncer la valeur du contenu.',
        deliverable: 'Introduction rédigée',
        checklist: [
          { id: 'c4_2_1', label: 'Accroche présente (problème, statistique, question)' },
          { id: 'c4_2_2', label: 'Contexte / enjeu expliqué' },
          { id: 'c4_2_3', label: 'Promesse de l\'article claire' },
          { id: 'c4_2_4', label: 'Mot-clé principal dans les 100 premiers mots' },
        ],
        fields: [
          { id: 'introduction', type: 'textarea', label: 'Introduction', rows: 6, placeholder: '[Accroche : problème ou question que se pose le lecteur]\n\n[Contexte : pourquoi c\'est important maintenant]\n\nDans ce guide, vous découvrirez [promesse 1], [promesse 2] et [promesse 3].' },
        ],
      },
      {
        id: 'step4_3',
        number: '4.3',
        title: 'Rédiger la conclusion avec CTA',
        objective: 'Synthétiser et convertir selon le profil lecteur.',
        deliverable: 'Conclusion rédigée avec CTA',
        checklist: [
          { id: 'c4_3_1', label: 'Récapitulatif des 2-3 points clés' },
          { id: 'c4_3_2', label: 'Prochaine étape recommandée pour le lecteur' },
          { id: 'c4_3_3', label: 'CTA adapté au profil lecteur' },
        ],
        fields: [
          { id: 'conclusion', type: 'textarea', label: 'Conclusion', rows: 6, placeholder: '[Rappel des 2-3 enseignements principaux]\n\n[Prochaine étape recommandée pour le lecteur]\n\n[CTA clair et spécifique adapté au profil]' },
        ],
      },
      {
        id: 'step4_4',
        number: '4.4',
        title: 'Optimiser pour les Featured Snippets',
        objective: 'Maximiser les chances d\'apparition en position 0.',
        deliverable: 'Élément optimisé pour featured snippet intégré',
        checklist: [
          { id: 'c4_4_1', label: 'Format de snippet identifié sur la SERP' },
          { id: 'c4_4_2', label: 'Élément optimisé créé (définition 40-60 mots, liste 5-8 items, ou tableau)' },
          { id: 'c4_4_3', label: 'Élément positionné dans le premier tiers de l\'article' },
        ],
        fields: [
          { id: 'snippet_format', type: 'select', label: 'Format de snippet ciblé', options: [
            { id: 'paragraph', label: 'Paragraphe (définition 40-60 mots après H2 "Qu\'est-ce que...")' },
            { id: 'list', label: 'Liste (5-8 items sous H2 "Comment..." ou "Les X étapes...")' },
            { id: 'table', label: 'Tableau (comparatif sous H2 "Comparaison..." ou "Différences...")' },
          ]},
          { id: 'snippet_content', type: 'textarea', label: 'Contenu optimisé pour le snippet', rows: 6 },
        ],
      },
    ],
  },
  {
    id: 'phase5',
    number: 5,
    title: 'Mise en Page et Médias',
    icon: 'Image',
    color: 'phase5',
    description: 'Intégrer les visuels et optimiser la scannabilité',
    steps: [
      {
        id: 'step5_1',
        number: '5.1',
        title: 'Intégrer les éléments visuels',
        objective: 'Améliorer la lisibilité et l\'engagement.',
        deliverable: 'Contenu avec visuels intégrés et optimisés',
        checklist: [
          { id: 'c5_1_1', label: 'Emplacements nécessitant un visuel identifiés' },
          { id: 'c5_1_2', label: 'Ratio respecté: 1 visuel tous les 300-500 mots' },
          { id: 'c5_1_3', label: 'Noms de fichiers descriptifs avec mot-clé' },
          { id: 'c5_1_4', label: 'Attributs alt rédigés (description + mot-clé naturel)' },
          { id: 'c5_1_5', label: 'Légendes ajoutées si pertinent' },
          { id: 'c5_1_6', label: 'Images compressées (<100Ko si possible)' },
        ],
        fields: [
          { id: 'visuals_list', type: 'textarea', label: 'Liste des visuels à intégrer', placeholder: '1. [Section] - Type de visuel - Description - Alt text prévu\n2. ...', rows: 6 },
        ],
      },
      {
        id: 'step5_2',
        number: '5.2',
        title: 'Vérifier la scannabilité',
        objective: 'S\'assurer que le contenu est lisible en lecture rapide.',
        deliverable: 'Contenu validé pour la scannabilité',
        checklist: [
          { id: 'c5_2_1', label: 'Les titres Hn permettent de comprendre le sujet sans lire le texte' },
          { id: 'c5_2_2', label: 'Les informations clés sont en gras' },
          { id: 'c5_2_3', label: 'Les listes remplacent les énumérations dans le texte' },
          { id: 'c5_2_4', label: 'Les paragraphes sont visuellement aérés' },
          { id: 'c5_2_5', label: 'Le lecteur peut trouver l\'information cherchée en <10 secondes' },
        ],
        fields: [],
      },
    ],
  },
  {
    id: 'phase6',
    number: 6,
    title: 'Relecture et Contrôle Qualité',
    icon: 'CheckCircle',
    color: 'phase6',
    description: 'Vérifier la qualité, l\'EEAT et éliminer les éléments nuisibles',
    steps: [
      {
        id: 'step6_1',
        number: '6.1',
        title: 'Relecture orthographique et grammaticale',
        objective: 'Éliminer les erreurs de langue.',
        deliverable: 'Contenu sans erreurs de langue',
        checklist: [
          { id: 'c6_1_1', label: 'Passage dans un correcteur (Antidote, LanguageTool)' },
          { id: 'c6_1_2', label: 'Relecture manuelle effectuée' },
          { id: 'c6_1_3', label: 'Cohérence des temps vérifiée' },
          { id: 'c6_1_4', label: 'Cohérence tutoiement/vouvoiement vérifiée' },
        ],
        fields: [],
      },
      {
        id: 'step6_2',
        number: '6.2',
        title: 'Contrôle EEAT',
        objective: 'Vérifier la présence des signaux d\'Expertise, Expérience, Autorité et Confiance.',
        deliverable: 'Contenu validé EEAT',
        checklist: [
          { id: 'c6_2_1', label: 'Expertise: L\'auteur démontre une connaissance approfondie' },
          { id: 'c6_2_2', label: 'Expérience: Des exemples concrets/vécus sont partagés' },
          { id: 'c6_2_3', label: 'Autorité: Des sources fiables sont citées' },
          { id: 'c6_2_4', label: 'Confiance: Les affirmations sont vérifiables' },
        ],
        fields: [
          { id: 'eeat_notes', type: 'textarea', label: 'Notes d\'amélioration EEAT', placeholder: 'Expertise: ...\nExpérience: ...\nAutorité: ...\nConfiance: ...', rows: 6 },
        ],
      },
      {
        id: 'step6_3',
        number: '6.3',
        title: 'Vérification des éléments à bannir',
        objective: 'Éliminer les éléments nuisant à la qualité.',
        deliverable: 'Contenu nettoyé',
        checklist: [
          { id: 'c6_3_1', label: 'Pas de langage sensationnaliste ("incroyable", "révolutionnaire", "secret")' },
          { id: 'c6_3_2', label: 'Pas de voix passive excessive' },
          { id: 'c6_3_3', label: 'Pas d\'expressions vagues ("beaucoup", "souvent", "certains")' },
          { id: 'c6_3_4', label: 'Pas de promesses non étayées' },
          { id: 'c6_3_5', label: 'Pas de répétitions inutiles' },
          { id: 'c6_3_6', label: 'Pas de phrases de plus de 25 mots' },
        ],
        fields: [],
      },
    ],
  },
  {
    id: 'phase7',
    number: 7,
    title: 'Maillage Interne',
    icon: 'Link',
    color: 'phase7',
    description: 'Structurer les liens internes et vérifier les liens externes',
    steps: [
      {
        id: 'step7_1',
        number: '7.1',
        title: 'Identifier les opportunités de liens internes',
        objective: 'Renforcer la structure du site et distribuer l\'autorité.',
        deliverable: 'Liens internes intégrés + liste des pages à mettre à jour',
        checklist: [
          { id: 'c7_1_1', label: 'Minimum 2-3 liens internes identifiés' },
          { id: 'c7_1_2', label: 'Ancres descriptives (pas de "cliquez ici")' },
          { id: 'c7_1_3', label: 'Liens contextuellement pertinents' },
          { id: 'c7_1_4', label: 'Répartition naturelle dans le contenu' },
          { id: 'c7_1_5', label: 'Pages existantes à mettre à jour identifiées' },
        ],
        fields: [
          { id: 'internal_links', type: 'textarea', label: 'Liens internes prévus', placeholder: 'Terme/Concept | Page cible | Ancre prévue\n...', rows: 6 },
          { id: 'pages_to_update', type: 'textarea', label: 'Pages existantes à mettre à jour', rows: 4 },
        ],
      },
      {
        id: 'step7_2',
        number: '7.2',
        title: 'Vérifier les liens externes',
        objective: 'S\'assurer que les sources citées sont fiables.',
        deliverable: 'Liens externes validés',
        checklist: [
          { id: 'c7_2_1', label: 'Toutes les sources sont fiables (institutionnels, études, médias reconnus)' },
          { id: 'c7_2_2', label: 'Pas de liens vers des concurrents directs (sauf comparatif)' },
          { id: 'c7_2_3', label: 'Tous les liens externes ouvrent dans un nouvel onglet' },
          { id: 'c7_2_4', label: 'Toutes les pages cibles sont toujours en ligne et à jour' },
        ],
        fields: [
          { id: 'external_links', type: 'textarea', label: 'Liens externes utilisés', placeholder: 'URL | Source fiable? | Nouvel onglet? | Pertinence\n...', rows: 6 },
        ],
      },
    ],
  },
  {
    id: 'phase8',
    number: 8,
    title: 'Publication et Mesure',
    icon: 'BarChart3',
    color: 'phase8',
    description: 'Préparer la publication et définir les KPIs de suivi',
    steps: [
      {
        id: 'step8_1',
        number: '8.1',
        title: 'Checklist de publication',
        objective: 'Vérifier tous les éléments avant mise en ligne.',
        deliverable: 'Contenu prêt à publier',
        checklist: [
          { id: 'c8_1_1', label: 'Titre H1 unique et contenant le mot-clé principal' },
          { id: 'c8_1_2', label: 'Meta title rédigé (50-60 caractères)' },
          { id: 'c8_1_3', label: 'Meta description rédigée (150-160 caractères) avec CTA' },
          { id: 'c8_1_4', label: 'URL courte, descriptive, avec mot-clé' },
          { id: 'c8_1_5', label: 'Images optimisées avec alt text' },
          { id: 'c8_1_6', label: 'Liens internes fonctionnels' },
          { id: 'c8_1_7', label: 'Liens externes fonctionnels et en target="_blank"' },
          { id: 'c8_1_8', label: 'CTA présent et visible' },
          { id: 'c8_1_9', label: 'Auteur identifié (si applicable)' },
        ],
        fields: [
          { id: 'h1_title', type: 'text', label: 'Titre H1' },
          { id: 'meta_title', type: 'text', label: 'Meta title (50-60 car.)', maxLength: 60 },
          { id: 'meta_description', type: 'textarea', label: 'Meta description (150-160 car.)', maxLength: 160, rows: 2 },
          { id: 'target_url', type: 'text', label: 'URL de publication' },
          { id: 'author', type: 'text', label: 'Auteur' },
          { id: 'publication_date', type: 'date', label: 'Date de publication' },
        ],
      },
      {
        id: 'step8_2',
        number: '8.2',
        title: 'Définir les KPIs de mesure',
        objective: 'Associer chaque contenu à des objectifs mesurables.',
        deliverable: 'Fiche de suivi avec KPIs définis',
        checklist: [
          { id: 'c8_2_1', label: 'KPIs définis selon l\'objectif principal' },
          { id: 'c8_2_2', label: 'Points de contrôle planifiés (J+7, J+30, J+90)' },
          { id: 'c8_2_3', label: 'Objectif SMART documenté' },
        ],
        fields: [
          { id: 'main_objective', type: 'select', label: 'Objectif principal', options: [
            { id: 'visibility', label: 'Visibilité SEO' },
            { id: 'traffic', label: 'Trafic' },
            { id: 'engagement', label: 'Engagement' },
            { id: 'conversion', label: 'Conversion' },
          ]},
          { id: 'kpis', type: 'textarea', label: 'KPIs à suivre', placeholder: 'Position moyenne: ...\nImpressions: ...\nSessions: ...\nTaux de conversion: ...', rows: 6 },
          { id: 'smart_objective', type: 'textarea', label: 'Objectif SMART', placeholder: 'Spécifique: ...\nMesurable: ...\nAtteignable: ...\nRéaliste: ...\nTemporel: ...', rows: 6 },
        ],
      },
    ],
  },
];

// Helper pour calculer la progression
export const calculateProgress = (projectData, phases = PHASES) => {
  let totalChecks = 0;
  let completedChecks = 0;

  phases.forEach(phase => {
    phase.steps.forEach(step => {
      step.checklist.forEach(check => {
        totalChecks++;
        if (projectData?.checklist?.[check.id]) {
          completedChecks++;
        }
      });
    });
  });

  return totalChecks > 0 ? Math.round((completedChecks / totalChecks) * 100) : 0;
};

// Helper pour calculer la progression d'une phase
export const calculatePhaseProgress = (projectData, phase) => {
  let totalChecks = 0;
  let completedChecks = 0;

  phase.steps.forEach(step => {
    step.checklist.forEach(check => {
      totalChecks++;
      if (projectData?.checklist?.[check.id]) {
        completedChecks++;
      }
    });
  });

  return totalChecks > 0 ? Math.round((completedChecks / totalChecks) * 100) : 0;
};

// Helper pour calculer la progression d'une étape
export const calculateStepProgress = (projectData, step) => {
  let totalChecks = step.checklist.length;
  let completedChecks = 0;

  step.checklist.forEach(check => {
    if (projectData?.checklist?.[check.id]) {
      completedChecks++;
    }
  });

  return totalChecks > 0 ? Math.round((completedChecks / totalChecks) * 100) : 0;
};
