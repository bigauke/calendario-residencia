export function createScrollTop() {
  // --- Button ---
  const btn = document.createElement('button');
  btn.className = 'scroll-top-btn';
  btn.setAttribute('aria-label', 'Voltar ao topo');
  btn.title = 'Voltar ao topo';

  // SVG arrow up icon
  btn.innerHTML = `
    <svg class="scroll-top-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
      <path d="M12 19V5M5 12l7-7 7 7"/>
    </svg>
    <span class="scroll-top-label">Início</span>
  `;

  document.body.appendChild(btn);

  // --- Show/Hide Logic with threshold ---
  const SHOW_THRESHOLD = 400; // px scrolled before showing

  const updateVisibility = () => {
    if (window.scrollY > SHOW_THRESHOLD) {
      btn.classList.add('visible');
    } else {
      btn.classList.remove('visible');
    }
  };

  // Throttle scroll events for performance
  let ticking = false;
  window.addEventListener('scroll', () => {
    if (!ticking) {
      requestAnimationFrame(() => {
        updateVisibility();
        ticking = false;
      });
      ticking = true;
    }
  }, { passive: true });

  // --- Click: smooth scroll to top ---
  btn.addEventListener('click', () => {
    btn.classList.add('clicked');
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setTimeout(() => btn.classList.remove('clicked'), 600);
  });

  return btn;
}
