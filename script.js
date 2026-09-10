// --- 1. Custom Glowing Cursor ---
const cursorDot = document.getElementById('cursorDot');

window.addEventListener('mousemove', (e) => {
  cursorDot.style.left = `${e.clientX}px`;
  cursorDot.style.top = `${e.clientY}px`;
});

// --- 2. Enter Overlay & Audio Play ---
const overlay = document.getElementById('enterOverlay');
const bgContainer = document.getElementById('bgContainer');
const music = document.getElementById('bgMusic');

overlay.addEventListener('click', () => {
  overlay.classList.add('hidden');
  bgContainer.classList.add('unblurred');
  
  music.play().then(() => {
    console.log("Audio playing successfully.");
  }).catch((err) => {
    console.log("Audio play error: ", err);
  });
});

// --- 3. 3D Tilt Effect ---
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

// --- 4. Falling Snowflakes + Glowing Gems Canvas ---
const canvas = document.getElementById('snowCanvas');
const ctx = canvas.getContext('2d');

function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener('resize', resizeCanvas);

// Dark Snowflakes
const numFlakes = 60;
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

// Glowing Gems / Crystals
const numGems = 25;
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

function drawDiamond(x, y, size) {
  ctx.beginPath();
  ctx.moveTo(x, y - size);
  ctx.lineTo(x + size, y);
  ctx.lineTo(x, y + size);
  ctx.lineTo(x - size, y);
  ctx.closePath();
}

function renderParticles() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Render Dark Snowflakes
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

  // Render Glowing Gem Crystals
  gems.forEach(gem => {
    // Pulsing opacity effect
    gem.opacity += Math.sin(Date.now() * gem.pulseSpeed) * 0.01;
    if (gem.opacity < 0.2) gem.opacity = 0.2;
    if (gem.opacity > 0.9) gem.opacity = 0.9;

    ctx.save();
    ctx.shadowBlur = 12;
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

  requestAnimationFrame(renderParticles);
}

renderParticles();
