import { motion } from 'framer-motion'
import INS from '../assets/img/instagram.png'
import TEL from '../assets/img/telegram.png'
export const Contact = () => {
  return (
    <div className='mt-[70px] sm:mt-[120px] min-h-screen bg-white px-4 py-12 sm:px-6 lg:px-8'>
      <motion.div
        className='max-w-4xl mx-auto'
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <h1 className='text-3xl sm:text-5xl font-extrabold text-center mb-6 text-purple-700'>
          Biz bilan bog‘laning
        </h1>
        <p className='text-center text-gray-600 mb-10'>
          Har qanday savollar, fikrlar yoki hamkorlik uchun biz bilan
          bog‘laning!
        </p>

        <div className='flex justify-center gap-6 mb-12 items-center'>
          <h1
            className='font-bold text-gray-900 text-xl w-full
          '
          >
            Admin:
            <p className='text-[10px] text-gray-400'>
              bag, error yoki kamchiliklar buyicha
            </p>
          </h1>
          <a href='https://t.me/aaxpress_nam' className='hover:text-purple-600'>
            <img src={TEL} alt='i' width={'43px'} />
          </a>
          <a
            href='https://www.instagram.com/aaxpress_nam?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw=='
            className='hover:text-purple-600'
          >
            <img src={INS} alt='i' width={'40px'} />
          </a>
        </div>

        {/* Contact form */}
        <motion.form
          className='bg-gray-100 rounded-xl p-6 shadow-lg'
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <div className='grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4'>
            <input
              type='text'
              placeholder='Ismingiz'
              className='px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-500 outline-none'
              required
            />
            <input
              type='email'
              placeholder='Email manzilingiz'
              className='px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-500 outline-none'
              required
            />
          </div>
          <textarea
            placeholder='Xabaringiz'
            className='w-full px-4 py-3 h-32 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-500 outline-none mb-4'
            required
          ></textarea>
          <button
            type='submit'
            className='bg-purple-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-purple-700 transition w-full sm:w-auto'
          >
            Yuborish
          </button>
        </motion.form>
      </motion.div>
    </div>
  )
}
