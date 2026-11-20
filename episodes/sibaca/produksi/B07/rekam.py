import sys, time; sys.path.insert(0, "/home/user/baca/alat")
from tulis import Bab, CACAT, sh, matikan, siapkan, acuan
from tahap import BUKU, KAT, buang, tukar
siapkan("bab-06", "contoh")
b = Bab("/home/user/baca/B07/rek"); r = b.r
BK = "server/buku.js"; KJ = "web/src/halaman/Katalog.jsx"
B1 = tukar(BUKU[5], "const q = String(req.query.q || '')\n", "const q = String(req.query.q || '').trim().slice(0, 50)\n")
B3a = buang(BUKU["7b"], "  if (req.query.tersedia === '1') sql += ' HAVING tersedia > 0'\n")
i = BUKU[7].index("buku.get('/kategori'"); B4a = BUKU[7][:i].rstrip() + "\n"
h7 = KAT[7][:KAT[7].index("  // Tunggu 300")]; j7 = KAT[7][KAT[7].index("  return (\n    <>"):]
e6 = KAT[6][KAT[6].index("  useEffect(() => {\n    api('/buku')"):KAT[6].index("  return (\n")]; j6 = KAT[6][KAT[6].index("  return (\n"):]
K5a = h7 + e6 + j6; K5b = h7 + e6 + j7
r.mulai(); r.kamera(None); time.sleep(1.0)
# b02 kata kunci, sql bertahap, limit
r.tanda("b02"); b.lihat(BK, "buku.get('/'", jeda=2.5)
r.tanda("b02_trim"); b.ubah(BK, B1, cps=12); b.sorot(BK, ".trim().slice(0, 50)", "trim: buang spasi di tepi, slice: paling banyak 50 huruf", 6.0)
r.kamera(None); r.tanda("b02_sql"); b.ubah(BK, BUKU["7a"], cps=18); time.sleep(0.5)
b.sorot(BK, "let sql = `SELECT", "Query disimpan di variabel sql", 3.0, tanda="b02_let")
b.sorot(BK, "WHERE (b.judul LIKE ? OR b.penulis LIKE ?)", "Mencari di judul atau di penulis", 3.6, tanda="b02_where")
b.sorot(BK, "LIMIT 20", "Paling banyak 20 buku", 3.0, tanda="b02_limit")
r.tanda("b02_dua"); r.label("Sebanyak apa pun koleksinya, hanya 20 yang dikirim", 4.5); time.sleep(5.0); r.tanda("b02_akhir")
# b03 saringan
r.kamera(None); r.tanda("b03"); b.ubah(BK, B3a, cps=16); time.sleep(0.4)
b.sorot(BK, "if (kategori) {", "Kalau kategori diisi: tambah potongan AND", 5.5, tanda="b03_kat", n=4)
r.kamera(None); r.tanda("b03_having"); b.ubah(BK, BUKU["7b"], cps=16); b.sorot(BK, "HAVING tersedia > 0", "Hanya yang tersedia", 3.0)
b.sorot(BK, "sql += ' AND b.kategori = ?'", "Potongan teks yang kita tulis sendiri", 8.5, tanda="b03_teks")
b.sorot(BK, "isi.push(kategori)", "Nilai dari pengguna tetap lewat tanda tanya", 4.0, tanda="b03_nilai"); r.tanda("b03_akhir")
# b04 pola dan /kategori
r.kamera(None); r.tanda("b04_pola"); b.ubah(BK, B4a, cps=16); time.sleep(0.4)
b.sorot(BK, "function pola(teks)", "Garis miring terbalik di depan % dan _", 5.0, tanda="b04_sorot", n=3)
b.sorot(BK, "const isi = [pola(q), pola(q)]", "Kata kunci dilewatkan ke pola dulu", 3.0)
r.kamera(None); r.tanda("b04_kat"); b.ubah(BK, BUKU[7], cps=18); time.sleep(0.4)
b.sorot(BK, "SELECT DISTINCT kategori", "Daftar kategori diambil dari data", 6.0, tanda="b04_distinct"); r.tanda("b04_akhir")
# b05 halaman: state dan kotak saring
r.kamera(None); r.tanda("b05"); b.lihat(KJ, "export default", jeda=1.2)
r.tanda("b05_state"); b.ubah(KJ, K5a, cps=22); time.sleep(0.4); b.sorot(KJ, "const [q, setQ]", "Tiga state baru: q, kategori, tersedia", 4.0, n=3)
r.kamera(None); r.tanda("b05_saring"); b.ubah(KJ, K5b, cps=28); time.sleep(0.4)
b.sorot(KJ, '<div className="saring">', "Kotak cari, pilihan kategori, kotak centang", 3.5, tanda="b05_tiga", n=10, zoom=1.3)
b.sorot(KJ, "<input placeholder=", "Nilai dari state, perubahan lewat fungsi pengubah", 7.5, tanda="b05_pola", zoom=1.3); r.tanda("b05_akhir")
# b06 useEffect dengan jeda
r.kamera(None); r.tanda("b06"); b.ubah(KJ, KAT[7], cps=24); time.sleep(0.5)
b.sorot(KJ, "}, [q, kategori, tersedia])", "Dijalankan ulang setiap kali salah satunya berubah", 9.5, tanda="b06_daftar")
r.tanda("b06_huruf"); r.label("Tetapi jangan bertanya ke server pada setiap huruf", 4.2); time.sleep(4.6)
b.sorot(KJ, "}, 300)", "Tunggu 300 milidetik dulu", 4.0, tanda="b06_tunggu")
b.sorot(KJ, "return () => { batal = true; clearTimeout(jeda) }", "Pembersih: batalkan penantian yang lama", 8.0, tanda="b06_bersih")
b.sorot(KJ, "new URLSearchParams", "Menyusun ?q=...&kategori=... dengan aman", 7.0, tanda="b06_param", zoom=1.3)
b.sorot(KJ, "let batal = false", "batal: jawaban lama tidak menimpa yang baru", 3.0, tanda="b06_batal")
b.sorot(KJ, ".then((data) => { if (!batal)", "Jawaban hanya dipakai kalau belum dibatalkan", 3.0, zoom=1.3); r.tanda("b06_akhir")
# b08 EXPLAIN
b.besar(); r.tanda("b08"); b.mysql(bersih=True); time.sleep(0.5)
def kam_hasil():
    pn = r.kotak(".part.panel"); r.kamera([pn[0], pn[1] + 30, pn[2] * 0.72, 430], pad=0)
r.tanda("b08_kat"); b.sql("EXPLAIN SELECT * FROM buku WHERE kategori = 'Komputer'\\G", tunggu=1.2, cps=18); kam_hasil(); r.label("key: kategori  ·  rows: 5", 7.5); time.sleep(8.5)
r.tekan("Control+l", 0.4); r.kamera_terminal(); r.tanda("b08_like"); b.sql("EXPLAIN SELECT * FROM buku WHERE judul LIKE '%bumi%'\\G", tunggu=1.2, cps=18); kam_hasil(); r.label("key: NULL  ·  rows: 525, semua judul dibaca", 6.5); time.sleep(7.5); r.tanda("b08_akhir")
b.sql("exit", tunggu=1.0); b.kecil()
# b10 commit
b.term(); b.commit("Pencarian", tanda="b10_commit"); time.sleep(1.0); r.tanda("b10_akhir")
r.kamera(None); time.sleep(0.8); r.selesai()
matikan(); sh("git tag -f bab-07"); print("CACAT", CACAT); print(sh("git status --short | head; git log --oneline | head -3").stdout)
