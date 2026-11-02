"""Judul dan deskripsi YouTube untuk tiap bagian/versi video -> <episode>/youtube.md
  python3 episodes/_alat/youtube.py D7.0
Mengambil ringkasan dari kunci "youtube" di script.json ({"ringkas": ..., "belajar": [...], "bagian": {"D7.0a": "Mouse dan Keyboard", ...}})
dan penanda waktu bab dari timeline tiap versi (suara: timeline.json, teks: timeline-teks.json)."""
import os, sys
import episode as E

ROOT, _ = E.find_root(sys.argv[1:])
S = E.load_script(ROOT); Y = S.get("youtube", {})
KELAS = {"D7": "Kelas 7", "D8": "Kelas 8", "D9": "Kelas 9", "E": "Kelas 10"}.get(S["episode"].split(".")[0], "")
def mmss(t): t = int(round(t)); return f"{t // 60}:{t % 60:02d}"
out = [f"# Judul dan deskripsi YouTube — {S['episode']} {S['title']}\n"]
parts = list(S["parts"].items())
for variant, label in (("suara", ""), ("teks", " (versi teks, tanpa suara)")):
    if not os.path.exists(E.timeline_path(ROOT, variant)): continue
    TL = E.load_timeline(ROOT, variant)
    for pi, (name, p) in enumerate(parts, 1):
        sb = [b for b in TL["beats"] if b["seg"] in p["segs"]]; t0 = sb[0]["start"]; pre = 4 if p.get("pre") else 0
        sub = Y.get("bagian", {}).get(name, "")
        title = f"Informatika {KELAS} | {S['title']} ({pi}/{len(parts)}): {sub}{label}"
        chapters = []
        for seg in p["segs"]:
            first = next(b for b in sb if b["seg"] == seg); chapters.append(f"{mmss(first['start'] - t0 + pre)} {TL['segments'][seg]}")
        if pre: chapters.insert(0, "0:00 Pembuka bagian")
        lines = [f"## {name}{label}", "", f"**Judul** ({len(title)} karakter):", title, "", "**Deskripsi:**", "```",
                 f"{S['title']} — bagian {pi} dari {len(parts)}: {sub}." + (" Versi tanpa narasi suara: teks narasi tampil besar di layar dengan garis kemajuan baca, cocok untuk ditonton tanpa speaker atau untuk murid yang lebih suka membaca." if variant == "teks" else " Narasi suara plus teks besar di layar; ada versi tanpa suara di video terpisah."),
                 "", Y.get("ringkas", ""), ""]
        if Y.get("belajar"): lines += ["Setelah menonton, murid bisa:"] + [f"• {x}" for x in Y["belajar"]] + [""]
        lines += ["Bab:"] + chapters + ["",
                  f"Latihan interaktif (kuis dengan petunjuk, bisa dipakai luring di HP): berkas episode-{E.code_slug(S['episode'])}.html di repositori proyek." + (f" Prasyarat: {Y['prasyarat']}." if Y.get("prasyarat") else " Tidak ada prasyarat."),
                  "", f"Seri Animasi Informatika untuk SMP–SMA mengikuti CP 2025 (Keputusan Kepala BSKAP 046/H/KR/2025), unit {S['episode']} ({Y.get('jp', '?')} JP). Tokoh: robot Kiko, Dito, dan Sinta. Semua gambar dibuat dengan kode; tanpa musik latar. Narasi: Kak Ceria (ElevenLabs)." if variant == "suara" else
                  f"Seri Animasi Informatika untuk SMP–SMA mengikuti CP 2025 (Keputusan Kepala BSKAP 046/H/KR/2025), unit {S['episode']} ({Y.get('jp', '?')} JP). Tokoh: robot Kiko, Dito, dan Sinta. Semua gambar dibuat dengan kode; tanpa musik latar.",
                  "", "#Informatika #KurikulumMerdeka #" + S["episode"].replace(".", "") + " " + " ".join(Y.get("tagar", [])), "```", ""]
        out += lines
open(os.path.join(ROOT, "youtube.md"), "w", encoding="utf-8").write("\n".join(out))
print(os.path.join(ROOT, "youtube.md"))
