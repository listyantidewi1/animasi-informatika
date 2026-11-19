# Panel browser yang digambar (menutupi jendela terminal). Isi halaman diganti lewat JS hal(html).
CSS = """
#web{position:absolute;inset:0;border-radius:20px;background:#0d1117;overflow:hidden;opacity:0;transition:opacity .35s;z-index:4;font-family:Inter,sans-serif}
#web.on{opacity:1}
#web .bb{height:56px;background:#2a2e36;display:flex;align-items:center;padding:0 22px;gap:12px}
#web .url{flex:1;height:38px;border-radius:19px;background:#1b1e24;color:#c9d1d9;font-size:24px;font-weight:500;display:flex;align-items:center;padding:0 22px}
#web .isi{padding:34px 38px;color:#e6edf3;font-size:30px;font-weight:500}
#web h2{font-size:40px;margin:0 0 24px;font-weight:700}
#web .lbl{font-size:26px;color:#9da7b3;margin:22px 0 10px}
#web .inp{border:2px solid #30363d;border-radius:12px;padding:16px 20px;font-size:30px;background:#010409}
#web .btn{display:inline-block;background:#238636;color:#fff;border-radius:12px;padding:16px 28px;font-size:30px;font-weight:700;margin-top:30px}
#web .box{border:2px solid #30363d;border-radius:14px;padding:22px;margin-top:18px}
#web code{font-family:'JetBrains Mono';font-size:25px;line-height:1.6;display:block;color:#e6edf3;white-space:pre}
#web .row{display:flex;gap:18px;align-items:center;border-top:1px solid #30363d;padding:18px 6px;font-size:28px}
#web .row:first-child{border-top:none}
#web .ic{width:30px;height:26px;border-radius:4px;background:#7d8590}
#web .ic.f{background:#54aeff}
#web .muted{color:#9da7b3;font-size:25px}
#web .chk{display:flex;gap:16px;align-items:center;margin-top:22px;font-size:28px}
#web .cb{width:30px;height:30px;border:2px solid #6e7681;border-radius:6px}
#web .rad{width:28px;height:28px;border:2px solid #6e7681;border-radius:50%}
#web .rad.on{border:9px solid #2f81f7}
"""
HTML = """<div id="web"><div class="bb"><div class="dot" style="background:#ff5f57"></div><div class="dot" style="background:#febc2e"></div><div class="dot" style="background:#28c840"></div><div class="url" id="url"></div></div><div class="isi" id="isi"></div></div>"""
JS = """document.getElementById('win').appendChild(document.getElementById('web'));
window.web=(on)=>document.getElementById('web').className=on?'on':'';
window.hal=(url,html)=>{document.getElementById('url').textContent=url;document.getElementById('isi').innerHTML=html;};"""
