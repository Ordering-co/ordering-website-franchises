import React, { useState, useEffect, useRef } from 'react'
import moment from 'moment'
import { useLocation } from 'react-router-dom'
import 'react-datepicker/dist/react-datepicker.css'
import BsCaretLeftFill from '@meronex/icons/bs/BsCaretLeftFill'
import { ArrowRight } from 'react-bootstrap-icons'
import CgRadioCheck from '@meronex/icons/cg/CgRadioCheck'

import { Swiper, SwiperSlide } from 'swiper/react'
import { Navigation } from 'swiper/modules'

import 'swiper/css'
import 'swiper/css/navigation'

import {
  Title,
  CheckBoxWrapper,
  DateWrapper,
  TimeListWrapper,
  CheckedIcon,
  ButtonWrapper,
  OrderTimeWrapper,
  MonthYearLayer,
  DaysSwiper,
  Day,
  DayName,
  DayNumber,
  TimeItem,
  ClosedBusinessMsg,
  CheckIcon,
  DateTimeContainer
} from './styles'

import {
  MomentOption,
  useLanguage,
  useUtils,
  useConfig,
  useOrder
} from '~components'
import { parseJsonStorage } from '~/utils/parseJsonStorage'

import {
  Button,
  getMomentCalendarLocale,
  getTimes as getTimesUtils
} from '~ui'

import { CustomLayout } from './layouts/CustomLayout'

