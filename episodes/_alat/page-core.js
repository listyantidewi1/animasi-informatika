const YT_CHANNEL = "https://www.youtube.com/@iteachswe";   // channel YouTube Bu Dewi (video lengkap seri ini)
/* Inti halaman latihan: pemutar (kanvas + narasi), tombol suara nyala/mati (berpindah antara timeline suara dan teks),
   kuis dengan petunjuk, dan kemajuan di localStorage (perangkat ini saja).
   Pakai:  const P = PageCore({ suara: TIMELINE_SUARA_atau_null, teks: TIMELINE_TEKS });
   Episode menambahkan latihannya sendiri lewat P.$, P.K, P.H, P.progress, P.save(), P.speed(), P.onProgress(fn). */
function PageCore(TLS, opt = {}) {
  const $ = id => document.getElementById(id);
  const K = Kiko, H = K.helpers;
  let voice = !!TLS.suara; let TL = voice ? TLS.suara : TLS.teks;
  // ---------- progress storage (per device only) ----------
  const KEY = opt.key || TL.episode.replace(/\./g, "").toLowerCase() + "-progress";   // D7.5 -> "d75-progress"
  let progress = { quiz: {} };
  try { const s = localStorage.getItem(KEY); if (s) progress = { quiz: {}, ...JSON.parse(s) }; } catch (e) {}
  const extras = [];
  function renderProgress() {
    const el = $("progress"); if (!el) return; el.innerHTML = "";
    Object.keys(TL.quizzes).forEach((id, i) => { const s = document.createElement("span"); s.textContent = "Cek " + (i + 1); s.className = progress.quiz[id] ? "ok" : ""; el.appendChild(s); });
    extras.forEach(f => f(el));
  }
  function save() { try { localStorage.setItem(KEY, JSON.stringify(progress)); } catch (e) {} renderProgress(); }

  // ---------- player ----------
  const cv = $("screen"), ctx = cv.getContext("2d");
  let t = 0, playing = false, last = 0, speed = 1, hasAudio = false;
  const nar = $("nar"); nar.addEventListener("canplay", () => { hasAudio = true; }); nar.addEventListener("error", () => { hasAudio = false; });
  function fmt(s) { s = Math.max(0, Math.floor(s)); return Math.floor(s / 60) + ":" + String(s % 60).padStart(2, "0"); }
  function segStart(i) { return TL.beats.find(b => b.seg === i).start; }
  function syncAudio() { if (voice && hasAudio) { try { nar.currentTime = t; } catch (e) {} } }
  function drawNow() {
    const b = K.draw(ctx, Math.min(t, TL.total - 0.01), TL);
    $("barfill").style.width = (t / TL.total * 100) + "%"; $("bar").setAttribute("aria-valuenow", Math.round(t / TL.total * 100));
    $("timelabel").textContent = fmt(t) + " / " + fmt(TL.total);
    [...$("chapters").children].forEach((c, i) => c.classList.toggle("now", i === b.seg));
    return b;
  }
  function loop(now) {
    if (!playing) return;
    const dt = Math.min(0.1, (now - last) / 1000); last = now; if (voice && hasAudio && !nar.paused) t = nar.currentTime; else t += dt * speed;
    if (t >= TL.total) { t = TL.total - 0.01; setPlaying(false); }
    drawNow(); requestAnimationFrame(loop);
  }
  function setPlaying(p) {
    playing = p; $("bigplay").hidden = p; $("playbtn").textContent = p ? "❚❚ Jeda" : "▶ Putar";
    if (p) { last = performance.now(); if (voice && hasAudio) { try { nar.currentTime = t; nar.playbackRate = speed; nar.play().catch(() => {}); } catch (e) {} } requestAnimationFrame(loop); } else nar.pause();
  }
  $("bigplay").addEventListener("click", () => setPlaying(true));
  $("playbtn").addEventListener("click", () => setPlaying(!playing));
  $("replay").addEventListener("click", () => { const b = K.beatAt(TL, t); t = segStart(b.seg); syncAudio(); drawNow(); setPlaying(true); });
  $("slow").addEventListener("click", e => { speed = speed === 1 ? 0.8 : 1; nar.playbackRate = speed; e.currentTarget.setAttribute("aria-pressed", speed !== 1); });
  function seekFromBar(ev) { const r = $("bar").getBoundingClientRect(); const x = (ev.touches ? ev.touches[0].clientX : ev.clientX) - r.left; t = Math.max(0, Math.min(TL.total - 0.01, x / r.width * TL.total)); syncAudio(); drawNow(); }
  $("bar").addEventListener("click", seekFromBar);
  $("bar").addEventListener("keydown", e => { if (e.key === "ArrowRight") { t = Math.min(TL.total - 0.01, t + 5); syncAudio(); drawNow(); } if (e.key === "ArrowLeft") { t = Math.max(0, t - 5); syncAudio(); drawNow(); } });
  TL.segments.forEach((name, i) => { const b = document.createElement("button"); b.textContent = (i + 1) + ". " + name; b.addEventListener("click", () => { t = segStart(i); syncAudio(); drawNow(); setPlaying(true); }); $("chapters").appendChild(b); });
  // voice on/off: switches between the narrated timeline and the reading-paced one, staying on the same beat
  const vb = $("voice");
  function setVoice(on) {
    const cur = K.beatAt(TL, t);
    voice = on && !!TLS.suara; TL = voice ? TLS.suara : TLS.teks;
    const nb = TL.beats.find(b => b.id === cur.id) || TL.beats[0]; t = nb.start;
    if (vb) { vb.setAttribute("aria-pressed", voice); vb.textContent = voice ? "🔊 Suara: nyala" : "🔇 Suara: mati"; }
    if (playing) { if (voice && hasAudio) { try { nar.currentTime = t; nar.playbackRate = speed; nar.play().catch(() => {}); } catch (e) {} } else nar.pause(); }
    drawNow();
  }
  if (vb) { if (!TLS.suara || !TLS.teks) vb.hidden = true; else { vb.addEventListener("click", () => setVoice(!voice)); vb.setAttribute("aria-pressed", voice); vb.textContent = voice ? "🔊 Suara: nyala" : "🔇 Suara: mati"; } }
  drawNow();

  // ---------- quiz ----------
  const quizEl = $("quiz");
  if (quizEl) Object.entries(TL.quizzes).forEach(([id, q], qi) => {
    const box = document.createElement("div"); box.className = "q";
    box.innerHTML = `<h3>${qi + 1}. ${q.q}</h3><div class="opts"></div><div class="fb"></div>`;
    const opts = box.querySelector(".opts"), fb = box.querySelector(".fb");
    q.options.forEach((o, i) => {
      const b = document.createElement("button"); b.innerHTML = `<b>${"ABC"[i]}</b><span>${o}</span>`;
      b.addEventListener("click", () => {
        [...opts.children].forEach(c => c.classList.remove("wrong"));
        if (i === q.answer) { b.classList.add("right"); fb.className = "fb good"; fb.textContent = "Benar! " + (q.explain || ""); progress.quiz[id] = true; save(); [...opts.children].forEach(c => c.disabled = true); }
        else { b.classList.add("wrong"); fb.className = "fb bad"; fb.textContent = "Belum tepat. Petunjuk: " + q.hint; }
      });
      opts.appendChild(b);
    });
    if (progress.quiz[id]) { opts.children[q.answer].classList.add("right"); [...opts.children].forEach(c => c.disabled = true); fb.className = "fb good"; fb.textContent = "Sudah dijawab benar."; }
    quizEl.appendChild(box);
  });
  renderProgress();

  // video YouTube (bila alamatnya sudah diisi di youtube_id.json): pemutar utama di atas; animasi tetap ada untuk luring
  try {
    const YTL = (typeof window !== "undefined" && window.__YT) || [];
    const pl = document.querySelector("section.player");
    if (YTL.length && pl && !document.getElementById("yt-video")) {
      const sec = document.createElement("section"); sec.className = "card yt-video"; sec.id = "yt-video"; sec.setAttribute("aria-label", "Video YouTube");
      const h = document.createElement("h2"); h.textContent = "Video"; sec.appendChild(h);
      let row = null;
      if (YTL.length > 1) { row = document.createElement("div"); row.className = "row"; sec.appendChild(row); }
      const box = document.createElement("div"); box.className = "yt-frame"; sec.appendChild(box);
      const show = (i) => {
        box.innerHTML = "";
        const f = document.createElement("iframe");
        f.src = "https://www.youtube-nocookie.com/embed/" + YTL[i].id + "?rel=0";
        f.title = "Video " + YTL[i].part; f.loading = "lazy"; f.allowFullscreen = true;
        f.setAttribute("allow", "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share");
        box.appendChild(f);
        if (row) [...row.children].forEach((b, j) => b.setAttribute("aria-pressed", String(j === i)));
      };
      if (row) YTL.forEach((x, i) => { const b = document.createElement("button"); b.textContent = "Bagian " + (i + 1); b.addEventListener("click", () => show(i)); row.appendChild(b); });
      const note = document.createElement("p"); note.className = "hint"; note.textContent = "Tidak ada internet? Putar animasinya di bawah; teksnya sama dan bisa dipakai tanpa internet."; sec.appendChild(note);
      show(0);
      pl.insertAdjacentElement("beforebegin", sec);
      const lab = document.createElement("div"); lab.className = "eyebrow"; lab.textContent = "Animasi interaktif (bisa tanpa internet)"; pl.insertAdjacentElement("afterbegin", lab);
    }
  } catch (e) {}
  // ajakan ke channel YouTube (video lengkap): kartu tepat di bawah pemutar, di semua halaman latihan dan simulasi
  try {
    const pl = document.querySelector("section.player");
    if (pl && !document.getElementById("yt-ajak")) {
      const a = document.createElement("a"); a.id = "yt-ajak"; a.className = "yt-ajak"; a.href = YT_CHANNEL; a.target = "_blank"; a.rel = "noopener";
      a.innerHTML = '<span class="yt-ic" aria-hidden="true">▶</span><span><b>Tonton video lengkapnya di YouTube</b><small>Subscribe channel @iteachswe untuk belajar lebih banyak.</small></span>';
      pl.insertAdjacentElement("afterend", a);
    }
  } catch (e) {}
  return { $, K, H, progress, save, renderProgress, speed: () => speed, timeline: () => TL,
           onProgress(fn) { extras.push(fn); renderProgress(); } };
}
