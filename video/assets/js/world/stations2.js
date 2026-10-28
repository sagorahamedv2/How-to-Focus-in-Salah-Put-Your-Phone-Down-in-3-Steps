// Sets for scenes 06–14 (Away … checklist).
import * as THREE from "three";
import {
  C, CSS, E, clamp, lerp, prog, mv, pulse, rng, clay, own, glow, basic, mesh, rbox, box, cyl, sph, tor, group, lathe,
  canvasTex, halo, blob, dust, lamp, label, FONT,
} from "./kit.js";
import {
  room, phone, screens, shelf, prayerMat, door, desk, lockers, bookshelf, bubble, basin, bag,
  alarmClock, watch, fridge, checklistTexture, minaret,
} from "./props.js";
import { makeStation, plant, ringSet } from "./stations.js";

const PI = Math.PI;
const V = (x, y, z) => new THREE.Vector3(x, y, z);

// studio cyc: a floor that curves up into the back wall
function cyc(parent, color = C.e800, { z = -3, r = 6 } = {}) {
  const c = new THREE.Mesh(new THREE.CylinderGeometry(r, r, 60, 48, 1, true, PI, PI / 2), new THREE.MeshStandardMaterial({ color, roughness: 0.95, side: THREE.BackSide }));
  c.rotation.z = PI / 2;
  c.position.set(0, r, z + r);
  c.position.set(0, r, z);
  c.receiveShadow = true;
  parent.add(c);
  rbox(60, 0.2, 30, 0.02, clay(color, 0.95), { y: -0.1, z: z + 15, parent });
  rbox(60, 30, 0.2, 0.02, clay(color, 0.95), { y: r + 15, z: z - r, parent });
  return c;
}
function teardrop(mat, o) {
  const R0 = 0.42, pts = [];
  for (let i = 0; i <= 12; i++) { const a = (i / 12) * (PI / 2); pts.push([Math.sin(a) * R0, -Math.cos(a) * R0]); }
  for (let i = 1; i <= 14; i++) { const y = (i / 14) * 0.95; pts.push([R0 * Math.pow(1 - y / 0.95, 1.5), y]); }
  return lathe(pts, mat, o);
}
const waterMat = () => new THREE.MeshPhysicalMaterial({ color: C.e300, roughness: 0.06, clearcoat: 1, clearcoatRoughness: 0.05, emissive: C.e300, emissiveIntensity: 0.25, transparent: true, opacity: 0.92 });
// position along a quadratic arc from a to b with a lift
function arc(out, a, b, k, lift) { out.lerpVectors(a, b, k); out.y += Math.sin(k * PI) * lift; return out; }

// ============================================================
// 5. AWAY: two rooms, the phone leaves through the door (61.79–70.27)
// ============================================================
function away(scene) {
  const st = makeStation(scene, { light: { pos: [3, 10, 8], target: [0, 0, -1], key: 1.1, hemi: 0.5, env: 0.25 } });
  const g = st.group;
  const R = room(g, { w: 14, d: 7, h: 3.6, win: { x: -4.2, y: 1.0, w: 1.3, h: 2.0 }, seed: 61 });
  // partition wall between the rooms with a doorway (z from -3.5 to 3.5, gap at z∈[-1.4,-0.2])
  const wm = clay(C.e700, 0.92);
  rbox(0.22, 3.0, 2.1, 0.02, wm, { x: 0, y: 1.5, z: -2.45, parent: g });
  rbox(0.22, 3.0, 2.8, 0.02, wm, { x: 0, y: 1.5, z: 1.2, parent: g });
  rbox(0.22, 0.5, 1.2, 0.02, wm, { x: 0, y: 2.75, z: -0.8, parent: g });
  box(0.24, 0.06, 6.9, clay(C.s500, 0.6), { x: 0, y: 3.0, z: -0.05, parent: g });
  const D = door(g, { x: 0, z: -0.8, ry: PI / 2, w: 1.1, h: 2.5, color: C.e600 });
  const mat = prayerMat(g, { x: -3.2, z: 0.0, w: 1.4, l: 2.3, ry: 0.0 });
  const Lr = lamp(g, { x: -5.6, z: -2.4, h: 1.6, power: 9 });
  const Lb = lamp(g, { x: 5.6, z: -2.4, h: 1.6, power: 7 });
  const B = bag(g, { x: 3.3, z: -1.2, ry: -0.3, color: C.s700 });
  shelf(g, { x: 3.6, y: 1.5, z: -3.15, w: 2.0 });
  plant(g, { x: 1.2, z: -2.7, seed: 8 });
  const P = phone(g, { x: -3.0, y: 0.06, z: 0.3, rx: PI / 2, draw: screens.lock, state: { notifs: [{ t: "Group chat", b: "9 new", c: "#E26D4F", k: 1 }] } });
  const rings = ringSet(g, 4, C.e300, { x: -4.05, y: 2.6, z: -4.3, tube: 0.012 });
  const motes = dust(80, [-6, 0.3, -3, 6, 3.4, 2.5], 71);
  g.add(motes);
  const path = [V(-3.0, 0.06, 0.3), V(-1.6, 0.06, -0.6), V(-0.2, 0.06, -0.8), V(1.4, 0.06, -0.9), V(3.3, 0.7, -1.2)];
  const tmpV = V(0, 0, 0);
  st.update = (t) => {
    motes.userData.update(t);
    rings.userData.play(t, 62.2, 0.45, 1.8, 1.0, 4, 0.7);
    // lift off the mat and turn screen-down glow off
    const k1 = mv(t, 65.2, 1.4, E.inOut); // slide to the doorway and through
    const k2 = mv(t, 68.2, 0.9, E.inOut); // hop into the bag
    let p;
    if (k2 > 0) p = arc(tmpV, path[3], path[4], k2, 0.7);
    else {
      const seg = k1 * 3, i = Math.min(2, Math.floor(seg));
      p = tmpV.lerpVectors(path[i], path[i + 1], seg - i);
      p.y += Math.sin(k1 * PI) * 0.12;
    }
    P.group.position.copy(p);
    P.group.rotation.set(PI / 2, lerp(0, -0.6, k1) + k2 * 0.8, 0);
    P.group.scale.setScalar(1 - 0.55 * mv(t, 68.8, 0.3, E.in));
    P.group.visible = t < 69.1;
    P.on(0.25 * (1 - k1), C.alert);
    // the door closes behind it
    D.set(0.95 * (1 - mv(t, 66.7, 0.65, E.inOut)));
    B.scale.setScalar(1 + 0.06 * pulse(t, 69.0, 0.08, 0.02, 0.25));
    Lr.set(0.9 + 0.1 * Math.sin(t * 0.9));
  };
  st.shots.push({ start: 61.79, end: 70.27, trans: 3, cam: [
    [61.79, [-2.6, 4.8, 7.6], [-2.6, 0.6, -0.8], 38],
    [65.0, [-2.0, 5.0, 7.4], [-1.8, 0.5, -0.8], 38],
    [67.3, [0.6, 5.6, 8.0], [0.4, 0.5, -0.8], 40],
    [70.27, [2.4, 4.4, 6.4], [2.6, 0.6, -1.1], 38],
  ] });
  return st;
}

