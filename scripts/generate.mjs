#!/usr/bin/env node
// agent-seo generator.
// Usage: node scripts/generate.mjs [configPath] [outDir]
// Defaults: configPath=agent-seo.config.json, outDir=public
// Paths resolve against the user's current working directory (process.cwd()),
// so this works whether the module lives in-tree or as a standalone repo.

import { readFile, writeFile, mkdir } from 'node:fs/promises'
import { existsSync } from 'node:fs'
import { join, resolve } from 'node:path'

import { renderRobots }                                 from '../templates/robots.txt.js'
import { renderLlmsTxt, renderLlmsFull }                from '../templates/llms.js'
import { renderJsonLd }                                 from '../templates/jsonld.js'
import { renderSitemap, renderHumans, renderSecurity }  from '../templates/misc.js'

async function main() {
  const [cfgArg, outArg] = process.argv.slice(2)
  const cwd     = process.cwd()
  const cfgPath = resolve(cwd, cfgArg || 'agent-seo.config.json')
  const outDir  = resolve(cwd, outArg || 'public')

  if (!existsSync(cfgPath)) {
    console.error(`agent-seo: no config at ${cfgPath}`)
    console.error('           copy example.config.json to this directory and edit it.')
    process.exit(1)
  }

  const cfg = JSON.parse(await readFile(cfgPath, 'utf8'))
  if (!cfg.name || !cfg.url) {
    console.error('agent-seo: config must include at least `name` and `url`.')
    process.exit(1)
  }

  const outputs = {
    'llms.txt':                 renderLlmsTxt(cfg),
    'llms-full.txt':            renderLlmsFull(cfg),
    'robots.txt':               renderRobots(cfg),
    'sitemap.xml':              renderSitemap(cfg),
    'humans.txt':               renderHumans(cfg),
    '.well-known/security.txt': renderSecurity(cfg),
    'head.jsonld.html':         renderJsonLd(cfg),
  }

  await mkdir(outDir, { recursive: true })
  await mkdir(join(outDir, '.well-known'), { recursive: true })

  const written = []
  for (const [rel, body] of Object.entries(outputs)) {
    await writeFile(join(outDir, rel), body)
    written.push(rel)
  }

  console.log('agent-seo: generated')
  for (const w of written) console.log('  ' + join(outDir, w))
  console.log('  ' + (cfg.tools || []).length + ' tools · ' + (cfg.faq || []).length + ' FAQ · ' + ((cfg.howto?.steps || []).length) + ' HowTo steps')
  console.log('\nnext: inline the contents of head.jsonld.html into your index.html <head>.')
}

main().catch(err => { console.error(err); process.exit(1) })
