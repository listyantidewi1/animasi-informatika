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

# ---------------------------------------------------------------- F01 (semua layar digambar dengan kode: siap.js)
BL = "C:\\Program Files\\Blender Foundation\\Blender 5.3"
def _term(baris, **k): return A("terminal", baris=[dict(cmd=b[0], out=list(b[1:])) for b in baris], **k)
_GALAT = [["blender : The term 'blender' is not recognized as the name of a cmdlet...", "Tutup terminal, lalu buka terminal baru. Periksa Path: isinya harus folder, bukan file blender.exe."],
          ["...cannot be loaded because running scripts is disabled on this system.", "Jalankan satu kali, lalu ketik Y:", "Set-ExecutionPolicy -Scope CurrentUser RemoteSigned"],
          ["ffmpeg : The term 'ffmpeg' is not recognized as the name of a cmdlet...", "Penyebabnya sama dengan nomor 1: buka terminal baru."]]
def _galat(n, **k): return A("galat", kartu=_GALAT, wkt=[-9 if i < n - 1 else .3 if i == n - 1 else 1e9 for i in range(3)], **k)
bab("F01", "Persiapan: memasang alat", [
 ("Kita membutuhkan lima alat. Blender adalah tempat film kita dibangun dan dirender. Git menyimpan riwayat pekerjaan. VS Code adalah tempat kita membuka dan membaca kode. FFmpeg menggabungkan gambar, suara, dan teks menjadi video. Terakhir, Claude Code adalah asisten AI yang menulis kodenya. Saya memakai Windows, dan untuk macOS serta Linux, langkahnya ada di README repositori. Kita juga memakai tekstur dan langit malam dari Poly Haven, tetapi aset itu tidak perlu dipasang, karena skrip kita akan mengunduhnya sendiri.",
  [A("alat", min=20), A("teks", s=6, min=10, judul="Windows, macOS, dan Linux", sub=REPO, isi=["Video ini memakai Windows.", "Langkah untuk macOS dan Linux ada di README repositori.", "Tekstur dan langit malam Poly Haven diunduh sendiri oleh skrip."])]),
 ("Kita mulai dari Blender. Buka browser, lalu ketik alamat blender.org. Klik Download, lalu unduh versi untuk Windows. Buka file installernya, klik Next sampai selesai, lalu buka Blender sekali dari menu Start untuk memastikan Blender bisa berjalan. Di video ini, saya memakai Blender versi lima koma tiga.",
  [A("alat", min=2.5, aktif=0, wkt=[0, 0, 0, 0, 0]),
   A("situs", s=1, min=10, url="blender.org", merek="Blender", judulHal="Download Blender", ket="Gratis dan open source", tombol="Download Blender 5.3 untuk Windows", sub="Windows Installer  ·  .msi"),
   A("pasang", s=3, min=9, judul="Blender Setup", kepala="Memasang Blender", teks="Klik Next sampai selesai, lalu buka Blender sekali dari menu Start.", akhir=True, cap="Saya memakai Blender 5.3")]),
 ("Supaya Claude Code bisa menjalankan Blender dari terminal, terminal harus tahu letak Blender. Buka File Explorer, masuk ke C, Program Files, Blender Foundation, lalu buka folder Blender yang ada nomor versinya. Di dalamnya ada file blender dot exe. Salin alamat folder ini dari kolom alamat di bagian atas.",
  [A("explorer", min=10, path=BL, isi=[["5.3", "folder"], ["blender.exe", "file"], ["blender-launcher.exe", "file"], ["license", "folder"]], cap="C:  >  Program Files  >  Blender Foundation  >  Blender 5.3"),
   A("explorer", s=2, min=8, path=BL, isi=[["5.3", "folder"], ["blender.exe", "file"], ["blender-launcher.exe", "file"], ["license", "folder"]], sorot=1, tsorot=0.3, salin=True, denyut=False, cap="Salin alamat FOLDER, bukan file blender.exe")]),
 ("Sekarang buka menu Start, lalu ketik environment. Pilih Edit environment variables for your account. Di jendela yang muncul, klik baris Path, lalu klik Edit. Klik New, tempel alamat folder Blender tadi, lalu klik OK dua kali. Mulai sekarang, terminal baru akan mengenali perintah blender.",
  [A("start", min=8, ketik="environment", hasil="Edit environment variables for your account"),
   A("envpath", s=2, min=6, langkah=0, cap="Klik baris Path, lalu klik Edit"),
   A("envpath", s=3, min=10, langkah=1, alamat=BL, cap="New, tempel alamat folder Blender, lalu OK dua kali")]),
 ("Kita periksa hasilnya. Buka menu Start, ketik terminal, lalu buka aplikasi Terminal. Ketik blender spasi minus minus version, lalu tekan Enter. Kalau muncul tulisan Blender dengan nomor versinya, langkah ini berhasil.",
  [A("start", min=7, ketik="terminal", hasil="Terminal", jenis="App"),
   _term([["blender --version", "Blender 5.3.0"]], s=2, min=9, cap="Muncul nomor versi, berarti berhasil")]),
 ("Alat kedua adalah Git. Buka git-scm.com, unduh installer untuk Windows, lalu klik Next sampai selesai. Setelah itu, tutup terminal yang lama dan buka terminal baru, supaya terminal mengenali alat yang baru dipasang. Periksa dengan perintah git spasi minus minus version. Lalu, kenalkan dirimu ke Git dengan dua perintah ini, supaya setiap commit tercatat atas namamu.",
  [A("situs", min=10, url="git-scm.com", merek="Git", judulHal="Download for Windows", ket="Unduh installer, lalu klik Next sampai selesai.", tombol="Git for Windows Setup", nav=["About", "Download", "Docs"], warna="#dc5a35"),
   _term([["git --version", "git version 2.52.0.windows.1"], ['git config --global user.name "Nama Kamu"'], ['git config --global user.email "email@kamu.com"']], s=2, min=20, kepala="Terminal BARU", cap="Ganti dengan nama dan email kamu sendiri. Nomor versi boleh berbeda.")]),
 ("Alat ketiga adalah VS Code. Buka code.visualstudio.com, lalu unduh dan jalankan installernya. Di salah satu langkah, ada beberapa kotak pilihan. Centang Add to PATH dan Open with Code, karena dua pilihan ini memudahkan kita membuka folder proyek nanti.",
  [A("situs", min=9, url="code.visualstudio.com", merek="VS Code", judulHal="Code editing. Redefined.", ket="Unduh, lalu jalankan installernya.", tombol="Download for Windows", nav=["Docs", "Download", "Updates"], warna="#0b6cbd"),
   A("pasang", s=2, min=10, judul="Setup - VS Code", kepala="Select Additional Tasks", opsi=[["Create a desktop icon", 0], ['Add "Open with Code" action to file context menu', 1], ['Add "Open with Code" action to directory context menu', 1], ["Register Code as an editor for supported file types", 0], ["Add to PATH (requires shell restart)", 1]])]),
 ("Alat keempat adalah FFmpeg. FFmpeg tidak punya installer biasa, jadi kita memakai winget, yaitu pemasang aplikasi bawaan Windows. Ketik perintah ini, lalu tunggu sampai selesai. Setelah itu, tutup terminal dan buka lagi, lalu periksa dengan ffmpeg spasi minus version.",
  [A("alat", min=2.5, aktif=3, wkt=[0, 0, 0, 0, 0]),
   _term([["winget install --id Gyan.FFmpeg -e", "Found FFmpeg [Gyan.FFmpeg]", "Downloading...", ["Successfully installed", "#a3e635"]]], s=2, min=9, cap="winget = pemasang aplikasi bawaan Windows"),
   _term([["ffmpeg -version", "ffmpeg version 8.0-full_build-www.gyan.dev"]], s=3, min=7, kepala="Terminal BARU", cap="Satu tanda minus saja: ffmpeg -version")]),
 ("Alat kelima adalah Claude Code. Perintah pemasangannya ada di situs resminya, code.claude.com. Di Windows, salin perintah ini ke terminal, lalu tekan Enter. Setelah selesai, buka terminal baru dan periksa dengan claude spasi minus minus version.",
  [A("situs", min=9, url="code.claude.com", merek="Claude Code", judulHal="Pasang Claude Code", ket="Perintah pemasangan untuk Windows (PowerShell):", tombol="irm https://claude.ai/install.ps1 | iex", menu=False, nav=["Docs", "Setup", "Help"], warna="#1e293b"),
   _term([["irm https://claude.ai/install.ps1 | iex", "Installing Claude Code...", ["Installation complete!", "#a3e635"]]], s=2, min=9, cap="Salin dari situs resminya, lalu tekan Enter"),
   _term([["claude --version", "2.1.0 (Claude Code)"]], s=3, min=7, kepala="Terminal BARU", cap="Nomor versi boleh berbeda")]),
 ("Sekarang kita login. Ketik claude, lalu tekan Enter. Claude Code akan menanyakan cara login. Pilih login dengan akun Claude, lalu browser akan terbuka. Klik tombol untuk mengizinkan, kembali ke terminal, dan Claude Code siap dipakai. Ketik garis miring exit untuk keluar dulu.",
  [_term([["claude", "Select login method:", ["❯ 1. Claude account with subscription", "#fff"], "  2. Anthropic Console account"]], min=12, cap="Pilih login dengan akun Claude"),
   A("situs", s=4, min=7, url="claude.ai", langsung=True, merek="Claude", judulHal="Izinkan Claude Code?", ket="Claude Code meminta izin memakai akunmu.", tombol="Authorize", menu=False, nav=["", "", ""], warna="#c2410c"),
   A("terminal", s=5, min=5, prompt="> ", judul="Terminal  ·  claude", baris=[dict(cmd="/exit", out=[])], cap="Ketik /exit untuk keluar dulu")]),
 ("Terakhir, kita membuat folder proyek. Buka File Explorer, masuk ke folder Documents, lalu buat folder baru bernama paket-terakhir. Klik kanan folder itu, lalu pilih Open with Code. Di VS Code, buka menu Terminal, lalu pilih New Terminal. Panel terminal akan muncul di bagian bawah, dan inilah tempat kita bekerja sepanjang video. Ketik git spasi init untuk mulai mencatat riwayat proyek.",
  [A("explorer", min=9, path="C:\\Users\\kamu\\Documents", isi=[["paket-terakhir", "folder"]], sorot=0, baru=0, denyut=False, cap="Folder baru: paket-terakhir"),
   A("explorer", s=2, min=6, path="C:\\Users\\kamu\\Documents", isi=[["paket-terakhir", "folder"]], sorot=0, tsorot=0, tmenu=0.6, menu=["Open", "Open in Terminal", "Open with Code", "Copy as path", "Properties"], menuSorot=2, cap="Klik kanan, lalu Open with Code"),
   A("editor", s=3, min=16, folder="paket-terakhir", cmd="git init", out="Initialized empty Git repository in .../paket-terakhir/.git/", cap="Menu Terminal  >  New Terminal")]),
 ("Ada tiga error yang paling sering muncul di tahap ini. Pertama, terminal bilang perintah tidak dikenali, misalnya \"blender is not recognized\". Biasanya, terminal itu dibuka sebelum alatnya terpasang atau sebelum Path diubah, jadi tutup terminal dan buka yang baru. Kalau masih gagal, periksa lagi apakah alamat yang kamu tempel di Path adalah folder, bukan file blender dot exe. Kedua, PowerShell menolak menjalankan skrip dengan pesan \"running scripts is disabled\". Untuk mengatasinya, jalankan perintah ini satu kali, lalu ketik Y. Ketiga, FFmpeg tidak ditemukan padahal winget sudah selesai. Penyebabnya sama dengan error pertama, jadi buka terminal baru.",
  [_galat(1, min=20), _galat(2, s=4, min=9), _galat(3, s=6, min=7)]),
 ("Kalau kelima alat sudah memberi nomor versi, persiapan kita selesai.",
  [A("alat", min=8, cek=True, judul="Kelima alat sudah memberi nomor versi")]),
])

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

