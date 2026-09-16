import {
    db,
    isConfigured,
    ref,
    push,
    onValue,
    runTransaction,
    serverTimestamp,
    authReady
} from './firebase-config.js';

const SUBMISSION_COOLDOWN_MS = 30000;
const MIN_COMMENT_LENGTH = 3;
const MAX_LENGTH = 2000;
const BLOCKED_WORDS = ['spamlink', 'casino', 'free money', 'buy now', 'crypto scam'];
const STORAGE_PREFIX = 'tzeptosoft-comments:';
const VOTE_PREFIX = 'tzeptosoft-comment-votes:';
const state = {
    feed: 'post',
    comments: [],
    unsubscribe: null,
    storageKey: '',
    firebasePath: ''
};

let lastFocusedElement = null;

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
    honeypot: root.querySelector('#website_hp_check'),
    submit: root.querySelector('.comments-submit'),
    count: root.querySelector('[data-character-count]'),
    unread: root.querySelector('[data-unread-count]')
};

const pagePath = window.location.pathname || '/';
const pageId = pagePath.replace(/^\/+|\/+$/g, '').replace(/[/.]/g, '_').replace(/[^a-zA-Z0-9_-]/g, '_') || 'home';

function isPreviewEnvironment() {
    const host = window.location.hostname || '';
    return (
        host === 'localhost' ||
        host === '127.0.0.1' ||
        host.endsWith('.vercel.app') ||
        !isConfigured ||
        (window.firebaseConfig && window.firebaseConfig.apiKey === 'YOUR_FIREBASE_API_KEY')
    );
}

function renderPreviewBanner() {
    if (!elements.drawer || elements.drawer.querySelector('#preview-env-banner')) return;

    const banner = document.createElement('div');
    banner.id = 'preview-env-banner';
    banner.className = 'preview-env-banner';
    banner.textContent = '🛠️ Preview Mode: Comments stored locally in browser storage.';

    const drawerHeader = elements.drawer.querySelector('.comments-drawer__header');
    if (drawerHeader) {
        drawerHeader.after(banner);
    }
}

function setNotice(message, isError) {
    elements.notice.textContent = message;
    elements.notice.classList.toggle('is-error', Boolean(isError));
}

function getFocusableElements() {
    return [...elements.drawer.querySelectorAll(
        'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
    )].filter((element) => !element.hasAttribute('disabled') && element.offsetParent !== null);
}

function handleDrawerKeyDown(event) {
    if (!elements.drawer.classList.contains('is-open')) return;

    if (event.key === 'Escape' || event.keyCode === 27) {
        event.preventDefault();
        setOpen(false);
        return;
    }

    if (event.key === 'Tab' || event.keyCode === 9) {
        const focusables = getFocusableElements();
        if (!focusables.length) return;

        const firstElement = focusables[0];
        const lastElement = focusables[focusables.length - 1];

        if (event.shiftKey && document.activeElement === firstElement) {
            lastElement.focus();
            event.preventDefault();
            return;
        }

        if (!event.shiftKey && document.activeElement === lastElement) {
            firstElement.focus();
            event.preventDefault();
        }
    }
}

