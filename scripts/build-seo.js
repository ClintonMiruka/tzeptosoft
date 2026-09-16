const fs = require('fs');
const path = require('path');

const SITE_BASE_URL = 'https://tzeptosoft.com';
const ROOT_DIR = path.resolve(__dirname, '..');
const SITEMAP_PATH = path.join(ROOT_DIR, 'sitemap.xml');
const ROBOTS_PATH = path.join(ROOT_DIR, 'robots.txt');

function getHtmlFiles(dir, fileList = []) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });

  entries.forEach((entry) => {
    if (entry.name.startsWith('.')) return;

    const fullPath = path.join(dir, entry.name);

    if (entry.isDirectory()) {
      if (['.git', 'node_modules', 'dist', 'coverage'].includes(entry.name)) return;
      getHtmlFiles(fullPath, fileList);
      return;
    }

    if (entry.isFile() && entry.name.toLowerCase().endsWith('.html')) {
      fileList.push(fullPath);
    }
  });

  return fileList;
}

function generateSitemap() {
  const htmlFiles = getHtmlFiles(ROOT_DIR)
    .map((filePath) => path.relative(ROOT_DIR, filePath).replace(/\\/g, '/'))
    .filter((relativePath) => relativePath && relativePath !== 'robots.txt' && relativePath !== 'sitemap.xml');

  const today = new Date().toISOString().split('T')[0];

  const urls = htmlFiles
    .map((relativePath) => {
      const normalizedPath = relativePath === 'index.html' ? '' : relativePath.replace(/\.html$/i, '');
      const url = normalizedPath ? `${SITE_BASE_URL}/${normalizedPath}` : SITE_BASE_URL;
      const priority = relativePath === 'index.html' ? '1.0' : '0.8';

      return `  <url>
    <loc>${url}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>${priority}</priority>
  </url>`;
    })
    .join('\n');

  const sitemapXml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>`;

  fs.writeFileSync(SITEMAP_PATH, sitemapXml, 'utf8');
  console.log(`✅ Generated sitemap.xml with ${htmlFiles.length} pages.`);
}

function generateRobotsTxt() {
  const robotsTxt = `User-agent: *
Allow: /

Sitemap: ${SITE_BASE_URL}/sitemap.xml
`;

  fs.writeFileSync(ROBOTS_PATH, robotsTxt, 'utf8');
  console.log('✅ Generated robots.txt');
}

generateSitemap();
generateRobotsTxt();
