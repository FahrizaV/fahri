import { useEffect, useState } from 'react'
import { BookOpen, Check, ChevronDown, Clock3, CloudSun, Droplets, Edit3, GraduationCap, MapPin, Plus, RefreshCw, Search, ThermometerSun, Trash2, Users, Wind, X } from 'lucide-react'
import { courseApi, weatherApi } from './api'

const emptyCourse = { title: '', description: '', instructor: '', level: 'Pemula', duration: 4, students: 0, price: 0, accent: 'teal' }
const accents = { teal: '#159a9c', coral: '#e17b5e', violet: '#6d5cae', gold: '#d69c3e' }

function App() {
  const [page, setPage] = useState('courses')
  const [courses, setCourses] = useState([])
  const [query, setQuery] = useState('')
  const [level, setLevel] = useState('Semua level')
  const [modal, setModal] = useState(null)
  const [form, setForm] = useState(emptyCourse)
  const [notice, setNotice] = useState('')
  const [loading, setLoading] = useState(true)
  const [weather, setWeather] = useState(null)
  const [city, setCity] = useState('Jakarta')
  const [weatherLoading, setWeatherLoading] = useState(false)

  const loadCourses = async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams()
      if (query) params.set('search', query)
      if (level !== 'Semua level') params.set('level', level)
      setCourses(await courseApi.list(params.toString() ? `?${params}` : ''))
    } catch (error) { setNotice(error.message) } finally { setLoading(false) }
  }

  useEffect(() => { loadCourses() }, [query, level])
  useEffect(() => { if (!notice) return; const timer = setTimeout(() => setNotice(''), 3500); return () => clearTimeout(timer) }, [notice])

  const loadWeather = async (event) => {
    event?.preventDefault()
    if (!city.trim()) return
    setWeatherLoading(true)
    try { setWeather(await weatherApi.get(city.trim())) } catch (error) { setNotice(error.message) } finally { setWeatherLoading(false) }
  }
  useEffect(() => { if (page === 'weather' && !weather) loadWeather() }, [page])

  const openCreate = () => { setForm(emptyCourse); setModal('create') }
  const openEdit = (course) => { setForm(course); setModal('edit') }
  const closeModal = () => setModal(null)
  const handleSubmit = async (event) => {
    event.preventDefault()
    try {
      if (modal === 'create') await courseApi.create(form)
      else await courseApi.replace(form.id, form)
      closeModal(); setNotice(modal === 'create' ? 'Kursus berhasil ditambahkan.' : 'Kursus berhasil diperbarui.'); loadCourses()
    } catch (error) { setNotice(error.message) }
  }
  const handleDelete = async (course) => {
    if (!window.confirm(`Hapus kursus "${course.title}"?`)) return
    try { await courseApi.remove(course.id); setNotice('Kursus dihapus.'); loadCourses() } catch (error) { setNotice(error.message) }
  }
  const totalStudents = courses.reduce((sum, course) => sum + course.students, 0)
  const formatPrice = (price) => Number(price) === 0 ? 'Gratis' : `Rp ${Number(price).toLocaleString('id-ID')}`

  return <div className="app-shell">
    <aside className="sidebar"><div className="brand"><span className="brand-mark"><BookOpen size={20} /></span><span>Kursus<br /><strong>Studio</strong></span></div>
      <nav><a className={page === 'courses' ? 'active' : ''} onClick={() => setPage('courses')}><GraduationCap size={18} /> Koleksi kursus</a><a className={page === 'weather' ? 'active' : ''} onClick={() => setPage('weather')}><CloudSun size={18} /> Cuaca hari ini</a><a><Users size={18} /> Peserta</a><a><Clock3 size={18} /> Aktivitas</a></nav>
      <div className="sidebar-note"><span className="note-dot" /> <div><strong>Ruang belajar</strong><small>Jadikan ilmu lebih dekat.</small></div></div>
      <small className="made-by">Made By Fahri</small>
    </aside>
    <main className="content">{page === 'weather' ? <WeatherPage city={city} setCity={setCity} weather={weather} loading={weatherLoading} onSubmit={loadWeather} /> : <><header className="topbar"><div><p className="eyebrow">DASHBOARD / KURSUS</p><h1>Ruang Belajar Fahri</h1></div><button className="primary-button" onClick={openCreate}><Plus size={18} /> Kursus baru</button></header>
      <section className="stats"><div className="stat-card"><span className="stat-icon teal"><BookOpen size={19} /></span><div><small>Total kursus</small><strong>{courses.length}</strong></div></div><div className="stat-card"><span className="stat-icon coral"><Users size={19} /></span><div><small>Total peserta</small><strong>{totalStudents.toLocaleString('id-ID')}</strong></div></div><div className="stat-card highlight"><div><small>Mode API aktif</small><strong>CRUD siap dipakai</strong></div><Check size={25} /></div></section>
      <div className="section-heading"><div><h2>Semua kursus</h2><p>Atur katalog pembelajaran dalam satu tempat.</p></div><span className="count-pill">{courses.length} kelas</span></div>
      <div className="toolbar"><label className="search-box"><Search size={18} /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Cari judul atau instruktur..." /></label><label className="select-box"><select value={level} onChange={(event) => setLevel(event.target.value)}><option>Semua level</option><option>Pemula</option><option>Menengah</option><option>Lanjutan</option></select><ChevronDown size={16} /></label></div>
      {loading ? <div className="empty-state">Memuat katalog...</div> : courses.length === 0 ? <div className="empty-state"><BookOpen size={36} /><h3>Belum ada kursus</h3><p>Mulai susun kelas pertama kamu.</p><button className="primary-button" onClick={openCreate}><Plus size={17} /> Tambah kursus</button></div> : <div className="course-grid">{courses.map((course) => <article className="course-card" key={course.id}><div className="course-art" style={{ '--accent': accents[course.accent] || accents.teal }}><span>{course.level}</span><BookOpen size={42} /></div><div className="course-body"><div className="course-meta"><span>{course.duration} jam belajar</span><span>{course.students} peserta</span></div><h3>{course.title}</h3><p>{course.description}</p><div className="course-footer"><span className="instructor">Oleh <strong>{course.instructor}</strong></span><strong className="price">{formatPrice(course.price)}</strong></div><div className="card-actions"><button className="edit-button" onClick={() => openEdit(course)}><Edit3 size={15} /> Edit lengkap</button><button className="icon-button danger" title="Hapus kursus" onClick={() => handleDelete(course)}><Trash2 size={16} /></button></div></div></article>)}</div>}</>}</main>
    {notice && <div className="toast"><Check size={17} /> {notice}<button onClick={() => setNotice('')}><X size={15} /></button></div>}
    {modal && <div className="modal-backdrop" onMouseDown={(event) => event.target === event.currentTarget && closeModal()}><form className="modal" onSubmit={handleSubmit}><div className="modal-header"><div><p className="eyebrow">{modal === 'create' ? 'KELAS BARU' : 'PERBARUI KELAS'}</p><h2>{modal === 'create' ? 'Buat kursus baru' : 'Edit kursus'}</h2></div><button type="button" className="icon-button" onClick={closeModal}><X size={18} /></button></div><div className="form-grid"><label>Judul kursus<input required value={form.title} onChange={(event) => setForm({ ...form, title: event.target.value })} /></label><label>Instruktur<input required value={form.instructor} onChange={(event) => setForm({ ...form, instructor: event.target.value })} /></label><label className="full">Deskripsi<textarea required rows="3" value={form.description} onChange={(event) => setForm({ ...form, description: event.target.value })} /></label><label>Level<select value={form.level} onChange={(event) => setForm({ ...form, level: event.target.value })}><option>Pemula</option><option>Menengah</option><option>Lanjutan</option></select></label><label>Durasi (jam)<input type="number" min="1" required value={form.duration} onChange={(event) => setForm({ ...form, duration: Number(event.target.value) })} /></label><label>Harga (Rp)<input type="number" min="0" required value={form.price} onChange={(event) => setForm({ ...form, price: Number(event.target.value) })} /></label><label>Peserta<input type="number" min="0" required value={form.students} onChange={(event) => setForm({ ...form, students: Number(event.target.value) })} /></label></div><button className="primary-button submit" type="submit">{modal === 'create' ? 'Simpan kursus' : 'Simpan perubahan'}</button></form></div>}
  </div>
}

