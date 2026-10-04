/* ============================================
   FIF STUDIO - JavaScript principal
   ============================================ */

// ============ CURSOR PERSONALIZADO ============
const cursorDot = document.querySelector('.cursor-dot');
const cursorRing = document.querySelector('.cursor-ring');

document.addEventListener('mousemove', (e) => {
  cursorDot.style.left = e.clientX + 'px';
  cursorDot.style.top = e.clientY + 'px';
  cursorRing.style.left = e.clientX + 'px';
  cursorRing.style.top = e.clientY + 'px';
});

document.querySelectorAll('a, button, input, select, textarea, .area-tag, .card, .faq-question, .check-item').forEach(el => {
  el.addEventListener('mouseenter', () => cursorRing.classList.add('hover'));
  el.addEventListener('mouseleave', () => cursorRing.classList.remove('hover'));
});

// ============ CLICK WAVE ============
document.addEventListener('click', (e) => {
  const wave = document.createElement('div');
  wave.className = 'click-wave';
  wave.style.left = e.clientX + 'px';
  wave.style.top = e.clientY + 'px';
  document.body.appendChild(wave);
  setTimeout(() => wave.remove(), 700);
});

// ============ CANVAS DE PARTÍCULAS ============
const canvas = document.getElementById('fireCanvas');
if (canvas) {
  const ctx = canvas.getContext('2d');

  function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  resize();
  window.addEventListener('resize', resize);

  const particles = [];
  const PARTICLE_COUNT = 60;

  class Particle {
    constructor() { this.reset(); }
    reset() {
      this.x = Math.random() * canvas.width;
      this.y = canvas.height + Math.random() * 100;
      this.size = Math.random() * 3 + 1;
      this.speedY = Math.random() * 1.5 + 0.5;
      this.speedX = (Math.random() - 0.5) * 0.8;
      this.opacity = Math.random() * 0.5 + 0.3;
      this.color = Math.random() > 0.5 ? '255,107,53' : '255,204,0';
    }
    update() {
      this.y -= this.speedY;
      this.x += this.speedX + Math.sin(this.y * 0.01) * 0.5;
      this.opacity -= 0.003;
      if (this.y < -50 || this.opacity <= 0) this.reset();
    }
    draw() {
      ctx.beginPath();
      const gradient = ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, this.size * 4);
      gradient.addColorStop(0, `rgba(${this.color}, ${this.opacity})`);
      gradient.addColorStop(1, `rgba(${this.color}, 0)`);
      ctx.fillStyle = gradient;
      ctx.arc(this.x, this.y, this.size * 4, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  for (let i = 0; i < PARTICLE_COUNT; i++) particles.push(new Particle());

  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach(p => { p.update(); p.draw(); });
    requestAnimationFrame(animate);
  }
  animate();
}

// ============ PROGRESO Y NAV ============
const progressBar = document.querySelector('.scroll-progress');
const navFloat = document.getElementById('navFloat');
const backTop = document.getElementById('backTop');

if (progressBar && navFloat && backTop) {
  window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const total = document.documentElement.scrollHeight - window.innerHeight;
    const progress = (scrolled / total) * 100;
    progressBar.style.width = progress + '%';

    if (scrolled > 300) {
      navFloat.classList.add('visible');
      backTop.classList.add('visible');
    } else {
      navFloat.classList.remove('visible');
      backTop.classList.remove('visible');
    }
  });

  backTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
}

// ============ FADE IN ============
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) entry.target.classList.add('visible');
  });
}, { threshold: 0.15 });

document.querySelectorAll('.fade-in, .stagger').forEach(el => observer.observe(el));

// ============ CONTADOR ANIMADO ============
const counters = document.querySelectorAll('.stat-number');
const counterObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting && !entry.target.classList.contains('counted')) {
      entry.target.classList.add('counted');
      const target = parseInt(entry.target.dataset.target);
      let current = 0;
      const step = target / 40;
      const timer = setInterval(() => {
        current += step;
        if (current >= target) {
          entry.target.textContent = target;
          clearInterval(timer);
        } else {
          entry.target.textContent = Math.floor(current);
        }
      }, 25);
    }
  });
}, { threshold: 0.5 });

