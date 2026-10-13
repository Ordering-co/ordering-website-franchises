import moment from 'moment'
import { useLanguage } from '~components'
import { getMomentCalendarLocale } from '~ui'

export const getUtils = () => {
  const [, t] = useLanguage()
  const setLocalMoment = () => {
    moment.updateLocale('custom', getMomentCalendarLocale(t))
  }

  return {
    setLocalMoment
  }
}
