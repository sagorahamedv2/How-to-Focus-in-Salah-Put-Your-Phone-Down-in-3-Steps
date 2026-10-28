# SPEC: "How to Focus in Salah: Put Your Phone Down in 3 Steps"

Locked decisions (from the Phase 3 review):
- Storyline: **A, World ("The Quiet Path")**, with two borrowings. The ayah and du'a use the quiet gold-on-emerald poster treatment from C. The Silent scene uses a clean phone UI mock from B.
- Music: **none**. The mix is VO plus SFX only.
- Captions: **key-word callouts only**. No word-for-word subtitles.
- Palette: emerald, sand, gold.
- Branding: none. No logo, intro or outro.

## 1. Format

- 1920×1080, 30 fps, 195.6 s = 5,868 frames. H.264 MP4 + AAC.
- Final loudness about −14 LUFS, true peak ≤ −1 dBTP. The VO sits at −22.1 LUFS with a −1.7 dBFS peak, so Phase 9 needs about +8 dB of gain behind a limiter.
- Frames are the unit for all motion numbers below. 30 frames = 1 s.

## 2. Look

**Rebuilt as real-time 3D (Three.js r181).** The flat SVG version is archived in `../_backup_flat_v1/`.

- One WebGL canvas for the whole film (`compositions/world.html` → `assets/js/world/`). Thirteen small sets ("stations") built from rounded clay-like PBR shapes: hallway, night poster, prayer room, three-words stage, two rooms with a door, office, Silent phone studio, library, wudu room, Dhuhr timeline, objection studio, prayer lamps, checklist desk.
- Light: warm key with soft PCF shadows, hemisphere fill, a lamp point light in every set, a room environment map for soft reflections. ACES tone mapping, gentle bloom on lamps, screens and water only, vignette and seeded grain in the final pass.
- Camera: keyframed per shot from film time, with a tiny deterministic drift. Shots change with real crossfades rendered in the shader (dissolve, through-dark, 1.06 camera pull, radial light wipe).
- Text stays live HTML above the canvas (`compositions/s01…s15`): callouts, step words, Arabic word-by-word reveals and translations.
- Faceless rule unchanged: no faces or figures. People are implied by objects, empty chairs and footprints.

## 3. Palette

| Token | Hex | Use |
| --- | --- | --- |
| `--emerald-950` | `#06211C` | Night wall, poster background, deepest shadow |
| `--emerald-800` | `#0B3D33` | Main wall color |
| `--emerald-600` | `#14705C` | Secondary shapes, door, mat accent |
| `--emerald-300` | `#7FC4AE` | Water, breath ring, soft highlights |
| `--sand-100` | `#F4EAD5` | Primary text, paper, light objects |
| `--sand-300` | `#E3CFA6` | Floor, wood, cards |
| `--sand-500` | `#B99A68` | Shadowed wood, drawer, locker |
| `--lamp` | `#FFD98A` | Lamp glow only, always soft, small radius |
| `--gold` | `#D9A441` | **Only** the ayat, the du'a and the three step words |
| `--alert` | `#E26D4F` | Phone buzz and notification dot, used sparingly |
| `--grey-dim` | `#5B6B66` | Frozen or muted objects (grey chat bubbles) |

Rules:
- Gold appears nowhere else. Check every scene for stray gold.
- `--alert` is the only warm-red tone and is tied to the phone being disruptive. It disappears once the phone is silent or away.
- Body text on emerald: `--sand-100` (contrast ≥ 7:1 on `--emerald-800`). Gold on `--emerald-950` passes ≥ 7:1.
- Text never sits on `--sand-*` fills lighter than `--sand-300` unless it is `--emerald-950`.

## 4. Type

Fonts are already in `assets/fonts/fonts.css`.

| Role | Family | Weight | Size (px) | Notes |
| --- | --- | --- | --- | --- |
| Quran / du'a / salam | Amiri | 700 | 120 (ayah), 104 (du'a), 140 (salam) | `direction: rtl`, `line-height: 1.9`, full tashkeel, live text, gold for ayah and du'a, sand for salam |
| Short Arabic (حَيَّ عَلَى الصَّلَاةِ, الله أكبر) | Amiri | 700 | 96 | Sand, gold only if it is a step word moment |
| Arabic fallback | Noto Naskh Arabic | 700 | same as above | `font-family: "Amiri", "Noto Naskh Arabic"` |
| Step words (Away / Silent / Replace) | Fraunces | 700 | 220 | Gold, tracking −2 px |
| Scene titles / key-word callouts | Fraunces | 600 | 84 | Sand |
| Translation and reference cards | Inter | 400 | 40 | Sand, line-height 1.45, max 22 words per card |
| Small labels (UI mock, timeline ticks) | Inter | 600 | 32 | Minimum size anywhere is 32 px |

