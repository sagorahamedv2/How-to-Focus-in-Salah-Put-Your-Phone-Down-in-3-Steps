# STORYBOARD: "How to Focus in Salah: Put Your Phone Down in 3 Steps"

Phase 4 output. Real timestamps come from `assets/audio/vo.transcript.json` and `vo.anchors.json`. Look, palette, type, eases and banned list are in `SPEC.md` and are not repeated here.

Conventions:
- Frame = `round(seconds × 30)`. Total 5,868 frames (195.6 s).
- A scene runs from its start frame up to the next scene's start frame. Scene 15 runs to frame 5,868.
- **Transition window** = 9 frames before to 9 frames after the boundary (18 frames total). The incoming scene's clip starts 9 frames early and the outgoing clip ends 9 frames late, so the cut itself lands on the boundary frame.
- **Land frame** = anchor frame − 3. Every entrance starts 0–6 frames before its VO word (SPEC §5). 3 is the default.
- SFX peaks land 1 frame after the visual hit (SPEC §6). "no SFX" zones: ayah recitation 25.60–30.88 s, du'a 183.00–188.65 s, closing salam 193.45 s to the end.

## 1. Scene timing

| # | Scene | Start s | End s | Start f | End f | Frames | Transition in |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 01 | hook | 0.00 | 10.56 | 0 | 317 | 317 | none (opens on the hallway) |
| 02 | salam | 10.56 | 22.24 | 317 | 667 | 350 | match cut on phone |
| 03 | ayah | 22.24 | 38.96 | 667 | 1169 | 502 | poster dissolve |
| 04 | khushu | 38.96 | 55.39 | 1169 | 1662 | 493 | camera pull |
| 05 | three-words | 55.39 | 61.79 | 1662 | 1854 | 192 | poster dissolve (room fades to emerald-950) |
| 06 | away | 61.79 | 70.27 | 1854 | 2108 | 254 | door-slide |
| 07 | away-example | 70.27 | 84.35 | 2108 | 2531 | 423 | match cut on phone |
| 08 | silent | 84.35 | 99.15 | 2531 | 2975 | 444 | camera pull |
| 09 | silent-ex | 99.15 | 104.75 | 2975 | 3143 | 168 | match cut on phone |
| 10 | replace | 104.75 | 125.16 | 3143 | 3755 | 612 | camera pull |
| 11 | dhuhr | 125.16 | 144.44 | 3755 | 4333 | 578 | match cut on the breath circle / start dot |
| 12 | objection | 144.44 | 161.48 | 4333 | 4844 | 511 | camera pull |
| 13 | start-small | 161.48 | 176.25 | 4844 | 5288 | 444 | match cut on the timetable / lamp row |
| 14 | cta-dua | 176.25 | 193.45 | 5288 | 5804 | 516 | camera pull (plus an inner poster dissolve at 180.89 s) |
| 15 | salam | 193.45 | 195.60 | 5804 | 5868 | 64 | poster dissolve |

Sum of the Frames column = 5,868.

Transition order (no identical type twice in a row): match, poster, pull, poster, door, match, pull, match, pull, match, pull, match, pull, poster.
This differs from SPEC §9 in three places, see section 5.

## 2. Per-scene storyboard

Each block: hero move (one per scene), beats with VO word, second and land frame, the hand-off, SFX.

### 01 hook — frames 0–317 (0.00–10.56 s)
VO: "The Adhan goes off. You tell yourself, 'one minute.' You pick up your phone to check one thing. Twenty minutes later, you rush through your salah and can't remember a word you said."

