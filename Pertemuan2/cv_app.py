import streamlit as st

st.set_page_config(page_title="CV App", layout="wide")

# Sidebar untuk input data diri
st.sidebar.title("Pengaturan Profil")
st.sidebar.write("Masukan data diri Anda dibawah ini.")

# Input Data Diri
nama = st.sidebar.text_input("Nama Lengkap:")
nim = st.sidebar.text_input("NIM:")
jurusan = st.sidebar.text_input("Jurusan:")
email = st.sidebar.text_input("Email:")
linkedin = st.sidebar.text_input("LinkedIn:")
github = st.sidebar.text_input("GitHub:")

# INPUT TAMBAHAN (Sesuai Tugas Praktikum)
st.sidebar.markdown("---")
st.sidebar.subheader("Pengalaman")

# TUGAS 1: Input Pengalaman Organisasi
pengalaman_org = st.sidebar.text_area("Pengalaman Organisasi:")

# TUGAS 3: Checkbox & Text Area Kondisional Magang/Sertifikasi
punya_magang = st.sidebar.checkbox("Punya Pengalaman Magang/Sertifikasi?")
detail_magang = ""
if punya_magang:
    detail_magang = st.sidebar.text_area("Detail Magang / Sertifikasi:")

deskripsi = st.sidebar.text_area("Deskripsi Singkat.")

foto_profil = st.sidebar.file_uploader("Unggah Foto Profil", type=["jpg", "jpeg", "png"])

# AREA UTAMA
st.title("Curriculum Vitae Digital")
st.markdown("---") #Bikin garis pembatas horizontal

kolom_kiri, kolom_kanan = st.columns([2, 1])

with kolom_kiri:

    st.header(nama)
    st.subheader(f"{jurusan} | {nim}")
    st.write(deskripsi)

with kolom_kanan:

    if foto_profil is not None:
        st.image(foto_profil, width=200, caption="Foto Profil")
    else:
        st.info("Belum ada foto profil yang diunggah.")

# SKILLS
st.markdown("### Keahlian Teknis")
# Sidebar slider buat mengatur level skill
st.sidebar.markdown("---")
st.sidebar.subheader("Atur Kemahiran Skill")
skill_python = st.sidebar.slider("Python", 0, 100, 80)
skill_web = st.sidebar.slider("Web Development", 0, 100, 60)
skill_db = st.sidebar.slider("Database", 0, 100, 70)

# Menampilkan indikator visual (Progress Bar) di halaman utama
st.write("**Python**")
st.progress(skill_python)

st.write("**Web Development (HTML/CSS)**")
st.progress(skill_web)

st.write("**Database (SQL)**")
st.progress(skill_db)

# TAMPILAN PENGALAMAN (Tugas 1 & 3)
st.markdown("---")

# Menampilkan Pengalaman Organisasi (Tugas 1)
st.markdown("### Pengalaman Organisasi")
if pengalaman_org:
    st.write(pengalaman_org)
else:
    st.write("_Belum ada pengalaman organisasi yang diisi._")

# Menampilkan Pengalaman Magang/Sertifikasi secara dinamis (Tugas 3)
st.markdown("### Pengalaman Magang / Sertifikasi")
if punya_magang:
    if detail_magang:
        st.success(f"**Detail Pengalaman / Sertifikasi:**\n\n{detail_magang}")
    else:
        st.info("Silakan isi detail pengalaman magang/sertifikasi di sidebar.")
else:
    st.write("_Tidak ada pengalaman magang/sertifikasi._")

st.markdown("---")

# Bagian kontak
st.markdown("### Hubungi saya")
with st.expander("Klik untuk melihat detail kontak"):
    st.write(f"Email: " + email)
    st.write(f"LinkedIn: linkedin.com/in/" + linkedin)
    st.write(f"GitHub: github.com/" + github)


# TUGAS 2: Tombol Download CV (.txt)
st.markdown("---")
data_cv = f"Nama: {nama}\nNIM: {nim}\nJurusan: {jurusan}"

st.download_button(
    label="Download Data CV",
    data=data_cv,
    file_name="cv_data.txt",
    mime="text/plain"
)

