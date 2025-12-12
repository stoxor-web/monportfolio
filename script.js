console.log("Portfolio Expert chargé !");

// 1. GESTION MENU MOBILE
const mobileMenu = document.getElementById('mobile-menu');
const navList = document.querySelector('.nav-list');

if (mobileMenu) {
    mobileMenu.addEventListener('click', () => {
        navList.classList.toggle('active');
        // Animation simple des barres du burger (optionnel via CSS)
    });
}

document.querySelectorAll('.nav-list a').forEach(link => {
    link.addEventListener('click', () => {
        navList.classList.remove('active');
    });
});

// 2. FILTRES PORTFOLIO (LE NOUVEAU TRUC COOL)
const filterButtons = document.querySelectorAll('.filter-btn');
const projectCards = document.querySelectorAll('.project-card');

filterButtons.forEach(button => {
    button.addEventListener('click', () => {
        // Enlever la classe 'active' de tous les boutons
        filterButtons.forEach(btn => btn.classList.remove('active'));
        // Ajouter 'active' au bouton cliqué
        button.classList.add('active');

        const filterValue = button.getAttribute('data-filter');

        projectCards.forEach(card => {
            if (filterValue === 'all' || card.getAttribute('data-category') === filterValue) {
                card.style.display = 'block'; // Affiche
                setTimeout(() => card.style.opacity = '1', 10); // Petit effet fondu
            } else {
                card.style.display = 'none'; // Cache
                card.style.opacity = '0';
            }
        });
    });
});

// 3. BOUTON RETOUR HAUT (BACK TO TOP)
const backToTopButton = document.getElementById('back-to-top');

window.addEventListener('scroll', () => {
    if (window.scrollY > 300) {
        backToTopButton.classList.add('show');
    } else {
        backToTopButton.classList.remove('show');
    }
});

// 4. ANIMATION AU SCROLL
const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            entry.target.style.opacity = 1;
            entry.target.style.transform = 'translateY(0)';
        }
    });
});

document.querySelectorAll('section, .card, .project-card, .testimonial-card').forEach((el) => {
    el.style.opacity = 0;
    el.style.transform = 'translateY(30px)';
    el.style.transition = 'all 0.6s ease-out';
    observer.observe(el);
});