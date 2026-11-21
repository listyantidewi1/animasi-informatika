/* D08 — kota neon 3D (three.js r158, vendor/three.min.js). Dipakai untuk kartu bab gaya game dan beberapa shot pembuka.
   K.kota3d.draw(ctx, t, opt) merender kota (deterministik dari waktu) di 960×540, lalu menempelkannya ke kanvas 2D 1920×1080
   dengan lapisan cahaya (blur + "lighter") sebagai pengganti bloom. Semua benda dibuat dengan kode, tanpa aset luar.
   opt: z (maju kamera, satuan dunia; bawaan t*6), dim (0..1 menggelapkan), bloom (bawaan 0.75), sway (goyang kamera). */
(function (global) {
  const K = global.Kiko; if (!K || typeof THREE === "undefined") return;
  const W = 1920, HH = 1080, RW = 960, RH = 540;
  function rng(seed) { let a = seed >>> 0; return () => { a += 0x6D2B79F5; let t = a; t = Math.imul(t ^ t >>> 15, t | 1); t ^= t + Math.imul(t ^ t >>> 7, t | 61); return ((t ^ t >>> 14) >>> 0) / 4294967296; }; }
  let R = null, scene, cam, glc, gl2, g2, blocks = [], LEN = 240;

  function skyTex() {
    const c = document.createElement("canvas"); c.width = 8; c.height = 512; const g = c.getContext("2d"), gr = g.createLinearGradient(0, 0, 0, 512);
    gr.addColorStop(0, "#0E0628"); gr.addColorStop(0.5, "#5A1660"); gr.addColorStop(0.78, "#C2366E"); gr.addColorStop(1, "#FF8A5C");
    g.fillStyle = gr; g.fillRect(0, 0, 8, 512); const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; return t;
  }
  function sunTex() {
    const c = document.createElement("canvas"); c.width = c.height = 512; const s = c.getContext("2d");
    s.beginPath(); s.arc(256, 256, 250, 0, 6.2832); s.clip();
    const sg = s.createLinearGradient(0, 0, 0, 512); sg.addColorStop(0, "#FFE58A"); sg.addColorStop(0.6, "#FF7A6B"); sg.addColorStop(1, "#FF3D8F");
    s.fillStyle = sg; s.fillRect(0, 0, 512, 512); s.globalCompositeOperation = "destination-out";
    for (let i = 0; i < 8; i++) s.fillRect(0, 270 + i * 30, 512, 5 + i * 3.2);
    const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; return t;
  }
  function init() {
    glc = document.createElement("canvas"); glc.width = RW; glc.height = RH;
    gl2 = document.createElement("canvas"); gl2.width = RW / 2; gl2.height = RH / 2; g2 = gl2.getContext("2d");
    R = new THREE.WebGLRenderer({ canvas: glc, antialias: true, preserveDrawingBuffer: true });
    R.setSize(RW, RH, false); R.setPixelRatio(1); R.outputColorSpace = THREE.SRGBColorSpace;
    scene = new THREE.Scene(); scene.background = skyTex(); scene.fog = new THREE.Fog("#3A0F4D", 40, 175);
    cam = new THREE.PerspectiveCamera(52, RW / RH, 0.1, 400);
    const sun = new THREE.Mesh(new THREE.PlaneGeometry(90, 90), new THREE.MeshBasicMaterial({ map: sunTex(), transparent: true, fog: false, depthWrite: false }));
    sun.position.set(0, 20, -260); sun.renderOrder = -1; scene.add(sun); scene.userData.sun = sun;
    // lantai gelap + kisi neon (dua salinan supaya bisa digulung tanpa putus)
    const floor = new THREE.Mesh(new THREE.PlaneGeometry(600, 900), new THREE.MeshBasicMaterial({ color: "#0A0418" }));
    floor.rotation.x = -Math.PI / 2; floor.position.set(0, -0.03, -300); scene.add(floor);
    const grid = new THREE.GridHelper(240, 48, "#FF4FD8", "#FF4FD8"); grid.material.transparent = true; grid.material.opacity = 0.55;
    const grid2 = grid.clone(); scene.add(grid, grid2); scene.userData.grid = [grid, grid2];
    // gedung bertepi neon di kiri-kanan jalan, diulang setiap LEN satuan
    const r = rng(7), cols = ["#33F0FF", "#FF4FD8", "#FFB547"];
    for (let i = 0; i < 70; i++) {
      const side = i % 2 ? 1 : -1, h = 5 + r() * 26, w = 4 + r() * 6, d = 4 + r() * 6, x = side * (11 + r() * 34), z = -r() * LEN;
      const geo = new THREE.BoxGeometry(w, h, d);
      const m = new THREE.Mesh(geo, new THREE.MeshBasicMaterial({ color: "#150A2C" }));
      const e = new THREE.LineSegments(new THREE.EdgesGeometry(geo), new THREE.LineBasicMaterial({ color: cols[Math.floor(r() * 3)] }));
      // pita jendela menyala
      const win = new THREE.Mesh(new THREE.PlaneGeometry(w * 0.7, 0.35), new THREE.MeshBasicMaterial({ color: r() < 0.5 ? "#FFD38A" : "#7FE8FF" }));
      win.position.set(0, h * (0.2 + r() * 0.5) - h / 2, d / 2 + 0.02);
      const grp = new THREE.Group(); grp.add(m, e, win); grp.position.set(x, h / 2, z); scene.add(grp); blocks.push({ grp, z0: z });
    }
    // pohon palem sederhana (siluet) di tepi jalan
    const trunkM = new THREE.MeshBasicMaterial({ color: "#12061F" });
    for (let i = 0; i < 16; i++) {
      const side = i % 2 ? 1 : -1, z = -i * (LEN / 16), x = side * 8.5, grp = new THREE.Group();
      const tr = new THREE.Mesh(new THREE.CylinderGeometry(0.18, 0.3, 9, 6), trunkM); tr.position.y = 4.5; tr.rotation.z = side * 0.08; grp.add(tr);
      for (let k = 0; k < 7; k++) { const leaf = new THREE.Mesh(new THREE.ConeGeometry(0.5, 4.2, 4), trunkM); leaf.position.set(0, 9, 0);
        leaf.rotation.z = Math.PI / 2 + (k - 3) * 0.35; leaf.rotation.y = k * 0.9; leaf.translateY(1.8); grp.add(leaf); }
      grp.position.set(x, 0, z); scene.add(grp); blocks.push({ grp, z0: z });
    }
  }
  function draw(ctx, t, opt = {}) {
    if (!R) init();
    const z = opt.z == null ? t * 6 : opt.z, sway = opt.sway == null ? 1 : opt.sway;
    // gulung dunia: setiap benda dipindah ke depan kamera secara melingkar (deterministik)
    blocks.forEach(o => { const u = (((o.z0 + z + LEN - 12) % LEN) + LEN) % LEN; o.grp.position.z = u - LEN + 12; });
    const g = scene.userData.grid, gz = (z % 5); g[0].position.set(0, 0, -100 + gz); g[1].position.set(0, 0, -320 + gz);
    cam.position.set(Math.sin(t * 0.25) * 0.8 * sway, 4.2 + Math.sin(t * 0.4) * 0.25 * sway, 10);
    cam.lookAt(0, 6.5, -60); cam.rotation.z = Math.sin(t * 0.3) * 0.015 * sway;
    R.render(scene, cam);
    ctx.save(); const A0 = ctx.globalAlpha; ctx.imageSmoothingEnabled = true; ctx.drawImage(glc, 0, 0, W, HH);
    const bl = opt.bloom == null ? 0.75 : opt.bloom;
    if (bl > 0) { g2.clearRect(0, 0, gl2.width, gl2.height); g2.filter = "blur(5px) brightness(1.2)"; g2.drawImage(glc, 0, 0, gl2.width, gl2.height); g2.filter = "none";
      ctx.globalCompositeOperation = "lighter"; ctx.globalAlpha = A0 * bl * 0.55; ctx.drawImage(gl2, 0, 0, W, HH); ctx.globalCompositeOperation = "source-over"; ctx.globalAlpha = A0; }
    if (opt.dim) { ctx.fillStyle = `rgba(8,3,22,${opt.dim})`; ctx.fillRect(0, 0, W, HH); }
    ctx.restore();
  }
  K.kota3d = { draw };
})(typeof window !== "undefined" ? window : globalThis);
