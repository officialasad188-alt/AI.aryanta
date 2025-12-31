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
    setTimeout(() => {
        const splash = document.getElementById('splash-screen');
        const main = document.getElementById('main-app');
        
        splash.style.opacity = '0';
        setTimeout(() => {
            splash.style.display = 'none';
            main.style.display = 'block';
            
            // Show welcome toast
            const toast = document.getElementById('toast');
            toast.classList.add('visible');
            setTimeout(() => toast.classList.remove('visible'), 3000);
        }, 600);
    }, 2000);
});
