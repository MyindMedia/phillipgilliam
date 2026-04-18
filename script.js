/* ═══════════════════════════════════════════════════════════
   PHILLIP GILLIAM, AUTHOR SITE
   Reveal · Nav · Menu · Magnetic · Tilt · Hero parallax · Progress
   ═══════════════════════════════════════════════════════════ */

(function () {
  'use strict';

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // ── MOTION ONE INTEGRATION ────────────────────────────
  // window.Motion is loaded from the module import in index.html.
  // We progressively enhance once it's ready; the site still works without it.
  function withMotion(fn) {
    if (window.Motion) { fn(window.Motion); return; }
    window.addEventListener('motion:ready', () => fn(window.Motion), { once: true });
  }

  withMotion(({ animate, spring, stagger, inView }) => {
    if (prefersReducedMotion) return;

    // Spring-eased pull on the pull-quote when it enters view.
    inView('.pull-quote__text', (info) => {
      animate(
        info.target,
        { letterSpacing: ['0.02em', '-0.005em'], opacity: [0.6, 1] },
        { duration: 1.1, easing: spring({ stiffness: 90, damping: 18 }) }
      );
    }, { amount: 0.6 });

    // Spring-stagger on the news list when it enters view.
    inView('.news', () => {
      animate(
        '.news-item',
        { opacity: [0, 1], y: [24, 0] },
        { delay: stagger(0.08), duration: 0.7, easing: spring({ stiffness: 120, damping: 20 }) }
      );
    }, { amount: 0.2 });
  });

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

// ── CART + STRIPE PAYMENT LINKS ─────────────────────────
(function cartAndCheckout() {

  // Product catalog with Stripe Payment Links
  var PRODUCTS = {
    bla: {
      id: 'bla',
      name: 'Black Leather Apron',
      series: 'John Talion Mystery · Book One',
      image: 'images/black-leather-apron-cover.jpg',
      paymentLink: 'https://buy.stripe.com/3cI7sFgl91msebr5KKfQI01'
    },
    aat: {
      id: 'aat',
      name: 'At All Times',
      series: 'John Talion Mystery · Book Two',
      image: 'images/at-all-times-cover.png',
      paymentLink: 'https://buy.stripe.com/9B6cMZ1qf1ms4ARb54fQI00'
    }
  };

  // ── Cart state ──
  var cart = [];

  // DOM refs
  var overlay     = document.getElementById('cartOverlay');
  var drawer      = document.getElementById('cartDrawer');
  var cartItems   = document.getElementById('cartItems');
  var cartEmpty   = document.getElementById('cartEmpty');
  var cartFooter  = document.getElementById('cartFooter');
  var cartTotal   = document.getElementById('cartTotal');
  var cartCount   = document.getElementById('navCartCount');
  var navCartBtn  = document.getElementById('navCartBtn');
  var closeBtn    = document.getElementById('cartClose');
  var checkoutBtn = document.getElementById('cartCheckoutBtn');

  // ── Open / Close drawer ──
  function openCart() {
    drawer.classList.add('open');
    overlay.classList.add('open');
    document.body.style.overflow = 'hidden';
  }
  function closeCart() {
    drawer.classList.remove('open');
    overlay.classList.remove('open');
    document.body.style.overflow = '';
  }

  if (navCartBtn) navCartBtn.addEventListener('click', openCart);
  if (closeBtn) closeBtn.addEventListener('click', closeCart);
  if (overlay) overlay.addEventListener('click', closeCart);

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && drawer.classList.contains('open')) closeCart();
  });

  // ── Add to cart ──
  function addToCart(productId) {
    var product = PRODUCTS[productId];
    if (!product) return;

    var existing = cart.find(function (item) { return item.id === productId; });
    if (existing) {
      existing.qty += 1;
    } else {
      cart.push({ id: productId, qty: 1 });
    }
    renderCart();
    openCart();
  }

  // ── Remove from cart ──
  function removeFromCart(productId) {
    cart = cart.filter(function (item) { return item.id !== productId; });
    renderCart();
  }

  // ── Update quantity ──
  function updateQty(productId, delta) {
    var item = cart.find(function (i) { return i.id === productId; });
    if (!item) return;
    item.qty = Math.max(1, item.qty + delta);
    renderCart();
  }

  // ── Render cart UI ──
  function renderCart() {
    var totalCount = 0;
    cart.forEach(function (item) { totalCount += item.qty; });

    if (totalCount > 0) {
      cartCount.textContent = totalCount;
      cartCount.hidden = false;
    } else {
      cartCount.hidden = true;
    }

    if (cart.length === 0) {
      cartEmpty.style.display = '';
      cartItems.innerHTML = '';
      cartFooter.hidden = true;
      return;
    }

    cartEmpty.style.display = 'none';
    cartFooter.hidden = false;

    var html = '';
    cart.forEach(function (item) {
      var product = PRODUCTS[item.id];
      html +=
        '<div class="cart-item" data-cart-id="' + item.id + '">' +
          '<div class="cart-item__img"><img src="' + product.image + '" alt="' + product.name + '"></div>' +
          '<div class="cart-item__info">' +
            '<p class="cart-item__series">' + product.series + '</p>' +
            '<p class="cart-item__name">' + product.name + '</p>' +
            '<div class="cart-item__qty">' +
              '<button class="cart-item__qty-btn" data-qty-action="dec" data-qty-id="' + item.id + '" type="button" aria-label="Decrease quantity">&minus;</button>' +
              '<span class="cart-item__qty-num">' + item.qty + '</span>' +
              '<button class="cart-item__qty-btn" data-qty-action="inc" data-qty-id="' + item.id + '" type="button" aria-label="Increase quantity">+</button>' +
            '</div>' +
          '</div>' +
          '<button class="cart-item__remove" data-remove-id="' + item.id + '" type="button" aria-label="Remove ' + product.name + '">' +
            '<i class="ph-light ph-trash"></i>' +
          '</button>' +
        '</div>';
    });
    cartItems.innerHTML = html;

    cartTotal.textContent = totalCount + (totalCount === 1 ? ' book' : ' books');

    cartItems.querySelectorAll('[data-qty-action]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var id = btn.getAttribute('data-qty-id');
        var delta = btn.getAttribute('data-qty-action') === 'inc' ? 1 : -1;
        updateQty(id, delta);
      });
    });
    cartItems.querySelectorAll('[data-remove-id]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        removeFromCart(btn.getAttribute('data-remove-id'));
      });
    });
  }

  // ── Add-to-cart button click (all 4 buttons) ──
  document.querySelectorAll('.add-to-cart-btn').forEach(function (btn) {
    btn.addEventListener('click', function (e) {
      e.preventDefault();
      var productId = btn.getAttribute('data-product-id');
      addToCart(productId);

      var label = btn.querySelector('span');
      if (label) {
        var original = label.innerHTML;
        label.innerHTML = '<i class="ph-light ph-check-circle"></i> Added to Cart';
        btn.classList.add('added');
        setTimeout(function () {
          label.innerHTML = original;
          btn.classList.remove('added');
        }, 1200);
      }
    });
  });

  // ── Checkout via Stripe Payment Links ──
  if (checkoutBtn) {
    checkoutBtn.addEventListener('click', function () {
      if (cart.length === 0) return;

      // If only one unique product in cart, go directly to its Payment Link
      if (cart.length === 1) {
        var product = PRODUCTS[cart[0].id];
        if (product && product.paymentLink) {
          window.location.href = product.paymentLink;
          return;
        }
      }

      // Multiple products: open each Payment Link in sequence
      // (Stripe Payment Links are per-product, so each opens separately)
      cart.forEach(function (item, i) {
        var product = PRODUCTS[item.id];
        if (product && product.paymentLink) {
          if (i === 0) {
            window.location.href = product.paymentLink;
          } else {
            window.open(product.paymentLink, '_blank');
          }
        }
      });
    });
  }

  // Initial render
  renderCart();
})();

