// Select elements
const openBtn = document.getElementById('openCardBtn');
const closeBtn = document.getElementById('closeCardBtn');
const modal = document.getElementById('ecardModal');

function openModal() {
  modal.classList.add('show');
  fireConfetti();
}

function closeModal() {
  modal.classList.remove('show');
}

openBtn.addEventListener('click', openModal);
closeBtn.addEventListener('click', closeModal);

// Close if clicking outside the letter
modal.addEventListener('click', (event) => {
  if (event.target === modal) closeModal();
});

// Close with Escape key
document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape' && modal.classList.contains('show')) closeModal();
});


// --- CUSTOM CONFETTI LOGIC (No libraries needed) ---
const canvas = document.getElementById('confetti-canvas');
const ctx = canvas.getContext('2d');
let particles = [];
let animationId = null;

function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
window.addEventListener('resize', resizeCanvas);
resizeCanvas();

function fireConfetti() {
  // Stop any running animation so loops don't stack on re-open
  if (animationId) cancelAnimationFrame(animationId);
  particles = [];

  // Light pink theme: pink, rose, white, gold
  const colors = ['#f9a8d4', '#fbcfe8', '#f472b6', '#ffffff', '#fde047'];

  for (let i = 0; i < 100; i++) {
    particles.push({
      x: canvas.width / 2,
      y: canvas.height / 2 + 100,
      vx: (Math.random() - 0.5) * 15,
      vy: (Math.random() - 1) * 15,
      size: Math.random() * 6 + 4,
      color: colors[Math.floor(Math.random() * colors.length)],
      round: Math.random() > 0.5, // shape fixed per particle (no flicker)
      rotation: Math.random() * 360,
      rotationSpeed: (Math.random() - 0.5) * 10,
      life: 100 + Math.random() * 50
    });
  }

  animateConfetti();
}

function animateConfetti() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  let activeParticles = 0;

  particles.forEach((p) => {
    if (p.life <= 0) return;
    activeParticles++;

    // Physics
    p.x += p.vx;
    p.y += p.vy;
    p.vy += 0.3;
    p.vx *= 0.98;
    p.vy *= 0.98;
    p.rotation += p.rotationSpeed;
    p.life -= 1;

    // Draw
    ctx.save();
    ctx.translate(p.x, p.y);
    ctx.rotate(p.rotation * Math.PI / 180);
    ctx.fillStyle = p.color;
    ctx.globalAlpha = Math.min(1, Math.max(0, p.life / 100));

    if (p.round) {
      ctx.beginPath();
      ctx.arc(0, 0, p.size / 2, 0, Math.PI * 2);
      ctx.fill();
    } else {
      ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size);
    }

    ctx.restore();
  });

  if (activeParticles > 0) {
    animationId = requestAnimationFrame(animateConfetti);
  } else {
    animationId = null;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  }
}