// Props for the 3D world. Each builder adds to `parent` and returns handles to animate.
import * as THREE from "three";
import {
  C, CSS, FONT, clay, own, glow, basic, mesh, rbox, box, cyl, sph, tor, group, lathe,
  archFrame, wallWithArch, canvasTex, rr, rng, halo, blob, clamp, lerp,
} from "./kit.js";

// ---------- night sky (seen through windows, and as the poster void) ----------
export function skyTexture(seed = 7, { moon = true, glowY = 0.82 } = {}) {
  const r = rng(seed);
  return canvasTex(1024, 1024, (ctx, w, h) => {
    const g = ctx.createLinearGradient(0, 0, 0, h);
    g.addColorStop(0, "#041814");
    g.addColorStop(0.55, "#0A3A31");
    g.addColorStop(glowY, "#1A6B57");
    g.addColorStop(1, "#2C7F67");
    ctx.fillStyle = g; ctx.fillRect(0, 0, w, h);
    for (let i = 0; i < 220; i++) {
      const x = r() * w, y = r() * h * 0.7, s = r() * 1.8 + 0.4;
      ctx.globalAlpha = 0.25 + r() * 0.7;
      ctx.fillStyle = "#F4EAD5";
      ctx.beginPath(); ctx.arc(x, y, s, 0, 6.283); ctx.fill();
    }
    ctx.globalAlpha = 1;
    if (moon) {
      const mx = w * 0.7, my = h * 0.2, mr = 54;
      const mg = ctx.createRadialGradient(mx, my, mr * 0.5, mx, my, mr * 4);
      mg.addColorStop(0, "rgba(255,217,138,0.35)"); mg.addColorStop(1, "rgba(255,217,138,0)");
      ctx.fillStyle = mg; ctx.fillRect(0, 0, w, h);
      ctx.fillStyle = "#F4EAD5";
      ctx.beginPath(); ctx.arc(mx, my, mr, 0, 6.283); ctx.fill();
      ctx.globalCompositeOperation = "destination-out";
      ctx.beginPath(); ctx.arc(mx + 24, my - 14, mr * 0.9, 0, 6.283); ctx.fill();
      ctx.globalCompositeOperation = "source-over";
    }
  });
}

// minaret as a lathe silhouette (profile radius, height)
export function minaret(parent, mat, o = {}, H = 3) {
  const k = H / 3;
  const pts = [
    [0.0, 3.0], [0.02, 2.98], [0.05, 2.86], [0.12, 2.7], [0.14, 2.6], [0.14, 2.52], [0.2, 2.5], [0.2, 2.44],
    [0.12, 2.42], [0.12, 1.9], [0.22, 1.86], [0.22, 1.8], [0.13, 1.78], [0.15, 0.6], [0.28, 0.56], [0.28, 0.0], [0.0, 0.0],
  ].map(([a, b]) => [a * k, b * k]);
  const lpts = pts.slice().reverse();
  return lathe(lpts, mat, o, 32);
}
export function mosque(parent, mat, { x = 0, y = 0, z = 0, s = 1 } = {}) {
  const g = group(parent, { x, y, z });
  g.scale.setScalar(s);
  box(3.2, 1.2, 1.4, mat, { y: 0.6, parent: g, cast: false });
  sph(0.95, mat, { y: 1.2, parent: g, cast: false });
  cyl(0.04, 0.04, 0.5, mat, { y: 2.35, parent: g, cast: false });
  sph(0.45, mat, { x: -1.15, y: 1.2, parent: g, cast: false });
  sph(0.45, mat, { x: 1.15, y: 1.2, parent: g, cast: false });
  minaret(g, mat, { x: -2.1, parent: g, cast: false }, 3.4);
  minaret(g, mat, { x: 2.1, parent: g, cast: false }, 3.4);
  return g;
}

