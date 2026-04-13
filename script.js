/* ═══════════════════════════════════════════════════════════
   PHILLIP GILLIAM — AUTHOR SITE
   Reveal · Nav · Menu · Magnetic · Tilt · Hero parallax · Progress
   ═══════════════════════════════════════════════════════════ */

(function () {
  'use strict';

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // ── SCROLL REVEAL ─────────────────────────────────────
  const revealElements = document.querySelectorAll('.reveal-element, .word-reveal');

  if ('IntersectionObserver' in window) {
    const revealObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            revealObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -60px 0px' }
    );
    revealElements.forEach((el) => revealObserver.observe(el));
  } else {
    revealElements.forEach((el) => el.classList.add('visible'));
  }

  // ── HAMBURGER ─────────────────────────────────────────
  const hamburger = document.getElementById('hamburger');
  const mobileMenu = document.getElementById('mobileMenu');

  if (hamburger && mobileMenu) {
    const mobileLinks = mobileMenu.querySelectorAll('.mobile-menu__link');

    function toggleMenu() {
      hamburger.classList.toggle('active');
      mobileMenu.classList.toggle('open');
      document.body.style.overflow = mobileMenu.classList.contains('open') ? 'hidden' : '';
    }

    hamburger.addEventListener('click', toggleMenu);
    mobileLinks.forEach((link) => {
      link.addEventListener('click', () => {
        if (mobileMenu.classList.contains('open')) toggleMenu();
      });
    });
  }

  // ── SMOOTH SCROLL ─────────────────────────────────────
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#' || targetId.length < 2) return;

      const target = document.querySelector(targetId);
      if (target) {
        e.preventDefault();
        const offset = 90;
        const top = target.getBoundingClientRect().top + window.pageYOffset - offset;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    });
  });

  // ── NAV SCROLL STATE + PROGRESS BAR ───────────────────
  const nav = document.getElementById('nav');
  const progress = document.getElementById('scrollProgress');
  let ticking = false;

  function onScroll() {
    const y = window.pageYOffset;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const ratio = docHeight > 0 ? Math.min(1, Math.max(0, y / docHeight)) : 0;

    if (nav) nav.classList.toggle('nav--scrolled', y > 80);
    if (progress) progress.style.width = (ratio * 100).toFixed(2) + '%';
    ticking = false;
  }

  window.addEventListener('scroll', () => {
    if (!ticking) {
      window.requestAnimationFrame(onScroll);
      ticking = true;
    }
  }, { passive: true });
  onScroll();

  // ── STAT COUNTER ──────────────────────────────────────
  const counters = document.querySelectorAll('[data-counter]');
  if (counters.length && 'IntersectionObserver' in window) {
    const counterObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const el = entry.target;
          const target = parseFloat(el.dataset.counter);
          const duration = parseInt(el.dataset.counterDuration, 10) || 1600;
          const start = performance.now();
          const startVal = 0;

          function tick(now) {
            const elapsed = now - start;
            const t = Math.min(1, elapsed / duration);
            // ease-out-expo
            const eased = t === 1 ? 1 : 1 - Math.pow(2, -10 * t);
            const value = startVal + (target - startVal) * eased;
            el.textContent = Number.isInteger(target) ? Math.round(value) : value.toFixed(1);
            if (t < 1) requestAnimationFrame(tick);
          }
          requestAnimationFrame(tick);
          counterObserver.unobserve(el);
        });
      },
      { threshold: 0.5 }
    );
    counters.forEach((c) => counterObserver.observe(c));
  }

  if (prefersReducedMotion) return;

  // ── SCROLL PARALLAX (data-parallax-y="0.2" → element drifts at 20% scroll speed) ──
  const parallaxYEls = Array.from(document.querySelectorAll('[data-parallax-y]'));
  if (parallaxYEls.length) {
    let pTicking = false;

    function updateParallaxY() {
      const vh = window.innerHeight;
      parallaxYEls.forEach((el) => {
        const rect = el.getBoundingClientRect();
        // skip offscreen
        if (rect.bottom < -200 || rect.top > vh + 200) return;
        const speed = parseFloat(el.dataset.parallaxY) || 0.15;
        // distance of element center from viewport center, normalized
        const center = rect.top + rect.height / 2;
        const offset = center - vh / 2;
        const py = -offset * speed;
        el.style.setProperty('--py', py.toFixed(1) + 'px');
      });
      pTicking = false;
    }

    window.addEventListener('scroll', () => {
      if (!pTicking) {
        window.requestAnimationFrame(updateParallaxY);
        pTicking = true;
      }
    }, { passive: true });
    window.addEventListener('resize', updateParallaxY, { passive: true });
    updateParallaxY();
  }

  // ── MAGNETIC BUTTONS / LINKS ──────────────────────────
  const magneticEls = document.querySelectorAll('[data-magnetic]');
  const MAGNET_STRENGTH = 0.28;
  const MAGNET_RADIUS = 90;

  magneticEls.forEach((el) => {
    let raf = null;

    el.addEventListener('mousemove', (e) => {
      const rect = el.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const dx = e.clientX - cx;
      const dy = e.clientY - cy;
      const dist = Math.hypot(dx, dy);
      if (dist > MAGNET_RADIUS + Math.max(rect.width, rect.height) / 2) return;

      if (raf) cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        el.style.transform = `translate3d(${dx * MAGNET_STRENGTH}px, ${dy * MAGNET_STRENGTH}px, 0)`;
      });
    });

    el.addEventListener('mouseleave', () => {
      if (raf) cancelAnimationFrame(raf);
      el.style.transform = '';
    });
  });

  // ── 3D TILT (book covers, portrait) ───────────────────
  const tiltEls = document.querySelectorAll('[data-tilt]');
  const TILT_MAX = 8; // degrees

  tiltEls.forEach((el) => {
    let raf = null;
    const baseTransition = el.style.transition;

    el.addEventListener('mousemove', (e) => {
      const rect = el.getBoundingClientRect();
      const px = (e.clientX - rect.left) / rect.width;
      const py = (e.clientY - rect.top) / rect.height;
      const rx = (0.5 - py) * (TILT_MAX * 2);
      const ry = (px - 0.5) * (TILT_MAX * 2);

      if (raf) cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        el.style.transition = 'transform 200ms cubic-bezier(0.16, 1, 0.3, 1)';
        el.style.transform = `perspective(1200px) rotateX(${rx}deg) rotateY(${ry}deg) translate3d(0,0,0)`;
      });
    });

    el.addEventListener('mouseleave', () => {
      if (raf) cancelAnimationFrame(raf);
      el.style.transition = 'transform 900ms cubic-bezier(0.16, 1, 0.3, 1)';
      el.style.transform = '';
      setTimeout(() => { el.style.transition = baseTransition; }, 900);
    });
  });

  // ── 3D BOOK ROTATION (cursor + hover) ─────────────────
  const books3d = document.querySelectorAll('[data-book-3d]');

  books3d.forEach((book) => {
    const inner = book.querySelector('.book-3d__inner');
    if (!inner) return;

    const baseRX = 6;   // resting rotateX
    const baseRY = -28; // resting rotateY
    const MAX_DELTA_X = 10;
    const MAX_DELTA_Y = 14;

    let raf = null;
    let targetX = 0, targetY = 0, currentX = 0, currentY = 0;

    function apply() {
      currentX += (targetX - currentX) * 0.1;
      currentY += (targetY - currentY) * 0.1;
      inner.style.transform =
        `rotateX(${baseRX + currentX}deg) rotateY(${baseRY + currentY}deg)`;
      if (Math.abs(targetX - currentX) > 0.01 || Math.abs(targetY - currentY) > 0.01) {
        raf = requestAnimationFrame(apply);
      } else {
        raf = null;
      }
    }

    book.addEventListener('mousemove', (e) => {
      const rect = book.getBoundingClientRect();
      const px = (e.clientX - rect.left) / rect.width - 0.5;
      const py = (e.clientY - rect.top) / rect.height - 0.5;
      targetY = px * MAX_DELTA_Y * 2;      // horizontal mouse → rotateY
      targetX = -py * MAX_DELTA_X * 2;     // vertical mouse → rotateX
      inner.style.transition = 'transform 200ms var(--ease-out-expo)';
      if (!raf) raf = requestAnimationFrame(apply);
    });

    book.addEventListener('mouseleave', () => {
      targetX = 0;
      targetY = 0;
      inner.style.transition = 'transform 900ms var(--ease-out-expo)';
      if (!raf) raf = requestAnimationFrame(apply);
    });
  });

  // ── HERO GROUP CURSOR DRIFT ───────────────────────────
  const heroVisual = document.getElementById('heroVisual');
  const parallaxStacks = document.querySelectorAll('[data-parallax-depth]');

  if (heroVisual && parallaxStacks.length) {
    let heroRaf = null;
    let htx = 0, hty = 0, hcx = 0, hcy = 0;
    const baseTransforms = new Map();
    parallaxStacks.forEach((el) => { baseTransforms.set(el, el.style.transform || ''); });

    function applyHero() {
      hcx += (htx - hcx) * 0.08;
      hcy += (hty - hcy) * 0.08;
      parallaxStacks.forEach((el) => {
        const depth = parseFloat(el.dataset.parallaxDepth) || 1;
        const base = baseTransforms.get(el);
        el.style.transform = `${base} translate3d(${hcx * depth * 14}px, ${hcy * depth * 14}px, 0)`;
      });
      if (Math.abs(htx - hcx) > 0.001 || Math.abs(hty - hcy) > 0.001) {
        heroRaf = requestAnimationFrame(applyHero);
      } else {
        heroRaf = null;
      }
    }

    heroVisual.addEventListener('mousemove', (e) => {
      const rect = heroVisual.getBoundingClientRect();
      htx = (e.clientX - rect.left) / rect.width - 0.5;
      hty = (e.clientY - rect.top) / rect.height - 0.5;
      if (!heroRaf) heroRaf = requestAnimationFrame(applyHero);
    });

    heroVisual.addEventListener('mouseleave', () => {
      htx = 0;
      hty = 0;
      if (!heroRaf) heroRaf = requestAnimationFrame(applyHero);
    });
  }
})();
