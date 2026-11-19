# Layar HP generik yang digambar dengan kode (tanpa merek). Jendela terminal disembunyikan; sorotan tetap jalan.
CSS = """
#win{background:transparent;border:none;box-shadow:none}
#bar,#term{visibility:hidden}
#ponsel{position:absolute;left:250px;top:390px;width:580px;height:990px;border-radius:64px;background:#0b0b0d;border:4px solid #3a3d44;box-shadow:0 30px 80px #000c;z-index:3}
#ponsel .lyr{position:absolute;left:18px;right:18px;top:18px;bottom:18px;border-radius:48px;overflow:hidden;background:#f2f3f5;color:#16181d;font-family:Inter,sans-serif;font-weight:500}
#ponsel .sb{height:58px;display:flex;align-items:center;justify-content:space-between;padding:0 36px;font-size:24px;font-weight:700}
#ponsel .hd{padding:14px 30px 18px;font-size:38px;font-weight:800;display:flex;align-items:center;gap:16px}
#ponsel .hd .bk{font-size:38px;color:#3b6fd8}
#ponsel .grp{margin:10px 22px;background:#fff;border-radius:22px;overflow:hidden}
#ponsel .it{display:flex;align-items:center;gap:18px;padding:24px 24px;border-top:1px solid #e6e8ec;font-size:28px}
#ponsel .it:first-child{border-top:none}
#ponsel .it .ik{width:44px;height:44px;border-radius:12px;background:#8a94a6;flex:none}
#ponsel .it .tx{flex:1} #ponsel .it .sm{font-size:22px;color:#6b7280;margin-top:4px}
#ponsel .it .ar{color:#9aa1ad;font-size:30px}
#ponsel .tg{width:76px;height:44px;border-radius:22px;background:#c9ced6;position:relative;flex:none;transition:background .3s}
#ponsel .tg::after{content:'';position:absolute;left:4px;top:4px;width:36px;height:36px;border-radius:50%;background:#fff;transition:left .3s}
#ponsel .tg.on{background:#2fb35a} #ponsel .tg.on::after{left:36px}
#ponsel .btn{margin:26px 22px;padding:24px;border-radius:20px;text-align:center;font-size:28px;font-weight:700;background:#3b6fd8;color:#fff}
#ponsel .btn.mrh{background:#d64545}
#ponsel .ket{margin:8px 34px;font-size:23px;color:#6b7280;line-height:1.35}
#ponsel .chat{padding:10px 22px;display:flex;flex-direction:column;gap:14px}
#ponsel .bb{max-width:78%;padding:16px 20px;border-radius:22px;font-size:26px;line-height:1.35;background:#fff;align-self:flex-start;box-shadow:0 1px 2px #0001}
#ponsel .bb.aku{align-self:flex-end;background:#d7f5cf}
#ponsel .bb .nm{font-size:21px;font-weight:700;color:#3b6fd8;margin-bottom:4px}
#ponsel .tel{position:absolute;inset:0;background:linear-gradient(#253049,#11151f);color:#fff;text-align:center}
#ponsel .tel .av{width:170px;height:170px;border-radius:50%;background:#56627a;margin:150px auto 30px;font-size:80px;line-height:170px}
#ponsel .tel .nm{font-size:44px;font-weight:700} #ponsel .tel .st{font-size:26px;color:#b9c2d3;margin-top:12px}
#ponsel .tel .ac{position:absolute;bottom:90px;left:0;right:0;display:flex;justify-content:space-around}
#ponsel .tel .ac div{width:120px;height:120px;border-radius:50%;font-size:24px;display:flex;align-items:center;justify-content:center;font-weight:700}
#ponsel .tap{position:absolute;width:70px;height:70px;border-radius:50%;background:#ffb54788;border:4px solid #ffb547;transform:translate(-50%,-50%) scale(.3);opacity:0;pointer-events:none;z-index:9}
#ponsel .tap.go{animation:tap .7s ease-out}
@keyframes tap{0%{opacity:1;transform:translate(-50%,-50%) scale(.3)}100%{opacity:0;transform:translate(-50%,-50%) scale(1.4)}}
"""
HTML = """<div id="ponsel"><div class="lyr"><div class="sb"><span>09.41</span><span>●●● 82%</span></div><div id="ly"></div><div class="tap" id="tap"></div></div></div>"""
JS = """window.layar=h=>{document.getElementById('ly').innerHTML=h;};
window.ketuk=sel=>{const e=document.querySelector(sel),l=document.querySelector('#ponsel .lyr').getBoundingClientRect(),b=e.getBoundingClientRect(),t=document.getElementById('tap');
 t.style.left=(b.left-l.left+b.width/2)+'px';t.style.top=(b.top-l.top+b.height/2)+'px';t.className='tap';void t.offsetWidth;t.className='tap go';};"""
