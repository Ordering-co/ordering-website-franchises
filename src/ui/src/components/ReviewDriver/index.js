import React, { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import MdClose from '@meronex/icons/md/MdClose'
import FaUserAlt from '@meronex/icons/fa/FaUserAlt'
import IfillStar from '@meronex/icons/ai/AiFillStar'
import IUnfillStar from '@meronex/icons/ai/AiOutlineStar'

import {
  ReviewDriverContainer,
  Comments,
  ActionBtnWrapper,
  DriverPhoto,
  WrapperDriverPhoto,
  ReviewsProgressWrapper,
  ReviewsProgressContent,
  LogoAndReviewWrapper,
  CommentsList,
  DriverInfoBlock,
  CommentButton
} from './styles'

import { useLanguage, useUtils, ReviewDriver as ReviewDriverController } from '~components'
import {
  reviewCommentList,
  Alert,
  TextArea,
  Button
} from '~ui'

const ReviewDriverUI = (props) => {
  const {
    dirverReviews,
    order,
    formState,
    setDriverReviews,
    closeReviewDriver,
    setIsDriverReviewed,
    handleSendDriverReview
  } = props

  const [, t] = useLanguage()
  const [{ optimizeImage }] = useUtils()
  const { handleSubmit, errors } = useForm()
  const [comments, setComments] = useState([])
  const [extraComment, setExtraComment] = useState('')
  const [alertState, setAlertState] = useState({ open: false, content: [], success: false })

  const commentsList = reviewCommentList('driver')

  const qualificationList = [
    { key: 1, text: t('TERRIBLE', 'Terrible'), middleNode: false, left: 0, right: 'initial' },
    { key: 2, text: t('BAD', 'Bad'), middleNode: true, left: '25%', right: '75%' },
    { key: 3, text: t('OKAY', 'Okay'), middleNode: true, left: '50%', right: '50%' },
    { key: 4, text: t('GOOD', 'Good'), middleNode: true, left: '75%', right: '25%' },
    { key: 5, text: t('GREAT', 'Great'), middleNode: false, left: 'initial', right: 0 }
  ]

  const handleChangeReviews = (index) => {
    if (index) setDriverReviews({ ...dirverReviews, qualification: index, comment: '' })
    setComments([])
  }

  const onSubmit = () => {
    if (dirverReviews?.qualification === 0) {
      setAlertState({
        open: true,
        content: [`${t('REVIEW_QUALIFICATION_REQUIRED', 'Review qualification is required')}`]
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

  const handleChangeComment = (commentItem) => {
    const found = comments.find((comment) => comment?.key === commentItem.key)
    if (found) {
      const _comments = comments.filter((comment) => comment?.key !== commentItem.key)
      setComments(_comments)
    } else {
      setComments([...comments, commentItem])
    }
  }

  const closeAlert = () => {
    setAlertState({
      open: false,
      content: []
    })
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
      setIsDriverReviewed && setIsDriverReviewed(true)
      closeReviewDriver && closeReviewDriver()
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
    let _comments = ''
    if (comments.length > 0) {
      comments.map(comment => (_comments += comment.content + '. '))
    }
    const _comment = _comments + extraComment
    setDriverReviews({ ...dirverReviews, comment: _comment })
  }, [comments, extraComment])

  return (
    <>
      <LogoAndReviewWrapper>
        <div className='order-info'>
          <WrapperDriverPhoto>
            {(order?.driver?.photo)
              ? (
              <DriverPhoto bgimage={optimizeImage(order?.driver?.photo, 'h_200,c_limit')} />
                )
              : <FaUserAlt />}
          </WrapperDriverPhoto>
          {
            order?.driver?.name && (
              <DriverInfoBlock>{order?.driver?.name} {order?.driver?.lastname}</DriverInfoBlock>
            )
          }
          <ReviewsProgressWrapper>
            <p>{t('HOW_WAS_DELIVERY', 'How was :driver: delivery?').replace(':driver:', `${order?.driver?.name} ${order?.driver?.lastname}`)}</p>
            <ReviewsProgressContent>
              {
                qualificationList?.map(qualification => (
                  <div
                    key={qualification?.key}
                  >
                    {qualification?.key <= dirverReviews?.qualification
                      ? <IfillStar onClick={() => handleChangeReviews(qualification?.key)} />
                      : <IUnfillStar onClick={() => handleChangeReviews(qualification?.key)} />}
                  </div>
                ))
              }
            </ReviewsProgressContent>
          </ReviewsProgressWrapper>
        </div>
      </LogoAndReviewWrapper>
      <ReviewDriverContainer onSubmit={handleSubmit(onSubmit)}>
        <CommentsList>
          <p>{t('COMMENTS', 'Comments')}</p>
          {
            commentsList[dirverReviews?.qualification || 1]?.list?.map((commentItem, i) => (
              <CommentButton
                key={i}
                active={isSelectedComment(commentItem.key)}
                onClick={() => handleChangeComment(commentItem)}
                initialIcon
              >
                {commentItem.content}
                {
                  isSelectedComment(commentItem.key) && <MdClose />
                }
              </CommentButton>
            ))
          }
        </CommentsList>
        <Comments>
          <div>
            <p>{t('DO_YOU_WANT_TO_ADD_SOMETHING', 'Do you want to add something?')}</p>
            <TextArea
              name='comment'
              value={extraComment}
              onChange={(e) => setExtraComment(e.target.value)}
              autoComplete='off'
            />
          </div>
        </Comments>
        <ActionBtnWrapper>
          <Button
            onClick={() => {
              setAlertState({ ...alertState, success: true })
              handleSendDriverReview()
            }}
            color={!formState.loading ? 'primary' : 'secondary'}
            disabled={formState.loading}
            className='review-sent'
          >
            {!formState.loading
              ? (
                  t('SEND_REVIEW', 'Send review')
                )
              : t('LOADING', 'Loading')}
          </Button>
        </ActionBtnWrapper>
        <Alert
          title={t('DRIVER_REVIEW', 'Driver Review')}
          content={alertState.content}
          acceptText={t('ACCEPT', 'Accept')}
          open={alertState.open}
          onClose={() => closeAlert()}
          onAccept={() => closeAlert()}
          closeOnBackdrop={false}
        />
      </ReviewDriverContainer>
    </>
  )
}

export const ReviewDriver = (props) => {
  const reviewDriverProps = {
    ...props,
    UIComponent: ReviewDriverUI,
    isToast: true
  }

  return <ReviewDriverController {...reviewDriverProps} />
}

export default ReviewDriver
