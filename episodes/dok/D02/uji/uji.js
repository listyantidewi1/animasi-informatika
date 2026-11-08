/* Klip uji D02 Bab 4 (15 detik): teknik baru = adegan 3D three.js + lapisan 2D (bloom, grain, vignette, teks pegas, Bip).
   window.__frame(t) menggambar frame pada detik t (deterministik) ke kanvas keluaran 2D dan mengembalikan JPEG dataURL. */
(function () {
  const W = 1920, H = 1080, CUE = window.CUE;
  const clamp = (v, a = 0, b = 1) => Math.max(a, Math.min(b, v)), lerp = (a, b, t) => a + (b - a) * t;
  const eio = t => { t = clamp(t); return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2; };
  const eout = t => 1 - Math.pow(1 - clamp(t), 3);
  // pegas teredam: 0 → 1 dengan sedikit melewati target lalu menetap
  const spring = (t, k = 7, z = 0.42) => { if (t <= 0) return 0; const w = k, d = Math.exp(-z * w * t); return 1 - d * Math.cos(w * Math.sqrt(1 - z * z) * t); };
  function rng(seed) { let a = seed >>> 0; return () => { a += 0x6D2B79F5; let t = a; t = Math.imul(t ^ t >>> 15, t | 1); t ^= t + Math.imul(t ^ t >>> 7, t | 61); return ((t ^ t >>> 14) >>> 0) / 4294967296; }; }

  // ---------- three.js ----------
  const glc = document.getElementById("gl"), out = document.getElementById("out"), ctx = out.getContext("2d");
  const glowBuf = document.createElement("canvas"); glowBuf.width = W / 2; glowBuf.height = H / 2; const gctx = glowBuf.getContext("2d");
  const R = new THREE.WebGLRenderer({ canvas: glc, antialias: true, preserveDrawingBuffer: true });
  R.setSize(W, H, false); R.setPixelRatio(1); R.toneMapping = THREE.ACESFilmicToneMapping; R.toneMappingExposure = 1.05;
  R.outputColorSpace = THREE.SRGBColorSpace;
  const scene = new THREE.Scene(); scene.background = new THREE.Color("#070B24"); scene.fog = new THREE.FogExp2("#070B24", 0.035);
  const cam = new THREE.PerspectiveCamera(38, W / H, 0.05, 200);

  // lingkungan pantul buatan: panel-panel cahaya berwarna (supaya logam & iridescence punya sesuatu untuk dipantulkan)
  const envScene = new THREE.Scene(); envScene.background = new THREE.Color("#0A0F2E");
  [["#5B7CFF", [6, 4, 0], [8, 6]], ["#FF5FA0", [-6, 3, 2], [7, 5]], ["#3FE0D0", [0, 6, -6], [10, 3]], ["#FFC46B", [2, 5, 6], [6, 3]], ["#B57CFF", [-3, 6, -3], [5, 4]], ["#FFFFFF", [0, 8, 0], [3, 3]]].forEach(([c, p, s]) => {
    const m = new THREE.Mesh(new THREE.PlaneGeometry(s[0], s[1]), new THREE.MeshBasicMaterial({ color: c, side: THREE.DoubleSide })); m.position.set(...p); m.lookAt(0, 0, 0); envScene.add(m); });
  const pm = new THREE.PMREMGenerator(R); scene.environment = pm.fromScene(envScene, 0.04).texture;

  scene.add(new THREE.HemisphereLight("#8FA8FF", "#1A1030", 0.6));
  const key = new THREE.DirectionalLight("#FFE2B8", 2.2); key.position.set(4, 6, 3); scene.add(key);
  const rim = new THREE.DirectionalLight("#4FE3FF", 2.0); rim.position.set(-5, 3, -6); scene.add(rim);

  const GLOW = 1;  // lapisan kamera untuk benda bercahaya (dipakai pass bloom)
  const glowMat = (c, i = 1) => new THREE.MeshBasicMaterial({ color: new THREE.Color(c).multiplyScalar(i), toneMapped: false });

  // ---- wafer ----
  const wafer = new THREE.Group(); scene.add(wafer);
  const WR = 3;
  const waferMat = new THREE.MeshPhysicalMaterial({ color: "#8E9AC0", metalness: 1, roughness: 0.1, iridescence: 1, iridescenceIOR: 2.0, iridescenceThicknessRange: [120, 1200], clearcoat: 0.8, clearcoatRoughness: 0.05, envMapIntensity: 1.8 });
  const disc = new THREE.Mesh(new THREE.CylinderGeometry(WR, WR, 0.05, 160), waferMat); wafer.add(disc);
  const notch = new THREE.Mesh(new THREE.BoxGeometry(0.25, 0.06, 0.2), new THREE.MeshStandardMaterial({ color: "#070B24" })); notch.position.set(0, 0, WR - 0.05); wafer.add(notch);
  // keping (die) di atas wafer: InstancedMesh
  const DS = 0.2, GAP = 0.025, dies = [];
  for (let i = -14; i <= 14; i++) for (let j = -14; j <= 14; j++) { const x = i * (DS + GAP), z = j * (DS + GAP); if (Math.hypot(Math.abs(x) + DS / 2, Math.abs(z) + DS / 2) < WR - 0.12) dies.push([x, z]); }
  const dieMat = new THREE.MeshPhysicalMaterial({ color: "#FFFFFF", metalness: 0.7, roughness: 0.2, iridescence: 1, iridescenceIOR: 2.2, iridescenceThicknessRange: [100, 1300], envMapIntensity: 1.8 });
  const dieGeo = new THREE.BoxGeometry(DS, 0.03, DS);
  const dieMesh = new THREE.InstancedMesh(dieGeo, dieMat, dies.length); wafer.add(dieMesh);
  const hue = new THREE.Color();
  // kilau pelangi bergaya ilustrasi: warna tiap keping mengikuti posisi + pita terang yang menyapu wafer
  function rainbow(t) { dies.forEach(([x, z], k) => { const h = (0.55 + x * 0.07 + z * 0.045 + t * 0.03) % 1; const band = Math.exp(-Math.pow((x * 0.8 - z * 0.6) - lerp(-4, 4, (t * 0.22) % 1.4), 2) * 1.2);
    hue.setHSL(h, 0.55, 0.42 + 0.25 * band); dieMesh.setColorAt(k, hue); }); dieMesh.instanceColor.needsUpdate = true; }
  rainbow(0);
  const tmp = new THREE.Object3D();
  // keping yang dipilih untuk ditumpuk (8 buah), diambil dari wafer
  const r0 = rng(11); const pickIdx = []; while (pickIdx.length < 8) { const k = Math.floor(r0() * dies.length); const [x, z] = dies[k]; if (Math.hypot(x, z) < 2.0 && !pickIdx.includes(k)) pickIdx.push(k); }
  // kilau acak di permukaan wafer (lapisan bloom)
  const sparkGeo = new THREE.PlaneGeometry(0.045, 0.045), sparks = [];
  const r1 = rng(5); for (let k = 0; k < 90; k++) { const [x, z] = dies[Math.floor(r1() * dies.length)]; const m = new THREE.Mesh(sparkGeo, glowMat("#FFFFFF", 2)); m.rotation.x = -Math.PI / 2; m.position.set(x + (r1() - 0.5) * 0.2, 0.05, z + (r1() - 0.5) * 0.2); m.layers.enable(GLOW); m.userData.ph = r1() * 20; m.userData.sp = 0.5 + r1() * 1.5; wafer.add(m); sparks.push(m); }

  // ---- tumpukan HBM + interposer + chip AI ----
  const STACK = new THREE.Vector3(5.2, 0, -0.6);
  const board = new THREE.Group(); board.position.copy(STACK); scene.add(board);
  const inter = new THREE.Mesh(new THREE.BoxGeometry(3.4, 0.08, 1.6), new THREE.MeshStandardMaterial({ color: "#1B244E", metalness: 0.4, roughness: 0.5 })); inter.position.set(0.9, -0.04, 0); board.add(inter);
  const gpu = new THREE.Mesh(new THREE.BoxGeometry(1.2, 0.12, 1.2), new THREE.MeshPhysicalMaterial({ color: "#2A3060", metalness: 0.6, roughness: 0.3, clearcoat: 1 })); gpu.position.set(1.6, 0.06, 0); board.add(gpu);
  const gpuCore = new THREE.Mesh(new THREE.BoxGeometry(0.7, 0.13, 0.7), glowMat("#3FE0D0", 0)); gpuCore.position.set(1.6, 0.07, 0); gpuCore.layers.enable(GLOW); board.add(gpuCore);
  const flyers = pickIdx.map((k, i) => { const m = new THREE.Mesh(dieGeo.clone(), dieMat.clone()); m.scale.set(2.7, 2.6, 2.7); m.visible = false; scene.add(m); return m; });
  const edgeMat = glowMat("#4FE3FF", 0);
  const edges = flyers.map(() => { const e = new THREE.Mesh(new THREE.BoxGeometry(DS * 2.74, 0.012, DS * 2.74), edgeMat); e.layers.enable(GLOW); e.visible = false; scene.add(e); return e; });
  const tsvMat = glowMat("#7CF0FF", 0); const tsvs = [];
  for (let a = 0; a < 4; a++) { const t = new THREE.Mesh(new THREE.CylinderGeometry(0.018, 0.018, 1, 8), tsvMat); t.layers.enable(GLOW); t.position.set((a % 2 ? 0.14 : -0.14), 0, (a < 2 ? 0.14 : -0.14)); t.visible = false; board.add(t); tsvs.push(t); }
  // paket data dari HBM ke chip AI
  const pkts = []; for (let k = 0; k < 14; k++) { const m = new THREE.Mesh(new THREE.SphereGeometry(0.035, 10, 8), glowMat("#FFC46B", 3)); m.layers.enable(GLOW); m.visible = false; board.add(m); pkts.push(m); }

  // ---- pusat data (untuk penutup) ----
  const racks = new THREE.Group(); scene.add(racks);
  const rackGeo = new THREE.BoxGeometry(1.0, 2.6, 1.3), rackMat = new THREE.MeshStandardMaterial({ color: "#121A40", metalness: 0.5, roughness: 0.45 });
  const ledGeo = new THREE.PlaneGeometry(0.7, 0.03), leds = [];
  for (let row = -3; row <= 3; row++) for (let c = 0; c < 22; c++) {
    const x = STACK.x + 1 + row * 3.2, z = -6 - c * 1.6; if (row === 0) continue;
    const rk = new THREE.Mesh(rackGeo, rackMat); rk.position.set(x, 1.3, z); racks.add(rk);
    for (let L = 0; L < 6; L++) { const m = new THREE.Mesh(ledGeo, glowMat(L % 3 ? "#3FE0D0" : "#5B7CFF", 2.4)); m.position.set(x + (row < 0 ? 0.51 : -0.51), 0.5 + L * 0.35, z); m.rotation.y = row < 0 ? Math.PI / 2 : -Math.PI / 2; m.layers.enable(GLOW); m.userData.ph = (c * 7 + L * 3 + row) % 11; racks.add(m); leds.push(m); }
  }
  const floor = new THREE.Mesh(new THREE.PlaneGeometry(80, 80), new THREE.MeshStandardMaterial({ color: "#0A0E2A", metalness: 0.2, roughness: 0.85, envMapIntensity: 0.12 })); floor.rotation.x = -Math.PI / 2; floor.position.y = -0.06; scene.add(floor);

  // ---------- waktu ----------
  // CUE: lift0, landStep, lands[i] — dihitung sama dengan musik (cues.json)
  function placeFlyers(t) {
    flyers.forEach((m, i) => {
      const [x, z] = dies[pickIdx[i]], t0 = CUE.lift0 + i * CUE.landStep * 0.55, t1 = CUE.lands[i];
      if (t < t0) { m.visible = false; edges[i].visible = false; return; }
      m.visible = true; edges[i].visible = true;
      const u = clamp((t - t0) / (t1 - t0)), e = eio(u);
      const sx = x, sz = z, ex = STACK.x, ez = STACK.z, ey = 0.12 + i * 0.105;
      const px = lerp(sx, ex, e), pz = lerp(sz, ez, e), py = lerp(0.06, ey, e) + Math.sin(Math.PI * u) * (1.6 + i * 0.06);
      // mendarat dengan pegas (sedikit memantul)
      const land = t > t1 ? spring(t - t1, 18, 0.35) : 1, bounce = t > t1 ? (1 - land) * 0.12 : 0;
      m.position.set(px, py - bounce, pz); m.rotation.set(Math.sin(u * Math.PI) * 0.9, u * Math.PI * 2 * (i % 2 ? 1 : -1) * (1 - e), 0);
      if (u >= 1) m.rotation.set(0, 0, 0);
      edges[i].position.copy(m.position); edges[i].position.y += 0.035; edges[i].rotation.copy(m.rotation);
    });
    // keping asal di wafer menghilang saat diangkat
    dies.forEach(([x, z], k) => { const i = pickIdx.indexOf(k); const hide = i >= 0 && t >= CUE.lift0 + i * CUE.landStep * 0.55;
      tmp.position.set(x, 0.04, z); tmp.scale.setScalar(hide ? 0.0001 : 1); tmp.updateMatrix(); dieMesh.setMatrixAt(k, tmp.matrix); });
    dieMesh.instanceMatrix.needsUpdate = true;
  }
  const CAM = [ // [t, posX, posY, posZ, lookX, lookY, lookZ]
    [0, -1.5, 2.2, 6.0, 0, 0, 0], [3.8, 2.5, 1.6, 4.6, 0.4, 0, -0.2], [6.5, 6.8, 2.6, 4.8, 3.6, 0.3, -0.4], [9.0, 7.6, 1.5, 2.6, STACK.x + 0.7, 0.45, STACK.z],
    [11.6, 8.4, 1.25, 1.3, STACK.x + 0.8, 0.5, STACK.z], [15, STACK.x + 1, 9.5, 9.0, STACK.x + 1, 0.4, -14]];
  function camAt(t) {
    let i = 0; while (i < CAM.length - 2 && t > CAM[i + 1][0]) i++;
    const a = CAM[i], b = CAM[i + 1], u = eio((t - a[0]) / (b[0] - a[0]));
    cam.position.set(lerp(a[1], b[1], u), lerp(a[2], b[2], u), lerp(a[3], b[3], u)); cam.lookAt(lerp(a[4], b[4], u), lerp(a[5], b[5], u), lerp(a[6], b[6], u));
  }

  // ---------- lapisan 2D ----------
  const GRAIN = (() => { const c = document.createElement("canvas"); c.width = c.height = 256; const g = c.getContext("2d"); const d = g.createImageData(256, 256); const r = rng(3);
    for (let i = 0; i < d.data.length; i += 4) { const v = 128 + (r() - 0.5) * 255; d.data[i] = d.data[i + 1] = d.data[i + 2] = v; d.data[i + 3] = 255; } g.putImageData(d, 0, 0); return c; })();
  const FONT = "Inter, Arial, sans-serif";
  function label(t, t0, big, small, x, y) {
    const u = t - t0; if (u <= 0) return; const s = spring(u, 9, 0.45), a = clamp(u / 0.25) * clamp((CUE.labelOut - t) / 0.4);
    if (a <= 0) return; ctx.save(); ctx.globalAlpha = a; ctx.translate(x, y); ctx.scale(lerp(0.85, 1, s), lerp(0.85, 1, s));
    ctx.font = `900 88px ${FONT}`; ctx.fillStyle = "#FFFFFF"; ctx.textAlign = "left"; ctx.fillText(big, 0, 0);
    ctx.font = `700 34px ${FONT}`; ctx.fillStyle = "#C9D4F2"; ctx.fillText(small, 2, 56);
    ctx.fillStyle = "#FFB547"; ctx.fillRect(2, 82, 140 * clamp(u / 0.6), 6); ctx.restore();
  }
  function counter(t) {   // "≈ 3× wafer per gigabyte": tiga ikon wafer muncul beruntun dengan pegas
    const t0 = CUE.ratio; if (t < t0) return; const a = clamp((CUE.labelOut - t) / 0.4); if (a <= 0) return;
    ctx.save(); ctx.globalAlpha = a; const x0 = 1300, y0 = 860;
    ctx.fillStyle = "rgba(6,10,30,0.72)"; ctx.beginPath(); ctx.roundRect(x0 - 30, y0 - 90, 560, 180, 24); ctx.fill(); ctx.strokeStyle = "rgba(169,184,220,0.25)"; ctx.lineWidth = 2; ctx.stroke();
    for (let i = 0; i < 3; i++) { const s = spring(t - t0 - i * 0.18, 10, 0.4); if (s <= 0) continue; const cx = x0 + 40 + i * 92, cy = y0 - 20;
      ctx.save(); ctx.translate(cx, cy); ctx.scale(s, s); const g = ctx.createLinearGradient(-36, -36, 36, 36); g.addColorStop(0, "#8FA8FF"); g.addColorStop(0.5, "#FF8FB8"); g.addColorStop(1, "#7CF0FF");
      ctx.fillStyle = g; ctx.beginPath(); ctx.arc(0, 0, 36, 0, 6.283); ctx.fill(); ctx.strokeStyle = "rgba(255,255,255,0.5)"; ctx.lineWidth = 2; for (let k = -2; k <= 2; k++) { ctx.beginPath(); ctx.moveTo(k * 12, -30); ctx.lineTo(k * 12, 30); ctx.stroke(); } ctx.restore(); }
    const s2 = spring(t - t0 - 0.7, 10, 0.4); if (s2 > 0) { ctx.save(); ctx.translate(x0 + 360, y0 - 20); ctx.scale(s2, s2); ctx.font = `900 54px ${FONT}`; ctx.fillStyle = "#FFB547"; ctx.textAlign = "center"; ctx.fillText("→ 1 GB", 40, 18); ctx.restore(); }
    ctx.font = `700 26px ${FONT}`; ctx.fillStyle = "#A9B8DC"; ctx.textAlign = "left"; ctx.fillText("HBM memakan ±3× wafer per gigabyte", x0, y0 + 56); ctx.restore();
  }

  window.__frame = function (t, opt = {}) {
    // --- animasi 3D ---
    wafer.rotation.y = t * 0.08;
    sparks.forEach(m => { const v = Math.max(0, Math.sin(t * m.userData.sp * 3 + m.userData.ph)); m.scale.setScalar(0.3 + v * v * 1.4); m.visible = v > 0.2; });
    // keping terpilih menyala amber sebelum diangkat
    placeFlyers(t); rainbow(t);
    const landed = CUE.lands.filter(x => t >= x).length;
    edgeMat.color.set("#4FE3FF").multiplyScalar(0.9 * clamp((t - CUE.lift0) / 0.8));
    const glowOn = clamp((t - CUE.stackGlow) / 1.0);
    tsvs.forEach(m => { m.visible = landed >= 8; m.scale.y = (0.105 * 8 + 0.1) * eout(glowOn); m.position.y = 0.12 + m.scale.y / 2; });
    tsvMat.color.set("#7CF0FF").multiplyScalar(2.2 * glowOn);
    { const g = clamp((t - CUE.stackGlow - 0.6) / 0.8); gpuCore.material.color.set("#1C2860").lerp(new THREE.Color("#3FE0D0").multiplyScalar(2.4), g); }
    pkts.forEach((m, k) => { const u = ((t - CUE.stackGlow) * 0.9 + k / pkts.length) % 1; m.visible = t > CUE.stackGlow + 0.4; m.position.set(lerp(0.15, 1.6, u), 0.5 - 0.42 * u + Math.sin(u * Math.PI) * 0.25, (k % 3 - 1) * 0.18); });
    leds.forEach(m => { const v = 0.5 + 0.5 * Math.sin(t * 6 + m.userData.ph); m.scale.x = 0.4 + 0.6 * v; });
    racks.visible = t > 10.5;
    camAt(t);
    // --- pass bloom: hanya benda bercahaya, lalu pass lengkap ---
    cam.layers.set(GLOW); scene.background = new THREE.Color("#000000"); const fog = scene.fog; scene.fog = null;
    R.render(scene, cam); gctx.clearRect(0, 0, W / 2, H / 2); gctx.drawImage(glc, 0, 0, W / 2, H / 2);
    cam.layers.enableAll(); scene.background = new THREE.Color("#070B24"); scene.fog = fog;
    R.render(scene, cam);
    // --- komposit 2D ---
    ctx.globalCompositeOperation = "source-over"; ctx.filter = "none"; ctx.drawImage(glc, 0, 0);
    ctx.globalCompositeOperation = "lighter";
    ctx.filter = "blur(10px)"; ctx.globalAlpha = 0.9; ctx.drawImage(glowBuf, 0, 0, W, H);
    ctx.filter = "blur(36px)"; ctx.globalAlpha = 0.7; ctx.drawImage(glowBuf, 0, 0, W, H);
    ctx.filter = "none"; ctx.globalAlpha = 1; ctx.globalCompositeOperation = "source-over";
    // vignette + grain + pudar masuk/keluar
    const vg = ctx.createRadialGradient(W / 2, H / 2, H * 0.35, W / 2, H / 2, H * 0.95); vg.addColorStop(0, "rgba(0,0,0,0)"); vg.addColorStop(1, "rgba(0,0,0,0.5)"); ctx.fillStyle = vg; ctx.fillRect(0, 0, W, H);
    ctx.globalAlpha = 0.05; ctx.globalCompositeOperation = "overlay"; const ox = Math.floor((t * 977) % 256), oy = Math.floor((t * 613) % 256);
    for (let x = -ox; x < W; x += 256) for (let y = -oy; y < H; y += 256) ctx.drawImage(GRAIN, x, y);
    ctx.globalAlpha = 1; ctx.globalCompositeOperation = "source-over";
    // judul kecil dan infografik
    label(t, CUE.label, "HBM", "memori bertingkat untuk AI", 110, 170);
    counter(t);
    // Bip bereaksi (wow) saat pusat data terungkap
    if (window.TikTok && t > CUE.reveal - 0.2) { const u = spring(t - CUE.reveal + 0.2, 8, 0.4); ctx.save(); ctx.globalAlpha = clamp((t - CUE.reveal + 0.2) / 0.3); TikTok.helpers.bip(ctx, 1710, 1010 - 90 * u, 150, { mood: "wow", t, look: [-0.7, -0.6] }); ctx.restore(); }
    const f = clamp(t / 0.6) * clamp((15 - t) / 0.8); if (f < 1) { ctx.fillStyle = `rgba(0,0,0,${1 - f})`; ctx.fillRect(0, 0, W, H); }
    return out.toDataURL("image/jpeg", opt.q || 0.92);
  };
  window.__ready = true;
})();
