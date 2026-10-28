// The sets of the film. Times are film seconds (VO anchors from assets/audio/vo.anchors.json).
import * as THREE from "three";
import {
  C, E, clamp, lerp, prog, mv, pulse, rng, clay, own, glow, basic, mesh, rbox, box, cyl, sph, tor, group, lathe,
  archShape, archFrame, canvasTex, halo, blob, dust, lamp, label,
} from "./kit.js";
import {
  room, phone, screens, wallClock, shelf, prayerMat, door, desk, lockers, bookshelf, bubble, basin, bag,
  alarmClock, watch, fridge, checklistTexture, minaret, mosque,
} from "./props.js";
import { moreStations } from "./stations2.js";

const PI = Math.PI;

export function makeStation(scene, opts = {}) {
  const g = new THREE.Group();
  scene.add(g);
  return { group: g, shots: [], update: () => {}, light: opts.light || {}, bg: opts.bg ?? null, clear: opts.clear ?? 0x06211c };
}

// ---------- reusable bits ----------
export function plant(parent, { x = 0, y = 0, z = 0, seed = 11, s = 1 } = {}) {
  const r = rng(seed);
  const g = group(parent, { x, y, z });
  g.scale.setScalar(s);
  lathe([[0.0, 0.0], [0.26, 0.0], [0.34, 0.55], [0.36, 0.6], [0.0, 0.6]], clay(C.s500, 0.85), { parent: g });
  const leaf = clay(C.e600, 0.7);
  const leaves = [];
  for (let i = 0; i < 9; i++) {
    const a = (i / 9) * PI * 2 + r() * 0.4, tilt = 0.35 + r() * 0.5, len = 0.5 + r() * 0.45;
    const pivot = group(g, { y: 0.58, ry: a });
    const l = sph(0.5, i % 3 ? leaf : clay(C.e700, 0.7), { parent: pivot });
    l.scale.set(0.16, len, 0.05);
    l.position.set(0, len * 0.5, 0);
    pivot.rotation.z = tilt;
    leaves.push(pivot);
  }
  g.userData.sway = (t) => leaves.forEach((p, i) => { p.rotation.x = Math.sin(t * 0.8 + i) * 0.03; });
  return g;
}

// expanding rings (sound / buzz). Flat on XZ when flat=true.
export function ringSet(parent, n, color, { x = 0, y = 0, z = 0, flat = false, tube = 0.02 } = {}) {
  const g = group(parent, { x, y, z });
  const rings = [];
  for (let i = 0; i < n; i++) {
    const m = mesh(new THREE.TorusGeometry(1, tube, 8, 96), basic(color, { transparent: true, opacity: 0, blending: THREE.AdditiveBlending, depthWrite: false, toneMapped: false }), { rx: flat ? PI / 2 : 0, parent: g, cast: false, receive: false });
    rings.push(m);
  }
  // fire rings from t0, one every `gap`, each growing to rMax over `dur`
  g.userData.play = (t, t0, gap, dur, rMax, count = n, op = 0.9) => {
    rings.forEach((m, i) => {
      const k = i < count ? prog(t, t0 + i * gap, t0 + i * gap + dur) : 0;
      const s = 0.05 + E.out(k) * rMax;
      m.scale.set(s, s, s);
      m.material.opacity = k > 0 && k < 1 ? op * (1 - k) : 0;
    });
  };
  return g;
}

