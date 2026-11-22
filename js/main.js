(() => {
  'use strict';

  /* ---------- Loader ---------- */
  window.addEventListener('load', () => {
    const loader = document.getElementById('loader');
    if (loader) setTimeout(() => loader.setAttribute('data-done', 'true'), 420);
  });

  /* ---------- Nav scroll state ---------- */
  const nav = document.getElementById('nav');
  const progress = document.getElementById('progress');
  const onScroll = () => {
    const y = window.scrollY;
    nav.setAttribute('data-scrolled', y > 24 ? 'true' : 'false');
    const max = document.documentElement.scrollHeight - window.innerHeight;
    progress.style.width = (max > 0 ? Math.min(100, (y / max) * 100) : 0) + '%';
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ---------- Mobile burger ---------- */
  const burger = document.getElementById('burger');
  burger.addEventListener('click', () => {
    const open = nav.getAttribute('data-open') === 'true';
    nav.setAttribute('data-open', open ? 'false' : 'true');
    burger.setAttribute('aria-expanded', open ? 'false' : 'true');
  });
  document.querySelectorAll('#mobileMenu a').forEach(a => {
    a.addEventListener('click', () => {
      nav.setAttribute('data-open', 'false');
      burger.setAttribute('aria-expanded', 'false');
    });
  });

  /* ---------- Reveal on scroll ---------- */
  const io = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('in');
        io.unobserve(e.target);
      }
    });
  }, { threshold: 0.15, rootMargin: '0px 0px -60px 0px' });

  document.querySelectorAll('[data-reveal], [data-reveal-lines]').forEach(el => io.observe(el));

  /* ---------- Visualização ampliada dos projetos ---------- */
  const lightbox = document.getElementById('projectLightbox');

  if (typeof lightbox.showModal === 'function') {
    const projectLinks = Array.from(document.querySelectorAll('.portfolio-grid .work .frame'));
    const image = document.getElementById('lightboxImage');
    const title = document.getElementById('lightboxTitle');
    const detail = document.getElementById('lightboxDetail');
    const count = document.getElementById('lightboxCount');
    const status = document.getElementById('lightboxStatus');
    let activeProject = 0;
    let opener;
    let pointerStartedOutside = false;

    const showProject = (index) => {
      activeProject = (index + projectLinks.length) % projectLinks.length;
      const link = projectLinks[activeProject];
      const project = link.closest('.work');
      const position = activeProject + 1;

      image.alt = link.querySelector('img').alt;
      image.src = link.href;
      title.textContent = project.querySelector('h3').textContent;
      detail.textContent = project.querySelector('.work-detail').textContent;
      count.textContent = position + ' / ' + projectLinks.length;
      status.textContent = 'Projeto ' + position + ' de ' + projectLinks.length + ': ' + title.textContent;
    };

    projectLinks.forEach((link, index) => {
      link.setAttribute('aria-haspopup', 'dialog');
      link.addEventListener('click', (event) => {
        if (event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return;

        event.preventDefault();
        opener = link;
        showProject(index);
        lightbox.showModal();
      });
    });

    lightbox.querySelector('[data-lightbox-close]').addEventListener('click', () => lightbox.close());
    lightbox.querySelector('[data-lightbox-prev]').addEventListener('click', () => showProject(activeProject - 1));
    lightbox.querySelector('[data-lightbox-next]').addEventListener('click', () => showProject(activeProject + 1));

    lightbox.addEventListener('keydown', (event) => {
      if (event.key !== 'ArrowLeft' && event.key !== 'ArrowRight') return;

      event.preventDefault();
      showProject(activeProject + (event.key === 'ArrowRight' ? 1 : -1));
    });

    lightbox.addEventListener('pointerdown', (event) => {
      pointerStartedOutside = event.target === lightbox;
    });
    lightbox.addEventListener('click', (event) => {
      if (pointerStartedOutside && event.target === lightbox) lightbox.close();
    });
    lightbox.addEventListener('close', () => {
      if (!lightbox.open) opener?.focus({ preventScroll: true });
    });
  }

  /* ---------- Validação do formulário de demonstração ---------- */
  const form = document.getElementById('contactForm');
  const feedback = document.getElementById('formFeedback');
  const fields = Array.from(form.querySelectorAll('[required]'));

  const validateField = (field) => {
    const validEmail = field.type !== 'email' || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(field.value);
    const valid = Boolean(field.value.trim()) && field.validity.valid && validEmail;
    const error = document.getElementById(field.id + '-error');

    error.hidden = valid;
    if (valid) {
      field.removeAttribute('aria-invalid');
      field.removeAttribute('aria-describedby');
    } else {
      field.setAttribute('aria-invalid', 'true');
      field.setAttribute('aria-describedby', error.id);
    }
    return valid;
  };

  form.addEventListener('input', (event) => {
    feedback.textContent = '';
    if (event.target.hasAttribute('aria-invalid')) validateField(event.target);
  });

  form.addEventListener('submit', (event) => {
    event.preventDefault();
    feedback.textContent = '';

    const invalidFields = fields.filter((field) => !validateField(field));
    if (invalidFields.length) {
      invalidFields[0].focus();
      return;
    }

    feedback.textContent = 'Campos validados. Nenhuma mensagem foi enviada.';
  });
  form.querySelector('[type="submit"]').disabled = false;

  /* ---------- Video polite fallback (autoplay on iOS Low Power) ---------- */
  document.querySelectorAll('video:not(#buildVideo)').forEach(v => {
    v.addEventListener('canplay', () => { v.play().catch(() => {}); }, { once: true });
  });

  /* ---------- Build Sequence · GSAP ScrollTrigger ---------- */
  const initBuildSequence = () => {
    const section   = document.getElementById('buildSeq');
    const stage     = document.getElementById('buildStage');
    const video     = document.getElementById('buildVideo');
    const progress  = document.getElementById('buildProgress');
    const blocks    = Array.from(document.querySelectorAll('.build-block'));
    if (!section || !stage || !video || blocks.length !== 3) return;

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined' || reduced) {
      section.classList.add('build-fallback');
      video.setAttribute('loop', '');
      video.play().catch(() => {});
      return;
    }

    gsap.registerPlugin(ScrollTrigger);

    let done = false;

    const setup = () => {
      if (done) return;
      const duration = video.duration;
      if (!duration || !isFinite(duration)) return;
      done = true;

      // Stop autoplay — scroll takes over playback. Frame 0 is already painted.
      try { video.pause(); video.currentTime = 0; } catch (e) {}

      const scrollLen = () => Math.round(window.innerHeight * 5);

      const tl = gsap.timeline({
        defaults: { ease: 'power2.out' },
        scrollTrigger: {
          trigger: section,
          start: 'top top',
          end: () => '+=' + scrollLen(),
          pin: stage,
          pinSpacing: true,
          scrub: 0.6,
          anticipatePin: 1,
          invalidateOnRefresh: true,
          onUpdate: (self) => {
            const t = self.progress * duration;
            if (!isNaN(t) && video.readyState >= 2) {
              video.currentTime = t;
            }
            if (progress) {
              progress.textContent = String(Math.round(self.progress * 100)).padStart(2, '0') + '%';
            }
          }
        }
      });

      tl.fromTo(blocks[0],
        { autoAlpha: 0, x: -48, y: '-50%' },
        { autoAlpha: 1, x: 0,   y: '-50%', duration: 0.08 },
        0.05
      );
      tl.to(blocks[0],
        { autoAlpha: 0, x: -32, y: '-50%', duration: 0.07, ease: 'power2.in' },
        0.28
      );

      tl.fromTo(blocks[1],
        { autoAlpha: 0, x: 48,  y: '-50%' },
        { autoAlpha: 1, x: 0,   y: '-50%', duration: 0.08 },
        0.38
      );
      tl.to(blocks[1],
        { autoAlpha: 0, x: 32,  y: '-50%', duration: 0.07, ease: 'power2.in' },
        0.60
      );

      tl.fromTo(blocks[2],
        { autoAlpha: 0, x: -48, y: '-50%' },
        { autoAlpha: 1, x: 0,   y: '-50%', duration: 0.08 },
        0.70
      );
      tl.to(blocks[2],
        { autoAlpha: 0, x: -32, y: '-50%', duration: 0.07, ease: 'power2.in' },
        0.93
      );

      tl.set({}, {}, 1);

      ScrollTrigger.refresh();
    };

    // Wait for the first frame to be decoded (readyState >= 2) so the video
    // is painted before we enable scrubbing. This avoids the black-screen flash.
    if (video.readyState >= 2 && !isNaN(video.duration)) {
      setup();
    } else {
      video.addEventListener('loadeddata', setup, { once: true });
      video.addEventListener('canplay',    setup, { once: true });
      video.load();
    }
  };

  if (document.readyState === 'complete') {
    initBuildSequence();
  } else {
    window.addEventListener('load', initBuildSequence, { once: true });
  }

})();
