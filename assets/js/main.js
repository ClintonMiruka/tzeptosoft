(function () {
    'use strict';

    const rootPath = `${'../'.repeat(Math.max(0, new URL(document.baseURI).pathname.split('/').length - 2))}`;

    const faviconLinks = [
        { rel: 'icon', type: 'image/png', sizes: '32x32', href: `${rootPath}assets/images/favicon-32x32.png` },
        { rel: 'icon', type: 'image/png', sizes: '16x16', href: `${rootPath}assets/images/favicon-16x16.png` },
        { rel: 'apple-touch-icon', sizes: '180x180', href: `${rootPath}assets/images/apple-touch-icon.png` }
    ];

    faviconLinks.forEach((linkInfo) => {
        const selector = `link[rel="${linkInfo.rel}"]${linkInfo.sizes ? `[sizes="${linkInfo.sizes}"]` : ''}`;
        if (!document.head.querySelector(selector)) {
            const link = document.createElement('link');
            link.rel = linkInfo.rel;
            if (linkInfo.type) link.type = linkInfo.type;
            if (linkInfo.sizes) link.sizes = linkInfo.sizes;
            link.href = linkInfo.href;
            document.head.append(link);
        }
    });

    const searchScript = document.createElement('script');
    searchScript.src = `${rootPath}assets/js/search.js`;
    searchScript.defer = true;
    document.head.append(searchScript);

    const cookieConsentScript = document.createElement('script');
    cookieConsentScript.src = `${rootPath}assets/js/cookie-consent.js`;
    cookieConsentScript.defer = true;
    document.head.append(cookieConsentScript);

    const newsletterScript = document.createElement('script');
    newsletterScript.src = `${rootPath}assets/js/newsletter.js`;
    newsletterScript.defer = true;
    document.head.append(newsletterScript);

    const thankYouScript = document.createElement('script');
    thankYouScript.src = `${rootPath}assets/js/modal-thankyou.js`;
    thankYouScript.defer = true;
    document.head.append(thankYouScript);

    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register(`${rootPath}sw.js`, { scope: `${rootPath}` }).catch((error) => console.warn('Service worker registration failed:', error));
    }

    document.addEventListener('click', (event) => {
        const toggle = event.target.closest('.nav-toggle');
        if (!toggle) return;
        const header = document.querySelector('[data-site-header]');
        const navigation = document.getElementById(toggle.getAttribute('aria-controls'));
        const open = toggle.getAttribute('aria-expanded') === 'true';
        toggle.setAttribute('aria-expanded', String(!open));
        navigation?.classList.toggle('is-open', !open);
        header?.classList.remove('header-hidden');
        header?.classList.add('header-visible');
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
        const header = document.querySelector('[data-site-header]');
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
        header?.classList.remove('header-hidden');
        header?.classList.add('header-visible');
        if (!expanded) search.querySelector('input')?.focus();
    });

    let lastScrollY = window.scrollY;
    let scrollFrame;

    window.addEventListener('scroll', () => {
        if (scrollFrame) return;
        scrollFrame = window.requestAnimationFrame(() => {
            const header = document.querySelector('[data-site-header]');
            const currentScrollY = window.scrollY;
            if (header) {
                const delta = currentScrollY - lastScrollY;
                if (currentScrollY <= 20) {
                    header.classList.remove('header-hidden');
                    header.classList.remove('header-visible', 'header-scrolled');
                } else if (delta > 4) {
                    header.classList.add('header-hidden');
                    header.classList.remove('header-visible');
                } else if (delta < -2) {
                    header.classList.remove('header-hidden');
                    header.classList.add('header-visible');
                }
            }
            lastScrollY = currentScrollY;
            scrollFrame = undefined;
        });
    }, { passive: true });
}());