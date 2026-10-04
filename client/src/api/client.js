
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