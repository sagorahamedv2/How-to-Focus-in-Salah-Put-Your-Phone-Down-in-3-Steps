// The 3D world: one renderer, many small sets ("stations"), a list of camera shots driven by film time.
// Every frame is a pure function of the time HyperFrames seeks to.
import * as THREE from "three";
import { EffectComposer } from "three/addons/postprocessing/EffectComposer.js";
import { Pass, FullScreenQuad } from "three/addons/postprocessing/Pass.js";
import { UnrealBloomPass } from "three/addons/postprocessing/UnrealBloomPass.js";
import { ShaderPass } from "three/addons/postprocessing/ShaderPass.js";
import { OutputPass } from "three/addons/postprocessing/OutputPass.js";
import { RoomEnvironment } from "three/addons/environments/RoomEnvironment.js";
import { E, clamp, lerp, prog } from "./kit.js";
import { buildStations } from "./stations.js";

const W = 1920, H = 1080, FPS = 30;
const TRANS = 0.6; // 18-frame transition window

// camera keys: [t, [px,py,pz], [tx,ty,tz], fov?, ease?]
function camAt(keys, t, out) {
  let i = 0;
  while (i < keys.length - 1 && t > keys[i + 1][0]) i++;
  const a = keys[i], b = keys[Math.min(i + 1, keys.length - 1)];
  const k = a === b ? 0 : (b[4] || E.inOut)(prog(t, a[0], b[0]));
  for (let j = 0; j < 3; j++) { out.p[j] = lerp(a[1][j], b[1][j], k); out.t[j] = lerp(a[2][j], b[2][j], k); }
  out.fov = lerp(a[3] || 35, b[3] || 35, k);
  return out;
}

const MIX_FRAG = /* glsl */ `
  uniform sampler2D tA; uniform sampler2D tB; uniform float k; uniform int mode; uniform vec3 dark; uniform float hasB;
  varying vec2 vUv;
  vec2 zoom(vec2 uv, float s) { return (uv - 0.5) / s + 0.5; }
  void main() {
    if (hasB < 0.5) { gl_FragColor = texture2D(tA, vUv); return; }
    float e = k * k * (3.0 - 2.0 * k);
    vec4 a, b;
    if (mode == 2) { // camera pull: A pushes in, B settles from 1.06
      a = texture2D(tA, zoom(vUv, 1.0 + 0.08 * e));
      b = texture2D(tB, zoom(vUv, 1.06 - 0.06 * e));
      gl_FragColor = mix(a, b, e);
    } else if (mode == 1) { // through the dark
      a = texture2D(tA, vUv); b = texture2D(tB, vUv);
      vec4 d = vec4(dark, 1.0);
      gl_FragColor = e < 0.5 ? mix(a, d, e * 2.0) : mix(d, b, e * 2.0 - 1.0);
    } else if (mode == 3) { // soft radial light wipe
      a = texture2D(tA, vUv); b = texture2D(tB, vUv);
      float r = length((vUv - 0.5) * vec2(1.777, 1.0));
      float m = smoothstep(e * 1.3 - 0.25, e * 1.3, r);
      gl_FragColor = mix(b, a, m);
    } else { // dissolve
      a = texture2D(tA, vUv); b = texture2D(tB, vUv);
      gl_FragColor = mix(a, b, e);
    }
  }`;
const COPY_VERT = /* glsl */ `varying vec2 vUv; void main(){ vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0); }`;

const FINISH = {
  uniforms: { tDiffuse: { value: null }, frame: { value: 0 }, vig: { value: 0.32 }, grain: { value: 0.035 } },
  vertexShader: COPY_VERT,
  fragmentShader: /* glsl */ `
    uniform sampler2D tDiffuse; uniform float frame; uniform float vig; uniform float grain; varying vec2 vUv;
    float h(vec2 p){ return fract(sin(dot(p, vec2(12.9898, 78.233))) * 43758.5453); }
    void main(){
      vec4 c = texture2D(tDiffuse, vUv);
      vec2 q = (vUv - 0.5) * vec2(1.25, 1.0);
      float v = 1.0 - vig * smoothstep(0.25, 0.85, length(q));
      float n = h(floor(vUv * vec2(1920.0, 1080.0)) + mod(frame, 64.0) * 17.31) - 0.5;
      c.rgb = c.rgb * v + n * grain * (0.35 + c.rgb);
      gl_FragColor = c;
    }`,
};

class ShotPass extends Pass {
  constructor(world) {
    super();
    this.world = world;
    const opts = { type: THREE.HalfFloatType, samples: 4 };
    this.rtA = new THREE.WebGLRenderTarget(W, H, opts);
    this.rtB = new THREE.WebGLRenderTarget(W, H, opts);
    this.mat = new THREE.ShaderMaterial({
      uniforms: { tA: { value: null }, tB: { value: null }, k: { value: 0 }, mode: { value: 0 }, dark: { value: new THREE.Color(0x020a08) }, hasB: { value: 0 } },
      vertexShader: COPY_VERT, fragmentShader: MIX_FRAG,
    });
    this.quad = new FullScreenQuad(this.mat);
  }
  render(renderer, writeBuffer) {
    const { a, b, k, mode } = this.world.pick(this.t);
    this.world.renderShot(a, this.t, this.rtA);
    this.mat.uniforms.tA.value = this.rtA.texture;
    this.mat.uniforms.hasB.value = b ? 1 : 0;
    if (b) {
      this.world.renderShot(b, this.t, this.rtB);
      this.mat.uniforms.tB.value = this.rtB.texture;
      this.mat.uniforms.k.value = k;
      this.mat.uniforms.mode.value = mode;
    }
    renderer.setRenderTarget(this.renderToScreen ? null : writeBuffer);
    this.quad.render(renderer);
  }
}

