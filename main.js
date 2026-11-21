import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.160.0/build/three.module.js";

const S = window.SITE, P = S.projects;
const $ = s => document.querySelector(s);
const esc = s => String(s ?? "").replace(/[&<>"]/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]));
const clamp = (v, a, b) => Math.min(b, Math.max(a, v));
const pad = n => String(n).padStart(2, "0");
let reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
const calm = $("#calm"); calm.setAttribute("aria-pressed", reduce); calm.onclick = () => { reduce = !reduce; calm.setAttribute("aria-pressed", reduce); };

/* ---------- stops: home, each project, about, contact ---------- */
const ABOUT = P.length + 1, CONTACT = P.length + 2, N = P.length + 3, SP = 38;
const camZ = stop => 12 - stop * SP;
let cur = 0, target = 0, modalOpen = false;
const goTo = i => { target = clamp(i, 0, N - 1); };

/* ---------- fill the page from content.js ---------- */
document.title = `${S.name}, ${S.role}`;
(document.querySelector("meta[name=description]") || document.head.appendChild(Object.assign(document.createElement("meta"), {name: "description"}))).content = S.description;
$("#name").textContent = S.name; $("#role").textContent = S.role; $("#tagline").textContent = S.tagline;
const A = S.about, C = S.contact;
$("#about").innerHTML = `<h2>${esc(A.title)}</h2>${A.text.map(t => `<p>${esc(t)}</p>`).join("")}
  <h3>Skills</h3><ul>${A.skills.map(s => `<li>${esc(s)}</li>`).join("")}</ul>
  <h3>Recognition</h3><ul>${A.recognition.map(s => `<li>${esc(s)}</li>`).join("")}</ul>`;
$("#contact").innerHTML = `<p class="eyebrow">${esc(C.lead)}</p><a class="big" href="mailto:${esc(C.email)}">${esc(C.email)}</a>
  <div class="soc">${C.socials.map(s => `<a class="glass" href="${esc(s.url)}" target="_blank" rel="noopener">${esc(s.label)} ↗</a>`).join("")}</div>`;
$("#sr").innerHTML = P.map((p, i) => `<li><a href="#" data-p="${i}">${esc(p.title)}</a>, ${esc(p.year)}</li>`).join("");

const links = [["Home", 0], ...(P.length ? [["Work", 1]] : []), ["About", ABOUT], ["Contact", CONTACT]];
$("#nav").innerHTML = links.map(([l, s]) => `<a href="#" data-s="${s}" data-text="${l}">${l}</a>`).join("");
const labels = ["Home", ...P.map(p => p.title), "About", "Contact"];
$("#dots").innerHTML = labels.map((l, i) => `<li><button data-s="${i}" aria-label="${esc(l)}"></button></li>`).join("");
document.addEventListener("click", e => {
  const s = e.target.closest("[data-s]"); if (s) { e.preventDefault(); goTo(+s.dataset.s); }
  const p = e.target.closest("[data-p]"); if (p) { e.preventDefault(); openProject(+p.dataset.p); }
});

/* ---------- project window ---------- */
function openProject(i) {
  const p = P[i]; modalOpen = true;
  $("#min").innerHTML = `<p class="eyebrow">${esc(p.kind)} for ${esc(p.client || "")}, ${esc(p.year)}</p><h2>${esc(p.title)}</h2>
    <p class="eyebrow">${(p.tags || []).map(esc).join(", ")}</p><p class="t">${esc(p.text)}</p>
    ${p.url ? `<a class="btn glass" style="display:inline-block;text-decoration:none" href="${esc(p.url)}" target="_blank" rel="noopener">View live ↗</a>` : ""}
    <div class="shots">${(p.images || []).map((s, k) => `<div>${s ? `<img src="${esc(s)}" alt="${esc(p.title)} ${k + 1}" loading="lazy">` : pad(k + 1)}</div>`).join("")}</div>`;
  $("#modal").hidden = false; $("#mx").focus();
}
const closeModal = () => { modalOpen = false; $("#modal").hidden = true; };
$("#mx").onclick = closeModal;
$("#copen").onclick = () => { const i = Math.round(cur) - 1; if (P[i]) openProject(i); };

/* ---------- preloader ---------- */
(async () => {
  try { await document.fonts.ready; } catch (e) {}
  let n = 0; const t = setInterval(() => {
    n = Math.min(100, n + 2 + Math.random() * 6); $("#pn").textContent = Math.floor(n);
    if (n >= 100) { clearInterval(t); setTimeout(() => { $("#pre").classList.add("out"); setTimeout(() => $("#pre").remove(), 800); }, 150); }
  }, 40);
})();

/* ---------- WebGL scene ---------- */
let renderer = null;
try { renderer = new THREE.WebGLRenderer({canvas: $("#gl"), antialias: true, powerPreference: "high-performance"}); }
catch (e) { document.documentElement.classList.add("nogl"); }
if (renderer) init3D();

function init3D() {
  renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
  renderer.setClearColor(0x0E0805, 1);
  const scene = new THREE.Scene();
  scene.fog = new THREE.FogExp2(0x0E0805, 0.006);
  const camera = new THREE.PerspectiveCamera(60, 1, 0.1, 500);
  const END = camZ(N - 1) - 80;

  /* drifting light dust */
  const count = innerWidth < 760 ? 6000 : 15000, pos = new Float32Array(count * 3), seed = new Float32Array(count), size = new Float32Array(count);
  for (let i = 0; i < count; i++) {
    let x, y; do { x = (Math.random() - .5) * 90; y = (Math.random() - .5) * 60; } while (Math.abs(x) < 3 && Math.abs(y) < 3);
    pos.set([x, y, 30 + Math.random() * (END - 30)], i * 3); seed[i] = Math.random(); size[i] = .5 + Math.random() * 1.6;
  }
  const geo = new THREE.BufferGeometry();
  geo.setAttribute("position", new THREE.BufferAttribute(pos, 3));
  geo.setAttribute("aSeed", new THREE.BufferAttribute(seed, 1));
  geo.setAttribute("aSize", new THREE.BufferAttribute(size, 1));
  const uni = {uTime: {value: 0}, uPx: {value: renderer.getPixelRatio()}};
  const dust = new THREE.Points(geo, new THREE.ShaderMaterial({
    uniforms: uni, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending,
    vertexShader: `uniform float uTime,uPx;attribute float aSeed,aSize;varying float vA;varying vec3 vC;
      void main(){vec3 p=position;p.x+=sin(uTime*.2+aSeed*40.)*.6;p.y+=cos(uTime*.17+aSeed*31.)*.6;
      vec4 mv=modelViewMatrix*vec4(p,1.);gl_Position=projectionMatrix*mv;float d=-mv.z;
      gl_PointSize=aSize*uPx*(60./max(d,1.));
      vA=smoothstep(0.,6.,d)*(1.-smoothstep(90.,170.,d))*(.55+.45*sin(uTime*(1.+aSeed*3.)+aSeed*60.));
      vC=mix(vec3(1.,.68,.3),vec3(1.,.94,.82),aSeed*aSeed);}`,
    fragmentShader: `varying float vA;varying vec3 vC;void main(){float r=length(gl_PointCoord-.5);gl_FragColor=vec4(vC,smoothstep(.5,0.,r)*vA*.9);}`
  }));
  dust.frustumCulled = false; scene.add(dust);

  /* fibres along the corridor */
  const lp = [];
  for (let x = -30; x <= 30; x += 10) for (let y = -20; y <= 20; y += 10) lp.push(x, y, 40, x, y, END);
  const lg = new THREE.BufferGeometry(); lg.setAttribute("position", new THREE.Float32BufferAttribute(lp, 3));
  scene.add(new THREE.LineSegments(lg, new THREE.LineBasicMaterial({color: 0xC9974A, transparent: true, opacity: .14, blending: THREE.AdditiveBlending, depthWrite: false})));

  /* disco ball render from leborrel.nl, blended additively so its dark backdrop vanishes */
  const bt = new THREE.TextureLoader().load("images/discoball.webp", t => { t.colorSpace = THREE.SRGBColorSpace; });
  const ball = new THREE.Mesh(new THREE.PlaneGeometry(7, 7), new THREE.MeshBasicMaterial({map: bt, transparent: true, blending: THREE.AdditiveBlending, depthWrite: false, fog: false}));
  ball.position.set(innerWidth < 760 ? 0 : 4.6, 1.5, -6); scene.add(ball);

  /* project panels */
  const loader = new THREE.TextureLoader();
  const placeholder = (p, i) => {
    const c = document.createElement("canvas"); c.width = 1024; c.height = 640; const g = c.getContext("2d"), h = (45 + i * 22) % 360;
    const gr = g.createLinearGradient(0, 0, 1024, 640); gr.addColorStop(0, `oklch(.22 .05 ${h})`); gr.addColorStop(1, `oklch(.62 .13 ${(h + 30) % 360})`);
    g.fillStyle = gr; g.fillRect(0, 0, 1024, 640); g.fillStyle = "rgba(255,255,255,.14)"; g.font = "700 380px 'Playfair Display', Georgia, serif"; g.fillText(pad(i + 1), 48, 600);
    const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; return t;
  };
  const panels = P.map((p, i) => {
    const mat = new THREE.MeshBasicMaterial({map: placeholder(p, i), transparent: true, opacity: 0, toneMapped: false});
    const m = new THREE.Mesh(new THREE.PlaneGeometry(15, 9.4), mat);
    m.position.set((i % 2 ? 1 : -1) * 4.5, ((i % 3) - 1) * 1.2, camZ(i + 1) - 19);
    m.userData = {i, stop: i + 1};
    m.add(new THREE.LineSegments(new THREE.EdgesGeometry(m.geometry), new THREE.LineBasicMaterial({color: 0xE0B565, transparent: true, opacity: 0})));
    scene.add(m);
    if (p.cover) loader.load(p.cover, t => { t.colorSpace = THREE.SRGBColorSpace; mat.map = t; mat.needsUpdate = true; });
    return m;
  });

  /* input */
  let snap, ptrX = 0, ptrY = 0, down = null;
  const nudge = d => { if (modalOpen) return; target = clamp(target + d, 0, N - 1); clearTimeout(snap); snap = setTimeout(() => { target = Math.round(target); }, 220); };
  addEventListener("wheel", e => { if (modalOpen) return; e.preventDefault(); nudge(clamp(e.deltaY, -120, 120) * .0011); }, {passive: false});
  let ty = null;
  addEventListener("touchstart", e => { ty = e.touches[0].clientY; }, {passive: true});
  addEventListener("touchmove", e => { if (modalOpen || ty === null) return; const y = e.touches[0].clientY; nudge((ty - y) / innerHeight * 1.6); ty = y; e.preventDefault(); }, {passive: false});
  addEventListener("keydown", e => {
    if (e.key === "Escape") return closeModal();
    if (modalOpen) return;
    const r = Math.round(target);
    if (["ArrowDown", "ArrowRight", "PageDown", " "].includes(e.key)) { e.preventDefault(); goTo(r + 1); }
    else if (["ArrowUp", "ArrowLeft", "PageUp"].includes(e.key)) { e.preventDefault(); goTo(r - 1); }
    else if (e.key === "Home") goTo(0); else if (e.key === "End") goTo(N - 1);
  });
  const ray = new THREE.Raycaster(), v2 = new THREE.Vector2();
  const hit = e => { v2.set(e.clientX / innerWidth * 2 - 1, -(e.clientY / innerHeight) * 2 + 1); ray.setFromCamera(v2, camera);
    return ray.intersectObjects(panels.filter(m => m.material.opacity > .5), false)[0]?.object; };
  addEventListener("pointermove", e => { ptrX = e.clientX / innerWidth * 2 - 1; ptrY = e.clientY / innerHeight * 2 - 1; if (!modalOpen) document.body.style.cursor = hit(e) ? "pointer" : ""; });
  addEventListener("pointerdown", e => { down = [e.clientX, e.clientY]; });
  addEventListener("pointerup", e => {
    if (modalOpen || !down || e.target.closest("a,button,.glass")) return;
    if (Math.hypot(e.clientX - down[0], e.clientY - down[1]) < 6) { const o = hit(e); if (o) openProject(o.userData.i); }
  });

  /* overlays */
  const sections = [[$("#hero"), 0], [$("#about"), ABOUT], [$("#contact"), CONTACT]];
  const cap = $("#cap"); let capI = -1;
  const setCap = i => { capI = i; const p = P[i]; if (!p) return;
    $("#cmeta").textContent = `${p.kind} for ${p.client || ""}, ${p.year}`; $("#ctitle").textContent = p.title; $("#ctags").textContent = (p.tags || []).join(", "); };
  const show = (el, o, shift) => { el.style.opacity = o; el.style.visibility = o > .02 ? "visible" : "hidden"; el.dataset.sh = shift; };
  const navEls = [...document.querySelectorAll("#nav a")], dotEls = [...document.querySelectorAll("#dots button")];
  function overlay() {
    const near = Math.round(cur);
    for (const [el, s] of sections) { const o = clamp(1 - Math.abs(cur - s) * 2.2, 0, 1); show(el, o, 0);
      el.style.translate = `0 ${(s - cur) * 24}px`; }
    const pi = near - 1; if (pi >= 0 && pi < P.length && pi !== capI) setCap(pi);
    const co = pi >= 0 && pi < P.length ? clamp(1 - Math.abs(cur - near) * 2.2, 0, 1) : 0; show(cap, co, 0);
    navEls.forEach(a => a.classList.toggle("cur", +a.dataset.s === near || (+a.dataset.s === 1 && near >= 1 && near <= P.length)));
    dotEls.forEach((d, i) => d.classList.toggle("cur", i === near));
  }

  /* loop */
  const resize = () => { renderer.setSize(innerWidth, innerHeight, false); camera.aspect = innerWidth / innerHeight; camera.fov = camera.aspect < 1 ? 75 : 60; camera.updateProjectionMatrix(); };
  addEventListener("resize", resize); resize();
  let last = performance.now();
  const ease = (dt, k) => 1 - Math.exp(-dt * k);
  (function frame(now) {
    requestAnimationFrame(frame);
    const dt = Math.min(.05, (now - last) / 1000); last = now;
    cur += (target - cur) * ease(dt, reduce ? 14 : 3.2);
    camera.position.z = camZ(cur);
    camera.position.x += (ptrX * 1.2 - camera.position.x) * ease(dt, 3);
    camera.position.y += (-ptrY * .6 - camera.position.y) * ease(dt, 3);
    camera.rotation.y += (-ptrX * .1 - camera.rotation.y) * ease(dt, 3);
    camera.rotation.x += (-ptrY * .05 - camera.rotation.x) * ease(dt, 3);
    uni.uTime.value = reduce ? 0 : now / 1000;
    for (const m of panels) {
      const v = clamp(1.5 - Math.abs(cur - m.userData.stop), 0, 1), s = v * v * (3 - 2 * v);
      m.material.opacity = s; m.children[0].material.opacity = s * .8; m.visible = s > .01;
      if (!reduce) m.rotation.y = Math.sin(now / 1000 * .4 + m.userData.i) * .05;
    }
    const bs = clamp(1 - cur * 1.3, 0, 1); ball.visible = bs > .01; ball.scale.setScalar(bs || .001); ball.position.y = 1.5 + (reduce ? 0 : Math.sin(now / 1800) * .25);
    overlay(); renderer.render(scene, camera);
  })(last);
}
