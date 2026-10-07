#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const siteRoot = path.resolve(process.env.SITE_ROOT || root);

function walk(directory) {
    return fs.readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
        const file = path.join(directory, entry.name);
        return entry.isDirectory() ? walk(file) : [file];
    });
}

const files = [path.join(siteRoot, 'index.html'), ...walk(path.join(siteRoot, 'pages'))]
    .filter((file) => file.endsWith('.html'))
    .map((file) => path.relative(siteRoot, file).split(path.sep).join('/'))
    .sort();

fs.writeFileSync(path.join(siteRoot, 'route-manifest.json'), `${JSON.stringify(files, null, 2)}\n`);
console.log(`Mapped ${files.length} physical HTML routes.`);
