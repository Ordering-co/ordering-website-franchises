import styled, { css } from 'styled-components'

export const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
`

export const Wrapper = styled.div`
    width: 100%;
    display: flex;
    flex-direction: column;
    padding: 30px 30px;

    .name-wrapper {
      display: flex;
      justify-content: center;
      margin-bottom: 20px;

      h1 {
        margin: 0;
        font-size: ${({ theme }) => theme?.utils?.tsize?.xxl}px;
        font-weight: 800;
      }
    }

    @media (min-width: 768px) {
      padding: 30px 20vw;
    }
`

export const MenuLink = styled.a`
  position: relative;
  cursor: pointer;
  overflow: hidden;
  text-decoration: none;
  appearance: none;
  border: none;
  padding: 0px;
  margin: 0px;
  text-align: inherit;
  display: block;
  width: 100%;
  background: ${({ theme }) => theme.colors.backgroundPage};
  outline: none !important;

  &:hover {
    color: #f1f1f1;
  }

  @media (max-height: 450px) {
    font-size: 18px;
  }
`

export const WrappContent = styled.div`

  display: flex;
  justify-content: space-between;

  .wrapper {
    display: flex;
    padding: 20px 0;
  }
`

export const MenuLinkIcon = styled.div`
  display: flex;
  align-items: center;
  padding-right: 20px;

  ${({ noPadding }) => noPadding && css`
    padding: 0;
  `}

  svg {
    color: #000;
    width: 26px;
    height: 26px;
    color: ${({ active, theme }) => active ? theme.colors.primary : '#000'}
  }
`

export const MenuLinkText = styled.div`
  max-width: 100%;
`

export const TextInfo = styled.span`
  font-size: 18px;
  font-weight: 500;
  line-height: 24px;
  text-transform: capitalize;
  text-align: left;
  margin: 0px;
  padding: 0px;
  display: block;
  font-variant-ligatures: no-common-ligatures;
  max-width: 100%;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  color: ${({ active, theme }) => active ? theme.colors.primary : '#000'};

  ${props => props.theme?.rtl && css`
    text-align: right;
    display: inline-block;
    color: #000;
  `}
`

export const LanguageSelectorWrapper = styled.div`
  display: flex;
  align-items: center;
  width: 100%;
  padding-right: 15px;

  p {
    font-weight: 500;
    font-size: 20px;
    color: ${props => props.theme.colors.darkTextColor};
    width: 100%;
    text-align: left;
    margin: 0 0 7px 0;
  }

  > div {
    width: 100%;
    border-radius: 7.6px;
    text-align: left;
    background: #F8F9FA !important;
    border-color: #F8F9FA;
    height: 44px;

    > div:first-child {
      height: 44px;
    }

    #list {
      width: 100%;
      border-radius: 7.6px;
      background: #F8F9FA !important;
      border-color: #F8F9FA;
      box-shadow: 0px 10px 12px 1px #e6e6e6;
    }
  }
`

export const LogoutWrapper = styled.div`
  padding-top: 50px;

  * {
    color: ${({ theme }) => theme.colors.primary};
  }

  #logoutbtn {
    > div {
      padding: 0 5px;
    }
  }
`
