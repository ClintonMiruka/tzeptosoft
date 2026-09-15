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

    function score(record, query) {
        const fields = [record.title, record.category, record.keywords.join(' '), record.snippet].map((field) => field.toLowerCase());
        const terms = query.toLowerCase().split(/\s+/).filter(Boolean);
        return terms.reduce((total, term) => total + fields.reduce((fieldTotal, field, index) => fieldTotal + (field.includes(term) ? [12, 5, 8, 3][index] : 0), 0), 0);
    }

    function matches(records, query) {
        return records.map((record) => ({ record, value: score(record, query) })).filter((item) => item.value > 0).sort((a, b) => b.value - a.value).slice(0, 8).map((item) => item.record);
    }

    function renderResults(container, query, records) {
        const results = matches(records, query);
        activeIndex = -1;
        container.replaceChildren();
        if (!query.trim() || !results.length) {
            container.hidden = true;
            return results;
        }

        const tags = [...new Set(results.flatMap((record) => record.keywords).filter((keyword) => keyword.toLowerCase().includes(query.toLowerCase())))].slice(0, 4);
        tags.forEach((tag) => {
            const item = document.createElement('button');
            item.type = 'button';
            item.className = 'search-result search-result--tag';
            item.dataset.query = tag;
            item.innerHTML = `<span aria-hidden="true">#</span><span>${tag}</span>`;
            item.addEventListener('click', () => selectResult(results[0], container));
            container.append(item);
        });

        results.forEach((record) => {
            const item = document.createElement('button');
            item.type = 'button';
            item.className = 'search-result';
            item.dataset.url = record.url;
            item.innerHTML = `<span class="search-result__icon" aria-hidden="true">&gt;</span><span><strong>${record.title}</strong><small>${record.category} · ${record.snippet}</small></span>`;
            item.addEventListener('click', () => selectResult(record, container));
            container.append(item);
        });
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
