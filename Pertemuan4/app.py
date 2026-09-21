import streamlit as st
from core import Blockchain

st.set_page_config(page_title="EcoChain Recycling Tracker", page_icon="♻️", layout="wide")
st.title("EcoChain | Verifikasi Daur Ulang & Anti-Greenwashing♻️🌱")

if 'my_blockchain' not in st.session_state:
    st.session_state.my_blockchain = Blockchain()

st.sidebar.header("Catat Alur Sampah Daur Ulang♻️")

jenis_plastik = st.sidebar.selectbox("Jenis Materiak Plastik:", ["PET - Botol Minuman Bekas", "HDPE - Botol Shampo / Detergen", "LDPE - Kantong Plastik Lembut", "PP - Sedotan & Wadah Makanan"])

sumber_bank_sampah = st.sidebar.text_input("Asal Bank Sampah / Pengepul:", value="Bank Sampah Bersih Mandiri")
pabrik_tujuan = st.sidebar.text_input("Pabrik Pengolah Daur Ulang:")
berat_kg = st.sidebar.number_input("Total Berat (kg):", min_value=1, value=500)
status_sertifikat = st.sidebar.selectbox("Status Verifikasi Material:", ["VERIFIED - 100% Material Daur Ulang Murni", "PROCESSING - Dalam Pengolahan Pallet Plastik", "READY - Siap Dipakai Merk Produk Eco", "REJECTED - Tercampur Bahan Non-Daur Ulang"])

if st.sidebar.button("Simpan ke Data Daur Ulang"):
    if sumber_bank_sampah and pabrik_tujuan.strip():
        data_transaksi = f"Material: {jenis_plastik} | Asal: {sumber_bank_sampah} | Pabrik: {pabrik_tujuan} | Berat: {berat_kg} kg | Status: {status_sertifikat}"
        st.session_state.my_blockchain.add_block(data_transaksi)
        st.success("Jejak daur ulang berhasil dicatat!")
    else:
        st.sidebar.error("Lengkapi data asal dan pabrik tujuan!")

st.subheader("📜Buku Besar Audit Daur Ulang (Eco Ledger)")

is_valid = st.session_state.my_blockchain.is_chain_valid()
if is_valid:
    st.success("✔️ Status Jaringan: Terverifikasi (Klaim Ramah Lingkungan Asli & Bebas Manipulasi)")
else:
    st.error("❌ PERINGATAN: Ada Manipulasi Data! Potensi Pembohong Klaim Ramah Lingkungan Detected!")

for block in st.session_state.my_blockchain.chain:
    with st.expander(f"Block #{block.index} | Hash ID: {block.hash[:15]}..."):
        col1, col2 = st.columns(2)

        with col1:
            st.write("**Detail Daur Ulang Material:**")
            st.info(block.data)
            st.write(f"**Waktu Log Digital:** {block.timestamp_readable}")

        with col2:
            st.write("**Vaerifikasi Kriptografi (SHA-256):**")
            st.write("**Hash Saat Ini:**")
            st.code(block.hash, language='text')
            st.write("**Hash Blok Sebelumnya:**")
            st.code(block.prev_hash, language='text')

st.sidebar.divider()
st.sidebar.write("🧪**Simulasi Audit & Manipulasi Data**")

total_block = len(st.session_state.my_blockchain.chain)
target_block_index = st.sidebar.number_input("Pilih Blok untuk Dimanipulasi:", min_value=0, max_value=total_block - 1 if total_block > 0 else 0, value=1 if total_block > 1 else 0, step=1)

if st.sidebar.button("🚨Palsukan Data Blok Ini!", type="primary"):
    if total_block > 1 and target_block_index > 0:
        st.session_state.my_blockchain.chain[target_block_index].data = "⚠️DATA DIPALSUKAN: Bahan Plastik Baru / Buka Daur Ulang Asli!"
        st.rerun()
    else:
        st.sidebar.warning("Tambah minimal 1 data daur ulang dulu untuk dicoba.")