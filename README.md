# Test Backend

API pengelolaan aset menggunakan NestJS dan PostgreSQL.

## Versi yang digunakan

- Node.js 24.21.0
- npm 11.19.0
- PostgreSQL 18
- NestJS 12
- TypeORM 1.1.2

Versi library mengikuti `package-lock.json`.

## Instalasi

### 1. Download proyek dan pasang dependency

```bash
git clone https://github.com/5Uph1/tes-fumindo-backend.git
cd tes-fumindo-backend
npm ci
```

### 2. Siapkan file .env

Salin `.env.example` menjadi `.env`. Bisa melalui file explorer atau terminal:

```bash
# Git Bash / Linux / macOS
cp .env.example .env
```

Untuk PowerShell:

```powershell
Copy-Item .env.example .env
```

Buka `.env`, lalu sesuaikan username dan password dengan PostgreSQL milikmu:

```dotenv
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=GANTI_DENGAN_PASSWORD_LOKAL
DB_DATABASE=asset_fumindo
FRONTEND_ORIGIN=http://localhost:5173
PORT=3000
```

`FRONTEND_ORIGIN` adalah alamat frontend Vue. Jika alamatnya berbeda, sesuaikan nilainya. Simpan password hanya di `.env`, jangan masukkan ke GitHub.

### 3. Buat database

Pastikan PostgreSQL sudah berjalan, lalu buka pgAdmin:

1. Klik kanan **Databases**, pilih **Create > Database**.
2. Isi nama database dengan `asset_fumindo`, lalu simpan.
3. Pilih database tersebut dan buka **Query Tool**.
4. Buka file [database/schema.sql](database/schema.sql), lalu jalankan isinya.

Langkah ini cukup dilakukan sekali. Jika database dan tabel sudah tersedia, lewati langkah ini. Aplikasi tidak membuat tabel secara otomatis.

### 4. Isi data contoh (opsional)

```bash
npm run seed
```

Perintah ini menambahkan 15 aset contoh. Jika tabel sudah berisi data, seed akan dilewati.

## Menjalankan backend

```bash
npm run start:dev
```

Tunggu sampai muncul `Nest application successfully started`, lalu buka:

- `http://localhost:3000/` untuk melihat respons awal.
- `http://localhost:3000/api/assets` untuk melihat daftar aset.

Biarkan terminal tetap berjalan selama aplikasi digunakan. Untuk menghentikannya, tekan `Ctrl+C`. Setelah mengubah `.env`, jalankan ulang backend.

Kalau ingin menjalankan hasil build:

```bash
npm run build
npm run start:prod
```

## Panduan lain

- [Contoh penggunaan API](docs/api.md)
- [Repository frontend](https://github.com/5Uph1/tes-fumindo-frontend)
