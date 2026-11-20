NAMA = "B06_react"
REKAMAN = ["rek", "web"]
def A(nama, **k): return dict(k='adegan', nama=nama, **k)
def R(a, b, **k): return dict(k='rek', a=a, b=b, **k)
def W(a, b, **k): return dict(k='rek', r='web', a=a, b=b, **k)
def E(a, b, speed=1.0): return dict(k='rek', a=a, b=b, asli=True, ekor=True, speed=speed)
KAI = ["function Katalog() {", "  const [buku, setBuku] = useState([])", "  useEffect(() => {", "    fetch('http://localhost:3000/api/buku')", "      .then((res) => res.json())", "      .then(setBuku)", "  }, [])",
       "  return (", "    <ul>", "      {buku.map((b, i) => <li key={i}>{b.judul}</li>)}", "    </ul>", "  )", "}"]
BEATS = {
 1: [A('kartuBab', min=6, a=dict(bab='BAB 6', judul='React pertama', sub='Komponen, state, dan halaman login', lapis='frontend'))],
 2: [A('komponenState')],
 3: [R('b03', 'b03_hapus'), R('b03_hapus', 'b03_pasang', kalimat=1, maks=3), R('b03_pasang', 'b03_router', kalimat=2, maks=3), R('b03_router', 'b03_inter', kalimat=3), R('b03_inter', 'b03_gaya', kalimat=4),
     R('b03_gaya', 'b03_vite', kalimat=6), A('dariGitHub', bg=True, kalimat=7, min=3.6, a=dict(ket='gaya.css ada di folder web/src')), R('b03_vite', 'b03_proxy', kalimat=8, maks=3), R('b03_proxy', 'b03_akhir', kalimat=9),
     E('b03_html', 'b03_html_akhir', 2.5)],
 4: [R('b04', 'b04_pintu', maks=4), R('b04_pintu', 'b04_fetch', kalimat=1), R('b04_fetch', 'b04_gagal', kalimat=2), R('b04_gagal', 'b04_relatif', kalimat=3), R('b04_relatif', 'b04_nama', kalimat=4),
     R('b04_nama', 'b04_ingat', kalimat=5), R('b04_ingat', 'b04_akhir', kalimat=6)],
 5: [R('b05', 'b05_state', maks=5), R('b05_state', 'b05_use', kalimat=1), R('b05_use', 'b05_input', kalimat=2), R('b05_input', 'b05_kirim', kalimat=3), R('b05_kirim', 'b05_hasil', kalimat=4),
     R('b05_hasil', 'b05_galat', kalimat=5), R('b05_galat', 'b05_akhir', kalimat=6), E('b06_main', 'b06', 3)],
 6: [R('b06', 'b06_app'), R('b06_app', 'b06_state', kalimat=1, maks=8), R('b06_state', 'b06_efek', kalimat=2), R('b06_efek', 'b06_luar', kalimat=3), R('b06_luar', 'b06_belum', kalimat=4),
     R('b06_belum', 'b06_sudah', kalimat=5), R('b06_sudah', 'b06_daftar', kalimat=6), R('b06_daftar', 'b06_akhir', kalimat=7, maks=2), A('dariGitHub', bg=True, min=3, a=dict(ket='Daftar.jsx ada di folder web/src/halaman'))],
 7: [R('b07', 'b07_state', maks=8), R('b07_state', 'b07_minta', kalimat=1), R('b07_minta', 'b07_then', kalimat=2), R('b07_then', 'b07_catch', kalimat=3), R('b07_catch', 'b07_keadaan', kalimat=4),
     R('b07_keadaan', 'b07_map', kalimat=5), R('b07_map', 'b07_key', kalimat=6), R('b07_key', 'b07_akhir', kalimat=7)],
 8: [W('buka', 'form', maks=1.5), W('form', 'salah', kalimat=2), W('salah', 'nadia', kalimat=3, maks=1.8), W('nadia', 'katalog', kalimat=4, maks=1.5), W('katalog', 'muat', kalimat=5), W('muat', 'muat_akhir', kalimat=6)],
 9: [A('cekAI', tambah=3.5, a=dict(perintah='buatkan halaman katalog dengan React', kode=KAI, size=28, w=1300))],
 10: [A('masalahAI', a=dict(kode=KAI, size=22, w=1640, masalah=[
        dict(k=0, judul='Kegagalan tidak ditangani', isi='Kalau server mati, halaman kosong tanpa penjelasan, dan pengguna mengira bukunya tidak ada.', sorot=[3, 4, 5]),
        dict(k=2, judul='key memakai nomor urut', isi='Begitu daftar disaring atau diurutkan, nomor urut berpindah ke buku lain.', sorot=[9]),
        dict(k=4, judul='Alamat lengkap berisi localhost', isi='Dampaknya baru terlihat di Bab 10.', sorot=[3])])),
      R('b10_cd', 'b10_akhir', kalimat=6, maks=3), W('gulir', 'gulir_akhir', kalimat=7),
      A('lanjut', kalimat=9, min=6, a=dict(selesai='Login dari halaman sungguhan, dan daftar buku tampil di layar.', berikut='Bab 7: Pencarian'))],
}
