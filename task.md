# task.md: "How to Focus in Salah: Put Your Phone Down in 3 Steps"

Full motion-graphic explainer, automated with **HyperFrames** (HTML → video), **GSAP** animation,
**FFmpeg** for audio and video processing, scene transitions and SFX.

We work **one phase at a time**. Tick each box when it's done, then stop for review before
starting the next phase.

---

## 0. Inputs (already in this folder)

| File | Facts |
| --- | --- |
| `Script.txt` | Full narration script, about 520 words, with Arabic ayat and du'a |
| `How to Focus in Salah Put Your Phone Down in 3 Steps.wav` | Voiceover: **195.6 s (3:16)**, 44.1 kHz, mono |

Tools found on this machine: Node v24.14, FFmpeg 9.0.2. The HyperFrames CLI isn't installed yet; `npx hyperframes` will install it.

> Note: the script says "over the next four minutes", but the voiceover is 3:16. The video
> length will match the voiceover: **195.6 s × 30 fps = 5,868 frames**.

---

## Target output

- 1920×1080, 30 fps, H.264 MP4 + AAC, loudness about −14 LUFS, true peak ≤ −1 dBTP
- Final file: `renders/how-to-focus-in-salah.mp4`
- Faceless. No human faces or figures; people are suggested with hands, silhouettes or objects (phone, prayer mat, drawer, clock).
- Arabic text set correctly in a real Arabic font (Amiri / Noto Naskh Arabic) with full tashkeel. Quran text is checked word by word against the mushaf.

---

## Pipeline overview

```
Phase 1  Setup          → project scaffold, CLI, fonts, folders
Phase 2  Audio prep     → clean/normalize VO, word-level transcript (timings)
Phase 3  Story & spec   → STORYLINES.md (3 options) → pick → SPEC.md (look, color, motion numbers)
Phase 4  Storyboard     → scene list locked to VO timestamps (table below gets real times)
Phase 5  Assets         → icons/SVG objects, Arabic calligraphy, BGM, SFX pack
Phase 6  Build scenes   → one sub-composition per scene, GSAP timelines
Phase 7  Transitions    → scene-to-scene transitions (registry + custom match cuts)
Phase 8  Captions       → optional kinetic subtitles / key-word callouts
Phase 9  Sound design   → BGM bed + ducking under VO + SFX placed on visual hits
Phase 10 Color & finish → global grade, grain, vignette (media-treatment), consistency pass
Phase 11 QA             → hyperframes check, snapshot review, REVIEW.md, audio measure
Phase 12 Render         → preview approval → final render → FFmpeg loudness/verify
```

---

## Phase 1: Setup
- [x] `npx hyperframes usage --json` (check plan usage)
- [x] `npx hyperframes init .` (or a `video/` subfolder) to scaffold `index.html`, `compositions/`, `assets/`
- [x] Create folders: `assets/audio/`, `assets/sfx/`, `assets/music/`, `assets/fonts/`, `assets/svg/`, `renders/`
- [x] Copy the VO into `assets/audio/vo.wav`
- [x] Add fonts to `assets/fonts/` with `@font-face`: Arabic (Amiri or Noto Naskh Arabic), plus a Latin display face and a body face

## Phase 2: Audio prep (FFmpeg)
- [x] Check the VO for clipping, silence at the head/tail and noise floor: `npx hyperframes audio assets/audio/vo.wav --json`
- [x] Light cleanup if needed (high-pass at 80 Hz, gentle de-noise) with FFmpeg
- [x] Normalize the VO: `npx hyperframes normalize-audio`
- [x] Word-level transcript with timestamps → `assets/audio/vo.transcript.json` (via `/media-use` transcript)
- [x] Mark anchor words for each scene (e.g. "adhan", "Away", "Silent", "Replace", each ayah)
  - Result: no clipping (peak -1.7 dBFS), noise floor ~-73 dB, -22.1 LUFS, LRA 5.1 LU. No cleanup applied; vo.wav left untouched.
  - `normalize-audio` writes `data-volume` on an `<audio id>` in index.html, so it runs in Phase 6/9 once the VO element exists. Raising VO to about -16 LUFS needs about +6 dB, which pushes the peak over 0 dBFS, so use a limiter.
  - Transcript: `assets/audio/vo.transcript.json` (Parakeet, 533 words). The ayah recitation (25.6-30.88 s) has no words in it, and Arabic is spelled phonetically, so use Script.txt for display text.
  - Anchors: `assets/audio/vo.anchors.json`.

