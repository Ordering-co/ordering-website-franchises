import styled, { css } from 'styled-components'

export const Container = styled.div`
  display: flex;
  width: 100%;
  flex-direction: column;
  min-height: auto;

  .paymentsContainer {
    align-items: center;
    width: 100%;
    button {
      margin: 30px 0 20px;
      width: 350px;
      height: 50px;
    }
  }

  @media (min-width: 769px) {
    flex-direction: row;
  }

  @media (min-width: 993px) {
    min-height: calc(100vh - 337px);
    box-sizing: border-box;
  }
`

export const WrapperLeftContainer = styled.div`
  width: 100%;
  box-sizing: border-box;
  padding: 20px 20px 30px;

  @media (min-width: 769px) {
    width: 50%;
    padding: 20px 60px 55px 40px;
  }

  @media (min-width: 820px) {
    padding: 30px 35px 55px 60px;
  }
`

export const WrapperRightContainer = styled.div`
  width: 100%;
  background: ${props => props.theme.colors.grayDividerColor};
  box-sizing: border-box;
  padding: 20px 20px;

  @media (min-width: 769px) {
    width: 50%;
    padding: 0px 40px 55px;
  }
`

export const WrapperUserDetails = styled.div`
  width: 100%;
`

export const UserDetailsContainer = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: 25px;
  flex-wrap: wrap;
  padding-bottom: 20px;
  border-bottom: 1px solid ${props => props.theme.colors.gray200};
`

export const BusinessDetailsContainer = styled(UserDetailsContainer)`
  border: none;
  div {
    h1 {
      text-transform: capitalize;
      margin: 0px;
      font-weight: 600;
      font-size: 16px;
    }
    p {
      font-size: 14px;
      margin: 5px 0;
      color: ${props => props.theme.colors.darkTextColor};
    }
  }
`

export const PaymentMethodContainer = styled.div`
  display: flex;
  flex-direction: column;
  margin: 20px 0px 0px;

  h1 {
    margin: 0px;
    font-weight: 500;
    font-size: 20px;
    color: ${props => props.theme.colors.darkTextColor};
  }
`

export const DriverTipContainer = styled(PaymentMethodContainer)`
  > p {
    margin: 0;
    font-size: 16px;
    color: ${props => props.theme?.colors.darkGray};
  }
`

export const CartContainer = styled(PaymentMethodContainer)`
  margin-bottom: 40px;
  position: relative;

  table.total {
    width: 50%;
    padding-top: 10px;
    tr {
      td {
        font-weight: 400;
        color: ${props => props.theme.colors.darkTextColor};
        font-size: ${(props) => props.theme?.utils?.tsize?.s}px;

        &#loyalty {
          font-weight: normal;
          font-size: 14px;
        }
      }
    }
  }
`

export const WalletPaymentOptionContainer = styled(PaymentMethodContainer)`
  margin: 0px 0px 0px;
`

export const WrapperPlaceOrderButton = styled.div`
  width: 100%;
  height: min-content;
  max-width: 204px;
  display: flex;
  justify-content: center;

  button {
    width: 100%;
    padding: 5px 20px;
    cursor: pointer;
    border-radius: ${props => props.theme?.utils?.radius?.m}px;

    &:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }
  }
`

export const WarningMessage = styled.div`
  width: 100%;
  height: fit-content;
  max-height: fit-content;
  min-height: 150px;
  background-color: #F2BB40;
  display: flex;
  justify-content: center;
  align-items: center;
  opacity: 0.8;
  border-radius: 10px;
  position: relative;

  svg {
    position: absolute;
    font-size: 30px;
    top: 0;
    left: 0;
    margin: 11px;
    ${props => props.theme?.rtl && css`
        right: 0;
        left: initial;
    `}
  }

  h1 {
    font-size: 20px;
    margin: 0px 60px;
    text-align: center;
  }
`

export const NotFoundImage = styled.div`
  max-width: 300px;

  img {
    width: 300px;
  }
`

export const CartsList = styled.div`
  display: flex;
  flex-direction: column;
  width: 90%;
  margin: auto;

  @media (min-width: 381px) {
    width: 80%;
  }
`

export const WarningText = styled.p`
  margin: 10px auto;
  text-align: center;
  color: ${props => props.theme.colors.primary};
`

export const WrapperLeftContent = styled.div`
  width: 100%;

  .checkout-title {
    margin: 0;
    font-weight: 600;
    font-size: 32px;
    color: ${props => props.theme?.colors.darkTextColor};
  }
`
export const CheckOutDivider = styled.div`
  height: 8px;
  width: calc(100% + 40px);
  margin-left: -20px;
  background: #F8F9FA;

  @media(min-width: 769px) {
    width: calc(100% + 100px);
    margin-left: -40px;
  }
`

export const DriverTipDivider = styled.div`
  height: 8px;
  width: calc(100% + 40px);
  margin-left: -20px;
  background: ${props => props.theme.colors.gray200};
