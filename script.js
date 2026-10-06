document.addEventListener('DOMContentLoaded', () => {
  // === CANVAS CORAZÓN LATIENTE (estilo referencia celes.vercel.app) ===
  const heartCanvas = document.getElementById('heart-canvas');
  if (heartCanvas) {
    const hctx = heartCanvas.getContext('2d');
    let hWidth, hHeight;
    
    function resizeHeart() {
      hWidth = heartCanvas.width = innerWidth;
      hHeight = heartCanvas.height = innerHeight;
    }
    window.addEventListener('resize', resizeHeart);
    resizeHeart();
    
    const isMobile = /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(navigator.userAgent.toLowerCase());
    const koef = isMobile ? 0.5 : 1;
    
    const heartPosition = (rad) => {
      return [
        Math.pow(Math.sin(rad), 3),
        -(15 * Math.cos(rad) - 5 * Math.cos(2 * rad) - 2 * Math.cos(3 * rad) - Math.cos(4 * rad))
      ];
    };
    
    const scaleAndTranslate = (pos, sx, sy, dx, dy) => {
      return [dx + pos[0] * sx, dy + pos[1] * sy];
    };
    
    const rand = Math.random;
    const traceCount = isMobile ? 20 : 50;
    const dr = isMobile ? 0.3 : 0.1;
    
    const pointsOrigin = [];
    for (let i = 0; i < Math.PI * 2; i += dr) {
      pointsOrigin.push(scaleAndTranslate(heartPosition(i), 210 * koef, 13 * koef, 0, 0));
    }
    for (let i = 0; i < Math.PI * 2; i += dr) {
      pointsOrigin.push(scaleAndTranslate(heartPosition(i), 150 * koef, 9 * koef, 0, 0));
    }
    for (let i = 0; i < Math.PI * 2; i += dr) {
      pointsOrigin.push(scaleAndTranslate(heartPosition(i), 90 * koef, 5 * koef, 0, 0));
    }
    const heartPointsCount = pointsOrigin.length;
    
    const targetPoints = [];
    const pulse = (kx, ky) => {
      for (let i = 0; i < pointsOrigin.length; i++) {
        targetPoints[i] = [];
        targetPoints[i][0] = kx * pointsOrigin[i][0] + hWidth / 2;
        targetPoints[i][1] = ky * pointsOrigin[i][1] + hHeight / 2;
      }
    };
    
    const e = [];
    const traceCountVal = isMobile ? 20 : 50;
    
    for (let i = 0; i < pointsOrigin.length; i++) {
      const x = Math.random() * innerWidth;
      const y = Math.random() * innerHeight;
      e[i] = {
        vx: 0,
        vy: 0,
        R: 2,
        speed: Math.random() + 5,
        q: ~~(Math.random() * pointsOrigin.length),
        D: 2 * (i % 2) - 1,
        force: 0.2 * Math.random() + 0.7,
        f: 'hsla(0,' + ~~(40 * Math.random() + 60) + '%,' + ~~(60 * Math.random() + 20) + '%,.3)',
        trace: []
      };
      for (let k = 0; k < traceCountVal; k++) {
        e[i].trace[k] = { x: Math.random() * innerWidth, y: Math.random() * innerHeight };
      }
    }
    
    const config = {
      traceK: 0.4,
      timeDelta: 0.01
    };
    
    let time = 0;
    
    function heartLoop() {
      const n = -Math.cos(time);
      pulse((1 + n) * 0.5, (1 + n) * 0.5);
      time += ((Math.sin(time)) < 0 ? 9 : (n > 0.8) ? 0.2 : 1) * 0.01;
      
      hctx.fillStyle = 'rgba(0,0,0,.1)';
      hctx.fillRect(0, 0, heartCanvas.width, heartCanvas.height);
      
      for (let i = e.length; i--;) {
        const u = e[i];
        const q = targetPoints[u.q];
        const dx = u.trace[0].x - q[0];
        const dy = u.trace[0].y - q[1];
        const length = Math.sqrt(dx * dx + dy * dy);
        
        if (10 > length) {
          if (0.95 < Math.random()) {
            u.q = ~~(Math.random() * pointsOrigin.length);
          } else {
            if (0.99 < Math.random()) {
              u.D *= -1;
            }
            u.q += u.D;
            u.q %= pointsOrigin.length;
            if (u.q < 0) u.q += pointsOrigin.length;
          }
        }
        
        u.vx += -dx / length * u.speed;
        u.vy += -dy / length * u.speed;
        u.trace[0].x += u.vx;
        u.trace[0].y += u.vy;
        u.vx *= u.force;
        u.vy *= u.force;
        
        for (let k = 0; k < u.trace.length - 1;) {
          const T = u.trace[k];
          const N = u.trace[++k];
          N.x -= config.traceK * (N.x - T.x);
          N.y -= config.traceK * (N.y - T.y);
        }
        
        hctx.fillStyle = u.f;
        for (let k = 0; k < u.trace.length; k++) {
          hctx.fillRect(u.trace[k].x, u.trace[k].y, 1, 1);
        }
      }
      
      requestAnimationFrame(heartLoop);
    }
    
    // Start heart animation
    heartLoop();
    
    // Handle resize
    window.addEventListener('resize', () => {
      const hc = document.getElementById('heart-canvas');
      if (hc) {
        hc.width = innerWidth;
        hc.height = innerHeight;
      }
    });
  }
  

  // === initHeartAnimation reutilizable para cualquier canvas ===
  function initHeartAnimation(canvasId) {
    const canvas = document.getElementById(canvasId);
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    
    let width = canvas.width = innerWidth;
    let height = canvas.height = innerHeight;
    
    const isMobile = /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(navigator.userAgent.toLowerCase());
    const koef = isMobile ? 0.5 : 1;
    
    const heartPosition = (rad) => {
      return [
        Math.pow(Math.sin(rad), 3),
        -(15 * Math.cos(rad) - 5 * Math.cos(2 * rad) - 2 * Math.cos(3 * rad) - Math.cos(4 * rad))
      ];
    };
    
    const scaleAndTranslate = (pos, sx, sy, dx, dy) => {
      return [dx + pos[0] * sx, dy + pos[1] * sy];
    };
    
    const rand = Math.random;
    const traceCount = isMobile ? 20 : 50;
    const dr = isMobile ? 0.3 : 0.1;
    
    const pointsOrigin = [];
    for (let i = 0; i < Math.PI * 2; i += dr) {
      pointsOrigin.push(scaleAndTranslate(heartPosition(i), 210 * koef, 13 * koef, 0, 0));
    }
    for (let i = 0; i < Math.PI * 2; i += dr) {
      pointsOrigin.push(scaleAndTranslate(heartPosition(i), 150 * koef, 9 * koef, 0, 0));
    }
    for (let i = 0; i < Math.PI * 2; i += dr) {
      pointsOrigin.push(scaleAndTranslate(heartPosition(i), 90 * koef, 5 * koef, 0, 0));
    }
    const heartPointsCount = pointsOrigin.length;
    
    const targetPoints = [];
    const pulse = (kx, ky) => {
      for (let i = 0; i < pointsOrigin.length; i++) {
        targetPoints[i] = [];
        targetPoints[i][0] = kx * pointsOrigin[i][0] + width / 2;
        targetPoints[i][1] = ky * pointsOrigin[i][1] + height / 2;
      }
    };
    
    const e = [];
    const traceCountVal = isMobile ? 20 : 50;
    
    for (let i = 0; i < pointsOrigin.length; i++) {
      const x = Math.random() * innerWidth;
      const y = Math.random() * innerHeight;
      e[i] = {
        vx: 0,
        vy: 0,
        R: 2,
        speed: Math.random() + 5,
        q: ~~(Math.random() * pointsOrigin.length),
        D: 2 * (i % 2) - 1,
        force: 0.2 * Math.random() + 0.7,
        f: 'hsla(0,' + ~~(40 * Math.random() + 60) + '%,' + ~~(60 * Math.random() + 20) + '%,.3)',
        trace: []
      };
      for (let k = 0; k < traceCountVal; k++) {
        e[i].trace[k] = { x: Math.random() * innerWidth, y: Math.random() * innerHeight };
      }
    }
    
    const config = {
      traceK: 0.4,
      timeDelta: 0.01
    };
    
    let time = 0;
    
    function heartLoop() {
      const n = -Math.cos(time);
      pulse((1 + n) * 0.5, (1 + n) * 0.5);
      time += ((Math.sin(time)) < 0 ? 9 : (n > 0.8) ? 0.2 : 1) * 0.01;
      
      ctx.fillStyle = 'rgba(0,0,0,.1)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      for (let i = e.length; i--;) {
        const u = e[i];
        const q = targetPoints[u.q];
        const dx = u.trace[0].x - q[0];
        const dy = u.trace[0].y - q[1];
        const length = Math.sqrt(dx * dx + dy * dy);
        
        if (10 > length) {
          if (0.95 < Math.random()) {
            u.q = ~~(Math.random() * pointsOrigin.length);
          } else {
            if (0.99 < Math.random()) {
              u.D *= -1;
            }
            u.q += u.D;
            u.q %= pointsOrigin.length;
            if (u.q < 0) u.q += pointsOrigin.length;
          }
        }
        
        u.vx += -dx / length * u.speed;
        u.vy += -dy / length * u.speed;
        u.trace[0].x += u.vx;
        u.trace[0].y += u.vy;
        u.vx *= u.force;
        u.vy *= u.force;
        
        for (let k = 0; k < u.trace.length - 1;) {
          const T = u.trace[k];
          const N = u.trace[++k];
          N.x -= config.traceK * (N.x - T.x);
          N.y -= config.traceK * (N.y - T.y);
        }
        
        ctx.fillStyle = u.f;
        for (let k = 0; k < u.trace.length; k++) {
          ctx.fillRect(u.trace[k].x, u.trace[k].y, 1, 1);
        }
      }
      
      requestAnimationFrame(heartLoop);
    }
    
    heartLoop();
    
    // Handle resize
    window.addEventListener('resize', () => {
      canvas.width = innerWidth;
      canvas.height = innerHeight;
    });
  }

  // === CANVAS CORAZONES FLOTANTES ===
  // === CANVAS CORAZONES FLOTANTES ===

  // === AUDIO SINTETIZADO ===
  let audioCtx=null; 
  function initAudio(){ if(!audioCtx) audioCtx=new (window.AudioContext||window.webkitAudioContext)(); }
  
  // Sonido "biu" - para botón No huyendo
  function playBiu(){ try{ initAudio(); if(audioCtx.state==='suspended') audioCtx.resume(); const o=audioCtx.createOscillator(),g=audioCtx.createGain(); o.connect(g); g.connect(audioCtx.destination); o.type='triangle'; o.frequency.setValueAtTime(350,audioCtx.currentTime); o.frequency.exponentialRampToValueAtTime(750,audioCtx.currentTime+0.12); g.gain.setValueAtTime(0.12,audioCtx.currentTime); g.gain.exponentialRampToValueAtTime(0.01,audioCtx.currentTime+0.12); o.start(); o.stop(audioCtx.currentTime+0.12);}catch(e){} }
  
  // Sonido "chime" - para botón Sí (acordes mayores)
  function playChime(){ try{ initAudio(); if(audioCtx.state==='suspended') audioCtx.resume(); const now=audioCtx.currentTime; [523.25,659.25,783.99,1046.50].forEach((f,i)=>{ const o=audioCtx.createOscillator(),g=audioCtx.createGain(); o.connect(g); g.connect(audioCtx.destination); o.type='sine'; o.frequency.setValueAtTime(f,now+i*0.08); g.gain.setValueAtTime(0,now+i*0.08); g.gain.linearRampToValueAtTime(0.10,now+i*0.08+0.02); g.gain.exponentialRampToValueAtTime(0.01,now+i*0.08+0.35); o.start(now+i*0.08); o.stop(now+i*0.08+0.4);}); }catch(e){} }
  
  // Click suave - para botones genéricos
  function playClick(){ try{ initAudio(); if(audioCtx.state==='suspended') audioCtx.resume(); const o=audioCtx.createOscillator(),g=audioCtx.createGain(); o.connect(g); g.connect(audioCtx.destination); o.type='sine'; o.frequency.setValueAtTime(800,audioCtx.currentTime); o.frequency.exponentialRampToValueAtTime(400,audioCtx.currentTime+0.08); g.gain.setValueAtTime(0.08,audioCtx.currentTime); g.gain.exponentialRampToValueAtTime(0.001,audioCtx.currentTime+0.08); o.start(); o.stop(audioCtx.currentTime+0.08);}catch(e){} }
  
  // Hover suave - al pasar ratón
  function playHover(){ try{ initAudio(); if(audioCtx.state==='suspended') audioCtx.resume(); const o=audioCtx.createOscillator(),g=audioCtx.createGain(); o.connect(g); g.connect(audioCtx.destination); o.type='sine'; o.frequency.setValueAtTime(1200,audioCtx.currentTime); o.frequency.exponentialRampToValueAtTime(1500,audioCtx.currentTime+0.04); g.gain.setValueAtTime(0.04,audioCtx.currentTime); g.gain.exponentialRampToValueAtTime(0.001,audioCtx.currentTime+0.04); o.start(); o.stop(audioCtx.currentTime+0.04);}catch(e){} }
  
  // Pop mágico - para abrir modales/cartas
  function playPop(){ try{ initAudio(); if(audioCtx.state==='suspended') audioCtx.resume(); const now=audioCtx.currentTime; [659.25, 880, 1046.50].forEach((f,i)=>{ const o=audioCtx.createOscillator(),g=audioCtx.createGain(); o.connect(g); g.connect(audioCtx.destination); o.type='sine'; o.frequency.setValueAtTime(f,now+i*0.03); g.gain.setValueAtTime(0.06,audioCtx.currentTime); g.gain.exponentialRampToValueAtTime(0.001,now+i*0.03+0.15); o.start(now+i*0.03); o.stop(now+i*0.03+0.2);}); }catch(e){} }
  
  // Close suave - para cerrar modales
  function playClose(){ try{ initAudio(); if(audioCtx.state==='suspended') audioCtx.resume(); const o=audioCtx.createOscillator(),g=audioCtx.createGain(); o.connect(g); g.connect(audioCtx.destination); o.type='sine'; o.frequency.setValueAtTime(600,audioCtx.currentTime); o.frequency.exponentialRampToValueAtTime(200,audioCtx.currentTime+0.12); g.gain.setValueAtTime(0.06,audioCtx.currentTime); g.gain.exponentialRampToValueAtTime(0.001,audioCtx.currentTime+0.12); o.start(); o.stop(audioCtx.currentTime+0.12);}catch(e){} }
  
  // Sparkle - para estela del cursor (muy sutil)
  function playSparkle(){ try{ initAudio(); if(audioCtx.state==='suspended') audioCtx.resume(); const o=audioCtx.createOscillator(),g=audioCtx.createGain(); o.connect(g); g.connect(audioCtx.destination); o.type='sine'; o.frequency.setValueAtTime(2000,audioCtx.currentTime); o.frequency.exponentialRampToValueAtTime(3000,audioCtx.currentTime+0.03); g.gain.setValueAtTime(0.02,audioCtx.currentTime); g.gain.exponentialRampToValueAtTime(0.001,audioCtx.currentTime+0.03); o.start(); o.stop(audioCtx.currentTime+0.03);}catch(e){} }
  
  // Corazón - para explosión de corazones
  function playHeart(){ try{ initAudio(); if(audioCtx.state==='suspended') audioCtx.resume(); const now=audioCtx.currentTime; [523.25, 659.25, 783.99].forEach((f,i)=>{ const o=audioCtx.createOscillator(),g=audioCtx.createGain(); o.connect(g); g.connect(audioCtx.destination); o.type='triangle'; o.frequency.setValueAtTime(f,now+i*0.05); g.gain.setValueAtTime(0.05,audioCtx.currentTime); g.gain.exponentialRampToValueAtTime(0.001,now+i*0.05+0.2); o.start(now+i*0.05); o.stop(now+i*0.05+0.25);}); }catch(e){} }
  
  // Whoosh - para movimiento rápido del botón No
  function playWhoosh(){ try{ initAudio(); if(audioCtx.state==='suspended') audioCtx.resume(); const o=audioCtx.createOscillator(),g=audioCtx.createGain(); o.connect(g); g.connect(audioCtx.destination); o.type='sawtooth'; o.frequency.setValueAtTime(400,audioCtx.currentTime); o.frequency.exponentialRampToValueAtTime(100,audioCtx.currentTime+0.08); g.gain.setValueAtTime(0.08,audioCtx.currentTime); g.gain.exponentialRampToValueAtTime(0.001,audioCtx.currentTime+0.08); o.start(); o.stop(audioCtx.currentTime+0.08);}catch(e){} }

  // === ESTELA DEL CURSOR ===
    document.addEventListener('pointermove', e=>{ if(Math.random()>0.45) return; const count = Math.random() > 0.7 ? 2 : 1; for(let i=0;i<count;i++){ const s=document.createElement('div'); s.className='trail-sparkle'; s.textContent=['✨','⭐','🩵','🤍','🫧'][Math.floor(Math.random()*5)]; const offsetX = (Math.random()-0.5)*8; const offsetY = (Math.random()-0.5)*8; s.style.left=`${e.clientX + offsetX}px`; s.style.top=`${e.clientY + offsetY}px`; const dx=(Math.random()-0.5)*60, dy=-Math.random()*60-20; s.style.setProperty('--dx',`${dx}px`); s.style.setProperty('--dy',`${dy}px`); document.body.appendChild(s); setTimeout(()=>s.remove(),800);} 
      // Sonido sparkle muy sutil (solo 10% de las veces para no saturar)
      if (Math.random() < 0.1) playSparkle();
    });

    // === PARALLAX EN BLURS DE FONDO ===
    const bgBlobs = document.querySelector('body::before') || document.body;
    // Usamos una variable CSS para el parallax suave
    let mouseX = 0, mouseY = 0;
    let currentX = 0, currentY = 0;
  
    document.addEventListener('mousemove', (e) => {
      mouseX = (e.clientX / innerWidth - 0.5) * 2;
      mouseY = (e.clientY / innerHeight - 0.5) * 2;
    });
  
    function animateParallax() {
      // Suavizado con lerp
      currentX += (mouseX - currentX) * 0.05;
      currentY += (mouseY - currentY) * 0.05;
    
      // Aplicamos transform al body::before mediante variable CSS
      document.documentElement.style.setProperty('--parallax-x', `${currentX * 15}px`);
      document.documentElement.style.setProperty('--parallax-y', `${currentY * 15}px`);
    
      requestAnimationFrame(animateParallax);
    }
    animateParallax();

    // === PARTÍCULAS DE LUZ QUE SIGUEN AL CURSOR ===
    const lightParticles = [];
    const maxLightParticles = 8;
  
    function createLightParticle(x, y) {
      const p = document.createElement('div');
      p.className = 'light-particle';
      const size = Math.random() * 6 + 4;
      p.style.width = `${size}px`;
      p.style.height = `${size}px`;
      p.style.left = `${x}px`;
      p.style.top = `${y}px`;
      // Colores suaves celeste/rosa
      const hue = Math.random() > 0.5 ? 180 : 340; // celeste o rosa
      p.style.background = `hsla(${hue}, 80%, 70%, 0.6)`;
      p.style.boxShadow = `0 0 ${size * 3}px hsla(${hue}, 80%, 70%, 0.8)`;
      document.body.appendChild(p);
    
      return {
        el: p,
        x, y,
        targetX: x,
        targetY: y,
        vx: 0, vy: 0,
        life: 1,
        decay: 0.008 + Math.random() * 0.005
      };
    }
  
    function animateLightParticles() {
      const now = performance.now();
    
      // Crear nueva partícula ocasionalmente
      if (lightParticles.length < maxLightParticles && Math.random() < 0.15) {
        lightParticles.push(createLightParticle(mouseX * innerWidth / 2 + innerWidth / 2, mouseY * innerHeight / 2 + innerHeight / 2));
      }
    
      for (let i = lightParticles.length - 1; i >= 0; i--) {
        const p = lightParticles[i];
      
        // Suavizado hacia el ratón
        const dx = p.targetX - p.x;
        const dy = p.targetY - p.y;
        p.vx += dx * 0.08;
        p.vy += dy * 0.08;
        p.vx *= 0.92;
        p.vy *= 0.92;
        p.x += p.vx;
        p.y += p.vy;
      
        // Actualizar target hacia posición actual del ratón
        p.targetX = mouseX * innerWidth / 2 + innerWidth / 2;
        p.targetY = mouseY * innerHeight / 2 + innerHeight / 2;
      
        // Decay
        p.life -= p.decay;
      
        // Aplicar estilos
        p.el.style.transform = `translate(${p.x}px, ${p.y}px) scale(${p.life})`;
        p.el.style.opacity = p.life * 0.6;
      
        if (p.life <= 0) {
          p.el.remove();
          lightParticles.splice(i, 1);
        }
      }
    
      requestAnimationFrame(animateLightParticles);
    }
    animateLightParticles();

  const noBtn = document.getElementById('noBtn');
  const yesBtn = document.getElementById('yesBtn');
  const questionBox = document.getElementById('questionBox');
  const resultBox = document.getElementById('resultBox');

  let isMoving = false, lastX = null, lastY = null;
  let initialized = false;
  let noClickCount = 0;

  const noTexts = [
    'Nop 🫣',
    '¿Seguro? 🥺',
    'Vale, te lo digo yo: eres la mejor 💙',
    'No me hagas repetirlo ✨',
    'ERES LA MEJOR, PUNTO 💖',
    '¿Cuántas veces te lo digo? 🌟',
    'Te niegas a verlo 🥲',
    'Es un hecho, acéptalo 💫',
    'LA MEJOR. PUNTO. 🌸',
    'Me estoy enfadando... 💕',
    '¡QUE ERES LA MEJOR! 💗',
    'No hay debate posible 💖',
    'TE LO GRITO: ERES LA MEJOR 💙',
    'ERES LA MEJOR Y YA, CELES 💖'
  ];

  // LÓGICA DE MOVIMIENTO SIN ERRORES Y PERFECTA
    function moveNo(e){
      if (isMoving) return;
      isMoving = true;

      // Cambiar texto del botón No para convencer
      noClickCount++;
      const textIndex = Math.min(noClickCount, noTexts.length - 1);
      if (noBtn && noTexts[textIndex]) {
        noBtn.textContent = noTexts[textIndex];
      }

      initAudio(); 
      playBiu();
      playWhoosh();

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
    noBtn.addEventListener('pointerover', (e) => { playHover(); moveNo(e); });
    noBtn.addEventListener('pointerdown', e => { e.preventDefault(); playClick(); moveNo(e); });
    noBtn.addEventListener('click', e => { e.preventDefault(); playClick(); moveNo(e); });

    // Evento al pulsar SÍ
      yesBtn.addEventListener('click', () => {
        playClick();
        playChime();
        playHeart();
        const cx = innerWidth/2, cy = innerHeight/2;
        for(let i=0;i<85;i++) setTimeout(()=>spawnHeart(cx+(Math.random()-0.5)*300, cy+(Math.random()-0.5)*200), i*16);
        noBtn.style.display = 'none'; yesBtn.style.display = 'none'; questionBox.style.display = 'none';
        setTimeout(()=>{ resultBox.style.display = 'block'; }, 300);
      });
  
      // Hover en botón Sí
      yesBtn.addEventListener('mouseenter', () => playHover());
  
      // Hover en cartas
      document.querySelectorAll('.letter-card').forEach(card => {
        card.addEventListener('mouseenter', () => playHover());
      });

    // === CARTAS INTERACTIVAS (dentro de DOMContentLoaded) ===
    document.querySelectorAll('.letter-card').forEach(card => {
      card.addEventListener('click', () => {
        playPop();
        const letterNum = card.getAttribute('data-letter');
        const modal = document.getElementById('modal' + letterNum);
        if (modal) {
          modal.classList.add('open'); if (window.runTypewriter) window.runTypewriter(letterNum);
        }
      });
    });

    // Cerrar modales al hacer click en la X
    document.querySelectorAll('.close-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        playClose();
        btn.closest('.letter-modal').classList.remove('open');
      });
    });

    // Cerrar modal al hacer click fuera del papel
        document.querySelectorAll('.letter-modal').forEach(modal => {
          modal.addEventListener('click', (e) => {
            if (e.target === modal) {
              playClose();
              modal.classList.remove('open');
            }
          });
        });

        // === DESBLOQUEO PROGRESIVO: 4º MENSAJE AL ABRIR LAS 3 CARTAS ===
        const openedLetters = new Set();
        const totalLetters = 3;
    
        function checkAllLettersOpened() {
          if (openedLetters.size === totalLetters) {
            // Todas abiertas - mostrar mensaje especial
            setTimeout(() => {
              showSecretMessage(); if (window.launchConfetti) window.launchConfetti();
            }, 800);
          }
        }
    
        function showSecretMessage() {
          // Crear botón con flecha en la esquina
          const arrowBtn = document.createElement('button');
          arrowBtn.id = 'secret-arrow-btn';
          arrowBtn.innerHTML = '→';
          arrowBtn.style.cssText = `
            position: fixed;
            bottom: 30px;
            right: 30px;
            width: 60px;
            height: 60px;
            border-radius: 50%;
            border: none;
            background: linear-gradient(135deg, #ff4081, #c2185b);
            color: white;
            font-size: 28px;
            font-weight: bold;
            cursor: pointer;
            box-shadow: 0 8px 30px rgba(255, 64, 129, 0.4);
            z-index: 15000;
            transition: transform 0.3s, box-shadow 0.3s;
            animation: pulseBtn 2s ease-in-out infinite;
          `;
          
          // Add pulse animation
          const style = document.createElement('style');
          style.textContent = `
            @keyframes pulseBtn {
              0%, 100% { transform: scale(1); box-shadow: 0 8px 30px rgba(255, 64, 129, 0.4); }
              50% { transform: scale(1.1); box-shadow: 0 12px 40px rgba(255, 64, 129, 0.6); }
            }
          `;
          document.head.appendChild(style);
          
          document.body.appendChild(arrowBtn);
          
          // Hover effect
          arrowBtn.addEventListener('mouseenter', () => {
            arrowBtn.style.transform = 'scale(1.15)';
            arrowBtn.style.boxShadow = '0 12px 40px rgba(255, 64, 129, 0.6)';
          });
          arrowBtn.addEventListener('mouseleave', () => {
            arrowBtn.style.transform = 'scale(1)';
            arrowBtn.style.boxShadow = '0 8px 30px rgba(255, 64, 129, 0.4)';
          });
          
          // Click handler - show heart animation
          arrowBtn.addEventListener('click', () => {
            playChime();
            setTimeout(() => playHeart(), 100);
            
            // Remove arrow button
            arrowBtn.remove();
            
            // Show heart animation canvas
            showHeartAnimation();
          });
          
          // Play sound
          playChime();
        }
        
        function showHeartAnimation() {
          // Create overlay with heart canvas
          const overlay = document.createElement('div');
          overlay.className = 'heart-animation-overlay';
          overlay.style.cssText = `
            position: fixed;
            inset: 0;
            background: rgba(0, 0, 0, 0.85);
            z-index: 20000;
            display: flex;
            align-items: center;
            justify-content: center;
            opacity: 0;
            transition: opacity 0.5s ease;
          `;
          
          overlay.innerHTML = `
            <canvas id="heart-final-canvas" style="max-width: 90vw; max-height: 90vh;"></canvas>
            <div class="heart-final-text" style="
              position: fixed;
              bottom: 100px;
              left: 50%;
              transform: translateX(-50%);
              color: #ff4081;
              font-size: clamp(24px, 5vw, 40px);
              font-family: 'Poppins', sans-serif;
              font-weight: 900;
              text-shadow: 2px 2px 4px rgba(0,0,0,0.3);
              z-index: 20001;
              opacity: 0;
              transition: opacity 0.5s ease 0.5s;
            ">Te adoro, Celes 🩵</div>
            <button class="close-heart-btn" style="
              position: fixed;
              bottom: 30px;
              left: 50%;
              transform: translateX(-50%);
              padding: 12px 30px;
              background: linear-gradient(135deg, #ff4081, #c2185b);
              color: white;
              border: none;
              border-radius: 50px;
              font-family: 'Poppins', sans-serif;
              font-weight: 900;
              font-size: 16px;
              cursor: pointer;
              z-index: 20001;
              opacity: 0;
              transition: opacity 0.5s ease 1s;
            ">Cerrar</button>
          `;
          
          document.body.appendChild(overlay);
          
          // Animate in
          requestAnimationFrame(() => {
            overlay.style.opacity = '1';
            setTimeout(() => {
              const text = overlay.querySelector('.heart-final-text');
              const btn = overlay.querySelector('.close-heart-btn');
              if (text) text.style.opacity = '1';
              if (btn) btn.style.opacity = '1';
            }, 500);
          });
          
          // Start heart animation on the new canvas
          initHeartAnimation('heart-final-canvas');
          
          // Play sound
          playChime();
          setTimeout(() => playHeart(), 200);
          
          // Close handler
          const closeHeartAnim = () => {
            playClose();
            overlay.style.opacity = '0';
            setTimeout(() => overlay.remove(), 500);
          };
          
          overlay.querySelector('.close-heart-btn').addEventListener('click', closeHeartAnim);
          overlay.addEventListener('click', (e) => {
            if (e.target === overlay) closeHeartAnim();
          });
        }
    
        // Modificar apertura de cartas para trackear
        const originalOpenLetter = document.querySelectorAll('.letter-card').forEach(card => {
          // Los event listeners ya están añadidos arriba, necesitamos modificarlos
        });
    
        // Reemplazar los listeners de click de las cartas para trackear
        document.querySelectorAll('.letter-card').forEach(card => {
          // Remover listener anterior (clonando el nodo)
          const newCard = card.cloneNode(true);
          card.parentNode.replaceChild(newCard, card);
      
          newCard.addEventListener('click', () => {
            playPop();
            const letterNum = newCard.getAttribute('data-letter');
            const modal = document.getElementById('modal' + letterNum);
            if (modal) {
              modal.classList.add('open'); if (window.runTypewriter) window.runTypewriter(letterNum);
              openedLetters.add(letterNum);
              checkAllLettersOpened();
            }
          });
          // Hover
          newCard.addEventListener('mouseenter', () => playHover());
        });

        // === TECLAS RÁPIDAS ===
        let currentOpenModal = null;
        const letterOrder = ['1', '2', '3'];
        let currentLetterIndex = -1;
    
        document.addEventListener('keydown', (e) => {
          // ESC - cerrar modal abierto
          if (e.key === 'Escape') {
            const openModal = document.querySelector('.letter-modal.open, .secret-modal.open');
            if (openModal) {
              playClose();
              openModal.classList.remove('open');
              if (openModal.classList.contains('secret-modal')) {
                setTimeout(() => openModal.remove(), 400);
              }
              currentOpenModal = null;
              currentLetterIndex = -1;
            }
          }
      
          // ESPACIO - siguiente carta (si hay modal abierto)
          if (e.key === ' ' && e.target.tagName !== 'INPUT' && e.target.tagName !== 'TEXTAREA') {
            e.preventDefault();
        
            // Si hay modal secreto abierto, no hacer nada
            if (document.querySelector('.secret-modal.open')) return;
        
            const openModal = document.querySelector('.letter-modal.open');
            if (openModal) {
              // Cerrar actual
              playClose();
              openModal.classList.remove('open');
          
              // Encontrar siguiente
              const currentNum = openModal.id.replace('modal', '');
              currentLetterIndex = letterOrder.indexOf(currentNum);
              const nextIndex = (currentLetterIndex + 1) % letterOrder.length;
              const nextNum = letterOrder[nextIndex];
          
              setTimeout(() => {
                const nextModal = document.getElementById('modal' + nextNum);
                if (nextModal) {
                  playPop();
                  nextModal.classList.add('open');
                  currentOpenModal = nextModal;
                }
              }, 300);
            } else {
              // Ninguna abierta - abrir la primera
              playPop();
              document.getElementById('modal1').classList.add('open');
              currentOpenModal = document.getElementById('modal1');
              currentLetterIndex = 0;
            }
          }
        });

        // === EASTER EGG: 3 CLICKS EN EL LAZO ===
        let ribbonClicks = 0;
        let ribbonClickTimer = null;
        const ribbon = document.querySelector('.ribbon');
        if (ribbon) {
          ribbon.style.cursor = 'pointer';
          ribbon.addEventListener('click', () => {
            ribbonClicks++;
            if (ribbonClickTimer) clearTimeout(ribbonClickTimer);
        
            if (ribbonClicks === 1) {
              playClick();
            } else if (ribbonClicks === 2) {
              playHover();
            } else if (ribbonClicks >= 3) {
              // Easter egg activado!
              playChime();
              setTimeout(() => playHeart(), 150);
          
              // Mostrar mensaje secreto del lazo
              const easterModal = document.createElement('div');
              easterModal.className = 'letter-modal secret-modal';
              easterModal.innerHTML = `
                <div class="letter-paper secret-paper">
                  <span class="close-btn">&times;</span>
                  <div class="secret-content">
                    <div class="secret-icon">🎀</div>
                    <h3>¡Encontraste el secreto! 🎀</h3>
                    <p class="secret-text">
                      Tres clicks en el lazo...<br>
                      Sabía que eras curiosa 😏<br><br>
                      Este es el mensaje que solo ven<br>
                      las personas que prestan atención a los detalles.<br><br>
                      Te quiero más de lo que las palabras alcanzan.<br>
                      Gracias por existir, Celes.
                    </p>
                    <div class="secret-signature">— carlitos</div>
                  </div>
                </div>
              `;
              document.body.appendChild(easterModal);
              requestAnimationFrame(() => easterModal.classList.add('open'));
          
              const closeEaster = () => {
                playClose();
                easterModal.classList.remove('open');
                setTimeout(() => easterModal.remove(), 400);
              };
              easterModal.querySelector('.close-btn').addEventListener('click', closeEaster);
              easterModal.addEventListener('click', (e) => {
                if (e.target === easterModal) closeEaster();
              });
          
              ribbonClicks = 0;
            }
        
            ribbonClickTimer = setTimeout(() => {
              ribbonClicks = 0;
            }, 1500); // Reset después de 1.5s
          });
        }
      
  // === 1. FAVICON ANIMADO (CORAZÓN LATENTE EN PESTAÑA) ===
  function initAnimatedFavicon() {
    const faviconCanvas = document.createElement('canvas');
    faviconCanvas.width = 32;
    faviconCanvas.height = 32;
    const fctx = faviconCanvas.getContext('2d');
    let link = document.querySelector("link[rel*='icon']");
    if (!link) {
      link = document.createElement('link');
      link.rel = 'shortcut icon';
      document.head.appendChild(link);
    }
    
    let scale = 1;
    let growing = true;
    
    function drawFavicon() {
      fctx.clearRect(0, 0, 32, 32);
      fctx.font = `${20 * scale}px serif`;
      fctx.textAlign = 'center';
      fctx.textBaseline = 'middle';
      fctx.fillText('🩵', 16, 16);
      
      link.href = faviconCanvas.toDataURL('image/png');
      
      if (growing) {
        scale += 0.02;
        if (scale >= 1.25) growing = false;
      } else {
        scale -= 0.02;
        if (scale <= 0.85) growing = true;
      }
    }
    setInterval(drawFavicon, 150);
  }
  initAnimatedFavicon();

  // === 2. LOADING SCREEN INITIAL ===
  const loadingScreen = document.getElementById('loading-screen');
  if (loadingScreen) {
    setTimeout(() => {
      loadingScreen.classList.add('hidden');
      setTimeout(() => loadingScreen.remove(), 600);
    }, 2200);
  }

  // === 3. MODO NOCTURNO / DIURNO TOGGLE ===
  const themeToggle = document.getElementById('theme-toggle');
  let currentTheme = localStorage.getItem('theme') || 'light';
  if (currentTheme === 'dark') {
    document.documentElement.setAttribute('data-theme', 'dark');
  }

  if (themeToggle) {
    themeToggle.addEventListener('click', () => {
      playClick();
      currentTheme = currentTheme === 'light' ? 'dark' : 'light';
      document.documentElement.setAttribute('data-theme', currentTheme);
      localStorage.setItem('theme', currentTheme);
    });
  }

  // === 4. CANVAS POLVO DE ESTRELLAS (STARDUST) EN FONDO ===
  const stardustCanvas = document.getElementById('stardust');
  if (stardustCanvas) {
    const sctx = stardustCanvas.getContext('2d');
    let sw = stardustCanvas.width = innerWidth;
    let sh = stardustCanvas.height = innerHeight;
    window.addEventListener('resize', () => {
      sw = stardustCanvas.width = innerWidth;
      sh = stardustCanvas.height = innerHeight;
    });

    const dustParticles = [];
    for (let i = 0; i < 45; i++) {
      dustParticles.push({
        x: Math.random() * sw,
        y: Math.random() * sh,
        size: Math.random() * 2 + 0.5,
        alpha: Math.random() * 0.8 + 0.2,
        speed: Math.random() * 0.3 + 0.1,
        angle: Math.random() * Math.PI * 2,
        twinkleSpeed: Math.random() * 0.03 + 0.01
      });
    }

    function drawStardust() {
      sctx.clearRect(0, 0, sw, sh);
      dustParticles.forEach(p => {
        p.y -= p.speed;
        p.x += Math.sin(p.angle) * 0.2;
        p.angle += 0.02;
        p.alpha += Math.sin(p.angle) * p.twinkleSpeed;
        
        if (p.y < -10) p.y = sh + 10;
        if (p.x < -10) p.x = sw + 10;
        if (p.x > sw + 10) p.x = -10;

        sctx.fillStyle = `rgba(255, 255, 255, ${Math.max(0.1, Math.min(0.9, p.alpha))})`;
        sctx.beginPath();
        sctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        sctx.fill();
      });
      requestAnimationFrame(drawStardust);
    }
    drawStardust();
  }

  // === 5. CLICK RIPPLE EFFECT EN EL FONDO ===
  document.addEventListener('click', (e) => {
    // Si no es un botón ni carta ni modal
    if (e.target.closest('button') || e.target.closest('.letter-card') || e.target.closest('.letter-paper')) return;
    
    const ripple = document.createElement('div');
    ripple.className = 'click-ripple';
    ripple.style.left = `${e.clientX}px`;
    ripple.style.top = `${e.clientY}px`;
    ripple.style.width = '40px';
    ripple.style.height = '40px';
    ripple.style.border = '2px solid rgba(178, 255, 255, 0.6)';
    document.body.appendChild(ripple);
    
    // Disparar mini-burst de corazones pequeños
    for (let i = 0; i < 6; i++) {
      spawnHeart(e.clientX + (Math.random()-0.5)*40, e.clientY + (Math.random()-0.5)*40);
    }
    
    setTimeout(() => ripple.remove(), 600);
  });

  // === 6. CONFETTI BURST AL DESBLOQUEAR MENSAJE SECRETO ===
  window.launchConfetti = function() {
    const colors = ['#B2FFFF', '#7FD1C8', '#FFD1DC', '#FFB8C6', '#ffffff', '#ffd700'];
    const count = 70;
    
    for (let i = 0; i < count; i++) {
      const confetti = document.createElement('div');
      confetti.className = 'confetti';
      confetti.style.left = `${innerWidth / 2}px`;
      confetti.style.top = `${innerHeight / 2}px`;
      confetti.style.width = `${Math.random() * 8 + 6}px`;
      confetti.style.height = `${Math.random() * 8 + 6}px`;
      confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
      confetti.style.borderRadius = Math.random() > 0.5 ? '50%' : '2px';
      
      const angle = Math.random() * Math.PI * 2;
      const velocity = Math.random() * 300 + 100;
      const dx = Math.cos(angle) * velocity;
      const dy = Math.sin(angle) * velocity - 100;
      const rot = (Math.random() - 0.5) * 720;
      
      confetti.style.setProperty('--dx', `${dx}px`);
      confetti.style.setProperty('--dy', `${dy}px`);
      confetti.style.setProperty('--rot', `${rot}deg`);
      
      document.body.appendChild(confetti);
      setTimeout(() => confetti.remove(), 3000);
    }
  };

  // === 7. TYPEWRITER EFFECT EN CARTAS ===
  const letterTexts = {
    '1': [
      "You loved someone who loved the version of you\nthat bent, not the one who stood tall.",
      "And when they left, you thought the fault was yours —\nthat you weren't enough, that you asked for too much.\nBut the truth is quieter:\nthey didn't know how to stay.",
      "Healing isn't forgetting.\nIt's learning to hold your own hand\non the nights no one else does.\nIt's realizing you were never the problem —\nyou were just loved by someone\nwho didn't know how to keep you.",
      "You are whole now.\nNot because someone completed you,\nbut because you stopped waiting for them to."
    ],
    '2': [
      "There is a particular silence\nthat follows a love that broke you —\nnot the loud kind,\nbut the kind that settles in your ribs\nwhen you stop explaining yourself to ghosts.",
      "You don't need closure from them.\nClosure is the morning you wake up\nand their name doesn't taste like salt anymore.\nIt's the day you stop rehearsing conversations\nyou'll never have.",
      "You are allowed to outgrow the pain.\nYou are allowed to be soft again.\nYou are allowed to love someone\nwho stays the first time."
    ],
    '3': [
      "One day, someone will love you\nwithout making you beg for the basics.\nThey will not call you \"too much.\"\nThey will call you \"mine.\"",
      "And you'll look back at this version of you —\nthe one who cried on bathroom floors,\nwho rewrote texts ten times before sending,\nwho loved people who couldn't stay —\nand you'll thank her.",
      "Because she survived the love that wasn't enough\nso you could recognize the one that is.",
      "You're not behind.\nYou're not broken.\nYou're becoming."
    ]
  };

  window.runTypewriter = function(letterNum) {
      const container = document.getElementById('letterText' + letterNum);
      if (!container) return;
    
      // Evitar volver a animar si ya está animado
      if (container.dataset.typewriterDone === 'true') return;
      container.dataset.typewriterDone = 'true';
    
      container.innerHTML = '';
      const paragraphs = letterTexts[letterNum] || [];
    
      let paragraphIndex = 0;
    
      function typeNextParagraph() {
        if (paragraphIndex >= paragraphs.length) return;
      
        const p = document.createElement('p');
        // Preservar espacios y saltos de línea
        p.style.whiteSpace = 'pre-wrap';
        p.style.wordWrap = 'break-word';
        container.appendChild(p);
        const text = paragraphs[paragraphIndex];
        let charIndex = 0;
      
        function typeChar() {
          if (charIndex < text.length) {
            const char = text.charAt(charIndex);
            if (char === '\n') {
              p.appendChild(document.createElement('br'));
            } else {
              const span = document.createElement('span');
              span.className = 'typewriter-char';
              span.textContent = char;
              span.style.animationDelay = `${charIndex * 0.01}s`;
              p.appendChild(span);
            }
            charIndex++;
            setTimeout(typeChar, 8);
          } else {
            paragraphIndex++;
            setTimeout(typeNextParagraph, 100);
          }
        }
        typeChar();
      }
      typeNextParagraph();
    };

  // === 8. PARALLAX EN MÓVILES (GIROSCOPIO) ===
  if (window.DeviceOrientationEvent) {
    window.addEventListener('deviceorientation', (e) => {
      if (e.gamma !== null && e.beta !== null) {
        const tiltX = Math.max(-20, Math.min(20, e.gamma)) * 0.8;
        const tiltY = Math.max(-20, Math.min(20, e.beta - 45)) * 0.8;
        document.documentElement.style.setProperty('--parallax-x', `${tiltX}px`);
        document.documentElement.style.setProperty('--parallax-y', `${tiltY}px`);
      }
    });
  }

});
