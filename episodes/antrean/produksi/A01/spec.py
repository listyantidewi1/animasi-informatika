NAMA = "A01_kebutuhan"
def A(nama, **k): return dict(k='adegan', nama=nama, **k)
BEATS = {
 1: [A('kartuBab', a=dict(bab='BAB 1', judul='Kebutuhan:\nbicara dulu dengan pemakai', sub='Kesalahan termahal adalah membangun hal yang salah', lapis='kebutuhan'))],
 2: [A('bengkel')], 3: [A('pertanyaan')], 4: [A('fakta')], 5: [A('storyKartu')], 6: [A('papanStory')],
 7: [A('kriteria')], 8: [A('diagramStatus')], 9: [A('diagramTombol')], 10: [A('specAI')], 11: [A('specJawab')],
 12: [A('versi1')],
 13: [dict(k='rek', a='b13', b='b13_git', speed=2.4, maks=3), dict(k='rek', a='b13_git', b='b13_akhir', db=0.5, kalimat=2)],
 14: [A('tantangan', a=dict(tantangan='Wawancarai satu orang yang usahanya memakai antrean, misalnya tukang cukur atau petugas puskesmas. Tulis tiga user story dari obrolan itu.', berikut='Bab 2: Merancang database'))],
}
