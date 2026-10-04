/**
 * App.jsx : associe chaque URL a une page et fournit l'utilisateur connecte.
 *
 * - <AuthProvider> entoure toute l'application (AuthContext).
 * - Le <BrowserRouter> est dans main.jsx, PAS ici.
 * - Routes publiques : Home, NeedDetail, MapPage, Hospitals
 * - Routes auth : Login, RegisterHopital
 * - Routes protégées : DashboardHopital, NewNeed, EditNeed
 */

import { Navigate, Route, Routes } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Home from './pages/Home';
import Login from './pages/Login';
import RegisterHopital from './pages/RegisterHopital';
import DashboardHopital from './pages/DashboardHopital';
import NeedDetail from './pages/NeedDetail';
import MapPage from './pages/MapPage';
import Hospitals from './pages/Hospitals';
import NeedForm from './components/needs/NeedForm';
import { ToastProvider } from './components/ui/Toast';
import { useState, useEffect } from 'react';

function PrivateRoute({ children }) {
  const { token, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-center">
          <svg className="animate-spin mx-auto h-10 w-10 text-cyan-700" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
          <p className="mt-3 text-slate-600">Chargement...</p>
        </div>
      </div>
    );
  }

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

function PublicOnly({ children }) {
  const { token, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-center">
          <svg className="animate-spin mx-auto h-10 w-10 text-cyan-700" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
          <p className="mt-3 text-slate-600">Chargement...</p>
        </div>
      </div>
    );
  }

  if (token) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
}

function NeedFormPage({ mode }) {
  const { token } = useAuth();
  const [need, setNeed] = useState(null);
  const [loading, setLoading] = useState(mode === 'edit');

  useEffect(() => {
    if (mode === 'edit') {
      // TODO: fetch need by id from URL params
      setLoading(false);
    }
  }, [mode]);

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-slate-900">
            {mode === 'create' ? 'Nouveau besoin' : 'Modifier le besoin'}
          </h1>
        </div>
        <NeedForm
          initialData={need}
          onSubmit={async (data) => {
            // TODO: submit to API
            console.log('Submit:', data);
          }}
          onClose={() => window.history.back()}
          submitting={false}
        />
      </div>
    </div>
  );
}

export default function App() {
  return (
    <ToastProvider>
      <AuthProvider>
        <div className="min-h-screen bg-slate-50 text-slate-800">
          <Routes>
            {/* Routes publiques */}
            <Route path="/" element={<Home />} />
            <Route path="/needs/:id" element={<NeedDetail />} />
            <Route path="/map" element={<MapPage />} />
            <Route path="/hospitals" element={<Hospitals />} />

            {/* Routes auth (accessibles seulement si pas connecté) */}
            <Route
              path="/login"
              element={
                <PublicOnly>
                  <Login />
                </PublicOnly>
              }
            />
            <Route
              path="/register-hopital"
              element={
                <PublicOnly>
                  <RegisterHopital />
                </PublicOnly>
              }
            />

            {/* Routes protégées (accessibles seulement si connecté) */}
            <Route
              path="/dashboard"
              element={
                <PrivateRoute>
                  <DashboardHopital />
                </PrivateRoute>
              }
            />
            <Route
              path="/dashboard/new"
              element={
                <PrivateRoute>
                  <NeedFormPage mode="create" />
                </PrivateRoute>
              }
            />
            <Route
              path="/dashboard/edit/:id"
              element={
                <PrivateRoute>
                  <NeedFormPage mode="edit" />
                </PrivateRoute>
              }
            />

            {/* 404 */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>
      </AuthProvider>
    </ToastProvider>
  );
}