import React, { useEffect, useState } from 'react'
import { useTheme } from 'styled-components'
import AiOutlineLogin from '@meronex/icons/ai/AiOutlineLogin'
import AiOutlineUserAdd from '@meronex/icons/ai/AiOutlineUserAdd'
import FaRegAddressCard from '@meronex/icons/fa/FaRegAddressCard'
import { Tag, ChevronRight, GeoAlt, Heart, ChatDots, Wallet2, Globe, ListUl, LifePreserver } from 'react-bootstrap-icons'

import {
  Container,
  Wrapper,
  MenuLink,
  WrappContent,
  MenuLinkIcon,
  MenuLinkText,
  TextInfo,
  LanguageSelectorWrapper,
  LogoutWrapper
} from './styles'

import { useEvent, useLanguage, useSession, useConfig } from '~components'
import {
  LogoutButton,
  Modal,
  SignUpForm,
  LoginForm,
  ForgotPasswordForm,
  LanguageSelector,
  useIsMounted
} from '~ui'

import { getUtils } from './utils'

export const Account = (props) => {
  const { auth, isHideSignup, userCustomer, notificationState } = props
  const [, { login }] = useSession()
  const [events] = useEvent()
  const [{ configs }] = useConfig()
  const [, t] = useLanguage()
  const theme = useTheme()
  const { TagOrders } = getUtils()

  const isMounted = useIsMounted()
  const [modalIsOpen, setModalIsOpen] = useState(false)
  const [modalPageToShow, setModalPageToShow] = useState(null)
  const [showLanguageSelector, setShowLanguageSelector] = useState(false)
  const isWalletEnabled = configs?.cash_wallet?.value && configs?.wallet_enabled?.value === '1' && (configs?.wallet_cash_enabled?.value === '1' || configs?.wallet_credit_point_enabled?.value === '1') && configs?.disabled_rewards?.value !== '1'
  const isPromotionsEnabled = configs?.advanced_offers_module?.value === '1' || configs?.advanced_offers_module?.value === true
  const hideOrders = theme?.bar_menu?.components?.orders?.hidden
  const hideFavorites = theme?.bar_menu?.components?.favorites?.hidden
  const hideProfile = theme?.bar_menu?.components?.profile?.hidden
  const hideWallet = theme?.bar_menu?.components?.wallet?.hidden
  const hideMessages = theme?.bar_menu?.components?.messages?.hidden
  const hideHelp = theme?.bar_menu?.components?.help?.hidden
  const hideSession = theme?.bar_menu?.components?.sessions?.hidden
  const hidePromotions = true

  const closeModal = () => {
    setModalIsOpen(false)
    setModalPageToShow(null)
  }

  const handleSuccessLogin = (user) => {
    if (user) {
      window.location.reload()
      closeModal()
    }
  }

  const handleOpenLoginSignUp = (index) => {
    setModalPageToShow(index)
    setModalIsOpen(true)
  }

  const handleGoToPage = (data) => {
    events.emit('go_to_page', data)
  }

  const handleCustomModalClick = (e, { page }) => {
    e.preventDefault()
    setModalPageToShow(page)
  }

  const handleSuccessSignup = (user) => {
    login({
      user,
      token: user?.session?.access_token
    })
    closeModal()
  }

  useEffect(() => {
    if (!isMounted) return
    window.scrollTo(0, 0)
  }, [isMounted])

  return (
    <Container $auth={auth}>
      <Wrapper>
        {userCustomer && (
          <div className='name-wrapper'>
            <h1>{userCustomer?.name} {userCustomer?.lastname}</h1>
          </div>
        )}

        {auth && !userCustomer?.guest_id && (
          <>
            <MenuLink
              onClick={() => handleGoToPage({ page: 'profile', search: '?view=savedPlaces' })}
            >
              <WrappContent>
                <div className='wrapper'>
                  <MenuLinkIcon>
                    <GeoAlt />
                  </MenuLinkIcon>
                  <MenuLinkText>
                    <TextInfo>
                      {t('MY_SAVED_PLACES', 'My saved places')}
                    </TextInfo>
                  </MenuLinkText>
                </div>
                <MenuLinkIcon noPadding>
                  <ChevronRight />
                </MenuLinkIcon>
              </WrappContent>
            </MenuLink>
            {
              !hideFavorites && (
                <MenuLink
                  onClick={() => handleGoToPage({ page: 'favorite' })}
                >
                  <WrappContent>
                    <div className='wrapper'>
                      <MenuLinkIcon>
                        <Heart />
                      </MenuLinkIcon>
                      <MenuLinkText>
                        <TextInfo>
                          {t('ACCOUNT_MY_FAVORITES', 'My favorites')}
                        </TextInfo>
                      </MenuLinkText>
                    </div>
                    <MenuLinkIcon noPadding>
                      <ChevronRight />
                    </MenuLinkIcon>
                  </WrappContent>
                </MenuLink>
              )
            }
            {
              !hideOrders && (
                <MenuLink
                  onClick={() => handleGoToPage({ page: 'orders' })}
                >
                  <WrappContent>
                    <div className='wrapper'>
                      <MenuLinkIcon>
                        <TagOrders />
                      </MenuLinkIcon>
                      <MenuLinkText>
                        <TextInfo>
                          {t('MY_ORDERS', 'My Orders')}
                        </TextInfo>
                      </MenuLinkText>
                    </div>
                    <MenuLinkIcon noPadding>
                      <ChevronRight />
                    </MenuLinkIcon>
                  </WrappContent>
                </MenuLink>
              )
            }
            {!hideMessages && (
              <MenuLink
                onClick={() => handleGoToPage({ page: 'messages' })}
              >
                <WrappContent>
                  <div className='wrapper'>
                    <MenuLinkIcon>
                      <ChatDots />
                    </MenuLinkIcon>
                    <MenuLinkText>
                      <TextInfo>
                        {t('MESSAGES', 'Messages')}
                      </TextInfo>
                    </MenuLinkText>
                  </div>
                  <MenuLinkIcon noPadding>
                    <ChevronRight />
                  </MenuLinkIcon>
                </WrappContent>
              </MenuLink>
            )}
            {isWalletEnabled && !hideWallet && (
              <MenuLink
                onClick={() => handleGoToPage({ page: 'wallets' })}
              >
                <WrappContent>
                  <div className='wrapper'>
                    <MenuLinkIcon>
                      <Wallet2 />
                    </MenuLinkIcon>
                    <MenuLinkText>
                      <TextInfo>
                        {t('WALLETS', 'Wallets')}
                      </TextInfo>
                    </MenuLinkText>
                  </div>
                  <MenuLinkIcon noPadding>
                    <ChevronRight />
                  </MenuLinkIcon>
                </WrappContent>
              </MenuLink>
            )}
            {!hideProfile && (
              <MenuLink
                onClick={() => handleGoToPage({ page: 'profile' })}
              >
                <WrappContent>
                  <div className='wrapper'>
                    <MenuLinkIcon>
                      <FaRegAddressCard />
                    </MenuLinkIcon>
                    <MenuLinkText>
                      <TextInfo>
                        {t('VIEW_ACCOUNT', 'View account')}
                      </TextInfo>
                    </MenuLinkText>
                  </div>
                  <MenuLinkIcon noPadding>
                    <ChevronRight />
                  </MenuLinkIcon>
                </WrappContent>
              </MenuLink>
            )}
            {isPromotionsEnabled && !hidePromotions && (
              <MenuLink
                onClick={() => handleGoToPage({ page: 'promotions' })}
              >
                <WrappContent>
                  <div className='wrapper'>
                    <MenuLinkIcon>
                      <Tag />
                    </MenuLinkIcon>
                    <MenuLinkText>
                      <TextInfo>
                        {t('PROMOTIONS', 'Promotions')}
                      </TextInfo>
                    </MenuLinkText>
                  </div>
                  <MenuLinkIcon noPadding>
                    <ChevronRight />
                  </MenuLinkIcon>
                </WrappContent>
              </MenuLink>
            )}
            {!hideSession && (
              <MenuLink
                onClick={() => handleGoToPage({ page: 'sessions' })}
              >
                <WrappContent>
                  <div className='wrapper'>
                    <MenuLinkIcon>
                      <ListUl />
                    </MenuLinkIcon>
                    <MenuLinkText>
                      <TextInfo>
                        {t('SECURITY', 'Security')}
                      </TextInfo>
                    </MenuLinkText>
                  </div>
                  <MenuLinkIcon noPadding>
                    <ChevronRight />
                  </MenuLinkIcon>
                </WrappContent>
              </MenuLink>
            )}
            {!hideHelp && (
              <MenuLink
                onClick={() => handleGoToPage({ page: 'help' })}
              >
                <WrappContent>
                  <div className='wrapper'>
                    <MenuLinkIcon>
                      <LifePreserver />
                    </MenuLinkIcon>
                    <MenuLinkText>
                      <TextInfo>
                        {t('HELP', 'help')}
                      </TextInfo>
                    </MenuLinkText>
                  </div>
                  <MenuLinkIcon noPadding>
                    <ChevronRight />
                  </MenuLinkIcon>
                </WrappContent>
              </MenuLink>
            )}
            <WrappContent>
              {showLanguageSelector && (
                <div className='wrapper'>
                  <MenuLinkIcon>
                    <Globe />
                  </MenuLinkIcon>
                </div>
              )}
              <LanguageSelectorWrapper>
                <LanguageSelector setShowLanguageSelector={setShowLanguageSelector} />
              </LanguageSelectorWrapper>
            </WrappContent>
            <LogoutWrapper>
              <LogoutButton />
            </LogoutWrapper>
          </>
        )}
        {((auth && userCustomer?.guest_id) || !auth) && (
          <>
            <MenuLink
              onClick={() => {
                handleOpenLoginSignUp('login')
              }}
            >
              <WrappContent>
                <div className='wrapper'>
                  <MenuLinkIcon>
                    <AiOutlineLogin />
                  </MenuLinkIcon>
                  <MenuLinkText>
                    <TextInfo>
                      {t('SIGN_IN', 'Sign in')}
                    </TextInfo>
                  </MenuLinkText>
                </div>
                <MenuLinkIcon noPadding>
                  <ChevronRight />
                </MenuLinkIcon>
              </WrappContent>
            </MenuLink>
            {!isHideSignup && (
              <MenuLink
                onClick={() => {
                  handleOpenLoginSignUp('signup')
                }}
              >
                <WrappContent>
                  <div className='wrapper'>
                    <MenuLinkIcon>
                      <AiOutlineUserAdd />
                    </MenuLinkIcon>
                    <MenuLinkText>
                      <TextInfo>
                        {t('SIGNUP', 'Sign up')}
                      </TextInfo>
                    </MenuLinkText>
                  </div>
                  <MenuLinkIcon noPadding>
                    <ChevronRight />
                  </MenuLinkIcon>
                </WrappContent>
              </MenuLink>
            )}
          </>
        )}
      </Wrapper>
      {modalIsOpen && (!auth || userCustomer?.guest_id) && (
        <Modal
          open={modalIsOpen}
          onClose={() => closeModal()}
          width='50%'
          closeIconRight
          customStyle={{
            zIndex: 0
          }}
        >
          {modalPageToShow === 'login' && (
            <LoginForm
              notificationState={notificationState}
              handleSuccessLogin={handleSuccessLogin}
              elementLinkToSignup={
                <a
                  onClick={
                    (e) => handleCustomModalClick(e, { page: 'signup' })
                  } href='#'
                >{t('CREATE_ACCOUNT', theme?.defaultLanguages?.CREATE_ACCOUNT || 'Create account')}
                </a>
              }
              elementLinkToForgotPassword={
                <a
                  onClick={
                    (e) => handleCustomModalClick(e, { page: 'forgotpassword' })
                  } href='#'
                >{t('RESET_PASSWORD', theme?.defaultLanguages?.RESET_PASSWORD || 'Reset password')}
                </a>
              }
              useLoginByCellphone
              isPopup
              isGuest
            />
          )}
          {modalPageToShow === 'signup' && (
            <SignUpForm
              notificationState={notificationState}
              elementLinkToLogin={
                <a
                  onClick={
                    (e) => handleCustomModalClick(e, { page: 'login' })
                  } href='#'
                >{t('LOGIN', theme?.defaultLanguages?.LOGIN || 'Login')}
                </a>
              }
              useLoginByCellphone
              useChekoutFileds
              handleSuccessSignup={handleSuccessSignup}
              isPopup
              closeModal={() => closeModal()}
              isGuest
            />
          )}
          {modalPageToShow === 'forgotpassword' && (
            <ForgotPasswordForm
              elementLinkToLogin={
                <a
                  onClick={
                    (e) => handleCustomModalClick(e, { page: 'login' })
                  } href='#'
                >{t('LOGIN', theme?.defaultLanguages?.LOGIN || 'Login')}
                </a>
              }
              isPopup
            />
          )}
        </Modal>
      )}
    </Container>
  )
}
