(function () {
    'use strict';

    let recordsPromise;
    let activeIndex = -1;

    function rootPrefix() {
        const depth = new URL(document.baseURI).pathname.split('/').length - 2;
        return '../'.repeat(Math.max(0, depth));
    }

    function loadRecords() {
        if (!recordsPromise) {
            recordsPromise = fetch(`${rootPrefix()}assets/data/search-index.json`)
                .then((response) => {
                    if (!response.ok) throw new Error('Unable to load search index');
                    return response.json();
                })
                .catch((error) => {
                    console.error(error);
                    return [];
                });
        }
        return recordsPromise;
    }

    function keywordsFor(record) {
        return Array.isArray(record.keywords) ? record.keywords : [];
    }

    function score(record, query) {
        const fields = [record.title, record.category, keywordsFor(record).join(' '), record.snippet]
            .map((field) => String(field || '').toLowerCase());
        const terms = query.toLowerCase().split(/\s+/).filter(Boolean);
        return terms.reduce((total, term) => total + fields.reduce((fieldTotal, field, index) => fieldTotal + (field.includes(term) ? [12, 5, 8, 3][index] : 0), 0), 0);
    }

    function matches(records, query) {
        return records.map((record) => ({ record, value: score(record, query) })).filter((item) => item.value > 0).sort((a, b) => b.value - a.value).slice(0, 8).map((item) => item.record);
    }

    function createSearchResultItem(record, container, isTag, tagResults) {
        const item = document.createElement('button');
        item.type = 'button';
        item.className = isTag ? 'search-result search-result--tag' : 'search-result';

        if (isTag) {
            item.dataset.query = record;
            const marker = document.createElement('span');
            marker.setAttribute('aria-hidden', 'true');
            marker.textContent = '#';
            const tag = document.createElement('span');
            tag.textContent = record;
            item.append(marker, tag);
            item.addEventListener('click', () => selectResult(tagResults[0], container));
            return item;
        }

        item.dataset.url = record.url || '';
        const icon = document.createElement('span');
        icon.className = 'search-result__icon';
        icon.setAttribute('aria-hidden', 'true');
        icon.textContent = '>';
        const content = document.createElement('span');
        const title = document.createElement('strong');
        title.textContent = record.title || 'Untitled article';
        const details = document.createElement('small');
        details.textContent = `${record.category || 'General'} · ${record.snippet || ''}`;
        content.append(title, details);
        item.append(icon, content);
        item.addEventListener('click', () => selectResult(record, container));
        return item;
    }

    function renderResults(container, query, records) {
        const results = matches(records, query);
        activeIndex = -1;
        container.replaceChildren();
        if (!query.trim() || !results.length) {
            container.hidden = true;
            return results;
        }

        const tags = [...new Set(results.flatMap(keywordsFor).filter((keyword) => keyword.toLowerCase().includes(query.toLowerCase())))].slice(0, 4);
        const fragment = document.createDocumentFragment();
        tags.forEach((tag) => fragment.appendChild(createSearchResultItem(tag, container, true, results)));
        results.forEach((record) => fragment.appendChild(createSearchResultItem(record, container, false, results)));
        container.appendChild(fragment);
        container.hidden = false;
        return results;
    }

    function selectResult(record, container) {
        container.hidden = true;
        window.location.href = record.url;
    }

    function initialize() {
        const search = document.getElementById('site-search');
        const input = document.getElementById('site-search-input');
        if (!search || !input || search.dataset.searchReady) return;
        search.dataset.searchReady = 'true';
        const results = document.createElement('div');
        results.className = 'search-results';
        results.setAttribute('role', 'listbox');
        results.hidden = true;
        search.append(results);

        input.addEventListener('focus', () => loadRecords());
        input.addEventListener('input', async () => renderResults(results, input.value, await loadRecords()));
        input.addEventListener('keydown', async (event) => {
            const items = [...results.querySelectorAll('.search-result')];
            if (event.key === 'Escape') {
                results.hidden = true;
                search.hidden = true;
                document.querySelector('.search-btn')?.setAttribute('aria-expanded', 'false');
                input.blur();
            } else if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
                event.preventDefault();
                if (!items.length) return;
                activeIndex = (activeIndex + (event.key === 'ArrowDown' ? 1 : -1) + items.length) % items.length;
                items.forEach((item, index) => item.classList.toggle('is-active', index === activeIndex));
            } else if (event.key === 'Enter') {
                event.preventDefault();
                const active = items[activeIndex] || items.find((item) => item.dataset.url);
                if (active) active.click();
            }
        });
        document.addEventListener('click', (event) => {
            if (!search.contains(event.target)) results.hidden = true;
        });
    }

    const observer = new MutationObserver(initialize);
    observer.observe(document.documentElement, { childList: true, subtree: true });
    initialize();
}());
