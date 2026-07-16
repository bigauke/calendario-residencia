import { aulas } from '../data/aulas.js';
import {
  getMonthName,
  getDayName,
  getAulasByMonth,
  formatDate,
  getStatus,
  createElement,
  getHoliday,
  expandAulas,
} from '../utils.js';

const expandedAulas = expandAulas(aulas);

export function createCalendar() {
  const section = createElement('section', {
    className: 'section calendar-section fade-up',
    id: 'calendar',
  });

  // Header
  const header = createElement('div', { className: 'section-header' });
  header.appendChild(createElement('h2', { className: 'section-title', textContent: 'Calendário' }));
  header.appendChild(createElement('p', {
    className: 'section-subtitle',
    textContent: 'Visualize as aulas mês a mês',
  }));
  section.appendChild(header);

  // State
  const now = new Date();
  let currentYear = now.getFullYear();
  let currentMonth = now.getMonth();

  // Navigation
  const nav = createElement('div', { className: 'calendar-nav' });
  const prevBtn = createElement('button', {
    className: 'calendar-nav-btn',
    innerHTML: '◀',
    'aria-label': 'Mês anterior',
  });
  const monthLabel = createElement('div', {
    className: 'calendar-month-label',
    id: 'calendar-month-label',
  });
  const nextBtn = createElement('button', {
    className: 'calendar-nav-btn',
    innerHTML: '▶',
    'aria-label': 'Próximo mês',
  });

  nav.appendChild(prevBtn);
  nav.appendChild(monthLabel);
  nav.appendChild(nextBtn);
  section.appendChild(nav);

  // Grid container
  const gridContainer = createElement('div', { id: 'calendar-grid-container' });
  section.appendChild(gridContainer);

  // Detail container
  const detailContainer = createElement('div', { id: 'calendar-detail' });
  section.appendChild(detailContainer);

  function renderCalendar() {
    monthLabel.textContent = `${getMonthName(currentMonth)} ${currentYear}`;

    const grid = createElement('div', { className: 'calendar-grid' });

    // Day headers
    for (let i = 0; i < 7; i++) {
      grid.appendChild(createElement('div', {
        className: 'calendar-day-header',
        textContent: getDayName(i),
      }));
    }

    // First day and days in month
    const firstDay = new Date(currentYear, currentMonth, 1).getDay();
    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
    const todayDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());

    // Get aulas for this month using the expanded schedule
    const monthAulas = getAulasByMonth(expandedAulas, currentYear, currentMonth);
    const aulasByDay = {};
    monthAulas.forEach((aula) => {
      const day = aula.date.getDate();
      if (!aulasByDay[day]) aulasByDay[day] = [];
      aulasByDay[day].push(aula);
    });

    // Empty cells before first day
    for (let i = 0; i < firstDay; i++) {
      grid.appendChild(createElement('div', { className: 'calendar-day empty' }));
    }

    // Day cells
    for (let day = 1; day <= daysInMonth; day++) {
      const cellDate = new Date(currentYear, currentMonth, day);
      const isToday = cellDate.getTime() === todayDate.getTime();
      const dayAulas = aulasByDay[day] || [];
      const hasClass = dayAulas.length > 0;
      const holidayName = getHoliday(cellDate);

      const classes = ['calendar-day'];
      if (isToday) classes.push('today');
      if (hasClass) classes.push('has-class');
      if (holidayName) classes.push('is-holiday');

      const cell = createElement('div', { className: classes.join(' ') });
      
      const dateText = createElement('span', { textContent: String(day) });
      cell.appendChild(dateText);

      if (holidayName) {
        const holidayLabel = createElement('span', { 
          className: 'calendar-holiday-label',
          textContent: holidayName 
        });
        cell.appendChild(holidayLabel);
      }

      if (hasClass) {
        const dots = createElement('div', { className: 'calendar-day-dots' });
        dayAulas.forEach((aula) => {
          dots.appendChild(createElement('div', {
            className: 'calendar-dot',
            style: { background: aula.category.color },
          }));
        });
        cell.appendChild(dots);
      }

      if (hasClass || holidayName) {
        // Click handler (only if it has classes)
        if (hasClass) {
          cell.addEventListener('click', () => {
            showDetail(dayAulas);
          });
        }

        // Tooltip on hover
        cell.addEventListener('mouseenter', (e) => {
          const tooltip = createElement('div', { className: 'tooltip' });
          let htmlContent = [];
          
          if (holidayName) {
            htmlContent.push(`<strong style="color: var(--warning)">${holidayName}</strong>`);
          }
          
          if (hasClass) {
            const classesHtml = dayAulas
              .map((a) => `<strong>${String(a.number).padStart(2, '0')}</strong> — ${a.title}`)
              .join('<br>');
            htmlContent.push(classesHtml);
          }
          
          tooltip.innerHTML = htmlContent.join('<br><br>');
          tooltip.style.left = `${e.clientX + 10}px`;
          tooltip.style.top = `${e.clientY - 10}px`;
          tooltip.style.position = 'fixed';
          tooltip.id = 'calendar-tooltip';
          document.body.appendChild(tooltip);
        });

        cell.addEventListener('mouseleave', () => {
          const tooltip = document.getElementById('calendar-tooltip');
          if (tooltip) tooltip.remove();
        });
      }

      grid.appendChild(cell);
    }

    gridContainer.innerHTML = '';
    gridContainer.appendChild(grid);
  }

  function showDetail(dayAulas) {
    detailContainer.innerHTML = '';
    const detail = createElement('div', { className: 'calendar-detail' });

    dayAulas.forEach((aula) => {
      const card = createElement('div', { className: 'calendar-detail-card' });
      const info = createElement('div', { className: 'calendar-detail-info' });

      const status = getStatus(aula.date);
      const statusLabels = { completed: '✅ Concluída', today: '🔴 Hoje', upcoming: '🔜 Futura' };

      info.appendChild(createElement('span', {
        className: 'calendar-detail-number',
        textContent: `Aula ${String(aula.number).padStart(2, '0')} • ${statusLabels[status]}`,
      }));
      info.appendChild(createElement('span', {
        className: `badge badge--${aula.category.id}`,
        textContent: `${aula.category.emoji} ${aula.category.label}`,
      }));
      info.appendChild(createElement('h3', {
        className: 'calendar-detail-title',
        textContent: aula.title,
      }));
      info.appendChild(createElement('span', {
        className: 'calendar-detail-date',
        textContent: formatDate(aula.date),
      }));

      card.appendChild(info);

      if (aula.materialUrl) {
        const btn = createElement('a', {
          className: 'btn btn--primary',
          href: aula.materialUrl,
          target: '_blank',
          rel: 'noopener noreferrer',
          innerHTML: '📂 Acessar Material',
        });
        card.appendChild(btn);
      }

      detail.appendChild(card);
    });

    detailContainer.appendChild(detail);
  }

  // Navigation handlers
  prevBtn.addEventListener('click', () => {
    currentMonth--;
    if (currentMonth < 0) {
      currentMonth = 11;
      currentYear--;
    }
    detailContainer.innerHTML = '';
    renderCalendar();
  });

  nextBtn.addEventListener('click', () => {
    currentMonth++;
    if (currentMonth > 11) {
      currentMonth = 0;
      currentYear++;
    }
    detailContainer.innerHTML = '';
    renderCalendar();
  });

  // Initial render
  requestAnimationFrame(renderCalendar);

  return section;
}
