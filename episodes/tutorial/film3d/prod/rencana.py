# Rencana video "Vibe Coding Film Animasi 3D: Paket Terakhir Malam Ini".
# Narasi F02-F08 diambil dari naskah/A.md dan naskah/B.md (paragraf bernomor N[i]); visual ditentukan di sini.
# Bagian visual: R(src, a, b, crop) rekaman layar; ketik()/kerja() prompt Claude Code; A(nama, ...) adegan kanvas (adegan.js);
# G(png, ...) gambar hasil (lembar kontak) dengan tanda.
import json, os, re
F = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
RAW = F + "/raw"
REPO = "github.com/listyantidewi1/paket-terakhir"

def _narasi():
    out = []
    for x in "AB":
        kode = False
        for l in open(f"{F}/naskah/{x}.md", encoding="utf-8").read().split("\n"):
            if l.startswith("```"): kode = not kode; continue
            if kode or not l.strip() or l.startswith(("## ", "{{", "Layar:")): continue
            out.append(l.strip())
    return out
N = _narasi()

def R(src, a, b, crop="full", speed=1.0, maks=1.6, lab=None, **k): return dict(k="rek", src=src, a=a, b=b, crop=crop, speed=speed, maks=maks, lab=lab, **k)
def A(nama, min=4, bobot=1, s=None, **arg):
    d = dict(k="adegan", nama=nama, min=min, bobot=bobot, a=arg)
    if s is not None: d["s"] = s
    return d
def G(png, min=5, s=None, bobot=1, **arg): return A("gambar", min=min, s=s, bobot=bobot, bg=f"{RAW}/{png}", **arg)
def L(teks, label="PELAJARAN", min=5, **k): return A("pelajaran", min=min, teks=teks, label=label, **k)

AKHIR_KETIK = json.load(open(F + "/prod/ketik_akhir.json"))
def ketik(no, src, tanda, crop="termD", **k):
    """prompt diketik (kecepatan asli, paling cepat 2x bila narasi pendek), lalu dibekukan supaya terbaca.
    Label menyebut nomor prompt di PROMPT.md supaya penonton bisa menyalinnya."""
    b = AKHIR_KETIK[f"{src}:{tanda}"]
    k.setdefault("tahan", round(min(8.0, max(3.0, (b - 1) * 40 / 6 / 3.5 / 6)), 1))
    return R(src, tanda, b, crop, speed=1.0, maks=1.5, lab=f"Prompt {no}  ·  salin dari PROMPT.md di {REPO}", **k)
def kerja(src, tanda, jadi, crop="termD", maks=12, **k):
    a = AKHIR_KETIK[f"{src}:{tanda}"] + 0.3
    k.setdefault("tahan", 2.5); k.setdefault("lab", "AI bekerja · dipercepat")
    return R(src, a, jadi, crop, speed=4, maks=maks, **k)
def commit(src, a="mulai", b="akhir", **k):
    k.setdefault("lab", "Terminal: simpan dengan commit")
    return R(src, a, b, "termK", speed=1.0, maks=1.5, **k)

BAB = []
def bab(kode, judul, beats): BAB.append(dict(kode=kode, judul=judul, beats=beats))

