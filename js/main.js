// Mobile nav toggle
document.addEventListener('DOMContentLoaded', function() {
  var hamburger = document.getElementById('hamburger');
  var navLinks = document.getElementById('navLinks');

  if (hamburger) {
    hamburger.addEventListener('click', function() {
      navLinks.classList.toggle('open');
    });
  }

  // Close mobile nav on link click
  document.querySelectorAll('.nav-links a').forEach(function(link) {
    link.addEventListener('click', function() {
      if (navLinks) navLinks.classList.remove('open');
    });
  });

  // Signup dropdown
  var signupBtn = document.querySelector('.nav-signup-btn');
  var signupDropdown = document.querySelector('.signup-dropdown');
  if (signupBtn && signupDropdown) {
    signupBtn.addEventListener('click', function(e) {
      e.stopPropagation();
      signupDropdown.classList.toggle('open');
    });
    document.addEventListener('click', function() {
      signupDropdown.classList.remove('open');
    });
  }

  // Generic tabs
  document.querySelectorAll('[data-tab-group]').forEach(function(group) {
    var btns = group.querySelectorAll('.tab-btn');
    btns.forEach(function(btn) {
      btn.addEventListener('click', function() {
        var target = btn.dataset.tab;
        var parent = group.closest('section') || group.parentElement;
        btns.forEach(function(b) { b.classList.remove('active'); });
        parent.querySelectorAll('.tab-content').forEach(function(c) { c.classList.remove('active'); });
        btn.classList.add('active');
        var el = parent.querySelector('#tab-' + target);
        if (el) el.classList.add('active');
      });
    });
  });

  // Form tabs (contact page)
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

  // Stub form submissions
  document.querySelectorAll('form').forEach(function(form) {
    form.addEventListener('submit', function(e) {
      e.preventDefault();
      var btn = form.querySelector('button[type="submit"], .form-submit');
      if (!btn) return;
      var original = btn.textContent;
      btn.textContent = 'Sent!';
      btn.style.background = '#16A34A';
      setTimeout(function() {
        btn.textContent = original;
        btn.style.background = '';
        form.reset();
      }, 2000);
    });
  });

  // Intersection Observer for fade-in
  var observer = new IntersectionObserver(function(entries) {
    entries.forEach(function(entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  }, { threshold: 0.1 });

  document.querySelectorAll('.fade-in').forEach(function(el) {
    observer.observe(el);
  });

  // Set active nav link
  var path = window.location.pathname;
  document.querySelectorAll('.nav-links a').forEach(function(link) {
    var href = link.getAttribute('href');
    if (href === path || (path === '/' && href === '/') || (path === '/index.html' && href === '/')) {
      link.classList.add('active');
    } else if (href !== '/' && path.indexOf(href) === 0) {
      link.classList.add('active');
    }
  });
});
