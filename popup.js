/* ============================================================
   popup.js — Windows 95 popup engine (all fake, all harmless)
   ============================================================ */
"use strict";

const Popups = (() => {
  const MAX_POPUPS = 8;           // hard cap so chaos stays smooth
  const layer = document.getElementById("popup-layer");
  let zTop = 8001;
  let suppressRespawns = false;   // set true briefly after "Close All"

  /* ---------- content pools ---------- */
  const SILLY = [
    { icon: "🎉", title: "Congratulations!", text: "You are visitor <b>#9,999,999</b>!!! Claim your prize of ONE (1) firm handshake." },
    { icon: "💰", title: "WINNER", text: "You have won <b>700 Bitcoin</b>! To collect, simply travel back to 2009." },
    { icon: "⚠️", title: "URGENT", text: "This message is <b>URGENT</b>. We forgot why. Please remain urgent." },
    { icon: "🤑", title: "Millionaire Alert", text: "Click here to become a <b>crypto millionaire</b>* <br><small>*in Monopoly money</small>" },
    { icon: "🚀", title: "Elon Notification", text: "<b>Elon approved your wallet.</b> He also approved everyone else's. It means nothing." },
    { icon: "⛏️", title: "Mining Detected", text: "Your computer is mining <b>0.0000001 coins/year</b>. At this rate: rich by the year 90210." },
    { icon: "🔮", title: "Quantum Profits", text: "<b>Quantum profits unlocked!</b> Your money now exists and doesn't exist simultaneously." },
    { icon: "🕵️", title: "CLASSIFIED", text: "The <b>government doesn't want you to know this</b>. Neither do we. Nobody knows anything." },
    { icon: "💸", title: "FREE MONEY", text: "<b>FREE MONEY!!!</b> (money not included)" },
    { icon: "💾", title: "Install Wizard", text: "Install <b>Crypto Booster 98™</b>? Requires 4MB RAM and unshakeable optimism." },
    { icon: "🔄", title: "Wallet Sync", text: "<b>Wallet synchronization required.</b> Please rotate your monitor 360 degrees." },
    { icon: "📈", title: "Hot Tip", text: "Prices only go up! Except down. Sometimes sideways. Financial advice: <b>no</b>." },
    { icon: "🧠", title: "Big Brain Offer", text: "Doctors HATE this one weird coin. The coin is fine with it." },
    { icon: "📟", title: "Y2K WARNING", text: "In the year 2000, all coins become <b>2000% cooler</b>. Source: a pager." },
  ];

  const DENIALS = [
    "Access Denied: Too Rich Already.",
    "Wallet overloaded. Please remove some wealth and try again.",
    "Error 1998: Password too powerful.",
    "Login rejected — vibes insufficient.",
    "Account not found. Have you tried being born earlier?",
    "Server is down for its afternoon nap.",
  ];

  const LOGINS = {
    wallet: { title: "🔐 Wallet Login",          user: "Wallet Name",   pass: "Secret Coin Word" },
    vip:    { title: "👑 VIP Investor Portal",   user: "VIP Number",    pass: "Yacht Password" },
    mining: { title: "⛏️ Mining Dashboard",      user: "Miner ID",      pass: "Pickaxe PIN" },
    exch:   { title: "💱 Crypto Exchange Login", user: "Trader Handle", pass: "Lucky Numbers" },
  };

  const NAMED = {
    guestbook: { icon: "📖", title: "Guestbook", text: "Guestbook is full. All 9,999,999 visitors wrote <b>\"first!!\"</b>" },
    email:     { icon: "📧", title: "You've Got Mail", text: "The webmaster's inbox exploded in 1997. Please shout your message at the monitor." },
    webring:   { icon: "🔗", title: "WebRing", text: "You are now member <b>#667</b> of the Krypto WebRing. The ring is a circle. There is no exit." },
    download:  { icon: "⬇️", title: "Download Manager", text: "Downloading <b>RICHES.EXE</b>… Estimated time: <b>47 years</b> (56k modem detected)." },
    download2: { icon: "⚡", title: "TURBO Download", text: "Download 400% faster!* <br><small>*percentage chosen at random</small>" },
    download3: { icon: "🚀", title: "MEGA TURBO", text: "Your download is now so fast it finished <b>before it started</b>. File not found." },
    ad1:       { icon: "💵", title: "FREE MONEY", text: "Step 1: Click. Step 2: ??? Step 3: <b>PROFIT!</b> (Steps 2 and 3 under construction.)" },
    ad2:       { icon: "🛸", title: "THE TRUTH", text: "The truth is out there. Specifically, it is <b>not on this website</b>." },
    ad3:       { icon: "🐌", title: "PC Health Alert", text: "Your PC is too slow to mine. Recommended upgrade: <b>a faster PC</b>. That'll be $9,999." },
    ad4:       { icon: "🌀", title: "Quantum Zone", text: "Congratulations, your profits are now <b>quantum</b>. Do not observe them or they collapse." },
  };

  /* ---------- helpers ---------- */
  const rand = (n) => Math.floor(Math.random() * n);
  const count = () => layer.querySelectorAll(".win95-popup").length;

  function place(el, corner) {
    const w = 300, h = 160;
    const maxX = Math.max(20, innerWidth - w - 20);
    const maxY = Math.max(20, innerHeight - h - 20);
    let x, y;
    if (corner) { // spawn from a random corner-ish spot
      x = Math.random() < .5 ? 20 + rand(60) : maxX - rand(60);
      y = Math.random() < .5 ? 20 + rand(60) : maxY - rand(60);
    } else {
      x = 20 + rand(maxX);
      y = 20 + rand(maxY);
    }
    el.style.left = x + "px";
    el.style.top = y + "px";
  }

  function makeDraggable(el, bar) {
    bar.addEventListener("pointerdown", (e) => {
      if (e.target.classList.contains("tb-btn")) return;
      const sx = e.clientX - el.offsetLeft;
      const sy = e.clientY - el.offsetTop;
      el.style.zIndex = ++zTop;
      const move = (ev) => {
        el.style.left = (ev.clientX - sx) + "px";
        el.style.top = (ev.clientY - sy) + "px";
      };
      const up = () => {
        removeEventListener("pointermove", move);
        removeEventListener("pointerup", up);
      };
      addEventListener("pointermove", move);
      addEventListener("pointerup", up);
    });
  }

  function frame(title) {
    const el = document.createElement("div");
    el.className = "win95-popup popup-slide-in";
    el.style.zIndex = ++zTop;
    el.innerHTML =
      `<div class="win-titlebar"><span>${title}</span>` +
      `<span class="titlebar-btns"><b class="tb-btn" data-close>✕</b></span></div>`;
    makeDraggable(el, el.firstChild);
    return el;
  }

  /* mischievous close behaviors — but every popup ALWAYS closes on 2nd try,
     and Close All / Esc nukes everything unconditionally */
  function wireClose(el) {
    let dodged = false;
    el.querySelectorAll("[data-close]").forEach((btn) => {
      btn.addEventListener("click", () => {
        const trick = Math.random();
        if (!dodged && trick < 0.25) {            // teleport away once
          dodged = true;
          place(el);
          return;
        }
        el.remove();
        if (suppressRespawns) return;
        if (trick > 0.85 && count() < MAX_POPUPS) spawnSilly();      // hydra
        else if (trick > 0.75) setTimeout(() => {                    // zombie
          if (!suppressRespawns && count() < MAX_POPUPS) spawnSilly();
        }, 4000 + rand(4000));
      });
    });
  }

  function decorate(el) {
    const r = Math.random();
    if (r < 0.2) el.classList.add("popup-bounce");
    else if (r < 0.35) el.classList.add("popup-shake");
  }

  /* ---------- spawners ---------- */
  function spawnSilly(data) {
    if (count() >= MAX_POPUPS) return;
    const d = data || SILLY[rand(SILLY.length)];
    const el = frame(d.title);
    el.insertAdjacentHTML("beforeend",
      `<div class="popup-body"><div class="popup-icon">${d.icon}</div>` +
      `<div class="popup-text">${d.text}</div></div>` +
      `<div class="popup-btn-row"><button class="win95-btn" data-close>OK</button>` +
      `<button class="win95-btn" data-close>Also OK</button></div>`);
    place(el, true);
    decorate(el);
    wireClose(el);
    layer.appendChild(el);
    return el;
  }

  function spawnLogin(kind) {
    if (count() >= MAX_POPUPS) return;
    const d = LOGINS[kind] || LOGINS.exch;
    const el = frame(d.title);
    // ponytail: pure theater — no form, no name attrs, no storage, inputs go nowhere
    el.insertAdjacentHTML("beforeend",
      `<div class="popup-body"><div class="popup-icon">🔑</div>` +
      `<div class="login-fields">` +
      `<label>${d.user}:</label><input type="text" autocomplete="off">` +
      `<label>${d.pass}:</label><input type="password" autocomplete="off">` +
      `<div class="login-disclaimer">This dialog is decorative. It connects to nothing. Please type nothing real.</div>` +
      `</div></div>` +
      `<div class="popup-btn-row"><button class="win95-btn" data-fake-login>Login</button>` +
      `<button class="win95-btn" data-close>Cancel</button></div>`);
    place(el);
    wireClose(el);
    el.querySelector("[data-fake-login]").addEventListener("click", () => {
      el.querySelectorAll("input").forEach((i) => (i.value = ""));
      el.remove();
      spawnSilly({ icon: "⛔", title: "Login Failed", text: `<b>${DENIALS[rand(DENIALS.length)]}</b>` });
    });
    layer.appendChild(el);
    return el;
  }

  function closeAll() {
    suppressRespawns = true;
    layer.querySelectorAll(".win95-popup").forEach((p) => p.remove());
    setTimeout(() => (suppressRespawns = false), 8000); // 8s of guaranteed peace
  }

  /* ---------- ambient popup storm (gentle) ---------- */
  function ambient() {
    if (!suppressRespawns && count() < 4 && !document.hidden) spawnSilly();
    setTimeout(ambient, 9000 + rand(12000));
  }

  /* ---------- wiring ---------- */
  document.getElementById("close-all-btn").addEventListener("click", closeAll);
  addEventListener("keydown", (e) => { if (e.key === "Escape") closeAll(); });

  document.querySelectorAll("[data-popup]").forEach((b) =>
    b.addEventListener("click", () => spawnSilly(NAMED[b.dataset.popup])));
  document.querySelectorAll("[data-login]").forEach((b) =>
    b.addEventListener("click", () => spawnLogin(b.dataset.login)));

  setTimeout(() => spawnSilly(), 2500);   // opening act
  setTimeout(ambient, 12000);

  return { spawnSilly, spawnLogin, closeAll };
})();
