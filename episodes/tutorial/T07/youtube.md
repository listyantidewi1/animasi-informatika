# T07 YouTube

## Video utama (7:32)

**Judul:** Bikin Game Ular Sendiri di Browser (JavaScript untuk Pemula)

**Deskripsi:**

Buat game ular klasik dari nol dengan HTML dan JavaScript, cukup satu file dan sebuah browser. Kamu belajar canvas dan papan koordinat (kenapa y bertambah ke bawah), array untuk menyimpan badan ular, perulangan for, game loop dengan setInterval, event keyboard untuk tombol panah, sampai cara ular makan dan tumbuh. Setiap konsep dijelaskan dengan animasi, lalu langsung dipraktikkan dan dimainkan.

Bab:
0:00 Pembuka
0:21 Papan koordinat
0:49 Papan dan kotak pertama
1:58 Ular adalah array
2:21 Badan ular
2:50 Game loop
3:23 Membuat ular bergerak
3:57 Event keyboard
4:25 Tombol panah dan dinding
5:03 Makan dan tumbuh
5:30 Makanan dan skor
6:07 Tebak dulu
6:20 Ubah dan uji
6:50 Rangkuman dan tantangan

Kode lengkap:
<!DOCTYPE html>
<html>
<body style="background: #1e293b; text-align: center; font-family: sans-serif">
  <h2 style="color: white">Skor: <span id="skor">0</span></h2>
  <canvas id="papan" width="400" height="400"></canvas>
  <script>
    const papan = document.getElementById("papan");
    const pena = papan.getContext("2d");
    const kotak = 20;
    let ular = [{x: 10, y: 10}, {x: 9, y: 10}, {x: 8, y: 10}];
    let arah = {x: 1, y: 0};
    let makanan = {x: 15, y: 5};
    let skor = 0;

    function gambar() {
      pena.fillStyle = "black";
      pena.fillRect(0, 0, 400, 400);
      pena.fillStyle = "red";
      pena.fillRect(makanan.x * kotak, makanan.y * kotak, kotak - 2, kotak - 2);
      pena.fillStyle = "lime";
      for (const bagian of ular) {
        pena.fillRect(bagian.x * kotak, bagian.y * kotak, kotak - 2, kotak - 2);
      }
    }

    function langkah() {
      const kepala = {x: ular[0].x + arah.x, y: ular[0].y + arah.y};
      if (kepala.x < 0 || kepala.x >= 20 || kepala.y < 0 || kepala.y >= 20) {
        clearInterval(jalan);
        pena.fillStyle = "white";
        pena.font = "40px sans-serif";
        pena.fillText("Game Over", 100, 200);
        return;
      }
      ular.unshift(kepala);
      if (kepala.x === makanan.x && kepala.y === makanan.y) {
        skor = skor + 1;
        document.getElementById("skor").textContent = skor;
        makanan = {x: Math.floor(Math.random() * 20), y: Math.floor(Math.random() * 20)};
      } else {
        ular.pop();
      }
      gambar();
    }

    document.addEventListener("keydown", function (e) {
      if (e.key === "ArrowUp") arah = {x: 0, y: -1};
      if (e.key === "ArrowDown") arah = {x: 0, y: 1};
      if (e.key === "ArrowLeft") arah = {x: -1, y: 0};
      if (e.key === "ArrowRight") arah = {x: 1, y: 0};
    });

    gambar();
    const jalan = setInterval(langkah, 150);
  </script>
</body>
</html>

Sebelumnya: Bikin AI Penebak Kelulusan dari Data Nilai. Lebih mudah bila sudah menonton Bikin Website Profil Diri dalam 10 Menit. Berikutnya: Bikin Sandi Rahasia dengan Python.
Playlist: Proyek Pemrograman Sederhana. Narasi: Cahaya (suara sintetis ElevenLabs). Rekaman layar sungguhan; animasi penjelasan dibuat dengan kode oleh I Teach Software Engineering. Naskah disusun dengan bantuan AI (Claude buatan Anthropic) dan disunting manusia.

Subscribe: https://www.youtube.com/@iTeachSWE

#javascript #bikingame #belajarcoding #coding

**Komentar tersemat:** Tantangan: buat ular kalah kalau menabrak badannya sendiri. Berapa skor tertinggimu? Tulis di komentar.

**Tag:** game ular javascript, bikin game di browser, javascript untuk pemula, html canvas, game loop, belajar coding, tutorial javascript bahasa indonesia, proyek coding sederhana, snake game, membuat game sendiri

## Short

**Judul:** Game ular dari nol? #shorts

**Deskripsi:**

Game ular dari nol dengan JavaScript: papan koordinat, array, game loop, dan cara ular tumbuh.

Tutorial lengkapnya: Bikin Game Ular Sendiri di Browser (JavaScript untuk Pemula) (playlist Proyek Pemrograman Sederhana).
Subscribe: https://www.youtube.com/@iTeachSWE
#shorts #javascript #bikingame #belajarcoding

**Video terkait:** Bikin Game Ular Sendiri di Browser (JavaScript untuk Pemula)
