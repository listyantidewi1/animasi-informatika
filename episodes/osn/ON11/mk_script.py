"""Sumber naskah ON11 -> script.json (dan naskah.md untuk Claude Doc)."""
import json
B=[]
def b(id,seg,scene,text,hold=0.6,**k): B.append(dict(id=id,seg=seg,scene=scene,text=text,hold=hold,**k))
K="koridor"
# 0 Kait
b("k1",0,K,"Sekolah bebek punya deretan ruang kelas di satu koridor. Sebuah penguat sinyal memancarkan sinyal paling kuat di ruangnya, lalu melemah satu tingkat di setiap ruang berikutnya. Di mana penguat baru harus dipasang, supaya paling banyak kelas bisa belajar daring?",mode="kait")
b("k2",0,K,"Lalu, kalau koridornya punya seratus lima puluh kelas, berapa penguat yang kita butuhkan? Ternyata, jawabannya cukup dihitung dari jarak terjauh antara dua penguat.",mode="besar")
b("k3",0,"kait_judul","Setelah menonton video ini, kamu bisa menghitung banyak alat paling sedikit yang dibutuhkan untuk menutupi seluruh area.",1.2)
# 1 Pengantar
b("bab1",1,"bab","",0.9)
b("i2",1,"sumber","Soal di video ini berasal dari OSN-K Informatika tahun dua ribu dua puluh enam jenjang SMA, yaitu soal nomor dua puluh, dua puluh satu, dan dua puluh dua, yang berjudul Peta Internet Sekolah. Soal ini disusun oleh Tim Olimpiade Komputer Indonesia.")
b("i3",1,"alur","Ketiga soal ini memakai cerita yang sama. Kita pahami ceritanya dulu, lalu kita kerjakan soalnya satu per satu. Setiap soal punya waktu untuk kamu coba sendiri.",0.9)
# 2 Soal
b("bab2",2,"bab","",0.9)
b("q1",2,K,"Sekolah bebek punya N ruang kelas yang berjajar di satu koridor lurus, dari ruang satu di paling kiri sampai ruang N di paling kanan. Sekolah akan memasang beberapa penguat sinyal internet.",tag="SOAL",mode="ruang")
b("q2",2,K,"Setiap penguat punya posisi dan kekuatan awal. Kalau penguat dipasang di ruang X dengan kekuatan Y, ruang X mendapat tambahan sinyal Y. Ruang yang berjarak satu mendapat Y kurang satu, ruang yang berjarak dua mendapat Y kurang dua, dan seterusnya sampai nol.",tag="SOAL",mode="aturan")
b("q3",2,K,"Misalnya, penguat berkekuatan empat di ruang lima memberi sinyal empat di ruang lima, tiga di ruang empat dan enam, dua di ruang tiga dan tujuh, lalu satu di ruang dua dan delapan. Sinyal dari beberapa penguat dijumlahkan.",tag="SOAL",mode="contoh")
b("q4",2,K,"Sebuah ruang kelas layak untuk belajar daring kalau total sinyalnya paling sedikit P.",tag="SOAL",mode="layak")
# 3 Soal 20
b("bab3",3,"bab","",0.9)
b("a1",3,K,"Soal nomor dua puluh. Ada delapan belas ruang dan empat penguat yang sudah terpasang, seperti di tabel ini. Kita boleh memasang satu penguat lagi berkekuatan empat, di ruang mana pun. Kalau P sama dengan delapan, berapa paling banyak ruang yang layak?",0.8,tag="SOAL 20",mode="soal",soal=20)
b("a2",3,"coba","Coba hitung sendiri dulu. Pause videonya kalau perlu.",8.5,countdown=8,tag="COBA DULU",soal=20)
b("a3",3,K,"Pertama, kita hitung total sinyal setiap ruang dari keempat penguat. Ruang yang sudah layak hanya lima, yaitu ruang tujuh, tiga belas, empat belas, lima belas, dan enam belas.",tag="PEMBAHASAN",mode="awal20")
b("a4",3,K,"Penguat baru memberi empat di ruangnya, tiga di sebelahnya, lalu dua, lalu satu. Jadi, penguat ini hanya menolong ruang yang dekat dan kekurangannya sedikit. Ruang enam sampai dua belas hanya kurang satu atau dua.",tag="PEMBAHASAN",mode="kurang20")
b("a5",3,K,"Kita coba setiap posisi. Hasil terbaik didapat kalau penguat baru dipasang di ruang sembilan. Ruang enam, delapan, sembilan, sepuluh, sebelas, dan dua belas menjadi layak, jadi ada enam ruang baru.",tag="PEMBAHASAN",mode="pasang20")
b("a6",3,K,"Totalnya lima ditambah enam, yaitu sebelas ruang. Jawaban soal dua puluh adalah sebelas.",1.0,tag="JAWABAN",mode="jawab20")
# 4 Soal 21
b("bab4",4,"bab","",0.9)
b("b1",4,K,"Soal nomor dua puluh satu. Sekarang ada seratus lima puluh ruang tanpa penguat sama sekali. Semua penguat berkekuatan sepuluh, dan P sama dengan enam. Berapa penguat paling sedikit agar semua ruang layak?",0.8,tag="SOAL 21",mode="soal",soal=21)
b("b2",4,"coba","Coba hitung sendiri dulu. Pause videonya kalau perlu.",8.5,countdown=8,tag="COBA DULU",soal=21)
b("b3",4,K,"Satu penguat berkekuatan sepuluh hanya cukup untuk ruang yang jaraknya paling jauh empat, karena sepuluh kurang empat sama dengan enam. Jadi, ruang paling ujung butuh penguat yang jaraknya paling jauh empat ruang.",tag="PEMBAHASAN",mode="ujung")
b("b4",4,K,"Di antara dua penguat, sinyalnya saling membantu. Kalau jarak dua penguat empat belas ruang, ruang di tengah berjarak tujuh dari keduanya, dan mendapat tiga ditambah tiga, yaitu enam. Itu masih cukup. Tetapi, kalau jaraknya lima belas, ada ruang yang hanya mendapat lima.",tag="PEMBAHASAN",mode="celah")
b("b5",4,K,"Jadi, penguat pertama dipasang di ruang lima, lalu setiap penguat berikutnya paling jauh empat belas ruang dari sebelumnya. Dengan k penguat, jangkauannya sampai ruang empat belas kali k, dikurangi lima.",tag="PEMBAHASAN",mode="rantai")
b("b6",4,K,"Sebelas penguat hanya menjangkau sampai ruang seratus empat puluh sembilan. Dua belas penguat menjangkau sampai ruang seratus enam puluh tiga, cukup untuk seratus lima puluh ruang. Jawaban soal dua puluh satu adalah dua belas.",1.0,tag="JAWABAN",mode="jawab21")
# 5 Soal 22
b("bab5",5,"bab","",0.9)
b("c1",5,K,"Soal nomor dua puluh dua. Masih ada seratus lima puluh ruang, dan P sama dengan enam. Tetapi, sekarang hanya ada empat penguat dengan kekuatan yang sama. Berapa kekuatan paling kecil yang dibutuhkan?",0.8,tag="SOAL 22",mode="soal",soal=22)
b("c2",5,"coba","Coba hitung sendiri dulu. Pause videonya kalau perlu.",8.5,countdown=8,tag="COBA DULU",soal=22)
b("c3",5,K,"Kita pakai cara yang sama untuk kekuatan Y. Di ujung, satu penguat menjangkau Y kurang enam ruang. Di antara dua penguat, ruang di tengah mendapat jumlah dua sinyal, jadi jaraknya paling jauh dua Y kurang enam.",tag="PEMBAHASAN",mode="umum")
b("c4",5,K,"Empat penguat punya dua ujung dan tiga celah. Jadi, panjang yang terjangkau adalah dua kali Y kurang enam, ditambah tiga kali dua Y kurang enam, ditambah satu ruang tempat penguat pertama. Hasilnya delapan Y kurang dua puluh sembilan.",tag="PEMBAHASAN",mode="rumus22")
b("c5",5,K,"Kita butuh delapan Y kurang dua puluh sembilan paling sedikit seratus lima puluh. Untuk Y dua puluh dua, hasilnya seratus empat puluh tujuh, belum cukup. Untuk Y dua puluh tiga, hasilnya seratus lima puluh lima, sudah cukup. Jawaban soal dua puluh dua adalah dua puluh tiga.",1.0,tag="JAWABAN",mode="jawab22")
# 6 Konsep
b("bab6",6,"bab","",0.9)
b("s1",6,"konsep_cakupan","Soal seperti ini disebut masalah cakupan, yaitu menutupi seluruh area dengan alat sesedikit mungkin. Contohnya memasang wifi, lampu jalan, atau menara pemancar.",tag="KONSEP")
b("s2",6,"konsep_celah","Triknya adalah mencari celah terbesar yang masih aman, bukan mencoba semua posisi. Setelah celah terbesar diketahui, banyak alat tinggal dihitung dengan pembagian.",tag="KONSEP")
b("s3",6,"konsep_rakus","Cara memasangnya adalah cara rakus. Pasang alat pertama sejauh mungkin dari ujung, lalu setiap alat berikutnya sejauh mungkin dari alat sebelumnya, selama semua ruang masih aman.",1.0,tag="KONSEP")
# 7 Penutup
b("bab7",7,"bab","",0.9)
b("t1",7,"skor","Mari kita ulang ketiga jawabannya. Jawaban soal dua puluh adalah sebelas. Jawaban soal dua puluh satu adalah dua belas. Jawaban soal dua puluh dua adalah dua puluh tiga.",1.0)
b("t2",7,"kredit","Soal-soal ini berasal dari OSN-K Informatika tahun dua ribu dua puluh enam, nomor dua puluh sampai dua puluh dua, yang berjudul Peta Internet Sekolah. Terima kasih kepada Tim Olimpiade Komputer Indonesia yang telah menyusunnya.")
b("t3",7,"akhir","Coba pikirkan, kalau kekuatan penguat sepuluh dan P sama dengan delapan, berapa penguat paling sedikit untuk seratus lima puluh ruang? Tulis jawabanmu di kolom komentar. Sampai jumpa di soal berikutnya!",3.0)
S={"episode":"ON11","title":"Peta Internet Sekolah","label":"Bedah Soal OSN-K Informatika","kind":"osn","tanpa_waktu_baca":True,
 "osn":{"tahun":"2026","tingkat":"Kabupaten/Kota","jenjang":"SMA","nomor":"20–22","judul":"Peta Internet Sekolah","penyusun":"Tim Olimpiade Komputer Indonesia (TOKI)","jawaban":"11; 12; 23","sumber":[{"tahun":"2026","nomor":[20,21,22],"judul":"Peta Internet Sekolah"}]},
 "coba":{"20":["N = 18 · 4 penguat terpasang · 1 penguat baru kekuatan 4 · P = 8","Paling banyak berapa ruang yang layak?"],"21":["N = 150 · semua penguat kekuatan 10 · P = 6","Paling sedikit berapa penguat?"],"22":["N = 150 · hanya 4 penguat · P = 6","Kekuatan paling kecil berapa?"]},
 "kunci":[["SOAL 20","1 penguat baru, P = 8","11","sebelas"],["SOAL 21","kekuatan 10, P = 6","12","belas"],["SOAL 22","4 penguat, P = 6","23","tiga"]],
 "kredit":[["“Peta Internet Sekolah”","OSN-K Informatika 2026 · SMA · No. 20–22"]],
 "berikut":"Dua dari Tujuh Telur",
 "alur":[["Pahami ceritanya","koridor, penguat, dan sinyal"],["Kerjakan soalnya","nomor 20, 21, dan 22"],["Coba sendiri","pause, lalu bahas bersama"]],"alurJudul":"Satu cerita, tiga soal","alurKeys":[["pahami",1],["kerjakan",1],["coba",1]],
 "ajakan":"Kekuatan 10, P = 8: berapa penguat untuk 150 ruang? Tulis di komentar",
 "engine":["../_inti/osn-core.js","../_inti/osn-umum.js","scenes.js"],"parts":{"ON11":{"segs":[0,1,2,3,4,5,6,7]}},
 "segments":["Kait","Pengantar","Soal · Peta Internet Sekolah","Soal 20 · Satu penguat baru","Soal 21 · Penguat paling sedikit","Soal 22 · Kekuatan paling kecil","Konsep · Masalah cakupan","Penutup"],
 "tags":["KAIT","PENGANTAR","SOAL","SOAL 20","SOAL 21","SOAL 22","KONSEP","PENUTUP"],"recap":[],"next":{},"beats":B}
json.dump(S,open("script.json","w"),ensure_ascii=False,indent=1)
segn=S["segments"]; out=["# Naskah ON11 Peta Internet Sekolah",""]; cur=-1
for x in B:
    if x["seg"]!=cur: cur=x["seg"]; out+=[f"## {cur}. {segn[cur]}",""]
    if x["text"]: out+=[x["text"],""]
open("naskah.md","w").write("\n".join(out))
print(len(B), sum(len(x["text"]) for x in B))
