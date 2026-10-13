import styled, { css } from 'styled-components'
import { darken } from 'polished'

export const AddressListContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
  padding: 0;
  @media (min-width: 768px) {
    padding: 0px;
  }
  ${({ isProfile }) => !isProfile && css`
    width: 100%;
  `}

  ${({ isLoading }) => isLoading && css`
    pointer-events: none;
  `}

  button.add {
    height: 50px;
  }
  button.left-side {
    align-self: flex-start;
    padding-left: 0px;
  }
`

export const AddressListUl = styled.ul`
  display: flex;
  flex-direction: column;
  padding: 0px;
  margin-top: 40px;

  ${({ isProfile }) => isProfile && css`
    width: 100%;
  `}
`

export const AddressItem = styled.li`
  min-height: 80px;
  border-radius: ${props => props?.theme?.utils?.radius?.m}px;
  box-shadow: 0px 1px 4px 0px rgba(0, 0, 0, 0.1);
  padding: 10px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;

  label {
    font-size: 15px;
    margin-left: 5px;
    font-weight: bold;
    ${props => props.theme?.rtl && css`
      margin-right: 5px;
      margin-left: 0;
  `}
  }

  .wrapAddress {
    display: flex;
    align-items: center;

    span {
      font-size: 14px;
      display: flex;
      cursor: pointer;
      margin-right: 10px;
      ${props => props.theme?.rtl && css`
        margin-left: 10px;
        margin-right: 0px;
      `}
      &.radio {
        color: ${props => props.theme.colors.lightGray};
        font-size: 20px;

        > svg.address-checked {
          color: ${props => props.theme.colors.primary};
        }
      }

      &.selected-tag {
        > svg {
          color: ${props => props.theme.colors.primary};
        }
      }

      &.tag {
        font-size: 24px;
        color: ${props => props.theme.colors.lightGray};
      }

      @media (min-width: 768px) {
        font-size: 16px;
      }
    }
  }

  .address {
    display: flex;
    flex-direction: column;
    line-height: 1.5;
    font-size: ${props => props.theme.utils.tsize.xxs}px;
    span {
      opacity: 0.5;
      text-align: left;
      display: -webkit-box;
      -webkit-line-clamp: 1;
      -webkit-box-orient: vertical;
      overflow: hidden;
    }
    span:first-child {
      color: ${props => props.theme.colors.darkTextColor};
      font-size: ${props => props.theme.utils.tsize.s}px;
      font-weight: 800;
      opacity: 1;
    }
  }
`

export const AddressItemActions = styled.div`
  display: flex;
  align-items: center;
  padding-right: 10px;
  a {
    display: flex;
    cursor: pointer;
    margin: 0px 5px;
    font-size: 20px;

    svg {
      color: #B1BCCC;
    }
  }
  .red-trash {
     svg {
      color: ${props => props.theme.colors.primary};
    }
  }
  a.disabled {
    svg {
      color: #CCC;
    }
    pointer-events: none;
  }
`

export const WrappNotAddresses = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 80%;
  margin: 20px auto 10px;

  ${({ isCustomerMode }) => isCustomerMode
? css`
    min-height: 200px;
    height: 200px;
  `
: css`
    height: 350px;
  `}

  img {
    width: 200px;
    height: auto;
    aspect-ratio: attr(width) / attr(height);
  }
  h1 {
    margin: 5px 0px 0px;
    opacity: 0.5;
    text-align: center;
    font-size: 24px;
  }
`

export const FormActions = styled.div`
  padding: 10px 0px;
  display: flex;
  justify-content: space-between;
  width: 100%;
  button {
    height: 45px;
    flex: 1;

    &:last-child#second-btn {
      margin-left: 10px;
      ${props => props.theme?.rtl && css`
        margin-left: 0;
        margin-right: 10px;
      `}
    }
  }

  @media (min-width: 769px) {
    button {
      &:last-child#second-btn {
        margin-left: 25px;
        ${props => props.theme?.rtl && css`
          margin-left: 0;
          margin-right: 25px;
      `}
      }
    }
  }
`

export const ContinueButton = styled.div`
  width: 100%;
  position: sticky;
  bottom: 1px;

  button {
    width: 100%;
    white-space: nowrap;
    height: 50px;
  }
`

export const AddressTitle = styled.span`
  font-size: 16px;
  margin-bottom: 25px;
  text-align: left;
  ${props => props.theme?.rtl && css`
    text-align: right;
  `}

  h3 {
    margin-bottom: 0px;
    font-weight: 800;
    font-size: ${props => props.theme.utils.tsize.m}px;
    color: ${props => props.theme.colors.darkTextColor};
  }
`

export const AddressHalfContainer = styled.div`
  display: flex;
  justify-content: center;
  width: 100%;
`

export const List = styled.div`
  width: ${({ halfWidth }) => halfWidth ? '50%' : '100%'};

  button {
    width: 100%;
  }
`

export const AddressFormContainer = styled.div`
  width: ${({ isHideTitle }) => !isHideTitle ? '50%' : '100%'};
  margin-top: 20px;
  position: sticky;
  right: 0;
  top: 0;
  height: 100%;
  ${({ isHideTitle }) => isHideTitle
  ? css`
    max-width: 500px;
  `
  : css`
    padding-left: 10px;
  `}
`

export const CloseIcon = styled.div`

  font-size: 30px;
  cursor: pointer;
  z-index: 2;
  ${props => props.theme?.rtl && css`
    right: 25px;
    left: initial;
  `}
  ${({ isProductForm }) => isProductForm && css`
    top: 18px;
  `}
  svg{
    transition: all .2s ease-in;

    &:hover {
      background-color: #1507260a;

      > svg {
        color:  #151b26;
      }
    }

    &:active {
      background-color: ${() => darken(0.07, '#CCC')};
    }

    border-radius: 50%;
  }
`

export const TitleFormContainer = styled.div`
  display: flex;
  align-items: flex-start;
  h1 {
    margin: 0 auto;
    font-size: 24px;
  }
`
export const AddButonWrapper = styled.div`
  margin-top: 40px;
  width: fit-content;
  margin-bottom: 10px;

  button {
    display: flex;
    align-items: center;
    padding: 5px;
  }
`

export const TitleAddress = styled.h1`
  text-align: center;
  margin: auto;
  font-size: 24px;
  margin-bottom: 20px;
`
