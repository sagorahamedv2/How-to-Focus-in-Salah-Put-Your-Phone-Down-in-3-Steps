// Shared kit for the 3D world: math, easing, palette, materials, primitives, canvas textures.
// Everything here is deterministic: no Math.random, no clocks.
import * as THREE from "three";
import { RoundedBoxGeometry } from "three/addons/geometries/RoundedBoxGeometry.js";

// ---------- math / easing ----------
export const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));
export const lerp = (a, b, k) => a + (b - a) * k;
export const prog = (t, a, b) => clamp((t - a) / (b - a));
export const E = {
  out: (k) => 1 - Math.pow(1 - k, 3),
  out4: (k) => 1 - Math.pow(1 - k, 4),
  in: (k) => k * k * k,
  inOut: (k) => (k < 0.5 ? 4 * k * k * k : 1 - Math.pow(-2 * k + 2, 3) / 2),
  sine: (k) => -(Math.cos(Math.PI * k) - 1) / 2,
  back: (k, s = 1.4) => 1 + (s + 1) * Math.pow(k - 1, 3) + s * Math.pow(k - 1, 2),
  expo: (k) => (k === 1 ? 1 : 1 - Math.pow(2, -10 * k)),
};
// progress of a move that starts at `a` and lasts `d` seconds, eased
export const mv = (t, a, d, ease = E.out) => ease(prog(t, a, a + d));
// a 0→1→0 pulse
export const pulse = (t, a, up, hold, down, ease = E.inOut) =>
  t < a + up ? ease(prog(t, a, a + up)) : 1 - ease(prog(t, a + up + hold, a + up + hold + down));

export function rng(seed) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

// ---------- palette ----------
export const C = {
  e950: 0x06211c, e900: 0x082c25, e800: 0x0b3d33, e700: 0x0f5244, e600: 0x14705c, e300: 0x7fc4ae,
  s100: 0xf4ead5, s200: 0xecdcbc, s300: 0xe3cfa6, s500: 0xb99a68, s700: 0x8a6d44,
  lamp: 0xffd98a, gold: 0xd9a441, alert: 0xe26d4f, grey: 0x5b6b66, ink: 0x0a1714,
};
export const CSS = {
  e950: "#06211C", e800: "#0B3D33", e600: "#14705C", e300: "#7FC4AE",
  s100: "#F4EAD5", s300: "#E3CFA6", s500: "#B99A68", lamp: "#FFD98A", gold: "#D9A441", alert: "#E26D4F", grey: "#5B6B66",
};

// ---------- materials ----------
const matCache = new Map();
export function clay(color, rough = 0.82, metal = 0) {
  const k = `c${color}-${rough}-${metal}`;
  if (!matCache.has(k)) matCache.set(k, new THREE.MeshStandardMaterial({ color, roughness: rough, metalness: metal }));
  return matCache.get(k);
}
// a material we will animate (never cached)
export const own = (color, rough = 0.82, metal = 0, extra = {}) =>
  new THREE.MeshStandardMaterial({ color, roughness: rough, metalness: metal, ...extra });
export const glow = (color, intensity = 1, extra = {}) =>
  new THREE.MeshStandardMaterial({ color: 0x000000, emissive: color, emissiveIntensity: intensity, roughness: 1, ...extra });
export const basic = (color, extra = {}) => new THREE.MeshBasicMaterial({ color, ...extra });

// ---------- primitives ----------
export function mesh(geo, mat, { x = 0, y = 0, z = 0, rx = 0, ry = 0, rz = 0, s = 1, cast = true, receive = true, parent } = {}) {
  const m = new THREE.Mesh(geo, mat);
  m.position.set(x, y, z);
  m.rotation.set(rx, ry, rz);
  if (s !== 1) m.scale.setScalar(s);
  m.castShadow = cast;
  m.receiveShadow = receive;
  if (parent) parent.add(m);
  return m;
}
export const rbox = (w, h, d, r = 0.04, mat, o = {}) =>
  mesh(new RoundedBoxGeometry(w, h, d, 4, Math.min(r, w / 2 - 1e-3, h / 2 - 1e-3, d / 2 - 1e-3)), mat, o);
export const box = (w, h, d, mat, o = {}) => mesh(new THREE.BoxGeometry(w, h, d), mat, o);
export const cyl = (rt, rb, h, mat, o = {}, seg = 48) => mesh(new THREE.CylinderGeometry(rt, rb, h, seg), mat, o);
export const sph = (r, mat, o = {}, seg = 32) => mesh(new THREE.SphereGeometry(r, seg, Math.round(seg * 0.75)), mat, o);
export const tor = (r, tube, mat, o = {}, arc = Math.PI * 2) => mesh(new THREE.TorusGeometry(r, tube, 16, 96, arc), mat, o);
export function group(parent, { x = 0, y = 0, z = 0, ry = 0, rx = 0, rz = 0 } = {}) {
  const g = new THREE.Group();
  g.position.set(x, y, z);
  g.rotation.set(rx, ry, rz);
  if (parent) parent.add(g);
  return g;
}