// ============================================================
// 6. OFFICE: drawer, then locker, then "stand up to get it" (70.27–84.35)
// ============================================================
function office(scene) {
  const st = makeStation(scene, { light: { pos: [-6, 9, 7], target: [0, 0, -1], key: 1.5, hemi: 0.6, env: 0.3, keyColor: 0xfff1d8 } });
  const g = st.group;
  room(g, { w: 18, d: 8, h: 4.6, win: { x: -2.2, y: 1.2, w: 1.6, h: 2.4 }, seed: 72, wall: C.e700 });
  const Dk = desk(g, { x: -2.0, z: -1.6 });
  // monitor
  const mon = group(g, { x: -2.4, y: 1.04, z: -2.0 });
  rbox(0.08, 0.36, 0.08, 0.02, clay(C.e950, 0.4), { y: 0.18, parent: mon });
  rbox(1.3, 0.78, 0.06, 0.03, clay(C.e950, 0.35, 0.3), { y: 0.72, parent: mon });
  mesh(new THREE.PlaneGeometry(1.2, 0.68), glow(C.e600, 0.9), { y: 0.72, z: 0.032, parent: mon, cast: false });
  rbox(0.6, 0.03, 0.22, 0.01, clay(C.s100, 0.6), { x: -2.4, y: 1.055, z: -1.4, parent: g });
  // chair
  const chair = group(g, { x: -2.1, z: -0.4, ry: 0.0 });
  cyl(0.05, 0.05, 0.5, clay(C.e950, 0.4, 0.5), { y: 0.3, parent: chair });
  for (let i = 0; i < 5; i++) { const a = (i / 5) * PI * 2; rbox(0.5, 0.04, 0.06, 0.02, clay(C.e950, 0.4, 0.5), { x: Math.cos(a) * 0.22, y: 0.06, z: Math.sin(a) * 0.22, ry: -a, parent: chair }); }
  rbox(0.75, 0.12, 0.7, 0.05, clay(C.e600, 0.8), { y: 0.6, parent: chair });
  rbox(0.72, 0.8, 0.1, 0.05, clay(C.e600, 0.8), { y: 1.05, z: 0.34, rx: -0.12, parent: chair });
  const Lk = lockers(g, { x: 5.0, z: -3.3, n: 4 });
  plant(g, { x: 1.8, z: -3.2, seed: 13, s: 1.2 });
  const P1 = phone(g, { x: -1.0, y: 1.065, z: -1.5, rx: -PI / 2, rz: 0.4, draw: screens.lock, state: { notifs: [{ t: "Team", b: "Quick question…", c: "#E3CFA6", k: 1 }] } });
  const P2 = phone(g, { x: 4.62, y: 1.4, z: -3.0, rx: -0.2, draw: screens.off });
  // footstep path from chair to lockers
  const steps = [];
  for (let i = 0; i < 9; i++) {
    const k = i / 8;
    const s = rbox(0.16, 0.012, 0.3, 0.06, own(C.s100, 0.6, 0, { transparent: true, opacity: 0 }), { x: lerp(-1.6, 4.1, k) + (i % 2 ? 0.15 : -0.15), y: 0.01, z: lerp(0.0, -2.0, k), ry: -0.35, parent: g, cast: false });
    steps.push(s);
  }
  const motes = dust(70, [-6, 0.3, -3.5, 7, 4, 2.5], 74);
  g.add(motes);
  const deskSpot = V(-1.0, 1.065, -1.5), inDrawer = V(-1.2, 0.86, -1.3);
  st.update = (t) => {
    motes.userData.update(t);
    // drawer opens, phone drops in, drawer closes
    Dk.set(mv(t, 70.4, 0.6) * (1 - mv(t, 72.0, 0.4, E.in)));
    const pk = mv(t, 70.95, 0.7, E.inOut);
    const into = V(-1.18, 0.8, -1.6 + Dk.drawer.position.z);
    if (t < 71.65) arc(P1.group.position, deskSpot, into, pk, 0.35); else P1.group.position.copy(into);
    P1.group.rotation.z = lerp(0.4, 0.0, pk);
    P1.on(0.8 * (1 - mv(t, 71.0, 0.5)), C.e300);
    // locker: phone slides in, door closes
    const lk = mv(t, 75.4, 0.6, E.inOut);
    Lk.set(0, 1 - mv(t, 76.4, 0.45, E.in));
    P2.group.position.set(4.62, 1.4, lerp(-1.6, -3.1, lk));
    P2.group.visible = t < 76.9 && t > 74.0;
    chair.rotation.y = Math.sin(t * 0.4) * 0.08 + 0.5 * mv(t, 80.5, 1.2, E.inOut);
    steps.forEach((s, i) => { s.material.opacity = 0.75 * mv(t, 81.1 + i * 0.12, 0.25); });
  };
  st.shots.push({ start: 70.27, end: 75.0, trans: 2, cam: [
    [70.27, [-0.6, 2.9, 1.8], [-1.3, 0.9, -1.6], 36],
    [75.0, [-0.9, 2.6, 2.0], [-1.4, 0.85, -1.5], 34],
  ] });
  st.shots.push({ start: 75.0, end: 80.6, trans: 0, cam: [
    [75.0, [3.6, 2.2, 1.6], [4.6, 1.4, -3.0], 36],
    [80.6, [3.3, 2.1, 1.2], [4.8, 1.3, -3.0], 34],
  ] });
  st.shots.push({ start: 80.6, end: 84.35, trans: 0, cam: [
    [80.6, [1.2, 6.5, 7.2], [1.2, 0.2, -1.4], 40],
    [84.35, [1.0, 6.0, 6.4], [1.2, 0.3, -1.4], 40],
  ] });
  return st;
}