| Time | Frame | Land | Beat |
| --- | --- | --- | --- |
| 0.00 | 0 | 0 | Dim hallway fades up. Lamp breath on the shelf. Minaret silhouette in the window. |
| 0.24 | 7 | 4 | **"Adhan"**: phone on the shelf lights up (lamp glow plus `--alert` dot). Notification chime. |
| 1.44 | 43 | 40 | **"one minute"**: a hand (no arm beyond the wrist) enters from the right edge and reaches for the phone. |
| 3.44 | 103 | 100 | **"pick up your phone"**: phone lifts off the shelf, screen glow grows on the wall. |
| 5.76 | 173 | 170 | **HERO: "Twenty minutes later"**: wall clock hands spin to +20 min (linear ease, the one allowed). Callout "20 minutes later". |
| 7.20 | 216 | 213 | **"rush"**: prayer mat unrolls crooked, one corner folded. |
| 9.04 | 271 | 268 | **"remember"**: mat settles, glow on the wall dims to a single window light. |

Hand-off: phone glow becomes the window light, which the match cut into scene 02 keeps in place.
SFX: notification (f8), soft pop (hand reach, f44), tick-run under the clock spin (f174 on), whoosh not used.

### 02 salam — frames 317–667 (10.56–22.24 s)
VO: "Salam alaykum wa rahmatullah. Over the next four minutes, I'll give you three small steps… when you say Allahu Akbar. No guilt, just setup."

| Time | Frame | Land | Beat |
| --- | --- | --- | --- |
| 10.56 | 317 | 314 | **HERO: "السلام عليكم ورحمة الله"**: sand salam calligraphy reveals over the window, word by word (RTL, Amiri 140). |
| 12.80 | 384 | 381 | Calligraphy shrinks to the upper edge, window frame stays. |
| 14.96 | 449 | 446 | **"three"**: counter "3" appears in Fraunces 600, 84 px. |
| 15.60 | 468 | 465 | **"steps"**: counter reads "3 steps", small tick marks 1·2·3 beneath. |
| 18.72 | 562 | 559 | **"present"**: lamp breath swells once. |
| 19.52 | 586 | 583 | **"Allahu Akbar"**: الله أكبر (Amiri 96, sand) fades over the window, holds 36 frames, then out. |
| 20.72 | 622 | 619 | **"No guilt"**: callout "No guilt. Just setup." Counter fades. |

Hand-off: window frame becomes the ayah poster border.
SFX: soft pop on "3" (f450), soft pop on the callout (f623). No SFX under the Arabic.

### 03 ayah — frames 667–1169 (22.24–38.96 s)
VO: "Here's the reframe. Allah describes success like this: [recitation 25.60–30.88] Successful indeed are the believers, those who are humble in their prayer. Quran, chapter 23, verses 1 and 2."

| Time | Frame | Land | Beat |
| --- | --- | --- | --- |
| 22.24 | 667 | — | Poster dissolve to `--emerald-950`, window-border outline remains as the poster frame (18 f). |
| 23.44 | 703 | 700 | "Allah describes success": poster quiet, ambient drift only. |
| 25.60 | 768 | 765 | **HERO: recitation starts**: قَدْ أَفْلَحَ الْمُؤْمِنُونَ ۝ الَّذِينَ هُمْ فِي صَلَاتِهِمْ خَاشِعُونَ revealed word by word in gold, 6 f per word, 3 f stagger. Reveal must finish by 30.88 s (f926). 11 words → fits (11 × 3 + 6 = 39 f, spread across 158 f so each word is timed to the recitation, not bunched at the start). |
| 30.88 | 926 | 923 | Recitation ends. Ayah holds at full. |
| 30.88 | 926 | 923 | **"Successful indeed"**: translation card fades in below (Inter 400, 40 px, sand). Text from Script.txt, unchanged. |
| 35.28 | 1058 | 1055 | **"Quran, chapter 23"**: reference card "Quran 23:1–2" under the translation. |

Hand-off: poster fades to the prayer-mat room.
SFX: none for the whole scene.
Camera: scale ≤ 1.01 (SPEC §5).

