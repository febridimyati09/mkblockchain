# 📚Praktikum Blockchain Pertemuan 3 #

### Tujuan Praktikum ###
1. Mahasiswa memahami konsep Object-Oriented Programming (OOP) pada Python melalui
pembuatan Class.
2. Mahasiswa mampu mengimplementasikan arsitektur modular dengan memisahkan logika
Backend (Core) dan antarmuka Frontend (UI).
3. Mahasiswa dapat membangun struktur Linked List terenkripsi menggunakan Hash
Pointers.
4. Mahasiswa mampu mensimulasikan sistem "Traceability Rantai Pasok Kopi" sederhana di
lingkungan lokal.

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
Pada tahap ini, data rantai pasok kopi (nama petani, jumlah panen, dan lokasi) diinputkan melalui sidebar. Setiap data baru otomatis terhubung dengan hash dari blok sebelumnya. Sistem menampilkan status indikator hijau "*Status jaringan: rantai Valid (Aman)*".
![Kondisi Rantai Valid](<Screenshot 2026-09-14 203736.png>)

2. Simulasi Manipulasi Data (Peretasan)
Pengujian keamanan dilakukan memanfaatkan fitur *Zona Pengujian Integritas.* Salah satu data blok diubah secara paksa tanpa memperbarui hash-nya. Saat sistem melakukan validasi ulang, kalkulasi hash baru tidak cocok dengan hash yang tersimpan, sehingga streamlit langsung menampilkan indikator merah "*PERINGATAN: Integritas Rantai Rusak (Telah Dimanipulasi)*"
 ![Kondisi Rantai Rusak](<Screenshot 2026-09-14 203757.png>)

 ### Kesimpulan ###
 1. Penerapan arsitektur modular memudahkan pemisahan antara pemrosesan data blockchain dan penyajian antarmuka pengguna.

 2. Penggunaan algoritma hash SHA-256 dan pembentukan hash pointer terbukti efektif menjaga integritas data rantai pasok Kopi Halal, dimana setiap perubahan data ilegal dapat dideteksi secara otomatis oleh sistem.
