NAMA = "A00_pembuka"
REKAMAN = ["demo", "rek_ai"]
def A(nama, **k): return dict(k='adegan', nama=nama, **k)
BEATS = {
 1: [dict(k='rek', r='demo', a='mulai', b='akhir', db=1.5, maks=1.2), A('judulVideo', bg=True, min=6, a=dict(judul='Sistem Antrean\ndari Nol', hook='Setelah menonton, kamu bisa membangun aplikasi web lengkap, dari merancang database sampai membuatnya online.'))],
 2: [A('chatAI')],
 3: [dict(k='rek', r='rek_ai', a='kode', b=5.0, maks=1.0), dict(k='rek', r='rek_ai', a='server', b='satu_akhir', speed=2.2, maks=1.0),
     dict(k='rek', r='rek_ai', a='coba1', b='serbu_akhir', maks=1.0, kalimat=2), A('duaTujuh', min=6)],
 4: [A('mandor')], 5: [A('petaBab')], 6: [A('bekal')], 7: [A('cekAIpengantar')], 8: [A('siapkanKopi')],
}
