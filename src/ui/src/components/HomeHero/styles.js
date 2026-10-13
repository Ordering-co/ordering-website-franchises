import React from 'react'
import styled, { css } from 'styled-components'

export const HeroContainerStyled = styled.div`
  width: 100%;
  height: 375px;
  position: relative;
  margin-bottom: 70px;
  ${({ mb }) => mb && css`
    margin-bottom: ${mb};
  `}


  ${({ bgimage }) => bgimage && css`
    background-repeat: no-repeat, repeat;
    background-size: cover;
    object-fit: cover;
    background-position: center;
  `}

  .swiper-button-next {
    background-image: url(${props => props.theme.images.general.rightArrow});
    background-color: #d1d0d04d;
    background-repeat: no-repeat;
    background-position: 55% center;
    width: 32px;
    height: 32px;
    box-shadow: rgb(0 0 0 / 7%) 0px 4px 10px;
    border-radius: 50%;
    transition: all 0.2s ease;

    &:hover {
      transform: scale(1.05);
    }
  }

  .swiper-button-prev {
    background-image: url(${props => props.theme.images.general.leftArrow});
    background-color: #d1d0d04d;
    background-repeat: no-repeat;
    background-position: 45% center;
    width: 32px;
    height: 32px;
    border-radius: 50%;
    box-shadow: rgb(0 0 0 / 7%) 0px 4px 10px;
    transition: all 0.2s ease;

    &:hover {
      transform: scale(1.05);
    }
  }

  .swiper-button-next::after, .swiper-button-prev::after {
    display: none;
  }

  @media (min-width: 567px) {
    height: calc(100vh - 65px);

    margin-bottom: 0;
  }
`

export const HeroContainer = (props) => {
  const style = {}
  if (props.bgimage && !props.isClosed) {
    style.backgroundImage = `url(${props.bgimage})`
  } else {
    style.backgroundImage = `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url(${props.bgimage})`
  }

  return (
    <HeroContainerStyled {...props} style={style}>
      {props.children}
    </HeroContainerStyled>
  )
}

export const UseAccount = styled.div`
  width: 100%;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  > button {
    width: 100%;
    height: 70px;
    padding-top: 10px;
    padding-bottom: 10px;
    font-size: ${props => props.theme.utils.tsize.xl}px;
    line-height: 24px;
    font-weight: 500;
    background-color: ${({ theme }) => theme?.colors?.primary};
    color: ${({ theme }) => theme.colors.white};
    border-radius: ${props => props?.theme?.utils?.radius?.m}px;
  }
  @media (min-width: 576px) {
    min-height: auto;
    flex-wrap: wrap;
    > button {
      width: 456px;
    }
  }

`

export const HeroContent = styled.div`
  position: relative;
  top: ${({ hasBanners }) => hasBanners ? '-25px' : '180px'};
  z-index: ${props => props?.theme?.utils?.zi?.m};
  padding: 0px 40px 0px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  height: 100%;

  button {
    line-height: 18px;
    padding: 10px 10px;
    white-space: nowrap;
  }

  @media (min-width: 576px){
    width: 100%;
    display: flex;

    padding: 0px;
  }
`

export const BannerContainer = styled.div`
  width: 100%;
  margin: 0px;
  overflow: hidden;

  .swiper-button-next {
    background-image: url(${props => props.theme.images.general.rightArrow});
    background-color: #d1d0d04d;
    background-repeat: no-repeat;
    background-position: 55% center;
    width: 32px;
    height: 32px;
    box-shadow: rgb(0 0 0 / 7%) 0px 4px 10px;
    border-radius: 50%;
    transition: all 0.2s ease;

    &:hover {
      transform: scale(1.05);
    }
  }

  .swiper-button-prev {
    background-image: url(${props => props.theme.images.general.leftArrow});
    background-color: #d1d0d04d;
    background-repeat: no-repeat;
    background-position: 45% center;
    width: 32px;
    height: 32px;
    border-radius: 50%;
    box-shadow: rgb(0 0 0 / 7%) 0px 4px 10px;
    transition: all 0.2s ease;

    &:hover {
      transform: scale(1.05);
    }
  }

  .swiper-button-next::after, .swiper-button-prev::after {
    display: none;
  }
`

export const ImageWrapper = styled.div`
  width: 100%;
  height: 370px;
  position: relative;

  .banner-img {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    object-fit: scale-down;

    @media (min-width: 576px) {
      object-fit: fill;
    }
  }

  @media (min-width: 576px) {
    height: 28vw;
    min-height: 370px;
    max-height: 570px;
  }
`
