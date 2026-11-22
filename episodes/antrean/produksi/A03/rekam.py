import sys, time; sys.path.insert(0, "/home/user/antre/alat")
from rekam_vs import VS
import subprocess
K = "/home/user/antre/kode/A03/"
P = "/home/user/proyek/siantre"
subprocess.run(f"cd {P} && git reset -q --hard bab-02 && git clean -qfdx", shell=True)
subprocess.run("psql -U postgres -qc \"SELECT pg_terminate_backend(pid) FROM pg_stat_activity WHERE datname = 'antrean'\" -c 'DROP DATABASE IF EXISTS antrean'", shell=True)
subprocess.run("/home/user/antre/alat/reset_vs.sh", shell=True)
r = VS("/home/user/antre/A03/rek")
def bersih(): r.pg.keyboard.press("Control+l"); time.sleep(0.3)
def panel_besar(): r.perintah("View: Toggle Maximized Panel", 0.6)
def sql(teks, cps=20, tunggu=1.2):
    baris = teks.strip("\n").split("\n")
    for i, b in enumerate(baris):
        if i: r.pg.keyboard.press("Enter"); time.sleep(0.15)
        r.ketik(b, cps)
    time.sleep(0.2); r.pg.keyboard.press("Enter"); time.sleep(tunggu)
def panel(): r.kamera(r.kotak(".part.panel"), pad=10)
r.mulai(); r.kamera(None); time.sleep(0.6)
# b02 psql + create database + berkas schema
r.tanda("b02"); r.fokus_terminal(); time.sleep(0.4); r.kamera_terminal()
r.terminal("psql", tunggu=1.0); r.terminal("CREATE DATABASE antrean;", tunggu=0.8); r.terminal("\\c antrean", tunggu=1.0)
r.label("Masuk ke PostgreSQL", 2.5); time.sleep(0.8)
r.tanda("b02_berkas"); r.kamera(None); r.berkas_baru("schema.sql"); r.kamera_editor()
r.tanda("b03"); r.ketik_kode(open(K + "schema_a.sql").read(), cps=11); r.tanda("b03_akhir"); time.sleep(1.0)
r.tekan("Enter", 0.1); r.tekan("Enter", 0.2)
r.tanda("b05"); r.ketik_kode(open(K + "schema_b.sql").read(), cps=13); r.tanda("b05_akhir"); time.sleep(0.8)
r.tekan("Enter", 0.2)
r.tanda("b06"); r.ketik_kode(open(K + "schema_c.sql").read(), cps=11); r.tanda("b06_akhir"); time.sleep(1.0)
r.tekan("Enter", 0.1); r.tekan("Enter", 0.2)
r.tanda("b07"); r.ketik_kode(open(K + "schema_d.sql").read(), cps=45); r.tekan("Control+s"); time.sleep(0.6); r.tanda("b07_simpan")
r.kamera(None); r.fokus_terminal(); panel_besar(); time.sleep(0.4); panel(); bersih()
r.tanda("b07_i"); sql("\\i schema.sql", cps=16, tunggu=1.5); sql("\\dt", cps=12, tunggu=1.5); r.label("8 tabel", 2.5); time.sleep(2.0); r.tanda("b07_akhir")
# b08 uji penjaga
bersih(); r.tanda("b08")
sql("INSERT INTO services (code, name, avg_minutes) VALUES ('X', 'Uji', 0);", cps=24, tunggu=1.8); r.label("Ditolak: CHECK", 2.5); time.sleep(1.0)
sql("INSERT INTO tickets (service_id, number, label) VALUES (99, 1, 'Z-001');", cps=24, tunggu=1.8); r.label("Ditolak: foreign key", 2.5); time.sleep(1.0)
r.tanda("b08_dobel")
sql("INSERT INTO services (code, name, avg_minutes) VALUES ('A', 'Ganti oli cepat', 10);", cps=34, tunggu=0.8)
sql("INSERT INTO tickets (service_id, number, label) VALUES (2, 1, 'A-001');", cps=34, tunggu=0.8)
sql("INSERT INTO tickets (service_id, number, label) VALUES (2, 1, 'A-001');", cps=34, tunggu=1.8); r.label("Ditolak: UNIQUE", 2.5); time.sleep(2.5); r.tanda("b08_akhir")
# b09 seed
panel_besar(); r.fokus_editor(); time.sleep(0.3); r.kamera(None); r.berkas_baru("seed.sql"); r.kamera_editor()
r.tanda("b09"); r.ketik_kode(open(K + "seed.sql").read(), cps=60, ikuti=True); r.tekan("Control+s"); time.sleep(0.5); r.tanda("b09_simpan")
r.kamera(None); r.fokus_terminal(); panel_besar(); time.sleep(0.4); panel(); bersih()
sql("\\i seed.sql", cps=16, tunggu=2.0); time.sleep(1.5); r.tanda("b09_akhir")
# b10 query menunggu
bersih(); r.tanda("b10")
sql("SELECT label, created_at FROM tickets\nWHERE status = 'waiting' AND service_id = 2\nORDER BY created_at;", cps=17, tunggu=2.5); time.sleep(1.5); r.tanda("b10_akhir")
# b11 join
bersih(); r.tanda("b11")
sql("SELECT tickets.label, services.name, tickets.created_at\nFROM tickets JOIN services ON services.id = tickets.service_id\nWHERE tickets.status = 'waiting'\nORDER BY tickets.created_at;", cps=22, tunggu=2.5); time.sleep(1.5); r.tanda("b11_akhir")
# b12 posisi
bersih(); r.tanda("b12")
sql("SELECT count(*) + 1 AS posisi FROM tickets\nWHERE service_id = 1 AND status = 'waiting'\n  AND created_at < (SELECT created_at FROM tickets WHERE label = 'A-012');", cps=22, tunggu=2.0); r.label("Posisi A-012", 2.5); time.sleep(2.0); r.tanda("b12_akhir")
# b13 rata-rata
bersih(); r.tanda("b13")
sql(open(K + "q13.sql").read(), cps=26, tunggu=2.5); time.sleep(2.0); r.tanda("b13_akhir")
# b15 perbaikan
bersih(); r.tanda("b15")
sql(open(K + "q15.sql").read(), cps=40, tunggu=2.5); r.tanda("b15_hasil"); r.label("Yang batal ikut terlihat", 3); time.sleep(3.5); r.tanda("b15_akhir")
# b16 commit
bersih(); sql("\\q", cps=10, tunggu=0.8); panel_besar(); time.sleep(0.3); r.kamera_terminal()
r.tanda("b16"); r.terminal("git add schema.sql seed.sql", tunggu=0.6); r.terminal('git commit -m "Skema dan data contoh"', tunggu=1.5)
r.label("Commit", 2.5); time.sleep(2.0); r.tanda("b16_akhir"); r.kamera(None); time.sleep(0.8); r.selesai()
