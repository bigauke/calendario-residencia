import './styles/index.css';
import { createNavbar } from './components/navbar.js';
import { createHero } from './components/hero.js';
import { createCalendar } from './components/calendar.js';
import { createTimeline } from './components/timeline.js';
import { createClassList } from './components/classList.js';
import { createFooter } from './components/footer.js';

// Mount the application
function mount() {
  const app = document.getElementById('app');

  // Build page sections
  app.appendChild(createNavbar());
  app.appendChild(createHero());
  app.appendChild(createCalendar());
  app.appendChild(createTimeline());
  app.appendChild(createClassList());
  app.appendChild(createFooter());

  // Global intersection observer for fade-up animations
  const fadeObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
        }
      });
    },
    { rootMargin: '0px 0px -80px 0px', threshold: 0 }
  );

  document.querySelectorAll('.fade-up').forEach((el) => {
    fadeObserver.observe(el);
  });
}

// Wait for DOM
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', mount);
} else {
  mount();
}
