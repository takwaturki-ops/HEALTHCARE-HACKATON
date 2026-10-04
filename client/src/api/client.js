/**
 * ============================================================
 *  api/client.js : le "tuyau" entre le front (React) et le backend
 * ============================================================
 *
 * RÔLE
 *   Ce fichier crée UNE SEULE instance axios, préconfigurée, que toutes les
 *   autres parties du front utilisent pour parler au backend. Les pages et
 *   composants n'appellent jamais axios directement : ils passent par ce
 *   fichier (via api/auth.api.js, api/needs.api.js, etc.).
 *
 * CE QUE FAIT CE FICHIER
 *   1. Il définit l'adresse du backend (baseURL) à partir de la variable
 *      VITE_API_URL du fichier client/.env. Si elle n'existe pas, il utilise
 *      http://localhost:5000/api (backend en local).
 *      -> En production (Render), on change juste la variable, pas le code.
 *
 *   2. Intercepteur de REQUÊTE (avant chaque envoi) :
 *      il lit le token dans localStorage (clé "token") et, s'il existe,
 *      l'ajoute dans l'en-tête  Authorization: Bearer <token>.
 *      -> Le backend sait ainsi qui est connecté, sans qu'on ait à ajouter
 *         le token à la main dans chaque appel.
 *
 *   3. Intercepteur de RÉPONSE (après chaque réponse) :
 *      si le backend répond 401 (token absent, invalide ou expiré),
 *      on supprime "token" et "user" du localStorage puis on redirige vers
 *      /login. Exception : pour les requêtes de login et d'inscription,
 *      on ne redirige pas, car un 401 y signifie "mauvais mot de passe" et
 *      la page Login doit pouvoir afficher ce message d'erreur.
 *
 * COMMENT L'UTILISER (dans un autre fichier)
 *   import client from './client';
 *   const response = await client.post('/auth/login', { email, password });
 *   // -> envoie POST http://localhost:5000/api/auth/login
 *
 * À SAVOIR
 *   - Le token est stocké dans localStorage sous la clé "token" et l'utilisateur
 *     sous la clé "user" : AuthContext.jsx doit utiliser exactement ces noms.
 *   - Les erreurs sont renvoyées (Promise.reject) : les pages peuvent les
 *     attraper avec try/catch pour afficher un message à l'utilisateur.
 *   - Avec Vite, une variable d'environnement doit commencer par VITE_
 *     pour être accessible dans le code du navigateur.
 *   - Après toute modification de client/.env, il faut redémarrer
 *     "npm run dev".
 */


import axios from 'axios';

// URL de l'API : définie dans client/.env (VITE_API_URL), avec une valeur par défaut pour le dev local
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const client = axios.create({
  baseURL: API_URL,
  headers: { 'Content-Type': 'application/json' },
});

// Avant chaque requête : ajoute le token s'il existe
client.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Après chaque réponse : si le token est refusé (401), on déconnecte et on renvoie vers /login
client.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;
    const url = error.config?.url || '';
    const isAuthRequest = url.includes('/auth/login') || url.includes('/auth/register-hopital');

    // On ne redirige pas pour un mauvais mot de passe : la page Login doit afficher l'erreur
    if (status === 401 && !isAuthRequest) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      if (window.location.pathname !== '/login') {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export default client;