`

export const DeliveryOptionsContainer = styled.div`
  display: flex;
  flex-direction: column;
  padding: 20px 0px 10px;

  #select-input {
    margin-bottom: 10px;
  }
  #list {
    width: 100%;
  }

  > div {
    width: 100%;
    background-color: ${props => props.theme.colors.grayDividerColor} !important;
    height: 44px;
    border: none;
    border-radius: ${props => props.theme?.utils?.radius?.m}px;
    color: ${props => props.theme?.colors.headingColor} !important;

    > div:first-child {
      padding-top: 5px;
      padding-bottom: 5px;
      padding: 5px 20px 5px 20px;
      justify-content: space-between;
    }
    > div#list {
      width: 100%;
      background-color: #F8F9FA!important;
      border: 1px solid #F8F9FA;
      border-radius: ${props => props.theme?.utils?.radius?.m}px;
      box-shadow: 0px 1px 4px rgba(0, 0, 0, 0.1);
    }
  }
`

export const CartHeader = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  flex-direction: column;

  h1 {
    font-weight: 600;
    font-size: 18px;
    line-height: 30px;
  }

  span {
    font-size: 13px;
    color: ${props => props.theme.colors.primary};
    cursor: pointer;
    user-select: none;
    &:hover {
        text-decoration: underline;
      }
  }

  h1, span {
    margin: 5px 0px;
  }

  @media (min-width: 300px) {
    flex-direction: row;
    align-items: center;
  }
`

export const SelectSpotContainer = styled.div``

export const WrapperActionsInput = styled.div`
  input {
    width: 100%;
  }
  h1 {
    font-size: 20px;
  }
`

export const MobileWrapperPlaceOrderButton = styled.div`
  position: fixed;
  width: 100vw;
  left: 0;
  bottom: 0;
  background-color: white;
  padding: 15px 25px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  box-sizing: border-box;
  z-index: ${props => props?.theme?.utils?.zi?.l};
  box-shadow: 0px 4px 10px rgb(0 0 0 / 12%);

  span {
    font-weight: 600;
    font-size: 16px;

    @media (min-width: 1200px) {
      font-size: 18px;
      padding-left: 20px;
    }
  }

  button {
    min-height: 44px;
    border-radius: ${props => props.theme?.utils?.radius?.m}px;
  }
`

export const OrderContextUIWrapper = styled.div`
  margin-left: 15px;
  max-width: 85%;

  ${props => props.theme.rtl && css`
    margin-left: 0px;
    margin-right: 15px;
  `}

  @media (min-width: 480px) {
    max-width: 90%;
  }
`

export const HeaderContent = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 10px;
  .back-arrow {
    font-size: 24px;
    cursor: pointer;
  }
`

export const AuthButtonList = styled.div`
  display: flex;
  flex-direction: column;
  h2 {
    font-weight: 600;
    font-size: 20px;
    margin-bottom: 3px;
  }
  button {
    width: 100%;
    height: 44px;
    margin-top: 22px;
  }
`
export const Flag = styled.span`
  font-size: 13px;
  margin: 0px;
  text-transform: capitalize;
  color: #E63757;
  font-weight: 500;

  @media (min-width: 381px) {
    font-size: 14px;
  }
`
export const SectionTitleContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;

  h1 {
    margin: 0px;
    font-weight: 700;
    font-size: 18px;
    color: ${props => props.theme.colors.darkTextColor};
  }
  h1.title {
    padding: 0px 20px 0px;
    font-size: ${(props) => props.theme?.utils?.tsize?.l}px;
  }
`

export const OrderDetailContainer = styled.div`
  display: flex;
  flex-direction: column;
  padding: 10px 30px 20px;
`

export const SpinnerContainer = styled.div`
  position: absolute;
  width: 100%;
  left: 0;
  top: -100%;
`

export const FirstViewContainer = styled.div`
  width: 100%;
`

export const AddressOrderTypeContainer = styled.div`
  width: 100%;
`

export const CartInfoWrapper = styled.div`
`

export const Accordion = styled.div`
  padding: 0 0 10px;

  .add-instructions {
    cursor: pointer;
    color: ${props => props.theme.colors.primary};
    margin-top: 10px;
  }
  &.active {
    .add-instructions {
      color: ${props => props.theme.colors.lightGray};
    }
  }
  .order-summary {
    display: flex;
    align-items: center;
    justify-content: space-between;
    cursor: ${({ isClosed }) => isClosed ? 'not-allowed' : 'pointer'};
    transition: background-color 0.6s ease;
    position: relative;
    padding: 10px 0px;
    box-sizing: border-box;
    font-size: 18px;
    font-weight: 700;

    span {
      align-items: center;
      color: ${props => props.theme.colors.primary};
      display: flex;
      font-size: ${(props) => props.theme?.utils?.tsize?.xs}px;
      font-weight: 500;
      svg {
        color: ${props => props.theme.colors.headingColor};
      }
    }

    .arrow {
      font-size: 22px;
      padding-left: 30px;
    }

    .rotate {
      transform: rotate(180deg);
    }

    .accordion-icon {
      transition: transform 0.6s ease;
    }
  }
`

export const AccordionContent = styled.div`
  overflow: hidden;
  transition: min-height 0.6s ease;
`

