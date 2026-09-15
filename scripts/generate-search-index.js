#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const output = path.join(root, 'assets/data/search-index.json');

function walk(directory) {
    return fs.readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
        const file = path.join(directory, entry.name);
        return entry.isDirectory() ? walk(file) : [file];
    });
}

function text(value) {
    return value.replace(/<[^>]*>/g, ' ').replace(/&nbsp;/gi, ' ').replace(/&amp;/gi, '&').replace(/\s+/g, ' ').trim();
}

function firstMatch(source, expression) {
    return source.match(expression)?.[1] || '';
}

const files = [path.join(root, 'index.html'), ...walk(path.join(root, 'pages'))]
    .filter((file) => file.endsWith('.html'))
    .sort();

const index = files.map((file) => {
    const source = fs.readFileSync(file, 'utf8');
    const relative = path.relative(root, file).split(path.sep).join('/');
    const title = text(firstMatch(source, /<title[^>]*>([\s\S]*?)<\/title>/i) || firstMatch(source, /<h1[^>]*>([\s\S]*?)<\/h1>/i) || path.basename(file, '.html'));
    const description = text(firstMatch(source, /<meta[^>]+name=["']description["'][^>]+content=["']([^"']*)["']/i));
    const keywordMeta = firstMatch(source, /<meta[^>]+name=["']keywords["'][^>]+content=["']([^"']*)["']/i);
    const headings = [...source.matchAll(/<h[234][^>]*>([\s\S]*?)<\/h[234]>/gi)].map((match) => text(match[1]));
    const paragraphs = [...source.matchAll(/<p[^>]*>([\s\S]*?)<\/p>/gi)].map((match) => text(match[1])).filter(Boolean);
    const keywords = [...new Set(`${keywordMeta}, ${headings.join(', ')}`.split(',').map((value) => text(value)).filter((value) => value.length > 1))].slice(0, 24);
    const category = relative === 'index.html' ? 'Home' : relative.split('/')[1].replace(/[-_]/g, ' ').replace(/\b\w/g, (letter) => letter.toUpperCase());

    return {
        title,
        url: `/${relative}`,
        keywords,
        snippet: (paragraphs[0] || description || title).slice(0, 150),
        category
    };
});

fs.mkdirSync(path.dirname(output), { recursive: true });
fs.writeFileSync(output, `${JSON.stringify(index)}\n`);
console.log(`Generated ${index.length} search records at ${path.relative(root, output)}.`);
