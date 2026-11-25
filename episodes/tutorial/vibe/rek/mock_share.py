MOCK = r"""
navigator.share = (d) => new Promise((ok) => { window.__teks = d.text;
  const s = document.createElement('div'); s.id='__sheet';
  s.innerHTML = `<div style="position:fixed;inset:0;background:rgba(0,0,0,.45);z-index:2147483000"></div>
  <div style="position:fixed;left:0;right:0;bottom:0;background:#fff;border-radius:18px 18px 0 0;padding:16px 18px 22px;z-index:2147483001;font:15px Inter,sans-serif;color:#222">
   <div style="width:40px;height:4px;background:#ccc;border-radius:2px;margin:0 auto 12px"></div>
   <div style="font-weight:600;margin-bottom:8px">Bagikan</div>
   <pre id="__isi" style="white-space:pre-wrap;font:13px/1.35 Inter,sans-serif;background:#f3f3f3;border-radius:10px;padding:10px;margin:0 0 14px;max-height:300px;overflow:auto"></pre>
   <div style="display:flex;justify-content:space-around;text-align:center;font-size:12px">
    ${['WhatsApp','Telegram','Salin','Lainnya'].map((n,i)=>`<div><div style="width:48px;height:48px;border-radius:50%;background:${['#25a244','#2a9fd8','#888','#bbb'][i]};margin:0 auto 6px"></div>${n}</div>`).join('')}
   </div></div>`;
  document.body.append(s); s.querySelector('#__isi').textContent = d.text; ok(); });
"""