// ---------- room: floor, back wall with an arched window, left wall ----------
export function room(parent, { w = 10, d = 7, h = 4.4, wall = C.e800, floor = 0xc4a679, win = { x: -2.6, y: 1.3, w: 1.5, h: 2.3 }, left = true, seed = 3, skyMoon = true } = {}) {
  const g = group(parent);
  const wallMat = clay(wall, 0.92);
  rbox(w, 0.24, d, 0.03, clay(floor, 0.75), { y: -0.12, parent: g });
  // floor boards: subtle lines
  for (let i = 1; i < 8; i++) box(w - 0.02, 0.002, 0.012, clay(C.s500, 0.8), { y: 0.001, z: -d / 2 + (d / 8) * i, parent: g, cast: false });
  const out = { group: g, w, d, h };
  if (win) {
    wallWithArch(w, h, 0.24, win, wallMat, { z: -d / 2, parent: g });
    archFrame(win.w, win.h, 0.12, 0.34, clay(C.s300, 0.7), { x: win.x, y: win.y, z: -d / 2 + 0.02, parent: g });
    rbox(win.w + 0.5, 0.09, 0.42, 0.03, clay(C.s300, 0.7), { x: win.x, y: win.y - 0.04, z: -d / 2 + 0.16, parent: g });
    const sky = skyTexture(seed, { moon: skyMoon });
    const skyPlane = mesh(new THREE.PlaneGeometry(win.w * 3.2, win.h * 2.2), basic(0xffffff, { map: sky.tex }), { x: win.x, y: win.y + win.h * 0.55, z: -d / 2 - 1.4, cast: false, receive: false, parent: g });
    const silMat = basic(0x05201a);
    const mn = minaret(g, silMat, { x: win.x + 0.15, y: win.y - 0.6, z: -d / 2 - 0.9, cast: false, receive: false }, 2.2);
    g.add(mn);
    mesh(new THREE.SphereGeometry(0.55, 32, 16, 0, Math.PI * 2, 0, Math.PI / 2), silMat, { x: win.x - 0.75, y: win.y - 0.1, z: -d / 2 - 1.1, cast: false, receive: false, parent: g });
    // moonlight spilling in
    const spill = halo(C.e300, win.w * 2.6, 0.12, { x: win.x, y: win.y + win.h * 0.5, z: -d / 2 + 0.3, parent: g });
    Object.assign(out, { sky: skyPlane, minaret: mn, spill });
  } else {
    rbox(w, h, 0.24, 0.02, wallMat, { y: h / 2, z: -d / 2, parent: g });
  }
  if (left) rbox(0.24, h, d, 0.02, wallMat, { x: -w / 2, y: h / 2, parent: g });
  // wainscot: darker lower wall with a sand rail
  box(w - 0.3, 1.05, 0.03, clay(C.e900, 0.9), { y: 0.55, z: -d / 2 + 0.135, parent: g, cast: false });
  rbox(w - 0.3, 0.06, 0.07, 0.02, clay(C.s500, 0.6), { y: 1.08, z: -d / 2 + 0.15, parent: g });
  if (left) {
    box(0.03, 1.05, d - 0.3, clay(C.e900, 0.9), { x: -w / 2 + 0.135, y: 0.55, parent: g, cast: false });
    rbox(0.07, 0.06, d - 0.3, 0.02, clay(C.s500, 0.6), { x: -w / 2 + 0.15, y: 1.08, parent: g });
  }
  // baseboards
  box(w, 0.14, 0.04, clay(C.e950, 0.8), { y: 0.07, z: -d / 2 + 0.14, parent: g });
  if (left) box(0.04, 0.14, d, clay(C.e950, 0.8), { x: -w / 2 + 0.14, y: 0.07, parent: g });
  return out;
}

// ---------- phone with a live canvas screen ----------
export function phone(parent, { x = 0, y = 0, z = 0, rx = 0, ry = 0, rz = 0, s = 1, draw, state = {} } = {}) {
  const g = group(parent, { x, y, z, rx, ry, rz });
  g.scale.setScalar(s);
  const W = 0.38, H = 0.78, D = 0.045;
  rbox(W, H, D, 0.055, clay(0x10241f, 0.32, 0.55), { parent: g });
  rbox(W - 0.018, H - 0.018, D + 0.004, 0.05, clay(0x050c0a, 0.2, 0.1), { parent: g, cast: false });
  rbox(0.12, 0.12, 0.02, 0.03, clay(0x0d1d19, 0.3, 0.5), { x: -0.09, y: 0.27, z: -D / 2 - 0.006, parent: g });
  const scr = canvasTex(540, 1120, (ctx, w, h) => {
    ctx.save();
    rr(ctx, 0, 0, w, h, 64); ctx.clip();
    (draw || screens.off)(ctx, w, h, state);
    ctx.restore();
  });
  const smat = new THREE.MeshBasicMaterial({ map: scr.tex, transparent: true, toneMapped: true });
  const screen = mesh(new THREE.PlaneGeometry(W - 0.03, H - 0.03), smat, { z: D / 2 + 0.004, cast: false, receive: false, parent: g });
  const light = new THREE.PointLight(C.lamp, 0, 2.2, 2);
  light.position.set(0, 0, 0.35);
  g.add(light);
  const api = {
    group: g, screen, state, mat: smat,
    setDraw(fn) { draw = fn; },
    // k: screen brightness 0..1 (also lights the surroundings)
    on(k, tint = C.e300) { smat.color.setScalar(0.06 + 0.94 * k); light.intensity = 1.4 * k; light.color.setHex(tint); },
    update(st) { Object.assign(state, st); scr.redraw(); },
  };
  api.on(0);
  return api;
}

