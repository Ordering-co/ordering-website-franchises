import styled, { css } from 'styled-components'

export const WrapperMap = styled.div`
  width: 100%;
  height: 800px;
  display: flex;
  justify-content: center;
  box-sizing: border-box;
  margin-top: 20px;
  position: relative;
  > div {
    position: relative !important;
    width: 100% !important;
    height: 100% !important;
  }

  ${({ disabled }) => disabled && css`
    pointer-events: none;
  `}

  @media (min-width: 1200px) {
    position: absolute;
    margin-top: 0vh;
    height: 94%;
  }

  .gm-style .gm-style-iw-c {
    padding-left: 0px !important;
  }

  .gm-style .gm-style-iw-d {
    overflow: auto !important;
  }

  .gm-style-iw-chr {
    height: 15px !important;
  }
`

export const BusinessContainer = styled.span`
  position: absolute;
  bottom: 25px;
  border-radius: 10px;
  max-width: 95%;
  min-width: 95%;
  @media (min-width: 681px){
    width: calc(70% - 40px);
    min-width: calc(70% - 40px);
    max-width: calc(70% - 40px);
  }
`

export const ContainerCard = styled.div`
  box-sizing: border-box;
  border-radius: ${props => props.theme?.utils?.radius?.m}px;
  margin: 15px 0px 25px;
  width: 100%;
  ${({ minWidthEnabled }) => minWidthEnabled && css`
    min-width: calc(65% - 40px);
  `}

  ${({ typeButton }) => typeButton && css`
    border: none;
    display: flex;
    justify-content: center;
    align-items: center;
    button {
      padding: 10px 30px;
    }
  `}

  ${({ firstCard }) => firstCard && css`
    margin-left: 0;
  `}

  ${({ disabled }) => disabled && css`
    cursor: not-allowed;
  `}

  @media (min-width: 481px) {
    max-height: ${({ isCustomerMode }) => isCustomerMode ? '360px' : '320px'};
  }


`

export const WrapperBusinessCard = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  height: 100%;
  justify-content: center;
  border-radius: ${props => props.theme?.utils?.radius?.m}px;
  padding: 10px 20px;
  ${({ disabled }) => disabled && css`
    pointer-events: none;
    cursor: not-allowed;
  `}

  button {
    height: 44px;
    min-height: 44px;
    width: 100%;
    margin-top: 15px;
    align-self: flex-end
  }
`

export const BusinessHero = styled.div`
  border-radius: 10px;
  display: flex;
  justify-content: space-between;
  > div {
    display: flex;
  }
`

export const BusinessContent = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  text-align: left;
  p {
    margin: 0;
  }


`

export const BusinessInfo = styled.div`
  display: flex;
  ${({ isCustomerMode }) => isCustomerMode
? css`
    width: 90%;
  `
: css`
    width: 100%;
  `}
`

export const BusinessInfoItem = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  font-size: 12px;

  div {
    display: flex;
    p {
      margin-right: 5px;
      ${props => props.theme?.rtl && css`
        margin-left: 5px;
        margin-right: 0;
    `}
      text-transform: capitalize;
      display: flex;
      align-items: center;
      margin: 0px;
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
    }
    p.bold {
      font-weight: bold;
    }
  }
`

export const BusinessName = styled.h6`
  font-size: 18px;
  overflow: hidden;
  text-overflow: ellipsis;
  font-weight: 700;
  margin-block-start: 0;
  margin-block-end: 0;
  color: ${props => props?.theme?.colors?.headingColor};
  text-align: left;
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
`

export const Categories = styled.div`
  font-size: ${props => props.theme?.utils?.tsize?.xs + 'px'};
  font-weight: 300;
  color: #6C6C6C;

  @media (min-width: 481px) {
    font-size: 16px;
  }
`

export const Medadata = styled.div`
  display: flex;
  font-weight: 300;
  font-size: 12px;
  color: ${props => props?.theme?.colors?.darkGray};
  flex-wrap: wrap;


  ${({ isCustomerMode }) => isCustomerMode && css`
    > div {
      flex-direction: column;
    }
  `}
  ${({ isSkeleton }) => isSkeleton && css`
    display: flex;
    justify-content: center;
  `}
  p {
    color: #909BA9;
    svg {
      font-size: 7px;
      min-width: 6px;
      margin: 0 3px;
    }

    span {
      margin-right: 10px;
      ${props => props.theme?.rtl && css`
        margin-left: 10px;
        margin-right: 0;
      `}
    }
  }

  @media (min-width: 481px) {
    font-size: ${props => props.theme?.utils?.tsize?.xs + 'px'};;
  }
`

export const BusinessNameContainer = styled.div`
  width: 60%;
  flex-direction: column;
`

export const BusinessNameContainerRight = styled.div`
  max-width: 35%;
  flex-direction: column;
  align-items: flex-end;
  justify-content: center;

  button {
    width: 100%;
    max-width: 120px;
    cursor: pointer;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
    height: min-content;
    font-size: ${props => props.theme?.utils?.tsize?.xs + 'px'};
    line-height: 20px;
    border-radius: ${props => props.theme?.utils?.radius.s}px;
    border: none;
  }
`

export const OpenAtContainer = styled.div`
  color: ${({ theme }) => theme?.colors?.primary};
  font-weight: 500;
  font-size: ${props => props.theme?.utils?.tsize?.xxs + 'px'};
  margin-top: 10px;
`

export const BusinessAddress = styled.div`
  color: ${props => props?.theme?.colors?.darkGray};
  font-size: ${props => props.theme?.utils?.tsize?.xs + 'px'};
`

export const ButtonSkeleton = styled.div`
  width: 100%;
  margin-top: 15px;
`
