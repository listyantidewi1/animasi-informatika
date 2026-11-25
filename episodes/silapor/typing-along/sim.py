"""Simulasi rekam.py tiap bab SiLapor tanpa VS Code: mencatat urutan ketikan (berkas, perintah, SQL) beserta tanda rekaman
tempat ketikan itu terjadi. Keluaran: data/<bab>_peristiwa.json. Isi berkas diambil dari repo publik listyantidewi1/SiLapor."""
import sys, os, json, types, difflib, subprocess, shutil, re, builtins
REPO = "/home/user/listyantidewi1/silapor"; PROD = "/home/user/animasi-informatika/episodes/silapor/produksi"
P = "/tmp/silapor_sim/proyek"; ACU = "/tmp/silapor_sim/acuan/"
class Jam:
    t = 0.0
J = Jam()
EV = []; TANDA = ["(awal)"]
def catat(jenis, **k): EV.append(dict(jenis=jenis, tanda=TANDA[-1], vt=round(J.t, 2), **k))
class Pg:
    class keyboard:
        @staticmethod
        def press(*a, **k): J.t += 0.05
        @staticmethod
        def type(*a, **k): pass
    @staticmethod
    def evaluate(*a, **k): return ""
    @staticmethod
    def locator(*a, **k): return types.SimpleNamespace(count=lambda: 1)
class Rek:
    pg = Pg()
    def __init__(self, *a, **k): self.log = {"kamera": [[0, []]], "label": [], "tanda": []}
    def tanda(self, n): TANDA.append(n); EV.append(dict(jenis="tanda", tanda=n, vt=round(J.t, 2)))
    def terminal(self, cmd, cps=18, tunggu=1.0, ikuti=True): catat("perintah", teks=cmd); J.t += len(cmd) / cps + tunggu + .3
    def ketik(self, teks, cps=16): catat("ketik", teks=teks); J.t += len(teks) / cps
    def label(self, teks, dur=3.0): catat("label", teks=teks)
    def __getattr__(self, n): return lambda *a, **k: None
class Bab:
    def __init__(self, keluar, proyek=None, url=None): self.P = proyek or P; self.r = Rek()
    def isi(self, rel):
        p = f"{self.P}/{rel}"
        if os.path.exists(p): return open(p).read()
        if rel == ".env" and os.path.exists(f"{self.P}/.env.example"): return open(f"{self.P}/.env.example").read()
        return None
    def ubah(self, rel, target, cps=24, ikuti=True, durasi=None):
        lama = self.isi(rel); baru_berkas = lama is None; lama = lama or ""
        if not target.endswith("\n"): target += "\n"
        a, b = lama.split("\n"), target.split("\n")
        ops = [o for o in difflib.SequenceMatcher(None, a, b, autojunk=False).get_opcodes() if o[0] != "equal"]
        ketik = [x for o in ops for x in b[o[3]:o[4]]]; n = sum(len(x.strip()) for x in ketik)
        catat("berkas", berkas=rel, baru=baru_berkas, n=n, baris=len(ketik), cps=cps, cuplik="\n".join(ketik)[:400])
        J.t += n / cps + 0.5 * len(ops) + 1.5
        os.makedirs(os.path.dirname(f"{self.P}/{rel}") or ".", exist_ok=True); open(f"{self.P}/{rel}", "w").write(target)
    def jalan(self, cmd, tunggu=1.5, cps=22, label=None, dur=3.0, sampai=None, maks=120):
        catat("perintah", teks=cmd); J.t += len(cmd) / cps + tunggu + (dur if label else 0) + 1
        m = re.match(r"php artisan make:(\w+) (\S+)( -m)?", cmd)
        if m:
            nama = m.group(2)
            for f in subprocess.run(f"git -C {REPO} ls-files", shell=True, capture_output=True, text=True).stdout.split():
                kunci = {"model": f"app/Models/{nama}.php", "controller": f"app/Http/Controllers/{nama}.php", "middleware": f"app/Http/Middleware/{nama}.php", "policy": f"app/Policies/{nama}.php"}.get(m.group(1), "")
                if f == kunci: pass  # isi kerangka bawaan tidak diketahui; berkas dibiarkan belum ada
            if m.group(3):
                tab = {"Category": "categories", "Report": "reports", "ReportUpdate": "report_updates"}[nama]
                for f in os.listdir(f"{REPO}/database/migrations"):
                    if f.endswith(f"_create_{tab}_table.php"):
                        shutil.copy(f"{REPO}/database/migrations/{f}", f"{self.P}/database/migrations/{f}")
                        # kerangka bawaan: hanya id + timestamps
                        open(f"{self.P}/database/migrations/{f}", "w").write("<?php\n\n    public function up(): void\n    {\n        Schema::create('%s', function (Blueprint $table) {\n            $table->id();\n            $table->timestamps();\n        });\n    }\n" % tab)
    def sql(self, baris, label=None, dur=3.5, tunggu=1.2, cps=20):
        bs = baris if isinstance(baris, list) else [baris]; catat("sql", teks="\n".join(bs)); J.t += sum(len(x) for x in bs) / cps + tunggu + (dur if label else 0)
    def mysql(self, sandi=""): catat("perintah", teks="mysql -u silapor -p silapor"); J.t += 5
    def salin(self, rel, label=None, dur=3.0):
        catat("salin", berkas=rel); os.makedirs(os.path.dirname(f"{self.P}/{rel}"), exist_ok=True); shutil.copy(ACU + rel, f"{self.P}/{rel}"); J.t += 1 + (dur if label else 0)
    def taruh(self, rel, isi, label=None, dur=3.0):
        catat("taruh", berkas=rel); os.makedirs(os.path.dirname(f"{self.P}/{rel}") or ".", exist_ok=True); open(f"{self.P}/{rel}", "w").write(isi); J.t += 1 + (dur if label else 0)
    def commit(self, pesan, tanda=None):
        if tanda: self.r.tanda(tanda)
        self.jalan("git add ."); self.jalan(f'git commit -m "{pesan}"')
    def sorot(self, rel, cari, label, dur=3.0, tanda=None, n=1, zoom=1.4, ke=1):
        if tanda: self.r.tanda(tanda)
        catat("sorot", berkas=rel, teks=label); J.t += dur + 1
    def lihat(self, rel, cari=None, jeda=1.0): catat("lihat", berkas=rel); J.t += jeda + 1.5
    def layar(self): return "frontend stack Application ready mysql> Enter password INFO Migration report_updates DatabaseSeeder starter kit Server running PASS Tests passed DONE"
    def baris(self, rel, cari, ke=1): return 1
    def __getattr__(self, n): return lambda *a, **k: None
