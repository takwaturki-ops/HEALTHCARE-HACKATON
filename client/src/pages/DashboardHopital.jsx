import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { getNeeds, getStats, createNeed, updateNeed, deleteNeed, updateNeedStatus } from '../api';
import Sidebar from '../components/layout/Sidebar';
import Navbar from '../components/layout/Navbar';
import StatsCards from '../components/dashboard/StatsCards';
import NeedsTable from '../components/dashboard/NeedsTable';
import NeedForm from '../components/needs/NeedForm';
import Button from '../components/ui/Button';
import Modal from '../components/ui/Modal';
import { useToast } from '../components/ui/Toast';

export default function DashboardHopital() {
  const { user, isHopital } = useAuth();
  const toast = useToast();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [needs, setNeeds] = useState([]);
  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(true);
  const [formOpen, setFormOpen] = useState(false);
  const [editingNeed, setEditingNeed] = useState(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [needsData, statsData] = await Promise.all([
        getNeeds(),
        getStats(),
      ]);
      setNeeds(needsData);
      setStats(statsData);
    } catch (err) {
      console.error('Erreur chargement dashboard:', err);
      toast.error('Erreur', 'Impossible de charger les données');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleCreate = async (data) => {
    try {
      const newNeed = await createNeed(data);
      setNeeds((prev) => [newNeed, ...prev]);
      setStats((prev) => ({
        ...prev,
        open: (prev.open || 0) + 1,
        critical: newNeed.urgency === 'CRITIQUE' ? (prev.critical || 0) + 1 : prev.critical,
      }));
      toast.success('Succès', 'Besoin créé avec succès');
      setFormOpen(false);
    } catch (err) {
      toast.error('Erreur', 'Impossible de créer le besoin');
    }
  };

  const handleUpdate = async (id, data) => {
    try {
      const updated = await updateNeed(id, data);
      setNeeds((prev) => prev.map((n) => (n.id === id ? updated : n)));
      toast.success('Succès', 'Besoin mis à jour');
      setFormOpen(false);
      setEditingNeed(null);
    } catch (err) {
      toast.error('Erreur', 'Impossible de mettre à jour');
    }
  };

  const handleStatusChange = async (id, status) => {
    const oldNeed = needs.find((n) => n.id === id);
    if (!oldNeed) return;

    setNeeds((prev) => prev.map((n) => (n.id === id ? { ...n, status } : n)));

    try {
      await updateNeedStatus(id, status);
      toast.success('Succès', `Statut mis à jour : ${status}`);
    } catch (err) {
      setNeeds((prev) => prev.map((n) => (n.id === id ? oldNeed : n)));
      toast.error('Erreur', 'Impossible de mettre à jour le statut');
    }
  };

  const handleDelete = async (id) => {
    const oldNeed = needs.find((n) => n.id === id);
    if (!oldNeed) return;

    setNeeds((prev) => prev.filter((n) => n.id !== id));
    setStats((prev) => ({
      ...prev,
      open: (prev.open || 0) - 1,
      critical: oldNeed.urgency === 'CRITIQUE' ? (prev.critical || 0) - 1 : prev.critical,
    }));

    try {
      await deleteNeed(id);
      toast.success('Succès', 'Besoin supprimé');
    } catch (err) {
      setNeeds((prev) => [oldNeed, ...prev]);
      setStats((prev) => ({
        ...prev,
        open: (prev.open || 0) + 1,
        critical: oldNeed.urgency === 'CRITIQUE' ? (prev.critical || 0) + 1 : prev.critical,
      }));
      toast.error('Erreur', 'Impossible de supprimer');
    }
  };

  const openNewNeed = () => {
    setEditingNeed(null);
    setFormOpen(true);
  };

  const openEditNeed = (need) => {
    setEditingNeed(need);
    setFormOpen(true);
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      <div className="flex">
        <Sidebar collapsed={!sidebarOpen} onToggle={() => setSidebarOpen(!sidebarOpen)} />

        <main className="flex-1 lg:ml-0 transition-all duration-300 min-w-0">
          <div className="p-6 lg:p-8">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
              <div>
                <h1 className="text-2xl font-bold text-slate-900">Tableau de bord</h1>
                <p className="text-slate-500 mt-1">Gérez les besoins de votre hôpital</p>
              </div>
              <Button onClick={openNewNeed} leftIcon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>}>
                Nouveau besoin
              </Button>
            </div>

            <StatsCards stats={stats} />

            <NeedsTable
              needs={needs}
              onUpdateStatus={handleStatusChange}
              onEdit={openEditNeed}
              onDelete={handleDelete}
              loading={loading}
            />
          </div>
        </main>
      </div>

      <Modal
        open={formOpen}
        onClose={() => { setFormOpen(false); setEditingNeed(null); }}
        title={editingNeed ? 'Modifier le besoin' : 'Nouveau besoin'}
        size="lg"
      >
        <NeedForm
          initialData={editingNeed}
          onSubmit={editingNeed ? (data) => handleUpdate(editingNeed.id, data) : handleCreate}
          onClose={() => { setFormOpen(false); setEditingNeed(null); }}
          submitting={false}
        />
      </Modal>
    </div>
  );
}