// an arch outline as a THREE.Shape (pointed-ish round top), centred at x=0, bottom at y=0
export function archShape(w, h, shape = new THREE.Shape()) {
  const r = w / 2;
  shape.moveTo(-r, 0);
  shape.lineTo(-r, h - r);
  shape.absarc(0, h - r, r, Math.PI, 0, true);
  shape.lineTo(r, 0);
  shape.lineTo(-r, 0);
  return shape;
}
function archPath(w, h) {
  const p = new THREE.Path();
  const r = w / 2;
  p.moveTo(-r, 0);
  p.lineTo(r, 0);
  p.lineTo(r, h - r);
  p.absarc(0, h - r, r, 0, Math.PI, false);
  p.lineTo(-r, 0);
  return p;
}
// arch frame (ring) extruded
export function archFrame(w, h, t, depth, mat, o = {}) {
  const outer = archShape(w + t * 2, h + t);
  outer.holes.push(archPath(w, h));
  const g = new THREE.ExtrudeGeometry(outer, { depth, bevelEnabled: true, bevelThickness: 0.02, bevelSize: 0.02, bevelSegments: 3, curveSegments: 40 });
  g.translate(0, -t * 0, -depth / 2);
  return mesh(g, mat, o);
}
// a wall with an arched hole cut into it
export function wallWithArch(W, H, depth, hole, mat, o = {}) {
  const s = new THREE.Shape();
  s.moveTo(-W / 2, 0); s.lineTo(W / 2, 0); s.lineTo(W / 2, H); s.lineTo(-W / 2, H); s.lineTo(-W / 2, 0);
  const r = hole.w / 2;
  const p = new THREE.Path();
  p.moveTo(hole.x - r, hole.y);
  p.lineTo(hole.x + r, hole.y);
  p.lineTo(hole.x + r, hole.y + hole.h - r);
  p.absarc(hole.x, hole.y + hole.h - r, r, 0, Math.PI, false);
  p.lineTo(hole.x - r, hole.y);
  s.holes.push(p);
  const g = new THREE.ExtrudeGeometry(s, { depth, bevelEnabled: false, curveSegments: 40 });
  g.translate(0, 0, -depth / 2);
  return mesh(g, mat, o);
}
// lathe from [r, y] pairs
export const lathe = (pts, mat, o = {}, seg = 64) =>
  mesh(new THREE.LatheGeometry(pts.map(([r, y]) => new THREE.Vector2(r, y)), seg), mat, o);

// ---------- canvas textures ----------
export const FONT = { serif: '"Fraunces", Georgia, serif', sans: '"Inter", Arial, sans-serif', ar: '"Amiri", "Noto Naskh Arabic", serif' };
export function canvasTex(w, h, draw) {
  const cv = document.createElement("canvas");
  cv.width = w; cv.height = h;
  const ctx = cv.getContext("2d");
  const tex = new THREE.CanvasTexture(cv);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = 8;
  const api = {
    tex, ctx, w, h,
    redraw(...args) { ctx.clearRect(0, 0, w, h); draw(ctx, w, h, ...args); tex.needsUpdate = true; },
  };
  api.redraw();
  return api;
}
export function rr(ctx, x, y, w, h, r) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}
// a flat label plane (unlit, so it reads clearly); returns mesh with .tex api
export function label(text, { size = 64, weight = 600, color = CSS.s100, font = FONT.sans, pad = 24, bg = null, radius = 18, height = 0.3, align = "center" } = {}) {
  const meas = document.createElement("canvas").getContext("2d");
  meas.font = `${weight} ${size}px ${font}`;
  const tw = Math.ceil(meas.measureText(text).width);
  const W = tw + pad * 2, H = Math.ceil(size * 1.5) + (bg ? pad : 0);
  const api = canvasTex(W, H, (ctx) => {
    if (bg) { ctx.fillStyle = bg; rr(ctx, 0, 0, W, H, radius); ctx.fill(); }
    ctx.font = `${weight} ${size}px ${font}`;
    ctx.fillStyle = color;
    ctx.textBaseline = "middle";
    ctx.textAlign = align;
    ctx.fillText(text, align === "center" ? W / 2 : pad, H / 2 + size * 0.04);
  });
  const m = new THREE.Mesh(new THREE.PlaneGeometry((W / H) * height, height),
    new THREE.MeshBasicMaterial({ map: api.tex, transparent: true, toneMapped: false, depthWrite: false }));
  m.userData.tex = api;
  m.renderOrder = 5;
  return m;
}

