import React from 'react'
import { useTheme } from 'styled-components'

import { HelmetTags } from '../../components/HelmetTags'
import settings from '../../config'
import { selectedFranchise } from '../../utils/localProject'

import { useEvent } from '~components'
import { MessagesListing } from '~ui'

export const MessagesList = (props) => {
  const [events] = useEvent()
  const theme = useTheme()
  const websiteThemeType = theme?.my_products?.components?.website_theme?.components?.type
  const websiteThemeFranchiseSlug = theme?.my_products?.components?.website_theme?.components?.franchise_slug
  const updatedFranchiseSlug = selectedFranchise(settings, websiteThemeType === 'franchise' && websiteThemeFranchiseSlug)

  const messageprops = {
    ...props,
    franchiseId: updatedFranchiseSlug,
    onRedirectPage: (data) => events.emit('go_to_page', data),
    disableFilters: true
  }
  return (
    <>
      <HelmetTags page='messages' />
      <MessagesListing {...messageprops} />
    </>
  )
}

export default MessagesList
