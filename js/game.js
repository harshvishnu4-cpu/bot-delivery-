/* Delivery Bot Academy - game flow: story, rules, stages, UI. */
/* ================= GAME ================= */
(function(){
'use strict';
const $ = s => document.querySelector(s);
const stage = $('#stage');

/* ---------- icons ---------- */
const sv = (p, vb='0 0 24 24') => `<svg viewBox="${vb}" aria-hidden="true">${p}</svg>`;
const IC = {
  red: sv('<rect x="7" y="2" width="10" height="20" rx="3" fill="#183153"/><circle cx="12" cy="7" r="3" fill="#ff3b30"/><circle cx="12" cy="15" r="3" fill="#3a4350"/>'),
  green: sv('<rect x="7" y="2" width="10" height="20" rx="3" fill="#183153"/><circle cx="12" cy="7" r="3" fill="#3a4350"/><circle cx="12" cy="15" r="3" fill="#27d36b"/>'),
  person: sv('<circle cx="12" cy="4.5" r="2.6" fill="#183153"/><path d="M8.5 9.5h7l-.8 6H13l-.5 6h-1l-.5-6H9.3z" fill="#2F6FED"/><rect x="10.5" y="9" width="3" height="4" fill="#F2A93B"/>'),
  clearX: sv('<path d="M3 20h18" stroke="#183153" stroke-width="2.4" stroke-linecap="round"/><path d="M6 8h12M6 14h12" stroke="#fff" stroke-width="0"/><rect x="4" y="11" width="16" height="3" rx="1.5" fill="#fff" stroke="#183153" stroke-width="1.6"/><path d="M8 7l3 3 5-6" stroke="#2FA66A" stroke-width="2.6" fill="none" stroke-linecap="round" stroke-linejoin="round"/>'),
  cone: sv('<path d="M12 2.5l6 16H6z" fill="#ff7a1a"/><path d="M9.2 11h5.6l1 2.8H8.2z" fill="#fff"/><rect x="4" y="18.5" width="16" height="3" rx="1" fill="#ff7a1a"/>'),
  amb: sv('<rect x="1.5" y="7" width="14" height="10" rx="1.5" fill="#fff" stroke="#183153" stroke-width="1.4"/><path d="M15.5 10h4l3 3.5V17h-7z" fill="#fff" stroke="#183153" stroke-width="1.4"/><path d="M7 9.5h2.5V11H11v2.5H9.5V15H7v-1.5H5.5V11H7z" fill="#d9342b"/><rect x="6" y="4.5" width="4" height="2.5" rx="1" fill="#d9342b"/><circle cx="6" cy="18" r="2" fill="#183153"/><circle cx="18" cy="18" r="2" fill="#183153"/>'),
  cow: sv('<path d="M4 6.5c1.5.3 2.6 1 3.2 2M20 6.5c-1.5.3-2.6 1-3.2 2" stroke="#b69a6a" stroke-width="1.8" stroke-linecap="round" fill="none"/><path d="M7 8.5h10l.5 6c0 3.5-2.5 6-5.5 6s-5.5-2.5-5.5-6z" fill="#f2ede4" stroke="#183153" stroke-width="1.4"/><ellipse cx="12" cy="17.2" rx="3.6" ry="2.4" fill="#e8a7a0"/><circle cx="9.3" cy="11.8" r="1" fill="#183153"/><circle cx="14.7" cy="11.8" r="1" fill="#183153"/><path d="M13.5 8.5h3.5l.3 3.5c-1.8-.2-3.3-1.6-3.8-3.5z" fill="#8a5a35"/>'),
  ball: sv('<circle cx="12" cy="12" r="9" fill="#E76D5B"/><path d="M3.3 10h17.4v4H3.3z" fill="#ffd84a"/><path d="M3.1 11.3h17.8v1.4H3.1z" fill="#fff"/>'),
  GO: sv('<path d="M12 3l7 8h-4.2v10H9.2V11H5z" fill="currentColor"/>'),
  STOP: sv('<path d="M8 2.5h8l5.5 5.5v8L16 21.5H8L2.5 16V8z" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linejoin="round"/><rect x="7" y="10.6" width="10" height="2.8" rx="1" fill="currentColor"/>'),
  CHANGE: sv('<path d="M7 21v-4c0-3 6-4 6-8V6" stroke="currentColor" stroke-width="2.8" fill="none" stroke-linecap="round"/><path d="M9 7l4-4.5L17 7z" fill="currentColor"/><path d="M19 3v18" stroke="currentColor" stroke-width="2" stroke-dasharray="2.5 2.5"/>'),
  SLOW: sv('<path d="M3.5 17a8.5 8.5 0 1 1 17 0" stroke="currentColor" stroke-width="2.6" fill="none" stroke-linecap="round"/><path d="M12 17L7.5 11.5" stroke="currentColor" stroke-width="2.8" stroke-linecap="round"/><circle cx="12" cy="17" r="2.2" fill="currentColor"/><path d="M6 20.5h12" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"/>'),
  TURN: sv('<path d="M7 21v-7a5 5 0 0 1 5-5h4" stroke="currentColor" stroke-width="2.8" fill="none" stroke-linecap="round"/><path d="M15 4l5.5 5L15 14z" fill="currentColor"/>'),
  water: sv('<path d="M12 2.5c3 4 5 6.6 5 9a5 5 0 0 1-10 0c0-2.4 2-5 5-9z" fill="#69B9FF"/><path d="M10 11.5a2.2 2.2 0 0 0 1.5 2.3" stroke="#fff" stroke-width="1.4" fill="none" stroke-linecap="round"/><path d="M2.5 20.5c2-1.2 4-1.2 6 0s4 1.2 6 0 4-1.2 6.5 0" stroke="#2F6FED" stroke-width="2" fill="none" stroke-linecap="round"/>'),
  dry: sv('<circle cx="12" cy="9" r="4" fill="#F2A93B"/><path d="M12 1.8v2M12 14.2v2M4.8 9h-2M21.2 9h-2M6.9 3.9l1.4 1.4M17.1 3.9l-1.4 1.4" stroke="#F2A93B" stroke-width="2" stroke-linecap="round"/><path d="M3 20.5h18" stroke="#183153" stroke-width="2.6" stroke-linecap="round"/>'),
  block: sv('<rect x="2.5" y="7" width="19" height="6" rx="1" fill="#fff" stroke="#183153" stroke-width="1.4"/><path d="M7 7.5l-3 5M11.5 7.5l-3 5M16 7.5l-3 5M20.5 7.5l-3 5" stroke="#E76D5B" stroke-width="2.4"/><path d="M5 13v8M19 13v8" stroke="#183153" stroke-width="2" stroke-linecap="round"/><circle cx="12" cy="4" r="2" fill="#F2A93B"/>'),
  laneClear: sv('<path d="M4 21L8 3M20 21L16 3" stroke="#183153" stroke-width="2.2" stroke-linecap="round"/><path d="M12 3.5v3M12 10v3M12 16.5v3" stroke="#183153" stroke-width="1.8" stroke-linecap="round"/><path d="M13.6 12.8l2 2 3.6-4.4" stroke="#2FA66A" stroke-width="2.6" fill="none" stroke-linecap="round" stroke-linejoin="round"/>'),
  scooter: sv('<circle cx="6" cy="17.5" r="2.8" fill="none" stroke="#183153" stroke-width="2"/><circle cx="18" cy="17.5" r="2.8" fill="none" stroke="#183153" stroke-width="2"/><path d="M6 17.5h7.5l2.5-8.5h3" stroke="#E76D5B" stroke-width="2.6" fill="none" stroke-linecap="round" stroke-linejoin="round"/><path d="M7.5 13.5h6" stroke="#E76D5B" stroke-width="3" stroke-linecap="round"/><circle cx="11" cy="6" r="2.3" fill="#2F6FED"/>'),
  bump: sv('<path d="M12 2.5l7 11.5H5z" fill="#F2A93B"/><path d="M8.5 11.5c1-2 2-2.8 3.5-2.8s2.5.8 3.5 2.8" stroke="#183153" stroke-width="1.6" fill="none" stroke-linecap="round"/><path d="M2 20h5c1.5 0 2.5-3.5 5-3.5s3.5 3.5 5 3.5h5" stroke="#183153" stroke-width="2.4" fill="none" stroke-linecap="round"/>'),
  turnSign: sv('<rect x="3" y="3" width="18" height="18" rx="4" fill="#2F6FED"/><path d="M9 19v-6a3 3 0 0 1 3-3h4" stroke="#fff" stroke-width="2.6" fill="none" stroke-linecap="round"/><path d="M14.5 6.5L18 10l-3.5 3.5" stroke="#fff" stroke-width="2.6" fill="none" stroke-linecap="round" stroke-linejoin="round"/>'),
  house: sv('<path d="M3 11.5L12 4l9 7.5" stroke="currentColor" stroke-width="2.4" fill="none" stroke-linecap="round" stroke-linejoin="round"/><path d="M5.5 10v10h13V10" fill="currentColor"/><rect x="10" y="14" width="4" height="6" fill="#fff"/>'),
  bowl: sv('<path d="M3 11h18a9 7.5 0 0 1-18 0z" fill="#F2A93B"/><path d="M8.5 7.5c0-1.8 1.8-1.8 1.8-4M13.5 7.5c0-1.8 1.8-1.8 1.8-4" stroke="#8b98a8" stroke-width="1.6" fill="none" stroke-linecap="round"/>'),
  PULL: sv('<path d="M17 21v-8c0-3-2-5-5-5H9" stroke="currentColor" stroke-width="2.8" fill="none" stroke-linecap="round"/><path d="M10 4L5 8l5 4z" fill="currentColor"/><path d="M3 3v18" stroke="currentColor" stroke-width="2" stroke-dasharray="2 2"/>'),
  Q: sv('<path d="M9 9a3 3 0 1 1 4.2 2.8c-.8.4-1.2 1-1.2 1.9V15" stroke="currentColor" stroke-width="2.8" fill="none" stroke-linecap="round"/><circle cx="12" cy="19" r="1.7" fill="currentColor"/>'),
  play: sv('<path d="M7 4.5l13 7.5-13 7.5z" fill="currentColor"/>'),
  next: sv('<path d="M5 12h12M12 5l7 7-7 7" stroke="currentColor" stroke-width="3" fill="none" stroke-linecap="round" stroke-linejoin="round"/>'),
  replay: sv('<path d="M4 12a8 8 0 1 0 2.4-5.7" stroke="currentColor" stroke-width="2.6" fill="none" stroke-linecap="round"/><path d="M3 3.5V9h5.5" stroke="currentColor" stroke-width="2.6" fill="none" stroke-linecap="round" stroke-linejoin="round"/><path d="M10.5 9.5l4.5 2.5-4.5 2.5z" fill="currentColor"/>'),
  cc: sv('<rect x="2.5" y="5" width="19" height="14" rx="3" fill="none" stroke="currentColor" stroke-width="2.4"/><path d="M10.5 10a2.5 2.5 0 1 0 0 4M17 10a2.5 2.5 0 1 0 0 4" stroke="currentColor" stroke-width="2.2" fill="none" stroke-linecap="round"/>'),
  snd: sv('<path d="M4 9v6h4l5 4V5L8 9z" fill="currentColor"/><path d="M16.5 8.5a5 5 0 0 1 0 7M19 6a8.5 8.5 0 0 1 0 12" stroke="currentColor" stroke-width="2.4" fill="none" stroke-linecap="round"/>'),
  mute: sv('<path d="M4 9v6h4l5 4V5L8 9z" fill="currentColor"/><path d="M16.5 9.5l5 5M21.5 9.5l-5 5" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"/>'),
  pause: sv('<rect x="6" y="4" width="4.5" height="16" rx="1.4" fill="currentColor"/><rect x="13.5" y="4" width="4.5" height="16" rx="1.4" fill="currentColor"/>'),
  restart: sv('<path d="M20 12a8 8 0 1 1-2.4-5.7" stroke="currentColor" stroke-width="2.6" fill="none" stroke-linecap="round"/><path d="M21 3.5V9h-5.5" stroke="currentColor" stroke-width="2.6" fill="none" stroke-linecap="round" stroke-linejoin="round"/>'),
  up: sv('<path d="M6 15l6-6 6 6" stroke="currentColor" stroke-width="3" fill="none" stroke-linecap="round" stroke-linejoin="round"/>'),
  down: sv('<path d="M6 9l6 6 6-6" stroke="currentColor" stroke-width="3" fill="none" stroke-linecap="round" stroke-linejoin="round"/>'),
  bulb: sv('<path d="M9 18h6M10 21h4" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"/><path d="M12 2.5a6.5 6.5 0 0 0-3.8 11.8c.6.5.8 1 .8 1.7h6c0-.7.2-1.2.8-1.7A6.5 6.5 0 0 0 12 2.5z" fill="currentColor"/>'),
  check: sv('<path d="M5 12.5l4.5 4.5L19 7.5" stroke="currentColor" stroke-width="3.2" fill="none" stroke-linecap="round" stroke-linejoin="round"/>'),
  alert: sv('<path d="M12 3l10 18H2z" fill="currentColor"/><path d="M12 9.5v5" stroke="#fff" stroke-width="2.6" stroke-linecap="round"/><circle cx="12" cy="17.6" r="1.5" fill="#fff"/>'),
  horn: sv('<path d="M3 10v4h3l9 5V5L6 10z" fill="currentColor"/><path d="M18 8l3-2M18 12h3.5M18 16l3 2" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"/>'),
  eye: sv('<path d="M1.5 12S5.5 5 12 5s10.5 7 10.5 7-4 7-10.5 7S1.5 12 1.5 12z" fill="none" stroke="currentColor" stroke-width="2.2"/><circle cx="12" cy="12" r="3.4" fill="currentColor"/>'),
  list: sv('<path d="M9 6h11M9 12h11M9 18h11" stroke="currentColor" stroke-width="2.6" stroke-linecap="round"/><circle cx="4.5" cy="6" r="1.8" fill="currentColor"/><circle cx="4.5" cy="12" r="1.8" fill="currentColor"/><circle cx="4.5" cy="18" r="1.8" fill="currentColor"/>'),
  wrench: sv('<path d="M14.5 3.5a5 5 0 0 0-5.3 6.6L3 16.3 7.7 21l6.2-6.2a5 5 0 0 0 6.6-5.3l-3 3-3.2-.8-.8-3.2z" fill="currentColor"/>'),
  build: sv('<rect x="3" y="3" width="8" height="8" rx="2" fill="currentColor"/><rect x="13" y="13" width="8" height="8" rx="2" fill="currentColor"/><rect x="13" y="3" width="8" height="8" rx="2" fill="currentColor" opacity=".45"/><rect x="3" y="13" width="8" height="8" rx="2" fill="currentColor" opacity=".45"/>'),
  flag: sv('<path d="M5 21V3" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"/><path d="M6 4h12l-3 4.5 3 4.5H6z" fill="currentColor"/>'),
  parcel: sv('<path d="M12 2l9 4.5v11L12 22l-9-4.5v-11z" fill="currentColor"/><path d="M3 6.5l9 4.5 9-4.5M12 11v11" stroke="#fff" stroke-width="1.6" fill="none"/>'),
  think: sv('<circle cx="12" cy="12" r="9" fill="none" stroke="currentColor" stroke-width="2.4"/><path d="M12 7v5l3.5 2" stroke="currentColor" stroke-width="2.4" fill="none" stroke-linecap="round"/>'),
  turn: sv('<path d="M12 21V11a5 5 0 0 1 5-5h1" stroke="currentColor" stroke-width="2.8" fill="none" stroke-linecap="round"/><path d="M12 11a5 5 0 0 0-5-5H6" stroke="currentColor" stroke-width="2.8" fill="none" stroke-linecap="round"/><path d="M4 3l-2 3 3 2M20 3l2 3-3 2" stroke="currentColor" stroke-width="2.2" fill="none" stroke-linecap="round"/>'),
  back: sv('<path d="M8 20V11a5 5 0 0 1 10 0v2" stroke="currentColor" stroke-width="2.8" fill="none" stroke-linecap="round"/><path d="M4 16l4 4 4-4" stroke="currentColor" stroke-width="2.8" fill="none" stroke-linecap="round" stroke-linejoin="round"/>')
};

/* ---------- vocabulary ---------- */
const COND = {
  water:{t:'Water on road', i:'water'}, dry:{t:'Road is dry', i:'dry'},
  block:{t:'Road block ahead', i:'block'}, laneClear:{t:'Other lane clear', i:'laneClear'}, scooter:{t:'Scooter coming', i:'scooter'},
  bump:{t:'Speed breaker', i:'bump'}, turn:{t:'Turn ahead', i:'turnSign'}, clear:{t:'Road is clear', i:'clearX'}
};
const ACTN = { GO:{t:'GO'}, STOP:{t:'STOP'}, SLOW:{t:'SLOW DOWN'}, CHANGE:{t:'CHANGE LANE'}, TURN:{t:'TURN'} };
const ACOL = { GO:'#2FA66A', STOP:'#E76D5B', SLOW:'#F2A93B', CHANGE:'#2F6FED', TURN:'#7B5CE0', Q:'#183153' };
const chipCond = k => `<span class="chip cond"><span class="ci">${IC[COND[k].i]}</span>${COND[k].t}</span>`;
const chipAct = k => `<span class="chip act a-${k}"><span class="ci">${IC[k]}</span>${ACTN[k].t}</span>`;
const chipKw = k => `<span class="chip kwc">${k}</span>`;

function sensors(s){ return { water:!!s.water, dry:!s.water, block:!!s.block, laneClear:!s.scooter, scooter:!!s.scooter, bump:!!s.bump, turn:!!s.turn,
  clear: !(s.water||s.block||s.scooter||s.bump||s.turn) }; }
function needOf(s){ if(s.block && s.scooter) return 'STOP'; if(s.water||s.bump) return 'SLOW'; if(s.block) return 'CHANGE'; if(s.turn) return 'TURN'; return 'GO'; }
function condVal(rule, sn){ const a = sn[rule.c1]; if(!rule.op) return {res:a, parts:[a]}; const b = sn[rule.c2]; return {res: rule.op==='AND' ? (a&&b) : (a||b), parts:[a,b]}; }
function evaluate(rules, sn){ const checks=[]; for(let i=0;i<rules.length;i++){ const r=rules[i]; const cv=condVal(r, sn); checks.push({i, parts:cv.parts, res:cv.res});
    if(cv.res) return {action:r.then, index:i, branch:'then', checks}; if(r.else) return {action:r.else, index:i, branch:'else', checks}; }
  return {action:null, index:-1, checks}; }

/* ---------- narration ---------- */
const L = {
  intro1: "Namaste! Meet Zippy, a delivery robot. Today Zippy must deliver hot biryani to Mrs. Sharma.",
  intro2: "Zippy only drives straight. You are its rule designer. It follows your rules exactly.",
  pred1: "Zippy's steps: forward, forward, forward, stop. But the road has water. What will Zippy do?",
  pred2: "Let's find out. First, a practice run on an empty, straight street. Press Run.",
  fix1: "Perfect! On a straight, empty street, Zippy's steps work.",
  fix2: "Now the real road, with water and a road block. Same steps. Press Run.",
  fixFail: "Oh no! Zippy slipped on the water and crashed into the road block!",
  predSafe: "You guessed slow down. But its steps never told it to check the road.",
  predGo: "You guessed it would keep going straight, and that's exactly what happened.",
  predBack: "You guessed it would turn back. But its steps only said forward.",
  fix3: "Straight-only steps won't reach Mrs. Sharma. Let's teach Zippy smarter rules, one at a time.",
  bcA: ["A rule says: IF something is true, THEN do this. ELSE, do that.", "Build a water rule so Zippy doesn't slip. Then press Run."],
  bcAh1: "What should Zippy do when there is water on the road?",
  bcAh2: "Try this: IF water on road, THEN slow down. ELSE, go.",
  bcAok: "Shabash! One rule handled both the water and the dry road.",
  bcB: "Road block ahead, and a scooter is coming. Press Run to test your water rule.",
  bcBfail: ["Crash! Your water rule said go, but a road block was ahead.", "Go around only if the other lane is clear. AND means both must be true."],
  crashB: "Crash! A road block! If the other lane isn't clear, what should Zippy do?",
  bcBh1: "Changing lane is safe only when two things are true. What are they?",
  bcBh2: "Try: IF road block ahead AND other lane clear, THEN change lane. ELSE, stop.",
  bcBok: "Excellent! With AND, Zippy goes around only when both things are true.",
  ord: ["Zippy checks its rules from top to bottom. The first rule that fits wins.", "Next comes a turn, with water right at it. Order the rules, then press Run."],
  ordh1: "Water and a turn at the same time. Which rule should Zippy follow first?",
  ordh2: "Turning on a wet road is slippery. Move the water rule above the turn rule.",
  ordOk: "Well done! Zippy slowed down first, then turned safely onto the next street.",
  dbg: "These rules have a bug. Watch the run and see which rule Zippy uses.",
  dbgFail: ["Crash! The road was dry, so the top rule fit first.", "Zippy never checked for the road block. Can you fix the order?"],
  dbgh1: "Which matters more: a dry road, or a road block ahead?",
  dbgh2: "Move the road block rule above the dry road rule.",
  dbgOk: "Bug fixed! A general rule should not come before a more important one.",
  fin: ["Last street! Sometimes there's water. Sometimes a speed breaker. Either one means slow down.", "Build the whole rule yourself this time, joining words too."],
  finh1: "Every rule starts with IF. Then pick the two things Zippy should watch for.",
  finh2: "Try: IF water OR speed breaker, THEN slow down. ELSE, go.",
  finAnd: ["AND needs water and a speed breaker together. Here there was only one!", "Which joining word means either one is enough?"],
  finOk: "Brilliant! OR means either one is enough.",
  grammar: ["Zippy can't read this rule. IF starts it. AND or OR joins two conditions.", "THEN says what to do. ELSE says what to do otherwise."],
  run: ["The real delivery! Three streets, two turns, and Mrs. Sharma is waiting.", "Zippy will use all your rules. Press Start and watch every decision."],
  runOk: "Delivered! Mrs. Sharma got her biryani, hot and safe.",
  done: "Zippy delivered the biryani! Mrs. Sharma says thank you, rule designer!",
  empty: "There's an empty space in the rule. Fill every space, then press Run.",
  slip: "Zippy slipped! What does your rule say to do when there's water?",
  slipTurn: "Zippy slipped turning on the wet road! The top rule wins. Which matters more?",
  crash: "Crash! There was a road block, and Zippy's rule said go.",
  scooter: "Safety stop! A scooter was coming. Change lane only when the other lane is clear.",
  bump: "Bump! The biryani nearly flew out! What should Zippy do at a speed breaker?",
  missed: "Zippy missed the turn and hit a closed road! When the road turns, turn too.",
  stuck: "The road was clear, but Zippy waited! What should your rule say when it's safe?",
  norule: "No rule fit, so Zippy didn't know what to do."
};

/* ---------- audio: sfx (Web Audio, generated) ---------- */
const A = { ctx:null, muted:false, master:null };
function audioInit(){ if(A.ctx) return; try{ A.ctx = new (window.AudioContext||window.webkitAudioContext)(); A.master = A.ctx.createGain(); A.master.gain.value = 0.55; A.master.connect(A.ctx.destination); engineInit(); }catch(e){} }
function tone(f, d, type='sine', v=0.25, when=0, slide=null){ if(!A.ctx||A.muted) return; const t=A.ctx.currentTime+when; const o=A.ctx.createOscillator(), g=A.ctx.createGain(); o.type=type; o.frequency.setValueAtTime(f,t); if(slide) o.frequency.exponentialRampToValueAtTime(slide, t+d);
  g.gain.setValueAtTime(0.0001,t); g.gain.exponentialRampToValueAtTime(v,t+0.015); g.gain.exponentialRampToValueAtTime(0.0001,t+d); o.connect(g); g.connect(A.master); o.start(t); o.stop(t+d+0.05); }
function noise(d, v=0.2, freq=900){ if(!A.ctx||A.muted) return; const b=A.ctx.createBuffer(1, A.ctx.sampleRate*d, A.ctx.sampleRate), ch=b.getChannelData(0); for(let i=0;i<ch.length;i++) ch[i]=(Math.random()*2-1)*(1-i/ch.length);
  const s=A.ctx.createBufferSource(); s.buffer=b; const f=A.ctx.createBiquadFilter(); f.type='bandpass'; f.frequency.value=freq; const g=A.ctx.createGain(); g.gain.value=v; s.connect(f); f.connect(g); g.connect(A.master); s.start(); }
const SFX = {
  tap(){ tone(660,0.06,'triangle',0.15); }, place(){ tone(520,0.07,'triangle',0.2); tone(880,0.09,'triangle',0.16,0.05); },
  remove(){ tone(420,0.08,'triangle',0.15,0,260); }, bad(){ tone(220,0.16,'square',0.08); tone(180,0.2,'square',0.08,0.13); },
  ok(){ [523,659,784,1047].forEach((f,i)=>tone(f,0.22,'triangle',0.18,i*0.09)); },
  whistle(){ tone(2100,0.14,'sine',0.14); tone(2300,0.3,'sine',0.14,0.16); noise(0.25,0.15,600); },
  brake(){ noise(0.45,0.25,1800); }, horn(){ tone(392,0.28,'square',0.07); tone(494,0.28,'square',0.06); },
  check(){ tone(990,0.05,'sine',0.08); }, moo(){ tone(170,0.9,'sawtooth',0.07,0,120); },
  drop(){ tone(300,0.12,'triangle',0.2,0,160); noise(0.15,0.2,400); }, whoosh(){ noise(0.5,0.12,500); },
  splash(){ noise(0.55,0.32,2600); noise(0.35,0.2,900); }, crash(){ noise(0.6,0.5,280); tone(110,0.4,'square',0.12,0,45); tone(700,0.15,'triangle',0.1,0.06,300); },
  bump(){ tone(95,0.28,'sine',0.35,0,45); noise(0.2,0.25,300); }, blinker(){ for(let i=0;i<3;i++){ tone(1500,0.035,'square',0.05,i*0.5); tone(1050,0.035,'square',0.05,i*0.5+0.25); } }
};
let siren=null;
function sirenOn(){ if(!A.ctx||siren) return; const o=A.ctx.createOscillator(), g=A.ctx.createGain(), l=A.ctx.createOscillator(), lg=A.ctx.createGain(); o.type='triangle'; o.frequency.value=760; l.frequency.value=1.6; lg.gain.value=160; l.connect(lg); lg.connect(o.frequency); g.gain.value=A.muted?0:0.05; o.connect(g); g.connect(A.master); o.start(); l.start(); siren={o,g,l}; }
function sirenOff(){ if(!siren) return; try{ siren.o.stop(); siren.l.stop(); }catch(e){} siren=null; }
let eng=null;
function engineInit(){ const o=A.ctx.createOscillator(), f=A.ctx.createBiquadFilter(), g=A.ctx.createGain(); o.type='sawtooth'; o.frequency.value=60; f.type='lowpass'; f.frequency.value=300; g.gain.value=0; o.connect(f); f.connect(g); g.connect(A.master); o.start(); eng={o,g}; }
function engineUpd(){ if(!eng) return; const v=W.Z.v; eng.o.frequency.value = 55 + v*9; eng.g.gain.value = A.muted||paused||document.body.classList.contains('video-on') ? 0 : 0.012 + Math.min(v,14)*0.0028; }

/* ---------- time + cancellable coroutines ---------- */
let gt = 0, paused = false, epoch = 0; const CANCEL = {cancel:true};
const waiters = [];
function until(fn){ const e=epoch; const p=new Promise((res,rej)=>waiters.push({fn,res,rej,e})); p.catch(()=>{}); return p; }
function wait(s){ const t=gt+s; return until(()=>gt>=t); }
function pumpWaiters(){ for(let i=waiters.length-1;i>=0;i--){ const w=waiters[i]; if(w.e!==epoch){ waiters.splice(i,1); w.rej(CANCEL); continue; } let ok=false; try{ ok=w.fn(); }catch(e){ ok=true; } if(ok){ waiters.splice(i,1); w.res(); } } }
function clickOnce(btn){ let hit=false; const h=()=>{ hit=true; }; btn.addEventListener('click', h, {once:true}); return until(()=>hit); }

/* ---------- speech ---------- */
const SP = { voice:null, cur:null, done:true, last:'', captions:true, token:0, gen:0, audio:null };
// voiceover clips (ElevenLabs voice "Chutki", id Jr72SE8p9OcJmr8hyX0D): assets/audio/vo/<key>.mp3, or <key>_<n>.mp3 for multi-box lines.
// If you edit a line in L, regenerate its clip too, or the caption and the voice won't match.
const VO = new Map(); for(const [k,v] of Object.entries(L)) [].concat(v).forEach((t,i,a)=>VO.set(t, `assets/audio/vo/${a.length>1 ? k+'_'+(i+1) : k}.mp3`));
function stopAudio(){ const a=SP.audio; if(a){ a.onended=a.onerror=null; a.pause(); SP.audio=null; } }
function pickVoice(){ const vs = (window.speechSynthesis && speechSynthesis.getVoices()) || []; if(!vs.length) return null;
  return vs.find(v=>/en[-_]IN/i.test(v.lang)&&v.localService) || vs.find(v=>/en[-_]IN/i.test(v.lang)) || vs.find(v=>/india|heera|ravi|rishi|veena|neel|prabhat|kajal/i.test(v.name)) || vs.find(v=>/^en/i.test(v.lang)&&v.localService) || vs.find(v=>/^en/i.test(v.lang)) || null; }
if(window.speechSynthesis){ SP.voice = pickVoice(); speechSynthesis.onvoiceschanged = ()=>{ SP.voice = pickVoice(); }; }
// say(line) or say([line, line]): an array plays as consecutive caption boxes; a newer say() or stopSpeech() ends the chain
function say(text){ const gen = ++SP.gen; SP.last = text; const lines = [].concat(text);
  return lines.reduce((p,t,i)=>p.then(()=>{ if(SP.gen===gen) return sayOne(t, i===lines.length-1); }), Promise.resolve()); }
function sayOne(text, last){
  const tok = ++SP.token; SP.done = false;
  showCaption(text);
  const words = text.split(/\s+/).length; const minEnd = gt + Math.max(2.2, words*0.36);
  let spoke = false, ended = false;
  stopAudio(); try{ if(window.speechSynthesis) speechSynthesis.cancel(); }catch(e){}
  const src = VO.get(text);
  if(src){ // recorded voice; muted clips still play silently so the caption keeps the same timing
    const a = new Audio(src); a.muted = A.muted; SP.audio = a; spoke = true;
    a.onended = ()=>{ if(tok===SP.token) ended = true; }; a.onerror = ()=>{ if(tok===SP.token) spoke = false; }; // missing file: fall back to timing
    const p = a.play(); if(p && p.catch) p.catch(()=>{ if(tok===SP.token) spoke = false; }); if(paused) a.pause(); }
  else try{ if(window.speechSynthesis && !A.muted && speechSynthesis.getVoices().length){ const u = new SpeechSynthesisUtterance(text); if(SP.voice) u.voice = SP.voice; u.lang = 'en-IN'; u.rate = 0.98; u.pitch = 1.05;
        u.onend = ()=>{ if(tok===SP.token) ended = true; }; u.onerror = ()=>{ if(tok===SP.token) ended = true; }; speechSynthesis.speak(u); spoke = true; } }catch(e){}
  const hardEnd = gt + words*0.62 + 3;
  talkLock(true);
  return until(()=> tok!==SP.token || (spoke ? (ended || gt>=hardEnd) : gt>=minEnd)).then(()=>{ if(tok===SP.token){ SP.done = true; if(last) talkLock(false); } });
}
function stopSpeech(){ SP.token++; SP.gen++; stopAudio(); try{ speechSynthesis.cancel(); }catch(e){} talkLock(false); }
// while Zippy is speaking, the panel, CTA and results card can't be used; they unlock when the line ends
function talkLock(on){ for(const s of ['#panel','#cta','#done']){ const e=$(s); if(e) e.inert=on; } stage.classList.toggle('talking', on);
  if(!on){ const b=$('#ctaBtn'); if(b && !$('#cta').classList.contains('hide')) b.focus({preventScroll:true}); } }
function showCaption(t){ $('#capText').textContent = t; $('#cap').classList.toggle('empty', !t); }
function clearCaption(){ $('#cap').classList.add('empty'); }

/* ---------- motion (GSAP) ---------- */
const FX = window.gsap ? {
  pop(el){ gsap.fromTo(el, {scale:.6, y:-20, opacity:0}, {scale:1, y:0, opacity:1, duration:.5, ease:'back.out(2.2)'}); },
  rise(el){ gsap.fromTo(el, {scale:.4, opacity:0}, {scale:1, opacity:1, duration:.55, ease:'back.out(2)', clearProps:'transform,opacity'}); },
  stagger(els, delay=0){ gsap.fromTo(els, {y:24, opacity:0}, {y:0, opacity:1, duration:.5, stagger:.08, delay, ease:'power2.out'}); },
  titleOut(el, done){ gsap.to(el, {opacity:0, scale:1.06, duration:.8, ease:'power2.inOut', onComplete:done}); }
} : { pop(){}, rise(){}, stagger(){}, titleOut(el, done){ el.classList.add('hide'); setTimeout(done, 900); } };

/* ---------- ui helpers ---------- */
const panel = $('#panel');
function setPanel(html){ panel.innerHTML = html; panel.classList.remove('out'); W.cam.shiftTarget = 0.16; }
function hidePanel(){ panel.classList.add('out'); W.cam.shiftTarget = 0; }
function head(icon, title, sub){ return `<div class="ph-head"><div class="ic">${IC[icon]}</div><div><h2>${title}</h2>${sub?`<small>${sub}</small>`:''}</div></div>`; }
function toast(kind, text){ const col = kind==='ok'?'#2FA66A':kind==='warn'?'#F2A93B':'#E76D5B'; const ic = kind==='ok'?IC.check:kind==='warn'?IC.horn:IC.alert;
  $('#toast').innerHTML = `<div class="t"><div class="ci" style="background:${col}">${ic}</div>${text}</div>`; $('#toast').classList.remove('hide'); FX.pop('#toast .t'); bubble(null); }
function hideToast(){ $('#toast').classList.add('hide'); }
function bubble(action){ const el=$('#bubble'); if(!action){ el.classList.add('hide'); return; } const t = action==='Q' ? '?' : ACTN[action].t;
  el.innerHTML = `<div class="b"><div class="ci" style="background:${ACOL[action]}">${IC[action]}</div>${t}</div>`; el.classList.remove('hide'); }
function hud(st){ const el=$('#hud'); if(!st){ el.classList.add('hide'); return; } const items=[];
  if(st.water) items.push(['water','Water on road']); if(st.block) items.push(['block','Road block ahead']);
  if(st.scooter) items.push(['scooter','Scooter coming']); else if(st.block) items.push(['laneClear','Other lane clear']);
  if(st.bump) items.push(['bump','Speed breaker']); if(st.turn) items.push(['turnSign','Turn ahead']); if(!items.length) items.push(['dry','Road clear']);
  el.innerHTML = `<div class="s eye"><span class="ci">${IC.eye}</span>Zippy sees</div>` + items.map(([i,t])=>`<div class="s"><span class="ci">${IC[i]}</span>${t}</div>`).join(''); el.classList.remove('hide'); }
// the plate is one SVG; the caps and the plate are clipped copies of it so they can open like a capsule
function cta(label){ const el=$('#cta'), F='assets/skai/cta-frame.svg';
  el.innerHTML = `<button class="sk-cta" id="ctaBtn"><span class="sk-cta-in"><img class="plate" src="${F}" alt=""><span class="lbl">${label}</span>
    <span class="capL"><img src="${F}" alt=""><img src="assets/skai/cta-bracket.svg" alt="" style="left:-0.3px;top:50.5px"></span><span class="capR"><img src="${F}" alt=""></span><img class="stripes" src="assets/skai/cta-stripes.svg" alt="" style="left:48px;top:19.1px"></span></button>`;
  el.classList.remove('hide'); stage.classList.add('cta-on'); const b=$('#ctaBtn'), lbl=b.querySelector('.lbl'); const fit=()=>{ lbl.style.fontSize=''; const w=lbl.scrollWidth; if(w>440) lbl.style.fontSize=(43.43*440/w)+'px'; }; fit(); document.fonts && document.fonts.ready.then(fit);
  openCta(b); setTimeout(()=>b.focus({preventScroll:true}),50); return clickOnce(b).then(()=>{ SFX.tap(); hideCta(); b.id=''; b.disabled=true; }); }
// capsule open: closed pill pops in, caps slide apart while the plate widens from the centre, then the label
function openCta(b){ const q=s=>b.querySelector(s), inn=q('.sk-cta-in'), done=()=>inn.classList.add('pulse');
  if(!window.gsap || matchMedia('(prefers-reduced-motion: reduce)').matches){ done(); return; }
  const open={duration:.55, ease:'power3.inOut'};
  gsap.timeline({onComplete:done})
    .fromTo(inn, {scale:.55, opacity:0}, {scale:1, opacity:1, duration:.28, ease:'back.out(2.2)', clearProps:'transform,opacity'})
    .fromTo(q('.capL'), {x:195}, {x:0, ...open}, .24)
    .fromTo(q('.capR'), {x:-195}, {x:0, ...open}, .24)
    .fromTo(q('.plate'), {clipPath:'inset(0% 50% 0% 50%)'}, {clipPath:'inset(0% 0% 0% 0%)', ...open}, .24)
    .fromTo([q('.stripes'), q('.lbl')], {opacity:0, y:10}, {opacity:1, y:0, duration:.3, stagger:.06, ease:'power2.out', clearProps:'transform'}, .64); }
function hideCta(){ $('#cta').classList.add('hide'); stage.classList.remove('cta-on'); }
async function flash(){ const f=$('#flash'); f.classList.add('on'); SFX.whoosh(); await wait(0.28); return ()=>f.classList.remove('on'); }

/* ---------- hints (after 12 s idle) ---------- */
const H = { list:null, idx:0, last:0, el:null };
function hintsOn(list, container){ H.list=list; H.idx=0; H.last=gt; H.el=container; syncHint(); }
function hintsOff(){ H.list=null; if(H.el) H.el.innerHTML=''; syncHint(); }
function syncHint(){ $('#skHint').disabled = !(H.list && H.idx < H.list.length); }
function poke(){ H.last = gt; }
['pointerdown','keydown'].forEach(ev=>addEventListener(ev, poke, true));
function hintTick(){ if(!H.list || paused) return; if(gt - H.last >= 12 && H.idx < H.list.length){ const t=H.list[H.idx++]; H.last=gt; syncHint(); if(H.el){ H.el.innerHTML = `<div class="hint">${IC.bulb}<span>${t}</span></div>`; } say(t); } }

/* ---------- progress ---------- */
const STEPS = [['PREDICTION','Predict','Q'],['FIXED_ROUTE_TEST','Test','flag'],['BUILD_CONDITIONAL','Build','build'],['ORDER_RULES','Order','list'],['DEBUG_PRIORITY','Debug','wrench'],['BUILD_FINAL_RULE','Create','build'],['FINAL_RUN','Deliver','parcel']];
function renderProg(cur){ const idx = STEPS.findIndex(st=>st[0]===cur), done = cur==='COMPLETE', n = done ? STEPS.length : Math.max(0, idx);
  const segs = [...document.querySelectorAll('#skMeter .sk-seg')], lit = Math.round(segs.length * (n + (done?0:0.5)) / STEPS.length);
  segs.forEach((sg,i)=>sg.classList.toggle('on', segs.length-1-i < lit));
  $('#skMeter').setAttribute('aria-label', done ? 'Progress: mission complete' : `Progress: step ${n+1} of ${STEPS.length}, ${STEPS[n][1]}`); }

/* ---------- course building + props ---------- */
const CP_TYPES = {
  practice:{phases:[{}]}, clear:{phases:[{}]}, dry:{phases:[{}]},
  fixedDelivery:{water:1, block:1, fixed:1, phases:[{water:1, block:1}]},
  water:{water:1, phases:[{water:1},{}]},
  block:{block:1, phases:[{block:1}]},
  blockScooter:{block:1, scooter:1, phases:[{block:1, scooter:1},{block:1}]},
  bump:{bump:1, phases:[{bump:1},{}]},
  turnL:{turn:-1, phases:[{turn:1}]}, turnR:{turn:1, phases:[{turn:1}]},
  waterTurn:{water:1, turn:-1, phases:[{water:1, turn:1},{turn:1}]}
};
let course = null; let liveProps = [];
function disposeGroup(g){ if(!g) return; W.scene.remove(g); (g.userData.carves||[]).forEach(t=>W.uncarve(t)); g.userData.carves=[]; }
function clearCourse(c){ if(c && c.group){ disposeGroup(c.group); } }
const oldGroups = [];
function buildCourse(types, startZ, opts={}){
  const g = new THREE.Group(); g.userData.carves=[]; W.scene.add(g); oldGroups.push(g); while(oldGroups.length>3){ disposeGroup(oldGroups.shift()); }
  let z = startZ - 42, street = opts.street || 1;
  const cps = types.map(t=>{ const def=CP_TYPES[t]; const cp={type:t, def, z}; z -= 50 + (def.turn?22:0); return cp; });
  const last = cps[cps.length-1];
  const endZ = cps.length ? last.z - (last.def.turn ? 46 : 34) : startZ - 40;
  const c = {group:g, cps, startZ, endZ, opts};
  for(const cp of cps){ const d=cp.def; cp.front = cp.z + 3;
    if(d.turn){ cp.zJ = cp.z - 10; cp.front = cp.zJ + 8; cp.side = d.turn; cp.street = 'Street '+(++street); const j = W.makeJunction(g, cp.zJ, d.turn, cp.street); cp.closed = j.closed; }
    if(d.water){ cp.pz = d.fixed ? cp.z + 9 : cp.z; cp.puddle = W.makePuddle(g, cp.pz); cp.front = cp.pz + 4.6; }
    if(d.block){ cp.block = W.makeBlock(g, cp.z, -3); if(!d.water) cp.front = cp.z + 3.6; }
    if(d.scooter){ cp.scooter = W.makeScooter(g, 3, cp.z - 26); }
    if(d.bump){ cp.bump = W.makeBump(g, cp.z); cp.front = cp.z + 3.2; }
  }
  if(opts.finish){ W.makeFinishLine(g, endZ - 2); c.flag = W.makeFlag(g, -6.7, endZ - 2, '#F2A93B'); }
  if(opts.house){ c.house = W.makeHouse(g, endZ - 4); c.flag = W.makeFlag(g, -7.0, endZ + 3, '#2FA66A'); c.sharma = W.makePerson(g, -8.2, endZ - 4, '#d94f8a'); c.sharma.rotation.y = -Math.PI/2; }
  return c;
}
function propsTick(dt){
  if(!course) return;
  if(course.flag) W.waveFlag(course.flag, dt);
  if(course.sharma){ const u=course.sharma.userData; u.ra.rotation.z = -2.5 + Math.sin(gt*7)*0.35; }
  for(const cp of course.cps){
    if(cp.block){ cp.block.userData.blink(gt); if(cp.block.userData.hit){ const b=cp.block; b.rotation.x += (-1.15 - b.rotation.x)*Math.min(1, dt*7); } }
    if(cp.scooter){ const s=cp.scooter, u=s.userData;
      if(!u.go && !u.gone && W.Z.z - cp.z < 75 && s.position.z < cp.z - 8){ const d=Math.min(dt*2.4, cp.z - 8 - s.position.z); s.position.z += d; u.spin(d); }
      if(u.go){ s.position.z += dt*u.speed; u.spin(dt*u.speed); if(s.position.z > W.Z.z + 45){ u.go=false; u.gone=true; s.visible=false; } } }
  }
  for(const v of liveProps){ v.tick && v.tick(dt); }
}
function clearHazard(cp){ // the world moves on to the next phase; resolves when done
  if(cp.scooter && !cp.scooter.userData.gone){ const u=cp.scooter.userData; u.go=true; u.speed=9; SFX.horn(); return until(()=>u.gone || cp.scooter.position.z > W.Z.z + 3); }
  return wait(0.1);
}
/* vehicles behind Zippy (ambulance / car), seen through the rear-view mirror */
let mirrorOn = 0;
function spawnBehind(kind, lane){
  const Z = W.Z; const obj = kind==='amb' ? W.makeAmbulance(course.group, lane, Z.z + 46) : W.makeCar(course.group, Z.x, Z.z + 40);
  const v = { obj, kind, lane, mode:'chase', speed: kind==='amb'?19:15, gone:false };
  v.tick = (dt)=>{ const o=obj; if(kind==='amb') W.flashAmb(o, dt);
    const inLane = Math.abs(Z.x - o.position.x) < 1.95 || Math.abs(Z.tx - o.position.x) < 1.95;
    let sp = v.speed;
    if(v.mode==='chase' && inLane){ const gap = o.position.z - Z.z; const want = 6.5; if(gap < want + 10){ sp = Math.max(0, Math.min(sp, (gap-want)*2.2 + Z.v)); } if(gap <= want+0.3){ v.blocked = (v.blocked||0) + dt; } }
    o.position.z -= sp*dt;
    if(o.position.z < Z.z - 140){ v.gone = true; } };
  liveProps.push(v); mirrorOn++; if(kind==='amb') sirenOn(); return v;
}
function dropBehind(v){ const i=liveProps.indexOf(v); if(i>=0) liveProps.splice(i,1); if(v.obj.parent) v.obj.parent.remove(v.obj); mirrorOn=Math.max(0,mirrorOn-1); if(v.kind==='amb') sirenOff(); }
function clearVehicles(){ for(const v of liveProps.slice()) dropBehind(v); liveProps.length=0; mirrorOn=0; sirenOff(); }

/* ---------- motion helpers ---------- */
const CRUISE = 11;
function passTo(z, v=CRUISE){ W.setDrive(v, null); return until(()=>W.Z.z <= z); }
function stopAt(z, v){ W.setDrive(v==null?Math.max(W.Z.v,4):v, z); return until(()=>W.Z.v===0 && Math.abs(W.Z.z - z) < 0.06); }
function lane(x){ W.Z.tx = x; }
async function safetyBrake(){ W.Z.hard = true; W.Z.vmax = 0; W.Z.stopZ = null; SFX.brake(); SFX.whistle(); await until(()=>W.Z.v===0); W.Z.hard=false; }
function anim(dur, fn){ const t0=gt; return until(()=>{ const k=Math.min(1,(gt-t0)/dur); fn(k); return k>=1; }); }
async function slipStart(){ const Z=W.Z; SFX.splash(); W.splash(Z.x, Z.z); Z.slip=1; Z.slide=true; W.setDrive(0,null); }
async function slipOut(){ const Z=W.Z; await until(()=>Z.v===0); await anim(0.5, k=>{ Z.slip = 1-k; }); Z.slip=0; Z.slide=false; }
async function crashInto(cp){ const Z=W.Z; Z.v=0; Z.vmax=0; Z.slide=false; Z.slip=0; SFX.crash(); W.shake(0.9); if(cp.block) cp.block.userData.hit=true;
  const z0=Z.z; await anim(0.45, k=>{ Z.z = z0 + Math.sin(k*Math.PI/2)*3.2; Z.jy = Math.sin(k*Math.PI)*0.6; }); Z.jy=0; }
async function slowThrough(cp){ const Z=W.Z; W.setDrive(2.6,null);
  if(cp.puddle){ await until(()=>Z.z <= cp.pz + 3.2); SFX.splash(); W.splash(Z.x, Z.z, 8); await until(()=>Z.z <= cp.pz - 3.4); }
  else if(cp.bump){ await until(()=>Z.z <= cp.z + 0.4); SFX.tap(); await anim(0.45, k=>{ Z.jy = Math.sin(k*Math.PI)*0.16; }); Z.jy=0; await until(()=>Z.z <= cp.z - 1.5); } }
async function doTurn(cp){ const Z=W.Z, side=cp.side, zJ=cp.zJ;
  lane(-3); W.setDrive(6,null); await until(()=>Z.z <= zJ + 8); SFX.blinker();
  const laneZ = side<0 ? zJ+3 : zJ-3; const P0={x:Z.x, z:Z.z}, P1={x:-3, z:laneZ}, P2={x:side<0?-9:3.5, z:laneZ};
  const pts=[]; for(let i=0;i<=24;i++){ const t=i/24, a=(1-t)*(1-t), b=2*(1-t)*t, c=t*t; pts.push({x:a*P0.x+b*P1.x+c*P2.x, z:a*P0.z+b*P1.z+c*P2.z}); }
  pts.push({x:side*40, z:laneZ}); W.follow(pts, 5.5);
  await until(()=>Z.path && Z.path.s >= Z.path.len - 16); bubble(null); hud(null);
  const off = await flash(); if(cp.closed) cp.closed.visible=false; W.placeZippy(zJ - 22); W.Z.v = 6; W.setDrive(6,null); W.snapCamera(); await wait(0.12); off();
  toast('ok', 'Turned onto '+cp.street); wait(1.5).then(hideToast).catch(()=>{}); }
async function stuckFail(cp, st, crawl){ const Z=W.Z; if(crawl) W.setDrive(1.2,null); else await stopAt(Math.min(Z.z, cp.front)); await wait(0.6);
  const car = spawnBehind('car'); await until(()=>car.blocked>0.4); SFX.horn(); toast('warn','Honk honk!'); await wait(0.7); SFX.horn(); W.setDrive(0,null); await wait(1.2); return {ok:false, reason:'stuck', cp, st}; }

/* ---------- rule trace UI ---------- */
let traceUI = null; // {kind:'single'|'list', root}
async function trace(ev, rules){
  if(!traceUI) return; const root = traceUI.root; const step = 0.26;
  root.querySelectorAll('.mark').forEach(m=>m.remove()); root.querySelectorAll('.lit,.lit-row,.check,.fired,.miss').forEach(e=>e.classList.remove('lit','lit-row','check','fired','miss'));
  if(traceUI.kind==='single'){
    const c = ev.checks[0]; const s1 = root.querySelector('[data-key=c1]'), s2 = root.querySelector('[data-key=c2]');
    root.querySelector('.kw-if')?.classList.add('lit');
    for(const [i,s] of [[0,s1],[1,s2]]){ if(!s || c.parts[i]===undefined) continue; s.insertAdjacentHTML('beforeend', `<span class="mark ${c.parts[i]?'y':'n'}">${c.parts[i]?'✓':'✗'}</span>`); SFX.check(); await wait(step); }
    root.querySelector('.kw-if')?.classList.remove('lit');
    const br = ev.branch==='then' ? root.querySelector('.kw-then') : root.querySelector('.kw-else'); br?.classList.add('lit');
    const bs = root.querySelector(`[data-key=${ev.branch==='then'?'then':'else'}]`); bs?.classList.add('lit-row'); await wait(step*1.4);
  } else {
    const rows = [...root.querySelectorAll('.rrow')];
    for(const c of ev.checks){ const r = rows[c.i]; if(!r) continue; r.classList.add('check'); SFX.check(); await wait(step); r.classList.remove('check');
      if(c.res){ r.classList.add('fired'); r.insertAdjacentHTML('beforeend','<span class="mark y">✓</span>'); }
      else if(c.i===ev.index){ r.classList.add('fired'); r.insertAdjacentHTML('beforeend','<span class="mark else">ELSE</span>'); } // condition false, but its ELSE decided
      else { r.classList.add('miss'); r.insertAdjacentHTML('beforeend','<span class="mark n">✗</span>'); } }
    await wait(step);
  }
}
function clearTrace(){ if(!traceUI) return; const root=traceUI.root; root.querySelectorAll('.mark').forEach(m=>m.remove()); root.querySelectorAll('.lit,.lit-row,.check,.fired,.miss').forEach(e=>e.classList.remove('lit','lit-row','check','fired','miss')); }

/* ---------- running a course with rules ---------- */
async function consequence(cp, st, need, act){ const Z=W.Z;
  if(need==='SLOW'){
    if(act==='STOP') return stuckFail(cp, st, false);
    if(act==='CHANGE') lane(3);
    W.setDrive(CRUISE*0.85, null);
    if(cp.puddle){ await until(()=>Z.z <= cp.pz + 3.2); await slipStart(); await slipOut(); bubble('Q'); return {ok:false, reason:'slip', act, cp, st}; }
    await until(()=>Z.z <= cp.z + 0.5); SFX.bump(); W.shake(0.5); await anim(0.55, k=>{ Z.jy = Math.sin(k*Math.PI)*1.3; }); Z.jy=0; await safetyBrake(); bubble('Q'); return {ok:false, reason:'bump', act, cp, st};
  }
  if(need==='CHANGE' || need==='STOP'){
    if(act==='CHANGE'){ const s=cp.scooter, u=s.userData; lane(3); W.setDrive(4.5,null); u.go=true; u.speed=5; await until(()=>Z.z - s.position.z < 10); u.speed=0; u.go=false; await safetyBrake(); SFX.horn(); await wait(0.35); SFX.horn(); bubble('Q'); return {ok:false, reason:'scooter', act, cp, st}; }
    if(act==='STOP') return stuckFail(cp, st, false);
    lane(-3); W.setDrive(act==='SLOW'?3.5:CRUISE*0.8, null); await until(()=>Z.z <= cp.z + 1.1); await crashInto(cp); bubble('Q'); return {ok:false, reason:'crash', act, cp, st};
  }
  if(need==='TURN'){
    if(act==='STOP') return stuckFail(cp, st, false);
    W.setDrive(act==='SLOW'?3:CRUISE*0.8, null); await until(()=>Z.z <= cp.zJ - 4.5); await safetyBrake(); bubble('Q'); return {ok:false, reason:'missed', act, cp, st};
  }
  return stuckFail(cp, st, act==='SLOW');
}
async function runCourse(c, rules){
  const Z = W.Z;
  for(let ci=0; ci<c.cps.length; ci++){
    const cp = c.cps[ci], d = cp.def;
    const decisionZ = cp.z + 15; let turned = false;
    await passTo(decisionZ + 6);
    W.setDrive(3.2, null); await until(()=>Z.z <= decisionZ);
    for(let pi=0; pi<d.phases.length; pi++){
      const st = d.phases[pi]; hud(st);
      const ev = evaluate(rules, sensors(st));
      W.setDrive(Z.v>0.5?2.2:0, null);
      bubble(null); await trace(ev, rules);
      const act = ev.action || 'Q'; bubble(act);
      const need = needOf(st);
      if(!ev.action){ W.setDrive(0,null); await until(()=>Z.v===0); SFX.bad(); return {ok:false, reason:'norule', cp, st}; }
      if(act === need){
        if(need==='GO'){ lane(-3); await passTo(Math.min(Z.z, cp.z) - 4); bubble(null); clearTrace(); break; }
        if(need==='STOP'){ await stopAt(Math.min(Z.z, cp.front)); await wait(0.9); await clearHazard(cp); await wait(0.35); clearTrace(); continue; }
        if(need==='SLOW'){ await slowThrough(cp); clearTrace(); continue; }
        if(need==='CHANGE'){ lane(3); W.setDrive(7, null); await until(()=>Z.z <= cp.z - 5.5); clearTrace(); break; }
        if(need==='TURN'){ await doTurn(cp); turned = true; clearTrace(); break; }
      }
      return consequence(cp, st, need, act);
    }
    if(!turned && Math.abs(Z.tx + 3) > 0.1){ lane(-3); }
    hud(null); bubble(null);
  }
  hud(null); bubble(null);
  W.setDrive(CRUISE, c.endZ); await until(()=>W.Z.v===0);
  return {ok:true};
}
function failLine(res, ctx){
  const r = res.reason, fAnd = ctx==='FIN' && rulesFinalOp()==='AND';
  if(r==='stuck') return L.stuck; if(r==='norule') return L.norule;
  if(r==='slip'){ if(ctx==='ORD' && res.act==='TURN') return L.slipTurn; return fAnd ? L.finAnd : L.slip; }
  if(r==='bump') return fAnd ? L.finAnd : L.bump;
  if(r==='crash') return ctx==='B' ? L.crashB : ctx==='DBG' ? L.dbgFail : L.crash;
  if(r==='scooter') return L.scooter; if(r==='missed') return L.missed; return L.norule;
}
function failToast(res){ const r=res.reason; if(r==='stuck') toast('warn','Zippy got stuck'); else if(r==='norule') toast('warn','No rule fit'); else if(r==='slip') toast('bad','Zippy slipped!'); else if(r==='crash') toast('bad','Crash!'); else if(r==='bump') toast('bad','Bump!'); else if(r==='missed') toast('bad','Missed the turn'); else toast('bad','Safety stop'); }
async function rewind(c){ const off = await flash(); clearVehicles(); hud(null); bubble(null); hideToast(); clearTrace();
  const types = c.cps.map(cp=>cp.type); clearCourse(c); course = buildCourse(types, c.startZ, c.opts); W.placeZippy(c.startZ); W.snapCamera(); await wait(0.15); off(); return course; }

/* ---------- builder (IF / AND / THEN / ELSE card) ---------- */
function builder(cfg){
  // cfg.slots: [{key, accept:'cond'|'act'|'kw', label}], cfg.fixedKw: {c1:'IF', c2:'AND', then:'THEN', else:'ELSE'}, palette
  const vals = Object.assign({}, cfg.prefill||{}); let sel = null; let editable = true;
  const rows = cfg.rows.map(r=>{ const kwCell = r.kwSlot ? `<button class="slot kwslot" data-key="${r.kwSlot}" data-accept="kw" aria-label="joining word space"><span class="ph">word</span></button>` : `<div class="kw ${r.kwClass||''}">${r.kw}</div>`;
    return kwCell + `<button class="slot" data-key="${r.key}" data-accept="${r.accept}" aria-label="${r.accept==='cond'?'condition':'action'} space"><span class="ph">${r.accept==='cond'?'choose a condition':'choose an action'}</span></button>`; }).join('');
  const pal = (title, kind, list, fn) => `<div class="tl">${title}</div><div class="tiles">` + list.map(k=>`<button class="tile ${kind==='kw'?'kwt':''}" data-kind="${kind}" data-val="${k}" aria-label="${kind==='cond'?COND[k].t:kind==='act'?ACTN[k].t:k}">${fn(k)}</button>`).join('') + `</div>`;
  const html = `<div class="rule" id="ruleCard">${rows}</div>
    <div class="tray">${cfg.kws?pal('Joining words','kw',cfg.kws,chipKw):''}${pal('Conditions','cond',cfg.conds,chipCond)}${pal('Actions','act',cfg.acts,chipAct)}</div>`;
  const api = { html, vals, bind(root){ api.root=root; const card=root.querySelector('#ruleCard');
      const slots = [...card.querySelectorAll('.slot')];
      const render = ()=>{ slots.forEach(s=>{ const k=s.dataset.key, v=vals[k]; s.classList.toggle('full', !!v); s.classList.toggle('sel', sel===k); s.classList.remove('err');
        s.innerHTML = v ? (s.dataset.accept==='cond'?chipCond(v):s.dataset.accept==='act'?chipAct(v):chipKw(v)) : `<span class="ph">${s.dataset.accept==='cond'?'choose a condition':s.dataset.accept==='act'?'choose an action':'word'}</span>`; }); };
      api.render = render;
      const place = (kind, val, target)=>{ if(!editable) return; let key = target;
        if(!key){ if(sel && slots.find(s=>s.dataset.key===sel).dataset.accept===kind) key = sel; else { const e = slots.find(s=>s.dataset.accept===kind && !vals[s.dataset.key]); key = e && e.dataset.key; } }
        if(!key){ slots.filter(s=>s.dataset.accept===kind).forEach(s=>{ s.classList.remove('need'); void s.offsetWidth; s.classList.add('need'); }); SFX.tap(); return; }
        const s = slots.find(x=>x.dataset.key===key); if(s.dataset.accept!==kind){ SFX.bad(); return; }
        vals[key]=val; sel=null; SFX.place(); render(); cfg.onChange && cfg.onChange(); };
      slots.forEach(s=>s.addEventListener('click', ()=>{ if(!editable) return; const k=s.dataset.key; if(vals[k]){ vals[k]=null; sel=k; SFX.remove(); } else sel = (sel===k?null:k), SFX.tap(); render(); }));
      root.querySelectorAll('.tile').forEach(t=>makeDraggable(t, (target)=>{ if(target && target.classList.contains('slot')) place(t.dataset.kind, t.dataset.val, target.dataset.key); else if(!target) place(t.dataset.kind, t.dataset.val); }, ()=>editable, slots));
      render(); },
    setEditable(b){ editable=b; api.root && api.root.querySelector('.tray').classList.toggle('gone', !b); if(!b){ sel=null; api.render(); } },
    missing(){ return cfg.rows.flatMap(r=>[r.key, r.kwSlot]).filter(k=>k && !vals[k]); },
    flagEmpty(){ const miss=api.missing(); api.root.querySelectorAll('.slot').forEach(s=>{ if(miss.includes(s.dataset.key)){ s.classList.remove('need'); void s.offsetWidth; s.classList.add('need'); } }); },
    rule(){ return { c1:vals.c1, op: cfg.fixedOp || vals.k2 || null, c2: vals.c2 || null, then:vals.then, else:vals.else }; }
  };
  return api;
}
/* drag + tap for tiles (mouse, touch, keyboard) */
function makeDraggable(el, onDrop, can, slots){
  let sx=0, sy=0, dragging=false, id=null; const ghost=$('#ghost');
  const toStage = (cx,cy)=>{ const r=stage.getBoundingClientRect(); const k=r.width/1920; return [(cx-r.left)/k, (cy-r.top)/k]; };
  el.addEventListener('pointerdown', e=>{ if(!can()) return; id=e.pointerId; sx=e.clientX; sy=e.clientY; dragging=false; el.setPointerCapture(id); });
  el.addEventListener('pointermove', e=>{ if(e.pointerId!==id) return; if(!dragging && Math.hypot(e.clientX-sx, e.clientY-sy) > 10){ dragging=true; ghost.innerHTML = el.innerHTML; ghost.style.display='block'; }
    if(dragging){ const [x,y]=toStage(e.clientX,e.clientY); ghost.style.left=x+'px'; ghost.style.top=y+'px'; const t=document.elementFromPoint(e.clientX,e.clientY); const s=t&&t.closest('.slot'); slots.forEach(q=>q.classList.toggle('drop', q===s && q.dataset.accept===el.dataset.kind)); } });
  const end = e=>{ if(e.pointerId!==id) return; id=null; slots.forEach(q=>q.classList.remove('drop'));
    if(dragging){ ghost.style.display='none'; ghost.innerHTML=''; const t=document.elementFromPoint(e.clientX,e.clientY); const s=t&&t.closest('.slot'); if(s) onDrop(s); else SFX.remove(); }
    else if(e.type==='pointerup') onDrop(null); dragging=false; };
  el.addEventListener('pointerup', end); el.addEventListener('pointercancel', end);
  el.addEventListener('click', e=>{ if(e.detail===0) onDrop(null); }); // keyboard Enter / Space
}

/* ---------- rule list (ordering) ---------- */
function ruleRowHTML(r, i, n, locked){ return `<div class="rrow ${locked?'locked':''}" data-i="${i}"><div class="num">${i+1}</div><div class="body"><span class="k">IF</span>${chipCond(r.c1)}${r.op?`<span class="k">${r.op}</span>${chipCond(r.c2)}`:''}<span class="k">THEN</span>${chipAct(r.then)}${r.else?`<span class="k">ELSE</span>${chipAct(r.else)}`:''}</div>
  <div class="mv"><button data-mv="-1" aria-label="Move rule ${i+1} up" ${i===0?'disabled':''}>${IC.up}</button><button data-mv="1" aria-label="Move rule ${i+1} down" ${i===n-1?'disabled':''}>${IC.down}</button></div></div>`; }
function ruleList(rules, locked){
  const api = { rules, locked, html:`<div class="rlist" id="rlist"></div>`, bind(root){ api.root=root; api.el=root.querySelector('#rlist'); api.render(); },
    render(focusIdx, dir){ api.el.innerHTML = api.rules.map((r,i)=>ruleRowHTML(r,i,api.rules.length,api.locked)).join('');
      api.el.querySelectorAll('.mv button').forEach(b=>b.addEventListener('click', ()=>{ const i=+b.closest('.rrow').dataset.i, d=+b.dataset.mv; api.move(i, i+d, true); }));
      api.el.querySelectorAll('.rrow').forEach(row=>api.drag(row));
      if(focusIdx!=null){ const btn = api.el.querySelector(`.rrow[data-i="${focusIdx}"] [data-mv="${dir}"]`) || api.el.querySelector(`.rrow[data-i="${focusIdx}"] .mv button:not([disabled])`); btn && btn.focus({preventScroll:true}); } },
    move(a, b, fromKey){ if(api.locked || b<0 || b>=api.rules.length) return; const [r]=api.rules.splice(a,1); api.rules.splice(b,0,r); SFX.place(); api.render(fromKey?b:null, b>a?1:-1); },
    drag(row){ let id=null, sy=0, start=0, h=0, k=1, moved=false;
      row.addEventListener('pointerdown', e=>{ if(api.locked || e.target.closest('button')) return; id=e.pointerId; sy=e.clientY; start=+row.dataset.i; moved=false; row.setPointerCapture(id); k=row.getBoundingClientRect().height/row.offsetHeight; h=(row.offsetHeight+12)*k; row.classList.add('grab'); });
      row.addEventListener('pointermove', e=>{ if(e.pointerId!==id) return; const dy=e.clientY-sy; moved = moved || Math.abs(dy)>6; row.style.transform=`translateY(${dy/k}px)`; });
      const up = e=>{ if(e.pointerId!==id) return; id=null; row.classList.remove('grab'); row.style.transform=''; const dy=e.clientY-sy; const to=Math.max(0, Math.min(api.rules.length-1, start + Math.round(dy/h))); if(moved && to!==start) api.move(start,to); };
      row.addEventListener('pointerup', up); row.addEventListener('pointercancel', up); },
    setLocked(b){ api.locked=b; api.render(); }
  };
  return api;
}

/* ================= ACTIVITIES ================= */
const G = { prediction:null, ruleA:null, ruleB:null, order:null, debug:null, finalRule:null };
const STORAGE_KEY = 'delivery-bot-academy-biryani-v1';
const RESUMABLE_STATES = new Set(['INTRO','PREDICTION','FIXED_ROUTE_TEST','BUILD_CONDITIONAL','ORDER_RULES','DEBUG_PRIORITY','BUILD_FINAL_RULE','FINAL_RUN','COMPLETE']);
let state = 'TITLE';
function saveProgress(startZ){
  if(!RESUMABLE_STATES.has(state)) return;
  try{
    const z = Number.isFinite(startZ) ? startZ : (Number.isFinite(SNAP[state]) ? SNAP[state] : W.Z.z);
    localStorage.setItem(STORAGE_KEY, JSON.stringify({version:1, state, startZ:z, snap:SNAP, game:G, updatedAt:Date.now()}));
  }catch(e){}
}
function loadProgress(){
  try{
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY));
    if(!saved || saved.version!==1 || !RESUMABLE_STATES.has(saved.state)) return null;
    if(saved.game && typeof saved.game==='object') Object.assign(G, saved.game);
    if(saved.snap && typeof saved.snap==='object') Object.assign(SNAP, saved.snap);
    return saved;
  }catch(e){ return null; }
}
function clearProgress(){ try{ localStorage.removeItem(STORAGE_KEY); }catch(e){} }
function setState(s, startZ){
  state = s;
  if(Number.isFinite(startZ)) SNAP[s] = startZ;
  renderProg(s);
  saveProgress(startZ);
}
function rulesFinalOp(){ return G._curFinal ? G._curFinal.op : null; }

