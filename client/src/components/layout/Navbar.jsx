import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Button from '../ui/Button';

const navLinks = [
  { path: '/', label: 'Accueil' },
  { path: '/map', label: 'Carte' },
  { path: '/hospitals', label: 'Hôpitaux' },
];

export default function Navbar() {
  const { user, token, logout, loading } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (loading) {
    return (
      <header className="bg-white border-b border-slate-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-cyan-700 rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m-6.208 6.208A6.001 6.001 0 0012 21a6.001 6.001 0 006.208-6.208M12 18a4 4 0 00-4-4H4m8 0a4 4 0 004-4V6a4 4 0 00-4-4H4" />
                </svg>
              </div>
              <span className="text-xl font-bold text-slate-900">HospiStock</span>
            </div>
          </div>
        </div>
      </header>
    );
  }

  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-2">
            <Link to="/" className="flex items-center gap-2">
              <div className="w-8 h-8 bg-cyan-700 rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m-6.208 6.208A6.001 6.001 0 0012 21a6.001 6.001 0 006.208-6.208M12 18a4 4 0 00-4-4H4m8 0a4 4 0 004-4V6a4 4 0 00-4-4H4" />
                </svg>
              </div>
              <span className="text-xl font-bold text-slate-900">HospiStock</span>
            </Link>
          </div>

          <nav className="hidden md:flex items-center gap-6">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`text-sm font-medium transition-colors ${
                  location.pathname === link.path
                    ? 'text-cyan-700'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-4">
            {token ? (
              <>
                <Link to="/dashboard" className="hidden sm:block">
                  <Button variant="outline" size="sm">
                    Tableau de bord
                  </Button>
                </Link>
                <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-slate-50 rounded-lg">
                  <svg className="w-4 h-4 text-cyan-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  <span className="text-sm font-medium text-slate-700">{user?.nom || user?.email}</span>
                </div>
                <Button variant="ghost" size="sm" onClick={handleLogout}>
                  Déconnexion
                </Button>
              </>
            ) : (
              <div className="flex items-center gap-2">
                <Link to="/login">
                  <Button variant="ghost" size="sm">Connexion</Button>
                </Link>
                <Link to="/register-hopital">
                  <Button variant="primary" size="sm">Inscrire mon hôpital</Button>
                </Link>
              </div>
            )}

            <button
              className="md:hidden p-2 rounded-lg text-slate-600 hover:bg-slate-100"
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label="Menu"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {mobileOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {mobileOpen && (
          <div className="md:hidden py-4 border-t border-slate-200 animate-slide-down">
            <nav className="flex flex-col gap-2">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setMobileOpen(false)}
                  className={`px-3 py-2 rounded-lg text-sm font-medium ${
                    location.pathname === link.path
                      ? 'bg-cyan-50 text-cyan-700'
                      : 'text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  {link.label}
                </Link>
              ))}
              {!token && (
                <>
                  <Link to="/login" onClick={() => setMobileOpen(false)} className="px-3 py-2 rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-50">Connexion</Link>
                  <Link to="/register-hopital" onClick={() => setMobileOpen(false)} className="px-3 py-2 rounded-lg text-sm font-medium text-cyan-700 hover:bg-cyan-50">Inscrire mon hôpital</Link>
                </>
              )}
              {token && (
                <button onClick={handleLogout} className="px-3 py-2 rounded-lg text-sm font-medium text-red-600 hover:bg-red-50 w-full text-left">Déconnexion</button>
              )}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}

import { useState } from 'react';