// ============================================================
// 7. SILENT: the phone decides (84.35–99.15)
// ============================================================
function silent(scene) {
  const st = makeStation(scene, { light: { pos: [-4, 7, 8], target: [0, 1.5, 0], key: 1.2, hemi: 0.45, env: 0.35 } });
  const g = st.group;
  cyc(g, C.e800, { z: -3, r: 5 });
  const ped = cyl(1.3, 1.4, 0.4, clay(C.s300, 0.65), { y: 0.2, parent: g });
  const P = phone(g, { x: 0, y: 1.95, z: 0, s: 3.2, draw: screens.focus, state: { toggle: 0, ring: 0, allow: 0 } });
  const moonG = group(g, { x: 1.6, y: 3.6, z: -1.2 });
  const cres = new THREE.Shape();
  cres.absarc(0, 0, 0.42, PI * 0.35, PI * 1.65, false);
  cres.absarc(0.2, 0, 0.34, PI * 1.58, PI * 0.42, true);
  const moonMat = own(C.s100, 0.4, 0, { emissive: C.lamp, emissiveIntensity: 0 });
  mesh(new THREE.ExtrudeGeometry(cres, { depth: 0.1, bevelEnabled: true, bevelSize: 0.02, bevelThickness: 0.02, curveSegments: 36 }), moonMat, { parent: moonG });
  const moonHalo = halo(C.lamp, 2.2, 0, { parent: moonG });
  // a dome shield that lets family/emergency through and bounces the rest
  const shield = sph(2.1, new THREE.MeshPhysicalMaterial({ color: C.e300, transparent: true, opacity: 0, roughness: 0.2, depthWrite: false, side: THREE.DoubleSide, emissive: C.e300, emissiveIntensity: 0.3 }), { y: 1.9, cast: false, receive: false, parent: g });
  shield.scale.set(1.15, 1.25, 0.6);
  const incoming = [
    { lab: "Family", ok: true, from: V(-5.5, 3.6, 1.0), c: C.e300 },
    { lab: "Work", ok: false, from: V(5.5, 3.2, 0.8), c: C.s300 },
    { lab: "Emergency", ok: true, from: V(-5.0, 1.0, 1.4), c: C.e300 },
    { lab: "Group chat", ok: false, from: V(5.2, 0.9, 1.2), c: C.alert },
  ].map((it, i) => {
    const b = bubble(g, { w: 1.0, color: it.c, lines: 1 });
    const l = label(it.lab, { size: 64, height: 0.26, color: CSS.e950 });
    l.position.set(-0.05, 0.0, 0.08);
    l.material.depthTest = true;
    b.group.add(l);
    b.group.children.slice(1).forEach((m) => { if (m !== l) m.visible = false; });
    return { ...it, b, l, t0: 92.4 + i * 0.45 };
  });
  const tmpV = V(0, 0, 0);
  const motes = dust(90, [-6, 0.3, -2.5, 6, 5, 3], 81, { opacity: 0.45 });
  g.add(motes);
  st.update = (t) => {
    motes.userData.update(t);
    const tog = mv(t, 85.55, 0.25, E.out);
    P.update({ toggle: tog, ring: mv(t, 90.0, 1.6, E.inOut), allow: mv(t, 92.4, 1.6, (k) => k) });
    P.on(0.95, C.e300);
    P.group.position.y = 1.95 + Math.sin(t * 0.9) * 0.04;
    P.group.rotation.y = Math.sin(t * 0.35) * 0.12 - 0.1 + 0.25 * mv(t, 95.9, 2.5, E.inOut);
    moonMat.emissiveIntensity = 1.2 * mv(t, 85.6, 0.4);
    moonHalo.material.opacity = 0.5 * mv(t, 85.6, 0.4);
    moonG.position.y = 3.6 + Math.sin(t * 0.7) * 0.06;
    moonG.scale.setScalar(Math.max(0.001, mv(t, 85.5, 0.5, E.back)));
    shield.material.opacity = 0.035 * mv(t, 85.7, 0.6) + 0.05 * pulse(t, 92.4, 0.2, 1.6, 0.6);
    incoming.forEach((it) => {
      const k = mv(t, it.t0, 1.0, E.inOut);
      const target = it.ok ? V(0, 1.95 + (it.from.y > 2 ? 0.5 : -0.4), 0.3) : V(it.from.x * 0.42, it.from.y, 1.1);
      if (!it.ok) {
        // approach the shield, then fall back and grey out
        const k2 = mv(t, it.t0 + 1.0, 0.8, E.out);
        arc(tmpV, it.from, target, k, 0.2);
        tmpV.x += (it.from.x - target.x) * 0.25 * k2;
        tmpV.y -= 1.2 * k2;
        it.b.mat.color.setHex(C.grey);
        it.b.mat.color.lerpColors(new THREE.Color(it.c), new THREE.Color(C.grey), k2);
        it.b.group.scale.setScalar(Math.max(0.001, 1.15 * mv(t, it.t0 - 0.2, 0.3, E.back) * (1 - 0.3 * k2)));
      } else {
        arc(tmpV, it.from, target, k, 0.4);
        it.b.group.scale.setScalar(Math.max(0.001, 1.15 * mv(t, it.t0 - 0.2, 0.3, E.back) * (1 - mv(t, it.t0 + 1.0, 0.3, E.in))));
      }
      it.b.group.position.copy(tmpV);
      it.b.group.visible = t > it.t0 - 0.25;
    });
  };
  st.shots.push({ start: 84.35, end: 99.15, trans: 2, cam: [
    [84.35, [-1.4, 2.6, 7.4], [0, 2.0, 0], 34],
    [86.0, [-0.6, 2.3, 6.6], [0, 2.0, 0], 32],
    [89.6, [0.2, 2.2, 5.8], [0, 1.95, 0], 30],
    [91.9, [0.1, 2.2, 5.5], [0, 2.0, 0], 30],
    [92.7, [0.0, 2.6, 8.4], [0, 1.9, 0], 38],
    [99.15, [1.4, 2.5, 7.6], [0, 2.0, 0], 36],
  ] });
  return st;
}

