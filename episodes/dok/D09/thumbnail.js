// Thumbnail D09: terminal php -v (versi disamarkan), cap "BOCOR LAGI", pertanyaan "Berapa lama servermu aman?" dan jam ??:??.
// Tidak membocorkan jawaban (berapa jam, AI menyerang): penonton dibiarkan penasaran (Dewi 21 Nov).
const X = window.D09, C = X.C;
X.bg(ctx, 0.3, { scan: false, tint: C.php });
X.glow(ctx, 540, 420, 620, C.red, 0.22);
X.terminal(ctx, 60, 130, 900, 560, [{ t: "php -v", cmd: true }, { t: "PHP 8.?.?? (cli)", hl: C.red, color: C.text }, { t: "" }, { t: "<?php // celah?", color: C.php }], { size: 52 });
X.cap(ctx, "BOCOR LAGI", 530, 820, -0.06, C.red, 104);
X.text(ctx, "Berapa lama", 1450, 300, 96, { align: "center", weight: 900, color: C.white });
X.text(ctx, "servermu aman?", 1450, 425, 96, { align: "center", weight: 900, color: C.amber });
X.jam(ctx, 1450, 680, 1.3);
X.text(ctx, "CELAH KEAMANAN PHP", 1450, 970, 60, { align: "center", weight: 900, color: C.php, spacing: 6 });
