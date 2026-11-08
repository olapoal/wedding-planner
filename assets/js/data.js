/**
 * WEDDING PLANNER DATA STORE & DEFAULT SEED DATA
 * Mengadopsi struktur lengkap dari spreadsheet perencanaan pernikahan
 */

const DEFAULT_WEDDING_DATA = {
  profile: {
    cppName: "Anggah",
    cpwName: "Chintya",
    weddingDate: "2027-03-04",
    weddingTime: "08:00",
    venueName: "Villa Bukit Randu Wedding Garden",
    venueCity: "Bandar Lampung",
    estimatedGuests: 100,
    themeConcept: "Garden Party Natural & Elegant",
    primaryColor: "#D4AF37", // Warm Gold
    secondaryColor: "#E8A598", // Dusty Rose
    tertiaryColor: "#FAF7F2", // Warm Linen
    weddingVision: "Menciptakan suasana yang intim, hangat, dan santai yang memperkuat nilai-nilai keagamaan kami bersama keluarga dan sahabat tercinta.",
    photoUrl: ""
  },

  // GUIDELINE ACARA (Tanya Jawab Konsep Pernikahan)
  guidelineQA: [
    {
      id: "g1",
      topic: "Visi Pernikahan",
      question: "Apa visi dan tujuan Anda untuk pernikahan ini? Apakah Anda ingin pernikahan yang intim, megah, santai, atau mungkin fokus pada aspek keagamaan?",
      answer: "Visi dan tujuan kami untuk pernikahan ini adalah menciptakan suasana yang intim dan santai yang memperkuat nilai-nilai keagamaan kami."
    },
    {
      id: "g2",
      topic: "Anggaran Awal",
      question: "Berapa besar anggaran yang Anda miliki untuk pesta pernikahan? Menentukan anggaran awal akan membantu mempersempit pilihan dan mengarahkan keputusan Anda ke arah yang realistis.",
      answer: "Anggaran awal yang kami alokasikan untuk seluruh rangkaian acara pernikahan adalah sebesar Rp 138.000.000 (Target tabungan Rp 100.000.000 + kontribusi keluarga)."
    },
    {
      id: "g3",
      topic: "Prioritas Utama",
      question: "Apa yang paling penting bagi Anda dalam pernikahan ini? Apakah fokus Anda pada pengalaman tamu, kualitas makanan, hiburan, dekorasi, atau aspek lainnya?",
      answer: "Yang paling penting bagi kami adalah pengalaman tamu yang nyaman dan kualitas katering hidangan yang lezat serta berkesan."
    },
    {
      id: "g4",
      topic: "Tamu Undangan",
      question: "Berapa banyak tamu yang ingin Anda undang? Menentukan jumlah tamu akan mempengaruhi pilihan tempat, anggaran makanan, dan banyak aspek lain dari pernikahan.",
      answer: "Kami berencana mengundang sekitar 100 - 150 undangan terpilih (estimasi 200 - 300 pax kehadiran) demi menjaga keintiman acara."
    },
    {
      id: "g5",
      topic: "Lokasi Acara",
      question: "Apakah Anda lebih memilih acara pernikahan di dalam ruangan atau di luar ruangan? Keputusan ini akan mempengaruhi pemilihan lokasi dan dekorasi.",
      answer: "Kami lebih memilih acara semi-outdoor garden party dengan pemandangan bukit dan nuansa alam yang asri, dipadukan tenda transparan elegan."
    },
    {
      id: "g6",
      topic: "Tanggal & Waktu",
      question: "Bagaimana jadwal waktu pernikahan Anda? Menentukan tanggal dan waktu yang diinginkan akan membantu dalam mencocokkan ketersediaan tempat, vendor, dan tamu yang diundang.",
      answer: "Akad nikah pagi hari (07.30 - 10.00 WIB) dilanjutkan resepsi siang yang hangat (11.00 - 15.00 WIB)."
    },
    {
      id: "g7",
      topic: "Tema & Gaya",
      question: "Apakah ada tema khusus yang ingin Anda terapkan? Memilih tema pernikahan dapat memberikan arahan dalam hal dekorasi, pakaian, dan konsep keseluruhan pernikahan.",
      answer: "Tema Rustic Garden Romance dengan sentuhan palet Champagne Gold, Warm Terracotta, dan aksen dedaunan hijau alami."
    },
    {
      id: "g8",
      topic: "Panitia & Wedding Organizer",
      question: "Bagaimana Anda ingin menangani aspek perencanaan? Apakah Anda ingin mengurus semuanya sendiri atau menggunakan jasa Wedding Organizer?",
      answer: "Kami menggunakan Wedding Organizer (Day Coordinator) untuk menghandle jalannya hari-H secara profesional agar keluarga tetap santai menikmati momen."
    },
    {
      id: "g9",
      topic: "Momen Spesial & Tradisi",
      question: "Bagaimana Anda ingin merayakan momen khusus dalam pernikahan, seperti pertukaran cincin, pemotongan kue, atau tarian pertama? Tradisi apa yang ingin diikuti?",
      answer: "Prosesi sungkeman khidmat kepada orang tua, pelepasan merpati/balon harapan, serta first dance santai diiringi lagu akustik romantis favorit kami."
    }
  ],

  // TABUNGAN & KONTRIBUTOR
  savings: {
    targetAmount: 100000000,
    deadlineDate: "2026-09-08",
    cppContributions: [
      { id: "c1", date: "2026-07-16", amount: 89080, note: "Tabungan awal CPP" },
      { id: "c2", date: "2026-07-31", amount: 1000000, note: "Gaji bulan Juli CPP" }
    ],
    cpwContributions: [
      { id: "w1", date: "2026-07-16", amount: 89028, note: "Tabungan awal CPW" },
      { id: "w2", date: "2026-07-31", amount: 1000000, note: "Gaji bulan Juli CPW" }
    ],
    familyContributions: [
      { id: "f1", name: "Bapak Arman (Ayah CPP)", amount: 10000000, note: "Bantuan biaya sewa gedung", date: "2026-08-01" }
    ]
  },

  // BUDGET TRACKER (Event & Kategori Pengeluaran)
  budgetCategories: [
    // Lamaran
    { id: "b1", event: "Lamaran", category: "Catering", name: "Konsumsi Keluarga Acara Lamaran", vendor: "Dapur Berkah", phone: "0812-9988-1122", planned: 1500000, actual: 1500000, paid: 1500000, status: "LUNAS" },
    { id: "b2", event: "Lamaran", category: "Decor", name: "Backdrop & Bunga Lamaran", vendor: "Rustic Corner", phone: "0813-8877-2233", planned: 800000, actual: 800000, paid: 800000, status: "LUNAS" },
    { id: "b3", event: "Lamaran", category: "Photo/Video", name: "Dokumentasi Lamaran 3 Jam", vendor: "Lensa Cerita", phone: "0857-1122-3300", planned: 700000, actual: 700000, paid: 700000, status: "LUNAS" },

    // Akad & Resepsi
    { id: "b4", event: "Akad & Resepsi", category: "Catering", name: "Katering Prasmanan All-in (300 pax)", vendor: "Sari Rasa Catering", phone: "0812-3344-5566", planned: 10350000, actual: 10350000, paid: 5000000, status: "DP" },
    { id: "b5", event: "Akad & Resepsi", category: "Catering", name: "Food Stall & Dessert Tambahan", vendor: "Sari Rasa Catering", phone: "0812-3344-5566", planned: 1725000, actual: 1725000, paid: 0, status: "BELUM" },
    { id: "b6", event: "Akad & Resepsi", category: "Venue", name: "Sewa Gedung / Villa Bukit Randu", vendor: "Villa Bukit Randu", phone: "0813-6655-4321", planned: 13000000, actual: 13000000, paid: 6500000, status: "DP" },
    { id: "b7", event: "Akad & Resepsi", category: "Entertainment", name: "Sound System & Genset", vendor: "Harmoni Sound", phone: "0821-4433-2211", planned: 3150000, actual: 3150000, paid: 1000000, status: "DP" },
    { id: "b8", event: "Akad & Resepsi", category: "Entertainment", name: "Musik Acustik / Electone Wedding", vendor: "Melody Wedding Band", phone: "0856-7788-9900", planned: 3850000, actual: 3850000, paid: 0, status: "BELUM" },
    { id: "b9", event: "Akad & Resepsi", category: "Decor", name: "Pelaminan & Fresh Flower", vendor: "Almahera Decor", phone: "0821-0989-8438", planned: 4675000, actual: 4675000, paid: 2000000, status: "DP" },
    { id: "b10", event: "Akad & Resepsi", category: "Decor", name: "Panggung, Backdrop & Karpet Jalan", vendor: "Almahera Decor", phone: "0821-0989-8438", planned: 2550000, actual: 2550000, paid: 0, status: "BELUM" },
    { id: "b11", event: "Akad & Resepsi", category: "Decor", name: "Dekor Meja Tamu, VIP & Fairy Lighting", vendor: "Almahera Decor", phone: "0821-0989-8438", planned: 1275000, actual: 1275000, paid: 0, status: "BELUM" },
    { id: "b12", event: "Akad & Resepsi", category: "Attire", name: "Rias Pengantin (Akad + Resepsi)", vendor: "Glow MUA Studio", phone: "0813-7766-5544", planned: 3575000, actual: 3575000, paid: 1500000, status: "DP" },
    { id: "b13", event: "Akad & Resepsi", category: "Attire", name: "Busana Gaun & Jas Pengantin", vendor: "Royal Bridal", phone: "0822-1133-5577", planned: 2925000, actual: 2925000, paid: 1000000, status: "DP" },
    { id: "b14", event: "Akad & Resepsi", category: "Attire", name: "Rias & Busana Ibu/Keluarga Inti", vendor: "Glow MUA Studio", phone: "0813-7766-5544", planned: 1500000, actual: 1500000, paid: 0, status: "BELUM" },
    { id: "b15", event: "Akad & Resepsi", category: "Photo/Video", name: "Foto Dokumentasi Full Day + Album", vendor: "Kancapa Photo", phone: "0813-2211-4455", planned: 3750000, actual: 3750000, paid: 1500000, status: "DP" },
    { id: "b16", event: "Akad & Resepsi", category: "Photo/Video", name: "Video Sinematik + Teaser Highlight", vendor: "Kancapa Photo", phone: "0813-2211-4455", planned: 3750000, actual: 3750000, paid: 1500000, status: "DP" },
    { id: "b17", event: "Akad & Resepsi", category: "Souvenir", name: "Souvenir Tamu Undangan (250 pcs)", vendor: "Kriya Cantik Souvenir", phone: "0858-2233-4455", planned: 1050000, actual: 1050000, paid: 1050000, status: "LUNAS" },
    { id: "b18", event: "Akad & Resepsi", category: "Undangan", name: "Cetak Undangan Fisik Hardcover", vendor: "Percetakan Pelangi", phone: "0812-4455-6677", planned: 420000, actual: 420000, paid: 420000, status: "LUNAS" },
    { id: "b19", event: "Akad & Resepsi", category: "Undangan", name: "Undangan Website Digital Interaktif", vendor: "Lynk Wedding Web", phone: "0813-8899-7766", planned: 180000, actual: 180000, paid: 180000, status: "LUNAS" },
    { id: "b20", event: "Akad & Resepsi", category: "Seserahan", name: "Paket Seserahan & Kotak Hantaran", vendor: "Hantaran Cantik Lampung", phone: "0821-6655-9988", planned: 3000000, actual: 3000000, paid: 1500000, status: "DP" },
    { id: "b21", event: "Akad & Resepsi", category: "WO", name: "Wedding Organizer (Day of Coordinator)", vendor: "Aura Wedding Organizer", phone: "0812-7788-9911", planned: 3500000, actual: 3500000, paid: 1500000, status: "DP" },
    { id: "b22", event: "Akad & Resepsi", category: "Admin", name: "Pendaftaran KUA & Penghulu", vendor: "KUA Setempat", phone: "-", planned: 700000, actual: 700000, paid: 600000, status: "DP" },
    { id: "b23", event: "Akad & Resepsi", category: "Admin", name: "Administrasi Surat & Materai", vendor: "Kelurahan/Puskesmas", phone: "-", planned: 150000, actual: 150000, paid: 150000, status: "LUNAS" },
    { id: "b24", event: "Akad & Resepsi", category: "Admin", name: "Cek Kesehatan & Imunisasi TT", vendor: "Puskesmas", phone: "-", planned: 200000, actual: 200000, paid: 200000, status: "LUNAS" },
    { id: "b25", event: "Akad & Resepsi", category: "Admin", name: "Transport & Pengurusan Dokumen", vendor: "Pribadi", phone: "-", planned: 50000, actual: 50000, paid: 50000, status: "LUNAS" },
    { id: "b26", event: "Akad & Resepsi", category: "Lain-lain", name: "MC / Pranatacara & Qori", vendor: "Ustadz & MC Pro", phone: "0857-9900-1122", planned: 2610000, actual: 2610000, paid: 0, status: "BELUM" },
    { id: "b27", event: "Akad & Resepsi", category: "Lain-lain", name: "Seragam Panitia & Keluarga", vendor: "Toko Kain Jaya", phone: "0812-0099-8877", planned: 2204000, actual: 2204000, paid: 2204000, status: "LUNAS" },
    { id: "b28", event: "Akad & Resepsi", category: "Lain-lain", name: "Parkir, Keamanan & Kebersihan Gedung", vendor: "Pengelola Venue", phone: "-", planned: 986000, actual: 986000, paid: 0, status: "BELUM" },
    { id: "b29", event: "Akad & Resepsi", category: "Adat", name: "Prosesi Adat (Siraman & Midodareni)", vendor: "Sanggar Adat", phone: "0813-5566-7788", planned: 5000000, actual: 5000000, paid: 2500000, status: "DP" },
    { id: "b30", event: "Akad & Resepsi", category: "Cadangan", name: "Dana Cadangan & Biaya Tak Terduga", vendor: "Kas Pengantin", phone: "-", planned: 3571250, actual: 3571250, paid: 0, status: "BELUM" },

    // Honeymoon
    { id: "b31", event: "Honeymoon", category: "Lain-lain", name: "Paket Honeymoon & Tiket Liburan", vendor: "Traveloka / Tiket.com", phone: "-", planned: 15000000, actual: 12000000, paid: 0, status: "BELUM" }
  ],

  // CHECKLIST SHEET PERSIAPAN (50+ Tugas)
  checklists: [
    // Lamaran
    { id: "t1", stage: "Lamaran", task: "Mempersiapkan cincin tunangan", vendor: "Toko Mas Sejahtera", date: "2026-09-08", done: true, priority: "Tinggi", notes: "Ukuran jari sudah diukur" },
    { id: "t2", stage: "Lamaran", task: "Mempersiapkan hantaran lamaran", vendor: "Hantaran Cantik", date: "2026-09-09", done: true, priority: "Sedang", notes: "7 box hantaran buah & kue" },
    { id: "t3", stage: "Lamaran", task: "Mempersiapkan makanan atau hidangan lamaran", vendor: "Dapur Berkah", date: "2026-09-10", done: true, priority: "Tinggi", notes: "Menu prasmanan keluarga 50 pax" },
    { id: "t4", stage: "Lamaran", task: "Mempersiapkan transportasi keluarga CPP", vendor: "Rental Mobil", date: "2026-09-11", done: true, priority: "Sedang", notes: "Sewa 2 mobil HiAce" },
    { id: "t5", stage: "Lamaran", task: "Mempersiapkan pakaian calon pengantin pria dan wanita", vendor: "Butik Cantika", date: "2026-09-12", done: true, priority: "Tinggi", notes: "Warna senada sage green" },
    { id: "t6", stage: "Lamaran", task: "Mempersiapkan seragam lamaran keluarga", vendor: "Toko Kain Jaya", date: "2026-09-13", done: true, priority: "Rendah", notes: "Batik motif senada" },
    { id: "t7", stage: "Lamaran", task: "Mempersiapkan dokumentasi foto lamaran", vendor: "Lensa Cerita", date: "2026-09-14", done: true, priority: "Sedang", notes: "1 fotografer standby 3 jam" },
    { id: "t8", stage: "Lamaran", task: "Mempersiapkan dekorasi backdrop lamaran", vendor: "Rustic Corner", date: "2026-09-15", done: true, priority: "Sedang", notes: "Backdrop kayu & standing flower" },

    // Administrasi & Akad
    { id: "t9", stage: "Akad", task: "Mempersiapkan KTP & FC CPP / CPW", vendor: "Dukcapil", date: "2026-09-17", done: true, priority: "Tinggi", notes: "10 lembar fotokopi" },
    { id: "t10", stage: "Akad", task: "Mempersiapkan KK (Kartu Keluarga)", vendor: "Dukcapil", date: "2026-09-18", done: true, priority: "Tinggi", notes: "Sudah update data terbaru" },
    { id: "t11", stage: "Akad", task: "Mempersiapkan Pas Foto Latar Biru/Merah", vendor: "Studio Foto", date: "2026-09-19", done: true, priority: "Tinggi", notes: "Ukuran 2x3, 3x4, 4x6" },
    { id: "t12", stage: "Akad", task: "Mempersiapkan Materai 10.000", vendor: "Kantor Pos", date: "2026-09-20", done: true, priority: "Sedang", notes: "Sedia 10 lembar" },
    { id: "t13", stage: "Akad", task: "Mempersiapkan Surat Pengantar RT/RW & Kelurahan (N1-N4)", vendor: "Kelurahan", date: "2026-09-21", done: true, priority: "Tinggi", notes: "Surat pengantar nikah selesai" },
    { id: "t14", stage: "Akad", task: "Mempersiapkan Mahar & Mas Kawin", vendor: "Pegadaian/Antam", date: "2026-09-22", done: true, priority: "Tinggi", notes: "Logam mulia 10 gram + alat sholat" },
    { id: "t15", stage: "Akad", task: "Menentukan tempat & jam untuk Akad Nikah", vendor: "Villa Bukit Randu", date: "2026-09-23", done: true, priority: "Tinggi", notes: "Akad jam 08.00 pagi di Gazebo Taman" },
    { id: "t16", stage: "Akad", task: "Mempersiapkan sarapan / hidangan akad", vendor: "Sari Rasa", date: "2026-09-24", done: true, priority: "Sedang", notes: "Lontong sayur & coffee break" },
    { id: "t17", stage: "Akad", task: "Menentukan dekorasi meja akad nikah", vendor: "Almahera Decor", date: "2026-09-25", done: true, priority: "Sedang", notes: "Meja akad putih + kursi tiffany" },
    { id: "t18", stage: "Akad", task: "Mempersiapkan baju kebaya pengantin wanita (Akad)", vendor: "Royal Bridal", date: "2026-10-01", done: false, priority: "Tinggi", notes: "Fitting ulang H-14 hari" },
    { id: "t19", stage: "Akad", task: "Mempersiapkan beskap pengantin pria (Akad)", vendor: "Royal Bridal", date: "2026-10-02", done: false, priority: "Tinggi", notes: "Termasuk blangkon & selop" },
    { id: "t20", stage: "Akad", task: "Mengundang keluarga inti untuk akad", vendor: "Pribadi", date: "2026-10-03", done: false, priority: "Tinggi", notes: "Maksimal 40 orang di area akad" },
    { id: "t21", stage: "Akad", task: "Mempersiapkan transportasi keluarga ke lokasi akad", vendor: "Rental Mobil", date: "2026-10-04", done: false, priority: "Sedang", notes: "Standby jam 06.00 pagi" },
    { id: "t22", stage: "Akad", task: "Mendapatkan MC & Qori Pembaca Al-Quran", vendor: "Ustadz Ahmad", date: "2026-10-05", done: false, priority: "Tinggi", notes: "Sudah konfirmasi kesediaan" },
    { id: "t23", stage: "Akad", task: "Menyusun teks rundown & ijab kabul", vendor: "WO Aura", date: "2026-10-06", done: false, priority: "Tinggi", notes: "Briefing dengan penghulu KUA" },
    { id: "t24", stage: "Akad", task: "Memilih Fotografer & Videografer Akad", vendor: "Kancapa Photo", date: "2026-10-07", done: true, priority: "Tinggi", notes: "Tim standby jam 06.30 pagi" },
    { id: "t25", stage: "Akad", task: "Mempersiapkan Wali Nikah & Dokumen Wali", vendor: "Keluarga CPW", date: "2026-10-08", done: false, priority: "Tinggi", notes: "Ayah kandung hadir sebagai wali" },
    { id: "t26", stage: "Akad", task: "Mempersiapkan 2 Saksi Nikah yang Sah", vendor: "Keluarga", date: "2026-10-09", done: false, priority: "Tinggi", notes: "Saksi dari pihak CPP dan CPW" },

    // Resepsi
    { id: "t27", stage: "Resepsi", task: "Menentukan tempat & bayar DP resepsi", vendor: "Villa Bukit Randu", date: "2026-10-10", done: true, priority: "Tinggi", notes: "DP 50% sudah ditransfer" },
    { id: "t28", stage: "Resepsi", task: "Finalisasi menu katering resepsi", vendor: "Sari Rasa", date: "2026-10-11", done: false, priority: "Tinggi", notes: "Sesi food tasting 4 orang" },
    { id: "t29", stage: "Resepsi", task: "Finalisasi layout dekorasi & lighting panggung", vendor: "Almahera Decor", date: "2026-10-12", done: false, priority: "Sedang", notes: "Pengecekan jalur kabel & genset" },
    { id: "t30", stage: "Resepsi", task: "Briefing teknis Wedding Organizer", vendor: "WO Aura", date: "2026-10-13", done: false, priority: "Tinggi", notes: "Susunan kru 8 orang di venue" },
    { id: "t31", stage: "Resepsi", task: "Fitting akhir gaun resepsi pengantin wanita", vendor: "Royal Bridal", date: "2026-10-14", done: false, priority: "Tinggi", notes: "Termasuk veil dan mahkota/tiara" },
    { id: "t32", stage: "Resepsi", task: "Fitting jas resepsi pengantin pria", vendor: "Royal Bridal", date: "2026-10-15", done: false, priority: "Tinggi", notes: "Cek panjang celana & kemeja" },
    { id: "t33", stage: "Resepsi", task: "Mendapatkan MC Resepsi & penyanyi", vendor: "Melody Band", date: "2026-10-16", done: false, priority: "Sedang", notes: "List lagu wedding sudah diserahkan" },
    { id: "t34", stage: "Resepsi", task: "Membuat Rundown Acara Resepsi", vendor: "WO Aura", date: "2026-10-17", done: false, priority: "Tinggi", notes: "Kirab, sambutan, foto tamu, games" },
    { id: "t35", stage: "Resepsi", task: "Jadwal Makeup Pengantin & Retouch", vendor: "Glow MUA", date: "2026-10-18", done: false, priority: "Tinggi", notes: "Mulai makeup jam 04.30 subuh" },
    { id: "t36", stage: "Resepsi", task: "Jadwal Makeup Ibu & Saudara Kandung", vendor: "Asisten MUA", date: "2026-10-19", done: false, priority: "Sedang", notes: "3 asisten MUA disiapkan" },
    { id: "t37", stage: "Resepsi", task: "Menentukan gaun/kebaya untuk ibu kedua pihak", vendor: "Butik Cantika", date: "2026-10-20", done: false, priority: "Sedang", notes: "Warna terracotta lembut" },
    { id: "t38", stage: "Resepsi", task: "Menentukan jas/beskap bapak kedua pihak", vendor: "Toko Tailor", date: "2026-10-21", done: false, priority: "Sedang", notes: "Model nasional formal" },
    { id: "t39", stage: "Resepsi", task: "Mencetak undangan fisik & sebar undangan digital", vendor: "Percetakan Pelangi", date: "2026-10-22", done: false, priority: "Tinggi", notes: "Kirim via WhatsApp bertahap" },
    { id: "t40", stage: "Resepsi", task: "Membagikan undangan ke tamu prioritas / VIP", vendor: "Pribadi", date: "2026-10-23", done: false, priority: "Tinggi", notes: "Antar langsung ke keluarga sepuh" },
    { id: "t41", stage: "Resepsi", task: "Mengambil cincin nikah dari toko perhiasan", vendor: "Toko Mas", date: "2026-10-24", done: false, priority: "Tinggi", notes: "Cek grafir nama di dalam cincin" },
    { id: "t42", stage: "Resepsi", task: "Mengatur layout meja tamu & seating VIP", vendor: "WO Aura", date: "2026-10-25", done: false, priority: "Sedang", notes: "Meja keluarga di baris terdepan" },
    { id: "t43", stage: "Resepsi", task: "Pengecekan kualitas dan jumlah souvenir", vendor: "Kriya Cantik", date: "2026-10-26", done: false, priority: "Sedang", notes: "Sudah dibungkus rapi dengan pita" },
    { id: "t44", stage: "Resepsi", task: "Menunjuk penerima tamu & penjaga buku tamu", vendor: "Bridesmaid", date: "2026-10-27", done: false, priority: "Sedang", notes: "4 orang bridesmaid standby di meja registrasi" },
    { id: "t45", stage: "Resepsi", task: "Mempersiapkan box gembok amplop / QRIS", vendor: "WO Aura", date: "2026-10-28", done: false, priority: "Tinggi", notes: "Kunci box dipegang pihak keluarga" },
    { id: "t46", stage: "Resepsi", task: "Mempersiapkan wedding cake & pisau potong kue", vendor: "Sweet Bakery", date: "2026-10-29", done: false, priority: "Rendah", notes: "Kue 3 tingkat tema floral" },
    { id: "t47", stage: "Resepsi", task: "Menyiapkan transportasi & hotel untuk keluarga luar kota", vendor: "Hotel Emersia", date: "2026-10-30", done: false, priority: "Sedang", notes: "Booking 3 kamar keluarga" },
    { id: "t48", stage: "Resepsi", task: "Gladi resik / rehearsal kirab & prosesi", vendor: "WO Aura", date: "2026-11-01", done: false, priority: "Tinggi", notes: "H-1 malam sebelum hari-H" },
    { id: "t49", stage: "Resepsi", task: "Mempersiapkan emergency kit pengantin", vendor: "Bridesmaid", date: "2026-11-02", done: false, priority: "Sedang", notes: "Jarum, benang, koyo, obat maag, tisu" },
    { id: "t50", stage: "Resepsi", task: "Pembayaran pelunasan seluruh vendor", vendor: "Bendahara", date: "2026-11-03", done: false, priority: "Tinggi", notes: "Dilunasi setelah acara selesai sesuai SPK" }
  ],

  // RUNDOWN ACARA
  rundowns: {
    lamaran: [
      { id: "r_l1", start: "07:30", end: "08:00", title: "Persiapan & Dekorasi Ruang Lamaran", pic: "Panitia Keluarga CPW", notes: "Pastikan meja hantaran dan sound system siap." },
      { id: "r_l2", start: "08:00", end: "08:30", title: "Kedatangan Rombongan Pihak Keluarga CPP", pic: "Penyambut Tamu CPW", notes: "Disambut dengan hangat dan dipersilakan duduk di ruang utama." },
      { id: "r_l3", start: "08:30", end: "08:45", title: "Pembukaan Acara oleh MC", pic: "MC Acara", notes: "Mukadimah, pantun pembuka, dan susunan acara lamaran." },
      { id: "r_l4", start: "08:45", end: "09:15", title: "Prosesi Penyerahan Seserahan & Hantaran", pic: "Ibu CPP & Ibu CPW", notes: "Simbolis penyerahan barang hantaran dari pihak pria ke wanita." },
      { id: "r_l5", start: "09:15", end: "09:45", title: "Sambutan & Penyampaian Maksud Kedua Keluarga", pic: "Jubir CPP & Jubir CPW", notes: "Penyampaian lamaran resmi dari perwakilan keluarga pria dan penerimaan dari pihak wanita." },
      { id: "r_l6", start: "09:45", end: "10:15", title: "Pemasangan Cincin Tanda Ikatan (Tunangan)", pic: "Ibu CPP ke CPW", notes: "Calon mempelai wanita keluar, pemasangan cincin di jari manis." },
      { id: "r_l7", start: "10:15", end: "10:45", title: "Doa Bersama & Sesi Foto Keluarga", pic: "Fotografer & Ustadz", notes: "Doa kelancaran menuju hari-H, foto rombongan kedua keluarga." },
      { id: "r_l8", start: "10:45", end: "11:30", title: "Ramah Tamah & Makan Siang Bersama", pic: "Sie Konsumsi", notes: "Santap siang prasmanan yang diiringi musik akustik santai." }
    ],
    siraman: [
      { id: "r_s1", start: "14:00", end: "15:00", title: "Prosesi Siraman Calon Pengantin Wanita", pic: "Ibu & Sesepuh", notes: "Siraman dengan 7 sumber mata air dan bunga setaman." },
      { id: "r_s2", start: "15:00", end: "15:30", title: "Istirahat, Mandi Bersih & Ganti Busana", pic: "MUA Adat", notes: "Calon pengantin bersuci dan istirahat sejenak." },
      { id: "r_s3", start: "18:30", end: "19:00", title: "Kedatangan Tamu & Keluarga Midodareni", pic: "Panitia Keluarga", notes: "Penyambutan keluarga besar di malam midodareni." },
      { id: "r_s4", start: "19:00", end: "19:30", title: "Prosesi Midodareni & Nasihat Orang Tua", pic: "Orang Tua CPW", notes: "Pemberian wejangan kehidupan pernikahan dari orang tua." },
      { id: "r_s5", start: "19:30", end: "20:00", title: "Ramah Tamah & Santap Malam Bersama", pic: "Sie Konsumsi", notes: "Makan malam bersama keluarga intim." },
      { id: "r_s6", start: "20:00", end: "20:30", title: "Penutupan & Istirahat Menjelang Akad", pic: "WO", notes: "Pengantin diwajibkan tidur cukup agar wajah segar besok pagi." }
    ],
    akad: [
      { id: "r_a1", start: "06:30", end: "07:00", title: "Persiapan Lokasi & Penyambutan Tamu VIP", pic: "WO & Panitia", notes: "Pengecekan mic, berkas KUA, meja akad, dan saksi." },
      { id: "r_a2", start: "07:00", end: "07:30", title: "Kedatangan Penghulu KUA & 2 Saksi Nikah", pic: "PIC Penghulu (WO)", notes: "Pemeriksaan kelengkapan dokumen nikah di ruang VIP." },
      { id: "r_a3", start: "07:30", end: "08:00", title: "Kedatangan Mempelai Pria & Rombongan", pic: "Penerima Tamu", notes: "Penyambutan keluarga pria dengan kalung melati." },
      { id: "r_a4", start: "08:00", end: "08:15", title: "Pembukaan & Pembacaan Ayat Suci Al-Quran", pic: "MC & Qori", notes: "Suasana sakral dan khidmat, tamu dipersilakan tenang." },
      { id: "r_a5", start: "08:15", end: "08:45", title: "Khotbah Nikah & Prosesi Ijab Kabul", pic: "Penghulu & Wali Nikah", notes: "Momen pengucapan ijab kabul oleh mempelai pria." },
      { id: "r_a6", start: "08:45", end: "09:00", title: "Penandatanganan Buku Nikah & Dokumen KUA", pic: "Penghulu, CPP, CPW, Saksi", notes: "Penyerahan mahar dan penandatanganan buku nikah resmi." },
      { id: "r_a7", start: "09:00", end: "09:20", title: "Doa Mempelai & Pemasangan Cincin Kawin", pic: "Penghulu & Kedua Pengantin", notes: "Pengantin wanita mencium tangan suami, suami mendoakan istri." },
      { id: "r_a8", start: "09:20", end: "09:45", title: "Prosesi Sungkeman kepada Kedua Orang Tua", pic: "MC & Orang Tua", notes: "Permohonan doa restu khidmat diiringi musik instrumental lembut." },
      { id: "r_a9", start: "09:45", end: "10:15", title: "Sesi Foto Formal Keluarga Inti & Penghulu", pic: "Fotografer (Kancapa)", notes: "Foto bersama buku nikah, mahar, orang tua, dan saksi." }
    ],
    resepsi: [
      { id: "r_r1", start: "11:00", end: "11:30", title: "Persiapan Pelaminan, Band & Tim WO Standby", pic: "Koordinator Lapangan WO", notes: "Final check makanan, sound, souvenir, dan fotografer." },
      { id: "r_r2", start: "11:30", end: "12:00", title: "Kedatangan Tamu Undangan & Registrasi", pic: "Penerima Tamu & Bridesmaid", notes: "Tamu mengisi buku tamu digital/fisik dan menerima souvenir." },
      { id: "r_r3", start: "12:00", end: "12:15", title: "Pembukaan Resepsi oleh MC Formal", pic: "MC Resepsi", notes: "Ucapan selamat datang dan pengantar acara bahagia." },
      { id: "r_r4", start: "12:15", end: "12:45", title: "Grand Entrance / Kirab Pengantin Menuju Pelaminan", pic: "WO, Bridesmaid, Groomsmen", notes: "Kirab diiringi musik romantis, orang tua mendampingi di belakang." },
      { id: "r_r5", start: "12:45", end: "13:15", title: "Sambutan Perwakilan Keluarga & Ucapan Syukur", pic: "Juru Bicara Keluarga", notes: "Sambutan terima kasih kepada seluruh tamu yang hadir." },
      { id: "r_r6", start: "13:15", end: "14:00", title: "Santap Siang Tamu Undangan & Penampilan Live Musik", pic: "Katering & Wedding Band", notes: "Prasmanan dan stall makanan dibuka penuh." },
      { id: "r_r7", start: "14:00", end: "14:20", title: "Pemotongan Kue Pengantin & Wedding Toast", pic: "Kedua Mempelai & MC", notes: "Suapan pertama kue pengantin dan toast bahagia." },
      { id: "r_r8", start: "14:20", end: "14:40", title: "Momen Lempar Bunga & Mini Games Tamu", pic: "MC & Tamu Sahabat", notes: "Keseruan interaktif bersama teman-teman single." },
      { id: "r_r9", start: "14:40", end: "15:30", title: "Sesi Foto Bersama Teman & Tamu Undangan", pic: "Fotografer & WO", notes: "Foto bergiliran sesuai arahan MC di pelaminan." },
      { id: "r_r10", start: "15:30", end: "16:00", title: "Penutupan Acara Resepsi & Briefing Evaluasi", pic: "MC, WO & Keluarga Inti", notes: "Acara selesai, keluarga istirahat, panitia packing barang." }
    ]
  },

  // DAFTAR TAMU (Guest List & RSVP)
  guests: [
    { id: "g_1", name: "Rizky Pratama", phone: "0812-1111-2222", category: "Teman Pengantin Pria", eventCategory: "Akad & Resepsi", address: "Jl. Sudirman No. 5, Bandar Lampung", sent: true, rsvp: "HADIR", pax: 2, table: "Meja 01" },
    { id: "g_2", name: "Fajar Nugraha", phone: "0813-2222-3333", category: "Teman Pengantin Wanita", eventCategory: "Akad & Resepsi", address: "Jl. Kartini No. 12, Bandar Lampung", sent: true, rsvp: "HADIR", pax: 1, table: "Meja 02" },
    { id: "g_3", name: "Siti Rahma", phone: "0857-3333-4444", category: "Teman Pengantin Wanita", eventCategory: "Akad & Resepsi", address: "Jl. Diponegoro No. 8, Bandar Lampung", sent: true, rsvp: "HADIR", pax: 2, table: "Meja 02" },
    { id: "g_4", name: "Dewi Anjani", phone: "0821-4444-5555", category: "Teman Pengantin Wanita", eventCategory: "Akad & Resepsi", address: "Jl. Antasari No. 20, Bandar Lampung", sent: true, rsvp: "RAGU-RAGU", pax: 1, table: "Meja 03" },
    { id: "g_5", name: "Budi Santoso", phone: "0812-5555-6666", category: "Keluarga Mempelai Wanita", eventCategory: "Akad & Resepsi", address: "Jl. Way Sekampung No. 3, Bandar Lampung", sent: true, rsvp: "HADIR", pax: 4, table: "VIP 1" },
    { id: "g_6", name: "Sri Wahyuni", phone: "0813-6666-7777", category: "Keluarga Mempelai Wanita", eventCategory: "Akad & Resepsi", address: "Jl. Way Sekampung No. 3, Bandar Lampung", sent: true, rsvp: "HADIR", pax: 2, table: "VIP 1" },
    { id: "g_7", name: "Hendra Gunawan", phone: "0857-7777-8888", category: "Keluarga Mempelai Wanita", eventCategory: "Akad & Resepsi", address: "Jl. Untung Suropati No. 15, Bandar Lampung", sent: true, rsvp: "HADIR", pax: 2, table: "VIP 2" },
    { id: "g_8", name: "Ratna Dewi", phone: "0821-8888-9999", category: "Keluarga Mempelai Wanita", eventCategory: "Akad & Resepsi", address: "Jl. Untung Suropati No. 15, Bandar Lampung", sent: false, rsvp: "TIDAK HADIR", pax: 0, table: "-" },
    { id: "g_9", name: "Bayu Saputra", phone: "0812-9999-0000", category: "Keluarga Mempelai Wanita", eventCategory: "Akad & Resepsi", address: "Jl. Teuku Umar No. 7, Bandar Lampung", sent: false, rsvp: "BELUM KONFIRMASI", pax: 1, table: "Meja 04" },
    { id: "g_10", name: "Nadia Salsabila", phone: "0813-0000-1111", category: "Keluarga Mempelai Wanita", eventCategory: "Akad & Resepsi", address: "Jl. Sultan Agung No. 22, Bandar Lampung", sent: true, rsvp: "BELUM KONFIRMASI", pax: 1, table: "Meja 04" }
  ],

  // BRIDESMAID & GROOMSMEN
  entourage: {
    bridesmaids: [
      { id: "bm_1", name: "Siti Rahma", status: "Confirmed", role: "Penerima Tamu & Bridesmaid Lead", dressSize: "M", uniformGiven: true },
      { id: "bm_2", name: "Dewi Anjani", status: "Confirmed", role: "Pendamping Gaun CPW & Touch Up", dressSize: "S", uniformGiven: true },
      { id: "bm_3", name: "Putri Ayu", status: "Confirmed", role: "Penjaga Mahar & Cincin Nikah", dressSize: "L", uniformGiven: true },
      { id: "bm_4", name: "Larasati", status: "Confirmed", role: "Pendamping Kirab Pelaminan", dressSize: "M", uniformGiven: false },
      { id: "bm_5", name: "Nadia Salsabila", status: "Confirmed", role: "Pembawa Bunga & Emergency Kit", dressSize: "S", uniformGiven: true }
    ],
    groomsmen: [
      { id: "gm_1", name: "Rizky Pratama", status: "Confirmed", role: "Best Man & Koordinator Seserahan", suitSize: "L", uniformGiven: true },
      { id: "gm_2", name: "Fajar Nugraha", status: "Confirmed", role: "Pengatur Transportasi Keluarga", suitSize: "XL", uniformGiven: true },
      { id: "gm_3", name: "Bayu Saputra", status: "Confirmed", role: "Pendamping Kirab Pengantin Pria", suitSize: "M", uniformGiven: false },
      { id: "gm_4", name: "Dimas Aditya", status: "Confirmed", role: "Pengarah Parkir & Tim Keamanan", suitSize: "L", uniformGiven: true },
      { id: "gm_5", name: "Reza Firmansyah", status: "Confirmed", role: "Penanggung Jawab Kotak Amplop", suitSize: "M", uniformGiven: true }
    ]
  },

  // PERBANDINGAN VENDOR (Side-by-Side Comparison)
  vendors: {
    venue: [
      {
        id: "v_1",
        name: "Almahera Venue",
        phone: "021 098 984 38",
        instagram: "@almaheravenue",
        website: "almahera.com",
        address: "Jalan Situbondo Nomor 45",
        priceNote: "Rp 10.000.000 all-in",
        capacity: "500 Orang (Indoor & Semi Outdoor)",
        facilities: "Parkir, ruang resepsi, ruang ganti AC, sound system standar",
        curfew: "Hanya sampai 17.00 WIB",
        isDeal: true,
        rating: 4.8,
        pros: "Harga terjangkau, include fasilitas sound dan kursi",
        cons: "Batas waktu acara maksimal jam 5 sore"
      },
      {
        id: "v_2",
        name: "Villa Bukit Randu Wedding Garden",
        phone: "0813-6655-4321",
        instagram: "@villabukitrandu",
        website: "-",
        address: "Jl. Untung Suropati, Kemiling, Bandar Lampung",
        priceNote: "Rp 18.000.000 (8 jam sewa taman)",
        capacity: "Outdoor garden 250 - 400 tamu",
        facilities: "Taman terbuka pemandangan bukit, gazebo akad, parkir 40 mobil",
        curfew: "Hingga 21.00 WIB",
        isDeal: false,
        rating: 4.9,
        pros: "Pemandangan bukit spektakuler, estetik untuk garden party",
        cons: "Perlu sewa tenda cadangan jika hujan"
      },
      {
        id: "v_3",
        name: "Hotel Emersia Convention Hall",
        phone: "0821-1122-3344",
        instagram: "@hotelemersia",
        website: "www.hotelemersia.com",
        address: "Jl. Wolter Monginsidi No. 70, Bandar Lampung",
        priceNote: "Mulai Rp 65.000.000 (All-in katering 300 pax)",
        capacity: "Ballroom 600 sit-down, 800 standing",
        facilities: "Ruang VIP, lift difabel, parkir basement 150 mobil, full AC",
        curfew: "Fleksibel hingga 22.00 WIB",
        isDeal: false,
        rating: 4.7,
        pros: "Fasilitas bintang 4 lengkap dan aman cuaca",
        cons: "Biaya tinggi dan wajib menggunakan katering internal hotel"
      }
    ],
    catering: [
      {
        id: "c_1",
        name: "Sari Rasa Catering",
        phone: "0812-3344-5566",
        instagram: "@sarirasacatering",
        website: "-",
        address: "Jl. Pangeran Antasari, Bandar Lampung",
        priceNote: "Rp 65.000 / porsi all-in (Layanan 10%)",
        minOrder: "Minimum 100 porsi, maks 1.000 porsi",
        tasting: "Gratis untuk 2 orang",
        menuVariety: "Prasmanan lengkap 5 menu utama + snack + pilihan khas Lampung",
        isDeal: true,
        rating: 4.9,
        pros: "Rasa masakan lezat dan konsisten, staf cekatan",
        cons: "Slot cepat penuh di tanggal cantik"
      },
      {
        id: "c_2",
        name: "Cita Boga Catering & Prasmanan",
        phone: "0857-6677-8899",
        instagram: "@citabogacatering",
        website: "-",
        address: "Jl. Ratu Dibalau, Tanjung Senang, Bandar Lampung",
        priceNote: "Rp 48.000 / porsi (Belum sewa alat premium)",
        minOrder: "Minimum 150 porsi, maks 800 porsi",
        tasting: "Berbayar Rp 150.000 untuk 4 orang",
        menuVariety: "Standard 4 menu utama tradisional",
        isDeal: false,
        rating: 4.4,
        pros: "Harga per porsi sangat ekonomis",
        cons: "Belum termasuk dekor meja dan tasting berbayar"
      },
      {
        id: "c_3",
        name: "Dapur Nyonya Catering",
        phone: "0822-9988-7766",
        instagram: "@dapurnyonya.id",
        website: "www.dapurnyonya.id",
        address: "Jl. Sultan Agung, Way Halim, Bandar Lampung",
        priceNote: "Rp 85.000 / porsi all-in (Dessert table + coffee corner)",
        minOrder: "Minimum 200 porsi, maks 1.500 porsi",
        tasting: "Gratis untuk 4 orang",
        menuVariety: "7 menu utama premium + western & oriental options",
        isDeal: false,
        rating: 4.8,
        pros: "Presentasi makanan sangat mewah dan higienis",
        cons: "Budget di atas rata-rata"
      }
    ],
    photo: [
      {
        id: "p_1",
        name: "Kancapa Photo & Video",
        phone: "0813-2211-4455",
        instagram: "@kancapa.photo",
        website: "www.kancapaphoto.com",
        address: "Jl. Teuku Umar, Kedaton, Bandar Lampung",
        priceNote: "Rp 7.500.000 (Foto + Video Sinematik)",
        teamSize: "2 Fotografer + 2 Videografer",
        deliverables: "Album cetak 20 halaman, video highlight 5 menit, teaser IG, all raw files",
        isDeal: true,
        rating: 4.9,
        pros: "Gaya dokumenter natural, tone warna soft & timeless",
        cons: "Pengerjaan album fisik butuh waktu 3-4 minggu"
      },
      {
        id: "p_2",
        name: "Lensa Cerita Photography",
        phone: "0857-1122-3300",
        instagram: "@lensacerita.id",
        website: "-",
        address: "Jl. Sultan Agung, Kedaton, Bandar Lampung",
        priceNote: "Rp 4.500.000 (Paket dasar)",
        teamSize: "1 Fotografer + 1 Videografer",
        deliverables: "Video highlight 2 menit, Google Drive flashdisk 64GB",
        isDeal: false,
        rating: 4.5,
        pros: "Cocok untuk budget hemat dan acara intim",
        cons: "Tanpa album fisik dan kru terbatas"
      },
      {
        id: "p_3",
        name: "Bidik Momen Studio",
        phone: "0812-8899-0011",
        instagram: "@bidikmomen.studio",
        website: "www.bidikmomenstudio.com",
        address: "Jl. ZA Pagar Alam, Rajabasa, Bandar Lampung",
        priceNote: "Rp 12.000.000 (Sinematik + Drone + Same Day Edit)",
        teamSize: "3 Fotografer + 2 Videografer + 1 Pilot Drone",
        deliverables: "Same-day edit video teaser, album 30 hal, drone 4K, live stream",
        isDeal: false,
        rating: 4.9,
        pros: "Kualitas cinematic setara film layar lebar",
        cons: "Harga tinggi"
      }
    ],
    mua: [
      {
        id: "m_1",
        name: "Glow MUA Studio by Rina",
        phone: "0813-7766-5544",
        instagram: "@glowmua.official",
        website: "-",
        address: "Bandar Lampung",
        priceNote: "Rp 5.075.000 (Pengantin Akad+Resepsi + 2 Ibu)",
        teamSize: "1 MUA Utama + 2 Asisten Hijab/Hairdo",
        deliverables: "Trial makeup, soft glam look tahan 12 jam, melati segar",
        isDeal: true,
        rating: 4.9,
        pros: "Riasan flawless dan tidak dempul, sangat awet",
        cons: "Harus booking jauh-jauh hari"
      }
    ],
    wo: [
      {
        id: "wo_1",
        name: "Aura Wedding Organizer",
        phone: "0812-7788-9911",
        instagram: "@aurawedding.id",
        website: "-",
        address: "Bandar Lampung",
        priceNote: "Rp 3.500.000 (Day of Coordinator)",
        teamSize: "8 Kru Profesional dengan Handy Talky",
        deliverables: "Penyusunan rundown, gladi bersih H-1, koordinasi vendor & keluarga",
        isDeal: true,
        rating: 4.8,
        pros: "Kru sangat komunikatif dan responsif menangani kendala teknis",
        cons: "Hanya menangani hari-H, bukan full planner dari awal"
      }
    ],
    decor: [
      {
        id: "d_1",
        name: "Almahera Decor & Floral",
        phone: "0821-0989-8438",
        instagram: "@almaheradecor",
        website: "-",
        address: "Bandar Lampung",
        priceNote: "Rp 8.500.000 (Pelaminan + Karpet + Meja Tamu + Lighting)",
        teamSize: "Tim Dekorator 6 orang",
        deliverables: "Pelaminan 8-10 meter fresh floral, standing flowers, fairy light",
        isDeal: true,
        rating: 4.8,
        pros: "Bunga segar kombinasi artificial rapi dan aesthetic",
        cons: "Bongkaran dekor maksimal 2 jam setelah acara"
      }
    ],
    attire: [
      {
        id: "at_1",
        name: "Royal Bridal & Kebaya",
        phone: "0822-1133-5577",
        instagram: "@royalbridal.id",
        website: "-",
        address: "Bandar Lampung",
        priceNote: "Rp 4.425.000 (Gaun CPW, Beskap CPP, Aksesoris lengkap)",
        teamSize: "Fitting master & tailor",
        deliverables: "2x sesi fitting, veil mutiara, kain jumputan/batik",
        isDeal: true,
        rating: 4.7,
        pros: "Pilihan kebaya modern dan gaun sangat beragam",
        cons: "Denda keterlambatan pengembalian baju jika lewat H+2"
      }
    ]
  },

  // LIST ADMINISTRASI & SESERAHAN
  administration: [
    { id: "adm_1", title: "Surat Pengantar Nikah dari RT/RW (N1, N2, N4)", note: "Diurus di domisili calon mempelai", done: true, cost: 0 },
    { id: "adm_2", title: "Surat Keterangan Belum Menikah dari Kelurahan", note: "Kelurahan setempat", done: true, cost: 0 },
    { id: "adm_3", title: "Fotokopi KTP Calon Pengantin Pria & Wanita (10 lembar)", note: "KTP elektronik jelas", done: true, cost: 25000 },
    { id: "adm_4", title: "Fotokopi KTP Orang Tua Kedua Mempelai", note: "Untuk arsip buku nikah KUA", done: true, cost: 15000 },
    { id: "adm_5", title: "Fotokopi Kartu Keluarga (KK) CPP & CPW", note: "Pastikan data barcode terbaca", done: true, cost: 15000 },
    { id: "adm_6", title: "Fotokopi Akte Kelahiran CPP & CPW", note: "Pencocokan nama orang tua", done: true, cost: 15000 },
    { id: "adm_7", title: "Fotokopi Ijazah Terakhir CPP & CPW", note: "Pencocokan ejaan nama", done: true, cost: 15000 },
    { id: "adm_8", title: "Surat Keterangan Sehat Puskesmas & Vaksin Tetanus (TT)", note: "Wajib untuk CPW di Puskesmas", done: true, cost: 50000 },
    { id: "adm_9", title: "Cek Laboratorium & Skrining Pranikah CPP", note: "Golongan darah & skrining", done: true, cost: 100000 },
    { id: "adm_10", title: "Cek Laboratorium & Skrining Pranikah CPW", note: "HB, anemia, toxo & skrining", done: true, cost: 100000 },
    { id: "adm_11", title: "Pas Foto Berlatar Biru (2x3, 3x4, 4x6)", note: "Baju berkerah / kemeja formal", done: true, cost: 75000 },
    { id: "adm_12", title: "Pendaftaran Online ke Simkah KUA", note: "Website simkah.kemenag.go.id", done: true, cost: 0 },
    { id: "adm_13", title: "Biaya Nikah KUA di Luar Jam Kerja / Weekend", note: "Setor langsung ke kas negara PNBP", done: true, cost: 600000 },
    { id: "adm_14", title: "Mahar untuk Dokumen Pengajuan KUA", note: "Dicatat di akta nikah resmi", done: true, cost: 0 }
  ],

  // SESERAHAN
  seserahan: [
    { id: "s_1", category: "Alat Sholat", item: "Mukena Silk Premium", link1: "https://shope.ee/1LBLhATQdG", price1: 155300, link2: "https://shope.ee/5pdl3gay2u", price2: 192000, actualPrice: 175000, bought: true },
    { id: "s_2", category: "Alat Sholat", item: "Al-Quran Tajwid Pelangi", link1: "https://shope.ee/6AGbSMTc97", price1: 99960, link2: "https://shope.ee/4plDrwGLtS", price2: 155000, actualPrice: 120000, bought: true },
    { id: "s_3", category: "Alat Sholat", item: "Sajadah Turkey Halus", link1: "https://s.shopee.co.id/9A8SGKxVLA", price1: 89000, link2: "https://s.shopee.co.id/g9u8vK8xf", price2: 67000, actualPrice: 89000, bought: true },
    { id: "s_4", category: "Alat Sholat", item: "Tasbih Digital Elegant", link1: "https://shope.ee/fy7CHux1", price1: 3475, link2: "https://shope.ee/1VUltyBnrX", price2: 3390, actualPrice: 5000, bought: true },

    { id: "s_5", category: "Make Up", item: "Lipstick Matte Wardah/Maybelline", link1: "https://s.shopee.co.id/qTKL9unMw", price1: 89000, link2: "https://shope.ee/7f5PJCrpmS", price2: 72000, actualPrice: 85000, bought: true },
    { id: "s_6", category: "Make Up", item: "Two Way Cake Powder (Bedak)", link1: "https://shope.ee/2q09YOHLiR", price1: 31000, link2: "https://s.shopee.co.id/8KZLH6JfOr", price2: 55000, actualPrice: 45000, bought: true },
    { id: "s_7", category: "Make Up", item: "Eyebrow Pencil Precision", link1: "https://shope.ee/6pWIJniyY4", price1: 4300, link2: "https://shope.ee/2q09YSonH1", price2: 45000, actualPrice: 35000, bought: false },
    { id: "s_8", category: "Make Up", item: "Blush On Palette", link1: "https://shope.ee/20R2Yy8xn6", price1: 51000, link2: "https://shope.ee/8UeWIw5oTK", price2: 318250, actualPrice: 75000, bought: false },
    { id: "s_9", category: "Make Up", item: "Eyeshadow Palette Neutral Warm", link1: "https://s.shopee.co.id/3q6vuz2AOD", price1: 29340, link2: "https://s.shopee.co.id/8AFv4tLvw8", price2: 95000, actualPrice: 85000, bought: false },
    { id: "s_10", category: "Make Up", item: "Eyeliner & Maskara Waterproof", link1: "https://shope.ee/99uD6O1oTy", price1: 19400, link2: "https://shope.ee/6AGbWt46Dr", price2: 23500, actualPrice: 22000, bought: true },
    { id: "s_11", category: "Make Up", item: "Liquid Foundation Full Coverage", link1: "https://shope.ee/1q7cMyNvBi", price1: 55000, link2: "https://shope.ee/4fRnkD7rIv", price2: 92904, actualPrice: 89000, bought: false },
    { id: "s_12", category: "Make Up", item: "Beauty Blender + Brush Set", link1: "https://shope.ee/3KwQ9qbFDc", price1: 18430, link2: "https://shope.ee/4KoxLholnp", price2: 37900, actualPrice: 35000, bought: true },

    { id: "s_13", category: "Skincare", item: "Facial Wash Gentle Cleanser", link1: "https://shope.ee/8exwoKbXRR", price1: 29300, link2: "https://shope.ee/10YVhlsgBG", price2: 99000, actualPrice: 65000, bought: true },
    { id: "s_14", category: "Skincare", item: "Day Cream SPF 35", link1: "https://shope.ee/AUPb0TK2Ox", price1: 47000, link2: "https://shope.ee/2AkT5xnESu", price2: 128000, actualPrice: 95000, bought: true },
    { id: "s_15", category: "Skincare", item: "Night Cream Moisturizer", link1: "https://shope.ee/9KDddAGXGW", price1: 47000, link2: "https://shope.ee/6Ka23faUOf", price2: 128000, actualPrice: 95000, bought: true },
    { id: "s_16", category: "Skincare", item: "Hydrating Toner Essence", link1: "https://shope.ee/2L3tIMxEgM", price1: 164000, link2: "https://shope.ee/6Ka24Z54Kd", price2: 298000, actualPrice: 180000, bought: false },
    { id: "s_17", category: "Skincare", item: "Glowing Serum Vitamin C", link1: "https://shope.ee/8UeWeiWNWb", price1: 42000, link2: "https://shope.ee/7KSZGaj99P", price2: 42000, actualPrice: 42000, bought: true },

    { id: "s_18", category: "Body Care", item: "Body Wash Sabun Wangi", link1: "https://shope.ee/LIowEjjpx", price1: 25000, link2: "https://shope.ee/6Ka25HrI67", price2: 25998, actualPrice: 25000, bought: true },
    { id: "s_19", category: "Body Care", item: "Body Lotion Wangi Mewah", link1: "https://shope.ee/7f5QInbeeA", price1: 43000, link2: "https://shope.ee/7Um06WFglk", price2: 50999, actualPrice: 48000, bought: true },
    { id: "s_20", category: "Body Care", item: "Body Scrub Pink Lulur", link1: "https://shope.ee/8zantcRgh8", price1: 42500, link2: "https://shope.ee/7A99iGlSiY", price2: 57000, actualPrice: 45000, bought: false },
    { id: "s_21", category: "Body Care", item: "Eau De Parfum Aroma Romantic", link1: "https://shope.ee/fzBJphI1", price1: 135650, link2: "https://shope.ee/fzBJphI1", price2: 135650, actualPrice: 135000, bought: true },
    { id: "s_22", category: "Body Care", item: "Handuk Couple Bordir Nama", link1: "https://shope.ee/2fgkN3Xjtr", price1: 135000, link2: "https://shope.ee/9p9uuGRVel", price2: 163000, actualPrice: 150000, bought: true },

    { id: "s_23", category: "Pakaian Dalam", item: "Set Pakaian Dalam & Lingerie", link1: "https://shope.ee/8KL77ppXV3", price1: 113000, link2: "https://shope.ee/5KhVYKrkyg", price2: 113000, actualPrice: 113000, bought: true },
    { id: "s_24", category: "Pakaian Dalam", item: "Sleepwear Kimono Sutra", link1: "https://shope.ee/A9mlJG3HIP", price1: 169000, link2: "https://shope.ee/10YWOR6dai", price2: 174440, actualPrice: 169000, bought: true },

    { id: "s_25", category: "Outfit & Sepatu", item: "Set Kebaya & Kain Batik Premium", link1: "https://shope.ee/5zxCLp4koy", price1: 250000, link2: "https://shope.ee/5zxCLp4koy", price2: 250000, actualPrice: 250000, bought: true },
    { id: "s_26", category: "Outfit & Sepatu", item: "Jilbab Voal Segi Empat", link1: "https://shope.ee/5fKLxWpHYx", price1: 7999, link2: "https://shope.ee/4plEy2mhoc", price2: 11900, actualPrice: 10000, bought: true },
    { id: "s_27", category: "Outfit & Sepatu", item: "Sepatu Heels Resepsi / Pesta", link1: "https://shope.ee/8zanw5ELic", price1: 57000, link2: "https://shope.ee/7Um09NemHO", price2: 159000, actualPrice: 159000, bought: true },
    { id: "s_28", category: "Outfit & Sepatu", item: "Tas Pesta / Sling Bag Elegan", link1: "https://shope.ee/5V0vlwbvsn", price1: 20000, link2: "https://shope.ee/3KwRBrQbdn", price2: 138000, actualPrice: 138000, bought: true },

    { id: "s_29", category: "Lain-lain", item: "Bed Cover King Size Lembut", link1: "https://shope.ee/2q0AbKsDce", price1: 129000, link2: "https://shope.ee/6Ka2lpQ0jr", price2: 325600, actualPrice: 250000, bought: true },
    { id: "s_30", category: "Lain-lain", item: "Kotak Seserahan Akrilik (10 Box)", link1: "https://shope.ee/AK6Brv1k6i", price1: 207000, link2: "https://shope.ee/AUPc4E16ll", price2: 512000, actualPrice: 350000, bought: true }
  ],

  // LIST LAGU PERNIKAHAN
  songs: [
    { id: "sg_1", title: "Akad", artist: "Payung Teduh", moment: "Ijab Kabul / Akad", isSelected: true, note: "Lagu sakral prosesi akad nikah" },
    { id: "sg_2", title: "Teman Hidup", artist: "Tulus", moment: "Akad / Kirab", isSelected: true, note: "Momen romantis penuh makna" },
    { id: "sg_3", title: "Cintanya Aku", artist: "Tiara Andini ft. Arsy Widianto", moment: "Kirab Pengantin", isSelected: true, note: "Saat melangkah menuju pelaminan" },
    { id: "sg_4", title: "A Thousand Years", artist: "Christina Perri", moment: "Grand Entrance", isSelected: true, note: "Klasik romantis megah" },
    { id: "sg_5", title: "Perfect", artist: "Ed Sheeran", moment: "First Dance / Potong Kue", isSelected: true, note: "Lagu dansa pertama pengantin" },
    { id: "sg_6", title: "All Of Me", artist: "John Legend", moment: "Santap Siang", isSelected: true, note: "Alunan piano syahdu" },
    { id: "sg_7", title: "Make You Feel My Love", artist: "Adele", moment: "Santap Siang", isSelected: false, note: "Vokal hangat menyentuh hati" },
    { id: "sg_8", title: "Menikahimu", artist: "Kahitna", moment: "Ramah Tamah", isSelected: true, note: "Nostalgia cinta bahagia" },
    { id: "sg_9", title: "Kisah Romantis", artist: "Glenn Fredly", moment: "Lempar Bunga & Games", isSelected: true, note: "Tempo upbeat ceria dan energik" },
    { id: "sg_10", title: "Sampai Jadi Debu", artist: "Banda Neira", moment: "Sungkeman Orang Tua", isSelected: true, note: "Meneteskan air mata bahagia" }
  ],

  // PRESET RANCANGAN BIAYA BERDASARKAN BUDGET (3 Juta s/d 100 Juta)
  budgetPresets: [
    {
      targetBudget: 3000000,
      title: "Paket Intim KUA & Syukuran Sederhana (3 Juta)",
      description: "Fokus pada keabsahan syariat di KUA dan syukuran nasi box hangat bersama keluarga terdekat.",
      breakdown: [
        { item: "Biaya Nikah di KUA (Luar jam/lokasi KUA)", percentage: 20, amount: 600000 },
        { item: "Mahar Sederhana & Buku Nikah", percentage: 6.6, amount: 200000 },
        { item: "Makanan Syukuran (Nasi Box 50 pax)", percentage: 66.7, amount: 2000000 },
        { item: "Sewa Kebaya & Beskap Simple", percentage: 6.7, amount: 200000 },
        { item: "Makeup Sendiri (DIY Soft Glam)", percentage: 0, amount: 0 }
      ]
    },
    {
      targetBudget: 5000000,
      title: "Paket Hangat Rumah / Masjid (5 Juta)",
      description: "Akad nikah di masjid/rumah dengan busana sewa, foto kenangan, dan hidangan prasmanan keluarga.",
      breakdown: [
        { item: "Biaya KUA", percentage: 12, amount: 600000 },
        { item: "Mahar & Kotak Seserahan Simple", percentage: 5, amount: 250000 },
        { item: "Baju Pengantin & Rias MUA Simple", percentage: 20, amount: 1000000 },
        { item: "Fotografer Akad 2 Jam", percentage: 20, amount: 1000000 },
        { item: "Katering Masak Sendiri / Prasmanan 50 pax", percentage: 40, amount: 2000000 },
        { item: "Undangan Digital WhatsApp", percentage: 3, amount: 150000 }
      ]
    },
    {
      targetBudget: 10000000,
      title: "Paket Resepsi Rumah Elegan (10 Juta)",
      description: "Pernikahan di rumah dengan dekorasi backdrop mini, prasmanan lezat, dokumentasi foto, dan MC.",
      breakdown: [
        { item: "Biaya Nikah KUA", percentage: 6, amount: 600000 },
        { item: "Mahar & Bingkai", percentage: 3.5, amount: 350000 },
        { item: "Baju Pengantin & Makeup Flawless", percentage: 15, amount: 1500000 },
        { item: "Dekorasi Rumah / Backdrop Bunga", percentage: 20, amount: 2000000 },
        { item: "Seserahan 5 Kotak", percentage: 5, amount: 500000 },
        { item: "Fotografer Dokumentasi", percentage: 10, amount: 1000000 },
        { item: "Katering Prasmanan 100 pax", percentage: 35, amount: 3500000 },
        { item: "Undangan & Souvenir Cantik", percentage: 2.5, amount: 250000 },
        { item: "MC Pembawa Acara Akad", percentage: 3, amount: 300000 }
      ]
    },
    {
      targetBudget: 20000000,
      title: "Paket Intimate Venue Sederhana (20 Juta)",
      description: "Menyewa aula/cafe kecil, cincin nikah emas, dokumentasi foto & video, serta hiburan akustik.",
      breakdown: [
        { item: "Sewa Venue / Aula Kecil", percentage: 10, amount: 2000000 },
        { item: "Catering 150 pax", percentage: 25, amount: 5000000 },
        { item: "Cincin Pernikahan Emas", percentage: 15, amount: 3000000 },
        { item: "Dekorasi Pelaminan Minimalis", percentage: 5, amount: 1000000 },
        { item: "Rias & Busana Pengantin Lengkap", percentage: 10, amount: 2000000 },
        { item: "Dokumentasi Foto & Video", percentage: 15, amount: 3000000 },
        { item: "Seserahan & Hantaran", percentage: 5, amount: 1000000 },
        { item: "Undangan & Souvenir", percentage: 4, amount: 800000 },
        { item: "Pengisi Acara / Akustik", percentage: 5, amount: 1000000 },
        { item: "Mahar & Administrasi KUA", percentage: 6, amount: 1200000 }
      ]
    },
    {
      targetBudget: 50000000,
      title: "Paket Gedung Modern & Semi Garden (50 Juta)",
      description: "Pesta pernikahan modern di gedung atau semi outdoor garden dengan sound system, WO, dan katering 300 pax.",
      breakdown: [
        { item: "Sewa Gedung / Venue 6 Jam", percentage: 10, amount: 5000000 },
        { item: "Catering Prasmanan & Stall (300 pax)", percentage: 40, amount: 20000000 },
        { item: "Cincin Kawin & Mahar", percentage: 20, amount: 10000000 },
        { item: "Dekorasi Pelaminan & Fresh Flowers", percentage: 10, amount: 5000000 },
        { item: "MUA Pengantin & Busana Resepsi", percentage: 10, amount: 5000000 },
        { item: "Dokumentasi Foto & Sinematik", percentage: 6, amount: 3000000 },
        { item: "Entertainment Band & Sound", percentage: 4, amount: 2000000 },
        { item: "Undangan & Souvenir", percentage: 2, amount: 1000000 },
        { item: "Biaya Tak Terduga / Buffer", percentage: 0.8, amount: 400000 },
        { item: "KUA & Administrasi", percentage: 1.2, amount: 600000 }
      ]
    },
    {
      targetBudget: 100000000,
      title: "Paket Grand Luxury / Dream Wedding (100 Juta)",
      description: "Paket komplit impian: Ballroom/Villa bintang, katering 500+ pax, full wedding organizer, drone & sinematik 4K.",
      breakdown: [
        { item: "Sewa Venue / Ballroom Mewah", percentage: 10, amount: 10000000 },
        { item: "Catering Prasmanan Mewah + Dessert Table", percentage: 40, amount: 40000000 },
        { item: "Cincin Kawin Berlian & Mahar", percentage: 20, amount: 20000000 },
        { item: "Dekorasi Tematik & Lighting Spektakuler", percentage: 10, amount: 10000000 },
        { item: "MUA Top Tier & Gaun Pengantin Desainer", percentage: 10, amount: 10000000 },
        { item: "Dokumentasi Foto, Sinematik & Drone 4K", percentage: 6, amount: 6000000 },
        { item: "Entertainment Band, MC & Sound Pro", percentage: 4, amount: 4000000 },
        { item: "Seserahan Branded (10 Box Akrilik)", percentage: 6, amount: 6000000 },
        { item: "Undangan Fisik Hardcover + Web VIP", percentage: 2, amount: 2000000 },
        { item: "Biaya Cadangan Darurat & KUA", percentage: 2, amount: 2000000 }
      ]
    }
  ],

  // 180 PERTANYAAN PRA-NIKAH (DEEP TALK PASANGAN)
  deepTalkQuestions: [
    {
      category: "Finansial & Keuangan",
      icon: "fa-wallet",
      questions: [
        "Bagaimana cara kita mengelola keuangan bersama nanti? Rekening gabungan, terpisah, atau hybrid?",
        "Apakah salah satu dari kita memiliki utang (pinjol, kartu kredit, cicilan motor/mobil, paylater)? Bagaimana pelunasannya?",
        "Berapa persentase penghasilan yang akan kita alokasikan untuk tabungan darurat, investasi, dan gaya hidup?",
        "Apakah kita akan saling terbuka melihat mutasi rekening atau slip gaji masing-masing secara transparan?",
        "Bagaimana kebijakan finansial jika orang tua atau saudara kandung salah satu pihak meminta bantuan uang?",
        "Kapan target kita membeli rumah pertama? Apakah sewa dulu, KPR, atau tinggal sementara di rumah ortu/mertua?",
        "Siapa yang bertanggung jawab membayar tagihan bulanan (listrik, air, wifi, belanja dapur, SPP anak)?",
        "Apa batas nominal pengeluaran pribadi yang harus dibicarakan bersama sebelum membeli barang mahal?"
      ]
    },
    {
      category: "Keluarga & Hubungan Mertua",
      icon: "fa-house-chimney-user",
      questions: [
        "Bagaimana pembagian waktu kunjungan ke rumah orang tua dan mertua saat akhir pekan atau hari raya/lebaran?",
        "Bagaimana batasan campur tangan orang tua dalam keputusan rumah tangga dan pola asuh anak kita nanti?",
        "Jika terjadi konflik antara pasangan dan mertua, bagaimana kita akan saling membela dan menengahi dengan bijak?",
        "Apakah kita berencana merawat orang tua ketika mereka sudah lanjut usia di rumah kita sendiri?",
        "Tradisi atau kebiasaan keluarga mana yang ingin kita teruskan, dan mana yang ingin kita hentikan?"
      ]
    },
    {
      category: "Pengasuhan Anak & Parenting",
      icon: "fa-baby",
      questions: [
        "Apakah kita berdua sepakat ingin memiliki anak? Berapa jumlah anak yang ideal menurut kita dan kapan waktu memulainya?",
        "Bagaimana jika setelah menikah kita belum/tidak dikaruniai keturunan? Langkah medis/adopsi apa yang akan kita tempuh?",
        "Gaya parenting apa yang ingin kita terapkan (lembut, disiplin, otoritatif)? Bagaimana cara mendisiplinkan anak?",
        "Siapa yang akan mengasuh anak jika kita berdua sama-sama bekerja? Menggunakan jasa pengasuh/daycare atau bantuan orang tua?",
        "Sekolah seperti apa yang kita inginkan untuk anak (swasta, negeri, agama, homeschooling)? Berapa alokasi dananya?"
      ]
    },
    {
      category: "Karir & Pembagian Peran Domestik",
      icon: "fa-briefcase",
      questions: [
        "Apakah istri diizinkan/diharapkan tetap bekerja dan berkarir setelah menikah dan punya anak?",
        "Bagaimana pembagian tugas rumah tangga (memasak, mencuci baju, mengepel, mencuci piring)?",
        "Bagaimana jika salah satu dari kita dipindahtugaskan ke luar kota atau luar negeri?",
        "Bagaimana cara kita menjaga waktu berkualitas (quality time) di tengah kesibukan lembur pekerjaan?"
      ]
    },
    {
      category: "Komunikasi & Resolusi Konflik",
      icon: "fa-comments",
      questions: [
        "Bagaimana kebiasaan kita saat sedang marah atau kecewa? Butuh waktu sendiri (cooling down) atau harus diselesaikan saat itu juga?",
        "Aturan apa yang tidak boleh dilanggar saat bertengkar (misal: dilarang mengungkit masa lalu, dilarang berkata kasar, dilarang pisah ranjang)?",
        "Kapan saat yang tepat untuk meminta maaf dan bagaimana bahasa cinta (love language) yang membuat kita merasa dihargai?",
        "Apakah kita berani berkonsultasi ke konselor pernikahan jika suatu saat menghadapi masalah besar yang buntu?"
      ]
    },
    {
      category: "Nilai Hidup, Agama & Intimasi",
      icon: "fa-heart",
      questions: [
        "Bagaimana peran nilai keagamaan dalam keseharian rumah tangga kita (sholat berjamaah, pengajian, sedekah)?",
        "Bagaimana harapan kita mengenai frekuensi, komunikasi, dan keterbukaan dalam kehidupan intim suami istri?",
        "Apa arti kesetiaan bagi kita, dan batasan apa yang dianggap sebagai perselingkuhan (chatting akrab dengan lawan jenis, makan berdua)?",
        "Mimpi atau cita-cita terbesar apa yang ingin kita capai bersama dalam 10 hingga 20 tahun ke depan?"
      ]
    }
  ],

  // ROADMAP PASCA NIKAH (After Marriage Guide)
  roadmap: [
    {
      year: "Tahun 1: Fondasi Harmoni & Finansial",
      items: [
        "Penyesuaian ritme hidup bersama dan komunikasi harian",
        "Membangun Dana Darurat minimal 6x pengeluaran bulanan",
        "Membuat rekening tabungan bersama untuk kebutuhan rumah tangga",
        "Menyelesaikan administrasi kependudukan (KK baru, ganti status KTP suami & istri)"
      ]
    },
    {
      year: "Tahun 2 - 3: Pertumbuhan Keluarga & Aset",
      items: [
        "Persiapan dana kehamilan, persalinan, dan perlengkapan bayi (jika merencanakan anak)",
        "Menabung DP rumah pertama / mengambil KPR yang sehat (cicilan maks 30% gaji)",
        "Memiliki Asuransi Kesehatan dan Asuransi Jiwa untuk pencari nafkah utama",
        "Investasi rutin bulanan pada instrumen aman (Reksadana / Emas / SBN)"
      ]
    },
    {
      year: "Tahun 4 - 5: Stabilitas & Dana Masa Depan",
      items: [
        "Mempersiapkan Dana Pendidikan Anak sejak dini",
        "Review performa keuangan dan rencana renovasi rumah",
        "Family trip / liburan tahunan untuk merekatkan kehangatan pernikahan",
        "Mulai menyusun tabungan pensiun dan dana haji/umroh bersama"
      ]
    }
  ]
};

// INITIAL SEED USER EMAILS (Whitelist Pembeli Lynk.id)
const DEFAULT_AUTHORIZED_EMAILS = [
  "olapoal.artgallery@gmail.com",
  "alrizki@gmail.com",
  "pembeli@gmail.com",
  "buyer@lynk.id",
  "demo@weddingplanner.id",
  "angga.chintya@gmail.com"
];

const DEFAULT_SETTINGS = {
  sellerStoreName: "Wedding Planner Pro",
  lynkidProductUrl: "https://lynk.id/weddingplanner/nikah-impian",
  accessMode: "whitelist", // "whitelist", "any_email", "license_key"
  masterLicenseCode: "NIKAH2026",
  adminPin: "1234",
  supabaseUrl: localStorage.getItem("wp_supabase_url") || "",
  supabaseKey: localStorage.getItem("wp_supabase_key") || "sb_publishable_VkicMjgvFdj1dp4zIQV4nw_FzBYiWpT"
};
