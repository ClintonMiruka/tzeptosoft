#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');

function walk(directory) {
    return fs.readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
        const file = path.join(directory, entry.name);
        return entry.isDirectory() ? walk(file) : [file];
    });
}

const files = [path.join(root, 'index.html'), ...walk(path.join(root, 'pages'))]
    .filter((file) => file.endsWith('.html'))
    .map((file) => path.relative(root, file).split(path.sep).join('/'))
    .sort();

fs.writeFileSync(path.join(root, 'route-manifest.json'), `${JSON.stringify(files, null, 2)}\n`);
console.log(`Mapped ${files.length} physical HTML routes.`);
