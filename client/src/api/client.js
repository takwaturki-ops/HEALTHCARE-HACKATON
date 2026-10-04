//C’est le fichier qui configure Axios pour permettre à notre frontend d’envoyer des requêtes HTTP au backend, notamment en définissant l’URL de base et en ajoutant automatiquement le token d’authentification aux requêtes.

import axios from 'axios'

const api = axios.create({ baseURL: import.meta.env.VITE_API_URL })

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

export default api
