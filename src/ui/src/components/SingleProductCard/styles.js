import React from 'react'
import styled, { css } from 'styled-components'

export const CardContainer = styled.div`
  ${({ isShowAddButt }) => css`
    min-height: ${isShowAddButt ? '162px' : '110px'};
  `}
  background: ${({ soldOut, theme }) => soldOut ? '#6c757d33' : theme?.colors?.backgroundPage};
  padding: 10px;
  margin: 10px;
  border-radius: ${props => props?.theme?.utils?.radius?.m}px;
  box-sizing: border-box;
  display: flex;
  align-items: center;
  flex-direction: column;
  cursor: pointer;
  position: relative;
  box-shadow: 0px 1px 4px 0px #0000001A;

  > div {
    display: flex;
    justify-content: space-between;
    ${({ theme, isImageRight }) => (theme?.business_view?.components?.products?.components?.product?.components?.image?.position === 'right' || isImageRight)
      ? css`
        flex-direction: row;
      `
      : css`
        flex-direction: row-reverse;
      `
    }
    align-items: flex-start;
    width: 100%;
  }

  .wrapper-price-add {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
  }

  button {
    width: 100%;
    margin-top: 10px;
    padding: 4px;
  }
  ${({ productsRows }) => productsRows
    ? css`
        width: ${() => productsRows === 3 ? 'calc(33% - 20px)' : 'calc(50% - 20px)'};
        margin: 10px 0;
      `
    : css`
        width: 100%;
        margin: 10px;
        @media (min-width: 576px) {
          margin: 10px;
          width: calc(100% - 20px);
        }
        ${({ isCartOnProductsList }) => isCartOnProductsList
          ? css`
            @media (min-width: 993px) {
              width: calc(50% - 20px);
              margin: 10px 20px 10px 0px;
              ${props => props.theme?.rtl && css`
                margin: 10px 0px 10px 20px;
              `}
            }
          `
          : css`
            @media (min-width: 681px) {
              justify-content: space-between;
              width: calc(49% - 20px);
            }
            ${({ showFirstCategories }) => showFirstCategories
              ? css`
                @media (min-width: 1100px) {
                  width: calc(33% - 20px);
                  margin: 10px 20px 10px 0px;
                  ${props => props.theme?.rtl && css`
                    margin: 10px 0px 10px 20px;
                  `}
                }
                @media (min-width: 1440px) {
                  width: calc(25% - 20px);
                  margin: 10px 20px 10px 0px;
                  ${props => props.theme?.rtl && css`
                    margin: 10px 0px 10px 20px;
                  `}
                }
              `
              : css`
                @media (min-width: 1440px) {
                  width: calc(33% - 20px);
                  margin: 10px 20px 10px 0px;
                  ${props => props.theme?.rtl && css`
                    margin: 10px 0px 10px 20px;
                  `}
                }
              `}
          `}

      `}

  ${({ showFirstCategories }) => showFirstCategories && css`
    padding: 0px;

    .title-add-icon {
      width: 100%;
      display: flex;
      justify-content: center;
      align-items: center;
      background-color: ${props => props.theme.colors.primary};
      padding: 5px 0px 5px;
      min-height: 45px;
      border-radius: 0px 0px 20px 20px;

      h1 {
        font-size: 22px;
        font-weight: 400;
        margin: 0px 0px 0px 15px;
        width: 100%;
        text-overflow: ellipsis;
        white-space: nowrap;
        overflow: hidden;
        white-space: normal;
        display: -webkit-box;
        -webkit-line-clamp: 1;
        -webkit-box-orient: vertical;
        color: ${props => props.theme.colors.primaryContrast};
      }
      svg {
        color: ${props => props.theme.colors.primaryContrast};
        font-size: 40px;
        margin-right: 10px;
      }
    }
  `}
`

export const SoldOut = styled.span`
  font-weight: bold;
  position: absolute;
  background: #495057 0% 0% no-repeat padding-box;
  padding: 5px 10px;
  top: 7px;
  border-radius: 2px 0px 0px 2px;
  right: 0px;
  color: white;
  font-size: 12px;
  ${props => props.theme?.rtl && css`
    left: 0px;
    right: initial;
  `}
  &:first-letter {
    text-transform: uppercase;
  }

  ${({ isBottom }) => isBottom && css`
    bottom: 7px;
    top: initial;
  `}
`

export const CardInfo = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  min-height: ${({ isFavorite }) => isFavorite ? '120' : '140'}px;

  ${({ minHeight }) => minHeight && css`
    min-height: ${({ minHeight }) => minHeight};
  `}

  ${({ isBgimage }) => css`
    width: ${isBgimage ? 'calc(100% - 90px)' : '100%'};
  `}
  > * {
    margin: 3px;
  }
  p {
    color: ${props => props.theme?.colors.darkGray};
    text-align: left;
    font-size: 10px;
    ${props => props.theme?.rtl && css`
      text-align: right;
    `}

    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 3;
    overflow: hidden;
    white-space: pre-wrap;
  }

  span {
    color: ${props => props.theme.colors.darkTextColor};
    font-size: 14px;
  }

  ${({ oneLine }) => oneLine && css`
    p {
      -webkit-line-clamp: 1;
    }
  `}

  @media (min-width: 1024px) {
    p {
      font-size: 12px;
    }

    span {
      font-size: 14px;
    }
  }
