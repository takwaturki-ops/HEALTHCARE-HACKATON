/**
 * App.jsx : associe chaque URL a une page et fournit l'utilisateur connecte.
 *
 * - <AuthProvider> entoure toute l'application (AuthContext).
 * - Le <BrowserRouter> est dans main.jsx, PAS ici (sinon deux routeurs
 *   imbriques et une erreur React Router).
 * - Routes A (Home, liste, detail) et routes B (login, inscription, dashboard)
 *   cohabitent ici : lors d'une fusion, gardez toujours les routes des deux cotes.
 * - /dashboard est protege (ProtectedRoute). Pour l'instant, c'est une page
 *   provisoire (DashboardPlaceholder), a remplacer par DashboardHopital.jsx.
 */

import { Navigate, Route, Routes } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Home from './pages/Home';
import Login from './pages/Login';
import RegisterHopital from './pages/RegisterHopital';

// Page provisoire pour tester la connexion, en attendant DashboardHopital.jsx
function DashboardPlaceholder() {
  const { user, logout } = useAuth();

  return (
    <div style={{ padding: '2rem' }}>
      <h1>Dashboard hopital (provisoire)</h1>
      <p>Connecte : {user?.nom || user?.email || 'utilisateur'}</p>
      <button type="button" onClick={logout}>
        Se deconnecter
      </button>
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <div className="min-h-screen bg-slate-50 text-slate-800">
        <Routes>
          {/* A */}
          <Route path="/" element={<Home />} />
          {/* A : /needs/:id */}

          {/* B */}
          <Route path="/login" element={<Login />} />
          <Route path="/register-hopital" element={<RegisterHopital />} />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <DashboardPlaceholder />
              </ProtectedRoute>
            }
          />
          {/* B : /dashboard/new, /dashboard/edit/:id, /map */}

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </AuthProvider>
  );
}