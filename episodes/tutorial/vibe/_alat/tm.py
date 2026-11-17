"""Pembantu Teachable Machine: cari elemen menembus shadow DOM berdasarkan teks/selector."""
CARI = r"""([teks, sel, idx]) => {
  const hasil = [];
  const jalan = (root) => { for (const el of root.querySelectorAll('*')) {
      if (el.shadowRoot) jalan(el.shadowRoot);
      let cocok = false;
      if (sel) cocok = el.matches(sel);
      if (teks !== null && !sel) { const own = [...el.childNodes].filter(n => n.nodeType === 3).map(n => n.textContent).join('').trim(); cocok = own === teks || ((el.innerText || '').trim() === teks && el.children.length <= 3); }
      if (teks !== null && sel) cocok = cocok && (el.innerText || el.textContent || '').trim().includes(teks);
      if (cocok) { const b = el.getBoundingClientRect(); if (b.width > 0 && b.height > 0) hasil.push([b.x, b.y, b.width, b.height]); } } };
  jalan(document); hasil.sort((a, b) => a[2] * a[3] - b[2] * b[3]); return idx === -1 ? hasil : (hasil[idx] || null);
}"""
def kotak(pg, teks=None, sel=None, idx=0): return pg.evaluate(CARI, [teks, sel, idx])
def tengah(b): return (b[0] + b[2] / 2, b[1] + b[3] / 2)

WADAH = r"""(teks) => { let hasil = null;
  const jalan = (root) => { for (const el of root.querySelectorAll('*')) { if (el.shadowRoot) jalan(el.shadowRoot);
      const own = [...el.childNodes].filter(n => n.nodeType === 3).map(n => n.textContent).join('').trim();
      if (own === teks) { const t = el.getBoundingClientRect(); if (t.width === 0) continue; let p = el; let b = t;
        while (p.parentElement && b.width < 250) { p = p.parentElement; b = p.getBoundingClientRect(); }
        hasil = [t.x, t.y, t.width, t.height, b.x, b.y, b.width, b.height]; } } };
  jalan(document); return hasil; }"""
def tutup_tip(r, pg, judul):
    h = pg.evaluate(WADAH, judul)
    if not h: return False
    r.klik(xy=(h[4] + h[6] - 23, h[1] + h[3] / 2), dur=0.4); return True
