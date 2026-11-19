import os, sys; sys.path.insert(0, os.path.dirname(__file__)); import hp_umum as P
KODE = "H13"; NAMA = "Cara_Mengecek_Jawaban_AI"
JUDUL = "Cara mengecek<br><b>jawaban AI</b> sebelum percaya"
LANGKAH = ["Sumber", "Buka", "Cocokkan", "Waspada"]
VIDEO = "Apakah AI Benar-benar Berpikir?"
EXTRA_CSS = P.CSS + "#ponsel .bb.ai{background:#eef1ff} #ponsel .src{color:#3b6fd8;text-decoration:underline}"
EXTRA_HTML = P.HTML; EXTRA_JS = P.JS
LAFAL = [("AI", "e ai"), (".go.id", "dot go dot ai di")]
BEATS = [
 ("kait", "Jawaban AI terdengar meyakinkan, tetapi belum tentu benar. Begini cara mengeceknya dalam empat langkah.", None),
 ("contoh", "Contohnya, kita bertanya berapa jumlah provinsi di Indonesia. AI menjawab tiga puluh empat dengan sangat yakin.", None),
 ("sumber", "Pertama, minta sumbernya. Ketik, sebutkan sumbernya beserta tanggalnya.", None),
 ("buka", "Kedua, buka sumber itu. Periksa apakah halamannya benar-benar ada, isinya cocok, dan tanggalnya tidak usang. Di sini, datanya ternyata dari tahun 2019.", None),
 ("cocok", "Ketiga, cocokkan dengan sumber lain yang tepercaya, misalnya situs resmi pemerintah. Ternyata sejak akhir 2022, Indonesia memiliki tiga puluh delapan provinsi.", None),
 ("waspada", "Keempat, waspadai angka, tanggal, nama, dan kutipan. Bagian inilah yang paling sering salah, karena AI menyusun kalimat yang terdengar benar, bukan memeriksa fakta.", None),
 ("ajak", "Mau tahu kenapa AI bisa salah dengan sangat yakin? Tonton video lengkapnya.", None),
]
CHAT = """<div class="hd">Asisten AI</div><div class="chat">
<div class="bb aku">Berapa jumlah provinsi di Indonesia?</div>
<div class="bb ai" id="c1">Indonesia memiliki <b>34 provinsi</b>, mulai dari Aceh di ujung barat sampai Papua di ujung timur.</div>
<div class="bb aku" id="c2" style="display:none">Sebutkan sumbernya beserta tanggalnya.</div>
<div class="bb ai" id="c3" style="display:none">Sumber: <span class="src" id="c4">data statistik daerah, terbitan 2019</span></div></div>"""
WEB = """<div class="hd"><span class="bk">‹</span>Data Statistik Daerah</div><div class="grp"><div class="it"><div class="tx" style="font-size:26px">Jumlah provinsi: 34<div class="sm" id="w1" style="font-size:24px;color:#d64545;font-weight:700">Diterbitkan: 2019</div></div></div></div>
<div class="ket">Halaman ada, isinya cocok dengan jawaban AI, tetapi datanya sudah berumur beberapa tahun.</div>"""
CARI = """<div class="hd">Pencarian</div><div class="grp"><div class="it"><div class="tx">jumlah provinsi Indonesia terbaru</div></div></div>
<div class="grp" id="r1"><div class="it"><div class="tx"><div class="sm">situs resmi pemerintah · .go.id</div>Indonesia kini memiliki <b>38 provinsi</b> setelah pemekaran empat provinsi baru di Papua pada 2022.</div></div></div>
<div class="grp"><div class="it"><div class="tx"><div class="sm">ensiklopedia daring</div>Daftar 38 provinsi di Indonesia</div></div></div>"""
WAS = """<div class="hd">Bagian yang wajib dicek</div><div class="grp">
<div class="it"><div class="ik" style="background:#d64545"></div><div class="tx">Angka dan statistik</div></div>
<div class="it"><div class="ik" style="background:#e7a33e"></div><div class="tx">Tanggal dan tahun</div></div>
<div class="it"><div class="ik" style="background:#7a5ce0"></div><div class="tx">Nama orang dan tempat</div></div>
<div class="it"><div class="ik" style="background:#5b8def"></div><div class="tx">Kutipan dan judul buku</div></div></div>"""
async def ADEGAN(r):
    L = lambda h: r.js("h=>layar(h)", h)
    await L(CHAT)
    await r.beat(0, pad=0.5)
    async def a1():
        await r.tidur(3.0); await r.sorot_el("#c1", 6)
    await r.beat(1, a1, pad=0.8)
    await r.lepas(); await r.langkah(1)
    async def a2():
        await r.tidur(1.0); await r.js("document.getElementById('c2').style.display=''"); await r.tidur(1.6)
        await r.js("document.getElementById('c3').style.display=''"); await r.tidur(0.3); await r.sorot_el("#c3", 6)
    await r.beat(2, a2, pad=1.0)
    await r.lepas(); await r.langkah(2)
    async def a3():
        await r.js("ketuk('#c4')"); await r.tidur(0.8); await L(WEB); await r.tidur(4.5); await r.sorot_el("#w1", 6)
    await r.beat(3, a3, pad=1.0)
    await r.lepas(); await r.langkah(3); await L(CARI)
    async def a4():
        await r.tidur(4.0); await r.sorot_el("#r1", 4)
    await r.beat(4, a4, pad=1.2)
    await r.lepas(); await r.langkah(4); await L(WAS)
    await r.beat(5, pad=1.0)
    async def a6():
        await r.tidur(0.5); await r.akhir(VIDEO)
    await r.beat(6, a6, pad=1.8)
