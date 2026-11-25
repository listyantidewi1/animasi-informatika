"""Perbaiki jejak kamera supaya zoom tidak memotong teks (OCR bingkai sumber). python3 antipotong.py Txx [rek]"""
import json, sys, os, shutil, cv2, numpy as np
from rapidocr_onnxruntime import RapidOCR
OCR = RapidOCR(); SK = float(os.environ.get('SK', '0.5'))
def baca(cap, t):
    cap.set(cv2.CAP_PROP_POS_MSEC, t * 1000); ok, fr = cap.read(); return fr if ok else None
def kotak(fr, sk=0.5):
    im = cv2.resize(fr, None, fx=sk, fy=sk, interpolation=cv2.INTER_AREA); r, _ = OCR(im)
    return [(min(p[0] for p in b) / sk, min(p[1] for p in b) / sk, max(p[0] for p in b) / sk, max(p[1] for p in b) / sk, t) for b, t, s in (r or []) if float(s) > .5]
def main(ep, nama="rek"):
    base = f"/home/user/tut/{ep}/{nama}"; asli = base + "_asli.json"
    if not os.path.exists(asli): shutil.copy(base + ".json", asli)
    print("pakai", asli)
    log = json.load(open(asli)); W, H = log["src"]; K = sorted(log["kamera"], key=lambda e: e[0]); cap = cv2.VideoCapture(base + ".mkv")
    ubah = 0
    for i, (t, tg) in enumerate(K):
        if not tg or tg[2] <= 1.02: continue
        t1 = K[i + 1][0] if i + 1 < len(K) else log["durasi"]
        if t1 - t < 0.4: continue
        cx, cy, z = tg; kiri, kanan = None, None
        for tt in sorted({max(t + .3, t1 - .15), (t + t1) / 2}):
            fr = baca(cap, tt)
            if fr is None: continue
            cw, ch = W / z, H / z; x0 = min(max(cx - cw / 2, 0), W - cw); y0 = min(max(cy - ch / 2, 0), H - ch)
            for (a, b, c, d, tx) in kotak(fr, SK):
                yc = (b + d) / 2
                if not (y0 + 8 < yc < y0 + ch - 8) or len(tx.strip()) < 2 or yc < 270: continue
                if a < x0 + cw - 4 < c and a > x0 - 2: kanan = max(kanan or 0, c + 30)
                if a < x0 + 2 < c and c < x0 + cw: kiri = min(kiri or W, a - 30)
        if kiri is None and kanan is None: continue
        cw = W / z; x0 = min(max(cx - cw / 2, 0), W - cw); L = min(x0, kiri if kiri is not None else x0); R = max(x0 + cw, kanan or 0)
        z2 = max(1.0, min(z, W / (R - L))); cx2 = (L + R) / 2
        K[i] = [t, [cx2, cy, z2]]; ubah += 1; print(f"{t:7.2f} z {z:.2f}->{z2:.2f}", flush=True)
    log["kamera"] = K; json.dump(log, open(base + (".json" if not os.environ.get("CEK") else "_cek.json"), "w")); print(ep, nama, "diubah", ubah, "dari", sum(1 for e in K if e[1]))
if __name__ == "__main__": main(sys.argv[1], sys.argv[2] if len(sys.argv) > 2 else "rek")
