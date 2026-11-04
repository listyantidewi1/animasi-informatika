"""Judul dan deskripsi YouTube untuk tiap bagian/versi video -> <episode>/youtube.md
(memuat link halaman latihan di Vercel dan alat luar dari alat_luar.json)
  python3 episodes/_alat/youtube.py D7.0
Mengambil ringkasan dari kunci "youtube" di script.json ({"ringkas": ..., "belajar": [...], "bagian": {"D7.0a": "Mouse dan Keyboard", ...}})
dan penanda waktu bab dari timeline tiap versi (suara: timeline.json, teks: timeline-teks.json)."""
import json, os, sys
import episode as E

ROOT, _ = E.find_root(sys.argv[1:])
S = E.load_script(ROOT); Y = S.get("youtube", {})
# link halaman latihan (Vercel) dan alat luar yang dipakai latihan di komputer: episodes/_alat/alat_luar.json
AL = json.load(open(os.path.join(os.path.dirname(os.path.abspath(__file__)), "alat_luar.json"), encoding="utf-8"))
LINK = f"{AL['situs']}/{E.code_slug(S['episode'])}"   # link pendek; redirect di vercel.json (dibuat indeks.py)
ALAT = [x for k in AL["episode"].get(S["episode"], []) for x in AL["alat"][k]]
KELAS = {"D7": "Kelas 7", "D8": "Kelas 8", "D9": "Kelas 9", "E": "Kelas 10", "F11": "Kelas 11", "F12": "Kelas 12"}.get(S["episode"].split(".")[0], "")
def mmss(t): t = int(round(t)); return f"{t // 60}:{t % 60:02d}"
if "for" in S:
    # video simulasi: satu video bersuara; judul "Simulasi Informatika Kelas X–Y | <judul>", link ke halaman pemutar simulasi
    ks = sorted({{"D7": 7, "D8": 8, "D9": 9, "E": 10, "F11": 11, "F12": 12}[c.split(".")[0]] for c in S["for"]})
    kelas = f"Kelas {ks[0]}" if len(ks) == 1 else f"Kelas {ks[0]}–{ks[-1]}"
    jenis = "simulasi konsep" if S.get("kind") == "konsep" else "simulasi praktik"
    TL = E.load_timeline(ROOT, "suara"); title = f"Simulasi Informatika {kelas} | {S['title']}"
    chapters = [f"{mmss(next(b for b in TL['beats'] if b['seg'] == i)['start'])} {n}" for i, n in enumerate(TL["segments"])]
    eps = "; ".join(f"{c} {E.load_script(os.path.join(E.EPISODES, c))['title']} ({AL['situs']}/{E.code_slug(c)})" for c in S["for"])
    desc = [f"{S['title']} — video {jenis} untuk Informatika {kelas.lower()}.", "", Y.get("ringkas", ""), ""]
    if Y.get("belajar"): desc += ["Setelah menonton, murid bisa:"] + [f"• {x}" for x in Y["belajar"]] + [""]
    if Y.get("cari"): desc += ["Video ini cocok untuk yang mencari: " + "; ".join(Y["cari"]) + ".", ""]
    desc += ["Bab:"] + chapters + ["", f"Putar dan kerjakan cek pemahamannya di HP: {LINK}", f"Episode yang dilengkapi: {eps}",
             f"Semua episode dan latihannya: {AL['situs']}/", (f"Prasyarat: {Y['prasyarat']}." if Y.get("prasyarat") else ""), "",
             "Seri Animasi Informatika untuk SMP–SMA mengikuti CP 2025 (Keputusan Kepala BSKAP 046/H/KR/2025). Aplikasi di video digambar dengan kode sebagai aplikasi generik; semua nama, akun, dan data fiktif. Tanpa musik latar. Narasi: Kak Ceria (ElevenLabs).",
             "", " ".join(dict.fromkeys(["#Informatika", "#KurikulumMerdeka", "#" + S["episode"]] + [t for t in Y.get("tagar", []) if t.lower() not in ("#informatika", "#kurikulummerdeka")]))]
    pin = [f"📌 {S['title']} — {jenis} Informatika {kelas.lower()}."]
    if S.get("hook"): pin.append("Setelah menonton, kamu bisa " + S["hook"])
    if Y.get("cari"): pin.append("Kata kunci: " + "; ".join(Y["cari"]) + ".")
    pin += [f"Putar ulang dan kerjakan cek pemahamannya di HP: {LINK}", "Sudah mencobanya sendiri? Ceritakan hasilnya di komentar."]
    md = [f"# Judul dan deskripsi YouTube — {S['episode']} {S['title']}", "", f"**Judul** ({len(title)} karakter):", title, "", "**Deskripsi:**", "```"] + desc + \
         ["```", "", "**Komentar tersemat (pin):**", "", "```", "\n".join(pin), "```", "", f"**Berkas:** `video/Informatika_{S['episode']}_*_suara.mp4` (hanya versi bersuara)", ""]
    open(os.path.join(ROOT, "youtube.md"), "w", encoding="utf-8").write("\n".join(md)); print(os.path.join(ROOT, "youtube.md")); sys.exit()
