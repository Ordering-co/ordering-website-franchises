import styled, { css } from 'styled-components'

export const OrderProgressContainer = styled.div`
  min-height: 100px;
  display: flex;
  flex-direction: column;
  flex-wrap: wrap;
  background: ${props => props?.theme?.colors?.white};
  box-shadow: 0px 1px 4px rgba(0, 0, 0, 0.1);
  border-radius: ${props => props?.theme?.utils?.radius?.m}px;
  padding: 15px;

  > h2 {
    margin-top: 10px;
    margin-bottom: 30px;
    margin-left: 20px;
  }

  @media (min-width: 576px) {
    padding: 25px;
  }

  @media (min-width: 768px) {
    > h2 {
      margin-top: 0;
      margin-left: 25px;

      ${props => props.theme.rtl && css`
        margin-left: 0px;
        margin-right: 25px;
      `}
    }
  }
`

export const OrderProgressWrapper = styled.div`
  width: 100%;
  max-width: 1100px;
  padding: 45px 20px;
  margin: 0px;

  @media (min-width: 576px) {
    width: 80%;
  }

  @media (min-width: 768px) {
    margin: 0 35px;
    padding: 35px 20px;
  }
`

export const OrderInfoWrapper = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 15px;

  @media (min-width: 768px) {
    margin-bottom: 0px;
  }
`

export const NoOrderInfoWrapper = styled.div`
  display: flex;
  flex-direction: column;
  background: ${props => props?.theme?.colors?.white};
  box-shadow: 0px 1px 4px rgba(0, 0, 0, 0.1);
  border-radius: ${props => props?.theme?.utils?.radius?.m}px;
  padding: 15px;
  > div {
    min-height: 130px;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-wrap: wrap;
    font-size: ${props => props.theme.utils.tsize.l}px;
    text-align: center;
    button {
      font-size: ${props => props.theme.utils.tsize.l}px;
    }
  }

  p {
    color: ${props => props.theme.colors.darkGray};
    margin: 0;
  }

  > h2 {
    margin-bottom: 0;
    margin-left: 20px;
  }

  > button {
    font-size: ${props => props.theme.utils.tsize.l}px;
    margin-bottom: 0px;
    padding-right: 8px;
  }
`

export const ProgressDescriptionWrapper = styled.div`
  margin-left: 20px;
  ${props => props.theme.rtl && css`
    margin-left: 0px;
    margin-right: 20px;
  `}

  h2 {
    font-weight: 500;
    font-size: ${props => props.theme.utils.tsize.xs}px;
    margin-top: 0;
    margin-bottom: 5px;
  }

  p {
    font-size: ${props => props.theme.utils.tsize.xxs}px;
    margin: 0;
  }

  button {
    display: flex;
    align-items: center;
    padding: 0px;
    margin-top: 0px;
    font-size: ${props => props.theme.utils.tsize.xxs}px;
    line-height: 25px;
    svg {
      margin-left: 5px;
      ${props => props.theme.rtl && css`
        margin-left: 0px;
        margin-right: 5px;
      `}
    }
    &:hover {
      text-decoration: underline;
    }
  }

  @media (min-width: 576px) {
    h2 {
      font-size: ${props => props.theme.utils.tsize.m}px;
      margin-bottom: ${props => props.theme.utils.margins.b + 'px'};
    }
    p {
      font-size: ${props => props.theme.utils.tsize.s}px;
    }
    button {
      font-size: ${props => props.theme.utils.tsize.s}px;
      margin-top: 2px;
      line-height: 30px;
    }
  }

  @media (min-width: 768px) {
    margin-left: 25px;

    ${props => props.theme.rtl && css`
      margin-left: 0px;
      margin-right: 25px;
    `}
  }
`

export const OrderInfoRightWrapper = styled.div`
  padding: 0px;
  box-sizing: border-box;
  display: flex;
  justify-content: flex-end;
  align-items: flex-end;

  > button {
    padding: 0px;
    margin: 0px;
    border-radius: 0px;
  }

  @media (min-width: 768px) {
    padding-left: 15px;

    ${props => props.theme.rtl && css`
      padding-left: 0px;
      padding-right: 15px;
    `}
  }
`

export const StatusWrapper = styled.p`
  margin-top: 0px;
  margin-bottom: 0px;
  font-size: ${props => props.theme.utils.tsize.xs}px;
  margin-right: 10px;

  ${({ isSuccess }) => isSuccess && css`
    color: ${props => props.theme.colors.success500};
  `}

  ${props => props.theme.rtl && css`
    margin-right: 0px;
    margin-left: 10px;
  `}
`

export const TimeWrapper = styled.div`
  font-size: ${props => props.theme.utils.tsize.xs}px;
  color: ${props => props.theme?.colors.darkGray};
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-start;
  flex-direction: column;
  margin-bottom: ${props => props.theme.utils.margins.b + 'px'};
  @media (min-width: 576px) {
    flex-direction: row;
    font-size: ${props => props.theme.utils.tsize.s}px;
  }
`