function setOpen(open) {
    elements.drawer.classList.toggle('is-open', open);
    elements.drawer.setAttribute('aria-hidden', String(!open));
    elements.trigger.setAttribute('aria-expanded', String(open));
    elements.backdrop.hidden = !open;
    elements.backdrop.setAttribute('aria-hidden', String(!open));
    document.body.classList.toggle('comments-locked', open);

    if (open) {
        lastFocusedElement = document.activeElement;
        elements.unread.hidden = true;
        const focusTarget = elements.close || elements.name || elements.text;
        focusTarget?.focus();
        document.addEventListener('keydown', handleDrawerKeyDown);
        return;
    }

    document.removeEventListener('keydown', handleDrawerKeyDown);
    if (lastFocusedElement && typeof lastFocusedElement.focus === 'function') {
        lastFocusedElement.focus();
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
    renderPreviewBanner();
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
    return authReady.then(() => {
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
    });
}

function refreshFeed() {
    state.storageKey = `${STORAGE_PREFIX}${state.feed === 'post' ? pageId : 'global'}`;
    if (isPreviewEnvironment()) {
        renderPreviewBanner();
        loadLocalFeed();
        return;
    }
    loadFirebaseFeed().catch((error) => {
        console.error(error);
        setNotice('Live authentication failed. Using local preview mode.', true);
        loadLocalFeed();
    });
}

async function submitComment(event) {
    event.preventDefault();
    if (elements.honeypot?.value.trim()) {
        console.warn('Comment rejected by honeypot.');
        elements.form.reset();
        return;
    }

    const lastSubmission = Number.parseInt(localStorage.getItem('tzeptosoft_last_comment_time') || '0', 10);
    const elapsed = Date.now() - lastSubmission;
    if (lastSubmission && elapsed < SUBMISSION_COOLDOWN_MS) {
        const remaining = Math.ceil((SUBMISSION_COOLDOWN_MS - elapsed) / 1000);
        setNotice(`Please wait ${remaining} seconds before posting again.`, true);
        return;
    }

    const author = elements.name.value.trim();
    const text = sanitizeText(elements.text.value.trim());
    const normalizedContent = `${author} ${text}`.toLowerCase();
    if (!author || author.length > 30) {
        setNotice('Use a display name of 1-30 characters.', true);
        return;
    }
    if (text.length < MIN_COMMENT_LENGTH) {
        setNotice(`Comment must be at least ${MIN_COMMENT_LENGTH} characters.`, true);
        return;
    }
    if (text.length > MAX_LENGTH) {
        setNotice(`Comment must be ${MAX_LENGTH} characters or fewer.`, true);
        return;
    }
    if (BLOCKED_WORDS.some((word) => normalizedContent.includes(word))) {
        setNotice('This comment contains restricted promotional language.', true);
        return;
    }

    localStorage.setItem('tzeptosoft-comment-name', author);
    const comment = { author, text, timestamp: isConfigured ? serverTimestamp() : Date.now(), likes: 0, dislikes: 0, pageUrl: pagePath };
    elements.submit.disabled = true;
    elements.submit.textContent = 'Posting...';
    try {
        if (isConfigured && db) {
            await authReady;
            await push(ref(db, state.firebasePath), comment);
        } else {
            writeLocal([{ ...comment, timestamp: Date.now(), id: `local-${Date.now()}` }, ...readLocal()]);
        }
        elements.form.reset();
        elements.name.value = author;
        localStorage.setItem('tzeptosoft_last_comment_time', Date.now().toString());
        updateCount();
        setNotice('Transmission sent.', false);
    } catch (error) {
        console.error(error);
        setNotice('Transmission rejected. Please try again.', true);
    } finally {
        elements.submit.disabled = false;
        elements.submit.textContent = 'Send';
    }
}

async function vote(commentId, voteType) {
    if (localStorage.getItem(`${VOTE_PREFIX}${commentId}`)) return;
    const field = voteType === 'like' ? 'likes' : 'dislikes';
    try {
        if (isConfigured && db) {
            await authReady;
            const commentFieldReference = ref(db, `${state.firebasePath}/${commentId}/${field}`);
            await runTransaction(commentFieldReference, (value) => (value || 0) + 1);
        } else {
            const comments = readLocal().map((comment) => comment.id === commentId ? { ...comment, [field]: (comment[field] || 0) + 1 } : comment);
            writeLocal(comments);
        }
        localStorage.setItem(`${VOTE_PREFIX}${commentId}`, voteType);
        render();
    } catch (error) {
        console.error(error);
        setNotice('Vote rejected. Please try again.', true);
    }
}

function updateCount() {
    elements.count.textContent = `${elements.text.value.length}/${MAX_LENGTH}`;
}

elements.trigger.addEventListener('click', () => setOpen(true));
elements.close.addEventListener('click', () => setOpen(false));
elements.backdrop.addEventListener('click', () => setOpen(false));
elements.form.addEventListener('submit', submitComment);
elements.text.addEventListener('input', updateCount);
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
