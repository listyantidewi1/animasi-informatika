# Cek Bulan Kemah v1.0
# Program dari video simulasi S24 dan episode F11.10.
# Taruh file hujan_sukamaju.csv di folder yang sama (di Colab: unggah lewat ikon folder), lalu jalankan.
import csv

def baca_data(nama_file):
    with open(nama_file) as f:
        baris = list(csv.reader(f))
    return baris[1:]   # lewati judul

def bersihkan(baris):
    bersih, terlihat = [], set()
    for tgl, mm in baris:
        if mm == "" or mm == "999" or tgl in terlihat:
            continue
        terlihat.add(tgl)
        bersih.append((tgl, float(mm)))
    return bersih

def rangkum(bersih):
    hari_hujan = {}
    for tgl, mm in bersih:
        bulan = tgl[5:7]
        if mm > 0:
            hari_hujan[bulan] = hari_hujan.get(bulan, 0) + 1
    return hari_hujan

def rekomendasi(hari_hujan):
    return min(hari_hujan, key=hari_hujan.get)

# Test case
uji1 = [["2025-08-01", "5"], ["2025-08-02", ""], ["2025-08-03", "999"]]
assert len(bersihkan(uji1)) == 1
uji2 = [["2025-08-04", "12"], ["2025-08-04", "12"]]
assert len(bersihkan(uji2)) == 1
uji3 = [("2025-08-01", 5.0), ("2025-08-02", 0.0), ("2025-08-03", 7.0)]
assert rangkum(uji3) == {"08": 2}
assert rekomendasi({"07": 5, "08": 3}) == "08"
print("Semua test lolos.")

# Program utama
baris = baca_data("hujan_sukamaju.csv")
bersih = bersihkan(baris)
print("Dibaca:", len(baris), "baris, terpakai:", len(bersih))
hari_hujan = rangkum(bersih)
print("Hari hujan per bulan:", hari_hujan)
print("Bulan terbaik untuk kemah:", rekomendasi(hari_hujan))
