import React from 'react'
import { ArrowDown, ArrowUp } from 'react-bootstrap-icons'

import {
  ItemContainer,
  ItemDateBlock,
  ItemDescriptionBlock,
  ItemIcon,
  ItemContent,
  ItemRight
} from './styles'
import { useUtils, useLanguage } from '~components'

import { capitalize } from '~ui'

export const TransactionItem = (props) => {
  const {
    item,
    withFormatPrice
  } = props

  const [, t] = useLanguage()
  const [{ parsePrice, parseDate }] = useUtils()

  return (
    <ItemContainer>
      <ItemDateBlock>
        <div className='left-wrapper'>
          <ItemIcon className={`${item?.amount > 0 ? 'green' : ''}`}>
            {item?.amount > 0
              ? (
                  <ArrowUp/>
                )
              : (
                  <ArrowDown />
                )
            }
          </ItemIcon>
          <ItemRight>
            <ItemContent>
              <div className='date'>{parseDate(item?.created_at)}</div>
            </ItemContent>
              <ItemDescriptionBlock>
                <div>{item?.description ? item?.description : capitalize(`${item?.event_type} ${t('MOVEMENT', 'Movement')}`)}</div>
              </ItemDescriptionBlock>
          </ItemRight>
        </div>
        <ItemRight>
          <ItemContent>
            <div
              className={`amount ${item?.amount > 0 ? 'green' : ''}`}
            >
              {item?.amount > 0 && '+ '}{withFormatPrice ? parsePrice(item?.amount) : item?.amount}
            </div>
          </ItemContent>
        </ItemRight>
      </ItemDateBlock>
    </ItemContainer>
  )
}
