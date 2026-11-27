(function () {
  'use strict';

  /* =====================================================================
     MENU MOBILE UNIVERSAL (REVISADO E BLINDADO)
     ===================================================================== */
  function initMobileMenu() {
    const toggles = document.querySelectorAll(
      '.menu, .menu-toggle, .hamburger, [data-menu-toggle]'
    );

    toggles.forEach((toggle) => {
      if (toggle.dataset.menuBound === 'true') return;
      toggle.dataset.menuBound = 'true';

      const headerEl = toggle.closest('header') || document;
      const controlsId = toggle.getAttribute('aria-controls');

      const nav =
        (controlsId && document.getElementById(controlsId)) ||
        document.querySelector('#menu-principal') ||
        headerEl.querySelector('.nav-links, .main-nav, nav');

      if (!nav) return;

      function setMenuState(shouldOpen) {
        nav.classList.toggle('open', shouldOpen);
        nav.classList.toggle('is-open', shouldOpen);
        nav.classList.toggle('active', shouldOpen);
        toggle.classList.toggle('open', shouldOpen);
        toggle.classList.toggle('is-open', shouldOpen);
        toggle.classList.toggle('active', shouldOpen);
        toggle.setAttribute('aria-expanded', String(shouldOpen));

        if (window.innerWidth <= 900) {
          if (shouldOpen) {
            nav.style.display = 'flex';
            nav.style.flexDirection = 'column';
          } else {
            nav.style.display = 'none';
          }
        } else {
          nav.style.removeProperty('display');
          nav.style.removeProperty('flex-direction');
        }
      }

      // Garante estado inicial fechado no mobile
      if (window.innerWidth <= 900) {
        const initiallyOpen =
          nav.classList.contains('open') ||
          nav.classList.contains('is-open') ||
          nav.classList.contains('active');
        setMenuState(initiallyOpen);
      }

      toggle.addEventListener('click', (event) => {
        event.preventDefault();
        event.stopPropagation();

        const isCurrentlyOpen =
          nav.classList.contains('open') ||
          nav.classList.contains('is-open') ||
          nav.classList.contains('active') ||
          toggle.getAttribute('aria-expanded') === 'true';

        setMenuState(!isCurrentlyOpen);
      });

      nav.querySelectorAll('a').forEach((link) => {
        link.addEventListener('click', () => {
          setMenuState(false);
        });
      });

      document.addEventListener('click', (event) => {
        const isOpen =
          nav.classList.contains('open') ||
          nav.classList.contains('is-open') ||
          nav.classList.contains('active');
        if (!isOpen) return;

        if (!nav.contains(event.target) && !toggle.contains(event.target)) {
          setMenuState(false);
        }
      });

      window.addEventListener('resize', () => {
        if (window.innerWidth > 900) {
          nav.style.removeProperty('display');
          nav.style.removeProperty('flex-direction');
        } else {
          const isOpen =
            nav.classList.contains('open') ||
            nav.classList.contains('is-open') ||
            nav.classList.contains('active');
          setMenuState(isOpen);
        }
      });
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initMobileMenu);
  } else {
    initMobileMenu();
  }

  /* =====================================================================
     BARRA DE PROGRESSO E BOTÃO VOLTAR AO TOPO
     ===================================================================== */
  const progress = document.createElement('div');
  progress.className = 'scroll-progress';
  document.body.appendChild(progress);

  const backTop = document.createElement('button');
  backTop.className = 'back-top';
  backTop.type = 'button';
  backTop.setAttribute('aria-label', 'Voltar ao topo');
  backTop.innerHTML = '↑';
  document.body.appendChild(backTop);
  backTop.addEventListener('click', () =>
    window.scrollTo({ top: 0, behavior: 'smooth' })
  );

  /* =====================================================================
     BRILHO SUTIL QUE ACOMPANHA O MOUSE EM TELAS GRANDES
     ===================================================================== */
  const glow = document.createElement('div');
  glow.className = 'cursor-glow';
  document.body.appendChild(glow);
  const desktopPointer = window.matchMedia('(pointer:fine)');
  if (desktopPointer.matches) {
    window.addEventListener(
      'pointermove',
      (e) => {
        glow.style.left = e.clientX + 'px';
        glow.style.top = e.clientY + 'px';
        glow.style.opacity = '1';
      },
      { passive: true }
    );
    window.addEventListener('pointerleave', () => {
      glow.style.opacity = '0';
    });
  }

  /* =====================================================================
     ANIMAÇÃO DE ENTRADA SUAVE DOS ELEMENTOS
     ===================================================================== */
  const revealTargets = document.querySelectorAll(
    '.intro-grid > *, .feature-grid article, .heading-row > *, .model-card, .price-card, .price-side, .steps article, .faq-grid > *, .contact-inner > *'
  );
  revealTargets.forEach((el, i) => {
    el.classList.add('reveal');
    if (i % 4 === 1) el.classList.add('delay-1');
    if (i % 4 === 2) el.classList.add('delay-2');
    if (i % 4 === 3) el.classList.add('delay-3');
  });

  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
    );
    revealTargets.forEach((el) => observer.observe(el));
  } else {
    revealTargets.forEach((el) => el.classList.add('visible'));
  }

  /* =====================================================================
     HEADER, PROGRESSO E BOTÃO VOLTAR AO TOPO NA ROLAGEM
     ===================================================================== */
  const siteHeader = document.querySelector('.header');
  const updateScrollUI = () => {
    const max = document.documentElement.scrollHeight - window.innerHeight;
    const percent = max > 0 ? (window.scrollY / max) * 100 : 0;
    progress.style.width = percent + '%';
    siteHeader?.classList.toggle('scrolled', window.scrollY > 35);
    backTop.classList.toggle('show', window.scrollY > 650);
  };
  updateScrollUI();
  window.addEventListener('scroll', updateScrollUI, { passive: true });

  /* =====================================================================
     DESTACA A SEÇÃO ATUAL NO MENU
     ===================================================================== */
  const sections = [...document.querySelectorAll('main section[id]')];
  const navLinks = [...document.querySelectorAll('.nav-links a[href^="#"]')];
  if ('IntersectionObserver' in window && sections.length && navLinks.length) {
    const sectionObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            navLinks.forEach((link) =>
              link.classList.toggle(
                'active',
                link.getAttribute('href') === '#' + entry.target.id
              )
            );
          }
        });
      },
      { rootMargin: '-35% 0px -55% 0px', threshold: 0 }
    );
    sections.forEach((section) => sectionObserver.observe(section));
  }

  /* =====================================================================
     EFEITO 3D DISCRETO NO PREVIEW PRINCIPAL
     ===================================================================== */
  const heroCard = document.querySelector('.hero-card');
  const browser = document.querySelector('.hero-card .browser');
  if (heroCard && browser && desktopPointer.matches) {
    heroCard.addEventListener('pointermove', (e) => {
      const r = heroCard.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width - 0.5;
      const y = (e.clientY - r.top) / r.height - 0.5;
      browser.style.transform = `perspective(1000px) rotateY(${x * 3}deg) rotateX(${-y * 3}deg) rotateZ(1deg)`;
    });
    heroCard.addEventListener('pointerleave', () => {
      browser.style.transform = 'rotate(1deg)';
    });
  }

  /* =====================================================================
     RIPPLE NOS BOTÕES
     ===================================================================== */
  document
    .querySelectorAll('.button, .contact-button, .nav-button')
    .forEach((button) => {
      button.addEventListener('click', (e) => {
        const rect = button.getBoundingClientRect();
        const ripple = document.createElement('span');
        const size = Math.max(rect.width, rect.height);
        ripple.className = 'ripple';
        ripple.style.width = ripple.style.height = size + 'px';
        ripple.style.left = e.clientX - rect.left - size / 2 + 'px';
        ripple.style.top = e.clientY - rect.top - size / 2 + 'px';
        button.appendChild(ripple);
        setTimeout(() => ripple.remove(), 700);
      });
    });

  /* =====================================================================
     PARALLAX NA FORMA DO HERO
     ===================================================================== */
  const shape = document.querySelector('.hero-shape');
  if (shape && desktopPointer.matches) {
    window.addEventListener(
      'scroll',
      () => {
        shape.style.marginTop = Math.min(window.scrollY * 0.08, 55) + 'px';
      },
      { passive: true }
    );
  }
})();

