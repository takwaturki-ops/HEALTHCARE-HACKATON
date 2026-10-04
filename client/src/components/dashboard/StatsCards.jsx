import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const statIcons = {
  open: <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" /></svg>,
  critical: <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>,
  resolved: <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>,
  pending: <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>,
};

const statColors = {
  open: 'bg-blue-500',
  critical: 'bg-red-500',
  resolved: 'bg-green-500',
  pending: 'bg-orange-500',
};

export function StatsCards({ stats = {} }) {
  const [animatedStats, setAnimatedStats] = useState({ open: 0, critical: 0, resolved: 0, pending: 0 });

  useEffect(() => {
    const target = {
      open: stats.open || 0,
      critical: stats.critical || 0,
      resolved: (stats.byStatus?.RESOLU || 0) || (stats.resolved || 0),
      pending: (stats.byStatus?.PARTIEL || 0) || (stats.pending || 0),
    };

    const duration = 800;
    const startTime = Date.now();

    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);

      setAnimatedStats({
        open: Math.round(target.open * eased),
        critical: Math.round(target.critical * eased),
        resolved: Math.round(target.resolved * eased),
        pending: Math.round(target.pending * eased),
      });

      if (progress < 1) requestAnimationFrame(animate);
    };

    animate();
  }, [stats]);

  const cards = [
    { key: 'open', label: 'Besoins ouverts', icon: statIcons.open, color: statColors.open },
    { key: 'critical', label: 'Critiques', icon: statIcons.critical, color: statColors.critical },
    { key: 'resolved', label: 'Résolus', icon: statIcons.resolved, color: statColors.resolved },
    { key: 'pending', label: 'En attente', icon: statIcons.pending, color: statColors.pending },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {cards.map((card, index) => (
        <motion.div
          key={card.key}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: index * 0.1 }}
          className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm hover:shadow-md transition-shadow"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-500">{card.label}</p>
              <motion.span
                className="text-3xl font-bold text-slate-900 mt-1 block"
                animate={{ rotateY: [90, 0] }}
                transition={{ duration: 0.5, delay: index * 0.1 + 0.2 }}
              >
                {animatedStats[card.key]}
              </motion.span>
            </div>
            <div className={`${card.color} rounded-xl p-3`}>
              {card.icon}
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
}

export default StatsCards;