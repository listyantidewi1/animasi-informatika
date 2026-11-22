# Blender GUI (EEVEE viewport, cahaya adegan): beberapa sudut kota sebagai foto diam untuk F04g.
# Viewport EEVEE di cloud tanpa GPU hanya ±0,25 fps, jadi tur kota dibuat dari foto + gerak pelan saat menyunting.
import bpy, time, json, math
from mathutils import Euler, Vector
LOG = "/tmp/gui_f04.json"; tanda = []
def T(n): tanda.append([time.time(), n]); json.dump(tanda, open(LOG, "w"))
w = a = None
for win in bpy.context.window_manager.windows:
    for ar in win.screen.areas:
        if ar.type == 'VIEW_3D': w, a = win, ar
sp = a.spaces[0]; r3 = sp.region_3d
sp.shading.type = 'MATERIAL'
sp.shading.use_scene_world = True; sp.shading.use_scene_lights = True
for k in ("show_extras", "show_relationship_lines", "show_floor", "show_axis_x", "show_axis_y", "show_cursor", "show_text"):
    setattr(sp.overlay, k, False)
sp.clip_end = 3000; r3.view_perspective = 'PERSP'
for o in bpy.data.objects:
    if any(k in o.name.lower() for k in ("hujan", "kabut", "rain", "fog", "volume")): o.hide_set(True)
SUDUT = [  # nama, pusat, jarak, arah, turun
    ("kenanga_atas", (0, 10, 2), 70, -30, 28),
    ("kenanga_simpang", (0, 40, 2), 40, 70, 16),
    ("kali", (297, 20, 1), 45, -60, 20),
    ("gang_atas", (-300, -10, 2), 60, 160, 25),
    ("gang_dekat", (-300, 0, 2), 30, 280, 12),
]
def atur(c, d, h, v):
    r3.view_location = Vector(c); r3.view_distance = d
    r3.view_rotation = Euler((math.radians(90 - v), 0, math.radians(h)), 'XYZ').to_quaternion()
    a.tag_redraw()
antre = list(SUDUT)
def jalan():
    if not antre: T("akhir"); return None
    n, c, d, h, v = antre.pop(0); atur(c, d, h, v); T(n); return 40.0
bpy.app.timers.register(jalan, first_interval=3.0)
