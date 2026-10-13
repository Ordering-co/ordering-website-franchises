import styled, { css } from 'styled-components'

export const CouponContainer = styled.div`
  width: 100%;
`

export const CouponEntryButton = styled.button`
  appearance: none;
  align-items: center;
  background: ${({ theme }) => theme.colors.backgroundPage};
  border: 1px solid ${({ theme }) => theme.colors.gray200};
  border-radius: ${({ theme }) => theme?.utils?.radius?.m || 12}px;
  color: ${({ theme }) => theme.colors.darkTextColor};
  cursor: pointer;
  display: flex;
  gap: 12px;
  padding: 14px 16px;
  text-align: left;
  transition: border-color 160ms ease, box-shadow 160ms ease, transform 160ms ease;
  width: 100%;

  > svg {
    flex: 0 0 auto;
    height: 18px;
    width: 18px;
  }

  &:hover {
    border-color: ${({ theme }) => theme.colors.primary};
    box-shadow: 0 6px 18px rgba(218, 26, 50, 0.08);
    transform: translateY(-1px);
  }

  &:active {
    transform: translateY(0);
  }

  &:focus-visible {
    outline: 2px solid ${({ theme }) => theme.colors.primary};
    outline-offset: 2px;
  }

  ${({ theme }) => theme?.rtl && css`
    text-align: right;

    > svg {
      transform: rotate(180deg);
    }
  `}
`

export const CouponEntryIcon = styled.span`
  align-items: center;
  background: ${({ theme }) => theme.colors.grayDividerColor};
  border-radius: 10px;
  color: ${({ theme }) => theme.colors.primary};
  display: flex;
  flex: 0 0 auto;
  height: 38px;
  justify-content: center;
  width: 38px;

  svg {
    height: 18px;
    width: 18px;
  }
`

export const CouponEntryContent = styled.span`
  display: flex;
  flex: 1;
  flex-direction: column;
  gap: 2px;
  min-width: 0;

  strong {
    font-size: 15px;
    line-height: 1.25;
  }

  span {
    color: ${({ theme }) => theme.colors.darkGray};
    font-size: 13px;
    line-height: 1.35;
  }
`

export const CouponModalContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 28px;
`

export const CouponSection = styled.section`
  display: flex;
  flex-direction: column;
  gap: 16px;

  & + & {
    border-top: 1px solid ${({ theme }) => theme.colors.gray200};
    padding-top: 24px;
  }
`

export const CouponSectionHeader = styled.div`
  h3,
  p {
    margin: 0;
  }

  h3 {
    color: ${({ theme }) => theme.colors.headingColor};
    font-size: 17px;
    line-height: 1.35;
  }

  p {
    color: ${({ theme }) => theme.colors.darkGray};
    font-size: 13px;
    line-height: 1.45;
    margin-top: 3px;
  }
`

export const CouponForm = styled.form`
  display: flex;
  gap: 10px;

  input {
    border: 1px solid ${({ theme }) => theme.colors.gray200};
    box-sizing: border-box;
    flex: 1;
    min-width: 0;
    width: auto;
  }

  button {
    min-width: 92px;
  }

  @media (max-width: 480px) {
    flex-direction: column;

    button {
      width: 100%;
    }
  }