function WeatherPage({ city, setCity, weather, loading, onSubmit }) {
  return <><header className="topbar"><div><p className="eyebrow">DASHBOARD / CUACA</p><h1>Langit hari ini.</h1></div><button className="icon-button refresh-button" title="Muat ulang cuaca" onClick={onSubmit}><RefreshCw size={18} /></button></header><section className="weather-intro"><p>Gunakan data OpenWeatherMap untuk melihat kondisi kota pilihanmu.</p><form className="weather-search" onSubmit={onSubmit}><MapPin size={18} /><input value={city} onChange={(event) => setCity(event.target.value)} placeholder="Masukkan nama kota..." aria-label="Nama kota" /><button className="primary-button" type="submit">Cari cuaca</button></form></section>{loading ? <div className="empty-state">Mengambil data cuaca...</div> : weather && <section className="weather-layout"><div className="weather-main"><div><p className="eyebrow">KONDISI SAAT INI</p><h2>{weather.name}, {weather.sys?.country}</h2><p className="weather-description">{weather.weather[0]?.description}</p></div><div className="temperature"><img src={`https://openweathermap.org/img/wn/${weather.weather[0]?.icon}@2x.png`} alt="" /><strong>{Math.round(weather.main.temp)}°</strong><span>terasa seperti {Math.round(weather.main.feels_like)}°</span></div></div><div className="weather-details"><div><ThermometerSun size={20} /><small>Suhu min / maks</small><strong>{Math.round(weather.main.temp_min)}° / {Math.round(weather.main.temp_max)}°</strong></div><div><Droplets size={20} /><small>Kelembapan</small><strong>{weather.main.humidity}%</strong></div><div><Wind size={20} /><small>Kecepatan angin</small><strong>{weather.wind.speed} m/s</strong></div></div></section>}</>
}

export default App
