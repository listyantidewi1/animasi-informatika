"""Sumber naskah ON04 -> script.json (dan naskah.md untuk Claude Doc)."""
import json
B=[]
def b(id,seg,scene,text,hold=0.6,**k): B.append(dict(id=id,seg=seg,scene=scene,text=text,hold=hold,**k))
# 0 Kait
b("k1",0,"kait_lingkar","Empat puluh satu orang duduk melingkar. Mulai dari kursi nomor satu, setiap orang kedua harus keluar dari lingkaran, terus berputar sampai tersisa satu orang. Di kursi nomor berapa kamu harus duduk supaya menjadi yang terakhir?")
b("k2",0,"kait_kode","Jawabannya ternyata bisa dihitung oleh potongan kode C++ yang hanya beberapa baris. Kode itu muncul di soal OSN-K, dan di video ini kita akan membongkarnya sampai tuntas.")
b("k3",0,"kait_judul","Setelah menonton video ini, kamu bisa menelusuri fungsi rekursif tanpa komputer, dan menemukan pola tersembunyi lewat bilangan biner.",1.2)
# 1 Pengantar
b("bab1",1,"bab","",0.9)
b("i1",1,"tahap","Halo, selamat datang di Bedah Soal OSN-K Informatika. OSN-K adalah Olimpiade Sains Nasional tingkat kabupaten dan kota, yaitu babak pertama sebelum tingkat provinsi dan tingkat nasional.")
b("i2",1,"sumber","Soal di video ini berasal dari OSN-K Informatika tahun dua ribu dua puluh enam jenjang SMA, yaitu soal nomor tiga puluh lima, tiga puluh enam, dan tiga puluh tujuh, yang berjudul Lipat Kode. Soal ini disusun oleh Tim Olimpiade Komputer Indonesia.")
b("i3",1,"alur","Ketiga soal ini memakai potongan kode yang sama. Kita pahami kodenya dulu, lalu kita kerjakan soalnya satu per satu. Setiap soal punya waktu untuk kamu coba sendiri.",0.9)
# 2 Kode
b("bab2",2,"bab","",0.9)
b("p1",2,"kode","Soal ini memberikan empat fungsi dalam bahasa C++, yaitu Lipat, Kode, Tunggal, dan Ganda. Kita baca satu per satu, mulai dari yang paling kecil.",tag="SOAL",fokus="semua")
b("p2",2,"kode","Fungsi Lipat menerima sebuah bilangan n. Kalau n sama dengan satu, fungsi ini mengembalikan satu. Kalau tidak, ia memanggil dirinya sendiri dengan n dibagi dua, lalu hasilnya dikali dua.",tag="SOAL",fokus="LIPAT")
b("p3",2,"kode","Perhatikan bahwa n bertipe integer. Jadi, sisa pembagian dibuang. Misalnya, lima dibagi dua hasilnya dua, bukan dua koma lima.",tag="SOAL",fokus="LIPAT",bagi=True)
b("p4",2,"kode","Fungsi Kode memakai hasil Lipat. Rumusnya adalah dua kali, n dikurangi Lipat n, lalu ditambah satu.",tag="SOAL",fokus="KODE")
b("p5",2,"kode","Fungsi Tunggal menjumlahkan Kode dari satu sampai n. Fungsi Ganda sedikit berbeda. Untuk setiap i, ia menerapkan Kode berulang kali sebanyak k kali, lalu menjumlahkan hasil akhirnya.",tag="SOAL",fokus="TG")
# 3 Soal 35
b("bab3",3,"bab","",0.9)
b("a1",3,"soal_tanya","Soal nomor tiga puluh lima. Berapakah nilai kembalian dari pemanggilan Kode empat puluh satu?",0.8,tag="SOAL 35",soal=35)
b("a2",3,"coba","Coba telusuri kodenya di kertas. Pause videonya kalau perlu.",8.5,countdown=8,tag="COBA DULU",soal=35)
b("a3",3,"lipat_trace","Kode empat puluh satu membutuhkan Lipat empat puluh satu. Lipat empat puluh satu memanggil Lipat dua puluh, lalu Lipat sepuluh, Lipat lima, Lipat dua, dan akhirnya Lipat satu.",tag="PEMBAHASAN",mode="turun")
b("a4",3,"lipat_trace","Lipat satu adalah base case, jadi hasilnya langsung satu. Lalu, setiap tingkat di atasnya mengalikan dengan dua. Hasilnya dua, empat, delapan, enam belas, dan tiga puluh dua.",tag="PEMBAHASAN",mode="naik")
b("a5",3,"lipat_pola","Jadi, Lipat n selalu menghasilkan pangkat dua terbesar yang tidak melebihi n. Untuk empat puluh satu, hasilnya tiga puluh dua, karena enam puluh empat sudah terlalu besar.",tag="PEMBAHASAN")
b("a6",3,"jawab35","Sekarang, Kode empat puluh satu sama dengan dua kali, empat puluh satu dikurangi tiga puluh dua, ditambah satu. Empat puluh satu dikurangi tiga puluh dua adalah sembilan. Dua kali sembilan adalah delapan belas, dan ditambah satu menjadi sembilan belas.",tag="PEMBAHASAN")
b("a7",3,"jawab35","Jadi, jawaban soal tiga puluh lima adalah sembilan belas. Ingat angka ini, karena nanti ia akan muncul lagi.",1.0,tag="JAWABAN",akhir=True)
# 4 Soal 36
b("bab4",4,"bab","",0.9)
b("b1",4,"soal_tanya","Soal nomor tiga puluh enam. Berapakah nilai kembalian dari pemanggilan Tunggal enam puluh tiga? Artinya, kita perlu menjumlahkan Kode satu, Kode dua, dan seterusnya, sampai Kode enam puluh tiga.",0.8,tag="SOAL 36",soal=36)
b("b2",4,"coba","Coba cari polanya dulu. Pause videonya kalau perlu.",8.5,countdown=8,tag="COBA DULU",soal=36)
b("b3",4,"tabel36","Menghitung enam puluh tiga nilai satu per satu tentu melelahkan. Jadi, kita tulis beberapa nilai pertama, lalu kita cari polanya.",tag="PEMBAHASAN",mode="isi")
b("b4",4,"tabel36","Kode satu adalah satu. Kode dua dan tiga adalah satu dan tiga. Kode empat sampai tujuh adalah satu, tiga, lima, dan tujuh. Setiap kali n mencapai pangkat dua yang baru, nilainya kembali ke satu, lalu naik dua demi dua.",tag="PEMBAHASAN",mode="kelompok")
b("b5",4,"tabel36","Sekarang, jumlahkan tiap kelompok. Kelompok pertama jumlahnya satu. Satu ditambah tiga sama dengan empat. Satu, tiga, lima, dan tujuh jumlahnya enam belas. Jumlah bilangan ganjil berurutan dari satu selalu berupa bilangan kuadrat.",tag="PEMBAHASAN",mode="jumlah")
b("b6",4,"jumlah36","Bilangan satu sampai enam puluh tiga terbagi menjadi enam kelompok. Jumlah tiap kelompok adalah satu, empat, enam belas, enam puluh empat, dua ratus lima puluh enam, dan seribu dua puluh empat.",tag="PEMBAHASAN")
b("b7",4,"jumlah36","Jadi, Tunggal enam puluh tiga sama dengan seribu tiga ratus enam puluh lima. Itulah jawaban soal tiga puluh enam.",1.0,tag="JAWABAN",akhir=True)
# 5 Soal 37
b("bab5",5,"bab","",0.9)
b("c1",5,"soal_tanya","Soal nomor tiga puluh tujuh. Berapakah nilai kembalian dari pemanggilan Ganda enam puluh tiga, enam puluh empat juta enam ratus lima puluh enam ribu enam ratus enam puluh tujuh? Artinya, setiap bilangan dari satu sampai enam puluh tiga dikenai Kode lebih dari enam puluh juta kali.",0.8,tag="SOAL 37",soal=37)
b("c2",5,"coba","Jangan langsung menyerah melihat angka sebesar itu. Pause videonya, lalu coba terapkan Kode berkali-kali pada satu bilangan.",8.5,countdown=8,tag="COBA DULU",soal=37)
b("c3",5,"iterasi","Mari kita coba pada empat puluh satu. Kode empat puluh satu adalah sembilan belas. Kode sembilan belas adalah tujuh. Kode tujuh adalah tujuh lagi. Setelah itu, nilainya tidak pernah berubah.",tag="PEMBAHASAN",mode="desimal")
b("c4",5,"iterasi","Rahasianya terlihat jelas dalam bilangan biner. Empat puluh satu ditulis satu, nol, satu, nol, nol, satu. Kode memindahkan angka satu paling depan ke paling belakang, sehingga menjadi satu, nol, nol, satu, satu, yaitu sembilan belas.",tag="PEMBAHASAN",mode="biner")
b("c5",5,"iterasi","Angka nol yang berada di depan ikut hilang. Lama-lama, semua nol habis, dan yang tersisa hanya deretan angka satu. Empat puluh satu punya tiga angka satu, jadi ujungnya adalah satu, satu, satu, yaitu tujuh.",tag="PEMBAHASAN",mode="ujung")
b("c6",5,"pola37","Karena itu, setiap bilangan akhirnya berhenti di deretan angka satu yang panjangnya sama dengan banyaknya angka satu di bilangan itu. Untuk bilangan sampai enam puluh tiga, enam putaran sudah cukup. Jadi, puluhan juta putaran tidak mengubah apa pun.",tag="PEMBAHASAN")
b("c7",5,"tabel37","Sekarang, kita kelompokkan bilangan satu sampai enam puluh tiga berdasarkan banyaknya angka satu. Ada enam bilangan dengan satu angka satu, lima belas dengan dua, dua puluh dengan tiga, lima belas dengan empat, enam dengan lima, dan satu bilangan dengan enam.",tag="PEMBAHASAN",mode="hitung")
b("c8",5,"tabel37","Jumlahnya adalah enam kali satu, ditambah lima belas kali tiga, ditambah dua puluh kali tujuh, ditambah lima belas kali lima belas, ditambah enam kali tiga puluh satu, ditambah enam puluh tiga. Hasilnya enam ratus enam puluh lima.",tag="PEMBAHASAN",mode="jumlah")
b("c9",5,"jawab37","Jadi, jawaban soal tiga puluh tujuh adalah enam ratus enam puluh lima. Pelajarannya, angka yang sangat besar di soal sering kali hanya jebakan, karena prosesnya sudah berhenti jauh sebelum itu.",1.0,tag="JAWABAN")
# 6 Konsep
b("bab6",6,"bab","",0.9)
b("s1",6,"josephus","Sekarang, kita kembali ke empat puluh satu orang di awal video. Kalau setiap orang kedua keluar, orang yang bertahan paling akhir duduk di kursi nomor sembilan belas. Itu sama persis dengan hasil Kode empat puluh satu.",tag="KONSEP")
b("s2",6,"josephus_nama","Teka-teki ini dikenal sebagai masalah Josephus, yang berasal dari sebuah kisah kuno. Fungsi Kode adalah rumus singkat untuk menjawabnya, tanpa perlu menyimulasikan lingkaran satu per satu.",tag="KONSEP")
b("s3",6,"rekursi","Fungsi Lipat juga mengajarkan satu ide penting, yaitu rekursi. Rekursi adalah fungsi yang memanggil dirinya sendiri dengan masalah yang lebih kecil, sampai bertemu base case yang jawabannya langsung diketahui.",tag="KONSEP")
b("s4",6,"biner_ide","Soal tiga puluh tujuh juga menunjukkan hal lain. Kalau sebuah proses terasa rumit, coba tulis bilangannya dalam bentuk biner, karena polanya sering langsung terlihat.",1.0,tag="KONSEP")
# 7 Penutup
b("bab7",7,"bab","",0.9)
b("t1",7,"skor","Mari kita ulang ketiga jawabannya. Jawaban soal tiga puluh lima adalah sembilan belas. Jawaban soal tiga puluh enam adalah seribu tiga ratus enam puluh lima. Jawaban soal tiga puluh tujuh adalah enam ratus enam puluh lima.",1.0)
b("t2",7,"kredit","Soal-soal ini berasal dari OSN-K Informatika tahun dua ribu dua puluh enam, nomor tiga puluh lima sampai tiga puluh tujuh, yang berjudul Lipat Kode. Terima kasih kepada Tim Olimpiade Komputer Indonesia yang telah menyusunnya.")
b("t3",7,"akhir","Coba hitung sendiri, di kursi nomor berapa orang terakhir duduk kalau ada seratus orang, lalu tulis jawabanmu di kolom komentar. Sampai jumpa di soal berikutnya!",3.0)
S={"episode":"ON04","title":"Lipat Kode","label":"Bedah Soal OSN-K Informatika","kind":"osn","tanpa_waktu_baca":True,
 "osn":{"tahun":"2026","tingkat":"Kabupaten/Kota","jenjang":"SMA","nomor":"35–37","judul":"Lipat Kode","penyusun":"Tim Olimpiade Komputer Indonesia (TOKI)","jawaban":"19; 1365; 665","sumber":[{"tahun":"2026","nomor":[35,36,37],"judul":"Lipat Kode"}]},
 "coba":{"35":["LIPAT(41) → … → KODE(41)","Berapa nilai KODE(41)?"],"36":["KODE(1) + KODE(2) + … + KODE(63)","Berapa nilai TUNGGAL(63)?"],"37":["KODE diulang 64.656.667 kali untuk tiap i","Berapa nilai GANDA(63, 64656667)?"]},
 "kunci":[["SOAL 35","KODE(41)","19","sembilan"],["SOAL 36","TUNGGAL(63)","1365","seribu"],["SOAL 37","GANDA(63, 64656667)","665","ratus",2]],
 "kredit":[["“Lipat Kode”","OSN-K Informatika 2026 · SMA · No. 35–37"]],
 "berikut":"Papan Lampu",
 "alur":[["Pahami kodenya","empat fungsi C++"],["Kerjakan soalnya","nomor 35, 36, dan 37"],["Coba sendiri","pause, lalu bahas bersama"]],"alurJudul":"Satu kode, tiga soal","alurKeys":[["pahami",1],["kerjakan",1],["coba",1]],
 "ajakan":"Kursi nomor berapa untuk 100 orang? Tulis di komentar",
 "engine":["../_inti/osn-core.js","../_inti/osn-umum.js","scenes.js"],"parts":{"ON04":{"segs":[0,1,2,3,4,5,6,7]}},
 "segments":["Kait","Pengantar","Kode C++","Soal 35 · KODE(41)","Soal 36 · TUNGGAL(63)","Soal 37 · GANDA","Konsep · Josephus dan rekursi","Penutup"],
 "tags":["KAIT","PENGANTAR","SOAL","SOAL 35","SOAL 36","SOAL 37","KONSEP","PENUTUP"],"recap":[],"next":{},"beats":B}
json.dump(S,open("script.json","w"),ensure_ascii=False,indent=1)
segn=S["segments"]; out=["# Naskah ON04 Lipat Kode",""]; cur=-1
for x in B:
    if x["seg"]!=cur: cur=x["seg"]; out+=[f"## {cur}. {segn[cur]}",""]
    if x["text"]: out+=[x["text"],""]
open("naskah.md","w").write("\n".join(out))
print(len(B), sum(len(x["text"]) for x in B))
