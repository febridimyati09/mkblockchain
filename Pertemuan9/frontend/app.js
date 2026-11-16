const btnConnect = document.getElementById('btnConnect');
const elAddress = document.getElementById('address');
const elSaldo = document.getElementById('saldo');
const elAdmin = document.getElementById('admin');

btnConnect.addEventListener('click', async () => {
  if (!window.ethereum) {
    alert('MetaMask tidak terdeteksi. Pasang dulu ekstensinya.');
    return;
  }
  try {
    await window.ethereum.request({ method: 'eth_requestAccounts' });

    const provider = new ethers.BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();
    const address = await signer.getAddress();

    // Baca saldo ETH
    const balance = await provider.getBalance(address);
    elAddress.innerText = address;
    elSaldo.innerText = ethers.formatEther(balance) + ' ETH';

    // Baca data dari Smart Contract CertiChain
    const alamatKontrak = '0x5FbDB2315678afecb367f032d93F642f64180aa3';
    const abi = [
      'function adminKampus() view returns (address)'
    ];
    const kontrak = new ethers.Contract(alamatKontrak, abi, provider);
    const admin = await kontrak.adminKampus();
    elAdmin.innerText = admin;
  } catch (err) {
    alert('Koneksi dibatalkan: ' + err.message);
  }
});