(function backgroundAudio() {
  const audio = document.getElementById('bg-audio');
  const toggle = document.getElementById('bg-audio-toggle');
  if (!audio || !toggle) return;

  audio.volume = 0.35;
  const label = toggle.querySelector('.bg-audio-toggle__label');
  let userTurnedOff = false; // tracks if user manually turned music off

  const setUI = (playing) => {
    toggle.classList.toggle('is-playing', playing);
    toggle.setAttribute('aria-pressed', String(playing));
    if (label) label.textContent = playing ? 'Music On' : 'Music Off';
  };

  const tryPlay = () => audio.play().then(() => setUI(true)).catch(() => setUI(false));

  // Start music on first scroll (browsers allow play after user gesture)
  const onScroll = () => {
    if (!userTurnedOff && audio.paused) tryPlay();
    window.removeEventListener('scroll', onScroll);
  };
  window.addEventListener('scroll', onScroll, { passive: true });

  // Toggle button: user can turn off/on manually
  toggle.addEventListener('click', () => {
    if (audio.paused) {
      userTurnedOff = false;
      tryPlay();
    } else {
      userTurnedOff = true;
      audio.pause();
      setUI(false);
    }
  });

  audio.addEventListener('play', () => setUI(true));
  audio.addEventListener('pause', () => setUI(false));
})();

// ── VIDEO MODAL ───────────────────────────────────────
(function () {
  const modal = document.getElementById('videoModal');
  const player = document.getElementById('videoModalPlayer');
  const triggers = document.querySelectorAll('[data-video-trigger]');
  if (!modal || !player || !triggers.length) return;

  let lastFocused = null;

  const openModal = (vimeoId) => {
    lastFocused = document.activeElement;
    const src = `https://player.vimeo.com/video/${vimeoId}?autoplay=1&title=0&byline=0&portrait=0&dnt=1`;
    player.innerHTML = `<iframe src="${src}" allow="autoplay; fullscreen; picture-in-picture" allowfullscreen></iframe>`;
    modal.hidden = false;
    requestAnimationFrame(() => modal.classList.add('open'));
    document.body.classList.add('video-modal-open');
    const closeBtn = modal.querySelector('.video-modal__close');
    if (closeBtn) closeBtn.focus();
  };

  const closeModal = () => {
    modal.classList.remove('open');
    document.body.classList.remove('video-modal-open');
    player.innerHTML = '';
    setTimeout(() => {
      modal.hidden = true;
      if (lastFocused && typeof lastFocused.focus === 'function') lastFocused.focus();
    }, 400);
  };

  triggers.forEach((btn) => {
    btn.addEventListener('click', () => {
      const id = btn.getAttribute('data-vimeo-id');
      if (id) openModal(id);
    });
  });

  modal.querySelectorAll('[data-video-close]').forEach((el) => {
    el.addEventListener('click', closeModal);
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('open')) closeModal();
  });
})();