// ============================================================
// 8. LIBRARY: the group chat can wait (99.15–104.75)
// ============================================================
function library(scene) {
  const st = makeStation(scene, { light: { pos: [4, 9, 7], target: [0, 0, -1], key: 0.9, hemi: 0.45, env: 0.25 } });
  const g = st.group;
  room(g, { w: 16, d: 7, h: 4.6, win: null, seed: 91, wall: C.e800 });
  bookshelf(g, { x: -3.0, z: -3.0, w: 2.6, seed: 5 });
  bookshelf(g, { x: 0.0, z: -3.0, w: 2.6, seed: 9 });
  bookshelf(g, { x: 3.0, z: -3.0, w: 2.6, seed: 15 });
  const tbl = group(g, { z: 0.0 });
  rbox(4.4, 0.1, 1.4, 0.03, clay(C.s500, 0.6), { y: 1.0, parent: tbl });
  for (const lx of [-2, 2]) rbox(0.1, 1.0, 1.1, 0.03, clay(C.s700, 0.7), { x: lx, y: 0.5, parent: tbl });
  // banker's lamp
  const bl = group(tbl, { x: -1.4, y: 1.05, z: -0.3 });
  cyl(0.16, 0.2, 0.05, clay(C.s500, 0.3, 0.7), { y: 0.025, parent: bl });
  cyl(0.02, 0.02, 0.4, clay(C.s500, 0.3, 0.7), { y: 0.22, parent: bl });
  mesh(new THREE.CylinderGeometry(0.12, 0.12, 0.6, 32, 1, true, 0, PI), own(C.e600, 0.4, 0.1, { side: THREE.DoubleSide, emissive: C.e300, emissiveIntensity: 0.2 }), { y: 0.46, rz: PI / 2, rx: PI / 2, parent: bl });
  const bLight = new THREE.PointLight(C.lamp, 5, 4, 2); bLight.position.set(0, 0.35, 0.1); bl.add(bLight);
  halo(C.lamp, 1.6, 0.3, { y: 0.3, z: 0.1, parent: bl });
  // open book and notebook
  rbox(0.9, 0.04, 0.6, 0.01, clay(C.s100, 0.8), { x: 0.2, y: 1.07, z: 0.1, ry: 0.1, parent: tbl });
  rbox(0.5, 0.05, 0.7, 0.01, clay(C.e600, 0.8), { x: 1.2, y: 1.075, z: -0.1, ry: -0.2, parent: tbl });
  const P = phone(tbl, { x: 0.9, y: 1.08, z: 0.35, rx: -PI / 2, rz: -0.3, draw: screens.chat, state: { count: 0 } });
  const bubbles = [0, 1, 2, 3, 4].map((i) => bubble(g, { w: 0.8 + ((i * 37) % 30) / 100, color: i % 3 === 1 ? C.e300 : C.s100, lines: 1 + (i % 2) }));
  const taps = [99.7, 100.3, 100.9, 101.5, 102.1];
  const motes = dust(80, [-6, 0.3, -3, 6, 4, 2.5], 93);
  g.add(motes);
  st.update = (t) => {
    motes.userData.update(t);
    const frozen = t > 103.1;
    const count = taps.filter((x) => t > x).length;
    P.update({ count: count * 9, frozen });
    P.on(0.85, frozen ? C.e300 : C.alert);
    const drop = mv(t, 103.15, 0.7, E.in);
    bubbles.forEach((b, i) => {
      const k = mv(t, taps[i], 0.3, E.back);
      const y = 1.6 + i * 0.5;
      b.group.position.set(0.9 + (i % 2 ? 0.35 : -0.35), lerp(y, 1.22 + i * 0.09, drop), 0.35 + (i % 2 ? -0.05 : 0.05));
      b.group.rotation.set(lerp(0, -PI / 2, drop), 0, lerp((i % 2 ? -0.08 : 0.08), (i - 2) * 0.3, drop));
      b.group.scale.setScalar(Math.max(0.001, k * 0.55));
      const gk = mv(t, 103.15, 0.4);
      b.mat.color.lerpColors(new THREE.Color(i % 3 === 1 ? C.e300 : C.s100), new THREE.Color(C.grey), gk);
    });
  };
  st.shots.push({ start: 99.15, end: 104.75, trans: 2, cam: [
    [99.15, [2.4, 3.0, 4.8], [0.7, 1.7, -0.3], 36],
    [102.6, [2.1, 3.1, 4.4], [0.8, 2.1, -0.2], 36],
    [104.75, [1.9, 2.9, 3.7], [0.8, 1.4, 0.0], 34],
  ] });
  return st;
}

