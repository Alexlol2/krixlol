// --- 1. Audio Play on Click ---
const overlay = document.getElementById('enterOverlay');
const music = document.getElementById('bgMusic');

overlay.addEventListener('click', () => {
  overlay.classList.add('hidden');
  music.play().catch(e => console.log("Audio play blocked:", e));
});

// --- 2. 3D Tilt Effect ---
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

// --- 3. Falling Black Snowflakes Canvas ---
const canvas = document.getElementById('snowCanvas');
const ctx = canvas.getContext('2d');

let width = canvas.width = window.innerWidth;
let height = canvas.height = window.innerHeight;

window.addEventListener('resize', () => {
  width = canvas.width = window.innerWidth;
  height = canvas.height = window.innerHeight;
});

const numFlakes = 60;
const flakes = [];

for (let i = 0; i < numFlakes; i++) {
  flakes.push({
    x: Math.random() * width,
    y: Math.random() * height,
    radius: Math.random() * 2.5 + 1,
    speedY: Math.random() * 0.8 + 0.2,
    speedX: Math.random() * 0.4 - 0.2,
    opacity: Math.random() * 0.5 + 0.3
  });
}

function renderSnow() {
  ctx.clearRect(0, 0, width, height);

  flakes.forEach(flake => {
    ctx.beginPath();
    ctx.arc(flake.x, flake.y, flake.radius, 0, Math.PI * 2);
    // Dark grey/black snowflake color
    ctx.fillStyle = `rgba(20, 20, 20, ${flake.opacity})`;
    ctx.fill();

    flake.y += flake.speedY;
    flake.x += flake.speedX;

    // Reset flake to top if it falls below bottom
    if (flake.y > height) {
      flake.y = -10;
      flake.x = Math.random() * width;
    }
  });

  requestAnimationFrame(renderSnow);
}

renderSnow();
