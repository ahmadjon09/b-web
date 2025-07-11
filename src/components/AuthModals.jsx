import { useState, useEffect } from 'react'
import { X, Phone, User, Lock, Eye, EyeOff, Upload } from 'lucide-react'
import { useTranslation } from '../context/LanguageContext'
import Axios from '../Axios'
import Cookies from 'js-cookie'
import { getUserError, getUserSuccess } from '../toolkit/UserSlicer'

export const AuthModals = ({ isOpen, onClose, initialTab = 'login' }) => {
  const [activeTab, setActiveTab] = useState(initialTab)
  const { t } = useTranslation()

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'auto'
    }
    return () => {
      document.body.style.overflow = 'auto'
    }
  }, [isOpen])

  if (!isOpen) return null

  return (
    <div className='fixed inset-0 z-50 flex items-center justify-center'>
      <div
        className='absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity duration-300'
        onClick={onClose}
      />

      <div className='relative bg-white rounded-2xl shadow-xl w-full max-w-md mx-4 overflow-hidden transition-all duration-300 transform animate-[fadeIn_0.3s_ease-out]'>
        <button
          onClick={onClose}
          className='absolute right-4 top-4 text-gray-500 hover:text-gray-700 transition-colors'
          aria-label='Close'
        >
          <X size={20} />
        </button>

        <div className='flex border-b'>
          <button
            className={`flex-1 py-4 font-semibold text-center transition-colors ${
              activeTab === 'login'
                ? 'text-purple-700 border-b-2 border-purple-700'
                : 'text-gray-500 hover:text-gray-700'
            }`}
            onClick={() => setActiveTab('login')}
          >
            {t('login')}
          </button>
          <button
            className={`flex-1 py-4 font-semibold text-center transition-colors ${
              activeTab === 'register'
                ? 'text-purple-700 border-b-2 border-purple-700'
                : 'text-gray-500 hover:text-gray-700'
            }`}
            onClick={() => setActiveTab('register')}
          >
            {t('register')}
          </button>
        </div>

        <div className='p-6'>
          {activeTab === 'login' ? (
            <LoginForm setActiveTab={setActiveTab} />
          ) : (
            <RegisterForm setActiveTab={setActiveTab} />
          )}
        </div>
      </div>
    </div>
  )
}

