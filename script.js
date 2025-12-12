(() => {
  const $ = (q, el = document) => el.querySelector(q);
  const $$ = (q, el = document) => Array.from(el.querySelectorAll(q));

  const header = $('[data-header]');
  const nav = $('[data-nav]');
  const menuToggle = $('[data-menu-toggle]');
  const themeToggle = $('[data-theme-toggle]');
  const year = $('[data-year]');
  const toast = $('[data-toast]');

  // ====== Helpers
  const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
  const showToast = async (msg) => {
    if (!toast) return;
    toast.textContent = msg;
    toast.classList.add('is-show');
    await sleep(1800);
    toast.classList.remove('is-show');
  };

  // ====== Year
  if (year) year.textContent = String(new Date().getFullYear());

  // ====== Theme
  const THEME_KEY = 'stoxor_theme';

  const getPreferredTheme = () => {
    const saved = localStorage.getItem(THEME_KEY);
    if (saved === 'dark' || saved === 'light') return saved;
    return window.matchMedia &&
      window.matchMedia('(prefers-color-scheme: light)').matches
      ? 'light'
      : 'dark';
  };

  const applyTheme = (t) => {
    document.documentElement.setAttribute('data-theme', t);
    if (themeToggle) {
      const icon = themeToggle.querySelector('.iconbtn__icon');
      if (icon) icon.textContent = t === 'light' ? '☀' : '☾';
    }
  };

  applyTheme(getPreferredTheme());

  themeToggle?.addEventListener('click', () => {
    const current =
      document.documentElement.getAttribute('data-theme') || 'dark';
    const next = current === 'dark' ? 'light' : 'dark';
    localStorage.setItem(THEME_KEY, next);
    applyTheme(next);
    showToast(next === 'light' ? 'Thème clair' : 'Thème sombre');
  });

  // ====== Mobile menu
  const closeMenu = () => nav?.classList.remove('is-open');

  menuToggle?.addEventListener('click', () => {
    nav?.classList.toggle('is-open');
  });

  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeMenu();
  });

  nav?.addEventListener('click', (e) => {
    const a = e.target.closest('a');
    if (!a) return;
    closeMenu();
  });

  // ====== Reveal on scroll
  const revealEls = $$('[data-reveal]');
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-revealed');
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12 }
    );

    revealEls.forEach((el) => io.observe(el));
  } else {
    revealEls.forEach((el) => el.classList.add('is-revealed'));
  }

  // ====== Scrollspy
  const links = $$('.nav__link');
  const sections = links
    .map((a) => $(a.getAttribute('href')))
    .filter(Boolean);

  const setActiveLink = () => {
    const y = window.scrollY + (header?.offsetHeight || 72) + 18;
    let current = sections[0]?.id;
    for (const sec of sections) {
      if (sec.offsetTop <= y) current = sec.id;
    }
    links.forEach((a) => {
      const id = a.getAttribute('href')?.slice(1);
      a.classList.toggle('is-active', id === current);
    });
  };

  window.addEventListener('scroll', setActiveLink, { passive: true });
  setActiveLink();

  // ====== Projects filter
  const chips = $$('[data-filter]');
  const projectsWrap = $('[data-projects]');
  const projects = projectsWrap ? $$('.project', projectsWrap) : [];

  const applyFilter = (tag) => {
    chips.forEach((c) => c.classList.toggle('is-active', c.dataset.filter === tag));
    projects.forEach((p) => {
      const tags = (p.dataset.tags || '').split(/\s+/).filter(Boolean);
      const ok = tag === 'all' || tags.includes(tag);
      p.style.display = ok ? '' : 'none';
    });
  };

  chips.forEach((btn) => {
    btn.addEventListener('click', () => applyFilter(btn.dataset.filter));
  });

  // ====== Avis clients (marquee)
  // Le défilement est en CSS. Ici on rend la boucle "infinie" robuste :
  // - si tu n'as pas dupliqué les avis en HTML, on clone une 2e fois
  // - on ajuste la durée pour garder une vitesse agréable
  const setupMarquees = () => {
    const marquees = $$('.marquee');
    marquees.forEach((m) => {
      const track = $('.marquee__track', m);
      if (!track) return;

      // Si pas de duplication (aucun aria-hidden), on clone tous les enfants une fois
      const hasHidden = !!track.querySelector('[aria-hidden="true"]');
      if (!hasHidden) {
        const children = Array.from(track.children);
        children.forEach((node) => {
          const clone = node.cloneNode(true);
          clone.setAttribute('aria-hidden', 'true');
          track.appendChild(clone);
        });
      }

      // Ajuste la durée selon la largeur d'un "cycle" (la moitié si doublé)
      const total = track.scrollWidth;
      const cycleWidth = Math.max(1, Math.round(total / 2));
      const pxPerSecond = 70;
      const seconds = Math.max(18, Math.round(cycleWidth / pxPerSecond));
      track.style.animationDuration = `${seconds}s`;

      // Pause si focus clavier à l'intérieur
      m.addEventListener('focusin', () => {
        track.style.animationPlayState = 'paused';
      });
      m.addEventListener('focusout', () => {
        track.style.animationPlayState = '';
      });
    });
  };

  window.addEventListener('load', setupMarquees, { once: true });
  window.addEventListener(
    'resize',
    () => requestAnimationFrame(setupMarquees),
    { passive: true }
  );
  setupMarquees();

  // ====== Copy email
  const emailEl = $('[data-email]');
  const email = emailEl?.textContent?.trim() || 'JeanValJean@groszeub.com';

  $$('[data-copy-email]').forEach((btn) => {
    btn.addEventListener('click', async () => {
      try {
        await navigator.clipboard.writeText(email);
        showToast('Email copié ✅');
      } catch {
        showToast('Copie impossible — sélectionne et copie manuellement.');
      }
    });
  });

  // ====== Contact form (mailto)
  const form = $('[data-form]');
  const status = $('[data-form-status]');

  const setStatus = (msg) => {
    if (status) status.textContent = msg;
  };

  form?.addEventListener('submit', (e) => {
    e.preventDefault();

    const fd = new FormData(form);
    const name = String(fd.get('name') || '').trim();
    const from = String(fd.get('email') || '').trim();
    const subject = String(fd.get('subject') || '').trim();
    const message = String(fd.get('message') || '').trim();

    if (!name || !from || !subject || !message) {
      setStatus('Merci de compléter tous les champs.');
      showToast('Champs manquants');
      return;
    }

    const body = [
      `Nom: ${name}`,
      `Email: ${from}`,
      '',
      message,
      '',
      '---',
      'Envoyé depuis le site portfolio.'
    ].join('\n');

    const mailto = `mailto:${encodeURIComponent(email)}?subject=${encodeURIComponent(
      subject
    )}&body=${encodeURIComponent(body)}`;

    window.location.href = mailto;
    setStatus('Ouverture de ton client mail…');
  });
})();
