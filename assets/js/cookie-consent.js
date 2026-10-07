(function () {
    'use strict';

    const STORAGE_KEY = 'cookie_consent';
    const BANNER_ID = 'cookie-consent-banner';

    function setConsent(choice) {
        localStorage.setItem(STORAGE_KEY, choice);
        document.documentElement.dataset.cookieConsent = choice;
        if (choice === 'essential-only') {
            document.querySelectorAll('script[data-analytics], script[data-cookie-optional]').forEach((node) => node.remove());
            document.querySelectorAll('link[data-cookie-optional]').forEach((node) => node.remove());
            return;
        }

        if (choice === 'accept-all' || choice === 'custom') {
            const prefetch = document.createElement('link');
            prefetch.rel = 'prefetch';
            prefetch.href = '/assets/js/main.js';
            prefetch.setAttribute('data-cookie-optional', 'true');
            if (!document.querySelector('link[data-cookie-optional][href="/assets/js/main.js"]')) {
                document.head.append(prefetch);
            }
        }
    }

    function hideBanner() {
        const banner = document.getElementById(BANNER_ID);
        if (banner) {
            banner.remove();
        }
    }

    function chooseConsent(choice) {
        setConsent(choice);
        hideBanner();
    }

    function showBanner() {
        if (document.getElementById(BANNER_ID)) return;

        const banner = document.createElement('div');
        banner.id = BANNER_ID;
        banner.setAttribute('role', 'dialog');
        banner.setAttribute('aria-live', 'polite');
        banner.style.position = 'fixed';
        banner.style.left = '0';
        banner.style.right = '0';
        banner.style.bottom = '0';
        banner.style.zIndex = '9999';
        banner.style.padding = '1rem 1.25rem';
        banner.style.background = 'rgba(10, 15, 26, 0.96)';
        banner.style.borderTop = '1px solid rgba(255, 255, 255, 0.18)';
        banner.style.boxShadow = '0 -12px 30px rgba(0, 0, 0, 0.3)';
        banner.style.color = '#fff';

        banner.innerHTML = `
            <div style="max-width: 1180px; margin: 0 auto; display: flex; gap: 1rem; align-items: center; justify-content: space-between; flex-wrap: wrap;">
                <div style="max-width: 620px;">
                    <div style="font-weight: 700; font-size: 1rem; margin-bottom: 0.25rem;">Cookie Preferences</div>
                    <div style="font-size: 0.9rem; color: rgba(255,255,255,0.8);">We use cookies for essential site functionality and to improve your experience. Choose your preference below.</div>
                </div>
                <div style="display: flex; gap: 0.75rem; flex-wrap: wrap;">
                    <button type="button" data-cookie-choice="accept-all" style="padding: .7rem 1rem; border-radius: 8px; border: 1px solid rgba(33,212,194,0.7); background: rgba(33,212,194,0.15); color: #fff; cursor: pointer; font-weight: 600;">Accept All</button>
                    <button type="button" data-cookie-choice="essential-only" style="padding: .7rem 1rem; border-radius: 8px; border: 1px solid rgba(255,255,255,0.2); background: transparent; color: #fff; cursor: pointer; font-weight: 600;">Essential Only</button>
                    <button type="button" data-cookie-choice="custom" style="padding: .7rem 1rem; border-radius: 8px; border: 1px solid rgba(0,136,255,0.7); background: rgba(0,136,255,0.15); color: #fff; cursor: pointer; font-weight: 600;">Custom</button>
                </div>
            </div>
        `;

        document.body.appendChild(banner);

        banner.querySelectorAll('[data-cookie-choice]').forEach((button) => {
            button.addEventListener('click', () => chooseConsent(button.getAttribute('data-cookie-choice')));
        });
    }

    function initialize() {
        const savedChoice = localStorage.getItem(STORAGE_KEY);
        if (savedChoice) {
            setConsent(savedChoice);
            return;
        }
        showBanner();
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initialize, { once: true });
    } else {
        initialize();
    }
}());
