"""Sumber naskah ON10 -> script.json (dan naskah.md untuk Claude Doc)."""
import json
B=[]
def b(id,seg,scene,text,hold=0.6,**k): B.append(dict(id=id,seg=seg,scene=scene,text=text,hold=hold,**k))
T="tm"
# 0 Kait
b("k1",0,T,"Mulai dari satu angka nol. Setiap langkah, salin seluruh tulisannya, balik setiap angkanya, lalu tempelkan di belakang. Nol menjadi nol satu. Lalu nol satu menjadi nol satu satu nol. Lalu menjadi nol satu satu nol satu nol nol satu.",mode="kait")
b("k2",0,T,"Kalau langkah ini diulang dua ribu dua puluh enam kali, tulisannya jauh lebih panjang daripada banyak atom di alam semesta. Tetapi, kita tetap bisa menebak karakter nomor dua ribu dua puluh lima, tanpa menuliskannya sama sekali.",mode="besar")
b("k3",0,"kait_judul","Setelah menonton video ini, kamu bisa membaca fungsi rekursif yang membangun string, lalu menebak isinya memakai bilangan biner.",1.2)
# 1 Pengantar
b("bab1",1,"bab","",0.9)
b("i2",1,"sumber","Soal di video ini berasal dari OSN-K Informatika tahun dua ribu dua puluh enam jenjang SMA, yaitu soal nomor tiga puluh dua, tiga puluh tiga, dan tiga puluh empat, yang berjudul Mondar-Mandir. Soal ini disusun oleh Tim Olimpiade Komputer Indonesia.")
b("i3",1,"alur","Ketiga soal ini memakai kode program yang sama. Kita pahami kodenya dulu, lalu kita kerjakan soalnya satu per satu. Setiap soal punya waktu untuk kamu coba sendiri.",0.9)
# 2 Soal
b("bab2",2,"bab","",0.9)
b("q1",2,"kode","Perhatikan dua fungsi dalam bahasa C++ ini. Fungsi pertama bernama MONDAR. Fungsi ini menerima sebuah string berisi angka nol dan satu, lalu membalik setiap karakternya. Nol menjadi satu, dan satu menjadi nol.",tag="SOAL",fokus="mondar")
b("q2",2,"kode","Fungsi kedua bernama MANDIR. Kalau n sama dengan nol, hasilnya adalah string nol. Kalau tidak, MANDIR memanggil dirinya sendiri untuk n kurang satu, lalu menyambung hasilnya dengan MONDAR dari string yang sama.",tag="SOAL",fokus="mandir")
b("q3",2,T,"Jadi, MANDIR satu adalah nol satu. MANDIR dua adalah nol satu satu nol. MANDIR tiga adalah nol satu satu nol satu nol nol satu. Setiap langkah, panjangnya menjadi dua kali lipat.",tag="SOAL",mode="tabel")
b("q4",2,T,"Soal pertama menanyakan banyak angka satu. Soal kedua menanyakan tiga karakter di posisi tertentu. Soal ketiga menanyakan banyak pasangan nol nol yang berdampingan.",tag="SOAL",mode="tanya")
# 3 Soal 32
b("bab3",3,"bab","",0.9)
b("a1",3,T,"Soal nomor tiga puluh dua. Ada berapa karakter satu di dalam hasil MANDIR dua belas?",0.8,tag="SOAL 32",mode="soal",soal=32)
b("a2",3,"coba","Coba hitung sendiri dulu. Pause videonya kalau perlu.",8.5,countdown=8,tag="COBA DULU",soal=32)
b("a3",3,T,"Pertama, kita hitung panjangnya. MANDIR nol panjangnya satu, dan setiap langkah panjangnya dikali dua. Jadi, MANDIR dua belas panjangnya dua pangkat dua belas, yaitu empat ribu sembilan puluh enam.",tag="PEMBAHASAN",mode="panjang")
b("a4",3,T,"Bagian belakang adalah kebalikan dari bagian depan. Setiap nol di depan menjadi satu di belakang, dan setiap satu di depan menjadi nol di belakang. Jadi, banyak angka satu selalu tepat setengah dari panjangnya.",tag="PEMBAHASAN",mode="separuh")
b("a5",3,T,"Setengah dari empat ribu sembilan puluh enam adalah dua ribu empat puluh delapan. Jawaban soal tiga puluh dua adalah dua ribu empat puluh delapan.",1.0,tag="JAWABAN",mode="jawab32")
# 4 Soal 33
b("bab4",4,"bab","",0.9)
b("b1",4,T,"Soal nomor tiga puluh tiga. String S adalah hasil MANDIR dua ribu dua puluh enam. Tiga karakter apa yang ada di posisi dua ribu dua puluh lima sampai dua ribu dua puluh tujuh? Posisi dihitung mulai dari satu.",0.8,tag="SOAL 33",mode="soal",soal=33)
b("b2",4,"coba","Coba hitung sendiri dulu. Pause videonya kalau perlu.",8.5,countdown=8,tag="COBA DULU",soal=33)
b("b3",4,T,"MANDIR dua ribu dua puluh enam memang sangat panjang, tetapi bagian depannya selalu sama dengan MANDIR sebelumnya. MANDIR sebelas sudah punya dua ribu empat puluh delapan karakter, jadi posisi yang kita cari ada di dalamnya.",tag="PEMBAHASAN",mode="awalan")
b("b4",4,T,"Sekarang kita lacak posisi dua ribu dua puluh lima. Posisi ini ada di setengah bagian belakang, jadi karakternya adalah kebalikan dari posisi dua ribu dua puluh lima dikurangi seribu dua puluh empat, yaitu seribu satu. Kita ulangi terus sampai tiba di posisi satu.",tag="PEMBAHASAN",mode="lacak")
b("b5",4,T,"Setiap kali kita pindah ke bagian depan, satu angka satu hilang dari bentuk biner posisi dikurangi satu, dan karakternya terbalik sekali. Jadi, triknya sederhana. Tulis posisi dikurangi satu dalam biner, lalu hitung angka satunya. Kalau ganjil, karakternya satu. Kalau genap, karakternya nol.",tag="PEMBAHASAN",mode="biner")
b("b6",4,T,"Dua ribu dua puluh empat punya tujuh angka satu, jadi karakternya satu. Dua ribu dua puluh lima dan dua ribu dua puluh enam punya delapan angka satu, jadi keduanya nol. Jawaban soal tiga puluh tiga adalah satu nol nol.",1.0,tag="JAWABAN",mode="biner3")
# 5 Soal 34
b("bab5",5,"bab","",0.9)
b("c1",5,T,"Soal nomor tiga puluh empat. Ada berapa substring nol nol di dalam hasil MANDIR dua belas? Pasangan boleh bertumpuk, seperti contoh di layar yang punya tiga substring nol nol.",0.8,tag="SOAL 34",mode="soal",soal=34)
b("c2",5,"coba","Coba hitung sendiri dulu. Pause videonya kalau perlu.",8.5,countdown=8,tag="COBA DULU",soal=34)
b("c3",5,T,"Lihat apa yang terjadi saat string disambung dengan kebalikannya. Pasangan nol nol di bagian depan tetap ada. Di bagian belakang, setiap pasangan satu satu dari depan berubah menjadi nol nol.",tag="PEMBAHASAN",mode="sambung")
b("c4",5,T,"Bagaimana dengan sambungannya? Bagian belakang selalu dimulai dengan angka satu, karena MANDIR selalu dimulai dengan nol. Jadi, sambungan tidak pernah membentuk nol nol.",tag="PEMBAHASAN",mode="tengah")
b("c5",5,T,"Artinya, banyak nol nol di MANDIR berikutnya sama dengan banyak pasangan kembar di MANDIR sekarang, yaitu nol nol ditambah satu satu. Banyak pasangan kembar ini selalu dua kali lipat, ditambah satu kalau sambungannya membentuk satu satu.",tag="PEMBAHASAN",mode="rumus")
b("c6",5,T,"Kita isi tabelnya dari kecil. Pasangan kembar di MANDIR dua ada satu, lalu dua, lima, sepuluh, dua puluh satu, dan seterusnya, sampai MANDIR sebelas dengan enam ratus delapan puluh dua. Jadi, jawaban soal tiga puluh empat adalah enam ratus delapan puluh dua.",1.0,tag="JAWABAN",mode="tabel34")
# 6 Konsep
b("bab6",6,"bab","",0.9)
b("s1",6,"konsep_tm","String ini terkenal dengan nama barisan Thue-Morse. Polanya teratur, tetapi tidak pernah berulang persis, sehingga sering muncul di soal olimpiade.",tag="KONSEP")
b("s2",6,"konsep_rekursi","Kunci ketiga soal ini adalah sifat rekursinya. Bagian depan sama dengan langkah sebelumnya, dan bagian belakang adalah kebalikannya. Dengan sifat ini, kita tidak perlu menuliskan string yang sangat panjang.",tag="KONSEP")
b("s3",6,"konsep_biner","Trik biner tadi berlaku untuk semua posisi. Untuk posisi k, tulis k kurang satu dalam biner. Kalau banyak angka satunya ganjil, karakternya satu. Kalau genap, karakternya nol.",1.0,tag="KONSEP")
# 7 Penutup
b("bab7",7,"bab","",0.9)
b("t1",7,"skor","Mari kita ulang ketiga jawabannya. Jawaban soal tiga puluh dua adalah dua ribu empat puluh delapan. Jawaban soal tiga puluh tiga adalah satu nol nol. Jawaban soal tiga puluh empat adalah enam ratus delapan puluh dua.",1.0)
b("t2",7,"kredit","Soal-soal ini berasal dari OSN-K Informatika tahun dua ribu dua puluh enam, nomor tiga puluh dua sampai tiga puluh empat, yang berjudul Mondar-Mandir. Terima kasih kepada Tim Olimpiade Komputer Indonesia yang telah menyusunnya.")
b("t3",7,"akhir","Coba pikirkan, ada berapa substring satu satu di dalam MANDIR dua belas? Tulis jawabanmu di kolom komentar. Sampai jumpa di soal berikutnya!",3.0)
S={"episode":"ON10","title":"Mondar-Mandir","label":"Bedah Soal OSN-K Informatika","kind":"osn","tanpa_waktu_baca":True,
 "osn":{"tahun":"2026","tingkat":"Kabupaten/Kota","jenjang":"SMA","nomor":"32–34","judul":"Mondar-Mandir","penyusun":"Tim Olimpiade Komputer Indonesia (TOKI)","jawaban":"2048; 100; 682","sumber":[{"tahun":"2026","nomor":[32,33,34],"judul":"Mondar-Mandir"}]},
 "coba":{"32":["MANDIR(12)","Berapa banyak karakter '1'?"],"33":["S = MANDIR(2026)","Karakter ke-2025 sampai ke-2027?"],"34":["MANDIR(12)","Berapa banyak substring \"00\"?"]},
 "kunci":[["SOAL 32","banyak '1' di MANDIR(12)","2048","ribu"],["SOAL 33","posisi 2025–2027","100","nol"],["SOAL 34","banyak \"00\" di MANDIR(12)","682","enam"]],
 "kredit":[["“Mondar-Mandir”","OSN-K Informatika 2026 · SMA · No. 32–34"]],
 "berikut":"Peta Internet Sekolah",
 "alur":[["Pahami kodenya","fungsi MONDAR dan MANDIR"],["Kerjakan soalnya","nomor 32, 33, dan 34"],["Coba sendiri","pause, lalu bahas bersama"]],"alurJudul":"Satu kode, tiga soal","alurKeys":[["pahami",1],["kerjakan",1],["coba",1]],
 "ajakan":"Berapa substring \"11\" di MANDIR(12)? Tulis di komentar",
 "engine":["../_inti/osn-core.js","../_inti/osn-umum.js","scenes.js"],"parts":{"ON10":{"segs":[0,1,2,3,4,5,6,7]}},
 "segments":["Kait","Pengantar","Soal · Mondar-Mandir","Soal 32 · Banyak angka 1","Soal 33 · Posisi 2025","Soal 34 · Pasangan 00","Konsep · Thue-Morse","Penutup"],
 "tags":["KAIT","PENGANTAR","SOAL","SOAL 32","SOAL 33","SOAL 34","KONSEP","PENUTUP"],"recap":[],"next":{},"beats":B}
json.dump(S,open("script.json","w"),ensure_ascii=False,indent=1)
segn=S["segments"]; out=["# Naskah ON10 Mondar-Mandir",""]; cur=-1
for x in B:
    if x["seg"]!=cur: cur=x["seg"]; out+=[f"## {cur}. {segn[cur]}",""]
    if x["text"]: out+=[x["text"],""]
open("naskah.md","w").write("\n".join(out))
print(len(B), sum(len(x["text"]) for x in B))
