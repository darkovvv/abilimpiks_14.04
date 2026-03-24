const slider = document.getElementById('slider');
const slides = Array.from(document.querySelectorAll('.slide'));
const dots = Array.from(document.querySelectorAll('.dot'));
const prevBtn = document.getElementById('prevSlide');
const nextBtn = document.getElementById('nextSlide');
const burger = document.getElementById('burger');
const nav = document.getElementById('nav');
const navLinks = Array.from(document.querySelectorAll('.nav a'));
const aboutBtn = document.getElementById('aboutBtn');
const toTop = document.getElementById('toTop');
const eventButtons = Array.from(document.querySelectorAll('.event-btn'));
const registerForm = document.getElementById('registerForm');
const selectedEventName = document.getElementById('selectedEventName');
const loginBtn = document.getElementById('loginBtn');
const formMessage = document.getElementById('formMessage');
const galleryButtons = Array.from(document.querySelectorAll('.gallery-card'));
const galleryPreview = document.getElementById('galleryPreview');
const galleryCaption = document.getElementById('galleryCaption');
const mapCards = Array.from(document.querySelectorAll('.map-card'));
const eventMap = document.getElementById('eventMap');

let currentSlide = 0;
let autoTimer = null;
let lastActiveTrigger = null;

function renderSlide(index) {
  if (!slides.length) return;
  currentSlide = (index + slides.length) % slides.length;
  slides.forEach((slide, slideIndex) => {
    slide.classList.toggle('active', slideIndex === currentSlide);
  });
  dots.forEach((dot, dotIndex) => {
    dot.classList.toggle('active', dotIndex === currentSlide);
  });
}

function nextSlide() {
  renderSlide(currentSlide + 1);
}

function prevSlide() {
  renderSlide(currentSlide - 1);
}

function stopAuto() {
  if (autoTimer) {
    clearInterval(autoTimer);
    autoTimer = null;
  }
}

function startAuto() {
  if (!slides.length) return;
  stopAuto();
  autoTimer = setInterval(nextSlide, 4500);
}

if (slider) {
  slider.addEventListener('mouseenter', stopAuto);
  slider.addEventListener('mouseleave', startAuto);
  slider.addEventListener('focusin', stopAuto);
  slider.addEventListener('focusout', startAuto);
  slider.addEventListener('touchstart', stopAuto, { passive: true });
  slider.addEventListener('touchend', startAuto, { passive: true });
}

prevBtn?.addEventListener('click', () => {
  prevSlide();
  startAuto();
});

nextBtn?.addEventListener('click', () => {
  nextSlide();
  startAuto();
});

dots.forEach((dot) => {
  dot.addEventListener('click', () => {
    renderSlide(Number(dot.dataset.slide));
    startAuto();
  });
});

if (slides.length) {
  renderSlide(0);
  startAuto();
}

burger?.addEventListener('click', () => {
  const isOpen = nav.classList.toggle('open');
  burger.classList.toggle('is-active', isOpen);
  burger.setAttribute('aria-expanded', String(isOpen));
});

navLinks.forEach((link) => {
  link.addEventListener('click', () => {
    nav.classList.remove('open');
    burger?.classList.remove('is-active');
    burger?.setAttribute('aria-expanded', 'false');
  });
});

const sections = Array.from(document.querySelectorAll('main section[id]'));
if (sections.length && 'IntersectionObserver' in window) {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const currentId = entry.target.getAttribute('id');
        navLinks.forEach((link) => {
          const isCurrent = link.getAttribute('href') === `#${currentId}`;
          link.classList.toggle('is-active', isCurrent);
        });
      });
    },
    {
      rootMargin: '-40% 0px -45% 0px',
      threshold: 0.05,
    }
  );
  sections.forEach((section) => observer.observe(section));
}

function openModal(id, trigger = null) {
  const modal = document.getElementById(id);
  if (!modal) return;
  document.querySelectorAll('.modal.show').forEach((openedModal) => closeModal(openedModal, false));
  modal.classList.add('show');
  modal.setAttribute('aria-hidden', 'false');
  document.body.classList.add('modal-open');
  lastActiveTrigger = trigger;
}

function closeModal(modal, restoreFocus = true) {
  if (!modal) return;
  modal.classList.remove('show');
  modal.setAttribute('aria-hidden', 'true');
  if (!document.querySelector('.modal.show')) {
    document.body.classList.remove('modal-open');
  }
  if (restoreFocus && lastActiveTrigger instanceof HTMLElement) {
    lastActiveTrigger.focus();
  }
}

