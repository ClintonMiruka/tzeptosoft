#!/usr/bin/env node

const fs = require('node:fs');
const path = require('node:path');

const siteRoot = path.resolve(process.env.SITE_ROOT || path.join(__dirname, '..'));
let injected = 0;

function walk(directory) {
    if (!fs.existsSync(directory)) return [];
    return fs.readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
        const file = path.join(directory, entry.name);
        return entry.isDirectory() ? walk(file) : [file];
    });
}

const htmlFiles = [path.join(siteRoot, 'index.html'), ...walk(path.join(siteRoot, 'pages'))]
    .filter((file) => file.endsWith('.html') && fs.existsSync(file));

for (const file of htmlFiles) {
    const html = fs.readFileSync(file, 'utf8');
    if (/\bsrc=["'][^"']*\/assets\/js\/newsletter\.js(?:\?[^"']*)?["']/i.test(html)) continue;
    const script = '    <script src="/assets/js/newsletter.js" defer></script>\n';
    const updated = /<\/body\s*>/i.test(html)
        ? html.replace(/<\/body\s*>/i, `${script}</body>`)
        : `${html}\n${script}`;
    fs.writeFileSync(file, updated);
    injected += 1;
}

console.log(`Wired newsletter frontend into ${injected} of ${htmlFiles.length} HTML pages.`);