/* Vinay Adabala Portfolio Scripts */

document.addEventListener('DOMContentLoaded', () => {
  const html = document.documentElement;
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Theme toggle
  const themeBtn = document.getElementById('theme-toggle');
  if (themeBtn) {
    themeBtn.addEventListener('click', () => {
      const next = html.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
      html.setAttribute('data-theme', next);
      localStorage.setItem('portfolio-theme', next);
    });
  }

  // Nav, progress, active link, back-to-top, timeline
  const navbar = document.getElementById('navbar');
  const progress = document.getElementById('scroll-progress');
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');
  const backToTop = document.getElementById('back-to-top');
  const timeline = document.getElementById('timeline');
  const timelineFill = document.getElementById('timeline-fill');

  function onScroll() {
    const y = window.scrollY;
    const max = document.documentElement.scrollHeight - window.innerHeight;
    if (navbar) navbar.classList.toggle('scrolled', y > 20);
    if (progress) progress.style.width = (max > 0 ? (y / max) * 100 : 0) + '%';
    if (backToTop) backToTop.classList.toggle('visible', y > 600);

    let current = '';
    sections.forEach(s => { if (y >= s.offsetTop - 140) current = s.id; });
    navLinks.forEach(l => l.classList.toggle('active', l.getAttribute('href') === '#' + current));

    if (timeline && timelineFill) {
      const rect = timeline.getBoundingClientRect();
      const pct = Math.min(Math.max((window.innerHeight * 0.6 - rect.top) / rect.height, 0), 1);
      timelineFill.style.height = (pct * 100) + '%';
    }
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // Mobile menu
  const navToggle = document.getElementById('nav-toggle');
  const navMenu = document.getElementById('nav-menu');
  if (navToggle && navMenu) {
    navToggle.addEventListener('click', () => {
      navToggle.classList.toggle('active');
      navMenu.classList.toggle('open');
      document.body.style.overflow = navMenu.classList.contains('open') ? 'hidden' : '';
    });
    navLinks.forEach(l => l.addEventListener('click', () => {
      navToggle.classList.remove('active');
      navMenu.classList.remove('open');
      document.body.style.overflow = '';
    }));
  }

  if (backToTop) {
    backToTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
  }

  // Scroll reveal
  const revealObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const siblings = Array.from(entry.target.parentElement.querySelectorAll(':scope > .reveal'));
      const idx = Math.max(siblings.indexOf(entry.target), 0);
      setTimeout(() => entry.target.classList.add('revealed'), Math.min(idx, 6) * 90);
      revealObserver.unobserve(entry.target);
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -60px 0px' });
  document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

  // Spotlight cards
  document.querySelectorAll('.spot').forEach(card => {
    card.addEventListener('pointermove', e => {
      const r = card.getBoundingClientRect();
      card.style.setProperty('--mx', (e.clientX - r.left) + 'px');
      card.style.setProperty('--my', (e.clientY - r.top) + 'px');
    });
  });

  // Typing effect
  const typingEl = document.getElementById('typing-text');
  if (typingEl) {
    const phrases = [
      'python · sql · git · linux',
      'generative ai · computer vision',
      'data validation · debugging',
      'rest apis · clean code'
    ];
    let pi = 0, ci = 0, deleting = false;
    (function type() {
      const phrase = phrases[pi];
      ci += deleting ? -1 : 1;
      typingEl.textContent = phrase.slice(0, ci);
      let delay = deleting ? 28 : 55;
      if (!deleting && ci === phrase.length) { delay = 1800; deleting = true; }
      else if (deleting && ci === 0) { deleting = false; pi = (pi + 1) % phrases.length; delay = 350; }
      setTimeout(type, delay);
    })();
  }

  // Local time
  const timeEl = document.getElementById('local-time');
  if (timeEl) {
    function updateTime() {
      timeEl.textContent = new Date().toLocaleTimeString('en-IN', {
        timeZone: 'Asia/Kolkata',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
      });
    }
    updateTime();
    setInterval(updateTime, 30000);
  }
});
