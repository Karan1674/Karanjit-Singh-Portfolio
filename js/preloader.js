// preloader.js ─────────────────────────────────────────

function initPreloader() {

    const pre = document.querySelector('.preloader');
    if (!pre) return;

    history.scrollRestoration = "manual";

    document.body.classList.add('loading');
    document.body.style.overflow = 'hidden';

    loadAllImages().then(() => {

        document.body.classList.add('preloader-fading');

        setTimeout(() => {

            gsap.to(pre, {
                opacity: 0,
                duration: 0.8,
                ease: "power2.out",

                onStart: () => {
                    document.body.classList.add('loading');
                },

                onComplete: () => {

                    pre.classList.add('hidden');
                    pre.style.display = 'none';

                    document.body.classList.remove('loading');
                    document.body.style.overflow = '';

                    window.scrollTo(0, 0);

                    startHeroAnimations();

                    setTimeout(() => {
                        if (typeof initScrollAnimations === "function") {
                            initScrollAnimations();
                        }
                    }, 300);

                }

            });

        }, 1500);

    });

}


function loadAllImages() {

    return new Promise(resolve => {

        const imgs = document.querySelectorAll('img');
        let loaded = 0;
        const total = imgs.length || 1;

        const check = () => {
            loaded++;
            if (loaded >= total) resolve();
        };

        imgs.forEach(img => {

            if (img.complete && img.naturalHeight !== 0) {

                img.classList.add('loaded');
                check();

            } else {

                img.addEventListener('load', () => {
                    img.classList.add('loaded');
                    check();
                }, { once: true });

                img.addEventListener('error', () => {
                    img.classList.add('loaded');
                    check();
                }, { once: true });

            }

        });

        setTimeout(() => {

            imgs.forEach(img => {
                if (!img.classList.contains('loaded')) {
                    img.classList.add('loaded');
                }
            });

            resolve();

        }, 4000);

    });

}

function startHeroAnimations() {

    const hero = document.querySelector('.hero-content');

    if (hero) {
        hero.classList.add('hero-content-ready');
    }

    gsap.from('.hero-content > *', {
        duration: 1,
        y: 60,
        opacity: 0,
        stagger: 0.15,
        ease: "power3.out",
        delay: 0.2
    });

    gsap.from('.hero-visual', {
        duration: 1.2,
        opacity: 0,
        scale: 0.95,
        ease: "power3.out",
        delay: 0.5
    });

    gsap.from('.tech-stack', {
        duration: 1,
        opacity: 0,
        y: 30,
        stagger: 0.1,
        ease: "back.out(1.7)",
        delay: 1
    });

}