console.log("Site chargé - Animations, 3D & Validation actifs");

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


// --- 3. GESTION DU FORMULAIRE ET MESSAGE DE SUCCÈS (NOUVEAU) ---
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
        e.preventDefault(); // Empêche l'envoi par défaut pour la validation et le feedback
        const isNameValid = validateName();
        const isEmailValid = validateEmail();

        if (isNameValid && isEmailValid) {
            
            // Simule l'envoi à Formspree pour afficher le message de succès personnalisé
            const formspreeAction = contactForm.action;
            const formData = new FormData(contactForm);
            
            try {
                const response = await fetch(formspreeAction, {
                    method: 'POST',
                    body: formData,
                    headers: { 'Accept': 'application/json' }
                });

                if (response.ok) {
                    // Masque le formulaire et affiche le message de succès
                    contactForm.style.display = 'none';
                    successMessage.style.display = 'block';
                    // Ajoute la classe pour l'animation CSS
                    setTimeout(() => successMessage.classList.add('visible'), 10); 
                    
                } else {
                    // Gérer les erreurs de Formspree (ex: captcha manquant)
                    console.error("Erreur lors de l'envoi du formulaire.");
                    alert("Une erreur est survenue lors de l'envoi. Veuillez réessayer plus tard.");
                }
            } catch (error) {
                console.error("Erreur réseau:", error);
                alert("Erreur de connexion. Veuillez vérifier votre réseau.");
            }

        } else {
            // Utilisé pour déclencher les messages d'erreur si l'utilisateur essaie d'envoyer
            // sans avoir rempli correctement les champs
        }
    });
}


// --- 4. ANIMATION AU DÉFILEMENT STAGGERED (NOUVEAU) ---
const staggerObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const element = entry.target;
            const index = parseInt(element.getAttribute('data-index'));
            
            // Applique un délai basé sur l'index de l'élément (0, 1, 2, ...)
            element.style.transitionDelay = `${index * 0.15}s`;
            element.classList.add('visible');
            
            observer.unobserve(element);
        }
    });
}, { threshold: 0.1 });

// Cible tous les éléments marqués pour l'animation en escalier
document.querySelectorAll('.stagger-item').forEach(el => {
    staggerObserver.observe(el);
});


// --- 5. EFFET HOVER 3D (NOUVEAU) ---
const cards3d = document.querySelectorAll('.hover-3d');

cards3d.forEach(card => {
    card.addEventListener('mousemove', (e) => {
        // Obtient les coordonnées du curseur à l'intérieur de la carte
        const cardRect = card.getBoundingClientRect();
        const x = e.clientX - cardRect.left; // Coordonnée X relative
        const y = e.clientY - cardRect.top;  // Coordonnée Y relative

        // Calcule le centre de la carte (50%)
        const center_x = cardRect.width / 2;
        const center_y = cardRect.height / 2;

        // Calcule l'angle de rotation (entre -10 et 10 degrés)
        const rotate_x = ((y - center_y) / center_y) * 10;
        const rotate_y = ((x - center_x) / center_x) * -10; // Inversé pour un effet plus naturel

        // Applique la transformation 3D
        card.style.transform = `perspective(1000px) rotateX(${rotate_x}deg) rotateY(${rotate_y}deg) scale(1.03)`;
    });

    // Remet la carte à plat quand la souris sort
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

// --- 8. LAZY LOADING & TYPEWRITER INITIALISATION (au chargement) ---
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