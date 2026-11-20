"""Sumber naskah ON05 -> script.json (dan naskah.md untuk Claude Doc)."""
import json
B=[]
def b(id,seg,scene,text,hold=0.6,**k): B.append(dict(id=id,seg=seg,scene=scene,text=text,hold=hold,**k))
# 0 Kait
b("k1",0,"kait_papan","Ada dua puluh lima lampu dan sepuluh tombol. Setiap tombol membalik satu baris atau satu kolom lampu. Kamu harus menekan tepat enam tombol untuk mengubah papan kiri menjadi papan kanan.")
b("k2",0,"kait_tanya","Pertanyaannya, ada berapa banyak urutan penekanan yang berhasil? Jawabannya ribuan, dan kita bisa menghitungnya tanpa mencoba satu per satu.")
b("k3",0,"kait_judul","Setelah menonton video ini, kamu bisa memakai ide bit paritas dan aturan membilang untuk menghitung kemungkinan dengan cepat.",1.2)
# 1 Pengantar
b("bab1",1,"bab","",0.9)
b("i2",1,"sumber","Soal di video ini berasal dari OSN-K Informatika tahun dua ribu dua puluh enam jenjang SMA, yaitu soal nomor sembilan, yang berjudul Papan Lampu. Soal ini disusun oleh Tim Olimpiade Komputer Indonesia.")
b("i3",1,"alur","Kita pahami aturan papannya dulu. Setelah itu, kamu punya waktu untuk mencoba, lalu kita bahas bersama langkah demi langkah.",0.9)
# 2 Soal
b("bab2",2,"bab","",0.9)
b("q1",2,"papan_soal","Pak Dengklek punya papan lampu dengan lima baris, yaitu baris satu sampai lima, dan lima kolom, yaitu kolom A sampai E. Pada awalnya, semua lampu mati.",tag="SOAL",mode="awal")
b("q2",2,"papan_soal","Ada sepuluh tombol, yaitu tombol satu sampai lima, dan tombol A sampai E. Tombol angka membalik semua lampu di baris itu. Lampu yang mati menjadi menyala, dan lampu yang menyala menjadi mati.",tag="SOAL",mode="baris")
b("q3",2,"papan_soal","Tombol huruf bekerja dengan cara yang sama, tetapi untuk kolom. Misalnya, tombol C membalik semua lampu di kolom C.",tag="SOAL",mode="kolom")
b("q4",2,"papan_target","Pak Dengklek ingin mengubah papan yang semua lampunya mati menjadi papan di sebelah kanan. Lingkaran putih berarti lampu menyala, dan lingkaran hitam berarti lampu mati.",tag="SOAL")
b("q5",2,"papan_tanya","Ia ingin menekan tepat enam tombol. Ada berapa banyak kemungkinan urutan penekanannya? Contohnya, A, C, E, satu, tiga, empat adalah satu urutan. Urutan B, dua, D, lima, E, E juga berhasil.",tag="SOAL")
b("q6",2,"coba","Coba hitung sendiri dulu. Pause videonya kalau perlu.",8.5,countdown=8,tag="COBA DULU",soal=9)
# 3 Pembahasan: dua pengamatan
b("bab3",3,"bab","",0.9)
b("p1",3,"amati_urutan","Pengamatan pertama. Urutan penekanan tidak mengubah hasil akhir. Tekan A lalu satu, atau satu lalu A, papannya tetap sama, karena setiap lampu hanya peduli berapa kali ia dibalik.",tag="PEMBAHASAN")
b("p2",3,"amati_dua","Pengamatan kedua. Menekan tombol yang sama dua kali sama saja dengan tidak menekannya, karena lampu dibalik lalu dibalik kembali. Jadi, yang penting hanyalah apakah sebuah tombol ditekan ganjil kali atau genap kali.",tag="PEMBAHASAN")
b("p3",3,"cari_ganjil","Sekarang, kita cari tombol mana yang harus ditekan ganjil kali. Lihat baris satu. Lampu yang menyala ada di kolom B dan D. Kalau baris satu tidak ditekan, berarti kolom B dan D harus ditekan ganjil kali.",tag="PEMBAHASAN",mode="kolom")
b("p4",3,"cari_ganjil","Baris dua kebalikannya, yaitu A, C, dan E yang menyala. Jadi, baris dua harus ditekan. Baris tiga dan empat sama dengan baris satu, sedangkan baris lima sama dengan baris dua. Hasilnya, tombol B, D, dua, dan lima ditekan ganjil kali.",tag="PEMBAHASAN",mode="baris")
b("p5",3,"cari_ganjil","Ada satu kejutan. Menekan kesepuluh tombol sekaligus membalik setiap lampu dua kali, sehingga papannya tidak berubah. Karena itu, kebalikannya juga berhasil, yaitu A, C, E, satu, tiga, dan empat ditekan ganjil kali.",tag="PEMBAHASAN",mode="kebalikan")
# 4 Pembahasan: membilang
b("bab4",4,"bab","",0.9)
b("h1",4,"kasus","Sekarang kita membilang. Kasus pertama memakai enam tombol A, C, E, satu, tiga, dan empat. Keenam tombol itu harus ditekan tepat sekali, jadi kita hanya menyusun urutannya.",tag="PEMBAHASAN",kasus=1)
b("h2",4,"kasus","Banyak cara menyusun enam benda berbeda adalah enam faktorial, yaitu enam kali lima kali empat kali tiga kali dua kali satu. Hasilnya tujuh ratus dua puluh.",tag="PEMBAHASAN",kasus=1,hitung=True)
b("h3",4,"kasus","Kasus kedua memakai empat tombol B, D, dua, dan lima. Keempatnya ditekan sekali, jadi masih ada dua tekanan lagi. Dua tekanan itu bisa dipakai dengan dua cara.",tag="PEMBAHASAN",kasus=2)
b("h4",4,"kasus","Cara pertama, salah satu dari empat tombol itu ditekan tiga kali. Ada empat pilihan tombol. Urutan enam tekanan dengan satu tombol muncul tiga kali ada enam faktorial dibagi tiga faktorial, yaitu seratus dua puluh. Totalnya empat kali seratus dua puluh, yaitu empat ratus delapan puluh.",tag="PEMBAHASAN",kasus=2,sub="a")
b("h5",4,"kasus","Cara kedua, salah satu dari enam tombol lainnya ditekan dua kali, seperti E, E pada contoh soal. Ada enam pilihan tombol, dan setiap pilihan punya enam faktorial dibagi dua faktorial, yaitu tiga ratus enam puluh urutan. Totalnya dua ribu seratus enam puluh.",tag="PEMBAHASAN",kasus=2,sub="b")
b("h6",4,"jumlah","Jadi, banyak urutannya adalah tujuh ratus dua puluh, ditambah empat ratus delapan puluh, ditambah dua ribu seratus enam puluh, yaitu tiga ribu tiga ratus enam puluh.",1.0,tag="JAWABAN")
# 5 Konsep
b("bab5",5,"bab","",0.9)
b("s1",5,"konsep_xor","Lampu yang dibalik bekerja seperti operasi XOR pada bit. Nilai akhirnya hanya bergantung pada genap atau ganjilnya jumlah pembalikan, bukan pada urutannya. Ide ini disebut paritas.",tag="KONSEP")
b("s2",5,"konsep_bilang","Setelah tahu tombol mana yang ganjil, sisanya adalah soal membilang. Untuk menyusun benda yang ada kembarnya, bagi faktorial jumlah semua benda dengan faktorial jumlah benda yang kembar.",1.0,tag="KONSEP")
# 6 Penutup
b("bab6",6,"bab","",0.9)
b("t1",6,"skor","Mari kita ulang jawabannya. Banyak urutan enam tekanan yang mengubah papan kiri menjadi papan kanan adalah tiga ribu tiga ratus enam puluh.",1.0)
b("t2",6,"kredit","Soal ini berasal dari OSN-K Informatika tahun dua ribu dua puluh enam, nomor sembilan, yang berjudul Papan Lampu. Terima kasih kepada Tim Olimpiade Komputer Indonesia yang telah menyusunnya.")
b("t3",6,"akhir","Coba hitung sendiri, ada berapa urutan kalau Pak Dengklek menekan tepat empat tombol, lalu tulis jawabanmu di kolom komentar. Sampai jumpa di soal berikutnya!",3.0)
S={"episode":"ON05","title":"Papan Lampu","label":"Bedah Soal OSN-K Informatika","kind":"osn","tanpa_waktu_baca":True,
 "osn":{"tahun":"2026","tingkat":"Kabupaten/Kota","jenjang":"SMA","nomor":"9","judul":"Papan Lampu","penyusun":"Tim Olimpiade Komputer Indonesia (TOKI)","jawaban":"3360","sumber":[{"tahun":"2026","nomor":[9],"judul":"Papan Lampu"}]},
 "coba":{"9":["10 tombol · tepat 6 tekanan · papan kiri → papan kanan","Ada berapa urutan penekanan?"]},
 "kunci":[["SOAL 9","Papan Lampu","3360","tiga"]],
 "kredit":[["“Papan Lampu”","OSN-K Informatika 2026 · SMA · No. 9"]],
 "berikut":"Perjalanan ke Timur",
 "alur":[["Pahami aturannya","10 tombol, 25 lampu"],["Coba dulu","pause, hitung sendiri"],["Bahas bersama","paritas, lalu membilang"]],"alurJudul":"Satu papan, satu soal","alurKeys":[["pahami",1],["waktu",1],["bahas",1]],
 "ajakan":"Bagaimana kalau tepat 4 tekanan? Tulis di komentar",
 "engine":["../_inti/osn-core.js","../_inti/osn-umum.js","scenes.js"],"parts":{"ON05":{"segs":[0,1,2,3,4,5,6]}},
 "segments":["Kait","Pengantar","Soal 9 · Papan Lampu","Tombol mana yang ganjil?","Membilang urutan","Konsep · Paritas dan membilang","Penutup"],
 "tags":["KAIT","PENGANTAR","SOAL","PEMBAHASAN","PEMBAHASAN","KONSEP","PENUTUP"],"recap":[],"next":{},"beats":B}
json.dump(S,open("script.json","w"),ensure_ascii=False,indent=1)
segn=S["segments"]; out=["# Naskah ON05 Papan Lampu",""]; cur=-1
for x in B:
    if x["seg"]!=cur: cur=x["seg"]; out+=[f"## {cur}. {segn[cur]}",""]
    if x["text"]: out+=[x["text"],""]
open("naskah.md","w").write("\n".join(out))
print(len(B), sum(len(x["text"]) for x in B))
