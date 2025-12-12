console.log("Code JavaScript optimisé chargé.");

// --- 1. GESTION DU MODE SOMBRE (DARK MODE) ---
const themeToggle = document.getElementById('theme-toggle');
const htmlElement = document.documentElement;

function updateIcon(theme) {
    if (!themeToggle) return;
    const icon = themeToggle.querySelector('i');
    if (!icon) return;

    if (theme === 'dark') {
        icon.classList.remove('fa-moon');
        icon.classList.add('fa-sun'); // En mode dark, on montre le soleil (pour passer en light)
    } else {
        icon.classList.remove('fa-sun');
        icon.classList.add('fa-moon'); // En mode light, on montre la lune (pour passer en dark)
    }
}

// Initialisation au chargement
const savedTheme = localStorage.getItem('theme');
let initialTheme = 'dark'; // Thème par défaut défini sur DARK
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
                // Définit l'image de fond et retire la classe lazy-load
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


// --- 3. GESTION DU FORMULAIRE ET MESSAGE DE SUCCÈS ---
const contactForm = document.getElementById('contact-form');
const nameInput = document.getElementById('name');
const emailInput = document.getElementById('email');
const nameError = document.getElementById('name-error');
const emailError = document.getElementById('email-error');
const successMessage = document.getElementById('form-success-message');

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
    contactForm.addEventListener('submit', async (e) => {
        e.preventDefault(); 
        const isNameValid = validateName();
        const isEmailValid = validateEmail();

        if (isNameValid && isEmailValid) {
            
            const formspreeAction = contactForm.action;
            const formData = new FormData(contactForm);
            
            try {
                const response = await fetch(formspreeAction, {
                    method: 'POST',
                    body: formData,
                    headers: { 'Accept': 'application/json' }
                });

                if (response.ok) {
                    contactForm.style.display = 'none';
                    successMessage.style.display = 'block';
                    setTimeout(() => successMessage.classList.add('visible'), 10); 
                    
                } else {
                    console.error("Erreur lors de l'envoi du formulaire.");
                }
            } catch (error) {
                console.error("Erreur réseau:", error);
            }

        }
    });
}


// --- 4. ANIMATION AU DÉFILEMENT STAGGERED ---
const staggerObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const element = entry.target;
            const index = parseInt(element.getAttribute('data-index'));
            
            element.style.transitionDelay = `${index * 0.15}s`;
            element.classList.add('visible');
            
            observer.unobserve(element);
        }
    });
}, { threshold: 0.1 });

document.querySelectorAll('.stagger-item').forEach(el => {
    staggerObserver.observe(el);
});


// --- 5. EFFET HOVER 3D ---
const cards3d = document.querySelectorAll('.hover-3d');

cards3d.forEach(card => {
    card.addEventListener('mousemove', (e) => {
        const cardRect = card.getBoundingClientRect();
        const x = e.clientX - cardRect.left; 
        const y = e.clientY - cardRect.top;  

        const center_x = cardRect.width / 2;
        const center_y = cardRect.height / 2;

        const rotate_x = ((y - center_y) / center_y) * 5; 
        const rotate_y = ((x - center_x) / center_x) * -5;

        card.style.transform = `perspective(1000px) rotateX(${rotate_x}deg) rotateY(${rotate_y}deg) scale(1.02)`;
    });

    card.addEventListener('mouseleave', () => {
        card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale(1)';
    });
});


// --- 6. NAVIGATION INTELLIGENTE (SCROLL SPY) ---
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

// --- 7. MENU MOBILE ---
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

// --- 8. TYPEWRITER INITIALISATION ---
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