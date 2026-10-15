import React, { cloneElement, useEffect, useState } from 'react'
import settings, { selectedProjectSettings, setRuntimeFranchise } from '../../config'
import { resolveLocalFranchise, resolveLocalCatalogueOptions } from '../../utils/localProject'
import { parseJsonStorage } from '../../utils/parseJsonStorage'
const orderingSubdomains = ['tryordering.com', 'ordering.co', 'orderingplus.com']

export const SubdomainComponent = (props) => {
  const isOrderingSubdomain = orderingSubdomains.some(subdomain => window.location.hostname.includes(subdomain))
  const _language = settings.localProjectPinned && settings.localStorageError ? null : parseJsonStorage(window.localStorage.getItem('language'))

  const [project, setProject] = useState(settings.localProjectPinned ? settings.project : (settings?.use_project_domain ? null : (window.localStorage.getItem('project') ?? settings.project ?? null)))
  const [localLanguage] = useState(settings?.use_project_domain ? _language?.code : settings.api.language)

  const [localSetup, setLocalSetup] = useState('validating')

  useEffect(() => {
    if (settings.localProjectPinned) {
      if (!selectedProjectSettings.project || selectedProjectSettings.project === 'your-project' || !selectedProjectSettings.franchiseSlug) return
      if (settings.localStorageError) {
        setLocalSetup('local_storage_cannot_be_scoped')
        return
      }
      const controller = new AbortController()
      const timeout = setTimeout(() => {
        setLocalSetup('validation_timed_out')
        controller.abort()
      }, 20000)
      Promise.all([
        resolveLocalFranchise(selectedProjectSettings, fetch, controller.signal),
        resolveLocalCatalogueOptions(selectedProjectSettings, fetch, controller.signal)
      ]).then(([selection, catalogueOptions]) => {
        if (controller.signal.aborted) return
        clearTimeout(timeout)
        setRuntimeFranchise(selection, catalogueOptions)
        setLocalSetup('ready')
      }).catch(error => {
        clearTimeout(timeout)
        if (!controller.signal.aborted) setLocalSetup(error.message)
      })
      return () => { clearTimeout(timeout); controller.abort() }
    }
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

    if (!settings.localProjectPinned && settings?.use_project_domain) {
      getProjectStatus()
    }
  }, [])

  if (settings.localProjectPinned && (!selectedProjectSettings.project || selectedProjectSettings.project === 'your-project' || !selectedProjectSettings.franchiseSlug)) {
    return (
      <main role='alert' style={{ padding: '2rem', fontFamily: 'sans-serif' }}>
        <h1>Configure your franchise storefront</h1>
        <p>Select your Ordering project and an enabled franchise before starting.</p>
        <pre>pnpm setup:configure --project YOUR_PROJECT --franchise-slug YOUR_FRANCHISE</pre>
        <p>Read setup.md, then restart pnpm start.</p>
      </main>
    )
  }

  if (settings.localProjectPinned && localSetup !== 'ready') {
    return (
      <main role='status' style={{ padding: '2rem', fontFamily: 'sans-serif' }}>
        <h1>{localSetup === 'validating' ? 'Checking your selected franchise' : 'Unable to open your selected franchise'}</h1>
        <p>{localSetup === 'validating' ? 'Validating the project and franchise before loading the storefront.' : 'Run pnpm setup:doctor, check browser storage access and restart this storefront. Your existing browser data has been preserved.'}</p>
      </main>
    )
  }

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
