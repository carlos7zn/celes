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
    size: Math.random()*20 + 14,
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

// Lógica del botón No que huye
const noBtn = document.getElementById('noBtn');
const yesBtn = document.getElementById('yesBtn');
const questionBox = document.getElementById('questionBox');
const resultBox = document.getElementById('resultBox');

function moveNo(e){
  // IMPORTANTE: Como la tarjeta central tiene "overflow: hidden", si movemos el botón No
  // fuera de ella usando position: fixed pero sigue siendo su hijo DOM, se recortará y desaparecerá.
  // Para solucionarlo, movemos el botón para que sea hijo directo del body al primer movimiento.
  if(noBtn.parentNode !== document.body){
    document.body.appendChild(noBtn);
  }

  noBtn.style.position = 'fixed';
  noBtn.style.left = '0px';
  noBtn.style.top = '0px';
  noBtn.style.margin = '0';
  noBtn.style.zIndex = '9999'; // Por encima de todo

  const viewW = window.innerWidth;
  const viewH = window.innerHeight;

  const btnW = noBtn.offsetWidth || 100;
  const btnH = noBtn.offsetHeight || 45;

  const maxX = viewW - btnW - 20;
  const maxY = viewH - btnH - 20;

  let x = Math.random() * maxX;
  let y = Math.random() * maxY;

  // Asegurar coordenadas dentro de la pantalla
  x = Math.max(20, Math.min(x, maxX));
  y = Math.max(20, Math.min(y, maxY));

  noBtn.style.transform = `translate(${x}px, ${y}px)`;
}

// Escapa al pasar el ratón por encima (hover)
noBtn.addEventListener('pointerover', (e) => {
  moveNo(e);
});

// Escapa inmediatamente al intentar pulsar con click o toque táctil
noBtn.addEventListener('pointerdown', (e) => {
  e.preventDefault();
  moveNo(e);
});

// Evitar cualquier comportamiento por defecto de click
noBtn.addEventListener('click', (e) => {
  e.preventDefault();
  moveNo(e);
});

// Al pulsar SÍ
yesBtn.addEventListener('click', ()=>{
  const cx = window.innerWidth/2, cy = window.innerHeight/2;
  for(let i=0;i<80;i++){
    setTimeout(()=>spawnHeart(cx + (Math.random()-0.5)*300, cy + (Math.random()-0.5)*200), i*18);
  }
  noBtn.style.display = 'none';
  yesBtn.style.display = 'none';
  questionBox.style.display = 'none';
  setTimeout(()=>{ resultBox.style.display = 'block'; }, 300);
});
