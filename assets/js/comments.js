import {
    db,
    isConfigured,
    ref,
    push,
    set,
    onValue,
    runTransaction
} from './firebase-config.js';

const MAX_LENGTH = 280;
const VOTE_PREFIX = 'tzeptosoft-comment-votes:';
const state = {
    feed: 'post',
    comments: [],
    unsubscribe: null,
    connectionUnsubscribe: null,
    firebasePath: '',
    replyToId: null,
    sending: false,
    connected: false
};

const root = document.getElementById('comments-root');
if (!root) throw new Error('Comments root was not found.');

const elements = {
    trigger: root.querySelector('.comments-trigger'),
    drawer: root.querySelector('.comments-drawer'),
    backdrop: root.querySelector('[data-comments-backdrop]'),
    close: root.querySelector('[data-comments-close]'),
    list: root.querySelector('[data-comments-list]'),
    empty: root.querySelector('[data-comments-empty]'),
    notice: root.querySelector('[data-comments-notice]'),
    form: root.querySelector('[data-comments-form]'),
    name: root.querySelector('#comment-name'),
    text: root.querySelector('#comment-text'),
    count: root.querySelector('[data-character-count]'),
    unread: root.querySelector('[data-unread-count]'),
    viewerLabel: root.querySelector('[data-viewer-label]'),
    viewerDot: root.querySelector('[data-viewer-dot]')
};

const pagePath = window.location.pathname || '/';
const pageId = pagePath.replace(/^\/+|\/+$/g, '').replace(/[/.]/g, '_').replace(/[^a-zA-Z0-9_-]/g, '_') || 'home';

function setNotice(message, isError) {
    elements.notice.textContent = message;
    elements.notice.classList.toggle('is-error', Boolean(isError));
}

function setConnection(connected) {
    state.connected = connected;
    elements.viewerLabel.textContent = connected ? 'Live sync connected' : 'Live sync unavailable';
    elements.viewerDot.classList.toggle('comments-status-dot--inactive', !connected);
}

function setOpen(open) {
    elements.drawer.classList.toggle('is-open', open);
    elements.drawer.setAttribute('aria-hidden', String(!open));
    elements.trigger.setAttribute('aria-expanded', String(open));
    elements.backdrop.hidden = !open;
    document.body.classList.toggle('comments-locked', open);
    if (open) {
        elements.unread.hidden = true;
        elements.text.focus();
    }
}

function formatTime(timestamp) {
    const date = Number(timestamp) || Date.now();
    const seconds = Math.max(0, Math.floor((Date.now() - date) / 1000));
    if (seconds < 60) return 'just now';
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
    return `${Math.floor(seconds / 86400)}d ago`;
}

function avatarColor(name) {
    return 'var(--comments-avatar-background)';
}

