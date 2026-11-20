"""Sumber naskah ON07 -> script.json (dan naskah.md untuk Claude Doc)."""
import json
B=[]
def b(id,seg,scene,text,hold=0.6,**k): B.append(dict(id=id,seg=seg,scene=scene,text=text,hold=hold,**k))
J="jadwal"
# 0 Kait
b("k1",0,J,"Pak Dengklek punya sepuluh hari untuk melatih tim olimpiadenya. Setiap hari ia memilih satu agenda, dan setiap agenda memberi poin yang berbeda. Agenda apa yang harus dipilih setiap hari, supaya total poinnya paling besar?",mode="kait")
b("k2",0,J,"Cara yang paling menggoda adalah memilih poin terbesar setiap hari. Ternyata, cara ini bisa menjebak. Satu pilihan di hari keempat, yang kelihatannya sama saja, bisa membuat totalmu berkurang tiga poin.",mode="rakus_kait")
b("k3",0,"kait_judul","Setelah menonton video ini, kamu bisa menyusun jadwal dengan poin terbesar memakai tabel pemrograman dinamis, dan tahu kapan cara rakus bisa menjebak.",1.2)
# 1 Pengantar
b("bab1",1,"bab","",0.9)
b("i2",1,"sumber","Soal di video ini berasal dari OSN-K Informatika tahun dua ribu dua puluh enam jenjang SMA, yaitu soal nomor empat belas, lima belas, dan enam belas, yang berjudul Jadwal Pembinaan Tim Olimpiade. Soal ini disusun oleh Tim Olimpiade Komputer Indonesia.")
b("i3",1,"alur","Ketiga soal ini memakai aturan yang sama. Kita pahami aturannya dulu, lalu kita kerjakan soalnya satu per satu. Setiap soal punya waktu untuk kamu coba sendiri.",0.9)
# 2 Soal
b("bab2",2,"bab","",0.9)
b("q1",2,J,"Pak Dengklek sedang melatih bebek-bebeknya untuk Tim Olimpiade Informatika. Pembinaannya berlangsung selama N hari, dan setiap hari ada tepat satu agenda. Pilihannya ada empat, yaitu latihan Teori, latihan Observasi, latihan Kompetisi, atau Istirahat.",tag="SOAL",mode="agenda")
b("q2",2,J,"Setiap latihan memberi poin manfaat, dan poinnya bisa berbeda setiap hari. Poin itu ditulis dalam sebuah tabel. Istirahat tidak memberi poin.",tag="SOAL",mode="tabel")
b("q3",2,J,"Supaya latihannya seimbang, ada aturan jeda. Setelah latihan Teori, selama A hari berikutnya tim tidak boleh latihan Teori lagi. Hal yang sama berlaku untuk Observasi dengan jeda B hari, dan untuk Kompetisi dengan jeda C hari.",tag="SOAL",mode="aturan")
b("q4",2,J,"Misalnya, C sama dengan dua. Kalau tim latihan Kompetisi di hari pertama, maka hari kedua dan hari ketiga tidak boleh Kompetisi. Kompetisi baru boleh lagi di hari keempat. Istirahat boleh dipakai untuk mengisi hari yang kosong.",tag="SOAL",mode="contoh")
b("q5",2,J,"Ada tiga soal, dan semuanya berlangsung selama sepuluh hari. Untuk setiap soal, kita mencari total poin manfaat yang paling besar.",tag="SOAL",mode="tanya")
# 3 Soal 14
b("bab3",3,"bab","",0.9)
b("a1",3,J,"Soal nomor empat belas. Setiap hari, Teori bernilai dua poin, Observasi tiga poin, dan Kompetisi lima poin. Semua jedanya satu hari. Berapa total poin maksimumnya?",0.8,tag="SOAL 14",mode="soal",soal=14)
b("a2",3,"coba","Coba hitung sendiri dulu. Pause videonya kalau perlu.",8.5,countdown=8,tag="COBA DULU",soal=14)
b("a3",3,J,"Kompetisi bernilai paling besar. Tetapi dengan jeda satu hari, Kompetisi tidak boleh dipilih dua hari berturut-turut.",tag="PEMBAHASAN",mode="a3")
b("a4",3,J,"Lihat dua hari yang berurutan. Paling banyak satu hari di antaranya berisi Kompetisi, dan hari yang lain paling baik berisi Observasi. Jadi, setiap pasang hari paling banyak bernilai lima ditambah tiga, yaitu delapan poin.",tag="PEMBAHASAN",mode="a4")
b("a5",3,J,"Sepuluh hari terbagi menjadi lima pasang, jadi totalnya paling banyak lima kali delapan, yaitu empat puluh. Jadwal Kompetisi, Observasi, Kompetisi, Observasi, dan seterusnya mencapai empat puluh. Jawaban soal empat belas adalah empat puluh.",1.0,tag="JAWABAN",mode="a5")
# 4 Soal 15
b("bab4",4,"bab","",0.9)
b("b1",4,J,"Soal nomor lima belas. Poinnya sama dengan soal empat belas, tetapi jedanya berbeda. Jeda Teori satu hari, jeda Observasi dua hari, dan jeda Kompetisi tiga hari. Berapa total poin maksimumnya?",0.8,tag="SOAL 15",mode="soal",soal=15)
b("b2",4,"coba","Coba hitung sendiri dulu. Pause videonya kalau perlu.",8.5,countdown=8,tag="COBA DULU",soal=15)
b("b3",4,J,"Dengan jeda tiga hari, dua Kompetisi harus berjarak paling sedikit empat hari. Dalam sepuluh hari, Kompetisi paling banyak tiga kali, misalnya di hari pertama, kelima, dan kesembilan.",tag="PEMBAHASAN",mode="b3")
b("b4",4,J,"Dengan jeda dua hari, Observasi paling banyak empat kali. Caranya hanya satu, yaitu di hari pertama, keempat, ketujuh, dan kesepuluh.",tag="PEMBAHASAN",mode="b4")
b("b5",4,J,"Masalahnya, setiap jadwal dengan tiga Kompetisi selalu memakai hari pertama atau hari kesepuluh. Jadi, tiga Kompetisi dan empat Observasi tidak mungkin dipakai bersamaan.",tag="PEMBAHASAN",mode="b5")
b("b6",4,J,"Coba tiga Kompetisi dan tiga Observasi. Empat hari sisanya diisi Teori, yang tidak boleh berturut-turut. Contohnya jadwal ini, dengan total lima belas ditambah sembilan ditambah delapan, yaitu tiga puluh dua.",tag="PEMBAHASAN",mode="b6")
b("b7",4,J,"Pilihan lain tidak lebih baik. Dengan empat Observasi, Kompetisi paling banyak dua kali, jadi totalnya paling banyak tiga puluh. Dengan tiga Kompetisi dan dua Observasi, totalnya paling banyak tiga puluh satu. Jawaban soal lima belas adalah tiga puluh dua.",1.0,tag="JAWABAN",mode="b7")
# 5 Soal 16
b("bab5",5,"bab","",0.9)
b("c1",5,J,"Soal nomor enam belas. Jeda semua latihan kembali satu hari, tetapi sekarang poinnya berubah setiap hari, seperti pada tabel ini. Berapa total poin maksimumnya?",0.8,tag="SOAL 16",mode="soal",soal=16)
b("c2",5,"coba","Coba hitung sendiri dulu. Pause videonya kalau perlu.",8.5,countdown=8,tag="COBA DULU",soal=16)
b("c3",5,J,"Cara rakus memilih poin terbesar yang boleh pada setiap hari. Di hari keempat, semua poin bernilai satu. Kalau kita memilih Observasi di hari itu, cara rakus berakhir dengan lima puluh tiga poin. Kalau kita memilih Teori, hasilnya lima puluh enam. Jadi, cara rakus tidak bisa dipercaya.",tag="PEMBAHASAN",mode="c3")
b("c4",5,J,"Supaya pasti benar, kita pakai tabel. Untuk setiap hari, kita simpan tiga angka, yaitu total terbesar kalau hari itu diakhiri dengan Teori, dengan Observasi, atau dengan Kompetisi.",tag="PEMBAHASAN",mode="dp")
b("c5",5,J,"Aturannya, angka hari ini sama dengan poin hari ini, ditambah angka terbesar kemarin dari latihan yang berbeda. Di hari pertama, angkanya dua, tiga, dan lima.",tag="PEMBAHASAN",mode="dp")
b("c6",5,J,"Di hari kedua, Teori bernilai dua ditambah lima, yaitu tujuh. Observasi bernilai tiga ditambah lima, yaitu delapan. Kompetisi bernilai lima ditambah tiga, yaitu delapan.",tag="PEMBAHASAN",mode="dp")
b("c7",5,J,"Kita lanjutkan dengan cara yang sama sampai hari kesepuluh. Istirahat tidak pernah dibutuhkan di sini, karena selalu ada latihan lain yang boleh dipilih.",tag="PEMBAHASAN",mode="dp")
b("c8",5,J,"Di hari kesepuluh, angka terbesar ada di Kompetisi, yaitu lima puluh enam. Kalau kita telusuri mundur, jadwalnya terlihat seperti ini. Jawaban soal enam belas adalah lima puluh enam.",1.0,tag="JAWABAN",mode="dp")
# 6 Konsep
b("bab6",6,"bab","",0.9)
b("s1",6,"konsep_rakus","Cara rakus hanya melihat hari ini. Kadang hasilnya benar, tetapi tidak ada jaminan, karena pilihan hari ini mengubah pilihan yang boleh diambil besok.",tag="KONSEP")
b("s2",6,"konsep_tabel","Pemrograman dinamis menyimpan beberapa kemungkinan terbaik sekaligus, satu untuk setiap latihan terakhir. Keputusan akhirnya baru diambil di hari terakhir.",tag="KONSEP")
b("s3",6,"konsep_mirip","Caranya mirip dengan menghitung rute di video Perjalanan ke Timur. Bedanya, di sana kita menjumlahkan banyak cara, sedangkan di sini kita mencari nilai yang terbesar.",1.0,tag="KONSEP")
# 7 Penutup
b("bab7",7,"bab","",0.9)
b("t1",7,"skor","Mari kita ulang ketiga jawabannya. Jawaban soal empat belas adalah empat puluh. Jawaban soal lima belas adalah tiga puluh dua. Jawaban soal enam belas adalah lima puluh enam.",1.0)
b("t2",7,"kredit","Soal-soal ini berasal dari OSN-K Informatika tahun dua ribu dua puluh enam, nomor empat belas sampai enam belas, yang berjudul Jadwal Pembinaan Tim Olimpiade. Terima kasih kepada Tim Olimpiade Komputer Indonesia yang telah menyusunnya.")
b("t3",7,"akhir","Coba pikirkan soal empat belas lagi, tetapi jeda Kompetisi diubah menjadi dua hari. Berapa poin maksimumnya? Tulis jawabanmu di kolom komentar. Sampai jumpa di soal berikutnya!",3.0)
S={"episode":"ON07","title":"Jadwal Pembinaan","label":"Bedah Soal OSN-K Informatika","kind":"osn","tanpa_waktu_baca":True,
 "osn":{"tahun":"2026","tingkat":"Kabupaten/Kota","jenjang":"SMA","nomor":"14–16","judul":"Jadwal Pembinaan Tim Olimpiade","penyusun":"Tim Olimpiade Komputer Indonesia (TOKI)","jawaban":"40; 32; 56","sumber":[{"tahun":"2026","nomor":[14,15,16],"judul":"Jadwal Pembinaan Tim Olimpiade"}]},
 "coba":{"14":["T 2 · O 3 · K 5 setiap hari · jeda A = B = C = 1","Berapa total poin maksimum dalam 10 hari?"],"15":["T 2 · O 3 · K 5 setiap hari · jeda A = 1, B = 2, C = 3","Berapa total poin maksimum dalam 10 hari?"],"16":["poin berubah setiap hari · jeda A = B = C = 1","Berapa total poin maksimum dalam 10 hari?"]},
 "kunci":[["SOAL 14","Jeda satu hari","40","empat",2],["SOAL 15","Jeda berbeda","32","tiga"],["SOAL 16","Poin berubah","56","lima",2]],
 "kredit":[["“Jadwal Pembinaan Tim Olimpiade”","OSN-K Informatika 2026 · SMA · No. 14–16"]],
 "berikut":"Bebek Gayung",
 "alur":[["Pahami aturannya","agenda, poin, dan jeda"],["Kerjakan soalnya","nomor 14, 15, dan 16"],["Coba sendiri","pause, lalu bahas bersama"]],"alurJudul":"Satu aturan, tiga soal","alurKeys":[["pahami",1],["kerjakan",1],["coba",1]],
 "ajakan":"Soal 14 dengan jeda Kompetisi 2 hari? Tulis di komentar",
 "engine":["../_inti/osn-core.js","../_inti/osn-umum.js","scenes.js"],"parts":{"ON07":{"segs":[0,1,2,3,4,5,6,7]}},
 "segments":["Kait","Pengantar","Soal · Jadwal Pembinaan","Soal 14 · Jeda satu hari","Soal 15 · Jeda berbeda","Soal 16 · Poin berubah","Konsep · Rakus vs pemrograman dinamis","Penutup"],
 "tags":["KAIT","PENGANTAR","SOAL","SOAL 14","SOAL 15","SOAL 16","KONSEP","PENUTUP"],"recap":[],"next":{},"beats":B}
json.dump(S,open("script.json","w"),ensure_ascii=False,indent=1)
segn=S["segments"]; out=["# Naskah ON07 Jadwal Pembinaan",""]; cur=-1
for x in B:
    if x["seg"]!=cur: cur=x["seg"]; out+=[f"## {cur}. {segn[cur]}",""]
    if x["text"]: out+=[x["text"],""]
open("naskah.md","w").write("\n".join(out))
print(len(B), sum(len(x["text"]) for x in B))
