import os, sys, json, subprocess, asyncio; sys.path.insert(0, os.path.dirname(__file__)); import web_umum as W
KODE = "H10"; NAMA = "Cara_Membaca_Excel_dengan_Python_pandas"
JUDUL = "Cara membaca <b>Excel</b><br>dengan Python pandas"
LANGKAH = ["Impor", "Baca", "Hitung", "Simpan"]
VIDEO = "Olah Data Nilai Otomatis dengan Python dan Excel"
PATH_EXTRA = ":/opt/siswa-bin"
EXTRA_CSS = W.CSS + "#web iframe{position:absolute;left:0;top:56px;width:521px;height:492px;border:0;background:#fff;transform:scale(1.95);transform-origin:0 0}"
EXTRA_HTML = W.HTML; EXTRA_JS = W.JS
LAFAL = [("pip install pandas openpyxl", "pip instol pandas open pai eks el"), ("openpyxl", "open pai eks el"), ("import pandas as pd", "impor pandas es pe de"), ("pd.read_excel", "pe de rid eksel"), ("df.head()", "de ef titik hed"), ("to_excel", "tu eksel"), ("df", "de ef"), ("mean", "min"), ("axis", "aksis"), ("Jupyter Notebook", "Jupiter Noutbuk"), ("Jupyter", "Jupiter"), ("pip install notebook", "pip instol noutbuk"), ("Colab", "Kolab"), ("print", "prin"), ("Shift", "Syif"), ("Ctrl", "kontrol")]
SIAPKAN = r"""mkdir -p ~/belajar-python ~/.jupyter && cd ~/belajar-python && python3 -c "import pandas as pd; pd.DataFrame({'Nama':['Ayu','Bima','Citra','Dodi','Eka','Fajar'],'MTK':[85,70,92,64,78,88],'IPA':[80,75,90,70,82,84],'BIN':[88,72,85,76,80,79]}).to_excel('nilai.xlsx', index=False)" && python3 -c "import json;json.dump({'cells':[{'cell_type':'code','execution_count':None,'metadata':{},'outputs':[],'source':[]}],'metadata':{'kernelspec':{'display_name':'Python 3 (ipykernel)','language':'python','name':'python3'}},'nbformat':4,'nbformat_minor':5},open('latihan.ipynb','w'))" && printf 'c.ServerApp.tornado_settings = {"headers": {"Content-Security-Policy": "frame-ancestors *"}}\n' > ~/.jupyter/jupyter_server_config.py && mkdir -p ~/.jupyter/lab/user-settings/@jupyterlab/apputils-extension && printf '{"overrides": {"code-font-size": "20px", "content-font-size1": "20px"}}' > ~/.jupyter/lab/user-settings/@jupyterlab/apputils-extension/themes.jupyterlab-settings"""
BEATS = [
 ("kait", "Punya data nilai di Excel dan ingin mengolahnya otomatis? Python dengan pandas bisa membacanya dalam satu baris.", None),
 ("pasang", "Pertama, pasang pandas dan openpyxl dengan perintah pip install. Lalu buka Jupyter Notebook di folder tempat berkas Excel-mu berada.", "Pertama, pasang pandas dan open pai eks el dengan perintah pip instol. Lalu buka Jupiter Noutbuk di folder tempat berkas eksel-mu berada."),
 ("import", "Di sel pertama, ketik `import pandas as pd`. Singkatan pd ini dipakai di seluruh kode.", "Di sel pertama, ketik, impor pandas es pe de. Singkatan pe de ini dipakai di seluruh kode."),
 ("baca", "Kedua, baca berkas Excel dengan `pd.read_excel`, diikuti nama berkasnya. Simpan hasilnya di variabel df.", "Kedua, baca berkas eksel dengan, pe de rid eksel, diikuti nama berkasnya. Simpan hasilnya di variabel de ef."),
 ("lihat", "Lalu ketik `df.head()` untuk melihat lima baris pertama. Data Excel-mu kini menjadi tabel di Python.", "Lalu ketik, de ef titik hed, untuk melihat lima baris pertama. Data eksel-mu kini menjadi tabel di Python."),
 ("hitung", "Ketiga, hitung rata-rata nilai setiap siswa dengan mean dan axis satu, lalu simpan di kolom baru bernama Rata.", "Ketiga, hitung rata-rata nilai setiap siswa dengan min dan aksis satu, lalu simpan di kolom baru bernama Rata."),
 ("simpan", "Terakhir, simpan hasilnya ke berkas Excel baru dengan `to_excel`. Berkas itu siap dibuka di Excel.", "Terakhir, simpan hasilnya ke berkas eksel baru dengan, tu eksel. Berkas itu siap dibuka di eksel."),
 ("ajak", "Mau membuat peringkat dan predikat otomatis juga? Tonton video lengkapnya.", None),
]
async def ADEGAN(r):
    await r.ketik("cd belajar-python", cps=30); await r.enter(0.1); await r.tidur(0.3); await r.bersih()
    await r.ketik("ls"); await r.enter(); await r.tidur(0.5)
    await r.beat(0, pad=0.5)
    async def a1():
        await r.tidur(0.5); await r.kartu("Pasang sekali saja", "pip install pandas openpyxl\njupyter notebook")
        await r.tidur(3.0); await r.kartu(None); await r.ketik("jupyter notebook"); await r.enter(); await r.tunggu("tree?token")
    await r.beat(1, a1, pad=0.6)
    out = subprocess.run(["su", "-", "siswa", "-c", "PATH=/opt/siswa-bin:$PATH jupyter server list --json"], capture_output=True, text=True).stdout.strip().splitlines()[0]
    info = json.loads(out); tok = info["token"]; base = f"http://127.0.0.1:{info['port']}"
    await r.js("a=>hal(...a)", ["127.0.0.1:8888/notebooks/latihan.ipynb", f'<iframe id="jf" src="{base}/notebooks/latihan.ipynb?token={tok}"></iframe>'])
    fr = r.pg.frame_locator("#jf")
    await fr.locator(".jp-Cell .cm-content").first.wait_for(timeout=30000); await r.tidur(1.0)
    jfr = next(f for f in r.pg.frames if ":8888" in f.url)
    await jfr.add_style_tag(content=".jp-RenderedHTMLCommon table{font-size:17px !important} .jp-RenderedHTMLCommon td,.jp-RenderedHTMLCommon th{padding:4px 10px !important}")
    async def gulir():
        await r.tidur(0.3); await jfr.evaluate("()=>{const c=document.querySelectorAll('.jp-Cell'); c[c.length-2].scrollIntoView({block:'start'})}"); await r.tidur(0.4)
    await r.js("web(true)"); await r.tidur(3.0)
    await fr.locator(".jp-Cell .cm-content").first.click(); await r.tidur(0.4)
    async def sel(kode, tunggu=None, sorot=True):
        await r.pg.keyboard.type(kode, delay=75); await r.tidur(0.5); await r.pg.keyboard.press("Shift+Enter")
        if tunggu:
            el = fr.get_by_text(tunggu, exact=True).last; await el.wait_for(timeout=30000)
            if sorot: await r.tidur(0.3); await r.sorot_kotak(await el.bounding_box())
        else: await r.tidur(1.0)
    await r.langkah(1)
    async def a2():
        await r.tidur(1.2); await sel("import pandas as pd")
    await r.beat(2, a2, pad=0.6)
    await r.langkah(2)
    async def a3():
        await r.tidur(1.0); await sel('df = pd.read_excel("nilai.xlsx")')
    await r.beat(3, a3, pad=0.6)
    async def a4():
        await r.tidur(0.6); await r.pg.keyboard.type("df.head()", delay=90); await r.tidur(0.4); await r.pg.keyboard.press("Shift+Enter")
        el = fr.locator(".jp-RenderedHTMLCommon table").last; await el.wait_for(timeout=30000); await gulir(); await r.sorot_kotak(await el.bounding_box())
    await r.beat(4, a4, pad=1.4)
    await r.lepas(); await r.langkah(3)
    async def a5():
        await r.tidur(0.6); await r.pg.keyboard.type('df["Rata"] = df[["MTK", "IPA", "BIN"]].mean(axis=1)', delay=60); await r.tidur(0.4); await r.pg.keyboard.press("Shift+Enter"); await r.tidur(0.8)
        await r.pg.keyboard.type("df", delay=90); await r.tidur(0.4); await r.pg.keyboard.press("Shift+Enter")
        el = fr.locator(".jp-RenderedHTMLCommon table").last; await el.wait_for(timeout=30000); await gulir()
        cel = fr.locator(".jp-RenderedHTMLCommon table").last.locator("th", has_text="Rata"); await r.sorot_kotak(await el.bounding_box())
    await r.beat(5, a5, pad=1.6)
    await r.lepas(); await r.langkah(4)
    async def a6():
        await r.tidur(0.6); await r.pg.keyboard.type('df.to_excel("hasil.xlsx", index=False)', delay=70); await r.tidur(0.4); await r.pg.keyboard.press("Shift+Enter"); await r.tidur(1.2)
        await r.pg.keyboard.type("import os; os.listdir()", delay=70); await r.tidur(0.4); await r.pg.keyboard.press("Shift+Enter")
        el = fr.get_by_text("hasil.xlsx", exact=False).last; await el.wait_for(timeout=20000); await r.tidur(0.4); await r.sorot_kotak(await el.bounding_box())
    await r.beat(6, a6, pad=1.4)
    await r.lepas()
    async def a7():
        await r.tidur(0.5); await r.akhir(VIDEO)
    await r.beat(7, a7, pad=1.8)
