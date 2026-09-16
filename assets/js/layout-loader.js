(function () {
    'use strict';

    const pagePath = new URL(document.baseURI).pathname;
    const root = '../'.repeat(Math.max(0, pagePath.split('/').length - 2));

    function loadComponent(targetId, fileName) {
        const target = document.getElementById(targetId);
        if (!target) return Promise.resolve();

        return fetch(`${root}components/${fileName}?v=20260916`)
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

    function loadComments() {
        const root = document.createElement('div');
        root.id = 'comments-root';
        document.body.append(root);

        const stylesheet = document.createElement('link');
        stylesheet.rel = 'stylesheet';
        stylesheet.href = `${rootPath}assets/css/comments.css`;
        document.head.append(stylesheet);

        return fetch(`${rootPath}components/comments.html?v=20260916`)
            .then((response) => {
                if (!response.ok) throw new Error('Unable to load comments.html');
                return response.text();
            })
            .then((html) => {
                root.innerHTML = html.replaceAll('{{root}}', rootPath);
                const script = document.createElement('script');
                script.src = `${rootPath}assets/js/comments.js`;
                script.type = 'module';
                script.defer = true;
                document.body.append(script);
            })
            .catch((error) => console.error(error));
    }

    const rootPath = root;
    Promise.all([loadComponent('site-header', 'header.html'), loadComponent('site-footer', 'footer.html'), loadComments()])
        .then(markActiveNavigation);
}());