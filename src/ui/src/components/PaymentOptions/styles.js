import styled, { css } from 'styled-components'

export const PaymentMethodsContainer = styled.div`
  display: flex;
  flex-direction: column;
  margin: 20px;
`

export const PaymentMethodsList = styled.div`
  display: grid;
  grid-template-columns: repeat(1, 1fr);
  gap: 20px 90px;
  margin: auto;

  @media (min-width: 678px) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (min-width: 993px) {
    grid-template-columns: repeat(3, 1fr);
  }

  ${({ paymentsLenght }) => paymentsLenght < 3 && css`
    @media (min-width: 678px) {
      grid-template-columns: repeat(${paymentsLenght}, 1fr) !important;
    }
  `}
`

export const Container = styled.div`
  margin: 0 auto;
`

export const PayCard = styled.div`
  width: 216px;
  height: 216px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  margin: 10px;
  text-align: center;
  box-shadow: 0px 1px 4px 0px rgba(0, 0, 0, 0.1);
  border-radius: ${(props) => props.theme?.utils?.radius?.m}px;
  padding: 10px;

  ${props => props.isDisabled && css`
    pointer-events: none;
  `}

  > div {
    display: flex;
    align-items: center;
    justify-content: center;
    box-sizing: border-box;
    > svg {
      font-size: 70px;
      path {
        fill: #000;
      }
    }
  }

  p {
    margin: 10px 0px 0px;
    font-size: ${props => props.theme?.utils?.tsize?.s}px;
    font-weight: 700;
    text-align: center;
  }

  &.active {
    box-shadow: 0px 0px 4px 0px ${props => props.theme.colors.primary};
    > div {
      svg path {
        fill: ${props => props.theme.colors.primary};
      }
    }
    p {
      color: ${props => props.theme.colors.primary};
    }
  }

  /* &:not(.active) {
    border: ${({ isSkeleton }) => isSkeleton ? '0' : '1px solid #EAEAEA'};
  } */
`

export const PayCardSelected = styled.div`
  padding: 30px 0px 0px;
`

export const CardItemContent = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  font-weight: bold;

  span {
    display: flex;
  }

  .checks svg {
    color: ${props => props.theme.colors.primary};
    font-size: 22px;
  }

  img {
      width: 24px;
      height: 20px;
  }

  .brand svg {
    font-size: 26px;
  }

  > * {
    margin-right: 10px
    ${props => props.theme?.rtl && css`
      margin-left: 10px;
      margin-right: 0;
    `}
  }
`
