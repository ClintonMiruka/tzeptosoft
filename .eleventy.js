const fs = require('node:fs');
const path = require('node:path');
const { spawnSync } = require('node:child_process');

const root = __dirname;

function runGenerator(script, outputDirectory) {
    const result = spawnSync(process.execPath, [path.join(root, 'scripts', script)], {
        cwd: root,
        env: { ...process.env, SITE_ROOT: outputDirectory },
        encoding: 'utf8'
    });

    if (result.stdout) process.stdout.write(result.stdout);
    if (result.stderr) process.stderr.write(result.stderr);
    if (result.status !== 0) {
        throw new Error(`${script} failed with exit code ${result.status}`);
    }
}

module.exports = function (eleventyConfig) {
    for (const directory of ['assets', 'components', 'pages']) {
        eleventyConfig.addPassthroughCopy(directory);
    }
    for (const file of ['index.html', 'vercel.json', '_redirects', '_headers']) {
        eleventyConfig.addPassthroughCopy(file);
    }
    eleventyConfig.addWatchTarget('assets');
    eleventyConfig.on('eleventy.before', ({ directories, outputMode }) => {
        if (outputMode !== 'fs') return;
        const outputDirectory = path.resolve(root, directories.output);
        if (outputDirectory !== path.join(root, 'dist')) {
            throw new Error(`Refusing to clean unexpected output directory: ${outputDirectory}`);
        }
        fs.rmSync(outputDirectory, { recursive: true, force: true });
    });
    eleventyConfig.addFilter('dateIso', (value) => new Date(value).toISOString().slice(0, 10));
    eleventyConfig.addFilter('dateReadable', (value) => new Date(value).toLocaleDateString('en', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        timeZone: 'UTC'
    }));

    eleventyConfig.on('eleventy.after', ({ dir }) => {
        const outputDirectory = path.resolve(root, dir.output);
        runGenerator('build-blog-index.js', outputDirectory);
        runGenerator('generate-search-index.js', outputDirectory);
        runGenerator('map-existing-routes.js', outputDirectory);
        runGenerator('inject-newsletter.js', outputDirectory);
    });

    return {
        dir: {
            input: 'content/posts',
            includes: '../../_includes',
            output: 'dist'
        },
        templateFormats: ['md'],
        markdownTemplateEngine: 'njk',
        htmlTemplateEngine: false,
        dataTemplateEngine: false
    };
};