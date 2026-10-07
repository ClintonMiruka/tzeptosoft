#!/usr/bin/env node

const fs = require('node:fs');
const path = require('node:path');

const root = path.resolve(__dirname, '..');
const output = path.join(root, 'dist');
const errors = [];

function walk(directory) {
    if (!fs.existsSync(directory)) return [];
    return fs.readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
        const file = path.join(directory, entry.name);
        return entry.isDirectory() ? walk(file) : [file];
    });
}

function readJson(relativePath) {
    const file = path.join(output, relativePath);
    try {
        return JSON.parse(fs.readFileSync(file, 'utf8'));
    } catch (error) {
        errors.push(`${relativePath}: ${error.message}`);
        return null;
    }
}

function routeFile(url, source) {
    if (typeof url !== 'string' || !url.startsWith('/') || url.startsWith('//')) {
        errors.push(`${source}: expected a root-relative URL, received ${JSON.stringify(url)}`);
        return null;
    }
    let decoded;
    try {
        decoded = decodeURIComponent(url.split(/[?#]/, 1)[0]);
    } catch {
        errors.push(`${source}: malformed URL encoding in ${url}`);
        return null;
    }
    const target = path.resolve(output, `.${decoded}`);
    if (!target.startsWith(`${output}${path.sep}`)) {
        errors.push(`${source}: URL escapes the build output: ${url}`);
        return null;
    }
    return target;
}

for (const relativePath of ['index.html', 'components/header.html', 'components/footer.html', 'assets/data/posts-index.json', 'assets/data/search-index.json', 'route-manifest.json']) {
    if (!fs.existsSync(path.join(output, relativePath))) errors.push(`Missing build output: ${relativePath}`);
}

const posts = readJson('assets/data/posts-index.json');
const search = readJson('assets/data/search-index.json');
const manifest = readJson('route-manifest.json');
const rewriteConfig = JSON.parse(fs.readFileSync(path.join(root, 'vercel.json'), 'utf8'));
const cloudflareRedirects = fs.existsSync(path.join(output, '_redirects'))
    ? fs.readFileSync(path.join(output, '_redirects'), 'utf8').split(/\r?\n/).filter(Boolean)
    : [];

const configuredHeaders = rewriteConfig.headers || [];
const headerRule = (source) => configuredHeaders.find((rule) => rule.source === source)?.headers || [];
for (const requiredHeader of ['X-Content-Type-Options', 'Referrer-Policy', 'X-Frame-Options', 'Permissions-Policy']) {
    if (!headerRule('/(.*)').some((header) => header.key.toLowerCase() === requiredHeader.toLowerCase())) {
        errors.push(`vercel.json: global security header ${requiredHeader} is missing`);
    }
}
for (const [source, directive] of [
    ['/assets/images/(.*)', 'max-age=86400'],
    ['/assets/css/(.*)', 'max-age=300'],
    ['/assets/js/(.*)', 'max-age=300'],
    ['/assets/data/(.*)', 'max-age=60'],
    ['/pages/(.*)', 's-maxage=300'],
    ['/', 's-maxage=300']
]) {
    const cacheControl = headerRule(source).find((header) => header.key.toLowerCase() === 'cache-control')?.value || '';
    if (!cacheControl.includes(directive)) errors.push(`vercel.json: expected Cache-Control ${directive} for ${source}`);
}

for (const rewrite of rewriteConfig.rewrites || []) {
    if (rewrite.source.includes(':')) continue;
    const target = routeFile(rewrite.destination, 'vercel.json');
    if (target && !fs.existsSync(target)) errors.push(`vercel.json: ${rewrite.source} targets missing file ${rewrite.destination}`);
    if (!cloudflareRedirects.includes(`${rewrite.source} ${rewrite.destination} 200`)) {
        errors.push(`_redirects: missing matching rewrite for ${rewrite.source}`);
    }
}

if (Array.isArray(posts)) {
    for (const post of posts) {
        const target = routeFile(post.url, 'posts-index.json');
        if (target && !fs.existsSync(target)) errors.push(`posts-index.json: ${post.url} does not exist in dist`);
        if (!post.title || !post.description && !post.excerpt || !/^\d{4}-\d{2}-\d{2}$/.test(post.date)) {
            errors.push(`posts-index.json: incomplete article metadata for ${post.url}`);
        }
    }
}

if (Array.isArray(search)) {
    for (const record of search) {
        const target = routeFile(record.url, 'search-index.json');
        if (target && !fs.existsSync(target)) errors.push(`search-index.json: ${record.url} does not exist in dist`);
    }
}

if (Array.isArray(manifest)) {
    const expected = [path.join(output, 'index.html'), ...walk(path.join(output, 'pages'))]
        .filter((file) => file.endsWith('.html'))
        .map((file) => path.relative(output, file).split(path.sep).join('/'))
        .sort();
    if (JSON.stringify(manifest) !== JSON.stringify(expected)) errors.push('route-manifest.json is stale or does not match physical HTML pages.');
}

for (const file of [path.join(output, 'index.html'), ...walk(path.join(output, 'pages'))].filter((candidate) => candidate.endsWith('.html'))) {
    const html = fs.readFileSync(file, 'utf8');
    if (!/\bsrc=["']\/assets\/js\/newsletter\.js(?:\?[^"']*)?["']/i.test(html)) {
        errors.push(`${path.relative(output, file)}: shared newsletter frontend is not loaded`);
    }
}

const markdownFiles = walk(path.join(root, 'content', 'posts')).filter((file) => file.endsWith('.md'));
const indexedPostUrls = new Set(Array.isArray(posts) ? posts.map((post) => post.url) : []);
for (const file of markdownFiles) {
    const relative = path.relative(root, file).split(path.sep).join('/');
    const source = fs.readFileSync(file, 'utf8');
    const frontMatter = source.match(/^---\s*\n([\s\S]*?)\n---/);
    if (!frontMatter) {
        errors.push(`${relative}: missing YAML front matter`);
        continue;
    }
    const values = Object.fromEntries([...frontMatter[1].matchAll(/^([A-Za-z][\w]*):\s*(.*)$/gm)].map((match) => [match[1], match[2].trim().replace(/^['"]|['"]$/g, '')]));
    for (const field of ['title', 'slug', 'description', 'date', 'category', 'author']) {
        if (!values[field]) errors.push(`${relative}: missing ${field}`);
    }
    if (values.slug && !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(values.slug)) errors.push(`${relative}: slug must be lowercase words separated by hyphens`);
    if (values.date && (!/^\d{4}-\d{2}-\d{2}$/.test(values.date) || Number.isNaN(Date.parse(`${values.date}T00:00:00Z`)))) errors.push(`${relative}: date must use YYYY-MM-DD`);
    if (values.category && !['femininity', 'life', 'masculinity', 'mindset', 'relationships', 'tech', 'wealth'].includes(values.category)) errors.push(`${relative}: unsupported category ${values.category}`);
    const expectedPath = path.relative(path.join(root, 'content', 'posts'), file).split(path.sep);
    if (values.category && expectedPath[0] !== values.category) errors.push(`${relative}: category must match its content folder`);
    if (values.slug && expectedPath.at(-1) !== `${values.slug}.md`) errors.push(`${relative}: slug must match the Markdown filename`);
    const publicUrl = `/pages/${values.category}/${values.slug}.html`;
    const renderedPage = path.join(output, publicUrl.slice(1));
    if (!fs.existsSync(renderedPage)) errors.push(`${relative}: expected rendered page ${publicUrl} is missing`);
    if (!indexedPostUrls.has(publicUrl)) errors.push(`${relative}: ${publicUrl} is missing from posts-index.json`);
    if (fs.existsSync(renderedPage)) {
        const html = fs.readFileSync(renderedPage, 'utf8');
        if (!/<h1\b/i.test(html) || !/<meta\s+name="description"\s+content="[^"]+"/i.test(html)) {
            errors.push(`${relative}: rendered page is missing its heading or description metadata`);
        }
        const structuredData = html.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/i)?.[1];
        try {
            if (!structuredData || JSON.parse(structuredData).mainEntityOfPage !== `https://tzeptosoft.com${publicUrl}`) {
                errors.push(`${relative}: rendered BlogPosting structured data is missing or has the wrong canonical URL`);
            }
        } catch {
            errors.push(`${relative}: rendered BlogPosting structured data is invalid JSON`);
        }
    }
    if (values.coverImage) {
        if (!values.coverImage.startsWith('/')) errors.push(`${relative}: coverImage must be a root-relative site path`);
        else if (!fs.existsSync(path.join(root, decodeURIComponent(values.coverImage.slice(1))))) errors.push(`${relative}: cover image not found: ${values.coverImage}`);
        if (!values.coverAlt) errors.push(`${relative}: add coverAlt when using a cover image`);
    }
}

if (errors.length) {
    console.error(`Site check failed with ${errors.length} issue(s):\n- ${errors.join('\n- ')}`);
    process.exitCode = 1;
} else {
    console.log(`Site check passed: ${posts.length} articles, ${search.length} search records, and ${manifest.length} physical routes.`);
}