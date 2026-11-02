"""Buat narasi per beat dengan ElevenLabs (API) langsung ke <episode>/suara_in/suara/<id>.mp3.

Kunci API, salah satu dari:
  (a) sesi cloud Claude Code: secret jaringan lingkungan (Add secret): Allowed websites api.elevenlabs.io, Custom header
      xi-api-key tanpa prefix. Proxy menyisipkan kuncinya ke tiap permintaan; skrip ini tidak pernah melihat kuncinya.
  (b) laptop: export ELEVENLABS_API_KEY=...  (dikirim sebagai header xi-api-key).
Kunci tidak pernah ditulis ke berkas mana pun.

  python3 episodes/_alat/suara_elevenlabs.py --daftar                      daftar suara (milik akun bila ada kunci)
  python3 episodes/_alat/suara_elevenlabs.py D7.0 --voice "Nama atau ID"   buat semua beat yang MP3-nya belum ada
  python3 episodes/_alat/suara_elevenlabs.py D7.0 --hanya intro1 s1a       hanya beat tertentu (coba dulu sebelum semua)
  python3 episodes/_alat/suara_elevenlabs.py D7.0 --ulang s1a              buat ulang beat yang sudah ada
  python3 episodes/_alat/suara_elevenlabs.py D7.0 --uji                    hitung karakter (kuota) tanpa memanggil API
Pilihan lain: --model (bawaan eleven_multilingual_v2), --speed 0.9, --stability 0.5, --similarity 0.75, --style 0.0.
Pengaturan yang dipakai disimpan di <episode>/tts-kit/suara.json supaya pembuatan ulang konsisten; voice.py membaca
"pitch" dari berkas itu (bawaan 1.0 untuk ElevenLabs: suaranya sudah dipilih natural, tidak perlu dinaikkan).
Teks beat sebelum/sesudah dikirim sebagai konteks (previous_text/next_text) agar intonasi antarbeat menyambung.
Setelah selesai: python3 episodes/_alat/voice.py D7.0  ->  build.py  ->  render.py D7.0 --suara
"""
import argparse, json, os, sys, time, urllib.error, urllib.request
import episode as E

API = "https://api.elevenlabs.io/v1"
LANG_CODE_MODELS = ("eleven_turbo_v2_5", "eleven_flash_v2_5")   # hanya model ini menerima language_code

KUNCI_HELP = ("ElevenLabs menolak permintaan (401): kunci tidak terkirim atau salah. Di sesi cloud: tambahkan secret jaringan di "
              "pengaturan lingkungan (Allowed websites: api.elevenlabs.io; Custom header: xi-api-key, prefix kosong, value = API key), "
              "lalu mulai sesi baru. Di laptop: export ELEVENLABS_API_KEY=...")

def key():
    return os.environ.get("ELEVENLABS_API_KEY", "").strip() or None   # None = andalkan secret jaringan (proxy) di sesi cloud

def call(method, path, body=None, auth=True, raw=False, tries=4):
    headers = {"accept": "audio/mpeg" if raw else "application/json"}
    if auth and key(): headers["xi-api-key"] = key()
    if body is not None: headers["content-type"] = "application/json"
    req = urllib.request.Request(API + path, data=json.dumps(body).encode() if body is not None else None, headers=headers, method=method)
    for attempt in range(tries):
        try:
            with urllib.request.urlopen(req, timeout=120) as r:
                return r.read() if raw else json.loads(r.read())
        except urllib.error.HTTPError as e:
            detail = e.read().decode(errors="replace")[:300]
            if e.code == 429 and attempt < tries - 1: time.sleep(2 ** (attempt + 1)); continue
            if e.code == 401: raise SystemExit(f"{KUNCI_HELP} Rincian: {detail}")
            if e.code == 402: raise SystemExit(f"Kuota karakter ElevenLabs habis (402). {detail}")
            raise SystemExit(f"ElevenLabs gagal ({e.code}) pada {path}: {detail}")
        except urllib.error.URLError as e:
            if attempt < tries - 1: time.sleep(2 ** (attempt + 1)); continue
            raise SystemExit(f"Tidak bisa menghubungi api.elevenlabs.io: {e.reason}")