const ink = (ctx, c) => { ctx.fillStyle = c; ctx.strokeStyle = c; };
function txt(ctx, s, x, y, size, weight = 600, color = CSS.s100, align = "left", font = FONT.sans) {
  ctx.font = `${weight} ${size}px ${font}`; ctx.fillStyle = color; ctx.textAlign = align; ctx.textBaseline = "alphabetic"; ctx.fillText(s, x, y);
}
function screenBg(ctx, w, h, a = "#0E4A3D", b = "#06211C") {
  const g = ctx.createLinearGradient(0, 0, w * 0.4, h);
  g.addColorStop(0, a); g.addColorStop(1, b);
  ctx.fillStyle = g; ctx.fillRect(0, 0, w, h);
}
// screen drawings, each a function of a small state object
export const screens = {
  off(ctx, w, h) { ctx.fillStyle = "#030807"; ctx.fillRect(0, 0, w, h); },
  lock(ctx, w, h, s) {
    screenBg(ctx, w, h);
    txt(ctx, s.time || "1:04", w / 2, 250, 150, 600, CSS.s100, "center");
    txt(ctx, s.date || "Friday", w / 2, 320, 36, 400, "rgba(244,234,213,0.7)", "center");
    const n = s.notifs || [];
    n.forEach((it, i) => {
      const k = clamp(it.k ?? 1);
      if (k <= 0) return;
      const y = 420 + i * 150 + (1 - k) * 40;
      ctx.globalAlpha = k;
      ink(ctx, "rgba(244,234,213,0.14)"); rr(ctx, 34, y, w - 68, 128, 30); ctx.fill();
      ink(ctx, it.c || CSS.alert); ctx.beginPath(); ctx.arc(88, y + 64, 26, 0, 6.283); ctx.fill();
      txt(ctx, it.t, 136, y + 54, 32, 600);
      txt(ctx, it.b || "", 136, y + 98, 28, 400, "rgba(244,234,213,0.75)");
      ctx.globalAlpha = 1;
    });
  },
  focus(ctx, w, h, s) {
    screenBg(ctx, w, h, "#0B3D33", "#041814");
    txt(ctx, "Focus", 48, 130, 64, 600);
    // DND row with toggle
    ink(ctx, "rgba(244,234,213,0.1)"); rr(ctx, 32, 180, w - 64, 120, 30); ctx.fill();
    ink(ctx, CSS.e300); ctx.beginPath(); ctx.arc(96, 240, 30, 0, 6.283); ctx.fill();
    ink(ctx, "#0B3D33"); ctx.beginPath(); ctx.arc(108, 230, 26, 0, 6.283); ctx.fill();
    txt(ctx, "Do Not Disturb", 150, 252, 34, 600);
    const k = clamp(s.toggle || 0);
    ink(ctx, k > 0.5 ? CSS.e300 : "rgba(244,234,213,0.25)"); rr(ctx, w - 150, 216, 104, 56, 28); ctx.fill();
    ink(ctx, CSS.s100); ctx.beginPath(); ctx.arc(w - 122 + 48 * k, 244, 22, 0, 6.283); ctx.fill();
    // ring around prayer time
    const cx = w / 2, cy = 520, R = 150, ring = clamp(s.ring || 0);
    ctx.lineWidth = 22; ctx.lineCap = "round";
    ink(ctx, "rgba(244,234,213,0.12)"); ctx.beginPath(); ctx.arc(cx, cy, R, 0, 6.283); ctx.stroke();
    ink(ctx, CSS.e300); ctx.beginPath(); ctx.arc(cx, cy, R, -Math.PI / 2, -Math.PI / 2 + 6.283 * ring); ctx.stroke();
    txt(ctx, `${Math.round(15 * ring)}`, cx, cy + 30, 110, 600, CSS.s100, "center");
    txt(ctx, "min", cx, cy + 80, 34, 400, "rgba(244,234,213,0.7)", "center");
    txt(ctx, "Around each prayer", cx, cy + R + 70, 30, 400, "rgba(244,234,213,0.7)", "center");
    // allowed list
    const rows = [["Family", true], ["Emergency", true], ["Work", false], ["Group chat", false]];
    const a = clamp(s.allow || 0);
    rows.forEach(([n, ok], i) => {
      const kk = clamp(a * 4 - i);
      if (kk <= 0) return;
      const y = 820 + i * 70;
      ctx.globalAlpha = kk * (ok ? 1 : 0.4);
      ink(ctx, ok ? CSS.e300 : "rgba(244,234,213,0.5)");
      ctx.beginPath(); ctx.arc(70, y - 12, 14, 0, 6.283); ctx.fill();
      txt(ctx, n, 104, y, 32, ok ? 600 : 400, ok ? CSS.s100 : "rgba(244,234,213,0.8)");
      txt(ctx, ok ? "Allowed" : "Silenced", w - 48, y, 28, 400, ok ? CSS.e300 : "rgba(244,234,213,0.6)", "right");
      ctx.globalAlpha = 1;
    });
  },
  chat(ctx, w, h, s) {
    screenBg(ctx, w, h, "#0B3D33", "#06211C");
    txt(ctx, "Study group", 48, 120, 44, 600);
    txt(ctx, `${s.count || 0} new`, w - 48, 120, 30, 400, s.frozen ? CSS.s300 : CSS.alert, "right");
    for (let i = 0; i < (s.count || 0) && i < 6; i++) {
      const me = i % 3 === 1, y = 180 + i * 140, bw = 260 + ((i * 53) % 120);
      ink(ctx, s.frozen ? "rgba(91,107,102,0.8)" : me ? CSS.e300 : "rgba(244,234,213,0.18)");
      rr(ctx, me ? w - 40 - bw : 40, y, bw, 100, 34); ctx.fill();
    }
    if (s.frozen) {
      ink(ctx, "rgba(6,33,28,0.6)"); ctx.fillRect(0, 0, w, h);
      txt(ctx, "Silenced", w / 2, h / 2, 54, 600, CSS.s100, "center");
      txt(ctx, "until after prayer", w / 2, h / 2 + 56, 32, 400, "rgba(244,234,213,0.75)", "center");
    }
  },
  times(ctx, w, h, s) {
    screenBg(ctx, w, h);
    txt(ctx, "Prayer times", 48, 130, 52, 600);
    [["Fajr", "5:12"], ["Dhuhr", "1:04"], ["Asr", "4:38"], ["Maghrib", "7:21"], ["Isha", "8:47"]].forEach(([n, t], i) => {
      const y = 260 + i * 150;
      ink(ctx, i === 1 ? "rgba(127,196,174,0.28)" : "rgba(244,234,213,0.08)"); rr(ctx, 32, y - 70, w - 64, 112, 28); ctx.fill();
      txt(ctx, n, 72, y, 40, 600);
      txt(ctx, t, w - 72, y, 40, 400, CSS.s300, "right");
    });
  },
};

