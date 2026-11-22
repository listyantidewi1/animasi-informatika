import json,glob,subprocess,cv2,numpy as np,sys
for f in sorted(glob.glob('scan/SiPinjam_*.json')):
    iv=json.load(open(f)); b=f[5:-5]
    if not iv: continue
    rows=[]
    for k,(a,e) in enumerate(iv):
        ims=[]
        for t in (a+0.3,(a+e)/2,e-0.2, e+0.5):
            subprocess.run(["ffmpeg","-loglevel","error","-y","-ss",f"{t:.2f}","-i",f"bab/{b}.mp4","-frames:v","1","-vf","scale=480:270","/tmp/claude-0/x.png"])
            im=cv2.imread("/tmp/claude-0/x.png"); cv2.putText(im,f"{k} t={t:.1f}",(5,20),0,0.6,(0,255,255),2); ims.append(im)
        rows.append(np.hstack(ims))
    cv2.imwrite(f"sheet/{b}.jpg",np.vstack(rows))