def voices(auth):
    return call("GET", "/voices", auth=auth)["voices"]

def pick_voice(name_or_id, auth):
    vs = voices(auth)
    for v in vs:
        if v["voice_id"] == name_or_id: return v
    hits = [v for v in vs if name_or_id.lower() in v["name"].lower()]
    if len(hits) == 1: return hits[0]
    if not hits:
        if all(v.get("category") == "premade" for v in vs): raise SystemExit(f"Suara '{name_or_id}' tidak terlihat karena hanya suara bawaan yang terbaca: kunci API belum terkirim. {KUNCI_HELP}")
        raise SystemExit(f"Suara '{name_or_id}' tidak ditemukan di akun ini. Lihat --daftar; suara dari perpustakaan harus ditambahkan dulu ke 'My Voices'.")
    raise SystemExit("Nama cocok dengan beberapa suara, pakai ID-nya: " + ", ".join(f"{v['name']} = {v['voice_id']}" for v in hits))

def pick_model(ref):
    """Model dicari di /v1/models: cocok ID persis, atau namanya memuat teks (mis. "v4" -> "Eleven v4"). Hanya model TTS."""
    ms = [m for m in call("GET", "/models") if m.get("can_do_text_to_speech", True)]
    for m in ms:
        if m["model_id"] == ref: return m
    hits = [m for m in ms if ref.lower().replace("eleven_", "").replace("_", " ") in m.get("name", "").lower() or ref.lower() in m["model_id"].lower()]
    if len(hits) == 1: return hits[0]
    daftar = "\n".join(f"  {m['model_id']:28} {m.get('name', '')}" + ("  (Indonesia)" if any(l.get("language_id") == "id" for l in m.get("languages", [])) else "") for m in ms)
    raise SystemExit((f"Model '{ref}' tidak jelas ({len(hits)} cocok)." if hits else f"Model '{ref}' tidak ada.") + " Model TTS yang tersedia:\n" + daftar)

def tts(voice_id, body):
    """Kirim permintaan; bila model menolak pengaturan opsional (400), coba lagi tanpa speed/style, lalu tanpa konteks."""
    attempts = [body,
                {**body, "voice_settings": {"stability": body["voice_settings"]["stability"]}},
                {k: v for k, v in body.items() if k not in ("previous_text", "next_text", "voice_settings")}]
    last = None
    for i, b in enumerate(attempts):
        try:
            audio = call("POST", f"/text-to-speech/{voice_id}?output_format=mp3_44100_128", b, raw=True)
            if i and not tts.noted: print(f"  (catatan: model ini menolak sebagian pengaturan; dikirim tanpa {'speed/style/similarity' if i == 1 else 'speed/style/similarity dan konteks antarbeat'})"); tts.noted = True
            return audio
        except SystemExit as e:
            last = e
            if "(400)" not in str(e) or i == len(attempts) - 1: raise
    raise last
tts.noted = False

