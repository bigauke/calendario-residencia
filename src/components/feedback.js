import { createElement } from '../utils.js';

const RATING_SENTIMENTS = {
  1: '😞 Muito insatisfeito',
  2: '🙁 Insatisfeito',
  3: '😐 Regular',
  4: '😊 Muito bom',
  5: '🤩 Excelente! Adorei!',
};

export function createFeedback() {
  const container = createElement('div', { className: 'feedback-container' });

  // Floating Speech Balloon Callout
  const balloonCallout = createElement('div', {
    className: 'feedback-balloon-callout',
    title: 'Clique para deixar seu feedback',
  });
  balloonCallout.innerHTML = `
    <span class="feedback-balloon-pulse"></span>
    <span class="feedback-balloon-text">💬 Deixe seu feedback!</span>
  `;

  // Floating Action Button
  const fab = createElement('button', {
    className: 'feedback-fab',
    innerHTML: '<span class="feedback-fab-icon">&#128172;</span>',
    title: 'Deixe seu feedback',
  });

  // Modal Overlay
  const overlay = createElement('div', { className: 'feedback-overlay' });

  // Modal Content
  const modal = createElement('div', { className: 'feedback-modal' });

  const closeBtn = createElement('button', {
    className: 'feedback-close',
    innerHTML: '&times;',
    title: 'Fechar formulário',
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
    textContent: 'Como está sendo a sua experiência com o calendário? Deixe suas sugestões para o site!',
  });
  header.appendChild(headerIcon);
  header.appendChild(title);
  header.appendChild(desc);

  // --- Form Section ---
  const formSection = createElement('div', { className: 'feedback-form-section' });
  const form = createElement('form', { className: 'feedback-form' });
  form.setAttribute('novalidate', 'true');

  // Stars with label wrapper
  const starsWrapper = createElement('div', { className: 'feedback-stars-wrapper' });
  const starsLabel = createElement('span', {
    className: 'feedback-stars-label',
    textContent: 'Avalie sua experiência *',
  });
  const starsContainer = createElement('div', { className: 'feedback-stars' });

  // Dynamic sentiment label under stars
  const ratingSentiment = createElement('div', {
    className: 'feedback-rating-sentiment',
    textContent: 'Escolha uma nota de 1 a 5 estrelas',
  });

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
      ratingSentiment.textContent = RATING_SENTIMENTS[i];
      ratingSentiment.classList.add('hovering');
      stars.forEach((s, idx) => {
        if (idx < i) s.classList.add('active');
        else s.classList.remove('active');
      });
    });

    // Click to lock rating
    star.addEventListener('click', () => {
      currentRating = i;
      starsWrapper.classList.remove('field-invalid');
      hideError();
      star.classList.add('star-pop');
      setTimeout(() => star.classList.remove('star-pop'), 400);

      ratingSentiment.textContent = RATING_SENTIMENTS[i];
      ratingSentiment.classList.remove('hovering');
      ratingSentiment.classList.add('locked');

      stars.forEach((s, idx) => {
        if (idx < currentRating) s.classList.add('active');
        else s.classList.remove('active');
      });

      updateValidationProgress();
    });

    stars.push(star);
    starsContainer.appendChild(star);
  }

  // Restore to current rating on mouse leave
  starsContainer.addEventListener('mouseleave', () => {
    ratingSentiment.classList.remove('hovering');
    if (currentRating > 0) {
      ratingSentiment.textContent = RATING_SENTIMENTS[currentRating];
      ratingSentiment.classList.add('locked');
    } else {
      ratingSentiment.textContent = 'Escolha uma nota de 1 a 5 estrelas';
      ratingSentiment.classList.remove('locked');
    }

    stars.forEach((s, idx) => {
      if (idx < currentRating) s.classList.add('active');
      else s.classList.remove('active');
    });
  });

  starsWrapper.appendChild(starsLabel);
  starsWrapper.appendChild(starsContainer);
  starsWrapper.appendChild(ratingSentiment);

  // Custom Inline Error Balloon
  const errorBalloon = createElement('div', { className: 'feedback-balloon-error' });
  const errorIcon = createElement('span', {
    className: 'feedback-balloon-error-icon',
    textContent: '\u26A0',
  });
  const errorText = createElement('span', {
    className: 'feedback-balloon-error-text',
    textContent: '',
  });
  errorBalloon.appendChild(errorIcon);
  errorBalloon.appendChild(errorText);

  // Field: Name (optional)
  const nameField = createElement('div', { className: 'feedback-input-group' });
  const nameInput = createElement('input', {
    type: 'text',
    name: 'name',
    placeholder: 'Seu nome (opcional)',
  });
  nameField.appendChild(nameInput);

  // Field: Email (Obrigatório)
  const emailField = createElement('div', { className: 'feedback-input-group' });
  const emailInput = createElement('input', {
    type: 'email',
    name: 'email',
    placeholder: 'Seu e-mail (obrigatório) *',
    required: true,
  });
  const emailStatusIcon = createElement('span', {
    className: 'feedback-input-indicator',
    title: 'Status do e-mail',
  });
  emailField.appendChild(emailInput);
  emailField.appendChild(emailStatusIcon);

  // Real-time email validation indicator
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  emailInput.addEventListener('input', () => {
    const val = emailInput.value.trim();
    if (val.length === 0) {
      emailStatusIcon.className = 'feedback-input-indicator';
      emailStatusIcon.textContent = '';
      emailInput.classList.remove('input-invalid');
    } else if (emailRegex.test(val)) {
      emailStatusIcon.className = 'feedback-input-indicator valid';
      emailStatusIcon.textContent = '✓';
      emailInput.classList.remove('input-invalid');
      if (errorBalloon.classList.contains('visible') && errorText.textContent.includes('e-mail')) {
        hideError();
      }
    } else {
      emailStatusIcon.className = 'feedback-input-indicator invalid';
      emailStatusIcon.textContent = '!';
    }
    updateValidationProgress();
  });

  // Field: Message (Obrigatório) with live char counter
  const messageField = createElement('div', { className: 'feedback-input-group feedback-message-group' });
  const messageInput = createElement('textarea', {
    name: 'message',
    placeholder: 'Sua mensagem, dúvida ou sugestão... *',
    required: true,
    maxLength: 500,
  });
  const charCounter = createElement('div', {
    className: 'feedback-char-counter',
    innerHTML: '<span class="char-count">0</span>/500 caracteres',
  });
  messageInput.addEventListener('input', () => {
    const count = messageInput.value.length;
    charCounter.querySelector('.char-count').textContent = count;
    messageInput.classList.remove('input-invalid');
    if (count > 0 && errorBalloon.classList.contains('visible') && errorText.textContent.includes('mensagem')) {
      hideError();
    }
    updateValidationProgress();
  });

  messageField.appendChild(messageInput);
  messageField.appendChild(charCounter);

  // Requirements Progress Checklist Bar
  const requirementsBar = createElement('div', { className: 'feedback-requirements-bar' });
  const reqRating = createElement('div', {
    className: 'req-item',
    id: 'req-rating',
    innerHTML: '<span class="req-icon">○</span> Nota',
  });
  const reqEmail = createElement('div', {
    className: 'req-item',
    id: 'req-email',
    innerHTML: '<span class="req-icon">○</span> E-mail',
  });
  const reqMessage = createElement('div', {
    className: 'req-item',
    id: 'req-message',
    innerHTML: '<span class="req-icon">○</span> Mensagem',
  });

  requirementsBar.appendChild(reqRating);
  requirementsBar.appendChild(reqEmail);
  requirementsBar.appendChild(reqMessage);

  // Submit Button
  const submitBtn = createElement('button', {
    type: 'submit',
    className: 'feedback-submit feedback-submit-validate pending',
    innerHTML: '<span class="submit-btn-text">Enviar Feedback</span> <span class="submit-btn-icon">&#10140;</span>',
    title: 'Preencha a nota, e-mail e mensagem para enviar',
  });

  form.appendChild(starsWrapper);
  form.appendChild(errorBalloon);
  form.appendChild(nameField);
  form.appendChild(emailField);
  form.appendChild(messageField);
  form.appendChild(requirementsBar);
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
    textContent: 'Seu feedback foi enviado com sucesso e nos ajudará muito a melhorar o site.',
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

  // --- Reactive Validation Updates ---
  function updateValidationProgress() {
    const isRatingValid = currentRating > 0;
    const isEmailValid = emailRegex.test(emailInput.value.trim());
    const isMessageValid = messageInput.value.trim().length > 0;

    // Update requirements items
    updateReqItem(reqRating, isRatingValid);
    updateReqItem(reqEmail, isEmailValid);
    updateReqItem(reqMessage, isMessageValid);

    // Update submit button state
    if (isRatingValid && isEmailValid && isMessageValid) {
      submitBtn.classList.remove('pending');
      submitBtn.classList.add('ready');
      submitBtn.title = 'Tudo pronto! Clique para enviar seu feedback.';
    } else {
      submitBtn.classList.add('pending');
      submitBtn.classList.remove('ready');
      submitBtn.title = 'Preencha a nota, e-mail e mensagem para enviar';
    }
  }

  function updateReqItem(el, isValid) {
    if (isValid) {
      el.classList.add('valid');
      el.querySelector('.req-icon').innerHTML = '&#10003;';
    } else {
      el.classList.remove('valid');
      el.querySelector('.req-icon').innerHTML = '&#9675;';
    }
  }

  // --- Helper validation balloon functions ---
  function showError(msg, targetInput = null) {
    errorText.textContent = msg;
    errorBalloon.classList.remove('visible');
    void errorBalloon.offsetWidth; // trigger reflow for pop animation
    errorBalloon.classList.add('visible');

    if (targetInput) {
      targetInput.classList.add('input-invalid');
      targetInput.focus();
    }
  }

  function hideError() {
    errorBalloon.classList.remove('visible');
  }

  function clearFieldErrors() {
    hideError();
    starsWrapper.classList.remove('field-invalid');
    emailInput.classList.remove('input-invalid');
    messageInput.classList.remove('input-invalid');
    submitBtn.classList.remove('button-shake-invalid');
  }

  // --- Events ---
  const openModal = () => {
    overlay.classList.add('active');
    balloonCallout.classList.add('hidden');
    document.body.style.overflow = 'hidden';
    updateValidationProgress();
  };

  const closeModal = () => {
    overlay.classList.remove('active');
    balloonCallout.classList.remove('hidden');
    document.body.style.overflow = '';
    setTimeout(() => {
      form.reset();
      header.style.display = '';
      formSection.style.display = '';
      successSection.classList.remove('active');
      clearFieldErrors();
      emailStatusIcon.className = 'feedback-input-indicator';
      emailStatusIcon.textContent = '';
      charCounter.querySelector('.char-count').textContent = '0';
      currentRating = 0;
      ratingSentiment.textContent = 'Escolha uma nota de 1 a 5 estrelas';
      ratingSentiment.classList.remove('locked', 'hovering');
      stars.forEach(s => s.classList.remove('active'));
      updateValidationProgress();
    }, 350);
  };

  fab.addEventListener('click', openModal);
  balloonCallout.addEventListener('click', openModal);
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

  // --- Form Submission Validation ---
  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const isRatingValid = currentRating > 0;
    const emailVal = emailInput.value.trim();
    const isEmailValid = emailRegex.test(emailVal);
    const messageVal = messageInput.value.trim();
    const isMessageValid = messageVal.length > 0;

    // If any requirement fails, trigger full button and input validation
    if (!isRatingValid || !isEmailValid || !isMessageValid) {
      // Trigger button shake and error glow
      submitBtn.classList.remove('button-shake-invalid');
      void submitBtn.offsetWidth; // reflow
      submitBtn.classList.add('button-shake-invalid');

      // Highlight all invalid fields simultaneously
      if (!isRatingValid) {
        starsWrapper.classList.add('field-invalid');
      } else {
        starsWrapper.classList.remove('field-invalid');
      }

      if (!isEmailValid) {
        emailInput.classList.add('input-invalid');
      } else {
        emailInput.classList.remove('input-invalid');
      }

      if (!isMessageValid) {
        messageInput.classList.add('input-invalid');
      } else {
        messageInput.classList.remove('input-invalid');
      }

      // Display specific descriptive error message
      if (!isRatingValid && !isEmailValid && !isMessageValid) {
        showError('Por favor, selecione uma nota, informe seu e-mail e digite sua mensagem.');
        starsContainer.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      } else if (!isRatingValid) {
        showError('Por favor, selecione uma nota de 1 a 5 estrelas antes de enviar.');
        starsContainer.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      } else if (!emailVal) {
        showError('O e-mail é obrigatório para enviar seu feedback.', emailInput);
      } else if (!isEmailValid) {
        showError('Por favor, digite um formato de e-mail válido (ex: seu.nome@email.com).', emailInput);
      } else if (!isMessageValid) {
        showError('Por favor, digite sua mensagem, dúvida ou sugestão.', messageInput);
      }
      return;
    }

    // All valid! Submit via Formspree
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<span class="submit-btn-text">Enviando...</span>';

    const formData = new FormData(form);
    formData.append('rating', currentRating);
    formData.append('rating_label', RATING_SENTIMENTS[currentRating]);

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
        showError('Erro ao enviar. Tente novamente mais tarde.');
      }
    } catch {
      showError('Sem conexão. Verifique sua internet.');
    } finally {
      submitBtn.disabled = false;
      submitBtn.innerHTML = '<span class="submit-btn-text">Enviar Feedback</span> <span class="submit-btn-icon">&#10140;</span>';
      updateValidationProgress();
    }
  });

  container.appendChild(balloonCallout);
  container.appendChild(fab);
  container.appendChild(overlay);

  return container;
}
