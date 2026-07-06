/* ============================================================
   script.js — page init, counters, ticker, testimonial feed,
   live price chart, easter eggs. Loads last; uses Popups/Effects.
   ============================================================ */
"use strict";

(() => {
  const rand = (n) => Math.floor(Math.random() * n);
  const pick = (a) => a[rand(a.length)];

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

  /* ---------- crypto ticker (period-appropriate internet monies) ---------- */
  const COINS = [
    "CRYPTOCOIN", "E-GOLD", "DIGICASH", "NETCASH", "CYBERBUCKS", "WEBCENTS",
    "FLOOZ", "BEENZ", "MODEMCOIN", "DATADOLLAR", "INFOBAHN-FRANC", "MILLENNICOIN",
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

  /* ============================================================
     TESTIMONIAL LIVE FEED
     ============================================================ */
  const QUOTES = [
    "I invested after school and accidentally retired.",
    "My modem disconnected but my profits kept increasing.",
    "I convinced my boss to invest. Now he's my employee.",
    "My cousin said it was impossible. He still uses dial-up.",
    "The chart kept going up, so I trusted it.",
    "I printed this website and my printer became faster.",
    "My wallet says 12 million. I'm not asking questions.",
    "I clicked one button and suddenly owned three yachts.",
    "Every refresh adds another zero.",
    "I don't know what blockchain is, but it worked.",
    "My accountant cried tears of joy.",
    "I've never seen so many green numbers.",
    "The download took 14 hours but it was worth it.",
    "My family thinks I'm a genius.",
    "I heard about this on IRC.",
    "Works perfectly on Netscape.",
    "Best website since Yahoo.",
    "The blinking text convinced me.",
    "I mortgaged my Tamagotchi and never looked back.",
    "My teacher says get a job. I say get a wallet.",
    "Told my whole bowling league. We bought matching jackets.",
    "The spinning coin means it's working.",
    "I check my portfolio every commercial break.",
    "Bought coins with my paper route money. Now the route works for me.",
    "My screensaver mines while I sleep. I sleep 14 hours now.",
    "Dad said it's a fad. Dad also said that about the internet.",
    "I upgraded from 28.8k just to watch the chart faster.",
    "My guidance counselor asked ME for advice.",
    "Cashed out enough for a second phone line.",
    "The site loaded slowly, which proves how much data it has.",
    "I trust any website with this many stars.",
    "My AOL trial ended but my gains didn't.",
    "Made back my AOL hourly charges in one afternoon.",
    "I told the mailman. He retired on Tuesday.",
    "My computer gets warm, and that's the money forming.",
    "Followed the flashing arrow. Best decision of 1998.",
    "I was skeptical until the popup congratulated me personally.",
    "Now I only wear suits, even to the pool.",
    "My grandma invested her bingo winnings. She owns the hall now.",
    "The certificate warning said trusted, so I trust.",
    "My homepage, my hope, my future.",
    "Encarta has no article on this. Too new. Too powerful.",
    "I defragged my wallet and found extra coins.",
    "Winamp visualizations sync with my profits.",
    "My clan disbanded. We're an investment group now.",
    "The counter said I was visitor 9,999,999. Destiny.",
    "I bookmarked it under Favorites AND on paper.",
    "Bought my mom a bread maker. Cash.",
    "My pen pal in Sweden confirms: numbers also up there.",
    "I burned the chart onto a CD as evidence.",
    "The webmaster emailed me back. Class act.",
    "Five stars. Would refresh again.",
    "I quit my paper route to trade full time.",
    "It said 'quantum' so you know it's ahead of its time.",
    "My uncle works at the exchange and even he was impressed.",
    "My typing teacher says I click with confidence now.",
    "Turned my allowance into an empire.",
    "I saw the globe spinning and knew this was global.",
    "The MIDI music alone is worth the investment.",
    "Set it as my homepage at the library too. You're welcome.",
    "I wear sunglasses indoors now. That's just what happens.",
    "Even my Furby says BUY.",
    "The gradient told me everything I needed to know.",
    "My dentist invested mid-appointment.",
    "I have a beeper alert for every price change.",
    "My little brother doubled his lunch money. Twice.",
    "Refreshing this page is my cardio and my income.",
    "The FAQ answered questions I was afraid to ask.",
    "I've printed my portfolio. It's laminated now.",
    "My science fair project was this website. First place.",
    "Told my carpool. Now we carpool in five separate cars.",
    "The under-construction sign shows they never stop improving.",
    "I invested during a thunderstorm for extra power.",
    "The 3D text means it's the future.",
    "My savings account called. I let it go to the machine.",
    "I recognized greatness the moment my browser froze.",
    "Free shipping on all coins. Incredible.",
    "My wallet synchronized and so did my life.",
    "This beats my stamp collection by every metric.",
    "I only invest in sites with visitor counters.",
    "My neighbor's antenna picks up profits now.",
    "Y2K ready AND rich? Sign me up twice.",
    "I did sign up twice. Double profits.",
    "The marquee said HOT HOT HOT and it was right right right.",
  ];

  const SIGNERS = [
    "Gary, age 12", "Susan from Ohio", "DialUpDan", "WebSurfer98", "xX_Investor_Xx",
    "Chad P.", "A Satisfied Customer", "Brenda, homemaker", "CoolDave2000",
    "Mike from IRC", "The Peterson Family", "Anonymous Millionaire", "RollerbladeKing",
    "Tina, age 14", "NetscapeNavigator4Life", "Uncle Rick", "Local Business Owner",
    "FrostedTips87", "Doreen at the library", "Y2KPrepper", "Ed (retired, age 19)",
    "Gordon, mall kiosk owner", "56k_Steve", "Lisa in Sacramento", "TheRealWebmaster",
    "HappyInvestor44", "Dale, bowling league treasurer", "MomOnline", "PagerLord",
    "Kevin, honor student",
  ];

  const feed = document.getElementById("testimonial-feed");
  const MAX_FEED = 3;
  let deck = [];
  function nextQuote() {                    // shuffled deck: no repeats until pool exhausts
    if (!deck.length) deck = QUOTES.map((_, i) => i).sort(() => Math.random() - 0.5);
    return QUOTES[deck.pop()];
  }

  function addTestimonial(animate = true) {
    const el = document.createElement("div");
    el.className = "testimonial" + (animate ? " t-enter" : "");
    el.innerHTML = `💬 <i>"${nextQuote()}"</i> <span class="t-sig">— ${pick(SIGNERS)}</span>`;
    feed.prepend(el);
    if (feed.children.length > MAX_FEED) {
      const oldest = feed.lastElementChild;
      oldest.classList.add("t-exit");
      setTimeout(() => oldest.remove(), 450);   // remove after slide-out finishes
    }
    while (feed.children.length > MAX_FEED + 2) feed.lastElementChild.remove(); // hard trim safety
  }
  for (let i = 0; i < 3; i++) addTestimonial(false);   // seed the feed
  setInterval(() => { if (!document.hidden) addTestimonial(); }, 10000);

  /* ============================================================
     LIVE PRICE CHART — CryptoCoin (CRC)
     ============================================================ */
  const chartCanvas = document.getElementById("price-chart");
  const chartWrap = chartCanvas.parentElement;
  const cctx = chartCanvas.getContext("2d");
  const statsEl = document.getElementById("chart-stats");

  const N = 150;                       // points kept in the window
  const DAY = 86400000;
  const startDate = new Date(1998, 0, 5).getTime();
  let totalTicks = 0;
  const prices = [];
  const volumes = [];
  let mouse = null;

  function nextPrice(prev) {
    const drift = 0.004;                              // number generally goes up
    let noise = (Math.random() - 0.48) * 0.03;
    if (Math.random() < 0.05) noise -= 0.10 * Math.random();  // scary dip
    if (Math.random() < 0.03) noise += 0.07 * Math.random();  // euphoric pump
    return Math.max(50, prev * (1 + drift + noise));
  }
  const nextVolume = () => 40 + Math.random() * 360 + (Math.random() < 0.1 ? 500 * Math.random() : 0);

  let p = 1200;
  for (let i = 0; i < N; i++) { p = nextPrice(p); prices.push(p); volumes.push(nextVolume()); }

  const dateAt = (i) => new Date(startDate + (totalTicks + i) * DAY);
  const fmtDate = (d) => (d.getMonth() + 1) + "/" + d.getDate() + "/98";
  const fmtPrice = (v) => "$" + v.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });

  function sizeChart() {
    const dpr = devicePixelRatio || 1;
    chartCanvas.width = chartWrap.clientWidth * dpr;
    chartCanvas.height = chartWrap.clientHeight * dpr;
    drawChart();
  }

  function drawChart() {
    const dpr = devicePixelRatio || 1;
    const w = chartCanvas.width / dpr, h = chartCanvas.height / dpr;
    if (w < 50 || h < 50) return;
    cctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    const L = 8, R = 62, T = 10, B = 24;             // margins (prices on the right, like a real terminal)
    const pw = w - L - R, ph = h - T - B;
    const lo = Math.min(...prices), hi = Math.max(...prices);
    const pad = (hi - lo) * 0.06 || 1;
    const yMin = lo - pad, yMax = hi + pad;
    const X = (i) => L + (i / (N - 1)) * pw;
    const Y = (v) => T + (1 - (v - yMin) / (yMax - yMin)) * ph;

    // background
    cctx.fillStyle = "#000";
    cctx.fillRect(0, 0, w, h);

    // horizontal gridlines + right-side price labels
    cctx.strokeStyle = "#003300";
    cctx.fillStyle = "#00aa00";
    cctx.font = "10px 'Courier Prime', 'Courier New', monospace";
    cctx.textAlign = "left";
    cctx.textBaseline = "middle";
    for (let g = 0; g <= 5; g++) {
      const v = yMin + (g / 5) * (yMax - yMin);
      const y = Y(v);
      cctx.beginPath(); cctx.moveTo(L, y); cctx.lineTo(L + pw, y); cctx.stroke();
      cctx.fillText(fmtPrice(v), L + pw + 4, y);
    }

    // vertical gridlines + date labels
    cctx.textAlign = "center";
    cctx.textBaseline = "top";
    const step = Math.floor(N / 6);
    for (let i = step; i < N - step / 2; i += step) {
      const x = X(i);
      cctx.strokeStyle = "#002200";
      cctx.beginPath(); cctx.moveTo(x, T); cctx.lineTo(x, T + ph); cctx.stroke();
      cctx.fillStyle = "#00aa00";
      cctx.fillText(fmtDate(dateAt(i)), x, T + ph + 6);
    }

    // volume bars (bottom 18% of the plot)
    const vMax = Math.max(...volumes);
    const vh = ph * 0.18;
    for (let i = 0; i < N; i++) {
      const up = i === 0 || prices[i] >= prices[i - 1];
      cctx.fillStyle = up ? "rgba(0,255,0,.30)" : "rgba(255,60,60,.30)";
      const bh = (volumes[i] / vMax) * vh;
      cctx.fillRect(X(i) - pw / N / 2 + 1, T + ph - bh, Math.max(1, pw / N - 2), bh);
    }

    // area fill under price line
    const grad = cctx.createLinearGradient(0, T, 0, T + ph);
    grad.addColorStop(0, "rgba(0,255,0,.16)");
    grad.addColorStop(1, "rgba(0,255,0,0)");
    cctx.beginPath();
    cctx.moveTo(X(0), Y(prices[0]));
    for (let i = 1; i < N; i++) cctx.lineTo(X(i), Y(prices[i]));
    cctx.lineTo(X(N - 1), T + ph); cctx.lineTo(X(0), T + ph); cctx.closePath();
    cctx.fillStyle = grad;
    cctx.fill();

    // price line with CRT glow
    cctx.beginPath();
    cctx.moveTo(X(0), Y(prices[0]));
    for (let i = 1; i < N; i++) cctx.lineTo(X(i), Y(prices[i]));
    cctx.strokeStyle = "#00ff00";
    cctx.lineWidth = 1.5;
    cctx.shadowColor = "#00ff00";
    cctx.shadowBlur = 6;
    cctx.stroke();
    cctx.shadowBlur = 0;

    // high / low markers
    const hiIdx = prices.indexOf(hi), loIdx = prices.indexOf(lo);
    cctx.fillStyle = "#ffff00";
    cctx.textAlign = "center";
    cctx.textBaseline = "bottom";
    cctx.fillText("HIGH " + fmtPrice(hi), Math.min(Math.max(X(hiIdx), L + 40), L + pw - 40), Y(hi) - 3);
    cctx.textBaseline = "top";
    cctx.fillStyle = "#ff5555";
    cctx.fillText("LOW " + fmtPrice(lo), Math.min(Math.max(X(loIdx), L + 40), L + pw - 40), Y(lo) + 3);

    // current price marker (dashed line + tag in right margin)
    const cur = prices[N - 1];
    const cy = Y(cur);
    cctx.setLineDash([4, 3]);
    cctx.strokeStyle = "#00ffff";
    cctx.beginPath(); cctx.moveTo(L, cy); cctx.lineTo(L + pw, cy); cctx.stroke();
    cctx.setLineDash([]);
    cctx.fillStyle = "#003a3a";
    cctx.fillRect(L + pw + 1, cy - 8, R - 4, 16);
    cctx.fillStyle = "#00ffff";
    cctx.textAlign = "left";
    cctx.textBaseline = "middle";
    cctx.fillText(fmtPrice(cur), L + pw + 4, cy);

    // crosshair + readout on hover
    if (mouse && mouse.x >= L && mouse.x <= L + pw && mouse.y >= T && mouse.y <= T + ph) {
      const i = Math.round(((mouse.x - L) / pw) * (N - 1));
      const cx = X(i), py = Y(prices[i]);
      cctx.setLineDash([3, 3]);
      cctx.strokeStyle = "#888";
      cctx.beginPath(); cctx.moveTo(cx, T); cctx.lineTo(cx, T + ph); cctx.stroke();
      cctx.beginPath(); cctx.moveTo(L, py); cctx.lineTo(L + pw, py); cctx.stroke();
      cctx.setLineDash([]);
      cctx.fillStyle = "#00ff00";
      cctx.beginPath(); cctx.arc(cx, py, 3, 0, 7); cctx.fill();
      // readout box
      const label = fmtDate(dateAt(i)) + "  " + fmtPrice(prices[i]) + "  VOL " + Math.round(volumes[i]) + "K";
      cctx.font = "11px 'Courier Prime', 'Courier New', monospace";
      const tw = cctx.measureText(label).width + 12;
      const bx = Math.min(Math.max(cx - tw / 2, L), L + pw - tw);
      const by = mouse.y < T + 40 ? mouse.y + 14 : mouse.y - 30;
      cctx.fillStyle = "#c0c0c0";
      cctx.fillRect(bx, by, tw, 18);
      cctx.strokeStyle = "#000";
      cctx.strokeRect(bx, by, tw, 18);
      cctx.fillStyle = "#000";
      cctx.textAlign = "left";
      cctx.fillText(label, bx + 6, by + 9);
    }
  }

  function renderStats() {
    const cur = prices[N - 1], prev = prices[N - 2];
    const chg = ((cur - prev) / prev) * 100;
    const up = chg >= 0;
    statsEl.innerHTML =
      `<b>CRYPTOCOIN (CRC)</b> &nbsp;` +
      `<span class="${up ? "tick-up" : "tick-down"}">${fmtPrice(cur)} ${up ? "▲" : "▼"}${Math.abs(chg).toFixed(2)}%</span>` +
      ` &nbsp;|&nbsp; HIGH <span class="tick-up">${fmtPrice(Math.max(...prices))}</span>` +
      ` &nbsp;|&nbsp; LOW <span class="tick-down">${fmtPrice(Math.min(...prices))}</span>` +
      ` &nbsp;|&nbsp; VOL ${Math.round(volumes.reduce((a, b) => a + b) / N)}K`;
  }

  chartCanvas.addEventListener("mousemove", (e) => {
    const r = chartCanvas.getBoundingClientRect();
    mouse = { x: e.clientX - r.left, y: e.clientY - r.top };
    drawChart();
  });
  chartCanvas.addEventListener("mouseleave", () => { mouse = null; drawChart(); });
  addEventListener("resize", sizeChart);

  setInterval(() => {
    if (document.hidden) return;
    prices.push(nextPrice(prices[N - 1])); prices.shift();
    volumes.push(nextVolume()); volumes.shift();
    totalTicks++;
    drawChart();
    renderStats();
  }, 1800);

  sizeChart();
  renderStats();

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
      Popups.spawnSilly({ icon: "🧮", title: "Counter Services",
        text: "Visitor counter recalibrated. Thank you for your enthusiasm." });
    }
  });

  // click globe → turbo spin
  const globe = document.getElementById("spinning-globe");
  globe.addEventListener("click", () => {
    const g = globe.querySelector(".globe");
    g.classList.add("turbo");
    setTimeout(() => g.classList.remove("turbo"), 3000);
    Popups.spawnSilly({ icon: "🌍", title: "Global Market Network",
      text: "Global markets refreshed. All time zones report <b>favorable numbers</b>." });
  });

  // double-click logo → glitch + confetti
  document.getElementById("site-logo").addEventListener("dblclick", () => {
    Effects.glitch();
    Effects.confetti();
    Popups.spawnSilly({ icon: "✨", title: "Hidden Feature",
      text: "Hidden feature unlocked: <b>Chrome Mode</b>. Your experience is now 200% shinier." });
  });

  // under construction sign
  document.getElementById("under-construction").addEventListener("click", () => {
    Popups.spawnSilly({ icon: "🚧", title: "Construction Update",
      text: "This section is scheduled for completion in <b>Q3 1998</b>. Our team thanks you for your patience." });
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
      Popups.spawnSilly({ icon: "🎮", title: "Access Code Accepted",
        text: "Advanced visualization mode engaged. 30 bonus coins credited to your account*.<br><small>*display only</small>" });
      return;
    }

    // typed words
    if (e.key.length === 1) {
      typed = (typed + e.key.toLowerCase()).slice(-12);
      if (typed.endsWith("crypto")) {
        typed = "";
        for (let i = 0; i < 5; i++) setTimeout(() => Effects.explode(), i * 200);
        Popups.spawnSilly({ icon: "🪙", title: "Keyword Bonus",
          text: "Keyword recognized. Your keyboard has been upgraded to <b>financial grade</b>." });
      } else if (typed.endsWith("bitcoin")) {
        typed = "";
        Effects.confetti(innerWidth / 2, 100);
        Popups.spawnSilly({ icon: "₿", title: "Priority Processing",
          text: "Request received. Please allow <b>10 minutes</b> for network confirmation." });
      } else if (typed.endsWith("midi")) {
        typed = "";
        Popups.spawnSilly({ icon: "🎹", title: "Trading Floor Radio",
          text: "Our soundtrack is performed live by the CryptoMillions House Orchestra (1 sound card)." });
      }
    }

    // random shortcut: Alt+G for glitch
    if (e.key === "g" && e.altKey) Effects.glitch();
  });
})();
