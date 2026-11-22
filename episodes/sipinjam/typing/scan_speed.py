# Baca label "dipercepat Nx" per frame (30 fps) -> scan/<bab>.speed.json : daftar [t0, t1, S] (S=1 bila tanpa label)
import subprocess, numpy as np, sys, json, cv2, glob, os
f = sys.argv[1]; out = sys.argv[2]
names=[]; T=[]
for p in glob.glob("tpl/*.png"):
    a=cv2.imread(p).astype(int); names.append(float(os.path.basename(p)[:-4])); T.append(((a[:,:,2]>150)&(a[:,:,0]<120)).ravel())
T=np.array(T,dtype=np.float32); Ts=T.sum(1); names=np.array(names)
W, H = 300, 56; x0, y0 = 1920-330, 1080-92
p = subprocess.Popen(["ffmpeg","-loglevel","error","-i",f,"-vf",f"crop={W}:{H}:{x0}:{y0}","-f","rawvideo","-pix_fmt","bgr24","-"], stdout=subprocess.PIPE)
sp=[]
while True:
    b = p.stdout.read(W*H*3)
    if len(b) < W*H*3: break
    a = np.frombuffer(b, np.uint8).reshape(H, W, 3).astype(int)
    amber = ((a[:,:,2]>200)&(a[:,:,1]>140)&(a[:,:,1]<215)&(a[:,:,0]<90)).sum()
    dark = ((a.sum(2))<120).mean()
    if amber>150 and dark>0.5:
        m=((a[:,:,2]>150)&(a[:,:,0]<120)).ravel().astype(np.float32)
        d=Ts+m.sum()-2*T@m; i=int(np.argmin(d))
        sp.append(float(names[i]) if d[i]<250 else -1.0)
    else: sp.append(1.0)
# runs
runs=[]; s=0
for i in range(1,len(sp)+1):
    if i==len(sp) or sp[i]!=sp[s]:
        runs.append([s/30,i/30,sp[s]]); s=i
# rapikan: run pendek (<4 frame) dengan nilai beda -> ikut tetangga
json.dump(runs, open(out,"w"))
print(f, [r for r in runs if r[2]!=1.0 and r[1]-r[0]>0.2][:3], sum(1 for r in runs if r[2]==-1.0), len(sp))
