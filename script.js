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

// No huyendo en toda la pantalla
const noBtn = document.getElementById('noBtn');
const yesBtn = document.getElementById('yesBtn');
const questionBox = document.getElementById('questionBox');
const resultBox = document.getElementById('resultBox');

function moveNo(e){
  noBtn.style.position = 'fixed';
  noBtn.style.left = 0; noBtn.style.top = 0;
  const maxX = Math.max(20, W - noBtn.offsetWidth - 20);
  const maxY = Math.max(20, H - noBtn.offsetHeight - 20);
  let x, y;
  do{
    x = Math.random()*maxX;
    y = Math.random()*maxY;
  }while(Math.hypot(x + noBtn.offsetWidth/2 - (e.clientX||W/2), y + noBtn.offsetHeight/2 - (e.clientY||H/2)) < 120);
  noBtn.style.transform = `translate(${x}px, ${y}px)`;
}

noBtn.addEventListener('mouseenter', (e)=>moveNo(e));
noBtn.addEventListener('touchstart', (e)=>{ e.preventDefault(); moveNo({clientX:e.touches[0].clientX, clientY:e.touches[0].clientY}); }, {passive:false});
noBtn.addEventListener('click', (e)=>{ e.preventDefault(); moveNo(e); });

// Sí
yesBtn.addEventListener('click', ()=>{
  const cx = W/2, cy = H/2;
  for(let i=0;i<80;i++){
    setTimeout(()=>spawnHeart(cx + (Math.random()-0.5)*300, cy + (Math.random()-0.5)*200), i*18);
  }
  noBtn.style.display = 'none';
  yesBtn.style.display = 'none';
  questionBox.style.display = 'none';
  setTimeout(()=>{ resultBox.style.display = 'block'; }, 300);
});
