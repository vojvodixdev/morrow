// © 2026 Nikola Vojvodić · https://vojvodixdev.github.io/ · All rights reserved, see LICENSE. [nv:cebe1f9421]
// Morrow · 3D linija limenki (Three.js), korpa, kalendar berbe i forma
import * as THREE from "three";
import { RoomEnvironment } from "three/addons/environments/RoomEnvironment.js";

const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
const $ = s => document.querySelector(s);
const CREAM = "#f6e9d6";
const DISPLAY = '"Unbounded", "Arial Black", Impact, sans-serif';
const MONO = '"DM Mono", ui-monospace, Menlo, Consolas, monospace';
const MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
const euro = n => new Intl.NumberFormat("en-IE", { style: "currency", currency: "EUR" }).format(n);
const pad = n => String(n).padStart(2, "0");

/* ---------- Ukusi (redom kako se beru) ---------- */
const FLAVORS = [
  { id: "cherry", name: "Sour Cherry", word: "CHERRY", months: [6, 7], price: 2.4,
    can: "#8e1328", deep: "#560918", fruit: "#d0263f", leaf: "#3f7a2a", bg: "#3d0811", soft: "#f2a7b0",
    tagline: "Tart, dark and cold-pressed.",
    desc: "Sour cherries from orchards around Čačak, pressed cold so they keep their bite.",
    sweet: 2, tart: 5, kcal: 48, carbs: 11.4, sugar: 10.2, best: "Ice cold, after a run" },
  { id: "apricot", name: "Apricot", word: "APRICOT", months: [7, 7], price: 2.4,
    can: "#ec8a2b", deep: "#b85a14", fruit: "#ffb24d", leaf: "#4d7f2c", bg: "#4a2207", soft: "#ffc98a",
    tagline: "Thick and sweet, picked in July.",
    desc: "Apricots picked only when they're fully ripe, so the juice comes out almost as thick as nectar.",
    sweet: 4, tart: 2, kcal: 52, carbs: 12.6, sugar: 11.8, best: "With breakfast" },
  { id: "plum", name: "Plum", word: "PLUM", months: [8, 9], price: 2.4,
    can: "#5b2a6e", deep: "#341541", fruit: "#9d63c2", leaf: "#3d6b28", bg: "#2a1233", soft: "#d0b0e6",
    tagline: "Deep, full and a little spiced.",
    desc: "Plums are what this valley is known for. The juice is dark and full, with a soft spice at the end.",
    sweet: 4, tart: 3, kcal: 58, carbs: 13.9, sugar: 12.4, best: "With cake" },
  { id: "apple", name: "Green Apple", word: "APPLE", months: [9, 10], price: 2.4,
    can: "#5f9a33", deep: "#3c6a1c", fruit: "#b9dc5a", leaf: "#2f5a17", bg: "#1b310e", soft: "#cfe79a",
    tagline: "Green, sharp and bright.",
    desc: "Green apples make a sharp, bright juice. It's best straight from the fridge.",
    sweet: 3, tart: 4, kcal: 44, carbs: 10.8, sugar: 9.6, best: "Straight from the fridge" },
  { id: "quince", name: "Quince", word: "QUINCE", months: [10, 11], price: 2.8,
    can: "#b8860f", deep: "#7d5a06", fruit: "#f2d04e", leaf: "#4a6e22", bg: "#3a2a05", soft: "#f5df8a",
    tagline: "Fragrant, slightly dry, rare.",
    desc: "Hardly anyone presses quince. It smells incredible, tastes slightly dry and stays with you for a while.",
    sweet: 3, tart: 3, kcal: 50, carbs: 12.0, sugar: 10.9, best: "At room temperature" }
];
const PRODUCTS = Object.fromEntries([
  ...FLAVORS.map(f => [f.id, { name: f.name, price: f.price, color: f.fruit }]),
  ["six", { name: "Mixed six-pack", price: 13.5, color: "#1d1411" }],
  ["crate", { name: "Harvest crate", price: 49, color: "#1d1411" }]
]);

/* ---------- Nalepnica: crta se na 2D canvasu i lepi na limenku ---------- */
const W = 2048, H = 912;