async function travelTo(z){ hidePanel(); hud(null); bubble(null); hideToast(); W.setDrive(14, z); await until(()=>W.Z.v===0 && Math.abs(W.Z.z-z)<0.08); }

function routeMap(){ const ic=(k,x,y,bg)=>`<circle cx="${x}" cy="${y}" r="19" fill="${bg||'#fff'}" stroke="#183153" stroke-width="2.5"/>`+IC[k].replace('<svg ', `<svg x="${x-13}" y="${y-13}" width="26" height="26" `);
  return `<div class="route"><svg viewBox="0 0 600 182" aria-label="Route map: three streets to Mrs. Sharma's house">
  <path d="M40 132H270V44H560" fill="none" stroke="#5d6570" stroke-width="22" stroke-linejoin="round" stroke-linecap="round"/>
  <path d="M40 132H270V44H560" fill="none" stroke="#fff" stroke-width="2.5" stroke-dasharray="8 8"/>
  <text x="112" y="176" font-size="17" font-weight="900" fill="#5b6878" font-family="inherit">STREET 1</text>
  <text x="300" y="94" font-size="17" font-weight="900" fill="#5b6878" font-family="inherit">STREET 2</text>
  <text x="380" y="22" font-size="17" font-weight="900" fill="#5b6878" font-family="inherit">STREET 3</text>
  ${ic('bowl',40,132)}${ic('water',112,132)}${ic('block',184,132)}${ic('turnSign',270,132)}${ic('scooter',270,88)}${ic('turnSign',270,44)}${ic('bump',360,44)}${ic('water',440,44)}
  <circle cx="560" cy="44" r="23" fill="#2FA66A"/>${IC.house.replace('<svg ', '<svg x="545" y="29" width="30" height="30" style="color:#fff" ')}
  <text x="592" y="88" text-anchor="end" font-size="17" font-weight="900" fill="#2FA66A" font-family="inherit">Mrs. Sharma</text></svg></div>`; }