function gradientDome(r, top, mid, bottom) {
  const mat = new THREE.ShaderMaterial({
    side: THREE.BackSide, depthWrite: false,
    uniforms: { top: { value: new THREE.Color(top) }, mid: { value: new THREE.Color(mid) }, bot: { value: new THREE.Color(bottom) } },
    vertexShader: `varying vec3 vP; void main(){ vP = normalize(position); gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0); }`,
    fragmentShader: `uniform vec3 top; uniform vec3 mid; uniform vec3 bot; varying vec3 vP;
      void main(){ float y = vP.y; vec3 c = y > 0.0 ? mix(mid, top, smoothstep(0.0, 0.6, y)) : mix(mid, bot, smoothstep(0.0, -0.5, y));
      gl_FragColor = vec4(c, 1.0); }`,
  });
  return new THREE.Mesh(new THREE.SphereGeometry(r, 48, 24), mat);
}
function stars(parent, n, r, seed, { size = 0.18, minY = 0.05 } = {}) {
  const rr = rng(seed);
  const pos = [];
  for (let i = 0; i < n; i++) {
    const th = rr() * PI * 2, y = minY + rr() * (1 - minY), s = Math.sqrt(1 - y * y);
    pos.push(Math.cos(th) * s * r, y * r, Math.sin(th) * s * r);
  }
  const geo = new THREE.BufferGeometry();
  geo.setAttribute("position", new THREE.Float32BufferAttribute(pos, 3));
  const p = new THREE.Points(geo, new THREE.PointsMaterial({ color: 0xf4ead5, size, transparent: true, opacity: 0.8, depthWrite: false, toneMapped: false }));
  parent.add(p);
  return p;
}
function patternTexture() {
  return canvasTex(1024, 1024, (ctx, w, h) => {
    ctx.fillStyle = "#082C25"; ctx.fillRect(0, 0, w, h);
    ctx.strokeStyle = "rgba(127,196,174,0.16)"; ctx.lineWidth = 3;
    const S = 128;
    for (let y = 0; y <= h + S; y += S) for (let x = 0; x <= w + S; x += S) {
      ctx.save(); ctx.translate(x, y);
      for (const rot of [0, PI / 4]) {
        ctx.save(); ctx.rotate(rot); ctx.strokeRect(-S * 0.28, -S * 0.28, S * 0.56, S * 0.56); ctx.restore();
      }
      ctx.restore();
    }
  });
}
// one set of soft light shafts
function shafts(parent, n, seed, { x = 0, y = 4, z = -2, spread = 4, color = C.lamp, op = 0.07 } = {}) {
  const r = rng(seed);
  const tex = canvasTex(64, 256, (ctx, w, h) => {
    const g = ctx.createLinearGradient(0, 0, 0, h);
    g.addColorStop(0, "rgba(255,255,255,0.9)"); g.addColorStop(1, "rgba(255,255,255,0)");
    ctx.fillStyle = g; ctx.fillRect(0, 0, w, h);
    const g2 = ctx.createLinearGradient(0, 0, w, 0);
    g2.addColorStop(0, "rgba(0,0,0,1)"); g2.addColorStop(0.5, "rgba(0,0,0,0)"); g2.addColorStop(1, "rgba(0,0,0,1)");
    ctx.globalCompositeOperation = "destination-out"; ctx.fillStyle = g2; ctx.fillRect(0, 0, w, h);
  }).tex;
  const out = [];
  for (let i = 0; i < n; i++) {
    const m = mesh(new THREE.PlaneGeometry(0.8 + r() * 1.2, 9), new THREE.MeshBasicMaterial({ map: tex, color, transparent: true, opacity: op, blending: THREE.AdditiveBlending, depthWrite: false, side: THREE.DoubleSide, toneMapped: false }),
      { x: x + (r() - 0.5) * spread, y, z: z + (r() - 0.5) * 1.5, rz: 0.25 + (r() - 0.5) * 0.1, cast: false, receive: false, parent });
    m.geometry.translate(0, -4.5, 0);
    out.push(m);
  }
  return out;
}