### 04 khushu — frames 1169–1662 (38.96–55.39 s)
VO: "Khushu, humility and presence, is something we strive for. But most of us try to build it in the middle of salah, with a phone buzzing in the next room or the next pocket. Focus is mostly decided before you start. So don't fight your phone with willpower. Remove the fight."

| Time | Frame | Land | Beat |
| --- | --- | --- | --- |
| 38.96 | 1169 | 1166 | Poster dissolves into the prayer-mat room: calm, lamp glow, mat centred. Callout "Khushu = humility + presence". |
| 42.32 | 1270 | 1267 | "strive": mat lamp breath, slow 1–2% push (still calm). |
| 43.36 | 1301 | 1298 | "But most of us try…": phone appears in the corner of the room (small). |
| 46.56 | 1397 | 1394 | **HERO: "buzzing"**: buzz rings in `--alert` expand from the phone and crack the calm around the mat (hairline crack in the floor). Phone buzz SFX. |
| 49.12 | 1474 | 1471 | "Focus is mostly decided before": cracks stop; one ring holds frozen. |
| 51.76 | 1553 | 1550 | "don't fight your phone": the ring tries to push back and fades (no fight). |
| 54.00 | 1620 | 1617 | **"Remove the fight"**: callout "Remove the fight."; `--alert` drains from the phone, rings gone. |

Hand-off: the floor crack becomes the doorway edge used in scene 05/06.
SFX: phone buzz (f1398), soft pop on callout (f1621).

### 05 three-words — frames 1662–1854 (55.39–61.79 s)
VO: "Three steps. One word each. Away. Silent. Replace."

| Time | Frame | Land | Beat |
| --- | --- | --- | --- |
| 55.39 | 1662 | 1659 | "Three steps": room darkens to `--emerald-950`, three empty slots drawn as pencil-thin guides. |
| 57.87 | 1736 | 1733 | **HERO: "Away"**: AWAY (Fraunces 700, 220 px, gold) slides in from the left edge and exits right, layout 1: motion/distance. Soft riser starts ~f1700 and peaks on f1737 (the only riser in the film). |
| 58.83 | 1765 | 1762 | **"Silent"**: SILENT in a different layout, centred and still, small, fading to 60% as a ring closes round it (layout 2: stillness). |
| 59.79 | 1794 | 1791 | **"Replace"**: REPLACE rises from the bottom and swaps its letters out for a droplet shape and back (layout 3: morph). |
| 60.99 | 1830 | 1827 | Away re-enters smaller from the left (the second "Away" in the transcript at ~61.0). |

Hand-off: the word "Away" slides into the door.
SFX: riser/impact once (peak f1737). Pop at 1766, soft whoosh at 1795.
Three layouts must differ in position, size and motion (SPEC §11: no three identical cards).

### 06 away — frames 1854–2108 (61.79–70.27 s)
VO: "Away. When the adhan calls ḥayya ʿala as-salah, come to prayer, put your phone in another room. Not face down on the mat. Another room."

| Time | Frame | Land | Beat |
| --- | --- | --- | --- |
| 61.79 | 1854 | 1851 | Door-slide transition (18 f): "Away" slides into a door, which slides open onto the hallway. |
| 62.19 | 1866 | 1863 | "adhan": minaret silhouette in the window pulses once. |
| 63.07 | 1892 | 1889 | **"ḥayya ʿala as-salah"**: حَيَّ عَلَى الصَّلَاةِ (Amiri 96, sand) fades over the doorway, 36 f hold. No SFX under it. |
| 65.07 | 1952 | 1949 | **"come to prayer"**: Arabic leaves, phone on the table lights up. |
| 66.51 | 1995 | 1992 | **HERO: "another room"**: phone slides through the doorway, door-slide following it into the next room. |
| 67.31 | 2019 | 2016 | **"Not face down on the mat"**: prayer mat with a phone face down on it; a red cross-line crosses it (`--alert`). |
| 69.15 | 2075 | 2072 | **"another room"** again: cross clears, camera pans to the other room; callout "Another room" at 67.31 (callout list). |

