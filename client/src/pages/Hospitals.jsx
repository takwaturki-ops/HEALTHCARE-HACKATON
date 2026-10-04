import { useEffect, useState } from 'react';
import { getHospitals } from '../api';
import Card, { CardBody } from '../components/ui/Card';
import Button from '../components/ui/Button';
import MapView from '../components/map/MapView';

export default function Hospitals() {
  const [hospitals, setHospitals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedHospital, setSelectedHospital] = useState(null);

  useEffect(() => {
    const fetchHospitals = async () => {
      try {
        setLoading(true);
        const data = await getHospitals();
        setHospitals(data);
      } catch (err) {
        console.error('Erreur chargement hôpitaux:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchHospitals();
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900">Hôpitaux partenaires</h1>
          <p className="text-slate-500 mt-1">{hospitals.length} établissement(s) référencé(s)</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-4">
            {loading ? (
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <Card key={i} className="animate-pulse">
                    <CardBody>
                      <div className="h-6 bg-slate-200 rounded w-1/3 mb-2"></div>
                      <div className="h-4 bg-slate-200 rounded w-1/2"></div>
                    </CardBody>
                  </Card>
                ))}
              </div>
            ) : hospitals.length === 0 ? (
              <div className="text-center py-12 text-slate-500">
                <svg className="w-16 h-16 text-slate-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
                <h3 className="text-lg font-medium text-slate-900 mb-1">Aucun hôpital</h3>
                <p className="text-sm">Aucun hôpital n'est encore référencé.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {hospitals.map((hospital) => (
                  <Card
                    key={hospital.id}
                    hover
                    onClick={() => setSelectedHospital(hospital)}
                  >
                    <CardBody>
                      <div className="flex items-start gap-4">
                        <div className="w-12 h-12 bg-cyan-100 rounded-xl flex items-center justify-center flex-shrink-0">
                          <svg className="w-6 h-6 text-cyan-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                          </svg>
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-slate-900">{hospital.name}</h3>
                          <p className="text-sm text-slate-500">{hospital.address}, {hospital.city}</p>
                          <p className="text-sm text-slate-500 mt-1">{hospital.phone}</p>
                        </div>
                        <svg className="w-5 h-5 text-slate-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </div>
                    </CardBody>
                  </Card>
                ))}
              </div>
            )}
          </div>

          <div className="lg:col-span-1">
            <Card className="h-full">
              <CardBody className="p-0 h-full">
                <div className="h-96">
                  <MapView
                    center={selectedHospital ? [selectedHospital.lat, selectedHospital.lng] : [31.7917, -7.0926]}
                    zoom={selectedHospital ? 13 : 6}
                    markers={hospitals.map((h) => ({
                      lat: h.lat,
                      lng: h.lng,
                      popup: h.name,
                      urgency: 'NORMALE',
                    }))}
                    height="100%"
                    readonly
                  />
                </div>
                {selectedHospital && (
                  <div className="p-4 border-t border-slate-200 bg-slate-50">
                    <h3 className="font-semibold text-slate-900">{selectedHospital.name}</h3>
                    <p className="text-sm text-slate-500 mt-1">{selectedHospital.address}, {selectedHospital.city}</p>
                    <p className="text-sm text-slate-500">{selectedHospital.phone}</p>
                    <Button variant="outline" size="sm" className="mt-3 w-full" onClick={() => setSelectedHospital(null)}>
                      Fermer la sélection
                    </Button>
                  </div>
                )}
              </CardBody>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}