async function INTRO(){
  setState('INTRO', 0); W.cam.mode='intro'; W.cam.liftTarget=0; $('#skMeter').classList.add('hide');
  course = buildCourse(['fixedDelivery'], 0, {finish:true});
  await wait(0.8); await say(L.intro1); await say(L.intro2);
  await cta("Let's go");
  W.cam.mode='chase'; $('#skMeter').classList.remove('hide');
  return PREDICTION();
}
function fixedStepsHTML(){ return `<div class="steps" id="steps">${['FORWARD','FORWARD','FORWARD'].map((s,i)=>`<div class="step" data-i="${i}">${IC.GO}Forward</div>`).join('')}<div class="step stop" data-i="3">${IC.STOP}Stop</div></div>`; }
async function PREDICTION(){
  setState('PREDICTION', 0);
  setPanel(head('parcel','Zippy\'s instructions','Straight to Mrs. Sharma\'s house') + fixedStepsHTML() + routeMap() + `<div class="q">What will Zippy do at the water?</div>` +
    `<div class="opts" id="opts">
      <button class="opt" data-v="safe"><span class="oi" style="background:#fff3df;color:#c07f17">${IC.SLOW}</span>Slows down and goes around</button>
      <button class="opt" data-v="go"><span class="oi" style="background:#e6f6ee;color:#2FA66A">${IC.GO}</span>Keeps going straight</button>
      <button class="opt" data-v="back"><span class="oi" style="background:#e7f0ff;color:#2F6FED">${IC.back}</span>Turns back</button></div>`);
  panel.querySelectorAll('.step').forEach(e=>{ e.style.height='96px'; }); panel.querySelectorAll('.opt').forEach(e=>{ e.style.padding='12px 22px'; e.style.fontSize='26px'; }); panel.querySelectorAll('.opt .oi').forEach(e=>{ e.style.width='58px'; e.style.height='58px'; });
  await wait(0.2);
  say(L.pred1);
  let pick=null; panel.querySelectorAll('.opt').forEach(b=>b.addEventListener('click', ()=>{ pick=b.dataset.v; SFX.place(); panel.querySelectorAll('.opt').forEach(o=>o.classList.toggle('picked', o===b)); }));
  await until(()=>pick); G.prediction = pick; saveProgress(0); await wait(0.5);
  return FIXED_ROUTE_TEST();
}
async function runFixed(c, testDay){
  const steps = [...panel.querySelectorAll('.step')]; steps.forEach(s=>s.classList.remove('on','done'));
  const Z=W.Z; const cp=c.cps[0]; const block = (c.endZ - 2 - c.startZ)/3;
  for(let i=0;i<3;i++){ steps[i].classList.add('on'); bubble('GO'); const target = c.startZ + block*(i+1);
    if(testDay && cp.puddle && cp.pz + 3 > target - 0.1 && cp.pz + 3 < Z.z){
      await passTo(cp.pz + 3.2, CRUISE); await slipStart(); await until(()=>Z.z <= cp.z + 1.1 || Z.v < 0.3); await crashInto(cp); steps[i].classList.remove('on'); return false; }
    await passTo(target + 0.2, CRUISE); steps[i].classList.remove('on'); steps[i].classList.add('done'); }
  steps[3].classList.add('on'); bubble('STOP'); await stopAt(c.endZ - 2 + 1.2); await wait(0.4); bubble(null); return true;
}
async function FIXED_ROUTE_TEST(){
  setState('FIXED_ROUTE_TEST', 0);
  { const off = await flash(); clearCourse(course); course = buildCourse(['practice'], 0, {finish:true}); W.placeZippy(0); W.snapCamera(); await wait(0.1); off(); }
  setPanel(head('flag','Practice run','Empty, straight street') + fixedStepsHTML() + `<div class="btnrow"><button class="go" id="run">${IC.play}Run</button></div>`);
  say(L.pred2);
  await clickOnce($('#run')); SFX.tap(); $('#run').disabled=true; stopSpeech(); clearCaption();
  hud({}); await runFixed(course, false); hud(null);
  toast('ok','Practice passed'); SFX.ok(); await say(L.fix1); hideToast();
  // delivery day: the real road
  { const off = await flash(); clearCourse(course); course = buildCourse(['fixedDelivery'], 0, {finish:true}); W.placeZippy(0); W.snapCamera(); await wait(0.1); off(); }
  setPanel(head('parcel','Delivery run','The real road') + fixedStepsHTML() + `<div class="btnrow"><button class="go" id="run">${IC.play}Run</button></div>`);
  say(L.fix2);
  await clickOnce($('#run')); SFX.tap(); $('#run').disabled=true; stopSpeech(); clearCaption();
  hud({water:1, block:1}); await runFixed(course, true); bubble('Q'); toast('bad','Crash!'); SFX.bad();
  await say(L.fixFail); await say(G.prediction==='safe'?L.predSafe:G.prediction==='go'?L.predGo:L.predBack); hideToast(); hud(null); bubble(null);
  say(L.fix3);
  await cta('Make Zippy smarter');
  const next = course.endZ - 26;
  { const off = await flash(); hidePanel(); clearCourse(course); course=null; W.placeZippy(next); W.snapCamera(); await wait(0.1); off(); }
  return BUILD_CONDITIONAL(next);
}
async function builderLoop(opts){
  let first = true;
  while(true){
    opts.b.setEditable(true); const run=$('#run'); run.disabled=false; hintsOn(opts.hints, $('#hint'));
    await clickOnce(run); SFX.tap(); poke();
    const miss = opts.b.missing(); if(miss.length){ opts.b.flagEmpty(); SFX.bad(); say(L.empty); continue; }
    if(opts.validate){ const bad = opts.validate(); if(bad){ SFX.bad(); const card=$('#ruleCard'); card.classList.remove('bad'); void card.offsetWidth; card.classList.add('bad'); bad.forEach(k=>panel.querySelector(`[data-key=${k}]`).classList.add('err')); bubble('Q'); say(L.grammar); await wait(1.2); bubble(null); continue; } }
    hintsOff(); opts.b.setEditable(false); run.disabled=true; stopSpeech(); clearCaption();
    if(!first) opts.c = await rewind(opts.c); first=false;
    const rule = opts.b.rule(); if(opts.ctx==='FIN') G._curFinal = rule;
    const res = await runCourse(opts.c, [rule]);
    if(res.ok){ SFX.ok(); toast('ok','Rule works!'); await say(opts.okLine); hideToast(); return {rule, c:opts.c}; }
    failToast(res); SFX.bad(); await say(failLine(res, opts.ctx)); hideToast(); hud(null); bubble(null); clearTrace(); clearVehicles();
    run.innerHTML = `${IC.replay}Run again`;
  }
}
const ROWS3 = [{kw:'IF',kwClass:'kw-if',key:'c1',accept:'cond'},{kw:'THEN',kwClass:'kw-then',key:'then',accept:'act'},{kw:'ELSE',kwClass:'kw-else',key:'else',accept:'act'}];
async function BUILD_CONDITIONAL(startZ){
  setState('BUILD_CONDITIONAL', startZ);
  // Part A: IF / THEN / ELSE with water
  let c = course = buildCourse(['water','dry'], startZ);
  const bA = builder({ rows:ROWS3, conds:['water','dry'], acts:['SLOW','GO'] });
  setPanel(head('build','Water rule','IF · THEN · ELSE') + bA.html + `<div class="btnrow"><button class="go" id="run">${IC.play}Run</button></div><div id="hint"></div>`);
  bA.bind(panel); traceUI = {kind:'single', root:panel};
  say(L.bcA);
  const rA = await builderLoop({c, b:bA, hints:[L.bcAh1, L.bcAh2], ctx:'A', okLine:L.bcAok});
  G.ruleA = rA.rule; saveProgress(startZ);
  // Part B: road block + scooter -> AND
  await travelTo(rA.c.endZ - 10);
  const startB = W.Z.z;
  c = course = buildCourse(['blockScooter','block'], startB);
  const lockedA = builder({ rows:ROWS3, conds:['water','dry'], acts:['SLOW','GO'], prefill:{c1:G.ruleA.c1, then:G.ruleA.then, else:G.ruleA.else} });
  setPanel(head('build','New problem','Same rule, new road') + lockedA.html + `<div class="btnrow"><button class="go" id="run">${IC.play}Run</button></div>`);
  lockedA.bind(panel); lockedA.setEditable(false); traceUI = {kind:'single', root:panel};
  say(L.bcB); await clickOnce($('#run')); SFX.tap(); $('#run').disabled=true; stopSpeech(); clearCaption();
  let res = await runCourse(c, [G.ruleA]);
  failToast(res); SFX.bad(); await say(res.reason==='crash' ? L.bcBfail : failLine(res,'B')); hideToast(); hud(null); bubble(null); clearVehicles();
  const bB = builder({ rows:[{kw:'IF',kwClass:'kw-if',key:'c1',accept:'cond'},{kw:'AND',key:'c2',accept:'cond'},{kw:'THEN',kwClass:'kw-then',key:'then',accept:'act'},{kw:'ELSE',kwClass:'kw-else',key:'else',accept:'act'}], fixedOp:'AND',
    conds:['block','laneClear','scooter','water'], acts:['CHANGE','STOP','GO'], prefill:{c1:'block', then:'CHANGE'} });
  setPanel(head('build','Road block rule','IF · AND · THEN · ELSE') + bB.html + `<div class="btnrow"><button class="go" id="run">${IC.replay}Run again</button></div><div id="hint"></div>`);
  bB.bind(panel); traceUI = {kind:'single', root:panel};
  c = await rewind(c);
  const rB = await builderLoop({c, b:bB, hints:[L.bcBh1, L.bcBh2], ctx:'B', okLine:L.bcBok});
  G.ruleB = rB.rule; saveProgress(startZ);
  await cta('Next problem');
  await travelTo(rB.c.endZ - 10);
  return ORDER_RULES(W.Z.z);
}
async function listLoop(opts){
  let first = opts.first!==false;
  while(true){
    opts.list.setLocked(false); const run=$('#run'); run.disabled=false; hintsOn(opts.hints, $('#hint'));
    await clickOnce(run); SFX.tap(); hintsOff(); opts.list.setLocked(true); run.disabled=true; stopSpeech(); clearCaption();
    if(!first) opts.c = await rewind(opts.c); first=false;
    const res = await runCourse(opts.c, opts.list.rules);
    if(res.ok){ SFX.ok(); toast('ok','Rules work!'); await say(opts.okLine); hideToast(); return {c:opts.c}; }
    failToast(res); SFX.bad(); await say(failLine(res, opts.ctx)); hideToast(); hud(null); bubble(null); clearVehicles();
    run.innerHTML = `${IC.replay}Run again`;
  }
}
async function ORDER_RULES(startZ){
  setState('ORDER_RULES', startZ);
  const c = course = buildCourse(['water','clear','waterTurn'], startZ, {street:1});
  const rules = [ {c1:'turn', then:'TURN'}, {c1:'clear', then:'GO'}, {c1:'water', then:'SLOW'} ];
  const list = ruleList(rules, false);
  setPanel(head('list','Order the rules','Zippy checks from the top') + `<div class="order-note">${IC.down}First rule that fits wins</div>` + list.html + `<div class="btnrow"><button class="go" id="run">${IC.play}Run</button></div><div id="hint"></div>`);
  list.bind(panel); traceUI = {kind:'list', root:panel};
  say(L.ord);
  const r = await listLoop({c, list, hints:[L.ordh1, L.ordh2], ctx:'ORD', okLine:L.ordOk});
  G.order = list.rules.slice(); saveProgress(startZ);
  await cta('Next street');
  await travelTo(r.c.endZ - 10);
  return DEBUG_PRIORITY(W.Z.z);
}
async function DEBUG_PRIORITY(startZ){
  setState('DEBUG_PRIORITY', startZ);
  let c = course = buildCourse(['block','water','dry'], startZ);
  const list = ruleList([ {c1:'dry', then:'GO'}, {c1:'water', then:'SLOW'}, {c1:'block', then:'CHANGE'} ], true);
  setPanel(head('wrench','Street rules','Something is wrong') + `<div class="order-note">${IC.down}First rule that fits wins</div>` + list.html + `<div class="btnrow"><button class="go" id="run">${IC.eye}Watch run</button></div><div id="hint"></div>`);
  list.bind(panel); traceUI = {kind:'list', root:panel};
  say(L.dbg); await clickOnce($('#run')); SFX.tap(); $('#run').disabled=true; stopSpeech(); clearCaption();
  const res = await runCourse(c, list.rules); failToast(res); SFX.bad(); await say(L.dbgFail); hideToast(); hud(null); bubble(null);
  $('.ph-head h2').textContent = 'Fix the bug'; $('.ph-head small').textContent = 'Change the order';
  $('#run').innerHTML = `${IC.replay}Run again`;
  const r = await listLoop({c, list, hints:[L.dbgh1, L.dbgh2], ctx:'DBG', okLine:L.dbgOk, first:false});
  G.debug = list.rules.slice(); saveProgress(startZ);
  await cta('Last street');
  await travelTo(r.c.endZ - 10);
  return BUILD_FINAL_RULE(W.Z.z);
}
async function BUILD_FINAL_RULE(startZ){
  setState('BUILD_FINAL_RULE', startZ);
  const c = course = buildCourse(['water','bump','clear'], startZ);
  const b = builder({ rows:[{kwSlot:'k1',key:'c1',accept:'cond'},{kwSlot:'k2',key:'c2',accept:'cond'},{kwSlot:'k3',key:'then',accept:'act'},{kwSlot:'k4',key:'else',accept:'act'}],
    kws:['IF','AND','OR','THEN','ELSE'], conds:['water','bump','dry','laneClear'], acts:['SLOW','GO'] });
  setPanel(head('build','Build it yourself','Every word has a job') + b.html + `<div class="btnrow"><button class="go" id="run">${IC.play}Run</button></div><div id="hint"></div>`);
  b.bind(panel); traceUI = {kind:'single', root:panel};
  const kwMap = {k1:'kw-if', k3:'kw-then', k4:'kw-else'}; for(const k in kwMap) panel.querySelector(`[data-key=${k}]`).classList.add(kwMap[k]);
  say(L.fin);
  const r = await builderLoop({c, b, hints:[L.finh1, L.finh2], ctx:'FIN', okLine:L.finOk,
    validate(){ const v=b.vals, bad=[]; if(v.k1!=='IF') bad.push('k1'); if(v.k2!=='AND' && v.k2!=='OR') bad.push('k2'); if(v.k3!=='THEN') bad.push('k3'); if(v.k4!=='ELSE') bad.push('k4'); return bad.length?bad:null; } });
  G.finalRule = r.rule; saveProgress(startZ);
  await cta('Deliver the biryani');
  await travelTo(r.c.endZ - 10);
  return FINAL_RUN(W.Z.z);
}
async function FINAL_RUN(startZ){
  setState('FINAL_RUN', startZ);
  const fr = G.finalRule || {c1:'water', op:'OR', c2:'bump', then:'SLOW', else:'GO'};
  const rules = [
    {c1:'block', op:'AND', c2:'scooter', then:'STOP'},
    {c1:'block', then:'CHANGE'},
    {c1:'turn', then:'TURN'},
    {c1:fr.c1, op:fr.op, c2:fr.c2, then:fr.then, else:fr.else}
  ];
  const c = course = buildCourse(['water','block','turnL','blockScooter','bump','turnR','water','clear'], startZ, {house:true, street:1});
  const list = ruleList(rules, true);
  setPanel(head('parcel','Zippy\'s rulebook','Everything you built') + list.html + `<div class="btnrow"><button class="go" id="run">${IC.play}Start</button></div>`);
  list.bind(panel); traceUI = {kind:'list', root:panel};
  panel.querySelectorAll('.rrow .body').forEach(b=>{ b.style.fontSize='19px'; }); panel.querySelectorAll('.rrow').forEach(r=>{ r.style.padding='8px 10px'; });
  say(L.run); await clickOnce($('#run')); SFX.tap(); $('#run').disabled=true; stopSpeech(); clearCaption();
  const res = await runCourse(c, rules);
  if(!res.ok){
    failToast(res); SFX.bad(); await say(failLine(res, 'FIN')); hideToast(); hud(null); bubble(null); clearVehicles();
    await cta('Rebuild final rule');
    clearCourse(c); W.placeZippy(SNAP.BUILD_FINAL_RULE ?? startZ); W.snapCamera();
    return BUILD_FINAL_RULE(SNAP.BUILD_FINAL_RULE ?? startZ);
  }
  // arrive at Mrs. Sharma's house
  bubble('STOP'); await stopAt(c.endZ - 1.2, 8); bubble(null); lane(-3);
  const p = W.makeBiryani(c.group, W.Z.x, 1.3, W.Z.z); SFX.drop();
  const tx = c.sharma ? c.sharma.position.x + 0.9 : W.Z.x - 4.4, tz = c.sharma ? c.sharma.position.z : W.Z.z - 0.8, x0=W.Z.x, z0=W.Z.z;
  const t0=gt; await until(()=>{ const k=Math.min(1,(gt-t0)/1.0); p.position.x = x0 + (tx-x0)*k; p.position.y = 1.3 + Math.sin(k*Math.PI)*1.6 - k*0.1; p.position.z = z0 + (tz-z0)*k; p.rotation.y = k*3; return k>=1; });
  SFX.ok(); toast('ok','Biryani delivered!'); W.cam.liftTarget = 1.6; await say(L.runOk); hideToast();
  return COMPLETE();
}
async function COMPLETE(){
  setState('COMPLETE', W.Z.z); hidePanel(); hud(null); timer.stop();
  const sk = [['Follows instructions','GO'],['Checks conditions','eye'],['IF · THEN · ELSE','build'],['AND needs both','check'],['Rule order matters','list'],['OR needs either','check']];
  $('#skills').innerHTML = sk.map(([t,i])=>`<div class="sk"><i>${IC[i]}</i>${t}</div>`).join('');
  $('#againBtn').innerHTML = `${IC.restart}Play again`;
  $('#done').classList.remove('hide'); confetti(); FX.stagger('#done .sk', 0.5);
  await say(L.done);
}
function confetti(){ const cv=$('#confetti'), g=cv.getContext('2d'); const cols=['#ffd84a','#2FA66A','#69B9FF','#E76D5B','#2F6FED','#fff']; const ps=Array.from({length:180},()=>({x:Math.random()*1920, y:-Math.random()*800, vx:(Math.random()-.5)*3, vy:3+Math.random()*4, r:Math.random()*6, s:6+Math.random()*10, c:cols[(Math.random()*6)|0]}));
  let n=0; (function f(){ g.clearRect(0,0,1920,1080); ps.forEach(p=>{ p.x+=p.vx; p.y+=p.vy; p.r+=0.1; g.save(); g.translate(p.x,p.y); g.rotate(p.r); g.fillStyle=p.c; g.fillRect(-p.s/2,-p.s/4,p.s,p.s/2); g.restore(); }); if(++n<420) requestAnimationFrame(f); else g.clearRect(0,0,1920,1080); })(); }

