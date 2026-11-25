NAMA = "L04_migration"
REKAMAN = ["rek"]
def A(nama, **k): return dict(k='adegan', nama=nama, **k)
def R(a, b, **k): return dict(k='rek', a=a, b=b, **k)
def E(a, b, speed=1.0): return dict(k='rek', a=a, b=b, asli=True, ekor=True, speed=speed)  # ekor senyap
Q = ["SELECT * FROM reports", "WHERE created_at LIKE '%11%';"]
BEATS = {
 1: [A('kartuBab', min=6, a=dict(bab='BAB 4', judul='Migration dan SQL', sub='Empat tabel menjadi nyata di MySQL', lapis='database'))],
 2: [A('poin', a=dict(judul='Migration: tabel yang ditulis sebagai kode', warna='#2dd4bf', kol=3, tinggi=380, item=[
        dict(k=1, besar='.php', mono=True, judul='Tabel ditulis di berkas PHP', isi='Bukan diklik satu per satu di aplikasi database.'),
        dict(k=2, besar='Git', judul='Rancangan ikut tersimpan', isi='Perubahan tabel tercatat bersama kodenya.'),
        dict(k=3, besar='migrate', mono=True, judul='Satu perintah', isi='Teman dan server mendapat tabel yang sama persis.')]))],
 3: [R('b03', 'b03_ketik', maks=1.3), R('b03_ketik', 'b03_role', kalimat=2, maks=3), R('b03_role', 'b03_kelas', kalimat=3), R('b03_kelas', 'b03_akhir', kalimat=4)],
 4: [R('b04', 'b04_mig', maks=1.3), R('b04_mig', 'b04_akhir', kalimat=2, maks=2), E('b05', 'b05_mig'), E('b05_mig', 'b05_fk', 2.5)],
 5: [R('b05_fk', 'b05_fk2', kalimat=1), R('b05_fk2', 'b05_kolom', kalimat=2), R('b05_kolom', 'b05_ts', kalimat=3), R('b05_ts', 'b05_index', kalimat=4), R('b05_index', 'b05_akhir', kalimat=5), E('b06', 'b06_mig'), E('b06_mig', 'b06_created', 2.5)],
 6: [R('b06_created', 'b06_akhir', kalimat=2)],
 7: [R('b07', 'b07_mysql', maks=1.3), R('b07_mysql', 'b07_akhir', kalimat=2, maks=1.5)],
 8: [R('b08', 'b08_ketik', maks=1.5), R('b08_ketik', 'b08_fill', kalimat=1, maks=2), R('b08_fill', 'b08_akhir', kalimat=2), E('b09', 'b09_user', 2.5)],
 9: [R('b09_user', 'b09_updates', kalimat=1), R('b09_updates', 'b09_usermodel', kalimat=2), R('b09_usermodel', 'b09_lain', kalimat=3, maks=4), R('b09_lain', 'b09_akhir', kalimat=4, maks=4), E('b10', 'b10_kat', 4)],
 10: [R('b10_kat', 'b10_sandi', kalimat=1), R('b10_sandi', 'b10_contoh', kalimat=2), R('b10_contoh', 'b10_seed', kalimat=3), R('b10_seed', 386.5, kalimat=4, maks=1.5), R(505.7, 'b10_akhir', maks=1.3)],
 11: [R('b11', 'b11_akhir', maks=1.5), A('sqlEloquent', min=12, a=dict(k2=2, k3=3, k4=4))],
 12: [R('b12', 'b12_bulan', maks=1.3), R('b12_bulan', 'b12_akhir', kalimat=2, maks=1.3)],
 13: [A('cekAI', tambah=3.5, a=dict(perintah='tampilkan laporan bulan November', kode=Q, size=40, w=1300))],
 14: [R('b14', 'b14_rentang', maks=1.5), R('b14_rentang', 'b14_selisih', kalimat=1, maks=1.5), R('b14_selisih', 'b14_akhir', kalimat=3, maks=1.3), A('likeSalah', min=9, a=dict(k1=5, k2=6)),
      R('b14_commit', 'b14_commit_akhir', kalimat=7, maks=1.5), A('tantangan', min=9, a=dict(tantangan='Tulis query yang menghitung jumlah laporan per kategori, diurutkan dari yang terbanyak.', berikut='Bab 5: Login'))],
}