def main():
    ap = argparse.ArgumentParser(add_help=False)
    ap.add_argument("sisa", nargs="*"); ap.add_argument("--daftar", action="store_true"); ap.add_argument("--uji", action="store_true")
    ap.add_argument("--voice"); ap.add_argument("--model"); ap.add_argument("--speed", type=float); ap.add_argument("--stability", type=float)
    ap.add_argument("--similarity", type=float); ap.add_argument("--style", type=float)
    ap.add_argument("--hanya", nargs="+", default=[]); ap.add_argument("--ulang", nargs="+", default=[]); ap.add_argument("-h", "--help", action="store_true")
    a = ap.parse_args()
    if a.help: print(__doc__); return
    if a.daftar:
        vs = voices(auth=True)
        for v in vs: print(f"{v['voice_id']}  {v['name']}  [{v.get('category', '')}]" + ("  " + ", ".join(f"{k}={val}" for k, val in (v.get("labels") or {}).items()) if v.get("labels") else ""))
        if all(v.get("category") == "premade" for v in vs): print("(hanya suara bawaan yang tampil: kunci belum terkirim, jadi suara akun seperti Kak Ceria belum terlihat. Lihat petunjuk kunci di --help.)")
        return
    root, _ = E.find_root(a.sisa); script = E.load_script(root)
    kit = os.path.join(root, "tts-kit"); os.makedirs(kit, exist_ok=True); cfg_path = os.path.join(kit, "suara.json")
    cfg = E.load_json(cfg_path) if os.path.exists(cfg_path) else {}
    cfg.update({k: v for k, v in {"penyedia": "elevenlabs", "model": a.model, "speed": a.speed, "stability": a.stability, "similarity": a.similarity, "style": a.style}.items() if v is not None})
    cfg.setdefault("model", "eleven_multilingual_v2"); cfg.setdefault("speed", 0.9); cfg.setdefault("stability", 0.5); cfg.setdefault("similarity", 0.75); cfg.setdefault("style", 0.0); cfg.setdefault("pitch", 1.0)
    out_dir = os.path.join(root, "suara_in", "suara"); os.makedirs(out_dir, exist_ok=True)
    beats = script["beats"]; ids = [b["id"] for b in beats]
    for x in a.hanya + a.ulang:
        if x not in ids: raise SystemExit(f"beat '{x}' tidak ada di script.json")
    todo = [b for b in beats if (not a.hanya or b["id"] in a.hanya) and (b["id"] in a.ulang or not os.path.exists(os.path.join(out_dir, b["id"] + ".mp3")))]
    chars = sum(len(b["text"]) for b in todo)
    print(f"{script['episode']}: {len(todo)} dari {len(beats)} beat akan dibuat, {chars} karakter (model {cfg['model']}, speed {cfg['speed']})")
    if a.uji or not todo:
        for b in todo: print(f"  {b['id']:8} {len(b['text']):4} kar  {b['text'][:70]}")
        if not todo: print("Semua MP3 sudah ada. Pakai --ulang <id> untuk membuat ulang.")
        return
    voice_ref = a.voice or cfg.get("voice_id") or cfg.get("voice_name")
    if not voice_ref: raise SystemExit("Sebut suaranya: --voice \"Nama atau ID\" (lihat --daftar). Pilihan tersimpan di tts-kit/suara.json untuk lain kali.")
    v = pick_voice(voice_ref, auth=True); cfg["voice_id"] = v["voice_id"]; cfg["voice_name"] = v["name"]
    m = pick_model(cfg["model"]); cfg["model"] = m["model_id"]; cfg["model_name"] = m.get("name", "")
    E.save_json(cfg, cfg_path)
    print(f"suara: {v['name']} ({v['voice_id']}), model: {cfg['model_name']} ({cfg['model']}) -> {out_dir}")
    for b in todo:
        i = ids.index(b["id"])
        body = {"text": b["text"], "model_id": cfg["model"],
                "voice_settings": {"stability": cfg["stability"], "similarity_boost": cfg["similarity"], "style": cfg["style"], "speed": cfg["speed"]},
                "previous_text": beats[i - 1]["text"] if i > 0 else None, "next_text": beats[i + 1]["text"] if i + 1 < len(beats) else None}
        if cfg["model"] in LANG_CODE_MODELS: body["language_code"] = "id"
        body = {k: val for k, val in body.items() if val is not None}
        audio = tts(v["voice_id"], body)
        tmp = os.path.join(out_dir, b["id"] + ".tmp"); open(tmp, "wb").write(audio); os.replace(tmp, os.path.join(out_dir, b["id"] + ".mp3"))
        print(f"  ok {b['id']} ({len(audio) // 1024} KB)", flush=True)
    print(f"Selesai. Lanjut: python3 episodes/_alat/voice.py {script['episode']}  (nada {cfg['pitch']} dari tts-kit/suara.json)")

if __name__ == "__main__":
    main()
