// ── Custom Cursor (desktop fine-pointer only) ──
const cur = document.getElementById('cur');
const ring = document.getElementById('cur-ring');
const isFinePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;

if (isFinePointer && cur && ring) {
  let mx = 0;
  let my = 0;
  let rx = 0;
  let ry = 0;
  let started = false;

  document.addEventListener('mousemove', (e) => {
    mx = e.clientX;
    my = e.clientY;
    if (!started) {
      rx = mx;
      ry = my;
      started = true;
      document.body.classList.add('cursor-active');
    }
    cur.style.left = `${mx}px`;
    cur.style.top = `${my}px`;
  });

  document.addEventListener('mouseleave', () => {
    document.body.classList.remove('cursor-active');
  });

  document.addEventListener('mouseenter', () => {
    if (started) document.body.classList.add('cursor-active');
  });

  (function loop() {
    rx += (mx - rx) * 0.14;
    ry += (my - ry) * 0.14;
    ring.style.left = `${rx}px`;
    ring.style.top = `${ry}px`;
    requestAnimationFrame(loop);
  })();
}

// ── Mobile Navigation Drawer ──
const menuToggle = document.getElementById('menu-toggle');
const navLinks = document.getElementById('nav-links');
const navBackdrop = document.getElementById('nav-backdrop');

function setMenuOpen(open) {
  if (!menuToggle || !navLinks || !navBackdrop) return;
  menuToggle.setAttribute('aria-expanded', String(open));
  navLinks.classList.toggle('open', open);
  navBackdrop.classList.toggle('show', open);
  document.body.classList.toggle('menu-open', open);
}

if (menuToggle && navLinks && navBackdrop) {
  menuToggle.addEventListener('click', () => {
    const isOpen = menuToggle.getAttribute('aria-expanded') === 'true';
    setMenuOpen(!isOpen);
  });

  navBackdrop.addEventListener('click', () => setMenuOpen(false));

  navLinks.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => setMenuOpen(false));
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') setMenuOpen(false);
  });
}

// ── Scroll Progress, Header State & Back-to-Top ──
const header = document.getElementById('site-header');
const scrollProgress = document.getElementById('scroll-progress');
const backToTop = document.getElementById('back-to-top');
const sections = document.querySelectorAll('main section[id]');
const navItems = document.querySelectorAll('.nav-link');

function onScroll() {
  const scrollY = window.scrollY;
  const docHeight = document.documentElement.scrollHeight - window.innerHeight;
  const pct = docHeight > 0 ? Math.min(100, (scrollY / docHeight) * 100) : 0;

  if (scrollProgress) scrollProgress.style.width = `${pct}%`;
  if (header) header.classList.toggle('scrolled', scrollY > 24);
  if (backToTop) backToTop.classList.toggle('show', scrollY > 420);

  let currentId = '';
  sections.forEach((sec) => {
    const top = sec.offsetTop - 130;
    if (scrollY >= top) currentId = sec.id;
  });

  navItems.forEach((item) => {
    const href = item.getAttribute('href');
    item.classList.toggle('active', href === `#${currentId}`);
  });
}

window.addEventListener('scroll', onScroll, { passive: true });
onScroll();

if (backToTop) {
  backToTop.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

// ── Scroll Reveal & Animated Bars ──
const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('on');
      entry.target.querySelectorAll('.bar-fill').forEach((bar) => {
        setTimeout(() => {
          bar.style.width = `${bar.dataset.w}%`;
        }, 200);
      });
      revealObserver.unobserve(entry.target);
    });
  },
  { threshold: 0.12 }
);

document.querySelectorAll('.reveal').forEach((el) => revealObserver.observe(el));

// ── Animated Stat Counters ──
const countObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      const el = entry.target;
      const target = Number(el.dataset.count);
      const suffix = el.dataset.suffix || '';
      if (!target) return;

      const duration = 900;
      const start = performance.now();

      function tick(now) {
        const progress = Math.min(1, (now - start) / duration);
        const eased = 1 - Math.pow(1 - progress, 3);
        el.textContent = `${Math.round(target * eased)}${suffix}`;
        if (progress < 1) requestAnimationFrame(tick);
      }

      requestAnimationFrame(tick);
      countObserver.unobserve(el);
    });
  },
  { threshold: 0.4 }
);

document.querySelectorAll('[data-count]').forEach((el) => countObserver.observe(el));

// ── Project Category Filtering ──
const filterBtns = document.querySelectorAll('.filter-btn');
const projectCards = document.querySelectorAll('#proj-grid .proj-card');

filterBtns.forEach((btn) => {
  btn.addEventListener('click', () => {
    const filter = btn.dataset.filter;

    filterBtns.forEach((b) => {
      const active = b === btn;
      b.classList.toggle('active', active);
      b.setAttribute('aria-selected', String(active));
    });

    projectCards.forEach((card) => {
      const matches = filter === 'all' || card.dataset.category === filter;
      card.classList.toggle('is-hidden', !matches);
      if (matches) card.classList.add('on');
    });
  });
});

// ── Toast Helper ──
const toast = document.getElementById('toast');
let toastTimer;

function showToast(message) {
  if (!toast) return;
  toast.textContent = message;
  toast.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove('show'), 2800);
}

// ── Copy Email Button ──
const copyBtn = document.getElementById('copy-email-btn');
if (copyBtn) {
  copyBtn.addEventListener('click', async () => {
    const email = 'pabasaramalshi29@gmail.com';
    try {
      await navigator.clipboard.writeText(email);
      copyBtn.textContent = 'Copied!';
      showToast('Email copied to clipboard');
      setTimeout(() => {
        copyBtn.textContent = 'Copy';
      }, 2000);
    } catch {
      showToast(email);
    }
  });
}

// ── Contact Form (opens pre-filled mail client + validates cleanly) ──
const contactForm = document.getElementById('contact-form');
if (contactForm) {
  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = document.getElementById('cf-name')?.value.trim() || '';
    const email = document.getElementById('cf-email')?.value.trim() || '';
    const message = document.getElementById('cf-message')?.value.trim() || '';

    if (!name || !email || !message) {
      showToast('Please fill in all fields first.');
      return;
    }

    const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    if (!emailOk) {
      showToast('Please enter a valid email address.');
      return;
    }

    const subject = encodeURIComponent(`Portfolio Inquiry from ${name}`);
    const body = encodeURIComponent(`Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`);
    window.location.href = `mailto:pabasaramalshi29@gmail.com?subject=${subject}&body=${body}`;
    showToast('Opening your email app to send the message!');
    contactForm.reset();
  });
}

// ── Footer Year ──
const yearEl = document.getElementById('year');
if (yearEl) yearEl.textContent = String(new Date().getFullYear());
