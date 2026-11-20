"""Sumber naskah ON12 -> script.json (dan naskah.md untuk Claude Doc)."""
import json
B=[]
def b(id,seg,scene,text,hold=0.6,**k): B.append(dict(id=id,seg=seg,scene=scene,text=text,hold=hold,**k))
K="telur"
# 0 Kait
b("k1",0,K,"Ada tujuh telur bebek, dan dua di antaranya adalah telur emas. Kamu punya mesin yang hanya menjawab satu hal, yaitu ada telur emas atau tidak. Berapa kali mesin harus dipakai, supaya kedua telur emas pasti ketemu?",mode="kait")
b("k2",0,K,"Kita tidak sekadar menebak. Kita akan membuktikan bahwa satu angka pasti cukup, dan satu kali lebih sedikit pasti tidak cukup.",mode="besar")
b("k3",0,"kait_judul","Setelah menonton video ini, kamu bisa menghitung batas paling sedikit sebuah pencarian yang jawabannya hanya ya atau tidak.",1.2)
# 1 Pengantar
b("bab1",1,"bab","",0.9)
b("i2",1,"sumber","Soal di video ini berasal dari OSN-K Informatika tahun dua ribu dua puluh lima jenjang SMA, yaitu soal nomor sepuluh, yang berjudul Dua dari Tujuh Telur Bebek. Soal ini disusun oleh Tim Olimpiade Komputer Indonesia.")
b("i3",1,"alur","Kita pahami cara kerja mesinnya dulu. Setelah itu, kamu punya waktu untuk mencoba, lalu kita bahas bersama.",0.9)
# 2 Soal
b("bab2",2,"bab","",0.9)
b("q1",2,K,"Pak Dengklek punya tujuh telur bebek berlabel satu sampai tujuh. Tepat dua telur adalah telur emas, tetapi semua telur terlihat sama.",tag="SOAL",mode="soal")
b("q2",2,K,"Ia punya mesin pendeteksi. Ia boleh memasukkan satu telur atau lebih. Mesin hanya menjawab tidak ada telur emas, atau telur emas terdeteksi, tanpa memberi tahu telur yang mana.",tag="SOAL",mode="mesin")
b("q3",2,K,"Misalnya, telur dua dan tiga adalah telur emas. Kalau telur satu, dua, dan lima dimasukkan, mesin menjawab terdeteksi. Kalau telur satu dan empat dimasukkan, mesin menjawab tidak ada.",tag="SOAL",mode="contoh")
b("q4",2,K,"Pak Dengklek ingin strategi terbaik, supaya kedua telur emas pasti ketemu, apa pun pasangannya. Paling banyak berapa kali mesin harus dipakai? Nilai ini kita sebut K.",0.8,tag="SOAL",mode="tanya")
b("q5",2,"coba","Coba pikirkan sendiri dulu. Pause videonya kalau perlu.",8.5,countdown=8,tag="COBA DULU",soal=10)
# 3 Batas bawah
b("bab3",3,"bab","",0.9)
b("p1",3,K,"Pertama, kita hitung ada berapa kemungkinan pasangan telur emas. Memilih dua dari tujuh telur ada dua puluh satu cara.",tag="PEMBAHASAN",mode="pasangan")
b("p2",3,K,"Setiap kali mesin dipakai, jawabannya hanya dua macam. Jadi, satu kali pemakaian membagi kemungkinan menjadi dua kelompok.",tag="PEMBAHASAN",mode="cabang")
b("p3",3,K,"Dengan empat kali pemakaian, paling banyak ada dua kali dua kali dua kali dua, yaitu enam belas urutan jawaban yang berbeda. Padahal, ada dua puluh satu kemungkinan pasangan.",tag="PEMBAHASAN",mode="empat")
b("p4",3,K,"Artinya, pasti ada dua pasangan berbeda yang mendapat urutan jawaban yang sama, sehingga tidak bisa dibedakan. Jadi, empat kali tidak cukup, dan K paling sedikit lima.",1.0,tag="PEMBAHASAN",mode="kurang")
# 4 Strategi
b("bab4",4,"bab","",0.9)
b("r1",4,K,"Sekarang kita cari strategi dengan lima kali pemakaian. Kelompokkan telur menjadi tiga pasang, yaitu satu dan dua, tiga dan empat, serta lima dan enam. Telur tujuh disisihkan.",tag="PEMBAHASAN",mode="kelompok")
b("r2",4,K,"Masukkan setiap pasang ke mesin, satu per satu. Ini memakai tiga kali pemakaian. Karena ada dua telur emas, paling sedikit satu pasang pasti terdeteksi.",tag="PEMBAHASAN",mode="tiga")
b("r3",4,K,"Kasus pertama, dua pasang terdeteksi. Berarti setiap pasang berisi tepat satu telur emas. Cek satu telur dari setiap pasang. Ini memakai dua kali lagi, jadi totalnya lima.",tag="PEMBAHASAN",mode="dua")
b("r4",4,K,"Kasus kedua, hanya satu pasang terdeteksi, misalnya satu dan dua. Kemungkinannya tinggal tiga, yaitu satu dan dua, satu dan tujuh, atau dua dan tujuh.",tag="PEMBAHASAN",mode="satu")
b("r5",4,K,"Cek telur tujuh. Kalau tidak ada, jawabannya satu dan dua. Kalau terdeteksi, cek telur satu untuk tahu pasangannya. Totalnya juga lima kali.",tag="PEMBAHASAN",mode="sisa")
b("r6",4,K,"Dalam semua kasus, lima kali pemakaian sudah cukup, dan empat kali pasti tidak cukup. Jadi, jawaban soal nomor sepuluh adalah lima.",1.0,tag="JAWABAN",mode="jawab")
# 5 Konsep
b("bab5",5,"bab","",0.9)
b("s1",5,"konsep_kelompok","Soal ini adalah contoh pengujian kelompok. Kita menguji banyak benda sekaligus, lalu memakai jawabannya untuk memperkecil kemungkinan.",tag="KONSEP")
b("s2",5,"konsep_batas","Triknya adalah menghitung batas bawah. Kalau ada N kemungkinan dan setiap jawaban hanya ya atau tidak, kita butuh k pertanyaan dengan dua pangkat k paling sedikit N. Ide yang sama dipakai di pencarian biner.",1.0,tag="KONSEP")
# 6 Penutup
b("bab6",6,"bab","",0.9)
b("t1",6,"skor","Mari kita ulang jawabannya. Kedua telur emas pasti ketemu dengan paling banyak lima kali pemakaian mesin. Jawaban soal nomor sepuluh adalah lima.",1.0)
b("t2",6,"kredit","Soal ini berasal dari OSN-K Informatika tahun dua ribu dua puluh lima, nomor sepuluh, yang berjudul Dua dari Tujuh Telur Bebek. Terima kasih kepada Tim Olimpiade Komputer Indonesia yang telah menyusunnya.")
b("t3",6,"akhir","Coba pikirkan, kalau ada delapan telur dan tetap dua telur emas, apakah lima kali masih cukup? Tulis jawabanmu di kolom komentar. Sampai jumpa di soal berikutnya!",3.0)
S={"episode":"ON12","title":"Dua dari Tujuh Telur","label":"Bedah Soal OSN-K Informatika","kind":"osn","tanpa_waktu_baca":True,
 "osn":{"tahun":"2025","tingkat":"Kabupaten/Kota","jenjang":"SMA","nomor":"10","judul":"Dua dari Tujuh Telur Bebek","penyusun":"Tim Olimpiade Komputer Indonesia (TOKI)","jawaban":"5","sumber":[{"tahun":"2025","nomor":[10],"judul":"Dua dari Tujuh Telur Bebek"}]},
 "coba":{"10":["7 telur · tepat 2 telur emas · mesin menjawab ADA atau TIDAK","Paling banyak berapa kali mesin dipakai?"]},
 "kunci":[["SOAL 10","Dua dari Tujuh Telur","5","lima"]],
 "kredit":[["“Dua dari Tujuh Telur Bebek”","OSN-K Informatika 2025 · SMA · No. 10"]],
 "berikut":"Pembahasan lainnya di playlist Bedah Soal OSN-K Informatika","berikutLabel":"// TONTON JUGA",
 "alur":[["Pahami mesinnya","7 telur, 2 telur emas"],["Coba dulu","pause, pikirkan sendiri"],["Bahas bersama","batas bawah, lalu strategi"]],"alurJudul":"Satu mesin, satu soal","alurKeys":[["pahami",1],["waktu",1],["bahas",1]],
 "ajakan":"8 telur, 2 telur emas: apakah 5 kali masih cukup? Tulis di komentar",
 "engine":["../_inti/osn-core.js","../_inti/osn-umum.js","scenes.js"],"parts":{"ON12":{"segs":[0,1,2,3,4,5,6]}},
 "segments":["Kait","Pengantar","Soal 10 · Dua dari Tujuh Telur","Kenapa 4 kali tidak cukup","Strategi 5 kali","Konsep · Pengujian kelompok","Penutup"],
 "tags":["KAIT","PENGANTAR","SOAL","PEMBAHASAN","PEMBAHASAN","KONSEP","PENUTUP"],"recap":[],"next":{},"beats":B}
json.dump(S,open("script.json","w"),ensure_ascii=False,indent=1)
md=["# Naskah ON12 Dua dari Tujuh Telur",""]
seg=-1
for x in B:
    if x["seg"]!=seg: seg=x["seg"]; md+=["## %d. %s"%(seg,S["segments"][seg]),""]
    if x["text"]: md+=[x["text"],""]
open("naskah.md","w").write("\n".join(md))
print(len(B), sum(len(x["text"]) for x in B))
