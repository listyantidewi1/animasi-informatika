# Perangkat gambar dokumenter (dokkit) — ringkasan API untuk penulis adegan

Dimuat sesudah sinema_dok.js. Pratinjau: python3 episodes/_alat/kit_preview.py <modul> [t ...].


## orang

I applied all ten review fixes, and none of them had to be skipped for conflicting with the art direction. The preview runs with no page errors, and the showcase median luminance is still 106/255. I checked the result in the showcase and in close-ups at the review's sizes: Bu Rina on the phone at h=1600, the night bedroom, the family seated, a dining table and the bed edge. Only `episodes/_alat/dokkit/orang.js` was edited, and nothing was committed.

**Fixes, in review order**
1. **Arms in `telepon` / `pegangHP`:** elbows now stay below the shoulder and close to the body. If a reach would push the elbow out, the upper arm is shortened, as if pointing at the camera, instead of sticking out. Every arm and leg is now one round-capped stroke of constant width, so nothing narrows to a point. In `pegangHP` both elbows are tucked and both hands hold the phone in front of the chest.
2. **Back hand:** the back arm now hangs slightly outside the body, so a darker sleeve strip shows above the hand.
3. **Hands:** the lighter inner circle is gone. Hands use the same shading as the head, with a darker crescent on the shadow side.
4. **Daster and seated skirts:** the daster is one continuous outline from shoulder to hem, with an unbroken pattern. Ankles under long skirts are skin-coloured. Seated long skirts and sarongs are one cloth shape that carries the `motifBawah` pattern, so nenek's batik now shows when she sits.
5. **Sleeping face:** no eyebrows, wider soft closed-eye arcs, the head less rotated, and the pillow, head and body moved about 8% of the bed width away from the headboard.
6. **Sweat drops:** placed inside the face at the temple (so on the face, not the hijab), fully opaque `#9FE6FF` with a white highlight. They grow in and fade only at the end of the slide.
7. **Eyes and brows on dark skin / small sizes:** eyes have a minimum size in screen pixels (about 6×8 px). A faint lighter patch sits under the eyes, scaled by how dark the skin is. Hijab and bald figures use a fixed dark brow; grey brows switch to light grey on mid and dark skin.
8. **Pose changes and new poses:** `opt.blend {to, k}` blends between two poses. New `kucek` pose (rubbing a sleepy eye). New `opt.jalan` puts walking legs under any upper-body pose, so the child can walk in sleepily with `kucek`. New `opt.duduk`, and `kursi:'ranjang'` (sitting on the edge of the bed).
9. **Dining table and seated figures:** new `meja` option, `opt.mejaY`, new `dudukMeja` pose, a two-pass `lapis` option, and helpers `meja()` and `mejaY()`. Seated figures now show a short horizontal thigh with the stool under the hip. In `menulis` both forearms lie flat on the table. For a hijab wearer, the front upper arm now goes under the hijab.
10. **Smaller items:**
    - The hood's face opening shifts toward the facing side in side view.
    - Kakek's side-view glasses have a near lens on the eye, a thin far lens and an arm to the ear.
    - The shine on `pendek` hair is lowered to 0.06. It was already 0.13, not much above the review's 0.12, so I went lower.
    - New poses `videoCall` (landscape phone at arm's length) and `tunjukBarang` (holding up a product), plus `hpStand()` (phone on a tripod with a ring light).
    - New `layar:'panggilan'` incoming-call screen. It uses icons only (a "?" avatar and green/red buttons), because the text rule (meaningful text ≥40 px) can't be met on a phone in someone's hand. For readable close-ups, pass a `K.kit.layar` screen as `layar`.

**One deliberate choice:** in `telepon`, the phone at the ear still shows its screen (a cheat, so it reads as a phone) instead of its back.

---

## API summary for scene writers (`K.kit.orang`)

**Units.** `h` is always the standing height in px, whatever the age. Internally a figure is about 92 units tall for `dewasa`, 92 for `remaja`, 70.5 for `anak` and 86 for `lansia`, so 1 unit ≈ h/92 for an adult; the exact px per unit is returned as `anchors.scale`. To make a child shorter, pass a smaller `h` (about 0.65–0.75 × an adult's).

**Recommended sizes**
- Full figure: h 200–900.
- Chest-up close-up: `draw` with h 1400–1700, feet below the frame, or `kepala` with r 60–300.
- Crowd: h 150–250 (eyes stay readable down to about h 150).
- The phone in a hand is about 0.14·h tall.

### `draw(ctx, x, y, h, opt) -> anchors`
`(x, y)` = centre of the feet on the floor. Saves and restores `ctx`.

**Pose and blending**
- `pose`: `berdiri`, `jalan`, `duduk`, `tidur`, `telepon`, `pegangHP`, `garuk`, `panik`, `lega`, `bisik`, `menulis`, `kucek`, `videoCall`, `tunjukBarang`, `dudukMeja`.
- `blend: {to, k}` (k 0..1; ease it yourself). It blends arms, head tilt, lean, look and the held object.
  - Legs stay those of `pose`.
  - If both poses hold the same object it moves smoothly; otherwise it cross-fades at k=0.5.
  - Example for Ch9: `{pose:'telepon', blend:{to:'pegangHP', k}}`.
- `jalan: true`: walking legs, side view, under any upper-body pose (`kucek`, `telepon`, `pegangHP`); `speed` defaults to 1.7.
- `duduk: true`: seated legs under any upper-body pose.
- `flip`: face left.

**Face and body**
- `face`: `netral`, `panik`, `sedih`, `senang`, `ngantuk`, `bingung`, `tertawa`, `tidur`. Default comes from the pose.
- `look: [x, y]` (−1..1); `alis` (`false` hides brows on a neutral face); `mulut`, `pipi`, `keringat`, `airmata` (`false` hides tears on a sad face).
- `age`: `dewasa`, `remaja`, `anak`, `lansia`.
- `skin`: a colour, or an index into `SKIN` — 0 langsat, 1 kuning, 2 sawo terang, 3 sawo matang, 4 cokelat, 5 cokelat tua.
- `hair`: `pendek`, `panjang`, `hijab`, `kuncir`, `uban`, `botak`, `hood`; plus `hairCol`, `sanggul`, `peci`, `kacamata`.
- `hijab`, `ciput`: colours.

**Clothes**
- `outfit`: `kaos`, `kemeja`, `daster`, `hoodie`, `kebaya`.
- `bawah`: `celana`, `pendek`, `rok`, `rokPanjang`, `sarung`, `daster`.
- `lengan`: `pendek`, `panjang`.
- `top`, `bottom`, `sepatu`: colours.
- `motif`, `motifBawah`: `titik`, `garis`, `kotak`, `batik`.

**Phone and held objects**
- `layar` (screen of the built-in phone):
  - `true` / `'chat'`: chat screen.
  - `'panggilan'`: incoming call, unknown caller.
  - `'bicara'`: call in progress. Default for `telepon`.
  - `'video'`: video call. Default for `videoCall`. Set the face shown with `wajah` (kepala options) and flicker with `glitch` 0..1.
  - `false`: screen off.
  - A function `(ctx, w=100, h, t)`: your own screen, e.g. `(c,w,h,t)=>K.kit.layar.panggilanMasuk(c,w,h,{t})`.
- `dering` (phone shakes); `glow` (true/false; on by default for `pegangHP` and `videoCall`).
- `holding(ctx, info)`: replaces the built-in object. Drawn at the front hand in body units; `info = {pose, t, unit, flip}`.
- `produkCol`: colour of the product for `tunjukBarang`.

**Seats and tables**
- `kursi`: `true` (stool, the default), `false`, or `'ranjang'` (bed edge; implies sitting; `ranjangCol`, `ranjangPanjang` in units, default 84, `selimut`).
- `kursiCol`: stool colour.
- `meja`: `menulis` draws its own table by default; `dudukMeja` does not. Pass `true`/`false` to override.
- `mejaY`: table-top y in px; forearms rest on it.
- `mejaCol`: colour of a table the figure draws itself.
- `lapis`:
  - `'semua'` (default): draw everything.
  - `'badan'`: everything except forearms, hands and the held object.
  - `'lengan'`: only those.

  For a shared table: draw everyone with `'badan'`, then the table, then everyone with `'lengan'`.

**Other:** `tanya` (question mark; shown by default for `garuk`), `garisBisik`, `alpha`, `seed` (phase of blinking and breathing), `t`.

**Anchors returned (px)**
- `head`: head centre. `top`: top of the head.
- `hand`: front hand. `handB`: back hand.
- `chest`, `feet`, `scale` (px per unit).
- `seat`: seat-top centre when sitting.
- `table`: `[centre x, top y]` for table poses.
- `bed`: mattress centre for `kursi:'ranjang'`.
- `phone`: phone centre when the built-in phone is held.

**`tidur`:** `(x, y)` = bottom centre of the bed on the floor. Options: `guling`, `zzz`, `selimut`, `ranjangCol`. Returns `head`, `top`, `bed`, `hand`, `feet`, `scale`. The bed is about 1.35·h wide.

### Other functions
- **`crowd(ctx, x, y, w, n, {h, t, seed, flip, gesture(i) -> pose | opt, each(i, o) -> o})`** → array of anchors.
- **`preset(name)`** → opt: `buRina`, `anakRina`, `ayah`, `nenek`, `kakek`, `adik`, `pelaku`.
- **`kepala(ctx, cx, cy, r, opt)`**: head only. `r` = head radius in px. Extra options: `view:'q'|'side'`, `tilt`, `bahu` (`false`, or shoulder depth in head radii, default 1.1), `mouthStyle`.
- **`hp(ctx, x, y, size, {layar, land, rot, ring, glow, back, wajah, glitch, t})`**: phone by itself. `(x, y)` = centre; `size` = height, or width when `land`.
- **`hpStand(ctx, x, y, size, {t, depan, layar})`**: tripod with ring light. `(x, y)` = base; `size` = total height. Shows the phone's back unless `depan`. Returns `{phone, top}`.
- **`meja(ctx, cx, yTop, w, yFloor, {col, kain, th})`**: shared table. Returns `{top, x0, x1}`.
- **`mejaY(y, h, age)`**: default table-top y (px) for a seated figure with feet at `y`.
- **Constants:** `SKIN`, `SKIN_NAMA`, `POSES`, `FACES`, `HAIRS`, `PRESETS`, `AGE`.

Files are in `/home/user/animasi-informatika/episodes/_alat/dokkit/`:
- orang.js
- preview/orang_t0.png
- preview/orang_t1.7.png
- preview/orang_t3.4.png

Close-up test renders and the backup are in `/tmp/claude-0/-home-user-animasi-informatika/7bbb579f-0a34-527b-9ec2-9731adf36e4a/scratchpad/`:
- v2_closeup_0.png
- v2_night_0.png
- v2_family_1.7.png
- v2_dinner_0.png
- v2_bed_0.png
- test2.py (script that makes them)
- orang_before_review.js (the module before these fixes)

## latar

**`latar` module: final API for scene writers (D03)**

File: `/home/user/animasi-informatika/episodes/_alat/dokkit/latar.js`. Previews are in `/home/user/animasi-informatika/episodes/_alat/dokkit/preview/` (`latar_t0.png`, `latar_t1.7.png`, `latar_t3.4.png`). The preview script reports no page errors and nothing in `missing`. I checked full-size frames of every set as well. No other files were edited and nothing was committed. `orang.js` also shows as modified in git, but that change is not mine.

**All 10 review fixes are applied; none were skipped.** One change differs from what the review literally asked for:
- **Fix 2 (wall light):** the review asked for an additive amber pool at about 0.3. I tested this: additive amber on the blue wall washes out to the same pale cream as before. I used `warmPool` instead, which first multiplies a warm orange tint (removing the blue) and then adds amber with a screen blend.
- All hard light cones are gone. Shafts and spills are drawn once into a cached, blurred offscreen canvas and reused every frame.

**Measurements after the fixes:**

| Set | Median luminance (full size) |
|---|---|
| kamar, lamp on | 110 |
| kamar, lamp off + phone glow + door open | 86 |
| kamarAnak | 103 |
| kampung, dusk | 103 |
| kampung, night | 88 |
| dapur, day / night | 129 / 107 |
| ruangMakan | 113 |
| studio | 114 |
| kantor | 118 |

- **Speed:** 20–48 ms per frame once warmed up; kamar is the heaviest. The first frame of a session takes about 0.5 s while the blur caches are built.
- **Idle motion** (share of pixels that change between t = 0.9 and 2.6): dapur 0.9% (was 0.3–0.45%), studio 9%, all other sets 1.9–6%.

## Common rules

- Every set function draws the full 1920×1080 frame, leaves `ctx` state as it found it, and returns `{floorY, anchors}`.
- Anchors are in screen pixels and already include the mid-layer parallax shift.
- `opt.px` (−1..1) moves the camera: far layer ±26 px, mid ±60 px, near ±160 px.
- For figures that stand in front of foreground objects:
  1. Call the set with `opt.near = false`.
  2. Draw your figures.
  3. Call `K.kit.latar.depan(ctx, set, t, opt)` with the same `opt` to draw the foreground layer.
- Foreground layer per set:
  - kamar: plant, bottom-left
  - kamarAnak: guitar, right
  - kampung: bushes in the bottom corners
  - dapur: fridge edge, left
  - ruangMakan: hanging plant, top-left
  - kantor: plant, bottom-right
  - studio: none
- The bottom 200 px of every set stays calm.
- Standing height to pass as `h` to `orang.draw`:

| Set | Scale | Adult | Teen / child |
|---|---|---|---|
| kamar | — | 400–420 | — |
| kamarAnak | — | — | teen ≈ 400 |
| kampung | door 210 px | 160–170 | child ≈ 135 |
| dapur | — | ≈ 420 | — |
| ruangMakan | — | ≈ 370 | — |
| kantor | — | ≈ 460 | — |

## Sets

**`kamar(ctx, t, opt)`**: Bu Rina's bedroom. `floorY` = 800.
- **Options:**
  - `lamp` 0..1 (default 1): warm amber pool on the wall and on the floor/rug, plus warm rims on the nightstand and headboard. Values below 1 tint the room blue.
  - `phoneGlow` 0..1: the phone screen lights up with an incoming call (avatar, green and red buttons), with cyan glow on the wall.
  - `ring` 0..1: the phone shakes ±7 px and ±4°, with 3 vibration arcs on each side and pulsing glow rings.
  - `phone:false`: hides the phone, for when a figure holds it.
  - `pintu` 0..1: opens the door into a warm hallway with depth; the door swings away from the camera, in perspective. `pintuCahaya` 0..1 (default 1) sets how bright the hallway is. The warm floor spill stays at full strength when the lamp is off.
  - `jam` (default 23), `selimut:'atas'` (no folded blanket at the foot of the bed), `px`, `near`.
  - `wall:'kiri'|'kanan'` with `anak:{…}`: draws the wall cross-section and the child's room just outside the frame. Use it when you translate `ctx` yourself; it is skipped automatically while out of view.
- **Anchors:**
  - `door` {x 715, y 800, w 190, h 520, top 280, x0 620, x1 810}; `standDoor` {725, 806} (place a figure here to read as a silhouette against the hallway light)
  - `window` {150, 220, 340, 330}; `clock` {1240, 250, r 62}; `lamp` {912, 459}
  - `nightstandTop` {x 970, y 612, x0 850, x1 1090}
  - `phone` {1022, 620}: the surface point the phone sits on
  - `phoneScreen` {x 1022, y 592, w 114, h 42, rot}: includes the ring shake, so a camera should aim at the rounded value or at `phone`
  - `bedTop` {x0 1166, x1 1780, y 650}; `pillow` {1275, 628}; `sit` {1426, 660}; `lie` {headX 1275, footX 1720, y 650}
  - `fotoAnak` {x 1570, y 305, w 300, h 210}: framed photo of Bu Rina (hijab) and her child, drawn with the figure kit
  - `kalender` {1056, 243}; `stand` {460, 840}

**`kamarAnak(ctx, t, opt)`**: the child's room. `floorY` = 800.
- **Options:** `lamp` (desk lamp, default 0), `phoneGlow`, `ring`, `phone:false`, `guling` (default true), `selimut:'atas'`, `px`, `near`.
- **Anchors:** `bedTop` {176, 840, y 660}; `pillow` {285, 638}; `guling` {520, 628}; `lie` {headX 285, footX 790, y 660}; `sit` {700, 670}; `deskTop` {1300, 1770, y 600}; `phone` {1572, 608}; `phoneScreen` {1572, 580, w 114, h 42}; `chair` {1315, 650}; `window` {960, 230, 280, 300}; `stand` {1000, 840}.

**`selimut(ctx, set, t, opt)`**: blanket for a figure lying in bed. Call it after drawing the figure. `set` is `'kamar'` or `'kamarAnak'`.
- `sampai` 0..1: how far the blanket covers, measured from the foot of the bed to the pillow edge. Default 0.72, about chest height.
- `guling`: draws the bolster on top of the blanket so the hug stays visible. Default true in kamarAnak, false in kamar.
- `gulingOpt` {w, h, rot, col}; `px` must match the set.
- `orang.draw` with the sleeping pose also has its own `selimut`/`guling` options; use one system or the other, not both.

**`dinding(ctx, x, t, {floorY = 800, w = 130})`** → {x0, x1, w}: the wall cross-section.
- The cut stops at the floor slab. Below it is a dark band that blends into both floors.
- Nothing is drawn when the wall is outside the canvas.

**`lewatDinding(ctx, t, u, {arah: 'kanan'|'kiri', kamar: {…}, anak: {…}})`**: camera pan from the bedroom through the wall into the child's room, u from 0 to 1. Apply your own easing to `u`. Returns anchors {kamar, kamarAnak, wallX}.

**`kampung(ctx, t, opt)`**: neighbourhood street. `floorY` = 836.
- **Options:**
  - `senja` 0..1, default 0.7. At 1 there is a peach-to-amber horizon band rising into violet, no stars, and a paler, lower moon. At 0 it is a blue night with stars, a high moon and bats.
  - `lampu` 0..1: amber street lamp mounted on the power pole, with a soft beam and a pool of light on the road.
  - `pintu` 0..1: opens the door of the centre house.
  - `px`, `near`.
- **Anchors:**
  - `doors` [x 150, 755, 1560, 2050; y 820; top 610]; `rumah` = `doors[1]`
  - `gate` {x0 676, x1 846, y 836}: a 170 px gap in the fence in front of the centre door
  - `lamp` {1380, 450, poleX 1290}
  - `motor` {1752, 844, s 0.56}: correctly scaled scooter, parked clear of all doors
  - `sidewalk.y` 836; `road.y` 940; `stand` [{760, 842}, {1180, 842}, {300, 842}]
- The road now has a kerb and a gutter, with small concrete slab bridges to each gate.

**`dapur(ctx, t, opt)`**: kitchen. `floorY` = 840.
- **Options:**
  - `api` 0..1 (default 0.8): flame of the right burner, under the pot. The pot is raised 14 px and the flame tips show beneath it.
  - `apiKiri` 0..1 (default 0): left burner.
  - `panci:false`, `toples:false`.
  - `malam`: dims the room and adds a ceiling lamp with a warm pool of light.
  - `jam`, `px`, `near`.
- **Anchors:** `counterTop` {120, 1680, y 610}; `workspace` {1080, 610}; `stove` {420, 566}; `burners` [{340, 560}, {500, 560}]; `pot` {500, 434}; `potBase` {500, 546}; `shelf` {1090, 1600, y [270, 450]}; `jarSlots` [{1180, 450}, {1345, 450}, {1510, 450}]; `window` {470, 150, 400, 230}; `clock` {960, 210}; `stand` {960, 880}.
- The unidentifiable box on the top shelf is now a teapot.

**`ruangMakan(ctx, t, opt)`**: family dining room. `floorY` = 820.
- **Options:** `lamp` (default 1), `makanan:false`, `tudung` 0..1 (woven food cover: 1 = covering the food, values in between = lifted), `jam` (default 19.5), `px`, `near`.
- **Anchors:** `seats` [{780, 640, depan}, {1140, 640, depan}, {470, 700, kanan}, {1450, 700, kiri}]; `tableTop` {596, 1324, y 650, front 710}; `tudung` {960, 676, r 230}; `lamp` {960, 330}; `riceCooker` {1700, 650}; `sideTable` {1576, 1864, y 650}; `frames` {585, 260}; `stand` {1700, 860}.
- The hanging-plant vines no longer overlap the cabinet. The mountain picture is replaced by a rice-field picture.

**`studio(ctx, t, opt)`**: explainer backdrop.
- **Options:** `warna` 'biru' | 'ungu' | 'teal' | 'senja'; `floorY` (default 760); `px`.
- **Look:** sound-themed motifs (wave squiggles, spectrogram bars, dot clusters, pills, emission arcs), spread outside the `papan` area, with broad soft wave ribbons on the back wall. The floor is a curved backdrop with slow ripple rings instead of the grid.
- **Anchors:** `center` {960, 800}; `kiri` {538, 790}; `kanan` {1382, 790}; `papan` {x 960, y 400, w 1300, h 560}: the free area for diagrams.

**`kantor(ctx, t, opt)`**: new, for chapter 5 ("meniru suara atasan"). `floorY` = 820.
- **Options:** `malam`, `ring`, `phoneGlow`, `phone:false`, `jam`, `px`, `near`.
- **Anchors:** `deskTop` {640, 1400, y 600}; `monitor` {860, 433, w 316, h 182} (generic screen); `phone` {1310, 608}; `phoneScreen` {1310, 584, w 97, h 36}; `mug` {1120, 600}; `chair` {1478, 640}; `sit` {1468, 646} (side-view office chair, figure faces left); `window` {110, 150, 640, 400}; `board` {1170, 215, w 380, h 210}; `stand` {480, 860}; `standDesk` {560, 850}.

## `K.kit.latar.parts` (reusable props)

- **Phone:** `phoneFlat(ctx, x, y, t, glow, ring, {s})` draws a 3/4 top-view phone, about 140×64 px at s = 1, with (x, y) at the middle of its front edge on the surface. Returns the screen {x, y, w, h, rot}.
- **Bedroom pieces:**
  - `guling(ctx, x, y, t, {w, h, rot, col})`: bolster
  - `calendar(ctx, x, y, w, h, t)`: calendar without text
  - `frameArt(ctx, x, y, w, h, kind, t)`, `kind` = 'foto' | 'keluarga' | 'bunga' | 'sawah' | 'gunung'
  - `door(ctx, x, y, w, h, col, open, t, spill)` → {x, y, w, h, top, x0, x1}
  - `doorSpill(ctx, x, floorY, w, open, spill)`: draw after the rug
  - `clock(ctx, x, y, r, t, jam)`
  - `tableLamp(ctx, x, y, t, on, col)` → {x, y}
  - `nightstand(ctx, x, top, fy, w, col)`
- **Kitchen and dining:**
  - `stove(ctx, x, y, t)`
  - `stoveFlame(ctx, x, y, t, flame, side)`: side −1 = left, +1 = right; draw after the pot
  - `pot(ctx, x, y, t, steam)`: the lid rattles when boiling
  - `teapot(ctx, x, y, col, t)`
  - `jar(ctx, x, y, w, h, col, lid, fill)`
  - `tudungSaji(ctx, x, y, r, t, a)`
  - `riceCooker(ctx, x, y, t)`
- **Neighbourhood:**
  - `scooter(ctx, x, gy, s, col, t)`: use s ≈ 0.56 next to a 210 px door
  - `streetLamp(ctx, x, by, t, col, on, dir, ph)` → {x, y, poleX}
  - `house(ctx, x, w, by, o, t, i)`
  - `bananaTree(ctx, x, by, s, t, col)`: rebuilt with a thick stem, broad torn paddle leaves and a drooping old leaf
  - `mangoTree(ctx, x, by, s, t, {trunk, leaf, leafHi, fruit})`
  - `palm(ctx, x, y, h, col, t, ph)`
  - `plant(ctx, x, y, s, t, col, potCol, ph)`
- **Windows and views:** `curtain`, `windowFrame`, `nightView`, `cityView`.
- **Light:** `glowE(ctx, x, y, rx, ry, col, a, mode)` is a soft elliptical glow. `warmPool(ctx, x, y, r, a, sy, col)` is a warm amber pool; use sy ≈ 0.2 on floors.

`K.kit.latar.WALL_W` = 130 (wall thickness used by `dinding`).

## peta

I applied all 10 review fixes and skipped none, since none conflicted with the art direction. `kit_preview.py peta 0 1.7 3.4` runs with no page errors and nothing in `missing`. Showcase median luminance is 82–83/255.

**Fixes applied** (file: `/home/user/animasi-informatika/episodes/_alat/dokkit/peta.js`)
1. **Zoom view:** the dot step is now picked from the zoom level, from the set 0.08, 0.1, 0.12, 0.15, 0.2, 0.25, 0.3 or 0.42°. Dots stay about 10–12 px apart, never more than 0.3° on the full map, and the dot radius is capped at 6 px. The land outline fill rises from 0.10 to 0.18 as you zoom in. The zoom demo now shows the `kalbar` region, a Pontianak pin with its label, and its caption sits outside the panel.
2. **Markers on land:** the Mempawah anchor moved to [109.0, 0.36]. Every highlight now moves to the nearest Indonesian land dot, cached once per dot spacing. You can turn this off per highlight with `snap:false`.
3. **Indonesia vs. neighbours:** I removed the east/south darkening, and the light sweep now provides the variation. Neighbour dots use alpha 0.45, radius ×0.8 and no shadow. The faint outline fill of Borneo, Timor and New Guinea is also split at the borders, so Sarawak/Sabah, Timor-Leste and PNG read dim.
4. **Arab Saudi beat:** added `route()`, a dashed arc with a moving video-call bubble (hijab silhouette whose face glitches briefly) that arrives at the marker. It takes a label of at least 40 px.
5. **Pulse:** region and area dots now pulse as a ripple spreading out from the marker, scaling each dot from 1.0 to 1.25. With `t0` set, the colour first spreads outward from the marker at `spread` degrees per second.
6. **Labels:** pills are now cream `#FFF6E6` with navy text, a coloured dot, no outline, and the 7 px shadow. Each leader line ends in a dot. The pill is exported as `tag()`.
7. **Labels off-screen:** label height is now clamped, and `dy` flips sign when the label would leave the frame.
8. **Speed:** only dots in view are drawn, based on the canvas and current transform or `opt.view`. Region membership is cached per dot spacing and region. Once that cache is built, a full-screen zoom frame takes about 9–13 ms. The first frame at a new dot spacing takes about 100 ms to build its grid.
9. **"Peta media sosial":** added `sosial()`, a top-down neighbourhood with hip and gable roofs, trees, a pond, and a lit main house. Icons blink around the house and data dots flow out along dotted lines. Padlocks spring in one icon after another as `lock` goes up.
10. **Polish:** Halmahera's four arms are wider, so the K shape reads. The light sweep is stronger (weight 2.2), wider and offset in phase, so frames at t=0, 1.7 and 3.4 clearly differ. The animated reveal panel is offset so it shows mid-reveal.

**API for scene writers** (all positions are screen px at 1920×1080; every function saves and restores ctx)

**`K.kit.peta.indonesia(ctx, cx, cy, w, opt)` → `project(lon, lat) → [x, y]`**
- **Placement:** draws the map centred at (cx, cy), w px wide. Height is w × 0.326. The map covers lon 94.6–151.0 and lat −11.1–7.3.
- **Sizes:**
  - Full Indonesia: w = 1600–1800 (about 9 px between dots).
  - Inset map: w = 500–900.
  - Island close-up: w = 2800–3600.
  - Kalimantan Barat close-up: w = 5000–9000. Centre it with `const pz = K.kit.peta.proj(0,0,w); const [mx,my] = pz(lon,lat); indonesia(ctx, 960-mx, 540-my, w, …)`.
- **Returned values** on `project`:
  - `.k` (px per degree), `.x0 .y0 .w .h`, `.step`, `.r` (dot radius).
  - `.unproject(x, y)` gives [lon, lat].
  - `.snap(lon, lat)` gives [x, y] at the nearest land dot.
  - `.markers` gives the [x, y] of each highlight after snapping. Use these as targets for `route`.
- **Options:**
  - `t`: time in seconds.
  - `step`: dot spacing in degrees. Default is automatic. **For an animated zoom, pass a fixed `step` (for example 0.15)**, otherwise the dots jump when the automatic spacing changes level.
  - `dot`: dot radius in px.
  - `color`: default `#D3E2FF`. `dimColor`: default `#7486C2`.
  - `alpha`.
  - `reveal`: 0–1, dots appear west to east.
  - `base`: outline fill alpha.
  - `sea`: alpha of a faint sea-dot grid, for example 0.12.
  - `neighbours`: default true.
  - `shimmer`, `shadow`.
  - `bounds`: [lonW, lonE, latS, latN].
  - `view`: [x0, y0, x1, y1]. Pass this when you draw inside a clip.
- **`highlight`** is a list of `{…}` objects:
  - `at`: an anchor name, or give `lon`, `lat` directly.
  - `label`: shown at 44 px by default; `size` must be ≥40.
  - `color`: default amber.
  - `dx`, `dy`: label offset; default 0, −130.
  - `style`: `"ring"` (default) or `"pin"`.
  - `scale`.
  - `t0`: pop-in time; with it the region colour spreads out from the marker.
  - `spread`: degrees per second, default 6.
  - `region`: `"kalbar"`, or a flat array [lon, lat, …].
  - `area`: radius in degrees.
  - `snap`: default true.
  - `fill`, `textColor`: label pill overrides.
- **Anchors** (`K.kit.peta.ANCHORS`): mempawah, pontianak, jakarta, bandung, semarang, yogyakarta, surabaya, medan, padang, palembang, denpasar, mataram, kupang, makassar, manado, balikpapan, banjarmasin, ambon, ternate, jayapura, bandaAceh, merauke, and arabSaudi [46.7, 24.7]. arabSaudi projects off-screen to the upper left.
- **Regions:** `REGIONS.kalbar`.

**`K.kit.peta.route(ctx, from, to, opt)`** → `{head, entry, control}`
- `from` is [x, y], often off-screen such as `project(...ANCHORS.arabSaudi)`. Use `"left"` (or null) to start off-screen at the left edge, `rise` px above `to` (default 260).
- `to` is [x, y], usually `project.markers[0]`.
- **Options:**
  - `t`.
  - `progress`: 0–1, measured from where the arc enters the screen.
  - `label`: for example "dari Arab Saudi". Default `size` 44.
  - `color`: default pink.
  - `bend`: default 0.22. The arc bulges upward.
  - `labelAt`: 0–1 along the visible arc, default 0.18.
  - `labelSide`: `"above"` (default) or `"below"`.
  - `labelDx`, `labelDy`.
  - `bubble`: default true. `bubbleScale`: default 1, about 190 px tall.
- At progress 1 the bubble sits above `to` with its tail on the point, and a ring pulses. With `route` in the same frame, give the marker label a positive `dy` (for example `dx:220, dy:150`) so the bubble does not cover it.

**`K.kit.peta.sosial(ctx, cx, cy, s, opt)`** → `{house:[x,y], icons:[{name,x,y,r,locked}], w, h}`
- At s = 1 the map card is 1200×800. Use s ≈ 1.1–1.25 for full screen.
- **Options:**
  - `t`.
  - `icons`: names from `video`, `live`, `voice`, `foto`, `pesan`. Default `['video','live','voice']`.
  - `show`: 0–1, icons pop in one after another.
  - `lock`: 0–1. Padlocks close one after another, icons turn grey and stop blinking, and data flow stops. Use this in section 8.
  - `others`: default true, small blinking icons on neighbour roofs.
  - `card`: default true.

**Helpers**
- `K.kit.peta.marker(ctx, x, y, s, opt)`: same options as a highlight entry, plus `t`.
- `K.kit.peta.tag(ctx, text, x, y, {size≥40, color, fill, textColor, scale})`: the light label pill; returns {w, h}.
- `K.kit.peta.bubble(ctx, x, y, s, {t, color})`: the video-call bubble, with its tail tip at (x, y).
- `K.kit.peta.proj(cx, cy, w, opt)`: projection only, nothing drawn.
- `K.kit.peta.autoStep(k)`.

Preview PNGs are in `/home/user/animasi-informatika/episodes/_alat/dokkit/preview/` (`peta_t0.png`, `peta_t1.7.png`, `peta_t3.4.png`). I only edited `peta.js` and did not commit; the changes to `latar.js` and `orang.js` showing in git are not mine.

## layar

Every review item is in and nothing was skipped: none of the 10 fixes conflicts with the art direction. One target can't be fully met. At HP h≈650 a 14-character number fits at about 32 px, not 40, because "0812-0000-1234" at 40 px is wider than the screen. It reaches 40 px from h≈810. The preview runs at t = 0, 0.75, 1.7 and 3.4 with no page errors and no missing labels, and median brightness is 114–115/255. I checked extra close-ups too: phones at h=650 with `ringkas`, the flat HP on a dark table, `angka` at 700×220, and the `sidikJari` morph at r=150 cut against `spektrogram()`. Nothing uses `Math.random` or `Date`, and I only edited `layar.js`.

What changed, by review item:
1. **New screens:** `kontak` (contact list with highlight, plus a two-number comparison), outgoing call through `panggilan({status})`, and `feed` with the "Akun privat" switch and locks. New icons: `video`, `live`, `grup`, `unggah`, `bagikan`, `cari`.
2. **`hp({flat})`:** the phone lies on the table in perspective, with the body side showing and a light ellipse on the table. `ring` slides it across the table.
3. **Text size:** `opt.teks` (text-size multiplier) reaches every screen through `hp()`, and `ringkas:true` keeps only the big elements.
4. **`ring`:** the square outlines are gone. It is now three pairs of thick arcs that pulse outward, plus a soft glow and body shake.
5. **`videoCall`:** the default aunt now has a sad face, broad shoulders and a blue top. A glitch of 0.3 or less shifts only 1–2 slices, clipped to the face. Pixelation starts above 0.5. `kedip` forces a flicker on a chosen frame.
6. **`gelombang` `angka`:** bars shrink to dots and fade. The numbers sit in a 1–3 row grid with fixed-width digits and scroll slowly left.
7. **`sidikJari`:** the panel and stagger timing now follow the review. At `fromSpec=1` it matches `spektrogram()`, so a cut from it is seamless. The scan line stays inside the fingertip.
8. **Voices:** the `SUARA` profiles are much more distinct, and there is a new `tiruan` (cloned) profile. `aksen` and `label` add a coloured frame and tab.
9. **`telepon`:** band limit, blur, noise floor and fewer colour steps, so real and cloned voices look the same. `bandLabel` adds the "batas telepon" label.
10. **Small fixes:** new `jari()` hand, `rekam` returns to a round idle button after saving, and the HP body is darker with a stronger rim light.

---

# K.kit.layar — API for scene writers

Everything is deterministic, and every function that draws takes `t` in seconds for idle motion. Each one restores ctx state when it finishes. Coordinates are canvas px unless the entry says screen-local.

## HP
**`hp(ctx, cx, cy, h, opt) -> anchors`** draws a generic front-view phone. (cx, cy) is the centre, h is the body height, and the width is 0.485·h.

**Options:**
- `screen(ctx, w, h, t)`: draws the screen in screen-local coordinates; (0,0) is the top-left of the screen.
- `t`.
- `teks` (default 1): text-size multiplier, passed to every built-in screen.
- `ringkas` (bool): passed to the screens. Keeps only 2–3 big elements.
- `tilt` −1..1: slight 3D turn with the body side showing.
- `rot` (radians).
- `ring` 0..1: shake, plus three pairs of arcs at the left and right of the upper part.
- `lit` 0..1: 0 means the screen is off.
- `glow`: default 0.55·lit, or 0.6·lit when flat.
- `glowCol`: use `P.warm` or `"#A9D4FF"`.
- `body`: default `#2C3272`.
- `shadow` (default true).
- `flat` 0..1: lying on a table.
  - Height is compressed to 0.35, the top narrows to 0.8 and the body side shows.
  - Screen light falls on the table as an ellipse.
  - `ring` slides the phone across the table instead of shaking it in the air.
  - `rot` turns it in the table plane.
  - (cx, cy) is the centre of the phone on the table.

**Anchors returned:**
- `x, y, w, h`: body bounding box.
- `top`, `bottom`: centre points.
- `screen {x,y,w,h}`: bounding box of the screen.
- `map(lx, ly) -> {x,y}`: screen-local point to caller coordinates, correct for `tilt`, `rot` and `flat`.
- `out`: the screen function's return value.
- `flat`: true in flat mode.

**Common pattern:** `const a = hp(...); const p = a.map(a.out.tunggu.cx, a.out.tunggu.cy);`

**Recommended sizes:**
- Readable close-up: h 650–900 with `ringkas:true`.
- At h=650: names, button labels, contact names and chat bubbles are about 40 px. Nominal digits are about 40 px with a smaller "Rp".
- Numbers like 0812-0000-1234 are about 32 px at h=650 and 40 px from h≈810. Use `teks:1.2` with h≥700 if a number must be 40 px.
- Phones as props in a wide shot: h 300–450.
- On a table: `flat:1` with h 350–550.

## Screens
Each screen is used as `opt.screen` or called directly as `(ctx, w, h, o)`. All accept `t`, `teks`, `ringkas` and `jam` ("23:07", or `false` for no status bar). The rectangles they return are screen-local `{x, y, w, h, cx, cy}`.

**`panggilanMasuk`**
- Options: `nama` ("Nomor tidak dikenal"), `nomor` ("0812-0000-1234"; "" hides it), `label`, `tanya` (default true).
- Pulsing Tolak and Terima buttons; Terima bounces.
- Returns `{tolak, terima}`.
- With `ringkas`, the name wraps to at most 2 lines.

**`panggilan`**
- Options: `nama`, `durasi` ("00:42"), `suara` 0..1, `tanya`, `huruf` (initial on the avatar), `warna`.
- `status: 'Memanggil…'` makes it an outgoing call: animated dots, pulse rings, and no waveform.
- Returns `{akhiri}`.

**`videoCall`**
- `wajah(ctx, w, h, t) -> faceRect`: optional custom face. The default is a sad aunt in hijab with shoulders.
- `orang`: overrides for `kit.orang.kepala` on the default face.
- `diri`, `wajahDiri`: self-preview (Bu Rina, "bingung").
- `nama` ("Bibi"), `durasi`.
- `glitch` 0..1:
  - **0.3 fits the script**: occasional 1–2 slices shifted at the face.
  - Above 0.5 is heavy: pixelation and scanlines.
- `kedip: true` forces a flicker on this frame, to time it with a word.
- Returns `{wajah, akhiri, glitch}`.

**`obrolan`**
- `pesan: [{dari:'aku'|'dia', teks} | {dari, suara:true, durasi}]`.
- `nama`, `status`.
- `muncul`: number of messages shown; a fraction animates the next bubble.
- `mengetik`: shows the typing indicator.
- `size`: bubble text size in px; the default is 14u with `ringkas`, 9.5u without.
- Returns `{gelembung: [rect]}`.

**`transfer`**
- `nominal` ("Rp3.000.000"), `ke`, `rek`, `app` ("Bank"), `judul`.
- `peringatan`: true or a custom string, with a red flag.
- `highlight: 'transfer' | 'tunggu'`: Transfer blinks and Tunggu glows.
- `tekan: {tombol, u 0..1, x}`: press animation and ripple.
- Returns `{transfer, tunggu}`.

**`rekam`**
- `durasi`, `tersimpan` 0..1: the "Rekaman 1" card pops in and the button goes back to the round record button.
- `namaRekaman`, `durasiSimpan`, `label`.
- While recording, the button is a square stop with pulse rings.
- Returns `{tombol}`.

**`kontak`, list mode**
- `daftar: [{nama, nomor, warna}]`: the default is Adik, Anakku 0813-0000-5678, Ayah, Bu RT, Kakak, Nenek.
- `sorot`: index or name. That row gets a highlighted card and a pulsing green call button.
- `judul`.
- Returns `{baris: [rect], telepon: rect}`.

**`kontak`, comparison mode**: `banding: {lama, baru, namaLama, namaBaru, labelLama, labelBaru, u 0..1}`
- `lama`/`baru` are strings or `{nama, nomor}`. The defaults are 0813-0000-5678 (Anakku) and 0812-0000-1234 (Nomor tidak dikenal).
- Two cards with digits in fixed-width cells, so the digits line up.
- Differing digits pop in red on the caller's card (staggered by `u`), with amber underlines on the saved card, and a red ≠ sign between the cards.
- Returns `{lama, baru, beda: [indices]}`.

**`feed`**
- `post: [{jenis: 'video'|'live'|'suara', judul}]`. The default is three cards:
  - birthday video, "Ulang tahun Adik";
  - LIVE selling, "Jualan kue";
  - voice message in the group, "Pesan suara Ibu".
- `privat` 0..1: the "Akun privat" switch slides, the thumbnails dim, and lock badges pop in one card after another.
- `judul` ("Beranda"), `labelPrivat`.
- Returns `{sakelar, kartu: [{x, y, w, h, thumb, kunci}]}`.

**`mati`**: screen off.

## Voice visuals
**`spektrogram(ctx, x, y, w, h, opt) -> {x, y, w, h, yOf(hz), xOf(sec)}`**
- `profil`: a name in `SUARA` or an object `{seed, f0, formants: [F1, F2, F3], tempo, jeda, serak, artefak, timing}`.
- `scroll` (seconds), `dur` (default 4), `fmax` (default 5500).
- `reveal` 0..1 (with a sweep line), `grid`, `alpha`, `r`, `frame`.
- `morph` 0..1 together with `ke`: rhythm stays with the source, voice colour moves to the target.
- `aksen`: true (the profile's own colour) or a colour. Adds a frame in that colour.
- `label`: true (the profile's own name) or a string, shown as a tab above the frame. `labelSize` defaults to 40.
- `band: [lo, hi]` and `bandAmt`.
- `telepon` 0..1:
  - Applies the telephone band 300–3400 Hz, blur, noise floor and fewer colour steps, so real and cloned voices look the same.
  - Sets the band automatically.
  - Use `fmax: 4000–4500` so the 300 Hz line is clearly visible.
- `bandLabel`: true ("batas telepon") or a string. The label sits above the 300 Hz line on the right.
- Strips are cached per profile.
- Recommended size: ≥600×300 for a hero shot. 200×100 works for comparisons.

**`SUARA`** profiles. Each has an `aksen` colour and a `nama`.

| Profile | f0 (Hz) | Notes | aksen |
|---|---|---|---|
| ibu | 215 | | pink |
| anak | 290 | widest harmonic spacing, high formants, fast, short pauses | teal |
| ayah | 104 | tightest spacing, slow, long pauses, very hoarse | blue |
| nenek | 190 | | |
| narator | 125 | | |
| pelaku | 135 | | |
| tiruan | 208 | uses ibu's words and timing; upper band missing plus flat lines at 4.3 and 4.9 kHz; differences disappear under `telepon` | |

**`gelombang(ctx, x, y, w, h, opt)`**
- `mode`: 'garis' | 'batang' | 'cermin'.
- `t`, `amp` (0..1 or `fn(u, t)`), `seed`, `col`, `col2`, `speed`, `n`, `lw`, `glow`, `rapat`, `alpha`.
- `angka` 0..1 (only with 'batang'):
  - Bars shrink to dots and fade.
  - Sample numbers ("−0,42") appear left to right in a 1–3 row grid with fixed-width digits, scrolling slowly left.
- `angkaSize`: default min(0.24h, w/18). `angkaBaris` sets the row count.
- 'batang' returns the bar values.
- Recommended for numbers: w≥600, h≥180.

**`sidikJari(ctx, cx, cy, r, opt) -> {panel: {x,y,w,h}, dur, fmax, scroll, profil}`**
- `fromSpec` 0..1:
  - Ridges unroll one after another across the whole 0..1 range into harmonic lines that follow the f0 contour of the syllables.
  - Colours come from the same palette as `spektrogram()`, with the same syllable gaps.
  - The panel fades in from 0.3, and the real spectrogram from 0.72.
- `garis`: line opacity at fs=1, default 0.35.
- `profil`, `seed`, `col`, `t`, `lw`, `alpha`, `dur` (3.5), `fmax` (5500), `scroll`.
- `scan` 0..1: scan line clipped inside the fingertip, with a teal light band.
- To cut seamlessly afterwards, call `spektrogram(ctx, p.x, p.y, p.w, p.h, {profil, dur, fmax, scroll})` with the returned `panel` and values.
- Recommended r: 150–300.

## Other
**`jari(ctx, x, y, s, opt)`**: the fingertip is at (x, y), and s is about the finger length (60–120 on a phone at h≈650).
- `tekan` 0..1: 0 hovers with a far shadow; 1 presses, with a ripple.
- `bip: true`: Bip's teal hand with no sleeve.
- `kulit` (default `SKIN[3]`), `lengan` (colour or false), `rot` (default −0.42; the hand comes from the bottom right), `riak`, `t`.
- For "the finger stops, then presses Tunggu", aim at `a.map(out.tunggu.x + out.tunggu.w*0.8, out.tunggu.cy)` so the finger doesn't cover the label. Pass the same `u` to `transfer.tekan`.

**`ikon(ctx, nama, cx, cy, s, col)`**: `IKON` is telepon, tutup, mik, mikMati, speaker, keypad, kamera, video, live, grup, unggah, bagikan, cari, bank, cek, bendera, putar, kunci, kembali, orang.

**Also exported:** `avatar(ctx, cx, cy, r, col, {tanya, huruf})`, `statusBar`, `LUT_COL(v)`, `showcase(ctx, t)`.

Files are in /home/user/animasi-informatika/episodes/_alat/dokkit/:
- layar.js
- preview/layar_t0.png
- preview/layar_t0.75.png
- preview/layar_t1.7.png
- preview/layar_t3.4.png

## bipkit

All review fixes are applied to `/home/user/animasi-informatika/episodes/_alat/dokkit/bipkit.js`, and I skipped none. Two differ slightly from the request; they are noted under items 7 and 10 below.

`kit_preview.py bipkit 0 1.7 3.4` reports no page errors and nothing missing. Median frame luminance is 97–98 out of 255. I checked the three preview frames and close-up renders of the folds, jars, pour, pot, folders, book, icons, flag and each pose.

**Review fixes**
1. **`kertasLipat`:**
   - While folding, the flap's back fades from darker at the hinge to lighter at the free edge, with a slightly curved free edge.
   - The flap never gets shorter than 0.08·h, and it casts a soft shadow on the paper below.
   - The folded paper shows stepped paper layers on the open edges, shadows along the creases with a light line on each fold, and one corner lifted with a shadow under it.
   - Limit: around `fold` 0.3 the flap is tipped toward the camera and still reads a bit like a box lid. This only lasts a few frames.
2. **`bukuResep` is new.** It opens from the cover, has a ribbon bookmark, can turn a page, and has 3 numbered ingredient slots whose positions it returns.
3. **`toples`:**
   - The jar is now at least as wide as its label plus `fs*0.6`, and the shorter label sits on the shoulder, so a low `fill` stays visible.
   - The pour stream starts 0.14·size wide, curves out from the lip and tapers. It has drops beside it and a splash with ripples where it lands.
4. **`panci`:** the flame is now upward blue tongues with light-teal tips on a grey burner ring, with a warm glow on the pot bottom. The pink glow behind the steam "!" is smaller and weaker, so the puffs stay crisp.
5. **`kaget`:** the feet stay attached to the body and tuck up and in during the jump.
6. **`pegang`:** the hold point is now +0.3·s, and there is a new `hold:'samping'` option. The largest prop that keeps the face clear is documented.
7. **`tekan`:**
   - The fingertip is 0.16·s by 0.06·s in light teal.
   - When `press` is 0 the finger wiggles as if hesitating.
   - There is a new `shadow:false` option.
   - In the showcase Bip stands on the floor between "Transfer" and "Tunggu", hovers over Transfer, then presses Tunggu.
8. **Brightness:**
   - The stopwatch readout is now a cream pill.
   - The meter panel and checklist rows are #4459B5.
   - The meter's unfilled arc is `rgba(255,255,255,0.15)`.
9. **`mapBerkas`:**
   - Each folder has a darker back cover, a side tab that stays visible in the stack, and some show papers between the covers.
   - Only the top folder shows the top tab.
   - The grey folders are more desaturated and have a light dashed outline, and the label pill is dashed too.
10. **Polish:**
    - `putus` and `teleponBalik` use a new curved handset; `putus` hangs down with a zigzag break.
    - `larangan` is now a family pair with one slash.
    - The flag has a wavy edge and darker fold bands.
    - In `bisik` the hand is at (±0.2·s, +0.14·s) and the arcs are cream and amber.
    - Cheeks are #FF8FB1 at **0.85**, not 0.7, because at 0.7 they still looked grey-mauve on the teal body.
    - `daftarPeriksa` shrinks the font for a long word, never below 44 px, and widens the row only if the word still doesn't fit.
    - The showcase was rebuilt with nothing clipped or overlapping.

**API for scene writers** (all functions take `opt.t` in seconds; all text is Inter)

**`K.kit.bipkit.draw(ctx, x, y, s, opt)`**
- **Position:** (x, y) is the body centre. The floor is at `y + 0.5*s`, the antenna tip about 0.68·s above centre, and the body about 0.9·s wide. Use s = 110–400.
- **Options:**
  - `pose`: `diam`, `jalan`, `tunjuk`, `kaget`, `pegang`, `bisik`, `tekan` or `kacaPembesar`.
  - `mood`: `happy`, `sad`, `think` or `wow` (each pose has a default). `look` is [dx, dy] in −1..1.
  - Other options: `seed`, `alpha`, `sweat`, `shadow` (default true).
  - `dir`: 1 or −1, for `jalan`, `bisik` and `hold:'samping'`.
  - `target`: [x, y] in world coordinates, for `tunjuk`, `tekan` and `kacaPembesar`.
- **Per pose:**
  - **diam:** `wave` (a number) makes him wave.
  - **jalan:** `speed`.
  - **kaget:** `k` is seconds since the surprise (default `t % 2.4`). `seru:false` hides the "!".
  - **pegang:** `prop(ctx, px, py, s)` draws the held object.
    - With `hold:'depan'` (default), the hold point is (x, y + 0.3·s) and `grip` defaults to 0.3. A prop up to 0.35·s tall centred on the hold point keeps the eyes clear; up to 0.24·s keeps the mouth clear too.
    - With `hold:'samping'`, the prop centre is (x + dir·s·(0.5 + propSize/2), y − 0.06·s), and `propSize` defaults to 0.5·s.
  - **tekan:** `press` is 0..1, where 0 is hovering and wiggling. Pass the button's `top` as `target`, and stand Bip on the same floor within about 1.4·s of the button.
  - **kacaPembesar:** `glass` (default 0.5·s) and `content(ctx, cx, cy, r)`, which is already clipped to the lens and uses world coordinates.
- **Returns:** `{x, y, s, top, head, mouth, hand, tip, whisper, prop, feet}`.

**Props**, each `(ctx, x, y, size, opt)`:

| Prop | Anchor and size | Options | Returns |
|---|---|---|---|
| `toples` | (x, y) = bottom centre; size = height, 260–320 recommended | `label` (≥40 px; jar width grows to fit), `textSize`, `color`, `fill` 0..1, `tilt` (radians), `pour` 0..1, `pourTo` (world y) or `pourLen`, `splash`, `lid`, `lidColor`, `labelCol`, `seed` | `{mouth, top, w, streamEnd}` |
| `panci` | (x, y) = bottom centre; size = width | `color`, `liquid`, `steam` 0..1, `steamShape:'!'` with `form` 0..1, `steamH`, `steamCol`, `glowCol`, `fire` 0..1, `burner` | `{mouth, w}`; the burner sits about 0.11·size lower |
| `bukuResep` | (x, y) = centre when open; size = open width (height 0.62·size), ≥800 for real scenes | `open` 0..1, `page` (fractional part turns a page) or `turn` 0..1, `title` ("Resep Penipuan"), `header` ("Bahan:"), `slots` (3), `labels[]`, `active`, `slotColors[]`, `cover` | `{spine, slots:[[x,y]×3], badges, w, h, top, bottom}` |
| `mapBerkas` | (x, y) = bottom centre; size = folder width | `n`, `grey` (count from the top, or true), `greyLabel` (text or false), `labelSize`, `labelSide`, `drop` 0..1, `seed` | `{top, h}` |
| `gembok` | (x, y) = body centre; size = total height | `locked` 0..1, `color`, `flash` | — |
| `kertasLipat` | (x, y) = centre; size = width (height 0.68·size) | `word`, `fold` 0..1, `write` 0..1, `pencil`, `textSize` (≥44) | — |
| `stopwatch` | (x, y) = face centre; size = diameter | `seconds`, `range` (5), `run`, `readout`, `unit` | — |
| `meteran` | (x, y) = panel centre; size = width | `value` 0..100 (number ≥64 px), `label`, `panel`, `numColor` | `{top, bottom}` |
| `benderaMerah` | (x, y) = foot of the pole; size = pole height | `raise` 0..1, `icon:true` (a round icon of diameter size centred at x, y) | — |
| `daftarPeriksa` | (x, y) = top-left; size = width, ≥600 recommended | `text`, `icon`, `state` (`none`/`check`/`flag`/`cross`), `u`, `su`, `textSize` (≥44), `h`, `fill` | row height, for stacking |
| `tombol` | (x, y) = face centre; size = width | `label`, `color`, `press`, `blink`, `h` | `{top, h, w}` |
| `kacaPembesar` | (x, y) = lens centre; size = lens diameter | `angle`, `content`, `rim` | — |

- **`toples`:** to pour into the pot, set `pourTo` to `panci(...).mouth[1] + 6`.
- **`kertasLipat`:** `fold` 0–0.5 folds the top half down, 0.5–1 folds the left half over; the folded result is centred at (x, y).
- **`bukuResep`:** keep labels to one short word at width 600, or use about 800 for "terburu-buru". The `slots` positions are where the jars pop out.
- **`ikon(ctx, nama, cx, cy, r, opt)`:** the names are in `IKON` (hpBaru, rekening, larangan, teleponBalik, putus, tanya, gembok, uang). Options: `color`, `bg:false`.
- **`seru(ctx, x, y, h, opt)`:** options are `color`, `rot`, `glow`.
- **Other exports:** `POSES`, `IKON`, `showcase(ctx, t)`.

The full option list is also in the file's header comment.

Files are in /home/user/animasi-informatika/episodes/_alat/dokkit/preview:
- bipkit_t0.png
- bipkit_t1.7.png
- bipkit_t3.4.png
## Catatan tambahan (penempatan label peta)
- `indonesia(..., {batas: [x, y, w, h], hindari: [[x, y, w, h], ...], hindariDarat: true})`: label penanda dan label rute otomatis mencoba beberapa posisi dan memilih yang tidak menumpuk label lain/area `hindari`, sesedikit mungkin menutupi daratan, dan tetap di dalam `batas` (bawaan: layar penuh). Gelembung `route()` didaftarkan sebagai area yang dihindari.
- Label yang panjang (mis. "Mempawah, Kalimantan Barat") tetap butuh ruang laut; bila sempit, pakai teks lebih pendek ("Mempawah, Kalbar") atau perbesar peta. Periksa selalu dengan `cek_dok.py`.
