"""Sumber naskah ON03 -> script.json (dan naskah.md untuk Claude Doc)."""
import json
B=[]
def b(id,seg,scene,text,hold=0.6,**k): B.append(dict(id=id,seg=seg,scene=scene,text=text,hold=hold,**k))
EX="BBCBBCCCS"; Q11="BBCBCBBCCCBCS"; Q12="BBBBBCCCBCCBBCBCCCS"; DD="BBBBBC"
# 0 Kait
b("k1",0,"kait_lima","Ada lima deretan angka di layar. Empat di antaranya bisa dicetak oleh sebuah mesin sederhana, tetapi satu deretan tidak mungkin dicetak. Bisakah kamu menemukan yang mustahil?")
b("k2",0,"kait_mesin","Mesin itu hanya punya tiga tombol dan sebuah tabung berisi koin. Di video ini, kita akan menjalankan mesin itu, membalik cara kerjanya, lalu menemukan deretan yang mustahil.")
b("k3",0,"kait_judul","Setelah menonton video ini, kamu bisa mengenali salah satu struktur data terpenting dalam informatika, yaitu stack, hanya dari perilakunya.",1.2)
# 1 Pengantar
b("bab1",1,"bab","",0.9)
b("i2",1,"sumber","Soal di video ini berasal dari OSN-K Informatika tahun dua ribu dua puluh lima jenjang SMA, yaitu soal nomor sebelas, dua belas, dan tiga belas, yang berjudul Mesin BCS. Soal ini disusun oleh Tim Olimpiade Komputer Indonesia.")
b("i3",1,"alur","Ketiga soal ini memakai satu mesin yang sama. Kita pahami mesinnya dulu, lalu kita kerjakan soalnya satu per satu. Setiap soal punya waktu untuk kamu coba sendiri.",0.9)
# 2 Mesin BCS
b("bab2",2,"bab","",0.9)
b("m1",2,"m_tabung","Pak Dengklek punya sebuah mesin ajaib. Salah satu bagiannya berbentuk tabung, dan tabung itu hanya bisa dibuka dari atas. Pak Dengklek juga punya beberapa koin yang bernomor satu, dua, tiga, dan seterusnya.",tag="SOAL")
b("m2",2,"m_tombol","Mesin ini punya tiga tombol. Tombol B artinya buka. Saat tombol B ditekan, Pak Dengklek memasukkan koin bernomor terkecil yang belum pernah ia masukkan ke dalam tabung.",tag="SOAL",tombol="B")
b("m3",2,"m_tombol","Tombol C artinya cetak. Saat tombol C ditekan, mesin mencetak nomor koin yang berada paling atas di tabung. Lalu, koin itu dikeluarkan dan tidak dipakai lagi.",tag="SOAL",tombol="C")
b("m4",2,"m_tombol","Tombol S artinya stop. Tombol ini ditekan paling akhir, saat tabung sudah kosong. Lalu, mesin mengeluarkan kertas berisi semua nomor yang dicetak, berderet tanpa spasi.",tag="SOAL",tombol="S")
b("m5",2,"mesin","Contohnya, Pak Dengklek punya empat koin dan menekan tombol B, B, C, B, B, C, C, C, lalu S. Mari kita jalankan bersama.",tag="CONTOH",seq=EX,n=4,off=0,keys=[],intro=True)
b("m6",2,"mesin","Tombol B pertama memasukkan koin satu, dan tombol B kedua memasukkan koin dua di atasnya. Lalu, tombol C mencetak koin paling atas, yaitu dua.",tag="CONTOH",seq=EX,n=4,off=0,keys=[["memasukkan",1],["memasukkan",2],["mencetak",1]])
b("m7",2,"mesin","Berikutnya, dua tombol B memasukkan koin tiga dan koin empat. Sekarang, isi tabung dari bawah ke atas adalah satu, tiga, dan empat.",tag="CONTOH",seq=EX,n=4,off=3,keys=[["tiga",1],["empat",1]])
b("m8",2,"mesin","Tiga tombol C mencetak empat, lalu tiga, lalu satu. Tabung sudah kosong, dan tombol S mengeluarkan kertas bertuliskan dua, empat, tiga, satu.",tag="CONTOH",seq=EX,n=4,off=5,keys=[["empat",1],["tiga",2],["satu",1],["S",1]])
b("m9",2,"m_kunci","Perhatikan satu hal penting. Koin yang masuk paling akhir selalu keluar paling dulu, karena hanya koin paling atas yang bisa dicetak.",1.0,tag="KUNCI")
# 3 Soal 11
b("bab3",3,"bab","",0.9)
b("a1",3,"soal_seq","Soal nomor sebelas. Pak Dengklek punya enam koin, dan ia menekan tombol B, B, C, B, C, B, B, C, C, C, B, C, lalu S. Apa isi kertas hasil cetakannya?",0.8,tag="SOAL 11",seq=Q11,n=6)
b("a2",3,"coba","Coba jalankan mesinnya di kertas. Pause videonya kalau perlu.",8.5,countdown=8,tag="COBA DULU",soal=11)
b("a3",3,"mesin","Kita jalankan pelan-pelan. B, B memasukkan koin satu dan dua. Tombol C mencetak dua. Lalu, B memasukkan koin tiga, dan C langsung mencetaknya.",tag="PEMBAHASAN",seq=Q11,n=6,off=0,keys=[["satu",1],["dua",1],["mencetak",1],["tiga",1],["mencetak",2]])
b("a4",3,"mesin","Berikutnya, B, B memasukkan koin empat dan lima. Tiga tombol C mencetak lima, empat, lalu satu, karena koin satu sudah menunggu di dasar tabung sejak awal.",tag="PEMBAHASAN",seq=Q11,n=6,off=5,keys=[["empat",1],["lima",1],["lima",2],["empat",2],["satu",1]])
b("a5",3,"mesin","Terakhir, B memasukkan koin enam, C mencetaknya, dan S mengeluarkan kertas.",tag="PEMBAHASAN",seq=Q11,n=6,off=10,keys=[["enam",1],["mencetaknya",1],["mengeluarkan",1]])
b("a6",3,"jawab11","Jadi, isi kertasnya adalah dua, tiga, lima, empat, satu, enam. Jebakannya ada pada koin satu. Koin ini masuk paling awal, tetapi baru keluar setelah semua koin di atasnya dicetak.",1.0,tag="JAWABAN")
# 4 Soal 12
b("bab4",4,"bab","",0.9)
b("b1",4,"soal12","Soal nomor dua belas membalik pertanyaannya. Pak Dengklek punya sembilan koin, dan kertasnya berisi lima, empat, tiga, enam, dua, delapan, sembilan, tujuh, satu. Tombol apa saja yang ia tekan, dan dalam urutan apa?",0.8,tag="SOAL 12")
b("b2",4,"coba","Coba susun urutan tombolnya dulu. Pause videonya kalau perlu.",8.5,countdown=8,tag="COBA DULU",soal=12)
b("b3",4,"aturan","Kita pakai satu aturan sederhana. Untuk setiap nomor di kertas, tekan B sampai koin itu masuk ke tabung. Setelah koin itu berada paling atas, tekan C.",tag="PEMBAHASAN")
b("b4",4,"mesin","Nomor pertama adalah lima. Kita tekan B lima kali untuk memasukkan koin satu sampai lima, lalu C mencetak lima. Koin empat dan tiga sudah di atas, jadi C, C mencetak empat dan tiga.",tag="PEMBAHASAN",seq=Q12,n=9,off=0,target="543628971",keys=[["memasukkan",1,5],["mencetak",1],["empat",2],["tiga",2]])
b("b5",4,"mesin","Nomor berikutnya enam. Koin enam belum masuk, jadi kita tekan B, lalu C. Setelah itu, nomor dua sudah berada paling atas, jadi cukup tekan C.",tag="PEMBAHASAN",seq=Q12,n=9,off=8,target="543628971",keys=[["B",1],["C",1],["C",2]])
b("b6",4,"mesin","Untuk delapan, kita tekan B dua kali untuk memasukkan tujuh dan delapan, lalu C. Untuk sembilan, tekan B lalu C. Sisanya tujuh dan satu, yang keluar dengan C, C, lalu S.",tag="PEMBAHASAN",seq=Q12,n=9,off=11,target="543628971",keys=[["tujuh",1],["delapan",2],["C",1],["B",2],["C",2],["C",3],["C",4],["S",1]])
b("b7",4,"jawab12","Jadi, urutan tombolnya adalah lima B, tiga C, B, dua C, dua B, C, B, tiga C, lalu S. Totalnya sembilan belas tombol, yaitu dua kali sembilan ditambah satu, sesuai aturan soal.",1.0,tag="JAWABAN")
# 5 Soal 13
b("bab5",5,"bab","",0.9)
b("c1",5,"pilihan","Soal nomor tiga belas. Pak Dengklek punya enam koin, dan ada lima kertas hasil cetakan di layar, yaitu pilihan A sampai E. Satu di antaranya tidak mungkin dihasilkan oleh mesin BCS. Kertas manakah itu?",0.8,tag="SOAL 13",mode="tanya")
b("c2",5,"coba","Coba periksa kelima kertas itu. Pause videonya kalau perlu.",8.5,countdown=8,tag="COBA DULU",soal=13)
b("c3",5,"pilihan","Kita pakai aturan yang sama seperti soal dua belas. Kalau aturan itu bisa berjalan sampai akhir, kertasnya mungkin. Kalau nomor yang kita cari tertutup koin lain, kertasnya mustahil.",tag="PEMBAHASAN",mode="aturan")
b("c4",5,"pilihan","Pilihan A, B, C, dan E bisa dijalankan sampai selesai. Misalnya, pilihan E yang berisi satu sampai enam cukup memakai B lalu C sebanyak enam kali.",tag="PEMBAHASAN",mode="cek")
b("c5",5,"mesin","Sekarang, pilihan D berisi lima, tiga, empat, enam, dua, satu. Untuk mencetak lima, kita masukkan koin satu sampai lima, lalu C. Isi tabung sekarang satu, dua, tiga, empat, dengan empat paling atas.",tag="PEMBAHASAN",seq=DD,n=6,off=0,target="534621",keys=[["masukkan",1,5],["C",1]])
b("c6",5,"macet","Nomor berikutnya di kertas adalah tiga. Tetapi, koin tiga tertutup oleh koin empat, dan mesin hanya bisa mencetak koin paling atas. Jadi, kertas D tidak mungkin dihasilkan.",tag="PEMBAHASAN")
b("c7",5,"jawab13","Jawaban soal tiga belas adalah D. Pola umumnya begini. Setelah sebuah nomor besar dicetak, nomor-nomor kecil yang masih di tabung harus keluar dari yang terbesar ke yang terkecil.",1.0,tag="JAWABAN")
# 6 Konsep
b("bab6",6,"bab","",0.9)
b("s1",6,"stack","Mesin BCS sebenarnya adalah sebuah stack, atau tumpukan. Stack hanya punya dua operasi utama, yaitu push untuk menaruh data di atas, dan pop untuk mengambil data paling atas.",tag="KONSEP")
b("s2",6,"lifo","Aturan ini disebut LIFO, singkatan dari last in, first out, yang artinya masuk terakhir, keluar pertama. Tombol B adalah push, dan tombol C adalah pop.",tag="KONSEP")
b("s3",6,"sehari","Kamu memakai stack setiap hari. Tombol undo di aplikasi membatalkan langkah terakhir dulu, dan tombol kembali di browser membuka halaman yang terakhir kamu kunjungi.",1.0,tag="KONSEP")
# 7 Penutup
b("bab7",7,"bab","",0.9)
b("t1",7,"skor","Mari kita ulang ketiga jawabannya. Soal sebelas, dua tiga lima empat satu enam. Soal dua belas, sembilan belas tombol yang diakhiri S. Soal tiga belas, D.",1.0)
b("t2",7,"kredit","Soal-soal ini berasal dari OSN-K Informatika tahun dua ribu dua puluh lima, nomor sebelas sampai tiga belas, yang berjudul Mesin BCS. Terima kasih kepada Tim Olimpiade Komputer Indonesia yang telah menyusunnya.")
b("t3",7,"akhir","Coba buat sendiri satu kertas yang mustahil untuk lima koin, lalu tulis di kolom komentar. Sampai jumpa di soal berikutnya!",3.0)
S={"episode":"ON03","title":"Mesin BCS","label":"Bedah Soal OSN-K Informatika","kind":"osn","tanpa_waktu_baca":True,
 "osn":{"tahun":"2025","tingkat":"Kabupaten/Kota","jenjang":"SMA","nomor":"11–13","judul":"Mesin BCS","penyusun":"Tim Olimpiade Komputer Indonesia (TOKI)","jawaban":"235416; BBBBBCCCBCCBBCBCCCS; D","sumber":[{"tahun":"2025","nomor":[11,12,13],"judul":"Mesin BCS"}]},
 "coba":{"11":["B B C B C B B C C C B C S · enam koin","Apa isi kertas hasil cetakannya?"],"12":["kertas 5 4 3 6 2 8 9 7 1 · sembilan koin","Tombol apa saja, dalam urutan apa?"],"13":["lima kertas A sampai E · enam koin","Kertas mana yang mustahil?"]},
 "kunci":[["SOAL 11","Jalankan mesinnya","235416","dua"],["SOAL 12","Balik arah","19 tombol, diakhiri S","sembilan"],["SOAL 13","Yang mustahil","D","D"]],
 "kredit":[["“Mesin BCS”","OSN-K Informatika 2025 · SMA · No. 11–13"]],
 "berikut":"Lipat Kode: teka-teki kuno di balik sebuah program",
 "alur":[["Pahami mesinnya","tiga tombol, satu tabung"],["Kerjakan soalnya","nomor 11, 12, dan 13"],["Coba sendiri","pause, lalu bahas bersama"]],"alurJudul":"Satu mesin, tiga soal","alurKeys":[["pahami",1],["kerjakan",1],["coba",1]],
 "ajakan":"Tulis kertas mustahilmu di kolom komentar",
 "engine":["../_inti/osn-core.js","../_inti/osn-umum.js","scenes.js"],"parts":{"ON03":{"segs":[0,1,2,3,4,5,6,7]}},
 "segments":["Kait","Pengantar","Mesin BCS","Soal 11 · Jalankan mesinnya","Soal 12 · Balik arah","Soal 13 · Yang mustahil","Konsep · Stack","Penutup"],
 "tags":["KAIT","PENGANTAR","SOAL","SOAL 11","SOAL 12","SOAL 13","KONSEP","PENUTUP"],"recap":[],"next":{},"beats":B}
json.dump(S,open("script.json","w"),ensure_ascii=False,indent=1)
segn=S["segments"]; out=["# Naskah ON03 Mesin BCS (Stack)",""]; cur=-1
for x in B:
    if x["seg"]!=cur: cur=x["seg"]; out+=[f"## {cur}. {segn[cur]}",""]
    if x["text"]: out+=[x["text"],""]
open("naskah.md","w").write("\n".join(out))
print(len(B), sum(len(x["text"]) for x in B))
