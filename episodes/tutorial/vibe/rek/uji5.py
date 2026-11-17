from vc import *
v = VC("/tmp/x")
print(v.pg.evaluate("[...document.querySelectorAll('select')].map(s=>[...s.options].map(o=>o.text))"))
print(v.pg.evaluate("[...document.querySelectorAll('.monaco-select-box')].map(s=>s.outerHTML.slice(0,300))"))
v.ctx.close()
