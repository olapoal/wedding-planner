# 💍 WEDDING PLANNER PRO - Aplikasi Perencana Pernikahan Impian

Aplikasi web modern, hangat, romantis, dan kekinian untuk membantu calon pengantin dan keluarga merencanakan setiap detail pernikahan impian secara tertata rapi, terukur, dan transparan.

Aplikasi ini didesain khusus agar **siap dijual secara digital (monetisasi) melalui platform Lynk.id** dengan sistem **Akses Berbayar via Validasi Email Pembeli** dan fitur **Demo 2 Menit Anti-Abuse**.

---

## 🌟 Mengapa Aplikasi Ini Istimewa? (Tiruan Excel + Enhancements)

Aplikasi ini mengadopsi 100% struktur dan logika dari spreadsheet perencanaan pernikahan lengkap Anda, serta ditingkatkan (*enhanced*) menjadi aplikasi interaktif modern:

| Modul Spreadsheet Excel | Peningkatan di Wedding Planner Pro |
| :--- | :--- |
| **Dashboard Acara** | Countdown hari real-time dengan animasi detak cinta ❤️, metrik keuangan 4-kartu, ringkasan tamu & RSVP, serta widget 7 tugas terdekat. |
| **Guideline Acara** | Q&A interaktif konsep pernikahan (visi, anggaran, tema, lokasi, WO) yang dapat langsung diedit dan disimpan. |
| **Tips Keuangan** | 10 aturan emas menghemat biaya pernikahan, kalkulator batas maksimal 50% tabungan, dan panduan mitigasi risiko finansial. |
| **Tabungan & Kontributor** | Pencatatan setoran tabungan terpisah untuk Calon Pengantin Pria (CPP), Calon Pengantin Wanita (CPW), serta bantuan keluarga/kontributor. Otomatis menghitung sisa kekurangan dan rekomendasi nominal menabung per bulan! |
| **Budget Tracker** | Pencatatan detail alokasi rencana vs harga kontrak riil vs pembayaran DP/lunas. Dilengkapi tombol **"Bayar"** 1-klik dan indikator status otomatis. |
| **Checklist Persiapan** | 50+ master checklist terstruktur (Lamaran, Berkas KUA, Akad, Resepsi) lengkap dengan deteksi tugas terlewat (*overdue alert*) dan prioritas. |
| **Rundown Acara** | Timeline run-of-show untuk Lamaran, Siraman & Midodareni, Akad Nikah, dan Resepsi. Dilengkapi tombol **"Cetak Rundown Resmi (PDF)"** siap bagikan ke WO dan keluarga! |
| **Daftar Tamu & RSVP** | Kelola tamu, kategori keluarga/teman, nomor meja, dan **tombol "Kirim Undangan WhatsApp" otomatis** dengan teks undangan personal berbahasa Indonesia! |
| **Bridesmaid & Groomsmen** | Daftar sahabat pendamping, ukuran gaun/jas, status seragam, serta panduan pembagian tugas sakral di hari-H. |
| **Perbandingan Vendor** | Matrix komparasi berdampingan (*side-by-side*) untuk 7 pos penting: Venue, Catering, Foto/Video, MUA, WO, Dekorasi, dan Busana. Dilengkapi tombol **"Pilih Jadi Vendor Utama"**. |
| **Administrasi & Seserahan** | 14 berkas syarat Simkah Kemenag KUA & 30 item belanja seserahan lengkap dengan link produk Shopee/Tokopedia dan perbandingan harga opsi 1 vs 2. |
| **List Lagu Pernikahan** | Playlist kurasi momen sakral: Akad (Payung Teduh), Kirab (Tiara Andini / Christina Perri), First Dance (Ed Sheeran), dan ramah tamah. |
| **Rancangan Biaya (3jt - 100jt)** | Preset alokasi ideal untuk paket 3jt, 5jt, 10jt, 20jt, 50jt, hingga 100jt, ditambah **Kalkulator Golden Ratio Kustom** (masukkan angka anggaran berapa saja, otomatis dibagi ke pos-pos penting!). |
| **Bonus & Deep Talk** | **180 Pertanyaan Pra-Nikah** (Finansial, Mertua, Pengasuhan Anak, Karir, Konflik, dan Nilai Hidup), Roadmap Keuangan 5 Tahun Pasca Nikah, dan Palet Moodboard Warna. |

---

## 💳 Cara Kerja Monetisasi di Lynk.id & Pemisahan Portal

Sistem aplikasi ini dirancang persis seperti **Aplikasi Hitung KPR**, di mana portal pembeli/customer dan portal penjual/admin dipisahkan secara profesional:

### 1. 🛍️ Portal Customer (`index.html`)
- **Tujuan**: Digunakan 100% oleh pembeli/calon pengantin untuk merencanakan pernikahan impian mereka dengan 14 modul lengkap tanpa gangguan menu teknis/penjualan.
- **Validasi Akses**: Pembeli memasukkan alamat email yang mereka gunakan saat checkout di Lynk.id.
- **Penyimpanan Lokal**: Setelah terverifikasi, status login dan seluruh data tersimpan rapi di browser calon pengantin selamanya.
- **Uji Coba Demo 2 Menit (Anti-Abuse)**: Calon pembeli dapat mencoba aplikasi selama 2 menit. Selama demo berlangsung, timer berjalan mundur di bagian atas. Ketika 2 menit habis, aplikasi terkunci otomatis dan mengarahkan ke pembelian Lynk.id. Sistem dilengkapi proteksi sidik jari perangkat (Device Fingerprinting) & IP tracking agar tidak dapat dicurangi dengan refresh atau berganti browser.