function drawFruit(g, f, cx, cy) {
  g.lineJoin = "round"; g.lineWidth = 10; g.strokeStyle = CREAM;
  const leaf = (x, y, rot) => {
    g.save(); g.translate(x, y); g.rotate(rot);
    g.beginPath(); g.ellipse(0, 0, 58, 24, 0, 0, Math.PI * 2);
    g.fillStyle = f.leaf; g.fill(); g.stroke(); g.restore();
  };
  const stem = (x1, y1, qx, qy, x2, y2) => {
    g.beginPath(); g.moveTo(x1, y1); g.quadraticCurveTo(qx, qy, x2, y2);
    g.strokeStyle = "#4a2e14"; g.lineWidth = 12; g.stroke();
    g.strokeStyle = CREAM; g.lineWidth = 10;
  };
  const shine = (x, y, r) => {
    g.beginPath(); g.ellipse(x, y, r * .28, r * .16, -.6, 0, Math.PI * 2);
    g.fillStyle = "rgba(255,255,255,.5)"; g.fill();
  };
  const blob = draw => { g.beginPath(); draw(); g.fillStyle = f.fruit; g.fill(); g.stroke(); };
  const crease = draw => { g.beginPath(); draw(); g.strokeStyle = f.deep; g.lineWidth = 8; g.stroke(); g.strokeStyle = CREAM; g.lineWidth = 10; };

  if (f.id === "cherry") {
    g.beginPath(); g.moveTo(cx - 70, cy - 10); g.quadraticCurveTo(cx - 40, cy - 95, cx + 20, cy - 118);
    g.moveTo(cx + 70, cy + 5); g.quadraticCurveTo(cx + 60, cy - 70, cx + 20, cy - 118);
    g.strokeStyle = f.leaf; g.lineWidth = 12; g.stroke(); g.strokeStyle = CREAM; g.lineWidth = 10;
    leaf(cx + 76, cy - 112, -.3);
    for (const [x, y] of [[cx - 70, cy + 52], [cx + 70, cy + 66]]) { blob(() => g.arc(x, y, 72, 0, Math.PI * 2)); shine(x - 22, y - 24, 72); }
  } else if (f.id === "apricot") {
    leaf(cx + 62, cy - 92, -.5);
    blob(() => g.arc(cx, cy + 30, 108, 0, Math.PI * 2));
    crease(() => { g.moveTo(cx + 8, cy - 74); g.bezierCurveTo(cx + 46, cy, cx + 40, cy + 80, cx + 6, cy + 134); });
    shine(cx - 40, cy - 12, 108);
  } else if (f.id === "plum") {
    stem(cx + 6, cy - 86, cx + 10, cy - 110, cx + 30, cy - 128);
    leaf(cx + 80, cy - 112, -.25);
    blob(() => g.ellipse(cx, cy + 28, 92, 116, .18, 0, Math.PI * 2));
    crease(() => { g.moveTo(cx + 2, cy - 82); g.bezierCurveTo(cx - 34, cy - 10, cx - 30, cy + 80, cx + 12, cy + 140); });
    shine(cx + 30, cy - 20, 100);
  } else if (f.id === "apple") {
    blob(() => {
      g.moveTo(cx, cy - 64);
      g.bezierCurveTo(cx + 60, cy - 110, cx + 130, cy - 40, cx + 112, cy + 46);
      g.bezierCurveTo(cx + 98, cy + 120, cx + 46, cy + 148, cx, cy + 128);
      g.bezierCurveTo(cx - 46, cy + 148, cx - 98, cy + 120, cx - 112, cy + 46);
      g.bezierCurveTo(cx - 130, cy - 40, cx - 60, cy - 110, cx, cy - 64);
    });
    stem(cx, cy - 60, cx - 6, cy - 100, cx + 12, cy - 122);
    leaf(cx + 64, cy - 104, -.45);
    shine(cx - 50, cy - 4, 110);
  } else {
    blob(() => {
      g.moveTo(cx, cy - 92);
      g.bezierCurveTo(cx + 46, cy - 100, cx + 60, cy - 40, cx + 92, cy + 4);
      g.bezierCurveTo(cx + 140, cy + 70, cx + 96, cy + 150, cx, cy + 146);
      g.bezierCurveTo(cx - 96, cy + 150, cx - 140, cy + 70, cx - 92, cy + 4);
      g.bezierCurveTo(cx - 60, cy - 40, cx - 46, cy - 100, cx, cy - 92);
    });
    stem(cx, cy - 90, cx - 4, cy - 112, cx + 10, cy - 128);
    leaf(cx + 62, cy - 116, -.4);
    shine(cx - 44, cy + 20, 110);
  }
}

function drawLabel(f, c) {
  const g = c.getContext("2d");
  const base = g.createLinearGradient(0, 0, 0, H);
  base.addColorStop(0, f.can); base.addColorStop(1, f.deep);
  g.fillStyle = base; g.fillRect(0, 0, W, H);
  g.fillStyle = CREAM; g.fillRect(0, 0, W, 44); g.fillRect(0, H - 44, W, 44);
  g.fillStyle = f.deep; g.fillRect(0, 44, W, 8); g.fillRect(0, H - 52, W, 8);

  // prednja strana: sredina slike (x = 1024) gleda u kameru
  g.textAlign = "center"; g.fillStyle = CREAM;
  g.font = `900 172px ${DISPLAY}`; g.fillText("MORROW", 1024, 300);
  const name = f.name.toUpperCase();
  g.font = `800 62px ${DISPLAY}`;
  const tw = g.measureText(name).width;
  g.beginPath();
  if (g.roundRect) g.roundRect(1024 - tw / 2 - 40, 360, tw + 80, 100, 50); else g.rect(1024 - tw / 2 - 40, 360, tw + 80, 100);
  g.fill();
  g.fillStyle = f.deep; g.fillText(name, 1024, 432);
  g.font = `500 30px ${MONO}`; g.fillStyle = "rgba(246,233,214,.85)";
  g.fillText("COLD-PRESSED · 100% FRUIT", 1024, 530);
  drawFruit(g, f, 1024, 700);
  g.font = `500 34px ${MONO}`; g.fillStyle = CREAM;
  g.textAlign = "left"; g.fillText("330 ml", 1290, 822);
  g.textAlign = "right"; g.fillText("Made in Čačak", 758, 822);

  // zadnja strana: nutritivna tabela i bar-kod
  g.textAlign = "left"; g.fillStyle = CREAM;
  g.font = `800 40px ${DISPLAY}`; g.fillText("NUTRITION", 1600, 190);
  g.font = `400 26px ${MONO}`; g.fillStyle = "rgba(246,233,214,.8)"; g.fillText("per 100 ml", 1600, 234);
  const rows = [["Energy", `${f.kcal} kcal`], ["Carbohydrate", `${f.carbs.toFixed(1)} g`], ["of which sugars", `${f.sugar.toFixed(1)} g`], ["Protein", "0.4 g"], ["Salt", "0 g"]];
  g.font = `400 28px ${MONO}`;
  rows.forEach(([k, v], i) => {
    const y = 300 + i * 56;
    g.fillStyle = "rgba(246,233,214,.35)"; g.fillRect(1600, y - 40, 380, 2);
    g.fillStyle = CREAM; g.textAlign = "left"; g.fillText(k, 1600, y);
    g.textAlign = "right"; g.fillText(v, 1980, y);
  });
  g.textAlign = "left"; g.font = `400 24px ${MONO}`; g.fillStyle = "rgba(246,233,214,.8)";
  g.fillText("Pressed in Čačak, Serbia.", 1600, 640);
  g.fillText("Morrow is a fictional brand.", 1600, 680);
  g.fillStyle = CREAM; g.fillRect(120, 520, 330, 230);
  g.fillStyle = "#1a1a1a";
  let seed = 7 + f.kcal;
  for (let x = 146; x < 424;) {
    seed = (seed * 9301 + 49297) % 233280;
    const w = 3 + (seed % 4) * 2;
    g.fillRect(x, 545, w, 150);
    x += w + 3 + (seed % 3) * 2;
  }
  g.font = `400 22px ${MONO}`; g.textAlign = "center"; g.fillText(`8 600000 0330${f.kcal}`, 285, 730);
  g.textAlign = "left"; g.fillStyle = CREAM; g.font = `400 24px ${MONO}`;
  g.fillText("Shake before opening.", 120, 430);
  g.fillText("Best served cold.", 120, 470);
}