// ============================================================
// 9. REPLACE: urge → wudu → breath (104.75–125.16)
// ============================================================
function replace(scene) {
  const st = makeStation(scene, { light: { pos: [-3, 9, 7], target: [0, 0, -1], key: 1.0, hemi: 0.5, env: 0.25 } });
  const g = st.group;
  room(g, { w: 18, d: 7.5, h: 4.8, win: { x: 3.0, y: 1.2, w: 1.5, h: 2.4 }, seed: 101 });
  const mat = prayerMat(g, { x: 1.6, z: -0.6, w: 1.5, l: 2.5 });
  const Bs = basin(g, { x: -3.6, z: -3.1 });
  const L = lamp(g, { x: -1.0, z: -2.8, h: 1.7, power: 9 });
  plant(g, { x: 5.2, z: -3.0, seed: 21, s: 1.1 });
  rbox(0.5, 0.02, 0.35, 0.01, clay(C.s100, 0.9), { x: -2.6, y: 0.92, z: -3.1, parent: g });
  // urge orb
  const orb = sph(0.12, glow(C.e300, 3.5), { cast: false, parent: g });
  const orbHalo = halo(C.e300, 1.4, 0, { parent: g });
  const orbLight = new THREE.PointLight(C.e300, 0, 3, 2); g.add(orbLight);
  // water
  const spout = V(-3.6, 1.29, -3.1);
  const stream = mesh(new THREE.CylinderGeometry(0.035, 0.05, 1, 16, 1, true), waterMat(), { cast: false, parent: g });
  stream.geometry.translate(0, -0.5, 0);
  stream.position.copy(spout);
  const drops = [];
  for (let i = 0; i < 10; i++) drops.push(sph(0.03, waterMat(), { cast: false, parent: g }, 12));
  const rip = ringSet(g, 6, C.e300, { x: -3.6, y: 0.95, z: -3.1, flat: true, tube: 0.008 });
  // breath ring above the mat
  const breath = group(g, { x: 1.6, y: 1.25, z: -0.6 });
  const ring = tor(0.6, 0.035, glow(C.e300, 2.2), { cast: false, parent: breath });
  const ring2 = tor(0.6, 0.012, basic(C.e300, { transparent: true, opacity: 0.5, toneMapped: false }), { cast: false, parent: breath });
  const bHalo = halo(C.e300, 2.6, 0, { parent: breath });
  const motes = dust(90, [-6, 0.3, -3, 6, 4, 2.5], 104);
  g.add(motes);
  const matSpot = V(1.6, 0.35, 0.1), basinSpot = V(-3.6, 1.15, -2.8);
  const tmpV = V(0, 0, 0);
  st.update = (t, cam) => {
    motes.userData.update(t);
    // urge appears where the phone usually lies, restless, then travels to the basin
    const appear = mv(t, 106.2, 0.6, E.back), go = mv(t, 111.6, 2.0, E.inOut), fade = mv(t, 113.8, 0.5);
    arc(tmpV, matSpot, basinSpot, go, 1.2);
    tmpV.x += (1 - go) * Math.sin(t * 7.3) * 0.05;
    tmpV.y += (1 - go) * Math.sin(t * 5.1 + 1) * 0.05;
    orb.position.copy(tmpV); orbHalo.position.copy(tmpV); orbLight.position.copy(tmpV);
    const ok = appear * (1 - fade);
    orb.scale.setScalar(Math.max(0.001, ok));
    orbHalo.material.opacity = 0.7 * ok;
    orbLight.intensity = 2.5 * ok;
    // wudu water, slowly
    const flow = mv(t, 113.6, 0.4) * (1 - mv(t, 118.5, 0.6));
    stream.scale.set(1, Math.max(0.001, 0.36 * mv(t, 113.6, 0.3)), 1);
    stream.material.opacity = 0.85 * flow;
    stream.visible = flow > 0.01;
    drops.forEach((d, i) => {
      const per = 0.55, ph = (t - 113.8 - i * per * 0.1) / per;
      const k = ph - Math.floor(ph);
      d.visible = flow > 0.05 && ph > 0;
      d.position.set(-3.6 + Math.sin(i * 2.1) * 0.05, 0.93 + 0.36 * (1 - k * k), -3.1 + Math.cos(i * 1.7) * 0.05);
    });
    rip.userData.play(t, 113.8, 0.7, 1.5, 0.45, 6, 0.8 * flow + 0.2);
    // breathe: inhale 1.5 s, exhale 1.5 s
    const bOn = mv(t, 115.1, 0.8);
    const cycle = 0.5 - 0.5 * Math.cos(((t - 115.1) / 3.0) * PI * 2);
    const s = Math.max(0.001, bOn * (0.75 + 0.45 * cycle));
    breath.scale.setScalar(s);
    breath.lookAt(cam.position);
    ring.material.emissiveIntensity = 1.2 + 1.6 * cycle;
    ring2.scale.setScalar(1 + 0.25 * cycle);
    ring2.material.opacity = 0.4 * bOn * (1 - cycle);
    bHalo.material.opacity = bOn * (0.2 + 0.25 * cycle);
    L.set(0.8 + 0.2 * bOn);
  };
  st.shots.push({ start: 104.75, end: 111.5, trans: 1, cam: [
    [104.75, [2.6, 2.4, 3.6], [1.6, 0.4, -0.5], 36],
    [111.5, [2.2, 2.2, 3.2], [1.4, 0.6, -0.6], 34],
  ] });
  st.shots.push({ start: 111.5, end: 115.0, trans: 0, cam: [
    [111.5, [0.0, 3.0, 4.6], [-1.2, 0.9, -1.6], 40],
    [113.3, [-2.4, 1.9, 0.0], [-3.6, 1.0, -3.0], 36],
    [115.0, [-2.5, 1.8, -0.4], [-3.6, 1.0, -3.0], 34],
  ] });
  st.shots.push({ start: 115.0, end: 125.16, trans: 2, cam: [
    [115.0, [1.6, 2.0, 4.2], [1.6, 1.0, -0.6], 36],
    [125.16, [1.6, 1.8, 3.4], [1.6, 1.05, -0.6], 34],
  ] });
  return st;
}

