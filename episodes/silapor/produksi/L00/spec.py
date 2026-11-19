NAMA = "L00_pembuka"
REKAMAN = ["web", "web6", "web7"]
def A(nama, **k): return dict(k='adegan', nama=nama, **k)
def W(a, b, **k): return dict(k='rek', r='web', a=a, b=b, **k)
def W6(a, b, **k): return dict(k='rek', r='web6', a=a, b=b, **k)
def W7(a, b, **k): return dict(k='rek', r='web7', a=a, b=b, **k)
BEATS = {
 1: [A('judulVideo', min=5, a=dict(judul='SiLapor: lapor sarana\nsekolah dari HP', hook='Laravel + MySQL, dari memasang alat sampai online')),
     W6('b11_foto', 'b11_akhir', kalimat=1, maks=2.5), W7('b10_proses', 'b10_selesai', kalimat=2, maks=3), W7('b10_selesai', 'b10_akhir', maks=3),
     A('hpLayar', min=4, bobot=1, a=dict(img='/home/user/lapor/L08/hp_detail.png', judul='Siswa memantau dari HP', gulir=[0, 4], x=745)), A('janji', min=11, bobot=3)],
 2: [A('satuKalimat', min=12)],
 3: [W('b03', 'b03_masuk', kalimat=1, maks=2), W('b03_masuk', 'b03_14', maks=1.5), W('b03_14', 'b03_ganti', kalimat=2), W('b03_ganti', 'b03_13', kalimat=3), W('b03_13', 'b03_akhir', kalimat=4)],
 4: [W('b04', 'b04_pilih', kalimat=1, maks=2), W('b04_pilih', 'b04_buka', kalimat=2, maks=1.5), W('b04_buka', 'b04_akhir', maks=1.3), A('berbahaya', bg=True, min=10, a=dict(k=5))],
 5: [A('asisten', min=20)], 6: [A('sembilanBab', min=20)], 7: [A('bekal', min=20)], 8: [A('segmenAI', min=15)],
}
