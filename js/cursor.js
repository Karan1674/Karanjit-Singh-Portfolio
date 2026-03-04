// cursor.js ─────────────────────────────────────────

class CursorSystem {
    constructor() {
        if (innerWidth <= 768 || 'ontouchstart' in window) return;

        this.mouse = { x: 0, y: 0 };
        this.ringPos = { x: 0, y: 0 };

        this.init();
    }

    init() {
        this.getThemeColors();
        this.createElements();
        this.bind();
        this.animate();
    }

    getThemeColors() {
        const styles = getComputedStyle(document.documentElement);
        this.primary = styles.getPropertyValue('--accent-primary').trim();
        this.secondary = styles.getPropertyValue('--accent-secondary').trim();
    }


    createElements() {
        this.dot = document.createElement('div');
        Object.assign(this.dot.style, {
            position: 'fixed',
            width: '10px',
            height: '10px',
            borderRadius: '50%',
            pointerEvents: 'none',
            zIndex: 99999,
            background: `radial-gradient(circle, ${this.primary}, ${this.secondary})`,
            boxShadow: `0 0 15px ${this.primary}`,
            transform: 'translate(-50%, -50%)'
        });

        this.ring = document.createElement('div');
        Object.assign(this.ring.style, {
            position: 'fixed',
            width: '40px',
            height: '40px',
            borderRadius: '50%',
            pointerEvents: 'none',
            zIndex: 99998,
            border: `2px solid ${this.primary}`,
            background: `${this.primary}15`,
            transform: 'translate(-50%, -50%)'
        });

        document.body.appendChild(this.dot);
        document.body.appendChild(this.ring);
    }


    bind() {
        document.addEventListener('mousemove', e => {
            this.mouse.x = e.clientX;
            this.mouse.y = e.clientY;

            this.dot.style.left = this.mouse.x + 'px';
            this.dot.style.top = this.mouse.y + 'px';
        });

        document.addEventListener('mouseover', e => {
            if (e.target.closest('a,button,.project-card,.filter-btn,.action-btn')) {
                this.expand();
            }
        });

        document.addEventListener('mouseout', e => {
            if (e.target.closest('a,button,.project-card,.filter-btn,.action-btn')) {
                this.contract();
            }
        });
    }

    animate() {
        this.ringPos.x += (this.mouse.x - this.ringPos.x) * 0.25;
        this.ringPos.y += (this.mouse.y - this.ringPos.y) * 0.25;

        this.ring.style.left = this.ringPos.x + 'px';
        this.ring.style.top = this.ringPos.y + 'px';

        requestAnimationFrame(() => this.animate());
    }


    expand() {
        this.ring.style.transform = 'translate(-50%, -50%) scale(1.4)';
        this.ring.style.borderColor = this.secondary;
        this.ring.style.background = `${this.secondary}20`;

        this.dot.style.transform = 'translate(-50%, -50%) scale(1.2)';
    }

    contract() {
        this.ring.style.transform = 'translate(-50%, -50%) scale(1)';
        this.ring.style.borderColor = this.primary;
        this.ring.style.background = `${this.primary}15`;

        this.dot.style.transform = 'translate(-50%, -50%) scale(1)';
    }
}

