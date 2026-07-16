const MONTH_NAMES = [
  'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
  'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro',
];

const DAY_NAMES = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];

/**
 * Format a date in pt-BR style
 */
export function formatDate(date, options = {}) {
  const { showTime = true, shortMonth = false } = options;
  const day = date.getDate();
  const month = shortMonth
    ? MONTH_NAMES[date.getMonth()].slice(0, 3)
    : MONTH_NAMES[date.getMonth()];
  const year = date.getFullYear();

  if (!showTime) return `${day} de ${month} de ${year}`;

  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  return `${day} de ${month} de ${year} às ${hours}:${minutes}`;
}

/**
 * Get the display name for a month
 */
export function getMonthName(monthIndex) {
  return MONTH_NAMES[monthIndex];
}

/**
 * Get day name abbreviation
 */
export function getDayName(dayIndex) {
  return DAY_NAMES[dayIndex];
}

/**
 * Determine the status of a class relative to now
 */
export function getStatus(date) {
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const classDay = new Date(date.getFullYear(), date.getMonth(), date.getDate());

  if (classDay < today) return 'completed';
  if (classDay.getTime() === today.getTime()) return 'today';
  return 'upcoming';
}

/**
 * Find the next upcoming class
 */
export function getNextClass(aulas) {
  const now = new Date();
  const upcoming = aulas
    .filter((a) => a.date >= now)
    .sort((a, b) => a.date - b.date);
  return upcoming[0] || null;
}

/**
 * Calculate progress through the course
 */
export function getProgress(aulas) {
  const now = new Date();
  const completed = aulas.filter((a) => a.date < now).length;
  return {
    completed,
    total: aulas.length,
    percentage: Math.round((completed / aulas.length) * 100),
  };
}

/**
 * Calculate countdown to a specific date
 */
export function getCountdown(targetDate) {
  const now = new Date();
  const diff = targetDate - now;

  if (diff <= 0) {
    return { days: 0, hours: 0, minutes: 0, seconds: 0, isNow: true };
  }

  return {
    days: Math.floor(diff / (1000 * 60 * 60 * 24)),
    hours: Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
    minutes: Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)),
    seconds: Math.floor((diff % (1000 * 60)) / 1000),
    isNow: false,
  };
}

/**
 * Get aulas for a specific month/year
 */
export function getAulasByMonth(aulas, year, month) {
  return aulas.filter(
    (a) => a.date.getFullYear() === year && a.date.getMonth() === month
  );
}

/**
 * Get aulas grouped by month key (YYYY-MM)
 */
export function groupByMonth(aulas) {
  const groups = {};
  aulas.forEach((aula) => {
    const key = `${aula.date.getFullYear()}-${String(aula.date.getMonth() + 1).padStart(2, '0')}`;
    if (!groups[key]) {
      groups[key] = {
        key,
        year: aula.date.getFullYear(),
        month: aula.date.getMonth(),
        label: `${MONTH_NAMES[aula.date.getMonth()]} ${aula.date.getFullYear()}`,
        aulas: [],
      };
    }
    groups[key].aulas.push(aula);
  });
  return Object.values(groups).sort((a, b) => a.key.localeCompare(b.key));
}

/**
 * Simple element creation helper
 */
export function createElement(tag, attrs = {}, children = []) {
  const el = document.createElement(tag);
  Object.entries(attrs).forEach(([key, value]) => {
    if (key === 'className') {
      el.className = value;
    } else if (key === 'innerHTML') {
      el.innerHTML = value;
    } else if (key === 'textContent') {
      el.textContent = value;
    } else if (key.startsWith('on')) {
      el.addEventListener(key.slice(2).toLowerCase(), value);
    } else if (key === 'style' && typeof value === 'object') {
      Object.assign(el.style, value);
    } else if (key === 'dataset') {
      Object.entries(value).forEach(([dk, dv]) => {
        el.dataset[dk] = dv;
      });
    } else {
      el.setAttribute(key, value);
    }
  });
  children.forEach((child) => {
    if (typeof child === 'string') {
      el.appendChild(document.createTextNode(child));
    } else if (child instanceof Node) {
      el.appendChild(child);
    }
  });
  return el;
}

export const holidays = {
  '01-01': 'Ano Novo',
  '03-06': 'Data Magna (PE)',
  '04-21': 'Tiradentes',
  '05-01': 'Dia do Trabalho',
  '06-24': 'São João',
  '07-09': 'Rev. Constitucional (SP)',
  '07-16': 'Nsa. do Carmo (PE)',
  '09-05': 'Elevação do AM',
  '09-07': 'Independência',
  '10-12': 'Nsa. Aparecida',
  '10-24': 'Aniversário Manaus',
  '11-02': 'Finados',
  '11-15': 'Proclamação da Rep.',
  '11-20': 'Consciência Negra',
  '12-08': 'Nsa. da Conceição', // Campinas, Manaus e Recife
  '12-25': 'Natal',
  
  // 2026 Móveis
  '2026-02-16': 'Carnaval',
  '2026-02-17': 'Carnaval',
  '2026-04-03': 'Sexta-feira Santa',
  '2026-06-04': 'Corpus Christi',
  
  // 2027 Móveis
  '2027-02-08': 'Carnaval',
  '2027-02-09': 'Carnaval',
  '2027-03-26': 'Sexta-feira Santa',
  '2027-05-27': 'Corpus Christi'
};

/**
 * Determine if a specific Date is a holiday
 */
export function getHoliday(date) {
  const mm = String(date.getMonth() + 1).padStart(2, '0');
  const dd = String(date.getDate()).padStart(2, '0');
  const yyyy = date.getFullYear();
  
  const exact = `${yyyy}-${mm}-${dd}`;
  const recur = `${mm}-${dd}`;
  
  return holidays[exact] || holidays[recur] || null;
}

/**
 * Determine if a specific Date is a valid business day (not weekend, not holiday).
 */
export function isBusinessDay(date) {
  const day = date.getDay();
  if (day === 0 || day === 6) return false;
  if (getHoliday(date)) return false;
  return true;
}

/**
 * Expands the original aulas array into a day-by-day array based on the 6h/day workload,
 * skipping weekends and holidays.
 */
export function expandAulas(aulas) {
  const expanded = [];
  
  aulas.forEach((aula) => {
    let daysNeeded = Math.ceil(aula.workload / 6);
    let currentDate = new Date(aula.date);
    
    // Safety check to avoid infinite loops if date is invalid
    if (isNaN(currentDate.getTime())) return;
    
    while (daysNeeded > 0) {
      if (isBusinessDay(currentDate)) {
        // Clone the aula object and assign the specific day to it
        expanded.push({
          ...aula,
          date: new Date(currentDate)
        });
        daysNeeded--;
      }
      
      // Move to next day (always advance, even if not a business day, to find the next valid one)
      // Only advance if we still need days, or maybe advance anyway? 
      // Actually, we must advance if we still need days or if we just checked a non-business day.
      // Wait, if daysNeeded becomes 0, the loop ends, so it's fine.
      if (daysNeeded > 0 || !isBusinessDay(currentDate)) {
        currentDate.setDate(currentDate.getDate() + 1);
      }
    }
  });
  
  return expanded;
}
