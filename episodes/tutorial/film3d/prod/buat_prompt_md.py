"""Menyusun PROMPT.md untuk repo paket-terakhir dari berkas prompt di prod/.

Setiap prompt diberi nomor <bab>.<urut> yang sama dengan label di video,
supaya penonton bisa menyalin prompt yang sedang diketik.
Pakai: python3 buat_prompt_md.py /home/user/proyek/paket-terakhir/PROMPT.md
"""
import sys
from pathlib import Path

PROD = Path(__file__).parent

# (nomor, judul, berkas prompt) urut sesuai video
DAFTAR = [
    ("2.1", "Storyboard pertama", "p_storyboard.txt"),
    ("2.2", "Memperbaiki storyboard: lelucon harus dijelaskan", "p_storyboard_fix.txt"),
    ("3.1", "Kerangka film dan alat cek", "p_kerangka.txt"),
    ("4.1", "Mengunduh aset dari Poly Haven", "p_aset.txt"),
    ("4.2", "Memilih ulang langit malam", "p_aset_pilih.txt"),
    ("4.3", "Kota malam yang basah", "p_kota.txt"),
    ("4.4", "Genangan yang lebih wajar", "p_genangan.txt"),
    ("4.5", "Warna cahaya malam", "p_cahaya.txt"),
    ("4.6", "Detail ruko", "p_ruko.txt"),
    ("4.7", "Merapikan sisa masalah", "p_rapikan.txt"),
    ("5.1", "Motor bebek dan boks paket", "p_motor.txt"),
    ("5.2", "Motor bebek yang membulat", "p_motor_bulat.txt"),
    ("5.3", "Kurir Mas Adit", "p_kurir.txt"),
    ("5.4", "Motor melaju di shot 1", "p_gerak.txt"),
    ("5.5", "Kucing oren", "p_kucing.txt"),
    ("5.6", "Layar HP", "p_hp.txt"),
    ("5.7", "Pintu dan siluet anak", "p_pintu.txt"),
]

KEPALA = """# Prompt di video "Paket Terakhir Malam Ini"

Semua prompt yang diketik di video tutorial ada di sini, bernomor sesuai bab.
Di video, label di layar menyebut nomornya, misalnya **Prompt 4.3**.
Salin prompt dengan tombol salin di pojok kotak, lalu tempel di Claude Code.

Hasil Claude Code bisa berbeda sedikit darimu karena AI tidak selalu menjawab
sama. Itu wajar. Bandingkan hasilmu dengan kode di repo ini, dan perbaiki
dengan prompt lanjutan seperti yang dilakukan di video.

Isi `CLAUDE.md` diketik sendiri (bab 2). Salinannya ada di berkas
[CLAUDE.md](CLAUDE.md).
"""


def main(keluar):
    bagian = [KEPALA]
    bab_lalu = None
    for nomor, judul, berkas in DAFTAR:
        p = PROD / berkas
        if not p.exists():
            continue
        bab = nomor.split(".")[0]
        if bab != bab_lalu:
            bagian.append(f"\n## Bab {bab}\n")
            bab_lalu = bab
        isi = p.read_text(encoding="utf-8").strip()
        bagian.append(f"\n### Prompt {nomor} · {judul}\n\n```text\n{isi}\n```\n")
    Path(keluar).write_text("".join(bagian), encoding="utf-8")
    print("ditulis", keluar)


if __name__ == "__main__":
    main(sys.argv[1] if len(sys.argv) > 1 else "PROMPT.md")
