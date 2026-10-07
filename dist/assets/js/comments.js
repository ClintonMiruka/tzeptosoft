import {
    db,
    isConfigured,
    ref,
    push,
    onValue,
    runTransaction,
    serverTimestamp
} from './firebase-config.js';

const MAX_LENGTH = 280;
const STORAGE_PREFIX = 'tzeptosoft-comments:';
const VOTE_PREFIX = 'tzeptosoft-comment-votes:';
const state = {
    feed: 'post',
    comments: [],
    unsubscribe: null,
    storageKey: '',
    firebasePath: ''
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
    unread: root.querySelector('[data-unread-count]')
};

const pagePath = window.location.pathname || '/';
const pageId = pagePath.replace(/^\/+|\/+$/g, '').replace(/[/.]/g, '_').replace(/[^a-zA-Z0-9_-]/g, '_') || 'home';

function setNotice(message, isError) {
    elements.notice.textContent = message;
    elements.notice.classList.toggle('is-error', Boolean(isError));
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
    const date = typeof timestamp === 'number' ? timestamp : Date.now();
    const seconds = Math.max(0, Math.floor((Date.now() - date) / 1000));
    if (seconds < 60) return 'just now';
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
    return `${Math.floor(seconds / 86400)}d ago`;
}

function avatarColor(name) {
    let hash = 0;
    for (let index = 0; index < name.length; index += 1) hash = name.charCodeAt(index) + ((hash << 5) - hash);
    return `hsl(${Math.abs(hash) % 360} 68% 66%)`;
}

function escapeHtml(value) {
    return String(value).replace(/[&<>'"]/g, (character) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[character]));
}

function render() {
    const comments = state.comments.slice().sort((first, second) => Number(second.timestamp) - Number(first.timestamp));
    elements.list.innerHTML = comments.map((comment) => {
        const vote = localStorage.getItem(`${VOTE_PREFIX}${comment.id}`);
        const author = escapeHtml(comment.author);
        const timestamp = Number(comment.timestamp) || Date.now();
        return `<article class="comment-card">
            <div class="comment-card__meta">
                <span class="comment-card__avatar" style="background:${avatarColor(comment.author)}" aria-hidden="true">${escapeHtml(comment.author.charAt(0).toUpperCase())}</span>
                <p class="comment-card__author">${author}</p>
                <time class="comment-card__time" datetime="${new Date(timestamp).toISOString()}">${formatTime(timestamp)}</time>
            </div>
            <p class="comment-card__text">${escapeHtml(comment.text)}</p>
            <div class="comment-card__actions">
                <button class="comment-action ${vote === 'like' ? 'is-selected' : ''}" type="button" data-vote="like" data-comment-id="${comment.id}" ${vote ? 'disabled' : ''}>👍 ${comment.likes || 0}</button>
                <button class="comment-action ${vote === 'dislike' ? 'is-selected' : ''}" type="button" data-vote="dislike" data-comment-id="${comment.id}" ${vote ? 'disabled' : ''}>👎 ${comment.dislikes || 0}</button>
                <button class="comment-action" type="button" data-reply="${author}">Reply</button>
            </div>
        </article>`;
    }).join('');
    elements.empty.hidden = comments.length > 0;
}

function readLocal() {
    try {
        return JSON.parse(localStorage.getItem(state.storageKey) || '[]');
    } catch (error) {
        return [];
    }
}

function writeLocal(comments) {
    localStorage.setItem(state.storageKey, JSON.stringify(comments));
    state.comments = comments;
    render();
}

function sanitizeText(text) {
    return text.replace(/(?:fuck|shit|bitch|cunt|asshole)/gi, (word) => '*'.repeat(word.length));
}

function loadLocalFeed() {
    state.comments = readLocal();
    render();
    setNotice('Local preview mode. Add Firebase credentials for shared live comments.', false);
    window.addEventListener('storage', (event) => {
        if (event.key === state.storageKey) {
            state.comments = readLocal();
            render();
            if (!elements.drawer.classList.contains('is-open')) elements.unread.hidden = false;
        }
    });
}

function loadFirebaseFeed() {
    state.unsubscribe?.();
    state.firebasePath = state.feed === 'post' ? `comments/${pageId}` : 'comments/global';
    const commentsReference = ref(db, state.firebasePath);
    state.unsubscribe = onValue(commentsReference, (snapshot) => {
        const value = snapshot.val() || {};
        state.comments = Object.entries(value).map(([id, comment]) => ({ id, ...comment }));
        render();
        setNotice('Live community feed connected.', false);
    }, (error) => {
        console.error(error);
        setNotice('Live connection failed. Check Firebase rules and configuration.', true);
    });
}

function refreshFeed() {
    state.storageKey = `${STORAGE_PREFIX}${state.feed === 'post' ? pageId : 'global'}`;
    if (!isConfigured || !db) {
        loadLocalFeed();
        return;
    }
    loadFirebaseFeed();
}

async function submitComment(event) {
    event.preventDefault();
    const text = sanitizeText(elements.text.value.trim());
    const author = elements.name.value.trim();
    if (!author || author.length > 30 || !text || text.length > MAX_LENGTH) return;
    localStorage.setItem('tzeptosoft-comment-name', author);
    const comment = { author, text, timestamp: isConfigured ? serverTimestamp() : Date.now(), likes: 0, dislikes: 0, pageUrl: pagePath };
    elements.text.value = '';
    updateCount();
    if (isConfigured && db) {
        await push(ref(db, state.firebasePath), comment);
    } else {
        writeLocal([{ ...comment, timestamp: Date.now(), id: `local-${Date.now()}` }, ...readLocal()]);
    }
    setNotice('Transmission sent.', false);
}

async function vote(commentId, voteType) {
    if (localStorage.getItem(`${VOTE_PREFIX}${commentId}`)) return;
    const field = voteType === 'like' ? 'likes' : 'dislikes';
    if (isConfigured && db) {
        const commentFieldReference = ref(db, `${state.firebasePath}/${commentId}/${field}`);
        await runTransaction(commentFieldReference, (value) => (value || 0) + 1);
    } else {
        const comments = readLocal().map((comment) => comment.id === commentId ? { ...comment, [field]: (comment[field] || 0) + 1 } : comment);
        writeLocal(comments);
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
elements.text.addEventListener('input', updateCount);
document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && elements.drawer.classList.contains('is-open')) setOpen(false);
});
root.addEventListener('click', (event) => {
    const voteButton = event.target.closest('[data-vote]');
    if (voteButton) vote(voteButton.dataset.commentId, voteButton.dataset.vote);
    const replyButton = event.target.closest('[data-reply]');
    if (replyButton) {
        elements.text.value = `@${replyButton.dataset.reply} `;
        updateCount();
        elements.text.focus();
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

elements.name.value = localStorage.getItem('tzeptosoft-comment-name') || '';
updateCount();
refreshFeed();
