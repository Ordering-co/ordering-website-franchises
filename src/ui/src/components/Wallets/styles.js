import styled, { css } from 'styled-components'

export const Container = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  margin: 0 auto;
  padding: 30px 15px 15px 15px;
  box-sizing: border-box;
  min-height: calc(100vh - 280px);

  @media (min-width: 768px) {
    width: 70%;
  }
`

export const Title = styled.h1`
  font-weight: 600;
  font-size: 32px;
  margin-bottom: 30px;
  margin-top: 0;
`

export const TabsContainer = styled.div`

  .tabs {
    width: 100%;
    flex-direction: column;
  }

  .tab {
    padding: ${({ theme }) => theme?.fonts?.primary?.name === 'Poppins' ? '8px 22px' : '6px 22px 8px'};
    margin-bottom: 10px;
    @media (min-width: 576px) {
      margin-right: 40px;
      margin-bottom: 0px;
    }
  }

  @media (min-width: 576px) {
    .tabs {
      flex-direction: row;
      justify-content: center;
    }
  }
`

export const Tab = styled.div`
  padding: 10px 0px;
  margin-right: 30px;
  cursor: pointer;

  ${props => props.theme.rtl && css`
    margin-right: 0px;
    margin-left: 30px;
  `}

  ${({ active }) => active && css`
    ${({ borderBottom }) => borderBottom && css`
      border-bottom: 1px solid;
    `}
  `}

  ${({ active }) => !active && css`
    color: ${props => props.theme.colors.darkGray};
  `}
`

export const SectionWrapper = styled.div`
  padding-top: 30px;
  display: flex;
  flex-direction: column;

  ${(props) => !props.isLoading && css`
    align-items: center;
  `};

  @media (min-width: 768px) {
    ${(props) => !props.isLoading && css`
      align-items: flex-start;
    `};
  }
`

export const TransactionsWrapper = styled.div`
  display: flex;
  flex-direction: column;
  border-left: 2px solid ${(props) => props.theme.colors.gray200};
`

export const BalanceElement = styled.div`
  width: 250px;
  padding: 10px 0;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: ${(props) => props.theme.colors.grayDividerColor};
  border-radius: 8px;

  h1 {
    font-size: 20px;
    font-weight: bold;
    margin: 0;
    padding: 0;
  }

  span {
    font-size: 10px;
    margin-left: 5px;
  }
`

export const WrapContent = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column-reverse;

  @media (min-width: 768px) {
    display: flex;
    justify-content: space-between;
    flex-direction: row;
  }
`

export const Transactions = styled.div`
  .transactions_list {
    margin-top: 20px;

    h2 {
      text-align: center;
    }
  }

  @media (min-width: 768px) {
    width: 60%;
    margin: 0;

    .transactions_list h2 {
      text-align: left;
    }
  }
`

export const LoyaltyContent = styled.div`
  width: 100%;
  margin-top: 20px;

  @media (min-width: 768px) {
    width: 38%;
  }
`

export const LoyaltyWrapp = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  img {
    width: 100%;
  }

  span.loyalty_title {
    font-size: 20px;
  }

  span.loyalty_name {
    font-size: 25px;
    font-weight: bold;
    text-transform: uppercase;
    color: ${(props) => props.theme.colors.primary}
  }
`

export const NotFoundText = styled.h1`
  font-size: 18px;
  opacity: 0.5;
  text-align: center;
  color: #344050;
`

export const TabContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 80%;
  margin: auto;

  .skeleton {
    margin-top: 40px
  }
`

export const RedeemHeader = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  margin: 40px 0;
  background-color: ${props => props.theme.colors.grayDividerColor};
  padding: 30px 0px;
  color: ${props => props.theme.colors.headingColor};
  font-size: ${props => props.theme?.utils?.tsize.xxs}px;
  font-weight: 500;

  .balance {
    font-size: 64px;
    font-weight: 700;
  }

  .available-points {
    font-size: ${props => props.theme?.utils?.tsize.xs}px;
    font-weight: 600;
  }

  .icon {
    display: flex;
    justify-content: center;
    color: ${props => props.theme.colors.yellow};
    font-size: 45px;
    margin: 10px 0;
    transform: rotate(15deg);
  }
`

export const RedeemContent = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;

  .reedem-cash {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 24px;
    border-radius: ${({ theme }) => theme?.utils?.radius.m}px;
    box-shadow: 0px 1px 4px 0px rgba(0, 0, 0, 0.1);
    font-size: ${props => props.theme?.utils?.tsize.m}px;
    font-weight: 700;
  }

  .transaction-list {
    display: flex;
    justify-content: flex-end;
    margin-top: 20px;
    cursor: pointer;

    .unterline-text {
      color: ${props => props.theme.colors.primary};
      font-size: ${props => props.theme?.utils?.tsize.xs}px;
      text-decoration-line: underline;
    }
  }
`

export const Divider = styled.div`
  background: ${props => props.theme.colors.grayDividerColor};
  height: 1px;
  width: 100%;
  margin: 40px 0;
`
