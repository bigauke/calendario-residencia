import { aulas, CATEGORIES, months } from '../data/aulas.js';
import {
  getMonthName,
  getStatus,
  getNextClass,
  formatDate,
  createElement,
} from '../utils.js';

export function createClassList() {
  const section = createElement('section', {
    className: 'section classlist-section fade-up',
    id: 'classlist',
  });

  // Header
  const header = createElement('div', { className: 'section-header' });
  header.appendChild(createElement('h2', { className: 'section-title', textContent: 'Todas as Aulas' }));
  header.appendChild(createElement('p', {
    className: 'section-subtitle',
    textContent: 'Filtre por mês, categoria ou busque por título',
  }));
  section.appendChild(header);

  // Filters
  const filters = createElement('div', { className: 'classlist-filters' });

  // Search
  const searchWrapper = createElement('div', { className: 'filter-search-wrapper' });
  searchWrapper.appendChild(createElement('span', {
    className: 'filter-search-icon',
    textContent: '🔍',
  }));
  const searchInput = createElement('input', {
    className: 'filter-search',
    type: 'text',
    placeholder: 'Buscar por título...',
    id: 'class-search',
  });
  searchWrapper.appendChild(searchInput);
  filters.appendChild(searchWrapper);

  // Month select
  const monthSelect = createElement('select', { className: 'filter-select', id: 'month-filter' });
  monthSelect.appendChild(createElement('option', { value: 'all', textContent: 'Todos os meses' }));
  months.forEach((monthKey) => {
    const [year, month] = monthKey.split('-');
    const label = `${getMonthName(parseInt(month) - 1)} ${year}`;
    monthSelect.appendChild(createElement('option', { value: monthKey, textContent: label }));
  });
  filters.appendChild(monthSelect);

  // Category chips
  const chipsContainer = createElement('div', { className: 'filter-chips' });
  const allChip = createElement('button', {
    className: 'filter-chip active',
    textContent: 'Todas',
    dataset: { category: 'all' },
  });
  chipsContainer.appendChild(allChip);

  Object.values(CATEGORIES).forEach((cat) => {
    chipsContainer.appendChild(createElement('button', {
      className: 'filter-chip',
      textContent: `${cat.emoji} ${cat.label}`,
      dataset: { category: cat.id },
    }));
  });
  filters.appendChild(chipsContainer);
  section.appendChild(filters);

  // Grid
  const grid = createElement('div', { className: 'classlist-grid', id: 'classlist-grid' });
  section.appendChild(grid);

  // State
  let activeCategory = 'all';
  let activeMonth = 'all';
  let searchQuery = '';
  const nextClass = getNextClass(aulas);

  function renderCards() {
    let filtered = [...aulas];

    // Filter by search
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      filtered = filtered.filter((a) => a.title.toLowerCase().includes(q));
    }

    // Filter by month
    if (activeMonth !== 'all') {
      const [year, month] = activeMonth.split('-').map(Number);
      filtered = filtered.filter(
        (a) => a.date.getFullYear() === year && a.date.getMonth() === month - 1
      );
    }

    // Filter by category
    if (activeCategory !== 'all') {
      filtered = filtered.filter((a) => a.category.id === activeCategory);
    }

    grid.innerHTML = '';

    if (filtered.length === 0) {
      grid.appendChild(createElement('div', {
        className: 'classlist-empty',
        textContent: 'Nenhuma aula encontrada com os filtros selecionados.',
      }));
      return;
    }

    filtered.forEach((aula, index) => {
      const status = getStatus(aula.date);
      const isNext = nextClass && aula.number === nextClass.number;

      const classes = ['class-card', 'fade-up'];
      if (status === 'completed') classes.push('completed');
      if (isNext) classes.push('next');

      const card = createElement('div', { className: classes.join(' ') });
      card.style.animationDelay = `${index * 0.03}s`;

      // Header
      const cardHeader = createElement('div', { className: 'class-card-header' });
      cardHeader.appendChild(createElement('span', {
        className: 'class-card-number',
        textContent: `#${String(aula.number).padStart(2, '0')}`,
      }));
      
      // meta (category + hours)
      const meta = createElement('div', { className: 'card-meta' });
      meta.appendChild(createElement('span', {
        className: `badge badge--${aula.category.id}`,
        innerHTML: `${aula.category.emoji} ${aula.category.label}`,
      }));
      meta.appendChild(createElement('span', {
        className: 'badge',
        style: 'background: var(--bg-tertiary); color: var(--text-secondary); border-color: var(--border); margin-left: 6px;',
        innerHTML: `⏱️ ${aula.workload || 6}h`,
      }));
      cardHeader.appendChild(meta);
      card.appendChild(cardHeader);

      // Title
      card.appendChild(createElement('h3', {
        className: 'class-card-title',
        textContent: aula.title,
      }));

      // Date
      const statusEmoji = status === 'completed' ? '✅' : isNext ? '🔜' : '📅';
      card.appendChild(createElement('div', {
        className: 'class-card-date',
        innerHTML: `${statusEmoji} ${formatDate(aula.date)}`,
      }));

      // Footer
      const footer = createElement('div', { className: 'class-card-footer' });

      const statusLabels = { completed: 'Concluída', today: 'Hoje!', upcoming: 'Futura' };
      const statusDotColors = { completed: '#10b981', today: '#f59e0b', upcoming: 'var(--text-tertiary)' };
      const displayStatus = isNext ? 'Próxima' : statusLabels[status];
      const dotColor = isNext ? 'var(--accent)' : statusDotColors[status];

      const statusEl = createElement('div', { className: `status status--${isNext ? 'next' : status}` });
      statusEl.appendChild(createElement('span', {
        className: 'status-dot',
        style: { background: dotColor },
      }));
      statusEl.appendChild(document.createTextNode(displayStatus));
      footer.appendChild(statusEl);

      if (aula.materialUrl) {
        footer.appendChild(createElement('a', {
          className: 'btn btn--ghost',
          href: aula.materialUrl,
          target: '_blank',
          rel: 'noopener noreferrer',
          textContent: '📂 Material',
        }));
      }

      card.appendChild(footer);
      grid.appendChild(card);
    });

    // Animate cards
    requestAnimationFrame(() => {
      grid.querySelectorAll('.class-card').forEach((card) => {
        card.classList.add('visible');
      });
    });
  }

  // Event handlers
  searchInput.addEventListener('input', (e) => {
    searchQuery = e.target.value;
    renderCards();
  });

  monthSelect.addEventListener('change', (e) => {
    activeMonth = e.target.value;
    renderCards();
  });

  chipsContainer.addEventListener('click', (e) => {
    const chip = e.target.closest('.filter-chip');
    if (!chip) return;

    chipsContainer.querySelectorAll('.filter-chip').forEach((c) => c.classList.remove('active'));
    chip.classList.add('active');
    activeCategory = chip.dataset.category;
    renderCards();
  });

  // Initial render
  requestAnimationFrame(renderCards);

  return section;
}