/* ---------- activity runner (restartable) ---------- */
let restartFn = null;
function launch(fn, ...args){ epoch++; waiters.length = 0; restartFn = ()=>launch(fn, ...args); hintsOff(); hideToast(); bubble(null); hud(null); clearVehicles(); stopSpeech(); clearCaption();
  Promise.resolve().then(()=>fn(...args)).catch(e=>{ if(e!==CANCEL) console.error(e); }); }
const SNAP = {};
const acts = { PREDICTION, FIXED_ROUTE_TEST, BUILD_CONDITIONAL, ORDER_RULES, DEBUG_PRIORITY, BUILD_FINAL_RULE, FINAL_RUN };
function restartCurrent(){ const s = state; if(s==='COMPLETE') return;
  if(s==='INTRO'){ clearCourse(course); course=null; W.placeZippy(0); W.snapCamera(); hideCta(); launch(INTRO); return; }
  const z = SNAP[s] ?? W.Z.z; clearCourse(course); course=null; W.placeZippy(z); W.snapCamera(); hideCta();
  if(s==='PREDICTION' || s==='FIXED_ROUTE_TEST'){ W.placeZippy(0); W.snapCamera(); launch(async()=>{ course = buildCourse(['fixedDelivery'], 0, {finish:true}); return PREDICTION(); }); return; }
  if(acts[s]) launch(acts[s], z); }
