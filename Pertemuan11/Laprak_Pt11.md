# Laporan Praktikum Pertemuan 11: Menulis ke Smart Contract (Transaksi Write CertiChain).

## 1. Tujuan Praktikum
1. Menghubungkan instance smart contract `CertiChain.sol` dengan objek `Signer` dari `BrowserProvider.getSigner()` agar antarmuka web dapat mengirimkan transaksi pengubah *state*.
2. Mengirimkan transaksi pencabutan ijazah (`cabutIjazah`) melalui form web, menunggu konfirmasi blok menggunakan `tx.wait()`, serta membaca data *receipt* berupa hash transaksi dan jumlah gas yang digunakan.
3. Menampilkan status transaksi secara bertahap di antarmuka pengguna (*signing* → *pending* → *confirmed* / gagal) serta menangani validasi input kosong, penolakan pengguna (*reject*), dan *revert* kontrak.
4. Melakukan pembaruan tampilan (*refresh*) dashboard secara otomatis setelah transaksi terkonfirmasi di blockchain.


## 2. Ringkasan Implementasi

### A. Antarmuka Form Transaksi (`index.html`)
Menambahkan komponen form **Cabut Status Ijazah (Write Transaction)** yang terdiri dari:
* Dropdown pemilihan nomor ijazah (`IJZ-2026-001` dan `IJZ-2026-002`).
* Kolom input teks untuk mengisi alasan pencabutan sertifikat.
* Tombol **Cabut Ijazah (Kirim Transaksi)** yang dinonaktifkan secara default hingga pengguna menghubungkan MetaMask melalui tombol **Connect Wallet**.
* Area teks status transaksi (`#elTx`) untuk menampilkan progres pengiriman hingga hash konfirmasi.

### B. Logika Penandatanganan, Pengiriman & Penanganan Error (`app.js`)
* **Inisialisasi Signer:** Pada fungsi `connectWallet()`, kontrak mode baca dihubungkan ke signer aktif menggunakan `const signer = await provider.getSigner()` dan `kontrakTulis = kontrak.connect(signer)`.
* **Alur Pengiriman Bertahap (`kirimCabutIjazah`):**
  1. Memvalidasi bahwa nomor ijazah dan alasan pencabutan tidak kosong.
  2. Menampilkan status `"Menunggu tanda tangan di MetaMask..."` sebelum pemanggilan `kontrakTulis.cabutIjazah(nomorIjazah, alasan)`.
  3. Menampilkan status `"Transaksi dikirim (pending), menunggu konfirmasi block..."` dan menunggu bukti transaksi via `const receipt = await tx.wait()`.
  4. Apabila `receipt.status === 1`, menampilkan hash transaksi beserta jumlah `gasUsed`, lalu langsung memanggil ulang `muatDashboard()` dan `muatStatus()` agar perubahan status di blockchain langsung tampil di layar.
* **Penanganan Error (`try/catch`):** Menangkap kode error `4001` / `ACTION_REJECTED` apabila pengguna menekan tombol *Reject* di MetaMask, serta menampilkan pesan kegagalan yang informatif jika terjadi *revert* di smart contract.


## 3. Hasil Pengujian Transaksi

Berikut adalah tangkapan layar aplikasi dApp CertiChain setelah transaksi pencabutan sertifikat `IJZ-2026-002` dikonfirmasi di MetaMask pada jaringan Hardhat Local:

![alt text](<Screenshot 2026-11-20 163933.png>)

![alt text](<Screenshot 2026-11-20 163950.png>)

**Detail Hasil Transaksi:**
* **Nomor Ijazah Dicabut:** `IJZ-2026-002` (Yu Jimin — Sistem Informasi)
* **Alasan Pencabutan:** `Kesalahan penulisan nama program studi.`
* **Status Transaksi:** Confirmed (`status: 1`)
* **Transaction Hash:** `0x713102c7d657953b03db74c9c8061e02b8b256794a8af7d7df47e6cdcbfbdc1e`
* **Gas Terpakai:** `145499`

**Analisis Hasil:**
* Pop-up MetaMask muncul meminta konfirmasi tanda tangan akun admin (`0xf39fd...92266`) sebelum transaksi diproses ke jaringan lokal.
* Setelah transaksi dikonfirmasi, hash transaksi dan jumlah gas tampil pada status transaksi, dan kartu sertifikat `IJZ-2026-002` di bagian dashboard otomatis berubah status dari **Valid** menjadi **Dicabut (Kesalahan penulisan nama program studi.)** tanpa memuat ulang halaman.


## 4. Kesimpulan
Berbeda dengan pembacaan data menggunakan `Provider` yang bersifat gratis dan instan, pengubahan *state* di smart contract wajib menggunakan `Signer` untuk menandatangani transaksi lewat wallet pengguna serta membutuhkan biaya gas. Penggunaan `await tx.wait()` memastikan antarmuka menunggu hingga transaksi benar-benar tercatat dalam blok sebelum memperbarui tampilan dashboard sehingga data di web selalu sinkron dengan kondisi blockchain.
