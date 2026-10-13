import styled, { css } from 'styled-components'

export const Tabs = styled.div`
  display: flex;
  ${({ variant }) => variant === 'primary' && css`
    color: ${props => props.theme.colors.darkTextColor};
  `}

  ${({ withBackground }) => withBackground && css`
    color: ${props => props.theme.colors.white};
  `}
`

export const Tab = styled.div`
  padding: 10px 15px;
  cursor: pointer;
  ${({ active }) => active && css`
    ${({ borderBottom }) => borderBottom && css`
      border-bottom: 1px solid;
    `}
  `}

  ${({ active }) => !active && css`
    color: ${props => props.theme.colors.darkGray};
  `}

  ${({ withBackground, active }) => withBackground && active
? css`
      background-color: ${props => props.theme.colors.primary};
      border-radius: ${props => props?.theme?.utils?.radius?.m}px;
  `
: withBackground && !active && css`
    border-radius: ${props => props?.theme?.utils?.radius?.m}px;
    color: ${props => props.theme.colors.lightGray};
    background-color: ${props => props.theme.colors.grayDividerColor};
  `}
`
