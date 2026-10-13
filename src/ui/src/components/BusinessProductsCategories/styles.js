import styled, { css } from 'styled-components'

export const CategoriesContainer = styled.div`
  display: flex;
  overflow-x: auto;
  padding: 5px 0px 0px 0px;
  background: ${props => props.theme.colors.backgroundPage};
  z-index: 1000;
  position: absolute;
  top: 0;
  text-align: center;
  width: ${props => props.w || '100%'};
  box-sizing: border-box;
  div.category {
    text-overflow: ellipsis;
    white-space: nowrap;
    overflow: hidden;
    padding: 6px 15px 4px 15px;
    margin: 0 15px;
    min-width: 70px;
    &:nth-of-type(1) {
      margin-left: 0;
      ${props => props.theme.rtl && css`
        margin-left: 15px;
        margin-right: 15px;
      `}
    }
    svg {
      font-size: 20px;
    }
  }
  .list {
    min-width: 30px !important;
    background: transparent;
    margin: 0 !important;

    svg {
      color: ${props => props.theme.colors.black};
    }
  }

  div.special {
    ${props => !props.featured && css`
      display: none
    `}
  }

  @media (min-width: 769px) {
    ${({ isProfessional }) => isProfessional && css`
      width: 100%;
    `}
  }
  @media (min-width: 992px) {
    ${(props) => props.w && css`
      width: ${props.w};
    `}
  }
`
