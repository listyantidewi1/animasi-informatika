NAMA = "L06_upload"
REKAMAN = ["rek", "web"]
def A(nama, **k): return dict(k='adegan', nama=nama, **k)
def R(a, b, **k): return dict(k='rek', a=a, b=b, **k)
def W(a, b, **k): return dict(k='rek', r='web', a=a, b=b, **k)
def E(a, b, speed=1.0): return dict(k='rek', a=a, b=b, asli=True, ekor=True, speed=speed)
KODE = ["$file = $request->file('photo');", "$nama = $file->getClientOriginalName();", "$file->move(public_path('uploads'), $nama);"]
BEATS = {
 1: [A('kartuBab', min=6, a=dict(bab='BAB 6', judul='Form laporan dan upload foto', sub='Tiga lapis pengaman untuk berkas kiriman', lapis='server')), A('tigaLapis', min=8)],
 2: [R('b02', 'b02_ctrl', maks=1.5), R('b02_ctrl', 'b02_view', kalimat=1, maks=2), R('b02_view', 'b02_csrf', kalimat=2, maks=8), R('b02_csrf', 'b02_enctype', kalimat=4), R('b02_enctype', 'b02_route', kalimat=5), E('b02_route', 'b02_akhir', 2), E('b03', 'b03_exists', 3)],
 3: [R('b03_exists', 'b03_title', kalimat=2), R('b03_title', 'b03_env', kalimat=3), R('b03_env', 'b03_akhir', kalimat=4, maks=1.5), E('b04', 'b04_user', 2.5)],
 4: [R('b04_user', 'b04_akhir', kalimat=1), E('b05', 'b05_mimes', 1.5)],
 5: [R('b05_mimes', 'b05_akhir', kalimat=2), E('b06', 'b06_baca', 3)],
 6: [R('b06_baca', 'b06_kecil', kalimat=1), R('b06_kecil', 'b06_tulis'), R('b06_tulis', 'b06_nama'), R('b06_nama', 'b06_pakai', kalimat=3), E('b06_pakai', 'b06_akhir', 2)],
 7: [A('exif', min=20)],
 8: [R('b08', 'b08_akhir', kalimat=1), A('folderPrivat', min=12, a=dict()), E('b09', 'b09_route', 2.5)],
 9: [R('b09_route', 'b09_ctrl'), R('b09_ctrl', 'b09_resp', maks=4), R('b09_resp', 'b09_akhir', kalimat=1), E('b10', 'b10_riwayat', 3)],
 10: [R('b10_riwayat', 'b10_trans', kalimat=1), R('b10_trans', 'b10_akhir', kalimat=2)],
 11: [R('b11', 'b11_akhir', maks=10), W('b11', 'b11_form', kalimat=1, maks=1.5), W('b11_form', 'b11_kirim', maks=3.5), W('b11_kirim', 'b11_akhir', kalimat=2)],
 12: [W('b12', 'b12_tolak1', kalimat=1, maks=1.5), W('b12_tolak1', 'b12_jpg', kalimat=2), W('b12_jpg', 'b12_tolak2', kalimat=3, maks=2), W('b12_tolak2', 'b12_akhir', kalimat=4)],
 13: [A('cekAI', tambah=3.5, a=dict(perintah='simpan foto laporan', kode=KODE, size=34, w=1500))],
 14: [A('masalahAI', a=dict(kode=KODE, size=28, w=1640, masalah=[
        dict(k=1, judul='Jenis berkas tidak diperiksa', isi='Folder public menjalankan PHP: berkas jahat langsung bisa dijalankan.', sorot=[2]),
        dict(k=3, judul='Nama asli dipakai apa adanya', isi='Dua siswa mengunggah foto.jpg, dan berkasnya saling menimpa.', sorot=[1]),
        dict(k=4, judul='Semua foto punya alamat', isi='Siapa saja bisa membukanya, bahkan tanpa login.', sorot=[2])])),
      R('b14_commit', 'b14_commit_akhir', kalimat=5, maks=1.5), A('tantangan', min=9, a=dict(tantangan='Batasi supaya satu siswa hanya bisa mengirim lima laporan per hari.', berikut='Bab 7: Halaman kerja Pak Hendra'))],
}
