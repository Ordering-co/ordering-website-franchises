import React from 'react'
import styled, { css } from 'styled-components'

export const AccordionSection = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  padding: 15px 0px;
  box-sizing: border-box;
  background: ${isCheckout => isCheckout ? 'transparent' : '#FFF'};

  ${({ isOrderDetails }) => isOrderDetails && css`
    padding: 20px 0px;
    border-top: 1px solid ${props => props.theme.colors.gray200};
    border-bottom: 1px solid ${props => props.theme.colors.gray200};
    p {
      font-size: ${({ theme }) => theme?.utils?.tsize?.s}px !important;
      font-weight: 400 !important;
      color: ${props => props.theme.colors.darkTextColor};
    }
  `}
`

export const ProductContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  padding: 15px 10px 15px 15px;
  box-shadow: 0px 1px 4px 0px rgba(0, 0, 0, 0.1);
  box-sizing: border-box;
  background: ${({ theme }) => theme?.colors?.white};
  border-radius: ${({ theme }) => theme.utils.radius.m}px;
  margin-bottom: 25px;
`

const AccordionStyled = styled.div`
  width: 80%;
  display: flex;
  flex-direction: row;
  align-items: flex-start;
  justify-content: space-between;
  cursor: pointer;
  transition: background-color 0.3s ease;

  .rotate {
    transform: rotate(180deg);
  }

  .accordion__icon {
    margin-left: 0;
    transition: transform 0.3s ease;
    ${props => props.theme?.rtl && css`
      margin-right: 0;
      margin-left: initial;
    `}
  }
`

export const Accordion = (props) => {
  const style = {}
  return (
    <AccordionStyled
      {...props}
      style={style}
    >
      {props.children}
    </AccordionStyled>
  )
}

export const WrapperProductImage = styled.div`
  max-width: 43px;
  max-height: 43px;
  height: 43px;
  width: 43px;
  min-width: 43px;
  min-height: 43px;
  border-radius: 10px;
  margin-right: 5px;
`

const ProductImageStyled = styled.div`
  display: flex;
  width: 100%;
  height: 100%;
  box-sizing: border-box;
  position: relative;
  background-repeat: no-repeat, repeat;
  background-size: cover;
  object-fit: cover;
  background-position: center;
  border-radius: 10px;
`

export const ProductImage = (props) => {
  return (
    <ProductImageStyled
      {...props}
      style={{ backgroundImage: `url(${props.bgimage})` }}
    >
      {props.children}
    </ProductImageStyled>
  )
}

export const ContentInfo = styled.div`
  width: 56%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  text-transform: capitalize;
  flex: 1;
  ${props => props.theme?.rtl && css`
    margin-right: 10px;
    margin-left: 0px;
  `}

  h3 {
    font-size: 14px;
    margin: 0px;
    font-weight: 600;
  }

  > div {
    display: flex;
    justify-content: flex-start;
    > p {
      font-size: 10px;
      color: ${props => props.theme?.colors.darkGray};
      overflow-wrap: break-word;
    }
  }

  span {
    display: flex;
    justify-content: space-between;
    margin: 0px;

    p {
      margin: 0px;
      font-size: 14px;
    }

    div {
      display: flex;

      span {
        height: 20px;
        svg {
          font-size: 20px;
          &:nth-child(1) {
            margin-right: 3px;
            ${props => props.theme?.rtl && css`
              margin-left: 3px;
              margin-right: 0px;
            `}
          }
        }
      }
    }
  }
`

export const AccordionContent = styled.div`
  overflow: hidden;
  transition: max-height 0.6s ease;
  width: 100%;
  margin: auto;

  @media (min-width: 481px) {
    width: 135%;
  }
`

export const AccordionText = styled.div`
  font-weight: 400;
  font-size: 14px;
  padding: 18px;
`

export const ProductComment = styled.div`
  p {
    margin: 0px;
    font-size: 10px;
  }

  h3 {
    font-size: 10px;
  }
`

