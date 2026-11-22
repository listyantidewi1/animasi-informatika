# Deteksi label "dipercepat Nx" (kanan bawah) per frame pada 10 fps -> interval + crop
import subprocess, numpy as np, sys, json, cv2
f = sys.argv[1]; out = sys.argv[2]
W, H = 300, 56; x0, y0 = 1920-330, 1080-92
p = subprocess.Popen(["ffmpeg","-loglevel","error","-i",f,"-vf",f"fps=10,crop={W}:{H}:{x0}:{y0}","-f","rawvideo","-pix_fmt","bgr24","-"], stdout=subprocess.PIPE)
flags=[]; crops={}
i=0
while True:
    b = p.stdout.read(W*H*3)
    if len(b) < W*H*3: break
    a = np.frombuffer(b, np.uint8).reshape(H, W, 3).astype(int)
    amber = ((a[:,:,2]>200)&(a[:,:,1]>140)&(a[:,:,1]<215)&(a[:,:,0]<90)).sum()
    dark = ((a.sum(2))<120).mean()
    on = amber>150 and dark>0.5
    flags.append(on)
    if on: crops[i]=a.astype(np.uint8)
    i+=1
iv=[]; s=None
for j,v in enumerate(flags+[False]):
    if v and s is None: s=j
    if not v and s is not None:
        if j-s>=3: iv.append([s/10,j/10,(s+j)//2])
        s=None
for k,(a_,b_,m) in enumerate(iv):
    cv2.imwrite(f"{out}_{k}.png", crops[m])
json.dump([[a_,b_] for a_,b_,m in iv], open(out+".json","w"))
print(f, len(iv), round(sum(b_-a_ for a_,b_,m in iv),1))
