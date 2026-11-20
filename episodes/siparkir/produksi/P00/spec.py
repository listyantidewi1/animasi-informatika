NAMA = "P00_pembuka"
REKAMAN = ["web8", "web10"]
D = "/home/user/parkir/P00/"
def A(nama, **k): return dict(k='adegan', nama=nama, **k)
def W8(a, b, **k): return dict(k='rek', r='web8', a=a, b=b, **k)
def W10(a, b, **k): return dict(k='rek', r='web10', a=a, b=b, **k)
BEATS = {
 1: [A('pembuka', a=dict(imgBuka=D + 'pembuka.png')),
     W8('b07_plat', 'b07_akhir', kalimat=1, maks=3), W8('b09_biaya', 'b09_akhir', kalimat=2, maks=3), W10('b06_hasil', 'b06_harian', kalimat=3, maks=3), A('janji', kalimat=4, min=8)],
 2: [A('satuKalimat', min=10)],
 3: [A('tiketSalah', min=18, a=dict(imgTiket=D + 'tiket_ai.png', rMasuk=[0, .765, 1, .042]))],
 4: [A('rekapSalah', min=20, a=dict(imgRekap=D + 'rekap_ai_p.png', rTotal=[.041, .51, .451, .185]))],
 5: [A('asisten', min=20)], 6: [A('petaBab', min=14)], 7: [A('bekal', min=16)], 8: [A('segmenAI', min=20)],
}