aboutBtn?.addEventListener('click', (event) => {
  openModal('modal-about', event.currentTarget);
});

document.querySelectorAll('[data-modal]').forEach((button) => {
  button.addEventListener('click', (event) => {
    openModal(button.dataset.modal, event.currentTarget);
  });
});

eventButtons.forEach((button) => {
  button.addEventListener('click', (event) => {
    if (selectedEventName) {
      selectedEventName.textContent = button.dataset.event || 'Ближайшее мероприятие';
    }
    resetFormState();
    openModal('modal-register', event.currentTarget);
  });
});

galleryButtons.forEach((button) => {
  button.addEventListener('click', (event) => {
    if (galleryPreview) galleryPreview.src = button.dataset.image;
    if (galleryCaption) galleryCaption.textContent = button.dataset.caption || 'Изображение из галереи';
    const imageAlt = button.querySelector('img')?.alt;
    if (galleryPreview && imageAlt) galleryPreview.alt = imageAlt;
    openModal('modal-gallery', event.currentTarget);
  });
});

document.querySelectorAll('.modal').forEach((modal) => {
  modal.addEventListener('click', (event) => {
    if (event.target === modal) {
      closeModal(modal);
    }
  });
});

document.querySelectorAll('[data-close]').forEach((button) => {
  button.addEventListener('click', () => {
    closeModal(button.closest('.modal'));
  });
});

document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape') {
    const openedModal = document.querySelector('.modal.show');
    if (openedModal) closeModal(openedModal);
  }
});

function setError(input, errorElement, message) {
  input.classList.add('error');
  if (errorElement) errorElement.textContent = message;
}

function clearError(input, errorElement) {
  input.classList.remove('error');
  if (errorElement) errorElement.textContent = '';
}

function resetFormState() {
  if (!registerForm) return;
  const fullName = document.getElementById('fullName');
  const address = document.getElementById('address');
  const password = document.getElementById('password');
  clearError(fullName, document.getElementById('nameError'));
  clearError(address, document.getElementById('addressError'));
  clearError(password, document.getElementById('passwordError'));
  if (formMessage) {
    formMessage.textContent = '';
    formMessage.className = 'form-message';
  }
}

registerForm?.addEventListener('submit', (event) => {
  event.preventDefault();

  const fullName = document.getElementById('fullName');
  const address = document.getElementById('address');
  const password = document.getElementById('password');
  const nameError = document.getElementById('nameError');
  const addressError = document.getElementById('addressError');
  const passwordError = document.getElementById('passwordError');

  resetFormState();

  const nameValue = fullName.value.trim();
  const addressValue = address.value.trim();
  const passwordValue = password.value.trim();

  let isValid = true;

  if (nameValue.length < 8 || !nameValue.includes(' ')) {
    setError(fullName, nameError, 'Укажите полное имя и фамилию.');
    isValid = false;
  }

  if (addressValue.length < 10) {
    setError(address, addressError, 'Введите почтовый адрес подробнее.');
    isValid = false;
  }

  if (passwordValue.length < 6) {
    setError(password, passwordError, 'Пароль должен содержать минимум 6 символов.');
    isValid = false;
  }

  if (!isValid) {
    if (formMessage) {
      formMessage.textContent = 'Проверьте заполнение полей формы.';
      formMessage.className = 'form-message error';
    }
    return;
  }

  if (formMessage) {
    formMessage.textContent = 'Заявка отправлена. Координатор свяжется с вами после проверки данных.';
    formMessage.className = 'form-message success';
  }

  registerForm.reset();
  setTimeout(() => {
    const registerModal = document.getElementById('modal-register');
    closeModal(registerModal, false);
  }, 900);
});

registerForm?.addEventListener('reset', () => {
  window.setTimeout(resetFormState, 0);
});

loginBtn?.addEventListener('click', () => {
  if (formMessage) {
    formMessage.textContent = 'Кнопка добавлена по требованиям задания. В демо-версии доступна регистрация через форму.';
    formMessage.className = 'form-message info';
  }
});

mapCards.forEach((card) => {
  card.addEventListener('click', () => {
    mapCards.forEach((item) => item.classList.remove('active'));
    card.classList.add('active');
    if (eventMap) {
      eventMap.src = card.dataset.map;
    }
  });
});

toTop?.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});
