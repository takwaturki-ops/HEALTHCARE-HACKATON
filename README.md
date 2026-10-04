# HospiStock - Plateforme des Manques Hospitaliers

Site web qui centralise **tous les manques des hopitaux** : machines, groupes sanguins, medicaments, consommables.

Chaque manque affiche : details + quantite + urgence + prix estime + hopital + ville + localisation + contact.

## Stack

- **Frontend :** React + Vite + TailwindCSS + React Router + Leaflet (OpenStreetMap)
- **Backend :** Node.js + Express + Prisma + PostgreSQL + JWT
- **Modele :** Les hopitaux publient, le public voit et contacte.

## Fonctionnalites MVP

- [ ] Auth JWT : role HOPITAL + ADMIN, visiteur public sans compte
- [ ] CRUD Besoins + profil Hopitaux
- [ ] Accueil : liste + recherche + filtres (ville / type / urgence / groupe sanguin)
- [ ] Detail besoin : prix, quantite, hopital, carte, bouton WhatsApp / telephone
- [ ] Dashboard hopital : mes besoins, changer statut (OUVERT / PARTIEL / RESOLU)
- [ ] Carte : pins des hopitaux en manque
- [ ] Stats : nb besoins ouverts, critiques, par ville / type

## Pages Frontend (5 seulement)

1. `Home (/ )` - hero + stats + filtres + grille de besoins
2. `Detail (/needs/:id)` - fiche complete : prix + lieu + hopital + contact
3. `Carte (/map)` - grande carte + liste laterale
4. `Login (/login)` + `Register (/register-hopital)` - connexion hopital
5. `Dashboard (/dashboard)` - tableau mes besoins + `New (/dashboard/new)` + `Edit (/dashboard/edit/:id)`

## Composants (6 seulement)

- `Navbar` - logo + liens + compteur critiques + Login / Dashboard
- `NeedCard` - carte liste : badge urgence, icone type, prix, quantite, ville
- `Filters` - search + selects ville / type / urgence / groupe sanguin + reset
- `UrgencyBadge` - CRITIQUE (rouge) / HAUTE (orange) / NORMALE (vert)
- `MapView` - wrapper Leaflet
- `ProtectedRoute` - bloque /dashboard si pas connecte

## Repartition des taches

### Personne A - Liste + Detail

- [ ] Setup : Vite + Tailwind + Router + `src/api/client.js` (axios avec baseURL + token)
- [ ] `Navbar`, `UrgencyBadge`, `NeedCard`, `Filters`, `Home`
- [ ] `NeedDetail` : tableau infos + prix estime + card hopital + bouton WhatsApp + mini-carte
- [ ] Brancher API : `GET /api/needs?city=&type=&urgency=&bloodGroup=&search=` + `GET /api/needs/:id`

### Personne B - Auth + Publier + Carte

- [ ] `AuthContext` (user, token, login, logout, localStorage) + `Login` + `RegisterHopital` + `ProtectedRoute`
- [ ] `Dashboard` : tableau (titre / type / qty / urgence / prix / statut dropdown) + actions edit / delete
- [ ] Formulaire `AddEditNeed` : type, titre, description, quantite + unite, urgence, prix, groupe sanguin si SANG
- [ ] `MapPage` (Leaflet full) + page `Hospitals` simple
- [ ] Brancher API : `POST /api/auth/login`, `POST /api/auth/register-hopital`, `POST / PATCH / DELETE /api/needs`
- [ ] Deploy frontend sur Vercel (`VITE_API_URL` = URL backend Render)

## Ordre de travail

- **J1-J2 :** Backend ensemble (Prisma schema + Auth + CRUD needs + seed 30 besoins)
- **J3 :** A fait setup + Home mock, B fait Auth + Login mock
- **J4 :** A branche liste + detail reel, B branche dashboard + formulaire reel
- **J5 :** A polish responsive + stats, B carte + fix + deploy
- **J6-J7 :** Tests, donnees demo reelles, repetition pitch 3 min

> Regle : ne codez jamais le meme fichier en meme temps.

## Lancer le frontend

```bash
cd client
npm install
npm run dev
```

`.env` frontend :

```env
VITE_API_URL=http://localhost:5000/api
```

## API Backend attendue

```text
POST /api/auth/register-hopital
POST /api/auth/login -> { token }
GET  /api/hospitals
GET  /api/needs?city=Casa&type=SANG&urgency=CRITIQUE&bloodGroup=O-&search=scanner
GET  /api/needs/:id
POST /api/needs (auth HOPITAL)
PATCH /api/needs/:id (auth owner)
PATCH /api/needs/:id/status (auth owner)
DELETE /api/needs/:id
GET  /api/stats
```

## Scenario demo (3 min)

1. Chercher `O-` critique a Casa -> montrer liste filtree
2. Ouvrir fiche -> montrer prix + localisation + contact WhatsApp
3. Login hopital -> publier manque scanner -> apparait dans liste + carte
4. Montrer carte + stats