## Phase 3: Story & spec
- [x] Write `STORYLINES.md`: 3 different films (world / device / form), with a recommendation
- [x] **STOP: user picks one**
- [x] Write `SPEC.md`: palette as hex, fonts with px sizes, motion eases and durations in frames, shot list, BANNED list, QA frames
- [x] Color direction to decide in the spec. Starting proposal: deep teal/emerald + warm sand + one gold accent (gold only for the ayat and the 3 step words). No purple gradients, no neon glow.
  - Decisions: storyline A (World) with poster look from C and phone UI mock from B; no music; key-word callouts only; emerald/sand/gold; no branding. Files: `video/STORYLINES.md`, `video/SPEC.md`.
  - Effect on later phases: Phase 5 BGM item and Phase 9 BGM/ducking items are dropped (VO + SFX only).

## Phase 4: Storyboard (fill timestamps from Phase 2)

| # | Scene | VO content | Visual idea (draft) | Approx. |
|---|-------|------------|---------------------|---------|
| 01 | Hook | Adhan goes off… "one minute"… twenty minutes later | Phone lights up with an adhan notification → a clock spins 20 min → a rushed prayer mat | 0:00–0:12 |
| 02 | Salam + promise | السلام عليكم… three small steps… No guilt. Just setup. | Arabic salam calligraphy reveal → "3 steps" counter → "No guilt. Just setup." | 0:12–0:27 |
| 03 | Reframe: Ayah | قَدْ أَفْلَحَ الْمُؤْمِنُونَ… (23:1–2) | Full-screen ayah poster, word-by-word reveal, translation below, reference card | 0:27–0:45 |
| 04 | Khushu problem | Building khushu mid-salah with a phone buzzing… | Prayer mat calm vs. phone buzz waves breaking it; "Remove the fight" | 0:45–1:02 |
| 05 | The 3 words | Away. Silent. Replace. | Three kinetic words, each its own layout/color beat (not 3 cards in a row) | 1:02–1:08 |
| 06 | Step 1: Away | حَيَّ عَلَى الصَّلَاةِ… another room… bag or drawer | Phone travels out of the frame into another "room" (door slide); drawer closes on it | 1:08–1:25 |
| 07 | Away example | Dhuhr at work: desk drawer / locker | Office desk top view, drawer and locker animation, "stand up to get it" | 1:25–1:35 |
| 08 | Step 2: Silent | Focus mode / DND, 15 min, family/emergency only | Phone UI mock: DND toggle, a 15-min ring around prayer times, filtered notifications | 1:35–1:55 |
| 09 | Silent example | Student in library, group chat can wait | Chat bubbles stacking up, then frozen and greyed: "It will still be there" | 1:55–2:02 |
| 10 | Step 3: Replace | Urge needs somewhere to go: wudu, sit, breathe… ask a scholar | Hand reaching to empty space → water droplets (wudu) → breath circle | 2:02–2:25 |
| 11 | Dhuhr timeline | 5 min before → adhan → wudu → pray | One horizontal timeline that grows step by step | 2:25–2:40 |
| 12 | Objection | "I need my phone for prayer times" | Myth turned over: alarm clock, watch, printed timetable on the fridge | 2:40–2:55 |
| 13 | Start small | Pick one prayer… just Away. Salah is the anchor | 5 prayer icons, one highlighted; anchor metaphor, path cleared | 2:55–3:08 |
| 14 | CTA + Du'a | Checklist in description; du'a of Ibrahim (14:40) | Checklist card slide; du'a calligraphy poster + translation | 3:08–3:13 |
| 15 | Closing salam | السلام عليكم ورحمة الله | Salam calligraphy, slow settle, end hold 2 s | 3:13–3:16 |

- [x] Replace the approximate times with real timestamps from the transcript
- [x] Lock 1 hero move per scene and the hand-off object into the next scene
  - Result: `video/STORYBOARD.md` (scene timing in s and frames, beats with land frames, hand-offs, callout list, SFX cue sheet). The approximate-time column above is superseded. Three transitions differ from SPEC §9 to avoid back-to-back repeats; see STORYBOARD §5.