# ================================================================ naskah sisa (tab "Naskah sisa (27 Nov)", disalin ke naskah/C.md)
def _narasi_c():
    out, cur = {}, None
    for l in open(f"{F}/naskah/C.md", encoding="utf-8").read().split("\n"):
        if l.startswith("## "): cur = l[3:6]; out[cur] = []; continue
        if cur and l.strip() and not l.startswith("Layar:"): out[cur].append(l.strip())
    return out
NC = _narasi_c()
def FILM(a, b, versi="film_v3", **k):
    """potongan film jadi: utuh 1920x1080, kecepatan asli; vol = suara film di bawah narasi"""
    k.setdefault("speed", 1.0); k.setdefault("maks", k["speed"]); k.setdefault("utuh", True)
    return R(versi, a, b, "film", **k)
def lanjut(src, b, crop="termU", maks=40, **k):
    """lanjutan rekaman AI bekerja (rekaman dimulai dari tanda tunggu)"""
    k.setdefault("lab", "AI bekerja · dipercepat")
    return R(src, "tunggu", b, crop, speed=4, maks=maks, **k)
def bab_tambah(kode, beats): next(b for b in BAB if b["kode"] == kode)["beats"].extend(beats)

# ---------------------------------------------------------------- F00 (tanpa kartu bab; dipindah ke depan)
c = NC["F00"]
HOOK = "Setelah menonton, kamu bisa membuat film animasi 3D pendek di Blender bersama AI, dan tahu cara memeriksa hasilnya sebelum diunggah."
_KARTU0 = [
     ["Butuh apa", "Laptop atau komputer: Windows, macOS, atau Linux. Kartu grafis membuat render jauh lebih cepat.", "sky"],
     ["Biaya", "Blender gratis. Tekstur Poly Haven CC0. Claude Code: langganan, paket termurah cukup.", "teal"],
     ["Waktu render", "RTX 3050, memori 4 GB: ±32 jam untuk 1.800 frame. Tanpa kartu grafis: turunkan kualitas.", "amber"]]
