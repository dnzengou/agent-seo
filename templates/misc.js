export function renderSitemap(cfg) {
  const base = cfg.url.replace(/\/$/, '')
  const today = cfg.lastUpdated || new Date().toISOString().slice(0, 10)
  const urls = [{ loc: base + '/', priority: '1.0', changefreq: 'weekly' }]
  for (const t of cfg.tools || []) {
    const u = t.url || joinPath(base, t.path)
    urls.push({ loc: u, priority: t.priority || '0.9' })
  }
  const items = urls.map(u =>
    `  <url><loc>${escape(u.loc)}</loc><lastmod>${today}</lastmod>${u.changefreq ? `<changefreq>${u.changefreq}</changefreq>` : ''}<priority>${u.priority}</priority></url>`
  ).join('\n')
  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${items}
</urlset>
`
}

export function joinPath(base, path) {
  if (!path) return base + '/'
  if (/^https?:\/\//.test(path)) return path
  if (path.startsWith('/')) return base + path
  return base + '/' + path
}

export function renderHumans(cfg) {
  return `/* humans.txt — credits and site metadata */

/* TEAM */
${cfg.publisher?.name ? 'Studio: ' + cfg.publisher.name + '\n' : ''}${cfg.publisher?.url ? 'Site:   ' + cfg.publisher.url + '\n' : ''}${cfg.github ? 'Source: ' + cfg.github + '\n' : ''}
/* SITE */
Last update: ${cfg.lastUpdated || new Date().toISOString().slice(0, 7)}
Language:    ${cfg.inLanguage || 'English'}
${cfg.stack ? 'Stack:       ' + cfg.stack + '\n' : ''}${cfg.standards ? 'Standards:   ' + cfg.standards + '\n' : ''}`
}

export function renderSecurity(cfg) {
  const exp = cfg.securityExpires || nextYearEnd()
  const contacts = (cfg.securityContacts || []).map(c => 'Contact: ' + c).join('\n')
  return `${contacts}
Expires: ${exp}
Preferred-Languages: en
Canonical: ${cfg.url.replace(/\/$/, '')}/.well-known/security.txt
${cfg.securityPolicy ? 'Policy: ' + cfg.securityPolicy : ''}
`
}

function nextYearEnd() {
  const d = new Date()
  d.setFullYear(d.getFullYear() + 1, 11, 31)
  return d.toISOString().split('.')[0] + '.000Z'
}

function escape(s) {
  return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')
}
