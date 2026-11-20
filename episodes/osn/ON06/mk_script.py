"""Sumber naskah ON06 -> script.json (dan naskah.md untuk Claude Doc)."""
import json
B=[]
def b(id,seg,scene,text,hold=0.6,**k): B.append(dict(id=id,seg=seg,scene=scene,text=text,hold=hold,**k))
# 0 Kait
b("k1",0,"graf","Sekelompok bebek ingin berjalan dari titik A ke titik H, dan mereka hanya boleh bergerak ke kanan mengikuti arah panah. Ada banyak sekali lajur, bahkan ada tiga lajur rahasia yang dikunci gembok. Ada berapa rute yang bisa mereka tempuh?",mode="kait")
b("k2",0,"kait_trik","Menghitung rute satu per satu pasti membuat pusing. Di video ini, kita memakai satu trik sederhana. Kita tulis satu angka di setiap titik, dan jawabannya muncul sendiri di titik H.")
b("k3",0,"kait_judul","Setelah menonton video ini, kamu bisa menghitung banyak rute di sebuah peta dengan pemrograman dinamis, tanpa mendaftar rutenya satu per satu.",1.2)
# 1 Pengantar
b("bab1",1,"bab","",0.9)
b("i2",1,"sumber","Soal di video ini berasal dari OSN-K Informatika tahun dua ribu dua puluh lima jenjang SMA, yaitu soal nomor empat belas, lima belas, dan enam belas, yang berjudul Perjalanan ke Timur. Soal ini disusun oleh Tim Olimpiade Komputer Indonesia.")
b("i3",1,"alur","Ketiga soal ini memakai peta yang sama. Kita pahami petanya dulu, lalu kita kerjakan soalnya satu per satu. Setiap soal punya waktu untuk kamu coba sendiri.",0.9)
# 2 Soal
b("bab2",2,"bab","",0.9)
b("q1",2,"graf","Bebek-bebek Pak Dengklek mulai dari titik A dan ingin mencapai titik H. Mereka hanya boleh bergerak ke kanan, mengikuti arah panah pada setiap lajur.",tag="SOAL",mode="intro")
b("q2",2,"graf","Dua titik bisa dihubungkan oleh lebih dari satu lajur. Misalnya, dari A ke B ada dua lajur yang berbeda. Dua rute dianggap berbeda kalau ada lajur yang dilewati oleh satu rute, tetapi tidak dilewati oleh rute lainnya.",tag="SOAL",mode="lajur")
b("q3",2,"graf","Ada juga tiga lajur rahasia yang dikunci gembok, yaitu lajur dari E ke D, dari D ke F, dan salah satu lajur dari D ke G. Untuk melewati lajur bergembok, bebek butuh sebuah kunci sakti, dan satu kunci hanya bisa dipakai satu kali.",tag="SOAL",mode="gembok")
b("q4",2,"graf","Ada tiga pertanyaan. Soal empat belas, berapa banyak rute kalau bebek tidak punya kunci sakti? Soal lima belas, kalau mereka punya tiga kunci. Soal enam belas, kalau mereka hanya punya satu kunci.",tag="SOAL",mode="tanya")
# 3 Soal 14
b("bab3",3,"bab","",0.9)
b("a1",3,"graf","Soal nomor empat belas. Tanpa kunci sakti, semua lajur bergembok tertutup. Berapa banyak rute dari A ke H?",0.8,tag="SOAL 14",mode="soal",soal=14)
b("a2",3,"coba","Coba hitung sendiri dulu. Pause videonya kalau perlu.",8.5,countdown=8,tag="COBA DULU",soal=14)
b("a3",3,"graf","Kita tulis di setiap titik, ada berapa rute dari A menuju titik itu. Di titik A, kita tulis satu, karena bebek sudah berada di sana. Ke titik B ada dua lajur dari A, jadi kita tulis dua.",tag="PEMBAHASAN",mode="dp")
b("a4",3,"graf","Ke titik C ada satu lajur dari B, jadi rutenya dua kali satu, yaitu dua. Ke titik D ada tiga lajur dari B, jadi dua kali tiga, yaitu enam. Ke titik E ada satu lajur dari B, jadi dua.",tag="PEMBAHASAN",mode="dp")
b("a5",3,"graf","Ke titik F ada tiga lajur dari E, jadi dua kali tiga, yaitu enam.",tag="PEMBAHASAN",mode="dp")
b("a6",3,"graf","Titik G bisa dicapai dari tiga arah. Dari C ada dua rute kali satu lajur. Dari D ada enam rute kali dua lajur, yaitu dua belas. Dari F ada enam rute kali satu lajur. Jumlahnya dua ditambah dua belas ditambah enam, yaitu dua puluh.",tag="PEMBAHASAN",mode="dp")
b("a7",3,"graf","Terakhir, dari G ke H ada tiga lajur. Jadi, banyak rute ke H adalah dua puluh kali tiga, yaitu enam puluh. Jawaban soal empat belas adalah enam puluh.",1.0,tag="JAWABAN",mode="dp")
# 4 Soal 15
b("bab4",4,"bab","",0.9)
b("b1",4,"graf","Soal nomor lima belas. Sekarang bebek punya tiga kunci sakti, jadi ketiga lajur bergembok bisa dibuka. Satu rute paling banyak melewati dua gembok, jadi kuncinya selalu cukup. Berapa banyak rutenya?",0.8,tag="SOAL 15",mode="soal",soal=15)
b("b2",4,"coba","Coba hitung sendiri dulu. Pause videonya kalau perlu.",8.5,countdown=8,tag="COBA DULU",soal=15)
b("b3",4,"graf","Angka di A, B, C, dan E tidak berubah. Titik D sekarang juga bisa dicapai dari E lewat lajur bergembok. Jadi, D bernilai enam ditambah dua, yaitu delapan.",tag="PEMBAHASAN",mode="dp")
b("b4",4,"graf","Titik F bisa dicapai dari E dengan enam rute, dan dari D lewat lajur bergembok dengan delapan rute. Jadi, F bernilai empat belas.",tag="PEMBAHASAN",mode="dp")
b("b5",4,"graf","Titik G sekarang punya tiga lajur dari D. Jadi, dari C ada dua, dari D ada delapan kali tiga, yaitu dua puluh empat, dan dari F ada empat belas. Jumlahnya empat puluh.",tag="PEMBAHASAN",mode="dp")
b("b6",4,"graf","Banyak rute ke H adalah empat puluh kali tiga, yaitu seratus dua puluh. Jawaban soal lima belas adalah seratus dua puluh.",1.0,tag="JAWABAN",mode="dp")
# 5 Soal 16
b("bab5",5,"bab","",0.9)
b("c1",5,"graf","Soal nomor enam belas. Bebek hanya punya satu kunci sakti, jadi setiap rute boleh melewati paling banyak satu gembok. Berapa banyak rutenya?",0.8,tag="SOAL 16",mode="soal",soal=16)
b("c2",5,"coba","Coba hitung sendiri dulu. Pause videonya kalau perlu.",8.5,countdown=8,tag="COBA DULU",soal=16)
b("c3",5,"graf","Dari seratus dua puluh rute di soal lima belas, kita buang rute yang melewati dua gembok. Rute seperti itu pasti lewat lajur E ke D, lalu lanjut lewat gembok kedua.",tag="PEMBAHASAN",mode="buang")
b("c4",5,"graf","Ada dua jenis rute. Jenis pertama berjalan dari B ke E, lalu ke D, lalu ke G lewat lajur bergembok. Dari A ke B ada dua cara, dan dari G ke H ada tiga cara, jadi ada dua kali tiga, yaitu enam rute.",tag="PEMBAHASAN",mode="buang")
b("c5",5,"graf","Jenis kedua berjalan dari E ke D, lalu ke F, lalu ke G. Jenis ini juga punya enam rute. Totalnya ada dua belas rute yang melewati dua gembok.",tag="PEMBAHASAN",mode="buang")
b("c6",5,"jawab16","Jadi, jawaban soal enam belas adalah seratus dua puluh dikurangi dua belas, yaitu seratus delapan.",1.0,tag="JAWABAN")
# 6 Konsep
b("bab6",6,"bab","",0.9)
b("s1",6,"konsep_dp","Cara menulis angka di setiap titik ini disebut pemrograman dinamis, atau dynamic programming. Kita memecah masalah besar menjadi masalah kecil, lalu menyimpan jawabannya supaya tidak dihitung ulang.",tag="KONSEP")
b("s2",6,"konsep_rumus","Aturannya sederhana. Banyak rute ke sebuah titik sama dengan jumlah rute ke titik asal setiap lajur yang masuk. Urutan hitungnya dari kiri ke kanan, supaya titik asal sudah dihitung lebih dulu.",tag="KONSEP")
b("s3",6,"konsep_kunci","Kalau ada syarat tambahan, seperti kunci sakti, kita cukup menyimpan lebih banyak angka di setiap titik. Misalnya, banyak rute yang belum memakai kunci, dan banyak rute yang sudah memakai satu kunci.",1.0,tag="KONSEP")
# 7 Penutup
b("bab7",7,"bab","",0.9)
b("t1",7,"skor","Mari kita ulang ketiga jawabannya. Jawaban soal empat belas adalah enam puluh. Jawaban soal lima belas adalah seratus dua puluh. Jawaban soal enam belas adalah seratus delapan.",1.0)
b("t2",7,"kredit","Soal-soal ini berasal dari OSN-K Informatika tahun dua ribu dua puluh lima, nomor empat belas sampai enam belas, yang berjudul Perjalanan ke Timur. Terima kasih kepada Tim Olimpiade Komputer Indonesia yang telah menyusunnya.")
b("t3",7,"akhir","Coba hitung sendiri, ada berapa rute tanpa kunci yang pasti melewati titik D, lalu tulis jawabanmu di kolom komentar. Sampai jumpa di soal berikutnya!",3.0)
S={"episode":"ON06","title":"Perjalanan ke Timur","label":"Bedah Soal OSN-K Informatika","kind":"osn","tanpa_waktu_baca":True,
 "osn":{"tahun":"2025","tingkat":"Kabupaten/Kota","jenjang":"SMA","nomor":"14–16","judul":"Perjalanan ke Timur","penyusun":"Tim Olimpiade Komputer Indonesia (TOKI)","jawaban":"60; 120; 108","sumber":[{"tahun":"2025","nomor":[14,15,16],"judul":"Perjalanan ke Timur"}]},
 "coba":{"14":["tanpa kunci sakti · semua gembok tertutup","Ada berapa rute dari A ke H?"],"15":["tiga kunci sakti · semua gembok bisa dibuka","Ada berapa rute dari A ke H?"],"16":["satu kunci sakti · paling banyak satu gembok","Ada berapa rute dari A ke H?"]},
 "kunci":[["SOAL 14","Tanpa kunci","60","enam"],["SOAL 15","Tiga kunci","120","seratus"],["SOAL 16","Satu kunci","108","delapan"]],
 "kredit":[["“Perjalanan ke Timur”","OSN-K Informatika 2025 · SMA · No. 14–16"]],
 "berikut":"Jadwal Pembinaan",
 "alur":[["Pahami petanya","titik, lajur, dan gembok"],["Kerjakan soalnya","nomor 14, 15, dan 16"],["Coba sendiri","pause, lalu bahas bersama"]],"alurJudul":"Satu peta, tiga soal","alurKeys":[["pahami",1],["kerjakan",1],["coba",1]],
 "ajakan":"Berapa rute tanpa kunci yang lewat D? Tulis di komentar",
 "engine":["../_inti/osn-core.js","../_inti/osn-umum.js","scenes.js"],"parts":{"ON06":{"segs":[0,1,2,3,4,5,6,7]}},
 "segments":["Kait","Pengantar","Soal · Peta Timur","Soal 14 · Tanpa kunci","Soal 15 · Tiga kunci","Soal 16 · Satu kunci","Konsep · Pemrograman dinamis","Penutup"],
 "tags":["KAIT","PENGANTAR","SOAL","SOAL 14","SOAL 15","SOAL 16","KONSEP","PENUTUP"],"recap":[],"next":{},"beats":B}
json.dump(S,open("script.json","w"),ensure_ascii=False,indent=1)
segn=S["segments"]; out=["# Naskah ON06 Perjalanan ke Timur",""]; cur=-1
for x in B:
    if x["seg"]!=cur: cur=x["seg"]; out+=[f"## {cur}. {segn[cur]}",""]
    if x["text"]: out+=[x["text"],""]
open("naskah.md","w").write("\n".join(out))
print(len(B), sum(len(x["text"]) for x in B))
