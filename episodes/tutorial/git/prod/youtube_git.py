"""Metadata YouTube seri Git dan Kerja Tim (judul, deskripsi dengan chapter, tag, komentar tersemat, Short)."""
import os, re, sys
sys.path.insert(0, "/home/user/git-seri/prod")
import rencana_git as RC, short_git_isi as SI
ROOT = "/home/user/git-seri/prod/ep"
NO = {"G01": 1, "G02": 2, "G03": 3, "G04": 4, "G05": 5, "G06": 6}
POIN = {
 "G01": ["Konsep commit sebagai foto proyek, dan tiga tempat di Git: folder kerja, staging, repository", "git config, git init, git status, git add, git commit, git log", "Mencegah password di berkas .env ikut ter-commit dengan .gitignore dan git rm --cached", "Membaca git diff sebelum commit", "Kebiasaan aman saat memakai asisten AI: commit dulu, periksa diff, baru simpan"],
 "G02": ["Memilih alat mundur yang tepat: restore, amend, revert, reset", "git restore untuk perubahan yang belum di-commit", "git commit --amend untuk berkas yang lupa dimasukkan", "git revert untuk commit yang sudah dibagikan", "git reset --hard yang salah ketik, lalu diselamatkan dengan git reflog"],
 "G03": ["Branch adalah label, bukan salinan folder; HEAD menandai posisimu", "git switch -c dan berpindah branch", "Commit di branch yang salah, lalu dipindahkan dengan cherry-pick dan revert", "Merge fast-forward dan merge commit, dilihat dengan git log --graph"],
 "G04": ["Kapan konflik terjadi dan kenapa itu bukan error", "Membaca penanda <<<<<<< ======= >>>>>>>", "Membereskan konflik, menguji, lalu commit", "Penanda yang tertinggal menyebabkan SyntaxError, dan cara mencarinya dengan git grep", "git merge --abort saat bingung"],
 "G05": ["Remote, origin, push, fetch, dan pull", "Membuat repository di server Git (Gitea; langkahnya sama di GitHub dan GitLab)", "git push -u dan git clone", "Push ditolak: kenapa jangan --force, dan cara yang benar dengan git pull", "Pull request: membuat, review baris demi baris, revisi, approve, merge"],
 "G06": ["Alur kerja tim dari issue sampai tag rilis", "Pesan commit yang jelas: feat, fix, docs", "Memecah commit raksasa dengan git reset --soft dan git add -p", "git stash untuk pekerjaan setengah jadi", "Merge atau git pull --rebase: bedanya bagi sejarah proyek", "Memeriksa pesan commit buatan AI dengan git diff", "git tag v1.0.0 dan mengirim tag ke server"],
}
TAG = ["git", "git tutorial", "belajar git", "git bahasa indonesia", "git untuk pemula", "version control", "kerja tim programmer", "software engineering", "rekayasa perangkat lunak", "RPL"]
TAGX = {"G01": ["git commit", "git add", "gitignore", "git diff"], "G02": ["git reset", "git reflog", "git revert", "git restore", "git amend"],
        "G03": ["git branch", "git switch", "git merge", "cherry-pick"], "G04": ["merge conflict", "git conflict", "resolve conflict"],
        "G05": ["git push", "git pull", "pull request", "code review", "gitea", "github"], "G06": ["git rebase", "git stash", "git add -p", "git tag", "conventional commits", "git workflow"]}
RINGKAS = {"G01": "git add . ikut memasukkan .env berisi password. Keluarkan dengan git rm --cached .env, lalu tulis .env di .gitignore sebelum commit pertama.",
 "G02": "Salah ketik git reset --hard HEAD~3? Commit yang pernah dibuat masih tercatat di git reflog. Cari hash sebelum reset, lalu reset ke hash itu.",
 "G03": "Branch hanyalah label kecil yang menunjuk ke satu commit. Karena itu membuat branch sangat cepat, dan kamu bebas mencoba ide tanpa merusak main.",
 "G04": "CONFLICT bukan error: Git bertanya karena dua perubahan menyentuh baris yang sama. Pilih atau gabungkan, hapus semua penanda, lalu uji.",
 "G05": "Push ditolak (rejected) artinya server punya commit yang belum ada di laptopmu. Jangan --force di branch bersama: git pull dulu, periksa, lalu push.",
 "G06": "Pesan fix, update, coba lagi tidak menjelaskan apa-apa. Buat commit kecil dengan pesan jelas (fix: ..., feat: ...), dan pecah commit raksasa dengan git add -p."}
