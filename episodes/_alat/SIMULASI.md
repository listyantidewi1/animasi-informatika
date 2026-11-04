# Produksi video simulasi (S01–S32, K01–K26)

Panduan ini melengkapi `CLAUDE.md` (aturan seri) dan `README.md` di folder ini. Contoh lengkap yang sudah jadi: `episodes/sim/S02/`
(naskah `script.json`, adegan `scenes.js`, Short `short/script.json`). Daftar pusat: `episodes/sim/daftar.json` (judul, episode
pemakai `for`, halaman latihan utama `latihan`, simulasi berikutnya `next`). **Judul dan `next` wajib sama dengan daftar itu.**

## Dua jenis
- **Simulasi praktik (S)**: memperagakan aplikasi sungguhan langkah demi langkah, pola **Lihat → Coba → Periksa**.
  Lihat: layar aplikasi besar, pointer bergerak, klik berdenyut, tombol keyboard tampil (`L.keys`), bagian kecil diperbesar (`L.zoom`).
  Coba: beat jeda "Sekarang giliranmu. Hentikan dulu videonya …" dengan daftar langkah singkat di layar (lihat adegan `coba` di S02).
  Periksa: hasil yang benar ditampilkan, lalu satu atau dua kesalahan yang paling sering terjadi beserta cara memperbaikinya.
- **Simulasi konsep (K)**: menjalankan satu proses dengan 3–5 variasi masukan. Tiap variasi dimulai dengan pertanyaan
  "Menurutmu, apa yang terjadi kalau …?", diberi jeda menebak (beat tersendiri, hold ±2 detik), lalu prosesnya dijalankan dan hasilnya
  dibandingkan. Penutup memperlihatkan tombol mana yang ditekan di halaman latihan episode untuk mencoba sendiri.
  Boleh memakai ulang mesin gambar episode induk: `"engine": ["../../_alat/kiko-core.js", "../../D7.3/scenes.js", "scenes.js"]`
  (periksa dulu berkas apa saja yang dimuat episode induk di `script.json`-nya, termasuk pembantu seperti `lembar.js`).

## Aturan isi (wajib)
- Bahasa Indonesia, kalimat sederhana tetapi **lengkap** dengan tanda baca yang benar (TTS membacanya). Bukan potongan frasa.
  Angka yang dibacakan ditulis dengan kata bila perlu ("tujuh puluh lima"), rumus dibacakan ("sama dengan SUM, buka kurung, B2 titik dua B6, tutup kurung").
- Istilah sesuai `ISTILAH.md` (mouse, keyboard, file, drag, double click, login, browser, error, string, …; klik, folder, aplikasi tetap Indonesia).
- Layar aplikasi **generik**: "Lembar Kerja", "Editor Python", "Terminal", "Browser", "Pengaturan HP", "Dokumen", "Slide", "Formulir", "Router".
  Tanpa logo, warna khas, atau tata letak yang meniru merek. Nama menu boleh sama dengan aplikasi populer (File, Simpan, Data → Urutkan).
  Bila nama menu berbeda antar-aplikasi, beri catatan kecil "Di aplikasi lain, menu ini bernama …".
  Python utama: Colab di browser (sebut "Colab"); IDLE sebagai catatan.
- Semua nama orang, akun, sandi, alamat IP, situs, dan data adalah rekaan. Domain memakai `.example` (mis. `kantin.example`), IP memakai 192.168.x.x / 10.x.x.x / 203.0.113.x.
  Tokoh: Kiko (robot), Dito, Sinta; boleh tokoh lain. Konteks lokal (kantin, warung, grup kelas, angkot).
- Kait: `hook` = "Setelah menonton, kamu bisa …" (satu kalimat keterampilan praktis, tanpa "Setelah menonton, kamu bisa" di dalam teks hook itu sendiri, lihat S02),
  dan `intro1`/`intro2` menyebut keterampilan itu secara lisan sebelum detik ke-20. Sebut episode pemakainya (prasyarat) di intro.
- 2–3 cek pemahaman (`quiz`/`quiz_answer`, format sama dengan S02) dengan "Pikirkan dulu." lalu jawaban + alasan.
- Durasi mengikuti kebutuhan: praktik biasanya 5–9 menit, konsep 4–7 menit. Jangan memanjangkan tanpa isi.
- Narasi tiap beat maksimal **3 baris** di kartu narasi: cek dengan `python3 episodes/_alat/cek_narasi.py sim/<kode>` (harus "semua beat ≤ 3 baris").
  Kartu tiga baris mulai di y≈841, jadi semua gambar penting harus di atas y≈830 (jendela aplikasi S02: y 122–822).
- Tanpa versi teks dan tanpa musik. Hanya versi bersuara.

## Berkas
```
episodes/sim/<kode>/script.json      # format S02: episode, title, label, kind, for, latihan, hook, engine, parts, recap, next, youtube, segments, quizzes, beats
episodes/sim/<kode>/scenes.js        # Object.assign(Kiko.SCENES, {...}); pembantu khusus simulasi ini boleh di berkas lain di folder yang sama
episodes/sim/<kode>/tts-kit/suara.json   # salin dari episodes/sim/S02/tts-kit/suara.json (Kak Ceria, eleven_v4)
episodes/sim/<kode>/short/script.json    # Short; salin juga tts-kit ke short/
```
- `label`: "Simulasi Praktik · Sxx · <Nama aplikasi generik>" atau "Simulasi Konsep · Kxx · <Episode induk>".
- `parts`: `{"<kode>": {"segs": [0, 1, …]}}` (satu bagian). `next`: `{code, title, note, heading: "SIMULASI BERIKUTNYA"}` dari daftar.json
  (yang terakhir di kelompoknya: heading "SAMPAI JUMPA", code "", title "Semua simulasi ada di halaman latihan").