/* ---------- 3D scena ---------- */
const canvas = $("#cans");
let renderer = null;
try {
  renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
} catch (e) {
  canvas.insertAdjacentHTML("afterend", '<p style="position:absolute;inset:0;display:grid;place-items:center;text-align:center;padding:24px;color:var(--cream-70)">Your browser can’t show WebGL, so the 3D cans are hidden. Everything else on the page still works.</p>');
}

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(30, 1, 0.1, 100);
const FLOOR_Y = -2.0;
const BACK_ANGLE = -2.35;   // ugao pod kojim se vidi nutritivna tabela
const cans = [];
let floorMat, beam, pool;

if (renderer) {
  renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.05;
  const pmrem = new THREE.PMREMGenerator(renderer);
  scene.environment = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;

  const key = new THREE.DirectionalLight(0xffffff, 1.3); key.position.set(3, 6, 8); scene.add(key);
  const rim = new THREE.DirectionalLight(0xffe2c4, 1.4); rim.position.set(-6, 3, -5); scene.add(rim);

  // geometrija je zajednička za sve limenke
  const v = (x, y) => new THREE.Vector2(x, y);
  const GEO = {
    body: new THREE.CylinderGeometry(1, 1, 2.8, 128, 1, true, Math.PI, Math.PI * 2),
    bottom: new THREE.LatheGeometry([v(0, .17), v(.5, .145), v(.68, .07), v(.74, .005), v(.8, 0), v(.88, .04), v(.95, .12), v(.99, .22), v(1, .3)], 96),
    top: new THREE.LatheGeometry([v(1, 3.1), v(.995, 3.16), v(.97, 3.25), v(.925, 3.35), v(.89, 3.41), v(.893, 3.455), v(.885, 3.49), v(.865, 3.485), v(.85, 3.44), v(.835, 3.415), v(0, 3.415)], 96),
    rivet: new THREE.CylinderGeometry(0.05, 0.06, 0.04, 20),
    mouth: new THREE.CircleGeometry(0.2, 32),
    drop: new THREE.SphereGeometry(1, 10, 8)
  };
  const tabShape = new THREE.Shape();
  {
    const x = -0.15, y = -0.3, w = 0.3, h = 0.56, r = 0.14;
    tabShape.moveTo(x + r, y); tabShape.lineTo(x + w - r, y); tabShape.quadraticCurveTo(x + w, y, x + w, y + r);
    tabShape.lineTo(x + w, y + h - r); tabShape.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
    tabShape.lineTo(x + r, y + h); tabShape.quadraticCurveTo(x, y + h, x, y + h - r);
    tabShape.lineTo(x, y + r); tabShape.quadraticCurveTo(x, y, x + r, y);
    const hole = new THREE.Path(); hole.absarc(0, -0.13, 0.075, 0, Math.PI * 2, true); tabShape.holes.push(hole);
  }
  GEO.tab = new THREE.ExtrudeGeometry(tabShape, { depth: 0.016, bevelEnabled: true, bevelThickness: 0.006, bevelSize: 0.008, bevelSegments: 2, curveSegments: 16 });

  const canvasTexture = (w, h, draw, srgb = true) => {
    const c = Object.assign(document.createElement("canvas"), { width: w, height: h });
    draw(c.getContext("2d"), w, h);
    const t = new THREE.CanvasTexture(c);
    if (srgb) t.colorSpace = THREE.SRGBColorSpace;
    return t;
  };
  const shadowTex = canvasTexture(256, 256, (g, w, h) => {
    const gr = g.createRadialGradient(w / 2, h / 2, 0, w / 2, h / 2, w / 2);
    gr.addColorStop(0, "rgba(0,0,0,.6)"); gr.addColorStop(1, "rgba(0,0,0,0)");
    g.fillStyle = gr; g.fillRect(0, 0, w, h);
  });

  // kapljice kondenzacije: iste pozicije za svaku limenku
  const DROPS = 170;
  const dropMatrices = [];
  {
    let s = 42;
    const rnd = () => (s = (s * 16807) % 2147483647) / 2147483647;
    const m = new THREE.Matrix4(), q = new THREE.Quaternion(), p = new THREE.Vector3(), sc = new THREE.Vector3(), up = new THREE.Vector3(0, 1, 0);
    for (let i = 0; i < DROPS; i++) {
      const theta = (rnd() - 0.5) * Math.PI * 1.7;          // uglavnom na prednjoj strani
      const y = 0.45 + rnd() * 2.5;
      const size = 0.01 + Math.pow(rnd(), 3) * 0.04;
      p.set(Math.sin(theta) * 1.004, y, Math.cos(theta) * 1.004);
      q.setFromAxisAngle(up, theta);
      sc.set(size, size * (1.1 + rnd() * 0.5), size * 0.45);
      dropMatrices.push(m.compose(p, q, sc).clone());
    }
  }

  // jedna limenka: telo sa nalepnicom, dno, vrh, jezičak, kapljice, senka i odraz u podu
  FLAVORS.forEach((f, i) => {
    const labelCanvas = Object.assign(document.createElement("canvas"), { width: W, height: H });
    const tex = new THREE.CanvasTexture(labelCanvas);
    tex.colorSpace = THREE.SRGBColorSpace;
    tex.anisotropy = renderer.capabilities.getMaxAnisotropy();
    const label = new THREE.MeshPhysicalMaterial({ map: tex, metalness: 0.4, roughness: 0.34, clearcoat: 1, clearcoatRoughness: 0.12 });
    const metal = new THREE.MeshStandardMaterial({ color: 0xdfe3e8, metalness: 1, roughness: 0.27, side: THREE.DoubleSide });
    const mouth = new THREE.MeshStandardMaterial({ color: 0xc9ced4, metalness: 1, roughness: 0.4 });
    const drop = new THREE.MeshPhysicalMaterial({ color: 0xffffff, metalness: 0, roughness: 0.02, clearcoat: 1, transparent: true, opacity: 0, envMapIntensity: 2.2 });

    const buildParts = withDrops => {
      const parts = new THREE.Group();
      const body = new THREE.Mesh(GEO.body, label); body.position.y = 1.7; body.userData.index = i;
      parts.add(body, new THREE.Mesh(GEO.bottom, metal), new THREE.Mesh(GEO.top, metal));
      const tab = new THREE.Mesh(GEO.tab, metal); tab.rotation.x = -Math.PI / 2; tab.position.set(0, 3.42, 0.05);
      const rivet = new THREE.Mesh(GEO.rivet, metal); rivet.position.set(0, 3.43, -0.13);
      const m = new THREE.Mesh(GEO.mouth, mouth); m.scale.set(1, 0.72, 1); m.rotation.x = -Math.PI / 2; m.position.set(0, 3.418, 0.5);
      parts.add(tab, rivet, m);
      let drops = null;
      if (withDrops) {
        drops = new THREE.InstancedMesh(GEO.drop, drop, DROPS);
        dropMatrices.forEach((mat, k) => drops.setMatrixAt(k, mat));
        parts.add(drops);
      }
      return { parts, body, drops };
    };

    const group = new THREE.Group();          // stoji na podu, pomera se po liniji
    group.position.y = FLOOR_Y;
    const spin = new THREE.Group();
    const real = buildParts(true);
    spin.add(real.parts);
    group.add(spin);

    const mirror = new THREE.Group();         // odraz: ista limenka okrenuta naopako ispod poda
    mirror.scale.y = -1;
    const mirrorSpin = new THREE.Group();
    mirrorSpin.add(buildParts(false).parts);
    mirror.add(mirrorSpin);
    group.add(mirror);

    const shadow = new THREE.Mesh(new THREE.PlaneGeometry(3.2, 3.2), new THREE.MeshBasicMaterial({ map: shadowTex, transparent: true, depthWrite: false }));
    shadow.rotation.x = -Math.PI / 2; shadow.position.y = 0.006; shadow.renderOrder = 3;
    group.add(shadow);

    scene.add(group);
    cans.push({ f, group, spin, mirrorSpin, body: real.body, drops: real.drops, labelCanvas, tex, label, metal, mouth, drop });
  });

  // pod: pokriva odraz bojom pozadine, pa se odraz vidi samo blago, bliže limenkama
  floorMat = new THREE.MeshBasicMaterial({
    color: new THREE.Color(FLAVORS[0].bg), transparent: true, depthWrite: false, toneMapped: false,
    alphaMap: canvasTexture(8, 256, (g, w, h) => {
      const gr = g.createLinearGradient(0, 0, 0, h);   // gore = daleko, dole = blizu kamere
      gr.addColorStop(0, "#000"); gr.addColorStop(0.2, "#000"); gr.addColorStop(0.3, "#c4c4c4"); gr.addColorStop(0.37, "#cdcdcd"); gr.addColorStop(0.55, "#fff"); gr.addColorStop(1, "#fff");
      g.fillStyle = gr; g.fillRect(0, 0, w, h);
    }, false)
  });
  const floor = new THREE.Mesh(new THREE.PlaneGeometry(90, 30), floorMat);
  floor.rotation.x = -Math.PI / 2;
  floor.position.set(0, FLOOR_Y + 0.002, 5);
  floor.renderOrder = 2;
  scene.add(floor);

  // svetlosni snop i svetla mrlja na podu u sredini
  beam = new THREE.Mesh(new THREE.PlaneGeometry(5.4, 9.5), new THREE.MeshBasicMaterial({
    transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, opacity: 0.15,
    map: canvasTexture(256, 512, (g, w, h) => {
      const gr = g.createLinearGradient(0, 0, 0, h);
      gr.addColorStop(0, "rgba(255,240,220,.9)"); gr.addColorStop(1, "rgba(255,240,220,0)");
      g.fillStyle = gr; g.beginPath(); g.moveTo(w * .42, 0); g.lineTo(w * .58, 0); g.lineTo(w, h); g.lineTo(0, h); g.closePath(); g.fill();
      g.globalCompositeOperation = "destination-in";
      const side = g.createLinearGradient(0, 0, w, 0);
      side.addColorStop(0, "rgba(0,0,0,0)"); side.addColorStop(.5, "#000"); side.addColorStop(1, "rgba(0,0,0,0)");
      g.fillStyle = side; g.fillRect(0, 0, w, h);
    })
  }));
  beam.position.set(0, 2.9, -1.8);
  scene.add(beam);
  pool = new THREE.Mesh(new THREE.PlaneGeometry(7, 3.4), new THREE.MeshBasicMaterial({
    transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, opacity: 0.2,
    map: canvasTexture(256, 256, (g, w, h) => {
      const gr = g.createRadialGradient(w / 2, h / 2, 0, w / 2, h / 2, w / 2);
      gr.addColorStop(0, "rgba(255,240,220,1)"); gr.addColorStop(1, "rgba(255,240,220,0)");
      g.fillStyle = gr; g.fillRect(0, 0, w, h);
    })
  }));
  pool.rotation.x = -Math.PI / 2; pool.position.set(0, FLOOR_Y + 0.004, 0.2); pool.renderOrder = 4;
  scene.add(pool);
}

