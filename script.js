(() => {
const $ = (q, el = document) => el.querySelector(q);
const $$ = (q, el = document) => Array.from(el.querySelectorAll(q));


const header = $('[data-header]');
const nav = $('[data-nav]');
const menuToggle = $('[data-menu-toggle]');
const themeToggle = $('[data-theme-toggle]');
const year = $('[data-year]');
const toast = $('[data-toast]');


// ====== Helpers
const sleep = (ms) => new Promise(r => setTimeout(r, ms));
const showToast = async (msg) => {
if (!toast) return;
toast.textContent = msg;
toast.classList.add('is-show');
await sleep(1800);
toast.classList.remove('is-show');
};


// ====== Year
if (year) year.textContent = String(new Date().getFullYear());


// ====== Theme
const THEME_KEY = 'ne_theme';
const getPreferredTheme = () => {
const saved = localStorage.getItem(THEME_KEY);
if (saved === 'dark' || saved === 'light') return saved;
return window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches
? 'light'
: 'dark';
};


const applyTheme = (t) => {
document.documentElement.setAttribute('data-theme', t);
if (themeToggle) themeToggle.querySelector('.iconbtn__icon').textContent = t === 'light' ? '☀' : '☾';
};


applyTheme(getPreferredTheme());


themeToggle?.addEventListener('click', () => {
const current = document.documentElement.getAttribute('data-theme') || 'dark';
const next = current === 'dark' ? 'light' : 'dark';
localStorage.setItem(THEME_KEY, next);
applyTheme(next);
showToast(next === 'light' ? 'Thème clair' : 'Thème sombre');
});


// ====== Mobile menu
const closeMenu = () => nav?.classList.remove('is-open');
menuToggle?.addEventListener('click', () => {
nav?.classList.toggle('is-open');
});
window.addEventListener('keydown', (e) => {
if (e.key === 'Escape') closeMenu();
});
nav?.addEventListener('click', (e) => {
const a = e.target.closest('a');
if (!a) return;
closeMenu();
});


// ====== Reveal on scroll
const revealEls = $$('[data-reveal]');
if ('IntersectionObserver' in window) {
const io = new IntersectionObserver((entries) => {
entries.forEach((entry) => {
if (entry.isIntersecting) {
entry.target.classList.add('is-revealed');
io.unobserve(entry.target);
}
});
}, { threshold: 0.12 });


revealEls.forEach(el => io.observe(el));
} else {
revealEls.forEach(el => el.classList.add('is-revealed'));
}


// ====== Scrollspy
const links = $$('.nav__link');
const sections = links
.map(a => $(a.getAttribute('href')))
})();