export const CommentContainer = styled.div`
  position: relative;
  display: flex;
  margin-top: 10px;

  textarea {
    width: 100%;
    min-height: 86px;
  }

  .spinner-content > div {
    width: 50px !important;
    height: 50px !important;
  }
`

export const Spinner = styled.div`
  position: absolute;
  top: 0;
  right: 0;
  transform: translate(-20%, 15%);
`

export const MomentContainer = styled.div`
  display: flex;
  justify-content: space-between;
  font-size: 18px;
  font-weight: 700;
  color: ${props => props.theme.colors.headingColor};
  span {
    cursor: pointer;
    padding-left: 10px;
    color: ${props => props.theme.colors.primary};
    p {
      font-size: ${(props) => props.theme?.utils?.tsize?.xs}px;
      font-weight: 500;
      margin: 0;
      border-bottom: 1px solid ${props => props.theme.colors.primary};
    }
  }
  div {
    flex-direction: column;
    p {
      margin: 0;
      font-size: ${(props) => props.theme?.utils?.tsize?.xs}px;
      font-weight: 500;
    }
  }
`

export const OrderInfoWrapper = styled.div`
  margin: 10px 0px;
  padding: 25px 0 15px;
  border-style: solid;
  border-color: ${props => props.theme.colors.gray200};
  border-width: 1px 0;
`

export const AddressInfoWrapper = styled.div`
  margin: 10px 0px;
  padding: 25px 0 15px;
  border-style: solid;
  border-color: ${props => props.theme.colors.gray200};
  border-width: 1px 0;
  border-bottom-width: 0px;
`

export const PayCardSelected = styled.div`
  display: flex;
  justify-content: space-between;
  font-size: 18px;
  font-weight: 700;
  min-height: 80px;
  padding-bottom: 10px;
  border-bottom: 1px solid ${props => props.theme.colors.gray200};

  .required-payment {
    width: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .change-payment {
    padding-left: 10px;
    color: ${props => props.theme.colors.primary};
    p {
      cursor: pointer;
      font-size: ${(props) => props.theme?.utils?.tsize?.xs}px;
      font-weight: 500;
      margin: 0;
      border-bottom: 1px solid ${props => props.theme.colors.primary};
    }
  }
`

export const CardItemContent = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  width: 100%;
  font-weight: bold;

  span {
    display: flex;
  }


  img {
      width: 24px;
      height: 20px;
  }

  .card-number {
    font-weight: 400;
    font-size: ${(props) => props.theme?.utils?.tsize?.s}px;
  }

  .brand svg {
    font-size: 26px;
  }

  .payment-container {
    width: 100%;
  }

  .payment-wrapper {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .brand {
    margin-right: 10px
    ${props => props.theme?.rtl && css`
      margin-left: 10px;
      margin-right: 0;
    `}
  }
`

export const OrderBill = styled.div`
  display: flex;
  align-items: flex-end;
  flex-direction: column;
  padding: 10px 0px;
  background-color: ${isCheckout => isCheckout ? 'transparent' : '#FFF'};
  table {
    font-size: 14px;
    margin-top: 10px;
    margin-bottom: 10px;
    td span {
      unicode-bidi: bidi-override;
    }

    tr td:nth-child(2) {
      text-align: right;
      ${props => props.theme?.rtl && css`
        text-align: left;
    `}
    }

    .icon {
      display: flex;
      align-items: center;
      max-height: 25px;
    }
  }
  table.total {
    border-top: 1px solid #EAEAEA;
    padding-top: 10px;
    tr {
      td {
        font-weight: bold;
        color: ${props => props.theme.colors.darkTextColor};
        font-size: 14px;

        &#loyalty {
          font-weight: normal;
          font-size: 14px;
        }
      }
    }
  }
  table.comments {
    margin-top: 20px;
    tr {
      td:nth-child(1) {
        font-weight: bold;
      }
    }
    textarea {
      width: 100%;
      box-sizing: border-box;
      border-radius: 7.6px;
      height: 77px;
      padding-right: 60px;
    }
  }
  table.spot {
    tr {
      td:nth-child(1) {
        font-weight: bold;
      }
      td:nth-child(2) {
        font-weight: bold;
        color: ${({ theme }) => theme.colors.primary};
        cursor: pointer;
        &:hover {
          text-decoration: underline;
        }
      }
    }
  }
`

export const BackButtonWrapper = styled.div`
  display: none;
  font-size: ${props => props.theme.utils.tsize.xs}px;
  align-items: center;
  margin-left: ${props => props.theme.utils.margins.l + 'px'};
  cursor: pointer;

  svg {
    color: ${props => props.theme.colors.darkTextColor};
    font-size: ${props => props.theme.utils.tsize.l}px;
  }
  h2 {
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 3;
    color: ${({ theme }) => theme?.colors?.black};
    margin: 0;
    margin-left: 10px;
    font-size: 15px;
    font-weight: 600;
    overflow: hidden;
    text-overflow: ellipsis;
    margin-left: 0px;
  }

  @media (min-width: 769px) {
    display: flex;
    position: absolute;
    top: 30px;
  }
`
