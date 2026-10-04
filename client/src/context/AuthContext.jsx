/**CONTEXT : C'est le nom d'une fonctionnalité de React : React Context. Elle sert à partager une donnée avec toute l'appli sans la passer de composant en composant
 * ============================================================
 *  context/AuthContext.jsx : la "mémoire" de l'utilisateur connecté
 * ============================================================
 *
 * RÔLE
 *   Ce fichier garde en mémoire, pour TOUTE l'application, qui est connecté.
 *   Grâce à React Context, n'importe quelle page ou composant peut savoir
 *   si quelqu'un est connecté, sans qu'on se passe l'information de parent
 *   en enfant (props).
 *
 * CE QUE LE CONTEXTE FOURNIT (via le hook useAuth)
 *   user            -> l'utilisateur connecté (objet) ou null
 *   token           -> le token JWT ou null
 *   loading         -> true pendant la vérification initiale du token
 *                      (évite de rediriger vers /login avant d'avoir vérifié)
 *   isHopital       -> true si user.role vaut "HOPITAL"
 *   login(email, password)       -> connecte l'utilisateur
 *   registerHopital(data)        -> inscrit un hôpital puis le connecte
 *   logout()                     -> déconnecte l'utilisateur
 *
 * PERSISTANCE
 *   Le token et l'utilisateur sont copiés dans localStorage (clés "token" et
 *   "user", les mêmes que dans api/client.js). Ainsi, un rechargement de la
 *   page ne déconnecte pas l'utilisateur.
 *
 * AU CHARGEMENT DE L'APPLICATION (useEffect)
 *   S'il y a un token, on appelle GET /api/auth/me pour vérifier qu'il est
 *   encore valide et récupérer les infos à jour. S'il est refusé, on nettoie
 *   tout et l'utilisateur est considéré comme déconnecté.
 *
 * COMMENT L'UTILISER (dans un composant)
 *   import { useAuth } from '../context/AuthContext';
 *   const { user, login, logout, isHopital } = useAuth();
 *
 * À METTRE EN PLACE DANS App.jsx
 *   L'application entière doit être entourée par <AuthProvider> :
 *   <AuthProvider> ...routes... </AuthProvider>
 *
 * À VÉRIFIER AVEC LE BACKEND
 *   - la réponse de login/register doit contenir { token, user }
 *   - la réponse de /auth/me doit contenir l'utilisateur (directement,
 *     ou dans un champ "user")
 *   - le champ "role" de l'utilisateur doit valoir "HOPITAL" pour un hôpital
 */

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import * as authApi from '../api/auth.api';

const AuthContext = createContext(null);

// Lit l'utilisateur sauvegardé (JSON) sans planter si le contenu est invalide
function readStoredUser() {
  try {
    const raw = localStorage.getItem('user');
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem('token'));
  const [user, setUser] = useState(() => readStoredUser());
  // Si on a un token, on attend la vérification avant de décider si l'utilisateur est connecté
  const [loading, setLoading] = useState(() => Boolean(localStorage.getItem('token')));

  // Enregistre la session (état React + localStorage)
  const saveSession = useCallback((newToken, newUser) => {
    localStorage.setItem('token', newToken);
    localStorage.setItem('user', JSON.stringify(newUser));
    setToken(newToken);
    setUser(newUser);
  }, []);

  // Efface la session (état React + localStorage)
  const clearSession = useCallback(() => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setToken(null);
    setUser(null);
  }, []);

  // Au montage : si un token existe, on vérifie qu'il est toujours valide
  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    if (!storedToken) {
      setLoading(false);
      return;
    }

    let cancelled = false;

    authApi
      .me()
      .then((data) => {
        if (cancelled) return;
        const currentUser = data?.user || data;
        localStorage.setItem('user', JSON.stringify(currentUser));
        setUser(currentUser);
      })
      .catch(() => {
        if (!cancelled) clearSession();
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    // Nettoyage : évite de modifier l'état si le composant a été démonté entre-temps
    return () => {
      cancelled = true;
    };
  }, [clearSession]);

  // Connexion : appelle le backend puis enregistre la session
  const login = useCallback(
    async (email, password) => {
      const data = await authApi.login(email, password);
      saveSession(data.token, data.user);
      return data.user;
    },
    [saveSession]
  );

  // Inscription d'un hôpital : appelle le backend puis connecte directement
  const registerHopital = useCallback(
    async (formData) => {
      const data = await authApi.registerHopital(formData);
      saveSession(data.token, data.user);
      return data.user;
    },
    [saveSession]
  );

  // Déconnexion
  const logout = useCallback(() => {
    clearSession();
  }, [clearSession]);

  const isHopital = String(user?.role || '').toUpperCase() === 'HOPITAL';

  // useMemo : l'objet n'est recréé que si une de ses valeurs change (évite des rendus inutiles)
  const value = useMemo(
    () => ({ user, token, loading, isHopital, login, registerHopital, logout }),
    [user, token, loading, isHopital, login, registerHopital, logout]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// Hook pratique : const { user, login } = useAuth();
// eslint-disable-next-line react-refresh/only-export-components
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth doit être utilisé à l\'intérieur de <AuthProvider>');
  }
  return context;
}
