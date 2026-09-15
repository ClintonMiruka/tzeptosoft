#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const contact = path.join(root, 'pages/contact-us.html');
let contactHtml = fs.readFileSync(contact, 'utf8');
contactHtml = contactHtml.replace(/href="\/pages\/[^"#?]+"/g, 'href="\/pages\/blog.html"');
fs.writeFileSync(contact, contactHtml);

const about = path.join(root, 'pages/about.html');
fs.writeFileSync(about, fs.readFileSync(about, 'utf8').replace(/href="lessons"/g, 'href="\/pages\/about.html"'));

const home = path.join(root, 'index.html');
fs.writeFileSync(home, fs.readFileSync(home, 'utf8').replace(/\/pages\/Relationships\/women-dont-want-nice-guys\.html/g, '/pages/Relationships/women-dont-wat-nice-guys.html'));

console.log('Normalized legacy internal links.');