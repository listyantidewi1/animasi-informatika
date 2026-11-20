NAMA = "B00_pembuka"
REKAMAN = []
G = "/home/user/baca/gambar/"
def A(nama, **k): return dict(k='adegan', nama=nama, **k)
BEATS = {
 1: [A('pembuka', a=dict(hp=[G + 'hp_cari.png', G + 'hp_pinjam.png', G + 'hp_pinjamanku.png'], pc=[G + 'pc_peminjaman.png', G + 'pc_anggota.png']))],
 2: [A('mintaAI', a=dict(img=G + 'ai_rumah.png'))],
 3: [A('diPerpus', a=dict(img0=G + 'ai_rumah.png', img=G + 'ai_perpus.png'))],
 4: [A('diHP', a=dict(img=G + 'ai_hp.png'))],
 5: [A('asisten')],
 6: [A('petaBab')],
 7: [A('cekSegmen')],
}
