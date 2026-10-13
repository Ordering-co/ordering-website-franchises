import React from 'react'
import moment from 'moment'
import { useTheme } from 'styled-components'
import Skeleton from 'react-loading-skeleton'
import BsFillStarFill from '@meronex/icons/bs/BsFillStarFill'
import IfillStar from '@meronex/icons/ai/AiFillStar'
import IUnfillStar from '@meronex/icons/ai/AiOutlineStar'
import { StarFill } from 'react-bootstrap-icons'

import {
  BusinessReviewsContainer,
  ReviewOf,
  Content,
  Review,
  ReviewsNotFound,
  SkeletonContainer,
  ReviewsHeaderWrapper,
  ReviewsProgressWrapper,
  ReviewsProgressContent,
  ReviewsProgressBar,
  ReviewsMarkPoint,
  ReviewTime,
  ReviewItemHeader,
  ReviewItemContent,
  SearchContainer,
  ReviewStars,
  ReviewsWrapper,
  ReviewsProgressStars
} from './styles'

import { BusinessReviews as BusinessReviewController, useLanguage } from '~components'

export const BusinessReviewsUI = (props) => {
  const { stars, reviewsList, handleClickOption, onChangeReview } = props
  const [, t] = useLanguage()
  const theme = useTheme()

  const handleOnChange = (evt) => {
    if (evt.target.value) onChangeReview(evt.target.value)
    else onChangeReview('')
  }

  const handleClickRating = (rating) => {
    if (rating) handleClickOption(rating)
  }

  const showRanking = false
  const showReviewDate = !theme?.business_view?.components?.reviews?.components?.review_date?.hidden
  const showCustomerComments = !theme?.business_view?.components?.reviews?.components?.customer_comments?.hidden
  const showSearch = !theme?.business_view?.components?.review?.components?.search?.hidden && reviewsList?.reviews?.length > 0
  const hideElement = !(!showReviewDate && !showCustomerComments)

  const reviewPoints = [1, 2, 3, 4, 5]

  return (
    <BusinessReviewsContainer>
      {reviewsList.error
        ? <h2>{t('ERROR_UNKNOWN', 'An error has ocurred')}</h2>
        : (
        <>
          <ReviewsHeaderWrapper noReviews={reviewsList?.reviews.length === 0}>
            {
              !reviewsList.loading
                ? (
                    <h2>{t('REVIEWS', 'Reviews')}</h2>
                  )
                : (
                    <Skeleton width={100} height={30} />
                  )
            }
          </ReviewsHeaderWrapper>
          <ReviewsWrapper>
            <div className='rating'>
              <BsFillStarFill />
              {!!stars && stars}
            </div>
            {reviewsList?.reviews.length > 0 && (
              <div className='review-amount'>
                {reviewsList?.reviews.length} {t('REVIEWS', 'Reviews')}
              </div>
            )}
          </ReviewsWrapper>
          <div className='info-wrapper'>
            {showSearch && (
              <ReviewOf>
                {!reviewsList.loading
                  ? (
                    <SearchContainer>
                      <input
                        type= 'text'
                        onChange={handleOnChange}
                        placeholder={t('SEARCH', 'Search')}
                        style={{ backgroundImage: `url(${theme?.images?.general?.searchIcon})` }}
                      />
                    </SearchContainer>
                    )
                  : <Skeleton width={200} height={30} />}
              </ReviewOf>
            )}
            {showRanking && (
              <ReviewsProgressWrapper>
                <p>{t('CUSTOMER_REVIEWS', 'Customers reviews')}</p>
                <ReviewsProgressContent>
                  <ReviewsProgressBar style={{ width: `${(stars / 5) * 100}%` }} />
                  {reviewPoints.map((reviewPoint, i) => {
                    const isLastReviewPoint = i === reviewPoints?.length - 1
                    return (
                      <ReviewsMarkPoint
                        key={i}
                        onClick={() => handleClickRating(i + 1)}
                        style={{
                          left: theme.rtl !== isLastReviewPoint ? 'initial' : `${25 * (isLastReviewPoint ? 0 : i)}%`,
                          right: theme.rtl !== isLastReviewPoint ? `${25 * (isLastReviewPoint ? 0 : i)}%` : 'initial'
                        }}
                      >
                        <ReviewStars>
                          {reviewPoint}
                          <StarFill className='start' />
                        </ReviewStars>
                      </ReviewsMarkPoint>
                    )
                  })}
                </ReviewsProgressContent>
              </ReviewsProgressWrapper>
            )}
            {hideElement && (
              <Content id='content'>
                {!reviewsList.loading
                  ? reviewsList?.reviews.map((review) => (
                  <Review key={review.id} id='review'>
                    {showReviewDate && (
                      <ReviewItemHeader>
                        <ReviewTime>{moment(review?.created_at).format('LLL')}</ReviewTime>
                        <ReviewsProgressStars>
                          {
                            [...Array(5)].map((data, i) => (
                              <div
                                key={i + 1}
                              >
                                {(i + 1) <= review?.total
                                  ? <IfillStar />
                                  : <IUnfillStar />}
                              </div>
                            ))
                          }
                        </ReviewsProgressStars>
                      </ReviewItemHeader>
                    )}
                    {showCustomerComments && (
                      <ReviewItemContent>{review?.comment || t('NO_COMMENT_LEFT', 'Did not leave a comment')}</ReviewItemContent>
                    )}
                  </Review>
                  ))
                  : (
                  <>
                    {[...Array(2)].map((item, i) => (
                      <SkeletonContainer key={i}>
                        <div>
                          <Skeleton width={100} height={30} />
                          <Skeleton width={100} />
                        </div>
                        <div>
                          <Skeleton width={150} height={50} />
                        </div>
                      </SkeletonContainer>
                    ))}

                  </>
                    )}
                {!reviewsList.loading && reviewsList?.reviews.length === 0 && (
                  <ReviewsNotFound>{t('NO_REVIEWS', 'No reviews')}</ReviewsNotFound>
                )}
              </Content>
            )}
          </div>

        </>
          )}
    </BusinessReviewsContainer>
  )
}

export const BusinessReviews = (props) => {
  const BusinessReviewProps = {
    ...props,
    showEmptyComments: true,
    UIComponent: BusinessReviewsUI
  }
  return <BusinessReviewController {...BusinessReviewProps} />
}
