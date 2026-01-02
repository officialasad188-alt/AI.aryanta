window.addEventListener('DOMContentLoaded', () => {
    // 1. Theme Check
    const savedTheme = localStorage.getItem('theme') || 'dark';
    if(savedTheme === 'system') {
        const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        document.documentElement.setAttribute('data-theme', isDark ? 'dark' : 'light');
    } else {
        document.documentElement.setAttribute('data-theme', savedTheme);
    }

    // 2. Splash Screen Logic
    const splash = document.getElementById('splash-screen');
    setTimeout(() => {
        splash.style.opacity = '0';
        setTimeout(() => {
            splash.style.display = 'none';
            // Notify App JS that Splash is Done
            document.dispatchEvent(new Event('app-ready-check-pin'));
        }, 600);
    }, 1500);
});
