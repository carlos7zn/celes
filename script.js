// ===== CORAZONES FLOTANTES EN CANVAS =====
const canvas = document.getElementById('hearts');
const ctx = canvas.getContext('2d');
let hearts = [];
let W, H;

function resize(){
  W = canvas.width = window.innerWidth;
  H = canvas.height = window.innerHeight;
}
window.addEventListener('resize', resize);
resize();

const HEARTS = ['💙','💚','💛','💜','💖','✨','⭐'];

function spawnHeart(x, y){
  hearts.push({
    x: x ?? Math.random() * W,
    y: y ?? Math.random() * H,
    vx: (Math.random() - 0.5) * 0.6,
    vy: -Math.random() * 0.8 - 0.2,
    size: Math.random() * 22 + 14,
    emoji: HEARTS[Math.floor(Math.random() * HEARTS.length)],
    alpha: 1,
    sway: Math.random() * Math.PI * 2,
    swaySpeed: Math.random() * 0.02 + 0.005
  });
}

// Corazones iniciales
for(let i=0;i<22;i++) spawnHeart();

function draw(){
  ctx.clearRect(0,0,W,H);
  for(let i=hearts.length-1;i>=0;i--){
    const h = hearts[i];
    h.x += h.vx + Math.sin(h.sway) * 0.3;
    h.y += h.vy;
    h.sway += h.swaySpeed;
    h.alpha -= 0.003;
    if(h.y < -30 || h.alpha <= 0){
      hearts.splice(i,1);
      continue;
    }
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

// Reponer corazones cuando se van
setInterval(() => {
  if(hearts.length < 15) spawnHeart();
}, 400);

// Clic → burst de corazones
document.addEventListener('click', e => {
  for(let i=0;i<14;i++){
    setTimeout(() => spawnHeart(e.clientX, e.clientY), i*40);
  }
});

// ===== BOTÓN NO QUE HUYE =====
const noBtn = document.getElementById('noBtn');
const yesBtn = document.getElementById('yesBtn');
const buttons = document.getElementById('buttons');
const card = document.getElementById('card');
const message = document.getElementById('message');

let noMoving = false;

function moveNo(){
  if(noMoving) return;
  noMoving = true;

  const rect = card.getBoundingClientRect();
  const cardW = rect.width;
  const cardH = rect.height;

  // Quitar posición absoluta y volver al flujo normal
  noBtn.classList.remove('moving');

  // Buscar posición aleatoria dentro de la tarjeta, evitando el botón Sí
  const yesRect = yesBtn.getBoundingClientRect();
  const yesRelX = yesRect.left - rect.left;
  const yesRelY = yesRect.top - rect.top;

  let attempts = 0;
  while(attempts < 30){
    const newX = Math.random() * (cardW - 140) + 20;
    const newY = Math.random() * (cardH - 80) + 20;

    const dist = Math.hypot(newX - yesRelX, newY - yesRelY);
    if(dist > 150){
      noBtn.style.left = newX + 'px';
      noBtn.style.top = newY + 'px';
      noBtn.classList.add('moving');
      break;
    }
    attempts++;
  }

  setTimeout(() => { noMoving = false; }, 200);
}

noBtn.addEventListener('mouseenter', moveNo);
noBtn.addEventListener('touchstart', e => { e.preventDefault(); moveNo(); }, {passive:false});

// En móvil, que al tocar el No se mueva inmediatamente
noBtn.addEventListener('click', moveNo);

// ===== AL HACER CLIC EN SÍ =====
yesBtn.addEventListener('click', () => {
  // Explosión masiva de corazones celestes
  const rect = card.getBoundingClientRect();
  const cx = rect.left + rect.width / 2;
  const cy = rect.top + rect.height / 2;
  for(let i=0;i<60;i++){
    setTimeout(() => {
      spawnHeart(
        cx + (Math.random()-0.5)*200,
        cy + (Math.random()-0.5)*100
      );
    }, i*25);
  }

  // Ocultar botones, mostrar mensaje
  buttons.style.display = 'none';
  message.style.display = 'block';

  // Scroll suave hacia abajo para ver el mensaje
  setTimeout(() => {
    message.scrollIntoView({behavior:'smooth', block:'center'});
  }, 100);
});

// Botón reintentar (se inyecta dinámicamente)
document.addEventListener('click', e => {
  if(e.target.classList.contains('retry')){
    location.reload();
  }
});