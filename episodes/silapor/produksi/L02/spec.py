NAMA = "L02_kebutuhan"
REKAMAN = []
def A(nama, **k): return dict(k='adegan', nama=nama, **k)
KODE = ["Schema::create('aduan', function (Blueprint $table) {", "    $table->id();", "    $table->string('nama');", "    $table->text('isi');", "    $table->enum('status', ['pending', 'done']);", "    $table->timestamps();", "});"]
BEATS = {
 1: [A('kartuBab', a=dict(bab='BAB 2', judul='Kebutuhan', sub='Belum ada kode. Kita mengobrol dulu dengan pemakainya.', lapis='kebutuhan'))],
 2: [A('pakHendra')], 3: [A('empatSaringan')], 4: [A('aksiPetugas')], 5: [A('lina')], 6: [A('dimas')], 7: [A('ditolak')], 8: [A('polaCerita')], 9: [A('tidakDibuat')],
 10: [A('cekAI', tambah=3.5, a=dict(perintah='buatkan aplikasi pengaduan sarana sekolah', kode=KODE, size=32, w=1400))],
 11: [A('masalahAI', a=dict(kode=KODE, size=28, w=1640, masalah=[
        dict(k=1, judul='Tidak ada status ditolak', isi='Laporan yang bukan wewenang sekolah tidak punya tempat, dan tidak ada alasannya.', sorot=[4]),
        dict(k=2, judul='Tidak ada aturan siapa yang boleh melihat', isi='Dimas tidak mau kakak kelasnya tahu siapa yang melapor.', sorot=[2]),
        dict(k=3, judul='Tidak ada riwayat', isi='Siswa tidak tahu kapan status laporannya berubah.', sorot=[4, 5])],
        tantangan=dict(k=6, tantangan='Tulis tiga kalimat “Sebagai …, saya ingin …, supaya …” untuk aplikasi yang ingin kamu buat sendiri.', berikut='Bab 3: Merancang data')))],
}
