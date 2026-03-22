// ===== SLIDER FUNCTIONALITY =====
let currentSlide = 0;
const slides = document.querySelectorAll('.slide');
const dots = document.querySelectorAll('.dot');
let autoSlideInterval;

function showSlide(n) {
    slides.forEach(slide => slide.classList.remove('active'));
    dots.forEach(dot => dot.classList.remove('active'));
    
    currentSlide = (n + slides.length) % slides.length;
    slides[currentSlide].classList.add('active');
    dots[currentSlide].classList.add('active');
}

function nextSlide() {
    showSlide(currentSlide + 1);
    resetAutoSlide();
}

function prevSlide() {
    showSlide(currentSlide - 1);
    resetAutoSlide();
}

function autoSlide() {
    nextSlide();
}

function resetAutoSlide() {
    clearInterval(autoSlideInterval);
    autoSlideInterval = setInterval(autoSlide, 5000);
}

const sliderNextBtn = document.querySelector('.slider-next');
const sliderPrevBtn = document.querySelector('.slider-prev');

if (sliderNextBtn) {
    sliderNextBtn.addEventListener('click', nextSlide);
    sliderNextBtn.addEventListener('touchend', nextSlide);
}

if (sliderPrevBtn) {
    sliderPrevBtn.addEventListener('click', prevSlide);
    sliderPrevBtn.addEventListener('touchend', prevSlide);
}

dots.forEach((dot, index) => {
    dot.addEventListener('click', () => {
        showSlide(index);
        resetAutoSlide();
    });
});

// Pause on hover
const sliderContainer = document.querySelector('.slider-container');
if (sliderContainer) {
    sliderContainer.addEventListener('mouseenter', () => {
        clearInterval(autoSlideInterval);
    });

    sliderContainer.addEventListener('mouseleave', () => {
        resetAutoSlide();
    });
}

// Start auto slide
autoSlideInterval = setInterval(autoSlide, 5000);

// ===== MODAL FUNCTIONALITY =====
function openModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.add('show');
        document.body.style.overflow = 'hidden';
    }
}

function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.remove('show');
        document.body.style.overflow = 'auto';
    }
}

// Close modal on background click
document.querySelectorAll('.modal').forEach(modal => {
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.classList.remove('show');
            document.body.style.overflow = 'auto';
        }
    });
});

// Close modal on Escape key
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        document.querySelectorAll('.modal.show').forEach(modal => {
            modal.classList.remove('show');
            document.body.style.overflow = 'auto';
        });
    }
});

// Video modal
const openVideoBtn = document.getElementById('openVideoBtn');
if (openVideoBtn) {
    openVideoBtn.addEventListener('click', () => {
        openModal('modal-video');
    });
}

// ===== FORM VALIDATION =====
const registerForm = document.getElementById('registerForm');
if (registerForm) {
    registerForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const fullName = document.getElementById('fullName');
        const email = document.getElementById('email');
        const password = document.getElementById('password');
        
        let isValid = true;
        
        // Clear previous errors
        [fullName, email, password].forEach(field => {
            field.classList.remove('error');
        });
        
        // Validate Full Name
        if (fullName.value.trim().length < 3) {
            fullName.classList.add('error');
            isValid = false;
        }
        
        // Validate Email
        const emailRegex = /^[^s@]+@[^s@]+.[^s@]+$/;
        if (!emailRegex.test(email.value)) {
            email.classList.add('error');
            isValid = false;
        }
        
        // Validate Password
        if (password.value.length < 6) {
            password.classList.add('error');
            isValid = false;
        }
        
        if (isValid) {
            alert('✅ Спасибо за регистрацию! Мы свяжемся с вами в ближайшее время.');
            clearForm();
            closeModal('modal-register');
        } else {
            alert('❌ Пожалуйста, заполните все поля корректно.');
        }
    });
}

function clearForm() {
    const form = document.getElementById('registerForm');
    if (form) {
        form.reset();
        document.querySelectorAll('.register-form input').forEach(input => {
            input.classList.remove('error');
        });
    }
}

// ===== SCROLL TO TOP =====
const scrollTopBtn = document.getElementById('scrollTop');
if (scrollTopBtn) {
    scrollTopBtn.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
}

// ===== ACTIVE NAV LINK =====
window.addEventListener('scroll', () => {
    const sections = document.querySelectorAll('.screen');
    const navLinks = document.querySelectorAll('.nav-link');
    
    let current = '';
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        if (pageYOffset >= sectionTop - 100) {
            current = section.getAttribute('id');
        }
    });
    
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href').slice(1) === current) {
            link.classList.add('active');
        }
    });
});

// ===== YANDEX MAP INITIALIZATION =====
if (typeof ymaps !== 'undefined') {
    ymaps.ready(init);
} else {
    console.warn('Yandex Maps API не загружена');
}

function init() {
    const mapElement = document.getElementById('map');
    if (!mapElement) return;

    const myMap = new ymaps.Map('map', {
        center: [55.7558, 37.6173],
        zoom: 10,
        controls: ['zoomControl', 'fullscreenControl']
    });

    const locations = [
        {
            coords: [55.7558, 37.6173],
            title: 'Помощь в доме престарелых',
            address: 'ул. Ленина, 45'
        },
        {
            coords: [55.7614, 37.6208],
            title: 'Репетиторство для школьников',
            address: 'пр. Мира, 78'
        },
        {
            coords: [55.7325, 37.6196],
            title: 'Уборка парка Горького',
            address: 'ул. Крымский вал, 9'
        },
        {
            coords: [55.7900, 37.5400],
            title: 'Спортивный турнир',
            address: 'Спортивный комплекс "Олимп"'
        }
    ];

    locations.forEach(location => {
        const placemark = new ymaps.Placemark(
            location.coords,
            {
                balloonContent: <strong>${location.title}</strong><br>${location.address}
            },
            {
                preset: 'islands#blueDotIcon'
            }
        );
        myMap.geoObjects.add(placemark);
    });
}

// ===== GALLERY ANIMATION =====
const galleryItems = document.querySelectorAll('.gallery-item');
const observerOptions = {
    threshold: 0.1
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.animation = 'slideUp 0.6s ease-out forwards';
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

galleryItems.forEach(item => observer.observe(item));