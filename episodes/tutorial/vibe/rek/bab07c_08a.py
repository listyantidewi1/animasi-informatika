from vc import *
CONTOH = "Patungan Kafe Senja, 17 Nov\nTotal struk Rp187.110 (ditalangi Andi)\n\nBela  Rp50.300\nCitra Rp47.100\nDimas Rp39.700\n\nBagian Andi Rp50.300. Kelebihan Rp290 karena pembulatan ke atas.\nTransfer ke Andi ya."
v = VC("/home/user/vibe/raw/V07c")
v.pilih_terminal(0)
v.mulai("/home/user/vibe/raw/V07c"); v.tanda("mulai"); v.tunggu(1)
v.tanda("prompt_commit"); v.prompt("Sudah saya cek di HP dengan data rusak. Commit dengan pesan \"Simpan offline dan riwayat\".", cps=45, batas=300)
v.tanda("commit_jadi"); v.tunggu(2); v.stop()
v.perintah("/clear", tunggu=2)
v.mulai("/home/user/vibe/raw/V08a"); v.tanda("mulai"); v.tunggu(1)
v.tanda("prompt_bagikan")
v.prompt("Tambahkan tombol \"Bagikan\" yang mengirim ringkasan dengan format persis seperti contoh ini:\n\n" + CONTOH + "\n\nPakai Web Share API kalau tersedia. Kalau tidak tersedia, buka link wa.me dengan teks itu.\nBuat fungsi pembuat teksnya terpisah dan beri tes.", cps=45, batas=900)
v.tanda("bagikan_jadi"); v.tunggu(3)
v.tanda("vitest"); v.bash("npx vitest run", tunggu=12); v.tanda("vitest_akhir"); v.tunggu(2)
v.stop(); v.foto("/tmp/v08a.png"); v.ctx.close(); v.pw.stop()