// ============================================================
// 10. DHUHR: one timeline, left to right (125.16–144.44)
// ============================================================
function dhuhr(scene) {
  const st = makeStation(scene, { light: { pos: [0, 12, 8], target: [0, 0, 0], key: 1.3, hemi: 0.55, env: 0.3 } });
  const g = st.group;
  cyc(g, C.e800, { z: -4, r: 6 });
  const X = [-6, -2, 2, 6];
  const track = rbox(14.6, 0.06, 0.5, 0.25, clay(C.e950, 0.8), { y: 0.03, parent: g });
  const fill = rbox(14.6, 0.08, 0.36, 0.18, glow(C.e300, 1.6), { y: 0.05, cast: false, parent: g });
  fill.geometry.translate(7.3, 0, 0);
  fill.position.x = -7.3;
  const items = [];
  const mk = (x, build) => {
    const pg = group(g, { x });
    const dot = cyl(0.36, 0.36, 0.12, own(C.s300, 0.6, 0, { emissive: C.e300, emissiveIntensity: 0 }), { y: 0.08, parent: pg });
    const obj = group(pg, { y: 0.15, z: -0.9 });
    build(obj);
    items.push({ pg, obj, dot });
  };
  mk(X[0], (o) => bag(o, { s: 1, ry: 0.3, color: C.s700 }));
  mk(X[1], (o) => {
    minaret(o, clay(C.s300, 0.6), { parent: o, s: 1 }, 2.2);
    const moonG = group(o, { x: 0.8, y: 1.6, z: 0.3 });
    const cres = new THREE.Shape();
    cres.absarc(0, 0, 0.3, PI * 0.35, PI * 1.65, false);
    cres.absarc(0.14, 0, 0.24, PI * 1.58, PI * 0.42, true);
    mesh(new THREE.ExtrudeGeometry(cres, { depth: 0.06, bevelEnabled: true, bevelSize: 0.015, bevelThickness: 0.015 }), own(C.s100, 0.4, 0, { emissive: C.lamp, emissiveIntensity: 0.9 }), { parent: moonG });
    o.userData.rings = ringSet(o, 3, C.e300, { y: 2.0, tube: 0.012 });
  });
  mk(X[2], (o) => {
    const d = teardrop(waterMat(), { y: 0.95, s: 1.2, parent: o });
    o.userData.drop = d;
    cyl(0.6, 0.5, 0.18, clay(C.s100, 0.25), { y: 0.09, parent: o });
  });
  mk(X[3], (o) => prayerMat(o, { w: 1.1, l: 1.8, z: 0.2 }));
  const times = ["12:59", "1:04", "1:06", "1:10"], words = ["Phone in the bag", "Focus mode on", "Wudu, slowly", "Pray"];
  const labs = X.map((x, i) => {
    const t1 = label(times[i], { size: 64, weight: 600, height: 0.42, color: CSS.s100, bg: "rgba(6,33,28,0.85)", pad: 26 });
    t1.position.set(x, 0.32, 0.95); t1.rotation.x = -0.9; g.add(t1);
    const t2 = label(words[i], { size: 56, weight: 600, height: 0.36, color: CSS.e950, bg: CSS.s100, pad: 26 });
    t2.position.set(x, 2.8, -0.6); g.add(t2);
    return [t1, t2];
  });
  const hits = [131.32, 134.6, 137.72, 139.72];
  const motes = dust(110, [-9, 0.3, -3.5, 9, 5, 3], 125, { opacity: 0.4 });
  g.add(motes);
  st.update = (t) => {
    motes.userData.update(t);
    // the line grows dot to dot
    const segs = [[127.8, 0, 0.07], [131.0, 0.07, 0.36], [134.3, 0.36, 0.64], [137.4, 0.64, 0.93], [139.5, 0.93, 1.0]];
    let f = 0;
    segs.forEach(([a, f0, f1]) => { if (t > a) f = lerp(f0, f1, mv(t, a, 0.6, E.inOut)); });
    fill.scale.x = Math.max(0.001, f);
    items.forEach((it, i) => {
      const k = mv(t, 125.6 + i * 0.35, 0.55, E.back);
      it.obj.scale.setScalar(Math.max(0.001, k * (0.8 + 0.2 * mv(t, hits[i] - 0.3, 0.5, E.back)) + 0.12 * pulse(t, hits[i] - 0.3, 0.2, 0.0, 0.4)));
      it.dot.material.emissiveIntensity = 1.4 * mv(t, hits[i] - 0.2, 0.3);
      labs[i][0].material.opacity = mv(t, 127.5 + i * 0.25, 0.4);
      labs[i][1].material.opacity = mv(t, hits[i], 0.35);
      labs[i][1].position.y = 2.8 + 0.15 * (1 - mv(t, hits[i], 0.35));
    });
    items[1].obj.userData.rings.userData.play(t, 134.6, 0.45, 1.6, 1.0, 3, 0.6);
    items[2].obj.userData.drop.rotation.y = t * 0.6;
    items[2].obj.userData.drop.position.y = 0.95 + Math.sin(t * 1.6) * 0.05;
  };
  st.shots.push({ start: 125.16, end: 144.44, trans: 2, cam: [
    [125.16, [0, 5.2, 12.0], [0, 1.0, -0.5], 36],
    [129.6, [-3.5, 4.2, 9.0], [-4.2, 0.9, -0.5], 36],
    [131.6, [-5.0, 2.8, 5.4], [-6.0, 1.0, -0.6], 36],
    [134.9, [-1.0, 2.9, 5.6], [-2.0, 1.4, -0.6], 36],
    [137.9, [3.0, 2.8, 5.4], [2.0, 1.0, -0.6], 36],
    [140.0, [7.0, 3.0, 5.8], [6.0, 1.3, -0.6], 36],
    [142.4, [0, 8.5, 12.5], [0, 0.6, -0.8], 40],
    [144.44, [0, 9.0, 12.0], [0, 0.5, -0.8], 40],
  ] });
  return st;
}

