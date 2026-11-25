# Peta bagian per bab: [t_masuk, jenis, berkas] untuk bilah bawah. jenis: umum | berkas | perintah
import json, re, ast
A = json.load(open("analisis.json")); PR="/home/user/animasi-informatika/episodes/sipinjam/produksi"
def env_of(ep):
    try: src=open(f"{PR}/{ep}/rekam.py").read()
    except: return {}, ""
    env={}
    for m in re.finditer(r'^([A-Z_, ]+) = ("[^"]+"(?:, "[^"]+")*)', src, re.M):
        ks=[k.strip() for k in m.group(1).split(",")]
        try: env.update(dict(zip(ks, ast.literal_eval("("+m.group(2)+",)"))))
        except: pass
    for m in re.finditer(r'^D = "([^"]+)"; *([A-Z_, ]+) = (.+)$', src, re.M):
        D=m.group(1); ks=[k.strip() for k in m.group(2).split(",")]; env.update(dict(zip(ks, eval(m.group(3), {}, {"D": D}))))
    return env, src
peta={}
for ep, rows in A.items():
    env, src = env_of(ep); sek=[]; prev=None
    for r in rows:
        if "adegan" in r: k=("umum", None)
        else:
            seg=r["seg"]; full=src
            # ambil potongan penuh dari tanda a
            m=re.search(r'(?:r\.tanda\("%s"\)|tanda="%s")' % (re.escape(str(r["a"])), re.escape(str(r["a"]))), src)
            s2=src[m.start():m.start()+600] if m else ""
            mm=re.search(r'b\.(ubah|taruh)\(("?[^,]+)', s2.split("r.tanda(")[1] if s2.startswith("r.tanda(") and s2.count("r.tanda(")>0 else s2)
            if m and re.match(r'r\.tanda', s2):
                body=s2[len(m.group(0)):]; nxt=re.search(r'r\.tanda\(|tanda="', body); body=body[:nxt.start()] if nxt else body
            else:
                body=""
            fm=re.search(r'b\.(ubah|taruh)\(("[^"]+"|[A-Z_]+)', body)
            if fm:
                v=fm.group(2); f=ast.literal_eval(v) if v.startswith('"') else env.get(v)
                k=("berkas", f)
            elif re.search(r'b\.(jalan|sql|commit|term)\(|r\.terminal\(', body): k=("perintah", None)
            elif prev and prev[0]!="umum": k=prev
            else: k=("umum", None)
        if not sek or sek[-1][1:]!=list(k):
            if sek and abs(sek[-1][0]-r["t"])<0.05: sek[-1]=[r["t"], *k]
            else: sek.append([r["t"], *k])
        prev=k
    peta[ep]=sek
json.dump(peta, open("peta.json","w"), indent=0)
for ep,s in peta.items(): print(ep, s)
