const { Resend } = require('resend');

const DESTINATION = 'tzeptosoft@gmail.com';
const DEFAULT_FROM = 'Tzeptosoft Website <onboarding@resend.dev>';

function reply(res, status, payload) {
    res.setHeader('Cache-Control', 'private, no-store, max-age=0');
    res.setHeader('Pragma', 'no-cache');
    return res.status(status).json(payload);
}

function parseBody(body) {
    if (typeof body === 'string') return JSON.parse(body || '{}');
    if (Buffer.isBuffer(body)) return JSON.parse(body.toString('utf8'));
    return body || {};
}

function escapeHtml(value) {
    return String(value).replace(/[&<>"']/g, (character) => ({
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#39;'
    })[character]);
}

module.exports = async function sendContactEmail(req, res) {
    if (req.method !== 'POST') {
        res.setHeader('Allow', 'POST');
        return reply(res, 405, { success: false, error: 'Method not allowed.' });
    }

    let body;
    try {
        body = parseBody(req.body);
    } catch {
        return reply(res, 400, { success: false, error: 'Request body must be valid JSON.' });
    }

    if (!body || typeof body !== 'object' || Array.isArray(body)) {
        return reply(res, 400, { success: false, error: 'Request body must be a JSON object.' });
    }
    if (typeof body.website === 'string' && body.website.trim()) {
        return reply(res, 200, { success: true });
    }

    const name = typeof body.name === 'string' ? body.name.trim() : '';
    const email = typeof body.email === 'string' ? body.email.trim() : '';
    const message = typeof body.message === 'string' ? body.message.trim() : '';
    if (!name || name.length > 100) return reply(res, 400, { success: false, error: 'Enter a name between 1 and 100 characters.' });
    if (!email || email.length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || /[\r\n]/.test(email)) {
        return reply(res, 400, { success: false, error: 'Enter a valid email address.' });
    }
    if (!message || message.length < 5 || message.length > 10000) {
        return reply(res, 400, { success: false, error: 'Message must be between 5 and 10,000 characters.' });
    }

    const apiKey = process.env.RESEND_API_KEY;
    if (!apiKey) return reply(res, 500, { success: false, error: 'Email service is not configured.' });

    const safeName = escapeHtml(name);
    const safeEmail = escapeHtml(email);
    const safeMessage = escapeHtml(message).replace(/\r?\n/g, '<br>');
    const resend = new Resend(apiKey);

    try {
        const { data, error } = await resend.emails.send({
            from: process.env.RESEND_FROM_EMAIL || DEFAULT_FROM,
            to: [DESTINATION],
            replyTo: email,
            subject: `Website contact from ${name.replace(/[\r\n]/g, ' ').slice(0, 100)}`,
            html: `<h2>Website contact message</h2><p><strong>Name:</strong> ${safeName}</p><p><strong>Email:</strong> ${safeEmail}</p><p><strong>Message:</strong><br>${safeMessage}</p>`,
            text: `Website contact message\n\nName: ${name}\nEmail: ${email}\n\nMessage:\n${message}`
        });

        if (error) {
            console.error('Resend contact email failed:', error.message);
            return reply(res, 500, { success: false, error: 'We could not send your message. Please try again or email tzeptosoft@gmail.com.', details: String(error.message || 'Resend rejected the request.').slice(0, 300) });
        }
        return reply(res, 200, { success: true, id: data?.id });
    } catch (error) {
        console.error('Resend contact email failed:', error.message);
        return reply(res, 500, { success: false, error: 'We could not send your message. Please try again or email tzeptosoft@gmail.com.', details: String(error.message || 'Resend request failed.').slice(0, 300) });
    }
};