bab("F00", "Kait dan pembuka", [
 (c[0], [FILM(0.0, 6.6, vol=.35, besar="Film ini dibuat oleh manusia dan AI."), FILM("s2+3", "s2+12.5", vol=.35, s=1)]),
 (c[1], [G("F05_pintu_lembar.png", min=4, cap="Ponco menggembung menutupi layar", warna="#ff6b6b"),
         G("F06d_lembar.png", min=4, s=1, cap="Kamera terselip di dalam bahu kurir", warna="#ff6b6b", tanda=[dict(x=.375, y=.25, r=.11, k="salah", dari=.15)])]),
 (c[2], [FILM("s3+1", "s3+12", vol=.3), A("daftar", min=14, s=1)]),
 (c[3], [L("Masih ada kesalahan yang lolos.", label="SETELAH 32 JAM RENDER", warna="#ff6b6b", bg=f"{RAW}/film_t29.png", sub="Di bab 9 kita belajar cara menangkapnya.", min=9)]),
 ("", [A("judul", min=6, judul="Film Animasi 3D dari Nol\nbersama Claude Code dan Blender", hook=HOOK, bg=f"{RAW}/film_t72.5.png")]),
 (c[4], [A("judul", min=5, judul="Paket Terakhir Malam Ini", hook="Film pendek 75 detik, tanpa narasi.", bg=f"{RAW}/film_t1.5.png")]),
 ("", [FILM(0.0, "akhir", vol=1.0, utuh=True, tahan=1.5)]),
 (c[5], [A("kartu", min=10, serempak=True, sorot=0, h=470, judul="Sebelum mulai", kartu=_KARTU0),
         A("kartu", min=8, s=2, serempak=True, sorot=2, h=470, judul="Sebelum mulai", kartu=_KARTU0)]),
 (c[6], [A("kartu", min=10, serempak=True, sorot=1, h=470, judul="Sebelum mulai", kartu=_KARTU0),
         A("teks", min=6, s=3, judul="Semua prompt dan kode", sub=REPO, warna="#60a5fa", isi=["PROMPT.md: setiap prompt di video ini, termasuk yang gagal.", "Link ada di deskripsi."])]),
 (c[7], [A("siklus", min=16)]),
])