Hand-off: phone lands in the drawer of the next room.
SFX: door slide (f1855), soft pop (f1996), whoosh (f1996).

### 07 away-example — frames 2108–2531 (70.27–84.35 s)
VO: "Tomorrow, pick one prayer and leave your phone in a bag or a drawer before you make wudu. Picture someone at work at Dhuhr: phone in the desk drawer, or in a locker, before they walk to pray. If you have to stand up to get it, you'll usually leave it."

| Time | Frame | Land | Beat |
| --- | --- | --- | --- |
| 70.27 | 2108 | 2105 | Match cut on phone: room changes to a home entry; a bag hangs on a hook. |
| 73.07 | 2192 | 2189 | **"bag or a drawer"**: phone drops into the bag, then a drawer slides closed beside it. |
| 75.23 | 2257 | 2254 | **"Picture someone at work"**: camera lifts to top view of an office desk. |
| 77.55 | 2327 | 2324 | **HERO: "desk drawer"**: phone goes into the desk drawer, drawer closes. |
| 78.91 | 2367 | 2364 | **"locker"**: locker door opens, phone placed, door shut. |
| 80.43 | 2413 | 2410 | "before they walk to pray": prayer-mat icon at the corner of the desk. |
| 81.07 | 2432 | 2429 | **"If you have to stand up"**: chair pushes back (no person); callout "Stand up to get it". |
| 81.79 | 2454 | 2451 | "stand up to get it": drawer stays shut; chair stays pulled back. |

Hand-off: the locker door opens onto the nightstand in scene 08.
SFX: drawer close ×2 (f2330, f2193 pop), locker door (f2370), soft pop on the callout (f2433).

### 08 silent — frames 2531–2975 (84.35–99.15 s)
VO: "Silent. Set your phone's focus mode or Do Not Disturb to switch on by itself for about fifteen minutes around each prayer. Let through only calls from family or true emergencies. Now your phone makes the decision for you, so you don't have to."

| Time | Frame | Land | Beat |
| --- | --- | --- | --- |
| 84.35 | 2531 | 2528 | Camera pull. Phone on the nightstand, screen on. SILENT (gold, 220 px) holds the upper-left; it shrinks into a status label. |
| 86.51 | 2595 | 2592 | **HERO: "focus mode"**: UI mock opens; focus toggle flips (snap ease), screen dims. |
| 87.95 | 2639 | 2636 | "Do Not Disturb": moon/DND label appears on the mock (Inter 600, 32 px). |
| 90.27 | 2708 | 2705 | **"fifteen minutes"**: a 15-minute ring forms around the Dhuhr time slot on a mini timeline (linear on the ring is allowed). UI label "15 min" (32 px). |
| 93.47 | 2804 | 2801 | **"calls from family"**: contact filter list; only two entries (Family, Emergency) stay bright. Callout "Family and emergencies only" at 92.43. |
| 97.15 | 2915 | 2912 | **"decision for you"**: toggle auto-flips on a clock, no hand. |

Hand-off: the ring around the phone becomes the library window circle.
SFX: toggle click (f2597), tick (ring, f2709), soft pop (f2805).

### 09 silent-ex — frames 2975–3143 (99.15–104.75 s)
VO: "If you're a student in the library, the group chat can wait ten minutes. It will still be there."

| Time | Frame | Land | Beat |
| --- | --- | --- | --- |
| 99.15 | 2975 | 2972 | Match cut on the phone: library window, bookshelves on both sides (no people). |
| 99.71 | 2991 | 2988 | "student": a desk lamp and a single open book on the desk. |
| 101.15 | 3035 | 3032 | **HERO: "group chat"**: chat bubbles pile up on the right of the phone (`--alert` dot count grows 1…5). |
| 103.15 | 3095 | 3092 | **"It will still be there"**: bubbles freeze, go `--grey-dim`, dot disappears; callout "It will still be there". |
| 104.00 | 3120 | 3117 | Bubbles drop together (exit ease) and start to become droplets. |