/* =========================================================================
   ADVPAGE — REALCE DOS BLOCOS AO ROLAR
   ========================================================================= */
(() => {
  const blocos = document.querySelectorAll('main section[id], .features');
  if (!blocos.length || !('IntersectionObserver' in window)) return;

  const obs = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        entry.target.setAttribute('data-in-view', String(entry.isIntersecting));
      });
    },
    { threshold: 0.2 }
  );

  blocos.forEach((bloco) => obs.observe(bloco));
})();

/* =========================================================================
   ADVPAGE — AMPLIAR LOGO AO CLICAR
   ========================================================================= */
(() => {
  const logo = document.querySelector('.header .logo');
  const logoImage = logo?.querySelector('.site-logo');

  if (!logo || !logoImage || document.querySelector('.logo-lightbox')) {
    return;
  }

  const lightbox = document.createElement('div');
  lightbox.className = 'logo-lightbox';
  lightbox.setAttribute('role', 'dialog');
  lightbox.setAttribute('aria-modal', 'true');
  lightbox.setAttribute('aria-label', 'Logo da AdvPage ampliada');

  lightbox.innerHTML = `
    <div class="logo-lightbox-content">
      <button class="logo-lightbox-close"
              type="button"
              aria-label="Fechar imagem ampliada">&times;</button>
      <img class="logo-lightbox-image" alt="Logo AdvPage ampliada">
    </div>
  `;

  document.body.appendChild(lightbox);

  const enlargedImage = lightbox.querySelector('.logo-lightbox-image');
  const closeButton = lightbox.querySelector('.logo-lightbox-close');
  const content = lightbox.querySelector('.logo-lightbox-content');

  let previousFocus = null;

  function openLogo(event) {
    if (
      event &&
      (event.ctrlKey ||
        event.metaKey ||
        event.shiftKey ||
        event.altKey ||
        event.button !== 0)
    ) {
      return;
    }

    event?.preventDefault();

    enlargedImage.src = logoImage.currentSrc || logoImage.src;
    enlargedImage.alt = logoImage.alt || 'Logo AdvPage';

    previousFocus = document.activeElement;
    lightbox.classList.add('is-open');
    document.body.style.overflow = 'hidden';
    closeButton.focus();
  }

  function closeLogo() {
    lightbox.classList.remove('is-open');
    document.body.style.overflow = '';

    if (previousFocus && typeof previousFocus.focus === 'function') {
      previousFocus.focus();
    }
  }

  logo.addEventListener('click', openLogo);
  closeButton.addEventListener('click', closeLogo);

  lightbox.addEventListener('click', (event) => {
    if (event.target === lightbox) {
      closeLogo();
    }
  });

  content.addEventListener('click', (event) => {
    event.stopPropagation();
  });

  document.addEventListener('keydown', (event) => {
    if (!lightbox.classList.contains('is-open')) return;

    if (event.key === 'Escape') {
      closeLogo();
    }
  });
})();