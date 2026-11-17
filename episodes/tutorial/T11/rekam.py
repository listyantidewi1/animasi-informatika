import sys, time
sys.path.insert(0, "/home/user/tut/alat"); sys.path.append("/home/user/tut/T11")
from rekam import Rekaman
from durasi import beat
from jupy import J, sel
from sel import C0, C1, C2, C3, C4, C5
D = beat("T11")
r = Rekaman("/home/user/tut/T11/rek", "http://localhost:8888/notebooks/T11_spam.ipynb"); pg = r.pg; j = J(r)
pg.wait_for_selector(".jp-Cell .cm-content"); time.sleep(4); r.gerak(600, 500, 0.01)
r.mulai(); time.sleep(0.5); r.kamera(None); j.masuk(0)
r.tanda("b03"); r.label("Tempel daftar pesan dari deskripsi video", 3.0); time.sleep(1.0); pg.keyboard.insert_text(C0); time.sleep(0.6)
j.fokus_sel(0, zoom=1.3); time.sleep(2.5); r.kamera(None); j.jalankan(0, 1.0)
j.ketik(C1, D[3] * 0.35, baris_baru=False); j.jalankan(1, 2.0); j.fokus_out(1, zoom=2.0); time.sleep(3.0); r.tanda("b03_akhir")
r.tanda("b05"); j.ketik(C2, D[5] * 0.55, baris_baru=False); j.jalankan(2, 2.0); j.fokus_out(2, zoom=2.2); time.sleep(3.0); r.tanda("b05_akhir")
r.tanda("b07"); j.ketik(C3, D[7] * 0.6, baris_baru=False); j.jalankan(3, 1.5); j.fokus_out(3, zoom=2.0); time.sleep(3.5); r.tanda("b07_akhir")
r.tanda("b09"); j.ketik(C4, 3.0, baris_baru=False); time.sleep(0.8); r.tanda("b09_tebak"); j.jalankan(4, 1.5); j.fokus_out(4, zoom=2.0); time.sleep(3.5); r.tanda("b09_salah")
j.ketik(C5, D[9] * 0.45, baris_baru=False); j.jalankan(5, 1.5); j.fokus_out(5, zoom=2.0); time.sleep(3.5); r.tanda("b09_akhir")
time.sleep(0.5); r.selesai(); print("selesai", r.log["durasi"])
