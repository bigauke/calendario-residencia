import { createElement } from '../utils.js';

export function createFeedback() {
  const container = createElement('div', { className: 'feedback-container' });

  // Floating Action Button
  const fab = createElement('button', {
    className: 'feedback-fab',
    innerHTML: '&#128172;', // Speech balloon
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

  // Form Section
  const formSection = createElement('div', { className: 'feedback-form-section' });
  const title = createElement('h3', {
    className: 'feedback-title',
    textContent: 'Deixe seu feedback!',
  });
  const desc = createElement('p', {
    className: 'feedback-desc',
    textContent: 'Como está sendo a sua experiência na Residência? Sugestões para o site?',
  });

  const form = createElement('form', { className: 'feedback-form' });

  // Rating Stars
  const starsContainer = createElement('div', { className: 'feedback-stars' });
  let currentRating = 0;
  const stars = [];

  for (let i = 1; i <= 5; i++) {
    const star = createElement('span', {
      className: 'feedback-star',
      innerHTML: '★',
    });
    star.dataset.value = i;
    
    star.addEventListener('click', () => {
      currentRating = i;
      stars.forEach((s, idx) => {
        if (idx < currentRating) s.classList.add('active');
        else s.classList.remove('active');
      });
    });
    
    stars.push(star);
    starsContainer.appendChild(star);
  }

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
    placeholder: 'Sua mensagem, dúvida ou sugestão...',
    required: true,
  });

  const submitBtn = createElement('button', {
    type: 'submit',
    className: 'feedback-submit',
    textContent: 'Enviar Feedback',
  });

  form.appendChild(starsContainer);
  form.appendChild(nameInput);
  form.appendChild(emailInput);
  form.appendChild(messageInput);
  form.appendChild(submitBtn);

  formSection.appendChild(title);
  formSection.appendChild(desc);
  formSection.appendChild(form);

  // Success Section
  const successSection = createElement('div', { className: 'feedback-success' });
  successSection.appendChild(createElement('div', {
    className: 'feedback-success-icon',
    innerHTML: '✓',
  }));
  successSection.appendChild(createElement('h3', {
    className: 'feedback-title',
    textContent: 'Obrigado!',
  }));
  successSection.appendChild(createElement('p', {
    className: 'feedback-desc',
    textContent: 'Seu feedback foi enviado com sucesso e nos ajudará muito.',
  }));

  const closeSuccessBtn = createElement('button', {
    className: 'feedback-submit',
    textContent: 'Fechar',
    style: { width: '100%' },
  });
  successSection.appendChild(closeSuccessBtn);

  // Assemble Modal
  modal.appendChild(closeBtn);
  modal.appendChild(formSection);
  modal.appendChild(successSection);
  overlay.appendChild(modal);

  // Events
  const openModal = () => {
    overlay.classList.add('active');
    document.body.style.overflow = 'hidden';
  };

  const closeModal = () => {
    overlay.classList.remove('active');
    document.body.style.overflow = '';
    // Reset form after a small delay
    setTimeout(() => {
      form.reset();
      formSection.style.display = 'block';
      successSection.classList.remove('active');
      currentRating = 0;
      stars.forEach(s => s.classList.remove('active'));
    }, 300);
  };

  fab.addEventListener('click', openModal);
  closeBtn.addEventListener('click', closeModal);
  closeSuccessBtn.addEventListener('click', closeModal);

  // Close on outside click
  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) closeModal();
  });

  // Handle Form Submission
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    if (currentRating === 0) {
      alert('Por favor, selecione uma nota de 1 a 5 estrelas.');
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
        headers: {
          'Accept': 'application/json'
        }
      });

      if (response.ok) {
        formSection.style.display = 'none';
        successSection.classList.add('active');
      } else {
        alert('Ocorreu um erro ao enviar. Tente novamente mais tarde.');
      }
    } catch (error) {
      alert('Erro de conexão. Verifique sua internet.');
    } finally {
      submitBtn.disabled = false;
      submitBtn.textContent = 'Enviar Feedback';
    }
  });

  container.appendChild(fab);
  container.appendChild(overlay);

  return container;
}
