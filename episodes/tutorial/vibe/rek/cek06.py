from hp import *; from isi_cepat import isi_cepat
for w in (320, 360, 412):
    h = HP("http://localhost:5173/", profil=f"/tmp/hpprof{w}", lebar=w); h.pg.reload(); h.tunggu(1)
    isi_cepat(h.pg); h.tunggu(0.5); h.foto(f"/tmp/c06_{w}_atas.png")
    h.pg.click(".bar-bawah button"); h.tunggu(0.8); h.foto(f"/tmp/c06_{w}_hitung.png")
    print(w, h.pg.evaluate("[innerWidth, document.documentElement.scrollWidth, document.querySelector('#hasil').getBoundingClientRect().top|0, innerHeight]"))
    h.tutup()