// ============================================================
// 1. HALLWAY: hook (0–10.56), salam (10.56–22.24), final salam (193.45–end)
// ============================================================
function hall(scene) {
  const st = makeStation(scene, { light: { pos: [5, 8, 7], target: [0, 1, -2], key: 0.9, hemi: 0.45, env: 0.25 } });
  const g = st.group;
  const win = { x: -2.8, y: 1.15, w: 1.6, h: 2.5 };
  const R = room(g, { w: 17, d: 7, h: 4.8, win, seed: 21 });
  const sh = shelf(g, { x: 2.4, y: 1.25, z: -3.15, w: 2.2 });
  const books = group(g, { x: 3.1, y: 1.29, z: -3.15 });
  [[0.1, 0.42, C.e600], [0.08, 0.36, C.s100], [0.09, 0.4, C.alert]].forEach(([w, h, c], i) => rbox(w, h, 0.3, 0.01, clay(c, 0.8), { x: i * 0.11, y: h / 2, parent: books }));
  const clock = wallClock(g, { x: 0.3, y: 3.2, z: -3.33, r: 0.52 });
  const L = lamp(g, { x: 4.6, z: -2.4, h: 1.9, power: 11, dist: 9 });
  const pl = plant(g, { x: -4.9, z: -2.5, s: 1.3 });
  rbox(3.4, 0.02, 1.5, 0.01, clay(C.e600, 0.95), { x: 0.6, y: 0.01, z: -0.6, parent: g });
  rbox(3.1, 0.022, 1.2, 0.01, clay(C.e700, 0.95), { x: 0.6, y: 0.012, z: -0.6, parent: g });
  // three little lanterns for "three small steps"
  const lanterns = [];
  for (let i = 0; i < 3; i++) {
    const lg = group(g, { x: win.x - 0.5 + i * 0.5, y: win.y + 0.0, z: -3.2 });
    lathe([[0, 0], [0.09, 0], [0.11, 0.05], [0.1, 0.2], [0.06, 0.26], [0.02, 0.32], [0, 0.34]], own(C.s300, 0.5, 0.2, { emissive: C.lamp, emissiveIntensity: 0 }), { parent: lg });
    const hl = halo(C.lamp, 0.9, 0, { y: 0.16, parent: lg });
    lanterns.push({ g: lg, hl, m: lg.children[0].material });
  }
  const P = phone(g, { x: 2.1, y: 1.31, z: -3.1, rx: -PI / 2, draw: screens.lock, state: { notifs: [] } });
  const bubbles = [
    bubble(g, { w: 1.0, color: C.s100 }), bubble(g, { w: 0.8, color: C.e300 }), bubble(g, { w: 1.2, color: C.alert, lines: 1 }),
    bubble(g, { w: 0.9, color: C.s300 }), bubble(g, { w: 0.7, color: C.s100, lines: 1 }),
  ];
  const rings = ringSet(g, 4, C.e300, { x: win.x + 0.15, y: win.y + 1.6, z: -4.3, tube: 0.012 });
  const motes = dust(90, [-5, 0.3, -3, 5, 4.2, 2], 31);
  g.add(motes);

  const shelfPos = new THREE.Vector3(2.1, 1.31, -3.1), handPos = new THREE.Vector3(2.15, 1.85, -1.35);
  st.update = (t) => {
    motes.userData.update(t);
    pl.userData.sway(t);
    // adhan rings from the minaret
    rings.userData.play(t, 0.24, 0.45, 1.8, 1.2, 4, 0.7);
    // phone screen on at "one minute"
    const on = mv(t, 1.4, 0.3) * (1 - mv(t, 10.1, 0.4));
    P.on(on, C.e300);
    const nk = (a) => mv(t, a, 0.35, E.back);
    P.update({ time: "1:04", notifs: [
      { t: "Study group", b: "12 new messages", c: "#E26D4F", k: nk(1.7) },
      { t: "For you", b: "Watch this before…", c: "#7FC4AE", k: nk(2.2) },
      { t: "News", b: "Breaking: you won't…", c: "#E3CFA6", k: nk(2.7) },
      { t: "Sale", b: "Ends in 1 hour", c: "#B99A68", k: nk(3.2) },
    ] });
    // pick up (4.0) and put back (10.2)
    const up = mv(t, 3.9, 0.9, E.inOut) * (1 - mv(t, 10.2, 1.0, E.inOut));
    P.group.position.lerpVectors(shelfPos, handPos, up);
    P.group.position.y += Math.sin(t * 1.3) * 0.02 * up;
    P.group.rotation.set(lerp(-PI / 2, -0.12, up), lerp(0, -0.25, up), lerp(0, 0.06, up));
    // feed bubbles orbit the phone while it is up
    bubbles.forEach((b, i) => {
      const k = mv(t, 4.7 + i * 0.22, 0.4, E.back) * (1 - mv(t, 9.9 + i * 0.05, 0.35, E.in));
      const a = i * 1.26 + t * 0.35;
      b.group.position.set(handPos.x + Math.cos(a) * 0.95, handPos.y + Math.sin(a * 1.3) * 0.38 + 0.05, handPos.z + Math.sin(a) * 0.35);
      b.group.scale.setScalar(Math.max(0.001, k * 0.55));
      b.group.rotation.y = -0.25;
    });
    // twenty minutes later
    clock.set(5 * mv(t, 0, 6) + 20 * mv(t, 5.85, 1.9, E.inOut));
    // the room goes cold while scrolling, warm again for salam
    const cold = mv(t, 5.8, 1.2) * (1 - mv(t, 10.0, 1.4));
    L.set(1 - 0.75 * cold);
    R.spill.material.opacity = 0.12 + 0.08 * Math.sin(t * 0.6) ** 2 + 0.25 * pulse(t, 19.4, 0.5, 0.6, 1.6);
    lanterns.forEach((l, i) => {
      const k = mv(t, 14.0 + i * 0.32, 0.45, E.back);
      l.g.scale.setScalar(Math.max(0.001, k));
      l.m.emissiveIntensity = 2.2 * k;
      l.hl.material.opacity = 0.5 * k;
    });
    // final scene: room warm, window glowing
    if (t > 190) { L.set(1); R.spill.material.opacity = 0.3; }
  };
  st.shots.push({
    start: 0, end: 22.24, cam: [
      [0, [0.6, 2.2, 6.4], [0.8, 1.8, -3], 36],
      [1.3, [0.9, 2.1, 5.6], [1.1, 1.7, -3], 36],
      [3.6, [2.1, 2.0, 1.4], [2.15, 1.35, -3.0], 30],
      [5.4, [2.0, 2.05, 1.6], [2.1, 1.7, -1.3], 32],
      [6.3, [0.7, 2.75, 0.5], [0.35, 3.05, -3.3], 30, E.out4],
      [7.9, [0.6, 2.7, 0.9], [0.35, 3.0, -3.3], 31],
      [9.0, [0.3, 2.3, 6.2], [0.4, 1.7, -2.5], 38],
      [10.2, [-0.2, 2.2, 6.0], [-0.4, 1.9, -3], 37],
      [11.7, [-2.6, 2.1, 2.6], [-2.8, 2.25, -3.5], 36],
      [18.8, [-2.6, 2.3, 1.6], [-2.8, 2.4, -3.5], 33],
      [22.24, [-2.8, 2.4, -1.4], [-2.8, 2.45, -4.0], 30, E.in],
    ],
  });
  st.shots.push({ start: 193.45, end: 195.6, trans: 1, cam: [
    [193.45, [-2.4, 2.1, 3.6], [-2.8, 2.2, -3.5], 36],
    [195.6, [-2.5, 2.15, 3.2], [-2.8, 2.25, -3.5], 35],
  ] });
  return st;
}

