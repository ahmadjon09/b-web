import { useState, useEffect } from 'react'
import {
  Truck,
  Star,
  ShoppingCart,
  Globe,
  Shield,
  Clock,
  Award,
  Users,
  Package,
  Headphones,
  ChevronLeft,
  ChevronRight,
  Quote
} from 'lucide-react'

// Content data
import { content } from '../assets/contact'

// Icon component
const Icon = ({ name, className }) => {
  const icons = {
    Truck: <Truck className={className} />,
    Star: <Star className={className} />,
    ShoppingCart: <ShoppingCart className={className} />,
    Globe: <Globe className={className} />,
    Shield: <Shield className={className} />,
    Clock: <Clock className={className} />,
    Award: <Award className={className} />,
    Users: <Users className={className} />,
    Package: <Package className={className} />,
    Headphones: <Headphones className={className} />
  }
  return icons[name] || null
}

// Testimonials Swiper Component
const TestimonialsSwiper = ({ testimonials }) => {
  const [currentSlide, setCurrentSlide] = useState(0)
  const [isAutoPlaying, setIsAutoPlaying] = useState(true)

  useEffect(() => {
    if (!isAutoPlaying) return

    const interval = setInterval(() => {
      setCurrentSlide(prev => (prev + 1) % testimonials.length)
    }, 4000)

    return () => clearInterval(interval)
  }, [testimonials.length, isAutoPlaying])

  const nextSlide = () => {
    setCurrentSlide(prev => (prev + 1) % testimonials.length)
    setIsAutoPlaying(false)
    setTimeout(() => setIsAutoPlaying(true), 10000)
  }

  const prevSlide = () => {
    setCurrentSlide(
      prev => (prev - 1 + testimonials.length) % testimonials.length
    )
    setIsAutoPlaying(false)
    setTimeout(() => setIsAutoPlaying(true), 10000)
  }

  const goToSlide = index => {
    setCurrentSlide(index)
    setIsAutoPlaying(false)
    setTimeout(() => setIsAutoPlaying(true), 10000)
  }

  return (
    <div className='relative max-w-4xl mx-auto'>
      <div className='overflow-hidden rounded-2xl'>
        <div
          className='flex transition-transform duration-500 ease-in-out'
          style={{ transform: `translateX(-${currentSlide * 100}%)` }}
        >
          {testimonials.map((testimonial, index) => (
            <div key={index} className='w-full flex-shrink-0 px-4'>
              <div className='bg-white rounded-2xl p-6 sm:p-8 shadow-xl border border-gray-100 relative overflow-hidden'>
                <div className='absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-purple-600'></div>
                <div className='flex items-center justify-center mb-6'>
                  <Quote className='w-8 h-8 sm:w-12 sm:h-12 text-blue-500 opacity-20' />
                </div>
                <p className='text-gray-700 text-base sm:text-lg leading-relaxed mb-6 text-center italic'>
                  "{testimonial.quote}"
                </p>
                <div className='flex justify-center mb-4'>
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star
                      key={i}
                      className='w-4 h-4 sm:w-5 sm:h-5 text-yellow-400 fill-yellow-400'
                    />
                  ))}
                </div>
                <div className='text-center'>
                  <p className='font-bold text-gray-800 text-base sm:text-lg'>
                    {testimonial.author}
                  </p>
                  <p className='text-gray-500 text-sm'>
                    {testimonial.position}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Navigation buttons */}
      <button
        onClick={prevSlide}
        className='absolute left-2 sm:left-4 top-1/2 transform -translate-y-1/2 bg-white rounded-full p-2 sm:p-3 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110 z-10'
        aria-label='Previous testimonial'
      >
        <ChevronLeft className='w-4 h-4 sm:w-6 sm:h-6 text-gray-600' />
      </button>
      <button
        onClick={nextSlide}
        className='absolute right-2 sm:right-4 top-1/2 transform -translate-y-1/2 bg-white rounded-full p-2 sm:p-3 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110 z-10'
        aria-label='Next testimonial'
      >
        <ChevronRight className='w-4 h-4 sm:w-6 sm:h-6 text-gray-600' />
      </button>

      {/* Dots indicator */}
      <div className='flex justify-center mt-6 sm:mt-8 space-x-2'>
        {testimonials.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`w-2 h-2 sm:w-3 sm:h-3 rounded-full transition-all duration-300 ${
              currentSlide === index
                ? 'bg-blue-500 scale-125'
                : 'bg-gray-300 hover:bg-gray-400'
            }`}
            aria-label={`Go to testimonial ${index + 1}`}
          />
        ))}
      </div>
    </div>
  )
}

