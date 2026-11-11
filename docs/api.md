# Panduan mencoba API aset

[Kembali ke README](../README.md)

Setelah backend menyala, kamu bisa mencoba endpoint di bawah ini melalui Postman. Alamat dasarnya adalah `http://localhost:3000/api`, dan kamu tidak perlu login atau memasukkan token.

Untuk POST dan PATCH, pilih **Body ? raw ? JSON**. Angka ID pada contoh hanya ilustrasi; ganti dengan ID aset yang ada di database-mu.

## Melihat daftar aset (GET /assets)

Mulai dengan method **GET** dan alamat berikut. Kamu bisa menghapus bagian setelah `?` kalau ingin melihat daftar tanpa pencarian.

```http
GET http://localhost:3000/api/assets?search=kertas&page=1&limit=10
```

| Query | Default | Ketentuan |
| --- | --- | --- |
| `search` | String kosong | Teks pencarian nama; spasi awal/akhir dibuang, tanpa membedakan huruf besar/kecil |
| `page` | `1` | Integer positif |
| `limit` | `10` | Integer positif; belum memiliki batas maksimum aplikasi |

Isi `page` dan `limit` dengan bilangan bulat positif, misalnya `page=2&limit=10`. Nilai nol, negatif, pecahan, teks, atau isian kosong akan ditolak. Angkanya juga harus berada dalam rentang aman JavaScript, termasuk hasil perhitungan offset. Untuk mencoba aplikasi, cukup gunakan limit seperti 10; limit yang sangat besar masih bisa melampaui kapasitas database.

Kamu bisa mencari `kertas` maupun `KERTAS` untuk mendapatkan hasil yang sama. Di kode, pencarian ini memakai `ILIKE` melalui TypeORM. Karakter `%` dan `_` tetap mengikuti aturan wildcard PostgreSQL. Daftar ditampilkan dari ID terkecil ke terbesar (**`asset_id ASC`**).

Contoh respons **200 OK** untuk pencarian dengan satu hasil:

```json
{
  "data": [
    {
      "asset_id": 1,
      "asset_name": "Kertas A4",
      "stock_quantity": 0,
      "category": "Consumable"
    }
  ],
  "page": 1,
  "limit": 10,
  "total": 1,
  "totalPages": 1
}
```

Di respons ini, `data` berisi aset pada halaman yang diminta. `total` menunjukkan jumlah seluruh aset yang cocok dengan pencarian, sedangkan `totalPages` dihitung dengan `ceil(total / limit)`.

Kalau tidak ada yang cocok, kamu akan mendapatkan `data: []`, `total: 0`, dan `totalPages: 0`. Kalau nomor halaman melewati halaman terakhir, `data` juga kosong; API tetap mengembalikan nomor halaman yang kamu minta.

## Melihat satu aset (GET /assets/:id)

```http
GET http://localhost:3000/api/assets/1
```

Kalau ID-nya ditemukan, kamu akan menerima **200 OK** dengan data aset langsung seperti ini:

```json
{
  "asset_id": 1,
  "asset_name": "Kertas A4",
  "stock_quantity": 0,
  "category": "Consumable"
}
```

Gunakan ID berupa bilangan bulat positif dalam rentang aman JavaScript. Kalau formatnya salah, misalnya `abc` atau `0`, responsnya **400**. Kalau formatnya benar tetapi asetnya tidak ada, responsnya **404**.

## Menambahkan aset (POST /assets)

```http
POST http://localhost:3000/api/assets
Content-Type: application/json
```

```json
{
  "asset_name": "Scanner",
  "stock_quantity": 2,
  "category": "Non-Consumable"
}
```

| Field | Wajib | Aturan |
| --- | --- | --- |
| `asset_name` | Ya | String, tidak boleh kosong setelah trim |
| `stock_quantity` | Tidak | Number berupa integer 0–2147483647; jika tidak dikirim memakai default database `0` |
| `category` | Ya | Persis `Consumable` atau `Non-Consumable` |

Respons **201 Created**:

```json
{
  "asset_id": 16,
  "asset_name": "Scanner",
  "stock_quantity": 2,
  "category": "Non-Consumable"
}
```

Kamu tidak perlu mengisi ID karena database yang membuatnya. Untuk mencoba stok default, kirim request baru tanpa field stok:

```json
{
  "asset_name": "Amplop",
  "category": "Consumable"
}
```

Hasilnya akan memiliki `stock_quantity: 0`. Kalau stok kamu isi, gunakan angka bulat nol atau lebih; `null`, `-1`, `1.5`, dan string `"10"` akan ditolak. Kategori tetap harus kamu pilih karena tidak memiliki nilai default.

Cukup kirim nama, stok, dan kategori. Field lain akan diabaikan, termasuk `asset_id`; kamu tidak bisa menentukan ID aset baru dari body.

## Mengubah aset (PATCH /assets/:id)

Dengan PATCH, kamu cukup mengirim field yang ingin diubah. Contoh ini hanya mengganti nama aset:

```http
PATCH http://localhost:3000/api/assets/16
Content-Type: application/json
```

```json
{
  "asset_name": "Scanner Administrasi"
}
```

Respons **200 OK**:

```json
{
  "asset_id": 16,
  "asset_name": "Scanner Administrasi",
  "stock_quantity": 2,
  "category": "Non-Consumable"
}
```

