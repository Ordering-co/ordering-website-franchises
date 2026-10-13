import styled, { css } from 'styled-components'
import { lighten } from 'polished'

export const CartContainer = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;

  .right-container {
    background-color: ${props => props.theme.colors.grayDividerColor};
  }

  .right-wrapper {
    min-height: 80vh;
    padding: 20px 30px 20px;

    h2 {
      margin: 0 0 40px;
    }
  }

  .left-wrapper {
    padding: 20px 20px 20px 20px;
  }

  @media (min-width: 768px) {
    flex-direction: row;
    justify-content: space-between;
    > div {
      width: 50%;
    }
  }

  @media (min-width: 986px) {
    .left-wrapper {
      padding: 20px 20px 20px 50px;
    }
    .right-wrapper {
      padding: 20px 50px 20px 30px;
    }
  }
`

export const OrderBill = styled.div`
  display: flex;
  align-items: center;
  flex-direction: column;
  padding: 10px 0px;
  background-color: ${isCheckout => isCheckout ? 'transparent' : '#FFF'};
  table {
    border-spacing: 0px 10px;
    width: 100%;
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
    .add-divider {
      td {
        border-bottom: 1px solid #EAEAEA;
        padding-bottom: 10px;
      }
    }
  }
  table.total {
    margin-top: 50px;
    border-top: 1px solid #EAEAEA;
    padding-top: 10px;
    tr {
      td {
        font-weight: bold;
        color: ${props => props.theme.colors.darkTextColor};
        font-size: 14px;
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

export const CouponContainer = styled.div`
  width: 100%;
  margin: 10px;

  input, button {
    border-radius: 7.6px;
  }
`

export const Divider = styled.div`
  background: ${props => props.theme.colors.grayDividerColor};
  height: 8px;
  width: 100%;
  margin-left: 0;
`

export const Exclamation = styled.div`
  position: relative;
  display: inline-flex;
  cursor: pointer;
  margin-left: 5px;
  top: 3px;
`

export const Spinner = styled.div`
  position: absolute;
  top: 0;
  right: 0;
  transform: translate(-20%, 15%);
`

export const CommentContainer = styled.td`
  position: relative;
  .spinner-content > div{
    width: 50px !important;
    height: 50px !important;
  }
`

export const IconContainer = styled.div`
  position: relative;
  display: inline-flex;
  cursor: pointer;
  margin-left: 5px;
  height: 20px;
  svg:nth-child(1){
    position: relative;
    top: -1px;
  }
  svg:nth-child(2){
    position: relative;
    top: -3px;
  }
`

export const SavedContainer = styled.span`
  margin-top: 10px;
  font-size: 20px;
  font-weight: bold;
  color: ${props => props.theme?.colors?.primaryContrast};
  background: ${props => lighten('0.2', props.theme?.colors?.primary)};
  padding: 5px 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
`

export const SpotSelect = styled.select`
  ${({ isCheckout }) => isCheckout
? css`
    background: ${props => props.theme?.colors.backgroundPage};
  `
: css`
    background: ${props => props.theme?.colors.grayDividerColor};
  `}
  border-radius: 7.6px;
  height: 25px;
  border: none;
  font-size: 12px;
  outline: none;
  margin: 0 5px 0 15px;
  padding: 0 3px;
  cursor: pointer;
  -moz-appearance: none;
  -webkit-appearance: none;
  -ms-progress-appearance: none;

  ${props => props.theme.rtl && css`
    margin: 0 15px 0 5px;
  `}
`
export const NoValidProductMessage = styled.p`
  font-size: 14px;
`

export const SpinnerCart = styled.div`
  position: absolute;
  right: 0;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  ${({ emptyCart }) => emptyCart && css`
    top: 0;
  `}
`

export const WarningText = styled.p`
  margin: 10px auto;
  text-align: center;
  color: ${props => props.theme.colors.primary};
`

export const LineDivider = styled.p`
  background: ${props => props.theme.colors.gray200};
  height: 1px;
  width: calc(100% + 33vw);
  margin: 15px 0;

  @media (min-width: 576px) {
    width: calc(100% + 35vw);
  }

  @media (min-width: 768px) {
    width: calc(96% + 18vw);
  }

  @media (min-width: 1400px) {
    width: calc(98% + 18vw);
  }
`

export const LoyaltyContainer = styled.div`
  display: flex;
  justify-content: center;
  background-color: ${props => props.theme.colors.white};
  margin-top: 40px;
  padding: 20px;
  align-items: center;
  max-width: 440px;
  height: 73px;
  border-radius: ${props => props.theme?.utils.radius?.m}px;
  box-shadow: 0px 1px 4px 0px rgba(0, 0, 0, 0.1);

  .icon {
    color: ${props => props.theme.colors.yellow};
    font-size: 45px;
    margin-top: 20px;
    padding-right: 30px;
    transform: rotate(15deg);
  }

  span {
    font-size: 15px;
    font-weight: 700;
  }

  .red {
    color: ${props => props.theme.colors.primary};
  }
`
export const AddMoreProducts = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  margin-top: 20px;
  button {
    height: 50px;
    width: 100%;
  }
  button.add {
    margin-bottom: 10px;
    background: ${({ theme }) => theme?.colors?.white};
    border: 1px solid ${({ theme }) => theme?.colors?.primary};
    color: ${({ theme }) => theme?.colors?.primary};
  }

  @media (min-width: 768px) {
    flex-direction: row;
    button:nth-child(2):last-child {
      max-width: 350px;
    }
    button.add {
      min-width: max-content;
      margin-right: 10px;
      margin-bottom: 0px;
      max-width: 350px;
    }
  }
`
