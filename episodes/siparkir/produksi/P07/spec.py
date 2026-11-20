NAMA = "P07_tarif"
REKAMAN = ["rek"]
def A(nama, **k): return dict(k='adegan', nama=nama, **k)
def R(a, b, **k): return dict(k='rek', a=a, b=b, **k)
def E(a, b, speed=1.0): return dict(k='rek', a=a, b=b, asli=True, ekor=True, speed=speed)
KODE = ["function hitung(Rate $tarif, int $menit): int", "{", "    $jam = floor($menit / 60) + 1;", "    $biaya = $tarif->first_hour + ($jam - 1) * $tarif->next_hour;", "", "    return min($biaya, $tarif->daily_max);", "}"]
BEATS = {
 1: [A('kartuBab', min=5, a=dict(bab='BAB 7', judul='Rumus tarif', sub='Jantung aplikasi: test dulu, baru rumusnya', lapis='server')),
     A('poin', kalimat=1, a=dict(judul='Urutannya kita balik', warna='#a3e635', kol=2, tinggi=380, item=[
        dict(k=4, besar='1. Test', judul='Tulis dulu jawaban yang benar', isi='Contoh hitungan dari Bu Ratna menjadi kode.', warna='#a3e635'),
        dict(k=4, d=1.6, besar='2. Rumus', judul='Baru rumusnya', isi='Rumus selesai kalau semua test hijau.', warna='#38bdf8')]))],
 2: [A('poin', a=dict(judul='Aturan tarif dari Bu Ratna', sub='Untuk motor', warna='#f472b6', kol=3, tinggi=300, item=[
        dict(k=1, d=1.2, besar='Rp2.000', mono=True, judul='Jam pertama'),
        dict(k=1, d=3.4, besar='Rp1.000', mono=True, judul='Tiap jam berikutnya'),
        dict(k=1, d=5.6, besar='Rp8.000', mono=True, judul='Paling banyak per hari'),
        dict(k=2, besar='5 menit', judul='Kelonggaran', isi='Lewat sedikit tidak dihitung.'),
        dict(k=3, besar='24 jam', judul='Menginap', isi='Tiap 24 jam penuh = satu batas harian.'),
        dict(k=3, d=5.0, besar='+ sisa', judul='Sisanya', isi='Dihitung seperti hari biasa.')]))],
 3: [R('b03', 'b03_ketik', maks=1.3), R('b03_ketik', 'b03_bantu', maks=7), R('b03_bantu', 'b03_tiga', kalimat=1), R('b03_tiga', 'b03_baca'), R('b03_baca', 'b03_pest', kalimat=2), R('b03_pest', 'b03_akhir', kalimat=4)],
 4: [R('b04', 'b04_tiga', maks=5), R('b04_tiga', 'b04_65', kalimat=1), R('b04_65', 'b04_66', kalimat=2), R('b04_66', 'b04_with', kalimat=3), R('b04_with', 'b04_inap', kalimat=4), R('b04_inap', 'b04_inap_sorot', kalimat=5, maks=5), R('b04_inap_sorot', 'b04_akhir')],
 5: [R('b05', 'b05_akhir', maks=1.3)],
 6: [A('cekAI', tambah=3.5, a=dict(perintah='buatkan rumus biaya parkir (tarif disebutkan lengkap)', kode=KODE, size=30, w=1500))],
 7: [R('b07', 'b07_test', maks=1.3), R('b07_test', 'b07_akhir', kalimat=1, maks=1.3), A('hasilAI', kalimat=3, min=16, a=dict(k3=3, k4=4, k5=5))],
 8: [R('b08', 'b08_menit', maks=5), R('b08_menit', 'b08_hari', kalimat=1), R('b08_hari', 'b08_total', kalimat=2), R('b08_total', 'b08_akhir', kalimat=4)],
 9: [R('b09', 'b09_ceil', maks=5), R('b09_ceil', 'b09_ceil_akhir', kalimat=1), A('bulatAtas', kalimat=2, min=12, a=dict(k2=2, k3=3)), R('b09_nol', 'b09_min', kalimat=4), R('b09_min', 'b09_akhir', kalimat=5)],
 10: [R('b10', 'b10_akhir', maks=1.3), R('b10_commit', 'b10_commit_akhir', kalimat=3, maks=1.5)],
 11: [A('tantangan', min=9, a=dict(tantangan='Bu Ratna ingin tarif khusus hari Minggu, yaitu setengah harga. Tulis test-nya dulu, baru ubah rumusnya.', berikut='Bab 8: Kendaraan masuk dan keluar'))],
}
