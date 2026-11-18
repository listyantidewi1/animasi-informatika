"""Narasi Cahaya per beat. python3 alat/suara.py A00 [--hanya 1,2]"""
import json, sys, re, os, urllib.request, time
sys.path.insert(0, os.path.dirname(__file__))
from durasi import nm
VID = "iWydkXKoiVtvdn4vLKp9"; MODEL = "eleven_v4"
GANTI = [("Node.js", "Node J S"), ("avg_minutes", "average minutes"), ("timestamptz", "timestamp T Z"), ("psql", "P S Q L"),
         ("titik md", "titik M D"), ("AVG", "average"), ("ORM", "O R M"), ("MIN", "min"),
         ("HTTPS", "H T T P S"), ("HTTP", "H T T P"), ("npm", "N P M"), ("SSE", "S S E"), ("XSS", "X S S"), ("VPS", "V P S"),
         ("IDOR", "I D O R"), ("Nginx", "engine X"), ("nginx", "engine X"), ("pg_dump", "P G dump"), ("bcrypt", "B crypt"),
         ("EventSource", "Event Source"), ("speechSynthesis", "speech synthesis"), ("textContent", "text content"),
         ("innerHTML", "inner H T M L"), ("httpOnly", "H T T P only"), ("sameSite", "same site"), ("maxAge", "max age"),
         ("padStart", "pad start"), ("randomBytes", "random bytes"), ("buatTiket", "buat tiket"), ("X-Accel-Buffering", "X accel buffering"),
         ("WIB", "W I B"), ("git-scm.com", "git S C M dot com"), ("nodejs.org", "node J S dot org"), ("postgresql.org", "postgre S Q L dot org"), ("code.visualstudio.com", "code dot visual studio dot com"),
         ("get.docker.com", "get dot docker dot com"), ("LTS", "L T S"), ("VS Code", "V S Code"), ("DNS", "D N S"), ("ssh", "S S H"), ("IPv4", "I P versi empat"), ("alamat IP", "alamat I P"), ("ipconfig", "I P config"), ("README", "read me"), ("certonly", "cert only"), ("letsencrypt", "lets encrypt"), ("JSON", "jay son"), ("CRUD", "crud"), ("DevTools", "Dev Tools"), ("gitignore", "git ignore"), ("src", "S R C")]
def tts_teks(t):
    for a, b in GANTI: t = t.replace(a, b)
    t = re.sub(r"\b([A-C])-0*(\d+)\b", lambda m: f"{m.group(1)}, {int(m.group(2))}", t)  # A-012 -> A, 12
    t = re.sub(r"(?<=[A-Za-z])_(?=[A-Za-z])", " ", t)
    return t
def main():
    ep = sys.argv[1]; hanya = None
    if "--hanya" in sys.argv: hanya = set(int(x) for x in sys.argv[sys.argv.index("--hanya") + 1].split(","))
    N = json.load(open(f"/home/user/antre/naskah_{ep}.json")) if "--sisip" not in sys.argv else []
    N = sorted(N + json.load(open("/home/user/antre/naskah_sisip.json")).get(ep, []) if "--sisip" in sys.argv else N, key=lambda b: b["no"])
    if "--sisip" in sys.argv:  # hanya beat sisipan; konteks = beat asli di sebelahnya
        asli = {b["no"]: b["teks"] for b in json.load(open(f"/home/user/antre/naskah_{ep}.json"))}
    os.makedirs(f"/home/user/antre/{ep}/suara", exist_ok=True)
    for i, b in enumerate(N):
        if hanya and b["no"] not in hanya: continue
        out = f"/home/user/antre/{ep}/suara/b{nm(b['no'])}.mp3"
        if os.path.exists(out): continue
        body = {"text": tts_teks(b["teks"]), "model_id": MODEL, "voice_settings": {"stability": 0.5, "similarity_boost": 0.75, "style": 0.0, "speed": 1.0}}
        if "--sisip" in sys.argv:
            sblm = [k for k in list(asli) + [x["no"] for x in N] if k < b["no"]]; ssdh = [k for k in list(asli) + [x["no"] for x in N] if k > b["no"]]
            semua = dict(asli); semua.update({x["no"]: x["teks"] for x in N})
            if sblm: body["previous_text"] = tts_teks(semua[max(sblm)])
            if ssdh: body["next_text"] = tts_teks(semua[min(ssdh)])
        else:
            if i: body["previous_text"] = tts_teks(N[i - 1]["teks"])
            if i + 1 < len(N): body["next_text"] = tts_teks(N[i + 1]["teks"])
        for k in range(4):
            try:
                r = urllib.request.Request(f"https://api.elevenlabs.io/v1/text-to-speech/{VID}?output_format=mp3_44100_128",
                    data=json.dumps(body).encode(), headers={"xi-api-key": "dummy", "Content-Type": "application/json"})
                data = urllib.request.urlopen(r, timeout=180).read(); break
            except Exception as e:
                if getattr(e, "code", 0) == 400 and "previous_text" in body:
                    body.pop("previous_text", None); body.pop("next_text", None); continue
                print("ulang", e); time.sleep(3 * (k + 1))
        open(out, "wb").write(data); print(ep, b["no"], len(b["teks"]), flush=True)
if __name__ == "__main__": main()
