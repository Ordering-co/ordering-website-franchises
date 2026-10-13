import React from 'react'
import { BenefitItem, BenefitsContainer, BenefitsList, BenefitsWrapper } from './styles'

export const Benefits = (props) => {
  const { title, image, benefits } = props

  return (
    <BenefitsWrapper>
      <BenefitsContainer>
        <div className='title'>
          {title}
        </div>
        {!!image && (
          <img
            src={image}
            style={{ width: 200, height: 200 }}
          />
        )}
        <BenefitsList>
          {benefits.map((item, index) => (
            <BenefitElement key={index} benefit={item} index={index + 1} />
          ))}
        </BenefitsList>
      </BenefitsContainer>
    </BenefitsWrapper>
  )
}

const BenefitElement = ({ index, benefit }) => {
  return (
    <BenefitItem>
      <div className='number'>
        {index}{'.'}
      </div>
      <div>
        {benefit}
      </div>
    </BenefitItem>
  )
}
