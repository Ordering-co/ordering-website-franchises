import React from 'react'
import { HelmetTags } from '../../components/HelmetTags'

import { Account as AccountController } from '~ui'

export const Account = (props) => {
  const accountProps = {
    ...props
  }

  return (
    <>
      <HelmetTags page='account' />
      <AccountController {...accountProps} />
    </>
  )
}

export default Account
