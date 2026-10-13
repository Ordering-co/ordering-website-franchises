import styled from 'styled-components'

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`

export const QuestionContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 20px;

  h1 {
    margin-bottom: 80px;
  }

  .info-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: space-between;
    width: 100%;
  }

  .box-container {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    width: auto;
    min-height: 240px;
    box-shadow: 0px 1px 4px 0px rgba(0, 0, 0, 0.1);
    padding: 20px;
    margin-bottom: 20px;

    button {
      margin-bottom: 10px;
      height: 50px;
    }

    h2 {
      margin: 0;
    }
  }

  @media (min-width: 576px) {
    .info-container {
      flex-direction: row;
      width: 80vw;
      max-width: 1100px;
    }
    .box-container {
      width: 336px;
    }
    .center {
      width: 100%;
    }
  }
`