# ---------------------------------------------------------------- F08 lanjutan: render di laptop
c = NC["F08"]
PS = "PS C:\\Users\\kamu\\Documents\\paket-terakhir> "
bab_tambah("F08", [
 (c[0], [A("kartu", min=16, serempak=True, h=440, judul="Bake sebelum render?", kartu=[
     ["Ponco", "Dulu memakai simulasi kain (bab 6). Sekarang ikut tulang kurir, jadi tidak perlu bake.", "amber"],
     ["Cipratan roda", "Satu-satunya simulasi. render.py menghitungnya sekali secara otomatis, lalu menyimpannya.", "sky"]])]),
 (c[1], [A("terminal", min=14, prompt=PS, judul="Terminal  ·  laptop dengan kartu grafis", size=28, baris=[
     dict(cmd="foreach ($f in 300, 700, 1200, 1400) { blender -b -P render.py -- --frame $f }", out=[
         ["[render] perangkat: OPTIX - NVIDIA GeForce RTX 3050 Laptop GPU", "#ffb020"], "[render] 1920x1080, 128 sampel, denoiser OPTIX ...",
         "[render] shot 2 frame  300 (1/1): ...", "[render] shot 3 frame  700 (1/1): ...", "[render] shot 6 frame 1200 (1/1): ...", "[render] shot 7 frame 1400 (1/1): ..."])],
     cap="Empat frame uji: memakai kartu grafis? Berapa lama satu frame?")]),
 (c[2], [A("terminal", min=8, prompt=PS, judul="Terminal  ·  render seluruh film", size=28, baris=[
     dict(cmd="blender -b -P render.py -- --shot 1 --sampel 64", out=["[render] perangkat: OPTIX - NVIDIA GeForce RTX 3050 Laptop GPU", ["System is out of GPU memory", "#ff6b6b"]])],
     cap="Shot 1: pemandangan kota, terlalu banyak benda untuk memori 4 GB"),
         A("terminal", min=8, s=3, prompt=PS, judul="Terminal  ·  render seluruh film", size=28, baris=[
     dict(cmd="foreach ($s in 2, 3, 4, 5, 6, 7, 8, 1) { blender -b -P render.py -- --shot $s }", out=[["... shot 1 dirender paling akhir: berhasil", "#a3e635"]])],
     cap="Shot 1 dipindah ke urutan terakhir")]),
 (c[3], [A("batang", min=16, judul="Waktu render per frame (render pertama)", sub="Laptop RTX 3050, memori 4 GB", rata=65, maks=110,
           data=[["S1", 52, "amber"], ["S2", 42, "amber"], ["S3", 55, "amber"], ["S4", 50, "amber"], ["S5", 61, "amber"], ["S6", 88, "violet"], ["S7", 94, "violet"], ["S8", 83, "violet"]],
           legenda=[["64 sampel", "amber"], ["128 sampel", "violet"]], cap="1.800 frame × ±65 detik ≈ 32 jam"),
         A("teks", min=7, s=3, judul="Render terhenti? Jalankan lagi.", warna="#2dd4bf", isi=["Terhenti enam kali.", "render.py melewati frame yang sudah ada, lalu meneruskan dari frame yang belum ada."])]),
 (c[4], [A("teks", min=14, judul="Komputer lebih lambat?", isi=["Turunkan jumlah sampel: denoising merapikan sisa bintik.", "Render di malam hari, laptop dicolokkan ke listrik.", "Render satu shot dulu, periksa, baru seluruh film."])]),
 (c[5], [A("terminal", min=6, prompt=PS, judul="Terminal", size=30, baris=[dict(cmd="python gabung.py", out=["[gabung] 1800 frame + film.wav + film.srt -> film_lebar.mp4"])]),
         FILM("s1", "s1+7", vol=.5, s=1)]),
 (c[6], [L("Jangan diunggah dulu.", label="SATU LANGKAH LAGI", warna="#ff6b6b", bg=f"{RAW}/film_t72.5.png", min=6)]),
])

