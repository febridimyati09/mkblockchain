import { network } from "hardhat";

async function main() {
  const { ethers } = await network.connect();
  const [admin] = await ethers.getSigners();

  const Kontrak = await ethers.getContractFactory("CertiChain");
  const kontrak = await Kontrak.deploy();
  await kontrak.waitForDeployment();
  console.log("Alamat kontrak:", await kontrak.getAddress());

  // Seeding 2 data sertifikat contoh untuk dashboard Pertemuan 10
  await kontrak.terbitkanIjazah(
    "IJZ-2026-001",
    "Akhmad Febri Dimyati",
    "Teknik Informatika",
    "QmHashDokumenPertama123",
    admin.address
  );

  await kontrak.terbitkanIjazah(
    "IJZ-2026-002",
    "Yu Jimin",
    "Sistem Informasi",
    "QmHashDokumenKedua456",
    admin.address
  );

  console.log("2 data sertifikat contoh berhasil diterbitkan untuk:", admin.address);
}

main().catch((e) => {
  console.error(e);
  process.exitCode = 1;
});