/* ============================================================
   audio.js — fake MIDI jukebox via WebAudio square waves.
   No autoplay: everything starts from a user click.
   ============================================================ */
"use strict";

const Jukebox = (() => {
  // note name → frequency helper (equal temperament, A4=440)
  const NOTE = (n) => 440 * Math.pow(2, (n - 69) / 12);
  // tracks: arrays of [midiNote (0 = rest), beats]
  const TRACKS = [
    {
      name: "CYBER_CASH.MID",
      bpm: 160,
      notes: [[64,1],[64,1],[0,1],[64,1],[0,1],[60,1],[64,2],[67,2],[0,2],[55,2],
              [60,2],[0,1],[55,2],[0,1],[52,2],[0,1],[57,2],[59,2],[58,1],[57,2]],
    },
    {
      name: "BLOCKCHAIN_BOOGIE.MID",
      bpm: 140,
      notes: [[57,1],[57,1],[59,1],[57,1],[62,2],[61,2],[0,1],[57,1],[57,1],[59,1],
              [57,1],[64,2],[62,2],[0,1],[57,1],[57,1],[69,2],[66,1],[62,2],[61,2],[59,2]],
    },
    {
      name: "Y2K_PANIC.MID",
      bpm: 190,
      notes: [[45,1],[45,1],[57,1],[45,1],[45,1],[56,1],[45,1],[45,1],[55,1],[45,1],
              [45,1],[54,1],[45,1],[45,1],[53,1],[52,1],[50,1],[48,1]],
    },
  ];

  let ctx = null;
  let gainNode = null;
  let playing = false;
  let muted = false;
  let trackIdx = 0;
  let noteTimer = null;
  const display = document.getElementById("track-display");

  function ensureCtx() {
    if (!ctx) {
      ctx = new (window.AudioContext || window.webkitAudioContext)();
      gainNode = ctx.createGain();
      gainNode.gain.value = 0.08;
      gainNode.connect(ctx.destination);
    }
    if (ctx.state === "suspended") ctx.resume();
  }

  function playTrack() {
    const t = TRACKS[trackIdx];
    display.textContent = "♫ " + t.name + " ♫";
    const beat = 60 / t.bpm;
    let i = 0;
    const step = () => {
      if (!playing) return;
      const [n, beats] = t.notes[i];
      if (n && !muted) {
        const osc = ctx.createOscillator();
        osc.type = "square";
        osc.frequency.value = NOTE(n);
        const g = ctx.createGain();
        g.gain.setValueAtTime(1, ctx.currentTime);
        g.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + beats * beat * 0.9);
        osc.connect(g).connect(gainNode);
        osc.start();
        osc.stop(ctx.currentTime + beats * beat);
      }
      i = (i + 1) % t.notes.length;
      noteTimer = setTimeout(step, beats * beat * 1000);
    };
    step();
  }

  function stop() {
    playing = false;
    clearTimeout(noteTimer);
  }

  document.getElementById("btn-play").addEventListener("click", (e) => {
    ensureCtx();
    if (playing) {
      stop();
      e.target.textContent = "▶";
      display.textContent = "-- PAUSED --";
    } else {
      playing = true;
      e.target.textContent = "⏸";
      playTrack();
    }
  });

  document.getElementById("btn-mute").addEventListener("click", (e) => {
    muted = !muted;
    e.target.textContent = muted ? "🔊" : "🔇";
    if (muted) display.textContent = "-- MUTED --";
    else if (playing) display.textContent = "♫ " + TRACKS[trackIdx].name + " ♫";
  });

  document.getElementById("btn-next").addEventListener("click", () => {
    trackIdx = (trackIdx + 1) % TRACKS.length;
    if (playing) { stop(); playing = true; ensureCtx(); playTrack(); }
    else display.textContent = "NEXT: " + TRACKS[trackIdx].name;
  });

  return { stop };
})();
