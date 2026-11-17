"""Rekam G03: branch, switch, salah branch + cherry-pick, fast-forward, merge commit."""
import sys, subprocess; sys.path.insert(0, "/home/user/git-seri/rek")
subprocess.run(["python3", "/home/user/git-seri/rek/siap_g03.py"], check=True)
from gs import *
from proyek import git
P = "/home/user/proyek/raka/siantre"
g = GS(P, graf_repo=P, tempat=False)
g.lebar_sidebar(170); g.tombol("Control+Backquote", 2.0); g.tinggi_panel(0.56)
g.buka("public/tv.js"); g.terminal()
g.mulai("G03")
g.tanda("awal"); time.sleep(1.5)
g.perintah("git log --oneline", tunggu=3.0); g.tanda("awal_log")
# --- membuat branch
g.bersih(); g.tanda("switch_c"); g.perintah("git switch -c fitur/suara-panggilan", tunggu=2.5); g.perintah("git branch", tunggu=3.0); g.tanda("switch_c_selesai")
# --- commit di branch
g.buka("public/tv.js"); g.ke_baris(2); g.tombol("End", 0.3); g.tanda("tulis1")
g.ketik("\n\nfunction bacakanNomor(nomor) {\n  const ucapan = new SpeechSynthesisUtterance('Nomor ' + nomor);\n  ucapan.lang = 'id-ID';\n  speechSynthesis.speak(ucapan);\n}", 24); g.simpan(); g.tanda("tulis1_selesai")
g.terminal(); g.bersih(); g.perintah('git commit -am "Tambah fungsi bacakan nomor"', tunggu=2.5); g.tanda("commit1")
g.buka("public/tv.js"); g.ke_baris(12); g.tombol("End", 0.3); g.tanda("tulis2"); g.ketik("\n  bacakanNomor(data.dipanggil);", 20); g.simpan(); g.tanda("tulis2_selesai")
g.terminal(); g.bersih(); g.perintah('git commit -am "Bacakan nomor saat dipanggil"', tunggu=2.0); g.perintah("git log --oneline", tunggu=3.5); g.tanda("commit2")
# --- tebak: pindah ke main (editor lebih tinggi supaya seluruh tv.js terlihat)
g.buka("public/tv.js"); g.ke_baris(1); g.terminal(); g.tinggi_panel(0.40); g.bersih(); time.sleep(1.0); g.tanda("tebak_mulai")
g.ketik("git switch main", 12); g.tanda("switch_tebak"); time.sleep(1.5); g.tombol("Enter", 3.5); g.tanda("switch_jalan")
g.perintah("git switch fitur/suara-panggilan", tunggu=3.5); g.tanda("switch_balik")
g.tinggi_panel(0.56)
# --- kesalahan: memperbaiki bug di branch fitur
g.bersih(); g.buka("antrean.js"); g.ke_baris(9); g.tombol("Home", 0.3); g.tombol("Shift+End", 0.6); g.tanda("bug_edit")
g.ketik("nomorTerakhir = nomorTerakhir + 1;\n  return formatNomor(nomorTerakhir);", 20); g.simpan(); time.sleep(0.6); g.tanda("bug_edit_selesai")
g.terminal(); g.bersih(); g.tanda("salah_commit"); g.perintah('git commit -am "Perbaiki nomor ganda"', tunggu=2.5); g.perintah("git log --oneline", tunggu=3.5); g.tanda("salah_selesai")
# --- perbaikan: cherry-pick ke main, revert di fitur
h = git(P, "rev-parse", "--short", "HEAD")
g.bersih(); g.tanda("cherry"); g.perintah("git switch main", tunggu=1.5); g.perintah(f"git cherry-pick {h}", tunggu=3.5); g.tanda("cherry_selesai")
g.perintah("git switch fitur/suara-panggilan", tunggu=1.5); g.tanda("revert"); g.perintah(f"git revert --no-edit {h}", tunggu=3.5); g.tanda("revert_selesai")
# --- kebiasaan
g.bersih(); g.perintah("git status", tunggu=4.0); g.tanda("status_branch")
# --- fast-forward
g.bersih(); g.tanda("ff"); g.perintah("git switch main", tunggu=1.0); g.perintah("git switch -c perbaikan/teks-tombol", tunggu=1.5)
g.buka("public/index.html"); g.ke_baris(11, 28); g.tombol("Control+Shift+ArrowRight", 0.3); g.tombol("Control+Shift+ArrowRight", 0.5); g.ketik("Nomor Antrean", 16); g.simpan(); time.sleep(0.5); g.tanda("ff_edit")
g.terminal(); g.bersih(); g.perintah('git commit -am "Perjelas teks tombol"', tunggu=2.0); g.perintah("git switch main", tunggu=1.5); g.tanda("ff_merge")
g.perintah("git merge perbaikan/teks-tombol", tunggu=4.0); g.tanda("ff_selesai")
g.perintah("git branch -d perbaikan/teks-tombol", tunggu=2.0); g.tanda("ff_hapus")
# --- merge commit
g.bersih(); g.tanda("merge"); g.perintah("git merge fitur/suara-panggilan", tunggu=3.5); g.tanda("merge_jalan")
g.bersih(); g.perintah("git log --oneline --graph -9", tunggu=4.5); g.tanda("graph")
g.perintah("git branch -d fitur/suara-panggilan", tunggu=3.0); g.tanda("akhir_hapus")
time.sleep(2.0); g.tanda("akhir")
g.selesai()
