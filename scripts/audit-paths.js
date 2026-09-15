#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const ignoredSchemes = /^(?:https?:|mailto:|tel:|javascript:|data:|blob:|#)/i;
const htmlFiles = listFiles(root).filter((file) => file.endsWith('.html') && !file.includes(`${path.sep}templates${path.sep}`));
const rewrites = JSON.parse(fs.readFileSync(path.join(root, 'vercel.json'), 'utf8')).rewrites || [];

function listFiles(directory) {
    return fs.readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
        const file = path.join(directory, entry.name);
        return entry.isDirectory() ? listFiles(file) : [file];
    });
}

function refsFrom(source, regex) {
    return [...source.matchAll(regex)].map((match) => match[1]);
}

function cleanReference(reference) {
    return reference.split('#')[0].split('?')[0].trim();
}

function rewriteTarget(reference) {
    const match = rewrites.find((rewrite) => rewrite.source === reference);
    return match?.destination || reference;
}

function resolveReference(file, reference) {
    let clean = cleanReference(reference);
    const componentRootReference = clean.includes('{{root}}');
    clean = clean.replace('{{root}}', '');
    if (!clean || ignoredSchemes.test(clean)) return null;
    if (componentRootReference) return path.join(root, clean);
    const rewritten = clean.startsWith('/') ? rewriteTarget(clean) : clean;
    const target = rewritten.startsWith('/')
        ? path.join(root, rewritten.slice(1))
        : path.resolve(path.dirname(file), rewritten);
    return target;
}

const missing = [];
const checked = new Set();
for (const file of htmlFiles) {
    const source = fs.readFileSync(file, 'utf8');
    const references = [
        ...refsFrom(source, /\bhref\s*=\s*["']([^"']+)["']/gi),
        ...refsFrom(source, /\bsrc\s*=\s*["']([^"']+)["']/gi)
    ];
    for (const reference of references) {
        const target = resolveReference(file, reference);
        if (!target || checked.has(`${file}:${reference}`)) continue;
        checked.add(`${file}:${reference}`);
        if (!fs.existsSync(target)) missing.push({ from: path.relative(root, file), reference, expected: path.relative(root, target) });
    }
}

for (const file of listFiles(path.join(root, 'assets')).filter((candidate) => candidate.endsWith('.css'))) {
    const source = fs.readFileSync(file, 'utf8');
    for (const reference of refsFrom(source, /url\(\s*["']?([^"')]+)["']?\s*\)/gi)) {
        const target = resolveReference(file, reference);
        if (target && !fs.existsSync(target)) missing.push({ from: path.relative(root, file), reference, expected: path.relative(root, target) });
    }
}

console.log(JSON.stringify({ htmlFiles: htmlFiles.length, missingCount: missing.length, missing }, null, 2));