Hand-off: frozen bubbles fall and become water drops (scene 10).
SFX: 5 soft taps (f3036, 3042, 3048, 3054, 3060), soft pop (f3096).

### 10 replace — frames 3143–3755 (104.75–125.16 s)
VO: "Replace. The urge to reach for your phone doesn't just vanish. It needs somewhere to go. So in the minutes after the adhan, make wudu slowly. Sit. Breathe. Do whatever you normally do before you stand to pray. Scholars differ on what's best in that window, so ask a qualified scholar if you're unsure. The goal is simple…"

| Time | Frame | Land | Beat |
| --- | --- | --- | --- |
| 104.75 | 3143 | 3140 | Camera pull to the prayer mat room. REPLACE (gold, 220 px) arrives and settles at the top. |
| 106.59 | 3198 | 3195 | **"urge"**: an empty hand-shaped outline on the mat (a gap where the phone would sit), thin, with a faint `--alert` pulse. |
| 110.19 | 3306 | 3303 | **"somewhere to go"**: the outline fills with `--emerald-300`, so the urge has a place. |
| 111.31 | 3339 | 3336 | "minutes after the adhan": fill becomes a basin. |
| 113.71 | 3411 | 3408 | **HERO: "wudu"**: bubbles-turned-droplets fall into the basin, water level rises (slow, sine). |
| 115.15 | 3455 | 3452 | **"Sit."**: the basin shrinks away, mat centres, a breath circle forms (`--emerald-300`). |
| 116.03 | 3481 | 3478 | **"Breathe."**: the circle breathes: 90 f cycle (45 in, 45 out), repeated until f3594. |
| 119.80 | 3594 | 3591 | **"Scholars differ…"**: breath circle shrinks to the corner. Callout "Ask a qualified scholar" at 119.80. |
| 125.16 | 3755 | — | "The goal is simple": breath circle drifts to the bottom-left, becomes the timeline's first dot. |

Hand-off: breath circle becomes the timeline's start dot.
SFX: water drip ×3 (f3412, f3426, f3441), soft pop on callout (f3595). None during sit/breathe.

### 11 dhuhr — frames 3755–4333 (125.16–144.44 s)
VO: "The goal is simple: fill the gap with something other than a screen. Here's what Dhuhr might look like. Five minutes before, the phone goes in the bag. At the adhan, focus mode switches on. Then wudu, slowly. Then you pray. Use your own times; the shape is what matters."

| Time | Frame | Land | Beat |
| --- | --- | --- | --- |
| 125.16 | 3755 | 3752 | Camera pull: floor plan view; a horizontal timeline appears with one dot. |
| 126.44 | 3793 | 3790 | "fill the gap": the gap between two ticks glows `--emerald-300` (a visual gap on the line). |
| 129.88 | 3896 | 3893 | **"Dhuhr"**: label "Dhuhr" (Fraunces 600, 84 px) on the line. |
| 131.32 | 3940 | 3937 | **HERO "Five minutes before"**: line grows; dot 1 "−5 min" with a small bag icon (phone drops in). |
| 134.60 | 4038 | 4035 | **"At the adhan"**: dot 2 with a small minaret icon + a focus-mode toggle. |
| 137.72 | 4132 | 4129 | **"wudu"**: dot 3 with a water-drop icon. |
| 139.72 | 4192 | 4189 | **"you pray"**: dot 4 with a prayer-mat icon; line completes. |
| 141.16 | 4235 | 4232 | **"Use your own times"**: callout "Use your own times". |

Hand-off: the timeline's last dot becomes the fridge door.
SFX: tick per dot (f3941, 4039, 4133, 4193), soft pop on callout (f4236).

