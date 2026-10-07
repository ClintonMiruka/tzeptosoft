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
    let html = fs.readFileSync(file, 'utf8');
    let changed = false;
    const themeBootstrap = /,d=window\.matchMedia\('\(prefers-color-scheme: dark\)'\)\.matches,t=s\|\|\(d\?'dark':'light'\)/;
    if (themeBootstrap.test(html)) {
        html = html.replace(themeBootstrap, ",t=s||'dark'");
        changed = true;
    }
    if (!/\bhref=["'][^"']*\/assets\/css\/theme-overrides\.css(?:\?[^"']*)?["']/i.test(html)) {
        const stylesheet = '    <link rel="stylesheet" href="/assets/css/theme-overrides.css">\n';
        html = /<\/head\s*>/i.test(html) ? html.replace(/<\/head\s*>/i, `${stylesheet}</head>`) : `${stylesheet}${html}`;
        changed = true;
    }
    if (!/\bsrc=["'][^"']*\/assets\/js\/newsletter\.js(?:\?[^"']*)?["']/i.test(html)) {
        const script = '    <script src="/assets/js/newsletter.js" defer></script>\n';
        html = /<\/body\s*>/i.test(html) ? html.replace(/<\/body\s*>/i, `${script}</body>`) : `${html}\n${script}`;
        changed = true;
    }
    if (changed) {
        fs.writeFileSync(file, html);
        injected += 1;
    }
}

console.log(`Wired shared theme and newsletter styles into ${injected} of ${htmlFiles.length} HTML pages.`);