"""Isi berkas pada tiap tahap bab, diturunkan dari aplikasi acuan (supaya hasil akhir video = kode di GitHub)."""
A = "/home/user/acuan-sibaca/"
def ac(rel): return open(A + rel).read()
def buang(s, *bagian):
    for b in bagian:
        assert s.count(b) == 1, "tidak tepat satu: " + b[:60]
        s = s.replace(b, "")
    return s
def tukar(s, a, b):
    assert s.count(a) == 1, "tidak tepat satu: " + a[:60]
    return s.replace(a, b)

# ---------- akar ----------
ENV_CONTOH5 = "PORT=3000\nDB_HOST=127.0.0.1\nDB_USER=sibaca\nDB_PASSWORD=\nDB_NAME=sibaca\n"
ENV_CONTOH = ac(".env.example")
assert ENV_CONTOH == ENV_CONTOH5 + "SESSION_SECRET=\n"
GITIGNORE = {1: "node_modules\n.env\n", 11: ac(".gitignore")}
assert GITIGNORE[11] == GITIGNORE[1] + "backup/*.sql\n"

# ---------- server/app.js ----------
APP = {}
APP[10] = ac("server/app.js")
APP[9] = buang(APP[10], "import path from 'node:path'\n", "app.use('/api', (req, res) => res.status(404).json({ pesan: 'Alamat API tidak ada' }))\n",
               "// Hasil build React disajikan oleh server yang sama, tanpa internet.\nconst dist = path.resolve('web/dist')\napp.use(express.static(dist))\napp.get('/{*semua}', (req, res) => res.sendFile(path.join(dist, 'index.html')))\n\n")
APP[8] = buang(APP[9], "import { petugas } from './petugas.js'\n", "app.use('/api/petugas', petugas)\n")
APP[5] = buang(APP[8], "import { pinjam } from './pinjam.js'\n", "app.use('/api/pinjam', pinjam)\n")
APP[4] = """import express from 'express'
import { buku } from './buku.js'

const app = express()
app.use(express.json())

app.use('/api/buku', buku)

const port = process.env.PORT || 3000
app.listen(port, () => console.log(`SiBaca berjalan di port ${port}`))
"""
APP[1] = """import express from 'express'

const app = express()

app.get('/api/halo', (req, res) => {
  res.json({ pesan: 'Halo dari SiBaca' })
})

const port = process.env.PORT || 3000
app.listen(port, () => console.log(`SiBaca berjalan di port ${port}`))
"""

# ---------- server/buku.js ----------
BUKU = {}
BUKU[9] = ac("server/buku.js")
_i = BUKU[9].index("// Petugas menambah judul baru")
BUKU[7] = tukar(BUKU[9][:_i].rstrip() + "\n", "import { perluLogin, perluPetugas } from './auth.js'", "import { perluLogin } from './auth.js'")
BUKU[4] = """import { Router } from 'express'
import { db } from './db.js'

export const buku = Router()

buku.get('/', async (req, res) => {
  const q = String(req.query.q || '')
  const [rows] = await db.query(
    `SELECT b.id, b.judul, b.penulis, b.kategori, b.tahun,
      SUM(e.status = 'tersedia') AS tersedia, COUNT(e.id) AS jumlah
    FROM buku b JOIN eksemplar e ON e.buku_id = b.id AND e.status <> 'hilang'
    WHERE b.judul LIKE ?
    GROUP BY b.id ORDER BY b.judul`,
    ['%' + q + '%'])
  res.json(rows)
})
"""
BUKU[5] = tukar(tukar(BUKU[4], "import { db } from './db.js'\n", "import { db } from './db.js'\nimport { perluLogin } from './auth.js'\n"), "buku.get('/', async", "buku.get('/', perluLogin, async")
# Bab 7 bertahap: (a) trim, judul/penulis, limit; (b) kategori + tersedia; (c) pola + /kategori
_kat = BUKU[7][BUKU[7].index("buku.get('/kategori'"):]
_pola = BUKU[7][BUKU[7].index("// Tanda % dan _"):BUKU[7].index("buku.get('/', perluLogin")]
BUKU["7b"] = tukar(buang(BUKU[7], "\n" + _kat, _pola), "const isi = [pola(q), pola(q)]", "const isi = ['%' + q + '%', '%' + q + '%']")
BUKU["7a"] = buang(BUKU["7b"], "  const kategori = String(req.query.kategori || '')\n", "  if (kategori) {\n    sql += ' AND b.kategori = ?'\n    isi.push(kategori)\n  }\n",
                   "  if (req.query.tersedia === '1') sql += ' HAVING tersedia > 0'\n")

# ---------- server/auth.js ----------
AUTH = {}
AUTH["c"] = ac("server/auth.js")
_a = AUTH["c"]
_kepala = _a[:_a.index("// Siapa yang sedang login?")]
_aktif = _a[_a.index("// Siapa yang sedang login?"):_a.index("export async function perluLogin")]
_jaga = _a[_a.index("export async function perluLogin"):_a.index("auth.post('/daftar'")]
_daftar = _a[_a.index("auth.post('/daftar'"):_a.index("auth.post('/masuk'")]
_masuk = _a[_a.index("auth.post('/masuk'"):_a.index("auth.post('/keluar'")]
AUTH["a"] = _kepala + _daftar.rstrip() + "\n"
AUTH["b"] = _kepala + _aktif + _daftar + _masuk.rstrip() + "\n"
assert _kepala + _aktif + _jaga + _daftar + _masuk + _a[_a.index("auth.post('/keluar'"):] == _a

