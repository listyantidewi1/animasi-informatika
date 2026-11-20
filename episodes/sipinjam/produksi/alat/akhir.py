"""Setelah gabung.py dan short.py: salin potongan per bab ke akhir/bab/ dan isi penanda di akhir/metadata_draf.md -> akhir/metadata.md."""
import subprocess, glob, os, shutil, re
B = "/home/user/pinjam"; OUT = B + "/akhir"; os.makedirs(OUT + "/bab", exist_ok=True)
BAB = eval(open(B + "/alat/gabung.py").read().split("BAB = ")[1].split("\ndef dur")[0])
KAIT = eval(open(B + "/alat/short.py").read().split("KAIT = ")[1].split("\nnaskah")[0])
NAMA = {"P00": "Bab00_Pembuka", "P01": "Bab01_Persiapan", "P02": "Bab02_Kebutuhan", "P03": "Bab03_Merancang_Database", "P04": "Bab04_CREATE_TABLE",
        "P05": "Bab05_Function_dan_Stored_Procedure", "P06": "Bab06_Trigger", "P07": "Bab07_PHP_dan_PDO", "P08": "Bab08_Login_dan_Peran", "P09": "Bab09_Halaman_Admin",
        "P10": "Bab10_Halaman_Peminjam", "P11": "Bab11_Halaman_Petugas_dan_Laporan", "P12": "Bab12_Pengujian", "P13": "Bab13_Online"}
def dur(f): return float(subprocess.run(["ffprobe", "-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", f], capture_output=True, text=True).stdout)
def ms(s): return f"{int(s // 60)}:{int(s % 60):02d}"
pot = []
for kode, judul in BAB:
    f = [x for x in glob.glob(f"{B}/{kode}/{kode}_*.mp4") if "_short" not in x][0]
    t = f"{OUT}/bab/SiPinjam_{NAMA[kode]}.mp4"; shutil.copyfile(f, t)
    pot.append(f"- bab/SiPinjam_{NAMA[kode]}.mp4 ({ms(dur(t))}): {judul}")
sh = []
for kode in sorted(KAIT):
    f = f"{OUT}/short/{kode}_short.mp4"
    sh.append(f"- short/{kode}_short.mp4 ({ms(dur(f))}): {KAIT[kode]}")
md = open(OUT + "/metadata_draf.md").read()
md = md.replace("@@CHAPTER@@", open(OUT + "/chapter.txt").read().strip()).replace("@@POTONGAN@@", "\n".join(pot)).replace("@@SHORT@@", "\n".join(sh))
assert "@@" not in md
open(OUT + "/metadata.md", "w").write(md)
print("\n".join(pot)); print("\n".join(sh))
