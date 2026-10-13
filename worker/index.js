import {
  mapSeoEndpoint,
  fetchSeo,
  fetchSitemap,
  fetchFirstLoad,
  getTitle,
  escapeJsonForScript,
  deriveProjectFromHost,
  validateProjectViaCurrent,
  isOrderingHost,
  isConfiguredBrandAsset,
  resolveTenantFaviconUrl,
  WHITE_LABEL_LOGO
} from './seo.js'
import { sanitizeRouterCacheKey } from './sanitizeRouterCacheKey.js'
import {
  applyPoweredByDisableToFirstLoad,
  applyWhiteLabelDocumentTitle,
  resolveWorkerDisablePoweredBy,
  stripPoweredByFromTitle
} from './poweredByFirstPaint.js'
import { sanitizeWhiteLabelText } from '../src/utils/helmetSeo.js'

const ASSET_EXTENSIONS = /\.(js|css|map|svg|png|jpe?g|webp|gif|ico|woff2?|ttf|eot|json|txt|xml|mp4|webm|avif)$/i

/** Prefix public assets with the persisted deployment base. */
const defaultAssetPath = (env, path) => {
  const raw = String(
    env?.ASSET_BASE_PATH ||
    env?.ASSET_BASE_URL ||
    env?.VITE_ASSET_BASE ||
    env?.VITE_ASSET_BASE_URL ||
    ''
  ).trim().replace(/\/$/, '')
  const p = path.startsWith('/') ? path : `/${path}`
  return raw ? `${raw}${p}` : p
}

let cachedBaseConfig = null

const resolveBoolEnv = (value, fallback) => {
  if (typeof value === 'boolean') return value
  if (typeof value !== 'string') return fallback
  const v = value.trim().toLowerCase()
  if (v === 'true' || v === '1') return true
  if (v === 'false' || v === '0') return false
  return fallback
}

const loadBaseConfig = async (env, origin) => {
  if (cachedBaseConfig) return cachedBaseConfig

  let baseConfig = {}
  try {
    const request = new Request(new URL('/config.json', origin).toString())
    const response = await env.ASSETS.fetch(request)
    if (response.ok) {
      baseConfig = await response.json()
    }
  } catch (_) {}

  const merged = {
    ...baseConfig,
    app_id: env.APP_ID || baseConfig.app_id,
    api: {
      url: env.API_URL || baseConfig.api?.url,
      version: env.API_VERSION || baseConfig.api?.version,
      language: env.API_LANGUAGE || baseConfig.api?.language
    },
    use_project_subdomain: resolveBoolEnv(env.USE_PROJECT_SUBDOMAIN, baseConfig.use_project_subdomain),
    use_project_domain: resolveBoolEnv(env.USE_PROJECT_DOMAIN, baseConfig.use_project_domain)
  }

  if (!merged.api.url) return null

  cachedBaseConfig = merged
  return cachedBaseConfig
}

const isPreviewHost = (hostname) => {
  if (!hostname) return false
  return hostname.endsWith('.workers.dev') || hostname === 'localhost' || hostname.startsWith('127.0.0.1')
}

const resolveConfigForRequest = async (env, ctx, hostname, baseConfig, origin, requestUrl) => {
  if (isPreviewHost(hostname)) {
    const fallbackProject = env.PROJECT || baseConfig?.project
    if (!fallbackProject) return null
    return { ...baseConfig, project: fallbackProject }
  }

  let project = deriveProjectFromHost(hostname, baseConfig)
  if (env.PROJECT && !project) project = env.PROJECT

  if (baseConfig?.use_project_domain) {
    project = await validateProjectViaCurrent(baseConfig, project, env, ctx, origin, requestUrl)
  }

  if (!project) project = env.PROJECT || baseConfig?.project
  if (!project) return null

  return { ...baseConfig, project }
}

const isHtmlRequest = (request, url) => {
  if (ASSET_EXTENSIONS.test(url.pathname)) return false
  const accept = request.headers.get('accept') || ''
  if (!accept.includes('text/html') && !accept.includes('*/*') && accept !== '') return false
  return true
}