// ============================================================
// 2. NIGHT POSTER: ayah (22.24–38.96), du'a (180.89–193.45)
// ============================================================
function poster(scene) {
  const st = makeStation(scene, { light: { pos: [3, 6, 8], target: [0, 0, -6], key: 0.7, hemi: 0.35, env: 0.2 }, clear: 0x03130f });
  const g = st.group;
  g.add(gradientDome(70, 0x020d0a, 0x0b3d33, 0x0f4a3d));
  stars(g, 420, 60, 99, { size: 0.16, minY: 0.12 });
  const frame = group(g, { y: -3.5, z: -6 });
  archFrame(6.2, 7.6, 0.24, 0.5, clay(C.s300, 0.55, 0.05), { parent: frame });
  archFrame(6.8, 8.0, 0.08, 0.3, clay(C.s500, 0.4, 0.4), { z: -0.3, parent: frame });
  const pat = patternTexture();
  pat.tex.wrapS = pat.tex.wrapT = THREE.RepeatWrapping;
  const pg = new THREE.ShapeGeometry(archShape(6.2, 7.6), 48);
  // map uvs from shape coordinates
  const uv = pg.attributes.uv;
  for (let i = 0; i < uv.count; i++) uv.setXY(i, uv.getX(i) / 3, uv.getY(i) / 3);
  mesh(pg, new THREE.MeshBasicMaterial({ map: pat.tex, color: 0xffffff }), { z: -0.2, parent: frame, cast: false, receive: false });
  const inner = halo(C.lamp, 9, 0.18, { y: 4.4, z: 0.1, parent: frame });
  const lampG = group(g, { y: 3.3, z: -5.6 });
  cyl(0.008, 0.008, 2.6, clay(C.s500, 0.4, 0.6), { y: 1.3, parent: lampG, cast: false });
  lathe([[0, -0.32], [0.14, -0.2], [0.22, 0.0], [0.16, 0.18], [0.05, 0.26], [0, 0.3]], own(C.s300, 0.4, 0.3, { emissive: C.lamp, emissiveIntensity: 1.6 }), { parent: lampG, cast: false });
  const lampHalo = halo(C.lamp, 2.6, 0.55, { parent: lampG });
  const pLight = new THREE.PointLight(C.lamp, 14, 12, 2);
  lampG.add(pLight);
  mosque(g, basic(0x0a332a), { x: -15, y: -9.2, z: -38, s: 2.2 });
  mosque(g, basic(0x0a332a), { x: 16, y: -9.4, z: -40, s: 2.4 });
  mosque(g, basic(0x082b23), { x: 0, y: -9.0, z: -46, s: 3.0 });
  const sh = shafts(g, 5, 5, { x: 0.5, y: 6, z: -4.5, spread: 5, op: 0.05 });
  const motes = dust(160, [-6, -4, -6, 6, 5, 3], 77, { size: 0.045, opacity: 0.6 });
  g.add(motes);
  st.update = (t) => {
    motes.userData.update(t);
    const b = 0.5 + 0.5 * Math.sin(t * 0.7);
    lampHalo.material.opacity = 0.45 + 0.12 * b;
    pLight.intensity = 12 + 3 * b;
    lampG.rotation.z = Math.sin(t * 0.5) * 0.02;
    inner.material.opacity = 0.14 + 0.06 * b;
    sh.forEach((m, i) => { m.material.opacity = 0.035 + 0.025 * Math.sin(t * 0.4 + i * 1.7) ** 2; });
  };
  // the ayah: settle in, then near-still during recitation (25.6–30.88), slow drift after
  st.shots.push({ start: 22.24, end: 38.96, trans: 1, drift: 0.006, cam: [
    [22.24, [0, 0.9, 12.5], [0, 0.6, -6], 36],
    [25.4, [0, 0.55, 10.6], [0, 0.5, -6], 34],
    [31.0, [0, 0.5, 10.45], [0, 0.48, -6], 34],
    [38.96, [0.5, 0.3, 9.6], [0.1, 0.3, -6], 34],
  ] });
  st.shots.push({ start: 180.89, end: 193.45, trans: 1, drift: 0.006, cam: [
    [180.89, [-0.6, 1.2, 12.8], [0, 0.7, -6], 36],
    [182.9, [-0.2, 0.6, 10.8], [0, 0.5, -6], 34],
    [188.6, [-0.15, 0.55, 10.65], [0, 0.5, -6], 34],
    [193.45, [0, 0.3, 9.6], [0, 0.4, -6], 33],
  ] });
  return st;
}

