import styled from 'styled-components'

export const AccordionSection = styled.div`
  background: #FFF;

  .info-wrapper {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 20px;
    margin-bottom: 20px;
    border-radius: ${props => props.theme?.utils.radius.m}px;
    cursor: pointer;
    box-shadow: 0px 1px 4px 0px rgba(0, 0, 0, 0.1);


    h4 {
      margin: 0px;
      font-size: ${({ theme }) => theme?.utils?.tsize?.xs + 'px'};
    }

    p {
      margin: 0px 0 10px;
    }

    p:last-child {
      margin: 0px;
    }
  }
`

export const Accordion = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`

export const DropdownWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;

  > h4 {
    font-size: 16px;
  }
`
export const HoursWrappers = styled.div`
  flex-direction: column;
  padding-left: 60px;

  p {
    margin: 0px 0px 10px 0px;
  }
`

export const ClosedSchedule = styled.p`
  color: ${props => props.theme?.colors?.danger500};
  margin: 0px !important;
`