// ---------- wall clock ----------
export function wallClock(parent, { x = 0, y = 0, z = 0, r = 0.5 } = {}) {
  const g = group(parent, { x, y, z });
  cyl(r, r, 0.08, clay(C.s100, 0.7), { rx: Math.PI / 2, parent: g });
  tor(r, 0.045, clay(C.s500, 0.45, 0.4), { z: 0.03, parent: g });
  for (let i = 0; i < 12; i++) {
    const a = (i / 12) * Math.PI * 2;
    box(i % 3 ? 0.02 : 0.035, i % 3 ? 0.06 : 0.1, 0.01, clay(C.e800), { x: Math.sin(a) * r * 0.8, y: Math.cos(a) * r * 0.8, z: 0.045, rz: -a, parent: g, cast: false });
  }
  const hp = group(g, { z: 0.05 }), mp = group(g, { z: 0.06 });
  box(0.035, r * 0.5, 0.012, clay(C.e950), { y: r * 0.22, parent: hp });
  box(0.024, r * 0.74, 0.012, clay(C.e950), { y: r * 0.34, parent: mp });
  cyl(0.035, 0.035, 0.03, clay(C.alert, 0.5), { rx: Math.PI / 2, z: 0.075, parent: g });
  return { group: g, set(minutes) { mp.rotation.z = -(minutes / 60) * Math.PI * 2; hp.rotation.z = -(minutes / 720) * Math.PI * 2 - 0.15; } };
}

