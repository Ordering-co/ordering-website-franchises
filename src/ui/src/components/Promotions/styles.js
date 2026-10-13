import styled, { css } from 'styled-components'

export const PromotionsContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  align-items: center;
  margin: 0 auto;
  padding: 0 20px;
  box-sizing: border-box;

  ${({ hideTitle }) => hideTitle && css`
    margin-top: 40px;
  `}

  @media (min-width: 993px){
    width: 80%;
    max-width: 800px;
    padding: 0px;
  }
`

export const PromotionTitle = styled.h1`
  align-self: flex-start;
`

export const SingleOfferContainer = styled.div`
  display: flex;
  width: 100%;
  padding: 20px;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  border-radius: ${props => props.theme?.utils.radius.m}px;
  border: 1px solid ${({ theme }) => theme.colors.gray200};

  p, h2 {
    margin: 0;
  }
  h2 {
    font-size: ${({ theme }) => theme?.utils?.tsize?.s + 'px'};
  }
  p {
    font-size: ${({ theme }) => theme?.utils?.tsize?.xxs + 'px'};
    font-weight: 400;
  }

  button {
    height: 38px;
    font-size: ${({ theme }) => theme?.utils?.tsize?.xs + 'px'};
  }
`

export const Description = styled.p`
  color: ${({ theme }) => theme.colors.darkGray};
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
`
export const ExpiresAt = styled.p`
  color: ${({ theme }) => theme.colors.darkTextColor};

  ${({ margin }) => margin && css`
    margin: 10px 0;
    font-size: ${({ theme }) => theme?.utils?.tsize?.xs + 'px'};
  `}
`

export const OfferInfoWrapper = styled.div`
  display: flex;
  max-width: 70%;
  align-items: center;
`

export const OfferInformation = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  width: 50%;
  height: 100px;

  ${({ isSkeleton }) => isSkeleton && css`
    width: 100%;
  `}

  h2 {
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    line-clamp: 2;
    -webkit-box-orient: vertical;
    font-size: ${({ theme }) => theme?.utils?.tsize?.s + 'px'};
  }
  @media (min-width: 720px){
    width: 70%;
    h2 {
      font-size: ${({ theme }) => (theme?.utils?.tsize?.s + 2) + 'px'};
    }
  }
`

export const SearchBarContainer = styled.div`
  display: flex;
  width: 100%;
  justify-content: flex-start;
  margin-bottom: 20px;
  .search-bar {
    justify-content: flex-start;
    input {
      width: 100%;
    }
  }
  .clear {
    right: 0;
  }
`

const BusinessLogoStyled = styled.div`
  width: 100px;
  height: 100px;
  box-sizing: border-box;
  position: relative;
  background-repeat: no-repeat, repeat;
  background-size: cover;
  object-fit: cover;
  background-position: center;
  min-height: 65px;
  border-radius: 50px;

  @media (min-width: 481px){
    min-width: 100px;
    min-height: 100px;
    ${({ isCustomerMode }) => isCustomerMode && css`
      width: 100%;
      height: 100%;
    `}
  }
`

export const BusinessLogo = styled(BusinessLogoStyled)`
  background-image: url(${props => props.bgimage});

  ${({ size }) => size && css`
    width: ${({ size }) => size};
    height: ${({ size }) => size};
    min-height: ${({ size }) => size};

    @media (min-width: 481px){
      min-width: ${({ size }) => size};
      min-height: ${({ size }) => size};
      ${({ isCustomerMode }) => isCustomerMode && css`
        width: 100%;
        height: 100%;
      `}
    }
  `}
`

export const SingleBusinessOffer = styled.div`
  display: flex;
  padding: 20px;
  margin-bottom: 20px;
  border-radius: ${props => props.theme?.utils.radius.m}px;
  box-shadow: 0px 1px 4px 0px rgba(0, 0, 0, 0.1);

  button {
    font-size: ${({ theme }) => theme?.utils?.tsize?.xs + 'px'};
  }
`

export const AvailableBusinesses = styled.div`
  display: flex;
  white-space: pre;
  width: 80%;
  p:nth-child(2){
    overflow: hidden;
    text-overflow: ellipsis;
  }
`

export const OfferData = styled.div`
  display: flex;
  align-items: center;
  flex-direction: column;

  p {
    color: ${({ theme }) => theme.colors.darkGray};
    margin: 3px;
    font-size: ${({ theme }) => theme?.utils?.tsize?.xs + 'px'};
  }
`

export const Code = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  span{
    color: ${({ theme }) => theme.colors.primary};
    font-size: 24px;
    margin-bottom: 20px;
  }
  p{
    font-size: 16px;
  }
`

export const ValueOfOffer = styled.div`
  p{
    font-size: 16px;
  }
  span{
    font-size: 20px;
  }
`

export const BusinessInfo = styled.div`
  display: flex;
  width: 100%;
  justify-content: space-between;
  align-items: center;
  margin-left: 10px;

  button {
    min-height: 44px;
    height: auto;
  }

  p {
    font-size: ${({ theme }) => theme?.utils?.tsize?.xs + 'px'};
    font-weight: 700;
    width: 50%;
    text-align: left;
  }
  @media(min-width: 720px){
    p {
      font-size: ${({ theme }) => theme?.utils?.tsize?.s + 'px'};
      width: 70%;
    }
  }
`

export const OfferView = styled.div`

  h2 {
    font-size: 16px;
  }

  .logo-info {
    margin-top: 5px;
    display: flex;
    flex-direction: column;
    align-items: center;
  }
  @media(min-width: 720px){
    h2 {
      font-size: 20px;
    }
  }
`
export const Divider = styled.div`
  height: 100px;
  color: ${({ theme }) => theme.colors.gray200};
  margin: 0 15px 0 10px;
  border-right: 1px dashed ${({ theme }) => theme.colors.gray200};
  border-left: 1px dashed ${({ theme }) => theme.colors.gray200};
`
