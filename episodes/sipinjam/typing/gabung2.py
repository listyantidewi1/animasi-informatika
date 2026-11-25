"""Gabung out/P00..P13 -> akhir/SiPinjam_PHP_MySQL_dari_Nol.mp4 + srt + chapter.txt"""
import subprocess, os
B="/home/user/kerja-sp"; O=B+"/akhir"; os.makedirs(O, exist_ok=True)
BAB = eval(open("/home/user/animasi-informatika/episodes/sipinjam/produksi/alat/gabung.py").read().split("BAB = ")[1].split("\ndef dur")[0])
def dur(f): return float(subprocess.check_output(["ffprobe","-v","error","-show_entries","format=duration","-of","csv=p=0",f]))
def ts(s): h,m=divmod(int(s),3600); m,d=divmod(m,60); return f"{h}:{m:02d}:{d:02d}" if h else f"{m}:{d:02d}"
def tt(x): ms=round(x*1000); h,ms=divmod(ms,3600000); m,ms=divmod(ms,60000); d,ms=divmod(ms,1000); return f"{h:02d}:{m:02d}:{d:02d},{ms:03d}"
def ss(s): h,m,r=s.split(":"); d,ms=r.split(","); return int(h)*3600+int(m)*60+int(d)+int(ms)/1000
t0=0; lst=[]; bab=[]; srt=[]; n=1
for kode, judul in BAB:
    f=f"{B}/out/{kode}.mp4"; lst.append(f"file '{f}'"); bab.append(f"{ts(t0)} {judul}")
    for blk in open(f"{B}/out/{kode}.srt").read().strip().split("\n\n"):
        x=blk.split("\n"); a,b=[ss(y.strip()) for y in x[1].split("-->")]
        srt.append(f"{n}\n{tt(a+t0)} --> {tt(b+t0)}\n"+"\n".join(x[2:])); n+=1
    t0+=dur(f)
open(B+"/tmp/gabung.txt","w").write("\n".join(lst)+"\n")
subprocess.run(["ffmpeg","-loglevel","error","-y","-f","concat","-safe","0","-i",B+"/tmp/gabung.txt","-c","copy","-movflags","+faststart",O+"/SiPinjam_PHP_MySQL_dari_Nol.mp4"],check=True)
open(O+"/SiPinjam_PHP_MySQL_dari_Nol.srt","w").write("\n\n".join(srt)+"\n")
open(O+"/chapter.txt","w").write("\n".join(bab)+"\n")
print(ts(t0)); print("\n".join(bab))
