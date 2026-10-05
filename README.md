📅 PLAN 7 JOURS - HEALTHCARE HACKATON
État actuel : Projet bien structuré, ~80% fait
- ✅ Auth (login/register JWT), Protected routes
- ✅ Dashboard hôpital (CRUD besoins complet)
- ✅ Pages publiques : Map, Hospitals, NeedDetail
- ✅ Mock API avec switch USE_MOCK
- ✅ UI Kit complet (Button, Input, Select, Modal, Toast, Card, Badge, Avatar, SearchInput)
- ✅ Tailwind v4 + Vite + React Router
JOUR 1 - Home Page "Dashboard Public" + Recherche Avancée 🎯
Objectif : Transformer Home.jsx en vraie page d'accueil moderne avec filtres, recherche, pagination
Tâche	Détail
1.1	Intégrer SearchInput (autocomplete hôpitaux) dans Home
1.2	Ajouter filtres : Type, Urgence, Groupe sanguin, Ville (Select multiples)
1.3	Ajouter tri (date, urgence, ville) + pagination (10/25/50 par page)
1.4	Stats cards réutilisables (StatsCards existant)
1.5	Tableau responsive avec actions (voir détails, partager)
1.6	État vide / loading / error states soignés
1.7	Persistance filtres dans URL (shareable links)
Livrable : Page d'accueil fonctionnelle, filtrable, paginée, partageable
JOUR 2 - Backend Réel + Connexion API 🔌
Objectif : Basculer USE_MOCK = false et connecter le vrai backend
Tâche	Détail
2.1	Vérifier endpoints backend attendus vs api/index.js
2.2	Configurer .env (VITE_API_URL)
2.3	Tester chaque endpoint : auth, needs, hospitals, stats
2.4	Gérer erreurs 401/403/500 globalement (intercepteur)
2.5	Upload fichiers (si besoin : images besoins, documents)
2.6	Variables d'env pour prod (Render/Vercel)
Livrable : Front 100% connecté au backend réel, mocks désactivés
JOUR 3 - Temps Réel + Notifications ⚡
Objectif : Auto-refresh, WebSocket/SSE, notifications push
Tâche	Détail
3.1	Auto-refresh dashboard (polling 30s + focus/visibility API)
3.2	WebSocket / SSE pour notifications temps réel (nouveaux besoins)
3.3	Badge notification dans Navbar (compteur non lus)
3.4	Toast pour événements temps réel (nouveau besoin critique)
3.5	Indicateur "en ligne" / "dernière MAJ"
Livrable : Dashboard vivant, notifications instantanées
JOUR 4 - Tests + Accessibilité + Qualité ✅
Objectif : Code robuste, accessible, sans régression
Tâche	Détail
4.1	Tests unitaires (Vitest) : hooks, utils, composants purs
4.2	Tests d'intégration : login, CRUD besoins, filtres
4.3	Tests E2E critiques : auth flow, dashboard, map
4.4	Accessibilité (a11y) : ARIA, focus, contraste, clavier
4.5	Lint + TypeCheck (ESLint, TypeScript si migration)
4.6	Couverture de code > 70%
Livrable : CI verte, tests passants, a11y score > 90
JOUR 5 - Fonctionnalités Avancées + Admin 🛠️
Objectif : Features "nice to have" qui font la différence
Tâche	Détail
5.1	Export PDF/Excel des besoins (dashboard)
5.2	Partage lien besoin (QR code + réseaux sociaux)
5.3	Mode sombre (toggle + persistance localStorage)
5.4	Page Admin (si rôle ADMIN) : gestion hôpitaux, users, stats globales
5.5	Historique / audit logs (qui a fait quoi)
5.6	Raccourcis clavier (Cmd+K recherche, N nouveau besoin)
Livrable : Features pro, exports, dark mode, shortcuts
JOUR 6 - Performance + PWA + SEO 🚀
Objectif : App rapide, installable, bien référencée
Tâche	Détail
6.1	Code splitting (React.lazy + Suspense) routes lourdes
6.2	Optimisation bundle (analyse + tree-shaking)
6.3	Images : WebP, lazy loading, responsive
6.4	PWA : manifest, service worker, offline-first
6.5	SEO : meta tags, Open Graph, sitemap, robots.txt
6.6	Core Web Vitals : LCP < 2.5s, CLS < 0.1, FID < 100ms
Livrable : Score Lighthouse > 90, PWA installable, SEO ready
JOUR 7 - Déploiement + Doc + Démo 🚢
Objectif : En production, documenté, prêt pour le jury
Tâche	Détail
7.1	Build production (npm run build) + test local npm run preview
7.2	Déployer frontend (Vercel/Netlify) + backend (Render/Railway)
7.3	Configurer domaine custom + HTTPS + headers sécurité (CSP, HSTS)
7.4	Variables d'env prod + secrets (pas dans le repo)
7.5	README complet : architecture, installation, API, deploy
7.6	Guide utilisateur (hôpital) + Guide admin (1-2 pages)
7.7	Vidéo démo 2-3 min + captures d'écran pour le pitch
7.8	Répétition pitch + gestion Q&A
Livrable : App en prod + Doc complète + Demo prête
⚠️ DÉPENDANCES CRITIQUES (à valider AVANT Jour 1)
Question
Backend existe-t-il ? (URL, endpoints, auth)
Base de données ? (PostgreSQL/Mongo, migrations)
Hébergement choisi ? (Vercel/Netlify + Render/Railway)
Équipe ? (Solo ? 2-3 dev ?)
Deadline réelle ? (7 jours calendaires ou ouvrés ?)
