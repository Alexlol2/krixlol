const card = document.getElementById('tiltCard');

// Listen to mouse movement anywhere on the window
window.addEventListener('mousemove', (e) => {
  const x = e.clientX;
  const y = e.clientY;

  // Find the center of the viewport
  const centerX = window.innerWidth / 2;
  const centerY = window.innerHeight / 2;

  // Calculate position relative to center (-1 to 1 range approx)
  const percentX = (x - centerX) / centerX;
  const percentY = (y - centerY) / centerY;

  // Set maximum rotation degrees
  const maxTilt = 15;

  // Calculate tilt rotation
  const rotateX = -percentY * maxTilt;
  const rotateY = percentX * maxTilt;

  // Apply 3D transform to card
  card.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
});

// Optional: Reset position when mouse leaves the browser window
window.addEventListener('mouseleave', () => {
  card.style.transform = `rotateX(0deg) rotateY(0deg)`;
});
