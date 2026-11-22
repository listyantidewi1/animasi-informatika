import re, glob, ast, subprocess
PR="/home/user/animasi-informatika/episodes/sipinjam/produksi"
JUDUL = dict(eval(open(PR+"/alat/gabung.py").read().split("BAB = ")[1].split("\ndef dur")[0]))
TAG = {"P01":"bab-01","P04":"bab-04","P05":"bab-05","P06":"bab-06","P07":"bab-07","P08":"bab-08","P09":"bab-09","P10":"bab-10","P11":"bab-11","P12":"bab-12","P13":"bab-13"}
EXTRA = {"CEK": 'mysql -u root sipinjam -e "SELECT nama, stok FROM alat WHERE id = 1"', "HASH": """php -r "echo password_hash('rahasia123', PASSWORD_DEFAULT), PHP_EOL;\""""}
FILES = {}
out = ["# SiPinjam: perintah dan berkas per bab", "",
 "Bahan untuk mengikuti video **SiPinjam: Aplikasi Peminjaman Alat dengan PHP dan MySQL dari Nol** sambil mengetik.", "",
 "- Kode lengkap: https://github.com/listyantidewi1/SiPinjam",
 "- Isi berkas di akhir setiap bab: buka tag `bab-NN`, misalnya https://github.com/listyantidewi1/SiPinjam/tree/bab-04",
 "- Perintah terminal dan perintah SQL yang diketik di video ada di bawah, urut sesuai bab. Ketik satu per satu, tekan Enter, lalu bandingkan hasilnya dengan video.",
 "- Belum selesai mengetik? Jeda dulu videonya. Tidak ada yang tertinggal: semua yang diketik di video ada di sini atau di tag bab.", ""]
for f in sorted(glob.glob(PR+"/P*/rekam.py")):
    src=open(f).read(); ep=f.split("/")[-2]; tag=TAG.get(ep)
    env=dict(EXTRA)
    for m in re.finditer(r'^([A-Z_]+) *= *("(?:[^"\\]|\\.)*")\s*$', src, re.M):
        try: env[m.group(1)]=ast.literal_eval(m.group(2))
        except: pass
    for m in re.finditer(r'^([A-Z_, ]+) *= *(.+)$', src, re.M):
        ks=[k.strip() for k in m.group(1).split(",")]
        if len(ks)>1:
            try:
                D=env.get("D"); vs=eval(m.group(2), {}, {"D": D} if D else {})
                for k,v in zip(ks,vs):
                    if isinstance(v,str): env[k]=v
            except Exception: pass
        elif ks[0]=="D":
            try: env["D"]=ast.literal_eval(m.group(2).split(";")[0].strip())
            except: pass
    # baris "D = ...; IX, AJ = D + ..."
    for m in re.finditer(r'^D = "([^"]+)"; *([A-Z_, ]+) = (.+)$', src, re.M):
        D=m.group(1); ks=[k.strip() for k in m.group(2).split(",")]; vs=eval(m.group(3), {}, {"D": D})
        env.update(dict(zip(ks,vs)))
    for m in re.finditer(r'^([A-Z_, ]+) = ("[^"]+"(?:, "[^"]+")*);', src, re.M):
        ks=[k.strip() for k in m.group(1).split(",")]; vs=ast.literal_eval("("+m.group(2)+",)")
        env.update(dict(zip(ks,vs)))
    berkas=[]; cmds=[]
    for m in re.finditer(r'(?:b\.(jalan|sql|commit|ubah|taruh)|r\.(terminal))\(', src):
        i=m.end(); depth=1; j=i
        while depth:
            c=src[j]; depth+= c in "([" ; depth-= c in ")]"; j+=1
        arg=src[i:j-1]; kind=m.group(1) or m.group(2)
        try:
            node=ast.parse("f("+arg+")").body[0].value.args[0]
            if isinstance(node,ast.Name): v=env.get(node.id)
            elif isinstance(node,ast.JoinedStr): v="CALL kembalikan_pinjam(1, 3, 'TANGGAL');"
            else: v=ast.literal_eval(node)
        except Exception: v=None
        if v is None: print("??", ep, kind, arg[:50]); continue
        if isinstance(v,list): v="\n".join(v)
        if kind in ("ubah","taruh"):
            if v not in berkas: berkas.append(v)
        elif kind=="commit": cmds.append(("bash", f'git add .\ngit commit -m "{v}"'))
        elif kind=="sql": cmds.append(("sql", v))
        else: cmds.append(("bash", v))
    FILES[ep]=berkas
    no=int(ep[1:]); out += [f"## Bab {no}", "", f"**{JUDUL[ep]}**", ""]
    if berkas and tag:
        out.append("Berkas yang diketik atau disalin di bab ini (isi akhir bab):"); out.append("")
        for b in berkas: out.append(f"- [`{b}`](https://github.com/listyantidewi1/SiPinjam/blob/{tag}/{b})")
        out.append("")
    if cmds:
        out.append("Perintah, urut seperti di video. Blok `bash` diketik di terminal (Git Bash), blok `sql` diketik setelah masuk ke `mysql`."); out.append("")
        for k,v in cmds:
            if "TANGGAL" in v: out.append("Ganti TANGGAL dengan tanggal jatuh tempo ditambah 4 hari, formatnya TTTT-BB-HH (contoh 2026-11-27).")
            out += [f"```{k}", v, "```"]
        out.append("")
open("/home/user/kerja-sp/README_bahan.md","w").write("\n".join(out))
import json; json.dump(FILES, open("/home/user/kerja-sp/berkas_bab.json","w"), indent=1)
print(json.dumps(FILES))
