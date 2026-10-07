const { Resend } = require('resend');

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

module.exports = async function subscribe(req, res) {
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

    const email = typeof body.email === 'string' ? body.email.trim() : '';
    if (!email || email.length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || /[\r\n]/.test(email)) {
        return reply(res, 400, { success: false, error: 'Enter a valid email address.' });
    }

    const apiKey = process.env.RESEND_API_KEY;
    const audienceId = process.env.RESEND_AUDIENCE_ID;
    if (!apiKey) {
        return reply(res, 500, { success: false, error: 'Newsletter service is not configured. Please try again later.', details: 'Missing server environment variable: RESEND_API_KEY.' });
    }

    const resend = new Resend(apiKey);
    try {
        const contact = {
            email,
            unsubscribed: false
        };
        if (audienceId) contact.audienceId = audienceId;
        const { error } = await resend.contacts.create(contact);

        if (error) {
            if (/already exists|already a contact|contact already/i.test(error.message || '')) {
                return reply(res, 200, { success: true });
            }
            console.error('Resend contact registration failed:', error.message);
            return reply(res, 500, { success: false, error: 'We could not complete your subscription. Please try again.', details: String(error.message || 'Resend rejected the request.').slice(0, 300) });
        }

        return reply(res, 200, { success: true });
    } catch (error) {
        if (/already exists|already a contact|contact already/i.test(error.message || '')) {
            return reply(res, 200, { success: true });
        }
        console.error('Resend contact registration failed:', error.message);
        return reply(res, 500, { success: false, error: 'We could not complete your subscription. Please try again.', details: String(error.message || 'Resend request failed.').slice(0, 300) });
    }
};