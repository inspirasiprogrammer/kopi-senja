const navbar = document.querySelector('.navbar');
const navToggle = document.getElementById('navToggle');
const navLinks = document.getElementById('navLinks');
const navAnchors = document.querySelectorAll('.nav-links a');
const themeToggle = document.getElementById('themeToggle');
const themeIcon = themeToggle.querySelector('i');
const body = document.body;
const hero = document.querySelector('.hero');
const heroEyebrow = document.querySelector('.hero-content .eyebrow');
const heroTitle = document.querySelector('.hero-content h1');
const heroText = document.querySelector('.hero-content p');
const heroCta = document.querySelector('.hero-content .hero-cta');

const savedTheme = localStorage.getItem('theme');
const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

function setTheme(theme, persist = true) {
    const isDark = theme === 'dark';

    body.classList.add('theme-animating');
    body.classList.toggle('dark-theme', isDark);
    themeIcon.className = isDark ? 'fa-solid fa-sun' : 'fa-solid fa-moon';
    themeToggle.setAttribute('aria-label', isDark ? 'Aktifkan mode terang' : 'Aktifkan mode gelap');
    themeToggle.setAttribute('aria-pressed', String(isDark));

    window.setTimeout(() => {
        body.classList.remove('theme-animating');
    }, 520);

    if (persist) {
        localStorage.setItem('theme', theme);
    }
}

setTheme(savedTheme || (prefersDark ? 'dark' : 'light'), false);

themeToggle.addEventListener('click', () => {
    setTheme(body.classList.contains('dark-theme') ? 'light' : 'dark');
});

window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
        navbar.classList.add('sticky');
    } else {
        navbar.classList.remove('sticky');
    }
});

navToggle.addEventListener('click', () => {
    navLinks.classList.toggle('open');
    navToggle.setAttribute('aria-expanded', String(navLinks.classList.contains('open')));
});

navAnchors.forEach((anchor) => {
    anchor.addEventListener('click', () => {
        navLinks.classList.remove('open');
        navToggle.setAttribute('aria-expanded', 'false');
    });
});

const sections = document.querySelectorAll('main section, header');

function setActiveLink() {
    const scrollY = window.pageYOffset;

    sections.forEach((section) => {
        const sectionTop = section.offsetTop - 120;
        const sectionHeight = section.offsetHeight;
        const sectionId = section.getAttribute('id');

        if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
            navAnchors.forEach((link) => {
                link.classList.remove('active');
                if (link.getAttribute('href') === `#${sectionId}`) {
                    link.classList.add('active');
                }
            });
        }
    });
}

window.addEventListener('scroll', setActiveLink);
setActiveLink();

const revealElements = document.querySelectorAll('.reveal');

document.querySelectorAll('section, header').forEach((section) => {
    const items = section.querySelectorAll('.reveal');
    items.forEach((item, index) => {
        item.style.setProperty('--reveal-delay', `${Math.min(index * 90, 420)}ms`);
    });
});

const revealObserver = new IntersectionObserver(
    (entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.classList.add('show');
                revealObserver.unobserve(entry.target);
            }
        });
    },
    {
        threshold: 0.2,
    }
);

revealElements.forEach((el) => revealObserver.observe(el));

const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

if (!reducedMotion) {
    let ticking = false;

    function runParallax() {
        const scrollY = window.scrollY;

        if (hero && scrollY < hero.offsetHeight * 1.2) {
            const bgY = 50 + scrollY * 0.035;
            hero.style.backgroundPosition = `center ${bgY}%`;

            const heroShift = Math.min(scrollY * 0.14, 92);

            if (heroEyebrow) {
                heroEyebrow.style.transform = `translate3d(0, ${heroShift * 0.25}px, 0)`;
            }

            if (heroTitle) {
                heroTitle.style.transform = `translate3d(0, ${heroShift * 0.52}px, 0)`;
            }

            if (heroText) {
                heroText.style.transform = `translate3d(0, ${heroShift * 0.7}px, 0)`;
            }

            if (heroCta) {
                heroCta.style.transform = `translate3d(0, ${heroShift * 0.92}px, 0)`;
            }
        }

        ticking = false;
    }

    window.addEventListener('scroll', () => {
        if (!ticking) {
            window.requestAnimationFrame(runParallax);
            ticking = true;
        }
    }, { passive: true });
}

const contactForm = document.querySelector('.contact-form');

contactForm.addEventListener('submit', (event) => {
    event.preventDefault();
    const button = contactForm.querySelector('button');
    const initialText = button.textContent;

    button.textContent = 'Pesan Terkirim';
    button.disabled = true;

    setTimeout(() => {
        button.textContent = initialText;
        button.disabled = false;
        contactForm.reset();
    }, 1800);
});
