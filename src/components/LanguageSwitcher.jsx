import { useTranslation, LANGUAGES } from '../context/LanguageContext'
import { Globe } from 'lucide-react'
import us from '../assets/img/eng.png'
import ru from '../assets/img/rus.png'
import uz from '../assets/img/uzb.png'

export const LanguageSwitcher = () => {
  const { language, changeLanguage, t } = useTranslation()

  return (
    <div className='relative group'>
      <button className='flex items-center gap-1.5 py-2 px-3 rounded-full hover:bg-gray-100 transition-colors'>
        <Globe size={18} />
        <span className='font-medium'>{language.toUpperCase()}</span>
      </button>

      <div className='absolute right-0 top-0 mt-2 w-40 bg-white rounded-lg shadow-lg overflow-hidden opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-50'>
        <div className='py-1 '>
          <button
            onClick={() => changeLanguage(LANGUAGES.EN)}
            className={`flex items-center w-full px-4 py-2 text-sm ${
              language === LANGUAGES.EN
                ? 'bg-gray-100 text-[#86b817]'
                : 'text-gray-700 hover:bg-gray-50'
            }`}
          >
            <img className='w-5' src={us} alt='us' />
            <span className='w-6 inline-block'>🇺🇸</span>
          </button>

          <button
            onClick={() => changeLanguage(LANGUAGES.RU)}
            className={`flex items-center w-full px-4 py-2 text-sm ${
              language === LANGUAGES.RU
                ? 'bg-gray-100 text-[#86b817]'
                : 'text-gray-700 hover:bg-gray-50'
            }`}
          >
            <img className='w-5' src={ru} alt='ru' />
            <span className='w-6 inline-block'>🇷🇺</span>
          </button>

          <button
            onClick={() => changeLanguage(LANGUAGES.UZ)}
            className={`flex items-center w-full px-4 py-2 text-sm ${
              language === LANGUAGES.UZ
                ? 'bg-gray-100 text-[#86b817]'
                : 'text-gray-700 hover:bg-gray-50'
            }`}
          >
            <img className='w-5' src={uz} alt='uz' />
            <span className='w-6 inline-block'>🇺🇿</span>
          </button>
        </div>
      </div>
    </div>
  )
}