// ============================================================
// 3. PRAYER ROOM: khushu (38.96–55.39)
// ============================================================
function prayerRoom(scene) {
  const st = makeStation(scene, { light: { pos: [-4, 8, 6], target: [0, 0, -1], key: 1.0, hemi: 0.5, env: 0.25 } });
  const g = st.group;
  const R = room(g, { w: 16, d: 7.5, h: 4.8, win: { x: 2.4, y: 1.2, w: 1.5, h: 2.4 }, seed: 44 });
  const mat = prayerMat(g, { x: -0.6, z: -0.9, w: 1.5, l: 2.5 });
  const L = lamp(g, { x: -3.6, z: -2.6, h: 1.7, power: 10 });
  plant(g, { x: -5.0, z: -2.9, seed: 4, s: 1.1 });
  // low side table with the phone
  const tbl = group(g, { x: 3.4, z: -0.6 });
  rbox(1.1, 0.07, 0.7, 0.02, clay(C.s500, 0.6), { y: 0.55, parent: tbl });
  for (const [lx, lz] of [[-0.48, -0.28], [0.48, -0.28], [-0.48, 0.28], [0.48, 0.28]]) cyl(0.03, 0.03, 0.55, clay(C.s700, 0.7), { x: lx, y: 0.275, z: lz, parent: tbl });
  const P = phone(tbl, { y: 0.61, rx: -PI / 2, rz: 0.3, draw: screens.lock, state: { time: "1:04", notifs: [] } });
  const rings = ringSet(tbl, 7, C.alert, { y: 0.03, flat: true, tube: 0.018 });
  const wallRings = ringSet(tbl, 4, C.alert, { y: 0.9, tube: 0.012 });
  const motes = dust(90, [-5, 0.3, -3, 5, 4.2, 2.5], 52);
  g.add(motes);
  const tint = new THREE.PointLight(C.alert, 0, 6, 2);
  tint.position.set(0, 1.2, 0);
  tbl.add(tint);
  st.update = (t) => {
    motes.userData.update(t);
    const buzz = prog(t, 46.0, 46.0) * (1 - prog(t, 49.0, 49.0));
    const bz = t >= 46 && t < 49 ? 1 : 0;
    const on = mv(t, 45.7, 0.2) * (1 - mv(t, 49.0, 0.6));
    P.on(on, C.alert);
    P.update({ notifs: [{ t: "Study group", b: "3 missed calls", c: "#E26D4F", k: mv(t, 45.9, 0.3, E.back) }, { t: "Group chat", b: "47 new messages", c: "#E26D4F", k: mv(t, 46.6, 0.3, E.back) }] });
    P.group.position.x = bz * Math.sin(t * 190) * 0.025;
    P.group.rotation.z = 0.3 + bz * Math.sin(t * 150) * 0.05;
    rings.userData.play(t, 46.0, 0.42, 1.6, 6.0, 7, 0.8);
    wallRings.userData.play(t, 46.1, 0.6, 1.3, 1.4, 4, 0.6);
    tint.intensity = 3 * on * (0.6 + 0.4 * Math.sin(t * 18) ** 2);
    // the calm cracks: lamp dips, mat trembles
    const shake = bz * 0.006;
    mat.position.x = -0.6 + Math.sin(t * 160) * shake;
    L.set(1 - 0.45 * on);
    // remove the fight: the phone lifts and leaves the room
    const gone = mv(t, 53.9, 1.0, E.in);
    tbl.position.set(3.4 + gone * 4.5, gone * 0.6, -0.6);
    tbl.visible = gone < 0.999;
  };
  st.shots.push({ start: 38.96, end: 55.39, trans: 1, cam: [
    [38.96, [-0.2, 3.6, 7.6], [-0.3, 0.6, -1.4], 36],
    [45.5, [0.1, 3.0, 6.2], [0, 0.5, -1.2], 36],
    [46.3, [1.6, 2.2, 4.0], [1.6, 0.6, -0.9], 38, E.out4],
    [48.9, [1.8, 2.3, 4.4], [1.6, 0.6, -0.9], 38],
    [52.0, [0.4, 3.2, 6.6], [0.2, 0.5, -1.2], 37],
    [55.39, [-0.5, 2.4, 4.4], [-0.6, 0.2, -1.2], 34],
  ] });
  return st;
}

