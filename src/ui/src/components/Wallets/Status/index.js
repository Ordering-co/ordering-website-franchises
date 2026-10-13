import React, { useState } from 'react'
import { TrophyFill } from 'react-bootstrap-icons'

import {
  StatusBarWrapper,
  StatusBar,
  StatusPointsContent,
  StatusRedeemGiftCard,
  StatusWrapperPoints,
  StatusPointsWrapper
} from './styles'
import { TabContainer } from '../styles'
import { Benefits } from './Benefits'

import { useLanguage } from '~components'
import { Button, Modal } from '~ui'

export const Status = (props) => {
  const { userLoyaltyLevel, levelList } = props

  const [, t] = useLanguage()

  const [openBenefits, setOpenBenefits] = useState(false)

  const loyaltyBenefits = userLoyaltyLevel?.loyaltyLevel?.benefits ?? []

  const calculateNextLevelProgress = (currentLevelId, currentPoints) => {
    const levels = levelList?.levels?.sort((a, b) => a.minimum_points - b.minimum_points)
    const currentIndex = levels && levels?.findIndex((level) => level.id === currentLevelId)
    const nextLevel = levels && levels[currentIndex + 1]

    if (!nextLevel) {
      return { nextLevelPercentage: 100, missingPoints: 0 }
    }

    const pointsToNextLevel = nextLevel.minimum_points - currentPoints
    const pointsInCurrentLevel = nextLevel.minimum_points - (levels[currentIndex]?.minimum_points || 0)
    const pointsEarnedInCurrentLevel = currentPoints - (levels[currentIndex]?.minimum_points || 0)
    const nextLevelPercentage = (pointsEarnedInCurrentLevel / pointsInCurrentLevel) * 100

    return {
      nextLevelPercentage: Math.min(nextLevelPercentage, 100),
      missingPoints: Math.max(pointsToNextLevel, 0),
      nextLevel
    }
  }

  const { nextLevelPercentage, missingPoints, nextLevel } = calculateNextLevelProgress(
    userLoyaltyLevel?.loyaltyLevel?.id,
    userLoyaltyLevel?.loyaltyLevel?.loyalty_level_points
  )

  return (
    <>
      <TabContainer>
        <StatusRedeemGiftCard>
          <StatusPointsContent>
            <StatusWrapperPoints>
              <span className='level-name'>
                {userLoyaltyLevel?.loyaltyLevel?.name}
              </span>
              <div className='level-points-wrapper'>
                <span className='level-points'>{userLoyaltyLevel?.loyaltyLevel?.loyalty_level_points}</span>
                <span>{t('ACCUMULATED_POINTS', 'Accumulated points')}</span>
              </div>
              <StatusBarWrapper>
                <StatusBar nextLevelPercentage={nextLevelPercentage} />
              </StatusBarWrapper>
              <StatusPointsWrapper>
                <div className='reach-level'>
                  {missingPoints > 0
                    ? (
                    `${t('NEXT_LEVEL_TITLE', 'You need _points_ to reach').replace('_points_', missingPoints)} ${nextLevel?.name}`
                      )
                    : (
                        t('YOU_ARE_IN_LAST_LEVEL', 'You already reach the last level')
                      )}
                </div>
                {loyaltyBenefits.length > 0 && (
                  <Button
                    color='primary'
                    outline
                    onClick={() => setOpenBenefits(!openBenefits)}
                  >
                    {t('VIEW_BENEFITS', 'View Benefits')}
                  </Button>
                )}
              </StatusPointsWrapper>
            </StatusWrapperPoints>
            <div className='icon'>
              <TrophyFill />
            </div>
          </StatusPointsContent>
        </StatusRedeemGiftCard>
      </TabContainer>
      <Modal
        closeIconRight
        padding='20px 50px'
        open={openBenefits}
        onClose={() => setOpenBenefits(false)}
      >
        <Benefits
          title={userLoyaltyLevel?.loyaltyLevel?.name}
          image={userLoyaltyLevel?.loyaltyLevel?.image}
          benefits={loyaltyBenefits}
        />
      </Modal>
    </>
  )
}
