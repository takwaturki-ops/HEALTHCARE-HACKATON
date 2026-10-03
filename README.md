     Plan Frontend Détaillé - HospiStock (React + Vite)
Objectif : public voit les manques, hôpital publie. Démo en 3 min doit choquer : liste + filtres + fiche prix/lieu + carte + dashboard.
1. Stack exacte à figer J3 matin
Vite + React 18 + React Router v6
TailwindCSS + shadcn-style maison (pas full shadcn, trop long)
Axios + Leaflet + react-leaflet + OpenStreetMap (gratuit, pas de clé Google)
Recharts (stats homepage) - optionnel J6
lucide-react (icônes)
Pas de Redux. Context Auth + useState/useEffect suffit pour 1 semaine.
Commandes setup (à faire quand vous passez en build) :
npm create vite@latest client -- --template react, npm i react-router-dom axios leaflet react-leaflet lucide-react, npm i -D tailwindcss postcss autoprefixer + tailwind init
2. Arborescence à respecter
client/src/
  api/client.js        // axios baseURL + interceptor token
  api/needs.api.js     // getNeeds(filters), getNeed(id), createNeed, updateStatus
  api/auth.api.js      // login, registerHopital, me
  context/AuthContext.jsx // user, token, login/logout, localStorage
  components/
    Navbar.jsx         // logo + liens + bouton Login/Dashboard + badge critique
    NeedCard.jsx       // carte liste : badge urgence, type icône, prix, qty, ville, hôpital
    Filters.jsx        // search + selects ville/type/urgence/groupe sanguin + reset
    UrgencyBadge.jsx   // CRITIQUE=rouge pulsant, HAUTE=orange, NORMALE=vert
    HospitalCard.jsx
    MapView.jsx        // wrapper Leaflet
    StatsBar.jsx       // 4 chiffres : critiques, hôpitaux, poches sang, machines
    ProtectedRoute.jsx
  pages/
    Home.jsx           // hero + StatsBar + Filters + grille NeedCard + CTA carte
    NeedDetail.jsx     // fiche complète
    MapPage.jsx        // full carte + liste latérale
    Hospitals.jsx      // liste hôpitaux (optionnel mais impressionne jury)
    Login.jsx / RegisterHopital.jsx
    DashboardHopital.jsx // mes besoins + changer statut + stats perso
    AddEditNeed.jsx    // formulaire
  hooks/useNeeds.js    // fetch + loading/error
