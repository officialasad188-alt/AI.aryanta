window.addEventListener('DOMContentLoaded', () => {
    // 1. Theme Check
    const savedTheme = localStorage.getItem('theme') || 'dark';
    if(savedTheme === 'system') {
        const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        document.documentElement.setAttribute('data-theme', isDark ? 'dark' : 'light');
    } else {
        document.documentElement.setAttribute('data-theme', savedTheme);
    }

    // 2. Check for PIN Security first
    const hasPin = localStorage.getItem('user-pin');
    const splash = document.getElementById('splash-screen');
    const main = document.getElementById('main-app');

    // Splash Screen Logic
    setTimeout(() => {
        splash.style.opacity = '0';
        setTimeout(() => {
            splash.style.display = 'none';
            // If PIN is set, verify it before showing main app
            if(hasPin) {
                // Pin logic is in app.js, we trigger an event or just let app.js handle rendering
                // We rely on app.js to catch the load and show PIN screen
                document.dispatchEvent(new Event('app-ready-check-pin'));
            } else {
                main.style.display = 'block';
                const toast = document.getElementById('toast');
                toast.classList.add('visible');
                setTimeout(() => toast.classList.remove('visible'), 3000);
            }
        }, 600);
    }, 2000);
});
