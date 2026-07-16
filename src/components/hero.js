import { aulas, CATEGORIES } from '../data/aulas.js';
import {
  getNextClass,
  getProgress,
  getCountdown,
  formatDate,
  createElement,
} from '../utils.js';

export function createHero() {
  const hero = createElement('section', { className: 'hero', id: 'hero' });

  const content = createElement('div', { className: 'hero-content' });

  // Badge
  const badge = createElement('div', {
    className: 'hero-badge',
    innerHTML: '⚡ Residência em TIC 44 — Programa 2026 / 2027',
  });

  // Title
  const title = createElement('h1', {
    className: 'hero-title',
    innerHTML: 'Residência em TIC 44<br><span class="highlight" style="font-size: 0.6em; display: inline-block; margin-top: 10px;">Capacitação Técnica e Empreendedora em Inteligência Artificial (CTE-IA)</span>',
  });

  // Subtitle
  const subtitle = createElement('p', {
    className: 'hero-subtitle',
    innerHTML: 'Acompanhe seus horários, materiais e progresso<br><span style="font-size: 0.85rem; color: var(--text-tertiary); margin-top: 8px; display: inline-block;">Desenvolvido por <strong style="color: var(--accent);">Daniel Linhares</strong>, Residente em IA</span>',
  });

  // Countdown
  const countdownContainer = createElement('div', { className: 'countdown-container' });
  const nextClass = getNextClass(aulas);

  if (nextClass) {
    const countdownLabel = createElement('div', {
      className: 'countdown-label',
      textContent: 'Próxima aula em',
    });

    const countdownNextTitle = createElement('div', {
      className: 'countdown-next-title',
      textContent: `${String(nextClass.number).padStart(2, '0')} — ${nextClass.title}`,
    });

    const countdownGrid = createElement('div', { className: 'countdown-grid', id: 'countdown-grid' });

    const units = ['days', 'hours', 'minutes', 'seconds'];
    const unitLabels = { days: 'Dias', hours: 'Horas', minutes: 'Min', seconds: 'Seg' };

    units.forEach((unit) => {
      const item = createElement('div', { className: 'countdown-item' });
      const value = createElement('div', {
        className: 'countdown-value',
        id: `countdown-${unit}`,
        textContent: '00',
      });
      const label = createElement('div', {
        className: 'countdown-unit',
        textContent: unitLabels[unit],
      });
      item.appendChild(value);
      item.appendChild(label);
      countdownGrid.appendChild(item);
    });

    countdownContainer.appendChild(countdownLabel);
    countdownContainer.appendChild(countdownNextTitle);
    countdownContainer.appendChild(countdownGrid);

    // Update countdown every second
    function updateCountdown() {
      const countdown = getCountdown(nextClass.date);
      document.getElementById('countdown-days').textContent = String(countdown.days).padStart(2, '0');
      document.getElementById('countdown-hours').textContent = String(countdown.hours).padStart(2, '0');
      document.getElementById('countdown-minutes').textContent = String(countdown.minutes).padStart(2, '0');
      document.getElementById('countdown-seconds').textContent = String(countdown.seconds).padStart(2, '0');
    }

    // Start after mount
    requestAnimationFrame(() => {
      updateCountdown();
      setInterval(updateCountdown, 1000);
    });
  }

  // Progress
  const progress = getProgress(aulas);
  const heroProgress = createElement('div', { className: 'hero-progress' });

  // SVG ring
  const ringSize = 140;
  const ringRadius = 58;
  const ringCircumference = 2 * Math.PI * ringRadius;
  const ringOffset = ringCircumference - (progress.percentage / 100) * ringCircumference;

  const ringContainer = createElement('div', { className: 'progress-ring-container' });
  ringContainer.innerHTML = `
    <svg class="progress-ring" width="${ringSize}" height="${ringSize}" viewBox="0 0 ${ringSize} ${ringSize}">
      <defs>
        <linearGradient id="progressGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color: #0891b2;" />
          <stop offset="100%" style="stop-color: #22d3ee;" />
        </linearGradient>
      </defs>
      <circle class="progress-ring-bg" cx="${ringSize / 2}" cy="${ringSize / 2}" r="${ringRadius}" />
      <circle class="progress-ring-fill" cx="${ringSize / 2}" cy="${ringSize / 2}" r="${ringRadius}"
        stroke-dasharray="${ringCircumference}"
        stroke-dashoffset="${ringCircumference}"
        id="progress-ring-fill" />
    </svg>
    <div class="progress-ring-text">
      <span class="progress-percentage">${progress.percentage}%</span>
      <span class="progress-label">Concluído</span>
    </div>
  `;

  // Animate ring on mount
  requestAnimationFrame(() => {
    setTimeout(() => {
      const fill = document.getElementById('progress-ring-fill');
      if (fill) fill.style.strokeDashoffset = ringOffset;
    }, 500);
  });

  // Progress stats
  const stats = createElement('div', { className: 'progress-stats' });
  const totalHours = aulas.reduce((acc, aula) => acc + (aula.workload || 0), 0);
  const statsData = [
    { color: '#10b981', value: progress.completed, label: 'Aulas concluídas' },
    { color: 'var(--accent)', value: progress.total - progress.completed, label: 'Aulas restantes' },
    { color: '#8b5cf6', value: `${progress.total} (${totalHours}h)`, label: 'Total de aulas' },
  ];

  statsData.forEach(({ color, value, label }) => {
    const stat = createElement('div', { className: 'progress-stat' });
    const dot = createElement('div', {
      className: 'progress-stat-dot',
      style: { background: color },
    });
    const info = createElement('div', { className: 'progress-stat-info' });
    info.appendChild(createElement('span', { className: 'progress-stat-value', textContent: String(value) }));
    info.appendChild(createElement('span', { className: 'progress-stat-label', textContent: label }));
    stat.appendChild(dot);
    stat.appendChild(info);
    stats.appendChild(stat);
  });

  heroProgress.appendChild(ringContainer);
  heroProgress.appendChild(stats);

  // Category pills
  const categories = createElement('div', { className: 'hero-categories' });
  Object.values(CATEGORIES).forEach((cat) => {
    const count = aulas.filter((a) => a.category.id === cat.id).length;
    const pill = createElement('div', { className: 'category-pill' });
    const dot = createElement('span', {
      className: 'dot',
      style: { background: cat.color },
    });
    pill.appendChild(dot);
    pill.appendChild(document.createTextNode(`${cat.emoji} ${cat.label} (${count})`));
    categories.appendChild(pill);
  });

  // Assemble
  content.appendChild(badge);
  content.appendChild(title);
  content.appendChild(subtitle);
  content.appendChild(countdownContainer);
  content.appendChild(heroProgress);
  content.appendChild(categories);
  hero.appendChild(content);

  return hero;
}
