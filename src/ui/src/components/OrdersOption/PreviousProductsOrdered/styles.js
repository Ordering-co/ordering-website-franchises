import styled, { css } from 'styled-components'

export const ProductsList = styled.div`
  display: flex;
  box-sizing: border-box;
  width: 100%;
  .product-card {
    width: ${({ horizontal }) => horizontal ? '270px' : 'auto'} !important;
    max-width: ${({ horizontal }) => horizontal ? '270px' : 'none'} !important;
    margin: 20px 10px !important;
    background-color: ${props => props.theme.colors.white};
  }

  .vertical {
    width: 100%;

    > div {

    }

    .card-wrapper {
      height: 120px;
      > div {
        height: 100px;

        > div:first-child {
          justify-content: space-between;
        }
      }
    }
  }

  @media(min-width: 480px){
    .product-card {
      width: 400px;
      max-width: 400px;
    }
  }
`

export const ProductsListContainer = styled.div`
    margin-top: 10px;
    display: flex;
    overflow: ${({ horizontal }) => horizontal ? 'scroll hidden' : 'hidden'};
    ::-webkit-scrollbar {
      width: 6px;
      height: 6px;
    }
    ${({ isLoading }) => isLoading && css`
      ::-webkit-scrollbar {
        width: 0px;
        height: 0px;
      }
    `}
`
