import React, { useMemo } from 'react'
import { Calendar } from 'react-date-range'
import 'react-date-range/dist/styles.css'
import 'react-date-range/dist/theme/default.css'

import { useLanguage } from '~components'
import { getDatePickerLocale } from '~ui'
import { DateContainer } from './styles'

export const DatePickerUI = props => {
  const { value, onChange, name } = props
  const [, t] = useLanguage()
  const locale = useMemo(() => getDatePickerLocale(t), [t])

  return (
    <DateContainer>
      <Calendar
        date={value}
        name={name}
        onChange={onChange}
        maxDate={new Date()}
        locale={locale}
        weekdayDisplayFormat="EEEEE"
      />
    </DateContainer>
  )
}

DatePickerUI.defaultProps = {
  name: 'date'
}