// ============================================================
// 11. OBJECTION: move the prayer-times job elsewhere (144.44–161.48)
// ============================================================
function objection(scene) {
  const st = makeStation(scene, { light: { pos: [-3, 9, 8], target: [0, 1, 0], key: 1.3, hemi: 0.5, env: 0.3 } });
  const g = st.group;
  cyc(g, C.e800, { z: -3.5, r: 5 });
  const ped = cyl(0.9, 1.0, 0.9, clay(C.s300, 0.65), { y: 0.45, parent: g });
  const P = phone(g, { y: 2.2, s: 2.2, draw: screens.times, state: {} });
  const A = group(g, { x: -3.6 });
  cyl(0.7, 0.8, 0.6, clay(C.s300, 0.65), { y: 0.3, parent: A });
  alarmClock(A, { y: 0.6, ry: 0.35 });
  const Wt = group(g, { x: 0.0 });
  const wobj = watch(Wt, { y: 1.68, ry: 0 });
  const F = fridge(g, { x: 3.8, z: -0.6, ry: -0.3 });
  const motes = dust(90, [-6, 0.3, -3, 6, 5, 3], 141, { opacity: 0.4 });
  g.add(motes);
  st.update = (t) => {
    motes.userData.update(t);
    // the phone shows prayer times, then steps aside
    const out = mv(t, 150.3, 0.8, E.inOut), back = mv(t, 155.7, 0.9, E.inOut), leave = mv(t, 157.8, 1.4, E.inOut);
    const k = out * (1 - back);
    P.group.position.set(lerp(0, 0, k), lerp(2.2, -1.0, k) + Math.sin(t) * 0.04 * (1 - k), lerp(0, -0.5, k));
    // after "silence it": it lies face-down, screen dark, and we walk away from it
    const fd = back;
    P.group.rotation.set(lerp(0, PI / 2, fd), Math.sin(t * 0.4) * 0.1 * (1 - fd), 0);
    P.group.position.y = fd > 0 ? lerp(-1.0, 0.95, fd) : P.group.position.y;
    P.on((1 - mv(t, 155.8, 0.5)) * 0.95, C.e300);
    ped.position.y = 0.45;
    const rise = (a) => mv(t, a, 0.7, E.back);
    A.position.y = lerp(-2, 0, rise(150.6));
    Wt.position.y = lerp(-3, 0, rise(151.3)) - 3.2 * mv(t, 155.5, 0.5, E.in);
    Wt.visible = t > 150.9 && t < 156.1;
    wobj.rotation.y = Math.sin(t * 0.5) * 0.3;
    F.group.position.y = lerp(-4, 0, rise(152.0));
    F.paper.position.y = 1.45 + lerp(1.4, 0, mv(t, 153.0, 0.35, E.in));
    F.paper.rotation.z = lerp(0.3, 0, mv(t, 153.0, 0.45, E.out));
    F.magnet.scale.setScalar(Math.max(0.001, mv(t, 153.3, 0.2, E.back)));
  };
  st.shots.push({ start: 144.44, end: 150.2, trans: 2, cam: [
    [144.44, [0.4, 2.8, 7.2], [0, 2.1, 0], 34],
    [150.2, [0.2, 2.4, 5.8], [0, 2.2, 0], 32],
  ] });
  st.shots.push({ start: 150.2, end: 155.6, trans: 0, cam: [
    [150.2, [0, 3.4, 11.0], [0, 1.4, -0.4], 38],
    [153.0, [1.6, 2.7, 6.6], [2.8, 1.8, -0.6], 36],
    [155.6, [0.4, 3.2, 10.4], [0, 1.4, -0.4], 38],
  ] });
  st.shots.push({ start: 155.6, end: 161.48, trans: 0, cam: [
    [155.6, [0.5, 2.6, 3.6], [0, 1.0, 0], 34],
    [157.8, [0.4, 2.5, 3.8], [0, 1.0, 0], 34],
    [161.48, [0.2, 3.6, 10.5], [0, 1.0, 0], 38, E.inOut],
  ] });
  return st;
}