def siapkan(tag, seed=None):
    shutil.rmtree(P, ignore_errors=True); os.makedirs(P)
    subprocess.run(f"git -C {REPO} archive {tag} | tar -x -C {P}", shell=True, check=True)
    shutil.copy(f"{P}/.env.example", f"{P}/.env")
def sh(cmd, cwd=None): return types.SimpleNamespace(stdout="", stderr="", returncode=0)
def acuan(rel): return open(ACU + rel).read()
def main(bab, skrip):
    global EV, TANDA
    EV.clear(); TANDA[:] = ["(awal)"]; J.t = 0
    if not os.path.exists(ACU): os.makedirs(ACU); subprocess.run(f"git -C {REPO} archive main | tar -x -C {ACU}", shell=True, check=True)
    if not os.path.exists(P): siapkan("bab-01")
    tulis = types.ModuleType("tulis"); tulis.__dict__.update(Bab=Bab, CACAT=[], P=P, sh=sh, acuan=acuan, siapkan=siapkan, A=ACU)
    sys.modules["tulis"] = tulis
    import time as _t; _t.sleep = lambda x: setattr(J, "t", J.t + x); _t.time = lambda: J.t
    _sr = subprocess.run
    def sr(*a, **k):
        cmd = a[0] if a else k.get("args")
        if isinstance(cmd, str) and cmd.startswith("git -C " + REPO): return _sr(*a, **k)
        return types.SimpleNamespace(stdout="", stderr="", returncode=0)
    subprocess.run = sr
    src = open(skrip).read().replace("/home/user/lapor/L", "/tmp/silapor_sim/L")
    _ex = os.path.exists; os.path.exists = lambda p: True if str(p).endswith("/artisan") else _ex(p)
    try: exec(compile(src, skrip, "exec"), {"__name__": "__main__"})
    finally: subprocess.run = _sr; os.path.exists = _ex
    return list(EV)
if __name__ == "__main__":
    os.makedirs("data", exist_ok=True)
    for bab in sys.argv[1:]:
        hasil = {}
        for f in sorted(os.listdir(f"{PROD}/{bab}")):
            if f.startswith("rekam") and f.endswith(".py") and "web" not in f:
                nama = {"rekam.py": "rek", "rekam_a.py": "rek_a"}[f]
                hasil[nama] = main(bab, f"{PROD}/{bab}/{f}")
        json.dump(hasil, open(f"data/{bab}_peristiwa.json", "w"), indent=1, ensure_ascii=False)
        print(bab, {k: sum(1 for e in v if e["jenis"] in ("berkas", "perintah", "sql")) for k, v in hasil.items()})
