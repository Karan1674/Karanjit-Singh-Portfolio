// scrolling.js ─────────────────────────────────────────────────────────────

function initSmoothScrolling() {

    lenis = new Lenis({
        duration: 0.7,
        easing: t => 1 - Math.pow(1 - t, 5),
        direction: 'vertical',
        gestureDirection: 'vertical',
        smooth: true,
        mouseMultiplier: 1.4,
        smoothTouch: true,
        touchMultiplier: 3.0,
        infinite: false,
        normalizeWheel: true
    });

    lenis.on('scroll', ScrollTrigger.update);

    gsap.ticker.add(time => lenis.raf(time * 1000));
    gsap.ticker.lagSmoothing(0);

    setupEnhancedScrollAnimations();

}


function setupEnhancedScrollAnimations() {

    gsap.registerPlugin(ScrollTrigger);

    ScrollTrigger.config({
        limitCallbacks: true,
        syncInterval: 150
    });

    document.querySelectorAll('section').forEach(section => {

        const title = section.querySelector('.section-title');
        const subtitle = section.querySelector('.section-subtitle');

        if (title || subtitle) {

            ScrollTrigger.create({
                trigger: section,
                start: 'top 85%',
                once: true,

                onEnter: () => {

                    title && gsap.from(title,{
                        y:30,
                        opacity:0,
                        duration:0.4,
                        ease:"power2.out"
                    });

                    subtitle && gsap.from(subtitle,{
                        y:20,
                        opacity:0,
                        duration:0.4,
                        delay:0.05,
                        ease:"power2.out"
                    });

                }
            });

        }

    });

}


function animateProjects() {
      document.querySelectorAll('.project-card').forEach((item, i) => {
        gsap.set(item, {opacity:1, y:0, scale:1});

        gsap.from(item, {
            scrollTrigger: {trigger:item, start:"top 85%", toggleActions:"play none none none"},
            duration:0.6, y:20, opacity:0, delay:i*0.12, ease:"power2.out"
        });

        item.addEventListener('mouseenter', () => gsap.to(item, {y:-15, rotationY:5, duration:0.4, ease:"power2.out"}));
        item.addEventListener('mouseleave', () => gsap.to(item, {y:0, rotationY:0, duration:0.4, ease:"power2.out"}));
    });

}

function animateSkills() {

      const skills = gsap.utils.toArray('.skill-card, .soft-skill-card');

    skills.forEach((card, i) => {

        gsap.from(card, {
            scrollTrigger: {
                trigger: '.skills-section',
                start: "top 80%",
                once: true
            },
            y: 20,
            opacity: 0,
            duration: 0.3,
            delay: i * 0.05,
            ease: "power3.out"
        });

    });

}

function initScrollAnimations() {

    gsap.utils.toArray('.section').forEach(section => {

        gsap.from(section.querySelectorAll('.section-header > *'), {
            scrollTrigger: {
                trigger: section,
                start: "top 85%"
            },
            duration: 0.8,
            y: 40,
            opacity: 0,
            stagger: 0.1,
            ease: "power2.out"
        });

    });


    ScrollTrigger.create({
        trigger: '.skills-section',
        start: "top 60%",
        once: true,
        onEnter: animateSkills
    });


    ScrollTrigger.create({
        trigger: '.projects-section',
        start: "top 60%",
        once: true,
        onEnter: animateProjects
    });


    gsap.utils.toArray('.testimonial-card, .contact-item, .timeline-item')
    .forEach((el, i) => {

        gsap.from(el,{
            scrollTrigger:{
                trigger: el,
                start:"top 80%"
            },
            duration:0.25,
            y:20,
            opacity:0,
            delay:i*0.02,
            ease:"power2.out"
        });

    });



    gsap.utils.toArray('.stat-item').forEach((stat, i) => {
        gsap.from(stat, {
            scrollTrigger: {
                trigger: stat,
                start: "top 80%",
                toggleActions: "play none none none"
            },
            duration: 0.8,
            scale: 0.8,
            opacity: 0,
            delay: i * 0.1,
            ease: "back.out(1.7)"
        });
    });

}