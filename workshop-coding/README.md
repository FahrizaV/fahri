# Kursus Studio

Aplikasi full-stack katalog kursus dengan Django REST Framework, React + Vite, dan SQLite.

## Struktur

- `backend/`: API Django REST di `http://127.0.0.1:8000`
- `frontend/`: dashboard React di `http://localhost:5173`

## Menjalankan backend (Windows PowerShell)

```powershell
cd backend
.\.venv\Scripts\Activate.ps1
python manage.py migrate
python manage.py seed_courses
python manage.py runserver
```

Jika aktivasi environment diblokir PowerShell, jalankan perintah dengan
interpreter virtual environment secara langsung:

```powershell
cd backend
.\.venv\Scripts\python.exe manage.py migrate
.\.venv\Scripts\python.exe manage.py seed_courses
.\.venv\Scripts\python.exe manage.py runserver
```

Jika environment belum ada:

```powershell
python -m venv .venv
.\.venv\Scripts\python.exe -m pip install -r requirements.txt
```

## Menjalankan frontend

Di terminal lain:

```powershell
cd frontend
npm.cmd install
npm.cmd run dev
```

Buat `frontend/.env` dari `frontend/.env.example`, lalu isi:

```env
VITE_OPENWEATHER_API_KEY=your_openweathermap_api_key
```

Halaman `Cuaca hari ini` mengambil data dari OpenWeatherMap melalui endpoint
`https://api.openweathermap.org/data/2.5/weather`, dengan parameter kota, API
key, satuan Celsius, dan bahasa Indonesia. Setelah mengubah `.env`, restart
Vite agar environment variable terbaca.

API resource tersedia di `/api/courses/`:

- `GET /api/courses/` dan `GET /api/courses/:id/`
- `POST /api/courses/`
- `PUT /api/courses/:id/`
- `PATCH /api/courses/:id/`
- `DELETE /api/courses/:id/`

Filter list mendukung `?search=` dan `?level=`.

## Tes backend

```powershell
cd backend
.\.venv\Scripts\python.exe manage.py test courses
```
