document.addEventListener('DOMContentLoaded', () => {
  // === CANVAS CORAZONES FLOTANTES ===
  const canvas = document.getElementById('hearts');
  const ctx = canvas.getContext('2d');
  let hearts = [];
  let W, H;
  function resize(){ W = canvas.width = innerWidth; H = canvas.height = innerHeight; }
  window.addEventListener('resize', resize); resize();
  
  function spawnHeart(x,y){ hearts.push({x:x??Math.random()*W, y:y??Math.random()*H+H*0.3, vx:(Math.random()-0.5)*0.5, vy:-Math.random()*0.9-0.4, size:Math.random()*18+14, emoji:['💙','💖','🩵','✨','⭐'][Math.floor(Math.random()*5)], alpha:1, sway:Math.random()*Math.PI*2, swaySpeed:Math.random()*0.02+0.005}); }
  for(let i=0;i<20;i++) spawnHeart();
  function draw(){ ctx.clearRect(0,0,W,H); for(let i=hearts.length-1;i>=0;i--){ const h=hearts[i]; h.x+=h.vx+Math.sin(h.sway)*0.25; h.y+=h.vy; h.sway+=h.swaySpeed; h.alpha-=0.002; if(h.y<-30||h.alpha<=0){hearts.splice(i,1);continue;} ctx.globalAlpha=Math.max(0,h.alpha); ctx.font=`${h.size}px serif`; ctx.textAlign='center'; ctx.textBaseline='middle'; ctx.fillText(h.emoji,h.x,h.y);} ctx.globalAlpha=1; requestAnimationFrame(draw);} draw();
  setInterval(()=>{ if(hearts.length<18) spawnHeart(); },400);

  // === AUDIO SINTETIZADO ===
  let audioCtx=null; function initAudio(){ if(!audioCtx) audioCtx=new (window.AudioContext||window.webkitAudioContext)(); }
  function playBiu(){ try{ initAudio(); if(audioCtx.state==='suspended') audioCtx.resume(); const o=audioCtx.createOscillator(),g=audioCtx.createGain(); o.connect(g); g.connect(audioCtx.destination); o.type='triangle'; o.frequency.setValueAtTime(350,audioCtx.currentTime); o.frequency.exponentialRampToValueAtTime(750,audioCtx.currentTime+0.12); g.gain.setValueAtTime(0.12,audioCtx.currentTime); g.gain.exponentialRampToValueAtTime(0.01,audioCtx.currentTime+0.12); o.start(); o.stop(audioCtx.currentTime+0.12);}catch(e){} }
  function playChime(){ try{ initAudio(); if(audioCtx.state==='suspended') audioCtx.resume(); const now=audioCtx.currentTime; [523.25,659.25,783.99,1046.50].forEach((f,i)=>{ const o=audioCtx.createOscillator(),g=audioCtx.createGain(); o.connect(g); g.connect(audioCtx.destination); o.type='sine'; o.frequency.setValueAtTime(f,now+i*0.08); g.gain.setValueAtTime(0,now+i*0.08); g.gain.linearRampToValueAtTime(0.10,now+i*0.08+0.02); g.gain.exponentialRampToValueAtTime(0.01,now+i*0.08+0.35); o.start(now+i*0.08); o.stop(now+i*0.08+0.4);}); }catch(e){} }

  // === ESTELA DEL CURSOR ===
  document.addEventListener('pointermove', e=>{ if(Math.random()>0.45) return; const count = Math.random() > 0.7 ? 2 : 1; for(let i=0;i<count;i++){ const s=document.createElement('div'); s.className='trail-sparkle'; s.textContent=['✨','⭐','🩵','🤍','🫧'][Math.floor(Math.random()*5)]; const offsetX = (Math.random()-0.5)*8; const offsetY = (Math.random()-0.5)*8; s.style.left=`${e.clientX + offsetX}px`; s.style.top=`${e.clientY + offsetY}px`; const dx=(Math.random()-0.5)*60, dy=-Math.random()*60-20; s.style.setProperty('--dx',`${dx}px`); s.style.setProperty('--dy',`${dy}px`); document.body.appendChild(s); setTimeout(()=>s.remove(),800);} });

  const noBtn = document.getElementById('noBtn');
  const yesBtn = document.getElementById('yesBtn');
  const questionBox = document.getElementById('questionBox');
  const resultBox = document.getElementById('resultBox');

  let isMoving = false, lastX = null, lastY = null;
  let initialized = false;

  // LÓGICA DE MOVIMIENTO SIN ERRORES Y PERFECTA
  function moveNo(e){
    if (isMoving) return;
    isMoving = true;

    initAudio(); 
    playBiu();

    // El primer movimiento saca el botón al body sin ningún salto visual
    if (!initialized) {
      // 1. Obtener la posición visual exacta real que tiene el botón dentro de la tarjeta
      const r = noBtn.getBoundingClientRect();

      // 2. Extraer del parent y pasarlo al body para que no lo recorte el overflow:hidden
      document.body.appendChild(noBtn);

      // 3. Fijar propiedades de fixed SIN transición para que no vuele a la esquina
      noBtn.style.position = 'fixed';
      noBtn.style.left = '0px';
      noBtn.style.top = '0px';
      noBtn.style.margin = '0';
      noBtn.style.zIndex = '9999';
      noBtn.style.setProperty('transition', 'none', 'important');
      
      // Lo clavamos exactamente en las mismas coordenadas donde estaba renderizado
      noBtn.style.transform = `translate(${r.left}px, ${r.top}px)`;

      // 4. Forzar layout sincrónico del navegador para asegurar la posición sin animar
      void noBtn.offsetWidth;

      // 5. Reactivar la transición de transform para el movimiento real posterior
      noBtn.style.setProperty('transition', 'transform 0.48s cubic-bezier(0.34, 1.56, 0.64, 1)', 'important');
      initialized = true;
    }

    // Calcular las nuevas coordenadas aleatorias dentro de la pantalla
    const bw = noBtn.offsetWidth, bh = noBtn.offsetHeight;
    const maxX = innerWidth - bw - 20;
    const maxY = innerHeight - bh - 20;
    let x, y;
    let attempts = 0;
    do { 
      x = Math.max(20, Math.min(Math.random()*maxX, maxX)); 
      y = Math.max(20, Math.min(Math.random()*maxY, maxY)); 
      attempts++;
    } while(lastX !== null && Math.abs(x-lastX) < 150 && Math.abs(y-lastY) < 150 && attempts < 15);

    lastX = x; lastY = y;

    // Ejecutar el movimiento en el siguiente ciclo con la animación activa
    requestAnimationFrame(() => {
      noBtn.style.transform = `translate(${x}px, ${y}px)`;
      setTimeout(() => { isMoving = false; }, 480);
    });
  }

  // Escuchadores de eventos para esquivar
  noBtn.addEventListener('pointerover', moveNo);
  noBtn.addEventListener('pointerdown', e => { e.preventDefault(); moveNo(); });
  noBtn.addEventListener('click', e => { e.preventDefault(); moveNo(); });

  // Evento al pulsar SÍ
  yesBtn.addEventListener('click', () => {
    playChime();
    const cx = innerWidth/2, cy = innerHeight/2;
    for(let i=0;i<85;i++) setTimeout(()=>spawnHeart(cx+(Math.random()-0.5)*300, cy+(Math.random()-0.5)*200), i*16);
    noBtn.style.display = 'none'; yesBtn.style.display = 'none'; questionBox.style.display = 'none';
    setTimeout(()=>{ resultBox.style.display = 'block'; }, 300);
  });
});

// === CARTAS INTERACTIVAS ===
document.querySelectorAll('.letter-card').forEach(card => {
  card.addEventListener('click', () => {
    const letterNum = card.getAttribute('data-letter');
    const modal = document.getElementById('modal' + letterNum);
    if (modal) {
      modal.classList.add('open');
    }
  });
});

// Cerrar modales al hacer click en la X
document.querySelectorAll('.close-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    btn.closest('.letter-modal').classList.remove('open');
  });
});

// Cerrar modal al hacer click fuera del papel
document.querySelectorAll('.letter-modal').forEach(modal => {
  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      modal.classList.remove('open');
    }
  });
});
