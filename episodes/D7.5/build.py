import json, os
ROOT=os.path.dirname(os.path.abspath(__file__))
tl=json.load(open(os.path.join(ROOT,'timeline.json')))
eng=open(os.path.join(ROOT,'engine.js')).read()
page=open(os.path.join(ROOT,'page.html')).read().replace('__ENGINE__',eng).replace('__TIMELINE__',json.dumps(tl,ensure_ascii=False))
open(os.path.join(ROOT,'episode-d75.html'),'w').write(page)
print(len(page)//1024,'KB')