const LoginForm = ({ setActiveTab }) => {
  const { t } = useTranslation()
  const [phoneNumber, setPhoneNumber] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)

  const validateForm = () => {
    const newErrors = {}

    if (!phoneNumber.trim()) {
      newErrors.phoneNumber = t('phoneNumberRequired')
    } else {
      const numericPhone = phoneNumber.replace(/\D/g, '')
      if (numericPhone.length < 10) {
        newErrors.phoneNumber = t('invalidPhoneNumber')
      }
    }

    if (!password) {
      newErrors.password = t('passwordRequired')
    } else if (password.length < 6) {
      newErrors.password = t('passwordTooShort')
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async e => {
    e.preventDefault()
    if (!validateForm()) return

    setLoading(true)
    setErrors({})

    try {
      const numericPhone = phoneNumber.replace(/\D/g, '')
      const { data } = await Axios.post('client/login', {
        password,
        phoneNumber: numericPhone
      })

      Cookies.set('client_rg', true)
      Cookies.set('client_token', data.token, { secure: true, expires: 30 })
      window.location.href = '/'
    } catch (error) {
      const errorMessage = error.response?.data?.message || t('loginFailed')
      setErrors({
        api: errorMessage,
        ...(error.response?.data?.errors || {})
      })
    } finally {
      setLoading(false)
    }
  }

  const handlePhoneChange = e => {
    const value = e.target.value
    const cleaned = value.replace(/[^\d+]/g, '')
    setPhoneNumber(cleaned)
    if (errors.phoneNumber) {
      setErrors(prev => ({ ...prev, phoneNumber: '' }))
    }
  }

  const handlePasswordChange = e => {
    setPassword(e.target.value)
    if (errors.password) {
      setErrors(prev => ({ ...prev, password: '' }))
    }
  }

  return (
    <form onSubmit={handleSubmit} className='space-y-4'>
      <h2 className='text-2xl font-bold text-center mb-6'>{t('loginTitle')}</h2>

      {errors.api && (
        <div className='p-3 bg-red-50 text-red-600 rounded-lg text-sm'>
          {errors.api}
        </div>
      )}

      <div className='space-y-2'>
        <label
          htmlFor='phoneNumber'
          className='block text-sm font-medium text-gray-700'
        >
          {t('phoneNumber')}
        </label>
        <div className='relative'>
          <div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none'>
            <Phone size={18} className='text-gray-400' />
          </div>
          <input
            id='phoneNumber'
            type='tel'
            inputMode='numeric'
            value={phoneNumber}
            onChange={handlePhoneChange}
            className={`w-full pl-10 pr-4 py-2.5 border ${
              errors.phoneNumber ? 'border-red-500' : 'border-gray-300'
            } rounded-lg focus:ring-2 focus:ring-purple-700 focus:border-transparent transition-all`}
            placeholder='+1234567890'
          />
        </div>
        {errors.phoneNumber && (
          <p className='text-red-500 text-xs mt-1'>{errors.phoneNumber}</p>
        )}
      </div>

      <div className='space-y-2'>
        <div className='flex justify-between items-center'>
          <label
            htmlFor='password'
            className='block text-sm font-medium text-gray-700'
          >
            {t('password')}
          </label>
          <a
            href='https://t.me/aaxpressSupbot'
            className='text-xs text-purple-700 hover:underline'
          >
            {t('forgotPassword')}
          </a>
        </div>
        <div className='relative'>
          <div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none'>
            <Lock size={18} className='text-gray-400' />
          </div>
          <input
            id='password'
            type={showPassword ? 'text' : 'password'}
            value={password}
            onChange={handlePasswordChange}
            className={`w-full pl-10 pr-10 py-2.5 border ${
              errors.password ? 'border-red-500' : 'border-gray-300'
            } rounded-lg focus:ring-2 focus:ring-purple-700 focus:border-transparent transition-all`}
            placeholder='••••••••'
          />
          <button
            type='button'
            className='absolute inset-y-0 right-0 pr-3 flex items-center'
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? (
              <EyeOff size={18} className='text-gray-400 hover:text-gray-600' />
            ) : (
              <Eye size={18} className='text-gray-400 hover:text-gray-600' />
            )}
          </button>
        </div>
        {errors.password && (
          <p className='text-red-500 text-xs mt-1'>{errors.password}</p>
        )}
      </div>

      <button
        type='submit'
        className='w-full bg-purple-700 text-white py-3 rounded-lg font-semibold hover:bg-[#543da0] transition-colors focus:outline-none focus:ring-2 focus:ring-purple-700 focus:ring-offset-2 disabled:opacity-70'
        disabled={loading}
      >
        {loading ? t('loading') : t('login')}
      </button>

      <p className='text-center text-sm text-gray-600'>
        {t('noAccount')}{' '}
        <button
          type='button'
          className='text-purple-700 hover:underline font-medium'
          onClick={() => setActiveTab('register')}
        >
          {t('register')}
        </button>
      </p>
    </form>
  )
}