// ============================================================
// 12. START SMALL: five prayer lamps, one lit, the path clears (161.48–176.25)
// ============================================================
function lamps(scene) {
  const st = makeStation(scene, { light: { pos: [2, 10, 8], target: [0, 0, 0], key: 0.5, hemi: 0.3, env: 0.2 } });
  const g = st.group;
  cyc(g, C.e900, { z: -3.5, r: 5 });
  const names = ["Fajr", "Dhuhr", "Asr", "Maghrib", "Isha"];
  const Ls = names.map((n, i) => {
    const x = (i - 2) * 2.2;
    const L = lamp(g, { x, z: -1.4, h: 1.6, power: 14, dist: 8 });
    L.set(0.08);
    const lab = label(n, { size: 56, weight: 600, height: 0.3, color: CSS.s100 });
    lab.position.set(x, 0.02, -0.72); lab.rotation.x = -PI / 2; g.add(lab);
    return { L, lab };
  });
  // path of tiles from the front to the Dhuhr lamp, with clutter
  const tiles = [], clutter = [];
  const r = rng(167);
  for (let i = 0; i < 6; i++) {
    const z = 4.6 - i * 0.8;
    const tile = rbox(0.9, 0.06, 0.6, 0.06, own(C.s300, 0.7, 0, { emissive: C.lamp, emissiveIntensity: 0 }), { x: -2.2 + Math.sin(i * 0.6) * 0.15, y: 0.03, z, parent: g });
    tiles.push(tile);
    if (i % 2 === 0) {
      const c = rbox(0.38 + r() * 0.2, 0.06, 0.7, 0.05, clay(C.e950, 0.35, 0.5), { x: -2.2 + (r() - 0.5) * 0.3, y: 0.12, z: z + 0.05, ry: r() - 0.5, parent: g });
      clutter.push(c);
    }
  }
  prayerMat(g, { x: -2.2, z: 0.15, w: 1.1, l: 0.9 });
  const motes = dust(80, [-6, 0.3, -2.5, 6, 4, 5], 171, { opacity: 0.35 });
  g.add(motes);
  st.update = (t) => {
    motes.userData.update(t);
    const lit = mv(t, 164.4, 0.6);
    Ls.forEach((o, i) => {
      if (i === 1) o.L.set(0.08 + 0.92 * lit + 0.15 * pulse(t, 172.4, 0.4, 0.4, 1.2));
      else o.L.set(0.08 + 0.12 * mv(t, 161.6 + i * 0.12, 0.4) * (1 - 0.5 * lit));
      o.lab.material.opacity = i === 1 ? 1 : 1 - 0.55 * lit;
    });
    clutter.forEach((c, i) => {
      const k = mv(t, 174.3 + i * 0.18, 0.5, E.in);
      c.position.y = 0.12 - 0.4 * k;
      c.visible = k < 1;
    });
    tiles.forEach((tl, i) => { tl.material.emissiveIntensity = 0.5 * mv(t, 174.6 + i * 0.14, 0.3); });
  };
  st.shots.push({ start: 161.48, end: 172.3, trans: 2, cam: [
    [161.48, [0, 2.4, 8.5], [0, 1.2, -1.4], 38],
    [164.0, [-1.4, 2.1, 5.4], [-2.2, 1.4, -1.4], 34],
    [172.3, [-1.8, 2.2, 4.8], [-2.2, 1.3, -1.4], 33],
  ] });
  st.shots.push({ start: 172.3, end: 176.25, trans: 0, cam: [
    [172.3, [-2.2, 3.6, 8.2], [-2.2, 0.6, -0.4], 38],
    [176.25, [-2.2, 4.4, 9.6], [-2.2, 0.5, -0.2], 38],
  ] });
  return st;
}

// ============================================================
// 13. CHECKLIST card on the desk (176.25–180.89)
// ============================================================
function checklist(scene) {
  const st = makeStation(scene, { light: { pos: [-3, 8, 5], target: [0, 0, 0], key: 1.5, hemi: 0.55, env: 0.3 } });
  const g = st.group;
  rbox(9, 0.3, 6, 0.04, clay(C.s500, 0.55), { y: -0.15, parent: g });
  for (let i = 0; i < 8; i++) box(9, 0.002, 0.01, clay(C.s700, 0.7), { y: 0.001, z: -3 + i * 0.75, parent: g, cast: false });
  const tex = checklistTexture([0, 0, 0]);
  const card = group(g);
  const cardMat = new THREE.MeshStandardMaterial({ map: tex.tex, roughness: 0.85 });
  rbox(1.8, 0.02, 2.24, 0.01, clay(0xfbf5e8, 0.85), { parent: card });
  mesh(new THREE.PlaneGeometry(1.8, 2.24), cardMat, { rx: -PI / 2, y: 0.012, parent: card, cast: false });
  // pen and cup for life
  const pen = group(g, { x: 1.4, y: 0.04, z: 0.4, ry: 0.5 });
  cyl(0.03, 0.03, 1.0, clay(C.e600, 0.4), { rz: PI / 2, parent: pen });
  lathe([[0, 0], [0.26, 0], [0.3, 0.55], [0.27, 0.55], [0.23, 0.04], [0, 0.04]], clay(C.s100, 0.35), { x: -3.4, z: -1.6, parent: g });
  const L = lamp(g, { x: -2.6, z: -2.2, h: 1.6, power: 6 });
  let last = -1;
  st.update = (t) => {
    const k = mv(t, 176.3, 0.9, E.out);
    card.position.set(lerp(-3.5, 0, k), lerp(0.4, 0.02, k), lerp(-0.8, 0, k));
    card.rotation.y = lerp(-0.6, -0.05, k);
    const ticks = [mv(t, 177.4, 0.35), mv(t, 177.95, 0.35), mv(t, 178.5, 0.35)];
    const sig = ticks.map((x) => Math.round(x * 20)).join(",");
    if (sig !== last) { tex.redraw(ticks); last = sig; }
  };
  st.shots.push({ start: 176.25, end: 180.89, trans: 2, cam: [
    [176.25, [-0.9, 3.6, 2.2], [-0.7, 0, -0.1], 36],
    [180.89, [-0.9, 3.2, 1.8], [-0.7, 0, -0.1], 34],
  ] });
  return st;
}

export function moreStations(scene) {
  return [away(scene), office(scene), silent(scene), library(scene), replace(scene), dhuhr(scene), objection(scene), lamps(scene), checklist(scene)];
}
