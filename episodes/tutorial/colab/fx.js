// Tambalan halaman Colab asli untuk rekaman: login tiruan, run tiruan, sorot. Tidak mengirim apa pun ke Google.
(() => {
  if (window.__fx) return;
  const $ = (s, r = document) => r.querySelector(s);
  const fx = (window.__fx = {});
  let pol = null;
  const H = (html) => { if (!window.trustedTypes) return html; if (!pol) { try { pol = trustedTypes.createPolicy('fx' + Math.random().toString(36).slice(2), { createHTML: (x) => x }); } catch (e) { pol = { createHTML: (x) => x }; } } return pol.createHTML(html); };
  const setHTML = (el, html) => { el.innerHTML = H(html); };
  fx.dalam = (re) => { // cari elemen (menembus shadow DOM) yang teksnya cocok; ambil yang terkecil
    let best = null; const jalan = (root) => { for (const e of root.querySelectorAll('*')) { if (e.shadowRoot) jalan(e.shadowRoot); const t = (e.textContent || '').trim(); if (re.test(t)) { const q = e.getBoundingClientRect(); if (q.width > 0 && (!best || q.width * q.height <= best[1])) best = [e, q.width * q.height]; } } };
    jalan(document); return best && best[0];
  };
  fx.kotakDalam = (src) => { const e = fx.dalam(new RegExp(src)); if (!e) return null; let n = e; for (let i = 0; i < 4 && n; i++) { const tg = n.tagName || ''; if (/BUTTON|^A$|MD-/.test(tg)) break; n = n.parentNode && (n.parentNode.host || n.parentNode); } const q = ((n && n.getBoundingClientRect) ? n : e).getBoundingClientRect(); return [q.x, q.y, q.width, q.height]; };
  const AV = '<div id="fx-avatar" style="width:36px;height:36px;border-radius:50%;background:#00796b;color:#fff;font:500 18px \'Google Sans\',Roboto,sans-serif;display:flex;align-items:center;justify-content:center;margin:2px 8px 2px 6px;position:relative;top:-9px;cursor:pointer">N</div>';

  // ---------- sorot (kotak penanda) ----------
  fx.sorot = (x, y, w, h, pad = 6) => {
    let d = $('#fx-sorot');
    if (!d) {
      d = document.createElement('div'); d.id = 'fx-sorot';
      Object.assign(d.style, { position: 'fixed', zIndex: 2147483000, pointerEvents: 'none', border: '3px solid #f9ab00', borderRadius: '10px',
        background: 'rgba(249,171,0,.13)', boxShadow: '0 0 0 4px rgba(249,171,0,.22), 0 4px 18px rgba(0,0,0,.18)', opacity: 0,
        transition: 'opacity .25s ease, left .35s ease, top .35s ease, width .35s ease, height .35s ease' });
      document.documentElement.appendChild(d);
      Object.assign(d.style, { left: x - pad + 'px', top: y - pad + 'px', width: w + 2 * pad + 'px', height: h + 2 * pad + 'px' }); d.offsetWidth;
    }
    Object.assign(d.style, { left: x - pad + 'px', top: y - pad + 'px', width: w + 2 * pad + 'px', height: h + 2 * pad + 'px', opacity: 1 });
  };
  fx.sorotMati = () => { const d = $('#fx-sorot'); if (d) d.style.opacity = 0; };
  // kotak teks: cari teks di dalam elemen, kembalikan [x,y,w,h]
  fx.kotakTeks = (root, teks, ke = 0) => {
    const w = document.createTreeWalker(root, NodeFilter.SHOW_TEXT); let all = '', nodes = [];
    while (w.nextNode()) { nodes.push([w.currentNode, all.length]); all += w.currentNode.textContent; }
    all = all.replace(/ /g, ' '); let i = -1; for (let k = 0; k <= ke; k++) i = all.indexOf(teks, i + 1);
    if (i < 0) return null; const j = i + teks.length;
    const cari = (p) => { for (let k = nodes.length - 1; k >= 0; k--) if (nodes[k][1] <= p) return [nodes[k][0], p - nodes[k][1]]; };
    const r = document.createRange(); const a = cari(i), b = cari(j - 1); r.setStart(a[0], a[1]); r.setEnd(b[0], b[1] + 1);
    const q = r.getBoundingClientRect(); return [q.x, q.y, q.width, q.height];
  };
  fx.sel = (i) => document.querySelectorAll('.cell.code')[i];
  fx.kotak = (e) => { const q = e.getBoundingClientRect(); return [q.x, q.y, q.width, q.height]; };

  // ---------- beranda Colab ----------
  fx.avatar = () => {
    const a = $('a[aria-label="Sign in"]'); if (!a) return false;
    const w = document.createElement('div'); setHTML(w, AV); a.replaceWith(w.firstChild); return true;
  };
  fx.beranda = (masuk) => {
    if (masuk) { const t = setInterval(() => { if (fx.avatar()) clearInterval(t); }, 50); }
    window.addEventListener('click', (e) => {
      const p = e.composedPath().find((n) => n.textContent && /New notebook\s*$/.test(n.textContent.trim()) && !/Upload/.test(n.textContent));
      if (p && masuk) { e.stopImmediatePropagation(); e.preventDefault(); window.__fxKlik = 'baru'; }
      const s = e.composedPath().find((n) => n.getAttribute && n.getAttribute('aria-label') === 'Sign in');
      if (s && !masuk) { window.__fxKlik = 'masuk'; }
    }, true);
  };

  // ---------- halaman login Google ----------
  fx.login = (email) => {
    const i0 = $('#identifierId'); i0.setAttribute('autocomplete', 'off');
    const kunci = (id, f) => { for (const tp of ['click', 'mousedown', 'mouseup', 'pointerdown', 'pointerup']) window.addEventListener(tp, (e) => { if (e.composedPath().some((n) => n.id === id.slice(1))) { e.stopImmediatePropagation(); e.preventDefault(); if (tp === 'click') f(); } }, true); };
    window.addEventListener('keydown', (e) => { if (e.key === 'Enter') { e.stopImmediatePropagation(); e.preventDefault(); } }, true);
    window.addEventListener('submit', (e) => { e.stopImmediatePropagation(); e.preventDefault(); }, true);
    kunci('#identifierNext', () => {
      if (window.__fxTahap === 2) { window.__fxKlik = 'selesai'; return; }
      window.__fxTahap = 2;
      const main = $('main'); main.style.transition = 'opacity .25s'; main.style.opacity = 0.35;
      setTimeout(() => {
        $('#headingText span').textContent = 'Welcome';
        setHTML($('#headingSubtext'), '<div style="display:inline-flex;align-items:center;gap:8px;height:30px;padding:0 8px 0 5px;border:1px solid #747775;border-radius:16px;font:500 14px \'Google Sans\',Roboto,Arial,sans-serif;color:#1f1f1f;letter-spacing:.25px"><svg width="20" height="20" viewBox="0 0 24 24" fill="#444746"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zM7.35 18.5C8.66 17.56 10.26 17 12 17s3.34.56 4.65 1.5c-1.31.94-2.91 1.5-4.65 1.5s-3.34-.56-4.65-1.5zm10.79-1.38C16.45 15.8 14.32 15 12 15s-4.45.8-6.14 2.12C4.7 15.73 4 13.95 4 12c0-4.42 3.58-8 8-8s8 3.58 8 8c0 1.95-.7 3.73-1.86 5.12zM12 6c-1.93 0-3.5 1.57-3.5 3.5S10.07 13 12 13s3.5-1.57 3.5-3.5S13.93 6 12 6zm0 5c-.83 0-1.5-.67-1.5-1.5S11.17 8 12 8s1.5.67 1.5 1.5S12.83 11 12 11z"/></svg>' + email + '<svg width="18" height="18" viewBox="0 0 24 24" fill="#444746"><path d="M7 10l5 5 5-5z"/></svg></div>');
        const i = $('#identifierId'); i.type = 'password'; i.value = ''; i.setAttribute('autocomplete', 'off'); i.dispatchEvent(new Event('input', { bubbles: true }));
        i.parentElement.querySelector('.AxOyFc').textContent = 'Enter your password';
        const dm = document.querySelectorAll('.dMNVAe'); setHTML(dm[0], '<label style="display:flex;align-items:center;gap:14px;font:400 14px Roboto,Arial,sans-serif;color:#1f1f1f;margin:6px 0 0 2px"><span style="width:16px;height:16px;border:2px solid #444746;border-radius:2px;display:inline-block"></span>Show password</label>');
        const g = $('.RDsYTb'); if (g) g.style.visibility = 'hidden';
        for (const s of document.querySelectorAll('.VfPpkd-vQzf8d')) if (s.textContent === 'Create account') s.textContent = 'Forgot password?';
        document.title = 'Sign in - Google Accounts';
        main.style.opacity = 1; i.blur();
      }, 550);
    });
  };

  // ---------- editor notebook ----------
  fx.rapikan = () => {
    const css = document.createElement('style');
    css.textContent = '.header-warning{display:none!important} colab-last-saved-indicator{display:none!important} colab-toolbar-button[command="clone"]{display:none!important}' +
      '.fx-out{font-family:var(--colab-code-font-family);font-size:14px;line-height:19px;color:var(--colab-primary-text-color);padding:8px 8px 8px 0;margin-left:var(--colab-cell-gutter-width,38px);white-space:pre;overflow:hidden}' +
      '.fx-out pre{margin:0;font:inherit;white-space:pre}.fx-out .r{color:#c5221f}.fx-out .g{color:#188038}.fx-out .c{color:#007b83}.fx-out .y{color:#b06000}.fx-out .b{font-weight:700}' +
      '.fx-next{display:flex;align-items:center;gap:10px;margin:10px 0 2px;font:400 13px "Google Sans",Roboto,sans-serif;color:var(--colab-secondary-text-color);white-space:normal}' +
      '.fx-next span.btn{display:inline-flex;align-items:center;gap:6px;border:1px solid #c4c7c5;border-radius:16px;padding:4px 14px 4px 10px;color:#0b57d0;font-weight:500}' +
      '.fx-ram{display:flex;align-items:center;gap:8px;font:400 11px "Google Sans",Roboto,sans-serif;color:var(--colab-primary-text-color)}.fx-ram .bar{display:block;width:44px;height:6px;border:1px solid #747775;border-radius:2px;margin-left:6px;position:relative}.fx-ram .bar i{position:absolute;left:0;top:0;bottom:0;background:#747775}.fx-ram div div{display:flex;align-items:center;justify-content:space-between;height:13px}';
    document.head.appendChild(css);
    const d = $('#doc-name'); d.disabled = false; d.value = 'Untitled0.ipynb'; d.dispatchEvent(new Event('input', { bubbles: true })); document.title = 'Untitled0.ipynb - Colab';
    fx.avatar();
    // tutup panel Release notes
    const tutup = (root) => { for (const e of root.querySelectorAll('*')) { if (e.shadowRoot) tutup(e.shadowRoot); if (e.id === 'tab-pane-1-close-all-button') e.click(); } }; tutup(document);
    // blokir run sungguhan (klik tombol run dan Ctrl/Shift+Enter)
    addEventListener('click', (e) => { if (e.composedPath().some((n) => n.tagName === 'COLAB-RUN-BUTTON')) { e.stopImmediatePropagation(); e.preventDefault(); } }, true);
    addEventListener('keydown', (e) => { if (e.key === 'Enter' && (e.ctrlKey || e.shiftKey || e.altKey || e.metaKey)) { e.stopImmediatePropagation(); e.preventDefault(); } }, true);
  };
  const rb = (i) => fx.sel(i).querySelector('colab-run-button').shadowRoot;
  fx.status = (teks) => {
    const r = $('colab-connect-button').shadowRoot; const b = r.querySelector('#connect'); const ic = r.querySelector('#connect-icon');
    if (teks === 'ok') {
      if (ic) ic.style.display = 'none';
      setHTML(b, '<span class="fx-ram" style="display:flex;align-items:center;gap:8px;font:400 11px \'Google Sans\',Roboto,sans-serif"><md-icon style="color:#188038;--md-icon-size:20px">check</md-icon><span><span style="display:flex;align-items:center;justify-content:space-between;height:13px">RAM<i style="display:block;width:44px;height:6px;border:1px solid #747775;border-radius:2px;margin-left:6px;background:linear-gradient(90deg,#747775 12%,transparent 12%)"></i></span><span style="display:flex;align-items:center;justify-content:space-between;height:13px">Disk<i style="display:block;width:44px;height:6px;border:1px solid #747775;border-radius:2px;margin-left:6px;background:linear-gradient(90deg,#747775 34%,transparent 34%)"></i></span></span></span>');
    } else { b.textContent = teks; }
  };
  fx.tunda = (i) => { // antre: cincin putus-putus berputar
    const r = rb(i); const d = r.querySelector('.cell-execution'); d.classList.add('pending'); d.classList.remove('error');
    const svg = r.querySelector('svg'); if (!svg.querySelector('#dash-rotate')) { const c = document.createElementNS('http://www.w3.org/2000/svg', 'circle'); c.setAttribute('cx', 12); c.setAttribute('cy', 12); c.setAttribute('r', 10); c.id = 'dash-rotate'; c.setAttribute('stroke-width', 2); c.setAttribute('stroke-linecap', 'round'); svg.appendChild(c); }
    const lr = r.querySelector('.last-run'); if (lr) lr.remove();
    fx.sel(i).classList.add('pending');
  };
  fx.hasil = (i, n, html, galat, lama) => { // selesai: nomor eksekusi, centang/galat, keluaran
    const r = rb(i); const d = r.querySelector('.cell-execution'); d.classList.remove('pending', 'stale'); d.classList.toggle('error', !!galat);
    const c = r.querySelector('#dash-rotate'); if (c) c.remove(); fx.sel(i).classList.remove('pending');
    r.querySelector('.execution-count').textContent = '[' + n + ']';
    let lr = r.querySelector('.last-run'); if (!lr) { lr = document.createElement('div'); lr.className = 'last-run'; r.querySelector('.status').appendChild(lr); }
    setHTML(lr, '<md-icon>' + (galat ? 'error' : 'check') + '</md-icon>' + (lama || '0s'));
    const out = fx.sel(i).querySelector('.output'); let o = out.querySelector('.fx-out'); if (!o) { o = document.createElement('div'); o.className = 'fx-out'; out.appendChild(o); }
    setHTML(o, html);
  };
  fx.keluaran = (i) => fx.sel(i).querySelector('.fx-out');
  fx.baris = (i, n) => fx.sel(i).querySelectorAll('.view-line'); // baris editor Monaco (urutan DOM tidak selalu urutan baris)
  fx.kotakBaris = (i, n) => { // baris ke-n (1..) menurut posisi top
    const ls = Array.from(fx.sel(i).querySelectorAll('.view-line')).sort((a, b) => a.getBoundingClientRect().top - b.getBoundingClientRect().top); const l = ls[n - 1]; if (!l) return null;
    const s = l.querySelector('span'); const q = (s || l).getBoundingClientRect(); const p = l.getBoundingClientRect(); return [q.x, p.y, q.width, p.height, l];
  };
})();
