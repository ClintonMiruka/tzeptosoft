(function () {
    'use strict';

    const pagePath = new URL(document.baseURI).pathname;
    const root = '../'.repeat(Math.max(0, pagePath.split('/').length - 2));

    function loadComponent(targetId, fileName) {
        const target = document.getElementById(targetId);
        if (!target) return Promise.resolve();

        return fetch(`${root}components/${fileName}`)
            .then((response) => {
                if (!response.ok) throw new Error(`Unable to load ${fileName}`);
                return response.text();
            })
            .then((html) => {
                target.innerHTML = html.replaceAll('{{root}}', root);
            })
            .catch((error) => console.error(error));
    }

    function markActiveNavigation() {
        const page = document.body.dataset.page;
        const activePage = page === 'home' ? 'home' : page === 'contact' ? 'contact' : page === 'about' ? 'about' : 'blog';
        document.querySelector(`[data-nav="${activePage}"]`)?.setAttribute('aria-current', 'page');
    }

    Promise.all([loadComponent('site-header', 'header.html'), loadComponent('site-footer', 'footer.html')])
        .then(markActiveNavigation);
}());