counters.forEach(c => counterObserver.observe(c));

// ============ CARD 3D ============
document.querySelectorAll('.card').forEach(card => {
  card.addEventListener('mousemove', (e) => {
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const rotateX = (y - centerY) / 20;
    const rotateY = (centerX - x) / 20;

    card.style.transform = `translateY(-12px) scale(1.03) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
    card.style.setProperty('--mx', x + 'px');
    card.style.setProperty('--my', y + 'px');
  });
  card.addEventListener('mouseleave', () => card.style.transform = '');
});

// ============ PARALLAX ============
window.addEventListener('scroll', () => {
  const scrolled = window.pageYOffset;
  const hero = document.querySelector('.hero');
  if (hero && scrolled < window.innerHeight) {
    hero.style.transform = `translateY(${scrolled * 0.4}px)`;
    hero.style.opacity = Math.max(0, 1 - scrolled / (window.innerHeight * 0.8));
  }
});

// ============ FAQ ACORDEÓN ============
document.querySelectorAll('.faq-question').forEach(q => {
  q.addEventListener('click', () => {
    const item = q.parentElement;
    const wasOpen = item.classList.contains('open');
    document.querySelectorAll('.faq-item').forEach(i => i.classList.remove('open'));
    if (!wasOpen) item.classList.add('open');
  });
});

// ============ MODAL DE ÁREAS ============
const areaData = {
  programacion: {
    icon: '💻',
    title: 'PROGRAMACIÓN',
    description: 'Conviértete en el arquitecto del juego. Escribirás el código que da vida a las mecánicas, la lógica, la IA y todos los sistemas del videojuego.',
    list: [
      'Programar mecánicas de juego (movimiento, combate, etc.)',
      'Implementar sistemas (menús, guardado, inventario)',
      'Trabajar con el motor Godot o Unity',
      'Optimizar rendimiento y corregir bugs',
      'Colaborar con diseño para hacer realidad las ideas'
    ]
  },
  arte2d: {
    icon: '🎨',
    title: 'ARTE 2D',
    description: 'Da vida visual al juego. Crearás desde personajes y escenarios hasta la interfaz de usuario que verá el jugador.',
    list: [
      'Diseñar personajes, objetos y escenarios',
      'Crear animaciones frame a frame o esqueléticas',
      'Diseñar la interfaz de usuario (UI)',
      'Crear íconos, menús y elementos visuales',
      'Definir el estilo artístico del juego'
    ]
  },
  arte3d: {
    icon: '🗿',
    title: 'ARTE 3D',
    description: 'Modela, esculpe y anima el mundo del juego en tres dimensiones. Desde personajes hasta entornos completos.',
    list: [
      'Modelar personajes y objetos (Blender, Maya)',
      'Texturizar y aplicar materiales',
      'Crear animaciones 3D',
      'Diseñar entornos y escenarios 3D',
      'Optimizar modelos para el motor'
    ]
  },
  diseno: {
    icon: '🎯',
    title: 'DISEÑO DE JUEGO',
    description: 'Diseñas cómo se siente el juego. Reglas, niveles, progresión y el balance perfecto para que sea divertido.',
    list: [
      'Diseñar mecánicas y sistemas de juego',
      'Crear niveles y mapas',
      'Balancear dificultad y economía del juego',
      'Documentar el diseño (GDD)',
      'Probar y ajustar la experiencia del jugador'
    ]
  },
  audio: {
    icon: '🎵',
    title: 'AUDIO',
    description: 'El sonido hace que un juego se sienta vivo. Crearás la música, efectos y toda la atmósfera sonora.',
    list: [
      'Componer música original para el juego',
      'Crear efectos de sonido (SFX)',
      'Diseñar la ambientación sonora',
      'Trabajar con software como FL Studio, Audacity',
      'Sincronizar audio con las acciones del juego'
    ]
  },
  qa: {
    icon: '🧪',
    title: 'QA / TESTING',
    description: 'El guardián de la calidad. Encuentras bugs, problemas de balance y todo lo que falla antes de que llegue al jugador.',
    list: [
      'Probar el juego en diferentes escenarios',
      'Reportar bugs de forma clara y ordenada',
      'Verificar que las correcciones funcionen',
      'Probar en distintas plataformas y dispositivos',
      'Sugerir mejoras de jugabilidad'
    ]
  },
  marketing: {
    icon: '📢',
    title: 'MARKETING',
    description: 'Haz que el mundo conozca el juego. Gestionarás redes sociales, comunidad, tráileres y toda la comunicación.',
    list: [
      'Gestionar redes sociales del estudio',
      'Crear contenido para promocionar el juego',
      'Coordinar con prensa y creadores de contenido',
      'Diseñar trailers y material promocional',
      'Construir y cuidar la comunidad'
    ]
  },
  guion: {
    icon: '📝',
    title: 'GUION / NARRATIVA',
    description: 'Cuentas la historia del juego. Diálogos, personajes, mundo y todo lo que hace que el jugador se sumerja.',
    list: [
      'Escribir la historia principal y secundarias',
      'Crear diálogos y personalidad de personajes',
      'Diseñar el lore y la mitología del mundo',
      'Escribir textos de interfaz y tutoriales',
      'Colaborar con diseño para narrativa integrada'
    ]
  }
};

const modalOverlay = document.getElementById('modalOverlay');
const modalIcon = document.getElementById('modalIcon');
const modalTitle = document.getElementById('modalTitle');
const modalDescription = document.getElementById('modalDescription');
const modalList = document.getElementById('modalList');
const modalClose = document.getElementById('modalClose');
const modalCta = document.getElementById('modalCta');

if (modalOverlay) {
  document.querySelectorAll('.area-tag').forEach(tag => {
    tag.addEventListener('click', () => {
      const data = areaData[tag.dataset.area];
      if (!data) return;

      modalIcon.textContent = data.icon;
      modalTitle.textContent = data.title;
      modalDescription.textContent = data.description;
      modalList.innerHTML = data.list.map(item => `<li>${item}</li>`).join('');
      modalOverlay.classList.add('active');
      modalCta.dataset.area = data.title;
    });
  });

  function closeModal() {
    modalOverlay.classList.remove('active');
  }

  modalClose.addEventListener('click', closeModal);
  modalOverlay.addEventListener('click', (e) => {
    if (e.target === modalOverlay) closeModal();
  });

  modalCta.addEventListener('click', () => {
    const area = modalCta.dataset.area;
    const areaSelect = document.querySelector('select[name="Area"]');
    if (areaSelect) {
      for (let opt of areaSelect.options) {
        if (opt.value.includes(area.split(' ')[0])) {
          areaSelect.value = opt.value;
          break;
        }
      }
    }
    closeModal();
    setTimeout(() => {
      document.getElementById('aplicar').scrollIntoView({ behavior: 'smooth' });
    }, 300);
  });
}

// ============ VALIDACIÓN CHECKBOXES ============
const checkTerms = document.getElementById('checkTerms');
const checkPrivacy = document.getElementById('checkPrivacy');
const checkContract = document.getElementById('checkContract');
const submitBtn = document.getElementById('submitBtn');
const applyForm = document.getElementById('applyForm');

if (checkTerms && checkPrivacy && checkContract && submitBtn && applyForm) {
  function validateChecks() {
    const allChecked = checkTerms.checked && checkPrivacy.checked && checkContract.checked;
    submitBtn.disabled = !allChecked;
  }

  [checkTerms, checkPrivacy, checkContract].forEach(c => {
    c.addEventListener('change', validateChecks);
  });

  applyForm.addEventListener('submit', (e) => {
    if (!checkTerms.checked || !checkPrivacy.checked || !checkContract.checked) {
      e.preventDefault();
      alert('⚠️ Debes aceptar los Términos, la Política de Privacidad y el Contrato antes de enviar.');
    }
  });
}