# ---------------------------------------------------------------- F09 Cek kerjaan AI
c = NC["F09"]
bab("F09", "Cek kerjaan AI", [
 (c[0], [FILM("s2+3", "s2+12", vol=.3, besar="Kelihatannya sudah benar. Benarkah?", besar_dari=.4),
         G("F09_v1_tembok.png", min=6, s=1, cap="Kurir dan motor menembus sudut tembok kali", warna="#ff6b6b", tanda=[dict(x=.37, y=.5, r=.06, k="salah", dari=.1)]),
         G("F09_v1_gang.png", min=6, s=3, cap="Motor menembus tanaman, anak menembus pintu", warna="#ff6b6b", tanda=[dict(x=.15, y=.74, r=.09, k="salah", dari=.1), dict(x=.79, y=.5, r=.07, k="salah", dari=.4)]),
         G("cek-jalan-basah.png", min=3, s=4, cap="Jalan terlalu kering untuk hujan sederas itu", warna="#ff6b6b")]),
 (c[1], [G("F09_cek_perbaikan.png", min=9, cap="Versi 2 setelah perbaikan", warna="#a3e635"),
         A("teks", min=5, s=2, judul="Render kedua", warna="#ffb020", isi=["Gerakan berubah, jadi seluruh film dirender ulang.", "±34 jam."])]),
 (c[2], [L("Mata bisa lelah. Skrip tidak.", label="PELAJARAN", min=8), A("teks", min=6, s=2, judul="Kesalahan satu atau dua frame", warna="#ff6b6b", isi=["Tidak terlihat saat menonton sekali.", "Terlihat saat penonton menjeda video."])]),
 (c[3], [ketik("9.1", "F09a_periksa", "prompt_periksa"),
         A("kartu", min=16, s=1, judul="periksa.py: empat pemeriksaan", kartu=[
             ["Tembus", "Membaca bentuk setiap benda di film.blend, mencari benda bergerak yang masuk ke benda lain.", "coral"],
             ["Roda", "Jarak tempuh motor dibandingkan dengan putaran rodanya.", "sky"],
             ["Lompatan", "Setiap frame video dibandingkan dengan frame sebelumnya.", "violet"],
             ["Lembar kontak", "Satu gambar kecil setiap setengah detik.", "teal"]])]),
 (c[4], [R("F09a_periksa", "prompt_periksa-5", "prompt_periksa", "termD", maks=1.0, lab="Kalimat terakhir prompt 9.1", tahan=3),
         L("Uji pemeriksanya dulu pada kesalahan yang sudah kita ketahui.", label="PEMERIKSA YANG BAIK", warna="#ffb020", s=1, min=8)]),
 (c[5], [kerja("F09a_periksa", "prompt_periksa", "periksa_selesai", crop="termU", maks=400, lab="AI bekerja · 1 jam dipercepat", tahan=0),
         lanjut("F09c_periksa", "periksa_selesai-2", maks=400, lab="AI bekerja · 1 jam dipercepat", tahan=0),
         R("F09c_periksa", "periksa_selesai-1", "periksa_selesai", "termU", maks=1.0, lab="Laporan Claude: tembus kecil yang wajar", s=1),
         A("teks", min=8, s=3, judul="Membaca laporan tetap tugas kita", warna="#2dd4bf", isi=["Jok masuk sedikit ke ponco: wajar, kurir duduk di jok.", "Tidak semua temuan adalah kesalahan."])]),
 (c[6], [R("F09c_periksa", "periksa_selesai-1", "periksa_selesai", "termM", maks=1.0, lab="Laporan Claude: lompatan"),
         FILM(6.2, 7.8, versi="film_v2", s=3, lab="Kecepatan normal"),
         FILM(6.85, 7.2, versi="film_v2", speed=.1, maks=.1, lab="Diperlambat 10×"),
         G("film_v2_f169.png", min=5, s=4, cap="Frame 169: tulisan di layar HP dobel", warna="#ff6b6b", tanda=[dict(x=.5, y=.61, r=.15, ry=1.1, k="salah", dari=.1)])]),
 (c[7], [R("F09d_blur", 395, 405, "termM", maks=1.0, lab="Claude membuktikan penyebabnya"),
         A("rana", min=12, s=1), A("rana", min=10, s=4, benar=True)]),
 (c[8], [ketik("9.2", "F09d_blur", "prompt_blur"),
         A("teks", min=10, s=1, judul="Cara meminta perbaikan", warna="#2dd4bf", isi=["Sebut nomor frame dan apa yang terlihat salah.", "Minta bukti penyebab dengan angka.", "Minta daftar frame yang harus dirender ulang.", "Jelaskan temuan mana yang bukan kesalahan."]),
         kerja("F09d_blur", "prompt_blur", "blur_selesai", crop="termU", maks=400, lab="AI bekerja · 72 menit dipercepat", tahan=0),
         lanjut("F09e_blur", "blur_selesai", crop="termU", maks=400, lab="AI bekerja · 72 menit dipercepat", tahan=0),
         lanjut("F09f_blur", "blur_selesai", crop="termU", maks=400, lab="AI bekerja · 72 menit dipercepat")]),
 (c[9], [A("teks", min=9, judul="Render ulang: hanya 24 frame", warna="#a3e635", isi=["Daftar frame dari cek/render_ulang.txt.", "PNG lama dipindahkan, render.py merender yang hilang.", "24 frame dalam 27 menit, lalu gabung.py."]),
         ketik("9.3", "F09h_ulang", "prompt_ulang", s=1), kerja("F09h_ulang", "prompt_ulang", "ulang_selesai", crop="termU", maks=30, tahan=0),
         G("F09_ss_hp.png", min=5, cap="Kiri: sebelum. Kanan: sesudah. Frame 169 dan 240."), G("F09_ss_label.png", min=5, cap="Kiri: sebelum. Kanan: sesudah. Frame 961 dan 1152.")]),
 (c[10], [A("teks", min=18, judul="Daftar periksa sebelum unggah", warna="#a3e635", size=40, jarak=100, isi=[
     "Tidak ada benda yang menembus atau tertinggal.", "Roda berputar sesuai laju motor.", "Tidak ada frame yang kabur, berkedip, atau melompat.",
     "Suara pas dengan gambarnya.", "Teks tidak terpotong.", "Setiap aset dari luar tercatat di ASET.md beserta lisensinya."])]),
 (c[11], [commit("F09g", "commit", "akhir"), R("F09h_ulang", "ulang_selesai-1", "ulang_selesai", "termU", maks=1.0, lab="Laporan terakhir: bersih", s=0)]),
])

