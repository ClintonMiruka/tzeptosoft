(function () {
    'use strict';

    const formSelector = '.newsletter-form, #newsletterForm, .newsletter-container form';
    let formCounter = 0;

    function ensureModal() {
        let modal = document.getElementById('newsletter-success-dialog');
        if (modal) return modal;

        modal = document.createElement('dialog');
        modal.id = 'newsletter-success-dialog';
        modal.className = 'newsletter-success-dialog';
        modal.setAttribute('aria-labelledby', 'newsletter-success-title');
        modal.innerHTML = '<button class="newsletter-success-dialog__close" type="button" aria-label="Close">&times;</button><p class="newsletter-success-dialog__icon" aria-hidden="true">🎉</p><h2 id="newsletter-success-title">🎉 You\'re Subscribed!</h2><p>Thanks for joining the Tzeptosoft newsletter. Watch your inbox for the next update.</p>';
        document.body.append(modal);

        modal.querySelector('button').addEventListener('click', () => modal.close());
        modal.addEventListener('click', (event) => {
            if (event.target === modal) modal.close();
        });
        return modal;
    }

    function emailInput(container) {
        return container?.querySelector('input[type="email"]');
    }

    function submitButton(container) {
        return container?.querySelector('button[type="submit"], button:not([type]), button[type="button"]');
    }

    function statusElement(container) {
        let status = container.querySelector('[data-newsletter-status]');
        if (!status) {
            status = document.createElement('p');
            status.dataset.newsletterStatus = '';
            status.className = 'newsletter-status';
            status.setAttribute('role', 'status');
            status.setAttribute('aria-live', 'polite');
            container.append(status);
        }
        if (!status.id) status.id = `newsletter-status-${++formCounter}`;
        return status;
    }

    function newsletterContainer(form) {
        return form.closest('.newsletter-container') || form;
    }

    async function subscribe(container, form) {
        const input = emailInput(container);
        const button = submitButton(container);
        if (!input || !button || button.disabled) return;
        if (!input.reportValidity()) return;

        const status = statusElement(newsletterContainer(form || container));
        const previousText = button.textContent;
        status.textContent = '';
        status.classList.remove('is-error');
        button.disabled = true;
        button.setAttribute('aria-busy', 'true');
        button.textContent = 'Subscribing...';
        form?.setAttribute('aria-busy', 'true');

        try {
            const website = form?.querySelector('[name="website"]')?.value || '';
            const response = await fetch('/api/subscribe', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
                body: JSON.stringify({ email: input.value.trim(), website })
            });
            const result = await response.json().catch(() => ({}));
            if (!response.ok || !result.success) throw new Error(result.error || 'We could not subscribe you. Please try again.');

            if (form) form.reset();
            else input.value = '';
            ensureModal().showModal();
        } catch (error) {
            status.textContent = error.message || 'A network error occurred. Please try again.';
            status.classList.add('is-error');
            status.setAttribute('role', 'alert');
        } finally {
            button.disabled = false;
            button.removeAttribute('aria-busy');
            button.textContent = previousText;
            form?.removeAttribute('aria-busy');
        }
    }

    document.addEventListener('submit', (event) => {
        const form = event.target;
        if (!(form instanceof HTMLFormElement) || !form.matches(formSelector)) return;
        event.preventDefault();
        event.stopImmediatePropagation();
        subscribe(form, form);
    }, true);

    document.addEventListener('click', (event) => {
        const button = event.target.closest('.newsletter-container button');
        if (!button || button.closest('form')?.matches(formSelector)) return;
        const container = button.closest('.newsletter-container');
        if (!emailInput(container)) return;
        event.preventDefault();
        event.stopImmediatePropagation();
        subscribe(container, null);
    }, true);
}());