Layout:
- Title-safe: text inside the center 80% (x 192–1728, y 108–972).
- Action-safe: key shapes inside the center 90% (x 96–1824, y 54–1026).
- Max 2 text elements on screen at once, excluding the Arabic poster scenes.

## 5. Motion

Library: GSAP, one paused timeline per scene on `window.__timelines`. Everything seek-safe: no `Math.random`, `Date.now`, timers or `repeat:-1`.

### Eases

| Name | GSAP ease | Use |
| --- | --- | --- |
| `settle` | `power3.out` | Entrances, objects landing |
| `glide` | `power2.inOut` | Camera pushes, rooms sliding |
| `snap` | `back.out(1.4)` | Step words, toggles, small pops |
| `exit` | `power2.in` | Things leaving the frame |
| `breath` | `sine.inOut` | The breath circle, lamp glow |

No `bounce`, `elastic` or `linear` except for clock hands and the countdown ring.

### Durations (frames)

| Move | Frames |
| --- | --- |
| Object entrance | 15 |
| Text entrance (fade + 24 px rise) | 12 |
| Word-by-word Arabic reveal | 6 per word, 3-frame stagger |
| Step word entrance | 18 |
| Camera push / pan | 36 |
| Transition | 18 |
| Breath circle cycle | 90 (inhale 45, exhale 45) |
| Hold before cut | at least 9 |
| End hold on the final salam | 60 |

### Motion rules
- Every entrance starts 0–6 frames **before** its anchor word in the VO, so the picture lands on the word.
- One hero move per scene. Everything else supports it.
- Ambient motion (lamp breath, dust, slow drift of 1–2%) runs on every scene so no frame is dead, but never competes with the hero move.
- During the ayah recitation (25.60–30.88 s) and the du'a (183.0–188.65 s): no SFX, camera movement under 1% scale, only the word-by-word reveal.

## 6. Sound

- **No music.** No BGM track, no ducking logic.
- VO normalized and limited in Phase 9, then SFX at around −18 dB below the VO's loudness so they never mask speech.
- SFX list: whoosh ×3 takes (rotate), soft pop ×2, tick, phone buzz, notification chime, drawer close, door slide, water drip, one soft riser/impact (used once, at the three-words reveal).
- SFX peaks land **1 frame after** the visual hit.
- Silence is a design tool: no SFX during the ayah, the du'a or the closing salam. The room tone is a very quiet air bed at −45 dBFS, optional, decided in Phase 9.

## 7. Callouts (Phase 8)

Key-word callouts only. At most one callout every 6 seconds, each on screen 45–75 frames, set in Fraunces 600 at 84 px, in the lower-left third inside title-safe. Callout list (final text frozen in Phase 4):

| Time (s) | Callout |
| --- | --- |
| 5.76 | 20 minutes later |
| 20.72 | No guilt. Just setup. |
| 38.96 | Khushu = humility + presence |
| 54.00 | Remove the fight |
| 67.31 | Another room |
| 81.07 | Stand up to get it |
| 90.00 | About 15 minutes |
| 92.43 | Family and emergencies only |
| 103.15 | It will still be there |
| 119.80 | Ask a qualified scholar |
| 141.16 | Use your own times |
| 168.20 | Just step one |
| 174.28 | Clear the path |

The step words (Away, Silent, Replace) are not callouts. They are hero type with their own layouts.

## 8. Shot list

Frame numbers are `round(seconds × 30)`. Each scene file is `compositions/sNN-name.html`. Scene boundaries come from `assets/audio/vo.anchors.json`.

