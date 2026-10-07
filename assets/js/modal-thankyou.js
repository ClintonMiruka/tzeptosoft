(function () {
    'use strict';

    const MODAL_ID = 'tzeptosoft-thankyou-modal';

    function getDefaultMessage(type) {
        if (type === 'purchase') {
            return 'Thank you for your purchase! We have received your order.';
        }
        return 'Thank you for subscribing!';
    }

    function showThankYouModal(type = 'newsletter', details = {}) {
        const existing = document.getElementById(MODAL_ID);
        if (existing) {
            existing.remove();
        }

        const message = details.message || getDefaultMessage(type);
        const title = details.title || '🎉 Thank You!';

        const modal = document.createElement('div');
        modal.id = MODAL_ID;
        modal.setAttribute('role', 'dialog');
        modal.setAttribute('aria-modal', 'true');
        modal.setAttribute('aria-labelledby', 'tzeptosoft-modal-title');
        modal.style.position = 'fixed';
        modal.style.inset = '0';
        modal.style.display = 'flex';
        modal.style.alignItems = 'center';
        modal.style.justifyContent = 'center';
        modal.style.padding = '1rem';
        modal.style.background = 'rgba(2, 6, 23, 0.7)';
        modal.style.zIndex = '20000';

        modal.innerHTML = `
            <div style="position: relative; width: min(420px, calc(100vw - 1.5rem)); background: linear-gradient(135deg, rgba(15, 23, 42, 0.96), rgba(17, 24, 39, 0.96)); border: 1px solid rgba(33, 212, 194, 0.5); border-radius: 16px; box-shadow: 0 22px 60px rgba(0,0,0,0.45); color: #f8fafc; overflow: hidden;">
                <button type="button" aria-label="Close thank you modal" style="position: absolute; top: 0.75rem; right: 0.75rem; border: 0; background: rgba(255,255,255,0.08); width: 32px; height: 32px; border-radius: 999px; color: #fff; cursor: pointer; font-size: 1.1rem;">×</button>
                <div style="padding: 2rem 1.5rem 1.25rem; text-align: center;">
                    <div style="font-size: 2rem; margin-bottom: 0.5rem;">🎉</div>
                    <h2 id="tzeptosoft-modal-title" style="margin: 0 0 0.75rem; font-size: 1.6rem; font-weight: 800;">${title}</h2>
                    <p style="margin: 0; line-height: 1.6; color: rgba(255,255,255,0.85);">${message}</p>
                </div>
            </div>
        `;

        const closeButton = modal.querySelector('button');
        closeButton.addEventListener('click', () => modal.remove());
        modal.addEventListener('click', (event) => {
            if (event.target === modal) {
                modal.remove();
            }
        });
        document.body.appendChild(modal);
        closeButton.focus();

        document.addEventListener('keydown', function handleEscape(event) {
            if (event.key === 'Escape') {
                modal.remove();
                document.removeEventListener('keydown', handleEscape);
            }
        }, { once: true });
    }

    document.addEventListener('click', (event) => {
        const trigger = event.target.closest('[data-thankyou-trigger]');
        if (!trigger) return;

        const type = trigger.getAttribute('data-thankyou-trigger') || 'purchase';
        const message = trigger.getAttribute('data-thankyou-message') || getDefaultMessage(type);
        showThankYouModal(type, { message });
    });

    document.querySelectorAll('form[data-thankyou-form]').forEach((form) => {
        form.addEventListener('submit', () => {
            const type = form.getAttribute('data-thankyou-form') || 'newsletter';
            const message = form.getAttribute('data-thankyou-message') || getDefaultMessage(type);
            showThankYouModal(type, { message });
        }, { once: true });
    });

    window.showThankYouModal = showThankYouModal;
}());