### 2. 🛡️ Portal Admin (`admin.html`)
- **Tujuan**: Dedicated portal mandiri khusus pemilik/penjual untuk mengelola lisensi pembeli dan mengintegrasikan webhook.
- **Akses**: Buka `admin.html` (URL: `http://localhost:5500/admin.html` atau `https://domain-anda.netlify.app/admin.html`).
- **Autentikasi**: Dilindungi PIN / Password Admin (Default: `1234` atau `nikah2026`). Password dapat diganti kapan saja dari menu admin.
- **Fitur Utama Admin**:
  * **Dashboard Metrik**: Total Pembeli Aktif, Status Webhook Lynk.id, Toko Lynk.id, Mode Validasi.
  * **Tambah Pembeli Manual**: Berikan akses instan ke email customer baru.
  * **Bulk Import Email**: Copy-paste puluhan atau ratusan email sekaligus dari export riwayat pesanan Lynk.id.
  * **Tabel Lisensi Pembeli**: Fitur pencarian email instan, tombol konfirmasi WhatsApp otomatis ke pembeli, dan opsi cabut akses (*revoke*).
  * **Export CSV**: Download daftar email seluruh pembeli aktif ke format `.csv` dengan 1 klik.
  * **Webhook Lynk.id Otomatis**: Integrasi Netlify Functions (`lynk-webhook.js`) agar setiap kali ada transaksi sukses di Lynk.id, email pembeli langsung otomatis aktif tanpa perlu input manual.
  * **Kontrol Demo & Reset Testing**: Tombol reset demo khusus penjual untuk memudahkan pengujian berulang di browser sendiri.

---

## 🚀 Cara Menjalankan Aplikasi

Aplikasi ini dibangun dengan arsitektur web modern mandiri (*zero-dependency*), tanpa memerlukan installasi Node.js atau kompilasi yang rumit:

### Opsi A: Jalankan Lokal di Komputer (Windows)
1. Cukup **dobel klik** file:
   ```
   start.bat
   ```
   Atau jalankan via PowerShell di folder ini:
   ```powershell
   .\server.ps1
   ```
2. Browser akan otomatis terbuka dengan pilihan link:
   - **Portal Customer**: `http://localhost:5500`
   - **Portal Admin**: `http://localhost:5500/admin.html`

### Opsi B: Buka Langsung Tanpa Server
Anda juga bisa langsung melakukan **dobel klik** pada file `index.html` (untuk customer) atau `admin.html` (untuk admin) di Google Chrome atau Microsoft Edge!

### Opsi C: Publikasi / Hosting Online di Netlify
Untuk menjual di Lynk.id, cukup deploy folder ini ke **Netlify**:
1. Drag and drop folder `wedding-planner` ke dashboard Netlify.
2. Fitur serverless Netlify Functions (`netlify/functions/`) otomatis aktif untuk webhook Lynk.id, verifikasi email, dan proteksi anti-abuse demo.
3. Masukkan URL Webhook Netlify Anda ke menu **Lynk.id > Settings > Webhook**.

---

## 📁 Struktur Berkas

```
wedding-planner/
├── assets/
│   ├── css/
│   │   └── style.css          # Desain mewah warm aesthetic, champagne gold & dusty rose
│   └── js/
│       ├── app.js             # Logika aplikasi customer, reactive rendering & state management
│       ├── auth.js            # Sistem validasi email Lynk.id, demo 2 menit & device fingerprinting
│       ├── data.js            # Database awal diadaptasi dari Excel spreadsheet
│       └── export.js          # Fitur backup JSON, restore data & cetak PDF rundown
├── netlify/
│   └── functions/
│       ├── admin-buyers.js    # Netlify function untuk CRUD lisensi pembeli
│       ├── demo-session.js    # Netlify function anti-abuse demo 2 menit (IP & fingerprint)
│       ├── lynk-webhook.js    # Webhook handler otomatis saat order Lynk.id sukses
│       └── verify-email.js    # API verifikasi email pembeli saat login
├── index.html                 # 🛍️ Portal Customer (14 Modul Eksklusif Perencanaan Pernikahan)
├── admin.html                 # 🛡️ Portal Admin (Kelola Lisensi Pembeli & Lynk.id Webhook)
├── server.ps1                 # Web server lokal ringan PowerShell (port 5500)
├── start.bat                  # Launcher instan 1-klik untuk kedua portal
├── netlify.toml               # Konfigurasi deploy Netlify & routing
├── package.json               # Konfigurasi dependensi Netlify Blobs
└── README.md                  # Dokumentasi lengkap & panduan jualan
```

---

## 🔒 Backup & Keamanan Data
- Seluruh perubahan data yang diinputkan pengguna (nominal tabungan, checklist, tamu baru, dll.) tersimpan aman di browser masing-masing.
- Pengguna dapat mengklik tombol **"Backup"** kapan saja untuk mengunduh berkas `.json` cadangan, dan mengklik **"Restore"** untuk memulihkan data jika berganti perangkat/ponsel!