| # | Scene | Start s | Start frame | Hero move | Hand-off object to next scene |
| --- | --- | --- | --- | --- | --- |
| 01 | hook | 0.00 | 0 | Phone lights up on the hallway shelf; wall clock spins 20 minutes | Phone glow becomes a window light |
| 02 | salam | 10.56 | 317 | Salam calligraphy reveals over the window; "3 steps" counter | Window frame becomes the ayah poster border |
| 03 | ayah | 22.24 | 667 | Gold word-by-word reveal of 23:1–2 on the emerald poster, translation and reference card after | Poster fades to the prayer mat room |
| 04 | khushu | 38.96 | 1169 | Buzz rings expand from the phone and crack the calm around the mat | The crack becomes the doorway |
| 05 | three-words | 55.39 | 1662 | Away. Silent. Replace. as three different layouts, with one riser | "Away" word slides into the door |
| 06 | away | 61.79 | 1854 | Phone slides through a door into another room (door-slide) | Phone lands in the drawer |
| 07 | away-example | 70.27 | 2108 | Office desk top view, drawer and locker close | Locker door opens onto the nightstand |
| 08 | silent | 84.35 | 2531 | Phone UI mock: focus toggle flips, 15-minute ring forms around prayer time | Ring around the phone becomes the library window circle |
| 09 | silent-ex | 99.15 | 2975 | Chat bubbles pile up, then freeze and go grey | Frozen bubbles drop and become water drops |
| 10 | replace | 104.75 | 3143 | Empty hand-space on the mat → wudu water → breath circle | Breath circle becomes the timeline's start dot |
| 11 | dhuhr | 125.16 | 3755 | One timeline grows left to right: 5 min before → adhan → wudu → pray | Timeline's last dot becomes the fridge door |
| 12 | objection | 144.44 | 4333 | Phone-alarm myth flips over to an alarm clock, a watch and a fridge timetable | The timetable becomes a row of prayer lamps |
| 13 | start-small | 161.48 | 4844 | Five prayer lamps; one stays lit; path to the mat clears | Camera pulls back from the lit window |
| 14 | cta-dua | 176.25 | 5288 | Checklist card slides in, then du'a poster (gold, word-by-word) | Poster dims to the final window |
| 15 | salam | 193.45 | 5804 | Calligraphy settles; 2 s hold on one lit window | End |

Total: 5,868 frames. Scene 15 holds from frame 5,804 to the end.

## 9. Transitions

Four types, no repeats back to back:
1. **Door-slide.** Used for Away, scene 05 → 06 only. 18 frames.
2. **Match cut on the phone.** The phone keeps its position and shape while the room changes behind it. Scenes 01 → 02, 06 → 07, 08 → 09. 18 frames.
3. **Poster dissolve.** Fade through `--emerald-950`, used into and out of the ayah and du'a posters. 18 frames, no SFX.
4. **Camera pull.** Scale 1 → 1.06 plus crossfade. Everything else. 18 frames.

## 10. Finish (Phase 10)

- Grain at low strength and a gentle vignette via `npx hyperframes media-treatment`. No CSS `filter`.
- One global grade so every scene matches. Check scene thumbnails side by side.

## 11. BANNED

- Any human face or full human figure.
- Purple, violet or blue-purple gradients. Neon glow. Glassmorphism.
- Gold outside the ayat, du'a and the three step words.
- Music of any kind.
- Word-for-word subtitles.
- Arabic as an image or SVG outline. Arabic is live text only.
- Arabic text without tashkeel, or with letters split by tracking. Arabic `letter-spacing` is always `0`.
- Text under 32 px.
- Three identical cards in a row (the three step words must each look different).
- Identical transition twice in a row.
- `Math.random`, `Date.now`, timers, `repeat:-1`, network fetches.
- CSS `filter` for grain or color grade.
- Emoji, stock-icon-pack look, drop shadows heavier than 12 px blur at 25% opacity.
- Any claim not in the script. The scholar line stays: "ask a qualified scholar".

## 12. QA frames

Snapshot these (seconds) in Phase 11, plus the end frame:

| Check | Seconds |
| --- | --- |
| Hook, phone glow | 2.0 |
| Salam calligraphy | 12.0 |
| Ayah fully revealed | 32.0 |
| Translation + reference card | 36.0 |
| Buzz rings | 47.0 |
| Three words | 58.0 |
| Door-slide mid-transition | 62.5 |
| Drawer / locker | 77.0 |
| Phone UI mock | 91.0 |
| Frozen chat bubbles | 103.0 |
| Wudu water | 114.0 |
| Breath circle | 116.0 |
| Timeline complete | 140.0 |
| Alarm / watch / timetable | 151.0 |
| Prayer lamps | 170.0 |
| Checklist card | 179.5 |
| Du'a poster | 186.0 |
| Final hold | 195.0 |

Per frame: Arabic joins and tashkeel intact, RTL order correct, text inside title-safe, no stray gold, no text under 32 px, contrast OK.

## 13. Verification of text

- Quran 23:1–2 and Quran 14:40 (first part) strings are checked word by word against tanzil.net / quran.com in Phase 5 before they go in a scene.
- Translation text is copied from the script, not paraphrased.
- Script quirk: it says "four minutes" and the video is 3:16. Left as spoken. Phase 8 does not call it out.
