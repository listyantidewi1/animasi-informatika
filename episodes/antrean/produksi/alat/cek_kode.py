"""Bandingkan kode hasil rekaman (tag bab-NN) dengan tag asli (refs/asli/bab-NN), mengabaikan spasi dan baris kosong.
Keluar 1 bila ada berkas yang isinya berbeda. python3 alat/cek_kode.py A07"""
import subprocess, sys, re
P = "/home/user/proyek/siantre"; n = sys.argv[1][1:]
def g(*a): return subprocess.run(["git", "-C", P, *a], capture_output=True, text=True).stdout
def pohon(ref): return {f for f in g("ls-tree", "-r", "--name-only", ref).split("\n") if f and not f.startswith("package") and not f.endswith(".png")}
a, b = pohon(f"refs/asli/bab-{n}"), pohon(f"bab-{n}"); beda = sorted(a ^ b)
for f in sorted(a & b):
    if re.sub(r"\s+", "", g("show", f"refs/asli/bab-{n}:{f}")) != re.sub(r"\s+", "", g("show", f"bab-{n}:{f}")): beda.append(f)
if beda: print("BEDA:", ", ".join(beda)); sys.exit(1)
print(f"{sys.argv[1]} kode sama dengan tag asli ({len(a)} berkas)")
