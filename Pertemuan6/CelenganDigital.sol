// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract CelenganDigital {
    address payable public pemilikCelengan;
    uint256 public totalDonasiDiterima;

    // 1. STRUCT
    struct Donatur {
        address alamat;
        uint256 totalJumlahDonasi;
        uint256 waktuDonasiTerakhir;
    }

    // 2. MAPPING
    mapping(address => Donatur) public daftarDonatur;

    event UangMasuk(address pengirim, uint256 jumlahWei);
    event UangDicairkan(address pemilik, uint256 jumlahWei);

    constructor() {
        pemilikCelengan = payable(msg.sender);
    }

    // Fungsi otomatis untuk menerima ETH langsung dari Remix
    receive() external payable {
        require(msg.value > 0, "Harus kirim ETH lebih dari 0");
        
        totalDonasiDiterima += msg.value;

        // Otomatis nyatat data donatur ke struct & mapping
        Donatur storage donatur = daftarDonatur[msg.sender];
        donatur.alamat = msg.sender;
        donatur.totalJumlahDonasi += msg.value;
        donatur.waktuDonasiTerakhir = block.timestamp;

        emit UangMasuk(msg.sender, msg.value);
    }

    // Fungsi tarik uang yang aman dari bug UI Remix
    function tarikSemuaUang() public payable {
        require(msg.sender == pemilikCelengan, "Hanya pemilik yang bisa tarik uang!");
        
        uint256 saldo = address(this).balance;
        require(saldo > 0, "Celengan masih kosong!");

        (bool success, ) = pemilikCelengan.call{value: saldo}("");
        require(success, "Gagal mencairkan uang");

        emit UangDicairkan(pemilikCelengan, saldo);
    }

    // Cek saldo celengan saat ini
    function cekSaldoCelengan() public view returns (uint256) {
        return address(this).balance;
    }
}