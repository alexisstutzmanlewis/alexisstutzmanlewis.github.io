(function () {
  var body = document.body;

  /* ---------- motion preference (system setting + manual toggle) ---------- */
  var systemReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var stored = null;
  try { stored = localStorage.getItem('motion-off'); } catch (e) {}
  body.classList.toggle('motion-off', stored === null ? systemReduced : stored === 'true');

  var toggle = document.getElementById('motion-toggle');
  function syncToggle() {
    if (!toggle) return;
    var off = body.classList.contains('motion-off');
    toggle.textContent = off ? 'Motion: off' : 'Motion: on';
    toggle.setAttribute('aria-pressed', String(off));
  }
  syncToggle();
  if (toggle) {
    toggle.addEventListener('click', function () {
      var off = body.classList.toggle('motion-off');
      try { localStorage.setItem('motion-off', String(off)); } catch (e) {}
      syncToggle();
    });
  }

  /* ---------- mobile menu ---------- */
  var menuBtn = document.getElementById('menu-btn');
  var menu = document.getElementById('menu');
  function setMenu(open) {
    body.classList.toggle('menu-open', open);
    if (menuBtn) {
      menuBtn.setAttribute('aria-expanded', String(open));
      menuBtn.textContent = open ? 'Close' : 'Menu';
    }
  }
  if (menuBtn && menu) {
    menuBtn.addEventListener('click', function () { setMenu(!body.classList.contains('menu-open')); });
    menu.querySelectorAll('a').forEach(function (a) {
      a.addEventListener('click', function () { setMenu(false); });
    });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape') setMenu(false); });
    window.matchMedia('(min-width: 900px)').addEventListener('change', function (e) { if (e.matches) setMenu(false); });
  }

  /* ---------- masthead rule once scrolled ---------- */
  var masthead = document.getElementById('navbar');
  if (masthead) {
    window.addEventListener('scroll', function () {
      masthead.classList.toggle('scrolled', window.scrollY > 30);
    }, { passive: true });
  }

  /* ---------- cursor glow (fine pointers only) ---------- */
  var aura = document.getElementById('cursor-aura');
  if (aura && window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
    var ax = innerWidth / 2, ay = innerHeight / 2, tx = ax, ty = ay, vx = 0, vy = 0;
    var stiffness = 0.055, damping = 0.82;
    window.addEventListener('mousemove', function (e) {
      tx = e.clientX; ty = e.clientY;
      if (!body.classList.contains('motion-off')) aura.classList.add('on');
    }, { passive: true });
    (function tick() {
      if (!body.classList.contains('motion-off')) {
        vx = (vx + (tx - ax) * stiffness) * damping;
        vy = (vy + (ty - ay) * stiffness) * damping;
        ax += vx; ay += vy;
        aura.style.transform = 'translate(' + ax + 'px, ' + ay + 'px)';
      }
      requestAnimationFrame(tick);
    })();
  }

  /* ---------- gentle reveal ---------- */
  var observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });
  window.observeFadeIns = function (root) {
    (root || document).querySelectorAll('.fade-in:not(.fade-in-bound)').forEach(function (el) {
      el.classList.add('fade-in-bound');
      observer.observe(el);
    });
  };
  window.observeFadeIns();
})();
