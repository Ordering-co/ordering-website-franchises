import React from 'react'
import styled, { css } from 'styled-components'
import { Button } from '../../styles/Buttons'

export const ReviewProductContainer = styled.form`
  min-height: 75vh;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`

export const ActionBlock = styled.div`
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

export const SingleProductReviewContainer = styled.div`
  margin-bottom: 15px;
  border: 1px solid ${props => props.theme?.colors.gray200};
  border-radius: ${props => props?.theme?.utils?.radius?.m}px;

  .info-wrapper {
    display: flex;
    flex-direction: column;
    padding: 20px 10px;

    @media (min-width: 1100px){
      flex-direction: row;
    }
  }
`

export const HandReviewWrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  /* padding-left: 20px; */
  .name-review {
    display: flex;
    justify-content: space-between;

    p {
      max-width: 325px;
      font-size: ${props => props.theme.utils.tsize.s}px;
      font-weight: 700;
      color: ${props => props.theme?.colors.headingColor};
      margin: 0;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
  }

  /* @media (min-width: 554px) {
    width: 100%;
  }
  @media (min-width: 768px) {
    width: 74%;
  } */

  @media (min-width: 1100px){
    padding-left: 20px;
  }
`

export const HandReviewContent = styled.div`
  display: flex;
  align-items: center;
`

export const HandIconWrapper = styled.span`
  margin-left: 15px;

  ${props => props.theme?.rtl && css`
    margin-right: 15px;
    margin-left: 0;
  `}

  svg {
    font-size: 24px;
    color: #B1BCCC;
    cursor: pointer;
    transition: all 0.3s linear;
  }

  ${({ active }) => active && css`
    svg {
      color: ${props => props.theme?.colors.primary};
    }
  `}
`

export const AdditionCommentsWrapper = styled.div``

export const AddCommentHideShow = styled.p`
  text-decoration: underline;
  text-align: start;
  user-select: none;
  cursor: pointer;
  margin: 0;
  transition: all 0.3s linear;
  color: ${props => props.theme?.colors.primary};
  font-size: 13px;
  &:hover {
        text-decoration: underline;
        color: ${props => props.theme?.colors.primary};
      }

  ${({ active }) => active && css`
    color: ${props => props.theme?.colors.primary};
  `}
`

export const Comments = styled.div`
  margin: 20px 30px;

  p {
    margin-top: 0;
    margin-bottom: 8px;
    font-size: 14px;
    color: #344050;
  }

  textarea {
    width: 100%;
    box-sizing: border-box;
    border-radius: 7.6px;
    min-height: 100px;
  }
`

export const CommentsList = styled.div`
  margin-top: 20px;
  display: flex;
  overflow-x: scroll;
  overflow-y: hidden;

`

export const ButtonCustomized = styled(Button)`
  min-width: fit-content;
  border-radius: 50px;
  margin-bottom: 18px;
  margin-right: 18px;
  font-size: 13px;
  color: #414954;
  background: #E9ECEF;
  border: 1px solid #E9ECEF;
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
export const WrapperProductLogo = styled.div`
  width: 100px;
  height: 100px;
  min-height: 100px;
  max-width: 100px;
  box-shadow: 0px 1px 4px rgba(0, 0, 0, 0.1);
  border-radius: ${props => props.theme?.utils?.radius?.m}px;
  margin: 0 auto 10px;

  @media (min-width: 1100px){
    margin: 0;
  }
`

const ProductLogoStyled = styled.div`
  display: flex;
  width: 100px;
  height: 100px;
  box-sizing: border-box;
  position: relative;
  background-repeat: no-repeat, repeat;
  background-size: cover;
  object-fit: cover;
  background-position: center;
  min-height: 100px;
  border-radius: ${props => props.theme?.utils?.radius?.m}px;

  @media (min-width: 481px){
    width: 100%;
    height: 100%;
    min-height: 100px;
    min-width: 100px;
  }
`

export const ProductLogo = (props) => {
  const style = {}
  if (props.bgimage) {
    style.backgroundImage = `url(${props.bgimage})`
  }

  return (
    <ProductLogoStyled {...props} style={style}>
      {props.children}
    </ProductLogoStyled>
  )
}
