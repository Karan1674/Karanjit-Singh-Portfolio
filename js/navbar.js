// navbar.js ─────────────────────────────────────────────

class NavbarSystem {

    constructor() {
        this.links = document.querySelectorAll(".nav-link");
        this.sections = document.querySelectorAll("section[id]");
        this.init();
    }

    init() {

        this.handleClicks();

        window.addEventListener("load", () => {
            setTimeout(() => {
                this.updateActiveSection();
            }, 500);
        });

        window.addEventListener("scroll", () => {
            this.updateActiveSection();
        });

    }

    updateActiveSection() {

        let currentSection = "home";
        let closestDistance = Infinity;

        this.sections.forEach(section => {

            const rect = section.getBoundingClientRect();
            const distance = Math.abs(rect.top);

            if (rect.top <= window.innerHeight * 0.4 && distance < closestDistance) {
                closestDistance = distance;
                currentSection = section.id;
            }

        });

        this.setActive(currentSection);

    }

    handleClicks() {

        this.links.forEach(link => {

            link.addEventListener("click", e => {

                e.preventDefault();

                const id = link.getAttribute("href").substring(1);
                const target = document.getElementById(id);

                if (!target) return;

                this.setActive(id);

                if (window.lenis) {
                    lenis.scrollTo(target, { offset: -100, duration: 0.7 });
                } else {
                    window.scrollTo({
                        top: target.offsetTop - 100,
                        behavior: "smooth"
                    });
                }

            });

        });

    }

    setActive(id) {

        let target = id;

        if (id === "skills" || id === "experience" || id === "education") {
            target = "about";
        }

        if (id === "testimonials") {
            target = "freelance";
        }

        this.links.forEach(link => {

            const href = link.getAttribute("href");
            link.classList.toggle("active", href === `#${target}`);

        });

    }

}

function initNavbarScrollDetection() {
    new NavbarSystem();
}
