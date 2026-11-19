import os, sys, json, subprocess, asyncio; sys.path.insert(0, os.path.dirname(__file__)); import web_umum as W
KODE = "H09"; NAMA = "Cara_Menjalankan_Python_di_Jupyter"
JUDUL = "Cara menjalankan<br><b>Python</b> di Jupyter Notebook"
LANGKAH = ["Pasang", "Buka", "Ketik", "Jalankan"]
VIDEO = "Bikin Game Tebak Angka Pertamamu dengan Python"
PATH_EXTRA = ":/opt/siswa-bin"
EXTRA_CSS = W.CSS + "#web iframe{position:absolute;left:0;top:56px;width:521px;height:492px;border:0;background:#fff;transform:scale(1.95);transform-origin:0 0}"
EXTRA_HTML = W.HTML; EXTRA_JS = W.JS
LAFAL = [("Jupyter Notebook", "Jupiter Noutbuk"), ("Jupyter", "Jupiter"), ("pip install notebook", "pip instol noutbuk"), ("Colab", "Kolab"), ("print", "prin"), ("Shift", "Syif"), ("Ctrl", "kontrol")]
SIAPKAN = r"""mkdir -p ~/belajar-python ~/.jupyter && cd ~/belajar-python && python3 -c "import json;json.dump({'cells':[{'cell_type':'code','execution_count':None,'metadata':{},'outputs':[],'source':[]}],'metadata':{'kernelspec':{'display_name':'Python 3 (ipykernel)','language':'python','name':'python3'}},'nbformat':4,'nbformat_minor':5},open('latihan.ipynb','w'))" && printf 'c.ServerApp.tornado_settings = {"headers": {"Content-Security-Policy": "frame-ancestors *"}}\n' > ~/.jupyter/jupyter_server_config.py && mkdir -p ~/.jupyter/lab/user-settings/@jupyterlab/apputils-extension && printf '{"overrides": {"code-font-size": "20px", "content-font-size1": "20px"}}' > ~/.jupyter/lab/user-settings/@jupyterlab/apputils-extension/themes.jupyterlab-settings"""
BEATS = [
 ("kait", "Mau mulai belajar Python tanpa ribet? Jalankan kodenya di Jupyter Notebook. Begini caranya.", None),
 ("pasang", "Pertama, pasang Jupyter dengan perintah `pip install notebook`. Kalau tidak mau memasang apa pun, pakai Google Colab di browser.", None),
 ("buka", "Kedua, buka terminal di folder belajarmu, lalu ketik `jupyter notebook`. Jupyter memberi alamat untuk dibuka di browser.", "Kedua, buka terminal di folder belajarmu, lalu ketik, jupiter noutbuk. Jupiter memberi alamat untuk dibuka di brauser."),
 ("file", "Di browser, terlihat isi foldermu. Klik notebook yang ingin kamu pakai, atau buat yang baru lewat tombol New.", None),
 ("ketik", "Ketiga, klik sel kosong, lalu ketik kode Python, misalnya print, halo dunia.", "Ketiga, klik sel kosong, lalu ketik kode Python, misalnya prin, halo dunia."),
 ("jalankan", "Keempat, tekan Shift dan Enter. Hasilnya langsung muncul di bawah sel, dan sel baru siap diisi.", None),
 ("hitung", "Coba juga hitungan. Python mengerjakan perkalian lebih dulu, jadi dua tambah tiga kali empat hasilnya empat belas.", None),
 ("ajak", "Mau langsung membuat game pertamamu dengan Python? Tonton video lengkapnya.", None),
]
async def ADEGAN(r):
    await r.ketik("cd belajar-python", cps=30); await r.enter(0.1); await r.tidur(0.3); await r.bersih()
    await r.beat(0, pad=0.5)
    await r.langkah(1)
    async def a1():
        await r.tidur(0.5); await r.kartu("Pasang Jupyter", "pip install notebook\n\nTanpa memasang: buka colab.research.google.com")
    await r.beat(1, a1, pad=1.6)
    await r.kartu(None); await r.langkah(2)
    async def a2():
        await r.tidur(2.4); await r.ketik("jupyter notebook"); await r.enter(); await r.tunggu("http://127.0.0.1:8888/tree?token")
        await r.tidur(0.5); await r.sorot("http://127.0.0.1:8888/tree?token", 2, True)
    await r.beat(2, a2, pad=1.0)
    await r.lepas()
    out = subprocess.run(["su", "-", "siswa", "-c", "PATH=/opt/siswa-bin:$PATH jupyter server list --json"], capture_output=True, text=True).stdout.strip().splitlines()[0]
    info = json.loads(out); tok = info["token"]; base = f"http://127.0.0.1:{info['port']}"
    await r.js("a=>hal(...a)", ["127.0.0.1:8888/tree", f'<iframe id="jf" src="{base}/tree?token={tok}"></iframe>']); await r.tidur(2.5)
    await r.js("web(true)")
    fr = r.pg.frame_locator("#jf")
    async def a3():
        await r.tidur(1.2)
        el = fr.get_by_text("latihan.ipynb").first; bb = await el.bounding_box()
        await r.sorot_kotak(bb); await r.tidur(3.0)
    await r.beat(3, a3, pad=0.6)
    await r.js("a=>hal(...a)", ["127.0.0.1:8888/notebooks/latihan.ipynb", f'<iframe id="jf" src="{base}/notebooks/latihan.ipynb?token={tok}"></iframe>'])
    fr = r.pg.frame_locator("#jf")
    await r.lepas(); await fr.locator(".jp-Cell .cm-content").first.wait_for(timeout=30000); await r.tidur(4.0)
    await r.langkah(3)
    async def a4():
        await r.tidur(1.5); await fr.locator(".jp-Cell .cm-content").first.click(); await r.tidur(0.5)
        await r.pg.keyboard.type('print("Halo, dunia!")', delay=90)
    await r.beat(4, a4, pad=0.8)
    await r.langkah(4)
    async def a5():
        await r.tidur(0.8); await r.pg.keyboard.press("Shift+Enter")
        el = fr.get_by_text("Halo, dunia!", exact=True).first; await el.wait_for(timeout=20000); await r.sorot_kotak(await el.bounding_box())
    await r.beat(5, a5, pad=1.2)
    await r.lepas()
    async def a6():
        await r.tidur(0.8); await r.pg.keyboard.type("2 + 3 * 4", delay=110); await r.tidur(0.6); await r.pg.keyboard.press("Shift+Enter")
        el = fr.get_by_text("14", exact=True).first; await el.wait_for(timeout=20000); await r.sorot_kotak(await el.bounding_box())
    await r.beat(6, a6, pad=1.4)
    await r.lepas()
    async def a7():
        await r.tidur(0.5); await r.akhir(VIDEO)
    await r.beat(7, a7, pad=1.8)