- Kirim minimal satu field yang dikenal: `asset_name`, `stock_quantity`, atau `category`.
- Field yang tidak dikirim mempertahankan nilai lama, termasuk stok. Stok tidak otomatis kembali menjadi `0` saat PATCH.
- Validasi field yang dikirim mengikuti POST; nama dibuang spasi awal/akhirnya.
- Mengirim `stock_quantity: 0` diperbolehkan; `null` tidak diperbolehkan.
- Body `{}` atau hanya field yang tidak dikenal menghasilkan **400**.
- Field tambahan diabaikan jika terdapat field dikenal yang valid. `asset_id` tidak dapat diubah.
- Nilai baru boleh sama dengan nilai lama; tidak ada kewajiban nilainya benar-benar berbeda.
- ID tidak ditemukan dengan body valid menghasilkan **404**. Body tidak valid dapat menghasilkan **400** sebelum pencarian ID dilakukan.

## Menghapus aset (DELETE /assets/:id)

```http
DELETE http://localhost:3000/api/assets/16
```

Untuk menghapus, cukup isi alamat dan pilih method DELETE; body boleh dikosongkan. Kalau berhasil, Postman akan menampilkan **204 No Content** dengan body kosong. Itu berarti penghapusan berhasil.

Data dihapus permanen. Kalau kamu menghapus lagi ID yang sama, responsnya **404** karena asetnya sudah tidak ada.

## Membaca pesan error

Contoh **400 Bad Request** untuk `GET /assets?page=0`:

```json
{
  "message": "page harus berupa integer positif",
  "error": "Bad Request",
  "statusCode": 400
}
```

Contoh **404 Not Found**:

```json
{
  "message": "Aset tidak ditemukan",
  "error": "Not Found",
  "statusCode": 404
}
```

Contoh **500 Internal Server Error** untuk kegagalan internal yang tidak ditangani secara khusus:

```json
{
  "statusCode": 500,
  "message": "Internal server error"
}
```

Kalau request ditolak, baca bagian `message` untuk mengetahui apa yang perlu diperbaiki. Jika beberapa field salah sekaligus, API mengembalikan pesan dari pemeriksaan pertama yang gagal.

Pesan stok pada POST saat ini berbunyi `stock_quantity harus angka`. Pada PATCH, pesannya lebih lengkap: `stock_quantity harus integer antara 0 dan 2147483647`. Aturan stok yang diterapkan tetap sama.

## Skenario pemeriksaan di Postman

Supaya mudah dicoba ulang, buat satu collection di Postman dan tambahkan variable `base_url` berisi `http://localhost:3000/api`. Setelah itu, kamu bisa memakai URL `{{base_url}}/assets`.

Coba langkah-langkah berikut secara berurutan. Saat berhasil menambah aset, catat ID dari responsnya; gunakan ID itu untuk mencoba detail, edit, dan hapus. Untuk POST dan PATCH, pilih Body, raw, lalu JSON.

| Langkah | Request/input | Hasil yang diperiksa |
| --- | --- | --- |
| 1 | GET `/assets` | 200; maksimal 10 data pada default limit, metadata sesuai isi database |
| 2 | GET `/assets?page=2&limit=10` | 200; halaman kedua, hasil dapat kosong jika total tidak cukup |
| 3 | GET `/assets?search=KERTAS` | 200; cocok dengan nama tanpa membedakan huruf besar/kecil |
| 4 | GET `/assets?search=nama-yang-tidak-tersedia` | 200; array kosong, total dan totalPages 0 |
| 5 | GET `/assets?page=0` atau `limit=1.5` | 400 |
| 6 | POST aset percobaan tanpa stok | 201; ID otomatis, stok 0 |
| 7 | GET `/assets/:id` dari hasil POST | 200; data yang baru dibuat |
| 8 | POST nama kosong, kategori salah, atau stok null/negatif/pecahan/string | 400; tidak membuat aset |
| 9 | PATCH hanya nama aset percobaan | 200; nama berubah, stok/kategori tetap |
| 10 | PATCH `{"stock_quantity": 0}` | 200; stok nol diterima |
| 11 | PATCH `{}`, kategori salah, atau stok null | 400 |
| 12 | GET/PATCH/DELETE dengan ID `abc` atau `0` | 400; untuk PATCH gunakan body valid |
| 13 | GET/PATCH ID valid yang tidak tersedia | 404; untuk PATCH gunakan body valid |
| 14 | DELETE aset percobaan | 204 dan body kosong |
| 15 | GET detail atau DELETE ulang ID yang dihapus | 404 |

Setiap POST yang berhasil menambah data, dan setiap DELETE yang berhasil menguranginya. Jadi, jumlah aset tidak harus selalu 15 dan ID bisa memiliki celah. Angka 15 hanya jumlah awal jika kamu menjalankan seed pada tabel kosong.

Setelah mencoba di Postman, kamu bisa melakukan hal yang sama lewat frontend. Tambahkan atau ubah aset, lalu refresh halaman untuk memastikan datanya tetap tersimpan. Untuk mencoba kondisi gagal koneksi, matikan backend sebentar, muat ulang halaman frontend, lalu nyalakan backend kembali dan klik **Coba lagi**.