function escapeHtml(value) {
    return String(value).replace(/[&<>'"]/g, (character) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[character]));
}

function buildTree() {
    const nodes = new Map(state.comments.map((comment) => [comment.id, { ...comment, children: [] }]));
    const roots = [];
    nodes.forEach((comment) => {
        const parent = comment.parentId && nodes.get(comment.parentId);
        if (parent) parent.children.push(comment);
        else roots.push(comment);
    });
    const newestFirst = (first, second) => Number(second.timestamp) - Number(first.timestamp);
    roots.sort(newestFirst);
    nodes.forEach((comment) => comment.children.sort(newestFirst));
    return roots;
}

function renderComment(comment, depth = 0) {
    const vote = localStorage.getItem(`${VOTE_PREFIX}${comment.id}`);
    const author = escapeHtml(comment.author || 'Anonymous');
    const id = escapeHtml(comment.id);
    const timestamp = Number(comment.timestamp) || Date.now();
    const replyForm = state.replyToId === comment.id ? `<form class="comment-reply-form" data-reply-form="${id}">
        <label class="sr-only" for="reply-${id}">Reply to ${author}</label>
        <textarea id="reply-${id}" name="text" maxlength="${MAX_LENGTH}" rows="2" placeholder="Write a reply..." required></textarea>
        <div class="comment-reply-form__footer"><span>${MAX_LENGTH} characters max</span><button class="comments-submit" type="submit" ${state.sending ? 'disabled' : ''}>Reply</button></div>
    </form>` : '';
    const children = comment.children.map((child) => renderComment(child, depth + 1)).join('');
    return `<article class="comment-thread" style="--thread-depth:${Math.min(depth, 5)}">
        <div class="comment-card">
            <div class="comment-card__meta">
                <span class="comment-card__avatar" aria-hidden="true">${escapeHtml((comment.author || '?').charAt(0).toUpperCase())}</span>
                <p class="comment-card__author">${author}</p>
                <time class="comment-card__time" datetime="${new Date(timestamp).toISOString()}">${formatTime(timestamp)}</time>
            </div>
            <p class="comment-card__text">${escapeHtml(comment.text || '')}</p>
            <div class="comment-card__actions">
                <button class="comment-action ${vote === 'like' ? 'is-selected' : ''}" type="button" data-vote="like" data-comment-id="${id}" ${vote ? 'disabled' : ''}>Like ${comment.likes || 0}</button>
                <button class="comment-action ${state.replyToId === comment.id ? 'is-selected' : ''}" type="button" data-reply="${id}" aria-expanded="${state.replyToId === comment.id}">Reply</button>
            </div>
            ${replyForm}
        </div>
        ${children ? `<div class="comment-thread__children">${children}</div>` : ''}
    </article>`;
}

function render() {
    const comments = buildTree();
    elements.list.innerHTML = comments.map((comment) => renderComment(comment)).join('');
    elements.empty.hidden = comments.length > 0;
    elements.form.querySelector('button[type="submit"]').disabled = !isConfigured || !state.connected || state.sending;
}

function sanitizeText(text) {
    return text;
}

function refreshFeed() {
    state.unsubscribe?.();
    state.connectionUnsubscribe?.();
    state.comments = [];
    state.replyToId = null;
    render();
    if (!isConfigured || !db) {
        setConnection(false);
        setNotice('Comments are unavailable because Firebase is not configured.', true);
        return;
    }

    state.firebasePath = state.feed === 'post' ? `comments/${pageId}` : 'comments/global';
    const commentsReference = ref(db, state.firebasePath);
    state.connectionUnsubscribe = onValue(ref(db, '.info/connected'), (snapshot) => {
        const connected = snapshot.val() === true;
        setConnection(connected);
        if (!connected) setNotice('Connection lost. Reconnecting to live comments...', true);
        else setNotice('Live comments are syncing...', false);
        render();
    }, (error) => {
        console.error('Firebase connection state failed:', error);
        setConnection(false);
        setNotice('Unable to reach Firebase. Check your connection and try again.', true);
    });
    state.unsubscribe = onValue(commentsReference, (snapshot) => {
        const value = snapshot.val() || {};
        state.comments = Object.entries(value).map(([id, comment]) => ({ ...comment, id }));
        render();
        if (state.connected) setNotice('Live comments synced.', false);
        if (!elements.drawer.classList.contains('is-open')) elements.unread.hidden = false;
    }, (error) => {
        console.error('Firebase comments subscription failed:', error);
        setConnection(false);
        setNotice('Live comments could not load. Check Firebase access and your connection.', true);
    });
}

async function submitComment(event) {
    event.preventDefault();
    const isReply = event.target.matches('[data-reply-form]');
    const textInput = isReply ? event.target.elements.text : elements.text;
    const text = sanitizeText(textInput.value.trim());
    const author = elements.name.value.trim();
    if (!isConfigured || !db || !state.connected || state.sending || !author || author.length > 30 || !text || text.length > MAX_LENGTH) return;
    localStorage.setItem('tzeptosoft-comment-name', author);
    const parentId = isReply ? event.target.dataset.replyForm : null;
    state.sending = true;
    const submitButton = event.target.querySelector('button[type="submit"]');
    submitButton.disabled = true;
    setNotice('Sending your comment...', false);
    let sent = false;
    try {
        const commentReference = push(ref(db, state.firebasePath));
        await set(commentReference, {
            id: commentReference.key,
            parentId,
            author,
            text,
            timestamp: Date.now(),
            likes: 0
        });
        textInput.value = '';
        if (isReply) state.replyToId = null;
        else updateCount();
        sent = true;
        setNotice('Your comment was sent.', false);
    } catch (error) {
        console.error('Firebase comment submission failed:', error);
        setNotice('Your comment could not be sent. Check your connection and try again.', true);
    } finally {
        state.sending = false;
        if (sent) render();
        else submitButton.disabled = false;
    }
}

async function vote(commentId, voteType) {
    if (!isConfigured || !db || !state.connected || localStorage.getItem(`${VOTE_PREFIX}${commentId}`)) return;
    const field = voteType === 'like' ? 'likes' : 'dislikes';
    const commentFieldReference = ref(db, `${state.firebasePath}/${commentId}/${field}`);
    try {
        await runTransaction(commentFieldReference, (value) => (value || 0) + 1);
    } catch (error) {
        console.error('Firebase comment reaction failed:', error);
        setNotice('Your reaction could not be saved. Check your connection and try again.', true);
        return;
    }
    localStorage.setItem(`${VOTE_PREFIX}${commentId}`, voteType);
    render();
}

function updateCount() {
    elements.count.textContent = `${elements.text.value.length}/${MAX_LENGTH}`;
}

elements.trigger.addEventListener('click', () => setOpen(true));
elements.close.addEventListener('click', () => setOpen(false));
elements.backdrop.addEventListener('click', () => setOpen(false));
elements.form.addEventListener('submit', submitComment);
elements.text.addEventListener('input', () => {
    updateCount();
    if (elements.text.value.trim()) setNotice('Drafting your comment...', false);
    else if (state.connected) setNotice('Live comments synced.', false);
});
document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && elements.drawer.classList.contains('is-open')) setOpen(false);
});
root.addEventListener('click', (event) => {
    const voteButton = event.target.closest('[data-vote]');
    if (voteButton) vote(voteButton.dataset.commentId, voteButton.dataset.vote);
    const replyButton = event.target.closest('[data-reply]');
    if (replyButton) {
        state.replyToId = state.replyToId === replyButton.dataset.reply ? null : replyButton.dataset.reply;
        render();
        if (state.replyToId) root.querySelector(`[data-reply-form="${CSS.escape(state.replyToId)}"] textarea`)?.focus();
    }
    const tab = event.target.closest('[data-feed-tab]');
    if (tab && state.feed !== tab.dataset.feedTab) {
        state.feed = tab.dataset.feedTab;
        root.querySelectorAll('.comments-tab').forEach((button) => {
            const active = button === tab;
            button.classList.toggle('is-active', active);
            button.setAttribute('aria-selected', String(active));
        });
        refreshFeed();
    }
});

root.addEventListener('submit', (event) => {
    if (event.target.matches('[data-reply-form]')) submitComment(event);
});

elements.name.value = localStorage.getItem('tzeptosoft-comment-name') || '';
updateCount();
refreshFeed();
