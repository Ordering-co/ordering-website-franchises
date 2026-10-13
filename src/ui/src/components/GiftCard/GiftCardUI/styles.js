import styled, { css } from 'styled-components'

export const Container = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-between;
  margin: 30px 0;
  padding: 50px 0px;
  border-radius: ${props => props.theme?.utils.radius.m}px;
  box-shadow: 0px 1px 4px 0px rgba(0, 0, 0, 0.1);

  .left-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding-left: 10px;

    img {
      width: 50px;
    }
  }

  .right-container {
    padding-right: 40px;
  }

  @media (min-width: 458px) {
    .left-container {
      padding-left: 40px;
    }
  }

  @media (min-width: 968px) {
    .left-container {
      display: flex;
      flex-direction: row;
      align-items: center;
      padding-left: 40px;

      img {
        width: 130px;
      }
    }
  }
`
export const TitleWrapper = styled.div`
  display: flex;
  align-items: center;

  h1 {
    padding: 10px 20px;
    margin: 0;
    font-size: 20px;
    font-weight: 700;
  }
`
export const ActionWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;

  > button {
    height: 50px;
    &:first-child {
      margin-bottom: 20px;
    }
  }

  @media (min-width: 968px) {
    flex-direction: row;
    > button {

      &:first-child {
        margin-bottom: 0px;
        ${props => props.theme?.rtl
          ? css`
                  margin-left: 20px;
          `
          : css`
            margin-right: 20px;
          `
        }
      }
    }
  }
`
