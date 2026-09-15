(function () {
    'use strict';

    const categories = ['all', 'masculinity', 'femininity', 'wealth', 'mindset', 'tech', 'relationships', 'life'];
    const rootPrefix = '../'.repeat(Math.max(0, new URL(document.baseURI).pathname.split('/').length - 2));
    const grid = document.getElementById('blog-grid');
    const count = document.querySelector('[data-post-count]');
    const sort = document.getElementById('sortSelect');
    let posts = [];
    let activeCategory = new URLSearchParams(window.location.search).get('category') || 'all';

    function escapeHtml(value) {
        return String(value).replace(/[&<>'"]/g, (character) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[character]));
    }

    function filteredPosts() {
        const selected = activeCategory === 'all' ? posts : posts.filter((post) => post.category === activeCategory);
        return [...selected].sort((a, b) => {
            if (sort?.value === 'oldest') return a.date.localeCompare(b.date);
            if (sort?.value === 'title') return a.title.localeCompare(b.title);
            return b.date.localeCompare(a.date);
        });
    }

    function render() {
        const visible = filteredPosts();
        document.getElementById('preloader')?.remove();
        grid.innerHTML = visible.map((post) => `<article class="blog-card"><div class="blog-card__category">${escapeHtml(post.category)}</div><h2>${escapeHtml(post.title)}</h2><p>${escapeHtml(post.excerpt)}</p><div class="blog-card__meta"><time datetime="${escapeHtml(post.date)}">${escapeHtml(post.date)}</time><span>${escapeHtml(post.readTime)}</span></div><a class="blog-card__link" href="${rootPrefix}${post.url.slice(1)}">Read article <span aria-hidden="true">&rarr;</span></a></article>`).join('') || '<p class="blog-empty">No articles found in this category.</p>';
        if (count) count.textContent = `${visible.length} articles`;
        document.querySelectorAll('.tab-btn').forEach((button) => {
            const selected = button.dataset.category === activeCategory;
            button.classList.toggle('active', selected);
            button.setAttribute('aria-selected', String(selected));
        });
    }

    function selectCategory(category) {
        activeCategory = categories.includes(category) ? category : 'all';
        const url = new URL(window.location.href);
        activeCategory === 'all' ? url.searchParams.delete('category') : url.searchParams.set('category', activeCategory);
        window.history.replaceState({}, '', url);
        render();
    }

    if (!grid) return;
    document.querySelectorAll('.tab-btn').forEach((button) => button.addEventListener('click', () => selectCategory(button.dataset.category)));
    sort?.addEventListener('change', render);
    fetch(`${rootPrefix}assets/data/posts-index.json`).then((response) => {
        if (!response.ok) throw new Error('Unable to load posts index');
        return response.json();
    }).then((data) => {
        posts = data;
        render();
    }).catch((error) => {
        console.error(error);
        grid.innerHTML = '<p class="blog-empty">The article index is temporarily unavailable.</p>';
    });
}());
