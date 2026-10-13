import { cloneElement, useEffect, useState } from 'react'
import settings from '../../config'
import { parseJsonStorage } from '../../utils/parseJsonStorage'
const orderingSubdomains = ['tryordering.com', 'ordering.co', 'orderingplus.com']

export const SubdomainComponent = (props) => {
  const isOrderingSubdomain = orderingSubdomains.some(subdomain => window.location.hostname.includes(subdomain))
  const _language = parseJsonStorage(window.localStorage.getItem('language'))

  const [project, setProject] = useState(settings?.use_project_domain ? null : (window.localStorage.getItem('project') ?? settings.project ?? null))
  const [localLanguage] = useState(settings?.use_project_domain ? _language?.code : settings.api.language)

  useEffect(() => {
    const getProjectStatus = async () => {
      const { url, language, version } = settings.api
      const projectFromSubdomain = window.location.hostname.split('.').slice(0, 1).join().replace(/^v\d+-/, '')
      let project = window.localStorage.getItem('project') ?? settings?.project ?? null

      if (settings?.use_project_subdomain && isOrderingSubdomain) {
        project = projectFromSubdomain
      }
      if (settings?.use_project_domain && !isOrderingSubdomain) {
        project = '_'
      }

      try {
        const response = await fetch(`${url}/${version}/${language}/${project}/current`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json'
          }
        })

        const { error, result } = await response.json()

        project = !error ? result?.code : settings?.project
        if (error) {
          window.open(settings?.project_error_redirect_url, '_self')
        }
        setProject(project)
      } catch (error) {
        setProject(project ?? settings?.project)
      }
    }

    if (settings?.use_project_domain) {
      getProjectStatus()
    }
  }, [])

  return (
    cloneElement(props.children, {
      settings: {
        ...settings,
        api: {
          ...settings.api,
          language: localLanguage
        },
        project
      }
    })
  )
}