# ---------------------------------------------------------------- F02
bab("F02", "Dari ide ke storyboard", [
 (N[0], [A("duaJalan", min=14, judul="Jangan langsung meminta filmnya",
            kiri=["Tanpa storyboard", "buatkan film animasi tentang kurir", "AI menebak semuanya. Hasilnya acak."],
            kanan=["Dengan storyboard", "tabel 8 shot: detik, gambar, kamera, suara", "AI mengikuti rencana kita."])]),
 (N[1], [R("F02a", "menu_terminal", "prompt_storyboard", "full", maks=2.5), ketik("2.1", "F02a", "prompt_storyboard", s=1)]),
 ("", [kerja("F02a", "prompt_storyboard", "storyboard_selesai")]),
 (N[2], [R("F02b", "buka_storyboard", "baca_akhir", "edit", maks=2.5)]),
 (N[3], [A("teks", min=12, judul="Tiga pemeriksaan storyboard", isi=["Satu shot, satu ide.", "Tanpa narasi, cerita harus terbaca dari gambar dan suara.", "Setiap lelucon harus benar-benar ada di layar."]),
         A("kartu", min=20, s=4, judul="Tiga lelucon yang hilang", warna="#ff6b6b", kartu=[
             ["Shot GPS", "GPS hanya \"mengarah ke jalan kecil\". Suara GPS dibuang.", "coral"],
             ["Shot kucing", "Kucing turun sendiri lalu lari.", "coral"],
             ["Shot pintu", "Wajah anak diterangi cahaya lilin.", "coral"]])]),
 (N[4], [L("AI tidak tahu mana yang lelucon, kalau kita tidak bilang.", sub="Tulis maksudnya, bukan hanya kejadiannya.", min=8)]),
 (N[5], [ketik("2.2", "F02c", "prompt_fix"), kerja("F02c", "prompt_fix", "fix_selesai"), R("F02c", "tabel_baru", "akhir", "edit", s=2, maks=1.2)]),
 (N[6], [R("F02d", "claude_md_baru", "tersimpan", "edit", speed=1.0, maks=1.3, lab=f"Ketik sendiri  ·  {REPO}/blob/main/CLAUDE.md", tahan=4)]),
 (N[7], [commit("F02d", "commit", "akhir")]),
])

# ---------------------------------------------------------------- F03
bab("F03", "Kerangka: kode yang membangun film", [
 (N[8], [A("flipbook", min=10)]),
 (N[9], [A("keyframe", min=14)]),
 (N[10], [A("alur", min=16, judul="Cara kerja proyek", sub="Film dibangun oleh kode, bukan disusun dengan mouse", mono=True, kotak=[
     ["bangun.py", "skrip Python yang ditulis Claude Code", "sky"], ["blender --background", "Blender menjalankan skrip tanpa membuka jendela", "amber"],
     ["film.blend", "seluruh film, bisa dibangun ulang kapan saja", "lime"], ["cek.py", "gambar kecil untuk diperiksa", "violet"]],
     cap="Ada yang salah? Perbaiki skripnya, lalu bangun ulang.")]),
 (N[11], [R("F03a", "exit", "prompt_kerangka", "termD", maks=1.5, lab="Terminal: /exit, lalu claude")]),
 (N[12], [ketik("3.1", "F03a", "prompt_kerangka")]),
 (N[13], [kerja("F03a", "prompt_kerangka", "kerangka_selesai", crop="termU", maks=14)]),
 (N[14], [A("teks", min=10, judul="film/waktu.py", sub=f"{REPO}/blob/main/film/waktu.py", warna="#60a5fa", isi=["frame = detik × 24", "Daftar shot menyalin tabel detik di storyboard.", "Tidak paham satu baris? Tanyakan: \"jelaskan baris ini\"."])]),
 (N[15], [R("F03b", "buka_lembar", "akhir", "edit", maks=1.2)]),
 (N[16], [R("F03c", 17, 40, "full", maks=1.5, lab="Blender: film.blend")]),
 (N[17], [R("F03d", "buka_gitignore", "gitignore_simpan", "edit", maks=1.3, lab="Ketik sendiri  ·  .gitignore"), commit("F03d", "git_add", "akhir", s=2)]),
])

