// 1. Message de bienvenue
console.log("Portfolio chargé et prêt !");

// 2. Gestion du Menu Mobile (Burger)
const mobileMenu = document.getElementById('mobile-menu');
const navList = document.querySelector('.nav-list');

if (mobileMenu) {
    mobileMenu.addEventListener('click', () => {
        // Ajoute ou enlève la classe 'active' pour afficher le menu
        navList.classList.toggle('active');
        // Anime les barres du burger
        mobileMenu.classList.toggle('active');
    });
}

// Fermer le menu quand on clique sur un lien (sur mobile)
document.querySelectorAll('.nav-list a').forEach(link => {
    link.addEventListener('click', () => {
        navList.classList.remove('active');
        mobileMenu.classList.remove('active');
    });
});

// 3. Smooth Scroll (Défilement doux)
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const targetId = this.getAttribute('href');
        const targetSection = document.querySelector(targetId);
        
        if (targetSection) {
            targetSection.scrollIntoView({
                behavior: 'smooth'
            });
        }
    });
});

// 4. Animation d'apparition au défilement (Scroll Reveal)
const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
        }
    });
});

document.querySelectorAll('section, .card, .project-card').forEach((el) => {
    el.classList.add('hidden-element');
    observer.observe(el);
});