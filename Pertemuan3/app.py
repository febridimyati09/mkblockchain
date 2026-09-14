import streamlit as st
from core import Blockchain

st.set_page_config(page_title="Blockchain Explorer", page_icon="🔗", layout="wide")
st.title("Blockchain | Halal Coffee Supply Chain ☕")

if 'my_blockchain' not in st.session_state:
    st.session_state.my_blockchain = Blockchain()

st.sidebar.header("➕ Data Baru")

petani = st.sidebar.text_input("Nama Petani/Aktor:")
jumlah_kopi = st.sidebar.number_input("Jumlah Panen (kg):", min_value=1)
lokasi = st.sidebar.text_input("Lokasi Kebun:")

if st.sidebar.button("Tambahkan ke Blockchain"):
    if petani.strip() and lokasi.strip():
        data_transaksi = f"Petani: {petani} | Panen: {jumlah_kopi} kg | Lokasi: {lokasi}"
        st.session_state.my_blockchain.add_block(data_transaksi)
        st.sidebar.success("Blok berhasil ditambahkan!")
else:
    st.sidebar.error("Lengkapi semua data!")

st.subheader("📜 Blockchain Ledger (Buku Besar)")

is_valid = st.session_state.my_blockchain.is_chain_valid()
if is_valid:
    st.success("✔️ Status jaringan: Rantai Valid (Aman)")
else:
    st.error("❌ PERINGATAN: Integritas Rantai Rusak (Telah Dimanipulasi)")

for block in st.session_state.my_blockchain.chain:
    with st.expander(f"Blok #{block.index} | Hash: {block.hash[:15]}..."):
       
         col1, col2 = st.columns(2)

         with col1:
           st.write("**Data Payload:**")
           st.info(block.data)
           st.write(f"**Timestamp:** {block.timestamp_readable}")

         with col2:
           st.write("**Kriptografi:**")
           st.write(f"**Hash Saat Ini:**")
           st.code(block.hash, language='python')
           st.write(f"**Hash Sebelumnya (Pointer):**")
           st.code(block.prev_hash, language='python')

st.sidebar.divider()
st.sidebar.write("🧪 **Zona Pengujian Integritas**")

total_blok = len(st.session_state.my_blockchain.chain)
target_blok_index = st.sidebar.number_input("Pilih Blok untuk Dipalsukan:", min_value=0, max_value=total_blok - 1 if total_blok > 0 else 0, value=1 if total_blok > 1 else 0, step=1)

if st.sidebar.button("🚨 Palsukan Data Blok Ini!", type="primary"):

    if total_blok > 0:

        st.session_state.my_blockchain.chain[target_blok_index].data = "⚠️ DATA DIPALSUKAN: Kopi Non-Halal!"
        st.rerun()
    else:
        st.sidebar.warning("Tidak ada blok untuk dipalsukan, tambahkan minimal 1 data kopi terlebih dahulu.")
        