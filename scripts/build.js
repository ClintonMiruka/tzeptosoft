#!/usr/bin/env node

/ 
 * TZEPTOSOFT BUILD SCRIPT
 * ⚔️ No bullshit, just building empires
 * 
 * Usage:
 * node build.js --help
 * node build.js new-article "Article Title" "Category"
 * node build.js deploy --env=production
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Configuration - CHANGE THESE FOR YOUR SETUP
const CONFIG = {
    // File paths
    baseTemplate: 'templates/base.html',
    articlesDir: 'blog',
    assetsDir: 'assets',
    outputDir: 'dist',
    
    // Site defaults
    siteName: 'Tzeptosoft',
    siteUrl: 'https://tzeptosoft.com',
    author: 'Clinton | Tzeptosoft',
    email: 'tzeptosoft@gmail.com',
    
    // Build settings
    minifyHTML: true,
    optimizeImages: true,
    generateSitemap: true,
    
    // Deployment
    deployToNetlify: false,
    deployToVercel: false,
    githubRepo: 'your-username/tzeptosoft'
};

// Utility functions
const utils = {
    log: (message, type = 'info') => {
        const colors = {
            info: '\x1b[36m', // Cyan
            success: '\x1b[32m', // Green
            warning: '\x1b[33m', // Yellow
            error: '\x1b[31m', // Red
            debug: '\x1b[90m', // Gray
            reset: '\x1b[0m'
        };
        console.log(`${colors[type] || colors.info}[${type.toUpperCase()}]${colors.reset} ${message}`);
    },

    error: (message, exit = true) => {
        utils.log(message, 'error');
        if (exit) process.exit(1);
    },

    success: (message) => {
        utils.log(message, 'success');
    },

    ensureDir: (dirPath) => {
        if (!fs.existsSync(dirPath)) {
            fs.mkdirSync(dirPath, { recursive: true });
            utils.log(`Created directory: ${dirPath}`, 'debug');
        }
    },

    readFile: (filePath) => {
        try {
            return fs.readFileSync(filePath, 'utf8');
        } catch (error) {
            utils.error(`Failed to read file: ${filePath}`);
            return null;
        }
    },

    writeFile: (filePath, content) => {
        try {
            fs.writeFileSync(filePath, content, 'utf8');
            utils.log(`Wrote file: ${filePath}`, 'debug');
            return true;
        } catch (error) {
            utils.error(`Failed to write file: ${filePath}`);
            return false;
        }
    },

    slugify: (text) => {
        return text
            .toLowerCase()
            .replace(/[^\w\s-]/g, '')
            .replace(/[\s_-]+/g, '-')
            .replace(/^-+|-+$/g, '');
    },

    formatDate: (date = new Date()) => {
        return date.toISOString().split('T')[0];
    },

    capitalize: (text) => {
        return text.charAt(0).toUpperCase() + text.slice(1);
    }
};

// HTML Minifier
const minifyHTML = (html) => {
    return html
        .replace(/<!--[\s\S]*?-->/g, '') // Remove comments
        .replace(/\s+/g, ' ') // Collapse whitespace
        .replace(/>\s+</g, '><') // Remove whitespace between tags
        .trim();
};

