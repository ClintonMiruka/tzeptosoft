(function () {
    'use strict';

    const form = document.getElementById('contact-form');
    if (!form) return;

    const button = form.querySelector('[type="submit"]');
    const status = form.querySelector('[data-contact-status]');

    form.addEventListener('submit', async (event) => {
        event.preventDefault();
        if (!form.reportValidity()) return;

        const originalText = button.textContent;
        button.disabled = true;
        button.textContent = 'Sending...';
        form.setAttribute('aria-busy', 'true');
        status.textContent = '';
        status.classList.remove('is-error');

        try {
            const response = await fetch('/api/send', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
                body: JSON.stringify({
                    name: form.elements.name.value,
                    email: form.elements.email.value,
                    message: form.elements.message.value,
                    website: form.elements.website.value
                })
            });
            const result = await response.json().catch(() => ({}));
            if (!response.ok || !result.success) throw new Error(result.error || 'Your message could not be sent. Please try again.');

            form.reset();
            status.textContent = 'Message sent. Thank you for getting in touch.';
        } catch (error) {
            status.textContent = error.message || 'A network error occurred. Please try again or email tzeptosoft@gmail.com.';
            status.classList.add('is-error');
        } finally {
            button.disabled = false;
            button.textContent = originalText;
            form.removeAttribute('aria-busy');
        }
    });
}());