# ---------------------------------------------------------------- F04
bab("F04", "Membangun kota yang basah oleh hujan", [
 (N[18], [A("kartu", min=22, judul="Empat istilah dasar Blender", kartu=[
     ["Scene", "Panggung tempat semua benda diletakkan.", "sky"], ["Kamera", "Mata penonton.", "teal"],
     ["Lampu", "Menentukan mana yang terang dan mana yang gelap.", "amber"], ["Mesh + material", "Mesh adalah bentuknya. Material adalah warna, kilap, dan cahayanya.", "violet"]])]),
 (N[19], [A("teks", min=16, judul="polyhaven.com", sub="Tekstur dan foto langit berlisensi CC0", warna="#2dd4bf", isi=["Tekstur: aspal, dinding, genteng, logam.", "CC0 = domain publik.", "Boleh dipakai, diubah, dan dimonetisasi tanpa izin."])]),
 (N[20], [R("F04a", "claude_continue", "prompt_aset", "termD", maks=1.3, lab="Terminal: claude --continue", tahan=2)]),
 (N[21], [ketik("4.1", "F04a", "prompt_aset"), kerja("F04a", "prompt_aset", "aset_pilihan", crop="termU")]),
 (N[22], [A("kartu", min=10, judul="Keputusan sutradara: langit yang mana?", serempak=True, h=420, kartu=[
     ["Jalan berbatu malam", "Ada gedung bergaya Eropa. Akan terpantul di setiap genangan.", "coral"], ["Lapangan gelap tanpa bangunan", "Langit malam yang bersih. Ini yang kita pilih.", "lime"]]),
          ketik("4.2", "F04b", "prompt_pilih", s=3)]),
 (N[23], [kerja("F04b", "prompt_pilih", "unduh_selesai"), R("F04b", "aset_md", "akhir", "edit", maks=1.2)]),
 (N[24], [ketik("4.3", "F04c", "prompt_kota"), kerja("F04c", "prompt_kota", "kota_selesai", crop="termU", maks=16, lab="AI bekerja · 22 menit dipercepat")]),
 (N[25], [R("F04d", "lembar_kota", "akhir", "edit", maks=1.0),
          A("teks", min=14, s=3, judul="Hasil pertama: yang masih kurang", warna="#ff6b6b", isi=["Ruko masih kotak polos.", "Terlalu gelap dan serba cokelat.", "Genangan seperti cermin besar.", "Lampu lalu lintas hanya titik merah."])]),
 (N[26], [ketik("4.4", "F04e", "prompt_genangan"), G("F04e_genangan.png", min=5, cap="Sesudah: genangan kecil tidak beraturan"),
          ketik("4.5", "F04e", "prompt_cahaya"), G("F04e_cahaya.png", min=5, cap="Sesudah: langit kebiruan, jendela hangat"),
          ketik("4.6", "F04e", "prompt_ruko"), G("F04e_ruko.png", min=5, cap="Sesudah: pintu gulung, papan nama, AC")]),
 (N[27], [ketik("4.7", "F04f", "prompt_rapikan"), kerja("F04f", "prompt_rapikan", "rapikan_selesai"), G("F04f_rapikan.png", min=5, cap="Setelah dirapikan")]),
 (N[28], [G("F04g_foto/kenanga_atas.png", min=5, cap="Jl. Kenanga", zoom=.06), G("F04g_foto/kali.png", min=5, cap="Kali di ujung jalan kecil", zoom=.06), G("F04g_foto/gang_atas.png", min=5, cap="Gang Melati", zoom=.06)]),
 (N[29], [A("kartu", min=16, judul="EEVEE atau Cycles?", serempak=True, h=420, kartu=[
     ["EEVEE", "Bekerja seperti mesin game. Sangat cepat, pantulan kurang nyata.", "sky"], ["Cycles", "Menghitung perjalanan cahaya. Lebih nyata, lebih lama. Ini yang kita pakai.", "amber"]])]),
 (N[30], [commit("F04h", "git_add", "akhir")]),
])

