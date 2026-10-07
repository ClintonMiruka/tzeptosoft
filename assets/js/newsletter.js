(function () {
    'use strict';

    if (window.TZEPTOSOFT_NEWSLETTER_LOADED) return;
    window.TZEPTOSOFT_NEWSLETTER_LOADED = true;

    const TOAST_ID = 'tzeptosoft-newsletter-toast';

    function isValidEmail(value) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(value).trim());
    }

    function showSuccessToast() {
        let toast = document.getElementById(TOAST_ID);

        if (!toast) {
            toast = document.createElement('div');
            toast.id = TOAST_ID;
            toast.setAttribute('role', 'dialog');
            toast.setAttribute('aria-live', 'polite');
            toast.style.position = 'fixed';
            toast.style.right = '20px';
            toast.style.bottom = '20px';
            toast.style.zIndex = '9999';
            toast.style.maxWidth = '420px';
            toast.style.width = 'min(420px, calc(100vw - 24px))';
            toast.style.padding = '18px 20px';
            toast.style.borderRadius = '14px';
            toast.style.background = 'linear-gradient(135deg, rgba(10, 17, 30, 0.96), rgba(17, 24, 39, 0.96))';
            toast.style.border = '1px solid rgba(52, 211, 153, 0.65)';
            toast.style.boxShadow = '0 18px 40px rgba(0, 0, 0, 0.35)';
            toast.style.color = '#f8fafc';
            toast.style.fontFamily = 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif';
            toast.style.transform = 'translateY(18px)';
            toast.style.opacity = '0';
            toast.style.transition = 'all 0.25s ease';
            document.body.appendChild(toast);
        }

        toast.innerHTML = `
            <div style="display:flex; align-items:flex-start; gap:12px;">
                <div style="font-size: 1.45rem; line-height: 1;">🎉</div>
                <div>
                    <div style="font-size: 1.05rem; font-weight: 700; margin-bottom: 6px; color: #d1fae5;">🎉 You're Subscribed!</div>
                    <div style="font-size: 0.95rem; line-height: 1.5; color: rgba(255,255,255,0.9);">Thank you for joining our community! You've been successfully added to our official newsletter.</div>
                </div>
            </div>
        `;

        toast.style.opacity = '1';
        toast.style.transform = 'translateY(0)';

        clearTimeout(toast._closeTimeout);
        toast._closeTimeout = setTimeout(() => {
            toast.style.opacity = '0';
            toast.style.transform = 'translateY(18px)';
        }, 3800);
    }

    async function submitNewsletter(email, form) {
        const response = await fetch('/api/subscribe', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email }),
        });

        let payload = {};
        try {
            payload = await response.json();
        } catch (error) {
            // Ignore JSON parsing issues and preserve the HTTP error response.
        }

        if (!response.ok || !payload.success) {
            throw new Error(payload.error || 'Unable to subscribe at this time.');
        }

        if (form && typeof form.reset === 'function') {
            form.reset();
        }

        form?.querySelectorAll('input[type="email"], input[name="email"], .newsletter-input').forEach((input) => {
            input.value = '';
            input.setCustomValidity('');
        });

        showSuccessToast();
    }

    function bindForm(form) {
        if (!form || form.dataset.tzeptosoftNewsletterBound === 'true') return;

        const emailInput = form.querySelector('input[type="email"], input[name="email"], .newsletter-input, input[type="search"]');
        if (!emailInput) return;

        form.dataset.tzeptosoftNewsletterBound = 'true';

        form.addEventListener('submit', async (event) => {
            event.preventDefault();

            const email = (emailInput.value || '').trim();
            if (!isValidEmail(email)) {
                emailInput.setCustomValidity('Please enter a valid email address.');
                emailInput.reportValidity();
                return;
            }

            emailInput.setCustomValidity('');

            const button = form.querySelector('button[type="submit"], button:not([type]), input[type="submit"]');
            const previousText = button ? button.textContent : '';

            if (button) {
                button.disabled = true;
                button.textContent = 'Subscribing...';
            }

            try {
                await submitNewsletter(email, form);
            } catch (error) {
                console.error('Newsletter subscription failed:', error);
                emailInput.setCustomValidity(error.message || 'Unable to subscribe.');
                emailInput.reportValidity();
            } finally {
                if (button) {
                    button.disabled = false;
                    button.textContent = previousText || 'Subscribe';
                }
            }
        }, { passive: false });
    }

    function bindFallbackContainer(container) {
        if (!container || container.dataset.tzeptosoftNewsletterBound === 'true') return;

        const input = container.querySelector('input[type="email"], input[name="email"], .newsletter-input');
        const button = container.querySelector('button, input[type="submit"]');
        if (!input || !button) return;

        container.dataset.tzeptosoftNewsletterBound = 'true';

        button.addEventListener('click', async (event) => {
            event.preventDefault();
            const email = (input.value || '').trim();

            if (!isValidEmail(email)) {
                input.setCustomValidity('Please enter a valid email address.');
                input.reportValidity();
                return;
            }

            input.setCustomValidity('');
            const previousText = button.textContent;
            button.disabled = true;
            button.textContent = 'Subscribing...';

            try {
                await submitNewsletter(email, container.closest('form') || container);
            } catch (error) {
                console.error('Newsletter subscription failed:', error);
                input.setCustomValidity(error.message || 'Unable to subscribe.');
                input.reportValidity();
            } finally {
                button.disabled = false;
                button.textContent = previousText || 'Subscribe';
            }
        }, { passive: false });
    }

    function scanNewsletterFields() {
        document.querySelectorAll('form').forEach(bindForm);
        document.querySelectorAll('.newsletter-container, .newsletter-section').forEach(bindFallbackContainer);
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', scanNewsletterFields, { once: true });
    } else {
        scanNewsletterFields();
    }
}());
