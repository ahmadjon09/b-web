import { Building2Icon, Contact, PhoneCall } from 'lucide-react'
import INS from '../assets/img/instagram.png'
import TEL from '../assets/img/telegram.png'
import logo from '../assets/logo.png'
import { Link } from 'react-router-dom'
export const Footer = () => {
  return (
    <footer className='w-full relative bg-gray-100 text-gray-800 py-10 px-4 sm:px-8'>
      <div className='max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8'>
        {/* Logo and description */}
        <div>
          <h2 className='text-2xl font-bold mb-3 text-purple-600 flex gap-1'>
            <img src={logo} alt='logo' className='w-20' />
          </h2>
          <p className='text-sm text-gray-600'>
            <b> Online Do‘konimizga Xush Kelibsiz!!</b> Sifatli mahsulotlar va
            arzon narxlar bilan tez va ishonchli yetkazib beramiz. Kiyim-kechak,
            gadjetlar, uy-ro‘zg‘or buyumlarini qulay sharoitda xarid qiling.
            Bugun buyurtma bering, zavqli xaridni boshdan kechiring!
          </p>
        </div>

        <div>
          <h3 className='text-lg font-semibold mb-2 text-purple-700'>
            Havolalar
          </h3>
          <ul className='space-y-1 text-gray-700 text-sm'>
            <li>
              <Link to={'/'} className='hover:text-purple-600'>
                Bosh sahifa
              </Link>
            </li>
            <li>
              <Link to={'/news'} className='hover:text-purple-600'>
                Yangiliklar
              </Link>
            </li>
            <li>
              <Link to={'contact'} className='hover:text-purple-600'>
                Aloqa
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h3 className='text-lg font-semibold mb-2 text-purple-700'>
            Ijtimoiy tarmoqlar
          </h3>
          <div className='flex  gap-2 text-gray-700 text-sm'>
            <a
              href='https://t.me/Xiitoy_tavarlar_n1'
              className='hover:text-purple-600'
            >
              <img src={TEL} alt='i' width={'43px'} />
            </a>
            <a
              href='https://www.instagram.com/aaxpress_nam?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw=='
              className='hover:text-purple-600'
            >
              <img src={INS} alt='i' width={'40px'} />
            </a>
          </div>
        </div>

        {/* Contact Info */}
        <div>
          <h3 className='text-lg font-semibold mb-2 text-purple-700'>Aloqa</h3>
          <div className='text-sm text-gray-600 flex items-start gap-1 flex-col'>
            <a
              href='tel:+998950253131'
              className='flex gap-1 items-center hover:underline'
            >
              <PhoneCall size={15} /> +998 95 025 31 31
            </a>
            <a className='flex gap-1 items-center hover:underline' href=''>
              <Contact size={15} /> info@example.com
            </a>
            <a
              className='flex gap-1 items-center hover:underline'
              href='https://www.google.com/maps/place//@40.9951255,71.6003018,16z/data=!4m6!1m5!3m4!2zNDDCsDU5JzQyLjYiTiA3McKwMzYnMDEuOCJF!8m2!3d40.995168!4d71.600503?entry=ttu&g_ep=EgoyMDI1MDUxNS4wIKXMDSoASAFQAw%3D%3D'
            >
              <Building2Icon size={15} /> Namangan, O‘zbekiston
            </a>
          </div>
        </div>
      </div>

      {/* Bottom Line */}
      <div className='mt-10 mb-14 sm:mb-0 border-t border-gray-300 pt-4 text-center text-gray-500 text-sm'>
        &copy; {new Date().getFullYear()} Biloliy. Barcha huquqlar
        himoyalangan.
      </div>
    </footer>
  )
}
