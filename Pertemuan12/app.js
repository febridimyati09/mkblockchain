// ---------- Elemen Tampilan ----------
const elAddress = document.getElementById("address");
const elSaldo = document.getElementById("saldo");
const elAdmin = document.getElementById("admin");
const elStatus = document.getElementById("status");
const elDaftar = document.getElementById("daftar");
const elJumlah = document.getElementById("jumlah");
const elTx = document.getElementById("elTx");
const elFeed = document.getElementById("elFeed");
const btnKirim = document.getElementById("btnKirim");
const btnTerbitkan = document.getElementById("btnTerbitkan");
const filterEvent = document.getElementById("filterEvent");

// ---------- ABI Lengkap (View, Write, dan Events) ----------
const abi = [
  "function adminKampus() view returns (address)",
  "function verifikasiIjazah(string _nomorIjazah) view returns (string namaPemilik, string programStudi, string hashDokumen, address mahasiswa, uint256 tanggalTerbit, bool isValid, string alasanPencabutan, uint256 waktuPencabutan)",
  "function lihatIjazahMahasiswa(address _mahasiswa) view returns (string[])",
  "function terbitkanIjazah(string _nomorIjazah, string _namaPemilik, string _programStudi, string _hashDokumen, address _mahasiswa)",
  "function cabutIjazah(string _nomorIjazah, string _alasan)",
  "event SertifikatDiterbitkan(string indexed nomorIjazah, string namaPemilik, string programStudi, address indexed mahasiswa)",
  "event SertifikatDicabut(string indexed nomorIjazah, string alasan, uint256 waktu)"
];

// ---------- Hubungkan Contract (Read Mode) ----------
const alamatKontrak = "0x5FbDB2315678afecb367f032d93F642f64180aa3";
const provider = new ethers.BrowserProvider(window.ethereum);
const kontrak = new ethers.Contract(alamatKontrak, abi, provider);
let kontrakTulis = null;

