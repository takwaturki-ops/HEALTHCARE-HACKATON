// C'est le fichier qui contient les fonctions permettant de récupérer les besoins, les statistiques et les hôpitaux ; pour l'instant elles utilisent les données fictives de mocks.js, et quand le backend sera prêt, elles pourront automatiquement récupérer les vraies données via client.js

import api from './client'
import { needs, hospitals } from './mocks'

const USE_MOCK = true // passer à false quand le backend est prêt
const wait = (data) => new Promise((r) => setTimeout(() => r(data), 200))

export async function getNeeds(f = {}) {
  if (!USE_MOCK) return (await api.get('/needs', { params: f })).data
  const s = (f.search || '').toLowerCase()
  return wait(needs.filter((n) =>
    (!f.city || n.hospital.city === f.city) &&
    (!f.type || n.type === f.type) &&
    (!f.urgency || n.urgency === f.urgency) &&
    (!f.bloodGroup || n.bloodGroup === f.bloodGroup) &&
    (!s || n.title.toLowerCase().includes(s))
  ))
}

export async function getNeed(id) {
  if (!USE_MOCK) return (await api.get(`/needs/${id}`)).data
  const n = needs.find((x) => x.id === Number(id))
  if (!n) throw new Error('not found')
  return wait(n)
}

export async function getStats() {
  if (!USE_MOCK) return (await api.get('/stats')).data
  const open = needs.filter((n) => n.status !== 'RESOLU')
  const count = (key) =>
    Object.entries(open.reduce((a, n) => {
      const k = key(n); a[k] = (a[k] || 0) + 1; return a
    }, {}))
  return wait({
    open: open.length,
    critical: open.filter((n) => n.urgency === 'CRITIQUE').length,
    byCity: count((n) => n.hospital.city).map(([city, count]) => ({ city, count })),
    byType: count((n) => n.type).map(([type, count]) => ({ type, count })),
    byStatus: open.reduce((a, n) => { a[n.status] = (a[n.status] || 0) + 1; return a }, {}),
  })
}

export async function getHospitals() {
  if (!USE_MOCK) return (await api.get('/hospitals')).data
  return wait(hospitals)
}

// Mutations (pour Dashboard)
export async function createNeed(data) {
  if (!USE_MOCK) return (await api.post('/needs', data)).data
  const newNeed = { ...data, id: Date.now(), status: 'OUVERT', createdAt: new Date().toISOString(), hospital: hospitals[0] }
  needs.push(newNeed)
  return wait(newNeed)
}

export async function updateNeed(id, data) {
  if (!USE_MOCK) return (await api.patch(`/needs/${id}`, data)).data
  const idx = needs.findIndex((n) => n.id === Number(id))
  if (idx === -1) throw new Error('not found')
  needs[idx] = { ...needs[idx], ...data }
  return wait(needs[idx])
}

export async function deleteNeed(id) {
  if (!USE_MOCK) return (await api.delete(`/needs/${id}`)).data
  const idx = needs.findIndex((n) => n.id === Number(id))
  if (idx === -1) throw new Error('not found')
  needs.splice(idx, 1)
  return wait({ success: true })
}

export async function updateNeedStatus(id, status) {
  if (!USE_MOCK) return (await api.patch(`/needs/${id}/status`, { status })).data
  const idx = needs.findIndex((n) => n.id === Number(id))
  if (idx === -1) throw new Error('not found')
  needs[idx] = { ...needs[idx], status }
  return wait(needs[idx])
}