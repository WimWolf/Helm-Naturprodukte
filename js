/* ═══════════════════════════════════════════════
   HELM NATURPRODUKTE – script.js
   ═══════════════════════════════════════════════ */

(function () {
  'use strict';

  /* ── 1. STICKY HEADER ─────────────────────────── */
  const header = document.getElementById('siteHeader');
  function handleScroll() {
    header.classList.toggle('scrolled', window.scrollY > 60);
  }
  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll();


  /* ── 2. MOBILE MENU ───────────────────────────── */
  const hamburger  = document.getElementById('hamburger');
  const overlay    = document.getElementById('mobileOverlay');
  const mobileClose = document.getElementById('mobileClose');

  function openMenu() {
    overlay.classList.add('open');
    document.body.style.overflow = 'hidden';
  }
  function closeMenu() {
    overlay.classList.remove('open');
    document.body.style.overflow = '';
  }

  hamburger.addEventListener('click', openMenu);
  mobileClose.addEventListener('click', closeMenu);

  // Close when a link inside the mobile nav is clicked
  overlay.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', closeMenu);
  });


  /* ── 3. SCROLL REVEAL ─────────────────────────── */
  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          revealObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.1, rootMargin: '0px 0px -40px 0px' }
  );

  document.querySelectorAll('.reveal, .reveal-delay').forEach(el => {
    revealObserver.observe(el);
  });


  /* ── 4. PRODUCT TABS ──────────────────────────── */
  const tabs        = document.querySelectorAll('.tab');
  const productCards = document.querySelectorAll('.product-card');

  function filterProducts(cat) {
    productCards.forEach(card => {
      const match = cat === 'alle' || card.dataset.cat === cat;
      card.style.display = match ? '' : 'none';
      // Re-trigger reveal animation for newly visible cards
      if (match) {
        card.classList.remove('visible');
        setTimeout(() => revealObserver.observe(card), 10);
      }
    });
  }

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      filterProducts(tab.dataset.cat);
    });
  });


  /* ── 5. LIVE OPEN STATUS ──────────────────────── */
  function updateOpenStatus() {
    const statusEl = document.getElementById('openStatus');
    if (!statusEl) return;

    const now  = new Date();
    const day  = now.getDay();  // 0=Sun, 1=Mon, 2=Tue, 6=Sat
    const hour = now.getHours();
    const min  = now.getMinutes();
    const time = hour + min / 60;

    let isOpen = false;

    if (day >= 2 && day <= 5 && time >= 9 && time < 19) {
      isOpen = true; // Tue–Fri 9–19
    } else if (day === 6 && time >= 9 && time < 14) {
      isOpen = true; // Sat 9–14
    }

    const liveDot = document.querySelector('.live-dot');
    if (isOpen) {
      statusEl.textContent = 'Jetzt geöffnet';
      if (liveDot) liveDot.style.background = '#6FBF73';
    } else {
      statusEl.textContent = 'Aktuell geschlossen';
      if (liveDot) liveDot.style.background = '#E57373';
    }
  }
  updateOpenStatus();


  /* ── 6. SMOOTH ANCHOR SCROLL ──────────────────── */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const target = document.querySelector(anchor.getAttribute('href'));
      if (!target) return;
      e.preventDefault();
      const headerHeight = header.offsetHeight;
      const top = target.getBoundingClientRect().top + window.scrollY - headerHeight - 8;
      window.scrollTo({ top, behavior: 'smooth' });
    });
  });


  /* ── 7. ACTIVE NAV HIGHLIGHT ON SCROLL ────────── */
  const sections = document.querySelectorAll('section[id], div[id]');
  const navLinks  = document.querySelectorAll('.main-nav a[href^="#"]');

  const sectionObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const id = entry.target.getAttribute('id');
          navLinks.forEach(link => {
            link.classList.toggle('active-nav', link.getAttribute('href') === `#${id}`);
          });
        }
      });
    },
    { threshold: 0.35 }
  );

  sections.forEach(sec => sectionObserver.observe(sec));

})();
