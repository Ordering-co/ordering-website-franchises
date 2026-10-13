import styled from 'styled-components'

export const TransactionsContainer = styled.div`
  width: 80%;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  align-items: center;

  .transaction-list {
    display: flex;
    flex-direction: column;
    width: 80%;
  }
`

export const ItemContainer = styled.div`
  display: flex;
  flex-direction: column;
  padding-bottom: 20px;
  margin: 40px 0 20px;
  border-bottom: 1px solid ${(props) => props.theme.colors.gray200};
`

export const ItemDateBlock = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  width: 100%;

  .left-wrapper {
    display: flex;
  }
`

export const ItemIcon = styled.div`
  width: 53px;
  height: 53px;
  border-radius: ${props => props.theme?.utils.radius.m}px;
  background-color: ${(props) => props.theme.colors.grayDividerColor};
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  svg {
    font-size: 24px;
    color: ${(props) => props.theme.colors.danger500};
  }
  &.green {
    svg {
      color: ${(props) => props.theme.colors.success500};
    }
  }
`

export const ItemRight = styled.div`
  margin-left: 10px;
`

export const ItemContent = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;

  .date {
    color: ${(props) => props.theme.colors.darkGray};
  }

  div.amount {
    color: ${(props) => props.theme.colors.danger500};
  }
  div.green {
    color: ${(props) => props.theme.colors.success500};
  }
`

export const ItemText = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
`

export const ItemDescriptionBlock = styled.div`
  flex-direction: row;
  flex-wrap: wrap;
  color: ${(props) => props.theme.colors.darkTextColor};
  font-weight: 700;
`

export const TabsContainer = styled.div`
  margin: 20px;

  .tabs {
    width: 100%;
    flex-direction: column;
  }

  .tab {
    padding: 8px 22px;
    margin-bottom: 10px;
    @media (min-width: 576px) {
      margin-left: 25px;
      margin-right: 25px;
      margin-bottom: 0px;
    }
  }

  @media (min-width: 576px) {
    margin: 0px;
    .tabs {
      flex-direction: row;
      justify-content: center;
    }
  }
`

export const Header = styled.div`
  margin-top: 40px;
`