# ---------------------------------------------------------------- F05
bab("F05", "Kurir, motor, kucing, dan si kecil", [
 (N[31], [L("Wajah tidak ditampilkan.", label="KEPUTUSAN MANUSIA", warna="#ffb020", sub="Kurir selalu memakai helm dan ponco, kamera selalu di belakangnya.", min=12)]),
 (N[32], [ketik("5.1", "F05a", "prompt_motor"), kerja("F05a", "prompt_motor", "motor_selesai"), G("F05a_motor.png", min=6, s=5, cap="Hasil pertama: lengkap, tetapi kotak-kotak")]),
 (N[33], [ketik("5.2", "F05b", "prompt_motor_bulat"), G("F05b_motor.png", min=7, s=1, cap="Sesudah: bodi membulat")]),
 (N[34], [A("kartu", min=12, judul="Tiga lapisan kurir", serempak=True, h=380, kartu=[["Tubuh + tulang", "Bentuk dasar, tertutup jas hujan.", "sky"], ["Helm", "Putih, kaca gelap.", "teal"], ["Ponco", "Kuning, basah.", "amber"]]),
          A("teks", min=4, s=3, judul="Prompt 5.3 · Kurir Mas Adit", sub=f"Salin dari PROMPT.md di {REPO}", isi=["Tubuh dengan armature, helm full face, ponco kuning.", "Pose: duduk, menoleh, turun, berdiri."])]),
 (N[35], [R("F05d", 600, 3700, "termU", speed=60, maks=120, lab="AI bekerja · 1 jam dipercepat"),
          L("AI bisa terjebak menyempurnakan satu angka.", label="PELAJARAN 1", sub="Manusia yang memutuskan kapan sudah cukup. Tekan Esc.", min=10, s=4)]),
 (N[36], [ketik("5.3b", "F05e", "prompt_kurir_cukup"), kerja("F05e", "prompt_kurir_cukup", "kurir_selesai"), G("F05e_kurir.png", min=5, s=2, cap="Kurir Mas Adit di atas motornya"), commit("F05f", s=3)]),
 (N[37], [ketik("5.4", "F05g", "prompt_gerak"), kerja("F05g", "prompt_gerak", "gerak_selesai"), G("F05g_lembar.png", min=5, cap="Shot 1: motor melaju menjauh")]),
 (N[38], [ketik("5.5", "F05_kucing", "prompt_kucing"), kerja("F05_kucing", "prompt_kucing", "kucing_selesai", maks=14, lab="AI bekerja · 28 menit dipercepat")]),
 (N[39], [G("F05_kucing_lembar.png", min=8, cap="Shot 3: ponco menggembung saat kurir berjalan", warna="#ff6b6b")]),
 (N[40], [ketik("5.6", "F05_ponco_jalan", "prompt_ponco_jalan"), G("F05_ponco_jalan_lembar.png", min=6, s=1, cap="Masih gagal: ponco lepas dari badan", warna="#ff6b6b")]),
 (N[41], [L("Kalau perbaikan kedua masih gagal, ganti caranya.", label="PELAJARAN 2", min=9),
          ketik("5.7", "F05_ponco_tulang", "prompt_ponco_tulang", s=3), G("F05_ponco_tulang_lembar.png", min=5, s=5, cap="Ponco mengikuti tulang: menggantung wajar")]),
 (N[42], [ketik("5.8", "F05_hp", "prompt_hp"), kerja("F05_hp", "prompt_hp", "hp_selesai"), G("F05_hp_hp.png", min=6, s=2, cap="Layar HP dibuat dengan kode, tanpa merek")]),
 (N[43], [ketik("5.9", "F05_pintu", "prompt_pintu"), kerja("F05_pintu", "prompt_pintu", "pintu_selesai", maks=14, lab="AI bekerja · 36 menit dipercepat"),
          G("F05_pintu_lembar.png", min=10, s=1, cap="Hasil pertama adegan pintu: buruk", warna="#ff6b6b")]),
 (N[44], [ketik("5.10", "F05_pintu_bingkai", "prompt_pintu_bingkai"), G("F05_pintu_bingkai_lembar.png", min=5, cap="Langkah 1: bingkai"),
          ketik("5.11", "F05_siluet", "prompt_siluet", s=2), G("F05_siluet_lembar.png", min=7, cap="Langkah 2: anak menjadi siluet, kue tetap terang")]),
 (N[45], [commit("F05j")]),
])

