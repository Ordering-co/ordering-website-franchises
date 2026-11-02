import React, { useState, useEffect } from 'react'
import { useTheme } from 'styled-components'

import {
  Container,
  Image,
  ButtonWrapper
} from './styles'

import { useLanguage } from '~components'
import { useOnlineStatus, Button } from '~ui'

export const NotNetworkConnectivity = (props) => {
  const [, t] = useLanguage()
  const onlineStatus = useOnlineStatus()
  const theme = useTheme()

  const errorImage = props.image || theme.images?.general?.notNetwork
  const [base64ImageString, setBase64ImageString] = useState(null)

  const getBase64ImageFromUrl = async (imageUrl) => {
    const response = await fetch(imageUrl)
    if (!response.ok) return null
    const blob = await response.blob()
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.addEventListener('load', function () {
        resolve(reader.result)
      }, false)
      reader.onerror = (error) => {
        return reject(error)
      }
      reader.readAsDataURL(blob)
    })
  }

  useEffect(() => {
    let active = true
    setBase64ImageString(null)
    if (!errorImage) return

    getBase64ImageFromUrl(errorImage).then(base64 => {
      if (active) setBase64ImageString(base64)
    }).catch(() => {
      // The offline message must work even when its optional image cannot load.
      if (active) setBase64ImageString(null)
    })

    return () => { active = false }
  }, [errorImage])

  return (
    <>
      <Container id='container' $isOnline={props.isOnline ?? onlineStatus}>
        <h1>{t('MOBILE_NO_INTERNET', 'No internet connection')}</h1>
        <p>{t('NETWORK_OFFLINE_MESSAGE', 'Your connection appears to be off-line. Try to refresh the page')}</p>
        <Image>
          {base64ImageString && (
            <img id='not-network' src={base64ImageString} alt='Not network' width='640' height='320' loading='lazy' />
          )}
        </Image>
        <ButtonWrapper>
          <Button
            color='primary'
            onClick={() => window.location.reload()}
          >
            {t('REFRESH', 'Refresh')}
          </Button>
        </ButtonWrapper>
      </Container>
    </>
  )
}

export default NotNetworkConnectivity
