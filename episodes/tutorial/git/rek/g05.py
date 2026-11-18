"""Rekam G05: remote (Gitea lokal), push -u, clone, push ditolak, pull, pull request + review + merge."""
import sys, subprocess; sys.path.insert(0, "/home/user/git-seri/rek")
subprocess.run(["python3", "/home/user/git-seri/rek/siap_g05.py"], check=True, capture_output=True)
from gs import *
from proyek import git, ganti, commit
import siap_g05 as S5
P = "/home/user/proyek/raka/siantre"; GT = "http://localhost:3000"
g = GS(P, graf_repo=P, tempat=False, web=GT + "/user/login", web_dsf=2.08)  # browser diperbesar supaya teks Gitea terbaca
web2 = Jendela(g.pw, GT + "/user/login", W + 100, 0, 1200, 900, "/tmp/gsprof_web2", dsf=2.08)
def login(j, u):
    pg = j.pg; pg.goto(GT + "/user/login"); pg.fill("#user_name", u); pg.fill("#password", "siantre123"); pg.click("form button.primary"); pg.wait_for_load_state()
LUAR = W + 60
def tampil_web(j):
    j.letak(0, 0, W, H)
    for o in [g.web, web2]:
        if o is not j: o.letak(LUAR, 0, W, H)
    g.vs.letak(LUAR, 0, W, H); g.graf.letak(LUAR, 0, W - 1600, H); time.sleep(1.0)
def tampil_vs():
    g.vs.letak(0, 0, W, H); g.graf.letak(LUAR, 0, W - 1600, H)  # layar penuh: dua terminal berdampingan tetap lega
    for o in [g.web, web2]: o.letak(LUAR, 0, W, H)
    time.sleep(1.0)
def ketik_web(pg, sel, teks, cps=14): pg.click(sel); pg.keyboard.type(teks, delay=1000 / cps)
# --- persiapan (di luar rekaman)
login(g.web, "raka"); login(web2, "nadia")
tampil_vs()
g.sidebar(False); g.tombol("Control+Backquote", 2.0); g.tinggi_panel(0.6)
g.buka("public/tv.html"); g.terminal()
g.palet("Terminal: Split Terminal"); time.sleep(2.0)
g.ketik("MULAI=/home/user/proyek/nadia exec bash --rcfile /home/user/proyek/nadia.rc", 40); g.tombol("Enter", 2.0)
g.terminal(0); g.bersih()
g.web.pg.goto(GT + "/"); time.sleep(1.5)
tampil_web(g.web)
g.mulai("G05")
g.tanda("awal"); time.sleep(2.0)
# --- membuat repository kosong di Gitea
g.web.pg.goto(GT + "/repo/create"); time.sleep(1.5); g.tanda("repo_form")
ketik_web(g.web.pg, "#repo_name", "siantre", 8); time.sleep(1.0)
g.web.pg.get_by_role("button", name="Create Repository").click(); g.web.pg.wait_for_load_state(); time.sleep(3.0); g.tanda("repo_dibuat"); time.sleep(2.0)
# --- remote add + push -u
tampil_vs(); g.terminal(0); g.tanda("remote")
g.perintah("git remote add origin http://localhost:3000/raka/siantre.git", tunggu=1.0)
g.perintah("git push -u origin main", tunggu=4.0); g.tanda("push1_selesai")
tampil_web(g.web); g.web.pg.goto(GT + "/raka/siantre"); time.sleep(3.0); g.tanda("repo_isi"); time.sleep(2.0)
# --- clone oleh Nadia
S5.api("PUT", "/repos/raka/siantre/collaborators/nadia", {"permission": "write"})
tampil_vs(); g.terminal(1); g.tanda("clone")
g.perintah("git clone http://localhost:3000/raka/siantre.git", tunggu=3.0); g.perintah("cd siantre", tunggu=0.8)
g.perintah("git log --oneline", tunggu=3.0); g.tanda("clone_selesai")
# --- Nadia push lebih dulu
g.bersih(); g.tanda("nadia_ubah")
g.perintah("sed -i 's/Nomor dipanggil/Nomor yang dipanggil/' public/tv.html", tunggu=1.0)
g.perintah('git commit -am "Perjelas judul layar TV"', tunggu=2.0); g.perintah("git push", tunggu=4.0); g.tanda("nadia_push")
# --- Raka sudah commit di laptopnya (di luar kamera), lalu push
g.tanda("jeda"); ganti(P, "server.js", "const JAM_BUKA = '08.00';", "const JAM_BUKA = '08.00';\nconst JAM_TUTUP = '16.00';"); commit(P, "Tambah jam tutup", "2026-11-17T10:42:00+07:00"); time.sleep(1.5)
g.terminal(0); g.bersih(); g.tanda("raka_log"); g.perintah("git log --oneline -3", tunggu=2.5)
g.ketik("git push", 12); g.tanda("push_tebak"); time.sleep(1.5); g.tombol("Enter", 4.0); g.tanda("ditolak"); time.sleep(1.5)
# --- pull yang benar
g.bersih(); g.tanda("pull"); g.perintah("git pull", tunggu=4.0); g.tanda("pull_tanya")
g.perintah("git config pull.rebase false", tunggu=1.0); g.perintah("git pull", tunggu=4.0); g.tanda("pull_ok")
g.bersih(); g.perintah("git log --oneline --graph -5", tunggu=3.5); g.tanda("graph")
g.perintah("git push", tunggu=4.0); g.tanda("push_ok"); time.sleep(1.0)
# --- pull request
g.bersih(); g.tanda("pr_branch"); g.perintah("git switch -c fitur/laporan-tunggu", tunggu=1.5)
g.buka("antrean.js"); g.ke_baris(13); g.tombol("Home", 0.3); g.tanda("pr_tulis")
g.ketik("function rataRataTunggu(daftarMenit) {\n  const total = daftarMenit.reduce((a, b) => a + b, 0);\n  return total / daftarMenit.length;\n}\n\n", 26); g.simpan(); time.sleep(0.8); g.tanda("pr_tulis_selesai")
g.terminal(0); g.bersih(); g.perintah('git commit -am "Tambah laporan rata-rata waktu tunggu"', tunggu=2.0)
g.perintah("git push -u origin fitur/laporan-tunggu", tunggu=4.0); g.tanda("pr_push")
rp = g.web.pg
for _ in range(20):
    rp.goto(GT + "/raka/siantre/compare/main...fitur/laporan-tunggu")
    if rp.locator("button.show-form").count(): break
    time.sleep(1)
