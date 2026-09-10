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

// --- 4. Falling Snowflakes Canvas ---
const canvas = document.getElementById('snowCanvas');
const ctx = canvas.getContext('2d');

function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener('resize', resizeCanvas);

const numFlakes = 70;
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

function renderSnow() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  flakes.forEach(flake => {
    ctx.beginPath();
    ctx.arc(flake.x, flake.y, flake.radius, 0, Math.PI * 2);
    // Dark grey snowflakes so they stay visible over Back.png
    ctx.fillStyle = `rgba(40, 40, 40, ${flake.opacity})`;
    ctx.fill();

    flake.y += flake.speedY;
    flake.x += flake.speedX;

    if (flake.y > canvas.height) {
      flake.y = -10;
      flake.x = Math.random() * canvas.width;
    }
  });

  requestAnimationFrame(renderSnow);
}

renderSnow();
