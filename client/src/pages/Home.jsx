import { useEffect, useState } from 'react'
import { getNeeds, getStats } from '../api'

export default function Home() {
  const [needs, setNeeds] = useState([])
  const [stats, setStats] = useState(null)

  useEffect(() => {
    getNeeds().then(setNeeds)
    getStats().then(setStats)
  }, [])

  return (
    <div className="p-6">
      <p>Ouverts : {stats?.open} · Critiques : {stats?.critical}</p>
      <ul className="mt-4 list-disc pl-6">
        {needs.map((n) => (
          <li key={n.id}>{n.title} {n.bloodGroup} - {n.hospital.city}</li>
        ))}
      </ul>
    </div>
  )
}