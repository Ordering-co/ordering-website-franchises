import styled, { css } from 'styled-components'

export const HeaderItem = styled.div`
  cursor: pointer;
  > span {
    background: ${props => props.theme.colors.primary};
    color: ${props => props.theme.colors.backgroundPage};
    padding: 10px;
    display: flex;
    align-items: center;
    border-radius: 7.6px;

    span {
      margin: 0;
      font-size: 14px;
      ${props => props.theme?.rtl
? css`
        margin-right: 10px;
      `
: css`
        margin-left: 10px;
      `}
    }
    svg {
      font-size: 16px;
    }
  }
`

export const PopoverBody = styled.div`
  background-color: ${(props) => props.theme?.colors?.backgroundPage};
  color: #333;
  padding: 15px;
  border-radius: 10px;
  max-width: 500px;
  z-index: 10002;
  box-shadow: rgba(0, 0, 0, 0.2) 0px 8px 24px;

  &.categories-popover-fixed {
    position: fixed !important;
    top: 110px !important;
  }
`

export const PopoverArrow = styled.div`
  width: 0;
  height: 0;
  border-left: 7px solid transparent;
  border-right: 7px solid transparent;
  border-bottom: 8px solid #FFF;
  top: -8px;
`

export const TitleContainer = styled.div`
  display: flex;
  justify-content: space-between;
  button {
    display: flex;
    align-items: center;
    border-radius: 16px;
    svg{
      margin-right: 5px;
    }
  }
`
