import styled, { css } from 'styled-components'
import React from 'react'

export const OrderTypeSelectorContainer = styled.div`
  padding: 0px 10px;
  display: flex;
  justify-content: center;
  max-width: 380px;
  margin: 0 auto;

  > *:first-child {
    border-radius: 10px 0px 0px 10px;
  }
  > *:nth-child(2) {
    border-radius: 0px 10px 10px 0px;
  }

  button {
    display: flex;
    justify-content: space-between;
    align-items: center;
    color: ${({ theme }) => theme?.colors?.primary};
    background: transparent;
    border-color: ${({ theme }) => theme?.colors?.primary};
    height: 50px;
    flex: 1;
    font-weight: 600;
    padding-right: 20px;
    p {
      text-align: center;
      margin: 0 auto
    }
  }

  .selected {
    background: ${({ theme }) => theme?.colors?.primary};
    border-color: ${({ theme }) => theme?.colors?.primary};
    color: ${({ theme }) => theme?.colors?.primaryContrast};
    img {
      filter: invert(1);
    }
  }

  @media (min-width: 768px) {
    width: 500px;
  }
`

export const OrderTypeListItemContainerStyled = styled.div`
  border-radius: ${({ theme }) => theme?.utils?.radius.m}px;
  margin-bottom: 25px;
  padding: 30px;
  cursor: pointer;
  position: relative;
  opacity: 0.3;

  ${({ bgimage }) => bgimage && css`
    background-repeat: no-repeat, repeat;
    background-size: cover;
    object-fit: cover;
    background-position: center;
  `}

  ${({ active }) => active && css`
    opacity: 1;
  `}
`

export const OrderTypeListItemContainer = (props) => {
  const style = {}
  style.backgroundImage = `url(${props.bgimage})`

  return (
    <OrderTypeListItemContainerStyled {...props} style={style}>
      {props.children}
    </OrderTypeListItemContainerStyled>
  )
}

export const OrderTypeOverlay = styled.div`
  position: absolute;
  left: 0px;
  top: 0px;
  width: 100%;
  height: 100%;
  border-radius: ${({ theme }) => theme?.utils?.radius.m}px;
  background: #000000;
  opacity: 0.3;
  z-index: initial;
`

export const OrderTypeTitle = styled.h2`
  font-weight: 600;
  font-size: ${({ theme }) => theme?.utils?.tsize?.xs + 'px'};
  color: ${({ theme }) => theme?.colors?.white};
  margin-top: 0;
  margin-bottom: 5px;
  z-index: 2;
  position: relative;
`

export const OrderTypeDescription = styled.p`
  font-size: ${({ theme }) => theme?.utils?.tsize?.xs + 'px'};
  color: ${({ theme }) => theme?.colors?.white};
  margin-top: 0;
  margin-bottom: 17px;
  z-index: 2;
  position: relative;
`

export const OrderStartWrapper = styled.div`
  display: flex;
  align-items: center;
  user-select: none;
  cursor: pointer;
  z-index: 2;
  position: relative;

  span {
    font-size: ${({ theme }) => theme?.utils?.tsize?.xs + 'px'};
    color: ${({ theme }) => theme?.colors?.white};
    ${props => props.theme?.rtl
    ? css`
      margin-left: 10px;
    `
    : css`
      margin-right: 10px;
    `}
  }

  svg {
    font-size: ${({ theme }) => theme?.utils?.tsize?.s + 'px'};
    color: ${({ theme }) => theme?.colors?.white};
  }
`

export const OrderTypeListTitle = styled.h1`
  text-align: center;
  font-weight: 600;
  font-size: ${({ theme }) => theme?.utils?.tsize?.l + 'px'};
  color: ${props => props.theme.colors.darkTextColor};
  margin: 0 0 30px;

  @media (max-width: 450px) {
    padding-left: 30px;
    ${props => props.theme.rtl && css`
      padding-right: 30px;
      padding-left: 0;
    `}
  }
`

export const OrderTypesContainer = styled.div`
  text-align: center;
  padding: 10px 0px;

  h2 {
    font-size: ${({ theme }) => theme?.utils?.tsize?.l + 'px'};
    font-weight: 700;
    margin: 0px;
  }
  h3 {
    margin-top: 0px;
    font-size: 18px;
    font-weight: 400;
  }

  @media (min-width: 1200px) {
    display: flex;
    flex-direction: column;
    align-items:  center;
    position: relative;

    h2 {
      font-size: 46px;
    }

    h3 {
      font-size: ${({ theme }) => theme?.utils?.tsize?.l + 'px'};
    }
  }
`
export const MoreOrderTypeSelectorContainer = styled.div`
  padding: 30px 0px 0px 0px;
  margin: auto;
  max-width: 500px;

  .more-order-type-wrapper {
    display: flex;
    justify-content: space-evenly;
  }

  button {
    display: flex;
    color: ${({ theme }) => theme?.colors?.lightGray};
    background: ${({ theme }) => theme?.colors?.grayDividerColor};
    border-color: transparent;
    width: 110px;
    height: 35px;
    font-weight: 600;
    padding-left: 10px;
    padding-right: 10px;
    p {
      text-align: center;
      margin: auto
    }
  }

  .selected {
    background: ${({ theme }) => theme?.colors?.primary};
    border-color: ${({ theme }) => theme?.colors?.primary};
    color: ${({ theme }) => theme?.colors?.primaryContrast};
    img {
      filter: invert(1);
    }
  }

  @media (min-width: 1200px) {
    width: 500px;
  }
`

export const AddressMenu = styled.div`
  display: flex;
  flex-direction: column;
  background-color: ${props => props.theme.colors.grayDividerColor};
  border-radius: ${props => props?.theme?.utils?.radius?.m}px;
  span {
    padding-left: 20px;
    text-align: left;
    display: -webkit-box;
    -webkit-line-clamp: 1;
    -webkit-box-orient: vertical;
    overflow: hidden;
    font-size: ${props => props.theme?.utils?.tsize?.m + 'px'};
    font-weight: 600;
  }
  svg {
    color: ${({ theme }) => theme?.colors?.lightGray};
    position: relative;
    margin-right: 20px;
    margin-left: 10px;
    top: 1px;
  }

  > div {
    display: flex;
    align-items: center;
    justify-content: space-between;
    span {
      font-size: ${props => props.theme?.utils?.tsize?.s + 'px'};
      font-weight: 400;
    }
  }
`

export const AddressOrderTypeWrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: normal;
  background-color: ${props => props.theme.colors.grayDividerColor};
  min-height: 100px;
  border-radius: ${props => props.theme?.utils?.radius.m}px;
  padding: 10px 20px;

  @media (min-width: 578px) {
    flex-direction: row;
    align-items: center;
  }

  @media (min-width: 768px) {
    padding: 0px 40px;
  }
`

export const AddressContainer = styled.div`
  display: flex;
  cursor: pointer;

  svg {
    min-width: max-content;
    padding-top: 5px;
  }
`
