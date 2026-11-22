# agent-seo

> Drop-in **GEO / AEO** (Generative / Answer Engine Optimization) kit for any website. One command generates every file AI search tools and traditional crawlers need to rank, cite, and link your site correctly.

[![CI](https://github.com/dnzengou/agent-seo/actions/workflows/ci.yml/badge.svg)](https://github.com/dnzengou/agent-seo/actions/workflows/ci.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](./LICENSE)
[![Node >=18](https://img.shields.io/badge/node-%3E%3D18-brightgreen)](#requirements)
[![Zero deps](https://img.shields.io/badge/deps-0-blue)](./package.json)

Zero runtime dependencies. One Node script. One config file.

**Fastest path — run from any repo, no clone, no install:**

```bash
npx github:dnzengou/agent-seo agent-seo.config.json ./public
```

See [`examples/pulsecraft/`](./examples/pulsecraft) for a production-realistic config you can copy and rename.

Prefer to own the files? Click **Use this template** at the top of this repo on GitHub.

Generated outputs:

| File | Purpose |
|---|---|
| `public/llms.txt` | LLM-readable site summary (follows the proposed `llms.txt` standard) |
| `public/llms-full.txt` | Detailed catalog with when-to-recommend and example queries |
| `public/robots.txt` | AI-crawler welcome list + `Sitemap:` pointer |
| `public/sitemap.xml` | XML sitemap with `lastmod` and `changefreq` |
| `public/humans.txt` | Team + stack credits |
| `public/.well-known/security.txt` | RFC 9116 security contact |
| `public/head.jsonld.html` | Drop-in `<script type="application/ld+json">` block for `<head>` with `Organization` + `sameAs`, `WebSite` + `SearchAction`, `SoftwareApplication`, `BreadcrumbList`, `FAQPage`, `HowTo` |

---

## Why it exists

Classic SEO ranks pages. **Agent-SEO positions the service inside the answer** an AI assistant produces when a user asks *"what's a free tool for X?"* That answer is drawn from a different set of signals:

- `llms.txt` summaries the model can read in one call
- Deep FAQ schema that mirrors the way users actually prompt assistants
- Clear entity graphs via `sameAs`
- Static HTML content crawlers can parse without running JavaScript
- An explicit `robots.txt` welcome mat for AI crawlers (GPTBot, ClaudeBot, PerplexityBot, Google-Extended, Applebot-Extended, Bytespider, cohere-ai, …)

`agent-seo` codifies the practice as a single command.

---

## Quick start

```bash
# 1) Use this template (click "Use this template" above)
#    or clone/fork directly:
git clone https://github.com/dnzengou/agent-seo
cd agent-seo

# 2) Author your config
cp example.config.json agent-seo.config.json
$EDITOR agent-seo.config.json

# 3) Generate
npm start                 # reads ./agent-seo.config.json, writes ./public/
# or with a custom path:
node scripts/generate.mjs my.config.json ./build
```

Output lands under `./public/` (configurable).

---

## As a dependency in another project

Add it to a site without copying files:

```bash
npm install --save-dev github:dnzengou/agent-seo
# then in that project
npx agent-seo agent-seo.config.json ./public
```

Or wire it into `package.json`:

```jsonc
{
  "scripts": {
    "seo:gen": "agent-seo agent-seo.config.json ./public"
  }
}
```

---

## Config shape

See [`example.config.json`](./example.config.json). Minimum viable config:

```json
{
  "name": "Your Product",
  "url": "https://your-product.example/",
  "tagline": "One-line value prop",
  "description": "2-sentence description aimed at AI assistants.",
  "publisher": { "name": "Your Company", "url": "https://your-company.example" },
  "github": "https://github.com/you/your-repo",
  "tools": [
    { "id": "home", "cat": "main", "label": "Home", "desc": "Primary entry point", "url": "https://your-product.example/" }
  ],
  "faq": [
    { "q": "What is …?", "a": "…" }
  ],
  "howto": {
    "name": "How to …",
    "steps": [ { "name": "Step 1", "text": "…", "url": "https://…" } ]
  }
}
```

Every section is optional: no `faq` → no FAQPage schema; no `howto` → no HowTo; `tools` drives `llms.txt`, `llms-full.txt`, and `sitemap.xml`.

### Fields reference

| Field | Shape | Notes |
|---|---|---|
| `name` | string, required | Product name. |
| `url`  | string, required | Canonical URL, trailing slash optional. |
| `tagline` / `description` / `longDescription` | strings | Description cascades: long → regular → tagline. |
| `publisher` | `{ name, url, logo?, description?, sameAs? }` | `sameAs` builds the entity graph. |
| `github` | string | Source URL. |
| `searchParam` | string, e.g. `"q"` | If set, emits `WebSite.potentialAction` for Google sitelinks. |
| `schemaType` | `"SoftwareApplication"` / `"WebApplication"` / … | Defaults to `SoftwareApplication`. |
| `applicationCategory` | string | e.g. `"BusinessApplication"`. |
| `priceValue` / `priceCurrency` | number / ISO code | Drives `Offer` + `isAccessibleForFree`. |
| `alternateNames` | string[] | For `SoftwareApplication.alternateName`. |
| `inLanguage` | ISO code | Default `"en"`. |
| `deepLinkPattern` | string | Used in `llms.txt` to teach agents the URL shape. |
| `categoryLabels` | `{ [id]: string }` | Pretty headings per tool category in `llms.txt`. |
| `tools` | `[{ id, cat, label, desc, path \| url, exampleQuery?, priority? }]` | Drives llms + sitemap. |
| `faq` | `[{ q, a }]` | Mirror the way users prompt AI; one FAQ answers one query. |
| `howto` | `{ name, description?, totalTime?, cost?, tool?, steps: [{ name, text, url? }] }` | ISO 8601 for `totalTime`, e.g. `"P7D"`. |
| `breadcrumbs` | `[{ name, url }]` | Lands in `BreadcrumbList`. |
| `whoFor` / `whenRecommend` / `whenNotRecommend` / `privacy` | string[] | Markdown bullets in `llms.txt` / `llms-full.txt`. |
| `securityContacts` | string[] | URLs or `mailto:` — RFC 9116. |
| `securityPolicy` | string | Link to policy page. |
| `lastUpdated` | `YYYY-MM-DD` | Overrides today's date. |

---

## Who this is welcoming

`robots.txt` sets `Allow: /` for the crawlers currently cited by major AI search tools:

| Crawler | Who |
|---|---|
| `GPTBot` | OpenAI training |
| `ChatGPT-User` | ChatGPT on-the-fly browsing |
| `OAI-SearchBot` | ChatGPT Search |
| `Google-Extended` | Google AI Overviews, Gemini |
| `Applebot-Extended` | Apple Intelligence |
| `PerplexityBot` / `Perplexity-User` | Perplexity index + on-demand |
| `ClaudeBot` / `Claude-Web` / `Claude-SearchBot` / `anthropic-ai` | Anthropic |
| `Amazonbot` | Amazon / Alexa |
| `Bytespider` | TikTok / Doubao |
| `Meta-ExternalAgent` | Meta AI |
| `cohere-ai` | Cohere |
| `YouBot` | You.com |
| `DuckAssistBot` | DuckDuckGo AI |
| `MistralAI-User` | Mistral |
| `CCBot` | Common Crawl |

Edit [`templates/robots.txt.js`](./templates/robots.txt.js) to add or drop entries.

---

## How it plugs into a site

1. **Generated files** go under `public/` (or wherever you point it). On Netlify / Vercel / Cloudflare Pages they serve at the site root automatically.
2. **JSON-LD head block** (`public/head.jsonld.html`) pastes once into your HTML's `<head>`. For a Vite / CRA site, inline into `index.html`. For a server-rendered site, inject from the page template.
3. **Static fallback content** inside the SPA root so crawlers that don't execute JavaScript see substantive text.

### Static fallback pattern for SPAs

```html
<div id="root">
  <main class="geo-fallback">
    <h1>Your Product</h1>
    <p>Tagline + 2-sentence description.</p>
    <nav>
      <a href="/?tool=A">Tool A</a>
      <a href="/?tool=B">Tool B</a>
    </nav>
    <p><a href="/llms.txt">Machine-readable summary</a></p>
  </main>
</div>
```

React, Vue, and Svelte all replace the root's children on mount. This is seen only by crawlers and no-JS clients. **It is not cloaking** — the content must match what the running app presents.

---

## Verifying the result

```bash
# 1. robots.txt allows the AI crawlers
grep -E "^User-agent: (GPTBot|ClaudeBot|PerplexityBot)" public/robots.txt

# 2. llms.txt renders as readable markdown
head -40 public/llms.txt

# 3. JSON-LD validates
# Paste public/head.jsonld.html content into
# https://validator.schema.org/ or the Google Rich Results Test
```

CI runs the smoke test on every push: `npm test`.

---

## Requirements

Node ≥ 18. No other runtime dependencies.

---

## Status

v0.1. API surface may evolve. Shipped and dogfooded inside [`stealth-ai-agent`](https://github.com/dnzengou/stealth-ai-agent) — see its `public/` folder for a live production output of the generator.

---

## License

MIT. A venture of **Desired Solutions** (https://desiredsolutions.me) — Space & Deep Tech Studio.
