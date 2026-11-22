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
    p = dict(k='rek', a=h, b=h, da=-0.15, db=d - 0.45, asli=True)  # h = tanda 'sorotN' (otomatis dari rekam_vs.kamera_editor(zoom=...))
    if k is not None: p['kalimat'] = k
    return p
BEATS[4] = [A('lapisanDocker', min=14), R('b04', 'sorot1', db=-0.1, speed=3, maks=5), S('sorot1', 3, 3), S('sorot2', 2.5, 4)]
BEATS[5] = [A('composeTiga', min=4), R('b05', 'b05_sorot', speed=5, maks=8, kalimat=1), S('sorot3', 2.5), S('sorot4', 2.5, 2)]
BEATS[7] = [A('proxyBalik', min=7), R('b07', 'b07_express', speed=4, maks=8), R('b07_express', 'sorot5', db=-0.1, speed=2, maks=3), S('sorot5', 3, 3)]
BEATS[11] = [A('cekAI12', min=12), R('b11', 'sorot6', db=-0.1, speed=3, maks=5), S('sorot6', 3)]

# --- Adegan persiapan sisipan (naskah_sisip.json, beat bernomor pecahan)
SKRIP = ["/home/user/antre/alat/web/siap.js"]
BEATS[5.2] = [A('sshDocker')]
BEATS[5.4] = [A('dnsA')]
BEATS[5.6] = [A('certbot')]
