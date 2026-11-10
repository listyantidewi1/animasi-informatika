# Catatan serah terima (10 Nov 2026)

Untuk sesi Claude baru. Baca juga `CLAUDE.md` (aturan seri), `README.md` (status), `episodes/_alat/README.md` (alat episode), dan `episodes/dok/PANDUAN.md` (dokumenter).

## Status
- **Seri utama selesai**: 52 episode (D7.0–F12.x) lengkap dengan halaman latihan, video dua versi, dan Short; 58 video simulasi (S01–S32, K01–K26) + Short; 45 TikTok (`episodes/tiktok/`, panduan di `episodes/tiktok/PANDUAN.md`). Situs: https://belajar-informatika.vercel.app/ (otomatis dari `main`).
- **Dokumenter**: D01, D02, D03, D04 selesai dan terkirim (video lewat chat; Short + thumbnail + judul/deskripsi di halaman pelacak). D04 "Buku yang Ditulis Selama 64 Tahun dan Belum Selesai" (10:04) disetujui Bu Dewi tanpa perbaikan (10 Nov).
- Berkas video (`video/`, `*.wav`) tidak masuk git. Di sesi baru, perbaikan gambar D04 berarti render ulang penuh (±25 menit dengan 3 proses paralel); `--mux` hanya berlaku bila berkas segmen masih ada.

## Halaman dan dokumen Claude (milik Bu Dewi)
| Nama | Alamat | Isi |
|---|---|---|
| Unggahan Seri Informatika | https://claude.ai/artifact/31d36ZDMPwSeD7EQeG6Sjh | pelacak unggah: unduh Short/thumbnail, judul & deskripsi YouTube (koleksi `episodes`, `yt`) |
| Alamat Video YouTube | https://claude.ai/artifact/A3QeNGQ9ZFsPcttnLNjTSH | Bu Dewi mengisi ID video YouTube (koleksi `video`) |
| Unggahan TikTok Informatika | https://claude.ai/artifact/Vuocb51PWEuCTspcjQfi19 | pelacak TikTok |
| Unggahan Pembahasan Bebras | https://claude.ai/artifact/AmFLXnoh3o7fTBPn6fhgox | pelacak unggah video Bebras (koleksi `soal`, satu dokumen per soal) |
| Kurikulum Seri Animasi Informatika (Fase D–F) | https://claude.ai/artifact/YNDgZGE8hvRXPZs9d52DLt | peta 52 unit |
| Analisis Kebutuhan Video Simulasi | https://claude.ai/artifact/1t4Jj3bfW32Sd2L13jD8kk | daftar S01–S32, K01–K26 |

## Tugas terjadwal
"Pasang video YouTube yang sudah tayang" (setiap hari): membaca koleksi `video` di halaman Alamat Video YouTube, mengisi `episodes/_alat/youtube_id.json`, menjalankan `python3 episodes/_alat/yt_tayang.py --build`, memeriksa satu halaman yang berubah lewat server http lokal, commit, push ke `naskah-d7.0` dan `naskah-d7.0:main`, lalu melapor. Hapus tugas itu bila semua kode sudah terisi dan tayang. Per 10 Nov: 18 dari 79 video tayang. Tugas ini terikat ke sesi lama; bila Bu Dewi ingin laporannya muncul di sesi baru, buat ulang tugas serupa dari sesi baru lalu hapus yang lama.

## Aturan kerja yang perlu diingat
- Bahasa Indonesia; kalimat lengkap. Commit berbahasa Indonesia; push: `git push origin naskah-d7.0` lalu `git push origin naskah-d7.0:main`.
- Kunci ElevenLabs tidak pernah diminta, ditulis, atau disebut; hanya lewat secret jaringan (`api.elevenlabs.io`, header `xi-api-key`) atau `ELEVENLABS_API_KEY`.
- Hentikan proses hanya dengan PID (jangan `pkill -f`). Jangan menulis ID model AI di berkas repo.
- Hemat kuota: periksa kualitas sendiri (cek otomatis + lembar kontak), alur kerja banyak agen hanya bila Bu Dewi meminta.
- Satu render penuh per permintaan; periksa frame dulu, baru render.

## Alat bantu yang dipindahkan dari folder sementara (10 Nov)
- `episodes/_alat/yt_panel.py`: dokumen panel judul & deskripsi YouTube untuk pelacak.
- `episodes/_alat/lembar_kontak.py`: lembar kontak per bab dari video jadi.
- `episodes/_alat/thumbnail_dok.py`: thumbnail dokumenter dari berkas gambar JS.

## Halaman Unggahan Pembahasan Bebras (10 Nov)
- Satu dokumen per soal di koleksi `soal` (id = kode, mis. `B01`): `kode`, `urut`, `judul`, `kategori`, `kredit` {judul_asli, tahun, negara, kode}, `video.lengkap` dan `video.short` masing-masing {durasi, format, judul, deskripsi, catatan, file {id, size, nama}, srt {nama, teks} (opsional)}, `up` {lengkap, short}.
- Menambah soal baru: unggah MP4 sebagai aset halaman (Artifact `asset: true`, batas 20 MiB per berkas; video panjang yang lebih besar diperkecil dengan audio AAC 64k, video `-c:v copy`), lalu `set` dokumen `soal/B0n` lewat ArtifactData. Contoh lengkap: dokumen `soal/B01`.
- Deskripsi YouTube wajib memuat kredit soal (judul asli, tahun, negara, kode) dan tidak menyebut tanggal. Bab diambil dari awal cue .srt pertama tiap segmen.
- Tombol "Hapus video yang sudah diunggah" di halaman hanya menghapus aset halaman (dua klik), judul/deskripsi/subtitel tetap.