def ts(x): x = int(round(x)); return f"{x // 60}:{x % 60:02d}"
def bab_waktu(kode):
    D = {int(m.group(1)): float(m.group(2)) for m in re.finditer(rf"^{kode} b(\d+) D=([\d.]+)", open("/tmp/cek_semua.log").read(), re.M)}
    out, t = [], 0.0
    for i, (teks, parts) in enumerate(RC.EP[kode]):
        if not teks and parts[0]["nama"] == "kartuBab":
            a = parts[0]["a"]; out.append((t, a["judul"]))
        t += D[i]
    return [(0.0, "Pembuka")] + out
def nama(kode):
    return [x for x in os.listdir(f"{ROOT}/{kode}") if x.endswith(".mp4") and "_Short" not in x][0][:-4]
def daftar_seri(kode):
    return "\n".join(f"{'▶ ' if k == kode else ''}{k}. {RC.JUDUL[k]}" for k in NO)
J = {}
for kode in NO:
    hook = getattr(RC, "H" + kode[1:]).replace("Setelah menonton, kamu bisa ", "")
    judul = f"{RC.JUDUL[kode]} | Git dan Kerja Tim #{NO[kode]}"
    bab = bab_waktu(kode)
    d = [f"Setelah menonton video ini, kamu bisa {hook}", "",
         "Di video ini:", *[f"• {p}" for p in POIN[kode]], "",
         "Semua yang ada di layar adalah rekaman editor, terminal, dan server Git sungguhan, pada proyek kecil SiAntre (aplikasi antrean) yang dikerjakan Raka dan Nadia.", "",
         "Bab:", *[f"{ts(t)} {j}" for t, j in bab], "",
         "Seri Git dan Kerja Tim:", daftar_seri(kode), "",
         "Seri berikutnya di kanal ini memakai alur Git yang sama untuk membangun aplikasi Sistem Antrean dari nol.", "",
         "Narasi: Cahaya (suara sintetis ElevenLabs). Rekaman layar sungguhan (VS Code, terminal, dan server Gitea lokal); animasi penjelasan dibuat dengan kode oleh I Teach Software Engineering. Naskah disusun dengan bantuan AI (Claude buatan Anthropic) dan disunting manusia.", "",
         "Subscribe: https://www.youtube.com/@iTeachSWE", "",
         "#git #belajargit #programmer"]
    sem = f"Tantangan episode ini ada di akhir video. Kerjakan, lalu tulis di komentar perintah Git apa yang paling membantumu. Episode berikutnya: {RC.JUDUL['G0' + str(NO[kode] + 1)]}." if NO[kode] < 6 else "Ini episode terakhir seri Git dan Kerja Tim. Kerjakan tantangannya bersama satu teman, lalu ceritakan di komentar bagian alur mana yang paling sulit."
    S = SI.SH[kode]
    md = [f"# {kode} · Metadata YouTube", "", "## Video", "", f"**Judul:** {judul}", "", "**Deskripsi:**", "", "```", *d, "```", "",
          f"**Tag:** {', '.join(TAG + TAGX[kode])}", "", f"**Komentar tersemat:** {sem}", "",
          f"**Thumbnail:** {nama(kode)}_thumbnail.jpg  ·  **Subtitel:** {nama(kode)}.srt (Bahasa Indonesia)", "",
          "## Short", "", f"**Judul:** {S['kait']} #git #shorts", "", "**Deskripsi:**", "", "```",
          RINGKAS[kode], "",
          f"Episode lengkap: {RC.JUDUL[kode]} (Git dan Kerja Tim #{NO[kode]}), di kanal ini.", "Subscribe: https://www.youtube.com/@iTeachSWE", "#git #programmer #shorts", "```", "",
          f"**Subtitel:** {nama(kode)}_Short.srt · Hubungkan Short ke video lengkap lewat fitur \"Related video\" saat mengunggah."]
    import json
    J[kode] = {"code": kode, "items": [
        {"key": kode, "judul": judul, "deskripsi": "\n".join(d), "komentar": sem, "tag": ", ".join(TAG + TAGX[kode])},
        {"key": "short", "judul": f"{S['kait']} #git #shorts", "deskripsi": f"{RINGKAS[kode]}\nEpisode lengkap: {RC.JUDUL[kode]} (Git dan Kerja Tim #{NO[kode]}), di kanal ini.\nSubscribe: https://www.youtube.com/@iTeachSWE\n#git #programmer #shorts", "terkait": judul}]}
    open(f"{ROOT}/{kode}/{nama(kode)}_youtube.md", "w").write("\n".join(md) + "\n"); print(kode, judul, [ts(t) for t, _ in bab])
json.dump(J, open("/tmp/yt_git.json", "w"), ensure_ascii=False, indent=1)