// ---------- Connect Wallet & Siapkan Signer ----------
async function connectWallet() {
  try {
    const accounts = await window.ethereum.request({ method: "eth_requestAccounts" });
    const akunAktif = accounts[0];
    elAddress.innerText = akunAktif;

    const balanceWei = await provider.getBalance(akunAktif);
    elSaldo.innerText = `${ethers.formatEther(balanceWei)} ETH`;

    const signer = await provider.getSigner();
    kontrakTulis = kontrak.connect(signer);

    btnKirim.disabled = false;
    btnTerbitkan.disabled = false;
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

// ---------- Dashboard Banyak Data ----------
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

// ---------- Write 1: Terbitkan Ijazah Baru ----------
async function kirimTerbitkanIjazah() {
  const nomor = document.getElementById("inputNomorBaru").value.trim();
  const nama = document.getElementById("inputNamaBaru").value.trim();
  const prodi = document.getElementById("inputProdiBaru").value.trim();
  const hashDok = document.getElementById("inputHashBaru").value.trim();

  if (!nomor || !nama || !prodi || !hashDok) {
    elTx.innerText = "Status Transaksi: Lengkapi semua field penerbitan ijazah!";
    return;
  }

  try {
    btnTerbitkan.disabled = true;
    const akunAktif = elAddress.innerText;
    elTx.innerText = "Status Transaksi: Menunggu tanda tangan di MetaMask...";

    const tx = await kontrakTulis.terbitkanIjazah(nomor, nama, prodi, hashDok, akunAktif);
    elTx.innerText = "Status Transaksi: Transaksi dikirim (pending), menunggu konfirmasi...";

    const receipt = await tx.wait();
    if (receipt.status === 1) {
      elTx.innerText = `Status Transaksi: Ijazah ${nomor} berhasil diterbitkan! Hash: ${tx.hash}`;
      await muatDashboard();
    }
  } catch (e) {
    if (e.code === 4001 || e.code === "ACTION_REJECTED") {
      elTx.innerText = "Status Transaksi: Transaksi dibatalkan pengguna.";
    } else {
      elTx.innerText = `Status Transaksi: Gagal menerbitkan (${e.reason || e.shortMessage || "error"}).`;
      console.error(e);
    }
  } finally {
    btnTerbitkan.disabled = false;
  }
}
document.getElementById("btnTerbitkan").onclick = kirimTerbitkanIjazah;

// ---------- Write 2: Cabut Status Ijazah ----------
async function kirimCabutIjazah() {
  const nomorIjazah = document.getElementById("pilihIjazah").value;
  const alasan = document.getElementById("inputAlasan").value.trim();

  if (!nomorIjazah || !alasan) {
    elTx.innerText = "Status Transaksi: Pilih nomor ijazah dan isi alasan pencabutan dulu!";
    return;
  }

  try {
    btnKirim.disabled = true;
    elTx.innerText = "Status Transaksi: Menunggu tanda tangan di MetaMask...";

    const tx = await kontrakTulis.cabutIjazah(nomorIjazah, alasan);
    elTx.innerText = "Status Transaksi: Transaksi dikirim (pending), menunggu konfirmasi...";

    const receipt = await tx.wait();
    if (receipt.status === 1) {
      elTx.innerText = `Status Transaksi: Ijazah ${nomorIjazah} dicabut! Hash: ${tx.hash}`;
      await muatDashboard();
      await muatStatus();
    }
  } catch (e) {
    if (e.code === 4001 || e.code === "ACTION_REJECTED") {
      elTx.innerText = "Status Transaksi: Transaksi dibatalkan pengguna.";
    } else {
      elTx.innerText = `Status Transaksi: Gagal mencabut (${e.reason || e.shortMessage || "error"}).`;
      console.error(e);
    }
  } finally {
    btnKirim.disabled = false;
  }
}
document.getElementById("btnKirim").onclick = kirimCabutIjazah;

// ---------- Pertemuan 12: Helper Tampilan Live Feed ----------
function tambahKeFeedAtas(teks, blockNum) {
  if (elFeed.innerText.includes("Memuat histori") || elFeed.innerText.includes("Belum ada event")) {
    elFeed.innerHTML = "";
  }
  elFeed.insertAdjacentHTML(
    "afterbegin",
    `<div class="item" style="padding: 6px; border-bottom: 1px dashed #ccc;">
      <strong>[Baru - Block #${blockNum}]</strong> ${teks}
    </div>`
  );
}

function tambahKeFeedAkhir(teks, blockNum) {
  if (elFeed.innerText.includes("Memuat histori") || elFeed.innerText.includes("Belum ada event")) {
    elFeed.innerHTML = "";
  }
  elFeed.insertAdjacentHTML(
    "beforeend",
    `<div class="item" style="padding: 6px; border-bottom: 1px dashed #ccc;">
      <span style="color: #555;">[Histori - Block #${blockNum}]</span> ${teks}
    </div>`
  );
}

// ---------- Pertemuan 12: Muat Histori & Pasang Listener ----------
async function muatFeedSemua() {
  elFeed.innerText = "Memuat histori event...";
  try {
    // 1. Ambil histori event penerbitan dan pencabutan dari block 0
    const logTerbit = await kontrak.queryFilter("SertifikatDiterbitkan", 0, "latest");
    const logCabut = await kontrak.queryFilter("SertifikatDicabut", 0, "latest");

    // Gabungkan dan urutkan dari blok terlama ke terbaru
    const semuaLog = [
      ...logTerbit.map((e) => ({
        blockNumber: e.blockNumber,
        logIndex: e.index,
        teks: `🟢 <b>SertifikatDiterbitkan</b> — Pemilik: <b>${e.args.namaPemilik}</b> (${e.args.programStudi}) | Mahasiswa: ${e.args.mahasiswa.slice(0, 10)}...`
      })),
      ...logCabut.map((e) => ({
        blockNumber: e.blockNumber,
        logIndex: e.index,
        teks: `🔴 <b>SertifikatDicabut</b> — Alasan: <b>${e.args.alasan}</b> | Waktu: ${new Date(Number(e.args.waktu) * 1000).toLocaleTimeString("id-ID")}`
      }))
    ].sort((a, b) => a.blockNumber - b.blockNumber || a.logIndex - b.logIndex);

    if (semuaLog.length === 0) {
      elFeed.innerText = "Belum ada event tercatat.";
    } else {
      elFeed.innerHTML = "";
      semuaLog.forEach((item) => tambahKeFeedAkhir(item.teks, item.blockNumber));
    }
  } catch (e) {
    elFeed.innerText = "Gagal memuat histori event.";
    console.error(e);
  }
}

// ---------- Pertemuan 12: Filter Indexed per Mahasiswa ----------
async function terapkanFilterFeed() {
  const pilihan = filterEvent.value;
  if (pilihan === "SEMUA") {
    await muatFeedSemua();
    return;
  }

  elFeed.innerText = "Memfilter event berdasarkan parameter indexed...";
  try {
    const targetAddress =
      pilihan === "ADMIN"
        ? "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266"
        : "0x70997970C51812dc3A010C7d01b50e0d17dc79C8";

    // Filter parameter ke-4 yang bertanda indexed (address indexed mahasiswa)
    const filter = kontrak.filters.SertifikatDiterbitkan(null, null, null, targetAddress);
    const hasil = await kontrak.queryFilter(filter, 0, "latest");

    if (hasil.length === 0) {
      elFeed.innerText = `Belum ada event SertifikatDiterbitkan untuk alamat ${targetAddress.slice(0, 10)}...`;
    } else {
      elFeed.innerHTML = "";
      hasil.forEach((e) => {
        const teks = `🟢 <b>[Filter Indexed] SertifikatDiterbitkan</b> — Pemilik: <b>${e.args.namaPemilik}</b> (${e.args.programStudi})`;
        tambahKeFeedAkhir(teks, e.blockNumber);
      });
    }
  } catch (e) {
    elFeed.innerText = "Gagal menerapkan filter indexed.";
    console.error(e);
  }
}
filterEvent.onchange = terapkanFilterFeed;

// ---------- Pasang Real-Time Listener Sekali Saat Halaman Dibuka ----------
function pasangListener() {
  // Pastikan tidak ada listener ganda sebelum memasang
  kontrak.off("SertifikatDiterbitkan");
  kontrak.off("SertifikatDicabut");

  kontrak.on("SertifikatDiterbitkan", (nomorHash, namaPemilik, programStudi, mahasiswa, eventPayload) => {
    const blockNum = eventPayload.log.blockNumber;
    const teks = `🟢 <b>SertifikatDiterbitkan</b> — Pemilik: <b>${namaPemilik}</b> (${programStudi}) | Mahasiswa: ${mahasiswa.slice(0, 10)}...`;
    tambahKeFeedAtas(teks, blockNum);
  });

  kontrak.on("SertifikatDicabut", (nomorHash, alasan, waktu, eventPayload) => {
    const blockNum = eventPayload.log.blockNumber;
    const teks = `🔴 <b>SertifikatDicabut</b> — Alasan: <b>${alasan}</b> | Waktu: ${new Date(Number(waktu) * 1000).toLocaleTimeString("id-ID")}`;
    tambahKeFeedAtas(teks, blockNum);
  });
}

// ---------- Tahap 5: Lepas Listener Saat Halaman Ditutup/Reload ----------
window.addEventListener("beforeunload", () => {
  kontrak.off("SertifikatDiterbitkan");
  kontrak.off("SertifikatDicabut");
});

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

    // Muat histori event & aktifkan listener real-time
    await muatFeedSemua();
    pasangListener();
  } catch (e) {
    elStatus.innerText = "Gagal membaca: cek alamat contract dan ABI.";
    console.error(e);
  }
}

muatAman();