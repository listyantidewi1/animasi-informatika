NAMA = "L07_petugas"
REKAMAN = ["rek", "web"]
def A(nama, **k): return dict(k='adegan', nama=nama, **k)
def R(a, b, **k): return dict(k='rek', a=a, b=b, **k)
def W(a, b, **k): return dict(k='rek', r='web', a=a, b=b, **k)
def E(a, b, speed=1.0): return dict(k='rek', a=a, b=b, asli=True, ekor=True, speed=speed)
KODE = ["public function update(Request $request, Report $report)", "{", "    $report->update($request->all());", "", "    return back();", "}"]
BEATS = {
 1: [A('kartuBab', min=6, a=dict(bab='BAB 7', judul='Halaman petugas', sub='Daftar, saringan, tanggapan, dan aturan status', lapis='server'))],
 2: [R('b02', 'b02_ketik', maks=1.5), R('b02_ketik', 'b02_with', kalimat=1, maks=3), R('b02_with', 'b02_akhir', kalimat=3), A('nPlus1', bg=False, min=14, a=dict(k1=4, k2=5))],
 3: [R('b03', 'b03_akhir'), A('halaman', min=12), E('b04', 'b04_valid', 4)],
 4: [R('b04_valid', 'b04_where', kalimat=1), R('b04_where', 'b04_bulan', kalimat=2), R('b04_bulan', 'b04_akhir', kalimat=3), E('b05', 'b05_form', 5)],
 5: [R('b05_form', 'b05_akhir', maks=3), W('b05', 'b05_hasil', kalimat=1, maks=1.5), W('b05_hasil', 'b05_hal', kalimat=3, maks=1.5), W('b05_hal', 'b05_akhir')],
 6: [R('b06', 'b06_query', maks=3), R('b06_query', 'b06_view', kalimat=1), R('b06_view', 'b06_akhir', maks=3), W('b06', 'b06_akhir', kalimat=2), E('b07', 'b07_alur', 3)],
 7: [R('b07_alur', 'b07_baru', kalimat=2), R('b07_baru', 'b07_proses', kalimat=3), R('b07_proses', 'b07_selesai', kalimat=4), R('b07_selesai', 'b07_boleh', kalimat=5), R('b07_boleh', 'b07_akhir', kalimat=6), E('b08', 'b08_valid', 4)],
 8: [R('b08_valid', 'b08_alur'), R('b08_alur', 'b08_note', kalimat=1), R('b08_note', 'b08_akhir', kalimat=4), E('b09', 'b09_trans', 3)],
 9: [R('b09_trans', 'b09_akhir')],
 10: [R('b10', 'b10_riwayat', maks=8), R('b10_riwayat', 'b10_alur'), R('b10_alur', 'b10_ctrl', kalimat=1), R('b10_ctrl', 'b10_akhir', maks=4), W('b10', 'b10_selesai', kalimat=3, maks=2), W('b10_selesai', 'b10_riwayat', kalimat=4, maks=2), W('b10_riwayat', 'b10_akhir', kalimat=5)],
 11: [A('bukanPengaman', min=20)],
 12: [A('cekAI', tambah=3.5, a=dict(perintah='buatkan fitur ubah status laporan', kode=KODE, size=32, w=1500))],
 13: [A('masalahAI', a=dict(kode=KODE, size=26, w=1640, masalah=[
        dict(k=1, judul='Tidak ada aturan alur', isi='Laporan yang sudah selesai bisa kembali menjadi baru.', sorot=[2]),
        dict(k=2, judul='$request->all() menerima semua isian', isi='Judul dan isi laporan milik siswa bisa ikut diubah.', sorot=[2]),
        dict(k=3, judul='Tidak ada yang dicatat', isi='Tidak ada yang tahu siapa mengubah apa, dan kapan.', sorot=[2])])),
      R('b13_commit', 'b13_commit_akhir', kalimat=4, maks=1.5), A('tantangan', min=9, a=dict(tantangan='Tambahkan tombol untuk mengunduh daftar laporan yang sedang tampil sebagai berkas CSV.', berikut='Bab 8: Halaman siswa dan hak akses'))],
}
