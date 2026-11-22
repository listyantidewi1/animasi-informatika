# Dijalankan di dalam Blender GUI: terbang melihat kota untuk rekaman F04g.
import bpy, time, json, math
from mathutils import Euler, Vector
LOG = "/tmp/gui_f04.json"
tanda = []
def T(n): tanda.append([time.time(), n]); json.dump(tanda, open(LOG, "w"))

def area(tipe):
    for w in bpy.context.window_manager.windows:
        for a in w.screen.areas:
            if a.type == tipe: return w, a
    return None, None

w, a = area('VIEW_3D')
sp = a.spaces[0]; r3 = sp.region_3d
sp.shading.type = 'MATERIAL'
sp.shading.use_scene_world = True
sp.shading.use_scene_lights = True
sp.shading.color_type = 'TEXTURE'
sp.shading.show_cavity = True
sp.overlay.show_extras = False      # sembunyikan ikon lampu dan kamera
sp.overlay.show_relationship_lines = False
sp.overlay.show_floor = False
sp.overlay.show_axis_x = False
sp.overlay.show_axis_y = False
sp.clip_end = 3000
r3.view_perspective = 'PERSP'
# sembunyikan hujan dan kabut (kotak volume) supaya kota terlihat
for o in bpy.data.objects:
    n = o.name.lower()
    if any(k in n for k in ("hujan", "kabut", "rain", "fog", "volume")):
        o.hide_set(True)

# (detik, pusat, jarak, sudut horizontal derajat, sudut turun derajat)
JALUR = [
    (0.0, (0, 10, 2), 70, -30, 28, "kenanga"),
    (3.0, (0, 10, 2), 70, -30, 28, None),
    (12.0, (0, 30, 2), 45, 90, 18, None),
    (13.5, (0, 30, 2), 45, 90, 18, None),
    (13.51, (-300, -10, 2), 60, 160, 25, "gang"),
    (16.0, (-300, -10, 2), 60, 160, 25, None),
    (26.0, (-300, 0, 2), 32, 280, 14, None),
    (30.0, (-300, 0, 2), 32, 280, 14, "akhir"),
]

def halus(x): return x * x * (3 - 2 * x)

def atur(t):
    for i in range(len(JALUR) - 1):
        t0, c0, d0, h0, v0, _ = JALUR[i]
        t1, c1, d1, h1, v1, _ = JALUR[i + 1]
        if t0 <= t <= t1:
            k = halus((t - t0) / max(t1 - t0, 1e-6))
            c = Vector(c0).lerp(Vector(c1), k)
            d = d0 + (d1 - d0) * k
            h = h0 + (h1 - h0) * k
            v = v0 + (v1 - v0) * k
            r3.view_location = c
            r3.view_distance = d
            r3.view_rotation = Euler((math.radians(90 - v), 0, math.radians(h)), 'XYZ').to_quaternion()
            a.tag_redraw()
            return True
    return False

mulai = [None]; sudah = set()
# pemanasan: kunjungi kedua tempat dulu supaya shader EEVEE selesai dikompilasi
PANAS = [(13.6, 0.0), (0.0, 0.0), (26.0, 0.0)]
t_panas = [time.time()]
def jalan():
    if PANAS:
        if time.time() - t_panas[0] < 18: return 0.5
        atur(PANAS.pop(0)[0]); t_panas[0] = time.time(); return 0.5
    if mulai[0] is None:
        atur(0); mulai[0] = time.time() + 2; T("buka")
    if time.time() < mulai[0]: return 1 / 30
    t = time.time() - mulai[0]
    for tt, *_x, nama in JALUR:
        if nama and t >= tt and nama not in sudah:
            sudah.add(nama); T(nama)
    if not atur(t) or "akhir" in sudah:
        return None
    return 1 / 30

atur(0)
bpy.app.timers.register(jalan, first_interval=3.0)
