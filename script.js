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

  if (prefersReducedMotion) return;

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

  // ── HERO BOOK STACK CURSOR PARALLAX ───────────────────
  const heroVisual = document.getElementById('heroVisual');
  const parallaxBooks = document.querySelectorAll('[data-parallax-depth]');

  if (heroVisual && parallaxBooks.length) {
    let parallaxRaf = null;
    let targetX = 0, targetY = 0, currentX = 0, currentY = 0;

    function applyParallax() {
      currentX += (targetX - currentX) * 0.08;
      currentY += (targetY - currentY) * 0.08;

      parallaxBooks.forEach((book) => {
        const depth = parseFloat(book.dataset.parallaxDepth) || 1;
        const baseTransform = book.classList.contains('hero__book--front')
          ? 'rotateY(-8deg) rotateX(2deg)'
          : 'rotateY(10deg) rotateX(2deg)';
        book.style.transform =
          `translate3d(${currentX * depth * 18}px, ${currentY * depth * 18}px, 0) ${baseTransform}`;
      });

      if (Math.abs(targetX - currentX) > 0.001 || Math.abs(targetY - currentY) > 0.001) {
        parallaxRaf = requestAnimationFrame(applyParallax);
      } else {
        parallaxRaf = null;
      }
    }

    heroVisual.addEventListener('mousemove', (e) => {
      const rect = heroVisual.getBoundingClientRect();
      targetX = (e.clientX - rect.left) / rect.width - 0.5;
      targetY = (e.clientY - rect.top) / rect.height - 0.5;
      if (!parallaxRaf) parallaxRaf = requestAnimationFrame(applyParallax);
    });

    heroVisual.addEventListener('mouseleave', () => {
      targetX = 0;
      targetY = 0;
      if (!parallaxRaf) parallaxRaf = requestAnimationFrame(applyParallax);
    });
  }
})();