/* ---------- controls ---------- */
function syncCtl(){ $('#skSound').classList.toggle('off', A.muted); $('#skMute span').innerHTML = A.muted ? 'Unmute All<br>Sounds' : 'Mute All<br>Sounds'; $('#cap').classList.toggle('muteCap', !SP.captions);
  $('#pResume').innerHTML = `${IC.play}Resume`; $('#pRestart').innerHTML = `${IC.restart}Restart this part`; $('#pStory').innerHTML = `${IC.play}Watch Zippy's story`;
  $('#pCap').innerHTML = `${IC.cc}Captions<span class="st">${SP.captions?'On':'Off'}</span>`; $('#pMute').innerHTML = `${A.muted?IC.mute:IC.snd}Sound<span class="st">${A.muted?'Off':'On'}</span>`; }
function toggleMute(){ A.muted=!A.muted; if(SP.audio) SP.audio.muted=A.muted; if(A.muted){ try{speechSynthesis.cancel();}catch(e){} if(siren) siren.g.gain.value=0; } else if(siren) siren.g.gain.value=0.05; syncCtl(); }
function toggleCap(){ SP.captions=!SP.captions; syncCtl(); }
function replay(){ if(SP.last) say(SP.last); }
function setPause(p){ if(state==='TITLE') return; paused=p; $('#pause').classList.toggle('hide', !p); try{ p?speechSynthesis.pause():speechSynthesis.resume(); }catch(e){} if(SP.audio){ if(p) SP.audio.pause(); else SP.audio.play().catch(()=>{}); } if(siren) siren.g.gain.value = (p||A.muted)?0:0.05; if(p) setTimeout(()=>$('#pResume').focus({preventScroll:true}),30); }
const skMenu = $('#skMenu');
function menuOpen(o){ skMenu.classList.toggle('hide', !o); $('#skSound').setAttribute('aria-expanded', String(o)); }
$('#skSound').onclick=()=>{ SFX.tap(); menuOpen(skMenu.classList.contains('hide')); };
$('#skReplay').onclick=()=>{ SFX.tap(); menuOpen(false); replay(); }; $('#skMute').onclick=()=>{ toggleMute(); SFX.tap(); menuOpen(false); };
$('#skInfo').onclick=()=>{ SFX.tap(); menuOpen(false); setPause(true); };
$('#skExit').onclick=()=>{ SFX.tap(); location.reload(); }; // back to the title; progress is already saved
$('#skHint').onclick=()=>{ if(!H.list || H.idx>=H.list.length) return; SFX.tap(); H.last = gt - 12; }; // next hint now
addEventListener('pointerdown', e=>{ if(!skMenu.classList.contains('hide') && !e.target.closest('#skMenu,#skSound')) menuOpen(false); }, true);
/* mission timer: counts up from 00:00 in game time, so it stops while paused */
const timer = { t0:null, stopped:false, start(){ this.t0=gt; this.stopped=false; }, stop(){ this.stopped=true; },
  tick(){ if(this.t0==null || this.stopped) return; const up=Math.floor(gt-this.t0), t=`${String(Math.floor(up/60)).padStart(2,'0')}:${String(up%60).padStart(2,'0')}`; const el=$('#skTime'); if(el.textContent!==t) el.textContent=t; } };
