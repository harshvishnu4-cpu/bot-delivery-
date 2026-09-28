/* DEV MENU (testing only): jump straight to any screen of Delivery Bot Academy.
   It writes a save for the chosen screen (the same save the game uses for "Resume Mission"),
   reloads, and presses Start. Nothing in the game's own code depends on this file.
   To remove it: delete the dev/ folder and the dev-menu <script> line at the end of index.html. */
(function(){
  'use strict';
  const SAVE_KEY = 'delivery-bot-academy-biryani-v1'; // must match STORAGE_KEY in js/game.js
  const JUMP_KEY = 'dba-dev-jump';                    // what to do after the reload (per tab)
  // startZ: where Zippy stands on the road when the screen opens; any spot on the road works
  const PAGES = [
    { id:'TITLE', label:'Title screen' },
    { id:'STORY', label:'Story video' },
    { id:'INTRO', label:'Intro', z:0 },
    { id:'PREDICTION', n:1, label:'Predict', z:0 },
    { id:'FIXED_ROUTE_TEST', n:2, label:'Test', z:0 },
    { id:'BUILD_CONDITIONAL', n:3, label:'Build', z:-102 },
    { id:'ORDER_RULES', n:4, label:'Order', z:-400 },
    { id:'DEBUG_PRIORITY', n:5, label:'Debug', z:-700 },
    { id:'BUILD_FINAL_RULE', n:6, label:'Create', z:-1000 },
    { id:'FINAL_RUN', n:7, label:'Deliver', z:-1300 },
    { id:'COMPLETE', label:'Results', z:-1800 }
  ];

  const css = document.createElement('link'); css.rel = 'stylesheet'; css.href = 'dev/dev-menu.css'; document.head.appendChild(css);

  /* ---------- which screen is showing now ---------- */
  function currentPage(){
    const title = document.getElementById('title'), hook = document.getElementById('hook');
    if(hook && !hook.hidden) return 'STORY';
    if(title){ const cs = getComputedStyle(title); if(cs.display !== 'none' && cs.pointerEvents !== 'none') return 'TITLE'; }
    try{ const s = JSON.parse(localStorage.getItem(SAVE_KEY)); if(s && s.state) return s.state; }catch(e){}
    return 'TITLE';
  }

  /* ---------- jumping ---------- */
  function jump(p){
    try{
      if(p.id === 'TITLE') sessionStorage.setItem(JUMP_KEY, 'title');
      else if(p.id === 'STORY') sessionStorage.setItem(JUMP_KEY, 'story');
      else {
        let old = null; try{ old = JSON.parse(localStorage.getItem(SAVE_KEY)); }catch(e){}
        const game = Object.assign({ prediction:'go' }, old && old.game); // keep rules built earlier; later screens fall back to defaults
        localStorage.setItem(SAVE_KEY, JSON.stringify({ version:1, state:p.id, startZ:p.z, snap:{ [p.id]:p.z }, game, updatedAt:Date.now() }));
        sessionStorage.setItem(JUMP_KEY, 'start');
      }
    }catch(e){ console.warn('[dev menu] storage unavailable, cannot jump', e); return; }
    location.reload();
  }
  // after the reload: press the title button the tester would have pressed, and skip the story video if it opens
  function finishJump(){
    let mode = null; try{ mode = sessionStorage.getItem(JUMP_KEY); sessionStorage.removeItem(JUMP_KEY); }catch(e){}
    if(!mode || mode === 'title') return;
    const btn = document.getElementById(mode === 'story' ? 'storyBtn' : 'startBtn'); if(!btn) return;
    setTimeout(()=>{
      btn.click();
      if(mode !== 'start') return;
      const t0 = Date.now(), skip = setInterval(()=>{ const hook = document.getElementById('hook'), s = document.getElementById('hookSkip');
        if(hook && !hook.hidden && s && !s.hidden){ s.click(); clearInterval(skip); } else if(Date.now() - t0 > 3000) clearInterval(skip); }, 100);
    }, 250);
  }

  /* ---------- menu ---------- */
  // this file loads in <head> so its Esc handler runs before the game's and the story video's; the UI is built once the page has loaded
  let root, btn, menu;
  function build(){
  root = document.createElement('div'); root.id = 'dbaDev';
  root.innerHTML = `<button id="dbaDevBtn" type="button" aria-label="Dev menu: jump to a screen" aria-expanded="false" aria-controls="dbaDevMenu" title="Dev menu (testing only)"><i></i><i></i><i></i></button>
    <nav id="dbaDevMenu" aria-label="Dev: jump to a screen" hidden><div class="hd">Dev · jump to screen</div><ul>${
      PAGES.map(p=>`<li><button type="button" data-id="${p.id}"><span class="n">${p.n || ''}</span>${p.label}</button></li>`).join('')
    }</ul><div class="ft">Testing only · delete <code>dev/</code> to remove</div></nav>`;
  document.body.appendChild(root);
  btn = root.querySelector('#dbaDevBtn'); menu = root.querySelector('#dbaDevMenu');
  btn.addEventListener('click', ()=>setOpen(menu.hidden));
  menu.addEventListener('click', e=>{ const b = e.target.closest('button[data-id]'); if(!b) return; setOpen(false); jump(PAGES.find(p=>p.id === b.dataset.id)); });
  finishJump();
  }
  function markActive(){ const cur = currentPage();
    menu.querySelectorAll('button[data-id]').forEach(b=>{ const on = b.dataset.id === cur; b.classList.toggle('on', on); if(on) b.setAttribute('aria-current','page'); else b.removeAttribute('aria-current'); }); }
  function setOpen(o){ menu.hidden = !o; btn.setAttribute('aria-expanded', String(o)); btn.classList.toggle('open', o);
    if(o){ markActive(); (menu.querySelector('button.on') || menu.querySelector('button[data-id]')).focus({ preventScroll:true }); } }
  // a click anywhere outside the menu closes it (the click still reaches the game)
  document.addEventListener('pointerdown', e=>{ if(menu && !menu.hidden && !root.contains(e.target)) setOpen(false); }, true);
  // Esc closes the menu without also pausing the game; arrow keys move through the list
  addEventListener('keydown', e=>{
    if(!menu || menu.hidden) return;
    if(e.key === 'Escape'){ e.preventDefault(); e.stopImmediatePropagation(); setOpen(false); btn.focus({ preventScroll:true }); return; }
    if(root.contains(document.activeElement)) e.stopImmediatePropagation(); // keep game shortcuts (M, C, R, P) out of the menu
    if(e.key === 'ArrowDown' || e.key === 'ArrowUp'){ e.preventDefault(); const list = [...menu.querySelectorAll('button[data-id]')], i = list.indexOf(document.activeElement);
      list[(i + (e.key === 'ArrowDown' ? 1 : -1) + list.length) % list.length].focus({ preventScroll:true }); }
  }, true);

  if(document.readyState === 'loading') document.addEventListener('DOMContentLoaded', build); else build();
})();
