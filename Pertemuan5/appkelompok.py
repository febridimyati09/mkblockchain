import streamlit as st
from core import Block, Blockchain

st.set_page_config(page_title="Supply Chain Barang Mewah", page_icon="💎")
st.title("💎 Sistem Autentikasi & Rantai Pasok Barang Mewah")

if "luxury_chain" not in st.session_state:
    st.session_state.luxury_chain = Blockchain()

st.sidebar.title("🚨 Area Simulasi Serangan")
st.sidebar.write("Fitur khusus untuk pengujian integritas blockchain.")

if st.sidebar.button("👨‍💻 HACK BLOK 1"):
    if len(st.session_state.luxury_chain.chain) > 1:
        st.session_state.luxury_chain.chain[1].data = "DATA PALSU!"
        st.sidebar.error("⚠️ Data pada Blok #1 berhasil diubah secara paksa menjadi 'DATA PALSU!'.")
    else:
        st.sidebar.warning("Tambahkan minimal 1 blok barang mewah dulu sebelum melakukan simulasi hack!")

data_barang = st.text_input("Masukkan Data Barang Mewah (Misal: 'Tas Hermes - Seri 2024'):")
if st.button("⛏️ Mine Block (Tambah Data Barang Mewah)"):
    if data_barang:
        new_index = len(st.session_state.luxury_chain.chain)
        new_block = Block(new_index, data_barang, "")

        with st.spinner("Sedang mencari Hash yang tepat (Mining)..."):
            st.session_state.luxury_chain.add_block(new_block)

        st.success("Data barang mewah berhasil ditambang dan diamankan ke dalam rantai!")
    else:
        st.warning("Masukkan data barang mewah terlebih dahulu.")

st.markdown("---")

if st.button("🛡️ Cek Integritas Rantai"):
    if st.session_state.luxury_chain.is_chain_valid():
        st.success("Status Jaringan: AMAN (Rantai Valid)")
    else:
        st.error("Status Jaringan: BAHAYA (Data Telah dimanipulasi!)")

st.markdown("---")

st.subheader("📜Buku Besar (Ledger Barang Mewah)")
for block in st.session_state.luxury_chain.chain:
    with st.expander(f"Blok #{block.index} - Hash: {block.hash[:15]}..."):
        st.write(f"**Waktu:** {block.timestamp}")
        st.write(f"**Data Barang Mewah:** {block.data}")
        st.write(f"**Nonce (Tebakan):** {block.nonce}")
        st.write(f"**Prev Hash:** {block.previous_hash}")
        st.info(f"**Hash:** {block.hash}")