# T10 YouTube

## Video utama (4:01)

**Judul:** Bikin Website Daftar Tugas yang Tetap Tersimpan (HTML, CSS, JavaScript, localStorage)

**Deskripsi:**

Buat website daftar tugas sendiri dengan HTML, CSS, dan JavaScript, yang isinya tetap tersimpan walaupun browser ditutup. Kamu belajar peran HTML, CSS, dan JavaScript, memisahkan data dan tampilan, menyimpan tugas dalam array berisi object, menampilkan daftar dengan forEach, menyimpan data di localStorage dengan JSON.stringify dan JSON.parse, menandai tugas selesai, dan mencegah bug tugas kosong. Setiap konsep dijelaskan dengan animasi.

Bab:
0:00 Pembuka
0:15 HTML, CSS, dan JavaScript
0:39 Kerangka halaman
1:04 Data dan tampilan
1:28 Menambah tugas
1:48 Masalah: data hilang
2:16 Menyimpan ke localStorage
2:38 Menandai selesai
2:58 Tebak dulu
3:06 Ubah dan uji
3:28 Rangkuman dan tantangan

Kode lengkap:
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Daftar Tugas</title>
  <style>
    body { font-family: sans-serif; background: #eef2ff; max-width: 420px; margin: 40px auto; }
    h1 { color: #4338ca; }
    input { padding: 10px; width: 65%; font-size: 16px; }
    button { padding: 10px 14px; font-size: 16px; background: #4338ca; color: white; border: none; border-radius: 8px; }
    li { background: white; margin: 8px 0; padding: 12px; border-radius: 8px; list-style: none; cursor: pointer; }
    .selesai { text-decoration: line-through; color: #999; }
  </style>
</head>
<body>
  <h1>Daftar Tugas</h1>
  <input id="isian" placeholder="Tugas baru...">
  <button onclick="tambah()">Tambah</button>
  <ul id="daftar"></ul>
  <script>
    let tugas = JSON.parse(localStorage.getItem("tugas")) || [];

    function tampilkan() {
      const daftar = document.getElementById("daftar");
      daftar.innerHTML = "";
      tugas.forEach(function (t, i) {
        const li = document.createElement("li");
        li.textContent = t.teks;
        if (t.selesai) li.className = "selesai";
        li.onclick = function () {
          tugas[i].selesai = !tugas[i].selesai;
          simpan();
        };
        daftar.appendChild(li);
      });
    }

    function simpan() {
      localStorage.setItem("tugas", JSON.stringify(tugas));
      tampilkan();
    }

    function tambah() {
      const isian = document.getElementById("isian");
      if (isian.value === "") return;
      tugas.push({ teks: isian.value, selesai: false });
      isian.value = "";
      simpan();
    }

    tampilkan();
  </script>
</body>
</html>

Sebelumnya: Bikin Kipas Otomatis Pengukur Suhu (IoT). Lebih mudah bila sudah menonton Bikin Website Profil Diri dan Bikin Game Ular Sendiri di Browser. Berikutnya: Bikin AI Penyaring Pesan Spam.
Playlist: Proyek Pemrograman Sederhana. Narasi: Cahaya (suara sintetis ElevenLabs). Rekaman layar sungguhan; animasi penjelasan dibuat dengan kode oleh I Teach Software Engineering. Naskah disusun dengan bantuan AI (Claude buatan Anthropic) dan disunting manusia.

Subscribe: https://www.youtube.com/@iTeachSWE

#javascript #html #webdev #belajarcoding

**Komentar tersemat:** Tantangan: tambahkan tombol hapus di setiap tugas. Sudah berhasil? Tulis cara kamu memakai splice di komentar!

**Tag:** website daftar tugas, to do list javascript, localStorage javascript, html css javascript pemula, belajar web, proyek javascript sederhana, json javascript, belajar coding, tutorial javascript bahasa indonesia, membuat website sendiri

## Short

**Judul:** Daftar tugas yang tidak hilang? #shorts

**Deskripsi:**

Website daftar tugas yang tidak hilang saat browser ditutup: HTML, CSS, JavaScript, dan localStorage.

Tutorial lengkapnya: Bikin Website Daftar Tugas yang Tetap Tersimpan (HTML, CSS, JavaScript, localStorage) (playlist Proyek Pemrograman Sederhana).
Subscribe: https://www.youtube.com/@iTeachSWE
#shorts #javascript #html #webdev

**Video terkait:** Bikin Website Daftar Tugas yang Tetap Tersimpan (HTML, CSS, JavaScript, localStorage)