function buildLabels() {
  cans.forEach(c => { drawLabel(c.f, c.labelCanvas); c.tex.needsUpdate = true; });
}

/* ---------- Veličina ---------- */
let narrow = false, camBaseZ = 13;
function resize() {
  if (!renderer) return;
  const { clientWidth: w, clientHeight: h } = canvas;
  if (!w || !h) return;
  renderer.setSize(w, h, false);
  camera.aspect = w / h;
  narrow = innerWidth <= 860;
  camBaseZ = camera.aspect < 0.8 ? 18.5 : 13;
  camera.updateProjectionMatrix();
}
if (renderer) new ResizeObserver(resize).observe(canvas);

/* ---------- Stanje linije ---------- */
let index = 0, pos = 0, openAmt = 0, isOpen = false, paused = false, swayTime = 0;
const hero = $("#flavors");
const bgNow = new THREE.Color(FLAVORS[0].bg), bgTarget = new THREE.Color(FLAVORS[0].bg);

function updateText(animate) {
  const f = FLAVORS[index];
  $("#count").textContent = `${pad(index + 1)} / ${pad(FLAVORS.length)} · picked in ${MONTHS[f.months[0] - 1]}`;
  $("#prev").disabled = index === 0;
  $("#next").disabled = index === FLAVORS.length - 1;
  bgTarget.set(f.bg);
  document.documentElement.style.setProperty("--fruit", f.soft);
  const els = [$("#name"), $("#tagline"), $("#bigword")];
  const write = () => { els[0].textContent = f.name; els[1].textContent = f.tagline; els[2].textContent = f.word; };
  if (!animate || reduce) return write();
  els.forEach(el => el.classList.add("out"));
  clearTimeout(updateText.t);
  updateText.t = setTimeout(() => { write(); els.forEach(el => el.classList.remove("out")); }, 220);
}

