(function () {
    'use strict';

    const storageKey = 'tzeptosoft-theme';
    const savedTheme = localStorage.getItem(storageKey);
    const initialTheme = savedTheme || 'dark';

    document.documentElement.setAttribute('data-theme', initialTheme);

    function updateButton(theme) {
        const button = document.querySelector('.theme-btn');
        const icon = button?.querySelector('.theme-icon');
        if (!button || !icon) return;
        const light = theme === 'light';
        button.setAttribute('aria-pressed', String(light));
        button.setAttribute('aria-label', light ? 'Switch to dark theme' : 'Switch to light theme');
        icon.textContent = light ? '☾' : '☀';
    }

    function setTheme(theme) {
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem(storageKey, theme);
        updateButton(theme);
    }

    document.addEventListener('click', (event) => {
        if (!event.target.closest('.theme-btn')) return;
        const currentTheme = document.documentElement.getAttribute('data-theme') || initialTheme;
        setTheme(currentTheme === 'dark' ? 'light' : 'dark');
    });

    updateButton(initialTheme);
    new MutationObserver(() => updateButton(document.documentElement.getAttribute('data-theme') || initialTheme))
        .observe(document.body, { childList: true, subtree: true });
}());