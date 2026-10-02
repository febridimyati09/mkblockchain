# 📚Praktikum Blockchain Pertemuan 5 #

### Tujuan Praktikum ###
1. Mahasiswa memahami konsep Mempool dan mekanisme validasi transaksi sebelum masuk ke dalam blok.
2. Mahasiswa mampu mengimplementasikan algoritma Proof of Work (PoW) pada struktur Blockchain lokal.
3. Mahasiswa memahami fungsi Nonce (Number Only Used Once) dan Difficulty dalam proses mining.
4. Mahasiswa mampu memvalidasi integritas rantai secara keseluruhan menggunakan skrip Python.

### Konsep Dasar Proof of Work (PoW) ###
Pada pertemuan sebelumnya, blok dapat ditambahkan secara instan. Di dunia nyata (seperti Bitcoin), menambahkan blok membutuhkan "pengorbanan" komputasi agar jaringan terhindar dari spam. Proses ini disebut Mining.
Sistem akan menetapkan sebuah target (Difficulty), misalnya: Hash blok harus diawali dengan 3 buah angka nol (000...).
Karena fungsi Hash bersifat acak, penambang (miner) harus terus-menerus menebak angka acak bernama Nonce sampai menemukan Hash yang sesuai target.

### Hasil Pengujian Aplikasi ###
Pengujian dilakukan langsung melalui antarmuka Streamlit untuk memverifikasi dua kondisi utama sistem pada studi kasus "Sistem Autentikasi & Pasok Barang Mewah":

1. Mining Data Kopi
Data pengiriman kopi diinput lalu di-mine. Sistem mencari Nonce hingga hash berawalan '000' sesuai Difficulty.
![Mining Berhasil](<Screenshot 2026-10-02 232837.png>)

2. Kondisi Rantai Valid (Normal)
Saat tombol integritas ditekan, sistem memverifikasi seluruh Hash. Data aman tanpa manipulasii memicu indikator hijau "Status Jaringan: AMAN (Rantai Valid)".
![Integritas Aman](<Screenshot 2026-10-02 232946.png>)

3. Detail Buku Besar (Ledger & Hash)
Buku besar menampilkan keterkaitan rantai. Previous Hash Blok #1 mengikat ke Hash Blok #0, dan Hash Blok #1 diawali dengan '000'.
![Ledger Kopi](<Screenshot 2026-10-02 232902.png>)

### Kesimpulan ###
1. Implementasi Proof of Work (PoW) berbasis Python berhasil mengamankan pencatatan rantai pasok kopi dengan mekanisme pencarian Nonce berbasis algoritma SHA-256.

2. Penggunaan Hash Pointer dan pengecekan integritas rantai terbukti efektif menjamin imutabilitas data pelacakan kopi dari asal petani hingga ke tangan konsumen.