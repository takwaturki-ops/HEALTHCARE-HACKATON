/**
 * ============================================================
 *  api/auth.api.js : les appels d'authentification vers le backend
 * ============================================================
 *
 * RÔLE
 *   Ce fichier regroupe toutes les requêtes liées à la connexion et à
 *   l'inscription. Il utilise l'instance axios de ./client.js, qui ajoute
 *   déjà l'adresse du backend et le token : ici, on n'a donc qu'à écrire
 *   le chemin de chaque route.
 *
 * FONCTIONS EXPORTÉES
 *   login(email, password)
 *     -> POST /api/auth/login
 *     -> renvoie ce que le backend répond (attendu : { token, user })
 *
 *   registerHopital(data)
 *     -> POST /api/auth/register-hopital
 *     -> "data" = { nom, ville, adresse, telephone, lat, lng, email, password }
 *     -> renvoie la réponse du backend (attendu : { token, user })
 *
 *   me()
 *     -> GET /api/auth/me
 *     -> renvoie l'utilisateur correspondant au token actuel
 *     -> utilisé au rechargement de la page pour retrouver qui est connecté
 *
 * QUI LES UTILISE ?
 *   context/AuthContext.jsx appelle ces fonctions ; les pages (Login.jsx,
 *   RegisterHopital.jsx) passent par le contexte et jamais directement ici.
 *
 * ERREURS
 *   Si le backend répond par une erreur (400, 401, 500...), axios la lève :
 *   l'appelant doit utiliser try/catch pour afficher un message.
 *
 * À VÉRIFIER AVEC LE BACKEND
 *   Les noms des champs envoyés dans registerHopital (nom, ville, adresse,
 *   telephone, lat, lng...) doivent correspondre à ceux que le backend attend.
 */

import client from './client';

// Connexion : envoie email + mot de passe, renvoie { token, user }
export async function login(email, password) {
  const response = await client.post('/auth/login', { email, password });
  return response.data;
}

// Inscription d'un hôpital : "data" contient nom, ville, adresse, téléphone, lat/lng, email, password
export async function registerHopital(data) {
  const response = await client.post('/auth/register-hopital', data);
  return response.data;
}

// Récupère l'utilisateur connecté à partir du token (utile au rechargement de la page)
export async function me() {
  const response = await client.get('/auth/me');
  return response.data;
}