// soft round sprite texture (for dust, glows, contact shadows)
let _soft;
export function softTex() {
  if (_soft) return _soft;
  _soft = canvasTex(128, 128, (ctx, w, h) => {
    const g = ctx.createRadialGradient(64, 64, 0, 64, 64, 64);
    g.addColorStop(0, "rgba(255,255,255,1)");
    g.addColorStop(0.35, "rgba(255,255,255,0.45)");
    g.addColorStop(1, "rgba(255,255,255,0)");
    ctx.fillStyle = g; ctx.fillRect(0, 0, w, h);
  }).tex;
  _soft.colorSpace = THREE.NoColorSpace;
  return _soft;
}
// additive glow card (fake volumetric halo)
export function halo(color, size, opacity = 0.6, { x = 0, y = 0, z = 0, parent } = {}) {
  const m = new THREE.Sprite(new THREE.SpriteMaterial({ map: softTex(), color, transparent: true, opacity, blending: THREE.AdditiveBlending, depthWrite: false, toneMapped: false }));
  m.scale.set(size, size, 1);
  m.position.set(x, y, z);
  m.renderOrder = 4;
  if (parent) parent.add(m);
  return m;
}
// contact shadow blob under an object
export function blob(size, opacity = 0.35, o = {}) {
  const m = mesh(new THREE.PlaneGeometry(size, size),
    new THREE.MeshBasicMaterial({ map: softTex(), color: 0x000000, transparent: true, opacity, depthWrite: false }),
    { rx: -Math.PI / 2, cast: false, receive: false, ...o });
  m.renderOrder = 2;
  return m;
}

// seeded dust motes that drift as a pure function of time
export function dust(count, box3, seed, { color = C.lamp, size = 0.035, opacity = 0.55 } = {}) {
  const r = rng(seed);
  const base = [];
  const pos = new Float32Array(count * 3);
  for (let i = 0; i < count; i++) base.push([r(), r(), r(), r() * 6.28, 0.3 + r() * 0.7]);
  const geo = new THREE.BufferGeometry();
  geo.setAttribute("position", new THREE.BufferAttribute(pos, 3));
  const mat = new THREE.PointsMaterial({ color, size, map: softTex(), transparent: true, opacity, depthWrite: false, blending: THREE.AdditiveBlending, sizeAttenuation: true, toneMapped: false });
  const pts = new THREE.Points(geo, mat);
  pts.frustumCulled = false;
  const [x0, y0, z0, x1, y1, z1] = box3;
  pts.userData.update = (t) => {
    for (let i = 0; i < count; i++) {
      const [a, b, c, ph, sp] = base[i];
      const yy = (b + t * 0.012 * sp) % 1;
      pos[i * 3] = x0 + (x1 - x0) * a + Math.sin(t * 0.3 * sp + ph) * 0.12;
      pos[i * 3 + 1] = y0 + (y1 - y0) * yy;
      pos[i * 3 + 2] = z0 + (z1 - z0) * c + Math.cos(t * 0.25 * sp + ph) * 0.12;
    }
    geo.attributes.position.needsUpdate = true;
  };
  return pts;
}

// a lamp: base, stem, fabric shade, glowing bulb and a point light. Returns { group, light, set(k) }
export function lamp(parent, { x = 0, y = 0, z = 0, h = 1.5, shade = 0.34, power = 18, dist = 9 } = {}) {
  const g = group(parent, { x, y, z });
  cyl(0.2, 0.24, 0.06, clay(C.s500, 0.6), { y: 0.03, parent: g });
  cyl(0.022, 0.022, h, clay(C.s700, 0.4, 0.6), { y: h / 2, parent: g });
  const shadeMat = own(C.s100, 0.9, 0, { emissive: C.lamp, emissiveIntensity: 0.8, side: THREE.DoubleSide });
  const sh = mesh(new THREE.CylinderGeometry(shade * 0.62, shade, shade * 1.05, 48, 1, true), shadeMat, { y: h + 0.1, cast: false, parent: g });
  const bulb = sph(0.08, glow(C.lamp, 6), { y: h + 0.02, cast: false, parent: g });
  const light = new THREE.PointLight(C.lamp, power, dist, 2);
  light.position.set(0, h + 0.05, 0);
  light.castShadow = false;
  g.add(light);
  const hl = halo(C.lamp, shade * 7, 0.35, { y: h + 0.08, parent: g });
  const api = {
    group: g, light, shade: sh, halo: hl,
    set(k) { // 0 = off, 1 = on
      light.intensity = power * k;
      shadeMat.emissiveIntensity = 0.05 + 0.85 * k;
      bulb.material.emissiveIntensity = 0.2 + 6 * k;
      hl.material.opacity = 0.35 * k;
    },
  };
  return api;
}
