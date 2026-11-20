import { expect } from "chai";
import { network } from "hardhat";

const { ethers } = await network.connect();

describe("Audit Keamanan Akses CertiChain (Pertemuan 13)", function () {
  let certichain;
  let admin, bukanAdmin, mahasiswa;

  beforeEach(async function () {
    [admin, bukanAdmin, mahasiswa] = await ethers.getSigners();
    const CertiChain = await ethers.getContractFactory("CertiChain");
    certichain = await CertiChain.deploy();
    await certichain.waitForDeployment();
  });

  it("Harus REVERT jika akun bukan-admin memanggil terbitkanIjazah", async function () {
    await expect(
      certichain
        .connect(bukanAdmin)
        .terbitkanIjazah(
          "IJZ-2026-999",
          "Hacker",
          "Teknik Informatika",
          "QmFakeHash999",
          mahasiswa.address
        )
    ).to.be.revertedWith("Error: Hanya Admin Kampus yang memiliki akses!");
  });

  it("Harus REVERT jika akun bukan-admin memanggil cabutIjazah", async function () {
    await certichain
      .connect(admin)
      .terbitkanIjazah(
        "IJZ-2026-001",
        "Akhmad Febri Dimyati",
        "Teknik Informatika",
        "QmHashValid001",
        mahasiswa.address
      );

    await expect(
      certichain
        .connect(bukanAdmin)
        .cabutIjazah("IJZ-2026-001", "Pencabutan ilegal")
    ).to.be.revertedWith("Error: Hanya Admin Kampus yang memiliki akses!");
  });
});