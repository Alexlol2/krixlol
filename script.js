// --- 1. Custom Glowing Cursor ---
const cursorDot = document.getElementById('cursorDot');

window.addEventListener('mousemove', (e) => {
  cursorDot.style.left = `${e.clientX}px`;
  cursorDot.style.top = `${e.clientY}px`;
});

// --- 2. Synthetic Click Sound ---
function playClickSound() {
  try {
    const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(800, audioCtx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(200, audioCtx.currentTime + 0.04);

    gain.gain.setValueAtTime(0.15, audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.04);

    osc.connect(gain);
    gain.connect(audioCtx.destination);

    osc.start();
    osc.stop(audioCtx.currentTime + 0.04);
  } catch (e) {}
}

// --- 3. Overlay & Audio Control ---
const overlay = document.getElementById('enterOverlay');
const bgContainer = document.getElementById('bgContainer');
const music = document.getElementById('bgMusic');
const audioToggle = document.getElementById('audioToggle');
const audioIcon = document.getElementById('audioIcon');

function startTypewriter() {
  const text = "krix";
  const el = document.getElementById('typewriter');
  el.innerHTML = "";
  let i = 0;
  
  function type() {
    if (i < text.length) {
      el.innerHTML += text.charAt(i);
      i++;
      setTimeout(type, 150);
    }
  }
  type();
}

overlay.addEventListener('click', () => {
  overlay.classList.add('hidden');
  bgContainer.classList.add('unblurred');
  playClickSound();
  startTypewriter();

  music.play().catch((err) => {
    console.log("Audio play failed: ", err);
  });
});

audioToggle.addEventListener('click', (e) => {
  e.stopPropagation();
  playClickSound();
  if (music.paused) {
    music.play();
    audioIcon.className = "fa-solid fa-volume-high";
  } else {
    music.pause();
    audioIcon.className = "fa-solid fa-volume-xmark";
  }
});

// --- 4. 3D Tilt Effect ---
const card = document.getElementById('tiltCard');

window.addEventListener('mousemove', (e) => {
  const x = e.clientX;
  const y = e.clientY;

  const centerX = window.innerWidth / 2;
  const centerY = window.innerHeight / 2;

  const percentX = (x - centerX) / centerX;
  const percentY = (y - centerY) / centerY;

  const maxTilt = 12;

  const rotateX = -percentY * maxTilt;
  const rotateY = percentX * maxTilt;

  card.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
});

window.addEventListener('mouseleave', () => {
  card.style.transform = `rotateX(0deg) rotateY(0deg)`;
});

// --- 5. Canvas Particles, Mouse Trail, and Click Rings ---
const canvas = document.getElementById('fxCanvas');
const ctx = canvas.getContext('2d');

let width, height;

function resizeCanvas() {
  width = canvas.width = window.innerWidth;
  height = canvas.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener('resize', resizeCanvas);

// Dark Snowflakes
const flakes = [];
for (let i = 0; i < 60; i++) {
  flakes.push({
    x: Math.random() * window.innerWidth,
    y: Math.random() * window.innerHeight,
    radius: Math.random() * 2 + 1,
    speedY: Math.random() * 0.8 + 0.3,
    speedX: Math.random() * 0.4 - 0.2,
    opacity: Math.random() * 0.4 + 0.2
  });
}

// Glowing Gems
const gems = [];
for (let i = 0; i < 25; i++) {
  gems.push({
    x: Math.random() * window.innerWidth,
    y: Math.random() * window.innerHeight,
    size: Math.random() * 3 + 2,
    speedY: Math.random() * 0.5 + 0.1,
    speedX: Math.random() * 0.3 - 0.15,
    opacity: Math.random() * 0.7 + 0.3,
    pulseSpeed: Math.random() * 0.03 + 0.01
  });
}

// Mouse Trail
const trail = [];
window.addEventListener('mousemove', (e) => {
  for (let i = 0; i < 2; i++) {
    trail.push({
      x: e.clientX,
      y: e.clientY,
      size: Math.random() * 2 + 1,
      opacity: 0.8,
      vx: (Math.random() - 0.5) * 0.8,
      vy: (Math.random() - 0.5) * 0.8
    });
  }
});

// Click Rings
const rings = [];
window.addEventListener('click', (e) => {
  playClickSound();
  rings.push({
    x: e.clientX,
    y: e.clientY,
    radius: 4,
    opacity: 1,
    lineWidth: 2
  });
});

function drawDiamond(x, y, size) {
  ctx.beginPath();
  ctx.moveTo(x, y - size);
  ctx.lineTo(x + size, y);
  ctx.lineTo(x, y + size);
  ctx.lineTo(x - size, y);
  ctx.closePath();
}

function renderFX() {
  ctx.clearRect(0, 0, width, height);

  // Render Snowflakes
  flakes.forEach(flake => {
    ctx.beginPath();
    ctx.arc(flake.x, flake.y, flake.radius, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(180, 180, 180, ${flake.opacity})`;
    ctx.fill();

    flake.y += flake.speedY;
    flake.x += flake.speedX;

    if (flake.y > height) {
      flake.y = -10;
      flake.x = Math.random() * width;
    }
  });

  // Render Gems
  gems.forEach(gem => {
    gem.opacity += Math.sin(Date.now() * gem.pulseSpeed) * 0.01;
    if (gem.opacity < 0.2) gem.opacity = 0.2;
    if (gem.opacity > 0.9) gem.opacity = 0.9;

    ctx.save();
    ctx.shadowBlur = 8;
    ctx.shadowColor = 'rgba(255, 255, 255, 0.8)';
    ctx.fillStyle = `rgba(220, 240, 255, ${gem.opacity})`;
    
    drawDiamond(gem.x, gem.y, gem.size);
    ctx.fill();
    ctx.restore();

    gem.y += gem.speedY;
    gem.x += gem.speedX;

    if (gem.y > height) {
      gem.y = -10;
      gem.x = Math.random() * width;
    }
  });

  // Render Trail
  for (let i = trail.length - 1; i >= 0; i--) {
    const t = trail[i];
    ctx.beginPath();
    ctx.arc(t.x, t.y, t.size, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(255, 255, 255, ${t.opacity})`;
    ctx.fill();

    t.x += t.vx;
    t.y += t.vy;
    t.opacity -= 0.03;

    if (t.opacity <= 0) {
      trail.splice(i, 1);
    }
  }

  // Render Expanding Click Rings
  for (let i = rings.length - 1; i >= 0; i--) {
    const ring = rings[i];
    
    ctx.save();
    ctx.beginPath();
    ctx.arc(ring.x, ring.y, ring.radius, 0, Math.PI * 2);
    ctx.strokeStyle = `rgba(255, 255, 255, ${ring.opacity})`;
    ctx.lineWidth = ring.lineWidth;
    ctx.shadowBlur = 10;
    ctx.shadowColor = 'rgba(255, 255, 255, 0.8)';
    ctx.stroke();
    ctx.restore();

    ring.radius += 2.5;
    ring.opacity -= 0.025;

    if (ring.opacity <= 0) {
      rings.splice(i, 1);
    }
  }

  requestAnimationFrame(renderFX);
}

renderFX();