export function shelf(parent, { x = 0, y = 0, z = 0, w = 2, d = 0.45 } = {}) {
  const g = group(parent, { x, y, z });
  rbox(w, 0.07, d, 0.02, clay(C.s500, 0.7), { parent: g });
  for (const sx of [-w / 2 + 0.25, w / 2 - 0.25]) rbox(0.05, 0.28, d * 0.8, 0.01, clay(C.s700, 0.7), { x: sx, y: -0.17, z: -0.02, parent: g });
  return g;
}

// ---------- prayer mat ----------
export function matTexture(seed = 1) {
  return canvasTex(640, 1024, (ctx, w, h) => {
    ctx.fillStyle = CSS.e600; ctx.fillRect(0, 0, w, h);
    ctx.strokeStyle = CSS.s300; ctx.lineWidth = 14; ctx.strokeRect(34, 34, w - 68, h - 68);
    ctx.lineWidth = 4; ctx.strokeRect(62, 62, w - 124, h - 124);
    // mihrab arch
    ctx.fillStyle = CSS.e800;
    ctx.beginPath(); ctx.moveTo(140, h - 160); ctx.lineTo(140, 380); ctx.arc(w / 2, 380, w / 2 - 140, Math.PI, 0); ctx.lineTo(w - 140, h - 160); ctx.closePath(); ctx.fill();
    ctx.strokeStyle = CSS.s500; ctx.lineWidth = 6; ctx.stroke();
    // lamp motif
    ctx.fillStyle = CSS.s300; ctx.beginPath(); ctx.ellipse(w / 2, 470, 36, 52, 0, 0, 6.283); ctx.fill();
    ctx.fillRect(w / 2 - 3, 300, 6, 120);
    // border dots
    ctx.fillStyle = CSS.s500;
    for (let i = 0; i < 18; i++) { ctx.beginPath(); ctx.arc(48, 90 + i * 50, 6, 0, 6.283); ctx.fill(); ctx.beginPath(); ctx.arc(w - 48, 90 + i * 50, 6, 0, 6.283); ctx.fill(); }
    // fringe band
    ctx.fillStyle = CSS.s100; ctx.fillRect(0, 0, w, 14); ctx.fillRect(0, h - 14, w, 14);
  });
}
export function prayerMat(parent, { x = 0, y = 0, z = 0, ry = 0, w = 1.6, l = 2.6 } = {}) {
  const g = group(parent, { x, y, z, ry });
  const tex = matTexture();
  const top = new THREE.MeshStandardMaterial({ map: tex.tex, roughness: 0.95 });
  const side = clay(C.e600, 0.95);
  mesh(new THREE.BoxGeometry(w, 0.035, l), [side, side, top, side, side, side], { y: 0.018, parent: g });
  for (let i = 0; i < 16; i++) for (const sz of [-1, 1]) box(0.012, 0.004, 0.09, clay(C.s100, 0.9), { x: -w / 2 + 0.07 + i * ((w - 0.14) / 15), y: 0.004, z: sz * (l / 2 + 0.045), parent: g, cast: false });
  return g;
}

// ---------- door on a hinge ----------
export function door(parent, { x = 0, y = 0, z = 0, ry = 0, w = 1.2, h = 2.5, color = C.e600 } = {}) {
  const g = group(parent, { x, y, z, ry });
  const fm = clay(C.s300, 0.7);
  rbox(0.12, h + 0.12, 0.3, 0.02, fm, { x: -w / 2 - 0.06, y: h / 2, parent: g });
  rbox(0.12, h + 0.12, 0.3, 0.02, fm, { x: w / 2 + 0.06, y: h / 2, parent: g });
  rbox(w + 0.36, 0.12, 0.3, 0.02, fm, { y: h + 0.06, parent: g });
  const hinge = group(g, { x: -w / 2, y: 0, z: 0 });
  const panel = rbox(w, h, 0.07, 0.02, clay(color, 0.7), { x: w / 2, y: h / 2, parent: hinge });
  for (const [py, ph] of [[h * 0.72, h * 0.34], [h * 0.3, h * 0.36]]) rbox(w * 0.66, ph, 0.02, 0.01, clay(C.e700, 0.75), { x: w / 2, y: py, z: 0.04, parent: hinge });
  sph(0.05, clay(C.s500, 0.3, 0.7), { x: w - 0.12, y: h * 0.48, z: 0.08, parent: hinge });
  return { group: g, panel, set(k) { hinge.rotation.y = -k * 1.6; } };
}

