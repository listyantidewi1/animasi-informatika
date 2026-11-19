import sys, os, subprocess, asyncio, ssl, edge_tts, edge_tts.communicate as ec
ec._SSL_CTX = ssl.create_default_context(cafile="/root/.ccr/ca-bundle.crt")
sys.path.insert(0, "/tmp/claude-0/ht"); from naskah import BEATS
SUARA = {"gadis": "id-ID-GadisNeural", "ardi": "id-ID-ArdiNeural"}
async def main():
    for nm, v in SUARA.items():
        os.makedirs(f"edge2/{nm}", exist_ok=True)
        for i, (k, layar, t) in enumerate(BEATS):
            # edge-tts melafalkan istilah Inggris lebih baik: pakai teks layar, ganti beberapa
            tt = layar.replace("claude --version", "claude, minus minus version").replace(".local/bin", "lokal bin").replace("Claude", "Klod").replace("claude", "klod").replace("PowerShell", "Pawer Syel").replace("successfully installed", "saksesfuli instold").replace("PATH", "path")
            raw = f"edge2/{nm}/{i:02d}_{k}.mp3"; out = f"edge2/{nm}/{i:02d}_{k}.wav"
            if not os.path.exists(raw): await edge_tts.Communicate(tt, v, rate="+5%").save(raw)
            subprocess.run(["ffmpeg","-v","error","-y","-i",raw,"-af","silenceremove=start_periods=1:start_threshold=-50dB,areverse,silenceremove=start_periods=1:start_threshold=-50dB,areverse,loudnorm=I=-16:TP=-1.5","-ar","44100","-ac","1",out],check=True)
asyncio.run(main())
