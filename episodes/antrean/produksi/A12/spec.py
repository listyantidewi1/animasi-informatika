NAMA = "A12_deploy"
REKAMAN = ["rek", "web"]
def A(nama, **k): return dict(k='adegan', nama=nama, **k)
def R(a, b, **k): return dict(k='rek', a=a, b=b, **k)
def W(a, b, **k): return dict(k='rek', r='web', a=a, b=b, **k)
BEATS = {
 1: [A('kartuBab', a=dict(bab='BAB 12', judul='Online dengan\nDocker dan HTTPS', sub='Dari laptop ke HP pelanggan', lapis='deploy')), A('keluarLaptop', min=8)],
 2: [A('arsitekturVPS')],
 3: [A('envRahasia', min=12), R('b03', 'b03_akhir', speed=2, maks=3)],
 4: [A('lapisanDocker', min=14), R('b04', 'b04_akhir', speed=3, maks=5)],
 5: [A('composeTiga', min=14), R('b05', 'b05_sorot', speed=4, maks=8), R('b05_sorot', 'b05_akhir', maks=1.6)],
 6: [R('b06', 'b06_build', speed=2, maks=3), R('b06_up', 'b06_akhir', speed=1.5, maks=3)],
 7: [A('proxyBalik', min=10), R('b07', 'b07_express', speed=4, maks=8), R('b07_express', 'b07_akhir', speed=2, maks=3)],
 8: [A('httpsWifi', min=14), W('https', 'https_akhir', maks=1.4)],
 9: [A('backupMalam', min=12), R('b09', 'b09_akhir', speed=3, maks=6), R('b09_jalan', 'b09_jalan_akhir', speed=1.5, maks=2.5)],
 10: [A('alurUpdate')],
 11: [A('cekAI12', min=12), R('b11', 'b11_akhir', speed=3, maks=5)],
 12: [A('bufferNginx')],
 13: [A('rahasiaBocor')],
 14: [W('final', 'akhir', maks=1.4)],
 15: [A('daftarPeriksa')],
 16: [A('penutup')],
}

# --- Sorot baris: potongan pada kecepatan asli, mulai tepat pada kalimat ke-k (0 = kalimat pertama), ditahan sampai bagian berikutnya
def S(h, d, k=None):
    p = dict(k='rek', a=h - 0.15, b=h + d - 0.45, asli=True)
    if k is not None: p['kalimat'] = k
    return p
BEATS[4] = [A('lapisanDocker', min=14), R('b04', 61.6, speed=3, maks=5), S(61.7, 3, 3), S(65.8, 2.5, 4)]
BEATS[5] = [A('composeTiga', min=4), R(91.0, 'b05_sorot', speed=5, maks=8, kalimat=1), S(112.6, 2.5), S(116.5, 2.5, 2)]
BEATS[7] = [A('proxyBalik', min=7), R('b07', 'b07_express', speed=4, maks=8), R('b07_express', 173.0, speed=2, maks=3), S(173.1, 3, 3)]
BEATS[11] = [A('cekAI12', min=12), R('b11', 229.4, speed=3, maks=5), S(229.5, 3)]
