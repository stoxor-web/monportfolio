console.log("Site chargé - Lazy Loading & Validation actifs");

// --- 1. GESTION DU MODE SOMBRE (DARK MODE) ---
const themeToggle = document.getElementById('theme-toggle');
const htmlElement = document.documentElement;

function updateIcon(theme) {
    if (!themeToggle) return;
    const icon = themeToggle.querySelector('i');
    if (!icon) return;

    if (theme === 'dark') {
        icon.classList.remove('fa-moon');
        icon.classList.add('fa-sun');
    } else {
        icon.classList.remove('fa-sun');
        icon.classList.add('fa-moon');
    }
}

const savedTheme = localStorage.getItem('theme');
let initialTheme = 'light';
if (savedTheme) { initialTheme = savedTheme; }

htmlElement.setAttribute('data-theme', initialTheme);
updateIcon(initialTheme);


if (themeToggle) {
    themeToggle.addEventListener('click', () => {
        const currentTheme = htmlElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'light' ? 'dark' : 'light';
        
        htmlElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        updateIcon(newTheme);
    });
}

// --- 2. LAZY LOADING DES IMAGES DE PROJET ---
const lazyLoadObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const card = entry.target;
            const imgUrl = card.getAttribute('data-img');
            const projectImageDiv = card.querySelector('.project-image');
            
            if (imgUrl) {
                projectImageDiv.style.backgroundImage = `url('${imgUrl}')`;
                card.classList.remove('lazy-load-img');
            }
            observer.unobserve(card);
        }
    });
}, { threshold: 0.1 }); 

document.querySelectorAll('.lazy-load-img').forEach(card => {
    lazyLoadObserver.observe(card);
});


// --- 3. VALIDATION DE FORMULAIRE ---
const contactForm = document.getElementById('contact-form');
const nameInput = document.getElementById('name');
const emailInput = document.getElementById('email');
const nameError = document.getElementById('name-error');
const emailError = document.getElementById('email-error');

function validateName() {
    if (nameInput.value.length < 2) {
        nameError.textContent = "Le nom doit contenir au moins 2 caractères.";
        return false;
    }
    nameError.textContent = "";
    return true;
}

function validateEmail() {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(emailInput.value)) {
        emailError.textContent = "Veuillez entrer une adresse email valide.";
        return false;
    }
    emailError.textContent = "";
    return true;
}

if (nameInput) nameInput.addEventListener('input', validateName);
if (emailInput) emailInput.addEventListener('input', validateEmail);

if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
        const isNameValid = validateName();
        const isEmailValid = validateEmail();

        if (!isNameValid || !isEmailValid) {
            e.preventDefault();
            // Utiliser une méthode plus douce que alert() pour la validation
            console.error("Veuillez corriger les erreurs dans le formulaire avant d'envoyer.");
        }
    });
}

// --- 4. NAVIGATION INTELLIGENTE (SCROLL SPY) ---
const sections = document.querySelectorAll('section, header');
const navLinks = document.querySelectorAll('.nav-link');

window.addEventListener('scroll', () => {
    let current = 'accueil';
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        if (pageYOffset >= (sectionTop - sectionHeight / 4)) {
            current = section.getAttribute('id');
        }
    });

    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href').includes(current)) {
            link.classList.add('active');
        }
    });
});

// --- 5. MENU MOBILE ---
const mobileMenu = document.getElementById('mobile-menu');
const navList = document.querySelector('.nav-list');

if (mobileMenu) {
    mobileMenu.addEventListener('click', () => {
        navList.classList.toggle('active');
    });
}
document.querySelectorAll('.nav-list a').forEach(link => {
    link.addEventListener('click', () => {
        navList.classList.remove('active');
    });
});

// --- 6. TYPEWRITER EFFECT ---
const TypeWriter = function(txtElement, words, wait = 3000) {
    this.txtElement = txtElement;
    this.words = words;
    this.txt = '';
    this.wordIndex = 0;
    this.wait = parseInt(wait, 10);
    this.type();
    this.isDeleting = false;
}

TypeWriter.prototype.type = function() {
    const current = this.wordIndex % this.words.length;
    const fullTxt = this.words[current];

    if(this.isDeleting) { this.txt = fullTxt.substring(0, this.txt.length - 1); } 
    else { this.txt = fullTxt.substring(0, this.txt.length + 1); }

    this.txtElement.innerHTML = `<span class="txt">${this.txt}</span>`;

    let typeSpeed = 100;
    if(this.isDeleting) { typeSpeed /= 2; }

    if(!this.isDeleting && this.txt === fullTxt) {
        typeSpeed = this.wait;
        this.isDeleting = true;
    } else if(this.isDeleting && this.txt === '') {
        this.isDeleting = false;
        this.wordIndex++;
        typeSpeed = 500;
    }

    setTimeout(() => this.type(), typeSpeed);
}

document.addEventListener('DOMContentLoaded', () => {
    const txtElement = document.querySelector('.txt-type');
    if (txtElement) {
        const words = JSON.parse(txtElement.getAttribute('data-words'));
        const wait = txtElement.getAttribute('data-wait');
        new TypeWriter(txtElement, words, wait);
    }
});