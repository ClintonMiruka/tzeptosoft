#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const pageCssDir = path.join(root, 'assets/css/pages');
const pageJsDir = path.join(root, 'assets/js/pages');
fs.mkdirSync(pageCssDir, { recursive: true });
fs.mkdirSync(pageJsDir, { recursive: true });

function filesIn(directory) {
    return fs.readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
        const filePath = path.join(directory, entry.name);
        return entry.isDirectory() ? filesIn(filePath) : [filePath];
    });
}

function relativeRoot(filePath) {
    const relativeDir = path.relative(root, path.dirname(filePath));
    return relativeDir ? `${relativeDir.split(path.sep).map(() => '..').join('/')}/` : '';
}

function safeName(filePath) {
    return path.relative(root, filePath).replace(/[\\/]/g, '-').replace(/[^a-zA-Z0-9-]/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '').toLowerCase();
}

for (const filePath of filesIn(root).filter((file) => file.endsWith('.html') && !file.includes(`${path.sep}templates${path.sep}`) && !file.includes(`${path.sep}components${path.sep}`) && (() => { const source = fs.readFileSync(file, 'utf8'); return !source.includes('assets/css/global.css') || /<style\b/i.test(source); })())) {
    let html = fs.readFileSync(filePath, 'utf8');
    const name = safeName(filePath);
    const rootPath = relativeRoot(filePath);
    const title = html.match(/<title>([\s\S]*?)<\/title>/i)?.[1]?.trim() || 'Tzeptosoft';
    const description = html.match(/<meta[^>]+name=["']description["'][^>]+content=["']([^"']*)["']/i)?.[1] || 'Raw, useful ideas for people building a life on their own terms.';
    const structuredData = [...html.matchAll(/<script[^>]+type=["']application\/ld\+json["'][^>]*>[\s\S]*?<\/script>/gi)].map((match) => match[0]).join('\n');
    const inlineStyles = [...html.matchAll(/<style[^>]*>([\s\S]*?)<\/style>/gi)].map((match) => match[1].trim()).filter(Boolean).join('\n\n');
    const inlineScripts = [...html.matchAll(/<script(?![^>]+application\/ld\+json)[^>]*>([\s\S]*?)<\/script>/gi)].map((match) => match[1].trim()).filter((script) => script && !script.includes('src='));
    const bodyMatch = html.match(/<body([^>]*)>([\s\S]*?)(?:<\/body>|$)/i);
    if (!bodyMatch) continue;

    let body = bodyMatch[2]
        .replace(/<header\b[^>]*class=["'][^"']*main-header[^"']*["'][\s\S]*?<\/header>/i, '')
        .replace(/<footer\b[\s\S]*?<\/footer>/i, '')
        .replace(/<script(?![^>]+application\/ld\+json)[^>]*>[\s\S]*?<\/script>/gi, '')
        .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '')
        .replace(/\sstyle=(['"]).*?\1/gi, '')
        .trim();
    const hasMain = /<main\b/i.test(body);
    if (!hasMain) body = `<main class="page-content">\n${body}\n</main>`;
    const pageKey = filePath === path.join(root, 'index.html') ? 'home' : path.basename(filePath, '.html').toLowerCase().includes('contact') ? 'contact' : path.basename(filePath, '.html').toLowerCase().includes('about') ? 'about' : 'blog';
    const cssHref = inlineStyles ? `<link rel="stylesheet" href="${rootPath}assets/css/pages/${name}.css">` : '';
    const jsHref = inlineScripts.length ? `<script src="${rootPath}assets/js/pages/${name}.js" defer></script>` : '';
    const head = `<!DOCTYPE html>\n<html lang="en">\n<head>\n    <meta charset="UTF-8">\n    <meta name="viewport" content="width=device-width, initial-scale=1">\n    <meta name="description" content="${description.replace(/"/g, '&quot;')}">\n    <meta name="author" content="Clinton | Tzeptosoft">\n    <meta property="og:title" content="${title.replace(/"/g, '&quot;')}">\n    <meta property="og:description" content="${description.replace(/"/g, '&quot;')}">\n    <meta property="og:type" content="website">\n    <title>${title}</title>\n    <link rel="stylesheet" href="${rootPath}assets/css/global.css">\n    ${cssHref}\n    <link rel="icon" type="image/webp" href="${rootPath}assets/favicon.webp">\n    ${structuredData}\n</head>\n<body data-page="${pageKey}">\n    <div id="site-header"></div>\n    ${body}\n    <div id="site-footer"></div>\n    <script src="${rootPath}assets/js/layout-loader.js" defer></script>\n    <script src="${rootPath}assets/js/main.js" defer></script>\n    ${jsHref}\n</body>\n</html>\n`;
    fs.writeFileSync(filePath, head);
    if (inlineStyles) fs.writeFileSync(path.join(pageCssDir, `${name}.css`), `${inlineStyles}\n`);
    if (inlineScripts.length) fs.writeFileSync(path.join(pageJsDir, `${name}.js`), `${inlineScripts.join('\n\n')}\n`);
}

for (const filePath of filesIn(path.join(root, 'pages')).concat([path.join(root, 'index.html')]).filter((file) => file.endsWith('.html'))) {
    const html = fs.readFileSync(filePath, 'utf8');
    const cleaned = html.replace(/\sstyle=(['"]).*?\1/gi, '');
    if (cleaned !== html) fs.writeFileSync(filePath, cleaned);
}

console.log('Migrated static HTML pages to the shared layout.');