// ---------- desk with drawer ----------
export function desk(parent, { x = 0, y = 0, z = 0, ry = 0 } = {}) {
  const g = group(parent, { x, y, z, ry });
  const wood = clay(C.s500, 0.62), dark = clay(C.s700, 0.7);
  rbox(2.6, 0.08, 1.2, 0.025, wood, { y: 1.0, parent: g });
  for (const [lx, lz] of [[-1.22, -0.52], [-1.22, 0.52]]) rbox(0.07, 1.0, 0.07, 0.02, dark, { x: lx, y: 0.5, z: lz, parent: g });
  rbox(0.9, 0.96, 1.1, 0.02, wood, { x: 0.82, y: 0.48, parent: g });
  const dr = group(g, { x: 0.82, y: 0.72, z: 0.0 });
  rbox(0.82, 0.3, 1.04, 0.02, clay(C.s300, 0.7), { parent: dr });
  box(0.74, 0.22, 0.94, clay(C.s700, 0.9), { y: 0.05, parent: dr, cast: false });
  rbox(0.3, 0.04, 0.04, 0.015, clay(C.e950, 0.4, 0.5), { y: 0.02, z: 0.55, parent: dr });
  rbox(0.82, 0.3, 0.06, 0.02, clay(C.s300, 0.7), { x: 0, y: -0.36, z: 0.53, parent: dr });
  return { group: g, drawer: dr, set(k) { dr.position.z = k * 0.85; } };
}

// ---------- locker bank ----------
export function lockers(parent, { x = 0, y = 0, z = 0, n = 4 } = {}) {
  const g = group(parent, { x, y, z });
  const doors = [];
  for (let i = 0; i < n; i++) {
    const lx = (i - (n - 1) / 2) * 0.72;
    rbox(0.7, 2.2, 0.6, 0.02, clay(i % 2 ? C.e600 : C.e700, 0.6, 0.15), { x: lx, y: 1.1, parent: g });
    const hinge = group(g, { x: lx - 0.33, y: 0, z: 0.31 });
    rbox(0.66, 2.1, 0.035, 0.015, clay(C.e600, 0.5, 0.2), { x: 0.33, y: 1.1, parent: hinge });
    for (let v = 0; v < 4; v++) box(0.4, 0.025, 0.02, clay(C.e800, 0.8), { x: 0.33, y: 1.85 - v * 0.07, z: 0.02, parent: hinge, cast: false });
    rbox(0.04, 0.18, 0.04, 0.015, clay(C.s300, 0.4, 0.6), { x: 0.58, y: 1.1, z: 0.03, parent: hinge });
    doors.push(hinge);
  }
  return { group: g, doors, set(i, k) { doors[i].rotation.y = -k * 1.9; } };
}

// ---------- bookshelf ----------
export function bookshelf(parent, { x = 0, y = 0, z = 0, ry = 0, w = 2.4, h = 3.2, seed = 5 } = {}) {
  const r = rng(seed);
  const g = group(parent, { x, y, z, ry });
  const wood = clay(C.s700, 0.75);
  rbox(w, h, 0.06, 0.02, clay(C.e950, 0.9), { y: h / 2, z: -0.25, parent: g });
  for (const sx of [-w / 2, w / 2]) rbox(0.07, h, 0.5, 0.02, wood, { x: sx, y: h / 2, parent: g });
  const rows = 5;
  const cols = [C.e600, C.s300, C.s500, C.e700, C.alert, C.s100, C.e300, 0x9a5a3c];
  for (let i = 0; i <= rows; i++) rbox(w, 0.06, 0.5, 0.01, wood, { y: 0.06 + i * ((h - 0.12) / rows), parent: g });
  for (let i = 0; i < rows; i++) {
    let bx = -w / 2 + 0.08;
    const by = 0.09 + i * ((h - 0.12) / rows);
    while (bx < w / 2 - 0.15) {
      const bw = 0.06 + r() * 0.07, bh = 0.34 + r() * 0.18;
      const lean = r() < 0.08 ? 0.18 : 0;
      rbox(bw, bh, 0.36, 0.008, clay(cols[Math.floor(r() * (lean ? 3 : cols.length))], 0.8), { x: bx + bw / 2, y: by + bh / 2, z: 0.0, rz: lean, parent: g, cast: false });
      bx += bw + 0.008 + (r() < 0.1 ? 0.15 : 0);
    }
  }
  return g;
}

