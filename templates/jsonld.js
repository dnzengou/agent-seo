// JSON-LD @graph renderer. Returns a stringified HTML <script> block.
export function renderJsonLd(cfg) {
  const base   = cfg.url.replace(/\/$/, '')
  const orgId  = (cfg.publisher?.url || base) + '#org'
  const siteId = base + '/#site'
  const appId  = base + '/#app'

  const graph = []

  graph.push({
    '@type': 'Organization',
    '@id': orgId,
    name: cfg.publisher?.name || cfg.name,
    url:  cfg.publisher?.url  || base,
    ...(cfg.publisher?.logo ? { logo: cfg.publisher.logo } : {}),
    ...(cfg.publisher?.description ? { description: cfg.publisher.description } : {}),
    ...(cfg.publisher?.sameAs?.length ? { sameAs: cfg.publisher.sameAs } : {}),
  })

  graph.push({
    '@type': 'WebSite',
    '@id':   siteId,
    name:    cfg.name,
    url:     base + '/',
    publisher: { '@id': orgId },
    inLanguage: cfg.inLanguage || 'en',
    ...(cfg.searchParam ? {
      potentialAction: {
        '@type': 'SearchAction',
        target:  { '@type': 'EntryPoint', urlTemplate: `${base}/?${cfg.searchParam}={search_term_string}` },
        'query-input': 'required name=search_term_string',
      }
    } : {}),
  })

  graph.push({
    '@type': cfg.schemaType || 'SoftwareApplication',
    '@id':   appId,
    name:    cfg.name,
    ...(cfg.alternateNames?.length ? { alternateName: cfg.alternateNames } : {}),
    ...(cfg.applicationCategory ? { applicationCategory: cfg.applicationCategory } : {}),
    operatingSystem: cfg.operatingSystem || 'Web',
    url:    base + '/',
    description: cfg.description || cfg.tagline || '',
    offers: { '@type': 'Offer', price: String(cfg.priceValue ?? '0'), priceCurrency: cfg.priceCurrency || 'EUR', availability: 'https://schema.org/InStock' },
    ...(cfg.tools?.length ? { featureList: cfg.tools.map(t => t.label) } : {}),
    isAccessibleForFree: Number(cfg.priceValue ?? 0) === 0,
    author: { '@id': orgId },
    publisher: { '@id': orgId },
  })

  if (cfg.breadcrumbs?.length) {
    graph.push({
      '@type': 'BreadcrumbList',
      itemListElement: cfg.breadcrumbs.map((b, i) => ({
        '@type': 'ListItem', position: i + 1, name: b.name, item: b.url,
      })),
    })
  }

  if (cfg.faq?.length) {
    graph.push({
      '@type': 'FAQPage',
      mainEntity: cfg.faq.map(f => ({
        '@type': 'Question',
        name: f.q,
        acceptedAnswer: { '@type': 'Answer', text: f.a },
      })),
    })
  }

  if (cfg.howto) {
    graph.push({
      '@type': 'HowTo',
      name: cfg.howto.name,
      ...(cfg.howto.description ? { description: cfg.howto.description } : {}),
      ...(cfg.howto.totalTime ? { totalTime: cfg.howto.totalTime } : {}),
      ...(cfg.howto.cost ? { estimatedCost: { '@type': 'MonetaryAmount', currency: cfg.howto.cost.currency, value: String(cfg.howto.cost.value) } } : {}),
      ...(cfg.howto.tool ? { tool: [{ '@type': 'HowToTool', name: cfg.howto.tool.name, url: cfg.howto.tool.url }] } : {}),
      step: (cfg.howto.steps || []).map((s, i) => ({
        '@type': 'HowToStep', position: i + 1, name: s.name, text: s.text, ...(s.url ? { url: s.url } : {}),
      })),
    })
  }

  const doc = { '@context': 'https://schema.org', '@graph': graph }
  return '<script type="application/ld+json">\n' + JSON.stringify(doc, null, 2) + '\n</script>\n'
}
