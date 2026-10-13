import styled, { css } from 'styled-components'

export const FormStripe = styled.form`
  display: flex;
  flex-direction: column;
  min-height: 550px;
  justify-content: space-between;
  .StripeElement,
  .StripeElementIdeal {
    display: block;
    padding: 10px 14px;
    box-shadow: rgba(50, 50, 93, 0.14902) 0px 1px 3px,
      rgba(0, 0, 0, 0.0196078) 0px 1px 0px;
    border-radius: 4px;
    background: white;
    margin-top: 15px;
  }

  .StripeElement--focus,
  .StripeElementIdeal--focus {
    box-shadow: rgba(50, 50, 93, 0.109804) 0px 4px 6px,
      rgba(0, 0, 0, 0.0784314) 0px 1px 3px;
    -webkit-transition: all 150ms ease;
    transition: all 150ms ease;
  }

  .StripeElement.loading {
    height: 41.6px;
    opacity: 0.6;
  }

  .StripeElementIdeal {
    padding: 0;
  }
`
const GeneralStyles = styled.div`
  margin-top: 20px;
  color: ${(props) => props.theme.colors?.headingColor};
`
export const CardExpiryField = styled(GeneralStyles)`
`

export const CardCvcField = styled(GeneralStyles)`
`

export const CardZipcodeField = styled(GeneralStyles)`
`

export const CardNumberField = styled(GeneralStyles)`
  width: 100%;
`
export const CardExpiryCvcField = styled(GeneralStyles)`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  grid-gap: 10px;
`

export const FormRow = styled.div`
  input {
    display: block;
    border: none;
    font-size: 18px;
    margin: 10px 0 20px 0;
    max-width: 100%;
    padding: 10px 14px;
    box-shadow: rgba(50, 50, 93, 0.14902) 0px 1px 3px,
      rgba(0, 0, 0, 0.0196078) 0px 1px 0px;
    border-radius: 4px;
    background: white;
    color: #424770;
    letter-spacing: 0.025em;
    width: 500px;
  }

  input::placeholder {
    color: #aab7c4;
  }
`

export const ErrorMessage = styled.div`
  font-size: 16px;
  font-weight: bold;
  margin-top: 10px;
  margin-bottom: 20px;
  color: #D81212;
  margin: 10px 0px 0px 10px;
  ${props => props.theme?.rtl && css`
    margin: 10px 10px 0px 0px
  `}
`

export const FormActions = styled.div`
  width: 100%;
  margin-top: 20px;

  button {
    height: 50px;
    width: 100%;
    border-radius: 7.6px;

    &:disabled {
      opacity: 0.5;
    }
  }
`

export const ZipcodeField = styled.input`
  font-weight: 500;
  font-size: 16px;
  box-sizing: border-box;
  width: 100% !important;
  &:-webkit-autofill {
    color: '#fce883'
  }
  &::placeholder {
    font-weight: 500
  }
  &:focus(){
    box-shadow: rgba(50, 50, 93, 0.109804) 0px 4px 6px,
      rgba(0, 0, 0, 0.0784314) 0px 1px 3px;
    -webkit-transition: all 150ms ease;
    transition: all 150ms ease;
  }

  &::-webkit-outer-spin-button,
  &::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }

  /* Firefox */
  &[type=number] {
    -moz-appearance: textfield;
  }

`
