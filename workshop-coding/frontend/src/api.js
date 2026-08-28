const API_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000/api'

async function request(path, options = {}) {
  const response = await fetch(`${API_URL}${path}`, {
    headers: { 'Content-Type': 'application/json', ...options.headers },
    ...options,
  })
  if (!response.ok) {
    const detail = await response.json().catch(() => ({}))
    throw new Error(Object.values(detail).flat().join(' ') || `Request gagal (${response.status})`)
  }
  return response.status === 204 ? null : response.json()
}

export const courseApi = {
  list: (params = '') => request(`/courses/${params}`),
  create: (course) => request('/courses/', { method: 'POST', body: JSON.stringify(course) }),
  replace: (id, course) => request(`/courses/${id}/`, { method: 'PUT', body: JSON.stringify(course) }),
  update: (id, course) => request(`/courses/${id}/`, { method: 'PATCH', body: JSON.stringify(course) }),
  remove: (id) => request(`/courses/${id}/`, { method: 'DELETE' }),
}

const WEATHER_API_KEY = import.meta.env.VITE_OPENWEATHER_API_KEY

export const weatherApi = {
  get: async (city) => {
    if (!WEATHER_API_KEY) throw new Error('VITE_OPENWEATHER_API_KEY belum dikonfigurasi.')
    const params = new URLSearchParams({ q: city, appid: WEATHER_API_KEY, units: 'metric', lang: 'id' })
    const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?${params}`)
    if (!response.ok) {
      const detail = await response.json().catch(() => ({}))
      throw new Error(detail.message || `Cuaca tidak ditemukan (${response.status})`)
    }
    return response.json()
  },
}
