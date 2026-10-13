import React, { useEffect } from 'react'
import { LanguageSelector as LanguageSelectorController, useLanguage } from '~components'
import { Select } from '~ui'

const LanguageSelectorUI = (props) => {
  const {
    languagesState,
    currentLanguage,
    handleChangeLanguage,
    notReload,
    defaultLanguages,
    defaultCurrentLanguage,
    showTitle,
    setShowLanguageSelector
  } = props
  const [, t] = useLanguage()
  const _languages = languagesState?.languages?.map(language => {
    return {
      value: language?.code, content: language?.name, showOnSelected: language.code?.toUpperCase()
    }
  })
  _languages && _languages.sort((a, b) =>
    (a.content > b.content) ? 1 : ((b.content > a.content) ? -1 : 0)
  )

  useEffect(() => {
    if (_languages && _languages.length > 1) {
      setShowLanguageSelector && setShowLanguageSelector(true)
    }
  }, [_languages])

  return (
    _languages && _languages.length > 1 && (
        <>
          {showTitle && (<p>{t('LANGUAGE', 'Language')}</p>)}
          <Select
            zIndex={10002}
            options={languagesState?.loading ? defaultLanguages : _languages}
            defaultValue={languagesState?.loading ? defaultCurrentLanguage : currentLanguage}
            onChange={(languageId) => handleChangeLanguage(languageId)}
            notReload={notReload}
          />
        </>
    )
  )
}

export const LanguageSelector = (props) => {
  const DefaultChangeLanguage = () => {}
  const langProps = {
    ...props,
    UIComponent: LanguageSelectorUI,
    onChangeLanguage: props.onChangeLanguage || DefaultChangeLanguage,
    defaultLanguages: [{
      content: 'English',
      showOnSelected: 'EN',
      value: 'en'
    }],
    defaultCurrentLanguage: 'en'
  }
  return (
    <LanguageSelectorController {...langProps} />
  )
}
