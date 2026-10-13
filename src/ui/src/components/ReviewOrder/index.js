import React, { useState, useEffect } from 'react'
import { useTheme } from 'styled-components'
import { useForm } from 'react-hook-form'
import MdClose from '@meronex/icons/md/MdClose'
import IfillStar from '@meronex/icons/ai/AiFillStar'
import IUnfillStar from '@meronex/icons/ai/AiOutlineStar'

import {
  ReviewOrderContainer,
  Comments,
  Send,
  BusinessLogo,
  WrapperBusinessLogo,
  ReviewsProgressWrapper,
  ReviewsProgressContent,
  LogoAndReviewWrapper,
  CommentsList,
  CommentButton,
  MultiLogosContainer
} from './styles'

import { useLanguage, useUtils, OrderReview as ReviewOrderController } from '~components'
import {
  Alert,
  TextArea,
  Button,
  reviewCommentList,
  useWindowSize
} from '~ui'

const ReviewOrderUI = (props) => {
  const { stars, order, handleSendReview, formState, closeReviewOrder, setIsReviewed, setStars } = props
  const [, t] = useLanguage()
  const [{ optimizeImage }] = useUtils()
  const theme = useTheme()
  const { handleSubmit, errors } = useForm()
  const windowSize = useWindowSize()
  const [alertState, setAlertState] = useState({ open: false, content: [], success: false })
  const [comments, setComments] = useState([])
  const [extraComment, setExtraComment] = useState('')
  const [openExtraComment, setOpenExtraComment] = useState(true)
  const commentsList = reviewCommentList('order')

  const qualificationList = [
    { key: 1, text: t('TERRIBLE', 'Terrible'), middleNode: false, left: 0, right: 'initial' },
    { key: 2, text: t('BAD', 'Bad'), middleNode: true, left: '25%', right: '75%' },
    { key: 3, text: t('OKAY', 'Okay'), middleNode: true, left: '50%', right: '50%' },
    { key: 4, text: t('GOOD', 'Good'), middleNode: true, left: '75%', right: '25%' },
    { key: 5, text: t('GREAT', 'Great'), middleNode: false, left: 'initial', right: 0 }
  ]

  const handleChangeStars = (index) => {
    if (index) setStars({ ...stars, quality: index, punctuality: index, service: index, packaging: index, comments: '' })
    setComments([])
  }

  const handleChangeComment = (commentItem) => {
    const found = comments.find((comment) => comment?.key === commentItem.key)
    if (found) {
      const _comments = comments.filter((comment) => comment?.key !== commentItem.key)
      setComments(_comments)
    } else {
      setComments([...comments, commentItem])
    }
  }

  const isSelectedComment = (commentKey) => {
    const found = comments.find((comment) => comment?.key === commentKey)
    return found
  }

  useEffect(() => {
    if (!formState.loading && formState.result?.error) {
      setAlertState({
        open: true,
        success: false,
        content: formState.result?.result || [t('ERROR', 'Error')]
      })
    }
    if (!formState.loading && !formState.result?.error && alertState.success) {
      setIsReviewed && setIsReviewed(true)
      closeReviewOrder && closeReviewOrder()
    }
  }, [formState])

  useEffect(() => {
    if (Object.keys(errors).length > 0) {
      setAlertState({
        open: true,
        success: false,
        content: Object.values(errors).map(error => error.message)
      })
    }
  }, [errors])

  useEffect(() => {
    if (windowSize.width < 1200) {
      setOpenExtraComment(false)
    }
  }, [windowSize.width])

  const onSubmit = () => {
    if (Object.values(stars).some((value) => value === 0)) {
      setAlertState({
        open: true,
        content: stars.quality === 0 ? [`${t('REVIEW_QUALIFICATION_REQUIRED', 'Review qualification is required')}`] : []
      })
      return
    }
    if (comments.length === 0 && extraComment === '') {
      setAlertState({
        open: true,
        content: [`${t('REVIEW_COMMENT_REQUIRED', 'Review comment is required')}`]
      })
    }
  }

  const closeAlert = () => {
    setAlertState({
      open: false,
      content: []
    })
  }

  useEffect(() => {
    let _comments = ''
    if (comments.length > 0) {
      comments.map(comment => (_comments += comment.content + '. '))
    }
    const _comment = _comments + extraComment
    setStars({ ...stars, comments: _comment })
  }, [comments, extraComment])

  return (
    <>
      <LogoAndReviewWrapper>
        <div className='order-info'>
          <WrapperBusinessLogo isMulti={order?.business?.length > 1}>
            {order?.business?.length > 1
              ? (
              <MultiLogosContainer>
                {order?.business?.map((business, i) => (
                  <React.Fragment key={business?.id}>
                    <BusinessLogo isMulti bgimage={optimizeImage(business?.logo || theme.images?.dummies?.businessLogo, 'h_200,c_limit')} />
                  </React.Fragment>
                ))}
              </MultiLogosContainer>
                )
              : (
              <BusinessLogo bgimage={optimizeImage(order?.business?.logo || theme.images?.dummies?.businessLogo, 'h_200,c_limit')} />
                )}
          </WrapperBusinessLogo>
          <ReviewsProgressWrapper>
            <p>{t('HOW_WAS_THE_ORDER', 'How was the :business: order?').replace(':business:', order?.business?.name)}</p>
            <ReviewsProgressContent>
              {
                qualificationList?.map(qualification => (
                  <div
                    key={qualification?.key}
                  >
                    {qualification?.key <= stars?.quality
                      ? <IfillStar onClick={() => handleChangeStars(qualification?.key)} />
                      : <IUnfillStar onClick={() => handleChangeStars(qualification?.key)} />}
                  </div>
                ))
              }
            </ReviewsProgressContent>
          </ReviewsProgressWrapper>
        </div>
      </LogoAndReviewWrapper>
      <ReviewOrderContainer onSubmit={handleSubmit(onSubmit)}>
        <CommentsList>
          <p>{t('COMMENTS', 'Comments')}</p>
          {
            commentsList[stars?.quality || 1]?.list?.map((commentItem, i) => (
              <CommentButton
                key={i}
                active={isSelectedComment(commentItem?.key)}
                onClick={() => handleChangeComment(commentItem)}
                initialIcon
              >
                {commentItem.content}
                {
                  isSelectedComment(commentItem?.key) && <MdClose />
                }
              </CommentButton>
            ))
          }
        </CommentsList>
        <Comments>
          <div>
            <p onClick={() => setOpenExtraComment(!openExtraComment)}>{t('DO_YOU_WANT_TO_ADD_SOMETHING', 'Do you want to add something?')}</p>
            {openExtraComment && (
              <TextArea
                name='comments'
                value={extraComment}
                onChange={(e) => setExtraComment(e.target.value)}
                autoComplete='off'
              />
            )}
          </div>
        </Comments>
        <Send>
          <span onClick={closeReviewOrder}>{t('SKIP', 'Skip')}</span>
          <Button
            onClick={() => {
              setAlertState({ ...alertState, success: true })
              handleSendReview()
            }}
            color={!formState.loading ? 'primary' : 'secondary'}
            disabled={formState.loading}
            className='review-sent'
          >
            {!formState.loading
              ? t('CONTINUE', 'Continue')
              : t('LOADING', 'Loading')}
          </Button>
        </Send>
        <Alert
          title={t('ORDER_REVIEW', 'Order Review')}
          content={alertState.content}
          acceptText={t('ACCEPT', 'Accept')}
          open={alertState.open}
          onClose={() => closeAlert()}
          onAccept={() => closeAlert()}
          closeOnBackdrop={false}
        />
      </ReviewOrderContainer>
    </>
  )
}

export const ReviewOrder = (props) => {
  const ReviewOrderProps = {
    ...props,
    UIComponent: ReviewOrderUI,
    isToast: true,
    defaultStar: props?.defaultStar ?? 0
  }

  return <ReviewOrderController {...ReviewOrderProps} />
}

export default ReviewOrder
