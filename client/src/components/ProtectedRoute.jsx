/**rotectedRoute protège l'affichage, pas les données. La vraie sécurité se fait côté backend.
 * ============================================================
 *  components/ProtectedRoute.jsx : le "videur" des pages privées
 * ============================================================
 *
 * RÔLE
 *   Ce composant protège une page : si l'utilisateur n'est pas connecté,
 *   il est renvoyé vers /login. S'il est connecté, la page s'affiche.
 *
 * COMMENT L'UTILISER (dans App.jsx)
 *   <Route
 *     path="/dashboard"
 *     element={
 *       <ProtectedRoute>
 *         <DashboardHopital />
 *       </ProtectedRoute>
 *     }
 *   />
 *   -> tout ce qui est écrit entre <ProtectedRoute> et </ProtectedRoute>
 *      (les "children") n'est affiché que pour un utilisateur connecté.
 *
 * LES 3 CAS
 *   1. loading = true  -> on vérifie encore le token auprès du backend
 *                         (AuthContext) : on affiche "Chargement..." et on
 *                         ne redirige PAS (sinon on serait renvoyé vers
 *                         /login à chaque rechargement de page).
 *   2. pas de token    -> <Navigate to="/login" replace /> : redirection.
 *                         "replace" remplace la page actuelle dans
 *                         l'historique, donc le bouton "retour" du navigateur
 *                         ne ramène pas sur la page interdite.
 *   3. token présent   -> on affiche les children.
 *
 * REDIRECTION APRÈS LOGIN
 *   On mémorise la page demandée dans state={{ from: location }}.
 *   Login.jsx pourra la relire (useLocation().state?.from) pour renvoyer
 *   l'utilisateur là où il voulait aller. C'est optionnel : sans ça, il
 *   ira simplement sur /dashboard.
 *
 * LIMITE IMPORTANTE
 *   Ce composant protège seulement l'AFFICHAGE côté navigateur. La vraie
 *   sécurité reste côté backend : chaque route privée doit vérifier le token.
 */

import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function ProtectedRoute({ children }) {
  const { token, loading } = useAuth();
  const location = useLocation();

  // Cas 1 : vérification du token en cours
  if (loading) {
    return <p style={{ padding: '2rem', textAlign: 'center' }}>Chargement...</p>;
  }

  // Cas 2 : pas connecté -> retour vers la page de connexion
  if (!token) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  // Cas 3 : connecté -> on affiche la page protégée
  return children;
}
