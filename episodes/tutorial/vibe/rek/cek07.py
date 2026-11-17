from hp import *
h = HP("http://localhost:5173/", profil="/tmp/hpprof412", lebar=412)
for d, r in [("{rusak", None), ('{"menu":"x","orang":5}', '{}'), (None, '[null]'), (None, '[{"tempat":"Kafe Senja"}]')]:
    h.pg.evaluate("([d,r])=>{localStorage.clear(); if(d!==null) localStorage.setItem('patungan:draf',d); if(r!==null) localStorage.setItem('patungan:riwayat',r)}", [d, r])
    errs=[]; h.pg.on("pageerror", lambda e: errs.append(str(e)))
    h.pg.reload(); h.tunggu(1)
    print(d, r, "h1:", h.pg.locator("h1").count(), "riwayat:", h.pg.locator("#daftar-riwayat").inner_text()[:80] if h.pg.locator("#daftar-riwayat").count() else None, errs[:1])
h.pg.evaluate("localStorage.clear()"); h.tutup()
