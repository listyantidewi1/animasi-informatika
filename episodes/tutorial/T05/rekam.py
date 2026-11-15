import sys, time, glob
sys.path.insert(0, "/home/user/tut/alat")
from rekam import Rekaman
from tm import kotak, tengah, tutup_tip
G = "/home/user/tut/T05/gambar"
EDIT = "[aria-label*=dit], .edit, #edit, [title*=dit]"
r = Rekaman("/home/user/tut/T05/rek", "https://teachablemachine.withgoogle.com/"); pg = r.pg
time.sleep(7); r.gerak(700, 450, 0.01)
r.mulai(); time.sleep(0.6); r.kamera(None)
r.tanda("b04")
try: b = kotak(pg, "OK, got it"); r.klik(xy=tengah(b)); time.sleep(0.8)
except Exception: pass
b = kotak(pg, "Get Started"); r.kamera(b, zoom=1.6); r.klik(xy=tengah(b)); time.sleep(3.5); r.kamera(None)
b = kotak(pg, "Image Project"); r.klik(xy=tengah(b)); time.sleep(1.5)
b = kotak(pg, "Standard image model"); r.kamera([b[0] - 200, b[1] - 250, b[2] + 400, 500], zoom=1.5); r.klik(xy=tengah(b)); time.sleep(4.5); r.kamera(None)
r.klik(xy=(457, 402)); time.sleep(0.8)
def ganti(i, nama):
    e = sorted(kotak(pg, None, EDIT, -1), key=lambda b: b[1])[i]
    r.kamera([e[0] - 90, e[1] - 30, 700, 120], zoom=1.9)
    r.klik(xy=tengah(e)); time.sleep(0.5); pg.keyboard.press("Control+a"); time.sleep(0.2); r.ketik(nama, 7); time.sleep(0.3); pg.keyboard.press("Enter"); time.sleep(1.0)
ganti(0, "Kucing"); ganti(1, "Anjing"); r.kamera(None); time.sleep(0.8); r.tanda("b04_akhir")
def unggah(i, folder, judul_y=None):
    e = sorted(kotak(pg, None, EDIT, -1), key=lambda b: b[1])
    if e[i][1] > 430:
        r.gerak(600, 500, 0.3)
        for _ in range(int((e[i][1] - 110) / 60)): pg.mouse.wheel(0, 60); time.sleep(0.03)
        time.sleep(0.8); e = sorted(kotak(pg, None, EDIT, -1), key=lambda b: b[1])
    y0 = e[i][1]
    u = sorted([b for b in kotak(pg, "Upload", idx=-1) if b[3] > 40 and b[1] > y0], key=lambda b: b[1])[0]
    r.kamera([150, y0 - 40, 800, 560], zoom=None); r.klik(xy=tengah(u)); time.sleep(1.2)
    t = sorted([b for b in kotak(pg, "Choose images from your files, or drag & drop here", idx=-1) if b[1] > y0], key=lambda b: -b[2] * b[3])[0]
    r.label(f"Pilih semua gambar di folder {folder}", 3.0)
    with pg.expect_file_chooser(timeout=5000) as fc: r.klik(xy=tengah(t))
    time.sleep(0.6); fc.value.set_files(sorted(glob.glob(f"{G}/{folder}/*.jpg"))); time.sleep(3.2)
    r.klik(xy=(t[0] + t[2] - 9, t[1] - 23)); time.sleep(1.0)
r.tanda("b05"); unggah(0, "Kucing"); unggah(1, "Anjing"); r.kamera(None); time.sleep(1.0); r.tanda("b05_akhir")
def latih(nama):
    tutup_tip(r, pg, "2. Train your Model"); time.sleep(0.6)
    tr = sorted(kotak(pg, "Train Model", idx=-1), key=lambda b: -b[2] * b[3])[0]
    r.kamera([tr[0] - 60, tr[1] - 90, 320, 260], zoom=1.9); r.klik(xy=tengah(tr)); time.sleep(1.5)
    r.tanda(nama); r.label("Training berjalan (dipercepat)", 60)
    for k in range(150):
        time.sleep(1)
        if kotak(pg, "Model Trained", idx=0): break
    time.sleep(1.0); r.tanda(nama + "_selesai"); r.label("Model Trained", 2.5); time.sleep(2.0)
