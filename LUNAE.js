/* =========================================
   LUNAE — Luxury Nail Studio · Dam.js
   Vanilla JS · No dependencies
   ========================================= */

(function () {
  'use strict';

  /* ─────────────────────────────
     1. NAV — scroll detection
  ───────────────────────────── */
  const nav = document.getElementById('nav');
  const stickyCta = document.getElementById('stickyCta');
  let lastScroll = 0;

  window.addEventListener('scroll', () => {
    const y = window.scrollY;

    // Scrolled state (glass effect)
    nav.classList.toggle('scrolled', y > 60);

    // Sticky CTA appears after 400px
    stickyCta.classList.toggle('visible', y > 400);

    lastScroll = y;
  }, { passive: true });


  /* ─────────────────────────────
     2. MOBILE MENU
  ───────────────────────────── */
  const burger = document.getElementById('navBurger');
  const mobileMenu = document.getElementById('mobileMenu');
  const mmLinks = document.querySelectorAll('.mm-link');

  burger.addEventListener('click', () => {
    const isOpen = mobileMenu.classList.toggle('open');
    burger.classList.toggle('open', isOpen);
    document.body.style.overflow = isOpen ? 'hidden' : '';
  });

  mmLinks.forEach(link => {
    link.addEventListener('click', () => {
      mobileMenu.classList.remove('open');
      burger.classList.remove('open');
      document.body.style.overflow = '';
    });
  });


  /* ─────────────────────────────
     3. REVEAL ON SCROLL
        Intersection Observer
        ease-out, 0.8s, staggered
  ───────────────────────────── */
  const revealEls = document.querySelectorAll('.reveal-up, .reveal-left, .reveal-right');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;

      const el = entry.target;
      const delay = parseInt(el.dataset.delay || 0, 10);

      setTimeout(() => {
        el.classList.add('visible');
      }, delay);

      observer.unobserve(el);
    });
  }, {
    threshold: 0.12,
    rootMargin: '0px 0px -40px 0px'
  });

  revealEls.forEach(el => observer.observe(el));


  /* ─────────────────────────────
     4. HERO ENTRANCE
        Staggered fade+rise on load
        duration: 0.9s, ease-out
        delay cascade: 0 / 0.15 / 0.3 / 0.45s
  ───────────────────────────── */
  const heroEls = document.querySelectorAll('.hero .reveal-up');
  heroEls.forEach((el, i) => {
    el.style.transitionDelay = `${i * 0.12 + 0.2}s`;
    // Trigger on next frame
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        el.classList.add('visible');
      });
    });
  });


  /* ─────────────────────────────
     5. TESTIMONIALS SLIDER
        Smooth transform, 0.6s ease-luxury
        Dots + prev/next
  ───────────────────────────── */
  const track = document.getElementById('testimonialsTrack');
  const cards = track ? track.querySelectorAll('.testimonial-card') : [];
  const tDots = document.getElementById('tDots');
  const tPrev = document.getElementById('tPrev');
  const tNext = document.getElementById('tNext');

  let current = 0;
  let perPage = getPerPage();
  let totalSlides = Math.ceil(cards.length / perPage);

  function getPerPage() {
    if (window.innerWidth >= 1024) return 4;
    if (window.innerWidth >= 640)  return 2;
    return 1;
  }

  // Build dots
  function buildDots() {
    if (!tDots) return;
    perPage = getPerPage();
    totalSlides = Math.ceil(cards.length / perPage);
    tDots.innerHTML = '';

    for (let i = 0; i < totalSlides; i++) {
      const dot = document.createElement('button');
      dot.className = 't-dot' + (i === current ? ' active' : '');
      dot.setAttribute('aria-label', `Отзыв ${i + 1}`);
      dot.addEventListener('click', () => goTo(i));
      tDots.appendChild(dot);
    }
  }

  function goTo(idx) {
    if (!track) return;
    current = (idx + totalSlides) % totalSlides;

    // Hide all, show current page
    cards.forEach((c, i) => {
      const page = Math.floor(i / perPage);
      const show = page === current;
      c.style.opacity = show ? '1' : '0';
      c.style.transform = show ? 'translateY(0)' : 'translateY(12px)';
      c.style.pointerEvents = show ? 'auto' : 'none';
      c.style.position = show ? 'relative' : 'absolute';
      c.style.display = show ? '' : 'none';
    });

    // Update dots
    document.querySelectorAll('.t-dot').forEach((d, i) => {
      d.classList.toggle('active', i === current);
    });
  }

  function initSlider() {
    if (!track) return;
    perPage = getPerPage();
    totalSlides = Math.ceil(cards.length / perPage);
    current = 0;

    // If only one page, hide nav
    if (totalSlides <= 1) {
      if (tPrev) tPrev.style.display = 'none';
      if (tNext) tNext.style.display = 'none';
      if (tDots) tDots.style.display = 'none';
      return;
    }

    // Cards: add transition style
    cards.forEach(c => {
      c.style.transition = 'opacity 0.5s cubic-bezier(0.25, 0, 0, 1), transform 0.5s cubic-bezier(0.25, 0, 0, 1)';
    });

    buildDots();
    goTo(0);
  }

  if (tPrev) tPrev.addEventListener('click', () => goTo(current - 1));
  if (tNext) tNext.addEventListener('click', () => goTo(current + 1));

  initSlider();

  // Re-init on resize
  let resizeTimer;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(initSlider, 200);
  });


  /* ─────────────────────────────
     6. PARALLAX — very light
        Hero orbs drift on scroll
        max: ±30px, duration: passive
  ───────────────────────────── */
  const orb1 = document.querySelector('.hero-orb-1');
  const orb2 = document.querySelector('.hero-orb-2');

  function updateParallax() {
    const y = window.scrollY;
    if (orb1) orb1.style.transform = `translateY(${y * 0.12}px)`;
    if (orb2) orb2.style.transform = `translateY(${y * -0.08}px)`;
  }

  window.addEventListener('scroll', updateParallax, { passive: true });


  /* ─────────────────────────────
     7. BOOKING FORM — submit
  ───────────────────────────── */
  const form = document.getElementById('bookingForm');
  const formSuccess = document.getElementById('formSuccess');

  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();

      const btn = form.querySelector('[type="submit"]');
      btn.textContent = 'Отправляем…';
      btn.disabled = true;

      // Simulate network delay (replace with real fetch)
      setTimeout(() => {
        form.style.opacity = '0';
        form.style.transform = 'translateY(-8px)';
        form.style.transition = 'opacity 0.4s ease, transform 0.4s ease';

        setTimeout(() => {
          form.style.display = 'none';
          formSuccess.classList.add('visible');
          formSuccess.style.opacity = '0';
          formSuccess.style.transform = 'translateY(12px)';
          formSuccess.style.transition = 'opacity 0.5s ease, transform 0.5s ease';

          requestAnimationFrame(() => {
            requestAnimationFrame(() => {
              formSuccess.style.opacity = '1';
              formSuccess.style.transform = 'translateY(0)';
            });
          });
        }, 400);
      }, 1200);
    });
  }


  /* ─────────────────────────────
     8. SMOOTH ANCHOR SCROLL
        offset: nav height (72px)
        duration: ~700ms ease-in-out
  ───────────────────────────── */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const href = this.getAttribute('href');
      if (href === '#') return;

      const target = document.querySelector(href);
      if (!target) return;

      e.preventDefault();

      const navH = parseInt(getComputedStyle(document.documentElement)
        .getPropertyValue('--nav-h'), 10) || 72;
      const top = target.getBoundingClientRect().top + window.scrollY - navH;

      window.scrollTo({ top, behavior: 'smooth' });
    });
  });


  /* ─────────────────────────────
     9. PHONE INPUT — auto format
  ───────────────────────────── */
  const phoneInput = document.getElementById('fphone');
  if (phoneInput) {
    phoneInput.addEventListener('input', (e) => {
      let val = e.target.value.replace(/\D/g, '');
      if (val.startsWith('7') || val.startsWith('8')) val = val.slice(1);
      if (val.length === 0) { e.target.value = ''; return; }

      let formatted = '+7 (';
      if (val.length >= 3) formatted += val.slice(0, 3) + ') ';
      else formatted += val;
      if (val.length >= 6) formatted += val.slice(3, 6) + '-';
      else if (val.length > 3) formatted += val.slice(3);
      if (val.length >= 8) formatted += val.slice(6, 8) + '-';
      else if (val.length > 6) formatted += val.slice(6);
      if (val.length > 8) formatted += val.slice(8, 10);

      e.target.value = formatted;
    });
  }


  /* ─────────────────────────────
     10. SERVICE CARD — price reveal
         Micro-interaction: price
         slides up on hover
  ───────────────────────────── */
  document.querySelectorAll('.service-card').forEach(card => {
    const price = card.querySelector('.service-price');
    if (!price) return;
    price.style.transition = 'transform 0.35s cubic-bezier(0.25,0,0,1), opacity 0.35s ease';
    price.style.display = 'block';
    price.style.transform = 'translateY(6px)';
    price.style.opacity = '0.7';

    card.addEventListener('mouseenter', () => {
      price.style.transform = 'translateY(0)';
      price.style.opacity = '1';
    });
    card.addEventListener('mouseleave', () => {
      price.style.transform = 'translateY(6px)';
      price.style.opacity = '0.7';
    });
  });

})();