# ---------------------------------------------------------------- F06
bab("F06", "Kamera sinematik", [
 (N[46], [G("F05g_lembar.png", min=8, cap="Kamera rendah dekat genangan, naik pelan saat motor lewat"),
          A("teks", min=6, s=3, judul="Empat alat kamera", sub="Dipakai pembuat film sungguhan", isi=["Lensa", "Gerakan kamera", "Fokus kabur (depth of field)", "Motion blur"], cepat=True)]),
 (N[47], [A("kartu", min=40, judul="Empat alat kamera", kartu=[
     ["Lensa", "Lebar (24 mm): memperkenalkan tempat. Lebih panjang: mendekatkan satu benda, menunjukkan perasaan.", "sky"],
     ["Gerakan kamera", "Naik pelan, mengikuti dari belakang, atau mendekat perlahan.", "teal"],
     ["Fokus kabur", "Depth of field: benda penting tajam, latar kabur. Mata penonton tahu harus melihat ke mana.", "violet"],
     ["Motion blur", "Benda yang bergerak cepat sedikit kabur. Tanpa ini, roda dan hujan terlihat patah-patah.", "amber"]])]),
 (N[48], [L("Saat ada lelucon, kamera diam.", label="ATURAN KOMEDI", warna="#ffb020", sub="Kamera yang diam membuat penonton memperhatikan waktu dan reaksi.", min=10)]),
 (N[49], [ketik("6.1", "F06a", "prompt_kamera")]),
 (N[50], [R("F06a", 900, 2370, "termU", speed=40, maks=120, lab="Gambar cek macet · dipercepat"),
          A("teks", min=6, s=3, judul="Prompt 6.2 · Gambar cek yang cepat", sub=f"Salin dari PROMPT.md di {REPO}", warna="#60a5fa", isi=["Motion blur dan fokus kabur hanya untuk render akhir.", "Saat memeriksa: satu gambar per shot."])]),
 (N[51], [R("F06c", 600, 2430, "termU", speed=60, maks=150, lab="AI bekerja · 55 menit dipercepat"),
          L("Sederhanakan rancangannya.", label="PELAJARAN 3", sub="Jangan mengoptimalkan hal yang bisa dibuang.", min=9, s=4),
          ketik("6.3", "F06d", "prompt_tanpa_simulasi", s=6), G("F06d_lembar.png", min=5, s=8, cap="Delapan shot keluar dengan cepat")]),
 (N[52], [G("F06d_lembar.png", min=9, cap="Shot 2: kamera di dalam bahu. Shot 5: label gelap dan datar.", warna="#ff6b6b"),
          ketik("6.4", "F06f", "prompt_kamera_fix", s=3), G("F06f_lembar.png", min=4, s=4, cap="Label shot 5 membaik")]),
 (N[53], [G("F06f_lembar.png", min=7, cap="Percobaan 2: kamera di depan kurir", warna="#ff6b6b"), ketik("6.5", "F06g", "prompt_kamera_fix2", s=2),
          G("F06g_lembar.png", min=7, s=3, cap="Percobaan 3: badan menutupi HP dan jalan", warna="#ff6b6b")]),
 (N[54], [L("Kadang storyboard-nya yang harus diubah, bukan kodenya.", label="KEPUTUSAN SUTRADARA", warna="#ffb020", min=10),
          A("kartu", min=16, s=4, judul="Shot 2 dipotong menjadi tiga sudut", kartu=[["Close-up HP", "Panah dan tulisan \"Belok kanan\".", "sky"], ["Seberang kali", "Kamera diam. Motor berbelok dan mengerem di bibir beton.", "teal"], ["Pergi ke kiri", "Kamera yang sama. Kali tetap di gambar.", "amber"]]),
          ketik("6.6", "F06h", "prompt_shot2_potong", s=8), G("F08c_poles_lembar.png", min=5, s=9, cap="Shot 2 akhirnya bercerita dengan jelas"), commit("F06i", "commit", "akhir")]),
 (N[55], [A("teks", min=8, judul="Versi tegak untuk Short", sub="1080 × 1920", warna="#a78bfa", isi=["Gambar yang bagus di bingkai lebar belum tentu bagus di bingkai tegak."])]),
 (N[56], [ketik("6.7", "F06j_tegak", "prompt_tegak"), kerja("F06j_tegak", "prompt_tegak", "tegak_selesai"), G("F06j_tegak_lembar.png", min=7, s=2, cap="Versi tegak: benda penting di tengah dan utuh")]),
 (N[57], [commit("F06k", "commit", "akhir")]),
])

