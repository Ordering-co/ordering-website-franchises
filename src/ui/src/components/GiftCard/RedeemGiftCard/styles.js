import styled from 'styled-components'

export const Container = styled.div`
  h2 {
    font-size: ${({ theme }) => theme?.utils?.tsize?.m}px;
    font-weight: 600;
    text-align: center;
    margin-top: 0;
    margin-bottom: 48px;
  }

  p {
    font-size: ${({ theme }) => theme?.utils?.tsize?.xs}px;
    line-height: 18px;
    margin: 6px 0;
    color: ${props => props.theme.colors.darkGray};
  }

  button {
    height: 50px;
    margin-top: 30px;
  }
`
export const FormContainer = styled.form`
  display: flex;
  flex-direction: column;
`
export const FormController = styled.div`
  display: flex;
  flex-direction: column;
  margin-bottom: 28px;

  label {
    margin-bottom: 10px;
    font-size: ${({ theme }) => theme?.utils?.tsize?.xs}px;
  }

  input {
    padding: 15px 15px;
  }
`
export const GiftCardInfoContainer = styled.div`
  display: flex;
  flex-direction: column;
`
