import { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getNeed, updateNeedStatus } from '../api';
import { formatPrice, typeInfo } from '../constants';
import { UrgencyBadge, TypeBadge } from '../components/ui/Badge';
import Button from '../components/ui/Button';
import Card, { CardBody } from '../components/ui/Card';
import MapView from '../components/map/MapView';

export default function NeedDetail() {
  const { id } = useParams();
  const { token, user } = useAuth();
  const navigate = useNavigate();
  const [need, setNeed] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [mapLoaded, setMapLoaded] = useState(false);

  useEffect(() => {
    const fetchNeed = async () => {
      try {
        setLoading(true);
        const data = await getNeed(id);
        setNeed(data);
      } catch (err) {
        if (err.response?.status === 404) {
          setError('Besoin introuvable');
        } else {
          setError('Erreur lors du chargement');
        }
      } finally {
        setLoading(false);
      }
    };
    fetchNeed();
  }, [id]);

  const isOwner = token && need && (need.hospital?.id === user?.hospitalId || need.hospitalId === user?.hospitalId);

  const handleStatusChange = async (newStatus) => {
    if (!need) return;
    const oldStatus = need.status;
    setNeed((prev) => prev ? { ...prev, status: newStatus } : null);
    try {
      await updateNeedStatus(id, newStatus);
    } catch (err) {
      setNeed((prev) => prev ? { ...prev, status: oldStatus } : null);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 py-12">
        <div className="max-w-4xl mx-auto px-4">
          <div className="animate-pulse space-y-8">
            <div className="bg-white rounded-2xl border border-slate-200 p-8">
              <div className="h-6 bg-slate-200 rounded w-1/4 mb-4"></div>
              <div className="h-4 bg-slate-200 rounded w-1/2"></div>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 p-8">
                <div className="h-4 bg-slate-200 rounded w-3/4 mb-6"></div>
                <div className="space-y-4">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="h-10 bg-slate-200 rounded"></div>
                  ))}
                </div>
              </div>
              <div className="bg-white rounded-2xl border border-slate-200 p-8">
                <div className="h-4 bg-slate-200 rounded w-1/2 mb-6"></div>
                <div className="space-y-4">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="h-10 bg-slate-200 rounded"></div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4">
        <div className="text-center max-w-md">
          <svg className="w-16 h-16 text-slate-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <h1 className="text-2xl font-bold text-slate-900 mb-2">{error}</h1>
          <p className="text-slate-500 mb-6">Ce besoin n'existe plus ou a été supprimé.</p>
          <Link to="/">
            <Button leftIcon={<svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>}>
              Retour à l'accueil
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  if (!need) return null;

  const type = typeInfo(need.type);
  const hospital = need.hospital;
  const whatsappUrl = hospital?.whatsapp
    ? `https://wa.me/${hospital.whatsapp.replace(/\D/g, '')}?text=${encodeURIComponent(`Bonjour, je peux aider pour le besoin : ${need.title} à ${hospital.name}`)}`
    : null;

  return (
    <div className="min-h-screen bg-slate-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <Link to="/" className="inline-flex items-center gap-2 text-cyan-700 hover:underline mb-6">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
          Retour à la liste
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardBody>
                <div className="flex flex-wrap items-center gap-3 mb-4">
                  <TypeBadge type={need.type} />
                  <UrgencyBadge urgency={need.urgency} />
                  <span className="px-3 py-1 text-sm font-medium rounded-full bg-slate-100 text-slate-700">
                    {need.status}
                  </span>
                </div>
                <h1 className="text-2xl font-bold text-slate-900 mb-2">{need.title}</h1>
                {need.bloodGroup && (
                  <p className="text-cyan-700 font-medium mb-2">Groupe sanguin : <span className="font-bold">{need.bloodGroup}</span></p>
                )}
                <p className="text-slate-600 whitespace-pre-wrap">{need.description || 'Aucune description fournie.'}</p>
              </CardBody>
            </Card>

            <Card>
              <CardBody>
                <h2 className="text-lg font-semibold text-slate-900 mb-4">Détails du besoin</h2>
                <dl className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <dt className="text-sm text-slate-500">Type</dt>
                    <dd className="font-medium text-slate-900">{type.label}</dd>
                  </div>
                  <div>
                    <dt className="text-sm text-slate-500">Quantité</dt>
                    <dd className="font-medium text-slate-900">{need.quantity} {need.unit || ''}</dd>
                  </div>
                  <div>
                    <dt className="text-sm text-slate-500">Urgence</dt>
                    <dd className="font-medium text-slate-900"><UrgencyBadge urgency={need.urgency} /></dd>
                  </div>
                  <div>
                    <dt className="text-sm text-slate-500">Prix estimé</dt>
                    <dd className="font-medium text-slate-900">{formatPrice(need.estimatedPrice)}</dd>
                  </div>
                  <div>
                    <dt className="text-sm text-slate-500">Statut</dt>
                    <dd className="font-medium text-slate-900">{need.status}</dd>
                  </div>
                  <div>
                    <dt className="text-sm text-slate-500">Publié le</dt>
                    <dd className="font-medium text-slate-900">{new Date(need.createdAt).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}</dd>
                  </div>
                </dl>
              </CardBody>
            </Card>

            {isOwner && (
              <Card>
                <CardBody>
                  <h2 className="text-lg font-semibold text-slate-900 mb-4">Changer le statut</h2>
                  <select
                    value={need.status}
                    onChange={(e) => handleStatusChange(e.target.value)}
                    className="w-full sm:w-auto px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
                  >
                    <option value="OUVERT">Ouvert</option>
                    <option value="PARTIEL">Partiel</option>
                    <option value="RESOLU">Résolu</option>
                  </select>
                </CardBody>
              </Card>
            )}
          </div>

          <div className="space-y-6">
            <Card className="sticky top-24">
              <CardBody>
                <h2 className="text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2">
                  <svg className="w-5 h-5 text-cyan-700" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                  Hôpital demandeur
                </h2>
                <div className="space-y-3">
                  <div>
                    <p className="font-semibold text-slate-900">{hospital?.name || 'Hôpital non spécifié'}</p>
                    <p className="text-sm text-slate-500">{hospital?.address}, {hospital?.city}</p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {hospital?.phone && (
                      <a href={`tel:${hospital.phone}`} className="inline-flex items-center gap-2 px-3 py-2 text-sm text-slate-700 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
                        {hospital.phone}
                      </a>
                    )}
                    {whatsappUrl && (
                      <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 px-3 py-2 text-sm text-white bg-green-600 rounded-lg hover:bg-green-700 transition-colors">
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.148-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.4c-.148 0-.336-.025-.67-.198-.415-.242-1.126-.372-1.761-.496-.571-.124-1.024-.173-1.346-.124-.298.05-.644.248-.94.496-.297.248-.47.47-.57.545-.073.074-.172.2-.247.422-.074.224-.05.47.049.67.124.248.224.422.422.695.198.273.422.52.695.718.248.198.497.273.769.248.273-.025.718-.224 1.09-.62.324-.346.62-1.1 1.065-2.525.173-.52.025-.844-.247-1.191-.272-.347-.695-.422-.893-.372-.198.05-.372.2-.397.372" /></svg>
                        WhatsApp
                      </a>
                    )}
                    <Link to={`/map?hospital=${hospital?.id}`} className="inline-flex items-center gap-2 px-3 py-2 text-sm text-cyan-700 bg-cyan-50 rounded-lg hover:bg-cyan-100 transition-colors">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                      Voir sur la carte
                    </Link>
                  </div>
                </div>
              </CardBody>
            </Card>

            <Card className="sticky top-24" style={{ top: 'calc(24rem + 2rem)' }}>
              <CardBody>
                <h2 className="text-lg font-semibold text-slate-900 mb-4">Localisation</h2>
                <MapView
                  center={[hospital?.lat || 31.7917, hospital?.lng || -7.0926]}
                  zoom={13}
                  markers={hospital ? [{ lat: hospital.lat, lng: hospital.lng, popup: hospital.name }] : []}
                  height="300px"
                  readonly
                />
              </CardBody>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}