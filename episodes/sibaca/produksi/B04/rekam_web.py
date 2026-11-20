import sys, time; sys.path.insert(0, "/home/user/baca/alat")
from webbantu import Peramban
from tulis import server, matikan, sh, db
print(sh("git reset -q --hard bab-04 && git log --oneline | head -1").stdout); db("contoh"); server(vite=False)
w = Peramban("/home/user/baca/B04/web", devtools=False)
import json
def rapi(route):  # JSON ditampilkan berindentasi supaya terbaca (isi datanya tidak diubah)
    r = route.fetch(); route.fulfill(status=r.status, content_type="application/json; charset=utf-8", body=json.dumps(r.json(), indent=2, ensure_ascii=False))
w.pg.route("**/api/buku*", rapi)
w.mulai(); w.kamera(None); time.sleep(1.0)
w.tanda("bumi"); w.kam_alamat(1.5); w.alamat("http://localhost:3000/api/buku?q=bumi", tampil="localhost:3000/api/buku?q=bumi", cps=10, jeda=0); w.pg.wait_for_timeout(1500)  # wait_for_timeout memberi giliran ke penangan route
w.tanda("bumi_hasil"); time.sleep(1.5); w.kam(rect=[0, 0, 880, 470]); time.sleep(1.0)
w.label("Dua buku, langsung dari MySQL", 5.0); time.sleep(8.0); w.tanda("bumi_akhir")
w.kamera(None); time.sleep(1.0)
w.tanda("injeksi"); w.kam_alamat(1.5); w.alamat("http://localhost:3000/api/buku?q=' UNION SELECT nis, sandi_hash FROM pengguna -- ", tampil="localhost:3000/api/buku?q=' UNION SELECT nis, sandi_hash FROM pengguna -- ", cps=14, jeda=0); w.pg.wait_for_timeout(1500)
w.tanda("injeksi_hasil"); w.label("Daftar kosong: kiriman itu hanya dianggap judul buku", 6.0, "bawah"); time.sleep(7.5); w.tanda("injeksi_akhir")
w.selesai(); matikan()
