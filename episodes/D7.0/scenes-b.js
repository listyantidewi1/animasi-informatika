/* Adegan episode D7.0 bagian b: file, folder, save & cari, giliranmu. Muat setelah devices.js dan scenes.js. */
(function (global) {
  const K = global.Kiko, H = K.helpers, C = K.C, D = K.devices, SCENES = K.SCENES;
  const { text, para, card, kiko, kid, rr, ease, clamp, lerp } = H;
  const between = (u, a, b) => u >= a && u < b;
  const POEM = ["Ibu, pagi-pagi kau sudah bangun,", "menyiapkan bekal, menyapu halaman.", "Kasihmu hangat seperti matahari."];
  const MESSY = Array.from({ length: 40 }, (_, i) => ["foto", "tulisan", "lagu", "video"][(i * 7 + 3) % 4]);
  const SORT = Array.from({ length: 12 }, (_, i) => ["tulisan", "foto", "lagu"][(i * 5 + 1) % 3]);

  // ---------- file ----------
  Object.assign(SCENES, {
    file_intro(ctx, b, l) {
      card(ctx, 120, 150, 1680, 740);
      kid(ctx, 330, 560, 200, { hair: "long" }); text(ctx, "Sinta", 330, 820, 30, { align: "center", color: C.ink2, weight: 700 });
      const sc = D.phone(ctx, 600, 500, 230, 420);
      // bidikan kamera: lapangan dan tenda pramuka
      ctx.fillStyle = "#BEE3F5"; rr(ctx, sc.x + 14, sc.y + 40, sc.w - 28, sc.h - 120, 14); ctx.fill();
      ctx.fillStyle = "#6DBE6D"; ctx.fillRect(sc.x + 14, sc.y + 210, sc.w - 28, sc.h - 290);
      [[sc.x + 60, 0.9], [sc.x + 150, 1.1]].forEach(([tx, k]) => { ctx.fillStyle = "#C98A57"; ctx.beginPath(); ctx.moveTo(tx - 45 * k, sc.y + 230); ctx.lineTo(tx, sc.y + 160); ctx.lineTo(tx + 45 * k, sc.y + 230); ctx.closePath(); ctx.fill(); });
      ctx.fillStyle = "#fff"; ctx.beginPath(); ctx.arc(sc.x + sc.w / 2, sc.y + sc.h - 45, 26, 0, Math.PI * 2); ctx.fill(); ctx.strokeStyle = "#B7C4CC"; ctx.lineWidth = 4; ctx.stroke();
      const flash = between(l, 1.4, 1.75); if (flash) { ctx.fillStyle = `rgba(255,255,255,${1 - (l - 1.4) / 0.35})`; rr(ctx, sc.x, sc.y, sc.w, sc.h, 26); ctx.fill(); }
      // foto terbang menjadi file
      if (l >= 1.7) {
        const k = ease(clamp((l - 1.9) / 1.6, 0, 1)); const x = lerp(600, 1320, k), y = lerp(430, 470, k) - Math.sin(k * Math.PI) * 120;
        if (k < 1) { ctx.fillStyle = "#BEE3F5"; rr(ctx, x - 70, y - 50, 140, 100, 10); ctx.fill(); ctx.fillStyle = "#6DBE6D"; ctx.fillRect(x - 70, y + 10, 140, 40); ctx.strokeStyle = "#fff"; ctx.lineWidth = 6; rr(ctx, x - 70, y - 50, 140, 100, 10); ctx.stroke(); }
        else { D.fileIcon(ctx, 1320, 470, 150, "foto", { name: "foto pramuka", size: 30 }); }
        if (k >= 1) { card(ctx, 1080, 660, 480, 110, { fill: "#FFF3D6", stroke: C.accent, lw: 4 }); text(ctx, "file (berkas)", 1320, 712, 40, { align: "center", weight: 900 }); text(ctx, "satu benda digital yang disimpan", 1320, 752, 26, { align: "center", color: C.ink2, weight: 700 }); }
      }
    },
    file_types(ctx, b, l) {
      card(ctx, 120, 150, 1680, 740);
      text(ctx, "JENIS FILE", 960, 230, 34, { align: "center", color: C.accentDark, weight: 800 });
      const items = [["foto", "foto pramuka", "Foto"], ["tulisan", "Puisi Ibu", "Tulisan"], ["lagu", "lagu sekolah", "Lagu"], ["video", "video pentas", "Video"]];
      const show = clamp(Math.floor((l - 0.8) / 1.1) + 1, 1, 4);
      items.forEach(([k, n, t], i) => { if (i >= show) return; const x = 330 + i * 420; card(ctx, x - 170, 300, 340, 500, { fill: C.bg2 }); text(ctx, t, x, 360, 36, { align: "center", weight: 900 }); D.fileIcon(ctx, x, 540, 150, k, { name: n, size: 30 }); });
    },
    file_name(ctx, b, l) {
      card(ctx, 120, 150, 1680, 740);
      D.fileIcon(ctx, 480, 500, 200, "tulisan", {});
      text(ctx, "Nama file:", 900, 400, 34, { color: C.ink2, weight: 800 });
      const n = clamp(Math.floor((l - 1.2) / 0.14), 0, 14); D.textBox(ctx, 900, 430, 760, 110, ["Puisi Ibu Dito".slice(0, n)], l, { size: 48 });
      if (n >= 14) { text(ctx, "Puisi Ibu Dito", 480, 650, 36, { align: "center", weight: 800 }); D.note(ctx, 900, 640, 760, "nama diberi oleh kamu, supaya mudah dicari", { size: 30 }); }
    },
    file_name_bad(ctx, b, l) {
      card(ctx, 120, 150, 1680, 740);
      [["asdf", C.bad, "✕ tidak menceritakan isinya", C.badBg, 440], ["Puisi Ibu Dito", C.good, "✓ jelas, mudah diingat", C.goodBg, 1480]].forEach(([n, col, note, bg, x], i) => {
        if (i === 1 && l < 1.2) return;
        card(ctx, x - 300, 230, 600, 540, { fill: bg, stroke: col, lw: 5 }); D.fileIcon(ctx, x, 420, 150, "tulisan", {}); text(ctx, n, x, 560, 44, { align: "center", weight: 900 }); text(ctx, note, x, 700, 30, { align: "center", weight: 800, color: col });
      });
      if (l > 3.2) { card(ctx, 560, 790, 800, 80, { fill: "#FFF3D6", stroke: C.accent, lw: 4 }); text(ctx, "Minggu depan, mana yang kamu ingat?", 960, 842, 34, { align: "center", weight: 900 }); }
    }
  });

  // ---------- folder ----------
  Object.assign(SCENES, {
    folder_messy(ctx, b, l) {
      const win = D.windowFrame(ctx, 150, 150, 1130, 720, "Dokumen", { path: "Dokumen" });
      const show = clamp(Math.floor((l - 0.4) / 0.08) + 1, 0, 40);
      MESSY.forEach((k, i) => { if (i >= show) return; const r = Math.floor(i / 8), c = i % 8; D.fileIcon(ctx, win.x + 70 + c * 128, win.y + 60 + r * 118, 70, k, {}); });
      kid(ctx, 1560, 540, 190, {}); text(ctx, "Dito", 1560, 790, 30, { align: "center", color: C.ink2, weight: 700 });
      if (show >= 40) { H.bubble(ctx, 1380, 330, 360, "Tugas yang mana, ya?", 32, { tailX: 1520, tailDir: 20, fill: C.badBg, stroke: C.bad, color: C.bad }); }
      D.note(ctx, 1320, 820, 480, show >= 40 ? "40 file campur aduk" : "file: " + show, { size: 32, h: 70 });
    },
    folder_intro(ctx, b, l) {
      card(ctx, 120, 150, 1680, 740);
      // lemari kelas dengan tiga map
      ctx.fillStyle = "#C98A57"; rr(ctx, 230, 260, 560, 540, 18); ctx.fill(); ctx.fillStyle = "#A4653A"; rr(ctx, 250, 280, 520, 500, 12); ctx.fill();
      ["Tugas", "Foto", "Lagu"].forEach((n, i) => { const x = 290 + i * 160; ctx.fillStyle = ["#F2B134", "#5FA8D3", "#8E6BBF"][i]; rr(ctx, x, 330, 130, 400, 10); ctx.fill(); ctx.fillStyle = "#fff"; rr(ctx, x + 25, 430, 80, 150, 8); ctx.fill(); ctx.save(); ctx.translate(x + 65, 505); ctx.rotate(-Math.PI / 2); text(ctx, n, 0, 10, 30, { align: "center", weight: 900 }); ctx.restore(); });
      text(ctx, "map di lemari kelas", 510, 850, 32, { align: "center", color: C.ink2, weight: 800 });
      text(ctx, "=", 960, 560, 90, { align: "center", weight: 900, color: C.accentDark });
      D.fileIcon(ctx, 1400, 500, 260, "folder", {}); text(ctx, "folder", 1400, 700, 48, { align: "center", weight: 900 });
      text(ctx, "wadah untuk file", 1400, 760, 32, { align: "center", color: C.ink2, weight: 800 });
      if (l > 3) D.note(ctx, 1100, 800, 600, "satu map untuk satu urusan", { size: 32, h: 70 });
    },
    folder_sort(ctx, b, l) {
      const win = D.windowFrame(ctx, 150, 150, 1130, 720, "Dokumen", { path: "Dokumen" });
      const folders = [["Tugas", "tulisan", win.x + 190], ["Foto", "foto", win.x + 560], ["Lagu", "lagu", win.x + 930]];
      const counts = [0, 0, 0];
      SORT.forEach((k, i) => {
        const t0 = 1.0 + i * 0.42, u = clamp((l - t0) / 0.5, 0, 1); const fi = ["tulisan", "foto", "lagu"].indexOf(k);
        const fx = win.x + 100 + (i % 6) * 150, fy = win.y + 420 + Math.floor(i / 6) * 100; const tx = folders[fi][2], ty = win.y + 120;
        if (u >= 1) { counts[fi]++; return; }
        const kk = ease(u); D.fileIcon(ctx, lerp(fx, tx, kk), lerp(fy, ty, kk) - Math.sin(kk * Math.PI) * 60, 64, k, {});
      });
      folders.forEach(([n, , x], i) => { D.fileIcon(ctx, x, win.y + 110, 130, "folder", { name: n, size: 30 }); if (counts[i]) { ctx.fillStyle = C.good; ctx.beginPath(); ctx.arc(x + 60, win.y + 50, 28, 0, Math.PI * 2); ctx.fill(); text(ctx, String(counts[i]), x + 60, win.y + 61, 28, { align: "center", color: "#fff", weight: 900 }); } });
      kid(ctx, 1560, 540, 190, { point: true });
      D.note(ctx, 1320, 820, 480, counts[0] + counts[1] + counts[2] >= 12 ? "rapi! ✓" : "drag ke foldernya…", { size: 32, h: 70, fill: counts[0] + counts[1] + counts[2] >= 12 ? C.goodBg : "#FFF3D6", stroke: counts[0] + counts[1] + counts[2] >= 12 ? C.good : C.accent });
    },
    folder_nest(ctx, b, l) {
      const phase = l < 2.2 ? 0 : l < 4.8 ? 1 : 2;
      const path = ["Dokumen", "Dokumen › Tugas", "Dokumen › Tugas › Informatika"][phase];
      const win = D.windowFrame(ctx, 150, 150, 1000, 720, "Dokumen", { path });
      const items = [[["folder", "Tugas", true], ["folder", "Foto"], ["folder", "Lagu"]], [["folder", "Informatika", true], ["folder", "Matematika"]], [["tulisan", "tugas 1"], ["foto", "denah kelas"]]][phase];
      items.forEach(([k, n, hl], i) => D.fileIcon(ctx, win.x + 150 + i * 240, win.y + 140, 120, k, { name: n, size: 28, selected: !!hl, open: !!hl && k === "folder" }));
      // pohon folder di kanan
      card(ctx, 1230, 150, 560, 720, { fill: C.bg2 });
      text(ctx, "JALANNYA", 1510, 220, 30, { align: "center", color: C.accentDark, weight: 800 });
      const tree = [["Dokumen", 0, 0], ["Tugas", 1, 1], ["Informatika", 2, 2], ["Matematika", 2, -1], ["Foto", 1, -1], ["Lagu", 1, -1]];
      tree.forEach(([n, depth, ph], i) => { const y = 300 + i * 84, on = ph >= 0 && ph <= phase; card(ctx, 1280 + depth * 60, y - 36, 460 - depth * 60, 64, { fill: on ? "#FFF3D6" : C.panel, stroke: on ? C.accent : "#D7E2DC", lw: on ? 4 : 2 }); D.fileIcon(ctx, 1320 + depth * 60, y - 4, 40, i >= 2 && depth === 2 ? "folder" : "folder", {}); text(ctx, n, 1360 + depth * 60, y + 8, 28, { weight: on ? 900 : 700, color: on ? C.ink : C.ink2 }); });
      text(ctx, "folder di dalam folder", 1510, 840, 28, { align: "center", color: C.ink2, weight: 700 });
    }
  });

  // ---------- save & cari ----------
  function editor(ctx, x, y, w, h, title, lines, l, opt = {}) {
    const a = D.windowFrame(ctx, x, y, w, h, title);
    lines.forEach((ln, i) => text(ctx, ln, a.x + 24, a.y + 50 + i * 54, 34, { weight: 600, color: opt.color || C.ink }));
    return a;
  }
  Object.assign(SCENES, {
    save_intro(ctx, b, l) {
      const sc = D.monitor(ctx, 240, 170, 1000, 560);
      const n = clamp(Math.floor(l / 0.05), 0, 999); const typed = POEM.join("\n").slice(0, n).split("\n");
      editor(ctx, sc.x + 40, sc.y + 30, sc.w - 80, sc.h - 60, "Puisi Ibu — belum disimpan", typed, l);
      kid(ctx, 1500, 540, 200, {}); text(ctx, "Dito", 1500, 800, 30, { align: "center", color: C.ink2, weight: 700 });
      const off = clamp((l - 3.6) / 0.6, 0, 1);
      if (off > 0) { ctx.fillStyle = `rgba(20,28,32,${off})`; rr(ctx, sc.x, sc.y, sc.w, sc.h, 10); ctx.fill(); if (off >= 1) { text(ctx, "✕ tulisan hilang", sc.x + sc.w / 2, sc.y + sc.h / 2 + 15, 54, { align: "center", color: "#F07A72", weight: 900 }); } }
      D.note(ctx, 1300, 780, 500, off >= 1 ? "dimatikan sebelum disimpan" : "mengetik puisi…", { size: 30, h: 70, fill: off >= 1 ? C.badBg : "#FFF3D6", stroke: off >= 1 ? C.bad : C.accent });
    },
    save_dialog(ctx, b, l) {
      const sc = D.monitor(ctx, 240, 170, 1000, 560);
      editor(ctx, sc.x + 40, sc.y + 30, sc.w - 80, sc.h - 60, "Puisi Ibu", POEM, l, { color: C.muted });
      // dialog simpan
      const dx = sc.x + 160, dy = sc.y + 90, dw = 680, dh = 400; ctx.fillStyle = "rgba(31,42,51,0.25)"; rr(ctx, sc.x, sc.y, sc.w, sc.h, 10); ctx.fill();
      card(ctx, dx, dy, dw, dh, { stroke: C.kiko, lw: 4 }); text(ctx, "Simpan (save)", dx + dw / 2, dy + 50, 32, { align: "center", weight: 900 });
      text(ctx, "Nama:", dx + 40, dy + 120, 28, { weight: 800, color: C.ink2 });
      const n = clamp(Math.floor((l - 1.2) / 0.16), 0, 9); D.textBox(ctx, dx + 170, dy + 85, 460, 56, ["Puisi Ibu".slice(0, n)], l, { size: 30, cursor: n < 9 });
      text(ctx, "Folder:", dx + 40, dy + 210, 28, { weight: 800, color: C.ink2 });
      ["Tugas", "Foto", "Lagu"].forEach((f, i) => { const on = i === 0 && l > 3.4; card(ctx, dx + 170 + i * 155, dy + 175, 140, 56, { fill: on ? "#FFF3D6" : C.bg2, stroke: on ? C.accent : "#D7E2DC", lw: on ? 4 : 2 }); D.fileIcon(ctx, dx + 200 + i * 155, dy + 203, 30, "folder", {}); text(ctx, f, dx + 225 + i * 155, dy + 212, 26, { weight: 800 }); });
      const pressed = l > 5.0; card(ctx, dx + dw - 220, dy + dh - 90, 180, 60, { fill: pressed ? C.good : C.kiko }); text(ctx, pressed ? "✓ tersimpan" : "Simpan", dx + dw - 130, dy + dh - 50, 26, { align: "center", color: "#fff", weight: 900 });
      kid(ctx, 1500, 540, 200, { point: true });
      D.note(ctx, 1300, 780, 500, l > 5.0 ? "Puisi Ibu → folder Tugas" : l > 3.4 ? "di folder mana?" : "namanya apa?", { size: 30, h: 70 });
    },
    save_often(ctx, b, l) {
      const sc = D.monitor(ctx, 240, 170, 1000, 560);
      const a = editor(ctx, sc.x + 40, sc.y + 30, sc.w - 80, sc.h - 60, "Puisi Ibu", POEM.concat(["Terima kasih, Ibu."]), l);
      const pulse = (l % 2.0) < 0.5; card(ctx, a.x + a.w - 250, a.y + 10, 230, 50, { fill: pulse ? C.goodBg : C.panel, stroke: C.good, lw: 3 }); text(ctx, "tersimpan ✓", a.x + a.w - 135, a.y + 44, 26, { align: "center", color: C.good, weight: 900 });
      // lampu
      const dark = l > 3.6; ctx.fillStyle = dark ? "#9AAFA6" : "#FFE27A"; ctx.beginPath(); ctx.arc(1500, 400, 90, 0, Math.PI * 2); ctx.fill(); ctx.fillStyle = "#7B8B95"; rr(ctx, 1460, 480, 80, 60, 10); ctx.fill();
      if (!dark) { ctx.strokeStyle = "#F2B134"; ctx.lineWidth = 8; ctx.lineCap = "round"; for (let i = 0; i < 6; i++) { const ang = -Math.PI / 2 + (i - 2.5) * 0.45; ctx.beginPath(); ctx.moveTo(1500 + Math.cos(ang) * 115, 400 + Math.sin(ang) * 115); ctx.lineTo(1500 + Math.cos(ang) * 150, 400 + Math.sin(ang) * 150); ctx.stroke(); } }
      text(ctx, dark ? "mati lampu!" : "lampu menyala", 1500, 620, 36, { align: "center", weight: 900, color: dark ? C.bad : C.ink2 });
      if (dark) { ctx.fillStyle = "rgba(20,28,32,0.85)"; rr(ctx, sc.x, sc.y, sc.w, sc.h, 10); ctx.fill(); text(ctx, "tulisan aman, sudah tersimpan ✓", sc.x + sc.w / 2, sc.y + sc.h / 2 + 15, 44, { align: "center", color: "#5FCB8A", weight: 900 }); }
      D.note(ctx, 1300, 780, 500, "sering-sering save", { size: 32, h: 70 });
    },
    search_find(ctx, b, l) {
      const win = D.windowFrame(ctx, 150, 150, 1130, 720, "Dokumen");
      const n = clamp(Math.floor((l - 1.0) / 0.22), 0, 5); const typed = "Puisi".slice(0, n); const enter = between(l, 2.6, 3.1), found = l >= 2.9;
      text(ctx, "🔍", win.x + 20, win.y + 50, 30); D.textBox(ctx, win.x + 70, win.y + 10, 600, 60, [typed], l, { size: 32, stroke: C.kiko });
      card(ctx, win.x + 700, win.y + 10, 150, 60, { fill: enter ? C.accent : C.bg2 }); text(ctx, "Enter", win.x + 775, win.y + 50, 28, { align: "center", weight: 900, color: enter ? "#fff" : C.ink });
      if (found) { card(ctx, win.x + 20, win.y + 110, win.w - 40, 110, { fill: "#FFF3D6", stroke: C.accent, lw: 4 }); D.fileIcon(ctx, win.x + 90, win.y + 165, 70, "tulisan", {}); text(ctx, "Puisi Ibu Dito", win.x + 160, win.y + 155, 36, { weight: 900 }); text(ctx, "di: Dokumen › Tugas", win.x + 160, win.y + 200, 28, { weight: 700, color: C.ink2 }); }
      else if (n > 0) text(ctx, "mencari…", win.x + 40, win.y + 160, 30, { color: C.ink2, weight: 700 });
      kid(ctx, 1560, 540, 190, {});
      D.note(ctx, 1320, 820, 480, found ? "ketemu! ✓" : "ketik sebagian nama", { size: 32, h: 70, fill: found ? C.goodBg : "#FFF3D6", stroke: found ? C.good : C.accent });
    },
    make_show(ctx, b, l) {
      card(ctx, 160, 150, 1600, 740);
      text(ctx, "GILIRANMU", 960, 240, 34, { align: "center", color: C.accentDark, weight: 900 });
      const items = ["Tunjuk gerakan mouse", "Pilih tombol keyboard", "Susun file ke foldernya"];
      items.forEach((s, i) => {
        const x = 300 + i * 460; card(ctx, x - 170, 290, 400, 440, { fill: C.bg2 });
        ctx.fillStyle = C.kiko; ctx.beginPath(); ctx.arc(x - 120, 340, 28, 0, Math.PI * 2); ctx.fill(); text(ctx, String(i + 1), x - 120, 352, 30, { align: "center", color: "#fff", weight: 900 });
        if (i === 0) D.mouse(ctx, x + 30, 500, 120, { left: Math.floor(l) % 2 === 0, right: Math.floor(l) % 2 === 1 });
        if (i === 1) { ctx.fillStyle = "#F7FAFC"; rr(ctx, x - 90, 450, 240, 90, 14); ctx.fill(); ctx.strokeStyle = C.accent; ctx.lineWidth = 4; ctx.stroke(); text(ctx, "Backspace", x + 30, 508, 32, { align: "center", weight: 900 }); }
        if (i === 2) { D.fileIcon(ctx, x - 50, 500, 80, "foto", {}); H.arrowIcon(ctx, "east", x + 30, 500, 50, C.accentDark); D.fileIcon(ctx, x + 110, 500, 90, "folder", {}); }
        text(ctx, s, x + 30, 660, 32, { align: "center", weight: 800 });
      });
      text(ctx, "di halaman latihan episode ini", 960, 820, 34, { align: "center", color: C.ink2, weight: 700 });
    }
  });
})(typeof window !== "undefined" ? window : globalThis);
