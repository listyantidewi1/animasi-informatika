NAMA = "P01_persiapan"
REKAMAN = []
SKRIP = ["/home/user/antre/alat/web/siap.js"]
def A(nama, **k): return dict(k='adegan', nama=nama, **k)
# Chapter "Persiapan": seluruhnya adegan gambar (penginstal Windows tidak bisa direkam di sini)
BEATS = {1: [A('siapKartu')], 2: [A('siapNode')], 3: [A('siapGitVS')], 4: [A('siapPg')], 5: [A('siapCek')], 6: [A('siapPsql')], 7: [A('siapTag')]}