function fillDetail() {
  const f = FLAVORS[index];
  $("#d-name").textContent = f.name;
  $("#d-desc").textContent = f.desc;
  $("#d-price").textContent = euro(f.price);
  const meter = (label, n) => `<div class="meter"><span>${label}</span><i role="img" aria-label="${n} out of 5">${[1, 2, 3, 4, 5].map(k => `<b class="${k <= n ? "on" : ""}"></b>`).join("")}</i></div>`;
  $("#d-taste").innerHTML = meter("Sweet", f.sweet) + meter("Tart", f.tart);
  $("#d-nutri").innerHTML = [["Energy", `${f.kcal} kcal`], ["Carbohydrate", `${f.carbs.toFixed(1)} g`], ["of which sugars", `${f.sugar.toFixed(1)} g`], ["Protein", "0.4 g"], ["Salt", "0 g"]]
    .map(([k, val]) => `<tr><td>${k}</td><td>${val}</td></tr>`).join("");
  $("#d-ing").textContent = `${f.name} juice (100%). No added sugar, no preservatives, never from concentrate.`;
  $("#d-chips").innerHTML = ["330 ml", `${Math.round(f.kcal * 3.3)} kcal per can`, `Best: ${f.best.toLowerCase()}`].map(t => `<span>${t}</span>`).join("");
}

function setHash() {
  const h = "#" + FLAVORS[index].id + (isOpen ? "-details" : "");
  if (location.hash !== h) history.replaceState(null, "", h);
}