// ---------- chat bubble (3D pill) ----------
export function bubble(parent, { x = 0, y = 0, z = 0, w = 1.1, color = C.s100, lines = 2 } = {}) {
  const g = group(parent, { x, y, z });
  const m = own(color, 0.45, 0, { transparent: true });
  rbox(w, 0.42, 0.14, 0.2, m, { parent: g });
  const lm = own(C.e800, 0.8, 0, { transparent: true });
  for (let i = 0; i < lines; i++) rbox(w * (i ? 0.45 : 0.7), 0.05, 0.02, 0.02, lm, { x: -w * 0.08 - (i ? w * 0.12 : 0), y: 0.06 - i * 0.12, z: 0.075, parent: g, cast: false });
  return { group: g, mat: m, lmat: lm };
}

// ---------- wudu basin and tap ----------
export function basin(parent, { x = 0, y = 0, z = 0 } = {}) {
  const g = group(parent, { x, y, z });
  rbox(1.6, 0.9, 0.8, 0.04, clay(C.s300, 0.65), { y: 0.45, parent: g });
  lathe([[0.0, 0.0], [0.42, 0.02], [0.52, 0.16], [0.56, 0.22], [0.52, 0.22], [0.46, 0.1], [0.0, 0.06]], clay(C.s100, 0.25), { y: 0.9, parent: g });
  const metal = clay(C.s500, 0.3, 0.8);
  cyl(0.035, 0.04, 0.5, metal, { y: 1.15, z: -0.32, parent: g });
  tor(0.16, 0.035, metal, { y: 1.4, z: -0.16, ry: Math.PI / 2, parent: g }, Math.PI);
  cyl(0.04, 0.035, 0.08, metal, { y: 1.33, z: 0.0, parent: g });
  return { group: g, spout: new THREE.Vector3(x, y + 1.29, z) };
}

