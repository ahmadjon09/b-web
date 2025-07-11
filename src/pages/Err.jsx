import err_img from '../assets/404.png'
import { Link } from 'react-router-dom'
import { useTranslation } from '../context/LanguageContext'
import { Home } from 'lucide-react'

export default function Err () {
  const { t } = useTranslation()

  return (
    <div className='container flex flex-col items-center justify-center w-full h-screen'>
      <br />
      <img className='w-[300px] rounded object-cover' src={err_img} alt='404' />
      <br />
      <Link
        className='px-5 py-3 text-white font-bold rounded-full bg-purple-700 flex gap-1'
        to={'/'}
      >
        <Home /> {t('home')}
      </Link>
    </div>
  )
}