export const ProductInfoWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  width: 100%;

  h1,
  h3 {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: pre-wrap;
  }

  p {
    margin: 0px;
  }

  ${({ isValid }) => !isValid && css`
    opacity: 0.5;
  `}

  .left-product-info {
    width: 70%;
  }

  .wrapper-product-image {
    height: 100%;
    width: 100%;
    min-height: 150px;
    min-width: 100px;
    border-radius: 10px;
    margin-right: 0px;

    @media (min-width: 500px) {
      min-width: 120px;
    }
    @media (min-width: 1024px) {
      min-width: 150px;
    }
    @media (min-width: 1200px) {
      min-height: 150px;
      min-width: 200px;
    }
  }

  .content-info {
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    text-transform: capitalize;
    padding: 0 30px 0 0px;
    ${props => props.theme?.rtl && css`
      margin-right: 10px;
      margin-left: 0px;
    `}

    h3 {
      font-size: ${({ theme }) => theme?.utils?.tsize?.s}px;
      margin: 0 0 10px 0;
      font-weight: 600;
    }

    span {
      display: flex;
      justify-content: space-between;
      margin: 0px;

      p {
        margin: 0px;
        font-size: 14px;
      }

      div {
        display: flex;

        span {
          height: 20px;
          svg {
            font-size: 20px;
            &:nth-child(1) {
              margin-right: 3px;
              ${props => props.theme?.rtl && css`
                margin-left: 3px;
                margin-right: 0px;
              `}
            }
          }
        }
      }
    }
  }

  .product-info-content {
    max-height: 82px;
    overflow: auto;
    p, span {
      font-weight: 400;
      font-size: 14px;
      color: ${props => props.theme?.colors.darkGray};
    }
    span {
      margin-left: 5px;
    }
  }

  .product-options {
    overflow: hidden;
    width: 100%;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    span {
      margin: 0px;
      white-space: normal;
    }

    span, p {
      font-size: 14px;
    }

    .ingredients {

      span {
        display: contents;
      }
    }
  }

  .price {
    width: 100%;
    display: flex;
    justify-content: space-between;
    padding-top: 10px;
    > div {
      display: flex;
    }
    p {
      font-size: 14px;
      color: ${props => props.theme.colors.primary};
      font-weight: 500;
    }

    span:first-child:nth-last-child(n+2) {
      margin-right: 35px;
    }
    span svg {
      font-size: 20px;
    }

    .pencil {
      cursor: pointer;
      color: ${props => props.theme.colors.lightGray};
    }

    .trash {
      cursor: pointer;
      color: ${props => props.theme.colors.primary};
    }
  }

`

export const ProductInfo = styled.div`
  display: flex;
  align-items: center;
  width: 100%;

  h1,
  h3 {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: pre-wrap;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 2;
  }

  p {
    margin: 0px;
  }

  ${({ isValid }) => !isValid && css`
    opacity: 0.5;
  `}

`

export const ProductInfoContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  width: 100%;
  .info-product {
    display: flex;
    flex-wrap: wrap;
    align-items: ${({ center }) => center ? 'center' : 'flex-start'};
  }
  .product-quantity {
    font-size: ${({ theme }) => theme?.utils?.tsize?.s}px;
    font-weight: 400 !important;
    color: ${({ theme }) => theme?.colors?.darkTextColor};
    padding-right: 10px;
  }

  ${({ orderCompleted }) => orderCompleted && css`
    .product-quantity {
      font-weight: 700 !important;
      font-size: ${(props) => props.theme?.utils?.tsize?.xs}px;
    }
    .title {
      font-weight: 400;
      font-size: ${(props) => props.theme?.utils?.tsize?.xs}px;
    }
  `}
`

export const ProductError = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;

  span {
    font-size: 18px;
    text-align: center;
  }

  @media (min-width: 411px){
    width: 35%;

    ${({ isStore }) => isStore && css`
      width: 100%;
    `}

    span{
      text-align: right;
    }
  }
`

export const ProductActions = styled.div`
  display: flex;
  justify-content: flex-end;
`

export const ProductActionsEdit = styled.span`
  svg {
    font-size: 16px;
    margin-right: 5px;
    cursor: pointer;
    ${props => props.theme?.rtl && css`
      margin-left: 5px;
      margin-right: 0px;
    `}
  }

  .pencil {
    color: ${props => props.theme.colors.darkPrimaryColor};
  }

  .trash {
    color: ${props => props.theme.colors.darkPrimaryColor};
  }