## Phase 5: Assets
- [x] SVG objects: 24 files in `video/assets/svg/` (phone, phone-facedown, prayer-mat, minaret, clock, drawer, locker, bag, desk-top, chair, chat-bubble, water-drop, alarm-clock, watch, timetable, fridge, anchor, checklist, lamp, door, hand, book, breath-circle, basin). Flat, palette tokens only, no gold. Animatable parts carry ids (#glow, #dot, #hand-minute, #tick1-3, #water, #front, #door).
- [x] Arabic text blocks as live text data: `video/assets/text/arabic.json` (salam, Allahu Akbar, 23:1-2, hayya, 14:40 du'a, alayhi as-salam), with word arrays for the reveal.
- [x] Quran / du'a strings verified against api.quran.com (imlaei and uthmani): 23:1, 23:2 and 14:40 match Script.txt word for word.
- [x] BGM: dropped in Phase 3 (no music).
- [x] SFX pack: 17 files synthesized with FFmpeg in `video/assets/sfx/`, index and peak offsets in `sfx.json`. Placeholder-quality synthesis; swap in recorded takes later if they sound thin.
- [x] Registry search done, nothing installed yet. Candidates for later phases: `fade-through`, `directional-wipe`, `pull-back-reveal`, `success-check` (checklist ticks), `toggle-flip` (focus toggle), `staggered-fade-up`, `beat-timeline`, `svg-line-draw-loader`.
  - Fixes found: the ayah has 8 words, not 11 as STORYBOARD scene 03 says; the du'a has 6 words. SVG art is basic geometric and will need a look in Phase 6.

## Phase 6: Build scenes (GSAP)
- [ ] `index.html` root: variables, palette tokens, scene hosts, VO `<audio>`, BGM `<audio>`
- [ ] One file per scene: `compositions/s01-hook.html` … `s15-salam.html`
- [ ] Each scene: one paused GSAP timeline registered on `window.__timelines`; seek-safe (no random, timers or `repeat:-1`)
- [ ] Text lands on its anchor word in the VO
- [ ] Build in batches: **S01–S05 → review → S06–S10 → review → S11–S15 → review**
  - Batch 1 (S01–S05) built: `video/index.html` (root, VO audio, 5 scene hosts) and `video/compositions/s01-hook.html` … `s05-three-words.html`. `npx hyperframes check`: 0 errors. Warnings left: `line_unread` on the S05 step words and `dead_stretch` 62–192 s (scenes 06–15 not built yet). Waiting for review before S06–S10.
  - Conventions for the next batches: each host starts 9 frames before its cut and ends 9 after the next cut; scene-local clock `T(f) = (f - hostStartFrame) / 30`; inner element ids must not equal the host id (a clash made GSAP animate the host); initial states via `gsap.set`, `immediateRender:false` on any `fromTo` whose from-state is visible.

## Phase 7: Transitions
- [ ] Choose a transition grammar (e.g. match cuts on the phone object, wipes in the brand color, a door-slide for "another room")
- [ ] No identical transition back to back; vary between 3–4 types
- [ ] Each transition gets its own SFX (rotated whoosh takes)

## Phase 8: Captions (optional, decide in Phase 3)
- [ ] Kinetic key-word callouts only (not a word-for-word repeat of the VO), or
- [ ] Full burned-in subtitles for mobile viewers: one caption track, title-safe area

## Phase 9: Sound design
- [ ] BGM bed around 0.14 volume under the VO, ducked during the ayat and du'a (near silence for recitation moments)
- [ ] SFX placed so the peak lands 1 frame after the visual hit (`npx hyperframes audio <sfx> --json`)
- [ ] Mix with `/hyperframes-audio`: fades, ducking, limiter

## Phase 10: Color & finish
- [ ] Global look from SPEC.md: palette consistency check per scene
- [ ] Grain / vignette via `npx hyperframes media-treatment` (no CSS filters)
- [ ] Safe zones: content in 90% action-safe, text in 80% title-safe

## Phase 11: QA
- [ ] `npx hyperframes check --json`: fix every error, weigh every warning
- [ ] `npx hyperframes snapshot --review` → `REVIEW.md`
- [ ] Arabic rendering check (ligatures, tashkeel, right-to-left) on snapshot frames
- [ ] Audio check: VO intelligible, no clipping, SFX in sync

## Phase 12: Render & deliver
- [ ] Open the Studio preview → **STOP: user approves**
- [ ] Final render → `renders/how-to-focus-in-salah.mp4`
- [ ] FFmpeg / `hyperframes audio` verify: duration 195.6 s, −14 LUFS, ≤ −1 dBTP
- [ ] Optional: thumbnail frame export, vertical cut-downs for Shorts

---

## Open decisions (answer before Phase 3)
1. Music: ambient/vocal-only bed, or no music at all (VO + SFX only)?
2. Subtitles: full captions or key-word callouts only?
3. Color mood: emerald/sand/gold (proposed), or a different palette or brand color?
4. Any channel branding (logo, intro, outro)?