tampil_web(g.web); time.sleep(1.5); g.tanda("pr_form")
rp.click("button.show-form"); time.sleep(1.0)
rp.fill("#issue_title", ""); ketik_web(rp, "#issue_title", "Tambah laporan rata-rata waktu tunggu", 16)
ketik_web(rp, "textarea[name=content]", "Apa yang berubah: fungsi rataRataTunggu menghitung rata-rata waktu tunggu dalam menit.\n\nCara menguji: panggil rataRataTunggu([5, 10, 15]), hasilnya 10.", 30)
time.sleep(1.0); g.tanda("pr_isi"); rp.get_by_role("button", name="Create Pull Request").click(); rp.wait_for_url("**/pulls/1"); time.sleep(3.0); g.tanda("pr_dibuat"); time.sleep(1.5)
# --- review oleh Nadia
np_ = web2.pg; np_.goto(GT + "/raka/siantre/pulls/1/files"); np_.wait_for_load_state(); time.sleep(0.5)
tampil_web(web2); time.sleep(2.0); g.tanda("review")
tr = np_.locator("tr", has_text="daftarMenit.length").first; tr.hover(); time.sleep(0.8); tr.locator(".add-code-comment-right").click(); time.sleep(1.0)
ketik_web(np_, ".comment-code-cloud textarea", "Kalau hari itu belum ada antrean, daftarMenit kosong dan hasilnya NaN. Bisa dicek dulu panjang daftarnya?", 30)
time.sleep(1.0); g.tanda("review_komentar"); np_.get_by_role("button", name="Start review").click(); time.sleep(2.0)
np_.locator("button", has_text="Review").first.click(); time.sleep(1.0)
ketik_web(np_, "textarea:visible >> nth=-1", "Ada satu catatan di baris pembagian.", 30); time.sleep(0.8)
np_.get_by_role("button", name="Request changes").click(); np_.wait_for_load_state(); time.sleep(3.0); g.tanda("review_selesai")
# --- revisi oleh Raka
tampil_vs(); g.buka("antrean.js"); g.ke_baris(13); g.tombol("End", 0.3); g.tanda("revisi")
g.ketik("\n  if (daftarMenit.length === 0) return 0;", 22); g.simpan(); time.sleep(0.8)
g.terminal(0); g.bersih(); g.perintah('git commit -am "Tangani hari tanpa antrean"', tunggu=2.0); g.perintah("git push", tunggu=4.0); g.tanda("revisi_push")
np_.goto(GT + "/raka/siantre/pulls/1"); time.sleep(1.0); tampil_web(web2); np_.mouse.wheel(0, 500); time.sleep(3.0); g.tanda("revisi_pr")
# --- approve + merge
np_.goto(GT + "/raka/siantre/pulls/1/files"); time.sleep(2.0); g.tanda("approve")
np_.locator("button", has_text="Review").first.click(); time.sleep(1.0)
ketik_web(np_, "textarea:visible >> nth=-1", "Sudah aman. Terima kasih!", 30); time.sleep(0.6)
np_.get_by_role("button", name="Approve").click(); np_.wait_for_load_state(); time.sleep(1.5)
np_.goto(GT + "/raka/siantre/pulls/1"); time.sleep(1.0)
tombol = np_.get_by_role("button", name="Create merge commit").first; tombol.scroll_into_view_if_needed(); time.sleep(2.0); g.tanda("merge_tombol")
tombol.click(); time.sleep(1.5); np_.locator("form button.ui.primary.button:visible", has_text="Create merge commit").last.click(); time.sleep(1.0)
np_.goto(GT + "/raka/siantre/pulls/1"); time.sleep(3.0); g.tanda("merged")
# --- kedua laptop memperbarui main
tampil_vs(); g.terminal(0); g.bersih(); g.tanda("tarik")
g.perintah("git switch main", tunggu=1.5); g.perintah("git pull", tunggu=4.0); g.perintah("git branch -d fitur/laporan-tunggu", tunggu=2.0); g.tanda("raka_pull")
g.terminal(1); g.bersih(); g.perintah("git pull", tunggu=4.0); g.tanda("nadia_pull")
time.sleep(2.0); g.tanda("akhir")
g.selesai()