$('#pResume').onclick=()=>{SFX.tap(); setPause(false);}; $('#pCap').onclick=()=>toggleCap(); $('#pMute').onclick=()=>toggleMute();
$('#pRestart').onclick=()=>{ setPause(false); restartCurrent(); };
$('#pStory').onclick=()=>{ SFX.tap(); $('#pause').classList.add('hide'); HookVideo.play({endLabel:'Back to the game'}).then(()=>setPause(false)); };
$('#againBtn').onclick=()=>{ $('#done').classList.add('hide'); timer.start(); W.cam.liftTarget=0; clearCourse(course); clearProgress(); W.placeZippy(0); W.snapCamera(); Object.assign(G,{prediction:null,ruleA:null,ruleB:null,order:null,debug:null,finalRule:null,_curFinal:null}); launch(async()=>{ W.cam.mode='chase'; $('#skMeter').classList.remove('hide'); course = buildCourse(['fixedDelivery'],0,{finish:true}); return PREDICTION(); }); };
addEventListener('keydown', e=>{ if(state==='TITLE' || HookVideo.open) return; const k=e.key.toLowerCase();
  if(k==='escape' && !skMenu.classList.contains('hide')){ menuOpen(false); return; }
  if(k==='escape' || k==='p'){ e.preventDefault(); setPause(!paused); } else if(paused) return; else if(k==='m') toggleMute(); else if(k==='c') toggleCap(); else if(k==='r' && !e.target.closest('.tile')) replay(); });