// Article Generator
const generateArticle = (title, category = 'wisdom') => {
    utils.log(`🔥 Generating new article: "${title}"`, 'info');
    
    const slug = utils.slugify(title);
    const date = utils.formatDate();
    const fileName = `${slug}.html`;
    const filePath = path.join(CONFIG.articlesDir, fileName);
    
    // Read base template
    const template = utils.readFile(CONFIG.baseTemplate);
    if (!template) return;
    
    // Generate metadata
    const pageTitle = title;
    const pageDescription = `${title} - Raw, unfiltered wisdom from Tzeptosoft. No bullshit, just truth.`;
    const pageKeywords = `${utils.slugify(title).replace(/-/g, ', ')}, Tzeptosoft, ${category}, raw wisdom, no bullshit`;
    const pageImage = `${CONFIG.siteUrl}/assets/${slug}.webp`;
    const pageUrl = `${CONFIG.siteUrl}/blog/${slug}`;
    
    // Generate hero animation text based on category
    const heroAnimations = {
        'men': 'FORGING MASCULINE KINGS',
        'women': 'BUILDING FEMININE QUEENS',
        'freedom': 'ESCAPING THE MATRIX',
        'wisdom': 'RAW UNFILTERED TRUTH',
        'dating': 'DOMINATING THE DATING GAME',
        'career': 'BUILDING DIGITAL EMPIRES'
    };
    
    const heroAnimation = heroAnimations[category] || 'ESCAPING THE MATRIX';
    const heroSubtitle = `${title} - No bullshit, just actionable truth.`;
    
    // Replace template variables
    let content = template
        .replace(/{{page_title}}/g, pageTitle)
        .replace(/{{page_description}}/g, pageDescription)
        .replace(/{{page_keywords}}/g, pageKeywords)
        .replace(/{{page_image}}/g, pageImage)
        .replace(/{{page_url}}/g, pageUrl)
        .replace(/{{publish_date}}/g, date)
        .replace(/{{page_slug}}/g, slug)
        .replace(/{{hero_animation_text}}/g, heroAnimation)
        .replace(/{{hero_subtitle}}/g, heroSubtitle)
        .replace(/{{article_title}}/g, pageTitle)
        .replace(/{{share_text}}/g, encodeURIComponent(`${title} - Raw wisdom from @tzeptosoft`));
    
    // Add category-specific classes
    if (category === 'men') {
        content = content.replace('<body', '<body class="article-men"');
    } else if (category === 'women') {
        content = content.replace('<body', '<body class="article-women"');
    }
    
    // Ensure articles directory exists
    utils.ensureDir(CONFIG.articlesDir);
    
    // Write the article file
    if (utils.writeFile(filePath, content)) {
        utils.success(`✅ Article created: ${filePath}`);
        utils.log(`📝 Edit this file to add your content`, 'info');
        utils.log(`🌐 URL will be: ${pageUrl}`, 'info');
        
        // Generate TODO markers in the file
        const todoContent = utils.readFile(filePath);
        const updatedContent = todoContent.replace(
            '<!-- YOUR ARTICLE CONTENT GOES HERE -->',
            `<!-- YOUR ARTICLE CONTENT GOES HERE -->

<!-- =========================================== -->
<!-- START WRITING YOUR FUCKING ARTICLE BELOW   -->
<!-- =========================================== -->

<h2>Start With a Bang</h2>
<p><strong>Your first sentence needs to slap.</strong> No gentle introductions. Hit them with truth immediately. What's the brutal reality you're exposing?</p>

<h2>The Core Truth Bomb</h2>
<p>This is where you drop the main insight. Back it with:</p>
<ul>
    <li><strong>Stats that prove your point</strong></li>
    <li><strong>Real-world examples</strong></li>
    <li><strong>Actionable steps</strong></li>
</ul>

<h2>Tactical Section</h2>
<p>Give them specific, actionable advice. Use:</p>
<pre><code class="highlight">.highlight {
    color: var(--secondary);
    background: rgba(0, 204, 255, 0.1);
    padding: 2px 6px;
    border-radius: 3px;
}</code></pre>

<h2>Call to War</h2>
<p>End with a challenge. Make them act TODAY.</p>

<!-- =========================================== -->
<!-- END YOUR ARTICLE CONTENT HERE              -->
<!-- =========================================== -->`
        );
        
        utils.writeFile(filePath, updatedContent);
        
        // Update homepage with new article (optional)
        updateHomepageWithNewArticle(title, slug, category, date);
        
        return {
            success: true,
            filePath,
            slug,
            url: pageUrl
        };
    }
    
    return { success: false };
};

// Update homepage with new article
const updateHomepageWithNewArticle = (title, slug, category, date) => {
    const homepagePath = 'index.html';
    if (!fs.existsSync(homepagePath)) {
        utils.log('Homepage not found, skipping update', 'warning');
        return;
    }
    
    let homepage = utils.readFile(homepagePath);
    
    // Find the articles grid section
    const articlesGridStart = homepage.indexOf('<div class="articles-grid">');
    if (articlesGridStart === -1) {
        utils.log('Articles grid not found in homepage', 'warning');
        return;
    }
    
    // Find where to insert new article (after the opening div)
    const insertPosition = homepage.indexOf('</div>', articlesGridStart) + 6;
    
    // Create new article card HTML
    const categoryIcons = {
        'men': '⚔️',
        'women': '👑',
        'freedom': '⚡',
        'wisdom': '🧠',
        'dating': '💘',
        'career': '💼'
    };
    
    const icon = categoryIcons[category] || '🔥';
    const categoryLabel = utils.capitalize(category);
    
    const newArticleCard = `
        <div class="article-card" onclick="window.location.href='/blog/${slug}'">
            <div class="article-content">
                <span class="article-category">${categoryLabel} ${icon}</span>
                <h3 class="article-title">${title}</h3>
                <p class="article-excerpt">Raw, unfiltered wisdom about ${title.toLowerCase()}. No bullshit, just truth.</p>
                <div class="article-meta">
                    <span>Published: ${date}</span>
                    <span>${icon} NEW</span>
                </div>
            </div>
        </div>
    `;
    
    // Insert the new article card
    homepage = homepage.slice(0, insertPosition) + newArticleCard + homepage.slice(insertPosition);
    
    utils.writeFile(homepagePath, homepage);
    utils.log('✅ Updated homepage with new article', 'success');
};