function go(i, fromUser = true) {
  i = Math.max(0, Math.min(FLAVORS.length - 1, i));
  if (isOpen) close(false);
  if (i === index) return;
  index = i;
  updateText(true);
  if (fromUser) setHash();
  if (reduce) pos = index;
}
function open() {
  if (isOpen) return;
  isOpen = true;
  fillDetail();
  hero.classList.add("open");
  setHash();
  if (reduce) openAmt = 1;
  if (narrow) setTimeout(() => $("#detail").scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "start" }), 450);
  setTimeout(() => $("#back").focus({ preventScroll: true }), reduce ? 0 : 650);
}
function close(focusCanvas = true) {
  if (!isOpen) return;
  isOpen = false;
  hero.classList.remove("open");
  setHash();
  if (reduce) openAmt = 0;
  if (focusCanvas) canvas.focus({ preventScroll: true });
}

$("#prev").addEventListener("click", () => go(index - 1));
$("#next").addEventListener("click", () => go(index + 1));
$("#back").addEventListener("click", () => close());
$("#d-add").addEventListener("click", () => addToBag(FLAVORS[index].id));
canvas.addEventListener("keydown", e => {
  if (e.key === "ArrowLeft") { e.preventDefault(); go(index - 1); }
  else if (e.key === "ArrowRight") { e.preventDefault(); go(index + 1); }
  else if (e.key === "Enter" || e.key === " ") { e.preventDefault(); isOpen ? close() : open(); }
});
addEventListener("keydown", e => { if (e.key === "Escape" && isOpen && !$("#bag").open) close(); });

function readHash(scroll) {
  const [id, mode] = location.hash.slice(1).split("-");
  const i = FLAVORS.findIndex(f => f.id === id);
  if (i < 0) return;
  if (i !== index) { index = i; pos = i; updateText(false); }
  if (mode === "details") open(); else close(false);
  if (scroll) hero.scrollIntoView({ behavior: reduce ? "auto" : "smooth" });
}
addEventListener("hashchange", () => readHash(true));

const pauseBtn = $("#pause");
if (reduce || !renderer) pauseBtn.hidden = true;
pauseBtn.addEventListener("click", () => {
  paused = !paused;
  pauseBtn.textContent = paused ? "Play" : "Pause";
  pauseBtn.setAttribute("aria-pressed", paused);
});

/* ---------- Prevlačenje i klik na limenku ---------- */
const ray = new THREE.Raycaster();
const pointer = new THREE.Vector2();
let down = null;

function hitIndex(e) {
  const r = canvas.getBoundingClientRect();
  pointer.set(((e.clientX - r.left) / r.width) * 2 - 1, -((e.clientY - r.top) / r.height) * 2 + 1);
  ray.setFromCamera(pointer, camera);
  const hit = ray.intersectObjects(cans.map(c => c.body), false)[0];
  return hit ? hit.object.userData.index : -1;
}
const unitsPerPixel = () => (2 * camera.position.z * Math.tan(THREE.MathUtils.degToRad(camera.fov / 2)) * camera.aspect) / canvas.clientWidth;

if (renderer) {
  canvas.addEventListener("pointerdown", e => {
    down = { x: e.clientX, pos, moved: false, lastX: e.clientX, lastT: e.timeStamp, vel: 0 };
    canvas.setPointerCapture(e.pointerId);
  });
  canvas.addEventListener("pointermove", e => {
    if (!down) { canvas.classList.toggle("pointing", hitIndex(e) >= 0); return; }
    const dx = e.clientX - down.x;
    if (Math.abs(dx) > 6) down.moved = true;
    if (!down.moved || isOpen) return;
    canvas.classList.add("grabbing");
    pos = Math.max(-0.4, Math.min(FLAVORS.length - 0.6, down.pos - (dx * unitsPerPixel()) / 2.4));
    const dt = Math.max(8, e.timeStamp - down.lastT);
    down.vel = ((e.clientX - down.lastX) * unitsPerPixel() / 2.4) / dt * 1000;
    down.lastX = e.clientX; down.lastT = e.timeStamp;
  });
  canvas.addEventListener("pointerup", e => {
    if (!down) return;
    canvas.classList.remove("grabbing");
    if (!down.moved) {
      const i = hitIndex(e);
      if (i === index) isOpen ? close() : open();
      else if (i >= 0) go(i);
      else if (isOpen) close();
    } else if (!isOpen) {
      const i = Math.max(0, Math.min(FLAVORS.length - 1, Math.round(pos - down.vel * 0.18)));
      if (i !== index) { index = i; updateText(true); setHash(); }
    }
    down = null;
  });
  canvas.addEventListener("pointercancel", () => { down = null; canvas.classList.remove("grabbing"); });
}

/* ---------- Petlja crtanja ---------- */
const damp = (cur, target, speed, dt) => cur + (target - cur) * (1 - Math.exp(-speed * dt));
const ease = p => p < .5 ? 4 * p * p * p : 1 - Math.pow(-2 * p + 2, 3) / 2;

// raspored "cover flow": srednja napred, ostale bliže jedna drugoj i okrenute ka sredini
function slot(d) {
  const a = Math.abs(d), s = Math.sign(d);
  return {
    x: s * (a <= 1 ? a * 2.7 : 2.7 + (a - 1) * 1.6),
    z: -(Math.min(a, 1) * 1.4 + Math.max(0, a - 1) * 0.5),
    rot: -Math.max(-1, Math.min(1, d)) * 0.85,
    scale: 1 - Math.min(a, 1) * 0.1 - Math.max(0, a - 1) * 0.03
  };
}

let running = false, ready = false, heroVisible = false, bagOpen = false, last = 0, lastBg = "";
// uvod: limenke stoje u mraku, svetla se pale od krajeva ka sredini, a kamera polako prilazi
let introStart = -1, introIndex = 0, introFar = 0;
const clamp01 = t => Math.min(1, Math.max(0, t));

