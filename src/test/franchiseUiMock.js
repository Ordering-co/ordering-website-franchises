const React = require('react')

const franchiseUiMock = {
  Alert: ({ open, title, content }) => (
    open
      ? React.createElement('div', { 'data-testid': 'alert' }, title, Array.isArray(content) ? content.join(' ') : content)
      : null
  ),
  Confirm: ({ open, content, onAccept, handleOnAccept }) => (
    open
      ? React.createElement(
        'div',
        { 'data-testid': 'confirm' },
        content,
        React.createElement('button', { type: 'button', onClick: onAccept || handleOnAccept }, 'Accept')
      )
      : null
  ),
  Button: ({ children, onClick, onMouseDown, type = 'button', id, disabled }) => (
    React.createElement('button', { type, onClick, onMouseDown, id, disabled, 'data-testid': id }, children)
  ),
  Input: React.forwardRef((props, ref) => React.createElement('input', { ...props, ref })),
  Checkbox: (props) => React.createElement('input', { type: 'checkbox', ...props }),
  Modal: ({ open, children, title, onClose, onRemove }) => (
    open
      ? React.createElement(
        'div',
        { 'data-testid': 'modal' },
        title ? React.createElement('h2', null, title) : null,
        React.createElement('button', { type: 'button', onClick: onClose || onRemove }, 'close'),
        children
      )
      : null
  ),
  SpinnerLoader: ({ content }) => React.createElement('div', { 'data-testid': 'spinner' }, content),
  Tabs: ({ children }) => React.createElement('div', { 'data-testid': 'tabs' }, children),
  Tab: ({ children, onClick }) => React.createElement('button', { type: 'button', onClick }, children),
  Select: ({ options, defaultValue, onChange }) => (
    React.createElement(
      'select',
      {
        'data-testid': 'language-select',
        defaultValue,
        onChange: (e) => onChange && onChange(e.target.value)
      },
      (options || []).map((opt) => (
        React.createElement('option', { key: opt.value, value: opt.value }, opt.content)
      ))
    )
  ),
  useIsMounted: () => true,
  LogoutButton: () => React.createElement('button', { type: 'button', 'data-testid': 'logout-button' }, 'Logout'),
  transformCountryCode: () => 'US',
  findExitingCode: (code) => (code ? String(code).replace('+', '') : 'US'),
  InputPhoneNumber: () => React.createElement('input', { 'data-testid': 'phone-input' }),
  LoginForm: () => React.createElement('div', { 'data-testid': 'login-form' }),
  SignUpForm: () => React.createElement('div', { 'data-testid': 'signup-form' }),
  ForgotPasswordForm: () => React.createElement('div', { 'data-testid': 'forgot-form' }),
  UserDetails: () => React.createElement('div', { 'data-testid': 'user-details' }),
  UserFormDetailsUI: () => React.createElement('div', { 'data-testid': 'user-form-details' }),
  FacebookLoginButton: () => React.createElement('button', { type: 'button' }, 'fb'),
  GoogleLoginButton: () => React.createElement('button', { type: 'button' }, 'google'),
  AppleLogin: () => React.createElement('button', { type: 'button' }, 'apple'),
  SmsLoginButton: () => React.createElement('button', { type: 'button' }, 'sms'),
  useCountdownTimer: () => [600, () => {}, () => {}],
  useRecaptcha: () => [{}],
  useTheme: () => [{}, { merge: () => {} }],
  useWindowSize: () => ({ width: 1024, height: 768 }),
  useOnlineStatus: () => true,
  checkSiteUrl: (template) => template,
  capitalize: (value) => (value ? String(value).charAt(0).toUpperCase() + String(value).slice(1) : ''),
  getTraduction: (value) => value,
  formatSeconds: (value) => String(value ?? ''),
  sortInputFields: ({ values } = {}) => (
    Array.isArray(values) ? values : Object.values(values || {})
  )
}

module.exports = Object.assign({ franchiseUiMock }, franchiseUiMock)
