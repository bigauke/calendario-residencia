import { createElement } from '../utils.js';

const SECTIONS = [
  { id: 'hero', label: 'Início' },
  { id: 'calendar', label: 'Calendário' },
  { id: 'timeline', label: 'Timeline' },
  { id: 'classlist', label: 'Aulas' },
];

// ── Theme helpers ──────────────────────────────────────────────
const STORAGE_KEY = 'tic44-theme';

function isLight() {
  return document.documentElement.classList.contains('light-mode');
}

function applyTheme(light) {
  document.documentElement.classList.toggle('light-mode', light);
  localStorage.setItem(STORAGE_KEY, light ? 'light' : 'dark');
}

function initTheme() {
  const saved = localStorage.getItem(STORAGE_KEY);
  if (saved === 'light') {
    applyTheme(true);
  } else if (saved === null) {
    // respect OS preference on first visit
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    applyTheme(!prefersDark);
  }
}

// ── Navbar factory ─────────────────────────────────────────────
export function createNavbar() {
  // Apply saved/OS theme before rendering
  initTheme();

  const nav = createElement('nav', { className: 'navbar', id: 'navbar' });
  const inner = createElement('div', { className: 'navbar-inner' });

  const brand = createElement('div', {
    className: 'navbar-brand',
    innerHTML: '📚 Residência <span>TIC 44</span> — CTE-IA',
  });

  const links = createElement('ul', { className: 'navbar-links', id: 'navbar-links' });
  SECTIONS.forEach(({ id, label }) => {
    const li = createElement('li');
    const a = createElement('a', {
      href: `#${id}`,
      textContent: label,
      dataset: { section: id },
    });
    li.appendChild(a);
    links.appendChild(li);
  });

  // ── Theme toggle button ──────────────────────────────────────
  const themeBtn = createElement('button', {
    className: 'theme-toggle',
    id: 'theme-toggle',
    'aria-label': 'Alternar tema claro/escuro',
    title: 'Alternar tema',
    innerHTML: isLight() ? '🌙' : '☀️',
  });

  themeBtn.addEventListener('click', () => {
    const nowLight = !isLight();
    applyTheme(nowLight);
    themeBtn.innerHTML = nowLight ? '🌙' : '☀️';
    themeBtn.setAttribute('aria-label', nowLight ? 'Mudar para tema escuro' : 'Mudar para tema claro');
  });

  // ── Actions wrapper (theme btn + hamburger) ──────────────────
  const actions = createElement('div', { className: 'navbar-actions' });

  const toggle = createElement('button', {
    className: 'navbar-mobile-toggle',
    id: 'navbar-toggle',
    'aria-label': 'Menu',
    innerHTML: '<span></span><span></span><span></span>',
  });

  actions.appendChild(themeBtn);
  actions.appendChild(toggle);

  inner.appendChild(brand);
  inner.appendChild(links);
  inner.appendChild(actions);
  nav.appendChild(inner);

  // ── Scroll behavior ──────────────────────────────────────────
  window.addEventListener('scroll', () => {
    nav.classList.toggle('scrolled', window.scrollY > 50);
  });

  // ── Mobile toggle ────────────────────────────────────────────
  toggle.addEventListener('click', () => {
    links.classList.toggle('open');
  });

  links.addEventListener('click', (e) => {
    if (e.target.tagName === 'A') links.classList.remove('open');
  });

  // ── Scroll spy ───────────────────────────────────────────────
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const id = entry.target.id;
          links.querySelectorAll('a').forEach((a) => {
            a.classList.toggle('active', a.dataset.section === id);
          });
        }
      });
    },
    { rootMargin: '-20% 0px -70% 0px', threshold: 0 }
  );

  requestAnimationFrame(() => {
    SECTIONS.forEach(({ id }) => {
      const section = document.getElementById(id);
      if (section) observer.observe(section);
    });
  });

  return nav;
}

