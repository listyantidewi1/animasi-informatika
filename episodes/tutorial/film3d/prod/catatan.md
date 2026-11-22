# Catatan sesi nyata (untuk mengisi [sesuai sesi])
## F02
- Storyboard pertama (F02a): GPS hanya "mengarah ke jalan kecil di tepi kali" (lelucon hilang); Claude menulis "Agar tetap tanpa narasi, saya tidak memakai suara GPS"; kucing turun sendiri lalu lari (lelucon hilang); wajah anak diterangi lilin ("cahaya lilin oranye di wajahnya"); anak menyanyikan Selamat ulang tahun; Claude menambah kucing di shot 8 dan perubahan cahaya dingin->hangat ("Tambahan saya").
- Prompt perbaikan nyata (F02c) 3 poin: GPS lelucon, kucing tidak mau turun + jeda 1 dtk, anak siluet + satu kalimat. Hasil: shot 2 7-20 (13 dtk) GPS dua kali + rem di bibir kali, shot 3 20-33 jeda 1 dtk hening, shot 7 siluet; aturan kontinuitas baru (light linking lilin). Total tetap 75.
- Pelajaran: AI tidak tahu mana yang lelucon kalau kita tidak bilang. Tulis maksudnya, bukan hanya kejadiannya.
- CLAUDE.md diketik manusia; baris tambahan "Render akhir di laptop dengan kartu grafis 4 GB, jadi tekstur paling besar 2k."
## F03
- Sesi Claude baru (/exit lalu claude) supaya CLAUDE.md terbaca.
- Claude meminta izin perintah gabungan (cd /tmp && blender ...): dipilih opsi 3 "Yes, and switch to auto mode".
- F03: Claude sudah membuat .gitignore sendiri (film.blend, *.blend1, cek/, __pycache__/), menjalankan bangun.py + cek.py sendiri (8 frame ±15 dtk), menawarkan opsi --vertikal. Kita menambah aset/ dan render/ dengan mengetik di .gitignore.
- Container mati di antara F03 dan F04 -> terminal Claude tertutup -> lanjut dengan `claude --continue` (tips untuk penonton).
## F04
- aset.py usulan Claude: HDRI cobblestone_street_night, asphalt_01, plastered_wall, red_bricks_04, clay_roof_tiles_02, rusty_metal_04; peta Diffuse/nor_gl/Rough/Displacement(+Metal). Claude bertanya "Apakah pilihan ini sudah oke?"
- Keputusan manusia: HDRI diganti moonless_golf karena cobblestone_street_night berisi gedung Eropa yang akan terpantul di genangan; tambah tekstur beton untuk tepi kali.
- F04c dunia_kota (22 mnt 47 dtk, Claude membuat film/bahan.py, geo.py, dunia_kota.py; cek.py dapat --shot dan denoiser OIDN). Keputusan Claude: 5 rumah kiri ganjil/5 kanan genap, gapura "GANG MELATI" (tambahan di luar permintaan), sulur menutupi plat nomor, air kali dinaikkan 0,8 m di bawah jalan, lampu lalu lintas 3 objek belum dianimasikan. Claude jujur: "Ruko masih berupa kotak sederhana, semak masih agak bersegi."
- Hasil pertama: suasana hujan dan pantulan sudah terasa; kurang: ruko kotak polos, gambar terlalu gelap dan semuanya cokelat-oranye, genangan shot 1 seperti cermin besar menutup jalan, lampu lalu lintas hanya titik merah.
- F04e tiga prompt poles (cps 40): genangan 6 mnt (genangan kecil tak beraturan, riak hujan; Claude juga menaikkan licin aspal 0.25->0.65 dan paving gang), cahaya 9 mnt (langit kebiruan, jendela hangat, lampu lalu lintas jadi kotak 3 lampu), ruko 6 mnt (rolling door bergaris, papan nama "TAMBAL BAN" dll, AC luar, teralis).
- Sisa masalah setelah F04e: gumpalan hijau-kuning menyala di ujung jalan (shot 1, 2, 4), tiang lampu lalu lintas tak tampak dan lampu merah berbentuk aneh, kolam cahaya natrium shot 2 belum tampak -> prompt F04f p_rapikan.txt.
- F04g: tur kota di Blender = foto diam viewport EEVEE (raw/F04g_foto/: kenanga_atas, kali, gang_atas dipakai) karena viewport EEVEE di cloud ±0,25 fps; F04g.mkv tidak dipakai. Narasi: di laptop dengan kartu grafis, viewport ini bisa diputar dengan lancar.
- F05a motor (6 mnt 40 dtk): motor.py, boks bertutup berengsel (Motor_Boks_Tutup), Paket berlabel 'Penerima: Ayah' + 'Gg. Melati, Kota Senja' (tambahan Claude), Motor_Kemudi titik putar setang, animasi_jalan(), cek.py --motor. Hasil: motor kotak-kotak; Claude sendiri menyarankan 'Buat bodi motor lebih membulat' -> F05b p_motor_bulat.txt.
- F05b bodi membulat (3 mnt 40 dtk): subdivision level 2 + shade smooth, sayap depan dipotong agar tak melewati ban, uji roda 13,66 m selisih 0,000003 rad; Claude jujur: blok mesin dan spion masih kotak. Hasil cukup (motor terlihat bebek).
