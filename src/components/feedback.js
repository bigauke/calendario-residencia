import { createElement } from '../utils.js';

export function createFeedback() {
  const container = createElement('div', { className: 'feedback-container' });

  // Floating Action Button
  const fab = createElement('button', {
    className: 'feedback-fab',
    innerHTML: '&#128172;',
    title: 'Deixe seu feedback',
  });

  // Modal Overlay
  const overlay = createElement('div', { className: 'feedback-overlay' });

  // Modal Content
  const modal = createElement('div', { className: 'feedback-modal' });

  const closeBtn = createElement('button', {
    className: 'feedback-close',
    innerHTML: '&times;',
  });

  // --- Header ---
  const header = createElement('div', { className: 'feedback-header' });
  const headerIcon = createElement('div', {
    className: 'feedback-header-icon',
    innerHTML: '&#9993;',
  });
  const title = createElement('h3', {
    className: 'feedback-title',
    textContent: 'Deixe seu feedback!',
  });
  const desc = createElement('p', {
    className: 'feedback-desc',
    textContent: 'Como est\u00e1 sendo a sua experi\u00eancia com o calend\u00e1rio? Deixe suas sugest\u00f5es para o site!',
  });
  header.appendChild(headerIcon);
  header.appendChild(title);
  header.appendChild(desc);

  // --- Form Section ---
  const formSection = createElement('div', { className: 'feedback-form-section' });
  const form = createElement('form', { className: 'feedback-form' });

  // Stars with label wrapper
  const starsWrapper = createElement('div', { className: 'feedback-stars-wrapper' });
  const starsLabel = createElement('span', {
    className: 'feedback-stars-label',
    textContent: 'Avalie sua experi\u00eancia',
  });
  const starsContainer = createElement('div', { className: 'feedback-stars' });

  let currentRating = 0;
  const stars = [];

  for (let i = 1; i <= 5; i++) {
    const star = createElement('span', {
      className: 'feedback-star',
      innerHTML: '\u2605',
    });
    star.dataset.value = i;

    // Hover preview
    star.addEventListener('mouseenter', () => {
      stars.forEach((s, idx) => {
        if (idx < i) s.classList.add('active');
        else s.classList.remove('active');
      });
    });

    // Click to lock rating
    star.addEventListener('click', () => {
      currentRating = i;
      errorEl.classList.remove('visible');
      stars.forEach((s, idx) => {
        if (idx < currentRating) s.classList.add('active');
        else s.classList.remove('active');
      });
    });

    stars.push(star);
    starsContainer.appendChild(star);
  }

  // Restore to current rating on mouse leave
  starsContainer.addEventListener('mouseleave', () => {
    stars.forEach((s, idx) => {
      if (idx < currentRating) s.classList.add('active');
      else s.classList.remove('active');
    });
  });

  starsWrapper.appendChild(starsLabel);
  starsWrapper.appendChild(starsContainer);

  // Inline error
  const errorEl = createElement('div', { className: 'feedback-error' });
  const errorIcon = createElement('span', {
    className: 'feedback-error-icon',
    textContent: '\u26A0',
  });
  const errorText = createElement('span', {
    textContent: 'Selecione uma nota de 1 a 5 estrelas antes de enviar.',
  });
  errorEl.appendChild(errorIcon);
  errorEl.appendChild(errorText);

  // Inputs
  const nameInput = createElement('input', {
    type: 'text',
    name: 'name',
    placeholder: 'Seu nome (opcional)',
  });

  const emailInput = createElement('input', {
    type: 'email',
    name: 'email',
    placeholder: 'Seu e-mail (opcional)',
  });

  const messageInput = createElement('textarea', {
    name: 'message',
    placeholder: 'Sua mensagem, d\u00favida ou sugest\u00e3o...',
    required: true,
  });

  const submitBtn = createElement('button', {
    type: 'submit',
    className: 'feedback-submit',
    textContent: 'Enviar Feedback',
  });

  form.appendChild(starsWrapper);
  form.appendChild(errorEl);
  form.appendChild(nameInput);
  form.appendChild(emailInput);
  form.appendChild(messageInput);
  form.appendChild(submitBtn);
  formSection.appendChild(form);

  // --- Success Section ---
  const successSection = createElement('div', { className: 'feedback-success' });
  const successIcon = createElement('div', {
    className: 'feedback-success-icon',
    innerHTML: '\u2713',
  });
  const successTitle = createElement('h3', {
    className: 'feedback-title',
    textContent: 'Obrigado!',
  });
  const successDesc = createElement('p', {
    className: 'feedback-desc',
    textContent: 'Seu feedback foi enviado com sucesso e nos ajudar\u00e1 muito a melhorar o site.',
  });
  const closeSuccessBtn = createElement('button', {
    className: 'feedback-submit',
    textContent: 'Fechar',
  });

  successSection.appendChild(successIcon);
  successSection.appendChild(successTitle);
  successSection.appendChild(successDesc);
  successSection.appendChild(closeSuccessBtn);

  // --- Assemble Modal ---
  modal.appendChild(closeBtn);
  modal.appendChild(header);
  modal.appendChild(formSection);
  modal.appendChild(successSection);
  overlay.appendChild(modal);

  // --- Events ---
  const openModal = () => {
    overlay.classList.add('active');
    document.body.style.overflow = 'hidden';
  };

  const closeModal = () => {
    overlay.classList.remove('active');
    document.body.style.overflow = '';
    setTimeout(() => {
      form.reset();
      header.style.display = '';
      formSection.style.display = '';
      successSection.classList.remove('active');
      errorEl.classList.remove('visible');
      currentRating = 0;
      stars.forEach(s => s.classList.remove('active'));
    }, 350);
  };

  fab.addEventListener('click', openModal);
  closeBtn.addEventListener('click', closeModal);
  closeSuccessBtn.addEventListener('click', closeModal);

  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) closeModal();
  });

  // ESC key to close
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && overlay.classList.contains('active')) {
      closeModal();
    }
  });

  // --- Form Submission ---
  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    if (currentRating === 0) {
      errorEl.classList.remove('visible');
      void errorEl.offsetWidth; // force reflow for re-animation
      errorEl.classList.add('visible');
      return;
    }

    submitBtn.disabled = true;
    submitBtn.textContent = 'Enviando...';

    const formData = new FormData(form);
    formData.append('rating', currentRating);

    try {
      const response = await fetch('https://formspree.io/f/xpqvqyaw', {
        method: 'POST',
        body: formData,
        headers: { Accept: 'application/json' },
      });

      if (response.ok) {
        header.style.display = 'none';
        formSection.style.display = 'none';
        successSection.classList.add('active');
      } else {
        errorText.textContent = 'Erro ao enviar. Tente novamente mais tarde.';
        errorEl.classList.add('visible');
      }
    } catch {
      errorText.textContent = 'Sem conex\u00e3o. Verifique sua internet.';
      errorEl.classList.add('visible');
    } finally {
      submitBtn.disabled = false;
      submitBtn.textContent = 'Enviar Feedback';
    }
  });

  container.appendChild(fab);
  container.appendChild(overlay);

  return container;
}
