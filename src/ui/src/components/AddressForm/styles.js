import styled, { css } from 'styled-components'
import { darken } from 'polished'

export const FormActions = styled.div`
  margin-top: 35px;
  padding: 10px 0px;
  display: flex;
  justify-content: space-between;
  width: 100%;
  button {
    height: 44px;
    width: 100%;
    text-transform: lowercase;
    &:first-letter {
      text-transform: uppercase;
    }
  }
`

export const FormControl = styled.form`
  padding: 0px;
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  gap: 0px 10px;
  input {
    box-sizing: border-box;
    margin: 35px 0px;
    height: 50px;
    width: 100%;
    &.internal_number,
    &.zipcode {
      flex: auto;
      text-align: left;
    }
    &::placeholder{
      color: #CBCBCB
    }
  }

  textarea {
    background-color: ${props => props.theme.colors.white};
    width: 100%;
    margin: 10px 0;
    border-radius: ${props => props.theme?.utils.radius.m}px;
  }

  .input-autocomplete {
    font-weight: 500;
    width: 100%;
    background: #FFF;
    border: 0px solid #BBB;
    border-radius: 30px;
    font-size: 16px;
    padding: 7px 15px 7px 50px !important;
    height: 50px;
    outline: none;
    ::placeholder {
      color: ${props => props.theme.colors.darkGray};
    }

    &:-ms-input-placeholder {
      color: ${props => props.theme.colors.darkGray};
    }

    &::-ms-input-placeholder { /* Microsoft Edge */
      color: ${props => props.theme.colors.darkGray};
    }
    &:focus {
      border-color: ${() => darken(0.07, '#CCC')};
    }
  }

  .google-control {
    .gps-button {
      border-radius: ${props => props.theme?.utils.radius.m}px;
      background-color: ${props => props.theme.colors.grayDividerColor};
    }
    .search-icon {
      color: ${props => props.theme.colors.darkGray};
    }
    input {
      border-radius: ${props => props.theme?.utils.radius.m}px;
      background-color: ${props => props.theme.colors.grayDividerColor};
      &:focus {
        border: 0px solid ${props => props.theme.colors.primary};
      }
    }
  }

  .internal_number {
    background-color: ${props => props.theme.colors.white};
    width: 45%;
/*     ${props => props.theme?.rtl
? css`
      margin-left: 15px;
    `
: css`
      margin-right: 15px;
    `} */
  }

  .zipcode {
    width: 45%;
  }

  @media (min-width: 481px) {
    padding: 10px;
  }
`

export const AddressWrap = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: relative;
  margin-top: -11px;

  button {
    height: 41px;
    right: 1px;
    border: none;

    ${props => props.theme?.rtl && css`
      left: 1px;
      right: initial;
    `}

    svg {
      font-size: 18px;
    }
  }
`

export const WrapAddressInput = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  i {
    padding: 0px 10px;
  }

  svg {
    position: absolute;
    color: ${props => props.theme.colors.primary};
    top: 50px;
    left: 18px;
    font-size: 20px;
    ${props => props.theme?.rtl && css`
      right: 10px;
      left: initial;
    `}
  }

  input {
    background-position: left 10px center !important;
    background-repeat: no-repeat !important;
    background-size: 13px !important;
    padding: 7px 30px 7px 15px !important;
    ${props => props.theme?.rtl && css`
      padding: 7px 15px 7px 30px !important;
    `}
  }
`

export const AddressTagSection = styled.div`
  width: 100%;
  margin: 10px 10px;
  display: flex;
  justify-content: space-between;

  button {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 46px;
    height: 46px;
    border: none;
    color: #B1BCCC;

    img {
      width: 25px;
      height: 25px;
    }

    span {
      display: flex;
      justify-content: center;
      align-items: center;

      svg {
        font-size: 30px;
      }
    }
  }

  button.active {
    color: ${props => props.theme.colors.primary};
  }
`

export const WrapperMap = styled.div`
  width: 100%;
  height: 170px;
  > div {
    position: relative !important;
    width: 100% !important;
    height: 100% !important;
    border-radius: 15px;
  }
`

export const WrapperSkeleton = styled.div`
  display: flex;
  flex-direction: column;
  padding: 9px 10px;

  span {
    width: 100%;
  }
`
