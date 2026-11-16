import { network } from "hardhat";

async function main() {
    const { ethers } = await network.connect();

    const Kontrak = await ethers.getContractFactory("CertiChain");
    const kontrak = await Kontrak.deploy();
    await kontrak.waitForDeployment();
    console.log("Alamat kontrak:", await kontrak.getAddress());
}

main().catch((e) => {
    console.error(e);
    process.exitCode = 1;
});
