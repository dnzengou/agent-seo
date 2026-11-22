// agent-seo robots.txt template.
// Returns a plain string. No deps.
export const AI_CRAWLERS = [
  'GPTBot', 'ChatGPT-User', 'OAI-SearchBot',
  'Google-Extended', 'Applebot-Extended',
  'PerplexityBot', 'Perplexity-User',
  'ClaudeBot', 'Claude-Web', 'Claude-SearchBot', 'anthropic-ai',
  'Amazonbot', 'Bytespider', 'Meta-ExternalAgent',
  'cohere-ai', 'YouBot', 'DuckAssistBot', 'MistralAI-User',
  'CCBot',
]

export function renderRobots({ url }) {
  const base = url.replace(/\/$/, '')
  const aiBlock = AI_CRAWLERS.map(ua => `User-agent: ${ua}\nAllow: /\n`).join('\n')
  return `User-agent: *
Allow: /

# AI assistants and research crawlers are welcome — see /llms.txt for a
# machine-readable summary, and /llms-full.txt for the detailed tool catalog.
${aiBlock}
Sitemap: ${base}/sitemap.xml
`
}
