# 📚Praktikum Blockchain Pertemuan 4 (TUGAS) #

### Tujuan Praktikum ###
1. Mahasiswa memahami konsep Object-Oriented Programming (OOP) pada Python melalui
pembuatan Class.
2. Mahasiswa mampu mengimplementasikan arsitektur modular dengan memisahkan logika
Backend (Core) dan antarmuka Frontend (UI).
3. Mahasiswa dapat membangun struktur Linked List terenkripsi menggunakan Hash
Pointers.
4. Mahasiswa mampu mensimulasikan sistem "Traceability Daur Ulang Plastik & Anti-Greenwashing" di lingkungan lokal.

### Konsep Arsitektur Modular ###
Mulai pertemuan ini, penulisan kode tidak lagi digabung dalam satu file. Aplikasi akan dibagi
menjadi dua bagian utama untuk mencegah spaghetti code:
- core.py : Bertugas sebagai otak sistem (Backend). Berisi struktur data, logika hashing, dan
validasi rantai blok.
- app.py : Bertugas sebagai antarmuka pengguna (Frontend). Menampilkan visualisasi
interaktif ke layar menggunakan Streamlit.

### Hasil Pengujian Aplikasi ###
Pengujian dilakukan langsung melalui antarmuka Streamlit untuk memverifikasi dua kondisi utama sistem:

1. Kondisi Rantai Valid (Normal)
Pada tahap ini, data daur ulang sampah plastik (jenis material, bank sampah asal, pabrik pengolah, dan berat) diinputkan melalui sidebar. Setiap data baru otomatis terhubung dengan hash dari blok sebelumnya. Sistem menampilkan indikator hijau "*✔️ Status Jaringan: Terverifikasi (Klaim Ramah Lingkungan Asli & Bebas Manipulasi*)".
![Terverifikasi](<Screenshot 2026-09-21 234801.png>)

2. Simulasi Manipulasi Data (Peretasan)
Pengujian keamanan dilakukan memanfaatkan fitur Simulasi Audit & Manipulasi Data. Salah satu data blok diubah secara paksa tanpa memperbarui hash-nya. Saat sistem melakukan validasi ulang, kalkulasi hash baru tidak cocok dengan hash yang tersimpan, sehingga Streamlit langsung menampilkan indikator merah "*❌ PERINGATAN: Ada Manipulasi Data! Potensi Pembohong Klaim Ramah Lingkungan Detected!*".
![Manipulasi](<Screenshot 2026-09-21 234838.png>)

### Kesimpulan ###
1. Penerapan arsitektur modular memudahkan pemisahan antara pemrosesan data blockchain (core.py) dan penyajian antarmuka pengguna (app.py).

2. Penggunaan algoritma hash SHA-256 dan pembentukan hash pointer terbukti efektif menjaga integritas data rantai pasok daur ulang plastik, di mana setiap upaya greenwashing atau manipulasi data ilegal dapat dideteksi secara otomatis oleh sistem.