- `youtube`: `ringkas`, `belajar` (3–4 butir), `cari` (3–5 frasa yang lazim diketik murid), `prasyarat`, `tagar`.
- Beat `latihan` sebelum `outro`: tunjukkan halaman latihan episode `latihan` (`belajar-informatika.vercel.app/<kode-tanpa-titik-huruf-kecil>`) dan satu tugas nyata.

## Pembantu gambar bersama
- `episodes/_alat/layar.js` (`Kiko.layar`, dimuat setelah kiko-core.js): `L.window`, `L.sheet` (lembar kerja), `L.cursor`, `L.keys`,
  `L.callout`, `L.zoom`, `L.play` (penerjemah langkah: move/click/type/key/drag/hover/select/state/wait). Baca berkasnya; S02 memakainya.
- Pembantu lain yang dipakai beberapa simulasi dibuat sekali, dimiliki satu kelompok kerja:
  `layar_kode.js` (editor kode dengan sorotan sintaks, sel Colab, keluaran, terminal), `layar_web.js` (jendela browser, halaman web,
  formulir, halaman admin router, dokumen/slide), `layar_hp.js` (bingkai HP, layar Pengaturan, notifikasi, aplikasi HP).
  Pemilik berkas boleh menambah fungsi; kelompok lain hanya memakai. **Jangan mengubah `kiko-core.js`, `layar.js`, `short.js`,
  `render*.py`, `voice.py`, `timing.py`, `suara_elevenlabs.py`**; bila perlu perubahan di sana, laporkan.
- `Kiko.helpers`: rr, text (opsi `fit` = lebar maksimum, huruf mengecil hanya bila perlu), wrap, para, card, kiko, ease, clamp, lerp; `Kiko.C` = palet.
  Adegan bawaan inti: `title`, `quiz`, `quiz_answer`, `recap`, `outro` (lihat S02).
- Gerakan disinkronkan dengan suara lewat `b.audio || b.dur` (lama narasi beat); langkah aksi selesai sebelum ±90% narasi.

## Alur per simulasi
1. Tulis `script.json` dan `scenes.js`. `python3 episodes/_alat/cek_narasi.py sim/<kode>`.
2. `python3 episodes/_alat/timing.py sim/<kode>` (timeline teks hanya untuk pratinjau), lalu
   `python3 episodes/_alat/preview.py sim/<kode> <beat>=<detik-dalam-beat> …` → JPG di `sim/<kode>/preview/`.
   **Lihat sendiri** frame tiap beat (gabungkan jadi lembar kontak dengan PIL dan buka dengan Read). Periksa: teks tidak meluber,
   tidak ada yang tertutup kartu narasi, pointer tidak menutupi angka penting, langkah di layar sesuai narasi, ejaan.
3. Suara: `python3 episodes/_alat/suara_elevenlabs.py sim/<kode>` (hanya membuat MP3 yang belum ada; bila gagal karena batas
   permintaan, tunggu sebentar lalu jalankan lagi). Jangan `--ulang` kecuali beat itu memang diubah. Lalu `python3 episodes/_alat/voice.py sim/<kode>`.
4. Pratinjau lagi dengan `--suara` untuk beat beraksi (cek sinkron), lalu render: `nice -n 10 python3 episodes/_alat/render.py sim/<kode> --suara`
   → `sim/<kode>/video/<kode>_suara.mp4`. Satu render penuh; periksa frame dulu.
5. Periksa video jadi: ambil ±12 frame (`ffmpeg -ss <t> -i … -frames:v 1`) dan lihat. Perbaiki bila ada yang salah (`--lanjut` hanya merender segmen yang berubah).
6. Short (60–75 detik, ±850 karakter narasi): `short/script.json` seperti `sim/S02/short/script.json` (beat: id, seg 1, src = beat asal,
   scene, crops [[x,y,w,h]] potongan kanvas 1920×1080 yang besar dan terbaca di ponsel, text, hold; terakhir beat `cta` dengan scene `short_cta`).
   `timing.py sim/<kode>/short` → `render_short.py sim/<kode> --frame h1=3 …` (lihat frame; **setiap kali crops diubah, jalankan timing.py lagi**)
   → `suara_elevenlabs.py sim/<kode>/short` → `voice.py sim/<kode>/short` → `nice -n 10 python3 episodes/_alat/render_short.py sim/<kode> --suara`.
7. Jangan commit atau push (koordinator yang melakukannya). Laporkan: berkas video, durasi, jumlah karakter narasi, hal yang perlu diperhatikan.

## Kredit ElevenLabs
±0,25 kredit per karakter (terukur di S02: 5.557 karakter = 1.406 kredit). Batas per simulasi: narasi video ≤ 6.000 karakter, Short ≤ 900.
Cek sisa: `curl -s https://api.elevenlabs.io/v1/user/subscription` (kunci disisipkan proxy; jangan pernah menulis atau menampilkan kunci).
