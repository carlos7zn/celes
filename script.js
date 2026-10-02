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

// ===== EFECTO DE SONIDO "CUTE" SINTETIZADO (Web Audio API) =====
let audioCtx = null;

function initAudio() {
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  }
}

function playBiu() {
  try {
    initAudio();
    if (audioCtx.state === 'suspended') audioCtx.resume();
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.connect(gain);
    gain.connect(audioCtx.destination);
    
    osc.type = 'triangle'; // Onda suave tipo burbuja/pop
    osc.frequency.setValueAtTime(350, audioCtx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(750, audioCtx.currentTime + 0.12);
    
    gain.gain.setValueAtTime(0.12, audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.12);
    
    osc.start();
    osc.stop(audioCtx.currentTime + 0.12);
  } catch(e) {}
}

function playChime() {
  try {
    initAudio();
    if (audioCtx.state === 'suspended') audioCtx.resume();
    const now = audioCtx.currentTime;
    const notes = [523.25, 659.25, 783.99, 1046.50]; // Notas celestiales: Do, Mi, Sol, Do octava (Acorde Mayor de Do)
    notes.forEach((freq, index) => {
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now + index * 0.08);
      
      gain.gain.setValueAtTime(0, now + index * 0.08);
      gain.gain.linearRampToValueAtTime(0.10, now + index * 0.08 + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.01, now + index * 0.08 + 0.35);
      
      osc.start(now + index * 0.08);
      osc.stop(now + index * 0.08 + 0.4);
    });
  } catch(e) {}
}

// ===== CURSOR DE ESTRELLITAS (SPARKLES TRAIL) =====
document.addEventListener('pointermove', (e) => {
  // Spawn rate limitado para no saturar
  if (Math.random() > 0.18) return;
  
  const sparkle = document.createElement('div');
  sparkle.className = 'trail-sparkle';
  sparkle.textContent = ['✨', '⭐', '🩵', '🤍', '🫧'][Math.floor(Math.random()*5)];
  sparkle.style.left = `${e.clientX}px`;
  sparkle.style.top = `${e.clientY}px`;
  
  // Ángulo de vuelo aleatorio
  const dx = (Math.random() - 0.5) * 60;
  const dy = -Math.random() * 60 - 20;
  sparkle.style.setProperty('--dx', `${dx}px`);
  sparkle.style.setProperty('--dy', `${dy}px`);
  
  document.body.appendChild(sparkle);
  
  // Limpiar DOM
  setTimeout(() => sparkle.remove(), 800);
});

// Lógica del botón No que huye
const noBtn = document.getElementById('noBtn');
const yesBtn = document.getElementById('yesBtn');
const questionBox = document.getElementById('questionBox');
const resultBox = document.getElementById('resultBox');

function moveNo(e){
  // Inicializa el contexto de audio en la primera interacción
  initAudio();
  
  // Mover al body si no está ya
  if(noBtn.parentNode !== document.body){
    document.body.appendChild(noBtn);
  }

  noBtn.style.position = 'fixed';
  noBtn.style.left = '0px';
  noBtn.style.top = '0px';
  noBtn.style.margin = '0';
  noBtn.style.zIndex = '9999';

  const viewW = window.innerWidth;
  const viewH = window.innerHeight;

  const btnW = noBtn.offsetWidth || 85;
  const btnH = noBtn.offsetHeight || 45;

  const maxX = viewW - btnW - 20;
  const maxY = viewH - btnH - 20;

  let x = Math.random() * maxX;
  let y = Math.random() * maxY;

  x = Math.max(20, Math.min(x, maxX));
  y = Math.max(20, Math.min(y, maxY));

  noBtn.style.transform = `translate(${x}px, ${y}px)`;
  
  // Reproducir sonido "cute" de escape
  playBiu();
}

// Escapa al pasar el ratón o tocar
noBtn.addEventListener('pointerover', (e) => moveNo(e));
noBtn.addEventListener('pointerdown', (e) => { e.preventDefault(); moveNo(e); });
noBtn.addEventListener('click', (e) => { e.preventDefault(); moveNo(e); });

// Al pulsar SÍ
yesBtn.addEventListener('click', ()=>{
  // Sonido de campanas/éxito celestial
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
