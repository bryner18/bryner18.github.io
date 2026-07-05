/* ============================================================
   effects.js — cursor sparkles, flying symbols, confetti,
   matrix rain, glitches. All pooled / capped for smoothness.
   ============================================================ */
"use strict";

const Effects = (() => {
  const rand = (n) => Math.floor(Math.random() * n);

  /* ---------- generic DOM sprite pool ---------- */
  function makePool(className, size) {
    const pool = [];
    for (let i = 0; i < size; i++) {
      const el = document.createElement("div");
      el.className = className;
      el.style.display = "none";
      document.body.appendChild(el);
      pool.push(el);
    }
    let idx = 0;
    return () => {
      const el = pool[idx];
      idx = (idx + 1) % size;
      // restart CSS animation by re-inserting
      el.style.display = "none";
      void el.offsetWidth;
      el.style.display = "block";
      return el;
    };
  }

  /* ---------- mouse sparkle trail ---------- */
  const SPARKS = ["✨", "⭐", "💫", "$", "₿"];
  const getSpark = makePool("sparkle", 24);
  let lastSpark = 0;
  addEventListener("pointermove", (e) => {
    const now = performance.now();
    if (now - lastSpark < 40) return;   // throttle ~25/sec
    lastSpark = now;
    const s = getSpark();
    s.textContent = SPARKS[rand(SPARKS.length)];
    s.style.left = e.clientX + rand(16) - 8 + "px";
    s.style.top = e.clientY + rand(16) - 8 + "px";
    s.style.color = `hsl(${rand(360)},100%,70%)`;
  });

  /* ---------- flying $ and ₿ ---------- */
  const FLYERS = ["💲", "₿", "💸", "🪙", "💰"];
  const getFlyer = makePool("flyer", 12);
  function launchFlyer() {
    if (document.hidden) return;
    const f = getFlyer();
    f.textContent = FLYERS[rand(FLYERS.length)];
    f.style.left = rand(innerWidth - 40) + "px";
    f.style.animationDuration = 4 + Math.random() * 5 + "s";
  }
  setInterval(launchFlyer, 1400);

  /* ---------- confetti burst ---------- */
  const getConfetti = makePool("confetti-bit", 40);
  function confetti(x = innerWidth / 2, y = innerHeight / 3) {
    for (let i = 0; i < 40; i++) {
      const c = getConfetti();
      c.style.left = x + "px";
      c.style.top = y + "px";
      c.style.background = `hsl(${rand(360)},100%,60%)`;
      c.style.setProperty("--dx", rand(400) - 200 + "px");
      c.style.animationDelay = Math.random() * 0.2 + "s";
    }
  }

  /* ---------- explosion ---------- */
  const getBoom = makePool("boom", 4);
  function explode(x, y) {
    const b = getBoom();
    b.textContent = ["💥", "🌟", "🧨"][rand(3)];
    b.style.left = (x ?? rand(innerWidth)) - 30 + "px";
    b.style.top = (y ?? rand(innerHeight)) - 30 + "px";
  }
  setInterval(() => { if (!document.hidden && Math.random() < 0.35) explode(); }, 7000);

  /* ---------- screen glitch ---------- */
  const glitchEl = document.getElementById("glitch-overlay");
  function glitch() {
    glitchEl.classList.remove("on");
    document.body.classList.remove("glitching");
    void glitchEl.offsetWidth;
    glitchEl.classList.add("on");
    document.body.classList.add("glitching");
    setTimeout(() => document.body.classList.remove("glitching"), 400);
  }
  setInterval(() => { if (!document.hidden && Math.random() < 0.25) glitch(); }, 15000);

  /* ---------- matrix rain (canvas, cheap) ---------- */
  const canvas = document.getElementById("matrix-canvas");
  const ctx = canvas.getContext("2d");
  const CHARS = "01₿$ﾊﾐﾋｰｳｼﾅﾓﾆｻﾜABCDEF";
  let cols, drops;
  let matrixBoost = 1;

  function sizeMatrix() {
    canvas.width = innerWidth;
    canvas.height = innerHeight;
    cols = Math.floor(canvas.width / 18);
    drops = Array.from({ length: cols }, () => rand(50));
  }
  sizeMatrix();
  addEventListener("resize", sizeMatrix);

  let lastRain = 0;
  function rain(t) {
    requestAnimationFrame(rain);
    if (document.hidden) return;
    if (t - lastRain < 66 / matrixBoost) return;  // ~15fps, boostable
    lastRain = t;
    ctx.fillStyle = "rgba(0,0,0,0.1)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "#0f0";
    ctx.font = "14px monospace";
    for (let i = 0; i < cols; i++) {
      ctx.fillText(CHARS[rand(CHARS.length)], i * 18, drops[i] * 18);
      drops[i] = drops[i] * 18 > canvas.height && Math.random() > 0.975 ? 0 : drops[i] + 1;
    }
  }
  requestAnimationFrame(rain);

  function boostMatrix(seconds = 8) {
    matrixBoost = 4;
    document.getElementById("bg-matrix").style.opacity = "0.6";
    setTimeout(() => {
      matrixBoost = 1;
      document.getElementById("bg-matrix").style.opacity = "";
    }, seconds * 1000);
  }

  return { confetti, explode, glitch, boostMatrix };
})();
