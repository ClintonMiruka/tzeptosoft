const assert = require('node:assert/strict');
const Module = require('node:module');
const { test } = require('node:test');

class MockResend {
    constructor(apiKey) {
        this.apiKey = apiKey;
        this.emails = { send: async (options) => {
            MockResend.lastEmail = options;
            return MockResend.emailResult;
        } };
        this.contacts = { create: async (options) => {
            MockResend.lastContact = options;
            return MockResend.contactResult;
        } };
    }
}

const originalLoad = Module._load;
Module._load = function (request, parent, isMain) {
    if (request === 'resend') return { Resend: MockResend };
    return originalLoad.call(this, request, parent, isMain);
};
const sendContact = require('../api/send');
const subscribe = require('../api/subscribe');
Module._load = originalLoad;

function makeResponse() {
    return {
        statusCode: 200,
        headers: {},
        status(code) {
            this.statusCode = code;
            return this;
        },
        setHeader(name, value) {
            this.headers[name] = value;
        },
        json(payload) {
            this.payload = payload;
            return this;
        }
    };
}

async function invoke(handler, body, method = 'POST') {
    const res = makeResponse();
    await handler({ method, body }, res);
    return res;
}

function setEnv(values) {
    for (const key of ['RESEND_API_KEY', 'RESEND_AUDIENCE_ID', 'RESEND_FROM_EMAIL']) {
        if (Object.hasOwn(values, key)) process.env[key] = values[key];
        else delete process.env[key];
    }
}

test('contact endpoint rejects invalid fields and methods', async () => {
    setEnv({});
    const method = await invoke(sendContact, {}, 'GET');
    assert.equal(method.statusCode, 405);
    assert.equal(method.headers.Allow, 'POST');

    const invalid = await invoke(sendContact, { name: 'A', email: 'not-an-email', message: 'valid enough message' });
    assert.equal(invalid.statusCode, 400);
    assert.equal(invalid.payload.success, false);
    assert.equal(invalid.headers['Cache-Control'], 'private, no-store, max-age=0');
});

test('contact endpoint sends escaped email to the fixed inbox', async () => {
    setEnv({ RESEND_API_KEY: 'test-key', RESEND_FROM_EMAIL: 'Tzeptosoft <verified@example.com>' });
    MockResend.emailResult = { data: { id: 'email-id' }, error: null };
    const response = await invoke(sendContact, {
        name: '<img src=x onerror=alert(1)>',
        email: 'reader@example.com',
        message: '<script>alert(1)</script>\nHello'
    });

    assert.equal(response.statusCode, 200);
    assert.equal(response.payload.success, true);
    assert.equal(MockResend.lastEmail.to[0], 'tzeptosoft@gmail.com');
    assert.equal(MockResend.lastEmail.replyTo, 'reader@example.com');
    assert.match(MockResend.lastEmail.html, /&lt;img/);
    assert.match(MockResend.lastEmail.html, /&lt;script&gt;/);
    assert.doesNotMatch(MockResend.lastEmail.html, /<script>|<img/);
});

test('newsletter endpoint requires only the API key and validates the email', async () => {
    setEnv({});
    const unavailable = await invoke(subscribe, { email: 'reader@example.com' });
    assert.equal(unavailable.statusCode, 500);
    assert.match(unavailable.payload.details, /RESEND_API_KEY/);

    setEnv({ RESEND_API_KEY: 'test-key' });
    const invalid = await invoke(subscribe, { email: 'bad-address' });
    assert.equal(invalid.statusCode, 400);
});

test('newsletter endpoint adds a contact globally without an audience ID', async () => {
    setEnv({ RESEND_API_KEY: 'test-key' });
    MockResend.contactResult = { data: { id: 'contact-id' }, error: null };
    const response = await invoke(subscribe, { email: ' reader@example.com ' });

    assert.equal(response.statusCode, 200);
    assert.deepEqual(response.payload, { success: true });
    assert.deepEqual(MockResend.lastContact, {
        email: 'reader@example.com',
        unsubscribed: false
    });
});

test('newsletter endpoint adds trimmed email to the configured audience', async () => {
    setEnv({ RESEND_API_KEY: 'test-key', RESEND_AUDIENCE_ID: 'audience-id' });
    MockResend.contactResult = { data: { id: 'contact-id' }, error: null };
    const response = await invoke(subscribe, { email: ' reader@example.com ' });

    assert.equal(response.statusCode, 200);
    assert.deepEqual(response.payload, { success: true });
    assert.equal(response.headers['Cache-Control'], 'private, no-store, max-age=0');
    assert.deepEqual(MockResend.lastContact, {
        email: 'reader@example.com',
        audienceId: 'audience-id',
        unsubscribed: false
    });
});

test('newsletter endpoint treats an existing audience contact as success', async () => {
    setEnv({ RESEND_API_KEY: 'test-key', RESEND_AUDIENCE_ID: 'audience-id' });
    MockResend.contactResult = { data: null, error: { message: 'Contact already exists in this audience' } };
    const response = await invoke(subscribe, { email: 'reader@example.com' });

    assert.equal(response.statusCode, 200);
    assert.deepEqual(response.payload, { success: true });
});