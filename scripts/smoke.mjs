#!/usr/bin/env node
// Smoke test — generate against example.config.json, verify every output.
import { readFile, mkdtemp, rm } from 'node:fs/promises'
import { existsSync } from 'node:fs'
import { spawn } from 'node:child_process'
import { tmpdir } from 'node:os'
import { join, dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const here = dirname(fileURLToPath(import.meta.url))
const ROOT = resolve(here, '..')

const EXPECTED = [
  'llms.txt', 'llms-full.txt', 'robots.txt', 'sitemap.xml',
  'humans.txt', '.well-known/security.txt', 'head.jsonld.html',
]

async function main() {
  const out = await mkdtemp(join(tmpdir(), 'agent-seo-smoke-'))
  const cfg = join(ROOT, 'example.config.json')

  await new Promise((ok, fail) => {
    const p = spawn(process.execPath, [join(ROOT, 'scripts', 'generate.mjs'), cfg, out], { stdio: 'inherit' })
    p.on('exit', code => code === 0 ? ok() : fail(new Error('generate exit ' + code)))
  })

  for (const rel of EXPECTED) {
    const full = join(out, rel)
    if (!existsSync(full)) throw new Error('missing output: ' + rel)
    const body = await readFile(full, 'utf8')
    if (!body.length) throw new Error('empty output: ' + rel)
  }

  const robots = await readFile(join(out, 'robots.txt'), 'utf8')
  if (!/^User-agent: GPTBot$/m.test(robots))       throw new Error('robots.txt missing GPTBot allow')
  if (!/^User-agent: ClaudeBot$/m.test(robots))    throw new Error('robots.txt missing ClaudeBot allow')
  if (!/^User-agent: PerplexityBot$/m.test(robots)) throw new Error('robots.txt missing PerplexityBot allow')

  const jsonld = await readFile(join(out, 'head.jsonld.html'), 'utf8')
  if (!jsonld.includes('"@type": "FAQPage"'))             throw new Error('jsonld missing FAQPage')
  if (!jsonld.includes('"@type": "HowTo"'))               throw new Error('jsonld missing HowTo')
  if (!jsonld.includes('"@type": "BreadcrumbList"'))      throw new Error('jsonld missing BreadcrumbList')
  if (!jsonld.includes('"@type": "SoftwareApplication"')) throw new Error('jsonld missing SoftwareApplication')

  await rm(out, { recursive: true, force: true })
  console.log('smoke: OK (' + EXPECTED.length + ' files, 7 schema types validated)')
}

main().catch(err => { console.error('smoke FAIL:', err.message); process.exit(1) })
