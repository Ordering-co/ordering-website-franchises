import styled, { css } from 'styled-components'

export const BusinessReviewsContainer = styled.div`
  width: 100%;
  overflow-x: hidden;
  box-sizing: border-box;

  .info-wrapper {
    padding: 0 50px;
  }
`

export const ReviewOf = styled.div``

export const Content = styled.div`

  display: flex;
  flex-direction: column;

  h3{
    display: none;
  }

  @media (min-width: 480px){
    h3 {
      display: block;
      color: ${props => props.theme.colors.primary};
      margin: 0px;
      svg{
        font-size: 26px;
        vertical-align: text-top;
      }
    }
  }
`

export const Review = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  margin: 10px 0;
  padding: 15px;
  box-shadow: 0px 1px 4px 0px rgba(0, 0, 0, 0.1);
  border-radius: ${props => props.theme?.utils?.radius?.m}px;
`

export const ReviewsNotFound = styled.h2`
  margin: 65px 0;
  font-size: 20px;
  color: #B1BCCC;
  text-align: center;

  @media (min-width: 768px) {
    font-size: 32px;
  }
`

export const SkeletonContainer = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    align-items: center;
    flex: 1;

    > div{
      display: flex;
      width: 100%;
      justify-content: space-between;
      align-items: center;
    }
`

export const ReviewsHeaderWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 20px;
  margin-top: 10px;
  svg {
    font-size: 30px;
    color: ${props => props.theme?.colors.primary};
    margin-right: 13px;
    ${props => props.theme?.rtl && css`
       margin-left: 13px;
       margin-right: 0;
    `}
  }
  h2 {
    font-weight: 600;
    font-size: 24px;
    margin: 10px 0;
    color: ${props => props.theme?.colors.darkTextColor};
  }

  ${({ noReviews }) => noReviews && css`
    svg {
      color: #B1BCCC;
    }
  `}

  @media (min-width: 450px) {
    margin-top: 0px;
  }
`

export const ReviewsWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  background-color: ${props => props.theme?.colors.grayDividerColor};
  padding: 30px 50px;

  .rating {
    display: flex;
    align-items: center;
    gap: 10px;
    font-size: ${({ theme }) => theme?.utils?.tsize?.m + 'px'};
    font-weight: 700;

    svg {
      color: ${props => props.theme?.colors.warning500};
      font-size: 24px;
    }
  }

  .review-amount {
    font-size: ${({ theme }) => theme?.utils?.tsize?.s + 'px'};
  }
`

export const ReviewsProgressWrapper = styled.div`
  p {
    margin-top: 0;
    font-size: 14px;
    color: ${props => props.theme?.colors.darkTextColor};
  }
`

export const ReviewsProgressContent = styled.div`
  background: #E9ECEF;
  border-radius: 50px;
  width: 100%;
  height: 4px;
  position: relative;
  margin-bottom: 30px;
`

export const ReviewsProgressBar = styled.div`
  height: 4px;
  border-radius: 50px;
  background: #344050;
`

export const ReviewsMarkPoint = styled.span`
  position: absolute;
  top: 15px;
  font-size: 12px;
  color: #CED4DA;
  cursor: pointer;
`

export const ReviewTime = styled.p`
  font-size: 12px;
  color: #909BA9;
  margin: 0;
`

export const ReviewItemHeader = styled.div`
  display: flex;
  flex-direction: column;

  @media (min-width: 375px) {
    flex-direction: row;
    justify-content: space-between;
  }
`

export const ReviewItemContent = styled.div`
  font-size: 12px;
  color: ${props => props.theme?.colors.darkTextColor};
`

export const SearchContainer = styled.div`
  margin: 35px 0;
  input {
    outline: none;
    border: none;
    border: 1px solid ${props => props.theme?.colors.gray200};
    border-radius: ${props => props.theme?.utils.radius.m}px;
    width: 100%;
    min-height: 50px;
    background-repeat: no-repeat;
    background-size: 45px 18px;
    background-position: left center;
    box-sizing: border-box;
    padding: 7px 10px 7px 40px;

    ${props => props.theme?.rtl && css`
      padding: 7px 30px 7px 0;
      background-position: right center;
    `}
  }
`

export const ReviewsProgressStars = styled.div`
  display: flex;
  flex-direction: row;

  svg {
    padding: 0 10px;
    font-size: 20px;
    color: ${props => props.theme?.colors.primary};
    cursor: pointer;
  }

  svg:last-child {
    padding-right: 0;
  }

  @media (max-width: 375px) {
    svg:first-child {
      padding-left: 0;
    }
  }
`

export const ReviewStars = styled.div`
    display: flex;
    align-items: center;
    gap: 5px;
`