const removedMetasHandler = {
  element (element) {
    element.remove()
  }
}

const buildInjectionHandler = (seoData, firstLoad, runtimeConfig, pageSpecificSeo, shouldNoindex) => ({
  element (element) {
    if (shouldNoindex) {
      element.append('<meta name="robots" content="noindex, nofollow">', { html: true })
    }

    if (runtimeConfig) {
      const payload = escapeJsonForScript(runtimeConfig)
      element.append(`<script>window.__CONFIG__ = ${payload};</script>`, { html: true })
    }

    if (firstLoad) {
      const payload = escapeJsonForScript(firstLoad)
      element.append(`<script>window.__FIRST_LOAD__ = ${payload};</script>`, { html: true })
    }

    if (pageSpecificSeo) {
      const payload = escapeJsonForScript(pageSpecificSeo)
      element.append(`<script>window.__SEO__ = ${payload};</script>`, { html: true })
    }

    if (seoData?.metas && Array.isArray(seoData.metas)) {
      for (const meta of seoData.metas) {
        if (!meta || typeof meta.content === 'undefined' || meta.content === null) continue
        const content = String(meta.content)
        if (meta.name && meta.name !== 'title') {
          element.append(`<meta name="${escapeAttr(meta.name)}" content="${escapeAttr(content)}">`, { html: true })
        } else if (meta.property) {
          element.append(`<meta property="${escapeAttr(meta.property)}" content="${escapeAttr(content)}">`, { html: true })
        }
      }
    }

    if (seoData?.links && Array.isArray(seoData.links)) {
      let faviconIdAssigned = false
      for (const link of seoData.links) {
        if (!link || typeof link !== 'object' || !link.rel || !link.href) continue
        const linkWithId = (!faviconIdAssigned && link.rel === 'icon' && !link.id)
          ? { ...link, id: 'favicon' }
          : link
        if (linkWithId.id === 'favicon') faviconIdAssigned = true
        const attrs = Object.entries(linkWithId)
          .filter(([, v]) => v !== null && typeof v !== 'undefined' && typeof v !== 'object')
          .map(([k, v]) => `${escapeAttr(k)}="${escapeAttr(String(v))}"`)
          .join(' ')
        element.append(`<link ${attrs}>`, { html: true })
      }
    }
  }
})

