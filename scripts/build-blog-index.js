#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const output = path.join(root, 'assets/data/posts-index.json');
const categories = new Set(['masculinity', 'femininity', 'wealth', 'mindset', 'tech', 'relationships', 'life']);

function walk(directory) {
    return fs.readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
        const file = path.join(directory, entry.name);
        return entry.isDirectory() ? walk(file) : [file];
    });
}

function text(value) {
    return value.replace(/<[^>]*>/g, ' ').replace(/&nbsp;/gi, ' ').replace(/&amp;/gi, '&').replace(/\s+/g, ' ').trim();
}

function match(source, expression) {
    return source.match(expression)?.[1]?.trim() || '';
}

function categoryFor(relative, source) {
    const explicit = match(source, /<meta[^>]+name=["']category["'][^>]+content=["']([^"']+)["']/i).toLowerCase();
    const folder = relative.split('/')[1]?.toLowerCase();
    return categories.has(explicit) ? explicit : categories.has(folder) ? folder : 'life';
}

function dateFor(source) {
    return match(source, /<time[^>]+datetime=["']([^"']+)["']/i) || match(source, /["']datePublished["']\s*:\s*["']([^"']+)["']/i) || '2025-01-01';
}

const files = walk(path.join(root, 'pages')).filter((file) => file.endsWith('.html'));
const posts = files.map((file) => {
    const source = fs.readFileSync(file, 'utf8');
    const relative = path.relative(root, file).split(path.sep).join('/');
    const title = text(match(source, /<title[^>]*>([\s\S]*?)<\/title>/i) || match(source, /<h1[^>]*>([\s\S]*?)<\/h1>/i) || path.basename(file, '.html'));
    const description = text(match(source, /<meta[^>]+name=["']description["'][^>]+content=["']([^"']+)["']/i));
    const paragraphs = [...source.matchAll(/<p[^>]*>([\s\S]*?)<\/p>/gi)].map((item) => text(item[1])).filter((item) => item.length > 30);
    const bodyText = text(source.replace(/<script[\s\S]*?<\/script>/gi, '').replace(/<style[\s\S]*?<\/style>/gi, ''));
    const words = bodyText.split(/\s+/).filter(Boolean).length;
    return {
        title,
        excerpt: (description || paragraphs[0] || title).slice(0, 180),
        date: dateFor(source),
        readTime: `${Math.max(1, Math.ceil(words / 220))} min read`,
        url: `/${relative}`,
        category: categoryFor(relative, source)
    };
}).sort((a, b) => b.date.localeCompare(a.date) || a.title.localeCompare(b.title));

fs.mkdirSync(path.dirname(output), { recursive: true });
fs.writeFileSync(output, `${JSON.stringify(posts, null, 2)}\n`);
console.log(`Indexed ${posts.length} blog posts at ${path.relative(root, output)}.`);
