// --- 1. Custom Glowing Cursor ---
const cursorDot = document.getElementById('cursorDot');

window.addEventListener('mousemove', (e) => {
  cursorDot.style.left = `${e.clientX}px`;
  cursorDot.style.top = `${e.clientY}px`;
});

// --- 2. Synthetic Click Sound Synthesis ---
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
  } catch (e) {
    console.log("AudioContext blocked or uninitialized.");
  }
}

// --- 3. Enter Overlay, Audio Play, and Typewriter Effect ---
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

overlay.addEventListener('click', (e) => {
  overlay.classList.add('hidden');
  bgContainer.classList.add('unblurred');
  playClickSound();
  startTypewriter();

  music.play().then(() => {
    console.log("Audio playing.");
  }).catch((err) => {
    console.log("Audio playback error: ", err);
  });
});

// Mute/Unmute Toggle
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

// --- 5. Canvas: Snow, Gems, Mouse Trail & Expanding Click Rings ---
const canvas = document.getElementById('fxCanvas');
const ctx = canvas.getContext('2d');

function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener('resize', resizeCanvas);

// Dark Snowflakes
const numFlakes = 50;
const flakes = [];
for (let i = 0; i < numFlakes; i++) {
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
const numGems = 20;
const gems = [];
for (let i = 0; i < numGems; i++) {
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

// Mouse Trail Particles
const trail = [];
window.addEventListener('mousemove', (e) => {
  trail.push({
    x: e.clientX,
    y: e.clientY,
    size: Math.random() * 2.5 + 1,
    opacity: 0.8,
    vx: (Math.random() - 0.5) * 0.5,
    vy: (Math.random() - 0.5) * 0.5
  });
});

// Click Rings Pool
const rings = [];
window.addEventListener('click', (e) => {
  playClickSound();
  rings.push({
    x: e.clientX,
    y: e.clientY,
    radius: 5,
    maxRadius: 65,
    opacity: 0.9,
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
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Render Snowflakes
  flakes.forEach(flake => {
    ctx.beginPath();
    ctx.arc(flake.x, flake.y, flake.radius, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(40, 40, 40, ${flake.opacity})`;
    ctx.fill();

    flake.y += flake.speedY;
    flake.x += flake.speedX;

    if (flake.y > canvas.height) {
      flake.y = -10;
      flake.x = Math.random() * canvas.width;
    }
  });

  // Render Gems
  gems.forEach(gem => {
    gem.opacity += Math.sin(Date.now() * gem.pulseSpeed) * 0.01;
    if (gem.opacity < 0.2) gem.opacity = 0.2;
    if (gem.opacity > 0.9) gem.opacity = 0.9;

    ctx.save();
    ctx.shadowBlur = 10;
    ctx.shadowColor = 'rgba(255, 255, 255, 0.8)';
    ctx.fillStyle = `rgba(220, 240, 255, ${gem.opacity})`;
    
    drawDiamond(gem.x, gem.y, gem.size);
    ctx.fill();
    ctx.restore();

    gem.y += gem.speedY;
    gem.x += gem.speedX;

    if (gem.y > canvas.height) {
      gem.y = -10;
      gem.x = Math.random() * canvas.width;
    }
  });

  // Render Mouse Trail
  for (let i = trail.length - 1; i >= 0; i--) {
    const t = trail[i];
    ctx.beginPath();
    ctx.arc(t.x, t.y, t.size, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(255, 255, 255, ${t.opacity})`;
    ctx.fill();

    t.x += t.vx;
    t.y += t.vy;
    t.opacity -= 0.025;

    if (t.opacity <= 0) {
      trail.splice(i, 1);
    }
  }

  // Render Click Ripple Rings (Scaling up, opacity -> 0%)
  for (let i = rings.length - 1; i >= 0; i--) {
    const ring = rings[i];
    
    ctx.save();
    ctx.beginPath();
    ctx.arc(ring.x, ring.y, ring.radius, 0, Math.PI * 2);
    ctx.strokeStyle = `rgba(255, 255, 255, ${ring.opacity})`;
    ctx.lineWidth = ring.lineWidth;
    ctx.shadowBlur = 12;
    ctx.shadowColor = 'rgba(255, 255, 255, 0.9)';
    ctx.stroke();
    ctx.restore();

    // Scale up and fade out
    ring.radius += 2.5;
    ring.opacity -= 0.025;

    if (ring.opacity <= 0 || ring.radius >= ring.maxRadius) {
      rings.splice(i, 1);
    }
  }

  requestAnimationFrame(renderFX);
}

renderFX();