# ---------- server/pinjam.js ----------
PINJAM = {}
PINJAM["d"] = ac("server/pinjam.js")
_p = PINJAM["d"]
PINJAM["c"] = _p[:_p.index("pinjam.get('/saya'")].rstrip() + "\n"
_aturan = _p[_p.index("    // Kunci baris pengguna"):_p.index("    const [[eks]]")]
_eks = _p[_p.index("    const [[eks]]"):_p.index("    await kon.commit()\n    res.status(201)")]
PINJAM["b"] = tukar(buang(PINJAM["c"], _eks), "    res.status(201).json({ pesan: `Ambil buku berkode ${eks.kode} di rak`, kode: eks.kode })\n", "")
PINJAM["a"] = buang(PINJAM["b"], _aturan)
PINJAM["b"] = PINJAM["b"]

# ---------- web ----------
API = {8: ac("web/src/api.js")}
API[6] = API[8][:API[8].index("export function tanggal")].rstrip() + "\n"
APPX = {9: ac("web/src/App.jsx")}
APPX[6] = tukar(buang(APPX[9], "import Pinjaman from './halaman/Pinjaman.jsx'\nimport Petugas from './halaman/Petugas.jsx'\nimport Anggota from './halaman/Anggota.jsx'\n",
                "  const petugas = pengguna.peran === 'petugas'\n",
                "          {!petugas && <NavLink to=\"/pinjaman\">Pinjamanku</NavLink>}\n          {petugas && <NavLink to=\"/petugas\">Peminjaman</NavLink>}\n          {petugas && <NavLink to=\"/anggota\">Anggota</NavLink>}\n",
                "          <Route path=\"/pinjaman\" element={<Pinjaman />} />\n          {petugas && <Route path=\"/petugas\" element={<Petugas />} />}\n          {petugas && <Route path=\"/anggota\" element={<Anggota />} />}\n"),
                "      </Routes>\n    )\n  }\n\n  return (", "      </Routes>\n    )\n  }\n\n  return (")
APPX[8] = tukar(tukar(tukar(APPX[6], "import Katalog from './halaman/Katalog.jsx'\n", "import Katalog from './halaman/Katalog.jsx'\nimport Pinjaman from './halaman/Pinjaman.jsx'\n"),
                "          <NavLink to=\"/\">Katalog</NavLink>\n", "          <NavLink to=\"/\">Katalog</NavLink>\n          <NavLink to=\"/pinjaman\">Pinjamanku</NavLink>\n"),
                "          <Route path=\"/\" element={<Katalog pengguna={pengguna} />} />\n", "          <Route path=\"/\" element={<Katalog pengguna={pengguna} />} />\n          <Route path=\"/pinjaman\" element={<Pinjaman />} />\n")
KAT = {9: ac("web/src/halaman/Katalog.jsx")}
KAT[8] = buang(KAT[9], "import TambahBuku from './TambahBuku.jsx'\n", "      {pengguna.peran === 'petugas' && <TambahBuku setelahSimpan={() => setMuatUlang((n) => n + 1)} />}\n")
KAT[7] = tukar(buang(KAT[8], "  const [pesan, setPesan] = useState('')\n  const [muatUlang, setMuatUlang] = useState(0)\n",
               KAT[8][KAT[8].index("  async function pinjam(b) {"):KAT[8].index("  return (\n    <>\n      <div className=\"saring\">")],
               "      {pesan && <p className=\"info\" onClick={() => setPesan('')}>{pesan}</p>}\n",
               "            {pengguna.peran === 'anggota' && (\n              <button disabled={b.tersedia === 0} onClick={() => pinjam(b)}>Pinjam</button>\n            )}\n"),
               "  }, [q, kategori, tersedia, muatUlang])", "  }, [q, kategori, tersedia])")
KAT[6] = """import { useEffect, useState } from 'react'
import { api } from '../api.js'

export default function Katalog({ pengguna }) {
  const [buku, setBuku] = useState([])
  const [status, setStatus] = useState('memuat')

  useEffect(() => {
    api('/buku')
      .then((data) => { setBuku(data); setStatus('siap') })
      .catch(() => setStatus('gagal'))
  }, [])

  return (
    <>
      {status === 'memuat' && <p className="tengah">Memuat…</p>}
      {status === 'gagal' && <p className="galat">Server tidak bisa dihubungi. Coba lagi sebentar.</p>}
      <ul className="daftar">
        {buku.map((b) => (
          <li key={b.id} className="kartu">
            <div>
              <b>{b.judul}</b>
              <p className="redup">{b.penulis} · {b.kategori}{b.tahun ? ` · ${b.tahun}` : ''}</p>
              <span className={b.tersedia > 0 ? 'chip hijau' : 'chip abu'}>
                {b.tersedia > 0 ? `${b.tersedia} dari ${b.jumlah} tersedia` : 'Sedang dipinjam semua'}
              </span>
            </div>
          </li>
        ))}
      </ul>
    </>
  )
}
"""
if __name__ == "__main__":
    import sys
    for nama, d in [("APP", APP), ("BUKU", BUKU), ("AUTH", AUTH), ("PINJAM", PINJAM), ("API", API), ("APPX", APPX), ("KAT", KAT)]:
        for k, v in d.items(): print(nama, k, len(v.split("\n")), "baris")
    if len(sys.argv) > 2: print(globals()[sys.argv[1]][eval(sys.argv[2])])
