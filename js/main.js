document.addEventListener('DOMContentLoaded', function() {

  // ── Mobile nav toggle ─────────────────────────────────────────────────────
  var hamburger = document.getElementById('hamburger');
  var navLinks = document.getElementById('navLinks');

  if (hamburger && navLinks) {
    hamburger.setAttribute('aria-expanded', 'false');
    hamburger.setAttribute('aria-controls', 'navLinks');
    navLinks.setAttribute('aria-label', 'Main navigation');
    hamburger.addEventListener('click', function() {
      var isOpen = navLinks.classList.toggle('open');
      hamburger.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
      hamburger.setAttribute('aria-label', isOpen ? 'Close navigation' : 'Open navigation');
    });
    // Close on outside click
    document.addEventListener('click', function(e) {
      if (!hamburger.contains(e.target) && !navLinks.contains(e.target)) {
        navLinks.classList.remove('open');
        hamburger.setAttribute('aria-expanded', 'false');
      }
    });
    // Close on Escape
    document.addEventListener('keydown', function(e) {
      if (e.key === 'Escape' && navLinks.classList.contains('open')) {
        navLinks.classList.remove('open');
        hamburger.setAttribute('aria-expanded', 'false');
        hamburger.focus();
      }
    });
  }

  // Close mobile nav on link click
  document.querySelectorAll('.nav-links a').forEach(function(link) {
    link.addEventListener('click', function() {
      if (navLinks) {
        navLinks.classList.remove('open');
        if (hamburger) hamburger.setAttribute('aria-expanded', 'false');
      }
    });
  });

  // ── Signup dropdown ───────────────────────────────────────────────────────
  var signupBtn = document.querySelector('.nav-signup-btn');
  var signupDropdown = document.querySelector('.signup-dropdown');
  if (signupBtn && signupDropdown) {
    signupBtn.setAttribute('aria-haspopup', 'true');
    signupBtn.setAttribute('aria-expanded', 'false');
    signupBtn.addEventListener('click', function(e) {
      e.stopPropagation();
      var isOpen = signupDropdown.classList.toggle('open');
      signupBtn.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    });
    document.addEventListener('click', function() {
      signupDropdown.classList.remove('open');
      signupBtn.setAttribute('aria-expanded', 'false');
    });
    // Keyboard: close on Escape
    document.addEventListener('keydown', function(e) {
      if (e.key === 'Escape' && signupDropdown.classList.contains('open')) {
        signupDropdown.classList.remove('open');
        signupBtn.setAttribute('aria-expanded', 'false');
        signupBtn.focus();
      }
    });
  }

  // ── Generic tabs ──────────────────────────────────────────────────────────
  document.querySelectorAll('[data-tab-group]').forEach(function(group) {
    var btns = group.querySelectorAll('.tab-btn');
    btns.forEach(function(btn) {
      btn.setAttribute('role', 'tab');
      btn.addEventListener('click', function() {
        var target = btn.dataset.tab;
        var parent = group.closest('section') || group.parentElement;
        btns.forEach(function(b) { b.classList.remove('active'); b.setAttribute('aria-selected', 'false'); });
        parent.querySelectorAll('.tab-content').forEach(function(c) { c.classList.remove('active'); });
        btn.classList.add('active');
        btn.setAttribute('aria-selected', 'true');
        var el = parent.querySelector('#tab-' + target);
        if (el) el.classList.add('active');
      });
    });
  });

  // ── Form tabs (contact page) ──────────────────────────────────────────────
  document.querySelectorAll('.form-tab').forEach(function(tab) {
    tab.addEventListener('click', function() {
      var parent = tab.closest('.form-container');
      parent.querySelectorAll('.form-tab').forEach(function(t) { t.classList.remove('active'); });
      tab.classList.add('active');
      parent.querySelectorAll('.form-panel').forEach(function(f) { f.style.display = 'none'; });
      var panel = parent.querySelector('#form-' + tab.dataset.form);
      if (panel) panel.style.display = 'block';
    });
  });

  // ── Newsletter form ───────────────────────────────────────────────────────
  var newsletter = document.querySelector('.newsletter-form');
  if (newsletter) {
    newsletter.addEventListener('submit', function(e) {
      e.preventDefault();
      var input = newsletter.querySelector('input[type="email"]');
      var btn = newsletter.querySelector('button');
      if (!input || !input.value.trim()) {
        input && input.focus();
        return;
      }
      var original = btn.textContent;
      btn.textContent = '✓ Subscribed!';
      btn.style.background = '#16A34A';
      btn.disabled = true;
      setTimeout(function() {
        btn.textContent = original;
        btn.style.background = '';
        btn.disabled = false;
        newsletter.reset();
      }, 3000);
    });
  }

  // ── General form stub (non-recruit, non-newsletter) ───────────────────────
  document.querySelectorAll('form:not(.recruit-form):not(.newsletter-form):not(#coachRecruitForm)').forEach(function(form) {
    if (form.dataset.stubbed) return;
    form.dataset.stubbed = '1';
    form.addEventListener('submit', function(e) {
      e.preventDefault();
      var btn = form.querySelector('button[type="submit"], .form-submit');
      if (!btn) return;
      var original = btn.textContent;
      btn.textContent = '✓ Sent!';
      btn.style.background = '#16A34A';
      btn.disabled = true;
      setTimeout(function() {
        btn.textContent = original;
        btn.style.background = '';
        btn.disabled = false;
        form.reset();
      }, 2500);
    });
  });

  // ── Intersection Observer for fade-in ─────────────────────────────────────
  if ('IntersectionObserver' in window) {
    var observer = new IntersectionObserver(function(entries) {
      entries.forEach(function(entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1 });
    document.querySelectorAll('.fade-in').forEach(function(el) {
      observer.observe(el);
    });
  } else {
    document.querySelectorAll('.fade-in').forEach(function(el) { el.classList.add('visible'); });
  }

  // ── Active nav link ───────────────────────────────────────────────────────
  var path = window.location.pathname;
  document.querySelectorAll('.nav-links a').forEach(function(link) {
    var href = link.getAttribute('href');
    if (!href) return;
    var isActive = (href === path) ||
      (path === '/' && href === '/') ||
      (path === '/index.html' && href === '/') ||
      (href !== '/' && path.indexOf(href) === 0);
    if (isActive) {
      link.classList.add('active');
      link.setAttribute('aria-current', 'page');
    }
  });

  // ── Modal keyboard trap ───────────────────────────────────────────────────
  function trapFocus(modal) {
    var focusable = modal.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    if (!focusable.length) return;
    var first = focusable[0], last = focusable[focusable.length - 1];
    modal.addEventListener('keydown', function(e) {
      if (e.key !== 'Tab') return;
      if (e.shiftKey) {
        if (document.activeElement === first) { e.preventDefault(); last.focus(); }
      } else {
        if (document.activeElement === last) { e.preventDefault(); first.focus(); }
      }
    });
  }

  // Apply to recruit modal if present
  var recruitOverlay = document.getElementById('recruitModalOverlay') || document.getElementById('coachRecruitOverlay');
  if (recruitOverlay) {
    var modal = recruitOverlay.querySelector('.recruit-modal');
    if (modal) trapFocus(modal);
    // Close on Escape
    document.addEventListener('keydown', function(e) {
      if (e.key === 'Escape' && recruitOverlay.classList.contains('open')) {
        recruitOverlay.classList.remove('open');
        document.body.style.overflow = '';
      }
    });
  }

});
