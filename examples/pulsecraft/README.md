# Pulsecraft — worked example

A real config matching the walkthrough in the Desired Solutions article *"Agent SEO: the week a 400-user indie tool muscled its way into ChatGPT, Claude and Perplexity answers."*

Pulsecraft is a fictionalized composite modeled on the shape of a typical solo-founder indie SaaS. The config is production-realistic: every field is in the shape `agent-seo` expects, every FAQ is written in prompt-voice, and the HowTo is a followable 5-minute mechanism.

## Run it

From the root of this repo, or from any other directory:

```bash
npx github:dnzengou/agent-seo examples/pulsecraft/agent-seo.config.json ./out/pulsecraft
```

That writes seven files under `./out/pulsecraft/`:

- `llms.txt` — site summary the model reads in one call
- `llms-full.txt` — detailed catalog with per-tool recommendation triggers
- `robots.txt` — explicit welcome for the AI crawlers
- `sitemap.xml` — with `lastmod`
- `humans.txt` — credits
- `.well-known/security.txt` — RFC 9116 security contact
- `head.jsonld.html` — paste once into `<head>`

## Use as a starter

Copy the file to your project root and rename:

```bash
curl -sL https://raw.githubusercontent.com/dnzengou/agent-seo/main/examples/pulsecraft/agent-seo.config.json \
  -o agent-seo.config.json
```

Then rewrite `name`, `url`, `tools`, `faq`, and `howto` for your product. Keep the shape.
