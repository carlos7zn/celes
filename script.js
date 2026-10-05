document.addEventListener('DOMContentLoaded', () => {
  // === HEART CANVAS ANIMATION (estilo referencia) ===
  const canvas = document.getElementById('heart-canvas');
  const ctx = canvas.getContext('2d');
  
  let width, height;
  let isMobile = /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(navigator.userAgent.toLowerCase());
  let koef = isMobile ? 0.5 : 1;
  
  function resize() {
    width = canvas.width = innerWidth;
    height = canvas.height = innerHeight;
  }
  window.addEventListener('resize', resize);
  resize();
  
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
  let traceCount = isMobile ? 20 : 50;
  let dr = isMobile ? 0.3 : 0.1;
  
  const pointsOrigin = [];
  for (let i = 0; i < Math.PI * 2; i += dr) {
    pointsOrigin.push(scaleAndTranslate(heartPosition(i), 210, 13, 0, 0));
  }
  for (let i = 0; i < Math.PI * 2; i += dr) {
    pointsOrigin.push(scaleAndTranslate(heartPosition(i), 150, 9, 0, 0));
  }
  for (let i = 0; i < Math.PI * 2; i += dr) {
    pointsOrigin.push(scaleAndTranslate(heartPosition(i), 90, 5, 0, 0));
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
  
  for (let i = 0; i < heartPointsCount; i++) {
    const x = Math.random() * window.innerWidth;
    const y = Math.random() * window.innerHeight;
    e[i] = {
      vx: 0,
      vy: 0,
      R: 2,
      speed: Math.random() + 5,
      q: ~~(Math.random() * heartPointsCount),
      D: 2 * (i % 2) - 1,
      force: 0.2 * Math.random() + 0.7,
      f: 'hsla(0,' + ~~(40 * Math.random() + 60) + '%,' + ~~(60 * Math.random() + 20) + '%,.3)',
      trace: []
    };
    for (var k = 0; k < traceCountVal; k++) e[i].trace[k] = { x: Math.random() * window.innerWidth, y: Math.random() * window.innerHeight };
  }
  
  const config = {
    traceK: 0.4,
    timeDelta: 0.01
  };
  
  let time = 0;
  
  function loop() {
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
          u.q = ~~(Math.random() * heartPointsCount);
        } else {
          if (0.99 < Math.random()) {
            u.D *= -1;
          }
          u.q += u.D;
          u.q %= heartPointsCount;
          if (u.q < 0) u.q += heartPointsCount;
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
        N.x -= 0.4 * (N.x - T.x);
        N.y -= 0.4 * (N.y - T.y);
      }
      
      ctx.fillStyle = u.f;
      for (let k = 0; k < u.trace.length; k++) {
        ctx.fillRect(u.trace[k].x, u.trace[k].y, 1, 1);
      }
    }
    
    requestAnimationFrame(loop);
  }
  
  // Start animation
  loop();
  
  // Handle resize
  window.addEventListener('resize', () => {
    canvas.width = innerWidth;
    canvas.height = innerHeight;
  });
  
  // === YES BUTTON ===
  const yesBtn = document.getElementById('yesBtn');
  const noBtn = document.getElementById('noBtn');
  const questionBox = document.getElementById('questionBox');
  const resultBox = document.getElementById('resultBox');
  
  if (yesBtn) {
    yesBtn.addEventListener('click', () => {
      if (questionBox) questionBox.style.display = 'none';
      if (resultBox) resultBox.style.display = 'flex';
      // Create confetti burst
      launchConfetti();
    });
  }
  
  // === NO BUTTON HUIR ===
  if (noBtn) {
    noBtn.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      moveNo();
    });
    noBtn.addEventListener('mouseover', moveNo);
  }
  
  function moveNo() {
    const btn = noBtn;
    const rect = btn.getBoundingClientRect();
    const btnW = rect.width;
    const btnH = rect.height;
    
    // Move to random position on screen
    const maxX = window.innerWidth - btnW - 20;
    const maxY = window.innerHeight - btnH - 20;
    const x = Math.max(20, Math.min(Math.random() * maxX, maxX));
    const y = Math.max(20, Math.min(Math.random() * maxY, maxY));
    
    btn.style.position = 'fixed';
    btn.style.left = '0px';
    btn.style.top = '0px';
    btn.style.margin = '0';
    btn.style.zIndex = '9999';
    btn.style.transform = `translate(${x}px, ${y}px)`;
  }
  
  // Confetti burst function
  function launchConfetti() {
    const colors = ['#ff4081', '#c2185b', '#fce4ec', '#f8bbd0', '#ffffff', '#ffd700'];
    const count = 70;
    
    for (let i = 0; i < count; i++) {
      const confetti = document.createElement('div');
      confetti.className = 'confetti';
      confetti.style.left = `${innerWidth / 2}px`;
      confetti.style.top = `${innerHeight / 2}px`;
      confetti.style.width = `${Math.random() * 8 + 6}px`;
      confetti.style.height = `${Math.random() * 8 + 6}px`;
      confetti.style.backgroundColor = ['#ff4081', '#c2185b', '#fce4ec', '#f8bbd0', '#ffffff', '#ffd700'][Math.floor(Math.random() * 6)];
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
  }
});