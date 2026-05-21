// ===== script.js — Amod Silva Teacher Portfolio =====

document.addEventListener('DOMContentLoaded', () => {

  // ───────────────────────────────────────────
  // DARK / LIGHT MODE TOGGLE
  // ───────────────────────────────────────────
  const themeToggle = document.getElementById('themeToggle');
  const savedTheme  = localStorage.getItem('theme') || 'light';
  document.documentElement.setAttribute('data-theme', savedTheme);

  themeToggle?.addEventListener('click', () => {
    const current = document.documentElement.getAttribute('data-theme');
    const next    = current === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', next);
    localStorage.setItem('theme', next);
  });


  // ───────────────────────────────────────────
  // MOBILE NAV TOGGLE
  // ───────────────────────────────────────────
  const menuToggle = document.getElementById('menuToggle');
  const navMenu    = document.getElementById('navMenu');

  menuToggle?.addEventListener('click', () => {
    const isOpen = navMenu.classList.toggle('active');
    menuToggle.classList.toggle('open', isOpen);
    menuToggle.setAttribute('aria-expanded', isOpen);
  });

  // Close nav when a link is clicked
  navMenu?.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
      navMenu.classList.remove('active');
      menuToggle?.classList.remove('open');
    });
  });


  // ───────────────────────────────────────────
  // SEARCH
  // ───────────────────────────────────────────
  const searchInput   = document.getElementById('searchInput');
  const searchClear   = document.getElementById('searchClear');
  const searchResults = document.getElementById('searchResults');

  const sectionIconMap = {
    about:    { icon: 'fa-solid fa-user',            color: '#0e6e9a' },
    subjects: { icon: 'fa-solid fa-chalkboard-user', color: '#0e6e9a' },
    contact:  { icon: 'fa-solid fa-envelope',        color: '#0e6e9a' },
    'map-section': { icon: 'fa-solid fa-map-location-dot', color: '#ef4444' },
  };

  const sectionIndex = [];
  document.querySelectorAll('section[data-search-title]').forEach(sec => {
    sectionIndex.push({
      id:    sec.id,
      title: sec.getAttribute('data-search-title'),
      text:  sec.getAttribute('data-search-text') || '',
      icon:  sectionIconMap[sec.id] || { icon: 'fa-solid fa-circle', color: '#0e6e9a' },
    });
  });

  function renderResults(query) {
    const q = query.trim().toLowerCase();
    if (!q) { searchResults.classList.remove('open'); return; }

    const matches = sectionIndex.filter(s =>
      s.title.toLowerCase().includes(q) || s.text.toLowerCase().includes(q)
    );

    searchResults.innerHTML = '';

    if (matches.length === 0) {
      searchResults.innerHTML = `<div class="search-no-result">No results for "<strong>${escapeHtml(query)}</strong>"</div>`;
    } else {
      matches.forEach(m => {
        const item = document.createElement('div');
        item.className = 'search-result-item';
        item.innerHTML = `
          <div class="result-icon" style="color:${m.icon.color}">
            <i class="${m.icon.icon}"></i>
          </div>
          <div>
            <div class="result-label">${m.title}</div>
            <div class="result-sub">Jump to section</div>
          </div>`;
        item.addEventListener('click', () => {
          document.getElementById(m.id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
          searchInput.value = '';
          searchClear.classList.remove('visible');
          searchResults.classList.remove('open');
        });
        searchResults.appendChild(item);
      });
    }
    searchResults.classList.add('open');
  }

  function escapeHtml(str) {
    return str.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
  }

  searchInput?.addEventListener('input', () => {
    searchClear.classList.toggle('visible', searchInput.value.length > 0);
    renderResults(searchInput.value);
  });

  searchClear?.addEventListener('click', () => {
    searchInput.value = '';
    searchClear.classList.remove('visible');
    searchResults.classList.remove('open');
    searchInput.focus();
  });

  document.addEventListener('click', e => {
    if (!document.getElementById('navSearchWrap')?.contains(e.target)) {
      searchResults?.classList.remove('open');
    }
  });

  searchInput?.addEventListener('keydown', e => {
    if (e.key === 'Escape') { searchResults.classList.remove('open'); searchInput.blur(); }
  });


  // ───────────────────────────────────────────
  // SMOOTH SCROLL — anchor links
  // ───────────────────────────────────────────
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });


  // ───────────────────────────────────────────
  // ACTIVE NAV HIGHLIGHT
  // ───────────────────────────────────────────
  const sections = document.querySelectorAll('section[id]');

  function updateActiveNav() {
    let current = '';
    sections.forEach(sec => {
      if (window.scrollY >= sec.offsetTop - 100) current = sec.id;
    });
    document.querySelectorAll('.nav-link').forEach(link => {
      link.classList.toggle('active', link.getAttribute('href') === `#${current}`);
    });
  }

  window.addEventListener('scroll', updateActiveNav, { passive: true });
  updateActiveNav();


  // ───────────────────────────────────────────
  // SCROLL REVEAL
  // ───────────────────────────────────────────
  const revealEls = document.querySelectorAll(
    '.card, .contact-item, .about-text p, .section-title, .stat-card'
  );

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });

  revealEls.forEach(el => {
    el.classList.add('reveal-hidden');
    observer.observe(el);
  });


  // ───────────────────────────────────────────
  // HERO PARALLAX
  // ───────────────────────────────────────────
  const hero = document.querySelector('.hero');
  if (hero) {
    window.addEventListener('scroll', () => {
      hero.style.backgroundPositionY = `${window.scrollY * 0.3}px`;
    }, { passive: true });
  }


  // ───────────────────────────────────────────
  // TYPED DESIGNATION
  // ───────────────────────────────────────────
  const designation = document.querySelector('.designation');
  if (designation) {
    const text = designation.textContent.trim();
    designation.textContent = '';
    designation.style.borderRight = '2px solid rgba(255,255,255,0.65)';

    let i = 0;
    const type = () => {
      if (i < text.length) {
        designation.textContent += text[i++];
        setTimeout(type, 52);
      } else {
        setTimeout(() => { designation.style.borderRight = 'none'; }, 900);
      }
    };
    setTimeout(type, 700);
  }


  // ───────────────────────────────────────────
  // RIPPLE EFFECT — contact items
  // ───────────────────────────────────────────
  document.querySelectorAll('.contact-item').forEach(item => {
    item.addEventListener('click', function(e) {
      const ripple = document.createElement('span');
      ripple.className = 'ripple';
      const rect = this.getBoundingClientRect();
      ripple.style.left = `${e.clientX - rect.left}px`;
      ripple.style.top  = `${e.clientY - rect.top}px`;
      this.appendChild(ripple);
      ripple.addEventListener('animationend', () => ripple.remove());
    });
  });


  // ───────────────────────────────────────────
  // FOOTER YEAR
  // ───────────────────────────────────────────
  const yearEl = document.getElementById('footerYear');
  if (yearEl) yearEl.textContent = new Date().getFullYear();


  // ───────────────────────────────────────────
  // LOGIN MODAL
  // ───────────────────────────────────────────
  const loginBtn   = document.getElementById('loginBtn');
  const loginModal = document.getElementById('loginModal');
  const modalClose = document.getElementById('modalClose');
  const loginForm  = document.getElementById('loginForm');
  const loginSubmit   = document.getElementById('loginSubmit');
  const loginBtnText  = document.getElementById('loginBtnText');
  const loginSpinner  = document.getElementById('loginSpinner');
  const emailInput    = document.getElementById('loginEmail');
  const pwInput       = document.getElementById('loginPassword');
  const emailError    = document.getElementById('emailError');
  const pwError       = document.getElementById('pwError');
  const pwToggle      = document.getElementById('pwToggle');
  const pwIcon        = document.getElementById('pwIcon');
  const contactFromModal = document.getElementById('contactFromModal');

  function openModal() {
    loginModal.classList.add('open');
    document.body.style.overflow = 'hidden';
    setTimeout(() => emailInput?.focus(), 300);
  }

  function closeModal() {
    loginModal.classList.remove('open');
    document.body.style.overflow = '';
    // Reset form
    loginForm?.reset();
    emailError && (emailError.textContent = '');
    pwError    && (pwError.textContent    = '');
    emailInput?.classList.remove('error');
    pwInput?.classList.remove('error');
    // Hide success if shown
    const successEl = document.querySelector('.modal-success');
    if (successEl) { successEl.style.display = 'none'; }
    if (loginForm) { loginForm.style.display = 'flex'; }
    const footNote = document.querySelector('.modal-footer-note');
    if (footNote) footNote.style.display = '';
  }

  loginBtn?.addEventListener('click', openModal);
  modalClose?.addEventListener('click', closeModal);

  // Close on overlay click
  loginModal?.addEventListener('click', e => {
    if (e.target === loginModal) closeModal();
  });

  // Close on Escape
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && loginModal?.classList.contains('open')) closeModal();
  });

  // Password show/hide
  pwToggle?.addEventListener('click', () => {
    const isText = pwInput.type === 'text';
    pwInput.type = isText ? 'password' : 'text';
    pwIcon.className = isText ? 'fa-solid fa-eye' : 'fa-solid fa-eye-slash';
  });

  // Validation helpers
  function validateEmail(v) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim());
  }

  function setError(input, errorEl, msg) {
    errorEl.textContent = msg;
    input.classList.toggle('error', !!msg);
  }

  // Form submit
  loginForm?.addEventListener('submit', async e => {
    e.preventDefault();

    // Validate
    let valid = true;

    if (!emailInput.value.trim()) {
      setError(emailInput, emailError, 'Email is required.');
      valid = false;
    } else if (!validateEmail(emailInput.value)) {
      setError(emailInput, emailError, 'Please enter a valid email address.');
      valid = false;
    } else {
      setError(emailInput, emailError, '');
    }

    if (!pwInput.value.trim()) {
      setError(pwInput, pwError, 'Password is required.');
      valid = false;
    } else if (pwInput.value.length < 6) {
      setError(pwInput, pwError, 'Password must be at least 6 characters.');
      valid = false;
    } else {
      setError(pwInput, pwError, '');
    }

    if (!valid) return;

    // Simulate loading
    loginSubmit.disabled = true;
    loginBtnText.textContent = 'Signing in…';
    loginSpinner.style.display = 'inline-block';

    await new Promise(r => setTimeout(r, 1600));

    // Show success
    loginForm.style.display = 'none';
    const footNote = document.querySelector('.modal-footer-note');
    if (footNote) footNote.style.display = 'none';

    // Inject success state if not already present
    let successEl = document.querySelector('.modal-success');
    if (!successEl) {
      successEl = document.createElement('div');
      successEl.className = 'modal-success';
      successEl.innerHTML = `
        <div class="success-icon"><i class="fa-solid fa-check"></i></div>
        <h3>Login Successful!</h3>
        <p>Welcome back! Redirecting you to the student portal…</p>`;
      loginForm.parentElement.insertBefore(successEl, loginForm.nextSibling);
    }
    successEl.style.display = 'block';

    // Reset button state
    loginSubmit.disabled = false;
    loginBtnText.textContent = 'Sign In';
    loginSpinner.style.display = 'none';

    // Auto-close after 2.5s
    setTimeout(closeModal, 2500);
  });

  // Contact from modal link
  contactFromModal?.addEventListener('click', e => {
    e.preventDefault();
    closeModal();
    setTimeout(() => {
      document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 200);
  });

});
