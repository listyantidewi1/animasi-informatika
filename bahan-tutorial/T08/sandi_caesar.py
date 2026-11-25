huruf = "abcdefghijklmnopqrstuvwxyz"

def kunci(pesan, geser):
    hasil = ""
    for h in pesan:
        if h in huruf:
            posisi = huruf.index(h) + geser
            posisi = posisi % 26
            hasil = hasil + huruf[posisi]
        else:
            hasil = hasil + h
    return hasil

def buka(sandi, geser):
    return kunci(sandi, -geser)

rahasia = kunci("ketemu di kantin jam sepuluh", 3)
print(rahasia)
print(buka(rahasia, 3))

# brute force
sandi = "uhuap zvyl shapohu ihzrla"
for g in range(26):
    print(g, buka(sandi, g))
