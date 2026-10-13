import styled, { css } from 'styled-components'

export const Title = styled.h1`
  font-weight: 600;
  font-size: ${props => props.theme.utils.tsize.m}px;
  color: ${props => props.theme.colors.darkTextColor};
  margin-top: 0;
  margin-bottom: 18px;
  text-align: center;
  transform: none;
`

export const WrappLayout = styled.div``

export const WrapContent = styled.div`
  padding: 5px;
  background: ${props => props.theme.colors.backgroundPage};

  ${({ isCategoryLayout }) => !isCategoryLayout && css`
    margin-top: 70px;
  `}

  @media (min-width: 576px) {
    padding: 0px;
  }

  &#businessProductList {
    > div {
      margin-top: 30px;
    }
  }
`

export const BusinessContent = styled.div`
  margin-top: ${props => props.isCustomLayout ? 0 : 30}px;
  display: flex;
  flex-direction: column;

  @media (min-width: 993px) {
    flex-direction: row;
  }
`

export const BusinessCategoryProductWrapper = styled.div`
  width: 100%;

  /* Hide scrollbar for Chrome, Safari and Opera */
  .category-lists::-webkit-scrollbar {
    display: none;
  }

  /* Hide scrollbar for IE, Edge and Firefox */
  .category-lists {
    -ms-overflow-style: none;
    scrollbar-width: none;
  }

  @media (min-width: 1000px) {
    width: ${({ showCartOnProductList }) => showCartOnProductList ? '70%' : '100%'};
  }
`

export const BusinessCategoriesContainer = styled.div`
  margin: 0;
  width: 100%;
  ${(props) => !props.offSticky && css`
    top: 118px;
    position: sticky;
  `}

  @media (min-width: 993px) {
    width: ${({ showCartOnProductList }) => showCartOnProductList ? '70%' : '100%'};

    ${(props) => props.offSticky && css`
      margin-right: 30px;
    `}
  }
`

export const BusinessCartContainer = styled(BusinessCategoriesContainer)`
  display: none;
  margin-top: 0px;
  min-width: 300px;
  height: fit-content;

  @media (min-width: 993px) {
    width: calc(31% - 25px);
  }

  @media (min-width: 769px) {
    ${({ isProfessional }) => isProfessional && css`
      margin-top: 0px;
    `}
  }
  @media (min-width: 1000px) and (min-height: 600px) {
    display: block;
  }
`

export const BusinessCartContent = styled.div`
  background: ${props => props.theme.colors.backgroundPage};
  padding: 30px;
  position: relative;
  margin-bottom: 30px;
  max-height: ${({ maxHeight }) => `${maxHeight}px`};
  overflow: auto;

  .product.accordion {
    margin: 0;
  }

  /* .accordion.active {
    padding-bottom: 10px;
  } */

  ${({ isModal }) => !isModal && css`
    box-shadow: 0px 1px 4px 0px rgba(0,0,0,0.1);
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

export const EmptyBtnWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 20px;

  span {
    font-weight: 600;
    font-size: ${props => props.theme.utils.tsize.s}px;
    color: ${props => props.theme.colors.darkTextColor};
  }

  button {
    color: #748194;
    background: ${props => props.theme.colors.grayDividerColor};
    border: 1px solid ${props => props.theme.colors.grayDividerColor};
    border-radius: ${props => props.theme?.utils.radius.m}px;
    height: 44px;
    font-size: ${props => props.theme.utils.tsize.xs}px;
    padding-left: 25px;
    padding-right: 25px;
  }
`

export const MobileCartViewWrapper = styled.div`
  position: fixed;
  width: 100vw;
  left: 0;
  bottom: 0;
  background-color: white;
  padding: 10px 25px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  box-sizing: border-box;
  z-index: 1000;
  box-shadow: 0px 4px 10px rgb(0 0 0 / 12%);

  span {
    font-weight: 600;
    font-size: ${props => props.theme.utils.tsize.s}px;
  }

  button {
    height: 44px;
    border-radius: ${props => props.theme?.utils.radius.m}px;
  }
`

export const WrapperSearch = styled.div`
  margin: 15px 0px 0px;
  display: flex;
  align-items: center;
  justify-content: flex-end;

  .search-bar {
    margin-right: 10px;
    ${props => props.theme?.rtl && css`
      margin-left: 10px;
      margin-right: 0;
    `}
    input {
      width: 100%;

      @media (min-width: 500px) {
        width: 250px;
      }
    }
  }

  div:last-child {
    text-align: right;

    ${props => props.theme?.rtl && css`
      text-align: left;
    `}
  }
`

export const WrapperSearchAbsolute = styled.div`
  position: absolute;
  right: 5px;
  top: 0px;
  display: flex;
  justify-content: center;
  align-items: flex-end;
  width: 40px;
  height: 52px;
  background-color: ${props => props.theme.colors.backgroundPage};
  box-sizing: border-box;
  padding-bottom: 5px;
`

export const NearBusiness = styled.div`
  width: 100%;
`
export const PageBannerWrapper = styled.div`
  > div {
    border-radius: 8px;
  }
`

export const BackButton = styled.div`
  button {
    display: flex;
    flex-direction: row;
    align-items: center;
    svg {
      margin-right: 10px;
    }
  }
`