// ---------- small objects ----------
export function bag(parent, { x = 0, y = 0, z = 0, ry = 0, color = C.s700 } = {}) {
  const g = group(parent, { x, y, z, ry });
  rbox(0.9, 0.62, 0.36, 0.12, clay(color, 0.85), { y: 0.31, parent: g });
  tor(0.24, 0.035, clay(C.e950, 0.6), { y: 0.62, parent: g }, Math.PI);
  rbox(0.6, 0.24, 0.04, 0.06, clay(C.s500, 0.85), { y: 0.3, z: 0.19, parent: g });
  return g;
}
export function alarmClock(parent, { x = 0, y = 0, z = 0, ry = 0 } = {}) {
  const g = group(parent, { x, y, z, ry });
  const body = clay(C.alert, 0.5, 0.1), metal = clay(C.s300, 0.3, 0.7);
  cyl(0.42, 0.42, 0.26, body, { rx: Math.PI / 2, y: 0.55, parent: g });
  cyl(0.36, 0.36, 0.02, clay(C.s100, 0.6), { rx: Math.PI / 2, y: 0.55, z: 0.135, parent: g });
  for (const sx of [-1, 1]) {
    mesh(new THREE.SphereGeometry(0.17, 32, 16, 0, Math.PI * 2, 0, Math.PI / 2), metal, { x: sx * 0.26, y: 0.92, rz: -sx * 0.5, parent: g });
    cyl(0.03, 0.03, 0.22, metal, { x: sx * 0.24, y: 0.12, rz: sx * 0.35, parent: g });
  }
  const hp = group(g, { y: 0.55, z: 0.15 }), mp = group(g, { y: 0.55, z: 0.155 });
  box(0.03, 0.18, 0.01, clay(C.e950), { y: 0.08, parent: hp });
  box(0.022, 0.27, 0.01, clay(C.e950), { y: 0.12, parent: mp });
  hp.rotation.z = -1.0; mp.rotation.z = -0.4;
  return g;
}
export function watch(parent, { x = 0, y = 0, z = 0, rx = 0, ry = 0 } = {}) {
  const g = group(parent, { x, y, z, rx, ry });
  rbox(0.32, 1.5, 0.06, 0.03, clay(C.e700, 0.85), { parent: g });
  cyl(0.3, 0.3, 0.12, clay(C.s500, 0.3, 0.8), { rx: Math.PI / 2, z: 0.06, parent: g });
  cyl(0.25, 0.25, 0.02, clay(C.e950, 0.4), { rx: Math.PI / 2, z: 0.125, parent: g });
  for (let i = 0; i < 12; i++) { const a = (i / 12) * 6.283; box(0.015, 0.05, 0.005, clay(C.s100), { x: Math.sin(a) * 0.2, y: Math.cos(a) * 0.2, z: 0.137, rz: -a, parent: g, cast: false }); }
  box(0.02, 0.15, 0.006, clay(C.s100), { y: 0.06, z: 0.14, rz: -0.3, parent: g, cast: false });
  box(0.02, 0.1, 0.006, clay(C.s100), { y: 0.03, z: 0.142, rz: 1.8, parent: g, cast: false });
  return g;
}
export function timetableTexture() {
  return canvasTex(600, 820, (ctx, w, h) => {
    ctx.fillStyle = "#FBF5E8"; ctx.fillRect(0, 0, w, h);
    txt(ctx, "Prayer Times", w / 2, 100, 56, 600, CSS.e800, "center", FONT.serif);
    ctx.fillStyle = CSS.e600; ctx.fillRect(60, 130, w - 120, 4);
    [["Fajr", "5:12"], ["Dhuhr", "1:04"], ["Asr", "4:38"], ["Maghrib", "7:21"], ["Isha", "8:47"]].forEach(([n, t], i) => {
      const y = 240 + i * 120;
      if (i === 1) { ctx.fillStyle = "rgba(127,196,174,0.35)"; ctx.fillRect(40, y - 64, w - 80, 96); }
      txt(ctx, n, 80, y, 44, 600, CSS.e800);
      txt(ctx, t, w - 80, y, 44, 400, CSS.e800, "right");
    });
  });
}
export function fridge(parent, { x = 0, y = 0, z = 0, ry = 0 } = {}) {
  const g = group(parent, { x, y, z, ry });
  const white = clay(0xe9e4d8, 0.4, 0.05);
  rbox(1.5, 3.2, 1.1, 0.12, white, { y: 1.6, parent: g });
  box(1.48, 0.02, 0.02, clay(C.grey, 0.6), { y: 2.3, z: 0.555, parent: g, cast: false });
  for (const hy of [2.75, 1.5]) rbox(0.06, hy > 2 ? 0.4 : 0.8, 0.08, 0.03, clay(C.s500, 0.3, 0.7), { x: 0.6, y: hy, z: 0.6, parent: g });
  const paper = group(g, { x: -0.1, y: 1.45, z: 0.565 });
  const tt = timetableTexture();
  mesh(new THREE.PlaneGeometry(0.82, 1.12), new THREE.MeshStandardMaterial({ map: tt.tex, roughness: 0.9 }), { parent: paper, cast: false });
  const magnet = cyl(0.07, 0.07, 0.05, clay(C.e600, 0.4), { rx: Math.PI / 2, y: 0.5, z: 0.025, parent: paper });
  return { group: g, paper, magnet };
}
export function checklistTexture(k = [0, 0, 0]) {
  return canvasTex(900, 1120, (ctx, w, h, kk = k) => {
    ctx.fillStyle = "#FBF5E8"; ctx.fillRect(0, 0, w, h);
    ctx.fillStyle = CSS.e800; ctx.fillRect(0, 0, w, 16);
    txt(ctx, "Phone-Down", 80, 150, 76, 700, CSS.e800, "left", FONT.serif);
    txt(ctx, "Checklist", 80, 236, 76, 700, CSS.e800, "left", FONT.serif);
    txt(ctx, "Before every salah", 80, 300, 34, 400, CSS.e600);
    const items = [["Away", "Phone in another room"], ["Silent", "Focus mode around prayer"], ["Replace", "Wudu slowly. Sit. Breathe."]];
    items.forEach(([a, b], i) => {
      const y = 440 + i * 200, d = clamp(kk[i] || 0);
      ctx.strokeStyle = CSS.e600; ctx.lineWidth = 8; rr(ctx, 80, y - 60, 84, 84, 18); ctx.stroke();
      if (d > 0) {
        ctx.strokeStyle = CSS.e600; ctx.lineWidth = 12; ctx.lineCap = "round"; ctx.beginPath();
        const p = [[98, y - 18], [118, y + 4], [150, y - 40]];
        ctx.moveTo(...p[0]);
        const seg1 = clamp(d * 2), seg2 = clamp(d * 2 - 1);
        ctx.lineTo(lerp(p[0][0], p[1][0], seg1), lerp(p[0][1], p[1][1], seg1));
        if (seg2 > 0) ctx.lineTo(lerp(p[1][0], p[2][0], seg2), lerp(p[1][1], p[2][1], seg2));
        ctx.stroke();
      }
      txt(ctx, a, 210, y - 8, 56, 700, CSS.e800, "left", FONT.serif);
      txt(ctx, b, 210, y + 46, 34, 400, CSS.e600);
    });
  });
}
export { txt };
