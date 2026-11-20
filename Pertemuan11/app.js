// ---------- Elemen Tampilan ----------
const elAddress = document.getElementById("address");
const elSaldo = document.getElementById("saldo");
const elAdmin = document.getElementById("admin");
const elStatus = document.getElementById("status");
const elDaftar = document.getElementById("daftar");
const elJumlah = document.getElementById("jumlah");
const elTx = document.getElementById("elTx");
const btnKirim = document.getElementById("btnKirim");

// ---------- ABI Sesuai CertiChain.sol ----------
const abi = [
  "function adminKampus() view returns (address)",
  "function verifikasiIjazah(string _nomorIjazah) view returns (string namaPemilik, string programStudi, string hashDokumen, address mahasiswa, uint256 tanggalTerbit, bool isValid, string alasanPencabutan, uint256 waktuPencabutan)",
  "function lihatIjazahMahasiswa(address _mahasiswa) view returns (string[])",
  "function cabutIjazah(string _nomorIjazah, string _alasan)"
];

// ---------- Hubungkan Contract (Read Mode) ----------
const alamatKontrak = "0x5FbDB2315678afecb367f032d93F642f64180aa3";
const provider = new ethers.BrowserProvider(window.ethereum);
const kontrak = new ethers.Contract(alamatKontrak, abi, provider);
let kontrakTulis = null; // Akan diisi signer setelah Connect Wallet

// ---------- Connect Wallet & Siapkan Signer ----------
async function connectWallet() {
  try {
    const accounts = await window.ethereum.request({ method: "eth_requestAccounts" });
    const akunAktif = accounts[0];
    elAddress.innerText = akunAktif;

    const balanceWei = await provider.getBalance(akunAktif);
    elSaldo.innerText = `${ethers.formatEther(balanceWei)} ETH`;

    // Tahap 1: Hubungkan contract ke Signer untuk transaksi Write
    const signer = await provider.getSigner();
    kontrakTulis = kontrak.connect(signer);

    // Aktifkan tombol kirim transaksi setelah wallet terhubung
    btnKirim.disabled = false;
    elTx.innerText = "Status Transaksi: Siap mengirim transaksi.";

    await muatDashboard();
  } catch (err) {
    console.error(err);
    alert("Gagal menghubungkan MetaMask!");
  }
}
document.getElementById("btnConnect").onclick = connectWallet;

// ---------- Baca Satu Data ----------
async function muatStatus() {
  elStatus.innerText = "Memuat...";
  try {
    const data = await kontrak.verifikasiIjazah("IJZ-2026-001");
    const statusTeks = data.isValid ? "Valid" : `Dicabut (${data.alasanPencabutan})`;
    elStatus.innerText = `${data.namaPemilik} — ${data.programStudi} — Status: ${statusTeks}`;
  } catch (e) {
    elStatus.innerText = "Gagal memuat detail ijazah.";
    console.error(e);
  }
}
document.getElementById("btnMuat").onclick = muatStatus;

// ---------- Dashboard Banyak Data (Paralel) ----------
async function muatDashboard() {
  elDaftar.innerText = "Memuat...";
  try {
    const net = await provider.getNetwork();
    if (net.chainId !== 31337n) {
      elDaftar.innerText = "Pindah ke jaringan Hardhat Local dulu.";
      return;
    }

    const accounts = await window.ethereum.request({ method: "eth_accounts" });
    if (accounts.length === 0) {
      elDaftar.innerText = "Silakan klik Connect Wallet terlebih dahulu.";
      return;
    }

    const daftarNomor = await kontrak.lihatIjazahMahasiswa(accounts[0]);
    elJumlah.innerText = daftarNomor.length.toString();

    if (daftarNomor.length === 0) {
      elDaftar.innerText = "Belum ada sertifikat untuk akun ini.";
      return;
    }

    const hasil = await Promise.all(
      daftarNomor.map((nomor) => kontrak.verifikasiIjazah(nomor))
    );

    elDaftar.innerHTML = hasil.map((cert, index) => {
      const nomorIjazah = daftarNomor[index];
      const statusTeks = cert.isValid ? "Valid" : `Dicabut (${cert.alasanPencabutan})`;
      const tgl = new Date(Number(cert.tanggalTerbit) * 1000).toLocaleString("id-ID");

      return `<div class="kartu" style="border: 1px solid #ccc; padding: 10px; margin-top: 8px;">
        <strong>${nomorIjazah}</strong> — ${cert.namaPemilik} (${cert.programStudi})<br>
        Hash: ${cert.hashDokumen} | Terbit: ${tgl} | Status: <b>${statusTeks}</b>
      </div>`;
    }).join("");
  } catch (e) {
    elDaftar.innerText = "Gagal membaca dashboard: cek alamat contract dan ABI.";
    console.error(e);
  }
}
document.getElementById("btnRefresh").onclick = muatDashboard;

// ---------- Tahap 3, 4, 5: Kirim Transaksi Write + Refresh + Error Handling ----------
async function kirimCabutIjazah() {
  const nomorIjazah = document.getElementById("pilihIjazah").value;
  const alasan = document.getElementById("inputAlasan").value.trim();

  // Validasi input kosong
  if (!nomorIjazah || !alasan) {
    elTx.innerText = "Status Transaksi: Pilih nomor ijazah dan isi alasan pencabutan dulu!";
    return;
  }

  if (!kontrakTulis) {
    elTx.innerText = "Status Transaksi: Hubungkan wallet terlebih dahulu!";
    return;
  }

  try {
    btnKirim.disabled = true;
    elTx.innerText = "Status Transaksi: Menunggu tanda tangan di MetaMask...";

    // Kirim transaksi ke smart contract
    const tx = await kontrakTulis.cabutIjazah(nomorIjazah, alasan);
    elTx.innerText = "Status Transaksi: Transaksi dikirim (pending), menunggu konfirmasi block...";

    // Tunggu receipt dari blockchain
    const receipt = await tx.wait();

    if (receipt.status === 1) {
      elTx.innerText = `Status Transaksi: Berhasil! Hash: ${tx.hash} (Gas terpakai: ${receipt.gasUsed.toString()})`;
      
      // Tahap 4: Refresh dashboard otomatis setelah transaksi confirmed
      await muatDashboard();
      await muatStatus();
    } else {
      elTx.innerText = "Status Transaksi: Gagal (revert) — cek aturan di contract.";
    }
  } catch (e) {
    // Tahap 5: Penanganan error reject pengguna & revert contract
    if (e.code === 4001 || e.code === "ACTION_REJECTED") {
      elTx.innerText = "Status Transaksi: Transaksi dibatalkan pengguna (Reject di MetaMask).";
    } else {
      elTx.innerText = `Status Transaksi: Gagal mengirim (${e.reason || e.shortMessage || "cek jaringan/hak akses admin"}).`;
      console.error(e);
    }
  } finally {
    btnKirim.disabled = false;
  }
}
document.getElementById("btnKirim").onclick = kirimCabutIjazah;

// ---------- Pengecekan Awal Saat Halaman Dimuat ----------
async function muatAman() {
  try {
    const net = await provider.getNetwork();
    if (net.chainId !== 31337n) {
      elStatus.innerText = "Pindah ke jaringan Hardhat Local dulu.";
      return;
    }
    const admin = await kontrak.adminKampus();
    elAdmin.innerText = admin;
  } catch (e) {
    elStatus.innerText = "Gagal membaca: cek alamat contract dan ABI.";
    console.error(e);
  }
}

muatAman();