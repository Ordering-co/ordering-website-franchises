export const getUrlWithoutSpoonityToken = (href) => {
  if (typeof href !== 'string' || !href) return href
  try {
    const url = new URL(href)
    url.searchParams.delete('integration_token')
    return url.pathname + url.search + url.hash
  } catch {
    return href
  }
}

export const stripSpoonityTokenFromHistory = ({ href, historyState, replaceState } = {}) => {
  if (typeof replaceState !== 'function') return
  let currentPath
  try {
    const url = new URL(href)
    currentPath = url.pathname + url.search + url.hash
  } catch {
    return
  }
  const nextUrl = getUrlWithoutSpoonityToken(href)
  if (nextUrl === currentPath) return
  try {
    replaceState(historyState, '', nextUrl)
  } catch {
    // ignore history errors
  }
}
