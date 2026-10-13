import styled, { css } from 'styled-components'

export const FavoritesContainer = styled.div`
  width: 100%;
  margin-left: auto;
  margin-right: auto;
  padding: 40px 15px 15px 15px;
  box-sizing: border-box;
  min-height: calc(100vh - 280px);

  @media (min-width: 769px) {
    max-width: 700px;
    width: 100%;
  }
`

export const Title = styled.h1`
  font-weight: 600;
  font-size: 32px;
  margin-bottom: 30px;
  margin-top: 0;
`

export const TabsContainer = styled.div`
  margin-bottom: 20px;

  .tabs {
    flex-direction: column;
  }
  .tab {
    margin-bottom: 10px;

    @media (min-width: 576px) {
      margin-right: 40px;
      margin-bottom: 0px;
    }
  }

  @media (min-width: 576px) {
    .tabs {
      flex-direction: row;
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

export const ContentWrapper = styled.div`

`
