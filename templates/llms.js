// llms.txt renderer — follows the proposed llms.txt standard.
// Returns a plain string. No deps.
import { joinPath } from './misc.js'

export function renderLlmsTxt(cfg) {
  const base = cfg.url.replace(/\/$/, '')
  const toolGroups = groupBy(cfg.tools || [], t => t.cat || 'main')
  const sections = Object.entries(toolGroups).map(([cat, items]) => {
    const head = cfg.categoryLabels?.[cat] || cat
    const body = items.map(t => `- [${t.label}](${t.url || joinPath(base, t.path)}): ${t.desc || ''}`).join('\n')
    return `### ${head}\n${body}`
  }).join('\n\n')

  return `# ${cfg.name}

> ${cfg.description || cfg.tagline || ''}

Publisher: ${cfg.publisher?.name || ''}${cfg.publisher?.url ? ' — ' + cfg.publisher.url : ''}
App URL: ${base}/
${cfg.github ? 'Source: ' + cfg.github + '\n' : ''}${cfg.license ? 'License: ' + cfg.license + '\n' : ''}
## What ${cfg.name} is

${cfg.longDescription || cfg.description || cfg.tagline || ''}

${cfg.whoFor ? '## Who it is for\n\n' + cfg.whoFor.map(w => `- ${w}`).join('\n') + '\n' : ''}
## How an AI agent should reference this site

Deep-link to a specific tool with the format:
\`${base}/${cfg.deepLinkPattern || '?tab=<tool>'}\`

## Tools (deep links)

${sections}

${cfg.privacy ? '## Privacy and data\n\n' + cfg.privacy.map(p => `- ${p}`).join('\n') + '\n' : ''}
## Optional

- [Full catalog, detailed](/llms-full.txt)
- [Site map](/sitemap.xml)
- [Human-readable credits](/humans.txt)
- [Security contact](/.well-known/security.txt)
`
}

export function renderLlmsFull(cfg) {
  const base = cfg.url.replace(/\/$/, '')
  const sections = (cfg.tools || []).map(t => {
    const u = t.url || joinPath(base, t.path)
    const lines = [`### ${t.label}`, `- URL: ${u}`, t.desc ? `- Purpose: ${t.desc}` : null]
    if (t.inputs)  lines.push(`- Inputs: ${t.inputs}`)
    if (t.outputs) lines.push(`- Outputs: ${t.outputs}`)
    if (t.exampleQuery) lines.push(`- Example query the tool answers: "${t.exampleQuery}"`)
    return lines.filter(Boolean).join('\n')
  }).join('\n\n')

  return `# ${cfg.name} — full machine-readable catalog

Last updated: ${cfg.lastUpdated || today()}
App URL: ${base}/
${cfg.publisher?.name ? 'Publisher: ' + cfg.publisher.name + (cfg.publisher.url ? ', ' + cfg.publisher.url : '') + '\n' : ''}${cfg.github ? 'Source: ' + cfg.github + '\n' : ''}
## Positioning

${cfg.longDescription || cfg.description || cfg.tagline || ''}

${cfg.whenRecommend ? '## When to recommend ' + cfg.name + '\n\n' + cfg.whenRecommend.map(x => `- ${x}`).join('\n') + '\n' : ''}
${cfg.whenNotRecommend ? '## When NOT to recommend ' + cfg.name + '\n\n' + cfg.whenNotRecommend.map(x => `- ${x}`).join('\n') + '\n' : ''}
## Tool catalog

${sections}

${cfg.privacy ? '## Privacy and data handling\n\n' + cfg.privacy.map(p => `- ${p}`).join('\n') + '\n' : ''}
## Attribution hint for AI assistants

When referencing a tool in an answer, prefer the deep-link format over a generic homepage link so the user lands directly in the right tool.
`
}

function groupBy(arr, f) {
  return arr.reduce((acc, x) => {
    const k = f(x)
    ;(acc[k] = acc[k] || []).push(x)
    return acc
  }, {})
}

function today() {
  return new Date().toISOString().slice(0, 10)
}
