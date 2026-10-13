import React from 'react'
import styled, { css } from 'styled-components'
import { Button } from '../../styles/Buttons'

export const ReviewOrderContainer = styled.form`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 30px 30px 0;
`

export const Comments = styled.div`
  display: flex;
  width: 100%;
  flex-direction: column;
  margin-top: 10px;

  p {
    cursor: pointer;
    text-decoration: underline;
    text-transform: capitalize;
    margin-top: 0;
    margin-bottom: 10px;
    font-size: 15px;
    color: ${props => props.theme?.colors.darkTextColor};
  }

  textarea {
    min-height: 104px;
  }

  div {
    display: flex;
    flex-direction: column;
  }
`

export const Send = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-around;
  margin-top: 30px;
  width: 100%;

  span {
    width: 50%;
    max-width: 300px;
    text-align: center;
    cursor: pointer;
    font-weight: 600;
    font-size: 16px;
    user-select: none;
  }

  button {
    font-size: 14px;
    padding: 6px 20px;
    height: 50px;
    width: 50%;
    max-width: 300px;
    line-height: 0;
    svg {
      color: white;
      font-size: 21px;
      vertical-align: middle;
      margin-left: 8px;
      ${props => props.theme?.rtl && css`
        margin-left: 0;
        margin-right: 8px;
        transform: rotateZ(180deg);
      `}
    }
  }
`

const BusinessLogoStyled = styled.div`
  display: flex;
  width: 124px;
  height: 124px;
  box-sizing: border-box;
  position: relative;
  background-repeat: no-repeat, repeat;
  background-size: cover;
  object-fit: cover;
  background-position: center;
  min-height: 124px;
  border-radius: 50px;

  @media (min-width: 481px){
    width: 100%;
    height: 100%;
    ${({ isMulti }) => isMulti && css`
      width: 124px;
      height: 124px;
    `}
    min-height: 124px;
  }
`

export const BusinessLogo = (props) => {
  const style = {}
  if (props.bgimage) {
    style.backgroundImage = `url(${props.bgimage})`
  }

  return (
    <BusinessLogoStyled {...props} style={style}>
      {props.children}
    </BusinessLogoStyled>
  )
}

export const WrapperBusinessLogo = styled.div`
  margin: 20px auto 0;
  align-self: center;
  width: 124px;
  height: 124px;
  min-height: 124px;
  max-width: 124px;
  border-radius: 50px;
  ${({ isMulti }) => isMulti && css`
    max-width: initial;
    width: 100%;
  `}
  box-shadow: 0px 1px 4px rgba(0, 0, 0, 0.1);
`

export const ReviewsProgressWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  margin-top: 50px;
  margin-bottom: 35px;

  p {
    margin-top: 0;
    margin-bottom: 15px;
    font-size: ${props => props.theme?.utils?.tsize?.xs}px;
    color: ${props => props.theme?.colors.darkTextColor};
  }
`

export const ReviewsProgressContent = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;

  svg {
    padding: 0 10px;
    font-size: 40px;
    color: ${props => props.theme?.colors.primary};
    cursor: pointer;
  }
`

export const ReviewsProgressBar = styled.div`
  height: 6px;
  border-radius: 50px;
  background: #344050;
  transition: all 0.2s linear;
`

export const ReviewsMarkPoint = styled.div`
  position: absolute;
  top: 15px;
  font-size: 12px;
  color: #CED4DA;
  cursor: pointer;

  ${({ active }) => active && css`
    > span {
      color: #344050;
    }
  `}

  &.mark-point {
    span {
      position: relative;
      margin-left: -50%;
      ${props => props.theme?.rtl && css`
        margin-right: -50%;
        margin-left: 0;
      `}

      > span {
        position: absolute;
        height: 6px;
        top: -15px;
        width: 2px;
        background: #CED4DA;
        transition: all 0.3s;
      }
    }
  }

  ${({ pass }) => pass && css`
    span {
      > span {
        background: transparent !important;
      }
    }
  `}
`

export const LogoAndReviewWrapper = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;

  .order-info {
    background-color: ${props => props.theme?.colors.grayDividerColor};
    margin: 0px -20px;
  }
`

export const CommentsList = styled.div`
  margin: 20px 0;
  p {
    margin-top: 0;
    margin-bottom: 10px;
    font-size: ${props => props.theme?.utils?.tsize.s}px;
    font-weight: 700;
    color: ${props => props.theme?.colors.darkTextColor};
  }

  button {

    ${props => props.theme?.rtl && css`
      margin-left: 40px;
      margin-right: 0;
    `}

    svg {
      vertical-align: middle;
      margin-left: 5px;

      ${props => props.theme?.rtl && css`
        margin-right: 5px;
        margin-left: 0;
      `}
    }
  }
`

export const CommentButton = styled(Button)`
  height: 45px;
  margin-right: 40px;
  border-radius: 50px;
  margin-bottom: 18px;
  font-size: ${props => props.theme?.utils?.tsize?.s}px;
  font-weight: 400;
  color: ${props => props.theme?.colors.lightGray};
  background: ${props => props.theme?.colors.gray200};
  border: 1px solid ${props => props.theme?.colors.gray200};
  transition: all 0.3s linear;

  ${props => props.theme?.rtl && css`
    margin-left: 18px;
    margin-right: 0;
  `}

  svg {
    vertical-align: middle;
    margin-left: 5px;

    ${props => props.theme?.rtl && css`
      margin-right: 5px;
      margin-left: 0;
    `}
  }

  ${({ active }) => active && css`
    background: ${props => props.theme?.colors.primary};
    border: 1px solid ${props => props.theme?.colors.primary};
    color: white;
  `}
`

export const ContinueContainer = styled.div`
  display: flex;
  align-items: center;
  p {
    flex: 1;
    margin: 0;
  }
`

export const MultiLogosContainer = styled.div`
  display: flex;
  justify-content: space-around;
`