const MomentControlUI = (props) => {
  const {
    isAsap,
    datesList,
    hoursList,
    dateSelected,
    timeSelected,
    handleAsap,
    handleChangeDate,
    handleChangeTime,
    onClose,
    isAppoint,
    cateringPreorder,
    isCart,
    preorderLeadTime,
    business,
    getActualSchedule,
    preorderMaximumDays,
    preorderMinimumDays
  } = props

  const scheduleItemRef = useRef()
  const timeListRef = useRef()
  const [{ configs }] = useConfig()
  const is12hours = configs?.general_hour_format?.value?.includes('hh:mm')
  const [{ parseTime }] = useUtils()
  const { pathname } = useLocation()
  const [, t] = useLanguage()
  const [orderState] = useOrder()
  const [isASAP, setIsASAP] = useState(false)
  const [timeList, setTimeList] = useState([])
  const [scheduleList, setScheduleList] = useState(null)
  const [isEnabled, setIsEnabled] = useState(true)
  const [nextTime, setNextTime] = useState(null)

  const handleCheckBoxChange = (index) => {
    if (index) {
      !orderState.loading && handleAsap()
      setIsASAP(true)
    } else setIsASAP(false)
  }

  const validateSelectedDate = (curdate, schedule) => {
    const day = moment(curdate).format('d')
    setIsEnabled(schedule[day].enabled)
  }

  const getTimes = (curdate, schedule) => {
    validateSelectedDate(curdate, schedule)
    const dateParts = curdate?.split?.('-')
    const dateSeleted = new Date(dateParts[0], dateParts[1] - 1, dateParts[2])
    const times = getTimesUtils(dateSeleted, schedule, is12hours)
    return times
  }

  const setLocalMoment = () => {
    moment.updateLocale('custom', getMomentCalendarLocale(t))
  }

  useEffect(() => {
    let _timeLists = []
    if (!scheduleList || cateringPreorder) {
      const schedule = business && Object.keys(business || {})?.length > 0 && getActualSchedule()
      if (!schedule && cateringPreorder && Object.keys(business)?.length > 0) {
        setIsEnabled(false)
        return
      }
      _timeLists = hoursList
        .filter(hour => (Object.keys(business || {})?.length === 0 || schedule?.lapses?.some(lapse =>
          moment(dateSelected + ` ${hour.startTime}`) >= moment(dateSelected + ` ${lapse.open.hour}:${lapse.open.minute}`).add(preorderLeadTime, 'minutes') && moment(dateSelected + ` ${hour.endTime}`) <= moment(dateSelected + ` ${lapse.close.hour}:${lapse.close.minute}`))) &&
          moment(dateSelected + ` ${hour.startTime}`) < moment(dateSelected + ` ${hour.endTime}`) &&
          (moment().add(preorderLeadTime, 'minutes') < moment(dateSelected + ` ${hour.startTime}`) || !cateringPreorder))
        .map(hour => {
          return {
            value: hour.startTime,
            text: is12hours
              ? (
                  hour.startTime.includes('12')
                    ? `${hour.startTime}PM`
                    : parseTime(moment(hour.startTime, 'HH:mm'), { outputFormat: 'hh:mma' })
                )
              : (
                  parseTime(moment(hour.startTime, 'HH:mm'), { outputFormat: 'HH:mm' })
                ),
            endText: is12hours
              ? (
                  hour.endTime.includes('12')
                    ? `${hour.endTime}PM`
                    : parseTime(moment(hour.endTime, 'HH:mm'), { outputFormat: 'hh:mma' })
                )
              : (
                  parseTime(moment(hour.endTime, 'HH:mm'), { outputFormat: 'HH:mm' })
                )
          }
        })
      setIsEnabled(true)
    } else {
      _timeLists = getTimes(dateSelected, scheduleList)
    }
    setTimeList(_timeLists)
  }, [dateSelected, hoursList, scheduleList, cateringPreorder, JSON.stringify(business)])

  useEffect(() => {
    handleCheckBoxChange(isAsap && ((preorderMinimumDays === 0 && preorderLeadTime === 0) || !cateringPreorder))
  }, [isAsap])

  useEffect(() => {
    if ((!pathname.includes('store') || isCart) && !props.business) {
      setScheduleList(null)
      return
    }

    const schedules = parseJsonStorage(window.localStorage.getItem('business_schedule'))
    setScheduleList(schedules)
  }, [pathname])

  useEffect(() => {
    setLocalMoment()
  }, [])

  useEffect(() => {
    if (timeListRef?.current && !orderState.loading && timeSelected) {
      timeListRef.current.scroll({
        left: 0,
        top: scheduleItemRef?.current?.offsetTop - 300
      })
    }
  }, [timeListRef?.current, timeSelected, orderState.loading, timeList?.length])

  useEffect(() => {
    if (preorderMinimumDays === 0 && preorderLeadTime === 0) return
    const isToday = dateSelected === moment().format('YYYY-MM-DD')
    if (isCart && isToday && !orderState?.loading && timeList?.length > 0) {
      setNextTime(timeList?.[0] ?? null)
    }
  }, [timeList?.length])

  useEffect(() => {
    if (nextTime?.value && timeList?.length > 0 && isCart && !orderState?.loading && !(preorderMinimumDays === 0 && preorderLeadTime === 0)) {
      const notime = timeList?.filter((_, i) => i !== 0)?.find?.(time => time?.value === timeSelected)
      if (!notime) {
        handleChangeTime(nextTime?.value)
      }
    }
  }, [nextTime?.value])

  return (
    <div id='moment_control'>
      {!isAppoint && (
        <>
          {!isCart && (
            <Title>{t('DELIVERING_TO', 'Delivering to')}</Title>
          )}
          <DateTimeContainer>
            {t('DATE_AND_TIME', 'Date & time')}
          </DateTimeContainer>
          {((preorderMinimumDays === 0 && preorderLeadTime === 0) || !cateringPreorder) && (
            <CheckBoxWrapper
              highlight={isAsap && isASAP}
              onClick={() => handleCheckBoxChange(true)}
              isLoading={orderState?.loading}
            >
              {isASAP ? <CheckedIcon /> : <CgRadioCheck />}
              <span>{t('CHECKOUT_ASAP', 'ASAP')} ({moment(new Date()).format(`dddd, MMMM DD, YYYY ${configs?.general_hour_format?.value}`)} + {orderState?.options?.type > 1 ? t('PICKUP_TIME', 'pickup Time') : t('DELIVERY_TIME', 'delivery time')})</span>
            </CheckBoxWrapper>
          )}
          <CheckBoxWrapper
            highlight={!isASAP}
            onClick={() => handleCheckBoxChange(null)}
          >
            {isASAP ? <CgRadioCheck /> : <CheckedIcon />}
            <span>{t('SCHEDULE_FOR_LATER', 'Schedule for later')}</span>
          </CheckBoxWrapper>
        </>
      )}
      {
        (!isASAP || isAppoint) && (
          !props.isCustomLayout
            ? (
            <OrderTimeWrapper>

              <DateWrapper>
                <MonthYearLayer>
                  <span>
                    {
                      datesList.slice((cateringPreorder && preorderMinimumDays) || 0, Number(cateringPreorder ? preorderMaximumDays : configs?.max_days_preorder?.value ?? 6, 10))?.length === 0
                        ? moment(dateSelected).format('Do MMMM, yyyy')
                        : moment(dateSelected).format('MMMM, yyyy')
                    }
                  </span>
                </MonthYearLayer>
                <DaysSwiper left={<BsCaretLeftFill />}>
                  <Swiper
                    spaceBetween={0}
                    navigation
                    modules={[Navigation]}
                    breakpoints={{
                      0: {
                        slidesPerView: 4,
                        spaceBetween: 0
                      },
                      400: {
                        slidesPerView: 5,
                        spaceBetween: 0
                      },
                      550: {
                        slidesPerView: 6,
                        spaceBetween: 0
                      },
                      769: {
                        slidesPerView: configs?.max_days_preorder?.value < 7 ? configs?.max_days_preorder?.value : 7,
                        spaceBetween: 0
                      }
                    }}
                    freeMode
                    watchSlidesProgress
                    className='swiper-datelist'
                    preventClicksPropagation={false}
                  >
                    {
                      datesList.slice((cateringPreorder && preorderMinimumDays) || 0, Number(cateringPreorder ? preorderMaximumDays : configs?.max_days_preorder?.value ?? 6, 10)).map(date => {
                        const dateParts = date.split('-')
                        const _date = new Date(dateParts[0], dateParts[1] - 1, dateParts[2])
                        const dayName = t('DAY' + (_date.getDay() >= 1 ? _date.getDay() : 7)).substring(0, 2)
                        const dayNumber = (_date.getDate() < 10 ? '0' : '') + _date.getDate()
                        return (
                          <SwiperSlide key={dayNumber}>
                            <Day selected={dateSelected === date} onClick={() => handleChangeDate(date)}>
                              <DayName isAppoint={isAppoint}>{dayName}</DayName>
                              <DayNumber isAppoint={isAppoint}>{dayNumber}</DayNumber>
                            </Day>
                          </SwiperSlide>
                        )
                      })
                    }
                  </Swiper>
                </DaysSwiper>
              </DateWrapper>
              <TimeListWrapper ref={timeListRef}>
                {(isEnabled && timeList?.length > 0)
                  ? (
                  <>
                    {timeList.map((time, i) => (
                      <TimeItem
                        key={i}
                        active={timeSelected === time.value}
                        onClick={() => handleChangeTime(time.value)}
                        isAppoint={isAppoint}
                        cateringPreorder={cateringPreorder}
                      >
                        <span>
                          {cateringPreorder && (
                            <CheckIcon>
                              {timeSelected === time.value ? <CheckedIcon ref={scheduleItemRef} cateringPreorder={cateringPreorder} /> : <CgRadioCheck />}
                            </CheckIcon>
                          )}
                          <p id='time'>
                            {time.text} {cateringPreorder && `- ${time.endText}`}
                          </p>
                        </span>
                      </TimeItem>
                    ))}
                  </>
                    )
                  : (
                  <ClosedBusinessMsg>
                    {!business
                      ? t('ERROR_SHEDULE_UNAVAILABLE', 'There are no schedules for this date')
                      : t('ERROR_ADD_PRODUCT_BUSINESS_CLOSED', 'The business is closed at the moment')}
                  </ClosedBusinessMsg>
                    )}
              </TimeListWrapper>
            </OrderTimeWrapper>
              )
            : (
            <CustomLayout
              handleChangeDate={handleChangeDate}
              datesList={datesList}
              hoursList={hoursList}
              isEnabled={isEnabled}
              timeList={timeList}
              timeSelected={timeSelected}
              handleChangeTime={handleChangeTime}
            />
              )
        )
      }
      {!isAppoint && !isCart && (
        <ButtonWrapper>
          <Button
            color='primary'
            onClick={() => onClose()}
            disabled={!isASAP ? !timeSelected : false}
          >
            <span>{t('CONTINUE', 'Continue')}</span>
            <ArrowRight />
          </Button>
        </ButtonWrapper>
      )}
    </div>
  )
}

export const MomentControl = (props) => {
  const momentProps = {
    ...props,
    UIComponent: MomentControlUI
  }
  return <MomentOption {...momentProps} />
}
