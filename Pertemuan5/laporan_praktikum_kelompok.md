# 📚Praktikum Blockchain Pertemuan 5 (TUGAS KELOMPOK) #

### KELOMPOK 7 ###
- Akhmad Febri Dimyati
- Moh. Ni'am Billi Yachsyi
- Agung Dwi Jaya
- Jouvan Labib

### Tujuan Praktikum ###
1. Mahasiswa memahami konsep Mempool dan mekanisme validasi transaksi sebelum masuk ke dalam blok.
2. Mahasiswa mampu mengimplementasikan algoritma Proof of Work (PoW) pada struktur Blockchain lokal.
3. Mahasiswa memahami fungsi Nonce (Number Only Used Once) dan Difficulty dalam proses mining.
4. Mahasiswa mampu memvalidasi integritas rantai secara keseluruhan menggunakan skrip Python.

### Konsep Dasar Proof of Work (PoW) ###
Pada pertemuan sebelumnya, blok dapat ditambahkan secara instan. Di dunia nyata (seperti Bitcoin), menambahkan blok membutuhkan "*pengorbanan*" komputasi agar jaringan terhindar dari spam. Proses ini disebut Mining.
Sistem akan menetapkan sebuah target (Difficulty), misalnya: Hash blok harus diawali dengan 3 buah angka nol (`000...`).
Karena fungsi Hash bersifat acak, penambang (miner) harus terus-menerus menebak angka acak bernama Nonce sampai menemukan Hash yang sesuai target.

### Hasil Pengujian Aplikasi ###
Pengujian dilakukan langsung melalui antarmuka Streamlit untuk memverifikasi dua kondisi utama sistem pada studi kasus **"Sistem Autentikasi & Pasok Barang Mewah":**

1. Mining Data Barang Mewah
Data sertifikat barang mewah diinput lalu di-mine. Sistem mencari Nonce hingga Hash berawalan `000` sesuai Difficulty.
![Mining Berhasil](<Screenshot 2026-10-03 001327.png>)

2. Kondisi Rantai Valid (Normal)
Pengecekan awal menunjukkan seluruh Hash Pointer mengikat sempurna, memicu indikator hijau **"Status Jaringan: AMAN (Rantai Valid)".**
![Rantai Valid](<Screenshot 2026-10-03 001343.png>)

3. Detail Buku Besar (Ledger & Hash)
Ledger menampilkan keterkaitan kriptografis antar blok. Previous Hash Blok #1 cocok dengan Hash Blok #0 (Genesis) dan Hash Blok #1 diawali `000`.
![Ledger & Hash](<Screenshot 2026-10-03 001359.png>)

4. Simulasi Manipulasi Data (Peretasan)
Tombol "**👨‍💻 HACK BLOK 1**" ditekan untuk mengubah data secara paksa. Pengecekan ulang mendeteksi ketidakcocokan Hash dan memicu indikator merah *"Status Jaringan: BAHAYA (Data Telah dimanipulasi!)".*
![Hack Blok](<Screenshot 2026-10-03 001415.png>)

5. Pengujian Variasi Difficulty
Saat parameter `difficulty` pada `core.py` dinaikkan ke 4 atau 5, Hash yang dihasilkan pada Ledger wajib diawali 4 atau 5 digit nol (`0000...` / `00000...`). Nilai Nonce tebakan melonjak drastis dan waktu mining melambat.
![Difficulty 4 / 5](<Screenshot 2026-10-03 002318.png>)

### Analisis Difficulty ###
Berdasarkan hasil pengujian dengan mengubah nilai `self.difficulty` di `core.py` dari 3 menjadi 4 atau 5:

1. **Pengaruh Kecepatan Mining:**
Proses penambangan (*mining*) melambat secara drastis (waktu eksekusi meningkat secara eksponensial) dan durasi *loading* di Streamlit menjadi jauh lebih lama.

2. **Penyebab Komputasi & Matematis:**
- **Target Awalan Nol:** Setiap kenaikan 1 tingkat *difficulty*, sistem mengharuskan Hash baru diawali dengan tambahan satu digit angka nol di depan (`000` -> `0000` -> `00000`).
- **Metode Brute-Force:** Karena algoritma SHA-256 acak dan tak bisa ditebak balik, komputer harus mencoba nilai `nonce` satu per satu.
- **Skala Heksadesimal (Basis 16):** Secara statistik, mencari Hash yang sesuai menjadi **16 kali lebih sulit** untuk setiap penambahan 1 tingkat *difficulty*

### Kesimpulan ###
1. Mekanisme Proof of Work (PoW) terbukti berhasil mencegah spam dan penambahan data sertifikat barang mewah secara instan melalui tingkat kesulitan komputasi (Difficulty).

2. Sistem validasi rantai dan keterkaitan Hash Pointer terbukti andal mendeteksi manipulasi data secara real-time, di mana simulasi perubahan data secara ilegal langsung memicu status BAHAYA pada sistem autentikasi barang mewah.