# Publishing Articles

New articles are written in Markdown with VS Code. Existing HTML articles and their URLs remain unchanged. A published Markdown file is rendered to `/pages/<category>/<slug>.html` and appears in the generated archive, search index, and physical route manifest.

## One-time setup

Install Node.js 22 or newer. In a clean checkout, install the project tools with:

```sh
npm install
```

The site uses Eleventy only as a development/build dependency. It produces static files in `dist/`; no server-side application is required to serve articles.

This workspace currently contains pre-staged `node_modules` files. Avoid running `npm install` or `npm ci` here until those staged changes have been reviewed, because package installation can replace that directory. To run a one-off check without installing into the existing tree, use:

```sh
npm exec --yes --package=@11ty/eleventy -- npm run check
```

## Create a draft

Start with a draft so it cannot accidentally appear on the live site:

```sh
npm run new-article
```

Answer the title and category prompts. Or provide them directly:

```sh
npm run new-article -- "A Clear Article Title" life
```

Drafts are created in `content/drafts/`. Write in Markdown. Add the final image files to `assets/images/articles/<slug>/`; use original or properly licensed images, compress them, and credit the source when required.

## Publish and preview

When the article is ready, create its publishing source with `--publish`:

```sh
npm run new-article -- --publish "A Clear Article Title" life
```

This creates `content/posts/<category>/<slug>.md`. Fill in the description, publication date, tags, author and image metadata. If using a cover image, set `coverImage` to a root-relative path such as `/assets/images/articles/a-clear-article-title/cover.webp`, and write a meaningful `coverAlt`.

Preview the built site locally:

```sh
npm run dev
```

Open the Eleventy local URL shown in the terminal and visit `/pages/<category>/<slug>.html`. Check image loading, article links, and narrow/mobile widths.

Before publishing, run:

```sh
npm run check
```

The check builds the site, verifies the generated article/search indexes and physical route manifest, checks alias parity and destinations, and validates metadata and cover-image paths. Build output is in `dist/` and is ignored by Git.

## Publish online

Commit the Markdown and image files with VS Code Source Control, push to the connected Git repository, and review the hosting preview before promoting it. Keep paid PDFs out of `assets/`; static site files are public.

The repository currently includes Vercel aliases and matching Cloudflare Pages `_redirects`. Vercel's free Hobby plan is not intended for commercial use. Before collecting subscribers or selling products, confirm the hosting plan permits the intended use and complete the Cloudflare Pages setup. For Cloudflare Pages, use Node 22, build command `npm run build`, and output directory `dist`. Preserve a preview/rollback deployment until all old routes and assets have been checked.

The existing newsletter form does not yet store or email subscribers, and the existing Firebase comments are not yet migrated to moderated anonymous comments. Do not advertise either feature as active until a provider is connected and its success, error, consent, and privacy flows are tested.

## Resend email setup

The contact form and newsletter endpoints use the Resend Node SDK. In the deployment provider's server-side environment settings, configure `RESEND_API_KEY`; also configure `RESEND_AUDIENCE_ID` with the ID of the Resend Audience that should receive newsletter contacts. For production contact mail, verify a sending domain in Resend and set `RESEND_FROM_EMAIL` to an address on that verified domain. Never add these values to HTML, browser JavaScript, or committed files. Local API testing needs the same variables in the local server environment.

The contact endpoint sends to `tzeptosoft@gmail.com` and sets the validated visitor email as Reply-To. Newsletter signup adds the address to the configured Audience with `unsubscribed: false`; configure a Resend confirmation flow if double opt-in is required for your policies. A deploy without these variables returns an error instead of claiming signup succeeded.

Vercel response headers add `nosniff`, a strict referrer policy, frame protection, and a restrictive permissions policy. Shared HTML is cached at Vercel's edge for five minutes with stale-while-revalidate while browsers revalidate; CSS/JS get a five-minute browser TTL, article images one day, and generated JSON indexes one minute. These assets are not all content-hashed, so they are intentionally not marked immutable. Contact and newsletter API responses use `private, no-store`.

## Image checklist

- Use images you created or have permission to publish.
- Compress large files with a free tool such as Squoosh; keep originals locally if needed.
- Include descriptive alternative text. Use empty alt text only for decorative images.
- Add `width` and `height` to inline HTML images to reserve layout space. The cover image reserves a 16:9 box in the article template.
- Use captions and source credits when they add context or are required by the license.

## Current boundaries

- Existing articles stay as HTML; only new articles use Markdown.
- The build preserves existing static pages and assets and writes the generated site to `dist/`.
- Email capture, hosted comments, checkout, and private product delivery require separate provider/account setup. They are not enabled by this publishing workflow.
- Free hosting and email services have quotas and can change their terms. Check current plan limits before depending on them for a commercial operation.