// Build entire site
const buildSite = () => {
    utils.log('⚔️ Building Tzeptosoft website...', 'info');
    
    // Create output directory
    utils.ensureDir(CONFIG.outputDir);
    
    // Copy all HTML files
    utils.log('📄 Processing HTML files...', 'info');
    
    // Process homepage
    if (fs.existsSync('index.html')) {
        let homepage = utils.readFile('index.html');
        if (CONFIG.minifyHTML) {
            homepage = minifyHTML(homepage);
        }
        utils.writeFile(path.join(CONFIG.outputDir, 'index.html'), homepage);
        utils.success('✅ Built homepage');
    }
    
    // Process blog articles
    if (fs.existsSync(CONFIG.articlesDir)) {
        const articles = fs.readdirSync(CONFIG.articlesDir).filter(file => file.endsWith('.html'));
        
        utils.ensureDir(path.join(CONFIG.outputDir, 'blog'));
        
        articles.forEach(article => {
            let content = utils.readFile(path.join(CONFIG.articlesDir, article));
            if (CONFIG.minifyHTML) {
                content = minifyHTML(content);
            }
            utils.writeFile(path.join(CONFIG.outputDir, 'blog', article), content);
        });
        
        utils.success(`✅ Built ${articles.length} articles`);
    }
    
    // Copy assets
    utils.log('🖼️ Copying assets...', 'info');
    
    if (fs.existsSync(CONFIG.assetsDir)) {
        // Simple recursive copy for assets
        const copyDir = (src, dest) => {
            utils.ensureDir(dest);
            const items = fs.readdirSync(src);
            
            items.forEach(item => {
                const srcPath = path.join(src, item);
                const destPath = path.join(dest, item);
                
                if (fs.statSync(srcPath).isDirectory()) {
                    copyDir(srcPath, destPath);
                } else {
                    fs.copyFileSync(srcPath, destPath);
                }
            });
        };
        
        copyDir(CONFIG.assetsDir, path.join(CONFIG.outputDir, 'assets'));
        utils.success('✅ Copied assets');
    }
    
    // Generate sitemap
    if (CONFIG.generateSitemap) {
        generateSitemap();
    }
    
    utils.success('🎉 Build complete!');
    utils.log(`📁 Output directory: ${CONFIG.outputDir}`, 'info');
    utils.log(`🌐 Preview: open ${CONFIG.outputDir}/index.html`, 'info');
};