`

export const AppliedCoupon = styled.div`
  align-items: center;
  background: ${({ theme }) => theme.colors.grayDividerColor};
  border-radius: ${({ theme }) => theme?.utils?.radius?.m || 12}px;
  display: flex;
  gap: 12px;
  justify-content: space-between;
  padding: 12px;

  > div {
    align-items: center;
    display: flex;
    gap: 10px;
    min-width: 0;

    > svg {
      color: ${({ theme }) => theme.colors.success500};
      flex: 0 0 auto;
    }
  }

  span {
    display: flex;
    flex-direction: column;
    min-width: 0;
  }

  small {
    color: ${({ theme }) => theme.colors.darkGray};
    font-size: 11px;
  }

  strong {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
`

export const OfferTabs = styled.div`
  background: ${({ theme }) => theme.colors.grayDividerColor};
  border-radius: ${({ theme }) => theme?.utils?.radius?.m || 12}px;
  display: grid;
  gap: 4px;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  padding: 4px;
`

export const OfferTab = styled.button`
  align-items: center;
  appearance: none;
  background: ${({ $active, theme }) => $active ? theme.colors.backgroundPage : 'transparent'};
  border: 1px solid ${({ $active, theme }) => $active ? theme.colors.gray200 : 'transparent'};
  border-radius: ${({ theme }) => Math.max((theme?.utils?.radius?.m || 12) - 3, 6)}px;
  box-shadow: ${({ $active }) => $active ? '0 2px 8px rgba(16, 24, 40, 0.06)' : 'none'};
  color: ${({ $active, theme }) => $active ? theme.colors.headingColor : theme.colors.darkGray};
  cursor: pointer;
  display: flex;
  font-size: 13px;
  font-weight: 600;
  gap: 7px;
  justify-content: center;
  min-height: 38px;
  padding: 8px 12px;
  transition: background-color 160ms ease, border-color 160ms ease, color 160ms ease, box-shadow 160ms ease;

  &:hover {
    color: ${({ theme }) => theme.colors.headingColor};
  }

  &:focus-visible {
    outline: 2px solid ${({ theme }) => theme.colors.primary};
    outline-offset: 2px;
  }
`

export const OfferTabCount = styled.span`
  align-items: center;
  background: ${({ theme }) => theme.colors.gray200};
  border-radius: 999px;
  color: ${({ theme }) => theme.colors.darkTextColor};
  display: inline-flex;
  font-size: 11px;
  font-variant-numeric: tabular-nums;
  font-weight: 700;
  height: 20px;
  justify-content: center;
  min-width: 20px;
  padding: 0 6px;
`

export const OfferTabDescription = styled.p`
  color: ${({ theme }) => theme.colors.darkGray};
  font-size: 13px;
  line-height: 1.45;
  margin: 0 0 12px;
`

export const OfferList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`

export const OfferLoadingState = styled.div`
  align-items: center;
  color: ${({ theme }) => theme.colors.darkGray};
  display: flex;
  flex-direction: column;
  font-size: 13px;
  gap: 12px;
  justify-content: center;
  min-height: 118px;
`

export const OfferSpinner = styled.span`
  border: 3px solid ${({ theme }) => theme.colors.gray200};
  border-radius: 50%;
  border-top-color: ${({ theme }) => theme.colors.primary};
  height: 30px;
  width: 30px;

  @media (prefers-reduced-motion: no-preference) {
    animation: offer-spinner 700ms linear infinite;
  }

  @keyframes offer-spinner {
    to {
      transform: rotate(360deg);
    }
  }
`

export const OfferCard = styled.article`
  align-items: center;
  background: ${({ theme }) => theme.colors.backgroundPage};
  border: 1px solid ${({ theme }) => theme.colors.gray200};
  border-radius: ${({ theme }) => theme?.utils?.radius?.m || 12}px;
  display: flex;
  gap: 14px;
  padding: 15px;
  position: relative;
  transition: border-color 160ms ease, box-shadow 160ms ease;

  ${({ $unavailable }) => $unavailable && css`
    background: ${({ theme }) => theme.colors.grayDividerColor};
  `}

  &:hover {
    border-color: ${({ theme }) => theme.colors.lightGray};
    box-shadow: 0 6px 18px rgba(218, 26, 50, 0.06);
  }

  > button {
    flex: 0 0 auto;
    min-width: 88px;
  }

  @media (max-width: 480px) {
    align-items: stretch;
    flex-wrap: wrap;

    > button {
      width: 100%;
    }
  }
`

export const OfferRate = styled.span`
  align-items: center;
  background: ${({ theme }) => theme.colors.primary};
  border-radius: 10px;
  color: ${({ theme }) => theme.colors.primaryContrast};
  display: flex;
  flex: 0 0 auto;
  font-size: 15px;
  font-weight: 700;
  height: 48px;
  justify-content: center;
  width: 56px;
`

export const AppliedOfferIcon = styled.span`
  align-items: center;
  background: ${({ theme }) => theme.colors.grayDividerColor};
  border-radius: 10px;
  color: ${({ theme }) => theme.colors.primary};
  display: flex;
  flex: 0 0 auto;
  height: 48px;
  justify-content: center;
  width: 56px;

  svg {
    height: 18px;
    width: 18px;
  }
`

export const OfferCardContent = styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;
  gap: 4px;
  min-width: 0;

  h3,
  p {
    margin: 0;
  }

  h3 {
    color: ${({ theme }) => theme.colors.headingColor};
    font-size: 15px;
    line-height: 1.3;
  }

  p,
  small {
    color: ${({ theme }) => theme.colors.darkGray};
    font-size: 12px;
    line-height: 1.4;
  }

  small {
    color: ${({ theme }) => theme.colors.danger500};
  }
`

export const OfferCode = styled.span`
  color: ${({ theme }) => theme.colors.primary};
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
`

export const RemoveOfferButton = styled.button`
  align-items: center;
  appearance: none;
  background: transparent;
  border: 1px solid ${({ theme }) => theme.colors.gray200};
  border-radius: ${({ theme }) => Math.max((theme?.utils?.radius?.m || 12) - 3, 6)}px;
  color: ${({ theme }) => theme.colors.danger500};
  cursor: pointer;
  display: inline-flex;
  flex: 0 0 auto;
  font-size: 12px;
  font-weight: 600;
  gap: 6px;
  justify-content: center;
  min-height: 36px;
  padding: 8px 11px;
  transition: background-color 160ms ease, border-color 160ms ease;

  svg {
    height: 17px;
    width: 17px;
  }

  &:hover:not(:disabled) {
    background: ${({ theme }) => theme.colors.grayDividerColor};
    border-color: ${({ theme }) => theme.colors.danger500};
  }

  &:focus-visible {
    outline: 2px solid ${({ theme }) => theme.colors.primary};
    outline-offset: 2px;
  }

  &:disabled {
    cursor: wait;
    opacity: 0.55;
  }
`

export const OfferState = styled.div`
  align-items: center;
  background: ${({ theme }) => theme.colors.grayDividerColor};
  border-radius: ${({ theme }) => theme?.utils?.radius?.m || 12}px;
  color: ${({ theme }) => theme.colors.darkTextColor};
  display: flex;
  flex-direction: column;
  gap: 6px;
  padding: 28px 18px;
  text-align: center;

  > svg {
    color: ${({ theme }) => theme.colors.lightGray};
    height: 28px;
    margin-bottom: 2px;
    width: 28px;
  }

  strong {
    font-size: 15px;
  }

  span {
    color: ${({ theme }) => theme.colors.darkGray};
    font-size: 13px;
  }

  button {
    margin-top: 6px;
  }
`
