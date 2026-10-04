import { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { getNeeds, getHospitals } from '../api';
import MapView from '../components/map/MapView';
import { UrgencyBadge, TypeBadge } from '../components/ui/Badge';
import Card, { CardBody } from '../components/ui/Card';
import Button from '../components/ui/Button';
import Select from '../components/ui/Select';

export default function MapPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [needs, setNeeds] = useState([]);
  const [hospitals, setHospitals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedNeed, setSelectedNeed] = useState(null);
  const [filters, setFilters] = useState({
    city: searchParams.get('city') || '',
    type: searchParams.get('type') || '',
    urgency: searchParams.get('urgency') || '',
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [needsData, hospitalsData] = await Promise.all([
          getNeeds(filters),
          getHospitals(),
        ]);
        setNeeds(needsData);
        setHospitals(hospitalsData);
      } catch (err) {
        console.error('Erreur chargement carte:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [filters]);

  useEffect(() => {
    const params = new URLSearchParams();
    if (filters.city) params.set('city', filters.city);
    if (filters.type) params.set('type', filters.type);
    if (filters.urgency) params.set('urgency', filters.urgency);
    setSearchParams(params, { replace: true });
  }, [filters, setSearchParams]);

  const mapMarkers = needs.map((need) => ({
    lat: need.hospital?.lat || 31.7917,
    lng: need.hospital?.lng || -7.0926,
    popup: `${need.hospital?.name || 'Hôpital'} - ${need.title}`,
    urgency: need.urgency,
    onClick: () => setSelectedNeed(need),
  }));

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const cities = [...new Set(hospitals.map((h) => h.city))].sort();

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="flex h-screen">
        <aside className="w-full lg:w-80 bg-white border-r border-slate-200 flex flex-col hidden lg:flex">
          <div className="p-4 border-b border-slate-200">
            <h1 className="text-xl font-bold text-slate-900 flex items-center gap-2">
              <svg className="w-6 h-6 text-cyan-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              Carte des besoins
            </h1>
            <p className="text-sm text-slate-500 mt-1">{needs.length} besoin(s) affiché(s)</p>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            <Card>
              <CardBody className="p-4">
                <h3 className="font-semibold text-slate-900 mb-3">Filtres</h3>
                <div className="space-y-3">
                  <Select
                    label="Ville"
                    value={filters.city}
                    onChange={(e) => handleFilterChange('city', e.target.value)}
                    options={[{ value: '', label: 'Toutes' }, ...cities.map((c) => ({ value: c, label: c }))]}
                  />
                  <Select
                    label="Type"
                    value={filters.type}
                    onChange={(e) => handleFilterChange('type', e.target.value)}
                    options={[
                      { value: '', label: 'Tous' },
                      { value: 'MACHINE', label: 'Machine' },
                      { value: 'SANG', label: 'Sang' },
                      { value: 'MEDICAMENT', label: 'Médicament' },
                      { value: 'CONSOMMABLE', label: 'Consommable' },
                    ]}
                  />
                  <Select
                    label="Urgence"
                    value={filters.urgency}
                    onChange={(e) => handleFilterChange('urgency', e.target.value)}
                    options={[
                      { value: '', label: 'Toutes' },
                      { value: 'CRITIQUE', label: 'Critique' },
                      { value: 'HAUTE', label: 'Haute' },
                      { value: 'NORMALE', label: 'Normale' },
                    ]}
                  />
                  <Button variant="outline" className="w-full" onClick={() => setFilters({ city: '', type: '', urgency: '' })}>
                    Réinitialiser
                  </Button>
                </div>
              </CardBody>
            </Card>

            {loading ? (
              <div className="space-y-3">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="animate-pulse h-20 bg-slate-100 rounded-lg"></div>
                ))}
              </div>
            ) : needs.length === 0 ? (
              <div className="text-center py-8 text-slate-500">
                <svg className="w-12 h-12 text-slate-300 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p>Aucun besoin ne correspond aux filtres</p>
              </div>
            ) : (
              <div className="space-y-2 max-h-[calc(100vh-300px)] overflow-y-auto">
                {needs.map((need) => (
                  <button
                    key={need.id}
                    onClick={() => setSelectedNeed(need)}
                    className={`w-full text-left p-3 rounded-lg border transition-all ${
                      selectedNeed?.id === need.id
                        ? 'border-cyan-500 bg-cyan-50'
                        : 'border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-start gap-2">
                      <TypeBadge type={need.type} />
                      <UrgencyBadge urgency={need.urgency} />
                    </div>
                    <p className="font-medium text-slate-900 mt-1 truncate">{need.title}</p>
                    <p className="text-xs text-slate-500">{need.hospital?.city}</p>
                  </button>
                ))}
              </div>
            )}
          </div>
        </aside>

        <main className="flex-1 relative min-w-0">
          <MapView
            center={[31.7917, -7.0926]}
            zoom={6}
            markers={mapMarkers}
            height="100%"
          />

          {selectedNeed && (
            <div className="fixed bottom-4 right-4 lg:static lg:absolute lg:bottom-auto lg:top-4 lg:right-4 w-full lg:w-96 z-50 animate-slide-up">
              <Card>
                <CardBody>
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <TypeBadge type={selectedNeed.type} />
                      <UrgencyBadge urgency={selectedNeed.urgency} className="ml-2" />
                    </div>
                    <button onClick={() => setSelectedNeed(null)} className="text-slate-400 hover:text-slate-600">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                    </button>
                  </div>
                  <h3 className="font-semibold text-slate-900 mb-1">{selectedNeed.title}</h3>
                  <p className="text-sm text-slate-500 mb-2">{selectedNeed.hospital?.name}, {selectedNeed.hospital?.city}</p>
                  <p className="text-sm text-slate-600 mb-3">{selectedNeed.quantity} {selectedNeed.unit}</p>
                  <div className="flex gap-2">
                    <Link to={`/needs/${selectedNeed.id}`}>
                      <Button variant="primary" size="sm" className="flex-1">Voir détails</Button>
                    </Link>
                    <Button variant="outline" size="sm" onClick={() => setSelectedNeed(null)}>Fermer</Button>
                  </div>
                </CardBody>
              </Card>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}