document.addEventListener('visibilitychange', ()=>{ if(document.hidden && state!=='TITLE' && !paused && !HookVideo.open) setPause(true); });

/* ---------- title ---------- */
$('#titleBg').style.backgroundImage = `url(${ASSET.city})`; $('#titleBot').src = ASSET.zippyImg; $('#doneBot').src = ASSET.zippyImg;
W.cam.mode = 'title'; W.placeZippy(0);
const savedProgress = loadProgress();
if(savedProgress){ $('#startBtn').lastChild.textContent = savedProgress.state==='COMPLETE' ? 'View Results' : 'Resume Mission'; }
function resumeProgress(saved){
  const s = saved && saved.state;
  if(!s || s==='INTRO') return launch(INTRO);
  if(s==='PREDICTION' || s==='FIXED_ROUTE_TEST'){
    W.placeZippy(0); W.snapCamera();
    return launch(async()=>{ course=buildCourse(['fixedDelivery'],0,{finish:true}); return s==='PREDICTION'?PREDICTION():FIXED_ROUTE_TEST(); });
  }
  if(s==='COMPLETE'){
    W.placeZippy(Number.isFinite(saved.startZ)?saved.startZ:0); W.snapCamera();
    return launch(COMPLETE);
  }
  if(acts[s]){
    const z = Number.isFinite(SNAP[s]) ? SNAP[s] : (Number.isFinite(saved.startZ) ? saved.startZ : 0);
    W.placeZippy(z); W.snapCamera(); return launch(acts[s], z);
  }
  clearProgress(); return launch(INTRO);
}
let starting = false;
function beginMission(){ $('#skai').classList.remove('hide'); timer.start(); W.cam.mode='intro'; W.camera.position.set(0, 16, 40);
  if(savedProgress && savedProgress.state!=='INTRO'){ W.cam.mode='chase'; $('#skMeter').classList.remove('hide'); }
  resumeProgress(savedProgress); }
