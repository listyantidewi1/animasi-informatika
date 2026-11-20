"""Sumber naskah ON02 -> script.json (dan naskah.md untuk Claude Doc)."""
import json
B=[]
def b(id,seg,scene,text,hold=0.6,**k): B.append(dict(id=id,seg=seg,scene=scene,text=text,hold=hold,**k))
# 0 Kait
b("k1",0,"kait_empat","Ada empat soal OSN-K di video ini. Keempatnya bisa dijawab hanya dengan kertas dan pensil, tanpa menulis satu baris kode pun.")
b("k2",0,"kait_daftar","Ada mesin yang mengolah deretan angka, ada tembolok komputer, ada pesan berantai, dan ada permainan mencari koin. Hitung berapa soal yang bisa kamu jawab sebelum pembahasannya dimulai.")
b("k3",0,"kait_judul","Setelah menonton video ini, kamu bisa menjalankan aturan langkah demi langkah dengan teliti, dan kamu akan mengenal empat ide penting dalam informatika.",1.2)
# 1 Pengantar
b("bab1",1,"bab","",0.9)
b("i1",1,"tahap","Halo, selamat datang di Bedah Soal OSN-K Informatika. OSN-K adalah Olimpiade Sains Nasional tingkat kabupaten dan kota, yaitu babak pertama sebelum tingkat provinsi dan tingkat nasional.")
b("i2",1,"sumber","Tiga soal pertama berasal dari OSN-K Informatika tahun dua ribu dua puluh enam, yaitu soal nomor satu, dua, dan tiga. Soal keempat berasal dari OSN-K tahun dua ribu dua puluh lima, soal nomor enam. Semuanya untuk jenjang SMA, dan disusun oleh Tim Olimpiade Komputer Indonesia.")
b("i3",1,"alur","Caranya begini. Untuk setiap soal, kita pahami soalnya dulu. Lalu, kamu punya waktu untuk mencoba. Setelah itu, kita bahas bersama-sama.",0.9)
# 2 Soal 1 KWAK KWIK
b("bab2",2,"bab","",0.9)
b("a1",2,"kw_intro","Soal pertama berjudul “Operasi KWAK dan KWIK”. Pak Dengklek punya mesin yang mengolah deretan bilangan dari kiri ke kanan. Mesin ini punya dua operasi.",tag="SOAL 1")
b("a2",2,"kw_kwak","Operasi pertama bernama KWAK. Mesin mengambil dua bilangan paling kiri, lalu menghitung selisihnya. Selisih ini selalu positif, jadi yang besar dikurangi yang kecil. Hasilnya dimasukkan kembali ke ujung kiri.",tag="SOAL 1")
b("a3",2,"kw_kwik","Operasi kedua bernama KWIK. Mesin mengambil bilangan paling kanan, lalu menambahkan bilangan itu ke setiap bilangan yang tersisa.",tag="SOAL 1")
b("a4",2,"kw_soal","Deretan awalnya adalah dua, lima, tiga, empat, satu, dua. Lalu, mesin menjalankan KWAK, KWIK, KWAK, KWIK, dan KWIK. Pada akhirnya, hanya tersisa satu bilangan. Bilangan berapakah itu?",0.8,tag="SOAL 1")
b("a5",2,"coba","Coba hitung dulu. Pause videonya kalau kamu butuh waktu lebih lama.",8.5,countdown=8,tag="COBA DULU",soal=1)
b("a6",2,"kw_jalan","Kita jalankan satu per satu. KWAK yang pertama mengambil dua dan lima. Selisihnya tiga, jadi deretannya menjadi tiga, tiga, empat, satu, dua.",tag="PEMBAHASAN",langkah=1)
b("a7",2,"kw_jalan","KWIK yang pertama mengambil dua dari ujung kanan, lalu menambahkan dua ke setiap bilangan. Deretannya menjadi lima, lima, enam, tiga.",tag="PEMBAHASAN",langkah=2)
b("a8",2,"kw_jalan","KWAK yang kedua mengambil lima dan lima. Selisihnya nol, jadi deretannya menjadi nol, enam, tiga.",tag="PEMBAHASAN",langkah=3)
b("a9",2,"kw_jalan","KWIK yang kedua mengambil tiga, lalu menambahkannya ke nol dan enam. Deretannya menjadi tiga, sembilan. KWIK yang terakhir mengambil sembilan, lalu menambahkannya ke tiga. Hasilnya dua belas.",tag="PEMBAHASAN",langkah=5)
b("a10",2,"kw_jawab","Jadi, jawaban soal pertama adalah dua belas. Jebakannya ada di operasi KWIK. Bilangan yang diambil tidak ikut tersisa, jadi banyaknya bilangan di deretan selalu berkurang satu.",tag="JAWABAN")
b("a11",2,"kw_konsep","Cara mengerjakan soal ini disebut menelusuri langkah demi langkah. Tulis keadaan deretan setelah setiap operasi, dan jangan melompati langkah di dalam kepala. Programmer melakukan hal yang sama saat memeriksa programnya.",1.0,tag="KONSEP")
# 3 Soal 2 Tembolok
b("bab3",3,"bab","",0.9)
b("b1",3,"tb_intro","Soal kedua berjudul “Tembolok Komputer”. Tembolok adalah nama lain dari cache, yaitu tempat penyimpanan kecil yang cepat. Komputer menyimpan data yang baru saja dipakai di sana, supaya data itu bisa diambil lagi dengan cepat.",tag="SOAL 2")
b("b2",3,"tb_aturan","Tembolok Pak Dengklek hanya muat tiga data, dan pada awalnya kosong. Kalau data yang diakses belum ada di tembolok dan tembolok masih punya tempat, data itu langsung dimasukkan.",tag="SOAL 2",rule=1)
b("b3",3,"tb_aturan","Kalau tembolok sudah penuh, tembolok mengeluarkan data yang paling lama tidak diakses. Setiap kali sebuah data diakses, tembolok mencatat waktunya, termasuk kalau data itu sudah ada di dalam.",tag="SOAL 2",rule=2)
b("b4",3,"tb_soal","Pak Dengklek mengakses data A, B, C, A, D, B, E, lalu A. Setelah itu, ia akan mengakses data F. Data apakah yang dikeluarkan untuk memberi tempat bagi F?",0.8,tag="SOAL 2")
b("b5",3,"coba","Coba kerjakan dulu. Tuliskan isi tembolok setelah setiap akses.",8.5,countdown=8,tag="COBA DULU",soal=2)
b("b6",3,"tb_jalan","Kita beri nomor waktu pada setiap akses. A diakses di waktu satu, B di waktu dua, dan C di waktu tiga. Sekarang, tembolok sudah penuh.",tag="PEMBAHASAN",upto=3)
b("b7",3,"tb_jalan","Di waktu empat, A diakses lagi. A sudah ada di dalam, jadi tidak ada yang keluar. Tetapi, catatan waktu A berubah menjadi empat.",tag="PEMBAHASAN",upto=4)
b("b8",3,"tb_jalan","Di waktu lima, D datang. Yang paling lama tidak diakses adalah B, dengan catatan waktu dua. Jadi, B keluar dan D masuk.",tag="PEMBAHASAN",upto=5)
b("b9",3,"tb_jalan","Di waktu enam, B datang lagi. Sekarang yang paling lama adalah C, jadi C keluar. Di waktu tujuh, E datang, dan A keluar karena catatan waktunya empat.",tag="PEMBAHASAN",upto=7)
b("b10",3,"tb_jalan","Di waktu delapan, A datang lagi, dan D keluar. Isi tembolok sekarang adalah B dengan waktu enam, E dengan waktu tujuh, dan A dengan waktu delapan.",tag="PEMBAHASAN",upto=8)
b("b11",3,"tb_jawab","Ketika F datang, yang paling lama tidak diakses adalah B. Jadi, jawaban soal kedua adalah B. Kalau kamu menjawab D, kamu mungkin mengeluarkan data yang paling lama masuk, bukan data yang paling lama tidak diakses.",tag="JAWABAN")
b("b12",3,"tb_konsep","Aturan cache ini disebut LRU, singkatan dari least recently used, yang artinya paling lama tidak dipakai. Browser dan prosesor komputer memakai ide yang sama, karena data yang baru saja dipakai biasanya akan segera dipakai lagi.",1.0,tag="KONSEP")
# 4 Soal 3 Pesan rahasia
b("bab4",4,"bab","",0.9)
b("c1",4,"ps_graf","Soal ketiga berjudul “Aplikasi Pesan Rahasia”. Ada delapan bebek, yaitu A sampai H. Setiap tanda panah berarti bebek di pangkal panah menyimpan bebek di ujung panah sebagai kontak.",tag="SOAL 3",mode="intro")
b("c2",4,"ps_graf","Kalau seekor bebek menerima pesan untuk pertama kalinya pada suatu menit, satu menit kemudian pesan itu diteruskan ke semua kontaknya sekaligus. Kalau pesan yang sama datang lagi, pesan itu diabaikan.",tag="SOAL 3",mode="aturan")
b("c3",4,"ps_graf","Di menit nol, bebek A menerima pesan. Bebek manakah yang paling terakhir menerima pesan? Kalau ada lebih dari satu, pilih yang hurufnya paling awal dalam urutan abjad.",0.8,tag="SOAL 3",mode="tanya")
b("c4",4,"coba","Coba telusuri dulu panah-panahnya. Pause videonya kalau perlu.",8.5,countdown=8,tag="COBA DULU",soal=3)
b("c5",4,"ps_graf","Di menit satu, A meneruskan pesan ke kontaknya, yaitu B dan C.",tag="PEMBAHASAN",mode="jalan",menit=1)
b("c6",4,"ps_graf","Di menit dua, B meneruskan ke F, sedangkan C meneruskan ke D dan E. Jadi, D, E, dan F menerima pesan di menit dua.",tag="PEMBAHASAN",mode="jalan",menit=2)
b("c7",4,"ps_graf","Di menit tiga, D juga mengirim ke F. Tetapi, F sudah menerima pesan, jadi pesan itu diabaikan. Sementara itu, E meneruskan ke G, dan F meneruskan ke H. Jadi, G dan H menerima pesan di menit tiga.",tag="PEMBAHASAN",mode="jalan",menit=3)
b("c8",4,"ps_graf","Di menit empat, G juga mengirim ke H, tetapi H sudah menerima pesan. Tidak ada bebek baru yang menerima pesan, jadi penyebarannya selesai.",tag="PEMBAHASAN",mode="jalan",menit=4)
b("c9",4,"ps_graf","Bebek yang paling terakhir menerima pesan adalah G dan H, yaitu di menit tiga. Karena G lebih awal dalam abjad, jawaban soal ketiga adalah G. Jebakannya, H terlihat paling jauh di gambar, padahal H sudah menerima pesan lewat jalur atas.",tag="JAWABAN",mode="jawab",menit=4)
b("c10",4,"ps_konsep","Cara menyebarkan pesan lapis demi lapis seperti ini disebut pencarian melebar, atau BFS. Menit penerimaan setiap bebek sama dengan jarak terpendeknya dari A. Ide ini dipakai untuk mencari rute terpendek, misalnya di aplikasi peta.",1.0,tag="KONSEP")
# 5 Soal 4 Pencarian koin
b("bab5",5,"bab","",0.9)
b("d1",5,"bs_intro","Soal keempat berasal dari OSN-K tahun dua ribu dua puluh lima, soal nomor enam, berjudul “Pencarian Koin”. Ada dua ratus lima puluh lima bebek yang berbaris dari barat ke timur, bernomor satu sampai dua ratus lima puluh lima. Salah satu bebek memegang koin.",tag="SOAL 4")
b("d2",5,"bs_aturan","Pak Dengklek boleh bertanya kepada satu bebek. Kalau bebek itu memegang koin, permainan selesai. Kalau tidak, bebek itu memberi tahu apakah koinnya ada di sebelah barat atau di sebelah timur.",tag="SOAL 4")
b("d3",5,"bs_soal","Pak Dengklek selalu bertanya kepada bebek yang berada tepat di tengah barisan yang masih mungkin. Jawaban yang ia dapat berturut-turut adalah barat, barat, timur, barat, timur, lalu koin ditemukan pada pertanyaan keenam. Bebek nomor berapakah yang memegang koin?",0.8,tag="SOAL 4")
b("d4",5,"coba","Coba hitung dulu. Pause videonya kalau perlu.",8.5,countdown=8,tag="COBA DULU",soal=4)
b("d5",5,"bs_jalan","Pada awalnya, bebek yang mungkin adalah nomor satu sampai dua ratus lima puluh lima. Bebek di tengah adalah nomor seratus dua puluh delapan. Jawabannya barat, jadi yang tersisa adalah nomor satu sampai seratus dua puluh tujuh.",tag="PEMBAHASAN",q=[1])
b("d6",5,"bs_jalan","Tengahnya sekarang adalah nomor enam puluh empat. Jawabannya barat lagi, jadi tersisa nomor satu sampai enam puluh tiga. Lalu, tengahnya nomor tiga puluh dua, dan jawabannya timur. Tersisa nomor tiga puluh tiga sampai enam puluh tiga.",tag="PEMBAHASAN",q=[2,3])
b("d7",5,"bs_jalan","Tengahnya nomor empat puluh delapan, dan jawabannya barat. Tersisa nomor tiga puluh tiga sampai empat puluh tujuh. Tengahnya nomor empat puluh, dan jawabannya timur. Tersisa nomor empat puluh satu sampai empat puluh tujuh.",tag="PEMBAHASAN",q=[4,5])
b("d8",5,"bs_jalan","Pertanyaan keenam ditujukan kepada bebek di tengah, yaitu nomor empat puluh empat, dan ternyata ia memegang koinnya. Jadi, jawaban soal keempat adalah empat puluh empat.",tag="JAWABAN",q=[6])
b("d9",5,"bs_konsep","Strategi ini disebut pencarian biner. Setiap pertanyaan membuang separuh barisan. Karena itu, dua ratus lima puluh lima bebek bisa diperiksa dengan paling banyak delapan pertanyaan. Kalau bertanya satu per satu, kita mungkin butuh dua ratus lima puluh lima pertanyaan.",1.0,tag="KONSEP")
# 6 Penutup
b("bab6",6,"bab","",0.9)
b("t1",6,"skor","Mari kita lihat lagi keempat jawabannya. Soal pertama dua belas, soal kedua B, soal ketiga G, dan soal keempat empat puluh empat. Berapa yang berhasil kamu jawab?",1.0)
b("t2",6,"ringkas","Keempat soal ini melatih hal yang sama, yaitu menjalankan aturan dengan teliti, satu langkah demi satu langkah, sambil mencatat keadaan setiap langkah. Kemampuan ini sangat penting saat kamu menulis dan memeriksa program.")
b("t3",6,"kredit","Soal-soal ini berasal dari OSN-K Informatika tahun dua ribu dua puluh enam nomor satu, dua, dan tiga, serta tahun dua ribu dua puluh lima nomor enam. Terima kasih kepada Tim Olimpiade Komputer Indonesia yang telah menyusun soal-soal ini.")
b("t4",6,"akhir","Kalau kamu ingin berlatih soal lain, kamu bisa mencobanya di situs latihan TOKI. Tulis skormu di kolom komentar, ya. Sampai jumpa di soal berikutnya!",3.0)
S={"episode":"ON02","title":"Empat Soal OSN-K Tanpa Coding","label":"Bedah Soal OSN-K Informatika","kind":"osn","tanpa_waktu_baca":True,
 "osn":{"tahun":"2026","tingkat":"Kabupaten/Kota","jenjang":"SMA","nomor":"1, 2, 3 + 2025 No. 6","judul":"Empat Soal Tanpa Coding","penyusun":"Tim Olimpiade Komputer Indonesia (TOKI)","jawaban":"12, B, G, 44",
  "bar":{"1":"OSN-K 2026 No. 1-3 + 2025 No. 6 · SMA · Empat Soal Tanpa Coding","2":"OSN-K 2026 · SMA · No. 1 · Operasi KWAK dan KWIK","3":"OSN-K 2026 · SMA · No. 2 · Tembolok Komputer","4":"OSN-K 2026 · SMA · No. 3 · Aplikasi Pesan Rahasia","5":"OSN-K 2025 · SMA · No. 6 · Pencarian Koin","6":"OSN-K 2026 No. 1-3 + 2025 No. 6 · SMA · Empat Soal Tanpa Coding"}},
 "engine":["../_inti/osn-core.js","scenes.js"],"parts":{"ON02":{"segs":[0,1,2,3,4,5,6]}},
 "segments":["Kait","Pengantar","Soal 1 · KWAK dan KWIK","Soal 2 · Tembolok Komputer","Soal 3 · Pesan Rahasia","Soal 4 · Pencarian Koin","Penutup"],
 "tags":["KAIT","PENGANTAR","SOAL 1","SOAL 2","SOAL 3","SOAL 4","PENUTUP"],"recap":[],"next":{},"beats":B}
json.dump(S,open("script.json","w"),ensure_ascii=False,indent=1)
# naskah.md
segn=S["segments"]; out=["# Naskah ON02 Empat Soal OSN-K Tanpa Coding",""]; cur=-1
for x in B:
    if x["seg"]!=cur: cur=x["seg"]; out+=[f"## {cur}. {segn[cur]}",""]
    if x["text"]: out+=[x["text"],""]
open("naskah.md","w").write("\n".join(out))
print(len(B), sum(len(x["text"]) for x in B))
