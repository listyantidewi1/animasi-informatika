NAMA = "P05_prosedur"
REKAMAN = ["rek"]
def A(nama, **k): return dict(k='adegan', nama=nama, **k)
def R(a, b, **k): return dict(k='rek', a=a, b=b, **k)
KODE = ["CREATE PROCEDURE kembalikan_pinjam(p_id INT, p_petugas INT)", "BEGIN",
        "    INSERT INTO pengembalian (peminjaman_id, tanggal_kembali, denda, diterima_oleh)",
        "    SELECT id, CURDATE(), (DATEDIFF(CURDATE(), jatuh_tempo) + 1) * 2000 * jumlah, p_petugas",
        "    FROM peminjaman WHERE id = p_id;", "",
        "    UPDATE alat SET stok = stok + 1",
        "    WHERE id = (SELECT alat_id FROM peminjaman WHERE id = p_id);", "END"]
BEATS = {
 1: [A('kartuBab', min=6, a=dict(bab='BAB 5', judul='Function dan\nstored procedure', sub='Sepuluh pengajuan bersamaan, satu peminjam', lapis='database'))],
 2: [A('poin', a=dict(judul='MySQL juga bisa menyimpan kode', warna='#2dd4bf', kol=3, tinggi=420, item=[
        dict(k=2, besar='function', mono=True, judul='Rumus: masukan menjadi satu nilai', isi='Contoh: hitung_denda'),
        dict(k=3, besar='procedure', mono=True, judul='Serangkaian perintah yang diberi nama', isi='Dipanggil dengan CALL'),
        dict(k=4, besar='1 kali', judul='Aturan ditulis satu kali', isi='Berlaku untuk halaman web, aplikasi HP, dan SQL yang diketik langsung.')]))],
 3: [R('b03', 'b03_delim', kalimat=0, maks=7), R('b03_delim', 'b03_masukan', kalimat=2), R('b03_masukan', 'b03_declare', kalimat=3), R('b03_declare', 'b03_select', kalimat=4),
     R('b03_select', 'b03_hari', kalimat=5), R('b03_hari', 'b03_return', kalimat=6), R('b03_return', 'b03_akhir', kalimat=7)],
 4: [R('b04', 'b04_a', maks=2), R('b04_a', 'b04_b', kalimat=1, maks=1.5), R('b04_b', 'b04_c', kalimat=2, maks=1.5), R('b04_c', 'b04_akhir', kalimat=3, maks=1.5)],
 5: [A('race', a=dict(w=dict(mulai=1, rafi=2, nadia=3, cukup=[4, 0], catat=[4, 2.6], nama=5), nama='Race condition', ket='Dua proses berebut data yang sama.'))],
 6: [A('obat')],
 7: [R('b07', 'b07_masukan', maks=8), R('b07_masukan', 'b07_start', kalimat=0), R('b07_start', 'b07_kunci', kalimat=1), R('b07_kunci', 'b07_signal', kalimat=2), R('b07_signal', 'b07_update', kalimat=3),
     R('b07_update', 'b07_insert', kalimat=4), R('b07_insert', 'b07_commit', kalimat=5), R('b07_commit', 'b07_akhir', kalimat=6)],
 8: [R('b08', 'b08_handler', kalimat=0, maks=2.5), R('b08_handler', 'b08_akhir', kalimat=1)],
 9: [R('b09', 'b09_pengguna', maks=2), R('b09_pengguna', 'b09_stok', kalimat=1, maks=2.5), R('b09_stok', 'b09_rafi', kalimat=2, maks=1.5), R('b09_rafi', 'b09_hasil', kalimat=3, maks=1.5),
     R('b09_hasil', 'b09_nadia', kalimat=4, maks=2), R('b09_nadia', 'b09_tetap', kalimat=5, maks=1.5), R('b09_tetap', 'b09_akhir', kalimat=6, maks=1.5)],
 10: [R('b10', 'b10_seru', kalimat=1, maks=1.5), R('b10_seru', 'b10_jalan', kalimat=2, maks=1.3), R('b10_jalan', 'b10_nol', kalimat=3, maks=1.2), R('b10_nol', 'b10_akhir', kalimat=4, maks=1.5)],
 11: [A('cekAI', tambah=3.5, a=dict(perintah='buat stored procedure untuk mengembalikan pinjaman', kode=KODE, size=27, w=1640))],
 12: [A('masalahAI', a=dict(kode=KODE, size=25, w=1640, masalah=[
        dict(k=0, judul='Tanpa transaksi, data bisa tersimpan setengah', isi='INSERT berhasil, UPDATE gagal: pengembalian tercatat, stok tidak pernah bertambah.', sorot=[2, 6]),
        dict(k=2, judul='DATEDIFF + 1: denda di hari jatuh tempo', isi='Mengembalikan tepat waktu ikut kena denda satu hari. Uji selalu tepat di batasnya.', sorot=[3])])),
      R('b12_salin', 'b12_salin_akhir', kalimat=5), R('b12_commit', 'b12_akhir', kalimat=6, maks=1.5),
      A('lanjut', kalimat=7, min=14, a=dict(selesai='Stok aman dari rebutan: sepuluh pengajuan, satu peminjam.', berikut='Bab 6: Trigger'))],
}
