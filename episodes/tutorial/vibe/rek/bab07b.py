from vc import *
v = VC("/home/user/vibe/raw/V07b")
v.pilih_terminal(0)
v.mulai("/home/user/vibe/raw/V07b"); v.tanda("mulai"); v.tunggu(1)
v.tanda("prompt_rusak")
v.prompt("Saya sengaja merusak data di localStorage. Teks yang bukan JSON aman.\nTapi riwayat dari versi lama (entri tanpa total) membuat tombol Hitung menampilkan\n\"Cannot read properties of undefined (reading 'toLocaleString')\".\nKalau data di localStorage tidak bisa dibaca, jangan sampai aplikasi berhenti.\nLewati entri yang rusak dan tampilkan pesan singkat. Tambahkan tesnya.\nJangan mengubah src/hitung.js.", cps=45, batas=900)
v.tanda("rusak_jadi"); v.tunggu(3)
v.tanda("vitest"); v.bash("npx vitest run", tunggu=12); v.tanda("vitest_akhir"); v.tunggu(2)
v.stop(); v.foto("/tmp/v07b.png"); v.ctx.close(); v.pw.stop()
