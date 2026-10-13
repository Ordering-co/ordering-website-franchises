import styled from 'styled-components'

export const StatusRedeemGiftCard = styled.div`
  width: 100%;
  margin-top: 40px;
  display: flex;
  flex-direction: column;
  box-shadow: 0px 1px 4px 0px rgba(0, 0, 0, 0.1);
  padding: 15px 20px;
  border-radius: ${({ theme }) => theme.utils.radius.m}px;
`

export const StatusPointsContent = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  width: 100%;

  .icon {
    display: flex;
    justify-content: center;
    color: ${props => props.theme.colors.yellow};
    font-size: 150px;
    margin: 10px 0;
    transform: rotate(15deg) rotateY(35deg);
    margin-top: 20px;
  }

  @media (min-width: 576px) {
    flex-direction: row;

    .icon {
      margin: 0;
    }
  }

  @media (min-width: 956px) {
    .icon {
      margin: 0 10px 0 0;
    }
  }
`
export const StatusPointsWrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  width: 100%;

  .reach-level {
    color: ${props => props.theme.colors.darkGray};
  }

  button {
    min-height: 37px;
    min-width: 150px;
    margin-top: 10px;
  }

  @media (min-width: 576px) {
    flex-direction: row;
    padding-top: 10px;

    button {
      margin-top: 0px;
      margin-left: 20px;
    }
  }
`

export const StatusWrapperPoints = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  width: 100%;
  min-height: 220px;

  .level-name {
    color: ${props => props.theme.colors.primary};
    font-size: ${props => props.theme.utils.tsize.s}px;
    font-weight: 700;
  }

  .level-points-wrapper {

    .level-points {
      font-size: calc(3vw + 10px);
      padding-right: 5px;
    }

    span:last-child {
      color: ${props => props.theme.colors.darkGray};
    }


    @media (min-width: 1134px) {
      display: block;

      .level-points {
        font-size: 64px;
      }
    }
  }

  @media (min-width: 576px) {
    width: 70%;
  }
`

export const StatusBarWrapper = styled.div``

export const StatusBar = styled.div`
  width: 100%;
  height: 20px;
  border-radius: 10px;
  background: linear-gradient(
    to right,
    ${({ theme }) => theme.colors.primary} ${props => props.nextLevelPercentage}%,
    ${({ theme }) => theme.colors.grayDividerColor} ${props => props.nextLevelPercentage}%
  );
`

export const StatusDivider = styled.div``

export const BenefitsWrapper = styled.div``

export const BenefitsContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 20px;

  .title {
    font-size: ${({ theme }) => theme?.utils?.tsize?.l}px;
    font-weight: 800;
    color: ${({ theme }) => theme.colors.headingColor};
    margin-bottom: 20px;
  }
`

export const BenefitItem = styled.div`
  box-shadow: 0px 1px 4px 0px rgba(0, 0, 0, 0.1);
  padding: 20px;
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
  margin-bottom: 20px;
  border-radius: ${({ theme }) => theme?.utils?.radius?.m}px;

  .number {
    color: ${({ theme }) => theme.colors.primary};
    font-size: ${({ theme }) => theme?.utils?.tsize?.m}px;
    font-weight: 700;
    padding-right: 20px;
  }

  div {
    font-size: ${({ theme }) => theme?.utils?.tsize?.xs}px;
    color: ${({ theme }) => theme.colors.headingColor};
  }

  @media (min-width: 1200px) {
    .number {
      font-size: ${({ theme }) => theme?.utils?.tsize?.l}px;
    }

    div {
      font-size: ${({ theme }) => theme?.utils?.tsize?.s}px;
    }
  }
`

export const BenefitsList = styled.div`
  margin-top: 20px;
  width: 100%;
`
