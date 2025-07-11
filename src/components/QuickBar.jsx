import { useState, useRef, useEffect } from 'react'
import useSWR from 'swr'
import Axios from '../Axios'
import { Loader2, MessageSquareWarning, Search, Star } from 'lucide-react'
import { Link } from 'react-router-dom'

export const QuickBar = () => {
  const [query, setQuery] = useState('')
  const [visibleCount, setVisibleCount] = useState(10)
  const wrapperRef = useRef(null)

  const {
    data: categoriesData,
    isLoading: categoriesLoading,
    error: categoriesError
  } = useSWR('product/allcategory', Axios)

  const { data, isLoading, error } = useSWR(
    query ? `product/search?search=${encodeURIComponent(query)}` : null,
    Axios
  )

  console.log('API response:', data)
  console.log(
    'SWR query URL:',
    query ? `product/search?search=${encodeURIComponent(query)}` : null
  )

  const categories = categoriesData?.data.data || []
  const visibleCategories = categories.slice(0, visibleCount)
  const hasMore = visibleCount < categories.length

  useEffect(() => {
    function handleClickOutside (event) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setQuery('')
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  return (
    <div className='w-full mt-[80px] sm:mt-[128px] bg-gradient-to-r from-white via-purple-50 to-white py-8 px-4 sm:px-10 border-b border-gray-200'>
      <div className='max-w-7xl w-full mx-auto relative' ref={wrapperRef}>
        <div className='flex flex-wrap justify-center gap-3 mb-8 overflow-hidden'>
          {categoriesLoading ? (
            <p className='text-gray-500 flex items-center gap-2'>
              <Loader2 className='animate-spin' size={18} /> Yuklanmoqda...
            </p>
          ) : categoriesError ? (
            <p className='text-red-500 flex items-center gap-2'>
              <MessageSquareWarning size={18} /> Kategoriya yuklashda xatolik
            </p>
          ) : (
            <>
              {visibleCategories.map((cat, index) => (
                <button
                  key={index}
                  className='px-5 py-2 w-[120px] sm:w-[150px] truncate text-sm font-medium text-center rounded bg-purple-100 text-purple-700 hover:bg-purple-300 hover:text-purple-900 transition shadow-md'
                  title={cat}
                  onClick={() => setQuery(cat)}
                >
                  {cat}
                </button>
              ))}
              {hasMore && (
                <button
                  onClick={() => setVisibleCount(prev => prev + 10)}
                  className='px-5 py-2 w-[120px] sm:w-[150px] text-sm font-semibold rounded-full bg-gray-200 text-gray-700 hover:bg-gray-300 transition shadow-md'
                >
                  Ko‘proq
                </button>
              )}
            </>
          )}
        </div>

        {/* Search input */}
        <div className='relative max-w-xl mx-auto'>
          <input
            type='text'
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder='Qidiruv...'
            className='w-full pl-12 pr-5 py-3 text-sm rounded-full border border-gray-300 bg-white shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 transition'
            autoComplete='off'
          />
          <div className='absolute left-4 top-1/2 -translate-y-1/2 text-purple-600 pointer-events-none'>
            <Search size={20} />
          </div>
        </div>

        {/* Search results modal */}
        {query && (
          <div
            className='absolute top-full left-1/2 -translate-x-1/2 mt-2 w-full max-w-xl bg-white rounded-2xl shadow-lg border border-purple-200 z-50'
            style={{ maxHeight: '400px', overflowY: 'auto' }}
          >
            {isLoading ? (
              <p className='text-gray-500 flex items-center gap-2 px-5 py-4'>
                <Loader2 className='animate-spin' size={18} /> Qidirilmoqda...
              </p>
            ) : error ? (
              <p className='text-red-500 flex items-center gap-2 px-5 py-4'>
                <MessageSquareWarning size={18} /> Qidiruvda xatolik yuz berdi
              </p>
            ) : data.data?.data.length > 0 ? (
              <ul className='divide-y divide-gray-100'>
                {data.data?.data.map(item => (
                  <li
                    key={item._id}
                    className='px-5 py-3 cursor-pointer hover:bg-purple-50 transition'
                  >
                    <Link to={`/product/${item.ID}`}>
                      <div className='flex items-center gap-4'>
                        <img
                          src={
                            item.photos[0] || 'https://via.placeholder.com/80'
                          }
                          alt={item.title}
                          className='w-16 h-16 object-cover rounded-md'
                          onError={e =>
                            (e.target.src = 'https://via.placeholder.com/80')
                          }
                        />
                        <div className='flex-1'>
                          <p className='text-sm font-semibold text-gray-800'>
                            {item.title}
                          </p>
                          <p className='text-xs text-gray-500 line-clamp-1'>
                            {item.description}
                          </p>
                          <div className='flex items-center gap-2 mt-1'>
                            <p className='text-sm font-bold text-purple-700'>
                              {item.variants[0]?.price
                                ? `${item.variants[0].price} so'm`
                                : 'N/A'}
                            </p>
                            {item.sale > 0 && (
                              <p className='text-xs text-red-500 line-through'>
                                {Math.round(
                                  item.variants[0]?.price /
                                    (1 - item.sale / 100)
                                )}{' '}
                                so'm
                              </p>
                            )}
                            <div className='flex items-center mr-2'>
                              <Star className='h-3 w-3 text-yellow-500 fill-yellow-500 mr-0.5' />
                              <span>{item.rating.toFixed(1)}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </Link>
                  </li>
                ))}
              </ul>
            ) : (
              <div className='text-start text-gray-600 px-5 py-4'>
                <p className='italic text-gray-400 mb-2'>
                  Hech narsa topilmadi
                </p>
                {data?.data.suggestions?.length > 0 && (
                  <ul className='space-y-2'>
                    {data.data.suggestions.map((suggestion, idx) => (
                      <li
                        key={idx}
                        className='text-sm text-gray-700 font-bold hover:underline cursor-pointer'
                        onClick={() => setQuery(suggestion)}
                      >
                        <div className='flex items-center gap-1.5 w-full'>
                          <Search size={15} className='text-gray-500' />
                          <p className='line-clamp-1'>{suggestion}</p>
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
