"""Sumber naskah ON09 -> script.json (dan naskah.md untuk Claude Doc)."""
import json
B=[]
def b(id,seg,scene,text,hold=0.6,**k): B.append(dict(id=id,seg=seg,scene=scene,text=text,hold=hold,**k))
K="kartu"; G="graf"
# 0 Kait
b("k1",0,K,"Pak Dengklek punya dua puluh enam kartu ajaib, berisi huruf A sampai Z. Setiap kali ia menjentikkan jari, semua huruf di kartu berubah sekaligus, mengikuti sebuah tabel. Setelah tiga puluh tiga kali jentik, huruf apa yang ada di kartu kesepuluh?",mode="kait")
b("k2",0,K,"Bagaimana kalau ia menjentikkan jari tiga ratus tiga puluh tiga ribu tiga ratus tiga puluh tiga kali? Kita tidak perlu menjentikkannya satu per satu. Ternyata, angka sebesar itu sama saja dengan tiga kali jentik.",mode="besar")
b("k3",0,"kait_judul","Setelah menonton video ini, kamu bisa menebak hasil sebuah aturan yang diulang ratusan ribu kali, memakai siklus dan sisa bagi.",1.2)
# 1 Pengantar
b("bab1",1,"bab","",0.9)
b("i2",1,"sumber","Soal di video ini berasal dari OSN-K Informatika tahun dua ribu dua puluh lima jenjang SMA, yaitu soal nomor dua puluh, dua puluh satu, dan dua puluh dua, yang berjudul Kartu Huruf Ajaib. Soal ini disusun oleh Tim Olimpiade Komputer Indonesia.")
b("i3",1,"alur","Ketiga soal ini memakai cerita yang sama. Kita pahami ceritanya dulu, lalu kita kerjakan soalnya satu per satu. Setiap soal punya waktu untuk kamu coba sendiri.",0.9)
# 2 Soal
b("bab2",2,"bab","",0.9)
b("q1",2,K,"Pak Dengklek punya dua puluh enam kartu ajaib yang berisi huruf. Pada awalnya, kartu pertama berisi huruf A, kartu kedua berisi huruf B, dan seterusnya, sampai kartu kedua puluh enam yang berisi huruf Z.",tag="SOAL",mode="kartu")
b("q2",2,K,"Setiap kali Pak Dengklek menjentikkan jari, isi semua kartu berubah sekaligus. Aturannya ada di tabel ini. Misalnya, huruf A berubah menjadi B, huruf B menjadi C, dan huruf C berubah kembali menjadi B.",tag="SOAL",mode="tabel")
b("q3",2,K,"Jadi, setelah satu kali jentik, kartu pertama berisi B, kartu kedua berisi C, dan kartu ketiga berisi B. Semua kartu berubah pada saat yang sama, memakai tabel yang sama.",tag="SOAL",mode="jentik")
b("q4",2,K,"Kalau terus dijentik, isi kartu pertama menjadi B, lalu C, lalu B, lalu C lagi, dan seterusnya. Isinya mulai berulang.",tag="SOAL",mode="contoh")
b("q5",2,K,"Ketiga soal menanyakan isi kartu setelah banyak sekali jentikan, yaitu tiga puluh tiga kali, tiga ribu tiga ratus tiga puluh tiga kali, dan tiga ratus tiga puluh tiga ribu tiga ratus tiga puluh tiga kali.",tag="SOAL",mode="tanya")
# 3 Soal 20
b("bab3",3,"bab","",0.9)
b("a1",3,K,"Soal nomor dua puluh. Pak Dengklek menjentikkan jari tiga puluh tiga kali. Huruf apa yang ada di kartu kesepuluh pada akhirnya?",0.8,tag="SOAL 20",mode="soal",soal=20)
b("a2",3,"coba","Coba hitung sendiri dulu. Pause videonya kalau perlu.",8.5,countdown=8,tag="COBA DULU",soal=20)
b("a3",3,K,"Kartu kesepuluh mula-mula berisi huruf J. Kita ikuti tabelnya. J menjadi E, lalu E menjadi F. Setelah itu, F menjadi H, H menjadi I, dan I kembali menjadi F.",tag="PEMBAHASAN",mode="rantai")
b("a4",3,K,"Setelah dua jentikan, kartu ini masuk ke putaran F, H, I yang terus berulang. Putaran seperti ini disebut siklus, dan panjang siklus ini adalah tiga.",tag="PEMBAHASAN",mode="putar")
b("a5",3,K,"Masih ada tiga puluh tiga kurang dua, yaitu tiga puluh satu jentikan. Tiga puluh satu dibagi tiga sisanya satu. Jadi, dari F kita maju satu langkah, dan sampai di H. Jawaban soal dua puluh adalah H.",1.0,tag="JAWABAN",mode="sisa")
# 4 Soal 21
b("bab4",4,"bab","",0.9)
b("b1",4,K,"Soal nomor dua puluh satu. Pak Dengklek menjentikkan jari tiga ribu tiga ratus tiga puluh tiga kali, lalu melihat semua kartunya. Ada berapa huruf berbeda yang terlihat?",0.8,tag="SOAL 21",mode="soal",soal=21)
b("b2",4,"coba","Coba hitung sendiri dulu. Pause videonya kalau perlu.",8.5,countdown=8,tag="COBA DULU",soal=21)
b("b3",4,G,"Sekarang kita gambar semua aturan sebagai panah. Setiap huruf punya tepat satu panah keluar. Ternyata, ada empat siklus, dengan panjang dua, tiga, tiga, dan lima.",tag="PEMBAHASAN",spec="b3")
b("b4",4,G,"Huruf lainnya membentuk ekor yang masuk ke salah satu siklus. Ekor terpanjang dimulai dari R, lalu ke Q, ke P, dan masuk ke T. Jadi, setelah tiga jentikan, semua kartu pasti sudah berada di dalam siklus.",tag="PEMBAHASAN",spec="b4")
b("b5",4,G,"Di dalam siklus, kartu-kartu hanya berputar. Kartu yang memang berawal di siklus itu menempati semua hurufnya, jadi setiap huruf siklus selalu terlihat. Sebaliknya, huruf di ekor tidak pernah muncul lagi.",tag="PEMBAHASAN",spec="b5")
b("b6",4,G,"Jadi, huruf yang terlihat adalah semua huruf siklus, yaitu dua ditambah tiga ditambah tiga ditambah lima, sama dengan tiga belas. Jawaban soal dua puluh satu adalah tiga belas.",1.0,tag="JAWABAN",spec="b6")
# 5 Soal 22
b("bab5",5,"bab","",0.9)
b("c1",5,K,"Soal nomor dua puluh dua. Pak Dengklek menjentikkan jari tiga ratus tiga puluh tiga ribu tiga ratus tiga puluh tiga kali. Huruf apa yang paling banyak muncul? Kalau ada beberapa, pilih yang paling awal menurut abjad.",0.8,tag="SOAL 22",mode="soal",soal=22)
b("c2",5,"coba","Coba hitung sendiri dulu. Pause videonya kalau perlu.",8.5,countdown=8,tag="COBA DULU",soal=22)
b("c3",5,G,"Siklus-siklus tadi panjangnya dua, tiga, dan lima. Setelah tiga puluh jentikan, setiap siklus kembali ke posisi semula, karena tiga puluh adalah KPK dari dua, tiga, dan lima.",tag="PEMBAHASAN",spec="c3")
b("c4",5,K,"Tiga ratus tiga puluh tiga ribu tiga ratus tiga puluh tiga dibagi tiga puluh sisanya tiga. Jadi, hasilnya sama dengan menjentikkan jari tiga kali saja! Perhatikan juga, tiga puluh tiga dan tiga ribu tiga ratus tiga puluh tiga juga bersisa tiga.",tag="PEMBAHASAN",mode="sisa30")
b("c5",5,K,"Mari kita jentik tiga kali untuk semua kartu. Baris bawah ini adalah isi kartu setelah tiga jentikan.",tag="PEMBAHASAN",mode="tiga")
b("c6",5,K,"Sekarang kita hitung. Huruf T muncul empat kali, dan tidak ada huruf lain yang muncul lebih dari tiga kali. Jawaban soal dua puluh dua adalah T.",1.0,tag="JAWABAN",mode="hitung")
# 6 Konsep
b("bab6",6,"bab","",0.9)
b("s1",6,"konsep_fungsi","Aturan seperti ini disebut fungsi, karena setiap huruf punya tepat satu tujuan. Kalau kita mengikuti panahnya terus, kita pasti melewati ekor, lalu masuk ke sebuah siklus.",tag="KONSEP")
b("s2",6,"konsep_langkah","Triknya ada dua langkah. Pertama, jalankan sampai ekornya habis. Kedua, sisa langkahnya cukup dihitung dengan sisa bagi panjang siklus.",tag="KONSEP")
b("s3",6,"konsep_pakai","Trik yang sama bisa menjawab soal lain, misalnya angka terakhir dari tiga pangkat seratus. Angka terakhirnya berputar tiga, sembilan, tujuh, satu, dengan panjang siklus empat. Seratus dibagi empat sisanya nol, jadi angka terakhirnya satu.",1.0,tag="KONSEP")
# 7 Penutup
b("bab7",7,"bab","",0.9)
b("t1",7,"skor","Mari kita ulang ketiga jawabannya. Jawaban soal dua puluh adalah H. Jawaban soal dua puluh satu adalah tiga belas. Jawaban soal dua puluh dua adalah T.",1.0)
b("t2",7,"kredit","Soal-soal ini berasal dari OSN-K Informatika tahun dua ribu dua puluh lima, nomor dua puluh sampai dua puluh dua, yang berjudul Kartu Huruf Ajaib. Terima kasih kepada Tim Olimpiade Komputer Indonesia yang telah menyusunnya.")
b("t3",7,"akhir","Coba pikirkan, setelah satu juta kali jentik, huruf apa yang ada di kartu pertama? Tulis jawabanmu di kolom komentar. Sampai jumpa di soal berikutnya!",3.0)
S={"episode":"ON09","title":"Kartu Huruf Ajaib","label":"Bedah Soal OSN-K Informatika","kind":"osn","tanpa_waktu_baca":True,
 "osn":{"tahun":"2025","tingkat":"Kabupaten/Kota","jenjang":"SMA","nomor":"20–22","judul":"Kartu Huruf Ajaib","penyusun":"Tim Olimpiade Komputer Indonesia (TOKI)","jawaban":"H; 13; T","sumber":[{"tahun":"2025","nomor":[20,21,22],"judul":"Kartu Huruf Ajaib"}]},
 "coba":{"20":["33 kali jentik · kartu ke-10","Huruf apa isinya pada akhirnya?"],"21":["3.333 kali jentik · semua kartu","Berapa banyak huruf berbeda yang terlihat?"],"22":["333.333 kali jentik · semua kartu","Huruf apa yang paling banyak muncul?"]},
 "kunci":[["SOAL 20","33 jentik, kartu ke-10","H","h"],["SOAL 21","3.333 jentik","13","tiga"],["SOAL 22","333.333 jentik","T","t"]],
 "kredit":[["“Kartu Huruf Ajaib”","OSN-K Informatika 2025 · SMA · No. 20–22"]],
 "berikut":"Mondar-Mandir",
 "alur":[["Pahami ceritanya","kartu, jentikan, dan tabel"],["Kerjakan soalnya","nomor 20, 21, dan 22"],["Coba sendiri","pause, lalu bahas bersama"]],"alurJudul":"Satu cerita, tiga soal","alurKeys":[["pahami",1],["kerjakan",1],["coba",1]],
 "ajakan":"1.000.000 jentik: kartu pertama berisi apa? Tulis di komentar",
 "engine":["../_inti/osn-core.js","../_inti/osn-umum.js","scenes.js"],"parts":{"ON09":{"segs":[0,1,2,3,4,5,6,7]}},
 "segments":["Kait","Pengantar","Soal · Kartu Huruf Ajaib","Soal 20 · 33 kali jentik","Soal 21 · Huruf berbeda","Soal 22 · Huruf terbanyak","Konsep · Ekor dan siklus","Penutup"],
 "tags":["KAIT","PENGANTAR","SOAL","SOAL 20","SOAL 21","SOAL 22","KONSEP","PENUTUP"],"recap":[],"next":{},"beats":B}
json.dump(S,open("script.json","w"),ensure_ascii=False,indent=1)
segn=S["segments"]; out=["# Naskah ON09 Kartu Huruf Ajaib",""]; cur=-1
for x in B:
    if x["seg"]!=cur: cur=x["seg"]; out+=[f"## {cur}. {segn[cur]}",""]
    if x["text"]: out+=[x["text"],""]
open("naskah.md","w").write("\n".join(out))
print(len(B), sum(len(x["text"]) for x in B))
