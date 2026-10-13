import styled, { css } from 'styled-components'

export const ProductsContainer = styled.div`
  width: 95%;
  margin: 20px auto 0px;
  > svg {
    color: ${props => props.theme.colors.headingColor};
    font-size: 24px;
    cursor: pointer;
    margin-bottom: 5px;
  }
  > div {
    background-color: ${(props) => props.theme?.colors?.backgroundPage};
  }

`

export const ProductLoading = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
`

export const SkeletonItem = styled.div`
  width: 80%;
  margin: 30px auto;

  span {
    margin-bottom: 10px;
  }
`
export const MobileCartViewWrapper = styled.div`
  position: fixed;
  width: 100vw;
  left: 0;
  bottom: 0;
  background-color: ${props => props.theme.colors.white};
  padding: 15px 25px;
  display: flex;
  flex-direction: column;
  gap: 10px;
  box-sizing: border-box;
  z-index: ${props => props?.theme?.utils?.zi?.l};
  box-shadow: 0px 4px 10px rgb(0 0 0 / 12%);
`

export const MobileCartActions = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;

  span {
    font-weight: 600;
    font-size: ${props => props.theme.utils.tsize.s}px;

    @media (min-width: 1200px) {
      font-size: 18px;
      padding-left: 20px;
    }
  }

  button {
    height: 44px;
    border-radius: ${props => props.theme?.utils.radius.m}px;
  }
`

export const BusinessCartContent = styled.div`
  background: ${props => props.theme.colors.white};
  padding: 30px;
  position: relative;
  margin-bottom: 30px;
  ${({ maxHeight }) => maxHeight && css`
    max-height: ${maxHeight}px;
  `}
  overflow: auto;

  .product.accordion {
    margin: 0;
  }

  /* .accordion.active {
    padding-bottom: 10px;
  } */

  ${({ isModal }) => !isModal && css`
    border: 1px solid #E9ECEF;
    box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.12);
    border-radius: ${props => props.theme?.utils.radius.m}px;
  `}

  @media (min-width: 1200px) {
    position: sticky;
    top: 0;
  }

  @media (min-width: 768px) {
    padding: 35px 30px;
  }
`

export const EmptyCart = styled.div`
  min-height: 320px;

  .empty-content {
    display: flex;
    flex-direction: column;
    align-items: center;

    h2 {
      font-size: ${props => props.theme.utils.tsize.l}px;
      color: ${props => props.theme.colors.darkTextColor};
      font-weight: 600;
    }

    svg {
      margin-left: 10px;
      font-size: 100px;
      color: ${props => props.theme.colors.darkTextColor};
    }

    p {
      font-size: ${props => props.theme.utils.tsize.xs}px;
      color: ${props => props.theme.colors.darkTextColor};
      margin: 23px 0 0 0;
    }

    .empty-cart {
      padding-top: 40px;
    }
  }
`

export const Title = styled.h1`
  font-weight: 600;
  font-size: ${props => props.theme.utils.tsize.m}px;
  color: ${props => props.theme.colors.darkTextColor};
  margin-bottom: 18px;
`
export const AddressOrderTypeContainer = styled.div`
`

export const SpinnerCart = styled.div`
  position: absolute;
  right: 0;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
`
