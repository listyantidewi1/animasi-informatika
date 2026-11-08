/* Panggung 3D D02 (three.js, dimuat sesudah vendor/three.min.js dan sinema.js). Semua benda dibuat dengan kode.
   K.g3d.render(ctx, t, setup) menyembunyikan semua set, memanggil setup(S, cam) untuk memilih set + menata kamera dan benda
   (deterministik dari waktu), merender pass cahaya (bloom) lalu pass penuh, dan menempelkannya ke kanvas 2D ctx. */
(function (global) {
  const K = global.Kiko; if (!K || typeof THREE === "undefined") return;
  const W = 1920, HH = 1080, GLOW = 1;
  const clamp = (v, a = 0, b = 1) => Math.max(a, Math.min(b, v)), lerp = (a, b, t) => a + (b - a) * t;
  const eio = t => { t = clamp(t); return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2; };
  const eout = t => 1 - Math.pow(1 - clamp(t), 3);
  const spring = (t, k = 7, z = 0.42) => { if (t <= 0) return 0; const d = Math.exp(-z * k * t); return 1 - d * Math.cos(k * Math.sqrt(1 - z * z) * t); };
  function rng(seed) { let a = seed >>> 0; return () => { a += 0x6D2B79F5; let t = a; t = Math.imul(t ^ t >>> 15, t | 1); t ^= t + Math.imul(t ^ t >>> 7, t | 61); return ((t ^ t >>> 14) >>> 0) / 4294967296; }; }
  const glowMat = (c, i = 1) => new THREE.MeshBasicMaterial({ color: new THREE.Color(c).multiplyScalar(i), toneMapped: false });

  let R = null, scene, cam, glc, glowBuf, gctx, BG; const S = {};
  function init() {
    glc = document.createElement("canvas"); glc.width = W; glc.height = HH;
    glowBuf = document.createElement("canvas"); glowBuf.width = W / 2; glowBuf.height = HH / 2; gctx = glowBuf.getContext("2d");
    R = new THREE.WebGLRenderer({ canvas: glc, antialias: true, preserveDrawingBuffer: true });
    R.setSize(W, HH, false); R.setPixelRatio(1); R.toneMapping = THREE.ACESFilmicToneMapping; R.toneMappingExposure = 1.05; R.outputColorSpace = THREE.SRGBColorSpace;
    BG = new THREE.Color("#070B24");
    scene = new THREE.Scene(); scene.background = BG; scene.fog = new THREE.FogExp2("#070B24", 0.035);
    cam = new THREE.PerspectiveCamera(38, W / HH, 0.05, 200);
    // lingkungan pantul buatan: panel cahaya berwarna
    const env = new THREE.Scene(); env.background = new THREE.Color("#0A0F2E");
    [["#5B7CFF", [6, 4, 0], [8, 6]], ["#FF5FA0", [-6, 3, 2], [7, 5]], ["#3FE0D0", [0, 6, -6], [10, 3]], ["#FFC46B", [2, 5, 6], [6, 3]], ["#B57CFF", [-3, 6, -3], [5, 4]], ["#FFFFFF", [0, 8, 0], [3, 3]]].forEach(([c, p, s]) => {
      const m = new THREE.Mesh(new THREE.PlaneGeometry(s[0], s[1]), new THREE.MeshBasicMaterial({ color: c, side: THREE.DoubleSide })); m.position.set(...p); m.lookAt(0, 0, 0); env.add(m); });
    scene.environment = new THREE.PMREMGenerator(R).fromScene(env, 0.04).texture;
    scene.add(new THREE.HemisphereLight("#8FA8FF", "#1A1030", 0.6));
    const key = new THREE.DirectionalLight("#FFE2B8", 2.2); key.position.set(4, 6, 3); scene.add(key);
    const rim = new THREE.DirectionalLight("#4FE3FF", 2.0); rim.position.set(-5, 3, -6); scene.add(rim);
    buildDust(); buildPhone(); buildWafer(); buildHBM(); buildDC();
  }

  // ---------- debu cahaya (kedalaman) ----------
  function buildDust() {
    const r = rng(21), n = 500, pos = new Float32Array(n * 3);
    for (let i = 0; i < n; i++) { pos[i * 3] = (r() - 0.5) * 30; pos[i * 3 + 1] = r() * 9 - 1; pos[i * 3 + 2] = (r() - 0.5) * 30 - 4; }
    const g = new THREE.BufferGeometry(); g.setAttribute("position", new THREE.BufferAttribute(pos, 3));
    S.dust = new THREE.Points(g, new THREE.PointsMaterial({ color: new THREE.Color("#8FB4FF").multiplyScalar(1.4), size: 0.035, transparent: true, opacity: 0.7, toneMapped: false }));
    scene.add(S.dust);
  }

  // ---------- HP 3D (tanpa merek) ----------
  function rounded(w, h, r) { const s = new THREE.Shape(), x = -w / 2, y = -h / 2;
    s.moveTo(x + r, y); s.lineTo(x + w - r, y); s.quadraticCurveTo(x + w, y, x + w, y + r); s.lineTo(x + w, y + h - r); s.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
    s.lineTo(x + r, y + h); s.quadraticCurveTo(x, y + h, x, y + h - r); s.lineTo(x, y + r); s.quadraticCurveTo(x, y, x + r, y); return s; }
  function screenTex() {
    const c = document.createElement("canvas"); c.width = 512; c.height = 1080; const g = c.getContext("2d");
    const gr = g.createLinearGradient(0, 0, 512, 1080); gr.addColorStop(0, "#2B3FA8"); gr.addColorStop(0.55, "#7A3FB0"); gr.addColorStop(1, "#E0607E"); g.fillStyle = gr; g.fillRect(0, 0, 512, 1080);
    for (let i = 0; i < 6; i++) { g.fillStyle = `rgba(255,255,255,${0.05 + i * 0.01})`; g.beginPath(); g.arc(80 + i * 90, 300 + (i % 2) * 260, 120 + i * 20, 0, 6.283); g.fill(); }
    g.fillStyle = "#FFFFFF"; g.font = "700 110px Inter, Arial"; g.textAlign = "center"; g.fillText("09.41", 256, 230); g.font = "600 30px Inter, Arial"; g.fillText("Senin, 9 November", 256, 285);
    const cols = ["#FFB547", "#3FD8C8", "#FF6F91", "#4DA3FF", "#5BD68A", "#8F7CFF", "#FFD66B", "#5FD3F3", "#FF8F6B", "#A7E36B", "#F48FD0", "#7FA8FF"];
    for (let i = 0; i < 12; i++) { const x = 56 + (i % 4) * 106, y = 560 + Math.floor(i / 4) * 130; g.fillStyle = cols[i]; g.beginPath(); g.roundRect(x, y, 84, 84, 22); g.fill();
      g.fillStyle = "rgba(255,255,255,0.85)"; g.beginPath(); g.arc(x + 42, y + 42, 18, 0, 6.283); g.fill(); }
    g.fillStyle = "rgba(255,255,255,0.18)"; g.beginPath(); g.roundRect(36, 960, 440, 96, 40); g.fill();
    const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; return t;
  }
  function buildPhone() {
    const P = S.phone = new THREE.Group(); scene.add(P);
    const w = 0.76, h = 1.62, r = 0.12, d = 0.07;
    const body = new THREE.Mesh(new THREE.ExtrudeGeometry(rounded(w, h, r), { depth: d, bevelEnabled: true, bevelThickness: 0.025, bevelSize: 0.022, bevelSegments: 5, curveSegments: 24 }),
      new THREE.MeshPhysicalMaterial({ color: "#26305E", metalness: 0.85, roughness: 0.22, clearcoat: 1, clearcoatRoughness: 0.08, envMapIntensity: 1.6 }));
    body.position.z = -d / 2; P.add(body);
    const glass = new THREE.Mesh(new THREE.ShapeGeometry(rounded(w - 0.03, h - 0.03, r - 0.015), 24), new THREE.MeshBasicMaterial({ color: "#05070F" })); glass.position.z = d / 2 + 0.026; P.add(glass);
    const scr = new THREE.Mesh(new THREE.ShapeGeometry(rounded(w - 0.07, h - 0.07, r - 0.04), 24), new THREE.MeshBasicMaterial({ map: screenTex(), toneMapped: false }));
    // pemetaan UV layar ke tekstur penuh
    const uv = scr.geometry.attributes.uv, pos = scr.geometry.attributes.position; for (let i = 0; i < uv.count; i++) uv.setXY(i, pos.getX(i) / (w - 0.07) + 0.5, pos.getY(i) / (h - 0.07) + 0.5);
    scr.position.z = d / 2 + 0.028; P.add(scr); S.phoneScreen = scr;
    const isl = new THREE.Mesh(new THREE.ShapeGeometry(rounded(0.16, 0.04, 0.02), 12), new THREE.MeshBasicMaterial({ color: "#000000" })); isl.position.set(0, h / 2 - 0.09, d / 2 + 0.03); P.add(isl);
    const camBlock = new THREE.Mesh(new THREE.ExtrudeGeometry(rounded(0.3, 0.3, 0.07), { depth: 0.02, bevelEnabled: true, bevelThickness: 0.01, bevelSize: 0.01, bevelSegments: 3 }),
      new THREE.MeshPhysicalMaterial({ color: "#1A2148", metalness: 0.9, roughness: 0.15, clearcoat: 1 })); camBlock.position.set(-0.17, 0.55, -d / 2 - 0.045); camBlock.rotation.y = Math.PI; P.add(camBlock);
    [[-0.1, 0.62], [-0.24, 0.62], [-0.1, 0.48]].forEach(([x, y]) => { const l = new THREE.Mesh(new THREE.CylinderGeometry(0.045, 0.045, 0.03, 32), new THREE.MeshPhysicalMaterial({ color: "#05070F", metalness: 1, roughness: 0.05, clearcoat: 1 })); l.rotation.x = Math.PI / 2; l.position.set(x, y, -d / 2 - 0.07); P.add(l); });
    // cahaya layar untuk pass bloom: bidang redup tepat di belakang layar
    const halo = new THREE.Mesh(new THREE.ShapeGeometry(rounded(w - 0.1, h - 0.1, r - 0.05), 12), glowMat("#6F7CFF", 0.16)); halo.position.z = d / 2 + 0.027; halo.layers.set(GLOW); P.add(halo);
  }

  // ---------- wafer ----------
  const WR = 3, DS = 0.2, GAP = 0.025; let dies = [], dieMesh, dieGeo, dieMat, pickIdx = [], sparks = [];
  const tmp = new THREE.Object3D(), hue = new THREE.Color();
  function buildWafer() {
    const G = S.wafer = new THREE.Group(); scene.add(G);
    const waferMat = new THREE.MeshPhysicalMaterial({ color: "#8E9AC0", metalness: 1, roughness: 0.1, iridescence: 1, iridescenceIOR: 2.0, iridescenceThicknessRange: [120, 1200], clearcoat: 0.8, clearcoatRoughness: 0.05, envMapIntensity: 1.8 });
    G.add(new THREE.Mesh(new THREE.CylinderGeometry(WR, WR, 0.05, 160), waferMat));
    const notch = new THREE.Mesh(new THREE.BoxGeometry(0.25, 0.06, 0.2), new THREE.MeshStandardMaterial({ color: "#070B24" })); notch.position.set(0, 0, WR - 0.05); G.add(notch);
    for (let i = -14; i <= 14; i++) for (let j = -14; j <= 14; j++) { const x = i * (DS + GAP), z = j * (DS + GAP); if (Math.hypot(Math.abs(x) + DS / 2, Math.abs(z) + DS / 2) < WR - 0.12) dies.push([x, z]); }
    dieMat = new THREE.MeshPhysicalMaterial({ color: "#FFFFFF", metalness: 0.7, roughness: 0.2, iridescence: 1, iridescenceIOR: 2.2, iridescenceThicknessRange: [100, 1300], envMapIntensity: 1.8 });
    dieGeo = new THREE.BoxGeometry(DS, 0.03, DS); dieMesh = new THREE.InstancedMesh(dieGeo, dieMat, dies.length); G.add(dieMesh);
    const r0 = rng(11); while (pickIdx.length < 8) { const k = Math.floor(r0() * dies.length); const [x, z] = dies[k]; if (Math.hypot(x, z) < 2.0 && !pickIdx.includes(k)) pickIdx.push(k); }
    const sg = new THREE.PlaneGeometry(0.045, 0.045), r1 = rng(5);
    for (let k = 0; k < 90; k++) { const [x, z] = dies[Math.floor(r1() * dies.length)]; const m = new THREE.Mesh(sg, glowMat("#FFFFFF", 2)); m.rotation.x = -Math.PI / 2; m.position.set(x + (r1() - 0.5) * 0.2, 0.05, z + (r1() - 0.5) * 0.2); m.layers.enable(GLOW); m.userData.ph = r1() * 20; m.userData.sp = 0.5 + r1() * 1.5; G.add(m); sparks.push(m); }
    setDies(-1);
  }
  function rainbow(t) { dies.forEach(([x, z], k) => { const h = (0.55 + x * 0.07 + z * 0.045 + t * 0.03) % 1; const band = Math.exp(-Math.pow((x * 0.8 - z * 0.6) - lerp(-4, 4, (t * 0.22) % 1.4), 2) * 1.2);
    hue.setHSL(h, 0.55, 0.42 + 0.25 * band); dieMesh.setColorAt(k, hue); }); dieMesh.instanceColor.needsUpdate = true; }
  function setDies(hidden) { dies.forEach(([x, z], k) => { const i = pickIdx.indexOf(k); tmp.position.set(x, 0.04, z); tmp.rotation.set(0, 0, 0); tmp.scale.setScalar(i >= 0 && i < hidden ? 0.0001 : 1); tmp.updateMatrix(); dieMesh.setMatrixAt(k, tmp.matrix); }); dieMesh.instanceMatrix.needsUpdate = true; }
  function waferAnim(t, spin = 0.08) { S.wafer.rotation.y = t * spin; rainbow(t);
    sparks.forEach(m => { const v = Math.max(0, Math.sin(t * m.userData.sp * 3 + m.userData.ph)); m.scale.setScalar(0.3 + v * v * 1.4); m.visible = v > 0.2; }); }

  // ---------- tumpukan HBM + chip AI ----------
  const STACK = new THREE.Vector3(5.2, 0, -0.6); let flyers = [], edges = [], edgeMat, tsvs = [], tsvMat, pkts = [], gpuCore;
  function buildHBM() {
    const B = S.hbm = new THREE.Group(); B.position.copy(STACK); scene.add(B);
    const inter = new THREE.Mesh(new THREE.BoxGeometry(3.4, 0.08, 1.6), new THREE.MeshStandardMaterial({ color: "#1B244E", metalness: 0.4, roughness: 0.5 })); inter.position.set(0.9, -0.04, 0); B.add(inter);
    const gpu = new THREE.Mesh(new THREE.BoxGeometry(1.2, 0.12, 1.2), new THREE.MeshPhysicalMaterial({ color: "#2A3060", metalness: 0.6, roughness: 0.3, clearcoat: 1 })); gpu.position.set(1.6, 0.06, 0); B.add(gpu);
    gpuCore = new THREE.Mesh(new THREE.BoxGeometry(0.7, 0.13, 0.7), glowMat("#3FE0D0", 0)); gpuCore.position.set(1.6, 0.07, 0); gpuCore.layers.enable(GLOW); B.add(gpuCore);
    S.flyers = new THREE.Group(); scene.add(S.flyers);
    flyers = pickIdx.map(() => { const m = new THREE.Mesh(dieGeo.clone(), dieMat.clone()); m.scale.set(2.7, 2.6, 2.7); S.flyers.add(m); return m; });
    edgeMat = glowMat("#4FE3FF", 0);
    edges = flyers.map(() => { const e = new THREE.Mesh(new THREE.BoxGeometry(DS * 2.74, 0.012, DS * 2.74), edgeMat); e.layers.enable(GLOW); S.flyers.add(e); return e; });
    tsvMat = glowMat("#7CF0FF", 0);
    for (let a = 0; a < 4; a++) { const m = new THREE.Mesh(new THREE.CylinderGeometry(0.018, 0.018, 1, 8), tsvMat); m.layers.enable(GLOW); m.position.set((a % 2 ? 0.14 : -0.14), 0, (a < 2 ? 0.14 : -0.14)); B.add(m); tsvs.push(m); }
    for (let k = 0; k < 14; k++) { const m = new THREE.Mesh(new THREE.SphereGeometry(0.035, 10, 8), glowMat("#FFC46B", 3)); m.layers.enable(GLOW); B.add(m); pkts.push(m); }
  }
  // C: {lift0, landStep, lands[8], stackGlow}; t = waktu lokal yang sama dengan C
  function hbmAnim(t, C) {
    S.wafer.visible = S.hbm.visible = S.flyers.visible = true;
    let lifted = 0;
    flyers.forEach((m, i) => {
      const [x, z] = dies[pickIdx[i]], t0 = C.lift0 + i * C.landStep * 0.55, t1 = C.lands[i];
      const vis = t >= t0; m.visible = edges[i].visible = vis; if (!vis) return; lifted = i + 1;
      // posisi keping di dunia: wafer berputar, jadi titik asal ikut diputar
      const a = S.wafer.rotation.y, sx = x * Math.cos(a) + z * Math.sin(a), sz = -x * Math.sin(a) + z * Math.cos(a);
      const u = clamp((t - t0) / (t1 - t0)), e = eio(u), ey = 0.12 + i * 0.105;
      const px = lerp(sx, STACK.x, e), pz = lerp(sz, STACK.z, e), py = lerp(0.06, ey, e) + Math.sin(Math.PI * u) * (1.6 + i * 0.06);
      const land = t > t1 ? spring(t - t1, 18, 0.35) : 1, bounce = t > t1 ? (1 - land) * 0.12 : 0;
      m.position.set(px, py - bounce, pz); if (u >= 1) m.rotation.set(0, 0, 0); else m.rotation.set(Math.sin(u * Math.PI) * 0.9, u * Math.PI * 2 * (i % 2 ? 1 : -1) * (1 - e), 0);
      edges[i].position.copy(m.position); edges[i].position.y += 0.035; edges[i].rotation.copy(m.rotation);
    });
    setDies(lifted);
    const landed = C.lands.filter(x => t >= x).length;
    edgeMat.color.set("#4FE3FF").multiplyScalar(0.9 * clamp((t - C.lift0) / 0.8));
    const g = clamp((t - C.stackGlow) / 1.0);
    tsvs.forEach(m => { m.visible = landed >= 8; m.scale.y = (0.105 * 8 + 0.1) * eout(g); m.position.y = 0.12 + m.scale.y / 2; });
    tsvMat.color.set("#7CF0FF").multiplyScalar(2.2 * g);
    gpuCore.material.color.set("#1C2860").lerp(new THREE.Color("#3FE0D0").multiplyScalar(2.4), clamp((t - C.stackGlow - 0.6) / 0.8));
    pkts.forEach((m, k) => { const u = ((t - C.stackGlow) * 0.9 + k / pkts.length) % 1; m.visible = t > C.stackGlow + 0.4; m.position.set(lerp(0.15, 1.6, u), 0.5 - 0.42 * u + Math.sin(u * Math.PI) * 0.25, (k % 3 - 1) * 0.18); });
  }
  function hbmDone() { hbmAnim(1e4, { lift0: 0, landStep: 0.1, lands: [0.1, .2, .3, .4, .5, .6, .7, .8], stackGlow: 1 }); }

  // ---------- pusat data ----------
  let leds = [];
  function buildDC() {
    const D = S.dc = new THREE.Group(); scene.add(D);
    const rackGeo = new THREE.BoxGeometry(1.0, 2.6, 1.3), rackMat = new THREE.MeshStandardMaterial({ color: "#121A40", metalness: 0.5, roughness: 0.45 });
    const ledGeo = new THREE.PlaneGeometry(0.7, 0.03), slotGeo = new THREE.PlaneGeometry(0.82, 0.012), slotMat = new THREE.MeshBasicMaterial({ color: "#05081A" });
    for (let row = -3; row <= 3; row++) for (let c = 0; c < 22; c++) {
      if (row === 0) continue; const x = STACK.x + 1 + row * 3.2, z = -6 - c * 1.6;
      const rk = new THREE.Mesh(rackGeo, rackMat); rk.position.set(x, 1.3, z); D.add(rk);
      const fx = x + (row < 0 ? 0.51 : -0.51), ry = row < 0 ? Math.PI / 2 : -Math.PI / 2;
      for (let L = 0; L < 12; L++) { const s = new THREE.Mesh(slotGeo, slotMat); s.position.set(fx + (row < 0 ? 0.001 : -0.001), 0.25 + L * 0.19, z); s.rotation.y = ry; D.add(s); }
      for (let L = 0; L < 6; L++) { const m = new THREE.Mesh(ledGeo, glowMat(L % 3 ? "#3FE0D0" : "#5B7CFF", 2.4)); m.position.set(fx + (row < 0 ? 0.003 : -0.003), 0.5 + L * 0.35, z); m.rotation.y = ry; m.layers.enable(GLOW); m.userData.ph = (c * 7 + L * 3 + row) % 11; D.add(m); leds.push(m); }
    }
    const fl = new THREE.Mesh(new THREE.PlaneGeometry(80, 80), new THREE.MeshStandardMaterial({ color: "#0A0E2A", metalness: 0.2, roughness: 0.85, envMapIntensity: 0.12 })); fl.rotation.x = -Math.PI / 2; fl.position.y = -0.06; scene.add(fl); S.floor = fl;
    const grid = new THREE.GridHelper(80, 50, "#22306A", "#18224F"); grid.position.y = -0.05; grid.material.transparent = true; grid.material.opacity = 0.35; scene.add(grid); S.grid = grid;
  }
  function dcAnim(t) { leds.forEach(m => { const v = 0.5 + 0.5 * Math.sin(t * 6 + m.userData.ph); m.scale.x = 0.4 + 0.6 * v; }); }

  // ---------- kamera ----------
  // keys: [[t, px, py, pz, lx, ly, lz], …] diinterpolasi eio
  function camPath(keys, t) {
    let i = 0; while (i < keys.length - 2 && t > keys[i + 1][0]) i++;
    const a = keys[i], b = keys[Math.min(i + 1, keys.length - 1)], u = b[0] > a[0] ? eio((t - a[0]) / (b[0] - a[0])) : 1;
    cam.position.set(lerp(a[1], b[1], u), lerp(a[2], b[2], u), lerp(a[3], b[3], u)); cam.lookAt(lerp(a[4], b[4], u), lerp(a[5], b[5], u), lerp(a[6], b[6], u));
  }

  // ---------- render + komposit ----------
  function render(ctx, t, setup) {
    if (!R) init();
    ["phone", "wafer", "hbm", "flyers", "dc", "floor", "grid"].forEach(k => S[k].visible = false); S.dust.visible = true;
    S.dust.rotation.y = t * 0.01;
    setup(S, cam);
    cam.layers.set(GLOW); scene.background = new THREE.Color("#000000"); const fog = scene.fog; scene.fog = null;
    R.render(scene, cam); gctx.clearRect(0, 0, W / 2, HH / 2); gctx.drawImage(glc, 0, 0, W / 2, HH / 2);
    cam.layers.enableAll(); scene.background = BG; scene.fog = fog;
    R.render(scene, cam);
    ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.globalCompositeOperation = "source-over"; ctx.drawImage(glc, 0, 0);
    ctx.globalCompositeOperation = "lighter";
    ctx.filter = "blur(10px)"; ctx.globalAlpha = 0.9; ctx.drawImage(glowBuf, 0, 0, W, HH);
    ctx.filter = "blur(36px)"; ctx.globalAlpha = 0.7; ctx.drawImage(glowBuf, 0, 0, W, HH);
    ctx.restore();
  }
  // proyeksi titik dunia ke piksel layar (untuk menempel label 2D pada benda 3D)
  function project(x, y, z) { const v = new THREE.Vector3(x, y, z).project(cam); return [(v.x + 1) / 2 * W, (1 - v.y) / 2 * HH, v.z < 1]; }

  K.g3d = { render, camPath, waferAnim, hbmAnim, hbmDone, dcAnim, project, STACK, spring, get ok() { return true; } };
})(typeof window !== "undefined" ? window : globalThis);
