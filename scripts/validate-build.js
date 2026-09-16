const fs = require('fs');
const path = require('path');

const ROOT_DIR = path.resolve(__dirname, '..');
const EXCLUDED_DIRS = new Set(['.git', 'node_modules', '.next', 'dist', 'coverage', 'components', 'templates']);
let errorsFound = 0;
let warningsFound = 0;

function getHtmlFiles(dir, fileList = []) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });

  entries.forEach((entry) => {
    if (entry.name.startsWith('.')) return;

    const fullPath = path.join(dir, entry.name);

    if (entry.isDirectory()) {
      if (EXCLUDED_DIRS.has(entry.name)) return;
      getHtmlFiles(fullPath, fileList);
      return;
    }

    if (entry.isFile() && entry.name.toLowerCase().endsWith('.html')) {
      fileList.push(fullPath);
    }
  });

  return fileList;
}

function isExternalReference(value) {
  return (
    !value ||
    value.startsWith('http://') ||
    value.startsWith('https://') ||
    value.startsWith('//') ||
    value.startsWith('#') ||
    value.startsWith('mailto:') ||
    value.startsWith('tel:') ||
    value.startsWith('data:') ||
    value.startsWith('javascript:')
  );
}

function resolveLocalReference(filePath, value) {
  const cleanValue = value.split('?')[0].split('#')[0].trim();
  if (!cleanValue || isExternalReference(cleanValue)) return null;

  if (cleanValue.startsWith('/')) {
    return path.join(ROOT_DIR, cleanValue.replace(/^\/+/, ''));
  }

  return path.resolve(path.dirname(filePath), cleanValue);
}

function validateHtmlFile(filePath) {
  const relativePath = path.relative(ROOT_DIR, filePath).replace(/\\/g, '/');
  const content = fs.readFileSync(filePath, 'utf8');

  if (!/<!doctype html>/i.test(content)) {
    console.error(`❌ [${relativePath}] Missing <!DOCTYPE html> declaration.`);
    errorsFound += 1;
  }

  if (!/rel=["']canonical["']/i.test(content)) {
    console.warn(`⚠️ [${relativePath}] Missing <link rel="canonical"> tag.`);
    warningsFound += 1;
  }

  const refs = [...content.matchAll(/(?:src|href)=['"]([^'"]+)['"]/gi)].map((match) => match[1]);

  refs.forEach((ref) => {
    const resolved = resolveLocalReference(filePath, ref);
    if (!resolved) return;

    if (!fs.existsSync(resolved)) {
      console.error(`❌ [${relativePath}] Broken local reference: "${ref}" -> File not found.`);
      errorsFound += 1;
    }
  });

  const imgRefs = [...content.matchAll(/<img[^>]+src=["']([^"']+)["'][^>]*>/gi)].map((match) => match[1]);
  imgRefs.forEach((ref) => {
    const resolved = resolveLocalReference(filePath, ref);
    if (!resolved) return;

    if (!fs.existsSync(resolved)) {
      console.error(`❌ [${relativePath}] Missing image asset: "${ref}".`);
      errorsFound += 1;
    }
  });
}

function runValidation() {
  console.log('🔍 Starting static HTML & asset validation scan...\n');

  const htmlFiles = getHtmlFiles(ROOT_DIR).sort();

  htmlFiles.forEach((filePath) => validateHtmlFile(filePath));

  console.log('\n----------------------------------------');
  console.log(`Scan completed across ${htmlFiles.length} HTML files.`);
  console.log(`Errors: ${errorsFound} | Warnings: ${warningsFound}`);
  console.log('----------------------------------------\n');

  if (errorsFound > 0) {
    console.error('❌ Build validation failed. Please fix the broken references above before deploying.');
    process.exit(1);
  }

  console.log('✅ All static checks passed successfully!');
}

runValidation();
