/**
 * ============================================================
 *  pages/RegisterHopital.jsx : inscription d'un hôpital (route /register-hopital)
 * ============================================================
 *
 * RÔLE
 *   Affiche le formulaire d'inscription d'un hôpital. À l'envoi, appelle
 *   registerHopital() du contexte (AuthContext), qui contacte le backend
 *   (POST /api/auth/register-hopital), connecte directement l'hôpital,
 *   puis redirige vers /dashboard.
 *
 * LES CHAMPS DU FORMULAIRE
 *   nom*        -> nom de l'hôpital (min 3 caractères)
 *   ville*      -> liste déroulante (villes de la liste CITIES)
 *   adresse*    -> adresse complète
 *   telephone*  -> numéro de téléphone (chiffres, +, espaces, tirets)
 *   lat / lng   -> optionnels : coordonnées GPS pour placer l'hôpital sur la
 *                  carte. Le bouton "Prendre ma position" les remplit
 *                  automatiquement via la géolocalisation du navigateur.
 *   email*      -> email de connexion
 *   password*   -> mot de passe (min 6 caractères)
 *   (* = obligatoire)
 *
 * ÉTATS DU COMPOSANT (useState)
 *   form        -> un seul objet qui contient tous les champs
 *   error       -> message d'erreur affiché en rouge (ou chaîne vide)
 *   submitting  -> true pendant l'appel au backend (désactive le bouton)
 *   locating    -> true pendant la recherche de la position GPS
 *
 * LE DÉROULEMENT
 *   1. L'utilisateur remplit le formulaire.
 *   2. validate() vérifie les champs (côté front, pour répondre vite).
 *   3. registerHopital(payload) -> POST /api/auth/register-hopital.
 *   4. Succès : redirection vers /dashboard.
 *   5. Échec : on affiche le message du backend (ex. "Email déjà utilisé")
 *      ou un message générique si le serveur est injoignable.
 *
 * CE QUI EST ENVOYÉ AU BACKEND (payload)
 *   { nom, ville, adresse, telephone, email, password, lat?, lng? }
 *   lat et lng ne sont envoyés (en nombres) que s'ils sont remplis.
 *
 * À VÉRIFIER AVEC LE BACKEND
 *   Les noms des champs (nom, ville, adresse, telephone, lat, lng) doivent
 *   correspondre à ceux que le backend attend. S'ils diffèrent, on ne change
 *   que la construction du "payload" dans handleSubmit.
 *
 * SI L'UTILISATEUR EST DÉJÀ CONNECTÉ
 *   On le renvoie directement vers /dashboard.
 *
 * STYLE
 *   Classes Tailwind, comme Login.jsx. Sans Tailwind configuré, la page
 *   fonctionne mais s'affiche sans mise en forme.
 */

import { useState } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

// Villes proposées dans la liste déroulante (modifiable)
const CITIES = [
  'Casablanca',
  'Rabat',
  'Marrakech',
  'Fès',
  'Agadir',
  'Tanger',
  'Meknès',
  'Oujda',
  'Tétouan',
  'Kénitra',
];

const INITIAL_FORM = {
  nom: '',
  ville: '',
  adresse: '',
  telephone: '',
  lat: '',
  lng: '',
  email: '',
  password: '',
};

const inputClass =
  'w-full rounded-lg border border-slate-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-cyan-700';
const labelClass = 'block text-sm font-medium text-slate-700 mb-1';

