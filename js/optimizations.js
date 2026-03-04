// optimizations.js ─────────────────────────────────────────────

function optimizePerformance() {

    const nav = document.querySelector('.navbar');

    window.addEventListener('scroll', () => {

        const scroll = window.scrollY;

        if (nav) {
            nav.classList.toggle('scrolled', scroll > 50);
        }

    }, { passive: true });

    lazyLoadImages();

}

function lazyLoadImages() {

    const imgs = document.querySelectorAll('img[loading="lazy"]');

    const observer = new IntersectionObserver(entries => {

        entries.forEach(entry => {

            if (entry.isIntersecting) {
                entry.target.classList.add('loaded');
                observer.unobserve(entry.target);
            }

        });

    });

    imgs.forEach(img => observer.observe(img));

}