### 12 objection — frames 4333–4844 (144.44–161.48 s)
VO: "The most common excuse? 'I need my phone for prayer times.' Fair. So move that job somewhere else. Use a cheap alarm clock, a watch, or a printed timetable on the fridge. And if your phone has to be the alarm, silence it, walk away, and don't open it."

| Time | Frame | Land | Beat |
| --- | --- | --- | --- |
| 144.44 | 4333 | 4330 | Camera pull. Kitchen wall with a fridge. A speech-bubble style card says "I need my phone for prayer times." (≤ 22 words, Inter 400, 40 px) |
| 145.96 | 4379 | 4376 | The quote card tilts as the myth flips over (hero start). |
| 148.04 | 4441 | 4438 | **"Fair."**: card settles back flat, then slides to the left. |
| 149.72 | 4492 | 4489 | **"move that job somewhere else"**: the phone-alarm icon pops off the phone and floats right. |
| 151.40 | 4542 | 4539 | **HERO: "alarm clock"**: alarm clock pops onto the table. |
| 152.68 | 4580 | 4577 | **"a watch"**: watch lands beside it. |
| 154.20 | 4626 | 4623 | **"printed timetable on the fridge"**: timetable card sticks to the fridge with a magnet. |
| 155.80 | 4674 | 4671 | **"if your phone has to be the alarm"**: phone on the table, alarm icon bright. |
| 158.04 | 4741 | 4738 | **"silence it"**: alarm icon crosses out, sound waves vanish. |
| 159.20 | 4776 | 4773 | **"walk away"**: phone slides off the table out of frame. |
| 160.52 | 4816 | 4813 | **"don't open it"**: empty table; lamp breath. |

Hand-off: the timetable becomes a row of prayer lamps.
SFX: pop (f4442), pop ×3 for alarm clock, watch, timetable (f4543, 4581, 4627), magnet click (f4627).

### 13 start-small — frames 4844–5288 (161.48–176.25 s)
VO: "You don't need all three tomorrow. Pick one prayer, the one you rush the most, and do just the first step: Away. That's it. Salah isn't something we optimize. It's the anchor the day is built around. We're only clearing the path to it."

| Time | Frame | Land | Beat |
| --- | --- | --- | --- |
| 161.48 | 4844 | 4841 | Camera pull. Row of five prayer lamps (Fajr, Dhuhr, Asr, Maghrib, Isha as small icons/labels, Inter 600 ≥ 32 px). |
| 162.36 | 4871 | 4868 | "all three tomorrow": three small step marks appear above the row and fade. |
| 163.96 | 4919 | 4916 | **HERO: "pick one prayer"**: four lamps dim, one stays lit. |
| 165.08 | 4952 | 4949 | "the one you rush the most": lit lamp pulses once. |
| 168.20 | 5046 | 5043 | **"Away"**: gold AWAY (220 px) appears under the lit lamp, then shrinks. Callout "Just step one". |
| 169.00 | 5070 | 5067 | **"That's it."**: everything holds still. |
| 172.52 | 5176 | 5173 | **"anchor"**: a small anchor icon drops onto the lit lamp's base. |
| 174.28 | 5228 | 5225 | **"clearing the path"**: a path of tiles from the lamp to the mat clears (objects slide off). Callout "Clear the path". |

Hand-off: camera pulls back from the lit window.
SFX: pop ×2 (f4920, f5047), anchor drop thud (f5177), path-clear whoosh (f5229).

### 14 cta-dua — frames 5288–5804 (176.25–193.45 s)
VO: "If this helped, check out the free one-page phone-down checklist in the description. Let's end with the du'a of Ibrahim, peace be upon him: Rabbi ij'alni muqeema as-salah wa min dhurriyyati. My Lord, make me one who establishes prayer, and from my descendants."

