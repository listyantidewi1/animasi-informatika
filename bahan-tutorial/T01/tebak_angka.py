import random

angka_rahasia = random.randint(1, 100)
jumlah_tebakan = 0
print("Aku sudah memilih angka dari 1 sampai 100. Coba tebak!")

while True:
    tebakan = int(input("Tebakanmu: "))
    jumlah_tebakan = jumlah_tebakan + 1
    if tebakan < angka_rahasia:
        print("Terlalu kecil!")
    elif tebakan > angka_rahasia:
        print("Terlalu besar!")
    else:
        print("Benar! Kamu menebak dalam", jumlah_tebakan, "kali.")
        break
