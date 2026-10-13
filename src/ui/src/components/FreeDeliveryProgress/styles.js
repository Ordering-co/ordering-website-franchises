import styled, { css } from 'styled-components'

export const Wrapper = styled.div`
  width: 100%;
  box-sizing: border-box;
  display: flex;
  align-items: center;
  padding: 12px;
  color: ${({ theme }) => theme.colors.darkTextColor};
  background: ${({ theme }) => theme.colors.backgroundInfo};
  border: 1px solid ${({ theme, $unlocked }) => $unlocked ? theme.colors.success500 : theme.colors.grayDividerColor};
  border-radius: ${({ theme }) => theme.utils?.radius?.s || 4}px;

  ${({ $variant }) => $variant === 'compact' && css`
    padding: 8px 10px;
  `}
`

export const Content = styled.div`
  min-width: 0;
  flex: 1;
`

export const ProgressDetails = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: baseline;
  justify-content: space-between;
  gap: 10px;
  margin-bottom: 6px;
`

export const Message = styled.span`
  flex: 1 1 140px;
  color: inherit;
  font-size: 14px;
  font-weight: 600;
  line-height: 1.35;
`

export const Amounts = styled.span`
  flex: 0 0 auto;
  color: inherit;
  font-size: 12px;
  line-height: 1.35;
`

export const Progress = styled.progress`
  display: block;
  width: 100%;
  height: 6px;
  overflow: hidden;
  border: 0;
  border-radius: 3px;
  background: ${({ theme }) => theme.colors.grayDividerColor};
  color: ${({ theme }) => theme.colors.primary};

  &::-webkit-progress-bar {
    background: ${({ theme }) => theme.colors.grayDividerColor};
    border-radius: 3px;
  }

  &::-webkit-progress-value {
    background: ${({ theme }) => theme.colors.primary};
    border-radius: 3px;
    transition: width 180ms ease;
  }

  &::-moz-progress-bar {
    background: ${({ theme }) => theme.colors.primary};
    border-radius: 3px;
    transition: width 180ms ease;
  }

  @media (prefers-reduced-motion: reduce) {
    &::-webkit-progress-value,
    &::-moz-progress-bar {
      transition: none;
    }
  }
`
