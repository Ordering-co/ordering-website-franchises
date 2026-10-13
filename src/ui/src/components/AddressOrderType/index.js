import React, { useState } from 'react'
import {
  Pencil
} from 'react-bootstrap-icons'
import {
  OrderTypeSelectorContainer,
  OrderTypesContainer,
  MoreOrderTypeSelectorContainer,
  AddressMenu,
  AddressOrderTypeWrapper,
  AddressContainer
} from './styles'

import { useConfig, useLanguage, useOrder, OrderTypeControl, useSession } from '~components'
import { parseOrderTypesAllowed } from '~/utils/parseOrderTypesAllowed'

import {
  Modal,
  Alert,
  AddressForm,
  AddressList,
  capitalize
} from '~ui'

import Button from '../../styles/Buttons'

export const AddressOrderTypeUI = (props) => {
  const {
    handleChangeOrderType,
    orderTypes,
    configTypes,
    typeSelected,
    setOrderTypeValue
  } = props

  const [, t] = useLanguage()
  const [orderState] = useOrder()
  const [{ auth }] = useSession()
  const [modals, setModals] = useState({ listOpen: false, formOpen: false, citiesOpen: false })
  const [alertState, setAlertState] = useState({ open: false, content: [] })

  const selectAsPickup = [2, 3, 4, 5]
  const orderTypesAllowed = orderTypes && (configTypes ? orderTypes.filter(type => configTypes?.includes(type.value)) : orderTypes)

  const handleChangeOrderTypeCallback = async (orderType) => {
    if (!orderState.loading) {
      setOrderTypeValue && setOrderTypeValue(orderType)
      await handleChangeOrderType(orderType)
    }
  }

  const handleFindBusinesses = () => {
    if (!orderState?.options?.address?.location) {
      setAlertState({ open: true, content: [t('SELECT_AN_ADDRESS_TO_SEARCH', 'Select or add an address to search')] })
      return
    }
    setModals({ listOpen: false, formOpen: false })
  }

  const handleCloseAlerts = () => {
    setAlertState({ open: false, content: [] })
  }

  const handleClickAddress = (e) => {
    if (auth && orderState?.options?.address_id) {
      setModals({ ...modals, listOpen: true })
    } else {
      setModals({ ...modals, formOpen: true })
    }
  }

  return (
    <AddressOrderTypeWrapper>
      <AddressContainer onClick={() => handleClickAddress()}>
        <AddressMenu>
          {orderState?.options?.address?.tag && (
            <span>{t(orderState?.options?.address?.tag?.toUpperCase(), capitalize(orderState?.options?.address?.tag))}</span>
          )}
          <div>
            <span>
              {orderState.options?.address?.address || t('WHERE_DO_WE_DELIVERY', 'Where do we delivery?')}
            </span>
          </div>
        </AddressMenu>
        <Pencil />
      </AddressContainer>
      <OrderTypesContainer className='order-type'>
        {orderTypesAllowed && orderTypesAllowed.length <= 2 && (
          <OrderTypeSelectorContainer>
            {orderTypesAllowed.map((orderType, i) => (
              <Button
                key={i}
                disabled={orderState?.loading}
                initialIcon
                onClick={() => handleChangeOrderTypeCallback(orderType.value)}
                className={typeSelected === orderType.value ? 'selected' : ''}
              >
                <p>{orderType.text}</p>
              </Button>
            ))}
          </OrderTypeSelectorContainer>
        )}
        {orderTypesAllowed && orderTypesAllowed.length > 2 && (
          <div>
            <OrderTypeSelectorContainer>
              {orderTypesAllowed.slice(0, 2).map((orderType, i) => (
                  <Button
                    key={i}
                    disabled={orderState?.loading}
                    initialIcon
                    onClick={() => handleChangeOrderTypeCallback(orderType.value)}
                    className={(typeSelected === orderType.value) || (orderType.value === 2 && selectAsPickup.includes(typeSelected)) ? 'selected' : ''}
                  >
                    <p>{orderType.text}</p>
                  </Button>
              ))}
            </OrderTypeSelectorContainer>
            {selectAsPickup.includes(typeSelected) && (
              <MoreOrderTypeSelectorContainer>
                <div className='more-order-type-wrapper'>
                  {orderTypesAllowed.slice(1).map((orderType, i) => (
                      <Button
                        key={i}
                        disabled={orderState?.loading}
                        initialIcon
                        onClick={() => handleChangeOrderTypeCallback(orderType.value)}
                        className={(typeSelected === orderType.value) ? 'selected' : ''}
                      >
                        <p>{orderType.text}</p>
                      </Button>
                  ))}
                </div>
              </MoreOrderTypeSelectorContainer>
            )}
          </div>
        )}
      </OrderTypesContainer>
      {modals.formOpen && (
        <Modal
          title={t('ADDRESS_FORM', 'Address Form')}
          open={modals.formOpen}
          onClose={() => setModals({ ...modals, formOpen: false })}
        >
          <AddressForm
            useValidationFileds
            address={orderState?.options?.address || {}}
            onClose={() => setModals({ ...modals, formOpen: false })}
            onCancel={() => setModals({ ...modals, formOpen: false })}
            onSaveAddress={() => setModals({ ...modals, formOpen: false })}
          />
        </Modal>
      )}
      {modals.listOpen && (
        <Modal
          open={modals.listOpen}
          width='40%'
          minHeight='90vh'
          onClose={() => setModals({ ...modals, listOpen: false })}
          closeIconRight
        >
          <AddressList
            isHideTitle
            isModal
            changeOrderAddressWithDefault
            onCancel={() => setModals({ ...modals, listOpen: false })}
            onAccept={() => handleFindBusinesses()}
            isMobile
          />
        </Modal>
      )}
      <Alert
        title={t('ORDERING', 'Ordering')}
        content={alertState.content}
        acceptText={t('ACCEPT', 'Accept')}
        open={alertState.open}
        onClose={() => handleCloseAlerts()}
        onAccept={() => handleCloseAlerts()}
        closeOnBackdrop={false}
      />
    </AddressOrderTypeWrapper>
  )
}

export const AddressOrderType = (props) => {
  const [, t] = useLanguage()
  const [configState] = useConfig()

  const orderTypeProps = {
    ...props,
    UIComponent: AddressOrderTypeUI,
    configTypes: parseOrderTypesAllowed(configState?.configs?.order_types_allowed?.value),
    orderTypes: props.orderTypes || [
      {
        value: 1,
        text: t('DELIVERY', 'Delivery'),
        description: t('ORDERTYPE_DESCRIPTION_DELIVERY', 'Delivery description')
      },
      {
        value: 2,
        text: t('PICKUP', 'Pickup'),
        description: t('ORDERTYPE_DESCRIPTION_PICKUP', 'Pickup description')
      },
      {
        value: 3,
        text: t('EAT_IN', 'Eat in'),
        description: t('ORDERTYPE_DESCRIPTION_EATIN', 'Eat in description')
      },
      {
        value: 4,
        text: t('CURBSIDE', 'Curbside'),
        description: t('ORDERTYPE_DESCRIPTION_CURBSIDE', 'Curbside description')
      },
      {
        value: 5,
        text: t('DRIVE_THRU', 'Drive thru'),
        description: t('ORDERTYPE_DESCRIPTION_DRIVETHRU', 'Drive Thru description')
      }
    ]
  }

  return <OrderTypeControl {...orderTypeProps} />
}
