/* ============================================================
   popup.js — Windows 95 dialog engine.
   90+ dialog types: info, warning, error, question, progress,
   countdown, checkbox/radio option dialogs.
   Random on-screen placement (never clipped), anti-clustering,
   randomized entrance animations. All fake, all harmless.
   ============================================================ */
"use strict";

const Popups = (() => {
  const MAX_POPUPS = 8;           // hard cap so chaos stays smooth
  const layer = document.getElementById("popup-layer");
  let zTop = 8001;
  let suppressRespawns = false;   // set true briefly after "Close All"

  const rand = (n) => Math.floor(Math.random() * n);
  const pick = (a) => a[rand(a.length)];
  const count = () => layer.querySelectorAll(".win95-popup").length;

  /* ============================================================
     DIALOG LIBRARY — every message played completely straight
     ============================================================ */
  const LIB = [];
  const add = (icon, type, pairs) =>
    pairs.forEach(([title, text]) => LIB.push({ icon, type, title, text }));

  /* ---- system messages ---- */
  add("💾", "ok", [
    ["System Notice", "Wallet synchronized successfully."],
    ["System Notice", "Synchronization complete. 4,096 blocks verified."],
    ["System Optimizer", "Cache optimized. Browsing speed increased by 12%."],
    ["Wallet Indexer", "Local wallet indexed. 0 errors found."],
    ["Blockchain Services", "The blockchain has been refreshed."],
    ["Task Scheduler", "Background miner initialized in low-priority mode."],
    ["Resource Manager", "System resources reallocated to profit calculation."],
    ["Registry Update", "Registry updated with 14 new coin definitions."],
    ["Disk Utility", "Wallet defragmentation complete. Coins arranged by value."],
    ["Memory Manager", "Conventional memory freed for high-speed trading."],
  ]);

  /* ---- security ---- */
  add("🔒", "ok", [
    ["Security Advisor", "Your wallet password has not been changed since 1996. No action required."],
    ["Certificate Manager", "Certificate accepted. This site is now trusted permanently."],
    ["Firewall", "Firewall rules adjusted to allow incoming profits."],
    ["Security Center", "Security level raised to MAXIMUM (Gold Edition)."],
    ["Encryption Monitor", "Your connection is now protected by 128-bit optimism."],
    ["Privacy Notice", "This website stores exactly 1 cookie, for your convenience."],
    ["CryptoShield AV", "Scan complete. 0 viruses found. 14 opportunities found."],
    ["CryptoShield AV", "Threat neutralized: doubt.exe has been quarantined."],
    ["CryptoShield AV", "Real-time protection is watching your investments."],
  ]);

  /* ---- wallet ---- */
  add("👛", "ok", [
    ["Wallet Manager", "Wallet balance updated. Numbers remain excellent."],
    ["Wallet Manager", "Your wallet is 87% full. Consider registering a second wallet."],
    ["Wallet Manager", "Wallet backup saved to floppy disk A: successfully."],
    ["Wallet Skins", "New wallet skin available: <b>Chrome Flame</b>."],
    ["Wallet Manager", "Loose change detected in sector 4 of your wallet."],
  ]);

  /* ---- mining ---- */
  add("⛏️", "ok", [
    ["Mining Monitor", "New mining node discovered in Sector 7."],
    ["Mining Monitor", "Mining output increased by 3 hashes per hour."],
    ["Mining Monitor", "Your CPU is now mining at full 486 speed."],
    ["Mining Monitor", "Coolant levels optimal. Mining may continue."],
    ["Mining Monitor", "Night mining enabled. Coins accumulate while you sleep."],
    ["Mining Monitor", "Congratulations: your machine has been promoted to Node."],
  ]);

  /* ---- software updates ---- */
  add("🔧", "ok", [
    ["Update Wizard", "CryptoBooster 98 version 1.02b is now available."],
    ["Update Wizard", "Update complete. Please restart your modem."],
    ["Driver Manager", "New drivers found for your money."],
    ["Update Wizard", "Patch 47 installed. Fixes an issue where profits displayed too small."],
  ]);

  /* ---- exchange ---- */
  add("💱", "ok", [
    ["Exchange News", "Exchange servers responding normally."],
    ["Exchange News", "Trading floor now open 24 hours (except Sundays)."],
    ["Exchange News", "New trading pair listed: CRC/ALLOWANCE."],
    ["Exchange News", "Daily volume record broken for the 41st consecutive day."],
    ["Transaction Center", "Your transaction has entered the queue. Position: 8,412."],
    ["Transaction Center", "Transaction confirmed by 3 of 3 available computers."],
  ]);

  /* ---- investment opportunities ---- */
  add("📈", "ok", [
    ["Investment Advisor", "New market opportunity detected in your area."],
    ["Investment Advisor", "Pre-IPO coins available for the next 9 minutes."],
    ["Investment Advisor", "Limited offer: buy 1 coin, receive 1 coin."],
    ["Market Analysis", "Analysts agree: numbers are up."],
    ["Market Analysis", "Daily market report ready. Summary: excellent."],
    ["Market Analysis", "Portfolio updated. Direction: favorable."],
  ]);

  /* ---- email / messages ---- */
  add("📧", "ok", [
    ["Inbox Notify", "You have received 1 unread crypto message."],
    ["Inbox Notify", "You've got coins!"],
    ["Inbox Notify", "3 new messages from successful investors."],
    ["Inbox Notify", "Your welcome packet has been emailed (allow 6–8 weeks)."],
  ]);

  /* ---- browser advisories ---- */
  add("🌐", "ok", [
    ["Browser Advisory", "Internet Explorer recommends upgrading your wallet."],
    ["Browser Advisory", "This page is best experienced at maximum brightness."],
    ["Browser Advisory", "Netscape users: profits are fully compatible."],
    ["Browser Advisory", "Tip: bookmarking this page improves performance."],
  ]);

  /* ---- registration ---- */
  add("📝", "ok", [
    ["Registration", "Reminder: you have not yet registered CryptoBooster 98."],
    ["Registration", "Register now to unlock 3 additional zeroes."],
    ["Registration", "Your complimentary trial of prosperity expires in 30 days."],
  ]);

  /* ---- lucky visitor / membership ---- */
  add("🏆", "ok", [
    ["Lucky Visitor", "You are our 1,000,000th visitor today."],
    ["Lucky Visitor", "Congratulations! Your IP address won the hourly draw."],
    ["Lucky Visitor", "You have been selected from millions of eligible modems."],
    ["Membership Services", "VIP membership available. Velvet rope included."],
    ["Membership Services", "GOLD tier unlocked. PLATINUM tier is visible but locked."],
    ["Referral Network", "A new investor has joined your referral network."],
  ]);

  /* ---- network ---- */
  add("📡", "ok", [
    ["Network Center", "Connection stabilized."],
    ["Network Center", "Network latency reduced by 40 milliseconds."],
    ["Network Center", "Packet loss recovered. All packets accounted for."],
    ["Network Center", "Node handshake completed successfully."],
    ["Network Center", "Your dial-up connection has been rated: Sufficient."],
  ]);

  /* ---- chat ---- */
  add("💬", "ok", [
    ["InstantChat 98", "CoolTrader97 wants to discuss market gains with you."],
    ["InstantChat 98", "xX_HODL_Xx has sent you a wink."],
    ["InstantChat 98", "Moderator MoneyMike invites you to channel #getrich."],
  ]);

  /* ---- achievements ---- */
  add("🎖️", "ok", [
    ["Achievement", "Achievement unlocked: First Million (theoretical)."],
    ["Achievement", "Achievement unlocked: Viewed chart 100 times."],
    ["Achievement", "Milestone reached: 24 hours without selling."],
  ]);

  /* ---- warnings ---- */
  add("⚠️", "warn", [
    ["Security Alert", "Unauthorized wealth detected on this machine."],
    ["System Warning", "Profit buffer at 91% capacity."],
    ["Modem Warning", "Your modem is operating at high temperature due to gains traffic."],
    ["Y2K Advisory", "Y2K compliance verified. Your coins will survive the year 2000."],
    ["Storage Warning", "Floppy disk A: cannot hold this much value. Insert disk 2."],
    ["Display Warning", "Monitor brightness insufficient to display full profits."],
  ]);

  /* ---- errors ---- */
  add("❌", "error", [
    ["CRYPTOB98.EXE", "Error 404: Losses not found."],
    ["System Error", "This program has performed an illegal operation: attempted withdrawal."],
    ["Runtime Error", "Overflow error: too many coins in buffer."],
    ["Math Coprocessor", "Divide-by-zero occurred while calculating risk."],
    ["Print Manager", "Unable to print portfolio: insufficient paper for all zeroes."],
    ["General Failure", "General failure reading drive M: (Money)."],
  ]);

  /* ---- questions (Yes/No) ---- */
  add("❓", "yesno", [
    ["Confirmation", "Would you like to enable TurboProfit™ mode?"],
    ["Confirmation", "Set CryptoMillions as your homepage?"],
    ["Confirmation", "Would you like to be notified each time the market goes up?"],
    ["Confirmation", "Add 'Investor' to your system user title?"],
    ["Confirmation", "Enable PowerSaver: dim monitor while coins accumulate?"],
    ["Confirmation", "Would you like your gains displayed in bold?"],
    ["Setup Wizard", "Install desktop shortcut to Wealth?"],
    ["Confirmation", "Subscribe to the CryptoMillions newsletter (weekly, 4MB)?"],
  ]);

  const YES_REPLIES = [
    ["Preferences", "Excellent choice. Settings applied immediately."],
    ["Preferences", "Confirmed. Your experience has been upgraded."],
    ["Preferences", "Done. You will notice the difference shortly."],
  ];
  const NO_REPLIES = [
    ["Preferences", "Your request has been noted. The operation will proceed anyway."],
    ["Preferences", "Selection saved. Feature enabled by default for your protection."],
    ["Preferences", "Understood. We have scheduled this for later instead."],
  ];

  /* ---- progress dialogs: [title, working label, done label] ---- */
  const PROGRESS = [
    ["Download Manager", "Downloading PROFITS.ZIP (4.2 MB)…", "Download complete. File saved to C:\\MONEY."],
    ["Install Wizard", "Installing CryptoBooster 98…", "Installation successful. 0 restarts required (please restart)."],
    ["Wallet Services", "Verifying coins…", "All coins verified authentic."],
    ["Archive Utility", "Extracting wealth…", "Extraction complete. Wealth extracted."],
    ["Update Wizard", "Applying market patch 47…", "Patch applied. Market improved."],
    ["Sync Manager", "Synchronizing with exchange servers…", "Synchronization complete."],
  ];

  /* ---- countdown dialogs: [title, text with {n}, done text, seconds] ---- */
  const COUNTDOWN = [
    ["Limited Offer", "This opportunity expires in <b>{n}</b> seconds.", "Offer extended due to popular demand.", 10],
    ["Market Notice", "The trading floor closes in <b>{n}</b> seconds.", "The trading floor has reopened.", 8],
    ["Session Notice", "Your VIP session upgrade begins in <b>{n}</b> seconds.", "Upgrade complete. Welcome, VIP.", 6],
  ];

  /* ---- choice dialogs ---- */
  const CHOICES = [
    { kind: "checkbox", title: "Investor Profile", prompt: "Select your investment goals:",
      options: ["Achieve wealth", "Achieve significant wealth", "Retire my parents", "Impress my modem friends"] },
    { kind: "checkbox", title: "Notification Settings", prompt: "Notify me when:",
      options: ["Prices go up", "Prices go up a lot", "Someone mentions me on IRC", "The blockchain refreshes"] },
    { kind: "radio", title: "Setup Wizard", prompt: "Choose your experience level:",
      options: ["Beginner", "Expert", "Visionary"] },
    { kind: "radio", title: "Display Options", prompt: "Preferred profit display format:",
      options: ["Green numbers", "Larger green numbers", "Blinking green numbers"] },
  ];

  const CHOICE_REPLIES = [
    ["Setup Wizard", "Preferences saved. Profit engine adjusted accordingly."],
    ["Setup Wizard", "Profile updated. Recommendations recalculated."],
    ["Setup Wizard", "Configuration complete. Thank you for personalizing."],
  ];

  /* ---- login dialogs ---- */
  const LOGINS = {
    wallet: { title: "🔐 Wallet Login",          user: "Wallet ID",     pass: "Passphrase" },
    vip:    { title: "👑 VIP Investor Portal",   user: "Member Number", pass: "Access Code" },
    mining: { title: "⛏️ Mining Dashboard",      user: "Miner ID",      pass: "Terminal PIN" },
    exch:   { title: "💱 Crypto Exchange Login", user: "Trader Handle", pass: "Password" },
  };

  /* ---- dialogs bound to specific page buttons ---- */
  const NAMED = {
    guestbook: { icon: "📖", title: "Guestbook", text: "The guestbook is temporarily full. Please check back after our scheduled server upgrade (Q3 1999)." },
    email:     { icon: "📧", title: "Contact the Webmaster", text: "Your message is important to us. The webmaster personally reads every email, usually on weekends." },
    webring:   { icon: "🔗", title: "WebRing Enrollment", text: "Welcome! You are now member <b>#667</b> of the Crypto Investors WebRing. Certificate to follow by post." },
    download:  { icon: "⬇️", title: "Download Manager", text: "Download started: <b>CRYPTOBOOSTER98.EXE</b> (4.2 MB). Estimated time remaining: <b>14 hours</b>." },
    download2: { icon: "⚡", title: "Accelerated Download", text: "Download accelerated by 400%. New estimated time remaining: <b>14 hours</b>." },
    download3: { icon: "🚀", title: "Turbo Download", text: "Turbo mode engaged. Your download has been prioritized above all other Internet traffic in your region." },
    ad1:       { icon: "💵", title: "New Member Offer", text: "Welcome! Your <b>free starter coins</b> have been reserved. Please remain on this website to keep them warm." },
    ad2:       { icon: "🗝️", title: "Financial Freedom Kit", text: "Thank you for your interest. The Financial Freedom Kit ships on 3 floppy disks. Disk 2 is the important one." },
    ad3:       { icon: "🖥️", title: "System Evaluation", text: "Good news: your computer <b>qualifies</b> for the Mining Performance Upgrade. Most computers do." },
    ad4:       { icon: "🌀", title: "Quantum Trading", text: "You have been enrolled in next-generation Quantum Trading. Results may arrive before you invest." },
  };

  const DENIALS = [
    "Login failed: exchange servers are experiencing record demand.",
    "Error 691: exchange line busy. Please try again in 1998.",
    "Account temporarily locked for exceeding maximum prosperity.",
    "Password verification unavailable — verification server is being upgraded.",
    "Session could not start: too many investors online (this is good news).",
    "Access queue full. Your enthusiasm has been logged.",
  ];

  /* ============================================================
     PLACEMENT — random, fully on-screen, anti-clustered
     ============================================================ */
  const recentSpots = [];

  function placeSmart(el) {
    // measure real size first (element is already in the DOM, hidden)
    const w = el.offsetWidth || 300;
    const h = el.offsetHeight || 160;
    const pad = 8;
    const maxX = Math.max(pad, innerWidth - w - pad);
    const maxY = Math.max(pad, innerHeight - h - pad);

    // sample candidates, keep the one farthest from recent spawns
    let best = null, bestDist = -1;
    for (let i = 0; i < 8; i++) {
      const x = pad + Math.random() * (maxX - pad);
      const y = pad + Math.random() * (maxY - pad);
      let d = Infinity;
      for (const s of recentSpots) d = Math.min(d, Math.hypot(x - s.x, y - s.y));
      if (d > bestDist) { bestDist = d; best = { x, y }; }
    }
    recentSpots.push(best);
    if (recentSpots.length > 6) recentSpots.shift();
    el.style.left = best.x + "px";
    el.style.top = best.y + "px";
  }

  /* random entrance animation */
  const ENTRANCES = ["pa-fade", "pa-zoom", "pa-slide-l", "pa-slide-r",
                     "pa-slide-t", "pa-slide-b", "pa-bounce", "pa-spin", ""];
  function animateIn(el) {
    const cls = pick(ENTRANCES);
    if (!cls) return;                       // appear instantly
    el.classList.add(cls);
    el.addEventListener("animationend", () => el.classList.remove(cls), { once: true });
  }

  /* ============================================================
     WINDOW CONSTRUCTION
     ============================================================ */
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
    el.className = "win95-popup";
    el.style.zIndex = ++zTop;
    el._timers = [];
    el.innerHTML =
      `<div class="win-titlebar"><span>${title}</span>` +
      `<span class="titlebar-btns"><b class="tb-btn" data-close>✕</b></span></div>`;
    makeDraggable(el, el.firstChild);
    return el;
  }

  function removePopup(el) {
    el._timers.forEach(clearInterval);
    el.remove();
  }

  /* mischievous close behaviors — but every popup ALWAYS closes on 2nd try,
     and Close All / Esc nukes everything unconditionally */
  function wireClose(el) {
    let dodged = false;
    el.querySelectorAll("[data-close]").forEach((btn) => {
      btn.addEventListener("click", () => {
        const trick = Math.random();
        if (!dodged && trick < 0.2) {            // teleport away once
          dodged = true;
          placeSmart(el);
          return;
        }
        removePopup(el);
        if (suppressRespawns) return;
        if (trick > 0.88 && count() < MAX_POPUPS) spawnSilly();      // hydra
        else if (trick > 0.78) setTimeout(() => {                    // zombie
          if (!suppressRespawns && count() < MAX_POPUPS) spawnSilly();
        }, 4000 + rand(4000));
      });
    });
  }

  function decorate(el) {
    const r = Math.random();
    // delay so wobble doesn't fight the entrance animation
    setTimeout(() => {
      if (!el.isConnected) return;
      if (r < 0.15) el.classList.add("popup-bounce");
      else if (r < 0.25) el.classList.add("popup-shake");
    }, 700);
  }

  function mount(el) {
    el.style.visibility = "hidden";
    layer.appendChild(el);
    placeSmart(el);
    el.style.visibility = "";
    animateIn(el);
    decorate(el);
    wireClose(el);
  }

  /* ============================================================
     SPAWNERS PER DIALOG TYPE
     ============================================================ */
  const bodyHTML = (icon, text) =>
    `<div class="popup-body"><div class="popup-icon">${icon}</div>` +
    `<div class="popup-text">${text}</div></div>`;

  function spawnBasic(d) {
    const el = frame(d.title);
    const isErr = d.type === "error";
    const isWarn = d.type === "warn";
    const icon = isErr ? "❌" : isWarn ? "⚠️" : d.icon;
    el.insertAdjacentHTML("beforeend",
      bodyHTML(icon, d.text) +
      `<div class="popup-btn-row"><button class="win95-btn" data-close>OK</button>` +
      (isErr ? `<button class="win95-btn" data-close>Details…</button>` : "") +
      `</div>`);
    mount(el);
    return el;
  }

  function spawnYesNo(d) {
    const el = frame(d.title);
    el.insertAdjacentHTML("beforeend",
      bodyHTML("❓", d.text) +
      `<div class="popup-btn-row"><button class="win95-btn" data-yes>Yes</button>` +
      `<button class="win95-btn" data-no>No</button></div>`);
    mount(el);
    el.querySelector("[data-yes]").addEventListener("click", () => {
      removePopup(el);
      const [title, text] = pick(YES_REPLIES);
      spawnBasic({ icon: "ℹ️", type: "ok", title, text });
    });
    el.querySelector("[data-no]").addEventListener("click", () => {
      removePopup(el);
      const [title, text] = pick(NO_REPLIES);
      spawnBasic({ icon: "ℹ️", type: "ok", title, text });
    });
    return el;
  }

  function spawnProgress([title, working, done]) {
    const el = frame(title);
    el.insertAdjacentHTML("beforeend",
      `<div class="popup-body"><div class="popup-icon">💾</div>` +
      `<div class="popup-text"><div class="progress-label">${working}</div>` +
      `<div class="progress-track"><div class="progress-fill" style="width:0%"></div></div>` +
      `<div class="progress-pct tiny-text">0%</div></div></div>` +
      `<div class="popup-btn-row"><button class="win95-btn" data-close>Cancel</button></div>`);
    mount(el);

    const fill = el.querySelector(".progress-fill");
    const pctEl = el.querySelector(".progress-pct");
    let pct = 0;
    const t = setInterval(() => {
      // jerky, authentic 90s progress: bursts, stalls, the 99% pause
      if (pct < 99) pct = Math.min(99, pct + (Math.random() < 0.3 ? 0 : rand(9)));
      else if (Math.random() < 0.25) pct = 100;
      fill.style.width = pct + "%";
      pctEl.textContent = pct + "%";
      if (pct >= 100) {
        clearInterval(t);
        el.querySelector(".progress-label").innerHTML = done;
        el.querySelector("[data-close]").textContent = "OK";
      }
    }, 300);
    el._timers.push(t);
    return el;
  }

  function spawnCountdown([title, text, done, secs]) {
    const el = frame(title);
    el.insertAdjacentHTML("beforeend",
      bodyHTML("⏰", text.replace("{n}", `<span class="cd">${secs}</span>`)) +
      `<div class="popup-btn-row"><button class="win95-btn" data-close>OK</button></div>`);
    mount(el);
    let n = secs;
    const t = setInterval(() => {
      n--;
      const cd = el.querySelector(".cd");
      if (!cd) return clearInterval(t);
      if (n > 0) cd.textContent = n;
      else {
        clearInterval(t);
        el.querySelector(".popup-text").innerHTML = done;
      }
    }, 1000);
    el._timers.push(t);
    return el;
  }

  function spawnChoice(d) {
    const el = frame(d.title);
    const name = "grp" + (++zTop);
    const inputs = d.options.map((o, i) =>
      `<label class="opt-row"><input type="${d.kind}" name="${name}"${d.kind === "radio" && i === 0 ? " checked" : ""}> ${o}</label>`
    ).join("");
    el.insertAdjacentHTML("beforeend",
      `<div class="popup-body"><div class="popup-icon">🧾</div>` +
      `<div class="popup-text"><b>${d.prompt}</b><div class="opt-list">${inputs}</div></div></div>` +
      `<div class="popup-btn-row"><button class="win95-btn" data-continue>Continue</button>` +
      `<button class="win95-btn" data-close>Cancel</button></div>`);
    mount(el);
    el.querySelector("[data-continue]").addEventListener("click", () => {
      removePopup(el);
      const [title, text] = pick(CHOICE_REPLIES);
      spawnBasic({ icon: "ℹ️", type: "ok", title, text });
    });
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
      `<div class="login-disclaimer">Demo terminal — not connected to the exchange network.</div>` +
      `</div></div>` +
      `<div class="popup-btn-row"><button class="win95-btn" data-fake-login>Login</button>` +
      `<button class="win95-btn" data-close>Cancel</button></div>`);
    mount(el);
    el.querySelector("[data-fake-login]").addEventListener("click", () => {
      el.querySelectorAll("input").forEach((i) => (i.value = ""));
      removePopup(el);
      spawnBasic({ icon: "⛔", type: "error", title: "Login Failed", text: `<b>${pick(DENIALS)}</b>` });
    });
    return el;
  }

  /* ---------- main entry: random dialog from the whole library ---------- */
  function spawnSilly(data) {
    if (count() >= MAX_POPUPS) return;
    if (data) return spawnBasic({ type: "ok", ...data });

    const roll = Math.random();
    if (roll < 0.72) {                       // plain library dialog
      const d = pick(LIB);
      return d.type === "yesno" ? spawnYesNo(d) : spawnBasic(d);
    }
    if (roll < 0.84) return spawnProgress(pick(PROGRESS));
    if (roll < 0.92) return spawnCountdown(pick(COUNTDOWN));
    return spawnChoice(pick(CHOICES));
  }

  function closeAll() {
    suppressRespawns = true;
    layer.querySelectorAll(".win95-popup").forEach(removePopup);
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