| Time | Frame | Land | Beat |
| --- | --- | --- | --- |
| 176.25 | 5288 | 5285 | Camera pull to the lit window; a checklist card slides in from the right (sand paper card, `--emerald-950` text, 3 check lines in Inter 600 ≥ 32 px: Away / Silent / Replace, plain sand, **not gold**). |
| 179.29 | 5379 | 5376 | **HERO: "checklist"**: ticks draw on, one per beat (f5376, 5394, 5412). |
| 180.89 | 5427 | 5424 | "du'a of Ibrahim": card slides out, poster dissolve to `--emerald-950` (18 f). |
| 183.00 | 5490 | 5487 | **"Rabbi ij'alni"**: رَبِّ اجْعَلْنِي مُقِيمَ الصَّلَاةِ وَمِن ذُرِّيَّتِي (Amiri 104, gold) revealed word by word, 6 f per word. Finish by 188.65 s (f5660). No SFX. |
| 188.65 | 5660 | 5657 | **Translation**: card "My Lord, make me one who establishes prayer, and from my descendants." (Inter 400, 40 px, sand). |
| 192.57 | 5777 | 5774 | "descendants": poster dims toward the final window. |

Hand-off: poster dims to the final window.
SFX: pop ×3 on ticks (f5377, 5395, 5413). None from the du'a onward.
Transition in the middle of scene 14 is a poster dissolve (checklist to du'a), which makes scene 15's poster dissolve repeat. Resolution: see section 5.

### 15 salam — frames 5804–5868 (193.45–195.60 s)
VO: "السلام عليكم ورحمة الله."

| Time | Frame | Land | Beat |
| --- | --- | --- | --- |
| 193.45 | 5804 | 5801 | **HERO**: salam calligraphy (Amiri 140, sand) settles over one lit window in the dark house. |
| 195.53 | 5866 | — | VO ends. Calligraphy holds. |
| 195.60 | 5868 | — | End. The SPEC's 60-frame hold means the clip runs from 5,804 to 5,864 and the last 4 frames are black or hold. |

SFX: none. Room tone optional (decided in Phase 9).

## 3. Callout master list (final text, frozen)

Rule from SPEC §7: at most one every 6 s, on screen 45–75 f, lower-left third, inside title-safe.

| # | Time s | Start f (land) | Text | Scene | Gap since previous |
| --- | --- | --- | --- | --- | --- |
| 1 | 5.76 | 170 | 20 minutes later | 01 | — |
| 2 | 20.72 | 619 | No guilt. Just setup. | 02 | 14.96 |
| 3 | 38.96 | 1166 | Khushu = humility + presence | 04 | 18.24 |
| 4 | 54.00 | 1617 | Remove the fight | 04 | 15.04 |
| 5 | 67.31 | 2016 | Another room | 06 | 13.31 |
| 6 | 81.07 | 2429 | Stand up to get it | 07 | 13.76 |
| 7 | 92.43 | 2774 | Family and emergencies only | 08 | 11.36 |
| 8 | 103.15 | 3092 | It will still be there | 09 | 10.72 |
| 9 | 119.80 | 3591 | Ask a qualified scholar | 10 | 16.65 |
| 10 | 141.16 | 4232 | Use your own times | 11 | 21.36 |
| 11 | 168.20 | 5043 | Just step one | 13 | 27.04 |
| 12 | 174.28 | 5225 | Clear the path | 13 | 6.08 |

**Change from SPEC §7:** the 90.00 s "About 15 minutes" callout is dropped. It was 2.43 s before "Family and emergencies only", which breaks the 6 s rule. The 15-minute idea is carried by the UI label "15 min" in the phone mock (32 px Inter, part of the UI, not a callout).

## 4. SFX cue sheet

Peak frame = visual hit frame + 1. Gain target ≈ −18 dB below VO loudness (SPEC §6).

| Frame | Time s | Cue | Scene | Notes |
| --- | --- | --- | --- | --- |
| 8 | 0.27 | notification chime | 01 | |
| 44 | 1.47 | soft pop | 01 | hand reaches |
| 174–≈210 | 5.8–7.0 | tick run | 01 | clock spin, ends f210 |
| 450 | 15.0 | soft pop | 02 | "3" |
| 623 | 20.8 | soft pop | 02 | callout |
| 1398 | 46.6 | phone buzz | 04 | |
| 1621 | 54.0 | soft pop | 04 | callout |
| 1737 | 57.9 | riser/impact | 05 | the only one in the film; riser starts ~f1700 |
| 1766 | 58.9 | soft pop | 05 | Silent |
| 1795 | 59.8 | whoosh (take B) | 05 | Replace |
| 1855 | 61.8 | door slide | 06 | |
| 1996 | 66.5 | whoosh (take A) | 06 | phone slides |
| 2193 | 73.1 | soft pop | 07 | bag |
| 2330 | 77.7 | drawer close | 07 | |
| 2370 | 79.0 | drawer close (locker) | 07 | |
| 2433 | 81.1 | soft pop | 07 | callout |
| 2597 | 86.6 | toggle click | 08 | |
| 2709 | 90.3 | tick | 08 | ring |
| 2805 | 93.5 | soft pop | 08 | |
| 3036, 3042, 3048, 3054, 3060 | 101.2–102.0 | soft tap ×5 | 09 | bubbles |
| 3096 | 103.2 | soft pop | 09 | freeze |
| 3412, 3426, 3441 | 113.7–114.7 | water drip ×3 | 10 | |
| 3595 | 119.8 | soft pop | 10 | callout |
| 3941, 4039, 4133, 4193 | 131.4–139.8 | tick ×4 | 11 | timeline dots |
| 4236 | 141.2 | soft pop | 11 | callout |
| 4442 | 148.1 | soft pop | 12 | |
| 4543, 4581, 4627 | 151.4–154.2 | soft pop ×3 + magnet click on the last | 12 | |
| 4920, 5047 | 164.0, 168.2 | soft pop | 13 | |
| 5177 | 172.6 | anchor thud | 13 | |
| 5229 | 174.3 | whoosh (take C) | 13 | |
| 5377, 5395, 5413 | 179.3–180.4 | soft pop ×3 | 14 | ticks |

Silence zones (no SFX): 768–926 (ayah), 5490–5660 (du'a), 5660–5868.
Whoosh takes rotate A→B→C so no take plays twice in a row.

## 5. Open points to review

SPEC §9 as written would repeat transitions back to back, so these changes were made. Say if you want SPEC §9 followed literally instead.

1. **03→04 is a camera pull, not a poster dissolve.** Otherwise 02→03 and 03→04 are both poster dissolves.
2. **04→05 is a poster dissolve.** Scene 05 opens on `--emerald-950` anyway, and this avoids two camera pulls in a row.
3. **Match cuts are also used at 10→11 (breath circle becomes the start dot) and 12→13 (timetable becomes the lamp row).** SPEC §9 listed match cuts only for 01→02, 06→07, 08→09. These two already have matching hand-off objects in SPEC §8, and without them camera pull would run four times in a row. 11→12 and 13→14 stay camera pulls.
4. **Callout dropped:** 90.00 s "About 15 minutes" (section 3).
5. **task.md draft times are superseded.** The old approximate column was off by up to 17 s in places (for example scene 03 at 0:27 vs real 0:22, scene 05 at 1:02 vs real 0:55, scene 10 at 2:02 vs real 1:45). SPEC §8 already used the real values.
6. **Final scene is 64 frames (2.1 s).** The VO ends at 195.53 s, so the SPEC's 60-frame end hold cannot fit after the salam. If you want a longer hold on the lit window, the film length goes past 195.6 s and the 5,868-frame count changes. Not changed here.
7. **Recitation beats are interpolated.** The ayah (25.60–30.88 s) and du'a (183.00–188.65 s) have no words in the transcript. Per-word reveal times are spread evenly across those windows and need a check against the audio in Phase 6.