async function startGame(withStory){
  if(starting) return; starting = true;
  audioInit(); SFX.ok(); try{ const u=new SpeechSynthesisUtterance(' '); u.volume=0; speechSynthesis.speak(u); }catch(e){}
  try{ const el=document.documentElement; if(el.requestFullscreen && !document.fullscreenElement) el.requestFullscreen().catch(()=>{}); }catch(e){}
  $('#title').style.pointerEvents='none';
  if(withStory){ const shown = HookVideo.play(); FX.titleOut($('#title'), ()=>{ $('#title').style.display='none'; }); await shown; }
  else { FX.titleOut($('#title'), ()=>{ $('#title').style.display='none'; }); }
  beginMission();
}
// new players see the story first; returning players can still open it from the title
const isFresh = !savedProgress || savedProgress.state==='INTRO';
$('#startBtn').addEventListener('click', ()=>startGame(isFresh));
$('#storyBtn').addEventListener('click', ()=>startGame(true));
setTimeout(()=>$('#startBtn').focus({preventScroll:true}), 100);
syncCtl(); renderProg('PREDICTION');

/* ---------- layout + loop ---------- */
function layout(){ const w=innerWidth, h=innerHeight; const k=Math.min(w/1920, h/1080); stage.style.transform = `translate(${(w-1920*k)/2}px, ${(h-1080*k)/2}px) scale(${k})`;
  stage.style.setProperty('--bx', Math.ceil((w/k-1920)/2)+'px'); stage.style.setProperty('--by', Math.ceil((h/k-1080)/2)+'px'); W.resize(w,h); }
addEventListener('resize', layout); layout();
let lastT = performance.now();
function loop(now){
  const raw = Math.min(0.05, (now-lastT)/1000); lastT = now;
  const dt = paused ? 0 : raw;
  if(!paused){ gt += dt; pumpWaiters(); propsTick(dt); hintTick(); timer.tick(); }
  engineUpd();
  // bubble follows Zippy
  const bb = $('#bubble'); if(!bb.classList.contains('hide')){ const p = W.project(W.Z.x, W.ZH+0.45, W.Z.z); const r=stage.getBoundingClientRect(); const k=r.width/1920; const w=innerWidth, h=innerHeight; const off = W.cam.shift*w;
    bb.style.left = (((p.x*0.5+0.5)*w - r.left)/k)+'px'; bb.style.top = (((-p.y*0.5+0.5)*h - r.top)/k)+'px'; }
  let mirror = null; const me=$('#mirror'); const showM = mirrorOn>0; me.classList.toggle('hide', !showM);
  if(showM){ const r=stage.getBoundingClientRect(), k=r.width/1920; mirror = {x:Math.round(r.left + 1068*k), y:Math.round(r.top + 138*k), w:Math.round(404*k), h:Math.round(154*k)}; }
  if(!document.body.classList.contains('video-on')) W.frame(dt, raw, mirror); // 3D rests while the story video plays
  requestAnimationFrame(loop);
}
requestAnimationFrame(loop);
})();
