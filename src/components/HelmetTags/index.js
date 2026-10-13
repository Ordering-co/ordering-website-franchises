import React, { useEffect } from 'react'
import { Helmet } from 'react-helmet'
import { useTheme } from 'styled-components'
import helmetData from '../../helmetdata.json'
import { useConfig } from '~components'
import {
  getSeoInjected,
  resolveHelmetDescription,
  resolveHelmetTitle,
  shouldRenderEnvOgTag
} from '../../utils/helmetSeo'

const orderingSubdomains = ['tryordering.com', 'ordering.co', 'orderingplus.com']

const isOrderingHost = () => {
  if (typeof window === 'undefined') return false
  return orderingSubdomains.some(subdomain => window.location.hostname.includes(subdomain))
}

export const HelmetTags = (props) => {
  const { page } = props

  const theme = useTheme()
  const [{ configs }] = useConfig()

  const metaTag = (page && helmetData[page]) ? helmetData[page] : helmetData.app
  const seoInjected = typeof window !== 'undefined'
    ? getSeoInjected(window.__SEO__, window.location.pathname)
    : null

  /** react-helmet must not receive Fragment children — it stringifies element.type (Symbol for <>). */
  const ogTitle = String(import.meta.env.VITE_OG_TITLE ?? '').trim()
  const ogDescription = String(import.meta.env.VITE_OG_DESCRIPTION ?? '').trim()
  const ogUrl = String(import.meta.env.VITE_OG_URL ?? '').trim()
  const ogSiteName = String(import.meta.env.VITE_OG_SITE_NAME ?? '').trim()
  const ogImage = String(import.meta.env.VITE_OG_IMAGE ?? '').trim()

  useEffect(() => {
    if (!theme?.third_party_code?.head) return

    const tempDiv = document.createElement('div')
    tempDiv.innerHTML = theme.third_party_code.head

    const scripts = tempDiv.querySelectorAll('script')
    scripts.forEach(script => {
      const scriptExists = [...document.head.querySelectorAll('script')].some(existingScript => {
        if (script.src && existingScript.src === script.src) {
          return true
        }

        if (!script.src && existingScript.innerHTML === script.innerHTML) {
          return true
        }

        return false
      })
      if (!scriptExists) {
        const newScript = document.createElement('script')
        if (script.src) {
          newScript.src = script.src
        } else {
          newScript.innerHTML = script.innerHTML
        }
        document.head.appendChild(newScript)
      }
    })
  }, [theme?.third_party_code?.head])

  const noscriptContent = (() => {
    if (!theme?.third_party_code?.head) return ''
    const tempDiv = document.createElement('div')
    tempDiv.innerHTML = theme.third_party_code.head
    const noscript = tempDiv.querySelector('noscript')
    return noscript ? noscript.innerHTML : ''
  })()

  const siteName = theme?.my_products?.components?.website_settings?.components?.values?.name
  const siteDescription = theme?.my_products?.components?.website_settings?.components?.values?.description
  const {
    canRenderTitle,
    isWhiteLabel,
    titleTemplate,
    titleInner
  } = resolveHelmetTitle({
    page,
    siteName,
    configs,
    helmetMetaTags: props.helmetMetaTags,
    seoInjected,
    helmetDataTitle: metaTag.title
  })
  const description = resolveHelmetDescription({
    siteDescription,
    helmetMetaTags: props.helmetMetaTags,
    seoInjected,
    helmetDataDescription: metaTag.description,
    configs
  })
  const robotsContent = isOrderingHost()
    ? 'noindex, nofollow'
    : (props.robots || metaTag?.robots)

  return (
    <Helmet titleTemplate={titleTemplate}>
      {canRenderTitle && (
        <title id={`route-${page || 'app'}`}>
          {titleInner}
        </title>
      )}
      {canRenderTitle && (
        <meta
          name='description'
          content={description}
        />
      )}
      <meta name='keywords' content={String(props.helmetMetaTags?.keywords ?? metaTag.keywords ?? '')} />
      {robotsContent && <meta name='robots' content={robotsContent} />}
      {props.canonicalUrl
        ? (
        <link rel='canonical' href={props.canonicalUrl} />
          )
        : (
            metaTag.canonicalUrl && <link rel='canonical' href={metaTag.canonicalUrl} />
          )}
      {noscriptContent && (
        <noscript>{noscriptContent}</noscript>
      )}
      {shouldRenderEnvOgTag(ogTitle, isWhiteLabel) && <meta property='og:title' content={ogTitle} />}
      {shouldRenderEnvOgTag(ogDescription, isWhiteLabel) && <meta property='og:description' content={ogDescription} />}
      {ogUrl && <meta property='og:url' content={ogUrl} />}
      {shouldRenderEnvOgTag(ogSiteName, isWhiteLabel) && <meta property='og:site_name' content={ogSiteName} />}
      {ogImage && <meta property='og:image' content={ogImage} />}
      {ogImage && <meta property='og:image:type' content='image/png' />}
    </Helmet>
  )
}

export default HelmetTags
