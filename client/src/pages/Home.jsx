import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getNeeds, getStats } from '../api';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import { UrgencyBadge } from '../components/ui/Badge';

export default function Home() {
  const [needs, setNeeds] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchHomeData = async () => {
      try {
        setLoading(true);
        const [needsData, statsData] = await Promise.all([getNeeds(), getStats()]);
        setNeeds(needsData);
        setStats(statsData);
      } catch {
        setError('Impossible de charger les données pour le moment.');
      } finally {
        setLoading(false);
      }
    };

    fetchHomeData();
  }, []);

  const latestNeeds = [...needs]
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 6);

  const cities = stats?.byCity?.length || 0;

  return (
    <div className="min-h-screen bg-slate-50">
      <section className="bg-gradient-to-br from-cyan-700 to-cyan-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-20">
          <div className="max-w-3xl">
            <p className="text-cyan-100 text-sm font-medium uppercase tracking-wide">Plateforme nationale</p>
            <h1 className="mt-3 text-3xl md:text-5xl font-bold leading-tight">
              Coordination rapide des besoins hospitaliers urgents
            </h1>
            <p className="mt-5 text-cyan-100 text-lg">
              Consultez les besoins critiques, trouvez les établissements partenaires et contribuez plus vite.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <Link to="/map">
                <Button className="!bg-white !text-cyan-800 hover:!bg-cyan-50">Voir la carte</Button>
              </Link>
              <Link to="/hospitals">
                <Button variant="outline" className="!border-white !text-white hover:!bg-cyan-800">Voir les hôpitaux</Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 pb-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <p className="text-sm text-slate-500">Besoins ouverts</p>
            <p className="text-3xl font-bold text-slate-900 mt-1">{stats?.open ?? '—'}</p>
          </Card>
          <Card>
            <p className="text-sm text-slate-500">Besoins critiques</p>
            <p className="text-3xl font-bold text-red-600 mt-1">{stats?.critical ?? '—'}</p>
          </Card>
          <Card>
            <p className="text-sm text-slate-500">Villes couvertes</p>
            <p className="text-3xl font-bold text-slate-900 mt-1">{cities || '—'}</p>
          </Card>
        </div>

        <div className="mt-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold text-slate-900">Derniers besoins publiés</h2>
            <Link to="/map" className="text-cyan-700 font-medium hover:underline">
              Explorer tout
            </Link>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <Card key={i} className="animate-pulse">
                  <div className="h-5 bg-slate-200 rounded w-2/3 mb-3"></div>
                  <div className="h-4 bg-slate-200 rounded w-1/2 mb-2"></div>
                  <div className="h-4 bg-slate-200 rounded w-1/3"></div>
                </Card>
              ))}
            </div>
          ) : error ? (
            <Card className="text-center">
              <p className="text-red-600 font-medium">{error}</p>
            </Card>
          ) : latestNeeds.length === 0 ? (
            <Card className="text-center">
              <p className="text-slate-600">Aucun besoin disponible pour le moment.</p>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {latestNeeds.map((n) => (
                <Card key={n.id} hover>
                  <div className="flex items-start justify-between gap-3">
                    <h3 className="text-lg font-semibold text-slate-900">
                      {n.title}{n.bloodGroup ? ` ${n.bloodGroup}` : ''}
                    </h3>
                    <UrgencyBadge urgency={n.urgency} />
                  </div>
                  <p className="text-slate-600 mt-2">
                    {n.quantity} {n.unit} · {n.hospital.city}
                  </p>
                  <p className="text-sm text-slate-500 mt-3">{n.hospital.name}</p>
                </Card>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}