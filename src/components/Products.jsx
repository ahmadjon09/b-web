import { useState } from 'react'
import { Heart, ShoppingCart, ChevronLeft, ChevronRight } from 'lucide-react'
import { cn } from '../lib/utils'
import ProductDetailModal from '../mod/Product'
import { StarRating } from '../service/Stars'
import { useDispatch, useSelector } from 'react-redux'
import { getUserSuccess } from '../toolkit/UserSlicer'
import Axios from '../Axios'
import { CommentCard } from '../service/Comments'
import useSWR from 'swr'

export const ProductCard = ({ product }) => {
  if (!product) {
    return
  }
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0)
  const [isFavorite, setIsFavorite] = useState(false)
  const [isAddingToCart, setIsAddingToCart] = useState(false)
  const [isOrdering, setIsOrdering] = useState(false)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const dispatch = useDispatch()
  const clientId = useSelector(state => state.user.data._id)
  const client = useSelector(state => state.user.data)
  const { data, isLoading, error } = useSWR(
    `product/${product._id}/lastcomments`,
    Axios
  )

  const priceWithSale =
    product.out_price - (product.out_price * product.sale) / 100

  // Handle image navigation
  const nextPhoto = e => {
    e.stopPropagation()
    setCurrentPhotoIndex(prev =>
      prev === product.photos.length - 1 ? 0 : prev + 1
    )
  }

  const prevPhoto = e => {
    e.stopPropagation()
    setCurrentPhotoIndex(prev =>
      prev === 0 ? product.photos.length - 1 : prev - 1
    )
  }

  const toggleFavorite = async productId => {
    try {
      const response = await Axios.post('/client/toggle-favorite', {
        productId,
        clientId
      })
      dispatch(
        getUserSuccess({
          ...client,
          data: {
            ...client.data,
            favorites: [...client.data.favorites, productId]
          }
        })
      )
    } catch (error) {
      console.error('Like toggle error:', error)
    }
  }

  // Handle add to cart
  const addToCart = e => {
    e.stopPropagation()
    setIsAddingToCart(true)
    // Simulate API call
    setTimeout(() => {
      setIsAddingToCart(false)
    }, 600)
  }

  // Handle order
  const handleOrder = e => {
    e.stopPropagation()
    setIsOrdering(true)
    // Simulate API call
    setTimeout(() => {
      setIsOrdering(false)
    }, 600)
  }

  // Open modal
  const openModal = () => {
    setIsModalOpen(true)
  }

  return (
    <>
      <div
        className='bg-white rounded-2xl shadow-lg p-4 max-w-[240px] w-full flex flex-col gap-3 transition-all duration-300 hover:shadow-xl hover:translate-y-[-4px] group cursor-pointer'
        onClick={openModal}
      >
        {/* Product Image with Favorite Button */}
        <div className='flex flex-col'>
          <div className='relative w-full h-48 overflow-hidden rounded-xl'>
            <img
              src={product.photos[currentPhotoIndex] || '/placeholder.svg'}
              alt={product.title}
              className='w-full h-full object-cover rounded-xl transition-transform duration-500 group-hover:scale-105'
            />

            {/* Favorite Button */}
            <button
              onClick={() => toggleFavorite(product._id)}
              className={cn(
                'absolute top-2 right-2 p-2 rounded-full bg-white/80 backdrop-blur-sm transition-all duration-300 hover:bg-white',
                client?.favorites?.some(fav => fav._id === product._id)
                  ? 'text-red-500'
                  : 'text-gray-500'
              )}
            >
              <Heart
                className={cn(
                  'w-5 h-5',
                  client?.favorites?.some(fav => fav._id === product._id) &&
                    'fill-red-500'
                )}
              />
            </button>

            {/* Navigation Arrows (only show if multiple photos) */}
            {product.photos.length > 1 && (
              <>
                <button
                  onClick={prevPhoto}
                  className='absolute left-2 top-1/2 transform -translate-y-1/2 p-1 rounded-full bg-white/70 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300'
                >
                  <ChevronLeft className='w-4 h-4 text-gray-700' />
                </button>
                <button
                  onClick={nextPhoto}
                  className='absolute right-2 top-1/2 transform -translate-y-1/2 p-1 rounded-full bg-white/70 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300'
                >
                  <ChevronRight className='w-4 h-4 text-gray-700' />
                </button>
              </>
            )}

            {/* Photo Indicator */}
            {product.photos.length > 1 && (
              <div className='absolute bottom-2 left-1/2 transform -translate-x-1/2 flex gap-1'>
                {product.photos.map((_, index) => (
                  <div
                    key={index}
                    className={cn(
                      'w-1.5 h-1.5 rounded-full transition-all duration-300',
                      index === currentPhotoIndex
                        ? 'bg-white w-3'
                        : 'bg-white/60'
                    )}
                  />
                ))}
              </div>
            )}
          </div>
          <CommentCard comment={data} />
        </div>

        {/* Product Info */}
        <div className='flex flex-col gap-1.5 flex-grow'>
          <div className='flex justify-between items-start'>
            <h3 className='text-sm font-semibold line-clamp-2 text-gray-900 group-hover:text-purple-700 transition-colors duration-300'>
              {product.title}
            </h3>
            <div className='flex z-20'>
              <StarRating rating={product.rating} />
            </div>
          </div>

          <p className='text-xs text-gray-500 line-clamp-2 flex-grow'>
            {product.description}
          </p>

          {/* Color Options */}
          {product.colors && product.colors.length > 0 && (
            <div className='flex gap-1 mt-1'>
              <span className='text-xs text-gray-500'>Ranglar:</span>
              <div className='flex gap-1 flex-wrap'>
                {product.colors.map((color, index) => (
                  <div
                    key={index}
                    className='w-4 h-4 rounded-full border border-gray-200'
                    style={{ backgroundColor: color.value }}
                    title={color.name}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Size Options */}
          {product.sizes && product.sizes.length > 0 && (
            <div className='flex gap-1 mt-1 items-center'>
              <span className='text-xs text-gray-500'>O'lchamlar:</span>
              <div className='flex gap-1 flex-wrap'>
                {product.sizes.slice(0, 4).map((sizeObj, index) => (
                  <span
                    key={index}
                    className='text-xs bg-gray-100 px-1.5 py-0.5 rounded text-gray-700'
                    title={sizeObj.size}
                  >
                    {sizeObj.size}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Price Information */}
          <div className='mt-1'>
            <div className='text-purple-700 text-sm font-bold'>
              {priceWithSale?.toLocaleString()} so'm
            </div>

            <div className='flex justify-between items-center'>
              <div className='text-xs text-gray-400 line-through'>
                {product.out_price?.toLocaleString()} so'm
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        {/* Add to Cart Button */}
        <button
          onClick={addToCart}
          disabled={isAddingToCart}
          className={cn(
            'py-2 rounded-lg text-sm font-medium flex items-center justify-center gap-1 transition-all duration-300',
            isAddingToCart
              ? 'bg-purple-200 text-purple-700'
              : 'bg-purple-600 text-white hover:bg-purple-700 active:scale-95'
          )}
        >
          <ShoppingCart className='w-4 h-4' />
          <span className='hidden sm:inline'>
            {isAddingToCart ? "Qo'shilmoqda..." : 'Savatga'}
          </span>
        </button>

        {/* Order Button */}
        {/* <button
            onClick={handleOrder}
            disabled={isOrdering}
            className={cn(
              'py-2 rounded-lg text-sm font-medium flex items-center justify-center gap-1 transition-all duration-300',
              isOrdering
                ? 'bg-green-200 text-green-700'
                : 'bg-green-600 text-white hover:bg-green-700 active:scale-95'
            )}
          >
            <PhoneCall className='w-4 h-4' />
            <span className='hidden sm:inline'>
              {isOrdering ? 'Buyurtma...' : 'Buyurtma'}
            </span>
          </button> */}
      </div>

      {/* Product Detail Modal */}
      {isModalOpen && (
        <ProductDetailModal
          product={product}
          onClose={() => setIsModalOpen(false)}
          isFavorite={isFavorite}
          toggleFavorite={toggleFavorite}
        />
      )}
    </>
  )
}
