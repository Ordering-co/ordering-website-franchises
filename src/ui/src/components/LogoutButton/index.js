import React from 'react'
import { BoxArrowRight } from 'react-bootstrap-icons'

import {
  MenuLink,
  WrappContent,
  MenuLinkIcon,
  MenuLinkText,
  TextInfo,
  MenuLinkSeparator
} from '../SidebarMenu/styles'

import { LogoutAction, useLanguage, useCustomer } from '~components'
import { clearUserCustomerOnLogout } from './clearUserCustomerOnLogout'

const LogoutButtonUI = (props) => {
  const { onCustomClick, hideText } = props
  const [, t] = useLanguage()
  const [, { deleteUserCustomer }] = useCustomer()

  const handleLogOutClick = () => {
    window.FB.getLoginStatus((response) => {
      if (response.status === 'connected') {
        window.FB.logout()
      }
    })

    const GoogleAuth = window?.gapi?.auth2?.getAuthInstance()
    if (GoogleAuth) {
      const signedIn = GoogleAuth.isSignedIn.get()
      if (signedIn) {
        GoogleAuth.signOut().then(() => {
          GoogleAuth.disconnect()
        })
      }
    }

    clearUserCustomerOnLogout(deleteUserCustomer)
    props.handleLogoutClick()
    onCustomClick && onCustomClick()
  }

  return (
    <MenuLink id='logoutbtn' onClick={handleLogOutClick} style={props.styleContainer}>
      <WrappContent style={props.styleWrappContent}>
        <MenuLinkIcon>
          <BoxArrowRight />
        </MenuLinkIcon>
        {!hideText && (
          <MenuLinkText>
            <TextInfo>
              {t('LOGOUT', 'Logout')}
            </TextInfo>
          </MenuLinkText>
        )}
        <MenuLinkSeparator>
          <div>
            <hr />
          </div>
        </MenuLinkSeparator>
      </WrappContent>
    </MenuLink>
  )
}

export const LogoutButton = (props) => {
  const logoutButtonProps = {
    ...props,
    UIComponent: LogoutButtonUI
  }
  return (
    <LogoutAction {...logoutButtonProps} />
  )
}
