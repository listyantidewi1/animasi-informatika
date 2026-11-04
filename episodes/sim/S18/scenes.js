/* S18 Simulasi praktik: perintah jaringan di Terminal (Command Prompt di Windows; catatan Linux/macOS).
   Jendela Terminal di kiri (x 110–1410, y 122–822), panel "empat perintah" dan label di kanan (x 1450–1820).
   Keluaran meniru format asli ipconfig/ping/tracert/nslookup (dipangkas seperlunya). Semua alamat dan nama rekaan:
   192.168.x.x, 10.x.x.x, 203.0.113.x, *.example. Muat setelah kiko-core.js, layar.js, layar_kode.js. */
(function (global) {
  const K = global.Kiko, H = K.helpers, C = K.C, L = K.layar, LK = K.layarKode;
  const { rr, text, para, card, kiko, ease, clamp, lerp } = H;
  const WIN = { x: 110, y: 122, w: 1300, h: 700 };
  const GREEN = C.good, RED = "#D9443B", BLUE = "#1A73C8";
  const SZ = 28;
  const spanOf = b => Math.max(3, (b.audio || b.dur) * 0.92);
  const ph = LK.phase;
  const blinkAt = l => Math.floor(l * 2.2) % 2 === 0;

  // ---------- keluaran perintah (format Windows) ----------
  const P = "C:\\Users\\siswa>";
  const cmd = t => ({ k: "cmd", t });
  const IPC = ["", "Ethernet adapter Ethernet:", "", "   Connection-specific DNS Suffix  . :",
    "   IPv4 Address. . . . . . . . . . . : 192.168.1.23", "   Subnet Mask . . . . . . . . . . . : 255.255.255.0",
    "   Default Gateway . . . . . . . . . : 192.168.1.1", ""];
  const pingOut = (host, ip, ms) => {
    const head = host === ip ? `Pinging ${ip} with 32 bytes of data:` : `Pinging ${host} [${ip}] with 32 bytes of data:`;
    const ttl = host === ip ? 64 : 54, mn = Math.min(...ms), mx = Math.max(...ms), av = Math.round(ms.reduce((a, b) => a + b, 0) / ms.length);
    return ["", head].concat(ms.map(m => `Reply from ${ip}: bytes=32 time=${m}ms TTL=${ttl}`),
      ["", `Ping statistics for ${ip}:`, "    Packets: Sent = 4, Received = 4, Lost = 0 (0% loss),",
       "Approximate round trip times in milli-seconds:", `    Minimum = ${mn}ms, Maximum = ${mx}ms, Average = ${av}ms`, ""]);
  };
  const PING_R = pingOut("192.168.1.1", "192.168.1.1", [2, 1, 3, 2]);
  const PING_S = pingOut("kantin.example", "203.0.113.40", [24, 23, 25, 24]);
  const TR = ["", "Tracing route to kantin.example [203.0.113.40]", "over a maximum of 30 hops:", "",
    "  1     2 ms     1 ms     2 ms  192.168.1.1", "  2     9 ms     8 ms    10 ms  10.20.0.1",
    "  3    15 ms    14 ms    16 ms  10.20.8.1", "  4     *        *        *     Request timed out.",
    "  5    23 ms    24 ms    22 ms  203.0.113.1", "  6    24 ms    25 ms    24 ms  203.0.113.40", "", "Trace complete.", ""];
  const NS = ["Server:  router.lab.example", "Address:  192.168.1.1", "", "Non-authoritative answer:",
    "Name:    kantin.example", "Address:  203.0.113.40", ""];
  const TO = ["", "Pinging 192.168.1.50 with 32 bytes of data:", "Request timed out.", "Request timed out.", "Request timed out.",
    "Request timed out.", "", "Ping statistics for 192.168.1.50:", "    Packets: Sent = 4, Received = 0, Lost = 4 (100% loss),", ""];
  const BAD = [{ k: "err", t: "'ipconfg' is not recognized as an internal or external command," }, { k: "err", t: "operable program or batch file." }, ""];

  // ---------- pembantu ----------
  // Terminal dengan sesi: perintah diketik pada fraksi [t0, t1], Enter, lalu keluaran muncul baris demi baris [t1, t2].
  // seq: [{c: perintah, out: [...], t0, t1, t2}] ; before: baris yang sudah ada sebelumnya
  function sesi(f, seq, before = []) {
    const rows = before.slice(); let typing = null, enter = 0, done = true;
    for (const s of seq) {
      if (f < s.t0) { typing = { t: s.c, u: 0, prompt: P }; done = false; break; }
      if (f < s.t1) { typing = { t: s.c, u: (f - s.t0) / Math.max(1e-6, (s.t1 - s.t0) * 0.85), prompt: P }; enter = clamp((f - (s.t1 - 0.03)) / 0.06, 0, 1); done = false; break; }
      rows.push({ k: "cmd", t: s.c, prompt: P }); const ue = (f - (s.t1 - 0.03)) / 0.06; if (ue < 1) enter = clamp(ue, 0, 1);
      const n = s.t2 == null ? s.out.length : Math.floor(clamp((f - s.t1) / Math.max(1e-6, s.t2 - s.t1), 0, 1) * s.out.length + 0.999);
      s.out.slice(0, n).forEach(o => rows.push(o));
      if (n < s.out.length) { done = false; return { rows, typing: null, enter, done, busy: true }; }
    }
    return { rows, typing, enter, done };
  }
  function term(ctx, st, l, opt = {}) {
    const g = LK.terminal(ctx, WIN.x, WIN.y, WIN.w, WIN.h, { title: opt.title || "Terminal (cmd)", prompt: opt.prompt || P, size: opt.size || SZ,
      lines: st.rows, typing: st.typing, caret: !st.typing && !st.busy, blink: blinkAt(l) });
    const nAll = st.rows.length + ((st.typing || !st.busy) ? 1 : 0), maxRows = Math.floor((g.h - 24) / g.lh), first = Math.max(0, nAll - maxRows);
    g.first = first;
    g.box = (i, c0, c1) => { const vi = i - first; const top = g.y + 18 + vi * g.lh; return { x: g.x + 22 + c0 * g.cw - 4, y: top + 2, w: (c1 - c0) * g.cw + 8, h: g.lh - 2 }; };
    g.vis = i => i - first >= 0;
    return g;
  }
  function keys(ctx, k, u, x = 1250, y = 735) { if (u > 0 && u < 1) L.keys(ctx, x, y, k, { press: u, align: "center", size: 30 }); }
  function call(ctx, y, s, tx, ty, opt = {}) { return L.callout(ctx, opt.x || 1450, y, s, tx, ty, { size: 24, maxW: 320, ...opt }); }
  const CMDS = ["ipconfig: alamat IP", "ping: ada balasan?", "tracert: jalur paket", "nslookup: nama → IP"];
  function panel(ctx, n) { return LK.steps(ctx, "EMPAT PERINTAH", CMDS, n, { w: 370, y: 552 }); }
  // label di kolom kanan, sejajar dengan baris ke-i, garisnya menunjuk ujung kanan teks baris itu (tidak menyilang teks)
  function note(ctx, g, rows, i, s, opt = {}) {
    if (i < 0 || !g.vis(i)) return; const ln = rows[i], str = typeof ln === "string" ? ln : (ln.k === "cmd" ? (ln.prompt || P) + ln.t : ln.t);
    const bx = g.box(i, 0, str.length), tx = bx.x + bx.w + 10, ty = bx.y + bx.h / 2;
    ctx.font = `800 24px Inter`; const n = H.wrap(ctx, s, 24, 800, 320).length, h = n * 30 + 26;
    const y = clamp(ty - h / 2 + (opt.dy || 0), 126, (opt.maxY || 540) - h);
    L.callout(ctx, 1450, y, s, tx, ty, { size: 24, maxW: 320, ...opt });
  }
  // kolom karakter pertama dari potongan s di baris teks
  const col = (line, s) => (typeof line === "string" ? line : line.t).indexOf(s);
  const rowOf = (rows, pred) => rows.findIndex(r => (typeof r === "string" ? r : r.t).includes(pred));
  function hl(ctx, g, rows, find, part, l, opt = {}) {
    const i = rowOf(rows, find); if (i < 0 || !g.vis(i)) return null; const ln = rows[i]; const s = typeof ln === "string" ? ln : ln.t;
    const c0 = part ? s.indexOf(part) : s.length - s.trimStart().length, c1 = part ? c0 + part.length : s.length; const bx = g.box(i, c0, c1);
    LK.focus(ctx, bx, { t: l, color: opt.color, pad: 3 }); return bx;
  }

  // ---------- desktop generik (untuk membuka Terminal) ----------
  function desktop(ctx, st) {
    const { x, y, w, h } = WIN;
    ctx.save(); ctx.shadowColor = "rgba(31,42,51,0.2)"; ctx.shadowBlur = 30; ctx.shadowOffsetY = 10; ctx.fillStyle = "#2F6F86"; rr(ctx, x, y, w, h, 16); ctx.fill(); ctx.restore();
    ctx.save(); rr(ctx, x, y, w, h, 16); ctx.clip();
    const g = ctx.createLinearGradient(x, y, x + w, y + h); g.addColorStop(0, "#5FA7A0"); g.addColorStop(1, "#2F6F86"); ctx.fillStyle = g; ctx.fillRect(x, y, w, h);
    // ikon di desktop
    [["Folder Tugas", "📁"], ["Browser", "🌐"]].forEach(([s, ic], i) => { text(ctx, ic, x + 70, y + 80 + i * 120, 48, { align: "center" }); text(ctx, s, x + 70, y + 128 + i * 120, 18, { align: "center", weight: 700, color: "#FFFFFF" }); });
    // bilah tugas
    ctx.fillStyle = "rgba(240,244,246,0.95)"; ctx.fillRect(x, y + h - 56, w, 56);
    ctx.fillStyle = st.menu ? "#DCE9F7" : "#FFFFFF"; rr(ctx, x + 16, y + h - 46, 46, 36, 8); ctx.fill();
    [[0, 0], [1, 0], [0, 1], [1, 1]].forEach(([i, j]) => { ctx.fillStyle = "#4A5A66"; ctx.fillRect(x + 28 + i * 12, y + h - 38 + j * 12, 10, 10); });
    ctx.fillStyle = "#FFFFFF"; rr(ctx, x + 76, y + h - 46, 300, 36, 18); ctx.fill(); ctx.strokeStyle = "#C9D4DB"; ctx.lineWidth = 1.5; rr(ctx, x + 76, y + h - 46, 300, 36, 18); ctx.stroke();
    text(ctx, "⌕  Ketik untuk mencari", x + 96, y + h - 21, 18, { weight: 600, color: "#7F8C95" });
    text(ctx, "07.15", x + w - 40, y + h - 21, 19, { align: "right", weight: 700, color: C.ink2 });
    if (st.menu) { // panel pencarian
      const px = x + 16, pw = 620, ph2 = 470, py = y + h - 56 - ph2 - 10 + (1 - st.menu) * 40; ctx.globalAlpha = st.menu;
      ctx.save(); ctx.shadowColor = "rgba(0,0,0,0.25)"; ctx.shadowBlur = 24; ctx.fillStyle = "#FFFFFF"; rr(ctx, px, py, pw, ph2, 14); ctx.fill(); ctx.restore();
      ctx.strokeStyle = "#7AA7D9"; ctx.lineWidth = 2.5; rr(ctx, px + 24, py + 24, pw - 48, 52, 26); ctx.stroke();
      text(ctx, "⌕", px + 52, py + 60, 26, { align: "center", weight: 700, color: "#5B6B76" });
      LK.mono(ctx, 26); ctx.fillStyle = C.ink; LK.monoText(ctx, st.q || "", px + 76, py + 60);
      if (st.caret) { ctx.fillRect(px + 78 + (st.q || "").length * LK.mono(ctx, 26), py + 36, 2.5, 30); }
      if (!st.q) text(ctx, "Aplikasi yang sering dipakai", px + 30, py + 130, 20, { weight: 700, color: C.ink2 });
      else {
        text(ctx, "Hasil terbaik", px + 30, py + 124, 20, { weight: 800, color: C.ink2 });
        ctx.fillStyle = st.sel ? "#DCE9F7" : "#F4F6F8"; rr(ctx, px + 20, py + 140, pw - 40, 110, 12); ctx.fill();
        ctx.fillStyle = "#1D242A"; rr(ctx, px + 44, py + 160, 70, 70, 10); ctx.fill(); LK.mono(ctx, 30, 700); ctx.fillStyle = "#DCE5EC"; ctx.fillText(">_", px + 56, py + 206);
        text(ctx, "Command Prompt", px + 136, py + 192, 28, { weight: 800 }); text(ctx, "Aplikasi", px + 136, py + 226, 20, { weight: 600, color: C.ink2 });
        text(ctx, "Pengaturan", px + 30, py + 300, 20, { weight: 800, color: C.ink2 });
        ["Pengaturan tampilan", "Pengaturan jaringan"].forEach((s, i) => text(ctx, s, px + 44, py + 346 + i * 44, 22, { weight: 600, color: C.ink }));
      }
      ctx.globalAlpha = 1;
    }
    ctx.restore();
  }

  Object.assign(K.SCENES, {
    tujuan(ctx, b, l) {
      card(ctx, 160, 150, 1600, 660);
      text(ctx, "SETELAH MENONTON, KAMU BISA:", 260, 240, 30, { weight: 900, color: C.accentDark });
      [["ipconfig", "melihat alamat IP dan gateway"], ["ping", "menguji balasan dan waktunya"], ["tracert", "melacak jalur paket"], ["nslookup", "mencari alamat sebuah situs"]].forEach(([c, s], i) => {
        const u = ease((l - 0.6 - i * 0.8) / 0.5); if (u <= 0) return; ctx.globalAlpha = u;
        card(ctx, 260, 280 + i * 104, 820, 84, { fill: C.bg2, r: 16 });
        LK.mono(ctx, 30, 800); ctx.fillStyle = C.kikoDark; ctx.textAlign = "left"; ctx.fillText(c, 290, 334 + i * 104);
        text(ctx, s, 480, 334 + i * 104, 29, { weight: 800 }); ctx.globalAlpha = 1;
      });
      const g = LK.terminal(ctx, 1120, 290, 580, 400, { size: 17, lines: [cmd("ping kantin.example"), ""].concat(PING_S.slice(1, 6).map(s => s.replace(" bytes=32", ""))), caret: true, blink: blinkAt(l) });
      text(ctx, "cukup Terminal bawaan komputer", 1410, 740, 24, { align: "center", weight: 700, color: C.ink2 });
    },
    prasyarat(ctx, b, l) {
      card(ctx, 160, 150, 1600, 660);
      text(ctx, "EPISODE YANG DILENGKAPI", 960, 235, 32, { align: "center", weight: 900, color: C.accentDark });
      [["F11.7", "Model Jaringan dan Pengiriman Data", "lapisan, paket, ping"], ["F11.8", "Troubleshooting dan Keamanan Lanjut Jaringan", "detektif jaringan"]].forEach(([c, t, s], i) => {
        const x = 260 + i * 520; card(ctx, x, 290, 480, 330, { fill: C.bg2, r: 22 });
        text(ctx, c, x + 240, 375, 58, { align: "center", weight: 900, color: C.kiko }); para(ctx, t, x + 240, 445, 30, 420, { align: "center", weight: 800, lh: 1.2 });
        text(ctx, s, x + 240, 590, 24, { align: "center", weight: 600, color: C.ink2 });
      });
      const u = ease((l - 3.5) / 0.6); ctx.globalAlpha = u;
      card(ctx, 1300, 290, 400, 330, { fill: "#FFF9E0", r: 22 }); text(ctx, "Semua rekaan", 1500, 345, 28, { align: "center", weight: 900 });
      ["192.168.x.x", "10.x.x.x", "203.0.113.x", "kantin.example"].forEach((s, i) => { LK.mono(ctx, 25, 700); ctx.fillStyle = C.kikoDark; ctx.textAlign = "center"; ctx.fillText(s, 1500, 405 + i * 52); });
      ctx.globalAlpha = 1;
      kiko(ctx, 1660, 735, 90, 0, { wave: l });
    },

    buka_cmd(ctx, b, l) {
      const sp = spanOf(b), f = l / sp;
      const menu = f < 0.12 ? 0 : clamp((f - 0.12) / 0.06, 0, 1);
      if (f < 0.66) desktop(ctx, { menu: f < 0.6 ? menu : 1, q: LK.typeStr("cmd", ph(l, sp, 0.24, 0.38)), caret: f > 0.18 && f < 0.5 && blinkAt(l), sel: f > 0.4 });
      else { const u = ease(clamp((f - 0.66) / 0.08, 0, 1)); ctx.save(); ctx.globalAlpha = u; const s = 0.85 + 0.15 * u; ctx.translate(760, 472); ctx.scale(s, s); ctx.translate(-760, -472);
        LK.terminal(ctx, WIN.x, WIN.y, WIN.w, WIN.h, { title: "Terminal (cmd)", prompt: P, size: SZ, lines: [], caret: true, blink: blinkAt(l) }); ctx.restore();
        if (f > 0.78) call(ctx, 130, "Di Windows: Command Prompt (cmd). Di video ini: Terminal.", null, null, { fill: "#E7F1FB", color: BLUE }); }
      keys(ctx, ["Win"], clamp((f - 0.08) / 0.1, 0, 1)); keys(ctx, ["Enter"], clamp((f - 0.56) / 0.1, 0, 1));
      LK.steps(ctx, "LANGKAH", ["Tekan tombol Windows.", "Ketik cmd.", "Tekan Enter."], f < 0.12 ? 0 : f < 0.4 ? 1 : f < 0.66 ? 2 : 3, { y: 552 });
    },
    kenal_cmd(ctx, b, l) {
      const sp = spanOf(b), f = l / sp;
      const g = term(ctx, { rows: [], typing: null }, l);
      const pb = g.box(0, 0, P.length);
      if (f > 0.05) { LK.focus(ctx, pb, { t: l, pad: 3 }); call(ctx, 160, "Prompt: Terminal siap menerima perintah.", pb.x + pb.w + 10, pb.y + pb.h / 2); }
      if (f > 0.4) { const cb = g.box(0, P.length, P.length + 1); call(ctx, 330, "Kursor berkedip: di sinilah perintahmu muncul.", cb.x + cb.w, cb.y + cb.h + 4, { fill: "#E7F1FB", color: BLUE }); }
      if (f > 0.7) { card(ctx, 160, 540, 1200, 130, { fill: "#2B343B", r: 16 }); text(ctx, "ketik perintah  →  tekan Enter  →  hasil muncul di bawahnya", 760, 618, 32, { align: "center", weight: 800, color: "#DCE5EC" }); }
      keys(ctx, ["Enter"], clamp((f - 0.8) / 0.12, 0, 1));
    },

    ipconfig_ketik(ctx, b, l) {
      const sp = spanOf(b), f = l / sp;
      const st = sesi(f, [{ c: "ipconfig", out: IPC, t0: 0.2, t1: 0.55, t2: 0.75 }]);
      const g = term(ctx, st, l);
      if (f > 0.2 && f < 0.62) note(ctx, g, st.rows.concat([{ k: "cmd", t: "ipconfig" }]), st.rows.length, "ipconfig: satu kata, tanpa spasi.");
      if (f > 0.8) note(ctx, g, st.rows, rowOf(st.rows, "Ethernet adapter"), "Pengaturan jaringan komputer ini", { fill: "#E7F1FB", color: BLUE });
      keys(ctx, ["Enter"], st.enter);
      panel(ctx, 0);
    },
    ipconfig_ip(ctx, b, l) {
      const sp = spanOf(b), f = l / sp;
      const st = sesi(1, [{ c: "ipconfig", out: IPC, t0: 0, t1: 0 }]); const g = term(ctx, st, l);
      const i = rowOf(st.rows, "IPv4");
      if (f > 0.05) { hl(ctx, g, st.rows, "IPv4", "192.168.1.23", l); note(ctx, g, st.rows, i, "Alamat IP komputer ini: 192.168.1.23"); }
      if (f > 0.5) { const c = col(st.rows[i], "192.168"); LK.focus(ctx, g.box(i, c, c + 7), { t: l + 1, color: GREEN, pad: 0 });
        card(ctx, 180, 600, 1160, 110, { fill: C.goodBg, r: 16 }); LK.mono(ctx, 30, 800); ctx.fillStyle = GREEN; ctx.textAlign = "left"; ctx.fillText("192.168.…", 210, 668);
        text(ctx, "= alamat lokal, hanya berlaku di jaringan lab", 430, 666, 30, { weight: 800 }); }
      panel(ctx, 0);
    },
    ipconfig_gw(ctx, b, l) {
      const sp = spanOf(b), f = l / sp;
      const st = sesi(1, [{ c: "ipconfig", out: IPC, t0: 0, t1: 0 }]); const g = term(ctx, st, l);
      if (f > 0.05) { hl(ctx, g, st.rows, "Default Gateway", "192.168.1.1", l); note(ctx, g, st.rows, rowOf(st.rows, "Default Gateway"), "Gateway = alamat router: 192.168.1.1"); }
      if (f > 0.55) { // jalur paket: komputer → router → internet
        card(ctx, 160, 610, 1200, 170, { fill: "#FFFFFF", stroke: "#D7E2DC", lw: 3, r: 16 });
        const u = clamp((f - 0.6) / 0.3, 0, 1);
        [["💻", "komputer", "192.168.1.23"], ["📶", "router (gateway)", "192.168.1.1"], ["🌐", "internet", ""]].forEach(([ic, s, a], i) => { const x = 300 + i * 450; text(ctx, ic, x, 690, 50, { align: "center" }); text(ctx, s, x, 734, 24, { align: "center", weight: 800 }); if (a) { LK.mono(ctx, 20, 700); ctx.fillStyle = C.kikoDark; ctx.textAlign = "center"; ctx.fillText(a, x, 764); } });
        ctx.strokeStyle = C.accent; ctx.lineWidth = 5; [0, 1].forEach(i => { ctx.beginPath(); ctx.moveTo(370 + i * 450, 676); ctx.lineTo(680 + i * 450, 676); ctx.stroke(); });
        const px = lerp(370, 1130, u); ctx.fillStyle = C.accentDark; rr(ctx, px - 16, 664, 32, 24, 5); ctx.fill();
      }
      panel(ctx, 0);
    },

    ping_ketik(ctx, b, l) {
      const sp = spanOf(b), f = l / sp;
      const st = sesi(f, [{ c: "ping 192.168.1.1", out: PING_R, t0: 0.45, t1: 0.78, t2: 1.25 }]);
      const g = term(ctx, st, l);
      if (f < 0.45) { card(ctx, 260, 330, 1000, 220, { fill: "#FFFFFF", r: 18 }); const u = (l * 0.8) % 1;
        text(ctx, "💻", 360, 460, 70, { align: "center" }); text(ctx, "📶", 1160, 460, 70, { align: "center" });
        ctx.setLineDash([10, 10]); ctx.strokeStyle = "#9AA8B1"; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(430, 440); ctx.lineTo(1090, 440); ctx.stroke(); ctx.setLineDash([]);
        const go = u < 0.5, px = go ? lerp(440, 1080, u * 2) : lerp(1080, 440, (u - 0.5) * 2); ctx.fillStyle = go ? C.accent : GREEN; rr(ctx, px - 18, 426, 36, 28, 6); ctx.fill();
        text(ctx, go ? "paket ping →" : "← balasan", 760, 400, 26, { align: "center", weight: 800, color: go ? C.accentDark : GREEN }); }
      if (f > 0.5 && f < 0.82) note(ctx, g, st.rows.concat([{ k: "cmd", t: "ping 192.168.1.1" }]), st.rows.length, "ping, spasi, alamat router");
      keys(ctx, ["Enter"], st.enter);
      panel(ctx, 1);
    },
    ping_reply(ctx, b, l) {
      const sp = spanOf(b), f = l / sp;
      const st = sesi(1, [{ c: "ping 192.168.1.1", out: PING_R, t0: 0, t1: 0 }]); const g = term(ctx, st, l);
      const i0 = rowOf(st.rows, "Reply from");
      if (f < 0.42) { for (let k = 0; k < 4; k++) LK.focus(ctx, g.box(i0 + k, 0, 10), { t: l + k * 0.3, pad: 1 }); note(ctx, g, st.rows, i0, "Reply from: satu balasan datang.", { dy: 40 }); }
      else { for (let k = 0; k < 4; k++) { const c = col(st.rows[i0 + k], "time="); LK.focus(ctx, g.box(i0 + k, c, c + 9), { t: l + k * 0.3, color: GREEN, pad: 1 }); }
        note(ctx, g, st.rows, i0, "time = waktu pergi-pulang dalam milidetik (ms)", { fill: C.goodBg, color: GREEN, dy: 40 }); }
      panel(ctx, 1);
    },
    ping_stat(ctx, b, l) {
      const sp = spanOf(b), f = l / sp;
      const st = sesi(1, [{ c: "ping 192.168.1.1", out: PING_R, t0: 0, t1: 0 }]); const g = term(ctx, st, l);
      const marks = [["Sent = 4", "dikirim"], ["Received = 4", "diterima"], ["Lost = 0 (0% loss)", "hilang"]];
      const n = f < 0.08 ? 0 : f < 0.3 ? 1 : f < 0.52 ? 2 : 3;
      marks.slice(0, n).forEach(([s], k) => hl(ctx, g, st.rows, "Packets:", s, l + k * 0.4, { color: k === 2 ? GREEN : C.accent }));
      if (n) { card(ctx, 1450, 150, 370, 50 + n * 64, { fill: "#FFFFFF", stroke: "#D7E2DC", lw: 3, r: 16 });
        marks.slice(0, n).forEach(([s, a], k) => { LK.mono(ctx, 22, 700); ctx.fillStyle = C.kikoDark; ctx.textAlign = "left"; ctx.fillText(s.split(" (")[0], 1472, 196 + k * 64); text(ctx, "= " + a, 1660, 196 + k * 64, 24, { weight: 800 }); }); }
      if (f > 0.75) { card(ctx, 1450, 380, 370, 130, { fill: C.goodBg, r: 16 }); para(ctx, "0% hilang: sambungan ke router sehat ✓", 1635, 432, 26, 330, { align: "center", weight: 900, color: GREEN, lh: 1.25 }); }
      panel(ctx, 1);
    },
    ping_situs(ctx, b, l) {
      const sp = spanOf(b), f = l / sp;
      const st = sesi(f, [{ c: "ping kantin.example", out: PING_S, t0: 0.05, t1: 0.3, t2: 0.62 }]); const g = term(ctx, st, l);
      if (f > 0.36) { hl(ctx, g, st.rows, "Pinging kantin", "[203.0.113.40]", l); note(ctx, g, st.rows, rowOf(st.rows, "Pinging kantin"), "Nama diterjemahkan menjadi alamat IP.", { fill: "#E7F1FB", color: BLUE }); }
      if (f > 0.68) { const i0 = rowOf(st.rows, "Reply from"); if (i0 >= 0) { const c = col(st.rows[i0], "time="); for (let k = 0; k < 4; k++) LK.focus(ctx, g.box(i0 + k, c, c + 10), { t: l + k * 0.3, color: GREEN, pad: 1 }); }
        note(ctx, g, st.rows, i0 + 2, "± 24 ms: lebih lama dari ke router (± 2 ms)", { fill: C.goodBg, color: GREEN, dy: 60 }); }
      keys(ctx, ["Enter"], st.enter);
      panel(ctx, 1);
    },

    tracert_ketik(ctx, b, l) {
      const sp = spanOf(b), f = l / sp;
      const st = sesi(f, [{ c: "tracert kantin.example", out: TR, t0: 0.2, t1: 0.52, t2: 1.08 }]); const g = term(ctx, st, l);
      if (f > 0.22 && f < 0.6) note(ctx, g, st.rows.concat([{ k: "cmd", t: "tracert kantin.example" }]), st.rows.length, "tracert = trace route, lacak jalur");
      if (f > 0.6) { const i = rowOf(st.rows, "  1 "); if (i >= 0) { LK.focus(ctx, g.box(i, 6, 30), { t: l, pad: 1 }); note(ctx, g, st.rows, i, "Tiga kali uji untuk tiap lompatan"); } }
      keys(ctx, ["Enter"], st.enter);
      panel(ctx, 2);
    },
    tracert_baca(ctx, b, l) {
      const sp = spanOf(b), f = l / sp;
      const st = sesi(1, [{ c: "tracert kantin.example", out: TR, t0: 0, t1: 0 }]); const g = term(ctx, st, l);
      const i1 = rowOf(st.rows, "  1 "), n = clamp(Math.floor((f - 0.05) / 0.07) + 1, 0, 6);
      for (let k = 0; k < n; k++) LK.focus(ctx, g.box(i1 + k, 0, 3), { t: l + k * 0.2, pad: 1, color: k === 0 || k === 5 ? C.accent : "#9AA8B1" });
      if (f > 0.05 && f < 0.45) note(ctx, g, st.rows, i1 + 2, "1 baris = 1 lompatan (1 router)");
      if (f > 0.45) { const s = st.rows[i1], c = col(s, "192.168.1.1"); LK.focus(ctx, g.box(i1, c, c + 11), { t: l, color: GREEN, pad: 2 }); note(ctx, g, st.rows, i1, "Lompatan 1: router lab", { fill: C.goodBg, color: GREEN }); }
      if (f > 0.7) { const s = st.rows[i1 + 5], c = col(s, "203.0.113.40"); LK.focus(ctx, g.box(i1 + 5, c, c + 12), { t: l, color: BLUE, pad: 2 }); note(ctx, g, st.rows, i1 + 5, "Lompatan 6: server kantin.example", { fill: "#E7F1FB", color: BLUE }); }
      panel(ctx, 2);
    },
    tracert_bintang(ctx, b, l) {
      const sp = spanOf(b), f = l / sp;
      const st = sesi(1, [{ c: "tracert kantin.example", out: TR, t0: 0, t1: 0 }]); const g = term(ctx, st, l);
      const i4 = rowOf(st.rows, "  4 ");
      if (f < 0.62) { LK.focus(ctx, g.box(i4, 0, st.rows[i4].length), { t: l, color: RED, pad: 2 }); note(ctx, g, st.rows, i4, "* = router ini tidak membalas", { fill: "#FDECEA", color: RED, dy: -50 });
        if (f > 0.3) { LK.focus(ctx, g.box(i4 + 1, 0, st.rows[i4 + 2].length), { t: l, color: GREEN, pad: 2 }); LK.focus(ctx, g.box(i4 + 2, 0, st.rows[i4 + 2].length), { t: l, color: GREEN, pad: 2 });
          note(ctx, g, st.rows, i4 + 2, "Lompatan 5 dan 6 membalas: jalurnya baik.", { fill: C.goodBg, color: GREEN, dy: 30 }); } }
      else { // contoh lain: paket berhenti
        const u = ease(clamp((f - 0.62) / 0.06, 0, 1)); ctx.globalAlpha = u;
        card(ctx, 180, 450, 1160, 350, { fill: "#FFFFFF", stroke: RED, lw: 4, r: 16 });
        text(ctx, "Contoh lain: semua lompatan sesudahnya bintang", 210, 494, 26, { weight: 900, color: RED });
        const ex = ["  3    15 ms    14 ms    16 ms  10.20.8.1", "  4     *        *        *     Request timed out.", "  5     *        *        *     Request timed out.", "  6     *        *        *     Request timed out."];
        const cw = LK.mono(ctx, 26, 600); ex.forEach((s, k) => { ctx.fillStyle = k ? RED : C.ink; LK.monoText(ctx, s, 210, 548 + k * 44, cw); });
        text(ctx, "→ paket berhenti setelah lompatan 3", 210, 762, 30, { weight: 900, color: C.ink }); ctx.globalAlpha = 1;
      }
      panel(ctx, 2);
    },
    nslookup(ctx, b, l) {
      const sp = spanOf(b), f = l / sp;
      const st = sesi(f, [{ c: "nslookup kantin.example", out: NS, t0: 0.12, t1: 0.42, t2: 0.52 }]); const g = term(ctx, st, l);
      if (f > 0.55) { hl(ctx, g, st.rows, "Server:", null, l, { color: BLUE }); const i = rowOf(st.rows, "Address:  192"); if (i >= 0) LK.focus(ctx, g.box(i, 0, st.rows[i].length), { t: l, color: BLUE, pad: 2 });
        note(ctx, g, st.rows, rowOf(st.rows, "Server:"), "Server DNS yang ditanya (di sini: router lab)", { fill: "#E7F1FB", color: BLUE }); }
      if (f > 0.75) { hl(ctx, g, st.rows, "Address:  203", "203.0.113.40", l, { color: GREEN }); note(ctx, g, st.rows, rowOf(st.rows, "Address:  203"), "Alamat IP kantin.example", { fill: C.goodBg, color: GREEN, dy: 50 }); }
      keys(ctx, ["Enter"], st.enter);
      panel(ctx, 3);
    },

    linux(ctx, b, l) {
      const A = b.audio || b.dur;
      card(ctx, 160, 140, 1600, 680);
      text(ctx, "WINDOWS, LINUX, DAN macOS", 960, 205, 32, { align: "center", weight: 900, color: C.accentDark });
      const X = [260, 700, 1060, 1420], hdr = ["Windows (cmd)", "Linux (Terminal)", "macOS (Terminal)", "Gunanya"];
      ctx.fillStyle = "#EEF2F5"; rr(ctx, 230, 235, 1460, 50, 10); ctx.fill();
      hdr.forEach((h, i) => text(ctx, h, X[i], 270, 23, { weight: 900, color: C.ink2 }));
      const rows = [["ipconfig", "ip a", "ifconfig", "alamat IP"], ["ping", "ping", "ping", "ada balasan?"], ["tracert", "traceroute", "traceroute", "jalur paket"], ["nslookup", "nslookup", "nslookup", "nama → IP"]];
      const hlRow = l < A * 0.5 ? 0 : l < A * 0.78 ? 2 : 3;
      rows.forEach((r, k) => { const y = 340 + k * 64; if (k === hlRow) { ctx.fillStyle = "#FFF3D6"; rr(ctx, 230, y - 40, 1460, 58, 10); ctx.fill(); }
        r.forEach((s, i) => { if (i < 3) { LK.mono(ctx, 27, 700); ctx.fillStyle = i === 0 ? C.ink : (s !== r[0] ? C.accentDark : C.kikoDark); ctx.textAlign = "left"; ctx.fillText(s, X[i], y); } else text(ctx, s, X[i], y, 25, { weight: 700, color: C.ink2 }); }); });
      const tg = LK.terminal(ctx, 230, 600, 1460, 200, { size: 21, prompt: "siswa@lab:~$ ", lines: [{ k: "cmd", t: "ip a" }, "2: eth0: <BROADCAST,MULTICAST,UP,LOWER_UP> mtu 1500 ...", "    inet 192.168.1.23/24 brd 192.168.1.255 scope global eth0"], caret: true, blink: blinkAt(l), title: "Terminal (Linux)" });
      if (l > A * 0.12 && l < A * 0.5) LK.focus(ctx, { x: tg.x + 22 + 4 * tg.cw - 4, y: tg.y + 18 + 2 * tg.lh + 2, w: 20 * tg.cw + 8, h: tg.lh - 2 }, { t: l, pad: 2 });
    },
    linux_ping(ctx, b, l) {
      const sp = spanOf(b), f = l / sp;
      const lp = (i, t) => `64 bytes from 192.168.1.1: icmp_seq=${i} ttl=64 time=${t} ms`;
      const T = ["1.84", "1.20", "2.05", "1.47", "1.66", "1.91"];
      const rows = [{ k: "cmd", t: "ping 192.168.1.1" }, "PING 192.168.1.1 (192.168.1.1) 56(84) bytes of data."];
      const nA = clamp(Math.floor(ph(l, sp, 0.05, 0.4) * 6), 0, 6); T.slice(0, nA).forEach((t, i) => rows.push(lp(i + 1, t)));
      const stop = f > 0.42; let typing = null;
      if (stop) rows.push("^C", "--- 192.168.1.1 ping statistics ---", "6 packets transmitted, 6 received, 0% packet loss, time 5007ms", "");
      if (f > 0.55) { const u = ph(l, sp, 0.55, 0.72); if (u < 1) typing = { t: "ping -c 4 192.168.1.1", u, prompt: "siswa@lab:~$ " };
        else { rows.push({ k: "cmd", t: "ping -c 4 192.168.1.1" }, "PING 192.168.1.1 (192.168.1.1) 56(84) bytes of data."); const nB = clamp(Math.floor(ph(l, sp, 0.74, 0.88) * 4), 0, 4); T.slice(0, nB).forEach((t, i) => rows.push(lp(i + 1, t)));
          if (nB >= 4) rows.push("", "--- 192.168.1.1 ping statistics ---", { k: "ok", t: "4 packets transmitted, 4 received, 0% packet loss, time 3004ms" }); } }
      LK.terminal(ctx, WIN.x, WIN.y, WIN.w, WIN.h, { title: "Terminal (Linux)", prompt: "siswa@lab:~$ ", size: 23, lines: rows, typing, caret: !typing && (f < 0.05 || (stop && f < 0.55) || f > 0.9), blink: blinkAt(l) });
      keys(ctx, ["Ctrl", "C"], clamp((f - 0.36) / 0.1, 0, 1));
      LK.steps(ctx, "LINUX DAN macOS", ["ping terus berjalan.", "Hentikan: Ctrl + C.", "Atau: ping -c 4 …"], f < 0.36 ? 0 : f < 0.55 ? 1 : f < 0.9 ? 2 : 3);
    },

    coba(ctx, b, l) {
      card(ctx, 160, 140, 1600, 680, { stroke: C.accent, lw: 6 });
      ctx.fillStyle = C.accent; ctx.beginPath(); ctx.arc(330, 290, 76, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = "#FFFFFF"; rr(ctx, 298, 252, 22, 76, 6); ctx.fill(); rr(ctx, 340, 252, 22, 76, 6); ctx.fill();
      text(ctx, "COBA SEKARANG", 450, 275, 44, { weight: 900, color: C.accentDark }); text(ctx, "Hentikan video, kerjakan, lalu putar lagi.", 450, 325, 30, { weight: 700, color: C.ink2 });
      (b.coba || []).forEach((s, i) => { card(ctx, 230, 400 + i * 98, 800, 82, { fill: C.bg2, r: 16 }); text(ctx, String(i + 1), 276, 452 + i * 98, 34, { align: "center", weight: 900, color: C.kiko }); text(ctx, s, 320, 452 + i * 98, 27, { weight: 700, fit: 690 }); });
      card(ctx, 1080, 380, 620, 400, { fill: "#FFFFFF", stroke: "#D7E2DC", lw: 3, r: 16 }); text(ctx, "Tabel catatanmu", 1110, 425, 24, { weight: 900, color: C.ink2 });
      [["Alamat IP", "…"], ["Gateway", "…"], ["ping gateway", "… ms"], ["ping situs", "… ms"], ["Lompatan", "…"], ["Alamat situs", "…"]].forEach(([k, v], i) => { const y = 475 + i * 50; ctx.fillStyle = i % 2 ? "#FFFFFF" : "#F4F6F8"; ctx.fillRect(1100, y - 32, 580, 48); text(ctx, k, 1120, y, 23, { weight: 700 }); text(ctx, v, 1660, y, 23, { align: "right", weight: 700, color: "#9AA8B1" }); });
    },
    periksa(ctx, b, l) {
      const A = b.audio || b.dur;
      card(ctx, 160, 140, 1600, 680);
      text(ctx, "PERIKSA CATATANMU", 960, 205, 32, { align: "center", weight: 900, color: C.accentDark });
      const R = [["Alamat IP", "192.168.1.23"], ["Gateway", "192.168.1.1"], ["ping gateway", "2 ms, 0% hilang"], ["ping kantin.example", "24 ms, 0% hilang"], ["Lompatan", "6"], ["Alamat situs", "203.0.113.40"]];
      R.forEach(([k, v], i) => { const y = 280 + i * 70; const on = (i < 2 && l > A * 0.12) || (i === 2 && l > A * 0.62);
        ctx.fillStyle = on ? "#FFF3D6" : (i % 2 ? "#FFFFFF" : "#F4F6F8"); rr(ctx, 240, y - 42, 900, 62, 10); ctx.fill();
        text(ctx, k, 270, y, 27, { weight: 800 }); LK.mono(ctx, 27, 700); ctx.fillStyle = C.kikoDark; ctx.textAlign = "right"; ctx.fillText(v, 1110, y); });
      if (l > A * 0.25) { const u = ease((l - A * 0.25) / 0.5); ctx.globalAlpha = u; card(ctx, 1200, 240, 480, 220, { fill: C.goodBg, r: 18 });
        para(ctx, "IP dan gateway: biasanya hanya angka terakhir yang berbeda.", 1440, 300, 27, 420, { align: "center", weight: 800, lh: 1.3 });
        LK.mono(ctx, 26, 700); ctx.textAlign = "center"; ctx.fillStyle = C.ink; ctx.fillText("192.168.1.", 1400, 425); ctx.fillStyle = GREEN; ctx.fillText("23 / 1", 1560, 425); ctx.globalAlpha = 1; }
      if (l > A * 0.62) { const u = ease((l - A * 0.62) / 0.5); ctx.globalAlpha = u; card(ctx, 1200, 490, 480, 200, { fill: "#E7F1FB", r: 18 });
        para(ctx, "Waktu ke router: biasanya di bawah 10 ms.", 1440, 555, 27, 420, { align: "center", weight: 800, lh: 1.3 }); ctx.globalAlpha = 1; }
    },
    salah_ketik(ctx, b, l) {
      const sp = spanOf(b), f = l / sp;
      const st = sesi(f, [{ c: "ipconfg", out: BAD, t0: 0.05, t1: 0.22, t2: 0.26 }, { c: "ipconfig", out: IPC.slice(0, 5), t0: 0.72, t1: 0.86, t2: 0.95 }]);
      const g = term(ctx, st, l);
      const i = rowOf(st.rows, "is not recognized");
      if (f > 0.28 && i >= 0) { const s2 = st.rows[i].t, c = s2.indexOf("is not recognized"); LK.focus(ctx, g.box(i, c, c + 17), { t: l, color: RED, pad: 2 }); }
      if (f > 0.28 && f < 0.72) { card(ctx, 180, 560, 1160, 120, { fill: "#FDECEA", stroke: RED, lw: 3, r: 16 });
        text(ctx, "is not recognized = perintah tidak dikenali", 760, 634, 34, { align: "center", weight: 900, color: RED }); }
      if (f > 0.5) { const j = rowOf(st.rows, "ipconfg"); if (j >= 0) { LK.focus(ctx, g.box(j, P.length, P.length + 7), { t: l + 1, color: C.accent, pad: 2 }); note(ctx, g, st.rows, j, "Salah ketik: ipconfg → ipconfig"); } }
      if (f > 0.95) note(ctx, g, st.rows, rowOf(st.rows, "Ethernet adapter"), "Ejaan benar: perintah berjalan ✓", { fill: C.goodBg, color: GREEN, dy: 100 });
      keys(ctx, ["Enter"], st.enter);
    },
    timeout(ctx, b, l) {
      const sp = spanOf(b), f = l / sp;
      const st = sesi(f, [{ c: "ping 192.168.1.50", out: TO, t0: 0.02, t1: 0.12, t2: 0.3 }]); const g = term(ctx, st, l);
      if (f > 0.3) { const i0 = rowOf(st.rows, "Request timed out"); if (i0 >= 0) LK.focus(ctx, { ...g.box(i0, 0, 18), h: g.lh * 4 - 2 }, { t: l, color: RED, pad: 3 });
        hl(ctx, g, st.rows, "Packets:", "Lost = 4 (100% loss)", l + 0.5, { color: RED }); }
      if (f > 0.3 && f < 0.45) note(ctx, g, st.rows, rowOf(st.rows, "Request timed out") + 1, "Balasan tidak datang dalam waktu tunggu.", { fill: "#FDECEA", color: RED });
      const why = [["💤", "perangkatnya mati"], ["✏️", "alamatnya salah"], ["🛡️", "ping ditolak (firewall)"]];
      if (f > 0.45) { text(ctx, "Kemungkinan penyebab:", 1450, 380, 26, { weight: 900, color: C.accentDark });
        why.forEach(([ic, s], i) => { const on = f > 0.45 + i * 0.13; if (!on) return; card(ctx, 1450, 410 + i * 120, 370, 100, { fill: "#FFFFFF", stroke: "#D7E2DC", lw: 3, r: 16 });
          text(ctx, ic, 1500, 475 + i * 120, 40, { align: "center" }); text(ctx, s, 1545, 472 + i * 120, 24, { weight: 800, fit: 260 }); }); }
    },
    latihan(ctx, b, l) {
      card(ctx, 160, 150, 1600, 660);
      text(ctx, "BERLATIH LAGI", 960, 230, 32, { align: "center", weight: 900, color: C.accentDark });
      card(ctx, 260, 290, 680, 420, { fill: C.bg2, r: 22 }); text(ctx, "Halaman latihan F11.7", 600, 360, 34, { align: "center", weight: 900 });
      text(ctx, "pelacak lompatan paket", 600, 410, 28, { align: "center", weight: 700, color: C.ink2 });
      card(ctx, 320, 450, 560, 70, { fill: "#FFFFFF", r: 12 }); text(ctx, "belajar-informatika.vercel.app/f117", 600, 496, 26, { align: "center", weight: 800, color: C.kikoDark });
      ["💻", "📶", "🔁", "🔁", "🖥️"].forEach((ic, i) => { text(ctx, ic, 360 + i * 120, 625, 44, { align: "center" }); if (i < 4) text(ctx, "→", 420 + i * 120, 620, 30, { align: "center", weight: 900, color: C.ink2 }); });
      card(ctx, 1000, 290, 660, 420, { fill: "#FFF9E0", r: 22 }); text(ctx, "Tugas nyata", 1330, 360, 34, { align: "center", weight: 900 });
      para(ctx, "Dengan izin guru, jalankan keempat perintah di lab, lalu catat hasilnya sebagai pembanding saat jaringan normal.", 1330, 420, 28, 560, { align: "center", weight: 700, lh: 1.3 });
      text(ctx, "ipconfig · ping · tracert · nslookup", 1330, 650, 24, { align: "center", weight: 800, color: C.kikoDark });
      kiko(ctx, 1680, 740, 90, 0, { wave: l });
    }
  });
})(typeof window !== "undefined" ? window : globalThis);
