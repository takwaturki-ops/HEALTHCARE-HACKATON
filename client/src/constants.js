export const TYPES = [
  { value: 'MACHINE', label: 'Machine', icon: '🩻' },
  { value: 'SANG', label: 'Sang', icon: '🩸' },
  { value: 'MEDICAMENT', label: 'Médicament', icon: '💊' },
  { value: 'CONSOMMABLE', label: 'Consommable', icon: '🧤' },
]
export const URGENCIES = ['CRITIQUE', 'HAUTE', 'NORMALE']
export const BLOOD_GROUPS = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-']

export const typeInfo = (t) => TYPES.find((x) => x.value === t) || { label: t, icon: '📦' }

export const formatPrice = (p) =>
  p == null ? 'Prix non précisé' : `${Number(p).toLocaleString('fr-FR')} MAD`