// ============================================================
// 4. THREE WORDS: Away. Silent. Replace. (55.39–61.79)
// ============================================================
function wordsStage(scene) {
  const st = makeStation(scene, { light: { pos: [2, 9, 7], target: [0, 0, 0], key: 0.6, hemi: 0.3, env: 0.25 } });
  const g = st.group;
  // studio cyc: floor that curves into a back wall
  const cycShape = new THREE.Shape();
  cycShape.moveTo(-20, 0);
  const cyc = new THREE.Mesh(new THREE.CylinderGeometry(6, 6, 40, 48, 1, true, PI, PI / 2), clay(C.e800, 0.95));
  cyc.material = new THREE.MeshStandardMaterial({ color: C.e800, roughness: 0.95, side: THREE.BackSide });
  cyc.rotation.z = PI / 2;
  cyc.position.set(0, 6, -2);
  cyc.receiveShadow = true;
  g.add(cyc);
  rbox(40, 0.2, 14, 0.02, clay(C.e800, 0.95), { y: -0.1, z: 3, parent: g });
  const plinths = [];
  const mk = (x, build, plinthFn) => {
    const pg = group(g, { x });
    plinthFn(pg);
    const obj = group(pg, { y: 0.5 });
    build(obj);
    const sp = new THREE.SpotLight(C.lamp, 0, 12, 0.42, 0.6, 1.5);
    sp.position.set(x * 0.4, 6, 3);
    sp.target = pg;
    sp.castShadow = false;
    g.add(sp);
    plinths.push({ g: pg, obj, sp });
  };
  // Away: a doorway on a square plinth
  mk(-3.3, (o) => { const d = door(o, { w: 0.9, h: 1.9, color: C.e600 }); o.userData.door = d; d.set(0.45); },
    (pg) => rbox(1.9, 0.5, 1.4, 0.05, clay(C.s300, 0.7), { y: 0.25, parent: pg }));
  // Silent: phone face-down under a crescent
  mk(0, (o) => {
    const p = phone(o, { y: 0.03, rx: PI / 2, draw: screens.off });
    const moon = group(o, { y: 1.5 });
    const cres = new THREE.Shape();
    cres.absarc(0, 0, 0.42, PI * 0.35, PI * 1.65, false);
    cres.absarc(0.2, 0, 0.34, PI * 1.58, PI * 0.42, true);
    mesh(new THREE.ExtrudeGeometry(cres, { depth: 0.1, bevelEnabled: true, bevelSize: 0.02, bevelThickness: 0.02, curveSegments: 36 }), own(C.s100, 0.4, 0, { emissive: C.lamp, emissiveIntensity: 0.6 }), { parent: moon });
    o.userData.moon = moon;
  }, (pg) => cyl(0.95, 1.0, 0.5, clay(C.s300, 0.7), { y: 0.25, parent: pg }));
  // Replace: a water drop on a hex plinth
  mk(3.3, (o) => {
    const R0 = 0.42, pts = [];
    for (let i = 0; i <= 12; i++) { const a = (i / 12) * (PI / 2); pts.push([Math.sin(a) * R0, -Math.cos(a) * R0]); }
    for (let i = 1; i <= 14; i++) { const y = (i / 14) * 0.95; pts.push([R0 * Math.pow(1 - y / 0.95, 1.5), y]); }
    const dropMat = new THREE.MeshPhysicalMaterial({ color: C.e300, roughness: 0.08, metalness: 0, clearcoat: 1, clearcoatRoughness: 0.1, emissive: C.e300, emissiveIntensity: 0.15 });
    const drop = lathe(pts, dropMat, { y: 0.9, parent: o });
    o.userData.drop = drop;
    const rip = ringSet(o, 3, C.e300, { y: 0.02, flat: true, tube: 0.012 });
    o.userData.rip = rip;
  }, (pg) => cyl(0.95, 0.95, 0.5, clay(C.s300, 0.7), { y: 0.25, parent: pg }, 6));
  const motes = dust(120, [-7, 0.2, -3, 7, 5, 4], 63, { opacity: 0.4 });
  g.add(motes);
  const hits = [57.87, 58.83, 59.79];
  st.update = (t) => {
    motes.userData.update(t);
    plinths.forEach((p, i) => {
      const k = mv(t, hits[i] - 0.25, 0.55, E.back);
      p.g.position.y = lerp(-1.4, 0, k);
      p.g.scale.setScalar(lerp(0.85, 1, k));
      p.sp.intensity = 60 * mv(t, hits[i] - 0.1, 0.3);
    });
    plinths[0].obj.userData.door.set(0.45 + 0.4 * mv(t, 58.0, 0.8) - 0.85 * mv(t, 60.6, 0.7, E.inOut));
    const moon = plinths[1].obj.userData.moon;
    moon.position.y = 1.5 + Math.sin(t * 1.4) * 0.05;
    moon.rotation.y = Math.sin(t * 0.6) * 0.4;
    const drop = plinths[2].obj.userData.drop;
    drop.position.y = 0.9 + Math.sin(t * 1.6) * 0.06;
    drop.rotation.y = t * 0.6;
    plinths[2].obj.userData.rip.userData.play(t, 59.9, 0.5, 1.4, 1.2, 3, 0.7);
  };
  st.shots.push({ start: 55.39, end: 61.79, trans: 2, cam: [
    [55.39, [0, 2.4, 11.5], [0, 1.0, 0], 34],
    [57.5, [0, 2.1, 10.0], [0, 1.0, 0], 34],
    [61.79, [0, 2.0, 8.6], [0, 1.1, 0], 34],
  ] });
  return st;
}

export function buildStations(scene, ctx) {
  const list = [hall(scene), poster(scene), prayerRoom(scene), wordsStage(scene)];
  return list.concat(moreStations(scene, ctx));
}