out = [f"# Judul dan deskripsi YouTube — {S['episode']} {S['title']}\n"]
parts = list(S["parts"].items())
for variant, label in (("suara", ""), ("teks", " (versi teks, tanpa suara)")):
    if not os.path.exists(E.timeline_path(ROOT, variant)): continue
    TL = E.load_timeline(ROOT, variant)
    for pi, (name, p) in enumerate(parts, 1):
        sb = [b for b in TL["beats"] if b["seg"] in p["segs"]]; t0 = sb[0]["start"]; pre = 4 if p.get("pre") else 0
        sub = Y.get("bagian", {}).get(name, "")
        title = f"Informatika {KELAS} | {S['title']}" + (f" ({pi}/{len(parts)}): {sub}" if len(parts) > 1 else "") + label
        chapters = []
        for seg in p["segs"]:
            first = next(b for b in sb if b["seg"] == seg); chapters.append(f"{mmss(first['start'] - t0 + pre)} {TL['segments'][seg]}")
        if pre: chapters.insert(0, "0:00 Pembuka bagian")
        lines = [f"## {name}{label}", "", f"**Judul** ({len(title)} karakter):", title, "", "**Deskripsi:**", "```",
                 (f"{S['title']} — bagian {pi} dari {len(parts)}: {sub}." if len(parts) > 1 else f"{S['title']} — {sub}.") + (" Versi tanpa narasi suara: teks narasi tampil besar di layar dengan garis kemajuan baca, cocok untuk ditonton tanpa speaker atau untuk murid yang lebih suka membaca." if variant == "teks" else " Narasi suara plus teks besar di layar; ada versi tanpa suara di video terpisah."),
                 "", Y.get("ringkas", ""), ""]
        if Y.get("belajar"): lines += ["Setelah menonton, murid bisa:"] + [f"• {x}" for x in Y["belajar"]] + [""]
        if Y.get("cari"): lines += ["Video ini cocok untuk yang mencari: " + "; ".join(Y["cari"]) + ".", ""]
        lines += ["Bab:"] + chapters + ["",
                  f"Latihan interaktif (kuis dengan petunjuk, bisa dipakai di HP): {LINK}"] + ([f"Alat untuk latihan di komputer: " + "; ".join(f"{n} {u}" for n, u in ALAT)] if ALAT else []) + [
                  f"Semua episode dan latihannya: {AL['situs']}/", (f"Prasyarat: {Y['prasyarat']}." if Y.get("prasyarat") else "Tidak ada prasyarat."),
                  "", f"Seri Animasi Informatika untuk SMP–SMA mengikuti CP 2025 (Keputusan Kepala BSKAP 046/H/KR/2025), unit {S['episode']} ({Y.get('jp', '?')} JP). Tokoh: robot Kiko, Dito, dan Sinta. Semua gambar dibuat dengan kode; tanpa musik latar. Narasi: Kak Ceria (ElevenLabs)." if variant == "suara" else
                  f"Seri Animasi Informatika untuk SMP–SMA mengikuti CP 2025 (Keputusan Kepala BSKAP 046/H/KR/2025), unit {S['episode']} ({Y.get('jp', '?')} JP). Tokoh: robot Kiko, Dito, dan Sinta. Semua gambar dibuat dengan kode; tanpa musik latar.",
                  "", "#Informatika #KurikulumMerdeka #" + S["episode"].replace(".", "") + " " + " ".join(Y.get("tagar", [])), "```", ""]
        out += lines
# komentar tersemat (pinned): satu per bagian, dipakai untuk kedua versi
for pi, (name, p) in enumerate(parts, 1):
    sub = Y.get("bagian", {}).get(name, "")
    pin = [f"📌 {S['title']}" + (f" ({pi}/{len(parts)}): {sub}" if len(parts) > 1 else "") + " — materi Informatika " + KELAS.lower() + " (unit " + S["episode"] + ")."]
    if S.get("hook"): pin.append("Setelah menonton, kamu bisa " + S["hook"])
    if Y.get("cari"): pin.append("Kata kunci materi ini: " + "; ".join(Y["cari"]) + ".")
    pin.append(f"Latihan interaktif (bisa dipakai di HP): {LINK}" + (f" Tonton dulu {Y['prasyarat']} bila belum." if Y.get("prasyarat") else ""))
    if ALAT: pin.append("Alat untuk latihan di komputer: " + "; ".join(f"{n} {u}" for n, u in ALAT))
    pin.append("Ada yang belum jelas? Tulis di komentar, pertanyaanmu membantu teman lain juga.")
    out += [f"## Komentar tersemat (pin) — {name}", "", "```", "\n".join(pin), "```", ""]
open(os.path.join(ROOT, "youtube.md"), "w", encoding="utf-8").write("\n".join(out))
print(os.path.join(ROOT, "youtube.md"))