export async function start(canvas, done) {
  try {
    await Promise.all([
      document.fonts.load('600 64px "Inter"'), document.fonts.load('400 64px "Inter"'),
      document.fonts.load('700 64px "Fraunces"'), document.fonts.load('600 64px "Fraunces"'),
    ]);
  } catch (e) { /* fall back to system fonts */ }

  const renderer = new THREE.WebGLRenderer({ canvas, antialias: false, preserveDrawingBuffer: true, powerPreference: "high-performance" });
  renderer.setPixelRatio(1);
  renderer.setSize(W, H, false);
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.0;
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;

  const scene = new THREE.Scene();
  const pmrem = new THREE.PMREMGenerator(renderer);
  scene.environment = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
  scene.environmentIntensity = 0.3;

  // shared lights, re-aimed per shot
  const hemi = new THREE.HemisphereLight(0x9fd6c4, 0x3a2a18, 0.7);
  scene.add(hemi);
  const key = new THREE.DirectionalLight(0xffe7c0, 1.6);
  key.castShadow = true;
  key.shadow.mapSize.set(2048, 2048);
  key.shadow.bias = -0.0004;
  key.shadow.normalBias = 0.02;
  key.shadow.radius = 6;
  const sc = key.shadow.camera;
  sc.left = -9; sc.right = 9; sc.top = 9; sc.bottom = -9; sc.near = 0.5; sc.far = 40;
  scene.add(key, key.target);

  const camera = new THREE.PerspectiveCamera(35, W / H, 0.05, 300);
  const stations = buildStations(scene, { renderer, camera });
  const shots = [];
  stations.forEach((st, i) => {
    st.group.position.x = i * 120;
    for (const sh of st.shots) shots.push({ ...sh, st });
  });
  shots.sort((p, q) => p.start - q.start);

  const tmp = { p: [0, 0, 0], t: [0, 0, 0], fov: 35 };
  const world = {
    pick(t) {
      let i = shots.findIndex((s) => t < s.end);
      if (i < 0) i = shots.length - 1;
      const cur = shots[i];
      const next = shots[i + 1];
      if (next && t > cur.end - TRANS / 2) return { a: cur, b: next, k: prog(t, cur.end - TRANS / 2, cur.end + TRANS / 2), mode: next.trans ?? 2 };
      const prev = shots[i - 1];
      if (prev && t < cur.start + TRANS / 2) return { a: prev, b: cur, k: prog(t, cur.start - TRANS / 2, cur.start + TRANS / 2), mode: cur.trans ?? 2 };
      return { a: cur, b: null, k: 0, mode: 0 };
    },
    renderShot(shot, t, target) {
      const st = shot.st;
      for (const s of stations) s.group.visible = s === st;
      camAt(shot.cam, t, tmp);
      const o = st.group.position;
      // tiny handheld drift so no frame is dead
      const dr = shot.drift ?? 0.012;
      camera.position.set(tmp.p[0] + o.x + Math.sin(t * 0.37) * dr, tmp.p[1] + o.y + Math.sin(t * 0.29 + 1.3) * dr * 0.6, tmp.p[2] + o.z);
      camera.lookAt(tmp.t[0] + o.x, tmp.t[1] + o.y, tmp.t[2] + o.z);
      camera.fov = tmp.fov;
      camera.updateProjectionMatrix();
      const L = st.light || {};
      const kp = L.pos || [4, 9, 6], kt = L.target || [0, 0, 0];
      key.position.set(kp[0] + o.x, kp[1] + o.y, kp[2] + o.z);
      key.target.position.set(kt[0] + o.x, kt[1] + o.y, kt[2] + o.z);
      key.intensity = L.key ?? 1.6;
      key.color.setHex(L.keyColor ?? 0xffe7c0);
      hemi.intensity = L.hemi ?? 0.7;
      scene.environmentIntensity = L.env ?? 0.3;
      scene.background = st.bg || null;
      st.update(t, camera, shot);
      renderer.setRenderTarget(target);
      renderer.setClearColor(st.clear ?? 0x06211c, 1);
      renderer.clear();
      renderer.render(scene, camera);
    },
  };

  const composer = new EffectComposer(renderer, new THREE.WebGLRenderTarget(W, H, { type: THREE.HalfFloatType }));
  composer.setPixelRatio(1);
  composer.setSize(W, H);
  const shotPass = new ShotPass(world);
  composer.addPass(shotPass);
  const bloom = new UnrealBloomPass(new THREE.Vector2(W, H), 0.32, 0.55, 0.9);
  composer.addPass(bloom);
  const finish = new ShaderPass(FINISH);
  composer.addPass(finish);
  composer.addPass(new OutputPass());

  function renderAt(time) {
    const t = clamp(time, 0, 195.6);
    shotPass.t = t;
    finish.uniforms.frame.value = Math.round(t * FPS);
    composer.render();
  }
  window.addEventListener("hf-seek", (e) => renderAt(e.detail.time));
  window.__worldRender = renderAt;
  // warm up every station once so shader compiles happen before the first seek
  for (const s of shots) renderAt((s.start + s.end) / 2);
  renderAt(window.__hfThreeTime || 0);
  if (done) done();
}
