// interactive.js ───────────────────────────────────────────────

function initInteractiveElements() {

    document.querySelector('#themeToggle')?.addEventListener('click', () => themeManager.toggle());

    const toggle = document.querySelector('#mobileToggle');
    const menu = document.querySelector('#navMenu');

    if (toggle && menu) {

        toggle.addEventListener('click', () => {
            menu.classList.toggle('mobile-open');
            toggle.classList.toggle('active');
            document.body.classList.toggle('menu-open');
        });

        menu.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', () => {
                menu.classList.remove('mobile-open');
                toggle.classList.remove('active');
                document.body.classList.remove('menu-open');
            });
        });

    }

    initNavbarScrollDetection();
    addHoverEffects();

}


function addHoverEffects() {

    if (window.matchMedia("(hover: none)").matches) return;
    document.querySelectorAll('.skill-card,.project-card,.contact-item').forEach(el => {

        el.addEventListener('mouseenter', () => gsap.to(el, { y: -10, duration: 0.3 }));
        el.addEventListener('mouseleave', () => gsap.to(el, { y: 0, duration: 0.3 }));

    });

}


function initCounters() {

    const counters = document.querySelectorAll('.counter');

    const observer = new IntersectionObserver(entries => {

        entries.forEach(entry => {

            if (!entry.isIntersecting) return;

            const el = entry.target;
            const target = parseFloat(el.dataset.target) || 0;
            const suffix = el.dataset.suffix || '';

            let start = 0;

            const update = () => {

                start += target / 60;

                if (start >= target) {
                    el.textContent = target + suffix;
                    return;
                }

                el.textContent = (target % 1 ? start.toFixed(1) : Math.floor(start)) + suffix;

                requestAnimationFrame(update);

            };

            update();

            observer.unobserve(el);

        });

    }, { threshold: 0.4 });

    counters.forEach(c => observer.observe(c));

}

function initProjectFiltering() {

    const btns = document.querySelectorAll('.filter-btn');
    const cards = document.querySelectorAll('.project-gallery .projects-grid .project-card');
    const loadMoreBtn = document.getElementById('loadMoreBtn');

    if (!btns.length || !cards.length) return;

    let currentFilter = "all";
    let visibleCount = 6;

    function updateProjects() {

        const matching = [];
        const nonMatching = [];

        cards.forEach(card => {

            const category = card.dataset.category;
            const show = currentFilter === 'all' || category === currentFilter;

            if (show) matching.push(card);
            else nonMatching.push(card);

        });

        const visibleCards = matching.slice(0, visibleCount);
        const hiddenCards = matching.slice(visibleCount);

        const tl = gsap.timeline();

        if (nonMatching.length) {
            tl.to(nonMatching, {
                opacity: 0,
                y: -20,
                scale: 0.95,
                duration: 0.25,
                stagger: 0.05,
                ease: "power2.in",
                onComplete: () => {
                    nonMatching.forEach(c => c.style.display = 'none');
                }
            });
        }

        hiddenCards.forEach(c => c.style.display = 'none');

        visibleCards.forEach(c => c.style.display = 'flex');

        tl.fromTo(
            visibleCards,
            {
                opacity: 0,
                y: 30,
                scale: 0.95
            },
            {
                opacity: 1,
                y: 0,
                scale: 1,
                duration: 0.4,
                stagger: 0.08,
                ease: "power3.out"
            },
            "-=0.1"
        );

        if (matching.length > visibleCount) {
            loadMoreBtn.style.display = "inline-flex";
        } else {
            loadMoreBtn.style.display = "none";
        }

    }

    btns.forEach(b => {

        b.addEventListener('click', () => {

            btns.forEach(bb => {
                bb.classList.remove('active');
                gsap.to(bb, {
                    scale: 1,
                    duration: 0.2
                });
            });

            b.classList.add('active');

            gsap.to(b, {
                scale: 1.05,
                duration: 0.3,
                ease: "back.out(1.7)"
            });

            currentFilter = b.dataset.filter;
            visibleCount = 6;

            updateProjects();

        });

    });

    loadMoreBtn.addEventListener("click", () => {
        visibleCount += 6;
        updateProjects();
    });

    updateProjects();

}


function updateCopyrightYear() {
    const yearElement = document.getElementById('copyright-year');
    if (!yearElement) return;

    const currentYear = new Date().getFullYear();
    yearElement.textContent = currentYear;
}


initCounters();
updateCopyrightYear()