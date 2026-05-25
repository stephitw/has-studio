/* =============================================
     HAS STUDIO – Particle Cloud Animation
     Partículas alargadas multicolor que forman
     una nube reactiva al movimiento del ratón.
     ============================================= */

// Envolver todo en una función que se ejecute cuando el DOM esté listo
function initParticles() {
  const canvas = document.getElementById('particle-canvas');
  if (!canvas) return; // Si no existe el canvas, no continuar
  
  const ctx    = canvas.getContext('2d');

  // ── Config ──────────────────────────────────────
  const CONFIG = {
    COUNT:        420,         // número de partículas
    BASE_RADIUS:  400,         // radio base de la nube
    MOUSE_ATTRACT: 0.015,      // fuerza de atracción al cursor (reducida)
    SPRING:       0.009,       // fuerza de regreso al origen (reducida)
    DAMPING:      0.78,        // amortiguación de velocidad (más freno)
    NOISE_SPEED:  0.0005,      // velocidad del ruido orgánico (más lenta)
    REPEL_RADIUS: 90,          // radio de repulsión del cursor
    REPEL_FORCE:  2.0,         // fuerza de repulsión (reducida)
    BALL_RADIUS:  220,         // radio de influencia para efecto "bola 3D"
    // Paleta inspirada en la captura
    COLORS: [
      '#E63946', '#E76F51', '#F4A261',
      '#A8DADC', '#457B9D', '#6A4C93',
      '#1D3461', '#C77DFF', '#FF6B6B',
      '#48CAE4', '#7209B7', '#F72585',
    ],
  };

  // ── Estado global ─────────────────────────────
  let W, H, cx, cy;
  let mouse   = { x: 0, y: 0 };
  let target  = { x: 0, y: 0 }; // centro de la nube
  let noiseT  = 0;
  let particles = [];

  // ── Resize ───────────────────────────────────
  function resize() {
    W = canvas.width  = window.innerWidth;
    H = canvas.height = window.innerHeight;
    cx = W / 2;
    cy = H / 2;
    mouse.x = cx;
    mouse.y = cy;
    target.x = cx;
    target.y = cy;
  }

  // ── Simplex-like noise (1D) ───────────────────
  // Ruido sencillo basado en senos para movimiento orgánico
  function noise(t, seed) {
    return (Math.sin(t * 2.3 + seed) * 0.5 +
            Math.sin(t * 3.7 + seed * 1.5) * 0.3 +
            Math.sin(t * 7.1 + seed * 0.7) * 0.2);
  }

  // ── Partícula ─────────────────────────────────
  class Particle {
    constructor(i) {
      this.id    = i;
      this.color = CONFIG.COLORS[Math.floor(Math.random() * CONFIG.COLORS.length)];
      this.alpha = 0.55 + Math.random() * 0.45;

      // Forma alargada
      this.length  = 4  + Math.random() * 10;
      this.width   = 1  + Math.random() * 2;
      this.angle   = Math.random() * Math.PI * 2;
      this.angleV  = (Math.random() - 0.5) * 0.04; // giro lento

      // Velocidad y posición actuales
      this.vx = 0; this.vy = 0;
      this.x  = cx; this.y  = cy;

      // Semilla de ruido individual
      this.seed = Math.random() * 1000;

      // Posición de "reposo" dentro de la nube (polar)
      const r   = Math.random() ** 0.55 * CONFIG.BASE_RADIUS;
      const a   = Math.random() * Math.PI * 2;
      this.homeR = r;
      this.homeA = a;
    }

    // Posición de origen en cada frame (la nube "respira")
    getHome(t) {
      const breathe = 1 + noise(t, this.seed) * 0.09; // menos amplitud de "respiración"
      const r = this.homeR * breathe;
      const a = this.homeA + noise(t * 0.6, this.seed + 99) * 0.18; // menos variación angular
      return {
        x: target.x + Math.cos(a) * r,
        y: target.y + Math.sin(a) * r,
      };
    }

    update(t) {
      const home = this.getHome(t);

      // Spring hacia home
      const dx = home.x - this.x;
      const dy = home.y - this.y;
      this.vx += dx * CONFIG.SPRING;
      this.vy += dy * CONFIG.SPRING;

      // Repulsión del cursor
      const mdx  = this.x - mouse.x;
      const mdy  = this.y - mouse.y;
      const dist = Math.sqrt(mdx * mdx + mdy * mdy);
      if (dist < CONFIG.REPEL_RADIUS && dist > 0.1) {
        const force = (CONFIG.REPEL_RADIUS - dist) / CONFIG.REPEL_RADIUS;
        this.vx += (mdx / dist) * force * CONFIG.REPEL_FORCE;
        this.vy += (mdy / dist) * force * CONFIG.REPEL_FORCE;
      }

      // Damping
      this.vx *= CONFIG.DAMPING;
      this.vy *= CONFIG.DAMPING;

      this.x += this.vx;
      this.y += this.vy;

      // El ángulo de la partícula sigue su dirección de movimiento
      const speed = Math.sqrt(this.vx * this.vx + this.vy * this.vy);
      if (speed > 0.3) {
        const targetAngle = Math.atan2(this.vy, this.vx);
        // Interpolamos suavemente el ángulo
        let da = targetAngle - this.angle;
        while (da >  Math.PI) da -= Math.PI * 2;
        while (da < -Math.PI) da += Math.PI * 2;
        this.angle += da * 0.12;
      } else {
        this.angle += this.angleV;
      }
    }

    draw() {
      ctx.save();
      ctx.translate(this.x, this.y);
      ctx.rotate(this.angle);
      ctx.globalAlpha = this.alpha;

      // Distancia al cursor para el efecto bola
      const mdx = mouse.x - this.x;
      const mdy = mouse.y - this.y;
      const dist = Math.sqrt(mdx * mdx + mdy * mdy);
      const threshold = CONFIG.BALL_RADIUS;
      const t = Math.max(0, Math.min(1, 1 - dist / threshold)); // 0..1, 1 = muy cerca

      // Interpolación entre pastilla alargada y círculo
      const baseL = this.length;
      const baseW = this.width;
      const circleR = Math.max(baseW, baseL * 0.6);
      const l = baseL * (1 - t) + circleR * t;
      const w = baseW * (1 - t) + circleR * t;

      // Gradiente radial para simular volumen 3D.
      // Colocamos el punto de luz hacia la dirección del cursor (en coordenadas locales rotadas)
      const angToMouse = Math.atan2(mdy, mdx) - this.angle;
      const lx = Math.cos(angToMouse);
      const ly = Math.sin(angToMouse);
      const highlightOffset = (l * 0.28) * t; // cuánto se desplaza el brillo hacia el cursor
      const cxg = -lx * highlightOffset;
      const cyg = -ly * highlightOffset;

      const maxR = Math.max(l, w) * 0.65 + 1;
      const grad = ctx.createRadialGradient(cxg, cyg, 0, 0, 0, maxR);
      // stops: fuerte highlight, color base, sombra externa
      grad.addColorStop(0, `rgba(255,255,255,${0.85 * t})`);
      grad.addColorStop(0.35, this.color);
      grad.addColorStop(1, `rgba(0,0,0,${0.22 * t})`);

      ctx.fillStyle = grad;

      // Dibujamos rounded rect; cuando t=1 será prácticamente un círculo
      ctx.beginPath();
      ctx.roundRect(-l / 2, -w / 2, l, w, w / 2);
      ctx.fill();

      ctx.restore();
    }
  }

  // ── Init partículas ───────────────────────────
  function init() {
    particles = [];
    for (let i = 0; i < CONFIG.COUNT; i++) {
      particles.push(new Particle(i));
    }
  }

  // ── Loop ─────────────────────────────────────
  function loop(timestamp) {
    ctx.clearRect(0, 0, W, H);

    noiseT += CONFIG.NOISE_SPEED;

    // Centro de la nube sigue el cursor suavemente
    target.x += (mouse.x - target.x) * CONFIG.MOUSE_ATTRACT;
    target.y += (mouse.y - target.y) * CONFIG.MOUSE_ATTRACT;

    for (const p of particles) {
      p.update(noiseT);
      p.draw();
    }

    requestAnimationFrame(loop);
  }

  // ── Eventos ───────────────────────────────────
  window.addEventListener('resize', () => {
    resize();
    init();
  });

  window.addEventListener('mousemove', (e) => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
  });

  // Scroll listener para ocultar canvas
  window.addEventListener('scroll', () => {
    if (window.scrollY > 0) {
      canvas.classList.add('hidden');
    } else {
      canvas.classList.remove('hidden');
    }
  }, { passive: true });

  // Touch support
  window.addEventListener('touchmove', (e) => {
    mouse.x = e.touches[0].clientX;
    mouse.y = e.touches[0].clientY;
  }, { passive: true }); // Cambiar a passive: true permite el scroll

  // ── Arranque ──────────────────────────────────
  resize();
  init();
  requestAnimationFrame(loop);
}

// Esperar a que Relevance se cargue completamente
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    setTimeout(initParticles, 500); // Pequeño delay para que Relevance se cargue
  });
} else {
  setTimeout(initParticles, 500);
}