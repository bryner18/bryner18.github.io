/* ============================================================
   script.js — page init, counters, ticker, chart, easter eggs.
   Loads last; uses Popups / Effects globals.
   ============================================================ */
"use strict";

(() => {
  const rand = (n) => Math.floor(Math.random() * n);

  /* ---------- date ---------- */
  document.getElementById("today-date").textContent =
    new Date().toLocaleDateString(undefined, {
      weekday: "long", year: "numeric", month: "long", day: "numeric",
    });

  /* ---------- visitor counter (slowly creeps toward glory) ---------- */
  const digits = document.getElementById("visitor-digits");
  let visitors = 9999998;
  const renderVisitors = () => (digits.textContent = String(visitors).padStart(10, "0"));
  renderVisitors();
  setInterval(() => { visitors += rand(3); renderVisitors(); }, 5000);

  /* ---------- fake online users ---------- */
  const online = document.getElementById("online-users");
  setInterval(() => {
    online.textContent = (1000 + rand(2000)).toLocaleString();
  }, 3000);

  /* ---------- nonsense crypto ticker ---------- */
  const COINS = [
    "BITCONNECT", "DOGECOIN", "GARLICOIN", "Y2KOIN", "MOMCOIN", "56KOIN",
    "FLOPPYCOIN", "BEANIE-BUX", "TAMAGOTCHI-TOKEN", "DIALUP-DOLLAR",
    "GEOCITY-GOLD", "CLIPART-CASH", "SCREENSAVER-SHARES", "MIDICOIN",
  ];
  const ticker = document.getElementById("crypto-ticker");
  function renderTicker() {
    ticker.innerHTML = COINS.map((c) => {
      const up = Math.random() < 0.6;
      const price = (Math.random() * 99999).toFixed(rand(6));
      const pct = (Math.random() * 999).toFixed(1);
      return `<span class="tick-sym">${c}</span> ` +
             `<span class="${up ? "tick-up" : "tick-down"}">$${price} ${up ? "▲" : "▼"}${pct}%</span>` +
             ` &nbsp;✦&nbsp; `;
    }).join("");
  }
  renderTicker();
  setInterval(renderTicker, 8000);

  /* ---------- ascii chart that only goes up (mostly) ---------- */
  const chart = document.getElementById("ascii-chart");
  function renderChart() {
    const H = 8, W = 34;
    const grid = Array.from({ length: H }, () => Array(W).fill(" "));
    let y = H - 1;
    for (let x = 0; x < W; x++) {
      y = Math.max(0, Math.min(H - 1, y + (Math.random() < 0.7 ? -1 : 1)));
      grid[y][x] = "$";
      for (let fy = y + 1; fy < H; fy++) grid[fy][x] = "░";
    }
    chart.textContent =
      grid.map((row) => "│" + row.join("")).join("\n") +
      "\n└" + "─".repeat(W) + "\n 1996      1997      1998   MOON→";
  }
  renderChart();
  setInterval(renderChart, 4000);

  /* ============================================================
     EASTER EGGS
     ============================================================ */

  // click visitor counter → jackpot
  let counterClicks = 0;
  document.getElementById("visitor-counter").addEventListener("click", () => {
    visitors += 111111;
    renderVisitors();
    if (++counterClicks === 3) {
      counterClicks = 0;
      Effects.confetti();
      Popups.spawnSilly({ icon: "🧮", title: "Counter Hacked",
        text: "You inflated the visitor counter. This is how <b>all</b> 90s counters worked." });
    }
  });

  // click globe → turbo spin
  const globe = document.getElementById("spinning-globe");
  globe.addEventListener("click", () => {
    const g = globe.querySelector(".globe");
    g.classList.add("turbo");
    setTimeout(() => g.classList.remove("turbo"), 3000);
    Popups.spawnSilly({ icon: "🌍", title: "World Wide Web",
      text: "You spun the ENTIRE world. Time zones are now <b>your fault</b>." });
  });

  // double-click logo → glitch + confetti
  document.getElementById("site-logo").addEventListener("dblclick", () => {
    Effects.glitch();
    Effects.confetti();
    Popups.spawnSilly({ icon: "👾", title: "SECRET FOUND",
      text: "You double-clicked the logo like it's <b>1995</b>. Muscle memory certified." });
  });

  // under construction sign
  document.getElementById("under-construction").addEventListener("click", () => {
    Popups.spawnSilly({ icon: "🚧", title: "Construction Update",
      text: "Construction status: still under. Estimated completion: <b>heat death of universe</b>." });
  });

  // typed-word eggs + konami code
  const KONAMI = ["ArrowUp","ArrowUp","ArrowDown","ArrowDown","ArrowLeft","ArrowRight","ArrowLeft","ArrowRight","b","a"];
  let konamiPos = 0;
  let typed = "";

  addEventListener("keydown", (e) => {
    if (e.target.tagName === "INPUT") return;

    // konami
    konamiPos = e.key === KONAMI[konamiPos] ? konamiPos + 1 : (e.key === KONAMI[0] ? 1 : 0);
    if (konamiPos === KONAMI.length) {
      konamiPos = 0;
      Effects.boostMatrix(10);
      Effects.confetti();
      Effects.explode(innerWidth / 2, innerHeight / 2);
      Popups.spawnSilly({ icon: "🎮", title: "KONAMI CODE",
        text: "30 extra lives granted. Redeemable <b>nowhere</b>. Matrix mode: ENGAGED." });
      return;
    }

    // typed words
    if (e.key.length === 1) {
      typed = (typed + e.key.toLowerCase()).slice(-12);
      if (typed.endsWith("crypto")) {
        typed = "";
        for (let i = 0; i < 5; i++) setTimeout(() => Effects.explode(), i * 200);
        Popups.spawnSilly({ icon: "🪙", title: "MAGIC WORD",
          text: "You typed the magic word. Your keyboard is now <b>blockchain-enabled</b>." });
      } else if (typed.endsWith("bitcoin")) {
        typed = "";
        Effects.confetti(innerWidth / 2, 100);
        Popups.spawnSilly({ icon: "₿", title: "HODL DETECTED",
          text: "Bitcoin summoned. Please wait <b>10 minutes</b> for this popup to confirm." });
      } else if (typed.endsWith("midi")) {
        typed = "";
        Popups.spawnSilly({ icon: "🎹", title: "MIDI POWER",
          text: "Fun fact: this site's soundtrack uses <b>0 real instruments</b>. Authentic!" });
      }
    }

    // random shortcut: G for glitch
    if (e.key === "g" && e.altKey) Effects.glitch();
  });
})();