function frame(now) {
  if (!running) return;
  const dt = Math.min(0.05, (now - last) / 1000 || 0);
  last = now;
  if (introStart < 0) {
    introStart = now; introIndex = index;
    introFar = Math.max(...cans.map((_, i) => Math.abs(i - index)));
  }
  const it = reduce ? 99 : (now - introStart) / 1000;
  const beamK = ease(clamp01((it - 0.5 - introFar * 0.22) / 0.7));
  const dolly = 3.2 * (1 - ease(clamp01(it / 2.8)));
  camera.position.set(0, 0.9, camBaseZ + dolly);
  camera.lookAt(0, -0.45, 0);
  if (beamK > 0 && !hero.classList.contains("lit")) hero.classList.add("lit");
  if (!down || !down.moved) pos = reduce ? index : damp(pos, index, 7, dt);
  openAmt = reduce ? (isOpen ? 1 : 0) : damp(openAmt, isOpen ? 1 : 0, 4.2, dt);
  if (!reduce && !paused) swayTime += dt;
  const o = ease(Math.min(1, Math.max(0, openAmt)));
  const shiftX = narrow ? 0 : -3 * o;   // u detaljima limenka ide levo, desno je panel

  cans.forEach((c, i) => {
    const d = i - pos;
    const focus = Math.max(0, 1 - Math.abs(d));
    const current = i === index;
    const s = slot(d);
    const x = s.x + (current ? shiftX : Math.sign(d) * 3.2 * o + shiftX * 0.5);
    c.group.position.set(x, FLOOR_Y, s.z);
    c.group.scale.setScalar(s.scale);
    let rot = s.rot;
    if (current) rot += BACK_ANGLE * o + Math.sin(swayTime * 0.9) * 0.12 * focus * (1 - o);
    c.spin.rotation.y = rot;
    c.mirrorSpin.rotation.y = rot;

    // srednja je pod svetlom, ostale tamnije ali čitljive
    let light = 0.42 + 0.58 * focus;
    if (!current) light *= 1 - 0.55 * o;
    const lightOn = 0.08 + 0.92 * ease(clamp01((it - 0.35 - (introFar - Math.abs(i - introIndex)) * 0.22) / 0.55));
    light *= lightOn;
    c.label.color.setScalar(light); c.label.envMapIntensity = 0.35 + 0.65 * light;
    c.metal.color.setScalar(0.88 * light); c.metal.envMapIntensity = 0.3 + 0.7 * light;
    c.mouth.color.setScalar(0.8 * light);
    c.drop.opacity = 0.3 * focus * focus * lightOn;
    c.drops.visible = focus > 0.05;
    c.group.visible = Math.abs(x) < 14;
  });

  beam.position.x = shiftX; pool.position.x = shiftX;
  beam.material.opacity = 0.15 * beamK; pool.material.opacity = 0.2 * beamK;

  // pozadina naslovne prati ukus; ista boja ide i na pod u 3D sceni
  if (reduce) bgNow.copy(bgTarget); else bgNow.lerp(bgTarget, 1 - Math.exp(-3.5 * dt));
  floorMat.color.copy(bgNow);
  const hex = "#" + bgNow.getHexString(THREE.SRGBColorSpace);
  if (hex !== lastBg) { document.documentElement.style.setProperty("--bg", hex); lastBg = hex; }

  renderer.render(scene, camera);
  if (!hero.classList.contains("ready")) hero.classList.add("ready");   // sakrij sliku za učitavanje
  requestAnimationFrame(frame);
}
function setRunning() {
  const on = Boolean(renderer && ready && heroVisible && !bagOpen);
  if (on === running) return;
  running = on;
  if (on) { last = performance.now(); requestAnimationFrame(frame); }
}

/* ---------- Navigacija: tamna preko naslovne, svetla ispod ---------- */
const nav = $("#nav");
new IntersectionObserver(([entry]) => {
  nav.classList.toggle("on-paper", !entry.isIntersecting);
}, { rootMargin: "-64px 0px 0px 0px" }).observe(hero);
new IntersectionObserver(([entry]) => { heroVisible = entry.isIntersecting; setRunning(); }).observe(hero);

