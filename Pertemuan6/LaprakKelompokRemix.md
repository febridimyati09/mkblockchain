# Praktikum 6 Tugas Kelompok: Membuat Smart Contract dengan Solidity di Remix #

### KELOMPOK 7 ###
- Akhmad Febri Dimyati
- Moh. Ni'am Billi Yachsyi
- Agung Dwi Jaya
- Jouvan Labib

## Tujuan Pembelajaran
Setelah menyelesaikan praktikum ini, mahasiswa diharapkan mampu:
1. Memahami konsep dasar dari smart contract pada Blockchain.
2. Menggunakan platform Remix untuk menulis, mengompilasi, dan men-deploy smart contract berbasis Solidity.
3. Mengimplementasikan fungsionalitas dasar smart contract yang melibatkan state variable dan fungsi.
4. Melakukan interaksi dengan smart contract yang sudah ter-deploy melalui Remix.

## Proses Praktikum
1. Buka [Remix IDE](https://remix.ethereum.org/) login via Gmail, bukti:
![SS login Remix](image.png)

2. Buat file baru di files dengan nama file (`CelenganDigital.sol`)
![code](image-2.png)
![code](image-3.png)
![code](image-4.png)

3. Compile Smart Contract
![Compile](image-5.png)

4. Deploy & Testing Smart Contract
### A. Deploy Smart Contract oleh Pemilik & Mengirim Donasi
* **Deploy Kontrak oleh Pemilik (`pemilikCelengan`):**
![Deploy Contract](image-6.png)

* **Pengiriman Donasi oleh Donatur (`receive`):**
![Donasi Donatur](image-7.png)

### B. Menarik Uang & Memanggil Saldo
* **Menarik Uang (`tarikSemuaUang`):**
![Menarik Uang](image-8.png)

* **Memanggil Saldo (`cekSaldoCelengan`):**
![Memanggil Saldo](image-9.png)

## Evaluasi & Tugas Kelompok
1. **Desain Arsitektur (Flowchart)**

![FlowChart](FlowchartCelenganDigital.drawio.png)

* **Struktur Data (`Struct`)**: Memuat data `Donatur` (alamat dompet, total donasi, dan waktu donasi).
* **Pemetaan (`Mapping`)**: `mapping(address => Donatur) public daftarDonatur` untuk mencatat nominal riwayat donasi.
* **Alur Fungsi**:
  * `receive()`: Menerima transfer ETH langsung ke kontrak.
  * `tarikSemuaUang()`: Mencairkan seluruh saldo ke akun pemilik.
  * `cekSaldoCelengan()`: Menampilkan sisa saldo kontrak.

2. **Drafting Smart Contract (Versi 1)**
Smart contract `CelenganDigital.sol` telah berhasil diimplementasikan dengan `struct` dan `mapping` serta terbukti dapat di-compile tanpa error (Centang hijau Bagian 3 diatas).

## File Celengan Digital
[CelenganDigital.sol](../../../../Downloads/CelenganDigital.sol)