const escapeAttr = (value) => String(value)
  .replace(/&/g, '&amp;')
  .replace(/"/g, '&quot;')
  .replace(/</g, '&lt;')
  .replace(/>/g, '&gt;')

const isSafeRel = (rel) => /^[a-zA-Z0-9_-]+$/.test(rel)

const titleHandler = (newTitle) => ({
  element (element) {
    element.setInnerContent(newTitle)
  }
})

export default {
  async fetch (request, env, ctx) {
    const url = new URL(request.url)

    if (url.pathname === '/sitemap.xml') {
      const sitemapBaseConfig = await loadBaseConfig(env, url.origin)
      const sitemapConfig = sitemapBaseConfig
        ? await resolveConfigForRequest(env, ctx, url.hostname, sitemapBaseConfig, url.origin, request.url)
        : null
      const sitemap = sitemapConfig ? await fetchSitemap(sitemapConfig, env, ctx) : null

      if (!sitemap) {
        return new Response('Sitemap temporarily unavailable', {
          status: 503,
          headers: {
            'content-type': 'text/plain; charset=UTF-8',
            'cache-control': 'no-store'
          }
        })
      }

      return new Response(sitemap.xml, {
        headers: {
          'content-type': 'text/xml; charset=UTF-8',
          'cache-control': `public, max-age=${sitemap.ttl}, s-maxage=${sitemap.ttl}`
        }
      })
    }

    if (!isHtmlRequest(request, url)) {
      return env.ASSETS.fetch(request)
    }

    const baseConfig = await loadBaseConfig(env, url.origin)
    if (!baseConfig) {
      return env.ASSETS.fetch(request)
    }

    const config = await resolveConfigForRequest(env, ctx, url.hostname, baseConfig, url.origin, request.url)
    if (!config) {
      return env.ASSETS.fetch(request)
    }

    const seoPath = mapSeoEndpoint(url.pathname, url.searchParams)
    const routerCacheKey = sanitizeRouterCacheKey(request.headers.get('x-router-first-load-cache-key'), url.origin)

    const firstLoad = await fetchFirstLoad(config, env, ctx, url.origin, request.url, routerCacheKey)

    const seoConfig = firstLoad?.site?.code
      ? { ...config, app_id: firstLoad.site.code }
      : config

    const disablePoweredBy = resolveWorkerDisablePoweredBy(
      resolveBoolEnv(env.DISABLE_POWERED_BY, false),
      firstLoad
    )
    let processedFirstLoad = applyPoweredByDisableToFirstLoad(firstLoad, disablePoweredBy)

    const websiteThemeComponents = processedFirstLoad?.theme?.my_products?.components?.website_theme?.components
    const officialOrderingHost = isOrderingHost(url.hostname)
    const defaultLogoUrl = defaultAssetPath(env, WHITE_LABEL_LOGO)
    if (!officialOrderingHost && defaultLogoUrl && processedFirstLoad?.theme?.my_products?.components?.images?.components) {
      const imagesComponents = processedFirstLoad.theme.my_products.components.images.components
      const currentLogo = imagesComponents?.logo?.components?.image
      const currentLogoMobile = imagesComponents?.logo_mobile?.components?.image
      if (!isConfiguredBrandAsset(currentLogo) || !isConfiguredBrandAsset(currentLogoMobile)) {
        processedFirstLoad = {
          ...processedFirstLoad,
          theme: {
            ...processedFirstLoad.theme,
            my_products: {
              ...processedFirstLoad.theme.my_products,
              components: {
                ...processedFirstLoad.theme.my_products.components,
                images: {
                  ...processedFirstLoad.theme.my_products.components.images,
                  components: {
                    ...imagesComponents,
                    logo: isConfiguredBrandAsset(currentLogo)
                      ? imagesComponents.logo
                      : { ...(imagesComponents.logo || {}), components: { ...((imagesComponents.logo && imagesComponents.logo.components) || {}), image: defaultLogoUrl } },
                    logo_mobile: isConfiguredBrandAsset(currentLogoMobile)
                      ? imagesComponents.logo_mobile
                      : { ...(imagesComponents.logo_mobile || {}), components: { ...((imagesComponents.logo_mobile && imagesComponents.logo_mobile.components) || {}), image: defaultLogoUrl } }
                  }
                }
              }
            }
          }
        }
      }
    }

    const seoData = await fetchSeo(seoConfig, seoPath, env, ctx, url.hostname)

    const response = await env.ASSETS.fetch(request)

    const contentType = response.headers.get('content-type') || ''
    if (!contentType.includes('text/html')) {
      return response
    }

    const siteId = firstLoad?.site?.id
    const themeFranchiseId = websiteThemeComponents?.franchise_id ?? null

    const runtimeConfig = {
      project: seoConfig.project,
      app_id: seoConfig.app_id,
      site_id: siteId,
      api: seoConfig.api,
      use_project_subdomain: seoConfig.use_project_subdomain,
      use_project_domain: seoConfig.use_project_domain,
      disable_powered_by: disablePoweredBy,
      ...(themeFranchiseId !== null && { franchiseSlug: themeFranchiseId })
    }

    const siteName = processedFirstLoad?.theme?.my_products?.components?.website_settings?.components?.values?.name
    const seoTitle = applyWhiteLabelDocumentTitle(
      stripPoweredByFromTitle(getTitle(seoData), disablePoweredBy),
      { disable: disablePoweredBy, siteName }
    )
    const pageSpecificTitle = seoPath !== '/seo/general' && seoTitle && seoTitle !== siteName ? seoTitle : null
    const rawDescription = Array.isArray(seoData?.metas)
      ? seoData.metas.find(meta => meta?.name === 'description')?.content
      : null
    const pageSpecificDescription = seoPath !== '/seo/general' && rawDescription
      ? sanitizeWhiteLabelText(rawDescription, disablePoweredBy)
      : null
    const pageSpecificSeo = pageSpecificTitle || pageSpecificDescription
      ? {
          title: pageSpecificTitle,
          description: pageSpecificDescription,
          pathname: url.pathname
        }
      : null
    const newTitle = seoTitle

    const themeFavicon = processedFirstLoad?.theme?.general?.components?.favicon?.components?.image
    const resolvedFavicon = resolveTenantFaviconUrl(
      themeFavicon,
      processedFirstLoad?.site?.logo,
      url.hostname
    )
    const fallbackFaviconUrl = isConfiguredBrandAsset(resolvedFavicon)
      ? resolvedFavicon
      : defaultAssetPath(env, resolvedFavicon)
    const faviconRels = new Set(['icon', 'shortcut-icon', 'apple-touch-icon'])
    const seoLinks = [...(seoData?.links || [])]
    let enrichedLinks = seoLinks.filter(link =>
      !faviconRels.has(String(link?.rel)) || isConfiguredBrandAsset(link?.href)
    )
    const configuredIcon = enrichedLinks.find(l => l && String(l.rel) === 'icon' && l.href)
    const tenantFaviconUrl = configuredIcon?.href || fallbackFaviconUrl
    if (!configuredIcon && tenantFaviconUrl) {
      enrichedLinks = [
        ...enrichedLinks,
        { rel: 'icon', type: 'image/png', sizes: '32x32', href: tenantFaviconUrl, id: 'favicon' },
        { rel: 'shortcut-icon', type: 'image/png', href: tenantFaviconUrl },
        { rel: 'apple-touch-icon', type: 'image/png', href: tenantFaviconUrl }
      ]
    }
    const enrichedSeoData = seoData && typeof seoData === 'object'
      ? { ...seoData, links: enrichedLinks }
      : { links: enrichedLinks }

    const linkRels = new Set(
      (enrichedSeoData?.links || [])
        .map(l => l?.rel)
        .filter(r => typeof r === 'string' && isSafeRel(r))
    )

    const shouldNoindex = isOrderingHost(url.hostname)

    const rewriter = new HTMLRewriter()
      .on('meta[name="description"]', removedMetasHandler)
      .on('meta[name="author"]', removedMetasHandler)
      .on('meta[name="generator"]', removedMetasHandler)
      .on('meta[property^="og:"]', removedMetasHandler)
      .on('meta[name^="og:"]', removedMetasHandler)
      .on('meta[name^="twitter:"]', removedMetasHandler)
      .on('head', buildInjectionHandler(enrichedSeoData, processedFirstLoad, runtimeConfig, pageSpecificSeo, shouldNoindex))

    if (shouldNoindex) {
      rewriter.on('meta[name="robots"]', removedMetasHandler)
    }

    for (const rel of linkRels) {
      rewriter.on(`link[rel="${rel}"]`, removedMetasHandler)
    }

    if (newTitle) {
      rewriter.on('title', titleHandler(newTitle))
    }

    const transformed = rewriter.transform(response)
    const finalResponse = new Response(transformed.body, transformed)
    finalResponse.headers.set('cache-control', 'private, no-store, no-cache, must-revalidate, max-age=0')
    finalResponse.headers.set('cdn-cache-control', 'no-store')
    finalResponse.headers.set('X-Debug-Config-Resolved', config ? 'yes' : 'no')
    finalResponse.headers.set('X-Debug-Project', config?.project || 'none')
    finalResponse.headers.set('X-Debug-FirstLoad-Fetched', firstLoad ? 'yes' : 'no')
    finalResponse.headers.set('X-Debug-Hostname', url.hostname)
    return finalResponse
  }
}
