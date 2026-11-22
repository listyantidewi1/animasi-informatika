NAMA = "A02_database"
def A(nama, **k): return dict(k='adegan', nama=nama, **k)
BEATS = {
 1: [A('kartuBab', a=dict(bab='BAB 2', judul='Merancang database', sub='Database adalah ingatan aplikasi', lapis='database'))],
 2: [A('kataBenda')], 3: [A('atribut')], 4: [A('relasi1N')], 5: [A('relasiNN')], 6: [A('normalisasi')], 7: [A('tigaAturan')],
 8: [A('labelSejarah')], 9: [A('riwayat')], 10: [A('slotBooking')], 11: [A('erdLengkap')], 12: [A('schemaAI')], 13: [A('positionJawab')],
 14: [dict(k='rek', a='b14', b='b14_akhir', db=0.4, maks=3), A('tantangan', min=8, a=dict(tantangan='Pak Rahmat ingin pelanggan memberi nilai bintang 1 sampai 5 setelah dilayani. Tabel apa yang perlu ditambah, dan kolom apa saja isinya?', berikut='Bab 3: SQL dengan tangan sendiri'))],
}
