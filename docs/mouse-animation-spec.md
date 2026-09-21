# Mouse animation spec

Use this as one spec. 10 fps, 100 ms per cell. Holds are your job in code; ChatGPT only draws unique drawings.

---

**Prompt**

Make a consistent low-res sprite set of ONE photorealistic scared white albino mouse for 10 fps animation (100 ms per frame). Same individual in every image: pink inner ears, pink nose, red-pink eyes, long white whiskers, pale pink paws and tail, fluffy white fur. Scared face: wide eyes, mouth slightly open. Neutral even studio light. No text, no floor shadow, no props.

**Technical**
- 512×512 PNG per pose.
- Flat chroma-key green `#00FF00` background.
- Same camera, same lens, same body scale on every frame. Idle is the scale master. Do not zoom in on crouch or run.
- Feet on the same invisible ground line. Centered in frame.
- Do not flip a left pose to make a right pose. Draw each direction as an original.
- Left = mouse faces or runs toward the left edge. Right = toward the right edge.

**Playback we will use**
- Idle: hold or loop the idle micro-cycle.
- Turns and posture: one new drawing per 100 ms.
- Scurry: loop with no holds, 8 drawings per direction so one stride is 800 ms (cartoon mouse, readable at 10 fps).

**Generate every file below, named exactly.**

**Idle micro-cycle (loop while standing)**
`idle_00` front, hind legs, paws at chest, weight centered.
`idle_01` same pose, tiny breath in (chest 2–3% larger, paws 1 px higher).
`idle_02` back to idle_00 timing peak.
`idle_03` tiny weight shift to its left foot.
Then we loop 00–03.

**Turn left (mouse's left = viewer's right). Standing the whole time.**
`tl_00` idle facing camera.
`tl_01` head 12°.
`tl_02` head 25°.
`tl_03` head+shoulders 40°.
`tl_04` 55°, start of three-quarter.
`tl_05` 70° three-quarter.
`tl_06` 85° almost profile.
`tl_07` full standing profile left.

**Turn right (mouse's right = viewer's left).**
`tr_00` through `tr_07` — same 8 steps the other way. New drawings, not mirrors.

**Posture up**
`up_00` idle.
`up_01` knees straighten slightly, paws +small.
`up_02` spine lengthens.
`up_03` mid-rear.
`up_04` almost full stretch.
`up_05` full rear-up, same head size as idle, not a close-up.

**Posture down**
`dn_00` idle.
`dn_01` knees bend, paws drop a little.
`dn_02` hips lower.
`dn_03` mid-crouch, still facing camera.
`dn_04` low crouch, paws near ground.
`dn_05` flattened crouch. Same head size as idle. Not a head close-up.

**Scurry left — 8-frame run cycle, side profile, head on the LEFT.**
`sl_0` contact: front-left paw down, body compact.
`sl_1` down+pass: opposite hind coming through.
`sl_2` passing: legs under body.
`sl_3` stretch: body long, leaving ground.
`sl_4` opposite contact: other front paw down.
`sl_5` opposite pass.
`sl_6` opposite passing under.
`sl_7` opposite stretch, then loops to sl_0.
Keep body length and head size identical across sl_0–sl_7. Only legs, spine, and tail change.

**Scurry right — same 8-frame cycle, head on the RIGHT.**
`sr_0` through `sr_7`.

**Counts**
Idle 4 + turn L 8 + turn R 8 + up 6 + down 6 + run L 8 + run R 8 = **48 drawings**.
`tl_00`, `tr_00`, `up_00`, `dn_00` may match `idle_00`; still output them as separate files so the sheet is complete.

**After generating**
Contact sheet, 8 columns, filename under each cell. If you can only do one image per reply, start with `idle_00` and wait for "next."

---

**How you play it**

- Idle: loop `idle_00–03` at 100 ms, or hold `idle_00`.
- Turn left: `tl_00→07` once, then hold `tl_07`. Reverse the list to come back.
- Up / down: play the list once, hold the last cell.
- Scurry: loop `sl_0–7` or `sr_0–7` and move the sprite on screen each tick.

If the model drifts off-model after ~10 images, paste `idle_00` back in as a reference and say "same mouse, same scale."
