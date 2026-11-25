import sys, time, os; sys.path.insert(0, "/home/user/parkir/alat")
from tulis import Bab, CACAT, P, sh, acuan, siapkan, banding
T = "bab-07"
siapkan("bab-06", "seed")
sh("rm -f tests/Feature/ExampleTest.php tests/Unit/ExampleTest.php; touch tests/Feature/.gitkeep")   # test contoh bawaan tidak dipakai
b = Bab("/home/user/parkir/P07/rek"); r = b.r
BT = "tests/Unit/BiayaTest.php"; BI = "app/Support/Biaya.php"; penuh = acuan(BT, T)
i2 = penuh.index("test('tepat di batas jam'"); i3 = penuh.index("test('menginap'")
AI = """<?php

namespace App\\Support;

use App\\Models\\Rate;
use Carbon\\CarbonInterface;

class Biaya
{
    public static function hitung(Rate $tarif, CarbonInterface $masuk, CarbonInterface $keluar): int
    {
        $menit = (int) $masuk->diffInMinutes($keluar);
        $jam = floor($menit / 60) + 1;
        $biaya = $tarif->first_hour + ($jam - 1) * $tarif->next_hour;

        return min($biaya, $tarif->daily_max);
    }
}
"""
benar = acuan(BI, T); langkah1 = benar[:benar.index("    private static function sehari")].rstrip() + "\n}\n"
r.mulai(); r.kamera(None); time.sleep(0.8)
# b03 make:test + test pertama
b.term(); r.tanda("b03"); b.jalan("php artisan make:test BiayaTest --unit", cps=14, tunggu=1.5, sampai="created successfully", label="Berkas baru: tests/Unit/BiayaTest.php", dur=3.0)
r.kamera(None); r.tanda("b03_ketik"); b.lihat(BT, jeda=0.8); b.ubah(BT, penuh[:i2].rstrip() + "\n", cps=28); time.sleep(0.6)
b.sorot(BT, "function biaya(", "Pembantu: menyiapkan tarif, lalu memanggil rumusnya", 3.6, tanda="b03_bantu", n=8)
b.sorot(BT, "test('contoh hitungan dari Bu Ratna'", "Tiga contoh hitungan dari bab 2", 4.5, tanda="b03_tiga", n=5)
b.sorot(BT, "'2026-11-02 09:20'", "Motor, 07.00 sampai 09.20: harus 4000", 9.5, tanda="b03_baca")
r.tanda("b03_pest"); r.label("expect(...)->toBe(...): berasal dari Pest", 6.5); time.sleep(6.5); r.tanda("b03_akhir")
# b04 test kedua (batas jam) dan ketiga (menginap)
r.kamera(None); r.tanda("b04"); b.editor(); b.ubah(BT, penuh[:i3].rstrip() + "\n", cps=28); time.sleep(0.6)
b.sorot(BT, "'baru masuk lalu keluar'", "1, 59, dan 60 menit: sama-sama 2000", 8.5, tanda="b04_tiga", n=3)
b.sorot(BT, "'65 menit, masih toleransi'", "65 menit: masih 2000", 4.8, tanda="b04_65")
b.sorot(BT, "'66 menit, masuk jam kedua'", "66 menit: sudah 3000", 3.8, tanda="b04_66")
b.sorot(BT, "})->with([", "with: daftar jam keluar dan biaya yang diharapkan", 8.5, tanda="b04_with")
r.kamera(None); r.tanda("b04_inap"); b.editor(); b.ubah(BT, penuh, cps=30); time.sleep(0.5)
b.sorot(BT, "test('menginap'", "Test ketiga: kendaraan yang menginap", 4.0, tanda="b04_inap_sorot", n=6); r.tanda("b04_akhir")
# b05 test merah: class belum ada
b.besar(); r.tanda("b05"); b.jalan("php artisan test", cps=14, tunggu=1.5, sampai="Duration", label="Semua merah: class Biaya belum ada", dur=5.0); time.sleep(6.0); r.tanda("b05_akhir"); b.kecil()
# b07 rumus dari AI ditulis ke class Biaya, test dijalankan
b.taruh(BI, AI); r.kamera(None); r.tanda("b07"); b.lihat(BI, jeda=1.0); r.label("Rumus dari AI, ditulis ke app/Support/Biaya.php", 4.5); time.sleep(4.5)
b.besar(); r.tanda("b07_test"); b.jalan("php artisan test", cps=16, tunggu=1.5, sampai="Duration", label="Sebagian hijau, sebagian merah", dur=5.0); time.sleep(1.5); r.tanda("b07_akhir"); b.kecil()
# b08 rumus yang benar: hitung()
r.kamera(None); r.tanda("b08"); b.lihat(BI, jeda=0.6); b.ubah(BI, langkah1, cps=22); time.sleep(0.6)
b.sorot(BI, "$menit = (int) $masuk->diffInMinutes($keluar)", "Selisih menit antara jam masuk dan jam keluar", 5.5, tanda="b08_menit")
b.sorot(BI, "$hari = intdiv($menit, 1440)", "1440 menit = satu hari: jumlah hari penuh dan sisa menitnya", 14.0, tanda="b08_hari", n=2)
b.sorot(BI, "return $hari * $tarif->daily_max", "Hari penuh kali batas harian, ditambah biaya sisa menit", 8.0, tanda="b08_total"); r.tanda("b08_akhir")
# b09 sehari()
r.kamera(None); r.tanda("b09"); b.editor(); b.ubah(BI, benar, cps=24); time.sleep(0.6)
b.sorot(BI, "$jam = (int) ceil(", "Kurangi 5 menit, bagi 60, bulatkan ke atas", 8.5, tanda="b09_ceil"); r.tanda("b09_ceil_akhir")
b.sorot(BI, "if ($jam <= 0)", "Parkir sangat singkat: tetap biaya jam pertama", 9.0, tanda="b09_nol", n=3)
b.sorot(BI, "return min($biaya, $tarif->daily_max)", "Tidak melewati batas harian", 5.0, tanda="b09_min"); r.tanda("b09_akhir")
# b10 test hijau + commit
b.besar(); r.tanda("b10"); b.jalan("php artisan test", cps=16, tunggu=1.5, sampai="Duration", label="Semua hijau", dur=5.0); time.sleep(4.0); r.tanda("b10_akhir"); b.kecil()
b.term(); b.commit("Rumus tarif dan test", "b10_commit"); time.sleep(1.0); r.tanda("b10_commit_akhir")
r.kamera(None); time.sleep(0.8); r.selesai()
sh("git tag -f bab-07"); print("CACAT", CACAT); banding(T); print(sh("git status --short | head; git log --oneline | head -3").stdout)
