import os, sys; sys.path.insert(0, os.path.dirname(__file__)); import hp_umum as P
KODE = "H12"; NAMA = "Cara_Mematikan_Pelacakan_Iklan_di_HP"
JUDUL = "Cara membatasi<br><b>pelacakan iklan</b> di HP"
LANGKAH = ["ID iklan", "Android", "iPhone", "Akun"]
VIDEO = "Kenapa Aplikasi Favoritmu Makin Menyebalkan?"
EXTRA_CSS = P.CSS; EXTRA_HTML = P.HTML; EXTRA_JS = P.JS
LAFAL = [("HP", "ha pe"), ("iPhone", "ai fon"), ("Google", "gugel"), ("ID", "ai di")]
BEATS = [
 ("kait", "Kenapa iklan di HP-mu seolah tahu apa yang baru kamu cari? Aplikasi mengenali kamu lewat ID iklan. Begini cara membatasinya.", None),
 ("apa", "ID iklan adalah nomor unik di HP-mu. Aplikasi memakainya untuk mengenali kamu dan mengumpulkan kebiasaanmu.", "Ai di iklan adalah nomor unik di ha pe-mu. Aplikasi memakainya untuk mengenali kamu dan mengumpulkan kebiasaanmu."),
 ("android1", "Di Android, buka Setelan, lalu pilih Privasi, lalu pilih Iklan.", None),
 ("android2", "Ketuk Hapus ID iklan, lalu konfirmasi. Aplikasi tidak bisa lagi memakai nomor itu untuk mengenalimu.", "Ketuk, hapus ai di iklan, lalu konfirmasi. Aplikasi tidak bisa lagi memakai nomor itu untuk mengenalimu."),
 ("iphone", "Di iPhone, buka Pengaturan, lalu Privasi dan Keamanan, lalu Pelacakan. Matikan pilihan Izinkan App Meminta untuk Melacak.", None),
 ("akun", "Terakhir, buka pengaturan iklan di akun Google-mu, lalu matikan iklan yang dipersonalisasi.", None),
 ("hasil", "Iklan tetap muncul, tetapi tidak lagi disusun dari kebiasaanmu.", None),
 ("ajak", "Mau tahu kenapa aplikasi favoritmu makin penuh iklan? Tonton video lengkapnya.", None),
]
IKLAN = """<div class="hd">Beranda</div><div class="grp"><div class="it"><div class="ik" style="background:#5b8def"></div><div class="tx">Kamu baru mencari sepatu lari<div class="sm">Disponsori · Diskon sepatu lari 40%</div></div></div></div>
<div class="grp"><div class="it"><div class="ik" style="background:#e7a33e"></div><div class="tx">Masih memikirkan sepatu itu?<div class="sm">Disponsori · Stok tinggal 3</div></div></div></div>
<div class="grp" id="idk" style="margin-top:40px"><div class="it"><div class="tx">ID iklan HP ini<div class="sm" style="font-family:'JetBrains Mono';font-size:22px">38400000-8cf0-11bd-b23e-10b96e40000d</div></div></div></div>"""
SET = """<div class="hd">Setelan</div><div class="grp">
<div class="it"><div class="ik" style="background:#5b8def"></div><div class="tx">Jaringan & internet</div><div class="ar">›</div></div>
<div class="it"><div class="ik" style="background:#e7a33e"></div><div class="tx">Tampilan</div><div class="ar">›</div></div>
<div class="it" id="s1"><div class="ik" style="background:#7a5ce0"></div><div class="tx">Privasi</div><div class="ar">›</div></div>
<div class="it"><div class="ik" style="background:#2fb35a"></div><div class="tx">Baterai</div><div class="ar">›</div></div></div>"""
PRIV = """<div class="hd"><span class="bk">‹</span>Privasi</div><div class="grp">
<div class="it"><div class="tx">Pengelola izin</div><div class="ar">›</div></div>
<div class="it"><div class="tx">Riwayat aktivitas</div><div class="ar">›</div></div>
<div class="it" id="s2"><div class="tx">Iklan</div><div class="ar">›</div></div></div>"""
IK = """<div class="hd"><span class="bk">‹</span>Iklan</div><div class="grp">
<div class="it"><div class="tx">ID iklan Anda<div class="sm" id="idv" style="font-family:'JetBrains Mono';font-size:22px">38400000-8cf0-11bd-b23e-10b96e40000d</div></div></div>
<div class="it" id="s3"><div class="tx" style="color:#d64545;font-weight:700">Hapus ID iklan</div></div></div>
<div class="ket">Aplikasi tidak dapat lagi memakai ID iklan untuk menampilkan iklan yang dipersonalisasi.</div>"""
HAPUS = """<div class="hd"><span class="bk">‹</span>Iklan</div><div class="grp">
<div class="it"><div class="tx">ID iklan Anda<div class="sm" style="font-family:'JetBrains Mono';font-size:22px">00000000-0000-0000-0000-000000000000</div></div></div></div>
<div class="grp" id="s4"><div class="it"><div class="tx" style="color:#2fb35a;font-weight:700">ID iklan sudah dihapus</div></div></div>"""
KONF = IK + """<div style="position:absolute;inset:0;background:#0006"></div><div style="position:absolute;left:30px;right:30px;top:330px;background:#fff;border-radius:26px;padding:30px"><div style="font-size:30px;font-weight:800">Hapus ID iklan?</div><div style="font-size:24px;color:#555;margin:14px 0 26px">Aplikasi tidak bisa lagi memakai ID ini.</div><div style="display:flex;justify-content:flex-end;gap:40px;font-size:26px;font-weight:700"><span style="color:#3b6fd8">Batal</span><span id="s5" style="color:#d64545">Hapus</span></div></div>"""
IOS = """<div class="hd"><span class="bk">‹</span>Pelacakan</div><div class="grp">
<div class="it" id="i1"><div class="tx">Izinkan App Meminta untuk Melacak</div><div class="tg on" id="itg"></div></div></div>
<div class="ket">Pengaturan › Privasi & Keamanan › Pelacakan. Jika dimatikan, aplikasi tidak bisa meminta izin untuk melacakmu di aplikasi dan situs lain.</div>"""
AKUN = """<div class="hd"><span class="bk">‹</span>Pusat iklan akun</div><div class="grp">
<div class="it" id="a1"><div class="tx">Iklan yang dipersonalisasi<div class="sm">Iklan disusun dari aktivitasmu</div></div><div class="tg on" id="atg"></div></div></div>
<div class="ket">Buka akun Google › Data & privasi › Iklan yang dipersonalisasi.</div>"""
async def ADEGAN(r):
    L = lambda h: r.js("h=>layar(h)", h)
    await L(IKLAN)
    await r.beat(0, pad=0.5)
    await r.langkah(1)
    async def a1():
        await r.tidur(0.8); await r.sorot_el("#idk", 6)
    await r.beat(1, a1, pad=0.8)
    await r.lepas(); await r.langkah(2); await L(SET)
    async def a2():
        await r.tidur(1.4); await r.sorot_el("#s1", 4); await r.js("ketuk('#s1')"); await r.tidur(0.7); await r.lepas(); await L(PRIV)
        await r.tidur(0.9); await r.sorot_el("#s2", 4); await r.js("ketuk('#s2')"); await r.tidur(0.7); await r.lepas(); await L(IK)
    await r.beat(2, a2, pad=0.6)
    async def a3():
        await r.tidur(0.4); await r.sorot_el("#s3", 4); await r.js("ketuk('#s3')"); await r.tidur(0.8); await r.lepas(); await L(KONF)
        await r.tidur(1.2); await r.js("ketuk('#s5')"); await r.tidur(0.6); await L(HAPUS); await r.tidur(0.4); await r.sorot_el("#s4", 4)
    await r.beat(3, a3, pad=1.0)
    await r.lepas(); await r.langkah(3); await L(IOS)
    async def a4():
        await r.tidur(4.5); await r.sorot_el("#i1", 4); await r.tidur(0.6); await r.js("ketuk('#itg')"); await r.tidur(0.2); await r.js("document.getElementById('itg').classList.remove('on')")
    await r.beat(4, a4, pad=1.0)
    await r.lepas(); await r.langkah(4); await L(AKUN)
    async def a5():
        await r.tidur(3.0); await r.sorot_el("#a1", 4); await r.tidur(0.5); await r.js("ketuk('#atg')"); await r.tidur(0.2); await r.js("document.getElementById('atg').classList.remove('on')")
    await r.beat(5, a5, pad=1.0)
    await r.lepas()
    await r.beat(6, pad=0.6)
    async def a7():
        await r.tidur(0.5); await r.akhir(VIDEO)
    await r.beat(7, a7, pad=1.8)
