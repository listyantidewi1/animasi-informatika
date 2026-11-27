// Thumbnail D12: satu tab browser di dalam ruang kaca yang retak di satu sudut, meter 9,6, dan pertanyaan "CHROME KAMU AMAN?".
// Tidak membocorkan jawaban (Variations, Luncurkan Ulang, status eksploitasi).
const X = window.D12, C = X.C, U = Kiko.d12;
X.bg(ctx, 0.3, { scan: false, tint: C.red });
X.glow(ctx, 520, 520, 700, C.red, 0.25);
const f = U.browser(ctx, 130, 250, 800, 520, { tabs: ["Halaman web"], url: "https://…" }); U.isiHalaman(ctx, f, 1);
U.kaca(ctx, 70, 170, 920, 680, { lw: 9, retak: 1.5, merah: 0.35 });
X.text(ctx, "CHROME", 1440, 270, 170, { align: "center", weight: 900, color: C.white });
X.text(ctx, "KAMU", 1440, 430, 170, { align: "center", weight: 900, color: C.white });
X.text(ctx, "AMAN?", 1440, 590, 170, { align: "center", weight: 900, color: C.amber });
X.meterCVSS(ctx, 1440, 790, 130, 9.6, { label: "KRITIS" });
X.text(ctx, "ADA CELAH KEAMANAN KRITIS", 960, 1000, 64, { align: "center", weight: 900, color: C.text, spacing: 6 });