`

export const WrapLogo = styled.div`
  position: relative;
  max-width: 140px;
  max-height: 140px;
  height: 140px;
  ${({ isBgimage }) => isBgimage && css`
    width: 140px;
  `}
  ${({ isFavorite }) => isFavorite && css`
    height: 120px;
    .image {
      min-height: 120px;
    }
  `}

  ${({ minHeight }) => minHeight && css`
    height: ${({ minHeight }) => minHeight};
    .image {
      min-height: ${({ minHeight }) => minHeight};
    }
  `}
  ${({ theme }) => theme?.business_view?.components?.products?.components?.product?.components?.image?.position === 'right'
    ? css`
    margin-right: 5px;
  `
    : css`
    margin-left: 5px;
  `}
  ${props => props.theme?.rtl && css`
    margin-right: 5px;
    margin-left: 0px;
  `}

  ${({ showFirstCategories }) => showFirstCategories && css`
    width: 100%;
    max-width: 100%;
    margin-left: 0px;
    margin-right: 0px;
  `}
`

export const WrapTags = styled.div`
  display: flex;
  margin-left: 10px;
  margin-right: 10px;
  overflow-x: auto;

  ${({ isBgimage }) => isBgimage && css`
    width: 50px;
  `}
  ${props => props.theme?.rtl && css`
    margin-right: 5px;
    margin-left: 0px;
  `}

  div {
    display: flex;
    margin: auto;
  }
  ::-webkit-scrollbar {
    display: none;
  }

  img {
    width: 30px;
    height: 30px;
    margin-right: 5px;
  }
`

const CardLogoStyled = styled.div`
  box-sizing: border-box;
  position: relative;
  background-repeat: no-repeat, repeat;
  background-size: cover;
  background-position: center;
  object-fit: cover;
  min-height: 140px;
  border-radius: 10px;

  ${({ showFirstCategories }) => showFirstCategories && css`
    border-radius: 10px 10px 0px 0px;
  `}
`
export const CardLogo = (props) => {
  const style = {}
  if (props.bgimage) {
    style.backgroundImage = `url(${props.bgimage})`
  }
  if (props.soldOut) {
    style.filter = 'brightness(70%)'
  }
  return (
    <CardLogoStyled {...props} style={style}>
      {props.children}
    </CardLogoStyled>
  )
}

export const PriceWrapper = styled.div`
  display: flex;
  align-items: center;

  .current-price {
    font-size: 14px;
    color: ${props => props.theme.colors.primary};
    min-width: 64px
  }
  .off-price {
    font-size: 10px;
    color: ${props => props.theme?.colors.darkGray};
    margin-left: 5px;
    text-decoration: line-through;
    ${({ isOffPrice }) => isOffPrice && css`
      min-width: 46px;
    `}
    ${props => props.theme.rtl && css`
      margin-right: 5px;
      margin-left: 0;
    `}

    @media (min-width: 1024px) {
      font-size: 13px;
      ${({ isOffPrice }) => isOffPrice && css`
        min-width: 64px;
      `}
    }
  }
`

export const QuantityContainer = styled.div`
  background: ${({ theme }) => theme.colors.primary};
  color: ${({ theme }) => theme.colors.primaryContrast};
  position: absolute;
  left: 100%;
  bottom: 98%;
  width: 25px;
  height: 25px;
  text-align: center;
  border-radius: 50%;
  transform: translate(-20px, 50%);
  z-index: 999;
  display: flex;
  justify-content: center;
  align-items: center;

  @media (min-width: 768px) {
    transform: translate(-50%, 50%);
  }
`

export const RibbonBox = styled.div`
  position: absolute;
  padding: 2px 8px;
  box-sizing: border-box;
  z-index: 10;
  color: ${props => props.theme.colors.colorTextSignForm};
  font-weight: 400;
  font-size: 10px;
  line-height: 13px;
  top: -4px;
  right: ${({ productAddedToCartLength }) => productAddedToCartLength ? '15px' : '-3px'};
  background-color: ${props => props.theme.colors.primary};
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  overflow: hidden;
  max-width: 70px;
  word-break: break-all;

  ${props => props.theme.rtl && css`
    left: -3px;
    right: initial;
  `}

  ${({ bgColor }) => bgColor && css`
    background-color: ${bgColor};
  `}

  ${({ isRoundRect }) => isRoundRect && css`
    border-radius: ${props => props?.theme?.utils?.radius?.m}px;
  `}

  ${({ isCapsule }) => isCapsule && css`
    border-radius: 50px;
  `}
`

export const LastOrder = styled.span`
  color: ${props => props.theme.colors.primary};
  font-weight: 400;
  font-size: 10px !important;
  margin: 0px 3px;
`

export const TitleWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;

  h1 {
    font-size: 16px;
    font-weight: 500;
    text-align: left;
    color: ${props => props.theme.colors.headingColor};
    margin: 0px;
    white-space: pre-wrap;
  }
  p {
    font-size: 14px;
  }

  .wrapper-title {
    display: flex;
    justify-content: space-between;
    > span {
      padding: 0px 25px;
      display: flex;
      align-items: flex-start;
      justify-content: center;
      cursor: pointer;
      svg {
        color: ${props => props.theme.colors.danger500};
        font-size: 16px;
      }
    }
  }

  .title-description {
    display: flex;
    flex-direction: column;

    ${({ isFavorite }) => isFavorite && css`
      width: 100%;
    `}
  }
`
export const SkeletonCardInfo = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  width: calc(100% - 90px);
  > * {
    margin: 3px;
  }
`
export const SkeletonCardLogo = styled.div`
  max-width: 86px;
  max-height: 86px;
  width: 86px;
  height: 86px;

  margin-left: 5px;
  ${props => props.theme?.rtl && css`
    margin-right: 5px;
    margin-left: 0px;
  `}
`
