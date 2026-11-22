# Dijalankan di dalam Blender GUI: menggerakkan tampilan untuk rekaman F03c.
import bpy, time, json
LOG = "/tmp/gui_f03.json"
t0 = time.time(); tanda = []
def T(n): tanda.append([time.time(), n]); json.dump(tanda, open(LOG, "w"))
def area(tipe):
    for w in bpy.context.window_manager.windows:
        for a in w.screen.areas:
            if a.type == tipe: return w, a
    return None, None
def kamera_view():
    w, a = area('VIEW_3D')
    if a:
        a.spaces[0].region_3d.view_perspective = 'CAMERA'
        a.spaces[0].shading.type = 'SOLID'
        with bpy.context.temp_override(window=w, area=a, region=[r for r in a.regions if r.type=='WINDOW'][0]):
            bpy.ops.view3d.view_center_camera()
def zoom_timeline(a_, b_):
    w, a = area('DOPESHEET_EDITOR')
    if not a: w, a = area('TIMELINE')
    if a:
        r = [r for r in a.regions if r.type == 'WINDOW'][0]
        sc = bpy.context.scene; s0, s1 = sc.frame_start, sc.frame_end
        sc.frame_preview_start, sc.frame_preview_end = a_, b_; sc.use_preview_range = True
        with bpy.context.temp_override(window=w, area=a, region=r):
            bpy.ops.action.view_all() if a.type == 'DOPESHEET_EDITOR' else bpy.ops.time.view_all()
        sc.use_preview_range = False
langkah = []
def L(dt, f): langkah.append((dt, f))
sc = bpy.context.scene
sc.sync_mode = "FRAME_DROP"
L(1.0, lambda: (T("buka"), kamera_view()))
L(4.0, lambda: (T("marker"),))
L(5.0, lambda: (T("putar"), bpy.ops.screen.animation_play()))
L(14.0, lambda: (T("berhenti"), bpy.ops.screen.animation_cancel(restore_frame=False)))
L(1.5, lambda: (T("batas_zoom"), zoom_timeline(770, 815)))
L(2.5, lambda: (T("f792"), sc.frame_set(792)))
L(4.0, lambda: (T("f793"), sc.frame_set(793)))
L(4.0, lambda: (T("f792b"), sc.frame_set(792)))
L(2.0, lambda: (T("f793b"), sc.frame_set(793)))
L(3.0, lambda: (T("akhir"),))
def jalan():
    if not langkah: return None
    dt, f = langkah.pop(0)
    try: f()
    except Exception as e: print("LANGKAH GAGAL", e)
    return langkah[0][0] if langkah else None
bpy.app.timers.register(jalan, first_interval=langkah[0][0] if False else 2.0)
