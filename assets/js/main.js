(function () {
  const systemReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const stored = localStorage.getItem('motion-off');
  const motionOff = stored === null ? systemReduced : stored === 'true';
  document.body.classList.toggle('motion-off', motionOff);

  const toggle = document.getElementById('motion-toggle');
  function syncToggleLabel() {
    if (!toggle) return;
    const off = document.body.classList.contains('motion-off');
    toggle.textContent = off ? 'Motion: off' : 'Motion: on';
    toggle.setAttribute('aria-pressed', String(off));
  }
  syncToggleLabel();
  if (toggle) {
    toggle.addEventListener('click', () => {
      const off = document.body.classList.toggle('motion-off');
      localStorage.setItem('motion-off', String(off));
      syncToggleLabel();
    });
  }

  const veil = document.getElementById('veil');
  if (veil) {
    function openPage() {
      veil.classList.add('lift');
      document.body.classList.add('opened');
    }
    if (motionOff) {
      openPage();
    } else {
      window.addEventListener('load', () => setTimeout(openPage, 500));
      setTimeout(openPage, 1400);
    }
  } else {
    document.body.classList.add('opened');
  }

  const navbar = document.getElementById('navbar');
  if (navbar) {
    window.addEventListener('scroll', () => {
      navbar.classList.toggle('scrolled', window.scrollY > 30);
    }, { passive: true });
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        setTimeout(() => entry.target.classList.add('visible'), i * 60);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });
  window.observeFadeIns = function (root) {
    (root || document).querySelectorAll('.fade-in:not(.fade-in-bound)').forEach(el => {
      el.classList.add('fade-in-bound');
      observer.observe(el);
    });
  };
  window.observeFadeIns();

  function motionIsOff() { return document.body.classList.contains('motion-off'); }
  const finePointer = window.matchMedia('(pointer: fine)').matches;

  const aura = document.getElementById('cursor-aura');
  if (aura && finePointer) {
    let ax = innerWidth / 2, ay = innerHeight / 2, tx = ax, ty = ay;
    addEventListener('mousemove', (e) => {
      tx = e.clientX; ty = e.clientY;
      if (!motionIsOff()) aura.classList.add('on');
    }, { passive: true });
    (function tick() {
      if (!motionIsOff()) {
        ax += (tx - ax) * 0.08;
        ay += (ty - ay) * 0.08;
        aura.style.transform = `translate(${ax}px, ${ay}px)`;
      }
      requestAnimationFrame(tick);
    })();
  }

  if (finePointer) {
    document.querySelectorAll('.hover-card').forEach(card => {
      card.addEventListener('mousemove', (e) => {
        if (motionIsOff()) return;
        const r = card.getBoundingClientRect();
        card.style.setProperty('--mx', ((e.clientX - r.left) / r.width * 100) + '%');
        card.style.setProperty('--my', ((e.clientY - r.top) / r.height * 100) + '%');
      });
    });

    const frame = document.getElementById('photo-frame');
    if (frame) {
      frame.addEventListener('mousemove', (e) => {
        if (motionIsOff()) { frame.style.transform = ''; return; }
        const r = frame.getBoundingClientRect();
        const rx = ((e.clientY - r.top) / r.height - 0.5) * -6;
        const ry = ((e.clientX - r.left) / r.width - 0.5) * 6;
        frame.style.transform = `rotateX(${rx}deg) rotateY(${ry}deg) translateY(-4px)`;
      });
      frame.addEventListener('mouseleave', () => { frame.style.transform = ''; });
    }
  }
})();
