import sys, time
sys.path.insert(0, "/home/user/tut/alat")
from rekam import Rekaman
from durasi import beat
from jupy import J, sel
D = beat("T02")
L = 'soal = [\n    ("Apa ibu kota Indonesia?", "jakarta"),\n    ("Berapa 7 x 8?", "56"),\n    ("Planet apa yang paling dekat dengan Matahari?", "merkurius"),\n]'
F = 'skor = 0\nfor pertanyaan, kunci in soal:'
P = '''    jawaban = input(pertanyaan + " ")
    jawaban = jawaban.strip().lower()
    if jawaban == kunci:
        print("Benar!")
        skor = skor + 1
    else:
        print("Salah. Jawabannya", kunci)'''
N = 'nilai = skor / len(soal) * 100\nprint(f"Skor kamu {skor} dari {len(soal)} ({round(nilai)}%)")'
r = Rekaman("/home/user/tut/T02/rek", "http://localhost:8888/notebooks/T02_kuis.ipynb"); pg = r.pg; j = J(r)
pg.wait_for_selector(".jp-Cell .cm-content"); time.sleep(4); r.gerak(600, 500, 0.01)
r.mulai(); time.sleep(0.5); r.kamera(None)
j.masuk(0)
r.tanda("b04"); j.ketik(L, D[4] * 0.5, baris_baru=False); time.sleep(0.3); r.tanda("b04_akhir")
r.tanda("b06"); pg.keyboard.press("Control+End"); pg.keyboard.press("Enter"); j.ketik(F, D[6] * 0.45); time.sleep(0.3); r.tanda("b06_akhir")
r.tanda("b08"); j.ketik(P, D[8] * 0.6); time.sleep(0.4); r.tanda("b08_akhir")
r.tanda("b10"); j.jalankan(0, 1.0)
for jw in ["JAKARTA", "54", "Merkurius"]: j.jawab(0, jw)
time.sleep(0.4); j.fokus_out(0, zoom=1.7); time.sleep(2.5); r.tanda("b10_akhir")
j.gulir_atas(); j.masuk(0)
r.tanda("b12"); pg.keyboard.press("Enter"); j.ketik(N, D[12] * 0.85); time.sleep(0.4); r.tanda("b12_akhir")
# b13: tambah soal, jalankan, lalu kesalahan tanda kutip
r.tanda("b13"); pg.keyboard.press("Control+Home")
for _ in range(3): pg.keyboard.press("ArrowDown")
pg.keyboard.press("End"); time.sleep(0.3)
j.ketik('    ("Hewan apa yang disebut raja hutan?", "singa"),', 4.5)
j.jalankan(0, 1.0)
for jw in ["jakarta", "56", "merkurius", "singa"]: j.jawab(0, jw, cps_=12)
time.sleep(0.4); j.fokus_out(0, zoom=1.9, tinggi=120); time.sleep(2.5)
j.gulir_atas(); j.masuk(0, akhir=False); pg.keyboard.press("Control+Home"); pg.keyboard.press("ArrowDown"); pg.keyboard.press("End")
for _ in range(2): pg.keyboard.press("ArrowLeft")
l = r.baris_aktif(); r.kamera([10, l["y"] - 80, 900, 200], zoom=1.9, pad=10); time.sleep(1.2)
pg.keyboard.press("Backspace"); time.sleep(1.0)
j.jalankan(0, 1.5); j.fokus_out(0, zoom=1.6); time.sleep(4)
r.tanda("b13_akhir")
time.sleep(0.5); r.selesai(); print("selesai", r.log["durasi"])
