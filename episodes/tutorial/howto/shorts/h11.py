import os, sys; sys.path.insert(0, os.path.dirname(__file__)); import hp_umum as P
KODE = "H11"; NAMA = "Cara_Melindungi_Keluarga_dari_Suara_Palsu_AI"
JUDUL = "Cara melindungi keluarga<br>dari <b>suara palsu AI</b>"
LANGKAH = ["Kenali", "Sandi", "Telepon", "Privasi"]
VIDEO = "Suara Ibumu Bisa Dipalsukan dalam 3 Detik"
EXTRA_CSS = P.CSS; EXTRA_HTML = P.HTML; EXTRA_JS = P.JS
LAFAL = [("AI", "e ai"), ("HP", "ha pe"), ("WhatsApp", "wotsep")]
BEATS = [
 ("kait", "Telepon dari nomor asing, dan suaranya persis seperti kakakmu yang minta ditransfer uang? Bisa jadi itu suara palsu buatan AI. Begini cara melindungi keluargamu.", None),
 ("kenali", "Pertama, kenali polanya. Penipu membuat kamu panik, meminta uang segera, dan melarang kamu menelepon orang lain.", None),
 ("sandi", "Kedua, sepakati kata sandi keluarga. Pilih kata yang mudah diingat tetapi tidak pernah diunggah ke internet.", None),
 ("tanya", "Saat ada telepon darurat, tanyakan kata sandi itu. Suara palsu tidak akan tahu jawabannya.", None),
 ("tutup", "Ketiga, tutup teleponnya, lalu telepon balik ke nomor yang sudah tersimpan di kontakmu. Jangan memakai nomor yang menelepon tadi.", None),
 ("privasi", "Keempat, kurangi rekaman suaramu yang terbuka untuk umum. Jadikan akun media sosialmu privat, karena AI hanya butuh beberapa detik suara.", None),
 ("ajak", "Mau tahu bagaimana suara bisa dipalsukan secepat itu? Tonton video lengkapnya.", None),
]
TEL = """<div class="tel"><div class="av">?</div><div class="nm">+62 812-xxxx-0917</div><div class="st">Panggilan masuk</div>
<div class="ac"><div style="background:#d64545">Tolak</div><div style="background:#2fb35a">Angkat</div></div></div>"""
CHAT1 = """<div class="hd"><span class="bk">‹</span>+62 812-xxxx-0917</div><div class="chat">
<div class="bb" id="p1">Dek, ini kakak. HP kakak rusak, ini nomor baru.</div>
<div class="bb" id="p2">Tolong transfer 2 juta SEKARANG, kakak kena masalah. Jangan bilang Ibu dulu ya!</div>
<div class="bb">▶ 0:07 pesan suara</div></div>"""
GRUP = """<div class="hd"><span class="bk">‹</span>Keluarga Kita</div><div class="chat">
<div class="bb aku" id="g1">Mulai sekarang, kalau ada telepon darurat minta uang, tanya kata sandi keluarga dulu ya.</div>
<div class="bb"><div class="nm">Ibu</div>Setuju. Kata sandinya: pisang goreng ayah.</div>
<div class="bb"><div class="nm">Kak Rani</div>Siap, jangan diunggah ke mana-mana.</div></div>"""
TANYA = """<div class="hd"><span class="bk">‹</span>+62 812-xxxx-0917</div><div class="chat">
<div class="bb">Dek, cepat, kakak butuh uangnya sekarang!</div>
<div class="bb aku" id="t1">Kak, sebutkan dulu kata sandi keluarga kita.</div>
<div class="bb" id="t2">Aduh, nggak ada waktu! Transfer saja dulu!</div></div>"""
KONTAK = """<div class="hd">Kontak</div><div class="grp">
<div class="it"><div class="ik" style="background:#e7a33e"></div><div class="tx">Ayah</div></div>
<div class="it"><div class="ik" style="background:#d76aa0"></div><div class="tx">Ibu</div></div>
<div class="it" id="k1"><div class="ik" style="background:#5b8def"></div><div class="tx">Kak Rani<div class="sm">0813-xxxx-2210 · tersimpan</div></div><div class="ar">📞</div></div></div>
<div class="ket">Telepon balik lewat nomor yang sudah kamu simpan, bukan nomor yang baru menelepon.</div>"""
PRIV = """<div class="hd"><span class="bk">‹</span>Privasi akun</div><div class="grp">
<div class="it" id="v1"><div class="tx">Akun privat<div class="sm">Hanya pengikut yang kamu setujui yang bisa melihat video dan suaramu</div></div><div class="tg" id="tg1"></div></div>
<div class="it"><div class="tx">Siapa yang boleh mengunduh videomu</div><div class="ar">Tidak ada ›</div></div></div>"""
async def ADEGAN(r):
    await r.js("h=>layar(h)", TEL)
    await r.beat(0, pad=0.5)
    await r.langkah(1); await r.js("h=>layar(h)", CHAT1)
    async def a1():
        await r.tidur(1.6); await r.sorot_el("#p1", 8); await r.tidur(2.2); await r.sorot_el("#p2", 8)
    await r.beat(1, a1, pad=1.0)
    await r.lepas(); await r.langkah(2); await r.js("h=>layar(h)", GRUP)
    async def a2():
        await r.tidur(1.8); await r.sorot_el("#g1", 8)
    await r.beat(2, a2, pad=0.8)
    await r.lepas(); await r.js("h=>layar(h)", TANYA)
    async def a3():
        await r.tidur(1.0); await r.sorot_el("#t1", 8); await r.tidur(2.4); await r.sorot_el("#t2", 8)
    await r.beat(3, a3, pad=1.0)
    await r.lepas(); await r.langkah(3); await r.js("h=>layar(h)", KONTAK)
    async def a4():
        await r.tidur(3.0); await r.sorot_el("#k1", 6); await r.tidur(0.8); await r.js("ketuk('#k1 .ar')")
    await r.beat(4, a4, pad=1.0)
    await r.lepas(); await r.langkah(4); await r.js("h=>layar(h)", PRIV)
    async def a5():
        await r.tidur(2.2); await r.sorot_el("#v1", 6); await r.tidur(0.6); await r.js("ketuk('#tg1')"); await r.tidur(0.2); await r.js("document.getElementById('tg1').classList.add('on')")
    await r.beat(5, a5, pad=1.0)
    await r.lepas()
    async def a6():
        await r.tidur(0.5); await r.akhir(VIDEO)
    await r.beat(6, a6, pad=1.8)
