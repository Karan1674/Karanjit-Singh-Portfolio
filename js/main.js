// main.js ──────────────────────────────────────────────────

document.addEventListener('DOMContentLoaded', () => {

    themeManager = new ThemeManager();

    initSmoothScrolling();

    initPreloader();

    init3DScene();

    initProjectFiltering();

    initInteractiveElements();

    optimizePerformance();

    if (window.CursorSystem) {
        new CursorSystem();
    }

    if (window.lucide) lucide.createIcons();

    console.log('Portfolio initialized ✓');

});