#!/usr/bin/env node

const fs = require('node:fs');
const path = require('node:path');
const readline = require('node:readline/promises');
const { stdin, stdout } = require('node:process');

const root = path.resolve(__dirname, '..');
const categories = ['femininity', 'life', 'masculinity', 'mindset', 'relationships', 'tech', 'wealth'];

function slugify(value) {
    return value.toLowerCase().normalize('NFKD').replace(/[\u0300-\u036f]/g, '')
        .replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
}

function yamlString(value) {
    return JSON.stringify(value);
}

async function main() {
    const args = process.argv.slice(2);
    const publish = args.includes('--publish');
    const dryRun = args.includes('--dry-run');
    const values = args.filter((argument) => !argument.startsWith('--'));
    const prompt = readline.createInterface({ input: stdin, output: stdout });

    try {
        const title = values[0] || await prompt.question('Article title: ');
        const categoryInput = values[1] || await prompt.question(`Category (${categories.join(', ')}): `);
        const category = categoryInput.trim().toLowerCase();
        const slug = (values[2] || slugify(title)).trim().toLowerCase();

        if (!title.trim()) throw new Error('Title cannot be empty.');
        if (!categories.includes(category)) throw new Error(`Choose a category: ${categories.join(', ')}.`);
        if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) throw new Error('Slug must use lowercase letters, numbers, and hyphens.');

        const relativePath = publish
            ? path.join('content', 'posts', category, `${slug}.md`)
            : path.join('content', 'drafts', category, `${slug}.md`);
        const articlePath = path.join(root, relativePath);
        const draftPath = path.join(root, 'content', 'drafts', category, `${slug}.md`);
        const imageDirectory = path.join(root, 'assets', 'images', 'articles', slug);
        if (fs.existsSync(articlePath)) throw new Error(`Article already exists: ${relativePath}`);
        if (publish && fs.existsSync(path.join(root, 'pages', category, `${slug}.html`))) {
            throw new Error(`A legacy HTML article already uses /pages/${category}/${slug}.html.`);
        }
        const existingDraft = publish && fs.existsSync(draftPath);

        const today = new Date().toISOString().slice(0, 10);
        const content = `---
layout: layouts/article.njk
title: ${yamlString(title.trim())}
slug: ${slug}
description: "Write a clear one- or two-sentence summary for readers and search results."
date: ${today}
category: ${category}
tags: []
author: "Clinton | Tzeptosoft"
coverImage: ""
coverAlt: ""
coverCaption: ""
---

# ${title.trim()}

Start with the problem this article helps the reader solve. Use short sections, descriptive headings, and specific examples.

## First section

Add your first section here.

## Conclusion

Summarize the useful next step for the reader.

<!-- Article images go in /assets/images/articles/${slug}/. Add them with Markdown, for example: ![Describe the image](/assets/images/articles/${slug}/example.webp) -->
`;

        stdout.write(`${publish ? 'Publishing source' : 'Draft'}: ${relativePath}\n`);
        stdout.write(`Image folder: ${path.relative(root, imageDirectory)}\n`);
        if (!dryRun) {
            fs.mkdirSync(path.dirname(articlePath), { recursive: true });
            fs.mkdirSync(imageDirectory, { recursive: true });
            if (existingDraft) fs.renameSync(draftPath, articlePath);
            else fs.writeFileSync(articlePath, content, { flag: 'wx' });
            const imageReadme = path.join(imageDirectory, 'README.md');
            if (!fs.existsSync(imageReadme)) {
                fs.writeFileSync(imageReadme, 'Place licensed, compressed article images here. Reference them from Markdown as `/assets/images/articles/<slug>/filename.webp`.\n');
            }
            stdout.write(`Created. ${publish ? 'Run npm run dev to preview it.' : 'Edit this draft, then run the same command with --publish to move it into the live content tree.'}\n`);
        }
    } finally {
        prompt.close();
    }
}

main().catch((error) => {
    console.error(error.message);
    process.exitCode = 1;
});