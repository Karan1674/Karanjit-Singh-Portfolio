// theme.js ─────────────────────────────────────────────────────────────────


class ThemeManager {
    constructor() {
        this.theme = localStorage.getItem('themeSetting') || 'dark';
        this.init();
    }

    init() {
        document.documentElement.setAttribute('data-theme', this.theme);
        document.body.setAttribute('data-theme', this.theme);
        this.updateThemeIcon();
        currentTheme = this.theme;
    }

    toggle() {
        this.theme = this.theme === 'light' ? 'dark' : 'light';
        localStorage.setItem('themeSetting', this.theme);

        document.documentElement.setAttribute('data-theme', this.theme);
        document.body.setAttribute('data-theme', this.theme);
        this.updateThemeIcon();
        currentTheme = this.theme;

        if (heroModel) this.updateModelColors();
        if (particleSystem) this.updateParticleColors();


    }

    updateThemeIcon() {
        const icon = document.querySelector('.theme-icon');
        if (!icon) return;

        if (!icon.dataset.initialized) {
            icon.setAttribute('data-lucide', this.theme === 'dark' ? 'sun' : 'moon');
            window.lucide?.createIcons();
            icon.dataset.initialized = 'true';
            return;
        }

        gsap.to(icon, {
            duration: 0.3, scale: 0, rotation: 180, ease: "power2.in",
            onComplete: () => {
                icon.setAttribute('data-lucide', this.theme === 'dark' ? 'sun' : 'moon');
                window.lucide?.createIcons();
                gsap.to(icon, { duration: 0.4, scale: 1, rotation: 0, ease: "back.out(1.7)" });
            }
        });
    }

    updateModelColors() {
        if (!heroModel) return;
        heroModel.traverse(child => {

            if (!child.isMesh) return;
            if (!child.material?.color) return;

            const col = this.theme === 'dark' ? 0x6366f1 : 0x8b5cf6;

            gsap.to(child.material.color, {
                duration: 1,
                r: ((col >> 16) & 255) / 255,
                g: ((col >> 8) & 255) / 255,
                b: (col & 255) / 255
            });

        });
    }

    updateParticleColors() {
        if (!particleSystem) return;
        const mat = particleSystem.material;
        const col = this.theme === 'dark' ? 0x6366f1 : 0x8b5cf6;
        gsap.to(mat.color, {
            duration: 1,
            r: ((col >> 16) & 255) / 255,
            g: ((col >> 8) & 255) / 255,
            b: (col & 255) / 255,
            ease: "power2.out"
        });
    }
}