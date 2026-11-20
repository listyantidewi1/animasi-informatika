import sys, time, subprocess, re; sys.path.insert(0, "/home/user/parkir/alat")
from webbantu import Peramban, server, matikan
P = "/home/user/proyek/siparkir"
def bahasa(x): s = open(P + "/.env").read(); open(P + "/.env", "w").write(re.sub(r"APP_LOCALE=\w+", "APP_LOCALE=" + x, s))
subprocess.run(f"rm -f {P}/storage/framework/sessions/*", shell=True); subprocess.run(["/home/user/parkir/alat/bersih.sh", P, "php artisan cache:clear -q"])
bahasa("en"); server(waktu="2026-11-23 10:02:00")
w = Peramban("/home/user/parkir/P06/web", devtools=False)
def isi(sel, teks, cps=9):
    w.klik(sel, jeda=0.25); w.pg.keyboard.press("Control+a"); time.sleep(0.3)
    for ch in teks: w.pg.keyboard.type(ch); time.sleep(1 / cps)
    time.sleep(0.4)
w.mulai(); w.kamera(None); time.sleep(0.6)
w.alamat("http://localhost:8000", tampil="localhost:8000", jeda=1.2)
w.ketik('input[name=email]', "sinta@nusabakti.test", 18); w.ketik('input[name=password]', "rahasia123", 18); w.klik('button.tombol', jeda=1.2)
# b05: pesan validasi bahasa Inggris, lalu Indonesia
w.klik('a[href="/admin/area/create"]', jeda=1.0); w.ketik('input[name=name]', "Area Guru", 14); w.ketik('input[name=capacity]', "5000", 10); time.sleep(0.6)
w.tanda("b05_en"); w.label("Kapasitas 5000: melewati batas", 2.5); time.sleep(1.5); w.klik('button.tombol', jeda=1.2); w.kam("ul.galat", zoom=1.7); w.label("Pesan masih berbahasa Inggris", 4.0); time.sleep(4.5); w.tanda("b05_en_akhir")
w.kamera(None); time.sleep(0.8); bahasa("id"); server(waktu="2026-11-23 10:04:00"); time.sleep(0.5)
w.tanda("b05_id"); w.label("Setelah lang/id disalin dan APP_LOCALE=id", 3.0); time.sleep(1.0); w.klik('button.tombol', jeda=1.2); w.kam("ul.galat", zoom=1.7); w.label("Sekarang berbahasa Indonesia", 4.0); time.sleep(4.5); w.tanda("b05_id_akhir")
w.kamera(None); time.sleep(0.6); w.klik('a.tombol.abu', jeda=1.0)
# b08: ubah tarif dua kali, lalu lihat log
w.tanda("b08"); w.label("Masuk sebagai Bu Sinta (admin)", 3.0); w.gerak(1500, 40); time.sleep(3.0)
w.tanda("b08_ubah"); w.klik('a[href="/admin/tarif"]', jeda=1.2); w.klik('a[href="/admin/tarif/1/edit"]', jeda=1.0); w.kam("form.kartu", zoom=1.5); isi('input[name=first_hour]', "3000"); w.klik('button.tombol', jeda=1.2)
w.kamera(None); w.label("Jam pertama motor: Rp3.000", 3.0); time.sleep(3.2)
w.klik('a[href="/admin/tarif/1/edit"]', jeda=1.0); w.kam("form.kartu", zoom=1.5); isi('input[name=first_hour]', "2000"); w.klik('button.tombol', jeda=1.2)
w.kamera(None); w.label("Dikembalikan ke Rp2.000", 2.5); time.sleep(2.8)
w.tanda("b08_log"); w.klik('a[href="/admin/log"]', jeda=1.5)
w.tanda("b08_tabel"); w.kam("table", zoom=1.4); w.label("Dua perubahan tercatat: waktu, pelaku, dan isinya", 6.0); time.sleep(6.5); w.tanda("b08_akhir")
w.kamera(None); time.sleep(0.5); w.selesai(); matikan()
