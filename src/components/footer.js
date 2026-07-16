import { aulas } from '../data/aulas.js';
import { getProgress, createElement } from '../utils.js';

export function createFooter() {
  const footer = createElement('footer', { className: 'footer' });
  const content = createElement('div', { className: 'footer-content' });
  const progress = getProgress(aulas);

  content.appendChild(createElement('div', {
    className: 'footer-brand',
    innerHTML: '📚 Residência em <span>TIC 44</span> — CTE-IA',
  }));

  content.appendChild(createElement('div', {
    className: 'footer-meta',
    innerHTML: 'Capacitação Técnica e Empreendedora em Inteligência Artificial — SOFTEX / SiDi',
  }));

  content.appendChild(createElement('div', {
    className: 'footer-progress',
    textContent: `${progress.completed} de ${progress.total} aulas concluídas (${progress.percentage}%)`,
  }));

  const bar = createElement('div', { className: 'footer-bar' });
  const fill = createElement('div', {
    className: 'footer-bar-fill',
    style: { width: '0%' },
  });
  bar.appendChild(fill);
  content.appendChild(bar);

  // Animate bar on mount
  requestAnimationFrame(() => {
    setTimeout(() => {
      fill.style.width = `${progress.percentage}%`;
    }, 300);
  });

  const now = new Date();
  content.appendChild(createElement('div', {
    className: 'footer-meta',
    innerHTML: `Dados atualizados em ${now.toLocaleDateString('pt-BR')} • Programa 2026/2027<br>Desenvolvido por <strong style="color: var(--accent);">Daniel Linhares</strong> — Residente em IA`,
  }));

  footer.appendChild(content);
  return footer;
}
