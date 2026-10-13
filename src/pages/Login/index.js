import React from 'react'
import { useParams } from 'react-router-dom'

import { HelmetTags } from '../../components/HelmetTags'

import { LoginContainer } from './styles'

import { LoginGuest as LoginController } from '~ui'
import { useLanguage } from '~components'

export const Login = (props) => {
  const { cartUuid } = useParams()
  const [, t] = useLanguage()

  const loginProps = {
    ...props,
    cartUuid,
    title: t('LOGIN_TITLE_PAGE', 'Log in to OrderingPlus!'),
    useLoginByCellphone: true,
    isGuest: true
  }

  return (
    <>
      <HelmetTags page='login' />
      <LoginContainer>
        <LoginController {...loginProps} />
      </LoginContainer>
    </>
  )
}

export default Login