# ---------------------------------------------------------------- F07
bab("F07", "Suara, teks, dan sinkron", [
 (N[58], [A("kartu", min=20, judul="Tiga lapisan suara", sub="Film tanpa narasi", kartu=[["Suasana", "Hujan dan gemuruh kali.", "sky"], ["Efek suara", "Mesin motor, rem, ketukan pintu, kucing.", "teal"], ["Dua kalimat", "Suara GPS dan suara anak.", "amber"]])]),
 (N[59], [R("F02c", "tabel_baru", "akhir", "edit", maks=1.0, lab="STORYBOARD.md: kolom Suara")]),
 (N[60], [ketik("7.1", "F07a_sfx", "prompt_sfx"), kerja("F07a_sfx", "prompt_sfx", "sfx_selesai", crop="termU")]),
 (N[61], [A("teks", min=12, judul="Dengarkan dengan jujur", warna="#ffb020", isi=["Suara buatan kode tidak selalu sebagus suara sungguhan.", "Kurang meyakinkan? Rekam sendiri dengan HP.", "Simpan di folder suara/ dengan nama file yang sama."])]),
 (N[62], [A("kartu", min=22, judul="Dua kalimat di film", serempak=True, h=460, kartu=[["Rekam suaramu sendiri", "HP, ruangan tenang, satu file per kalimat. Suara anggota keluarga dengan izin mereka.", "teal"], ["Suara buatan", "Layanan teks menjadi suara. Baca aturan pemakaiannya untuk video yang dimonetisasi.", "violet"]])]),
 (N[63], [ketik("7.2", "F07b_sinkron", "prompt_sinkron"), kerja("F07b_sinkron", "prompt_sinkron", "sinkron_selesai-30", crop="termU")]),
 (N[64], [R("F07b_sinkron", "sinkron_selesai-6", "sinkron_selesai", "termU", maks=1.0, lab="Laporan Claude: hal yang perlu Anda putuskan")]),
 (N[65], [commit("F07c", "commit", "akhir")]),
])

# ---------------------------------------------------------------- F08 (bagian pertama; uji dan render di laptop menyusul)
bab("F08", "Render menjadi MP4", [
 (N[66], [A("teks", min=14, judul="Render", sub="Blender menghitung perjalanan cahaya untuk setiap titik gambar", isi=["Gambar cek: 480p, cepat, berbintik.", "Render akhir: 1080p, bersih, lama.", "1.800 gambar: pekerjaan untuk kartu grafis."])]),
 (N[67], [ketik("8.1", "F08a_render", "prompt_render"), kerja("F08a_render", "prompt_render", "render_selesai", crop="termU"),
          A("teks", min=14, s=2, judul="render.py", sub=f"{REPO}/blob/main/render.py", warna="#60a5fa", isi=["Memakai kartu grafis, dan menulis perangkat yang dipakai.", "Hemat memori untuk kartu grafis 4 GB.", "Satu file per gambar. Gambar yang sudah ada dilewati."])]),
 (N[68], [G("F06h_lembar.png", min=8, cap="Sebelum poles: motor di shot 2 terlalu kecil", warna="#ff6b6b"), ketik("8.2", "F08c_poles", "prompt_poles", s=3),
          kerja("F08c_poles", "prompt_poles", "poles_selesai", maks=14, lab="AI bekerja · 30 menit dipercepat"), G("F08c_poles_lembar.png", min=10, s=6, cap="Sesudah poles"), commit("F08d", "commit", "akhir")]),
])
