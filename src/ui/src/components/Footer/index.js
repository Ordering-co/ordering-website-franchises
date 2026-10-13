import React, { useState, useEffect } from 'react'
import { useTheme } from 'styled-components'

import { Container, PoweredByOrdering } from './styles'
import { useApi, useConfig, useLanguage } from '~components'
import { shouldShowPoweredByForClient } from '~/utils/poweredByVisibility'

const archiesColombiaProject = 'archiescolombia'

export const Footer = ({ isFooterPage }) => {
  const [footerState, setfooterState] = useState({ body: null, loading: false, error: null })
  const [ordering] = useApi()
  const theme = useTheme()
  const requestsState = {}
  const [{ configs }] = useConfig()
  const [languageState, t] = useLanguage()
  const footerContent = theme?.my_products?.components?.theme_settings?.components?.values?.footer_content
  const enabledPoweredByOrdering = shouldShowPoweredByForClient(configs)
  const isArchiesColombia = String(ordering?.project || '').trim().toLowerCase() === archiesColombiaProject

  const getPage = async () => {
    setfooterState({ ...footerState, loading: true })
    try {
      const source = {}
      requestsState.page = source
      const languageCode = languageState?.language?.code

      if (languageCode) {
        const { content: { error: langError, result: langResult } } = await ordering
          .pages(`footer_${languageCode}`)
          .get({ cancelToken: source })

        if (!langError && langResult?.body && langResult?.enabled) {
          setfooterState({ ...footerState, loading: false, body: langResult.body })
          return
        }
      }

      if (footerContent) {
        setfooterState({ ...footerState, loading: false, body: null, useThemeContent: true })
        return
      }

      const { content: { error, result } } = await ordering.pages('footer').get({ cancelToken: source })
      if (!error && result?.body) {
        setfooterState({ ...footerState, loading: false, body: result.body })
      } else if (error) {
        setfooterState({ ...footerState, loading: false, error: result })
      }
    } catch (err) {
      if (err.constructor.name !== 'Cancel') {
        setfooterState({ ...footerState, loading: false, error: [err.message] })
      }
    }
  }

  useEffect(() => {
    getPage()
    return () => {
      if (requestsState.page) {
        requestsState.page?.cancel?.()
      }
    }
  }, [languageState?.language?.code])

  const displayContent = footerState.body || (footerState.useThemeContent && footerContent)

  return (
    <Container>
      {
        (displayContent && !isFooterPage) && (
          <div
            style={{ wordBreak: 'break-all', padding: '0px 10px' }}
            dangerouslySetInnerHTML={{
              __html: displayContent
            }}
          />
        )
      }
      {enabledPoweredByOrdering && (
        <PoweredByOrdering $subtleLink={isArchiesColombia}>
          {t('POWERED_BY', 'Powered by')}
          <a
            href='https://www.orderingplus.com/'
            target='_blank'
            rel='noopener noreferrer'
          >
            {' '}{t('ORDERING_PLUS', 'OrderingPlus')}
          </a>
        </PoweredByOrdering>
      )}
    </Container>
  )
}

export default Footer
