(function () {
    'use strict';

    const searchScript = document.createElement('script');
    searchScript.src = `${'../'.repeat(Math.max(0, new URL(document.baseURI).pathname.split('/').length - 2))}assets/js/search.js`;
    searchScript.defer = true;
    document.head.append(searchScript);

    document.addEventListener('click', (event) => {
        const toggle = event.target.closest('.nav-toggle');
        if (!toggle) return;
        const navigation = document.getElementById(toggle.getAttribute('aria-controls'));
        const open = toggle.getAttribute('aria-expanded') === 'true';
        toggle.setAttribute('aria-expanded', String(!open));
        navigation?.classList.toggle('is-open', !open);
    });

    document.addEventListener('click', (event) => {
        const themeButton = event.target.closest('.theme-btn');
        if (!themeButton) return;
        const enabled = document.documentElement.classList.toggle('theme-light');
        themeButton.setAttribute('aria-pressed', String(enabled));
    });

    document.addEventListener('click', (event) => {
        const searchButton = event.target.closest('.search-btn');
        if (!searchButton) return;
        let search = document.getElementById('site-search');
        if (!search) {
            search = document.createElement('form');
            search.id = 'site-search';
            search.className = 'site-search';
            search.setAttribute('role', 'search');
            search.innerHTML = '<label class="sr-only" for="site-search-input">Search articles</label><input id="site-search-input" type="search" placeholder="Search articles" autocomplete="off">';
            document.querySelector('.site-header')?.append(search);
        }
        const expanded = searchButton.getAttribute('aria-expanded') === 'true';
        searchButton.setAttribute('aria-expanded', String(!expanded));
        search.hidden = expanded;
        if (!expanded) search.querySelector('input')?.focus();
    });

    window.addEventListener('scroll', () => {
        document.querySelector('[data-site-header]')?.classList.toggle('is-scrolled', window.scrollY > 8);
    }, { passive: true });
}());