// Generate sitemap.xml
const generateSitemap = () => {
    utils.log('🗺️ Generating sitemap...', 'info');
    
    const baseUrl = CONFIG.siteUrl;
    const today = utils.formatDate();
    
    let sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
    <url>
        <loc>${baseUrl}</loc>
        <lastmod>${today}</lastmod>
        <changefreq>daily</changefreq>
        <priority>1.0</priority>
    </url>`;
    
    // Add articles
    if (fs.existsSync(CONFIG.articlesDir)) {
        const articles = fs.readdirSync(CONFIG.articlesDir).filter(file => file.endsWith('.html'));
        
        articles.forEach(article => {
            const slug = article.replace('.html', '');
            sitemap += `
    <url>
        <loc>${baseUrl}/blog/${slug}</loc>
        <lastmod>${today}</lastmod>
        <changefreq>weekly</changefreq>
        <priority>0.8</priority>
    </url>`;
        });
    }
    
    sitemap += '\n</urlset>';
    
    utils.writeFile(path.join(CONFIG.outputDir, 'sitemap.xml'), sitemap);
    utils.success('✅ Generated sitemap.xml');
};

// Deploy to hosting service
const deploy = (environment = 'production') => {
    utils.log(`🚀 Deploying to ${environment}...`, 'info');
    
    if (CONFIG.deployToNetlify) {
        try {
            utils.log('🌐 Deploying to Netlify...', 'info');
            execSync(`netlify deploy --prod --dir=${CONFIG.outputDir}`, { stdio: 'inherit' });
            utils.success('✅ Deployed to Netlify');
        } catch (error) {
            utils.error('Failed to deploy to Netlify');
        }
    } else if (CONFIG.deployToVercel) {
        try {
            utils.log('🚀 Deploying to Vercel...', 'info');
            execSync(`vercel --prod`, { stdio: 'inherit', cwd: CONFIG.outputDir });
            utils.success('✅ Deployed to Vercel');
        } catch (error) {
            utils.error('Failed to deploy to Vercel');
        }
    } else {
        utils.log('💡 No deployment method configured', 'warning');
        utils.log('Configure CONFIG.deployToNetlify or CONFIG.deployToVercel', 'info');
    }
};

// Generate README with project info
const generateReadme = () => {
    utils.log('📝 Generating README.md...', 'info');
    
    const articles = fs.existsSync(CONFIG.articlesDir) 
        ? fs.readdirSync(CONFIG.articlesDir).filter(file => file.endsWith('.html'))
        : [];
    
    const readme = `# TZEPTOSOFT — ESCAPE THE MATRIX ⚔️🔥

>  No bullshit. No sugar-coating. No apologies.   
> Built with the Tzeptosoft Build System - Raw HTML/CSS/JS that fucking works.

## 🚀 QUICK START

\`\`\`bash
# Install dependencies (none required)
# No npm install, no framework bullshit

# Generate a new article
node scripts/build.js new-article "Your Article Title" "category"

# Build the site
node scripts/build.js build

# Deploy
node scripts/build.js deploy
\`\`\`

## 📁 PROJECT STRUCTURE

\`\`\`
tzeptosoft/
├── index.html                      # Homepage
├── blog/                           # ${articles.length} articles
├── assets/                         # Images, icons, favicon
├── templates/
│   └── base.html                   # Article template
├── scripts/
│   └── build.js                    # This build script
└── README.md                       # This file
\`\`\`

## 🔧 AVAILABLE COMMANDS

\`\`\`bash
# Generate new article
node scripts/build.js new-article "Title" "category"

# Build entire site
node scripts/build.js build

# Deploy to production
node scripts/build.js deploy

# Generate sitemap
node scripts/build.js sitemap

# Show help
node scripts/build.js --help
\`\`\`

## 📊 STATS

-  Articles : ${articles.length}
-  Categories : men, women, freedom, wisdom, dating, career
-  Last Build : ${utils.formatDate()}
-  Deployment : ${CONFIG.deployToNetlify ? 'Netlify' : CONFIG.deployToVercel ? 'Vercel' : 'Manual'}

## ⚡ PERFORMANCE

- ✅ Zero dependencies
- ✅ Inline CSS/JS
- ✅ WebP images only
- ✅ Mobile-first
- ✅ SEO optimized
- ✅ HTTPS ready

## 🚨 NO BULLSHIT RULES

1.  No frameworks  - Vanilla JS only
2.  No external dependencies  - Everything inline
3.  No trackers  - Respect your visitors
4.  No bloat  - Keep it fast
5.  No apologies  - Speak truth

---

 Built with the Tzeptosoft Build System   
 Last updated: ${utils.formatDate()}   
 No bullshit, just results.  🔥
`;

    utils.writeFile('README.md', readme);
    utils.success('✅ Generated README.md');
};

// Help text
const showHelp = () => {
    console.log(`
⚔️ TZEPTOSOFT BUILD SCRIPT 🔥
Raw, no-bullshit website builder

USAGE:
  node scripts/build.js [command] [options]

COMMANDS:
  new-article <title> [category]  Generate new article
  build                           Build entire site
  deploy [environment]           Deploy to hosting
  sitemap                        Generate sitemap.xml
  readme                         Generate README.md
  help, --help, -h              Show this help

CATEGORIES:
  men, women, freedom, wisdom, dating, career

EXAMPLES:
  node scripts/build.js new-article "Why Women Chase Bad Boys" men
  node scripts/build.js build
  node scripts/build.js deploy production
  node scripts/build.js --help

CONFIGURATION:
  Edit the CONFIG object at the top of build.js
  Set your site URL, deployment settings, etc.

NO BULLSHIT, JUST BUILDING. ⚔️
`);
};

// Main CLI handler
const main = () => {
    const args = process.argv.slice(2);
    
    if (args.length === 0 || args.includes('--help') || args.includes('-h') || args.includes('help')) {
        showHelp();
        return;
    }
    
    const command = args[0];
    
    switch (command) {
        case 'new-article':
            if (args.length < 2) {
                utils.error('Usage: new-article <title> [category]');
                return;
            }
            const title = args[1];
            const category = args[2] || 'wisdom';
            generateArticle(title, category);
            break;
            
        case 'build':
            buildSite();
            break;
            
        case 'deploy':
            const environment = args[1] || 'production';
            deploy(environment);
            break;
            
        case 'sitemap':
            generateSitemap();
            break;
            
        case 'readme':
            generateReadme();
            break;
            
        default:
            utils.error(`Unknown command: ${command}`);
            showHelp();
    }
};

// Run if called directly
if (require.main === module) {
    main();
}

// Export for testing/importing
module.exports = {
    CONFIG,
    utils,
    generateArticle,
    buildSite,
    deploy,
    generateSitemap,
    generateReadme
};