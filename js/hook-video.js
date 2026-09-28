/* Delivery Bot Academy - story hook video shown before the mission.
   HookVideo.play(opts) opens the full-screen player and resolves when the
   viewer skips, finishes, or presses the end-card button. Uses GSAP for motion. */
(function(){
  'use strict';
  const $ = s => document.querySelector(s);
  const hasGsap = !!window.gsap;
  if(hasGsap) gsap.ticker.lagSmoothing(0); // keep UI tweens on time even when the 3D scene is heavy
  const root = $('#hook'), video = $('#hookVideo'), bar = $('#hookProg');
  const skip = $('#hookSkip'), mute = $('#hookMute'), tapPlay = $('#hookPlay');
  const endCard = $('#hookEnd'), goBtn = $('#hookGo'), againBtn = $('#hookAgain');
  const ICON_SND = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 9v6h4l5 4V5L8 9z" fill="currentColor"/><path d="M16.5 8.5a5 5 0 0 1 0 7M19 6a8.5 8.5 0 0 1 0 12" stroke="currentColor" stroke-width="2.4" fill="none" stroke-linecap="round"/></svg>';
  const ICON_MUTE = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 9v6h4l5 4V5L8 9z" fill="currentColor"/><path d="M16.5 9.5l5 5M21.5 9.5l-5 5" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"/></svg>';
  let resolveFn = null, playing = false;

  function syncMute(){ mute.innerHTML = video.muted ? ICON_MUTE : ICON_SND; mute.setAttribute('aria-label', video.muted ? 'Turn sound on' : 'Turn sound off'); }
  function tick(){ if(!playing) return; if(video.duration) bar.style.transform = `scaleX(${video.currentTime / video.duration})`; requestAnimationFrame(tick); }

  function start(){
    endCard.hidden = true; tapPlay.hidden = true; skip.hidden = false;
    video.currentTime = 0;
    const p = video.play();
    if(p && p.catch) p.catch(()=>{ // autoplay blocked: ask for a tap
      tapPlay.hidden = false; if(hasGsap) gsap.fromTo(tapPlay, {scale:.7, opacity:0}, {scale:1, opacity:1, duration:.5, ease:'back.out(2)'});
    });
    playing = true; tick();
  }
  function showEnd(){
    playing = false; bar.style.transform = 'scaleX(1)'; skip.hidden = true; endCard.hidden = false;
    if(hasGsap){
      gsap.fromTo(endCard, {opacity:0}, {opacity:1, duration:.4});
      gsap.fromTo(endCard.querySelectorAll('.hook-end > *'), {y:30, opacity:0}, {y:0, opacity:1, duration:.55, stagger:.1, ease:'back.out(1.7)'});
    }
    setTimeout(()=>goBtn.focus({preventScroll:true}), 60);
  }
  function close(){
    playing = false; video.pause();
    const done = ()=>{ root.hidden = true; document.body.classList.remove('video-on'); const r = resolveFn; resolveFn = null; r && r(); };
    if(hasGsap) gsap.to(root, {opacity:0, duration:.6, ease:'power2.in', onComplete:done}); else done();
  }

  video.addEventListener('ended', showEnd);
  video.addEventListener('error', ()=>{ if(resolveFn) close(); }); // missing file: go straight to the game
  skip.addEventListener('click', close);
  goBtn.addEventListener('click', close);
  againBtn.addEventListener('click', start);
  tapPlay.addEventListener('click', ()=>{ tapPlay.hidden = true; video.play().catch(()=>{}); });
  video.addEventListener('click', ()=>{ if(!playing) return; video.paused ? video.play() : video.pause(); });
  mute.addEventListener('click', ()=>{ video.muted = !video.muted; syncMute(); });
  addEventListener('keydown', e=>{ if(root.hidden) return; if(e.key==='Escape'){ e.stopImmediatePropagation(); close(); } }, true);

  window.HookVideo = {
    get open(){ return !root.hidden; },
    play(opts={}){
      if(resolveFn) return Promise.resolve();
      goBtn.lastChild.textContent = opts.endLabel || "Let's help Zippy!";
      root.hidden = false; document.body.classList.add('video-on'); syncMute();
      if(hasGsap){ gsap.fromTo(root, {opacity:0}, {opacity:1, duration:.7, ease:'power2.out'}); gsap.fromTo('.hook-top, #hookSkip', {y:-24, opacity:0}, {y:0, opacity:1, duration:.6, delay:.4, stagger:.08}); }
      else root.style.opacity = 1;
      return new Promise(res=>{ resolveFn = res; start(); });
    }
  };
})();
