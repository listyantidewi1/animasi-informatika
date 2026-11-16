import json as _j, pathlib as _p
_d = _p.Path(__file__).parent
_dg = _j.load(open(_d / "diagram.json"))
_diag = "{\n" + ",\n".join(f' "{k}": ' + (_j.dumps(v, ensure_ascii=False) if k not in ("parts", "connections") else "[\n  " + ",\n  ".join(_j.dumps(x, ensure_ascii=False) for x in v) + "\n ]") for k, v in _dg.items()) + "\n}"
NAMA = "T09_Kipas_Otomatis_IoT_ESP32"
JUDUL_YT = "Bikin Kipas Otomatis Pengukur Suhu (Proyek IoT ESP32 di Simulator Wokwi)"
BEATS = {
 1: [dict(k="klip", a="b07_geser", b="b07_akhir", speed=1.4, maks=2.0), dict(k="adegan", nama="judul", min=8.5, a={"judul": "Bikin Kipas Otomatis\nPengukur Suhu (IoT)", "hook": "Setelah menonton, kamu bisa memprogram alat yang membaca suhu, menampilkannya di layar, dan menyalakan kipas secara otomatis, tanpa membeli komponen."})],
 2: [dict(k="adegan", nama="ipo")],
 3: [dict(k="rek", a="b03", b="b03_akhir")],
 4: [dict(k="adegan", nama="setuploop")],
 5: [dict(k="rek", a="b05", b="b05_akhir", maks=2.5)],
 6: [dict(k="adegan", nama="keputusan")],
 7: [dict(k="rek", a="b07", b="b07_akhir", maks=3.0)],
 8: [dict(k="adegan", nama="tebak", bg=("rek", 164.5))],
 9: [dict(k="rek", a="b09", b="b09_akhir", maks=2.5)],
 10: [dict(k="adegan", nama="alatnyata")],
 11: [dict(k="adegan", nama="rangkuman", a={"item": [{"ikon": "IPO", "warna": "#2dd4bf", "judul": "Tiga bagian", "sub": "input, proses, output", "kode": "DHT22 → ESP32"}, {"ikon": "Putar", "warna": "#a78bfa", "judul": "setup dan loop", "sub": "sekali, lalu berulang", "kode": "loop()"}, {"ikon": "Cabang", "warna": "#ffb020", "judul": "Keputusan", "sub": "bandingkan dengan batas", "kode": "if / else"}, {"ikon": "Kipas", "warna": "#a3e635", "judul": "HIGH dan LOW", "sub": "nyalakan dan matikan pin", "kode": "digitalWrite()"}]})],
 12: [dict(k="adegan", nama="penutup", a={"tantangan": "Tambahkan lampu merah yang menyala saat suhu di atas 35 derajat, sebagai tanda bahaya. Petunjuk: pasang LED kedua di pin lain dan buat if baru.", "berikut": "Bikin Website Daftar Tugas yang Tetap Tersimpan"})],
}
SHORT = {"judul": "Kipas yang menyala sendiri?", "beats": [
 {"teks": "Kipas ini menyala sendiri saat ruangan panas. Programnya bisa kamu buat sendiri, tanpa membeli komponen.", "dari": (1, 3, "kanan")},
 {"teks": "Setiap alat IoT punya input, proses, dan output: sensor suhu, papan ESP32, lalu layar dan kipas.", "dari": (2, 20, "tengah")},
 {"teks": "Otaknya membandingkan suhu dengan batas. Kalau lebih panas, pin kipas diberi HIGH, dan kipas menyala.", "dari": (6, 9, "tengah")},
 {"teks": "Di simulator Wokwi, kita bisa menggeser suhu dan melihat kipasnya bereaksi.", "dari": (7, 17.0, "kanan")},
 {"teks": "Mau membuat kipas otomatismu sendiri? Tonton tutorial lengkapnya di channel ini.", "dari": (9, 15, "kanan")},
]}
THUMB = {"png": "thumb_kipas.png", "dari": (7, 21), "pita": "IoT ESP32", "baris": ["KIPAS", "NYALA", "SENDIRI"], "sorot": 1, "ukuran": 112}
META = {
 "ringkas": "Buat alat Internet of Things (IoT) pertamamu: kipas yang menyala sendiri saat ruangan panas. Semuanya dikerjakan di simulator Wokwi di browser, gratis dan tanpa login, jadi kamu tidak perlu membeli komponen. Kamu belajar input, proses, dan output (sensor suhu DHT22, papan ESP32, layar LCD, dan kipas), bagian setup dan loop, membaca suhu, mengambil keputusan dengan if dan else, menyalakan pin dengan HIGH dan LOW, serta cara memindahkan proyek ke alat sungguhan dengan relay dan WiFi. Setiap konsep dijelaskan dengan animasi.",
 "bab": [(1, "Pembuka"), (2, "Input, proses, output"), (3, "Menyusun rangkaian di Wokwi"), (4, "setup dan loop"), (5, "Membaca suhu"), (6, "Mengambil keputusan"), (7, "Kipas otomatis"), (8, "Tebak dulu"), (9, "Ubah dan uji"), (10, "Dari simulator ke alat sungguhan"), (11, "Rangkuman dan tantangan")],
 "kode": "Buka https://wokwi.com/projects/new/esp32\nLibrary (tab Library Manager, tombol +): DHT sensor library for ESPx, LiquidCrystal I2C\n\nsketch.ino:\n" + open(_d / "f.ino").read().strip() + "\n\ndiagram.json (ganti seluruh isinya):\n" + _diag,
 "prasyarat": "Sebelumnya: Bikin Sandi Rahasia dengan Python. Lebih mudah bila sudah menonton Bikin Game Ular Sendiri di Browser (game loop). Berikutnya: Bikin Website Daftar Tugas yang Tetap Tersimpan.",
 "komentar": "Tantangan: tambahkan lampu merah yang menyala saat suhu di atas 35 derajat. Tulis potongan kode if-mu di komentar!",
 "tag": ["proyek iot sederhana", "esp32 untuk pemula", "wokwi tutorial", "simulator arduino", "sensor suhu dht22", "kipas otomatis", "internet of things", "belajar coding", "tutorial esp32 bahasa indonesia", "lcd i2c esp32"],
 "hashtag": ["iot", "esp32", "belajarcoding", "coding"],
 "short_desk": "Kipas yang menyala sendiri saat panas: proyek IoT pertamamu dengan ESP32 di simulator Wokwi, tanpa membeli komponen.",
}