export default function RegisterHopital() {
  const { registerHopital, token, loading } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState(INITIAL_FORM);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [locating, setLocating] = useState(false);

  // Déjà connecté : pas besoin de ce formulaire
  if (!loading && token) {
    return <Navigate to="/dashboard" replace />;
  }

  // Met à jour un seul champ du formulaire à partir de son attribut "name"
  function handleChange(event) {
    const { name, value } = event.target;
    setForm((previous) => ({ ...previous, [name]: value }));
  }

  // Remplit lat/lng avec la position GPS du navigateur
  function handleLocate() {
    setError('');
    if (!navigator.geolocation) {
      setError("La géolocalisation n'est pas disponible sur ce navigateur.");
      return;
    }
    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setForm((previous) => ({
          ...previous,
          lat: position.coords.latitude.toFixed(6),
          lng: position.coords.longitude.toFixed(6),
        }));
        setLocating(false);
      },
      () => {
        setError("Impossible d'obtenir votre position. Vous pouvez saisir les coordonnées à la main ou laisser vide.");
        setLocating(false);
      }
    );
  }

  // Vérifie les champs ; renvoie un message d'erreur, ou '' si tout est bon
  function validate() {
    if (form.nom.trim().length < 3) return "Le nom de l'hôpital doit contenir au moins 3 caractères.";
    if (!form.ville) return 'Veuillez choisir une ville.';
    if (!form.adresse.trim()) return "Veuillez saisir l'adresse.";
    if (!/^[+\d][\d\s-]{7,}$/.test(form.telephone.trim())) return 'Numéro de téléphone invalide.';
    if (!/^\S+@\S+\.\S+$/.test(form.email.trim())) return 'Adresse email invalide.';
    if (form.password.length < 6) return 'Le mot de passe doit contenir au moins 6 caractères.';

    const hasLat = form.lat !== '';
    const hasLng = form.lng !== '';
    if (hasLat !== hasLng) return 'Renseignez la latitude ET la longitude, ou laissez les deux vides.';
    if (hasLat) {
      const lat = Number(form.lat);
      const lng = Number(form.lng);
      if (Number.isNaN(lat) || lat < -90 || lat > 90) return 'Latitude invalide (entre -90 et 90).';
      if (Number.isNaN(lng) || lng < -180 || lng > 180) return 'Longitude invalide (entre -180 et 180).';
    }
    return '';
  }

  async function handleSubmit(event) {
    event.preventDefault(); // empêche le rechargement de la page
    setError('');

    const validationError = validate();
    if (validationError) {
      setError(validationError);
      return;
    }

    // Données envoyées au backend (lat/lng seulement s'ils sont remplis)
    const payload = {
      nom: form.nom.trim(),
      ville: form.ville,
      adresse: form.adresse.trim(),
      telephone: form.telephone.trim(),
      email: form.email.trim(),
      password: form.password,
    };
    if (form.lat !== '' && form.lng !== '') {
      payload.lat = Number(form.lat);
      payload.lng = Number(form.lng);
    }

    setSubmitting(true);
    try {
      await registerHopital(payload);
      navigate('/dashboard', { replace: true });
    } catch (err) {
      const backendMessage = err.response?.data?.message || err.response?.data?.error;
      if (backendMessage) {
        setError(backendMessage);
      } else if (!err.response) {
        setError('Impossible de joindre le serveur. Réessayez plus tard.');
      } else {
        setError("Inscription impossible. Vérifiez les informations saisies.");
      }
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4 py-8">
      <div className="w-full max-w-lg bg-white rounded-xl shadow-sm border border-slate-200 p-8">
        <h1 className="text-2xl font-bold text-slate-900 mb-1">Inscrire mon hôpital</h1>
        <p className="text-sm text-slate-500 mb-6">
          Créez un compte pour publier les besoins de votre établissement.
        </p>

        <form onSubmit={handleSubmit} noValidate className="space-y-4">
          <div>
            <label htmlFor="nom" className={labelClass}>Nom de l'hôpital *</label>
            <input
              id="nom"
              name="nom"
              type="text"
              value={form.nom}
              onChange={handleChange}
              className={inputClass}
              placeholder="Hôpital Ibn Rochd"
            />
          </div>

          <div>
            <label htmlFor="ville" className={labelClass}>Ville *</label>
            <select
              id="ville"
              name="ville"
              value={form.ville}
              onChange={handleChange}
              className={inputClass}
            >
              <option value="">Choisir une ville</option>
              {CITIES.map((city) => (
                <option key={city} value={city}>{city}</option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="adresse" className={labelClass}>Adresse *</label>
            <input
              id="adresse"
              name="adresse"
              type="text"
              value={form.adresse}
              onChange={handleChange}
              className={inputClass}
              placeholder="Rue, quartier"
            />
          </div>

          <div>
            <label htmlFor="telephone" className={labelClass}>Téléphone *</label>
            <input
              id="telephone"
              name="telephone"
              type="tel"
              autoComplete="tel"
              value={form.telephone}
              onChange={handleChange}
              className={inputClass}
              placeholder="+212 6 00 00 00 00"
            />
          </div>

          <fieldset className="border border-slate-200 rounded-lg p-4">
            <legend className="text-sm font-medium text-slate-700 px-1">
              Position sur la carte (optionnel)
            </legend>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label htmlFor="lat" className={labelClass}>Latitude</label>
                <input
                  id="lat"
                  name="lat"
                  type="text"
                  inputMode="decimal"
                  value={form.lat}
                  onChange={handleChange}
                  className={inputClass}
                  placeholder="33.5731"
                />
              </div>
              <div>
                <label htmlFor="lng" className={labelClass}>Longitude</label>
                <input
                  id="lng"
                  name="lng"
                  type="text"
                  inputMode="decimal"
                  value={form.lng}
                  onChange={handleChange}
                  className={inputClass}
                  placeholder="-7.5898"
                />
              </div>
            </div>
            <button
              type="button"
              onClick={handleLocate}
              disabled={locating}
              className="mt-3 text-sm text-cyan-700 font-medium hover:underline disabled:opacity-60"
            >
              {locating ? 'Recherche de la position...' : 'Prendre ma position'}
            </button>
          </fieldset>

          <div>
            <label htmlFor="email" className={labelClass}>Email *</label>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              value={form.email}
              onChange={handleChange}
              className={inputClass}
              placeholder="contact@hopital.ma"
            />
          </div>

          <div>
            <label htmlFor="password" className={labelClass}>Mot de passe *</label>
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="new-password"
              value={form.password}
              onChange={handleChange}
              className={inputClass}
              placeholder="6 caractères minimum"
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
            {submitting ? 'Inscription...' : "Inscrire l'hôpital"}
          </button>
        </form>

        <p className="text-sm text-slate-600 mt-6 text-center">
          Déjà un compte ?{' '}
          <Link to="/login" className="text-cyan-700 font-medium hover:underline">
            Se connecter
          </Link>
        </p>
      </div>
    </div>
  );
}