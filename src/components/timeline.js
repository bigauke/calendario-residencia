import { aulas } from '../data/aulas.js';
import {
  groupByMonth,
  getStatus,
  getNextClass,
  formatDate,
  createElement,
} from '../utils.js';

export function createTimeline() {
  const section = createElement('section', {
    className: 'section timeline-section',
    id: 'timeline',
  });

  // Header
  const header = createElement('div', { className: 'section-header' });
  header.appendChild(createElement('h2', { className: 'section-title', textContent: 'Timeline' }));
  header.appendChild(createElement('p', {
    className: 'section-subtitle',
    textContent: 'Acompanhe a evolução do programa',
  }));
  section.appendChild(header);

  // Timeline container
  const timeline = createElement('div', { className: 'timeline' });
  const nextClass = getNextClass(aulas);
  const groups = groupByMonth(aulas);

  groups.forEach((group) => {
    const monthGroup = createElement('div', { className: 'timeline-month-group' });

    const monthLabel = createElement('div', {
      className: 'timeline-month-label',
      textContent: group.label,
    });
    monthGroup.appendChild(monthLabel);

    group.aulas.forEach((aula, index) => {
      const status = getStatus(aula.date);
      const isNext = nextClass && aula.number === nextClass.number;

      const classes = ['timeline-item'];
      if (status === 'completed') classes.push('completed');
      if (status === 'today') classes.push('today');
      if (isNext) classes.push('next');

      const item = createElement('div', { className: classes.join(' ') });

      const content = createElement('div', { className: 'timeline-item-content' });
      const left = createElement('div', { className: 'timeline-item-left' });

      left.appendChild(createElement('span', {
        className: 'timeline-item-number',
        innerHTML: `Aula ${String(aula.number).padStart(2, '0')} <span class="badge badge--${aula.category.id}" style="margin-left: 6px; font-size: 0.65rem;">${aula.category.emoji} ${aula.category.label}</span><span class="badge" style="margin-left: 4px; font-size: 0.65rem; background: var(--bg-tertiary); color: var(--text-secondary); border-color: var(--border);">⏱️ ${aula.workload || 6}h</span>`,
      }));
      left.appendChild(createElement('span', {
        className: 'timeline-item-title',
        textContent: aula.title,
      }));
      left.appendChild(createElement('span', {
        className: 'timeline-item-date',
        textContent: formatDate(aula.date),
      }));

      if (aula.instructor) {
        left.appendChild(createElement('span', {
          className: 'timeline-item-instructor',
          textContent: `👨‍🏫 ${aula.instructor}`,
          style: { display: 'block', marginTop: '4px', fontSize: '0.85rem', color: 'var(--text-secondary)' }
        }));
      }

      content.appendChild(left);

      if (aula.materialUrl) {
        content.appendChild(createElement('a', {
          className: 'btn btn--ghost',
          href: aula.materialUrl,
          target: '_blank',
          rel: 'noopener noreferrer',
          textContent: '📂 Material',
        }));
      }

      item.appendChild(content);
      monthGroup.appendChild(item);
    });

    timeline.appendChild(monthGroup);
  });

  section.appendChild(timeline);

  // Animate items with staggered delay when section enters viewport
  requestAnimationFrame(() => {
    const sectionObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            // Reveal all items with staggered animation
            const items = timeline.querySelectorAll('.timeline-item');
            items.forEach((item, i) => {
              setTimeout(() => {
                item.classList.add('visible');
              }, Math.min(i * 20, 800)); // Cap at 800ms max delay
            });
            sectionObserver.disconnect();
          }
        });
      },
      { rootMargin: '100px 0px 100px 0px', threshold: 0 }
    );

    sectionObserver.observe(section);
  });

  return section;
}
