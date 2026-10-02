// Canvas corazones
const canvas = document.getElementById('hearts');
const ctx = canvas.getContext('2d');
let hearts = [];
let W, H;

function resize(){ W = canvas.width = window.innerWidth; H = canvas.height = window.innerHeight; }
window.addEventListener('resize', resize);
resize();

function spawnHeart(x, y){
  hearts.push({
    x: x ?? Math.random()*W,
    y: y ?? Math.random()*H + H*0.3,
    vx: (Math.random()-0.5)*0.5,
    vy: -Math.random()*0.9 - 0.4,
    size: Math.random()*18 + 14,
    emoji: ['💙','💖','🩵','✨','⭐'][Math.floor(Math.random()*5)],
    alpha: 1,
    sway: Math.random()*Math.PI*2,
    swaySpeed: Math.random()*0.02 + 0.005
  });
}
for(let i=0;i<20;i++) spawnHeart();

function draw(){
  ctx.clearRect(0,0,W,H);
  for(let i=hearts.length-1;i>=0;i--){
    const h = hearts[i];
    h.x += h.vx + Math.sin(h.sway)*0.25;
    h.y += h.vy;
    h.sway += h.swaySpeed;
    h.alpha -= 0.002;
    if(h.y < -30 || h.alpha <= 0){ hearts.splice(i,1); continue; }
    ctx.globalAlpha = Math.max(0, h.alpha);
    ctx.font = `${h.size}px serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(h.emoji, h.x, h.y);
  }
  ctx.globalAlpha = 1;
  requestAnimationFrame(draw);
}
draw();
setInterval(()=>{ if(hearts.length < 18) spawnHeart(); }, 400);

// Sonido sintetizado
let audioCtx = null;
function initAudio(){ if(!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)(); }
function playBiu(){
  try { initAudio(); if(audioCtx.state==='suspended') audioCtx.resume();
    const osc = audioCtx.createOscillator(); const gain = audioCtx.createGain();
    osc.connect(gain); gain.connect(audioCtx.destination);
    osc.type='triangle'; osc.frequency.setValueAtTime(350, audioCtx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(750, audioCtx.currentTime+0.12);
    gain.gain.setValueAtTime(0.12, audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime+0.12);
    osc.start(); osc.stop(audioCtx.currentTime+0.12);
  }catch(e){}
}
function playChime(){
  try { initAudio(); if(audioCtx.state==='suspended') audioCtx.resume();
    const now = audioCtx.currentTime; const notes = [523.25, 659.25, 783.99, 1046.50];
    notes.forEach((freq,index)=>{ const osc = audioCtx.createOscillator(); const gain = audioCtx.createGain();
      osc.connect(gain); gain.connect(audioCtx.destination); osc.type='sine';
      osc.frequency.setValueAtTime(freq, now + index*0.08);
      gain.gain.setValueAtTime(0, now + index*0.08);
      gain.gain.linearRampToValueAtTime(0.10, now + index*0.08 + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.01, now + index*0.08 + 0.35);
      osc.start(now + index*0.08); osc.stop(now + index*0.08 + 0.4);
    }); }catch(e){}
}

// Estela de cursor
document.addEventListener('pointermove', (e)=>{ if(Math.random()>0.18) return;
  const s=document.createElement('div'); s.className='trail-sparkle';
  s.textContent=['✨','⭐','🩵','🤍','🫧'][Math.floor(Math.random()*5)];
  s.style.left=`${e.clientX}px`; s.style.top=`${e.clientY}px`;
  const dx=(Math.random()-0.5)*60; const dy=-Math.random()*60-20;
  s.style.setProperty('--dx',`${dx}px`); s.style.setProperty('--dy',`${dy}px`);
  document.body.appendChild(s); setTimeout(()=>s.remove(),800);
});

// Botón No que huye con movimiento natural siempre animado
const noBtn = document.getElementById('noBtn');
const yesBtn = document.getElementById('yesBtn');
const questionBox = document.getElementById('questionBox');
const resultBox = document.getElementById('resultBox');

let isMoving = false;
let lastX = null;
let lastY = null;

function moveNo(e){
  if (isMoving) return;
  isMoving = true;

  initAudio();
  
  // 1. Asegurar que está fuera del overflow
  if(noBtn.parentNode !== document.body){
    document.body.appendChild(noBtn);
  }
  
  // 2. Estilo fijo base
  noBtn.style.position = 'fixed';
  noBtn.style.left = '0px';
  noBtn.style.top = '0px';
  noBtn.style.margin = '0';
  noBtn.style.zIndex = '9999';

  // 3. Asegurar transición para el primer movimiento
  noBtn.style.transition = 'transform 0.48s cubic-bezier(0.34, 1.56, 0.64, 1)';

  const viewW = window.innerWidth;
  const viewH = window.innerHeight;
  const btnW = noBtn.offsetWidth;
  const btnH = noBtn.offsetHeight;
  
  const maxX = viewW - btnW - 20;
  const maxY = viewH - btnH - 20;

  let x, y;
  do{
    x = Math.max(20, Math.min(Math.random()*maxX, maxX));
    y = Math.max(20, Math.min(Math.random()*maxY, maxY));
  }while(lastX !== null && Math.abs(x-lastX) < 120 && Math.abs(y-lastY) < 120);

  lastX = x;
  lastY = y;

  // 4. Animación fluida desde la posición actual
  requestAnimationFrame(() => {
    noBtn.style.transform = `translate(${x}px, ${y}px)`;
    playBiu();
    setTimeout(()=>{ isMoving = false; }, 480);
  });
}

// Escapa al pasar el ratón o tocar
noBtn.addEventListener('pointerover', moveNo);
noBtn.addEventListener('pointerdown', (e)=>{ e.preventDefault(); moveNo(e); });
noBtn.addEventListener('click', (e)=>{ e.preventDefault(); moveNo(e); });

// Al pulsar SÍ
yesBtn.addEventListener('click', ()=>{
  playChime();
  const cx = window.innerWidth/2, cy = window.innerHeight/2;
  for(let i=0;i<85;i++){
    setTimeout(()=>spawnHeart(cx + (Math.random()-0.5)*300, cy + (Math.random()-0.5)*200), i*16);
  }
  noBtn.style.display = 'none';
  yesBtn.style.display = 'none';
  questionBox.style.display = 'none';
  setTimeout(()=>{ resultBox.style.display = 'block'; }, 300);
});