3. Routes
/ -> Home
/needs/:id -> NeedDetail
/map -> MapPage
/hospitals -> Hospitals
/login, /register-hopital
/dashboard -> Protected HOPITAL (liste mes besoins)
/dashboard/new + /dashboard/edit/:id -> Protected
ProtectedRoute.jsx : si pas de token -> redirect /login.
4. Détail page par page (quoi coder exactement)
A. Navbar.jsx
Logo + Accueil | Carte | Hôpitaux + compteur 🔴 X critiques (appel /api/stats) + si connecté : Dashboard + Logout sinon Connexion Hôpital (CTA). Mobile : hamburger.
B. Home.jsx - la page jury
1. Hero : Titre "Tous les manques des hôpitaux en temps réel", sous-titre, 2 boutons : Voir les besoins + Voir la carte. Fond blanc/bleu médical.
2. StatsBar.jsx : 4 cards : Besoins ouverts, Critiques, Hôpitaux partenaires, Dons potentiels.
3. Filters.jsx props : filters, setFilters :
- search text (titre/hôpital)
- city select Casa, Rabat, Marrakech, Fès, Agadir, Tanger...
- type select MACHINE, SANG, MEDICAMENT, CONSOMMABLE
- urgency select CRITIQUE, HAUTE, NORMALE
- bloodGroup select O-, O+, A+, ... visible seulement si type=SANG
- Bouton Reset. Appel API debounced 300ms : GET /api/needs?search=&city=&type=&...
4. Grille NeedCard : responsive 1col mobile, 2col tablet, 3col desktop. Skeleton loading + empty state "Aucun besoin - modifiez filtres".
5. Section urgence : bandeau rouge top 3 critiques.
C. NeedCard.jsx
Contenu : icône type (Heart pour SANG, Stethoscope/CPU pour MACHINE, Pill pour MEDICAMENT), UrgencyBadge, titre, hôpital + ville avec MapPin, Quantité: 10 poches, Prix estimé: 5000 MAD, footer Voir détails -> + date il y a 2h. Click -> /needs/:id. Couleur bordure gauche selon urgence.
D. NeedDetail.jsx - le coeur du sujet (prix + lieu)
Layout 2 colonnes desktop :
- Gauche : titre + badges, description complète, tableau infos : Type, Groupe sanguin si applicable, Quantité + unité, Urgence, Prix estimé MAD (gros), Statut, Date publication.
- Droite (sticky) : Card Hôpital : nom, adresse, ville, téléphone cliquable tel:, bouton WhatsApp https://wa.me/212...?text=Je peux aider pour [titre], mini-map Leaflet centrée lat/lng hôpital + bouton Voir sur grande carte.
- Bas : Besoins similaires même ville (3 cards).
- Si owner connecté : boutons Modifier / Marquer résolu.
E. MapPage.jsx
Split : 60% carte Leaflet, 40% liste. Pins colorés par urgence max de l'hôpital. Popup : nom hôpital + nb besoins + bouton détail. Filtres réduits (ville + type) qui filtrent pins. Utiliser OpenStreetMap tiles, pas besoin clé API. Centre défaut [31.7917, -7.0926] zoom 6.
F. Login.jsx / RegisterHopital.jsx
Login : email+password -> POST /api/auth/login -> stocke token + user dans AuthContext + localStorage -> redirect /dashboard. Register : formulaire hôpital complet (nom, ville select, adresse, phone, lat/lng optionnel avec bouton "prendre ma position", email, password) -> POST /api/auth/register-hopital.
G. DashboardHopital.jsx
Header : nom hôpital + stats perso (ouverts/critiques/résolus). Tableau : Titre | Type | Qty | Urgence (select inline pour changer) | Prix | Statut dropdown OUVERT/PARTIEL/RESOLU -> PATCH /api/needs/:id/status | Actions edit/delete. Bouton + Nouveau besoin.
H. AddEditNeed.jsx
Form contrôlé avec validation front simple :
type* select, title* (min 5), description* textarea, quantity* number>0 + unit select [poche, boîte, pièce, litre], urgency* , estimatedPrice number MAD, bloodGroup* si SANG, imageUrl optionnel. Submit -> POST/PATCH -> toast + redirect dashboard. Pré-remplir en mode edit via GET /api/needs/:id.
5. Design System (pour aller vite à 2)
- Couleurs : primary: #0E7490 (cyan-700 médical), danger: #DC2626, warning: #EA580C, success: #16A34A, bg: #F8FAFC, card: white
- Tailwind : rounded-xl shadow-sm border, UrgencyBadge réutilisé partout.
- Typo : Inter système, titres font-bold text-slate-900.
- Pas de dark mode pour MVP.
6. API client + Auth (détail technique)
api/client.js :
axios.create({baseURL: import.meta.env.VITE_API_URL}) // http://localhost:5000/api en dev, URL Render en prod
interceptor: Authorization: Bearer token from localStorage
AuthContext.jsx : user, token, login(email,pass), logout(), isHopital. Persist localStorage. Au reload, GET /api/auth/me pour rehydrater.
Gestion erreurs : 401 -> logout + redirect login, 404 Need -> page "Besoin introuvable".
7. Ordre de codage conseillé (J3-J5)
J3 PM (A) : setup Vite+Tailwind+Router+client.js+AuthContext+Navbar+Home squelette + Filters mock.
J3 PM (B) : NeedCard + UrgencyBadge + useNeeds + branchement GET /needs réel.
J4 AM : NeedDetail + MapView mini + boutons contact.
J4 PM : Login/Register + ProtectedRoute + Dashboard tableau + AddEditNeed formulaire.
J5 AM : MapPage full + Hospitals page + StatsBar.
J5 PM : responsive, loading/empty states, seed visuel, deploy Vercel (VITE_API_URL vers backend Render).
Règle binôme : ne codez jamais le même fichier en même temps, découpez par composants ci-dessus.
8. Checklist démo-proof
- Filtres combinés marchent (ville+Casa + SANG + O-)
- Prix toujours affiché, même Non renseigné si null
- Carte ne crash pas si lat/lng null -> fallback ville
- Token expiré -> message clair
- Mobile : grille 1 col, carte hauteur 60vh
- 30 seeds avec images pour pas avoir page vide
Voulez-vous que je vous prépare ensuite : le contenu exact de client.js + AuthContext + Filters.jsx + NeedCard.jsx prêts à coller pour démarrer J3 ?
▣  Plan · Muse Spark 1.3 Free · 19.4s
je veux un plan siimple de front et divise les taches en deux
Thought · 94ms
Plan Frontend Simple - 2 personnes
Stack: React + Vite + Tailwind + React Router
Pages (5 seulement)
1. Home - liste + recherche + filtres
2. Détail - prix + hôpital + lieu + contact
3. Carte - pins hôpitaux
4. Login - connexion hôpital
5. Dashboard - publier / modifier / clôturer besoin
Composants (6 seulement)
Navbar, NeedCard, Filters, UrgencyBadge, MapView, ProtectedRoute
Division
Personne A - Liste + Détail :
- Setup Vite + Tailwind + Router + api/client.js (axios)
- Navbar, Home, Filters (ville / type / urgence / sang / search), NeedCard, UrgencyBadge
- NeedDetail : tableau infos + prix + card hôpital + bouton WhatsApp + mini-carte
- Branchement GET /api/needs + GET /api/needs/:id
Personne B - Auth + Publier + Carte :
- AuthContext + Login + RegisterHopital + ProtectedRoute
- Dashboard (tableau mes besoins + statut OUVERT/PARTIEL/RESOLU) + formulaire AddEditNeed
- MapPage full Leaflet + page Hospitals simple
- Branchement POST /auth/login, POST/PATCH /needs, deploy Vercel
Ordre
J3: A fait setup + Home mock, B fait Auth + Login mock
J4: A branche liste + détail réel, B branche dashboard + formulaire réel
J5: A polish responsive + stats, B carte + fix + deploy
Règle : ne touchez pas le même fichier en même temps. API baseURL dans .env : VITE_API_URL.
