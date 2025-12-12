// 1. Un petit message dans la console pour vérifier que tout marche
console.log("Script chargé avec succès !");

// 2. Défilement doux (Smooth Scroll) pour les liens du menu
// Cela permet de descendre fluidement vers la section au lieu de sauter brutalement
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault(); // Empêche le saut brutal par défaut

        document.querySelector(this.getAttribute('href')).scrollIntoView({
            behavior: 'smooth' // Le secret de la fluidité
        });
    });
});

// 3. Animation du bouton "Envoyer"
// Quand on clique, le texte change pour rassurer l'utilisateur
const form = document.querySelector('form');
if (form) {
    form.addEventListener('submit', function(e) {
        const button = this.querySelector('button');
        button.textContent = 'Envoi en cours...';
        button.style.backgroundColor = '#27ae60'; // Change la couleur en vert
        // Le formulaire sera ensuite envoyé à Formspree normalement
    });
}

// 4. (Bonus) Animation d'apparition au défilement
// Fait apparaître les éléments quand on descend sur la page
const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
        }
    });
});

// On observe toutes les sections et les cartes
document.querySelectorAll('section, .card').forEach((el) => {
    el.classList.add('hidden-element'); // On ajoute une classe de base
    observer.observe(el);
});