# ---------------------------------------------------------------- F10 Penutup
c = NC["F10"]
bab("F10", "Penutup", [
 (c[0], [A("unggah", min=16, bg=f"{RAW}/film_t1.5.png", judulVid="Paket Terakhir Malam Ini | Film Animasi Pendek",
           desk="Film ini dibuat oleh manusia bersama AI (Claude Code dan Blender). Tekstur dan langit: Poly Haven (CC0).", cap="Thumbnail: indah, tanpa membocorkan akhir cerita"),
         A("terminal", min=6, s=3, prompt=PS, judul="Terminal  ·  versi tegak untuk Short", size=30, baris=[dict(cmd="blender -b -P render.py -- --versi tegak"), dict(cmd="python gabung.py --versi tegak")])]),
 (c[1], [A("kartu", min=20, judul="Lisensi", kartu=[
     ["Blender", "Gratis. Film yang kamu render sepenuhnya milikmu, boleh dimonetisasi.", "sky"],
     ["Poly Haven", "Tekstur dan langit malam CC0. Tetap ditulis di ASET.md dan deskripsi.", "teal"],
     ["Buatan kode", "Benda lain dan efek suara dibuat dengan kode.", "violet"],
     ["Suara buatan", "Ikuti aturan pemakaian layanannya.", "amber"]])]),
 (c[2], [ketik("10.1", "F10a_ekspor", "prompt_ekspor"), kerja("F10a_ekspor", "prompt_ekspor", "ekspor_selesai", crop="termU", maks=20),
         G("F10_glb.png", min=5, cap="motor_bebek.glb dan helm.glb: siap dipakai game di browser")]),
 (c[3], [A("teks", min=14, judul=REPO, sub="Link di deskripsi", warna="#60a5fa", jarak=96, isi=["STORYBOARD.md, CLAUDE.md, ASET.md, PROMPT.md", "aset.py: mengunduh tekstur dan langit malam", "bangun.py: membangun film.blend dari kode", "render.py, gabung.py, periksa.py", "folder film/: kota, kurir, motor, kamera, suara"]), commit("F10b", "commit", "akhir", s=3)]),
 (c[4], [A("siklus", min=20, judul="Cara kerja kita, sekali lagi")]),
 (c[5], [A("kartu", min=12, judul="Giliranmu: tiga ide film pendek", serempak=True, h=420, kartu=[
     ["Satpam kompleks", "dan kucing yang selalu lolos.", "sky"], ["Payung yang tertinggal", "di angkot.", "teal"], ["Lampu terakhir", "yang masih menyala di kantor.", "amber"]])]),
 (c[6], [A("akhir", min=8, bg=f"{RAW}/patungan_thumb.jpg", judulVid="Vibe Coding yang Benar: Membuat Aplikasi Patungan Sampai Jadi")]),
])

# urutan: F00 di depan
BAB.sort(key=lambda b: int(b["kode"][1:]))
