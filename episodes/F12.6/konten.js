/* Pembantu gambar F12.6: infografik versi rapi dan padat, panel papan cerita video, halaman web hasil HTML di layar HP,
   gelembung pembaca layar, daftar periksa. Produk "Setor Sampah" fiktif. Muat setelah kiko-core.js dan kiko-devices.js. */
(function (global) {
  const K = global.Kiko, H = K.helpers, C = K.C, D = K.devices;
  const { rr, text, para, card } = H;
  const Kt = {};
  // gambar kecil: botol plastik
  Kt.bottle = function (ctx, x, y, s, col = "#5FA8D3") { ctx.fillStyle = col; rr(ctx, x - s * 0.18, y - s * 0.3, s * 0.36, s * 0.75, s * 0.08); ctx.fill(); ctx.fillRect(x - s * 0.08, y - s * 0.45, s * 0.16, s * 0.16); ctx.fillStyle = "#2E7E9A"; ctx.fillRect(x - s * 0.1, y - s * 0.52, s * 0.2, s * 0.08); };
  // infografik: mode "rapi" | "padat"
  Kt.poster = function (ctx, x, y, w, h, mode, opt = {}) {
    card(ctx, x, y, w, h, { fill: "#FFFDF5", stroke: "#B7C4CC", lw: 3, r: 12 });
    if (mode === "rapi") {
      ctx.fillStyle = "#2E9E5B"; rr(ctx, x, y, w, h * 0.24, 12); ctx.fill(); ctx.fillRect(x, y + h * 0.12, w, h * 0.12);
      para(ctx, "Setor Sampah, Kumpulkan Poin!", x + w / 2, y + h * 0.1, w * 0.075, w - 40, { align: "center", weight: 900, color: "#fff", lh: 1.1 });
      [["♻️", "pilah botol plastik"], ["📱", "setor lewat aplikasi"], ["⭐", "1 botol = 1 poin"]].forEach(([ic, t], i) => { const yy = y + h * (0.34 + i * 0.15); text(ctx, ic, x + w * 0.16, yy + w * 0.03, w * 0.08, { align: "center" }); text(ctx, t, x + w * 0.27, yy + w * 0.02, w * 0.055, { weight: 900 }); });
      ctx.fillStyle = C.accent; rr(ctx, x + w * 0.12, y + h * 0.8, w * 0.76, h * 0.12, 12); ctx.fill(); text(ctx, "Mulai Senin di koperasi", x + w / 2, y + h * 0.88, w * 0.05, { align: "center", weight: 900, color: "#fff" });
    } else {
      const cols = ["#C0392B", "#8E6BBF", "#2E7E9A", "#E09A1A", "#2E9E5B"];
      text(ctx, "INFORMASI APLIKASI SETOR SAMPAH BANK SAMPAH SMA TUNAS", x + 14, y + 30, w * 0.026, { weight: 900, color: cols[0] });
      for (let i = 0; i < 12; i++) { ctx.fillStyle = cols[i % 5]; text(ctx, ["Aplikasi ini dibuat oleh tim proyek kelas XII untuk membantu…", "Fitur 1: pencatatan setoran per murid per hari dan per kelas", "Fitur 2: poin, peringkat, riwayat, grafik, ekspor, cetak", "Cara daftar: download, isi formulir, verifikasi, tunggu…", "Syarat dan ketentuan berlaku untuk penukaran poin…"][i % 5], x + 14, y + 64 + i * (h - 90) / 12, w * 0.026, { weight: 700, color: cols[i % 5] }); }
    }
  };
  // panel papan cerita: panels [[ikon, judul, catatan]], active
  Kt.panels = function (ctx, x, y, panels, active, opt = {}) {
    const w = opt.w || 260, h = opt.h || 220, gap = opt.gap || 24;
    panels.forEach(([ic, t, s], i) => { const px = x + i * (w + gap); ctx.save(); if (active != null && i > active) ctx.globalAlpha = 0.2; card(ctx, px, y, w, h, { fill: "#fff", stroke: i === active ? C.accent : "#B7C4CC", lw: i === active ? 5 : 3, r: 12 }); ctx.fillStyle = "#F4F8FB"; rr(ctx, px + 12, y + 12, w - 24, h * 0.5, 8); ctx.fill(); text(ctx, ic, px + w / 2, y + h * 0.36, 54, { align: "center" }); text(ctx, (i + 1) + ". " + t, px + 14, y + h * 0.7, 22, { weight: 900 }); para(ctx, s, px + 14, y + h * 0.84, 17, w - 28, { weight: 700, color: C.ink2 }); ctx.restore(); });
  };
  // halaman web di HP: opt {alt: teks alt, gagal: true -> gambar gagal dimuat}
  Kt.webpage = function (ctx, cx, cy, opt = {}) {
    const sc = D.phone(ctx, cx, cy, 300, 540); ctx.fillStyle = "#fff"; rr(ctx, sc.x, sc.y, sc.w, sc.h, 22); ctx.fill();
    ctx.fillStyle = "#EEF3F6"; rr(ctx, sc.x + 10, sc.y + 10, sc.w - 20, 34, 10); ctx.fill(); text(ctx, "setorsampah.example", sc.x + 22, sc.y + 33, 14, { weight: 700, color: C.ink2 });
    para(ctx, "Setor Sampah", sc.x + 18, sc.y + 90, 30, sc.w - 36, { weight: 900 }); para(ctx, "Setor botol plastik, kumpulkan poin, bantu sekolah lebih bersih.", sc.x + 18, sc.y + 130, 16, sc.w - 36, { weight: 700, color: C.ink2 });
    const iy = sc.y + 190; if (opt.gagal) { ctx.strokeStyle = "#B7C4CC"; ctx.lineWidth = 2; ctx.setLineDash([6, 4]); ctx.strokeRect(sc.x + 18, iy, sc.w - 36, 150); ctx.setLineDash([]); para(ctx, opt.alt || "", sc.x + 30, iy + 40, 15, sc.w - 60, { weight: 700, color: C.ink2 }); } else { ctx.fillStyle = "#DDEFE3"; rr(ctx, sc.x + 18, iy, sc.w - 36, 150, 10); ctx.fill(); Kt.bottle(ctx, sc.x + 90, iy + 85, 90); H.kid(ctx, sc.x + 190, iy + 70, 50, {}); }
    ctx.fillStyle = C.accent; rr(ctx, sc.x + 30, sc.y + sc.h - 90, sc.w - 60, 52, 14); ctx.fill(); text(ctx, "Daftar sekarang", sc.x + sc.w / 2, sc.y + sc.h - 56, 20, { align: "center", weight: 900, color: "#fff" });
    return sc;
  };
  K.konten = Kt;
})(typeof window !== "undefined" ? window : globalThis);
