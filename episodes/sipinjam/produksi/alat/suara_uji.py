"""Suara tiruan (hening, panjang perkiraan 14,5 karakter/detik) untuk menguji rakitan sebelum memakai kredit: python3 suara_uji.py L01"""
import json, sys, os, subprocess
ep = sys.argv[1]; os.makedirs(f"/home/user/pinjam/{ep}/suara_uji", exist_ok=True)
for b in json.load(open(f"/home/user/pinjam/naskah_{ep}.json")):
    d = len(b["teks"]) / 14.5
    subprocess.run(["ffmpeg", "-loglevel", "error", "-y", "-f", "lavfi", "-i", "anullsrc=r=44100:cl=mono", "-t", f"{d:.2f}", "-b:a", "64k", f"/home/user/pinjam/{ep}/suara_uji/b{b['no']:02d}.mp3"], check=True)
print("ok")
