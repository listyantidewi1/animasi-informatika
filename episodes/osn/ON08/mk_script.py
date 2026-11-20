"""Sumber naskah ON08 -> script.json (dan naskah.md untuk Claude Doc)."""
import json
B=[]
def b(id,seg,scene,text,hold=0.6,**k): B.append(dict(id=id,seg=seg,scene=scene,text=text,hold=hold,**k))
G="gayung"
# 0 Kait
b("k1",0,G,"Pak Dengklek hanya punya dua gayung, yaitu gayung tiga liter dan gayung lima liter. Bebek nomor tiga belas ingin mandi dengan tepat tiga belas liter air. Apakah bisa? Bisa, yaitu tiga ditambah lima ditambah lima. Tetapi, bebek nomor tujuh tidak akan pernah bisa mandi.",mode="kait")
b("k2",0,G,"Bagaimana kalau bebeknya ada satu miliar miliar ekor, dan gayungnya tiga liter dan seratus liter? Ada berapa bebek yang tidak bisa mandi? Ternyata, kita bisa menghitungnya tanpa memeriksa bebek satu per satu.",mode="besar")
b("k3",0,"kait_judul","Setelah menonton video ini, kamu bisa menghitung bilangan mana saja yang bisa disusun dari dua ukuran, memakai trik tangga sisa bagi.",1.2)
# 1 Pengantar
b("bab1",1,"bab","",0.9)
b("i2",1,"sumber","Soal di video ini berasal dari OSN-K Informatika tahun dua ribu dua puluh lima jenjang SMA, yaitu soal nomor dua puluh tiga, dua puluh empat, dan dua puluh lima, yang berjudul Bebek Gayung. Soal ini disusun oleh Tim Olimpiade Komputer Indonesia.")
b("i3",1,"alur","Ketiga soal ini memakai cerita yang sama. Kita pahami ceritanya dulu, lalu kita kerjakan soalnya satu per satu. Setiap soal punya waktu untuk kamu coba sendiri.",0.9)
# 2 Soal
b("bab2",2,"bab","",0.9)
b("q1",2,G,"Pak Dengklek punya N ekor bebek, yang diberi nomor satu sampai N. Hari ini adalah Hari Mandi Nasional, jadi ia ingin memandikan semua bebeknya.",tag="SOAL",mode="bebek")
b("q2",2,G,"Ia punya dua gayung. Gayung pertama selalu mengambil tepat X liter air, dan gayung kedua selalu mengambil tepat Y liter. Pak Dengklek tidak bisa mengambil setengah gayung atau sepertiga gayung.",tag="SOAL",mode="dua")
b("q3",2,G,"Bebek-bebeknya punya dua syarat. Pertama, air yang sudah diambil harus langsung dipakai untuk mandi. Kedua, bebek nomor P ingin mandi dengan air tepat P liter.",tag="SOAL",mode="syarat")
b("q4",2,G,"Misalnya, gayungnya tiga liter dan lima liter. Bebek nomor tiga belas bisa dimandikan dengan satu gayung tiga liter dan dua gayung lima liter. Tetapi, bebek nomor dua dan nomor empat tidak bisa dimandikan.",tag="SOAL",mode="contoh")
b("q5",2,G,"Ketiga soal menanyakan hal yang sama, yaitu ada berapa bebek yang tidak bisa dimandikan.",tag="SOAL",mode="tanya")
# 3 Soal 23
b("bab3",3,"bab","",0.9)
b("a1",3,G,"Soal nomor dua puluh tiga. Ada dua puluh bebek, dan gayungnya tiga liter dan lima liter. Berapa banyak bebek yang tidak bisa dimandikan?",0.8,tag="SOAL 23",mode="soal",soal=23)
b("a2",3,"coba","Coba hitung sendiri dulu. Pause videonya kalau perlu.",8.5,countdown=8,tag="COBA DULU",soal=23)
b("a3",3,G,"Kita pakai trik tangga. Kalau bebek nomor P bisa dimandikan, maka bebek nomor P ditambah tiga juga bisa. Caranya, tambahkan saja satu gayung tiga liter.",tag="PEMBAHASAN",mode="tambah")
b("a4",3,"tangga","Jadi, kita tulis nomor bebek dalam tiga kolom, menurut sisa baginya dengan tiga. Di setiap kolom, kita cukup mencari nomor terkecil yang bisa dimandikan.",tag="PEMBAHASAN",spec="a4")
b("a5",3,"tangga","Kolom sisa nol berisi tiga, enam, sembilan, dan seterusnya, jadi semuanya bisa. Di kolom sisa satu, nomor terkecil yang bisa adalah sepuluh, yaitu lima ditambah lima. Di kolom sisa dua, nomor terkecil yang bisa adalah lima.",tag="PEMBAHASAN",spec="a5")
b("a6",3,"tangga","Yang tidak bisa hanyalah nomor di atas nomor terkecil itu, yaitu satu, empat, dan tujuh, serta nomor dua. Jawaban soal dua puluh tiga adalah empat.",1.0,tag="JAWABAN",spec="a6")
# 4 Soal 24
b("bab4",4,"bab","",0.9)
b("b1",4,G,"Soal nomor dua puluh empat. Sekarang ada seribu bebek, dan gayungnya sembilan liter dan dua puluh satu liter. Berapa banyak bebek yang tidak bisa dimandikan?",0.8,tag="SOAL 24",mode="soal",soal=24)
b("b2",4,"coba","Coba hitung sendiri dulu. Pause videonya kalau perlu.",8.5,countdown=8,tag="COBA DULU",soal=24)
b("b3",4,G,"Perhatikan bahwa sembilan dan dua puluh satu sama-sama kelipatan tiga. Jadi, berapa pun gayung yang dipakai, jumlah airnya selalu kelipatan tiga.",tag="PEMBAHASAN",mode="kelipatan")
b("b4",4,G,"Dari satu sampai seribu, ada tiga ratus tiga puluh tiga kelipatan tiga. Jadi, ada enam ratus enam puluh tujuh bebek yang pasti tidak bisa dimandikan.",tag="PEMBAHASAN",mode="hitung667")
b("b5",4,G,"Bagaimana dengan bebek yang nomornya kelipatan tiga? Kalau semua ukuran dibagi tiga, soalnya berubah menjadi gayung tiga liter dan tujuh liter.",tag="PEMBAHASAN",mode="bagi")
b("b6",4,"tangga","Dengan trik tangga, nomor terkecil di kolom sisa satu adalah tujuh, dan di kolom sisa dua adalah empat belas. Jadi, yang tidak bisa adalah satu, dua, empat, lima, delapan, dan sebelas, yaitu enam nomor.",tag="PEMBAHASAN",spec="b6")
b("b7",4,G,"Kalau dikali tiga lagi, bebek nomor tiga, enam, dua belas, lima belas, dua puluh empat, dan tiga puluh tiga juga tidak bisa. Jadi, totalnya enam ratus enam puluh tujuh ditambah enam, yaitu enam ratus tujuh puluh tiga.",1.0,tag="JAWABAN",mode="total24")
# 5 Soal 25
b("bab5",5,"bab","",0.9)
b("c1",5,G,"Soal nomor dua puluh lima. Bebeknya ada satu miliar miliar ekor, dan gayungnya tiga liter dan seratus liter. Benar atau salah, banyak bebek yang tidak bisa dimandikan kurang dari seratus ekor?",0.8,tag="SOAL 25",mode="soal",soal=25)
b("c2",5,"coba","Coba hitung sendiri dulu. Pause videonya kalau perlu.",8.5,countdown=8,tag="COBA DULU",soal=25)
b("c3",5,"tangga","Kita pakai trik tangga lagi dengan tiga kolom. Kolom sisa nol semuanya bisa, mulai dari tiga.",tag="PEMBAHASAN",spec="c3")
b("c4",5,"tangga","Di kolom sisa satu, nomor terkecil yang bisa adalah seratus. Di atasnya ada satu, empat, tujuh, sampai sembilan puluh tujuh, yaitu tiga puluh tiga nomor.",tag="PEMBAHASAN",spec="c4")
b("c5",5,"tangga","Di kolom sisa dua, nomor terkecil yang bisa adalah dua ratus, yaitu dua gayung seratus liter. Di atasnya ada dua, lima, sampai seratus sembilan puluh tujuh, yaitu enam puluh enam nomor.",tag="PEMBAHASAN",spec="c5")
b("c6",5,"tangga","Totalnya tiga puluh tiga ditambah enam puluh enam, yaitu sembilan puluh sembilan, dan itu kurang dari seratus. Banyaknya bebek tidak berpengaruh, karena semua nomor di atas seratus sembilan puluh tujuh pasti bisa. Jawaban soal dua puluh lima adalah BENAR.",1.0,tag="JAWABAN",spec="c6")
# 6 Konsep
b("bab6",6,"bab","",0.9)
b("s1",6,"konsep_koin","Soal seperti ini dikenal sebagai masalah koin, atau masalah Frobenius. Pertanyaannya, bilangan apa saja yang bisa disusun dari dua ukuran?",tag="KONSEP")
b("s2",6,"konsep_fpb","Kalau kedua ukuran punya faktor persekutuan, misalnya sembilan dan dua puluh satu, hanya kelipatan FPB-nya yang bisa disusun. Kalau FPB-nya satu, hanya ada sedikit bilangan yang tidak bisa.",tag="KONSEP")
b("s3",6,"konsep_rumus","Untuk dua ukuran X dan Y dengan FPB satu, banyak bilangan yang tidak bisa adalah X kurang satu, dikali Y kurang satu, lalu dibagi dua. Untuk tiga dan seratus, hasilnya dua kali sembilan puluh sembilan dibagi dua, yaitu sembilan puluh sembilan, sama dengan hasil trik tangga.",1.0,tag="KONSEP")
# 7 Penutup
b("bab7",7,"bab","",0.9)
b("t1",7,"skor","Mari kita ulang ketiga jawabannya. Jawaban soal dua puluh tiga adalah empat. Jawaban soal dua puluh empat adalah enam ratus tujuh puluh tiga. Jawaban soal dua puluh lima adalah BENAR.",1.0)
b("t2",7,"kredit","Soal-soal ini berasal dari OSN-K Informatika tahun dua ribu dua puluh lima, nomor dua puluh tiga sampai dua puluh lima, yang berjudul Bebek Gayung. Terima kasih kepada Tim Olimpiade Komputer Indonesia yang telah menyusunnya.")
b("t3",7,"akhir","Coba pikirkan gayung empat liter dan tujuh liter. Berapa nomor bebek terbesar yang tidak bisa dimandikan? Tulis jawabanmu di kolom komentar. Sampai jumpa di soal berikutnya!",3.0)
S={"episode":"ON08","title":"Bebek Gayung","label":"Bedah Soal OSN-K Informatika","kind":"osn","tanpa_waktu_baca":True,
 "osn":{"tahun":"2025","tingkat":"Kabupaten/Kota","jenjang":"SMA","nomor":"23–25","judul":"Bebek Gayung","penyusun":"Tim Olimpiade Komputer Indonesia (TOKI)","jawaban":"4; 673; BENAR","sumber":[{"tahun":"2025","nomor":[23,24,25],"judul":"Bebek Gayung"}]},
 "coba":{"23":["N = 20 bebek · gayung 3 liter dan 5 liter","Berapa bebek yang tidak bisa dimandikan?"],"24":["N = 1000 bebek · gayung 9 liter dan 21 liter","Berapa bebek yang tidak bisa dimandikan?"],"25":["N = 10¹⁸ bebek · gayung 3 liter dan 100 liter","BENAR atau SALAH: yang tidak bisa dimandikan kurang dari 100?"]},
 "kunci":[["SOAL 23","Gayung 3 dan 5","4","empat"],["SOAL 24","Gayung 9 dan 21","673","enam"],["SOAL 25","Gayung 3 dan 100","BENAR","benar"]],
 "kredit":[["“Bebek Gayung”","OSN-K Informatika 2025 · SMA · No. 23–25"]],
 "berikut":"Kartu Huruf Ajaib",
 "alur":[["Pahami ceritanya","bebek, gayung, dan syarat"],["Kerjakan soalnya","nomor 23, 24, dan 25"],["Coba sendiri","pause, lalu bahas bersama"]],"alurJudul":"Satu cerita, tiga soal","alurKeys":[["pahami",1],["kerjakan",1],["coba",1]],
 "ajakan":"Gayung 4 dan 7: nomor terbesar yang tidak bisa? Tulis di komentar",
 "engine":["../_inti/osn-core.js","../_inti/osn-umum.js","scenes.js"],"parts":{"ON08":{"segs":[0,1,2,3,4,5,6,7]}},
 "segments":["Kait","Pengantar","Soal · Bebek Gayung","Soal 23 · Gayung 3 dan 5","Soal 24 · Gayung 9 dan 21","Soal 25 · Gayung 3 dan 100","Konsep · Masalah koin","Penutup"],
 "tags":["KAIT","PENGANTAR","SOAL","SOAL 23","SOAL 24","SOAL 25","KONSEP","PENUTUP"],"recap":[],"next":{},"beats":B}
json.dump(S,open("script.json","w"),ensure_ascii=False,indent=1)
segn=S["segments"]; out=["# Naskah ON08 Bebek Gayung",""]; cur=-1
for x in B:
    if x["seg"]!=cur: cur=x["seg"]; out+=[f"## {cur}. {segn[cur]}",""]
    if x["text"]: out+=[x["text"],""]
open("naskah.md","w").write("\n".join(out))
print(len(B), sum(len(x["text"]) for x in B))
