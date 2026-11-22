import sys, subprocess, cv2, numpy as np, textwrap
ep=sys.argv[1]; a=int(sys.argv[2]) if len(sys.argv)>2 else 0; b=int(sys.argv[3]) if len(sys.argv)>3 else 999
bl=open(f"out/{ep}.srt").read().strip().split("\n\n")
def ss(s): h,m,r=s.split(":"); d,ms=r.split(","); return int(h)*3600+int(m)*60+int(d)+int(ms)/1000
ims=[]
for k,x in enumerate(bl[a:b]):
    L=x.split("\n"); t0,t1=[ss(y.strip()) for y in L[1].split("-->")]; t=min(t0+1.5,(t0+t1)/2)
    subprocess.run(["ffmpeg","-loglevel","error","-y","-ss",f"{t:.2f}","-i",f"out/{ep}.mp4","-frames:v","1","-vf","scale=640:360","/tmp/claude-0/q.png"])
    im=cv2.imread("/tmp/claude-0/q.png"); pad=np.zeros((70,640,3),np.uint8)
    for j,l in enumerate(textwrap.wrap(f"{a+k+1} {t0:.1f}: "+" ".join(L[2:]),80)[:3]): cv2.putText(pad,l,(4,18+j*21),0,0.45,(255,255,255),1)
    ims.append(np.vstack([im,pad]))
while len(ims)%3: ims.append(np.zeros_like(ims[0]))
cv2.imwrite(f"/tmp/claude-0/qc_{ep}_{a}.jpg",np.vstack([np.hstack(ims[i:i+3]) for i in range(0,len(ims),3)]))
