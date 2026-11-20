import sys, time, subprocess; sys.path.insert(0, "/home/user/pinjam/alat"); sys.path.insert(0, "/home/user/pinjam/P00")
from webbantu import Peramban, server, matikan
from balap import balap
subprocess.run("php database/isi_contoh.php", shell=True, cwd="/home/user/pinjam-ai", capture_output=True)
server("/home/user/pinjam-ai", 8001); assert balap()
w = Peramban("/home/user/pinjam/P00/web_ai", devtools=False)
w.mulai(); w.kamera(None); time.sleep(0.6); w.tanda("mulai")
w.alamat("http://localhost:8001", tampil="localhost:8001", jeda=1.2); w.label("Contoh kode bergaya hasil AI", 6.0)
w.ketik("input[name=username]", "yusuf", cps=12); w.ketik("input[name=sandi]", "rahasia123", cps=16); w.klik("form.login button", jeda=1.5)
w.klik("nav a:has-text('Sedang dipinjam')", jeda=1.5); w.tanda("dipinjam"); w.kam("table", zoom=1.15); w.label("Lab punya 2 kamera, yang tercatat dipinjam: 3", 8.0); time.sleep(3.0)
for i, s in enumerate(w.pg.locator("tr:has-text('Kamera DSLR')").all()):
    s.evaluate("e => { e.style.transition = 'background .5s'; e.style.background = '#fef3c7'; }"); time.sleep(1.0)
time.sleep(8.0); w.kamera(None); time.sleep(1.5); w.tanda("akhir"); w.selesai(); matikan(8001)
print("baris kamera:", w and subprocess.run(["mysql", "sipinjam_ai", "-N", "-e", "SELECT COUNT(*) FROM peminjaman p JOIN alat a ON a.id=p.alat_id WHERE a.kode='KAM-01' AND p.status='disetujui'"], capture_output=True, text=True).stdout)