/* ---------- Korpa ---------- */
const bag = new Map();
const BAG_KEY = "morrow-bag";
function loadBag() {
  try {
    const saved = JSON.parse(localStorage.getItem(BAG_KEY) || "[]");
    for (const [id, qty] of saved) if (PRODUCTS[id] && Number.isInteger(qty) && qty > 0 && qty < 100) bag.set(id, qty);
  } catch (e) { /* privatni prozor ili blokiran storage: korpa samo ne pamti */ }
}
function saveBag() {
  try { localStorage.setItem(BAG_KEY, JSON.stringify([...bag])); } catch (e) { /* isto */ }
}
const bagDialog = $("#bag");
const toastEl = $("#toast");
let toastTimer = 0;
function toast(text) {
  toastEl.textContent = text;
  toastEl.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toastEl.classList.remove("show"), 2200);
}
function renderBag() {
  let count = 0, total = 0;
  const rows = [...bag].map(([id, qty]) => {
    const p = PRODUCTS[id];
    count += qty; total += qty * p.price;
    return `<li><span class="dot" style="--c:${p.color}"></span>
      <span><span class="item-name">${p.name}</span><span class="item-price">${euro(p.price)} each</span></span>
      <span class="qty"><button type="button" data-dec="${id}" aria-label="Remove one ${p.name}">−</button>${qty}<button type="button" data-inc="${id}" aria-label="Add one ${p.name}">+</button></span></li>`;
  });
  $("#bag-list").innerHTML = rows.length ? rows.join("") : '<li class="bag-empty">Your bag is empty. Pick a flavor from the row of cans.</li>';
  $("#bag-total").textContent = euro(total);
  $("#bag-count").textContent = count;
  $("#bag-open").setAttribute("aria-label", `Open bag, ${count} item${count === 1 ? "" : "s"}`);
  saveBag();
}
function addToBag(id) {
  bag.set(id, (bag.get(id) || 0) + 1);
  renderBag();
  const badge = $("#bag-count");
  badge.classList.remove("bump"); void badge.offsetWidth; badge.classList.add("bump");
  toast(`${PRODUCTS[id].name} added to your bag`);
}
$("#bag-list").addEventListener("click", e => {
  const inc = e.target.closest("[data-inc]"), dec = e.target.closest("[data-dec]");
  if (inc) bag.set(inc.dataset.inc, bag.get(inc.dataset.inc) + 1);
  if (dec) { const id = dec.dataset.dec, q = bag.get(id) - 1; q > 0 ? bag.set(id, q) : bag.delete(id); }
  if (inc || dec) renderBag();
});
document.querySelectorAll("[data-add]").forEach(b => b.addEventListener("click", () => addToBag(b.dataset.add)));
$("#bag-open").addEventListener("click", () => { bagDialog.showModal(); bagOpen = true; setRunning(); });
bagDialog.addEventListener("close", () => { bagOpen = false; setRunning(); });
$("#bag-close").addEventListener("click", () => bagDialog.close());
bagDialog.addEventListener("click", e => { if (e.target === bagDialog) bagDialog.close(); });

/* ---------- Kalendar berbe ---------- */
(function harvestCalendar() {
  const today = new Date();
  const month = today.getMonth() + 1;
  const nowX = ((today.getMonth() + (today.getDate() - 1) / 31) / 12) * 100;
  $("#cal-rows").innerHTML = FLAVORS.map(f => {
    const [a, b] = f.months;
    const when = a === b ? MONTHS[a - 1] : `${MONTHS[a - 1]} to ${MONTHS[b - 1]}`;
    return `<div class="cal-row" role="row">
      <span class="cal-fruit" role="rowheader"><i style="--c:${f.fruit}"></i>${f.name}</span>
      <div class="cal-track" role="cell">
        <span class="cal-bar" style="--c:${f.fruit}; grid-column:${a} / ${b + 1}"></span>
        <span class="sr">${when}</span>
        <span class="cal-now" style="--x:${nowX.toFixed(2)}%" aria-hidden="true"></span>
      </div>
    </div>`;
  }).join("");
  const inSeason = FLAVORS.filter(f => month >= f.months[0] && month <= f.months[1]).map(f => f.name.toLowerCase());
  const list = inSeason.length > 1 ? `${inSeason.slice(0, -1).join(", ")} and ${inSeason.at(-1)}` : inSeason[0];
  const next = FLAVORS.find(f => f.months[0] > month) || FLAVORS[0];
  $("#in-season").textContent = inSeason.length
    ? `In season now: ${list}.`
    : `Nothing is in season right now. Next up: ${next.name.toLowerCase()} in ${MONTHS[next.months[0] - 1]}.`;
  $("#footer-flavors").innerHTML = FLAVORS.map(f => `<li><a href="#${f.id}">${f.name}</a></li>`).join("");
})();

/* ---------- Newsletter ---------- */
$("#signup").addEventListener("submit", e => {
  e.preventDefault();
  const email = $("#email").value.trim();
  const msg = $("#form-msg");
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    msg.textContent = "Please enter a valid email address.";
    $("#email").focus();
    return;
  }
  msg.textContent = "Thanks! This is a demo site, so your email wasn't saved anywhere.";
  e.target.reset();
});

/* ---------- Pokretanje ---------- */
loadBag();
renderBag();
updateText(false);
readHash(false);
pos = index;
const fontsReady = Promise.race([
  Promise.all([
    document.fonts.load(`900 100px ${DISPLAY}`), document.fonts.load(`800 60px ${DISPLAY}`),
    document.fonts.load(`500 30px ${MONO}`), document.fonts.load(`400 30px ${MONO}`)
  ]),
  new Promise(r => setTimeout(r, 1500))
]);
fontsReady.then(() => {
  if (!renderer) return;
  buildLabels();
  resize();
  ready = true;
  setRunning();
  document.fonts.ready.then(buildLabels);
});

/* Autorska prava: kad sajt radi na tuđem domenu, prikaže link ka originalu. Za sopstveni domen dodaj ga u HOMES. */
(function () {
  var HOMES = ["vojvodixdev.github.io", "localhost", "127.0.0.1", "[::1]", ""];
  var host = location.hostname;
  if (HOMES.indexOf(host) > -1 || /\.localhost$/.test(host)) return;
  var link = document.createElement("a");
  link.className = "nv-original";
  link.href = "https://vojvodixdev.github.io/";
  link.textContent = "Original work by Nikola Vojvodić";
  link.setAttribute("data-nv", "nv:cebe1f9421");
  document.body.appendChild(link);
  console.warn("This page is a copy of work by Nikola Vojvodić (© 2026, all rights reserved): https://vojvodixdev.github.io/ [nv:cebe1f9421]");
})();
