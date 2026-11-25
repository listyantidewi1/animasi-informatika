NAMA = "B08_pinjam"
REKAMAN = ["rek", "web"]
def A(nama, **k): return dict(k='adegan', nama=nama, **k)
def R(a, b, **k): return dict(k='rek', a=a, b=b, **k)
def W(a, b, **k): return dict(k='rek', r='web', a=a, b=b, **k)
def E(a, b, speed=1.0): return dict(k='rek', a=a, b=b, asli=True, ekor=True, speed=speed)
KAI = ["function KartuBuku({ buku, pinjamanku }) {", "  const penuh = pinjamanku.length >= 3", "  return (", "    <li>", "      <b>{buku.judul}</b>",
       "      <button disabled={penuh} onClick={() => pinjam(buku)}>Pinjam</button>", "    </li>", "  )", "}"]
BEATS = {
 1: [A('kartuBab', min=6, a=dict(bab='BAB 8', judul='Pinjam dan kembali', sub='Transaksi, kunci, dan aturan Bu Ratih', lapis='server'))],
 2: [A('balapan')],
 3: [R('b03', 'b03_aturan', maks=6), R('b03_aturan', 'b03_kerangka', kalimat=1), R('b03_kerangka', 'b03_kon', kalimat=2, maks=4), R('b03_kon', 'b03_commit', kalimat=3), R('b03_commit', 'b03_rollback', kalimat=4),
     R('b03_rollback', 'b03_release', kalimat=5), R('b03_release', 'b03_akhir', kalimat=6), E('b04', 'b04_kunci', 3.5)],
 4: [R('b04_kunci', 'b04_hitung', kalimat=1), R('b04_hitung', 'b04_telat', kalimat=2), R('b04_telat', 'b04_batas', kalimat=3), R('b04_batas', 'b04_tolak', kalimat=4), R('b04_tolak', 'b04_akhir', kalimat=5), E('b05', 'b05_eks', 4)],
 5: [R('b05_eks', 'b05_kunci'), R('b05_kunci', 'b05_raka', kalimat=1), R('b05_raka', 'b05_ubah', kalimat=2), R('b05_ubah', 'b05_tempo', kalimat=3), R('b05_tempo', 'b05_hp', kalimat=4), R('b05_hp', 'b05_jawab', kalimat=5),
     R('b05_jawab', 'b05_akhir', kalimat=6)],
 6: [R('b06', 'b06_saya', maks=10), R('b06_saya', 'b06_id', kalimat=1), R('b06_id', 'b06_kembali', kalimat=2), R('b06_kembali', 'b06_kode', kalimat=3), R('b06_kode', 'b06_app', kalimat=4), R('b06_app', 'b06_akhir', kalimat=5, maks=3)],
 7: [R('b07', 'b07_fungsi', maks=7), R('b07_fungsi', 'b07_tombol', kalimat=1), R('b07_tombol', 'b07_salin', kalimat=2), R('b07_salin', 'b07_menu', kalimat=3), A('dariGitHub', bg=True, min=3, a=dict(ket='Pinjaman.jsx ada di folder web/src/halaman')),
     R('b07_menu', 'b07_akhir', maks=3.5), E('b07_api', 'b07_api_akhir', 2.5)],
 8: [W('awal', 'bumi'), W('bumi', 'kode', kalimat=1, maks=1.5), W('kode', 'pinjamanku', kalimat=2), W('pinjamanku', 'keempat', kalimat=3), W('keempat', 'tolak', kalimat=4, maks=1.8), W('tolak', 'tolak_akhir', kalimat=5)],
 9: [A('cekAI', tambah=3.5, a=dict(perintah='batasi peminjaman maksimal tiga buku', kode=KAI, size=30, w=1400))],
 10: [A('masalahAI', a=dict(kode=KAI, size=26, w=1640, masalah=[
        dict(k=0, judul='Pemeriksaan hanya ada di browser', isi='Browser adalah wilayah pengguna, dan pengguna bisa melewatinya.', sorot=[1, 5])])),
      R('b10', 'b10_curl', kalimat=3), R('b10_curl', 'b10_kirim', kalimat=4, maks=2.5),
      A('aturanBesar', bg=True, kalimat=5, min=6, a=dict(kecil='Di aplikasi buatan AI', teks='Permintaan seperti ini berhasil.', sub='Servernya tidak pernah menghitung jumlah pinjaman.', warna='#f472b6')),
      R('b10_kirim', 'b10_akhir', kalimat=6),
      A('aturanBesar', kalimat=7, min=6.5, a=dict(teks='Aturan yang sesungguhnya dijaga di server.', sub='Tombol yang dimatikan hanya untuk kenyamanan.')),
      R('b10_rm', 'b10_commit_akhir', kalimat=8, maks=3),
      A('lanjut', kalimat=9, min=9, a=dict(selesai='Nadia bisa meminjam dari HP, dan server menjaga batas tiga buku.', tanya='Siapa meminjam apa, dan siapa yang terlambat?', berikut='Bab 9: Halaman petugas'))],
}
