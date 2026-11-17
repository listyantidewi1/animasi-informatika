# T09 YouTube

## Video utama (6:42)

**Judul:** Bikin Kipas Otomatis Pengukur Suhu (Proyek IoT ESP32 di Simulator Wokwi)

**Deskripsi:**

Buat alat Internet of Things (IoT) pertamamu: kipas yang menyala sendiri saat ruangan panas. Semuanya dikerjakan di simulator Wokwi di browser, gratis dan tanpa login, jadi kamu tidak perlu membeli komponen. Kamu belajar input, proses, dan output (sensor suhu DHT22, papan ESP32, layar LCD, dan kipas), bagian setup dan loop, membaca suhu, mengambil keputusan dengan if dan else, menyalakan pin dengan HIGH dan LOW, serta cara memindahkan proyek ke alat sungguhan dengan relay dan WiFi. Setiap konsep dijelaskan dengan animasi.

Bab:
0:00 Pembuka
0:25 Input, proses, output
0:59 Menyusun rangkaian di Wokwi
1:57 setup dan loop
2:24 Membaca suhu
3:06 Mengambil keputusan
3:32 Kipas otomatis
4:38 Tebak dulu
4:55 Ubah dan uji
5:36 Dari simulator ke alat sungguhan
6:05 Rangkuman dan tantangan

Kode lengkap:
Buka https://wokwi.com/projects/new/esp32
Library (tab Library Manager, tombol +): DHT sensor library for ESPx, LiquidCrystal I2C

sketch.ino:
#include <DHTesp.h>
#include <LiquidCrystal_I2C.h>

DHTesp sensor;
LiquidCrystal_I2C layar(0x27, 16, 2);
const int KIPAS = 4;
const float BATAS = 30.0;

void setup() {
  sensor.setup(15, DHTesp::DHT22);
  layar.init();
  layar.backlight();
  pinMode(KIPAS, OUTPUT);
}

void loop() {
  float suhu = sensor.getTemperature();
  layar.setCursor(0, 0);
  layar.print("Suhu: ");
  layar.print(suhu, 1);
  layar.print(" C  ");
  layar.setCursor(0, 1);
  if (suhu > BATAS) {
    digitalWrite(KIPAS, HIGH);
    layar.print("Kipas: NYALA");
  } else {
    digitalWrite(KIPAS, LOW);
    layar.print("Kipas: MATI ");
  }
  delay(1000);
}

diagram.json (ganti seluruh isinya):
{
 "version": 1,
 "author": "Proyek Pemrograman Sederhana",
 "editor": "wokwi",
 "parts": [
  {"type": "board-esp32-devkit-c-v4", "id": "esp", "top": 0, "left": 0, "attrs": {}},
  {"type": "wokwi-dht22", "id": "sensor", "top": 10, "left": -170, "attrs": {"temperature": "26.5", "humidity": "60"}},
  {"type": "wokwi-lcd1602", "id": "layar", "top": 215, "left": -95, "attrs": {"pins": "i2c"}},
  {"type": "wokwi-led", "id": "kipas", "top": 60, "left": 170, "attrs": {"color": "blue", "label": "KIPAS"}}
 ],
 "connections": [
  ["esp:TX", "$serialMonitor:RX", "", []],
  ["esp:RX", "$serialMonitor:TX", "", []],
  ["sensor:VCC", "esp:3V3", "red", ["v0"]],
  ["sensor:GND", "esp:GND.1", "black", ["v0"]],
  ["sensor:SDA", "esp:15", "green", ["v0"]],
  ["layar:GND", "esp:GND.2", "black", ["v0"]],
  ["layar:VCC", "esp:5V", "red", ["v0"]],
  ["layar:SDA", "esp:21", "blue", ["v0"]],
  ["layar:SCL", "esp:22", "purple", ["v0"]],
  ["kipas:A", "esp:4", "orange", ["v0"]],
  ["kipas:C", "esp:GND.2", "black", ["v0"]]
 ],
 "dependencies": {}
}

Sebelumnya: Bikin Sandi Rahasia dengan Python. Lebih mudah bila sudah menonton Bikin Game Ular Sendiri di Browser (game loop). Berikutnya: Bikin Website Daftar Tugas yang Tetap Tersimpan.
Playlist: Proyek Pemrograman Sederhana. Narasi: Cahaya (suara sintetis ElevenLabs). Rekaman layar sungguhan; animasi penjelasan dibuat dengan kode oleh I Teach Software Engineering. Naskah disusun dengan bantuan AI (Claude buatan Anthropic) dan disunting manusia.

Subscribe: https://www.youtube.com/@iTeachSWE

#iot #esp32 #belajarcoding #coding

**Komentar tersemat:** Tantangan: tambahkan lampu merah yang menyala saat suhu di atas 35 derajat. Tulis potongan kode if-mu di komentar!

**Tag:** proyek iot sederhana, esp32 untuk pemula, wokwi tutorial, simulator arduino, sensor suhu dht22, kipas otomatis, internet of things, belajar coding, tutorial esp32 bahasa indonesia, lcd i2c esp32

## Short

**Judul:** Kipas yang menyala sendiri? #shorts

**Deskripsi:**

Kipas yang menyala sendiri saat panas: proyek IoT pertamamu dengan ESP32 di simulator Wokwi, tanpa membeli komponen.

Tutorial lengkapnya: Bikin Kipas Otomatis Pengukur Suhu (Proyek IoT ESP32 di Simulator Wokwi) (playlist Proyek Pemrograman Sederhana).
Subscribe: https://www.youtube.com/@iTeachSWE
#shorts #iot #esp32 #belajarcoding

**Video terkait:** Bikin Kipas Otomatis Pengukur Suhu (Proyek IoT ESP32 di Simulator Wokwi)
