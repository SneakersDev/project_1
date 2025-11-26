// utils/api.js

export function getApiUrl(path = '') {
  const isDebug = import.meta.env.VITE_DEBUG === 'true'
  const baseUrl = isDebug ? 'http://localhost:3000/api' : `${import.meta.env.VITE_API_URL}`
  return `${baseUrl}${path}`
}
