KODE = "H08"; NAMA = "Cara_Membuka_Aplikasi_Lokal_di_HP"
JUDUL = "Cara membuka aplikasi<br>di laptop <b>lewat HP</b>"
LANGKAH = ["Host", "IP", "HP", "Firewall"]
VIDEO = "Vibe Coding yang Benar: Membuat Aplikasi Patungan Sampai Jadi"
PATH_EXTRA = ":/opt/siswa-bin"
LAFAL = [("0.0.0.0", "nol titik nol titik nol titik nol"), ("localhost", "lokal host"), ("hostname -I", "host nem minus i besar"), ("ipconfig", "ai pi konfig"), ("IPv4 Address", "ai pi vi empat adres"), ("IP", "ai pi"), ("Wi-Fi", "wai fai"), ("app.listen", "ep dot lisen"), ("HP", "ha pe")]
SIAPKAN = r"""mkdir -p ~/antrean && cd ~/antrean && cat > index.html <<'H'
<!doctype html><meta name="viewport" content="width=device-width">
<body style="font-family:sans-serif;margin:0;background:#f4f1ea">
<div style="background:#1d6b52;color:#fff;padding:22px;font-size:22px;font-weight:700">Antrean Bengkel</div>
<div style="padding:24px;text-align:center"><p style="color:#555">Nomor antreanmu</p>
<div style="font-size:54px;font-weight:800;color:#1d6b52">A-012</div>
<p style="color:#555">3 orang lagi sebelum giliranmu</p></div></body>
H
cat > server.js <<'JS'
const http = require("http");
const fs = require("fs");
const halaman = fs.readFileSync("index.html");

const server = http.createServer((req, res) => {
  res.end(halaman);
});

server.listen(3000, "0.0.0.0", () => {
  console.log("Server jalan di port 3000");
});
JS"""
EXTRA_CSS = """#hp{position:absolute;left:290px;top:400px;width:500px;height:960px;border-radius:60px;background:#0b0b0d;border:4px solid #3a3d44;box-shadow:0 30px 80px #000c;opacity:0;transform:translateY(40px);transition:all .45s;z-index:15}
#hp.on{opacity:1;transform:none}
#hp .lyr{position:absolute;left:18px;right:18px;top:18px;bottom:18px;border-radius:44px;overflow:hidden;background:#fff}
#hp .alamat{height:96px;background:#eceff3;display:flex;align-items:flex-end;padding:0 18px 12px}
#hp .alamat div{flex:1;height:52px;border-radius:26px;background:#fff;color:#222;font-size:25px;font-weight:600;display:flex;align-items:center;padding:0 20px}
#hp iframe{position:absolute;left:0;top:96px;width:232px;height:400px;border:0;transform:scale(2);transform-origin:0 0}"""
EXTRA_HTML = """<div id="hp"><div class="lyr"><div class="alamat"><div id="hpurl"></div></div><iframe id="hpf"></iframe></div></div>"""
EXTRA_JS = """window.hp=(url,src)=>{document.getElementById('hpurl').textContent=url;document.getElementById('hpf').src=src;document.getElementById('hp').className='on';};"""
BEATS = [
 ("kait", "Aplikasimu jalan di laptop, tetapi tidak bisa dibuka di HP? Begini cara membukanya lewat Wi-Fi yang sama.", None),
 ("host", "Pertama, server harus mendengarkan di 0.0.0.0, bukan hanya localhost. Lihat bagian app.listen di kodemu.", "Pertama, server harus mendengarkan di nol titik nol titik nol titik nol, bukan hanya lokal host. Lihat bagian lisen di kodemu."),
 ("jalan", "Jalankan servernya. Sekarang server bisa dihubungi oleh perangkat lain di jaringan yang sama.", None),
 ("ip", "Kedua, cari alamat IP laptopmu. Di Linux, ketik `hostname -I`. Di Windows, ketik `ipconfig`, lalu lihat baris IPv4 Address.", None),
 ("hp", "Ketiga, sambungkan HP ke Wi-Fi yang sama. Buka browser, lalu ketik alamat IP tadi, titik dua, dan nomor port.", "Ketiga, sambungkan ha pe ke wai fai yang sama. Buka brauser, lalu ketik alamat ai pi tadi, titik dua, dan nomor port."),
 ("firewall", "Kalau halaman belum terbuka, periksa firewall. Di Windows, klik Allow access saat muncul peringatan, dan pilih jaringan Private.", "Kalau halaman belum terbuka, periksa fairwol. Di Windows, klik, alau akses, saat muncul peringatan, dan pilih jaringan, praivet."),
 ("ajak", "Mau membuat aplikasi yang memang dirancang untuk HP? Tonton video lengkapnya.", "Mau membuat aplikasi yang memang dirancang untuk ha pe? Tonton video lengkapnya."),
]
async def ADEGAN(r):
    await r.ketik("cd antrean", cps=30); await r.enter(0.1); await r.tidur(0.3); await r.bersih()
    await r.beat(0, pad=0.5)
    await r.langkah(1)
    async def a1():
        await r.ketik("cat server.js"); await r.enter(); await r.tunggu("server.listen"); await r.tidur(0.5)
        await r.sorot('server.listen(3000, "0.0.0.0"', 1)
    await r.beat(1, a1, pad=1.2)
    await r.lepas(); await r.bersih()
    async def a2():
        await r.ketik("node server.js &"); await r.enter(); await r.tunggu("Server jalan"); await r.sorot("Server jalan di port 3000", 1)
    await r.beat(2, a2, pad=1.0)
    await r.lepas(); await r.langkah(2)
    async def a3():
        await r.tidur(1.8); await r.ketik("hostname -I"); await r.enter(); await r.tidur(0.8); await r.sorot("192.0.2.2", 1)
        await r.tidur(1.5); await r.kartu("Windows: Command Prompt", "ipconfig\n\nIPv4 Address . . : 192.168.1.7")
    await r.beat(3, a3, pad=1.4)
    await r.kartu(None); await r.lepas(); await r.langkah(3)
    async def a4():
        await r.tidur(2.0); await r.js("a=>hp(...a)", ["192.0.2.2:3000", "http://192.0.2.2:3000"])
    await r.beat(4, a4, pad=1.6)
    await r.langkah(4)
    async def a5():
        await r.tidur(0.5); await r.kartu("Peringatan firewall Windows", "Klik Allow access\nPilih jaringan Private", False)
    await r.beat(5, a5, pad=1.4)
    await r.kartu(None)
    async def a6():
        await r.tidur(0.5); await r.akhir(VIDEO)
    await r.beat(6, a6, pad=1.8)
