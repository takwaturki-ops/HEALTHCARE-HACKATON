import { Routes, Route } from 'react-router-dom'
import Home from './pages/Home'

export default function App() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-800">
      <Routes>
        <Route path="/" element={<Home />} />
        {/* A : /needs/:id */}
        {/* B : /login, /register-hopital, /dashboard, /dashboard/new, /dashboard/edit/:id, /map */}
      </Routes>
    </div>
  )
}