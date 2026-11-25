from hp import *; from isi_cepat import isi_cepat
h = HP("http://localhost:5173/", profil="/tmp/hpprof412", lebar=412); h.pg.evaluate("localStorage.clear()"); h.pg.reload(); h.tunggu(1)
h.mulai("/home/user/vibe/raw/H07d"); h.tanda("mulai"); h.tunggu(1)
h.tanda("rusak2"); h.pg.evaluate("localStorage.setItem('patungan:riwayat', JSON.stringify([{tempat:'Kafe Senja', tanggal:'2026-11-10'}]))"); h.tunggu(1)
h.tanda("muat_ulang"); h.pg.reload(); h.tunggu(3.5); h.foto("/tmp/h07d_1.png")
isi_cepat(h.pg); h.tunggu(1)
h.tanda("hitung"); h.tap(".bar-bawah button", 3.5); h.foto("/tmp/h07d_2.png")
h.tanda("akhir"); h.stop(); h.pg.evaluate("localStorage.clear()"); h.tutup()