`

export const ProductActionsDelete = styled(ProductActionsEdit)`
  display: none;
  svg {
    margin-right: 0px;
  }

  .trash {
    color: ${props => props.theme.colors.primary};
  }

  @media (min-width: 411px){
    display: block;
  }
`

export const ProductPriceSection = styled.div`
  width: 25%;
  display: flex;
  flex-direction: column;
  align-items: flex-end;

  span {
    white-space: nowrap;
  }
`

export const ProductPrice = styled.div`
  width: 100%;
  display: flex;
  justify-content: flex-end;

  p,
  span {
    font-size: 14px;
  }

  span {
    font-weight: 500;
  }

  svg {
    cursor: pointer;
  }
`

export const ProductSelectWrapper = styled.div`
  position: relative;
  top: 2px;
  cursor: pointer;

  > svg {
    color: ${({ theme }) => theme?.colors?.primary};
    font-size: 16px;
  }
`

export const ProductSelect = styled.select`
  ${({ isCheckout }) => isCheckout
? css`
    background: ${props => props.theme?.colors.backgroundPage};
  `
: css`
    background: ${props => props.theme?.colors.grayDividerColor};
  `}
  border-radius: 7.6px;
  max-width: 35px;
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

export const ProductNotAvailable = styled.span`
  color: #D81212;
`

export const ProductOptionsList = styled.div`
  list-style-type: none;
  font-size: 10px;
  p {
    font-size: 10px;
  }
  .suboption {
  }

  p:nth-child(1) {
    margin-bottom: 0;
  }

  p {
    font-weight: 400;
    margin: 0px;
  }

  li span {
    font-weight: 300;
  }

  li.ingredient {
  }
`

export const ProductQuantity = styled.span`
  margin: 0 5px;
  font-size: 14px;
`

export const ScheduleInfoWrapper = styled.div`
  width: calc(100% - 65px);
  box-sizing: border-box;
  h3 {
    margin: 0px;
    font-size: 14px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  padding-left: 10px;
  ${props => props.theme.rtl && css`
    padding-left: 0px;
    padding-right: 10px;
  `}
`

export const ScheduleInfo = styled.div`
  span {
    font-weight: 400;
    font-size: 12px;
    line-height: 15px;
    color: ${props => props.theme.colors.darkGray};
  }
`

export const ProductInfoQuantity = styled.div`
  display: flex;
  justify-content: space-between;
  border-radius: 10px;
  width: ${({ $isOrderDetails }) => $isOrderDetails ? '15px' : 'fit-content'};
  max-width: ${({ $isOrderDetails }) => $isOrderDetails ? '15px' : '60px'};

  span svg {
    position: relative;
    top: 2px;
  }

  .trash {
    color: ${props => props.theme.colors.darkTextColor};
    cursor: pointer;
  }
`

export const Price = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  p {
    font-size: 12px;
    font-weight: 500;
  }
  span svg {
    font-size: 15px;
  }

  .pencil {
    color: ${props => props.theme.colors.darkPrimaryColor};
  }

  ${({ orderCompleted }) => orderCompleted && css`
    p {
      font-size: ${({ theme }) => theme?.utils?.tsize?.xs}px !important;
    }
  `}
`

export const ProductOption = styled.div`

`

export const ProductSubOption = styled.div`
  display: flex;
  flex-direction: row;
`

export const ProductContentInfo = styled.div`
  width: 75%;

  p, span {
    font-weight: 400;
    font-size: 10px;
    color: #909BA9;
  }
  span {
    margin-left: 5px;
  }
  ${({ isOrderSummary }) => isOrderSummary && css`

    h3 {
      -webkit-line-clamp: none;
      font-size: ${({ theme }) => theme?.utils?.tsize?.s}px;
    }

    .accordion-content {
      p, span {
        font-size: ${({ theme }) => theme?.utils?.tsize?.xs}px !important;
      }
    }
  `}

  ${({ activeAccordion }) => activeAccordion && css`
    .title {
      -webkit-line-clamp: none;
    }
  `}
`
