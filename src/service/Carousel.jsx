import { Swiper, SwiperSlide } from 'swiper/react'
import { Autoplay, Pagination, Navigation } from 'swiper/modules'
import 'swiper/css'
import 'swiper/css/pagination'
import 'swiper/css/navigation'
import useSWR from 'swr'
import Axios from '../Axios'
import { DatabaseBackup, Loader2 } from 'lucide-react'

export default function Carousel () {
  const { data, error, isLoading } = useSWR('/news', Axios)
  const data_ = data?.data?.data

  if (error)
    return (
      <div className='text-center text-red-500 w-full h-[50vh] flex items-center justify-center'>
        Xatolik yuz berdi
      </div>
    )
  if (isLoading)
    return (
      <div className='w-full h-[30vh] flex items-center justify-center text-gray-400 gap-1'>
        <Loader2 className='animate-spin' /> Yuklanmoqda...
      </div>
    )
  if (!data_ || data_.length === 0)
    return (
      <div className='w-full h-[30vh] flex items-center justify-center text-red-500 gap-1'>
        <DatabaseBackup /> No data...
      </div>
    )

  return (
    <div className='w-full mx-auto overflow-hidden mt-14 sm:mt-0'>
      <Swiper
        modules={[Autoplay, Pagination, Navigation]}
        autoplay={{ delay: 2000, disableOnInteraction: false }}
        pagination={{ clickable: true }}
        effect='fade'
        loop={true}
        slidesPerView={1}
        spaceBetween={30}
        className='h-[230px] sm:h-[500px] px-4 w-full'
      >
        {data_.map((item, index) => (
          <SwiperSlide key={index}>
            <div className='relative w-full h-full'>
              <img
                src={item.photos[0]}
                alt={item.title}
                className='w-full h-full object-cover'
              />
              <div className='absolute inset-6 flex flex-col justify-end p-4 sm:p-6 text-white'>
                <h2 className='text-xl sm:text-3xl font-bold mb-1 sm:mb-2 drop-shadow-md'>
                  {item.title}
                </h2>
                <p className='text-sm sm:text-lg drop-shadow-md line-clamp-3'>
                  {item.description}
                </p>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  )
}
