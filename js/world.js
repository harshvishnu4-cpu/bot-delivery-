/* Delivery Bot Academy - 3D world (Three.js): road, props, Zippy movement, camera. */
const ASSET = {
  zippy: window.TEXTURES.zippy,           // WebGL texture (embedded)
  backdrop: window.TEXTURES.backdrop,     // WebGL texture (embedded)
  rider: window.TEXTURES.rider,           // oncoming scooter rider, WebGL texture (embedded)
  zippyImg: 'assets/images/zippy.webp',        // plain <img> uses
  city: 'assets/images/city.webp',             // title screen background
  hookVideo: 'assets/video/hook-video.mp4',
  zippyAspect: 0.49390,
  riderAspect: 0.52031
};
/* ================= 3D WORLD ================= */
const W = {};
(function(){
const T = THREE;
const canvas = document.getElementById('gl');
const renderer = new T.WebGLRenderer({canvas, antialias:true, powerPreference:'high-performance'});
renderer.setPixelRatio(Math.min(window.devicePixelRatio||1, 1.75));
renderer.outputColorSpace = T.SRGBColorSpace;
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = T.PCFSoftShadowMap;
W.renderer = renderer;

const scene = new T.Scene();
scene.background = new T.Color('#6eb6fc');
scene.fog = new T.Fog('#cddeec', 80, 360);
W.scene = scene;

const camera = new T.PerspectiveCamera(50, 16/9, 0.1, 1000);
camera.position.set(0, 18, 45);
W.camera = camera;
const mirrorCam = new T.PerspectiveCamera(42, 420/170, 0.1, 300);
W.mirrorCam = mirrorCam;

// lights
scene.add(new T.HemisphereLight('#dff0ff', '#b8a98f', 1.15));
const sun = new T.DirectionalLight('#fff0d4', 2.1);
sun.position.set(-30, 50, 20);
sun.castShadow = true;
sun.shadow.mapSize.set(2048, 2048);
const sc = sun.shadow.camera; sc.left=-45; sc.right=45; sc.top=45; sc.bottom=-45; sc.near=1; sc.far=160;
sun.shadow.bias = -0.0008; sun.shadow.normalBias = 0.03;
scene.add(sun); scene.add(sun.target);
W.sun = sun;

function loadTex(src){ const t = new T.TextureLoader().load(src); t.colorSpace = T.SRGBColorSpace; t.anisotropy = 4; return t; }
function canvasTex(w,h,draw,repeat){ const c=document.createElement('canvas'); c.width=w; c.height=h; const g=c.getContext('2d'); draw(g,w,h); const t=new T.CanvasTexture(c); t.colorSpace=T.SRGBColorSpace; t.anisotropy=4; if(repeat){t.wrapS=t.wrapT=T.RepeatWrapping;} return t; }
function rng(seed){ let s=seed>>>0; return ()=>{ s=(s*1664525+1013904223)>>>0; return s/4294967296; }; }
const R = rng(20260924);

// ---------- backdrop skyline (from supplied city art) ----------
const backTex = loadTex(ASSET.backdrop);
const back = new T.Mesh(new T.PlaneGeometry(1500, 1500*414/1920), new T.MeshBasicMaterial({map:backTex, fog:false, depthWrite:false}));
back.renderOrder = -10;
scene.add(back);
W.back = back;

// ---------- ground & road ----------
const L0 = 80, L1 = -3200, LEN = L0 - L1, MID = (L0+L1)/2;
W.ROAD_END = L1;
const asphalt = canvasTex(256,256,(g,w,h)=>{ g.fillStyle='#62666d'; g.fillRect(0,0,w,h); const id=g.getImageData(0,0,w,h); for(let i=0;i<id.data.length;i+=4){ const n=(Math.random()*34-17)|0; id.data[i]+=n; id.data[i+1]+=n; id.data[i+2]+=n+2; } g.putImageData(id,0,0); }, true);
asphalt.repeat.set(2, LEN/12);
const road = new T.Mesh(new T.PlaneGeometry(12, LEN, 1, Math.ceil(LEN/8)), new T.MeshLambertMaterial({map:asphalt}));
road.rotation.x = -Math.PI/2; road.position.set(0, 0, MID); road.receiveShadow = true; scene.add(road);
W.asphalt = asphalt; W.matCurb = null;
const ground = new T.Mesh(new T.PlaneGeometry(600, LEN+400, 8, Math.ceil((LEN+400)/8)), new T.MeshLambertMaterial({color:'#b9c49a'}));
ground.rotation.x = -Math.PI/2; ground.position.set(0,-0.12,MID); ground.receiveShadow = true; scene.add(ground);

const matWhite = new T.MeshLambertMaterial({color:'#f4f4f0'});
const matYellow = new T.MeshLambertMaterial({color:'#f3c233'});
function strip(x,w,mat,y=0.012){ const m=new T.Mesh(new T.PlaneGeometry(w, LEN, 1, Math.ceil(LEN/8)), mat); m.rotation.x=-Math.PI/2; m.position.set(x,y,MID); m.receiveShadow=true; scene.add(m); }
strip(-5.55,0.22,matWhite); strip(5.55,0.22,matWhite); strip(-5.85,0.12,matYellow); strip(5.85,0.12,matYellow);
// centre dashes
{ const n = Math.floor(LEN/7); const im = new T.InstancedMesh(new T.PlaneGeometry(0.22,3.2), matWhite, n); const o=new T.Object3D();
  for(let i=0;i<n;i++){ o.position.set(0,0.013,L0-i*7); o.rotation.set(-Math.PI/2,0,0); o.updateMatrix(); im.setMatrixAt(i,o.matrix);} im.receiveShadow=true; scene.add(im); }

// curbs + sidewalks + hedges
const pave = canvasTex(128,128,(g,w,h)=>{ g.fillStyle='#e4e0d8'; g.fillRect(0,0,w,h); g.strokeStyle='#cbc6bc'; g.lineWidth=3; for(let i=0;i<=4;i++){ g.beginPath(); g.moveTo(0,i*32); g.lineTo(w,i*32); g.stroke(); } for(let r=0;r<4;r++){ const off=r%2?16:0; for(let i=0;i<=4;i++){ g.beginPath(); g.moveTo(off+i*32, r*32); g.lineTo(off+i*32, r*32+32); g.stroke(); } } }, true);
pave.repeat.set(2, 1);
function box(x,y,z,w,h,d,mat,cast=false){ const m=new T.Mesh(new T.BoxGeometry(w,h,d),mat); m.position.set(x,y,z); m.receiveShadow=true; m.castShadow=cast; scene.add(m); return m; }
const matCurb = new T.MeshLambertMaterial({color:'#d9d6d0'});
const matPave = new T.MeshLambertMaterial({map:pave});
const matHedge = new T.MeshLambertMaterial({color:'#6f9e3c'});
const matLawn = new T.MeshLambertMaterial({color:'#8fbb4f'});

// instanced helpers (registered so a junction can carve a gap in the roadside)
const REG = [];
function inst(geo, mat, list, cast=true, kind=null){ const im=new T.InstancedMesh(geo, mat, list.length); const o=new T.Object3D(); const col=new T.Color();
  list.forEach((p,i)=>{ o.position.set(p.x,p.y,p.z); o.rotation.set(p.rx||0,p.ry||0,p.rz||0); o.scale.set(p.sx||1,p.sy||1,p.sz||1); o.updateMatrix(); im.setMatrixAt(i,o.matrix); if(p.c){ col.set(p.c); im.setColorAt(i,col);} });
  im.castShadow=cast; im.receiveShadow=true; if(im.instanceColor) im.instanceColor.needsUpdate=true; scene.add(im);
  if(kind){ const saved = list.map((_,i)=>{ const m=new T.Matrix4(); im.getMatrixAt(i,m); return m; }); REG.push({im, list, kind, saved, cnt:new Uint8Array(list.length)}); }
  return im; }
const CARVE_HW = {walk:6.0, hedge:11.6, lawn:12.4, fence:12.9, tree:10.8, flower:11.6, light:9, bld:22};
const ZERO = new T.Matrix4().makeScale(0,0,0);
W.carve = (side, zJ)=>{ const tok=[]; for(const r of REG){ const hw=CARVE_HW[r.kind]; let ch=false;
    r.list.forEach((p,i)=>{ if(Math.sign(p.x)!==side) return; const ext=(p.ez!=null?p.ez:(p.sz||1.2)/2); if(Math.abs(p.z-zJ) < hw+ext){ if(r.cnt[i]++===0){ r.im.setMatrixAt(i, ZERO); ch=true; } tok.push([r,i]); } });
    if(ch) r.im.instanceMatrix.needsUpdate=true; } return tok; };
W.uncarve = (tok)=>{ const touched=new Set(); for(const [r,i] of tok){ if(r.cnt[i]>0 && --r.cnt[i]===0){ r.im.setMatrixAt(i, r.saved[i]); touched.add(r); } } touched.forEach(r=>r.im.instanceMatrix.needsUpdate=true); };
// curbs, sidewalks, hedges, lawns in 4 m chunks
{ const CH=4; const curb=[], pv=[], hd=[], lw=[];
  for(let z=L0; z>L1; z-=CH){ const zc=z-CH/2; for(const s of [-1,1]){
    curb.push({x:s*6.2, y:0.14, z:zc, sx:0.4, sy:0.28, sz:CH}); pv.push({x:s*8.6, y:0.12, z:zc, sx:4.4, sy:0.24, sz:CH});
    hd.push({x:s*11.6, y:0.35, z:zc, sx:1.6, sy:0.7, sz:CH}); lw.push({x:s*18, y:0.06, z:zc, sx:11, sy:0.12, sz:CH}); } }
  const bg=new T.BoxGeometry(1,1,1);
  inst(bg, matCurb, curb, false, 'walk'); inst(bg, matPave, pv, false, 'walk'); inst(bg, matHedge, hd, true, 'hedge'); inst(bg, matLawn, lw, false, 'lawn'); }

// trees
{ const trunks=[], can=[], can2=[]; const greens=['#9cc43a','#86b534','#a9cc45','#7fae33','#b3d24c'];
  for(let z=L0; z>L1; z-=11){ for(const s of [-1,1]){ const x=s*(8.9+R()*0.5), zz=z+R()*4, h=2.6+R()*1.2, sc=0.9+R()*0.5;
    trunks.push({x, y:h/2, z:zz, sy:h}); can.push({x, y:h+1.1*sc, z:zz, sx:sc*1.25, sy:sc, sz:sc*1.2, ry:R()*6, c:greens[(R()*5)|0]});
    can2.push({x:x+s*0.4, y:h+2.0*sc, z:zz+0.5, sx:sc*0.8, sy:sc*0.75, sz:sc*0.8, ry:R()*6, c:greens[(R()*5)|0]}); } }
  inst(new T.CylinderGeometry(0.16,0.24,1,6), new T.MeshLambertMaterial({color:'#7a5a3c'}), trunks, true, 'tree');
  const cm = new T.MeshLambertMaterial({color:'#ffffff', flatShading:true}); W.canopyMat = cm;
  inst(new T.IcosahedronGeometry(1.7,1), cm, can, true, 'tree'); inst(new T.IcosahedronGeometry(1.5,1), cm, can2, true, 'tree');
}
// flowers on hedge
{ const f=[]; const cols=['#f7a1c4','#ffffff','#f6d04d','#ef7fa0'];
  for(let z=L0; z>L1; z-=1.3){ for(const s of [-1,1]){ if(R()<0.55) f.push({x:s*(11+R()*1.2), y:0.75, z:z+R(), sx:1,sy:1,sz:1, c:cols[(R()*4)|0]}); } }
  inst(new T.IcosahedronGeometry(0.14,0), new T.MeshLambertMaterial({color:'#fff'}), f, false, 'flower'); }
// stone pillars + wooden fence (as in the supplied street art)
{ const pil=[], fen=[]; for(let z=L0; z>L1; z-=9){ for(const s of [-1,1]){ pil.push({x:s*12.9, y:0.9, z}); fen.push({x:s*12.9, y:0.75, z:z-4.5, ez:4.05}); } }
  inst(new T.BoxGeometry(0.9,1.8,0.9), new T.MeshLambertMaterial({color:'#dcd8cf'}), pil, true, 'fence');
  const fenceTex = canvasTex(128,64,(g,w,h)=>{ g.clearRect(0,0,w,h); g.fillStyle='#9a6a3e'; g.fillRect(0,6,w,7); g.fillRect(0,h-13,w,7); for(let i=4;i<w;i+=12){ g.fillRect(i,0,6,h);} });
  inst(new T.BoxGeometry(0.12,1.2,8.1), new T.MeshLambertMaterial({map:fenceTex, transparent:true, alphaTest:0.4}), fen, true, 'fence'); }
// streetlights
{ const poles=[], arms=[], heads=[]; for(let z=L0-6; z>L1; z-=34){ for(const s of [-1,1]){ const zz=z+(s>0?17:0); poles.push({x:s*6.8,y:3.6,z:zz}); arms.push({x:s*5.9,y:7.1,z:zz}); heads.push({x:s*5.1,y:7.0,z:zz}); } }
  const pm = new T.MeshLambertMaterial({color:'#8a95a3'});
  inst(new T.CylinderGeometry(0.1,0.14,7.2,8), pm, poles, true, 'light'); inst(new T.BoxGeometry(1.8,0.12,0.16), pm, arms, true, 'light'); inst(new T.BoxGeometry(0.7,0.14,0.35), new T.MeshLambertMaterial({color:'#e9eef3'}), heads, true, 'light'); }
// buildings
{ const facade = canvasTex(256,256,(g,w,h)=>{ g.fillStyle='#ffffff'; g.fillRect(0,0,w,h);
    for(let r=0;r<6;r++){ g.fillStyle='#e6e6e6'; g.fillRect(0, r*42+36, w, 6);
      for(let c=0;c<4;c++){ const x=10+c*62, y=6+r*42; const gr=g.createLinearGradient(x,y,x+44,y+28); gr.addColorStop(0,'#7fa6c9'); gr.addColorStop(.5,'#a9c7e2'); gr.addColorStop(1,'#6b92b8'); g.fillStyle=gr; g.fillRect(x,y,44,28); g.fillStyle='rgba(255,255,255,.35)'; g.fillRect(x+4,y+3,10,22);} } });
  const near=[], far=[]; const tints=['#f1ece3','#e8e3d8','#dde3ea','#efe7da','#e3e0da','#d9dfe6','#f3efe8'];
  for(const s of [-1,1]){ let z=L0; while(z>L1){ const d=10+R()*8, w=10+R()*6, h=9+R()*20; near.push({x:s*(24+w/2+R()*3), y:h/2, z:z-d/2, sx:w, sy:h, sz:d, c:tints[(R()*7)|0]}); z-=d+2+R()*5; }
    z=L0; while(z>L1){ const d=14+R()*10, w=14+R()*8, h=30+R()*70; far.push({x:s*(58+w/2+R()*40), y:h/2, z:z-d/2, sx:w, sy:h, sz:d, c:tints[(R()*7)|0]}); z-=d+6+R()*16; } }
  const bm = new T.MeshLambertMaterial({map:facade, color:'#fff'}); W.bldMat = bm; W.bldTints = tints;
  inst(new T.BoxGeometry(1,1,1), bm, near, true, 'bld'); inst(new T.BoxGeometry(1,1,1), bm, far, false, 'bld');
  // roof slabs
  inst(new T.BoxGeometry(1.04,0.6,1.04), new T.MeshLambertMaterial({color:'#cfd4da'}), near.map(b=>({x:b.x,y:b.sy+0.3,z:b.z,sx:b.sx,sz:b.sz,sy:1})), false, 'bld');
}

// ---------- Zippy (the supplied character art as a camera-facing sprite) ----------
const zTex = loadTex(ASSET.zippy);
const ZH = 2.3, ZW = ZH * ASSET.zippyAspect;
const zMat = new T.SpriteMaterial({map:zTex, transparent:true, alphaTest:0.12});
const zippy = new T.Sprite(zMat); zippy.center.set(0.5, 0.0); zippy.scale.set(ZW, ZH, 1); zippy.renderOrder = 5; scene.add(zippy);
const blobTex = canvasTex(128,128,(g,w,h)=>{ const gr=g.createRadialGradient(64,64,4,64,64,62); gr.addColorStop(0,'rgba(0,0,0,.55)'); gr.addColorStop(1,'rgba(0,0,0,0)'); g.fillStyle=gr; g.fillRect(0,0,w,h); });
const blob = new T.Mesh(new T.PlaneGeometry(1,1), new T.MeshBasicMaterial({map:blobTex, transparent:true, depthWrite:false}));
blob.rotation.x=-Math.PI/2; blob.scale.set(1.5, 2.6, 1); scene.add(blob);
const glowTex = canvasTex(128,128,(g,w,h)=>{ const gr=g.createRadialGradient(64,64,2,64,64,62); gr.addColorStop(0,'rgba(255,240,200,1)'); gr.addColorStop(.25,'rgba(255,120,40,.9)'); gr.addColorStop(1,'rgba(255,60,0,0)'); g.fillStyle=gr; g.fillRect(0,0,w,h); });
const brake = new T.Sprite(new T.SpriteMaterial({map:glowTex, transparent:true, blending:T.AdditiveBlending, depthWrite:false}));
brake.scale.set(1.0,0.7,1); brake.renderOrder = 6; scene.add(brake);
W.zippy = zippy; W.ZH = ZH;

const Z = W.Z = {x:-3, z:0, v:0, vmax:0, stopZ:null, tx:-3, hard:false, lat:0, braking:0, bobT:0, h:0, path:null, slip:0, slide:false, jy:0};
W.setDrive = (vmax, stopZ=null)=>{ Z.vmax=vmax; Z.stopZ=stopZ; Z.hard=false; };
W.placeZippy = (z, x=-3)=>{ Object.assign(Z, {z, x, tx:x, v:0, vmax:0, stopZ:null, hard:false, h:0, path:null, slip:0, slide:false, jy:0, lat:0}); };
W.follow = (pts, v)=>{ const cum=[0]; for(let i=1;i<pts.length;i++) cum.push(cum[i-1]+Math.hypot(pts[i].x-pts[i-1].x, pts[i].z-pts[i-1].z)); Z.path={pts, cum, len:cum[cum.length-1], s:0, v}; };
function updZippy(dt){
  const prev = Z.v;
  if(Z.path){ const P=Z.path; P.s=Math.min(P.len, P.s+P.v*dt); let i=1; while(i<P.pts.length-1 && P.cum[i]<P.s) i++;
    const a=P.pts[i-1], b=P.pts[i], seg=(P.cum[i]-P.cum[i-1])||1, k=Math.min(1,Math.max(0,(P.s-P.cum[i-1])/seg));
    Z.x=a.x+(b.x-a.x)*k; Z.z=a.z+(b.z-a.z)*k; Z.tx=Z.x; const nh=Math.atan2(b.x-a.x, -(b.z-a.z)); let dh=nh-Z.h; dh=Math.atan2(Math.sin(dh),Math.cos(dh)); Z.h=nh;
    const tr = dt>0 ? dh/dt : 0; Z.lat += (tr*2.5 - Z.lat)*Math.min(1, dt*6); Z.v = P.v;
  } else {
    const acc = 6.5, dec = Z.hard ? 30 : Z.slide ? 3 : 9;
    let target = Z.vmax;
    if(Z.stopZ!=null){ const d = Z.z - Z.stopZ; if(d<=0.03) target=0; else target=Math.min(target, Math.sqrt(2*dec*d)*0.97 + 0.15); }
    if(Z.v < target) Z.v = Math.min(target, Z.v + acc*dt); else Z.v = Math.max(target, Z.v - dec*dt);
    Z.z -= Z.v*dt;
    if(Z.stopZ!=null && Z.z <= Z.stopZ){ Z.z = Z.stopZ; Z.v = 0; }
    if(Z.slip>0){ Z.x += Math.sin(Z.bobT*0.9)*dt*2.2*Z.slip; Z.x=Math.max(-5,Math.min(5,Z.x)); Z.tx = Z.x; }
    const dx = Z.tx - Z.x; const lv = Math.max(-3.4, Math.min(3.4, dx*2.4)); Z.x += lv*dt; Z.lat += (lv - Z.lat)*Math.min(1, dt*8);
  }
  Z.braking = (!Z.slip && (Z.v < prev - 0.001 || (Z.v===0 && Z.vmax===0) || (Z.v===0 && Z.stopZ!=null))) ? Math.min(1, Z.braking + dt*6) : Math.max(0, Z.braking - dt*4);
  Z.bobT += dt*(4 + Z.v*1.4);
  const fx=Math.sin(Z.h), fz=-Math.cos(Z.h);
  zippy.position.set(Z.x, Math.abs(Math.sin(Z.bobT))*0.035*(Z.v>0.2?1:0.2) + Z.jy, Z.z);
  zMat.rotation = -Z.lat*0.07 + Math.sin(Z.bobT*1.6)*0.42*Z.slip;
  blob.position.set(Z.x+fx*0.2, 0.02, Z.z+fz*0.2); blob.rotation.z = Z.h; blob.material.opacity = 1/(1+Z.jy*1.5);
  brake.position.set(Z.x + Math.sin(-zMat.rotation)*ZH*0.36 - fx*0.08, ZH*0.365 + Z.jy, Z.z - fz*0.08);
  brake.material.opacity = Z.braking; brake.visible = Z.braking>0.02;
}

// ---------- camera ----------
const cam = W.cam = {mode:'intro', t:0, shift:0, shiftTarget:0, lift:0, liftTarget:0, shake:0};
W.shake = a=>{ cam.shake = Math.max(cam.shake, a); };
const tmpV = new T.Vector3(), look = new T.Vector3(0,1,-10);
function updCamera(dt, rawDt){
  cam.t += dt;
  cam.shift += (cam.shiftTarget - cam.shift)*Math.min(1, rawDt*3);
  cam.lift += (cam.liftTarget - cam.lift)*Math.min(1, rawDt*2);
  let px, py, pz, lx, ly, lz, k;
  if(cam.mode==='title'){ const a=cam.t*0.05; px=Math.sin(a)*4; py=9; pz=Z.z+30; lx=0; ly=3; lz=Z.z-40; k=1; }
  else { const fx=Math.sin(Z.h), fz=-Math.cos(Z.h), c2=Math.cos(Z.h)**2, cs=Z.x*(cam.mode==='intro'?0.5:0.45)*c2, bk=7.6+cam.lift*1.6;
    px=Z.x-cs-fx*bk; py=3.2+cam.lift; pz=Z.z-fz*bk; lx=Z.x-cs+fx*9; ly=1.25; lz=Z.z+fz*9; k=1-Math.exp(-rawDt*(cam.mode==='intro'?1.1:3.6)); }
  if(cam.mode==='title'){ camera.position.set(px,py,pz); look.set(lx,ly,lz); }
  else { tmpV.set(px,py,pz); camera.position.lerp(tmpV, k); tmpV.set(lx,ly,lz); look.lerp(tmpV, k); }
  camera.lookAt(look);
  if(cam.shake>0.001){ camera.position.x += (Math.random()-.5)*cam.shake; camera.position.y += (Math.random()-.5)*cam.shake*0.6; cam.shake *= Math.exp(-rawDt*6); }
  { let dx=look.x-camera.position.x, dz=look.z-camera.position.z; const n=Math.hypot(dx,dz)||1; dx/=n; dz/=n;
    back.position.set(camera.position.x+dx*620, camera.position.y - 7 + 1500*414/1920/2, camera.position.z+dz*620); back.rotation.y = Math.atan2(-dx,-dz); }
  sun.position.set(Z.x-30, 50, Z.z+20); sun.target.position.set(Z.x, 0, Z.z-12); sun.target.updateMatrixWorld();
  { const fx=Math.sin(Z.h), fz=-Math.cos(Z.h); mirrorCam.position.set(Z.x-fx*1.2, 2.7, Z.z-fz*1.2); mirrorCam.lookAt(Z.x-fx*40, 1.4, Z.z-fz*40); }
}
W.snapCamera = ()=>{ camera.position.set(Z.x*0.55, 3.2+cam.lift, Z.z+7.6+cam.lift*1.6); look.set(Z.x*0.55,1.25,Z.z-9); camera.lookAt(look); };

// ---------- shared props ----------
const M = W.M = {
  navy:new T.MeshLambertMaterial({color:'#183153'}), pole:new T.MeshLambertMaterial({color:'#5d6978'}),
  white:matWhite, cone:new T.MeshLambertMaterial({color:'#ff7a1a'}), black:new T.MeshLambertMaterial({color:'#1d232b'}),
  skin:new T.MeshLambertMaterial({color:'#9c6644'}), hair:new T.MeshLambertMaterial({color:'#20160f'}),
  kurta:new T.MeshLambertMaterial({color:'#2F6FED'}), pants:new T.MeshLambertMaterial({color:'#3b3f4a'}), bag:new T.MeshLambertMaterial({color:'#F2A93B'}),
  cow:new T.MeshLambertMaterial({color:'#f2ede4'}), cowP:new T.MeshLambertMaterial({color:'#8a5a35'}), horn:new T.MeshLambertMaterial({color:'#d9c8a0'}), pink:new T.MeshLambertMaterial({color:'#e8a7a0'}),
  amb:new T.MeshLambertMaterial({color:'#fbfbf8'}), red:new T.MeshLambertMaterial({color:'#d9342b'}), glass:new T.MeshLambertMaterial({color:'#3b5877'}),
  car:new T.MeshLambertMaterial({color:'#69B9FF'}), wood:new T.MeshLambertMaterial({color:'#b98352'}), amber:new T.MeshLambertMaterial({color:'#F2A93B'}),
  house:new T.MeshLambertMaterial({color:'#f4efe6'}), roof:new T.MeshLambertMaterial({color:'#E76D5B'}), green:new T.MeshLambertMaterial({color:'#2FA66A'}), parcel:new T.MeshLambertMaterial({color:'#c8955c'})
};
function mesh(geo, mat, x=0,y=0,z=0, parent){ const m=new T.Mesh(geo,mat); m.position.set(x,y,z); m.castShadow=true; m.receiveShadow=true; if(parent) parent.add(m); return m; }
W.mesh = mesh;

W.makeZebra = (g, z)=>{ for(let i=0;i<8;i++){ const s=new T.Mesh(new T.PlaneGeometry(0.75,3.2), matWhite); s.rotation.x=-Math.PI/2; s.position.set(-4.9+i*1.4, 0.015, z); s.receiveShadow=true; g.add(s);} const sl=new T.Mesh(new T.PlaneGeometry(5.4,0.4), matWhite); sl.rotation.x=-Math.PI/2; sl.position.set(-2.85,0.016,z+2.9); g.add(sl); };
W.makeSignal = (g, z)=>{
  const s = new T.Group(); s.position.set(-6.9, 0, z+2.2); g.add(s);
  mesh(new T.CylinderGeometry(0.13,0.16,5.6,10), M.pole, 0,2.8,0, s);
  mesh(new T.BoxGeometry(4.6,0.16,0.16), M.pole, 2.3,5.45,0, s);
  const head = mesh(new T.BoxGeometry(0.72,1.95,0.45), M.navy, 3.9,4.4,0, s);
  const lights = {}; const cols={red:'#ff3b30', amber:'#ffb000', green:'#27d36b'};
  ['red','amber','green'].forEach((k,i)=>{ const m=new T.Mesh(new T.CircleGeometry(0.23,20), new T.MeshBasicMaterial({color:'#333'})); m.position.set(3.9, 5.02-i*0.62, 0.235); s.add(m);
    const vis=new T.Mesh(new T.BoxGeometry(0.62,0.08,0.3), M.navy); vis.position.set(3.9,5.28-i*0.62,0.35); s.add(vis); lights[k]={m, on:cols[k]}; });
  // side-mounted repeater low on pole, easy to see from chase camera
  const rep = mesh(new T.BoxGeometry(0.5,1.2,0.35), M.navy, 0.28,2.6,0.1, s);
  const small={}; ['red','green'].forEach((k,i)=>{ const m=new T.Mesh(new T.CircleGeometry(0.17,16), new T.MeshBasicMaterial({color:'#333'})); m.position.set(0.28, 2.85-i*0.48, 0.28); s.add(m); small[k]=m; });
  const halo = new T.Sprite(new T.SpriteMaterial({map:glowTex, transparent:true, blending:T.AdditiveBlending, depthWrite:false, color:'#ff5040'})); halo.scale.set(1.0,1.0,1); s.add(halo);
  const api = { set(state){ api.state=state; for(const k in lights){ lights[k].m.material.color.set(k===state?lights[k].on:'#2a2f36'); } small.red.material.color.set(state==='red'?'#ff3b30':'#2a2f36'); small.green.material.color.set(state==='green'?'#27d36b':'#2a2f36');
      halo.visible = !!state; if(state){ const i=['red','amber','green'].indexOf(state); halo.position.set(3.9, 5.02-i*0.62, 0.4); halo.material.color.set(state==='green'?'#40ff90':state==='amber'?'#ffc040':'#ff4030'); } } };
  api.set('green'); return api;
};
W.makeCones = (g, z, x=-3)=>{ const out=new T.Group(); out.position.set(x,0,z); g.add(out);
  [[-1.2,1.2],[0,0],[1.2,-1.2],[-1.2,-2.4]].forEach(([dx,dz])=>{ const c=new T.Group(); c.position.set(dx,0,dz); out.add(c); mesh(new T.ConeGeometry(0.36,1.0,14), M.cone, 0,0.55,0, c); mesh(new T.CylinderGeometry(0.235,0.27,0.16,14), M.white, 0,0.52,0, c); mesh(new T.BoxGeometry(0.85,0.08,0.85), M.cone, 0,0.04,0, c); });
  const sign=new T.Group(); sign.position.set(0,0,-4.2); out.add(sign); mesh(new T.BoxGeometry(2.2,0.9,0.12), M.amber, 0,1.2,0, sign); mesh(new T.BoxGeometry(0.12,1.2,0.12), M.black, -0.9,0.6,0, sign); mesh(new T.BoxGeometry(0.12,1.2,0.12), M.black, 0.9,0.6,0, sign);
  const stripe=new T.Mesh(new T.PlaneGeometry(2.0,0.25), M.black); stripe.position.set(0,1.2,0.07); stripe.rotation.z=0.2; sign.add(stripe);
  return out; };
W.makePerson = (g, x, z, top)=>{ const p=new T.Group(); p.position.set(x,0,z); g.add(p); const tm = top ? new T.MeshLambertMaterial({color:top}) : M.kurta;
  const lg=mesh(new T.BoxGeometry(0.2,0.85,0.22), top?tm:M.pants, -0.14,0.43,0, p), rg=mesh(new T.BoxGeometry(0.2,0.85,0.22), top?tm:M.pants, 0.14,0.43,0, p);
  mesh(new T.CylinderGeometry(0.3,0.36,0.95,10), tm, 0,1.3,0, p); if(!top) mesh(new T.BoxGeometry(0.46,0.55,0.22), M.bag, 0,1.35,0.3, p); else { mesh(new T.CylinderGeometry(0.36,0.46,0.9,12), tm, 0,0.45,0, p); mesh(new T.SphereGeometry(0.14,10,8), M.hair, 0,2.1,-0.22, p); }
  mesh(new T.SphereGeometry(0.26,14,12), M.skin, 0,2.0,0, p); const hr=mesh(new T.SphereGeometry(0.27,14,12,0,Math.PI*2,0,Math.PI/2), M.hair, 0,2.04,0, p);
  const la=mesh(new T.BoxGeometry(0.14,0.7,0.16), tm, -0.4,1.35,0, p), ra=mesh(new T.BoxGeometry(0.14,0.7,0.16), tm, 0.4,1.35,0, p);
  p.rotation.y = Math.PI/2; p.userData={lg,rg,la,ra,phase:0}; return p; };
W.walk = (p, dt, speed)=>{ const u=p.userData; u.phase += dt*speed*5; const a=Math.sin(u.phase)*0.55*(speed>0.05?1:0); u.lg.rotation.x=a; u.rg.rotation.x=-a; u.la.rotation.x=-a*0.8; u.ra.rotation.x=a*0.8; };
W.makeCow = (g, x, z)=>{ const c=new T.Group(); c.position.set(x,0,z); g.add(c);
  mesh(new T.BoxGeometry(2.1,1.0,1.0), M.cow, 0,1.35,0, c); mesh(new T.BoxGeometry(0.7,0.5,1.02), M.cowP, -0.3,1.55,0, c); mesh(new T.BoxGeometry(0.5,0.4,1.02), M.cowP, 0.55,1.2,0, c);
  mesh(new T.BoxGeometry(0.34,0.3,0.4), M.cowP, 0.1,1.95,0, c);
  const head=new T.Group(); head.position.set(1.25,1.75,0); c.add(head); mesh(new T.BoxGeometry(0.62,0.58,0.62), M.cow, 0,0,0, head); mesh(new T.BoxGeometry(0.3,0.3,0.5), M.pink, 0.35,-0.14,0, head);
  mesh(new T.ConeGeometry(0.07,0.35,6), M.horn, 0,0.4,0.22, head); mesh(new T.ConeGeometry(0.07,0.35,6), M.horn, 0,0.4,-0.22, head);
  const legs=[]; [[-0.8,0.35],[-0.8,-0.35],[0.8,0.35],[0.8,-0.35]].forEach(([lx,lz])=>legs.push(mesh(new T.BoxGeometry(0.22,0.9,0.22), M.cow, lx,0.45,lz, c)));
  mesh(new T.BoxGeometry(0.08,0.7,0.08), M.cowP, -1.08,1.2,0, c);
  c.userData={legs, head, phase:0}; return c; };
W.cowWalk = (c, dt, speed)=>{ const u=c.userData; u.phase+=dt*speed*4; u.legs.forEach((l,i)=>l.rotation.z=Math.sin(u.phase+(i%2?Math.PI:0))*0.35*(speed>0.05?1:0)); u.head.rotation.z = Math.sin(u.phase*0.3)*0.08; };
const ballTex = canvasTex(128,64,(g,w,h)=>{ g.fillStyle='#E76D5B'; g.fillRect(0,0,w,h); g.fillStyle='#ffd84a'; g.fillRect(0,22,w,20); g.fillStyle='#fff'; g.fillRect(0,28,w,8); });
W.makeBall = (g, x, z)=>{ const b=mesh(new T.SphereGeometry(0.42,20,14), new T.MeshLambertMaterial({map:ballTex}), x,0.42,z, g); return b; };
function wheel(parent,x,y,z,r=0.42){ const w=mesh(new T.CylinderGeometry(r,r,0.3,16), M.black, x,y,z, parent); w.rotation.z=Math.PI/2; return w; }
const ambTex = canvasTex(256,128,(g,w,h)=>{ g.fillStyle='#fbfbf8'; g.fillRect(0,0,w,h); g.fillStyle='#d9342b'; g.fillRect(0,70,w,16); g.font='900 40px sans-serif'; g.textAlign='center'; g.fillText('108',w/2,50); g.fillRect(w/2-10,92,20,30); g.fillRect(w/2-25,100,50,14); });
W.makeAmbulance = (g, x, z)=>{ const a=new T.Group(); a.position.set(x,0,z); g.add(a);
  const bm=[M.amb,M.amb,M.amb,M.amb,new T.MeshLambertMaterial({map:ambTex}),M.amb];
  const body=new T.Mesh(new T.BoxGeometry(2.3,2.1,3.4), bm); body.position.set(0,1.55,0.6); body.castShadow=true; a.add(body);
  mesh(new T.BoxGeometry(2.3,1.4,1.6), M.amb, 0,1.2,-1.8, a); mesh(new T.BoxGeometry(2.1,0.7,0.1), M.glass, 0,1.55,-2.62, a);
  mesh(new T.BoxGeometry(2.34,0.3,5.0), M.red, 0,1.0,-0.2, a);
  const lr=mesh(new T.BoxGeometry(0.8,0.25,0.4), new T.MeshBasicMaterial({color:'#ff2a2a'}), -0.5,2.72,-0.4, a); const lb=mesh(new T.BoxGeometry(0.8,0.25,0.4), new T.MeshBasicMaterial({color:'#2a6bff'}), 0.5,2.72,-0.4, a);
  wheel(a,-1.1,0.42,1.3); wheel(a,1.1,0.42,1.3); wheel(a,-1.1,0.42,-1.6); wheel(a,1.1,0.42,-1.6);
  const halo = new T.Sprite(new T.SpriteMaterial({map:glowTex, transparent:true, blending:T.AdditiveBlending, depthWrite:false, color:'#ff3030'})); halo.scale.set(3,2,1); halo.position.set(0,2.8,-0.4); a.add(halo);
  a.userData={lr,lb,halo,t:0,v:0,x}; return a; };
W.flashAmb = (a, dt)=>{ const u=a.userData; u.t+=dt; const on=Math.floor(u.t*6)%2===0; u.lr.material.color.set(on?'#ff2a2a':'#5a1010'); u.lb.material.color.set(on?'#10204a':'#2a6bff'); u.halo.material.color.set(on?'#ff3030':'#3060ff'); };
W.makeCar = (g, x, z)=>{ const c=new T.Group(); c.position.set(x,0,z); g.add(c); mesh(new T.BoxGeometry(2.0,0.8,3.8), M.car, 0,0.75,0, c); mesh(new T.BoxGeometry(1.8,0.7,2.0), M.car, 0,1.5,0.2, c); mesh(new T.BoxGeometry(1.7,0.55,0.08), M.glass, 0,1.5,-0.82, c);
  wheel(c,-1,0.4,1.2,0.38); wheel(c,1,0.4,1.2,0.38); wheel(c,-1,0.4,-1.2,0.38); wheel(c,1,0.4,-1.2,0.38); c.userData={v:0}; return c; };
W.makeFlag = (g, x, z, color='#F2A93B')=>{ const f=new T.Group(); f.position.set(x,0,z); g.add(f); mesh(new T.CylinderGeometry(0.08,0.08,4.2,8), M.pole, 0,2.1,0, f);
  const cloth=mesh(new T.PlaneGeometry(1.8,1.1,8,1), new T.MeshLambertMaterial({color, side:T.DoubleSide}), 0.9,3.6,0, f); f.userData={cloth,t:0}; return f; };
W.waveFlag = (f, dt)=>{ const u=f.userData; u.t+=dt; const p=u.cloth.geometry.attributes.position; for(let i=0;i<p.count;i++){ const x=p.getX(i)+0.9; p.setZ(i, Math.sin(u.t*5 + x*3)*0.12*x); } p.needsUpdate=true; };
W.makeFinishLine = (g, z)=>{ const c = canvasTex(256,32,(gg,w,h)=>{ for(let i=0;i<16;i++){ for(let j=0;j<2;j++){ gg.fillStyle=(i+j)%2?'#183153':'#ffffff'; gg.fillRect(i*16,j*16,16,16);} } }); const m=new T.Mesh(new T.PlaneGeometry(11,1.2), new T.MeshLambertMaterial({map:c})); m.rotation.x=-Math.PI/2; m.position.set(0,0.017,z); m.receiveShadow=true; g.add(m); };
W.makeHouse = (g, z)=>{ const h=new T.Group(); h.position.set(-15.5,0,z); g.add(h);
  mesh(new T.BoxGeometry(7,5,6), M.house, 0,2.5,0, h); const roof=mesh(new T.ConeGeometry(5.4,2.6,4), M.roof, 0,6.3,0, h); roof.rotation.y=Math.PI/4;
  mesh(new T.BoxGeometry(1.5,2.6,0.12), M.wood, 3.51,1.3,0, h).rotation.y=Math.PI/2;
  mesh(new T.BoxGeometry(0.1,1.2,1.4), M.glass, 3.52,3.2,-1.8, h); mesh(new T.BoxGeometry(0.1,1.2,1.4), M.glass, 3.52,3.2,1.8, h);
  const pad=mesh(new T.BoxGeometry(2.6,0.1,2.6), M.green, 7.4,0.28,0, h); return h; };
W.makeParcel = (g, x, y, z)=>{ const p=new T.Group(); p.position.set(x,y,z); g.add(p); mesh(new T.BoxGeometry(0.9,0.7,0.9), M.parcel, 0,0,0, p); mesh(new T.BoxGeometry(0.92,0.1,0.18), M.amb, 0,0.3,0, p); return p; };

// ---------- biryani-route props ----------
function textTex(w,h,draw){ return canvasTex(w,h,draw); }
const stripeTex = canvasTex(256,64,(g,w,h)=>{ g.fillStyle='#ffffff'; g.fillRect(0,0,w,h); g.fillStyle='#e0392b'; for(let i=-2;i<12;i++){ g.beginPath(); g.moveTo(i*32,h); g.lineTo(i*32+32,0); g.lineTo(i*32+48,0); g.lineTo(i*32+16,h); g.fill(); } });
const bumpTex = canvasTex(256,32,(g,w,h)=>{ g.fillStyle='#1d232b'; g.fillRect(0,0,w,h); g.fillStyle='#ffd21f'; for(let i=0;i<16;i+=2) g.fillRect(i*16,0,16,h); });
const matStripe = new T.MeshLambertMaterial({map:stripeTex}), matBump = new T.MeshLambertMaterial({map:bumpTex});
W.makePuddle = (g, z, w=11, len=6.5)=>{
  const tex = canvasTex(512,320,(c,W2,H2)=>{ c.clearRect(0,0,W2,H2); c.fillStyle='#7fb2e0';
    const blobs=[[0.5,0.5,0.46,0.34],[0.25,0.45,0.22,0.28],[0.75,0.55,0.22,0.3],[0.42,0.25,0.2,0.18],[0.6,0.78,0.22,0.16],[0.15,0.62,0.12,0.18],[0.86,0.35,0.12,0.18]];
    for(const [x,y,rx,ry] of blobs){ c.beginPath(); c.ellipse(x*W2,y*H2,rx*W2,ry*H2,0,0,Math.PI*2); c.fill(); }
    c.globalCompositeOperation='source-atop'; const gr=c.createLinearGradient(0,0,0,H2); gr.addColorStop(0,'#cfe6ff'); gr.addColorStop(.5,'#8ec0ec'); gr.addColorStop(1,'#5f93c8'); c.fillStyle=gr; c.fillRect(0,0,W2,H2);
    c.strokeStyle='rgba(255,255,255,.75)'; c.lineWidth=6; c.lineCap='round'; for(let i=0;i<9;i++){ const y=40+i*30, x=60+((i*97)%300); c.beginPath(); c.moveTo(x,y); c.lineTo(x+60+((i*53)%80),y-6); c.stroke(); }
    c.globalCompositeOperation='source-over'; });
  const m = new T.Mesh(new T.PlaneGeometry(w,len), new T.MeshBasicMaterial({map:tex, transparent:true, depthWrite:false, opacity:0.9}));
  m.rotation.x=-Math.PI/2; m.position.set(0,0.02,z); m.renderOrder=1; g.add(m); return m; };
const lampMat = ()=>new T.MeshBasicMaterial({color:'#ffb000'});
W.makeBlock = (g, z, x=-3)=>{ const b=new T.Group(); b.position.set(x,0,z); g.add(b);
  const mats=[M.white,M.white,M.white,M.white,matStripe,matStripe];
  for(const y of [1.3,0.72]){ const bd=new T.Mesh(new T.BoxGeometry(4.6,0.46,0.12), mats); bd.position.set(0,y,0); bd.castShadow=true; b.add(bd); }
  for(const lx of [-2.0,2.0]){ const l1=mesh(new T.BoxGeometry(0.12,1.6,0.12), M.black, lx,0.8,0.25, b); l1.rotation.x=0.28; const l2=mesh(new T.BoxGeometry(0.12,1.6,0.12), M.black, lx,0.8,-0.25, b); l2.rotation.x=-0.28; }
  const sign = new T.Mesh(new T.PlaneGeometry(2.2,0.6), new T.MeshLambertMaterial({map:canvasTex(256,70,(c,w,h)=>{ c.fillStyle='#ffd21f'; c.fillRect(0,0,w,h); c.strokeStyle='#1d232b'; c.lineWidth=6; c.strokeRect(3,3,w-6,h-6); c.fillStyle='#1d232b'; c.font='900 38px sans-serif'; c.textAlign='center'; c.textBaseline='middle'; c.fillText('ROAD BLOCK',w/2,h/2+2); })}));
  sign.position.set(0,1.9,0.07); b.add(sign); mesh(new T.BoxGeometry(2.3,0.08,0.08), M.black, 0,1.58,0.05, b);
  const lamp = mesh(new T.SphereGeometry(0.14,10,8), lampMat(), 2.0,1.68,0, b); const lamp2 = mesh(new T.SphereGeometry(0.14,10,8), lampMat(), -2.0,1.68,0, b);
  for(const cx of [-2.7,2.7]){ const c=new T.Group(); c.position.set(cx,0,0.9); b.add(c); mesh(new T.ConeGeometry(0.34,0.95,14), M.cone, 0,0.52,0, c); mesh(new T.CylinderGeometry(0.22,0.26,0.15,14), M.white, 0,0.5,0, c); mesh(new T.BoxGeometry(0.8,0.08,0.8), M.cone, 0,0.04,0, c); }
  b.userData = { blink(t){ const on=Math.floor(t*3)%2===0; lamp.material.color.set(on?'#ffb000':'#553300'); lamp2.material.color.set(on?'#553300':'#ffb000'); } };
  return b; };
W.makeClosed = (g, z)=>{ const b=new T.Group(); b.position.set(0,0,z); g.add(b); const mats=[M.white,M.white,M.white,M.white,matStripe,matStripe];
  for(const y of [1.25,0.65]){ const bd=new T.Mesh(new T.BoxGeometry(11,0.5,0.14), mats); bd.position.set(0,y,0); bd.castShadow=true; b.add(bd); }
  for(const lx of [-5,-1.7,1.7,5]) mesh(new T.BoxGeometry(0.14,1.5,0.14), M.black, lx,0.75,0, b);
  const sign=new T.Mesh(new T.PlaneGeometry(3.4,0.9), new T.MeshLambertMaterial({map:canvasTex(320,84,(c,w,h)=>{ c.fillStyle='#d9342b'; c.fillRect(0,0,w,h); c.strokeStyle='#fff'; c.lineWidth=6; c.strokeRect(4,4,w-8,h-8); c.fillStyle='#fff'; c.font='900 46px sans-serif'; c.textAlign='center'; c.textBaseline='middle'; c.fillText('ROAD CLOSED',w/2,h/2+2); })}));
  sign.position.set(0,2.05,0.08); b.add(sign); return b; };
W.makeBump = (g, z)=>{ const mats=[M.black,M.black,matBump,M.black,matBump,matBump]; const m=new T.Mesh(new T.BoxGeometry(11,0.18,0.9), mats); m.position.set(0,0.09,z); m.receiveShadow=true; m.castShadow=true; g.add(m);
  W.makeSign(g, -6.9, z+9, 'SPEED BREAKER', '#ffd21f', '#1d232b'); return m; };
W.makeSign = (g, x, z, text, bg, fg, arrow=0)=>{ const s=new T.Group(); s.position.set(x,0,z); g.add(s); mesh(new T.CylinderGeometry(0.07,0.08,3,8), M.pole, 0,1.5,0, s);
  const tex=canvasTex(320,120,(c,w,h)=>{ c.fillStyle=bg; c.fillRect(0,0,w,h); c.strokeStyle=fg; c.lineWidth=7; c.strokeRect(5,5,w-10,h-10); c.fillStyle=fg; c.textBaseline='middle'; c.textAlign='center';
    if(arrow){ c.font='900 44px sans-serif'; c.fillText(text, w/2+(arrow<0?28:-28), h/2+3); c.beginPath(); const ax=arrow<0?52:w-52; c.moveTo(ax-arrow*26,h/2-26); c.lineTo(ax+arrow*22,h/2); c.lineTo(ax-arrow*26,h/2+26); c.closePath(); c.fill(); c.fillRect(arrow<0?ax-4:ax-40, h/2-8, 44, 16); }
    else { c.font='900 38px sans-serif'; c.fillText(text, w/2, h/2+2); } });
  const bd=new T.Mesh(new T.PlaneGeometry(2.2,0.82), new T.MeshLambertMaterial({map:tex, side:T.DoubleSide})); bd.position.set(0,3.2,0); s.add(bd); return s; };
// oncoming scooter: the supplied rider art as a camera-facing sprite (like Zippy), with a soft ground shadow
const riderTex = loadTex(ASSET.rider), RH = 2.5, RW = RH * ASSET.riderAspect;
W.makeScooter = (g, x, z)=>{ const s=new T.Group(); s.position.set(x,0,z); g.add(s);
  const sp=new T.Sprite(new T.SpriteMaterial({map:riderTex, transparent:true, alphaTest:0.12})); sp.center.set(0.5, 0.0); sp.scale.set(RW, RH, 1); sp.renderOrder=5; s.add(sp);
  const sh=new T.Mesh(new T.PlaneGeometry(1,1), new T.MeshBasicMaterial({map:blobTex, transparent:true, depthWrite:false})); sh.rotation.x=-Math.PI/2; sh.scale.set(1.3, 2.4, 1); sh.position.y=0.02; s.add(sh);
  let t=0; s.userData={ speed:0, go:false, spin(d){ t+=d; sp.position.y = Math.abs(Math.sin(t*1.6))*0.03; } }; return s; };
W.makeBiryani = (g, x, y, z)=>{ const p=new T.Group(); p.position.set(x,y,z); g.add(p);
  const pot=mesh(new T.SphereGeometry(0.42,18,14), new T.MeshLambertMaterial({color:'#b5562d'}), 0,0,0, p); pot.scale.set(1,0.8,1);
  mesh(new T.TorusGeometry(0.3,0.06,8,20), new T.MeshLambertMaterial({color:'#8f3f1d'}), 0,0.28,0, p).rotation.x=Math.PI/2;
  const cl=mesh(new T.SphereGeometry(0.33,16,10,0,Math.PI*2,0,Math.PI/2), new T.MeshLambertMaterial({color:'#d9342b'}), 0,0.26,0, p); cl.scale.set(1,0.55,1);
  mesh(new T.SphereGeometry(0.08,10,8), new T.MeshLambertMaterial({color:'#ffd84a'}), 0,0.44,0, p); return p; };
// side street at a junction (real turn): carves a gap in the roadside and lays a new street along x
W.makeJunction = (g, zJ, side, label)=>{ const j=new T.Group(); g.add(j); const L=104, x0=side*6, xc=side*(6+L/2);
  const at=W.asphalt.clone(); at.needsUpdate=true; at.repeat.set(L/6, 1); at.wrapS=at.wrapT=T.RepeatWrapping;
  const rd=new T.Mesh(new T.PlaneGeometry(L,12), new T.MeshLambertMaterial({map:at})); rd.rotation.x=-Math.PI/2; rd.position.set(xc,0.004,zJ); rd.receiveShadow=true; j.add(rd);
  for(let i=0;i<14;i++){ const d=new T.Mesh(new T.PlaneGeometry(3.2,0.22), matWhite); d.rotation.x=-Math.PI/2; d.position.set(side*(12+i*7),0.014,zJ); j.add(d); }
  for(const e of [-1,1]){ const st=new T.Mesh(new T.PlaneGeometry(L-2,0.22), matWhite); st.rotation.x=-Math.PI/2; st.position.set(side*(7+L/2),0.014,zJ+e*5.55); j.add(st);
    const mc=mesh(new T.BoxGeometry(L,0.28,0.4), new T.MeshLambertMaterial({color:'#d9d6d0'}), side*(6.4+L/2),0.14,zJ+e*6.2, j);
    const pv=mesh(new T.BoxGeometry(L,0.25,4.4), new T.MeshLambertMaterial({color:'#e4e0d8'}), side*(6.4+L/2),0.125,zJ+e*8.6, j);
    mesh(new T.BoxGeometry(L,0.7,1.6), matHedge, side*(10.8+L/2),0.35,zJ+e*11.6, j);
    mesh(new T.BoxGeometry(L,0.12,11), matLawn, side*(12.5+L/2),0.06,zJ+e*18, j);
    for(let x=14;x<L;x+=11){ const tx=side*(x+(x*7%3)), tz=zJ+e*8.9, h=3; mesh(new T.CylinderGeometry(0.16,0.24,h,6), new T.MeshLambertMaterial({color:'#7a5a3c'}), tx,h/2,tz, j);
      const cn=mesh(new T.IcosahedronGeometry(1.7,1), new T.MeshLambertMaterial({color:['#9cc43a','#86b534','#a9cc45'][x%3], flatShading:true}), tx,h+1.1,tz, j); cn.scale.set(1.2,1,1.2); }
    for(let x=18;x<L;){ const w=10+((x*13)%7), h=10+((x*31)%22), d=12; mesh(new T.BoxGeometry(w,h,d), W.bldMat, side*(x+w/2),h/2,zJ+e*(26+d/2), j); x+=w+3; }
  }
  const sg = W.makeSign(j, side*7.4, zJ+8.4, label, '#2F6FED', '#ffffff', side);
  const closed = W.makeClosed(j, zJ-9.5);
  // turn arrow painted on the lane
  const ar=new T.Mesh(new T.PlaneGeometry(2.4,4.2), new T.MeshBasicMaterial({transparent:true, depthWrite:false, map:canvasTex(128,224,(c,w,h)=>{ c.clearRect(0,0,w,h); c.strokeStyle='#f4f4f0'; c.lineWidth=20; c.lineCap='round'; c.beginPath(); c.moveTo(w/2,h-12); c.lineTo(w/2,110); c.quadraticCurveTo(w/2,60,w/2+side*40,60); c.stroke(); c.fillStyle='#f4f4f0'; c.beginPath(); c.moveTo(w/2+side*62,60); c.lineTo(w/2+side*30,24); c.lineTo(w/2+side*30,96); c.fill(); })}));
  ar.rotation.x=-Math.PI/2; ar.position.set(-3,0.016,zJ+16); j.add(ar);
  g.userData.carves = g.userData.carves || []; g.userData.carves.push(W.carve(side, zJ));
  return {closed, sign:sg}; };
// splash droplets
W.fx = [];
const dropGeo = new T.SphereGeometry(0.09,6,5);
W.splash = (x, z, n=18)=>{ for(let i=0;i<n;i++){ const m=new T.Mesh(dropGeo, new T.MeshBasicMaterial({color:'#d8ecff', transparent:true})); m.position.set(x+(Math.random()-.5)*1.2, 0.1, z+(Math.random()-.5)*0.6); scene.add(m);
    const v={x:(Math.random()-.5)*4, y:2.5+Math.random()*3.5, z:(Math.random()-.2)*2.5}; let life=0.9;
    W.fx.push(dt=>{ life-=dt; v.y-=14*dt; m.position.x+=v.x*dt; m.position.y+=v.y*dt; m.position.z+=v.z*dt; m.material.opacity=Math.max(0,life/0.9); if(life<=0||m.position.y<0){ scene.remove(m); return false; } return true; }); } };

W.project = (x,y,z)=>{ tmpV.set(x,y,z).project(camera); return tmpV; };

// ---------- render loop hook ----------
W.frame = (dt, rawDt, mirror)=>{
  updZippy(dt); updCamera(dt, rawDt); for(let i=W.fx.length-1;i>=0;i--){ if(!W.fx[i](dt)) W.fx.splice(i,1); }
  const w = renderer.domElement.clientWidth, h = renderer.domElement.clientHeight;
  const off = cam.shift * w;
  camera.setViewOffset(w, h, -off, 0, w, h);
  renderer.setScissorTest(false);
  renderer.setViewport(0,0,w,h);
  renderer.render(scene, camera);
  if(mirror){ const r = mirror; renderer.setScissorTest(true); renderer.setScissor(r.x, h-r.y-r.h, r.w, r.h); renderer.setViewport(r.x, h-r.y-r.h, r.w, r.h); mirrorCam.aspect = r.w/r.h; mirrorCam.updateProjectionMatrix();
    const zv = zippy.visible; zippy.visible=false; brake.visible=false; renderer.render(scene, mirrorCam); zippy.visible=zv; renderer.setScissorTest(false); }
};
W.resize = (w,h)=>{ renderer.setSize(w,h,false); camera.aspect=w/h; camera.updateProjectionMatrix(); };
})();

