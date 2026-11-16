import sys, time
sys.path.insert(0, "/home/user/tut/alat"); sys.path.append("/home/user/tut/T13")
from rekam import Rekaman
from durasi import beat
from jupy import J, sel
from sel import C0, C1, C2, C3, C4, C5
D = beat("T13")
r = Rekaman("/home/user/tut/T13/rek", "http://localhost:8888/notebooks/T13_chatbot.ipynb"); pg = r.pg; j = J(r)
pg.wait_for_selector(".jp-Cell .cm-content"); time.sleep(4); r.gerak(600, 500, 0.01)
def lihat(i, zoom=1.8, tahan=3.0): j.fokus_out(i, zoom=zoom); time.sleep(tahan)
def masuk_sel(i): pg.locator(sel(i)).scroll_into_view_if_needed(); time.sleep(0.3)
r.mulai(); time.sleep(0.5); r.kamera(None); j.masuk(0)
r.tanda("b03"); j.ketik(C0, D[3] * 0.6, baris_baru=False); j.jalankan(0, 1.5); lihat(0, 2.0, 3.5); r.tanda("b03_akhir")
r.tanda("b05"); j.ketik(C1, D[5] * 0.4, baris_baru=False); j.jalankan(1, 1.0); masuk_sel(2)
j.ketik(C2, D[5] * 0.45, baris_baru=False); j.jalankan(2, 2.0); r.tanda("b05_akhir")
r.tanda("b06"); masuk_sel(3); j.ketik(C3, 5.0, baris_baru=False); j.jalankan(3, 1.0)
j.jawab(3, "Perpus di mana ya?"); time.sleep(1.5); j.jawab(3, "Ulangan mtk kapan?"); time.sleep(1.5); j.jawab(3, "dah"); lihat(3, 1.8, 2.5); r.tanda("b06_akhir")
r.tanda("b08"); masuk_sel(4); j.masuk(4); j.ketik(C4, 1.5, baris_baru=False); j.jalankan(4, 1.0); pg.wait_for_selector(".jp-Stdin-input"); time.sleep(0.5); r.tanda("b08_tebak"); j.jawab(4, "Siapa penemu lampu?"); time.sleep(2.0)
j.jawab(4, "dah"); lihat(4, 2.0, 3.0); r.tanda("b08_salah")
masuk_sel(5); j.masuk(5); j.ketik(C5, D[8] * 0.4, baris_baru=False); j.jalankan(5, 1.0)
j.jawab(5, "Siapa penemu lampu?"); time.sleep(1.5); j.jawab(5, "Perpus di mana ya?"); time.sleep(1.5); j.jawab(5, "dah"); lihat(5, 1.8, 3.0); r.tanda("b08_akhir")
time.sleep(0.5); r.selesai(); print("selesai", r.log["durasi"])
