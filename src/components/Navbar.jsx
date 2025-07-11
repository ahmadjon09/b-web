import { useState, useEffect } from 'react'
import { LogOut, Menu, ShoppingCart, User, X } from 'lucide-react'
import { useSelector } from 'react-redux'
import Cookies from 'js-cookie'
import { Link, NavLink } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useTranslation } from '../context/LanguageContext'
import { AuthModals } from '../components/AuthModals'
// import { LanguageSwitcher } from '../components/LanguageSwitcher'
import default_ph from '../assets/avatardefault.png'
import logo from '../assets/logo.png'
import '../assets/css/Navbar.css'
import { Profile } from '../mod/Profile'

export const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false)
  const [nav, setNav] = useState(false)
  const [authModalOpen, setAuthModalOpen] = useState(false)
  const [profileModalOpen, setProfileModalOpen] = useState(false)
  const { data, isAuth } = useSelector(state => state.user)
  const { t } = useTranslation()

  function Logout () {
    if (window.confirm('Haqiqatan ham tizimdan chiqmoqchimisiz?')) {
      Cookies.remove('client_token')
      window.location.href = '/'
    }
  }

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50)
    window.addEventListener('scroll', handleScroll)

    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    if (nav) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'auto'
    }
    return () => {
      document.body.style.overflow = 'auto'
    }
  }, [nav])

  const getNavLinkClass = ({ isActive }) =>
    `transition-all duration-300 relative ${
      isActive ? 'text-purple-700' : ''
    } ${
      isScrolled ? 'hover:text-purple-700' : 'hover:text-purple-700'
    } after:absolute after:w-0 after:h-0.5 after:bg-purple-700 after:left-0 after:-bottom-1 
    after:transition-all after:duration-300 hover:after:w-full`

  return (
    <>
      <nav
        className={`fixed left-0 w-full z-50 transition-all duration-500 mdx ${
          isScrolled
            ? 'top-0  text-black shadow-md py-2 bg-gray-100'
            : 'top-[45px] backdrop-blur-sm text-black border-b border-gray-200/30 py-4'
        }`}
      >
        <div className='container mx-auto px-4'>
          <div className='flex items-center justify-between'>
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Link to={'/'}>
                <img
                  className='min-w-20 min-h-15 w-20 h-15'
                  src={logo || '/placeholder.svg'}
                  alt='logo'
                />
              </Link>
            </motion.div>

            <div className='flex items-center gap-8'>
              <ul className='flex items-center gap-8 font-semibold'>
                <motion.li
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.1 }}
                >
                  <NavLink className={getNavLinkClass} to={`/`}>
                    {t('home')}
                  </NavLink>
                </motion.li>
                {['about', 'news', 'contact'].map((item, index) => (
                  <motion.li
                    key={item}
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: 0.1 * (index + 1) }}
                  >
                    <NavLink className={getNavLinkClass} to={`/${item}`}>
                      {t(item)}
                    </NavLink>
                  </motion.li>
                ))}
              </ul>

              <div className='flex items-center gap-6'>
                {/* <LanguageSwitcher /> */}

                <Link to={'/cart'} className='relative group'>
                  <ShoppingCart className='transition-transform duration-300 group-hover:scale-110 group-hover:text-purple-700' />
                  <div className='absolute -top-2 -right-3 w-5 h-5 bg-purple-700 text-white flex items-center justify-center text-xs rounded-full transition-all duration-300 group-hover:scale-110'>
                    {data.cart?.length > 9 ? '+9' : data.cart?.length || 0}
                  </div>
                </Link>

                {!isAuth ? (
                  <button
                    onClick={() => setAuthModalOpen(true)}
                    className='bg-purple-700 py-2.5 px-6 text-white rounded-full font-semibold transition-all duration-300 hover:bg-blue-800 hover:shadow-lg'
                  >
                    {t('register')}
                  </button>
                ) : (
                  <div className='flex items-center gap-3'>
                    <button onClick={() => setProfileModalOpen(true)}>
                      <img
                        src={data?.avatar?.[0] || default_ph}
                        alt='profile'
                        className='w-10 h-10 rounded-full object-cover border-2 border-blue-5bg-purple-700'
                      />
                    </button>
                    <button
                      onClick={Logout}
                      className='flex items-center gap-1.5 bg-red-600 hover:bg-red-700 text-white px-4 py-2 text-sm rounded-full font-semibold transition-all duration-300'
                    >
                      <LogOut size={14} />
                      {t('logout')}
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </nav>

      <nav
        className={`fixed left-0 w-full z-50 transition-all duration-500  mdy ${
          isScrolled
            ? 'top-0 bg-white text-black shadow-md py-3'
            : 'top-0 bg-white/90 backdrop-blur-sm text-black shadow-md py-3'
        }`}
      >
        <div className='px-4 flex items-center justify-between'>
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Link to={'/'}>
              <img
                className='min-w-16 w-20'
                src={logo || '/placeholder.svg'}
                alt='logo'
              />
            </Link>
          </motion.div>

          <div className='flex items-center gap-4'>
            <Link to={'/cart'} className='relative'>
              <ShoppingCart className='transition-all duration-300 hover:text-purple-700' />
              <div className='absolute -top-2 -right-3 w-5 h-5 bg-purple-700 text-white flex items-center justify-center text-xs rounded-full'>
                {data.cart?.length > 9 ? '+9' : data.cart?.length || 0}
              </div>
            </Link>

            <button
              className='text-gray-700 focus:outline-none'
              onClick={() => setNav(prev => !prev)}
              aria-label='Toggle navigation'
            >
              {nav ? <X className='h-6 w-6' /> : <Menu className='h-6 w-6' />}
            </button>
          </div>
        </div>
      </nav>

      <div
        className={`fixed inset-0 bg-black/50 z-40 sm:hidden transition-opacity duration-300 ${
          nav ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={() => setNav(false)}
        style={{ backdropFilter: 'blur(2px)' }}
      />

      <div
        className={`fixed left-0 w-full h-[calc(100vh-70px)] bg-white z-40 links transition-transform duration-500 ease-in-out overflow-auto ${
          nav ? 'translate-y-[70px]' : 'translate-y-full'
        }`}
        style={{ height: 'calc(100dvh - 70px)' }}
      >
        <div className='container mx-auto px-6 py-8'>
          <ul className='flex flex-col gap-6 text-lg font-semibold'>
            <li>
              <NavLink
                className={({ isActive }) =>
                  `block py-2 ${isActive ? 'text-purple-700' : 'text-gray-800'}`
                }
                to={`/`}
                onClick={() => setNav(false)}
              >
                {t('home')}
              </NavLink>
            </li>
            {['about', 'news', 'contact'].map(item => (
              <li key={item}>
                <NavLink
                  className={({ isActive }) =>
                    `block py-2 ${
                      isActive ? 'text-purple-700' : 'text-gray-800'
                    }`
                  }
                  to={`/${item}`}
                  onClick={() => setNav(false)}
                >
                  {t(item)}
                </NavLink>
              </li>
            ))}
          </ul>

          <div className='mt-8 space-y-4'>
            <div className='flex justify-center'>
              {/* <LanguageSwitcher /> */}
            </div>

            {!isAuth ? (
              <button
                onClick={() => {
                  setAuthModalOpen(true)
                  setNav(false)
                }}
                className='block w-full bg-purple-700 py-3 text-center text-white rounded-full font-semibold'
              >
                {t('register')}
              </button>
            ) : (
              <div className='flex flex-col gap-4'>
                <div className='flex items-center gap-3'>
                  <img
                    src={data?.avatar?.[0] || default_ph}
                    alt='profile'
                    className='w-12 h-12 rounded-full object-cover border-2 border-blue-5bg-purple-700'
                  />
                  <div>
                    <p className='font-semibold'>{data?.firstName || 'User'}</p>
                    <p className='text-sm text-gray-500'>
                      +
                      {data?.phoneNumber?.toLocaleString() ||
                        '998 99 000 00 00'}
                    </p>
                  </div>
                </div>
                <button
                  onClick={Logout}
                  className='flex items-center justify-center gap-2 bg-red-600 text-white py-3 rounded-full font-semibold'
                >
                  <LogOut size={16} />
                  {t('logout')}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className='fixed bottom-0 left-0 w-full bg-white border-t border-gray-200 shadow-[0_-2px_10px_rgba(0,0,0,0.1)] z-50 mdy'>
        <div className='grid grid-cols-5 h-16'>
          <NavLink
            to='/'
            className={({ isActive }) =>
              `flex flex-col items-center justify-center ${
                isActive ? 'text-purple-700' : 'text-gray-600'
              }`
            }
          >
            <svg
              xmlns='http://www.w3.org/2000/svg'
              className='h-6 w-6'
              fill='none'
              viewBox='0 0 24 24'
              stroke='currentColor'
            >
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth={2}
                d='M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6'
              />
            </svg>
            <span className='text-[10px] mt-1 text-center'>{t('home')}</span>
          </NavLink>

          <NavLink
            to='/about'
            className={({ isActive }) =>
              `flex flex-col items-center justify-center ${
                isActive ? 'text-purple-700' : 'text-gray-600'
              }`
            }
          >
            <svg
              xmlns='http://www.w3.org/2000/svg'
              className='h-6 w-6'
              fill='none'
              viewBox='0 0 24 24'
              stroke='currentColor'
            >
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth={2}
                d='M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z'
              />
            </svg>
            <span className='text-[10px] text-center mt-1'>{t('about')}</span>
          </NavLink>

          <NavLink
            to='/news'
            className={({ isActive }) =>
              `flex flex-col items-center justify-center ${
                isActive ? 'text-purple-700' : 'text-gray-600'
              }`
            }
          >
            <svg
              xmlns='http://www.w3.org/2000/svg'
              className='h-6 w-6'
              fill='none'
              viewBox='0 0 24 24'
              stroke='currentColor'
            >
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth={2}
                d='M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z'
              />
            </svg>
            <span className='text-[10px] text-center mt-1'>{t('news')}</span>
          </NavLink>

          <NavLink
            to='/packages'
            className={({ isActive }) =>
              `flex flex-col items-center justify-center ${
                isActive ? 'text-purple-700' : 'text-gray-600'
              }`
            }
          >
            <svg
              xmlns='http://www.w3.org/2000/svg'
              className='h-6 w-6'
              fill='none'
              viewBox='0 0 24 24'
              stroke='currentColor'
            >
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth={2}
                d='M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10'
              />
            </svg>
            <span className='text-[10px] text-center mt-1'>
              {t('packages')}
            </span>
          </NavLink>

          <button
            onClick={() => {
              isAuth ? setProfileModalOpen(true) : setAuthModalOpen(true)
            }}
            className={`flex flex-col items-center justify-center text-gray-600`}
          >
            {isAuth ? (
              <img
                src={data.avatar}
                alt='user'
                className='w-[23px] h-[23px] rounded-full'
              />
            ) : (
              <User />
            )}
            <span className='text-[10px] text-center mt-1'>
              {isAuth ? t('profile') : t('login')}
            </span>
          </button>
        </div>
      </div>

      <AuthModals
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
      />
      {profileModalOpen && (
        <Profile
          user={data}
          isOpen={authModalOpen}
          onClose={() => setProfileModalOpen(false)}
        />
      )}
    </>
  )
}
