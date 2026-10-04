//bdd fictive 
export const hospitals = [
  { id: 1, name: 'CHU Ibn Rochd', city: 'Casablanca', address: 'Rue des Hôpitaux',
    lat: 33.5731, lng: -7.5898, phone: '+212522000001', whatsapp: '+212600000001' },
  { id: 2, name: 'Hôpital Avicenne', city: 'Rabat', address: 'Av. Ibn Sina',
    lat: 34.0021, lng: -6.8417, phone: '+212537000002', whatsapp: '+212600000002' },
  { id: 3, name: 'CHU Mohammed VI', city: 'Marrakech', address: 'Route de Safi',
    lat: 31.6295, lng: -8.0089, phone: '+212524000003', whatsapp: '+212600000003' },
]

const [casa, rabat, marrakech] = hospitals

export const needs = [
  { id: 1, type: 'SANG', title: 'Sang', bloodGroup: 'O-', quantity: 20, unit: 'poches',
    urgency: 'CRITIQUE', price: null, status: 'OUVERT',
    description: 'Besoin urgent pour le bloc opératoire.', createdAt: '2025-01-10', hospital: casa },
  { id: 2, type: 'MACHINE', title: 'Scanner CT', quantity: 1, unit: 'unité',
    urgency: 'HAUTE', price: 1500000, status: 'OUVERT',
    description: 'Scanner en panne depuis 2 semaines.', createdAt: '2025-01-12', hospital: rabat },
  { id: 3, type: 'MEDICAMENT', title: 'Insuline', quantity: 200, unit: 'boîtes',
    urgency: 'NORMALE', price: 30000, status: 'PARTIEL',
    description: 'Stock bas pour les patients diabétiques.', createdAt: '2025-01-13', hospital: casa },
  { id: 4, type: 'SANG', title: 'Sang', bloodGroup: 'A+', quantity: 10, unit: 'poches',
    urgency: 'HAUTE', price: null, status: 'OUVERT',
    description: '', createdAt: '2025-01-14', hospital: marrakech },
  { id: 5, type: 'CONSOMMABLE', title: 'Gants stériles', quantity: 5000, unit: 'paires',
    urgency: 'NORMALE', price: 12000, status: 'OUVERT',
    description: '', createdAt: '2025-01-14', hospital: rabat },
  { id: 6, type: 'MACHINE', title: 'Respirateur', quantity: 4, unit: 'unités',
    urgency: 'CRITIQUE', price: 220000, status: 'OUVERT',
    description: 'Réanimation : manque de respirateurs.', createdAt: '2025-01-15', hospital: marrakech },
  { id: 7, type: 'SANG', title: 'Sang', bloodGroup: 'O-', quantity: 8, unit: 'poches',
    urgency: 'CRITIQUE', price: null, status: 'OUVERT',
    description: 'Urgences.', createdAt: '2025-01-15', hospital: rabat },
  { id: 8, type: 'MEDICAMENT', title: 'Amoxicilline', quantity: 300, unit: 'boîtes',
    urgency: 'HAUTE', price: 9000, status: 'OUVERT',
    description: '', createdAt: '2025-01-16', hospital: casa },
]