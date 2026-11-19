import sys, os, subprocess
from gtts import gTTS
sys.path.insert(0, os.path.dirname(__file__)); from naskah import BEATS
TEMPO = 1.15
for i, (k, _, t) in enumerate(BEATS):
    raw = f"suara2/{i:02d}_{k}_asli.mp3"; out = f"suara2/{i:02d}_{k}.wav"
    if not os.path.exists(raw): gTTS(t, lang="id").save(raw)
    # percepat tanpa ubah nada (rubberband), potong hening ujung
    subprocess.run(["ffmpeg","-v","error","-y","-i",raw,"-af",
      f"silenceremove=start_periods=1:start_threshold=-50dB,areverse,silenceremove=start_periods=1:start_threshold=-50dB,areverse,rubberband=tempo={TEMPO},loudnorm=I=-16:TP=-1.5","-ar","44100","-ac","1",out],check=True)
    d = float(subprocess.check_output(["ffprobe","-v","error","-show_entries","format=duration","-of","csv=p=0",out]))
    print(f"{i:02d} {k:9s} {d:5.2f}s")
