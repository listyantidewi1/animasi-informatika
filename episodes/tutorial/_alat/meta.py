"""Metadata YouTube seri tutorial -> Txx/youtube.md + pelacak JSON"""
import json, sys, importlib.util, os
def mmss(x): x = int(x); return f"{x // 60}:{x % 60:02d}"
def main(ep, urut):
    base = f"/home/user/tut/{ep}"
    spec = importlib.util.spec_from_file_location("spec", f"{base}/spec.py"); S = importlib.util.module_from_spec(spec); spec.loader.exec_module(S)
    W = {b["no"]: b for b in json.load(open(f"{base}/waktu.json"))}; M = S.META
    bab = "\n".join(f"{mmss(W[n]['mulai'])} {j}" for n, j in M["bab"])
    dur = sum(b["D"] for b in W.values())
    judul = S.JUDUL_YT
    desk = (M["ringkas"] + "\n\nBab:\n" + bab + "\n\nKode lengkap:\n" + M["kode"].strip() + "\n\n" + M.get("prasyarat", "") +
            "\nPlaylist: Proyek Pemrograman Sederhana. Narasi: Cahaya (suara sintetis ElevenLabs). Rekaman layar sungguhan; animasi penjelasan dibuat dengan kode oleh I Teach Software Engineering. Naskah disusun dengan bantuan AI (Claude buatan Anthropic) dan disunting manusia.\n\n"
            "Subscribe: https://www.youtube.com/@iTeachSWE\n\n" + " ".join("#" + t.replace(" ", "") for t in M["hashtag"]))
    sdesk = M["short_desk"] + "\n\nTutorial lengkapnya: " + judul + " (playlist Proyek Pemrograman Sederhana).\nSubscribe: https://www.youtube.com/@iTeachSWE\n#shorts " + " ".join("#" + t.replace(" ", "") for t in M["hashtag"][:3])
    items = [{"key": ep, "judul": judul, "deskripsi": desk, "komentar": M["komentar"], "tag": ", ".join(M["tag"])},
             {"key": "short", "judul": S.SHORT["judul"] + " #shorts", "deskripsi": sdesk, "terkait": judul}]
    md = f"# {ep} YouTube\n\n## Video utama ({mmss(dur)})\n\n**Judul:** {judul}\n\n**Deskripsi:**\n\n{desk}\n\n**Komentar tersemat:** {M['komentar']}\n\n**Tag:** {items[0]['tag']}\n\n## Short\n\n**Judul:** {items[1]['judul']}\n\n**Deskripsi:**\n\n{sdesk}\n\n**Video terkait:** {judul}\n"
    open(f"{base}/youtube.md", "w").write(md)
    json.dump({"code": ep, "items": items}, open(f"{base}/yt.json", "w"), ensure_ascii=False)
    print(md[:400]); print("durasi", mmss(dur))
if __name__ == "__main__": main(sys.argv[1], int(sys.argv[2]))
