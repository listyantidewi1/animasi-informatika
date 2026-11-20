NAMA = "P04_migration"
REKAMAN = ["rek"]
def A(nama, **k): return dict(k='adegan', nama=nama, **k)
def R(a, b, **k): return dict(k='rek', a=a, b=b, **k)
def E(a, b, speed=1.0): return dict(k='rek', a=a, b=b, asli=True, ekor=True, speed=speed)
KODE = ["Schema::create('transaksi', function (Blueprint $table) {", "    $table->id();", "    $table->integer('kendaraan_id');", "    $table->string('plat');", "    $table->dateTime('jam_masuk');", "    $table->dateTime('jam_keluar')->nullable();", "    $table->float('biaya')->nullable();", "    $table->string('status')->default('masuk');", "    $table->timestamps();", "});"]
SQL = ["create table `parkings` (", "  `id` bigint unsigned not null auto_increment primary key,", "  `vehicle_id` bigint unsigned not null,", "  ...", "  `open` tinyint(1) null default '1'", ")", "alter table `parkings` add constraint `parkings_vehicle_id_foreign`", "  foreign key (`vehicle_id`) references `vehicles` (`id`)", "alter table `parkings` add unique", "  `parkings_vehicle_id_open_unique`(`vehicle_id`, `open`)"]
BEATS = {
 1: [A('kartuBab', min=6, a=dict(bab='BAB 4', judul='Migration dan model', sub='Enam tabel menjadi nyata di MySQL', lapis='database'))],
 2: [R('b02', 'b02_ketik', maks=1.3), R('b02_ketik', 'b02_role', kalimat=2, maks=3), R('b02_role', 'b02_akhir', kalimat=3)],
 3: [R('b03', 'b03_cmd'), R('b03_cmd', 'b03_lain', kalimat=1, maks=1.3), R('b03_lain', 44.0, kalimat=3, maks=2), R(73.3, 78.0, maks=2), R(107.0, 112.0, maks=2), R(140.8, 'b03_akhir', maks=1)],
 4: [R('b04', 'b04_ketik', maks=1.3), R('b04_ketik', 'b04_unik', maks=3), R('b04_unik', 'b04_tiga', kalimat=1), R('b04_tiga', 'b04_akhir', kalimat=2)],
 5: [R('b05', 'b05_veh', maks=4), R('b05_veh', 'b05_plat', maks=4), R('b05_plat', 'b05_akhir', kalimat=1)],
 6: [R('b06', 'b06_ketik', maks=1.3), R('b06_ketik', 'b06_fk', maks=4), R('b06_fk', 'b06_users', kalimat=1), R('b06_users', 'b06_null', kalimat=3), R('b06_null', 'b06_akhir', kalimat=4)],
 7: [R('b07', 'b07_open', maks=2), R('b07_open', 'b07_ketik2'), R('b07_ketik2', 'b07_unik', kalimat=1, maks=3), R('b07_unik', 'b07_index'), R('b07_index', 'b07_akhir', kalimat=3), E('b07_log', 'b07_log_akhir', 3)],
 8: [R('b08', 'b08_cmd'), R('b08_cmd', 'b08_akhir', kalimat=1, maks=1.3),
     A('kodeJelas', kalimat=3, min=10, a=dict(judul='SQL yang ditulis Laravel untuk kita', sub='Keluaran php artisan migrate --pretend, dirapikan', warna='#2dd4bf', kode=SQL, size=36, w=1640, langkah=[
        dict(k=3, sorot=[8, 9], ket='Aturan unik kita menjadi unique index.'),
        dict(k=3, d=4.2, sorot=[6, 7], ket='Setiap foreignId menjadi foreign key.'),
        dict(k=4, sorot=[], ket='Belum ada yang dijalankan. Tabelnya kita buat setelah data awalnya siap.')]))],
 9: [R('b09', 'b09_ketik', maks=1.3), R('b09_ketik', 'b09_fill', maks=5), R('b09_fill', 'b09_vehicle', kalimat=3), R('b09_vehicle', 'b09_akhir', kalimat=5), A('panah', kalimat=6, min=9, a=dict(k=6))],
 10: [R('b10', 'b10_rapikan', maks=5), R('b10_rapikan', 'b10_lain', kalimat=1), R('b10_lain', 'b10_akhir', kalimat=3, maks=6)],
 11: [R('b11', 'b11_ketik', maks=1.3), R('b11_ketik', 'b11_tarif', kalimat=1, maks=6), R('b11_tarif', 'b11_role', kalimat=2), R('b11_role', 'b11_akhir', kalimat=3)],
 12: [R('b12', 628, maks=1.3), R(742.5, 'b12_mysql', kalimat=1, maks=1), R('b12_mysql', 'b12_rates', kalimat=3, maks=2), R('b12_rates', 'b12_akhir', kalimat=4, maks=1.3)],
 13: [A('cekAI', tambah=3.5, a=dict(perintah='buatkan migration untuk tabel transaksi parkir', kode=KODE, size=28, w=1500))],
 14: [A('masalahAI', a=dict(kode=KODE, size=23, w=1640, masalah=[
        dict(k=1, judul='kendaraan_id hanya angka biasa', isi='Tanpa foreign key, ia boleh menunjuk kendaraan yang sudah dihapus.', sorot=[2]),
        dict(k=2, judul='Tidak ada aturan unik', isi='Kendaraan yang sama boleh berstatus "masuk" dua kali.', sorot=[7]),
        dict(k=3, judul='Tidak ada index pada jam keluar', isi='Rekap makin lambat ketika datanya bertambah.', sorot=[5])])),
      R('b14_commit', 'b14_commit_akhir', kalimat=4, maks=1.5),
      A('tantangan', kalimat=5, min=9, a=dict(tantangan='Tambahkan kolom catatan pada tabel parkings lewat migration baru, tanpa menghapus datanya.', berikut='Bab 5: Login dan tiga peran'))],
}
