import React, { useEffect, useState } from 'react'
import Skeleton from 'react-loading-skeleton'
import {
  BusinessMenuListContainer,
  SelectWrapper,
  Option
} from './styles'

import { useLanguage, BusinessMenuListing } from '~components'
import { Select } from '~ui'

const BusinessMenuListUI = (props) => {
  const {
    businessMenuList,
    setMenu
  } = props

  const [, t] = useLanguage()
  const [menuList, setMenuList] = useState([])
  const [menuSelected, setMenuSelected] = useState(null)

  const enabledMenus = businessMenuList?.menus?.filter?.(menu => menu?.enabled) || []

  useEffect(() => {
    if (businessMenuList.loading) return

    const _menuList = []
    if (enabledMenus.length > 0) {
      setMenu(enabledMenus[0])
      setMenuSelected(enabledMenus[0]?.id)
      for (const menu of enabledMenus) {
        _menuList.push({
          value: menu.id,
          content: <Option>{menu.name}</Option>
        })
      }
    }
    setMenuList(_menuList)
  }, [businessMenuList?.menus])

  const handleChangeBusinessMenu = (menuId) => {
    const menu = enabledMenus.find(menu => menu.id === menuId)
    if (!menu) return
    setMenuSelected(menuId)
    setMenu({ ...menu })
  }

  return (
    <BusinessMenuListContainer>
      <p>{t('MENU', 'Menu')}</p>
      {businessMenuList?.loading
        ? (
        <Skeleton height={44} />
          )
        : (
        <SelectWrapper>
          <Select
            defaultValue={menuSelected}
            options={menuList}
            placeholder={t('MENU_NAME', 'Menu name')}
            onChange={(val) => handleChangeBusinessMenu(val)}
          />
        </SelectWrapper>
          )}
    </BusinessMenuListContainer>
  )
}

export const BusinessMenuList = (props) => {
  const businessMenuListProps = {
    ...props,
    UIComponent: BusinessMenuListUI
  }
  return <BusinessMenuListing {...businessMenuListProps} />
}