const RegisterForm = ({ setActiveTab }) => {
  const { t } = useTranslation()
  const [step, setStep] = useState(1)
  const [formData, setFormData] = useState({
    phoneNumber: '',
    firstName: '',
    lastName: '',
    password: '',
    confirmPassword: '',
    avatar: null
  })
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [errors, setErrors] = useState({})
  const [avatarPreview, setAvatarPreview] = useState(null)
  const [loading, setLoading] = useState(false)
  const [apiError, setApiError] = useState('')

  const handleChange = e => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }))
    }
  }

  const handlePhoneChange = e => {
    const value = e.target.value
    const cleaned = value.replace(/[^\d+]/g, '')
    setFormData(prev => ({
      ...prev,
      phoneNumber: cleaned
    }))
    if (errors.phoneNumber) {
      setErrors(prev => ({ ...prev, phoneNumber: '' }))
    }
  }

  const handleAvatarChange = async e => {
    if (!e.target.files || e.target.files.length === 0) return

    const file = e.target.files[0]

    if (!file.type.startsWith('image/')) {
      setApiError('Faqat rasm fayllari yuklanadi')
      return
    }

    const localPreview = URL.createObjectURL(file)
    setAvatarPreview(localPreview)

    try {
      const formImageData = new FormData()
      formImageData.append('image', file)

      setLoading(true)
      setApiError('')

      const res = await fetch(
        `https://api.imgbb.com/1/upload?key=955f1e37f0aa643262e734c080305b10`,
        {
          method: 'POST',
          body: formImageData
        }
      )

      const result = await res.json()
      if (result.success) {
        setAvatarPreview(result.data.url)
        setFormData(prevData => ({
          ...prevData,
          avatar: result.data.url
        }))
      } else {
        throw new Error(
          result.error?.message || 'Yuklash muvaffaqiyatsiz bo‘ldi'
        )
      }
    } catch (error) {
      setAvatarPreview(null)
      setApiError(error.message || t('imageUploadError'))
    } finally {
      setLoading(false)
    }
  }

  const validateStep1 = () => {
    const newErrors = {}

    if (!formData.phoneNumber.trim()) {
      newErrors.phoneNumber = t('phoneNumberRequired')
    } else {
      const numericPhone = formData.phoneNumber.replace(/\D/g, '')
      if (numericPhone.length < 10) {
        newErrors.phoneNumber = t('invalidPhoneNumber')
      }
    }

    if (!formData.firstName.trim()) {
      newErrors.firstName = t('firstNameRequired')
    }

    if (!formData.lastName.trim()) {
      newErrors.lastName = t('lastNameRequired')
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const validateStep2 = () => {
    const newErrors = {}

    if (!formData.password) {
      newErrors.password = t('passwordRequired')
    } else if (formData.password.length < 8) {
      newErrors.password = t('passwordTooShort')
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = t('confirmPasswordRequired')
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = t('passwordsDoNotMatch')
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleNextStep = () => {
    if (validateStep1()) {
      setStep(2)
      setErrors({})
    }
  }

  const handlePrevStep = () => {
    setStep(1)
    setErrors({})
  }

  const handleSubmit = async e => {
    e.preventDefault()

    if (step === 1) {
      handleNextStep()
      return
    }

    if (!validateStep2()) return

    setLoading(true)
    setApiError('')

    try {
      const numericPhone = formData.phoneNumber.replace(/\D/g, '')
      const { data } = await Axios.post('client/register', {
        ...formData,
        phoneNumber: numericPhone
      })

      Cookies.set('client_rg', true)
      Cookies.set('client_token', data.token, { secure: true, expires: 30 })
      getUserSuccess(data.data)
      window.location.href = '/'
    } catch (error) {
      const errorMessage = error.response?.data?.message || t('registerFailed')
      setApiError(errorMessage)

      getUserError(error.response.data?.massage)

      if (error.response?.data?.errors) {
        setErrors(prev => ({
          ...prev,
          ...error.response.data.errors
        }))
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className='space-y-4'>
      <h2 className='text-2xl font-bold text-center mb-6'>
        {t('registerTitle')}
      </h2>

      {apiError && (
        <div className='p-3 bg-red-50 text-red-600 rounded-lg text-sm'>
          {apiError}
        </div>
      )}

      <div className='relative mb-6'>
        <div className='overflow-hidden h-2 text-xs flex rounded bg-gray-200'>
          <div
            className='shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-purple-700 transition-all duration-300'
            style={{ width: step === 1 ? '50%' : '100%' }}
          ></div>
        </div>
        <div className='flex justify-between mt-2'>
          <span
            className={`text-xs font-medium ${
              step === 1 ? 'text-purple-700' : 'text-gray-500'
            }`}
          >
            {t('personalInfo')}
          </span>
          <span
            className={`text-xs font-medium ${
              step === 2 ? 'text-purple-700' : 'text-gray-500'
            }`}
          >
            {t('securityInfo')}
          </span>
        </div>
      </div>

      {step === 1 ? (
        <div className='space-y-4'>
          <div className='space-y-2'>
            <label
              htmlFor='phoneNumber'
              className='block text-sm font-medium text-gray-700'
            >
              {t('phoneNumber')}
            </label>
            <div className='relative'>
              <div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none'>
                <Phone size={18} className='text-gray-400' />
              </div>
              <input
                id='phoneNumber'
                name='phoneNumber'
                type='tel'
                inputMode='numeric'
                value={formData.phoneNumber}
                onChange={handlePhoneChange}
                className={`w-full pl-10 pr-4 py-2.5 border ${
                  errors.phoneNumber ? 'border-red-500' : 'border-gray-300'
                } rounded-lg focus:ring-2 focus:ring-purple-700 focus:border-transparent transition-all`}
                placeholder='+1234567890'
              />
            </div>
            {errors.phoneNumber && (
              <p className='text-red-500 text-xs mt-1'>{errors.phoneNumber}</p>
            )}
          </div>

          <div className='space-y-2'>
            <label
              htmlFor='firstName'
              className='block text-sm font-medium text-gray-700'
            >
              {t('firstName')}
            </label>
            <div className='relative'>
              <div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none'>
                <User size={18} className='text-gray-400' />
              </div>
              <input
                id='firstName'
                name='firstName'
                type='text'
                value={formData.firstName}
                onChange={handleChange}
                className={`w-full pl-10 pr-4 py-2.5 border ${
                  errors.firstName ? 'border-red-500' : 'border-gray-300'
                } rounded-lg focus:ring-2 focus:ring-purple-700 focus:border-transparent transition-all`}
                placeholder={t('firstNamePlaceholder')}
              />
            </div>
            {errors.firstName && (
              <p className='text-red-500 text-xs mt-1'>{errors.firstName}</p>
            )}
          </div>

          <div className='space-y-2'>
            <label
              htmlFor='lastName'
              className='block text-sm font-medium text-gray-700'
            >
              {t('lastName')}
            </label>
            <div className='relative'>
              <div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none'>
                <User size={18} className='text-gray-400' />
              </div>
              <input
                id='lastName'
                name='lastName'
                type='text'
                value={formData.lastName}
                onChange={handleChange}
                className={`w-full pl-10 pr-4 py-2.5 border ${
                  errors.lastName ? 'border-red-500' : 'border-gray-300'
                } rounded-lg focus:ring-2 focus:ring-purple-700 focus:border-transparent transition-all`}
                placeholder={t('lastNamePlaceholder')}
              />
            </div>
            {errors.lastName && (
              <p className='text-red-500 text-xs mt-1'>{errors.lastName}</p>
            )}
          </div>
        </div>
      ) : (
        <div className='space-y-4'>
          <div className='space-y-2'>
            <label
              htmlFor='password'
              className='block text-sm font-medium text-gray-700'
            >
              {t('password')}
            </label>
            <div className='relative'>
              <div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none'>
                <Lock size={18} className='text-gray-400' />
              </div>
              <input
                id='password'
                name='password'
                type={showPassword ? 'text' : 'password'}
                value={formData.password}
                onChange={handleChange}
                className={`w-full pl-10 pr-10 py-2.5 border ${
                  errors.password ? 'border-red-500' : 'border-gray-300'
                } rounded-lg focus:ring-2 focus:ring-purple-700 focus:border-transparent transition-all`}
                placeholder='••••••••'
              />
              <button
                type='button'
                className='absolute inset-y-0 right-0 pr-3 flex items-center'
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  <EyeOff
                    size={18}
                    className='text-gray-400 hover:text-gray-600'
                  />
                ) : (
                  <Eye
                    size={18}
                    className='text-gray-400 hover:text-gray-600'
                  />
                )}
              </button>
            </div>
            {errors.password && (
              <p className='text-red-500 text-xs mt-1'>{errors.password}</p>
            )}
          </div>

          <div className='space-y-2'>
            <label
              htmlFor='confirmPassword'
              className='block text-sm font-medium text-gray-700'
            >
              {t('confirmPassword')}
            </label>
            <div className='relative'>
              <div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none'>
                <Lock size={18} className='text-gray-400' />
              </div>
              <input
                id='confirmPassword'
                name='confirmPassword'
                type={showConfirmPassword ? 'text' : 'password'}
                value={formData.confirmPassword}
                onChange={handleChange}
                className={`w-full pl-10 pr-10 py-2.5 border ${
                  errors.confirmPassword ? 'border-red-500' : 'border-gray-300'
                } rounded-lg focus:ring-2 focus:ring-purple-700 focus:border-transparent transition-all`}
                placeholder='••••••••'
              />
              <button
                type='button'
                className='absolute inset-y-0 right-0 pr-3 flex items-center'
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                {showConfirmPassword ? (
                  <EyeOff
                    size={18}
                    className='text-gray-400 hover:text-gray-600'
                  />
                ) : (
                  <Eye
                    size={18}
                    className='text-gray-400 hover:text-gray-600'
                  />
                )}
              </button>
            </div>
            {errors.confirmPassword && (
              <p className='text-red-500 text-xs mt-1'>
                {errors.confirmPassword}
              </p>
            )}
          </div>

          <div className='space-y-2'>
            <label
              htmlFor='avatar'
              className='block text-sm font-medium text-gray-700'
            >
              {t('avatar')} ({t('optional')})
            </label>
            <div className='flex items-center space-x-4'>
              {avatarPreview && (
                <div className='min-w-14 min-h-14 max-h-14 max-w-14 rounded-full overflow-hidden border-2 border-purple-700 relative'>
                  <img
                    src={avatarPreview}
                    alt='Avatar preview'
                    className='w-full h-full object-cover'
                  />
                  {loading && (
                    <div className='absolute inset-0 bg-black/30 flex items-center justify-center'>
                      <div className='w-8 h-8 border-2 border-white border-t-transparent rounded-full animate-spin'></div>
                    </div>
                  )}
                </div>
              )}
              <label
                className={`flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium ${
                  loading
                    ? 'bg-gray-100 text-gray-500 cursor-not-allowed'
                    : 'text-gray-700 bg-white hover:bg-gray-50 cursor-pointer'
                }`}
              >
                <Upload size={18} className='mr-2' />
                {loading
                  ? t('uploading')
                  : avatarPreview
                  ? t('changeAvatar')
                  : t('uploadAvatar')}
                <input
                  id='avatar'
                  name='avatar'
                  type='file'
                  accept='image/*'
                  onChange={handleAvatarChange}
                  className='sr-only'
                  disabled={loading}
                />
              </label>
            </div>
          </div>
        </div>
      )}

      <div className='flex justify-between pt-4'>
        {step === 2 ? (
          <button
            type='button'
            onClick={handlePrevStep}
            className='px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50'
          >
            {t('back')}
          </button>
        ) : (
          <div></div>
        )}

        <button
          type='submit'
          className='px-6 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-purple-700 hover:bg-[#282a67] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-700 disabled:opacity-70'
          disabled={loading}
        >
          {loading ? t('loading') : step === 1 ? t('next') : t('register')}
        </button>
      </div>
    </form>
  )
}
