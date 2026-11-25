import glob, subprocess
def dur(f): return float(subprocess.check_output(["ffprobe","-v","error","-show_entries","format=duration","-of","csv=p=0",f]))
def ss(s): h,m,r=s.split(":"); d,ms=r.split(","); return int(h)*3600+int(m)*60+int(d)+int(ms)/1000
def tt(x): ms=round(x*1000); h,ms=divmod(ms,3600000); m,ms=divmod(ms,60000); d,ms=divmod(ms,1000); return f"{h:02d}:{m:02d}:{d:02d},{ms:03d}"
bl=open("/mnt/project-files/sipinjam/SiPinjam_PHP_MySQL_dari_Nol.srt").read().strip().split("\n\n")
t0=0; fs=sorted(glob.glob("bab/*.mp4"))
for i,f in enumerate(fs):
    d=dur(f); out=[]
    for b in bl:
        x=b.split("\n"); a,e=[ss(y.strip()) for y in x[1].split("-->")]
        if t0-0.01<=a<t0+d-0.01: out.append(f"{len(out)+1}\n{tt(a-t0)} --> {tt(min(e,t0+d)-t0)}\n"+"\n".join(x[2:]))
    open(f"tmp/P{i:02d}_in.srt","w").write("\n\n".join(out)+"\n"); print(i, round(d,2), len(out)); t0+=d
