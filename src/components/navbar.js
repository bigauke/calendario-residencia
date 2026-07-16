import { createElement } from '../utils.js';

const SECTIONS = [
  { id: 'hero', label: 'Início' },
  { id: 'calendar', label: 'Calendário' },
  { id: 'timeline', label: 'Timeline' },
  { id: 'classlist', label: 'Aulas' },
];

export function createNavbar() {
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

  const toggle = createElement('button', {
    className: 'navbar-mobile-toggle',
    id: 'navbar-toggle',
    'aria-label': 'Menu',
    innerHTML: '<span></span><span></span><span></span>',
  });

  inner.appendChild(brand);
  inner.appendChild(links);
  inner.appendChild(toggle);
  nav.appendChild(inner);

  // Scroll behavior
  let lastScroll = 0;
  window.addEventListener('scroll', () => {
    const scrollY = window.scrollY;
    nav.classList.toggle('scrolled', scrollY > 50);
    lastScroll = scrollY;
  });

  // Mobile toggle
  toggle.addEventListener('click', () => {
    links.classList.toggle('open');
  });

  // Close mobile menu on link click
  links.addEventListener('click', (e) => {
    if (e.target.tagName === 'A') {
      links.classList.remove('open');
    }
  });

  // Scroll spy
  const observerOptions = {
    rootMargin: '-20% 0px -70% 0px',
    threshold: 0,
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const id = entry.target.id;
        links.querySelectorAll('a').forEach((a) => {
          a.classList.toggle('active', a.dataset.section === id);
        });
      }
    });
  }, observerOptions);

  // Observe sections after DOM is ready
  requestAnimationFrame(() => {
    SECTIONS.forEach(({ id }) => {
      const section = document.getElementById(id);
      if (section) observer.observe(section);
    });
  });

  return nav;
}
