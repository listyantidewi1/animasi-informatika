from vc import *
v = VC("/home/user/vibe/raw/V09d")
v.pilih_terminal(0)
v.mulai("/home/user/vibe/raw/V09d"); v.tanda("mulai"); v.tunggu(1)
v.tanda("prompt_versi")
v.prompt("Saya build ulang setelah menambah kalimat itu, tapi browser tetap menampilkan versi lama.\nDi DevTools, cache masih patungan-v1 dan isinya berkas build yang lama.\nVERSI di sw.js harus dinaikkan manual, dan itu mudah lupa.\nBuat VERSI berubah otomatis di setiap build, tanpa plugin dan tanpa library baru.", cps=45, batas=900)
v.tanda("versi_jadi"); v.tunggu(3)
v.tanda("build"); v.bash("npm run build", tunggu=8); v.tanda("build_akhir"); v.tunggu(2)
v.stop(); v.foto("/tmp/v09d.png"); v.ctx.close(); v.pw.stop()
