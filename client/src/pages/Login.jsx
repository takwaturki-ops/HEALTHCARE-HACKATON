/**
 * ============================================================
 *  pages/Login.jsx : la page de connexion (route /login)
 * ============================================================
 *
 * RÔLE
 *   Affiche un formulaire email + mot de passe. À l'envoi, appelle login()
 *   du contexte (AuthContext), qui contacte le backend et enregistre la
 *   session. Puis redirige l'utilisateur vers /dashboard.
 *
 * LES ÉTATS DU COMPOSANT (useState)
 *   email, password -> ce que l'utilisateur tape (formulaire "contrôlé")
 *   error           -> message d'erreur affiché en rouge (ou chaîne vide)
 *   submitting      -> true pendant l'appel au backend (désactive le bouton
 *                      pour éviter un double envoi)
 *
 * LE DÉROULEMENT
 *   1. L'utilisateur remplit le formulaire et clique sur "Se connecter".
 *   2. handleSubmit vérifie que les champs sont remplis.
 *   3. login(email, password) -> POST /api/auth/login (via AuthContext).
 *   4. Succès : redirection vers la page demandée avant la connexion
 *      (location.state.from, mis par ProtectedRoute) ou, par défaut, /dashboard.
 *   5. Échec : on affiche le message du backend (ex. "Mot de passe
 *      incorrect") ou un message générique si le serveur est injoignable.
 *
 * SI L'UTILISATEUR EST DÉJÀ CONNECTÉ
 *   On le renvoie directement vers /dashboard (inutile de revoir le login).
 *
 * LIEN VERS L'INSCRIPTION
 *   Un lien mène vers /register-hopital pour les hôpitaux sans compte.
 *
 * STYLE
 *   Classes Tailwind (couleur principale cyan-700, comme dans le design
 *   system du plan). Sans Tailwind configuré, la page fonctionne mais
 *   s'affiche sans mise en forme.
 */

import { useState } from 'react';
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const { login, token, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  // Page à ouvrir après la connexion : celle demandée au départ, sinon le dashboard
  const redirectTo = location.state?.from?.pathname || '/dashboard';

  // Déjà connecté : pas besoin de ce formulaire
  if (!loading && token) {
    return <Navigate to={redirectTo} replace />;
  }

  async function handleSubmit(event) {
    event.preventDefault(); // empêche le rechargement de la page
    setError('');

    if (!email.trim() || !password) {
      setError('Veuillez saisir votre email et votre mot de passe.');
      return;
    }

    setSubmitting(true);
    try {
      await login(email.trim(), password);
      navigate(redirectTo, { replace: true });
    } catch (err) {
      const backendMessage = err.response?.data?.message || err.response?.data?.error;
      if (backendMessage) {
        setError(backendMessage);
      } else if (!err.response) {
        setError('Impossible de joindre le serveur. Réessayez plus tard.');
      } else {
        setError('Connexion impossible. Vérifiez vos identifiants.');
      }
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4">
      <div className="w-full max-w-md bg-white rounded-xl shadow-sm border border-slate-200 p-8">
        <h1 className="text-2xl font-bold text-slate-900 mb-1">Connexion hôpital</h1>
        <p className="text-sm text-slate-500 mb-6">
          Connectez-vous pour publier et gérer vos besoins.
        </p>

        <form onSubmit={handleSubmit} noValidate className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-1">
              Email
            </label>
            <input
              id="email"
              type="email"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-lg border border-slate-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-cyan-700"
              placeholder="contact@hopital.ma"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-slate-700 mb-1">
              Mot de passe
            </label>
            <input
              id="password"
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-lg border border-slate-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-cyan-700"
              placeholder="••••••••"
            />
          </div>

          {error && (
            <p role="alert" className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={submitting}
            className="w-full rounded-lg bg-cyan-700 text-white font-medium py-2 hover:bg-cyan-800 disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {submitting ? 'Connexion...' : 'Se connecter'}
          </button>
        </form>

        <p className="text-sm text-slate-600 mt-6 text-center">
          Pas encore de compte ?{' '}
          <Link to="/register-hopital" className="text-cyan-700 font-medium hover:underline">
            Inscrire mon hôpital
          </Link>
        </p>
      </div>
    </div>
  );
}