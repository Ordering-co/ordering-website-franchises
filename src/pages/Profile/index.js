import React, { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { HelmetTags } from '../../components/HelmetTags'
import { IntercomWrapper } from '../../components/IntercomWrapper'

import { useConfig } from '~components'
import { UserProfileForm as UserProfileFormOriginal, useWindowSize } from '~ui'

export const Profile = (props) => {
  const windowSize = useWindowSize()
  const { search } = useLocation()
  const searchParams = new URLSearchParams(search)
  const view = searchParams.get('view') || ''

  const profileProps = {
    ...props,
    view,
    refreshSessionUser: true,
    showLogout: true,
    hideOptions: windowSize.width < 576
  }

  const [{ configs }] = useConfig()
  const isIntercomEnabled = configs?.intercom_enabled?.value === '1'

  useEffect(() => {
    if (isIntercomEnabled) {
      window?.Intercom?.('boot', window.intercomSettings)
    } else {
      window?.Intercom?.('shutdown')
    }

    return () => {
      window?.Intercom?.('shutdown')
    }
  }, [isIntercomEnabled])

  return (
    <IntercomWrapper>
      <HelmetTags page='profile' />
      <UserProfileFormOriginal {...profileProps} />
    </IntercomWrapper>
  )
}

export default Profile