r.tanda("b07"); latih("b07_latih"); r.tanda("b07_akhir")
time.sleep(0.5)
tutup_tip(r, pg, "3. Export your model"); time.sleep(0.8); r.kamera(None)
def ke_file():
    sl = [b for b in kotak(pg, None, "select", -1) if b[0] > 1000]
    s0 = sorted(sl, key=lambda b: b[1])[0]
    for b in sl:
        pass
    val = pg.evaluate("""(()=>{let v=null;const j=(r)=>{for(const e of r.querySelectorAll('select')) if([...e.options].some(o=>o.value==='file')) v=e.value; for(const e of r.querySelectorAll('*')) if(e.shadowRoot) j(e.shadowRoot)};j(document);return v})()""")
    ada = [b for b in kotak(pg, "Choose images from your files, or drag & drop here", idx=-1) if b[0] > 1000]
    if val == "file" and ada: return
    cand = [b for b in sl if b[2] < 200]; s0 = sorted(cand or sl, key=lambda b: b[1])[0]
    r.kamera([s0[0] - 300, s0[1] - 60, 520, 220], zoom=1.9)
    if val == "file":
        r.klik(xy=tengah(s0)); time.sleep(0.5); pg.keyboard.press("ArrowUp"); time.sleep(0.2); pg.keyboard.press("Enter"); time.sleep(0.6)
    r.klik(xy=tengah(s0)); time.sleep(0.8); pg.keyboard.press("ArrowDown"); time.sleep(0.4); pg.keyboard.press("Enter"); time.sleep(1.2)
def uji(nama, tahan=2.5):
    if not [b for b in kotak(pg, "Choose images from your files, or drag & drop here", idx=-1) if b[0] > 1000]:
        pg.screenshot(path="/tmp/claude-0/t5_err.png"); print("selects", pg.evaluate("""(()=>{let v=[];const j=(r)=>{for(const e of r.querySelectorAll('select')) v.push(e.value); for(const e of r.querySelectorAll('*')) if(e.shadowRoot) j(e.shadowRoot)};j(document);return v})()"""))
    t = sorted([b for b in kotak(pg, "Choose images from your files, or drag & drop here", idx=-1) if b[0] > 1000], key=lambda b: -b[2] * b[3])[0]
    with pg.expect_file_chooser(timeout=5000) as fc: r.klik(xy=tengah(t))
    time.sleep(0.4); fc.value.set_files(f"{G}/uji/{nama}.jpg"); time.sleep(3.0)
    o = kotak(pg, "Output", idx=0); vh = pg.evaluate("innerHeight")
    if o and o[1] > vh - 200:
        r.gerak(1300, 500, 0.3)
        for _ in range(int((o[1] - (vh - 330)) / 60) + 1): pg.mouse.wheel(0, 60); time.sleep(0.03)
        time.sleep(0.6); o = kotak(pg, "Output", idx=0)
    pv = kotak(pg, "Preview", idx=0)
    top = max(0, o[1] - 230); r.kamera([1060, top, 400, min(vh, o[1] + 220) - top], zoom=None); time.sleep(tahan)
    print(nama, pg.evaluate("""(()=>{const out=[];const j=(r)=>{for(const e of r.querySelectorAll('*')){if(e.shadowRoot)j(e.shadowRoot); const t=(e.innerText||'').trim(); if(/^\\d+%$/.test(t)&&e.children.length===0) out.push(t)}};j(document);return out})()"""))
r.tanda("b10"); ke_file(); uji("kucing_baru", 2.6); uji("kucing_setengah", 2.6); uji("anjing_baru", 2.6); r.tanda("b10_akhir")
r.tanda("b12"); uji("sepeda", 2.5); r.label("Sepeda dipaksa menjadi kucing atau anjing", 2.5); time.sleep(0.5); r.kamera(None)
r.gerak(600, 500, 0.3)
for _ in range(12): pg.mouse.wheel(0, 60); time.sleep(0.03)
time.sleep(0.6); a = kotak(pg, "Add a class"); r.kamera([a[0] - 150, a[1] - 120, 700, 260], zoom=1.6); r.klik(xy=tengah(a)); time.sleep(1.2)
ganti(2, "Bukan keduanya"); unggah(2, "Bukan"); r.kamera(None); time.sleep(0.6)
r.gerak(600, 400, 0.3)
for _ in range(12): pg.mouse.wheel(0, -60); time.sleep(0.03)
time.sleep(0.6); latih("b12_latih"); ke_file(); uji("sepeda_merah", 3.5); r.tanda("b12_akhir")
time.sleep(0.5); r.selesai(); print("selesai", r.log["durasi"])