export const AboutPage = () => {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    setIsVisible(true)
  }, [])

  return (
    <div className='min-h-screen bg-gradient-to-br mt-[70px] sm:mt-[110px] from-slate-50 via-blue-50 to-indigo-100'>
      {/* Hero Section */}
      <div className='relative overflow-hidden'>
        <div className='absolute inset-0 bg-gradient-to-r from-blue-600/10 to-purple-600/10'></div>
        <div className='relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 sm:pt-20 pb-12 sm:pb-16'>
          <div
            className={`text-center transition-all duration-1000 ${
              isVisible
                ? 'opacity-100 translate-y-0'
                : 'opacity-0 translate-y-10'
            }`}
          >
            <h1 className='text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold text-gray-900 mb-4 sm:mb-6 leading-tight'>
              <span className='bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent'>
                Oziq-Ovqat Savdosi:
              </span>
              <br />
              <span className='text-gray-800'>
                O'zbekistonga Sifat va Ishonch!
              </span>
            </h1>
            <p className='text-base sm:text-lg lg:text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed px-4'>
              {content.description}
            </p>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16'>
        <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6'>
          {content.features.map((feature, index) => (
            <div
              key={index}
              className={`group relative bg-white rounded-2xl p-4 sm:p-6 shadow-lg hover:shadow-2xl transition-all duration-500 border border-gray-100 hover:border-blue-200 overflow-hidden transform hover:scale-105 hover:-translate-y-2 ${
                isVisible
                  ? 'opacity-100 translate-y-0'
                  : 'opacity-0 translate-y-10'
              }`}
              style={{ transitionDelay: `${index * 100}ms` }}
            >
              <div className='absolute inset-0 bg-gradient-to-br from-blue-50/50 to-purple-50/50 opacity-0 group-hover:opacity-100 transition-opacity duration-500'></div>
              <div className='relative z-10'>
                <div className='flex items-center mb-4'>
                  <div className='p-2 sm:p-3 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl shadow-lg group-hover:scale-110 transition-transform duration-300'>
                    <Icon
                      name={feature.icon}
                      className='w-5 h-5 sm:w-6 sm:h-6 text-white'
                    />
                  </div>
                </div>
                <h3 className='text-base sm:text-lg font-bold text-gray-900 mb-2 sm:mb-3 group-hover:text-blue-700 transition-colors duration-300'>
                  {feature.title}
                </h3>
                <p className='text-gray-600 text-sm leading-relaxed'>
                  {feature.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Testimonials Section */}
      <div className='bg-gradient-to-r from-gray-50 to-blue-50 py-16 sm:py-20'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
          <div
            className={`text-center mb-12 sm:mb-16 transition-all duration-1000 ${
              isVisible
                ? 'opacity-100 translate-y-0'
                : 'opacity-0 translate-y-10'
            }`}
          >
            <h2 className='text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-4'>
              Mijozlarimiz{' '}
              <span className='bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent'>
                Fikrlari
              </span>
            </h2>
            <p className='text-gray-600 text-base sm:text-lg max-w-2xl mx-auto px-4'>
              Bizning xizmatlarimizdan foydalangan mijozlarimizning haqiqiy
              fikrlari va baholarini o'qing
            </p>
          </div>

          <div
            className={`transition-all duration-1000 delay-300 ${
              isVisible
                ? 'opacity-100 translate-y-0'
                : 'opacity-0 translate-y-10'
            }`}
          >
            <TestimonialsSwiper testimonials={content.testimonials} />
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className='bg-white py-12 sm:py-16'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
          <div className='grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8'>
            {[
              { number: '1000+', label: 'Mamnun Mijozlar' },
              { number: '500+', label: 'Mahsulot Turlari' },
              { number: '24/7', label: "Qo'llab-quvvatlash" },
              { number: '99%', label: 'Sifat Kafolati' }
            ].map((stat, index) => (
              <div
                key={index}
                className={`text-center transition-all duration-1000 ${
                  isVisible
                    ? 'opacity-100 translate-y-0'
                    : 'opacity-0 translate-y-10'
                }`}
                style={{ transitionDelay: `${index * 200}ms` }}
              >
                <div className='text-2xl sm:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2'>
                  {stat.number}
                </div>
                <div className='text-gray-600 font-medium text-sm sm:text-base'>
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20'>
        <div
          className={`relative bg-gradient-to-r from-blue-600 to-purple-700 rounded-2xl sm:rounded-3xl p-6 sm:p-8 lg:p-12 text-center overflow-hidden shadow-2xl transition-all duration-1000 hover:scale-105 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}
        >
          <div className='absolute inset-0 bg-gradient-to-r from-blue-600/90 to-purple-700/90'></div>
          <div
            className="absolute  opacity-20 inset-0 bg-[url('data:image/svg+xml,%3Csvg "
            width='60'
            height='60'
            viewBox='0 0 60 60'
            xmlns='http://www.w3.org/2000/svg\%3E%3Cg'
            fill='none'
            fillRule='evenodd%3E%3Cg'
            fillOpacity='\0.1\%3E%3Ccircle'
            cx='30'
            cy='30'
            r='2/%3E%3C/g%3E%3C/g%3E%3C/svg%3E'
          ></div>
          <div className='relative z-10'>
            <h3 className='text-xl sm:text-2xl lg:text-3xl font-bold text-white mb-4'>
              {content.cta.title}
            </h3>
            <p className='text-blue-100 text-base sm:text-lg mb-6 sm:mb-8 max-w-3xl mx-auto leading-relaxed'>
              {content.cta.description}
            </p>
            <button className='inline-flex items-center px-6 sm:px-8 py-3 sm:py-4 bg-white text-blue-700 rounded-full font-bold text-base sm:text-lg hover:bg-blue-50 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1 hover:scale-105'>
              <ShoppingCart className='w-4 h-4 sm:w-5 sm:h-5 mr-2' />
              {content.cta.button}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
