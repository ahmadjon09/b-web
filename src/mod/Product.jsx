import { useState, useEffect } from 'react'
import {
  X,
  Heart,
  ShoppingCart,
  Truck,
  Shield,
  ChevronLeft,
  ChevronRight,
  Minus,
  Plus,
  Ruler,
  InfoIcon
} from 'lucide-react'
import { cn } from '../lib/utils'
// import OrderForm from '../components/Order'
import { StarRating } from '../service/Stars'
import { Link } from 'react-router-dom'
import { useSelector } from 'react-redux'

export default function ProductDetailModal ({
  product,
  onClose,
  isFavorite,
  toggleFavorite
}) {
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0)
  const [selectedColor, setSelectedColor] = useState(product.colors[0] || null)
  const [selectedSize, setSelectedSize] = useState(
    product.sizes && product.sizes[0] ? product.sizes[0] : null
  )
  const [quantity, setQuantity] = useState(1)
  const [isAddingToCart, setIsAddingToCart] = useState(false)
  const [showOrderForm, setShowOrderForm] = useState(false)
  const client = useSelector(state => state.user.data)

  // Calculate price with sale
  const priceWithSale =
    product.out_price - (product.out_price * product.sale) / 100
  const totalPrice = priceWithSale * quantity

  // Handle image navigation
  const nextPhoto = () => {
    setCurrentPhotoIndex(prev =>
      prev === product.photos.length - 1 ? 0 : prev + 1
    )
  }

  const prevPhoto = () => {
    setCurrentPhotoIndex(prev =>
      prev === 0 ? product.photos.length - 1 : prev - 1
    )
  }

  // Handle quantity change
  const increaseQuantity = () => {
    if (quantity < product.stock) {
      setQuantity(quantity + 1)
    }
  }

  const decreaseQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1)
    }
  }

  // Handle add to cart
  const addToCart = () => {
    setIsAddingToCart(true)
    // Simulate API call
    setTimeout(() => {
      setIsAddingToCart(false)
      // Show success message or update cart count
    }, 600)
  }

  // Handle buy now
  const buyNow = () => {
    setShowOrderForm(true)
  }

  // Close modal when escape key is pressed
  useEffect(() => {
    const handleEsc = e => {
      if (e.key === 'Escape') {
        onClose()
      }
    }
    window.addEventListener('keydown', handleEsc)
    return () => {
      window.removeEventListener('keydown', handleEsc)
    }
  }, [onClose])

  // Prevent body scroll when modal is open
  useEffect(() => {
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = 'auto'
    }
  }, [])

  // Handle backdrop click
  const handleBackdropClick = e => {
    if (e.target === e.currentTarget) {
      onClose()
    }
  }

  // if (showOrderForm) {
  //   return (
  //     <div
  //       className='fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto'
  //       onClick={handleBackdropClick}
  //     >
  //       <div
  //         className='bg-white rounded-2xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto animate-in fade-in duration-300 slide-in-from-bottom-5'
  //         onClick={e => e.stopPropagation()}
  //       >
  //         <div className='sticky top-0 bg-white p-4 border-b flex justify-between items-center z-10'>
  //           <h2 className='text-lg font-semibold'>Complete Your Order</h2>
  //           <button
  //             onClick={() => setShowOrderForm(false)}
  //             className='p-1 rounded-full hover:bg-gray-100 transition-colors'
  //           >
  //             <X className='w-5 h-5' />
  //           </button>
  //         </div>

  //         <OrderForm
  //           product={product}
  //           quantity={quantity}
  //           selectedColor={selectedColor}
  //           selectedSize={selectedSize}
  //           totalPrice={totalPrice}
  //           onClose={onClose}
  //         />
  //       </div>
  //     </div>
  //   )
  // }

  return (
    <div
      className='fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto'
      onClick={handleBackdropClick}
    >
      <div
        className='bg-white rounded-2xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto animate-in fade-in duration-300 slide-in-from-bottom-5'
        onClick={e => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className='absolute top-4 right-4 p-2 rounded-full bg-white/90 shadow-md hover:bg-white transition-colors z-10'
        >
          <X className='w-5 h-5' />
        </button>

        <div className='flex flex-col md:flex-row'>
          {/* Product Images */}
          <div className='md:w-1/2 p-6 relative'>
            <div className='relative w-full h-[300px] md:h-[400px] overflow-hidden rounded-xl'>
              <img
                src={product.photos[currentPhotoIndex] || '/placeholder.svg'}
                alt={product.title}
                className='w-full h-full object-cover rounded-xl'
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
                    className='absolute left-2 top-1/2 transform -translate-y-1/2 p-2 rounded-full bg-white/70 backdrop-blur-sm hover:bg-white/90 transition-colors'
                  >
                    <ChevronLeft className='w-5 h-5 text-gray-700' />
                  </button>
                  <button
                    onClick={nextPhoto}
                    className='absolute right-2 top-1/2 transform -translate-y-1/2 p-2 rounded-full bg-white/70 backdrop-blur-sm hover:bg-white/90 transition-colors'
                  >
                    <ChevronRight className='w-5 h-5 text-gray-700' />
                  </button>
                </>
              )}
            </div>

            {/* Thumbnail Gallery */}
            {product.photos.length > 1 && (
              <div className='flex gap-2 mt-4 overflow-x-auto pb-2'>
                {product.photos.map((photo, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentPhotoIndex(index)}
                    className={cn(
                      'w-16 h-16 rounded-lg overflow-hidden border-2 transition-all duration-200',
                      currentPhotoIndex === index
                        ? 'border-purple-500'
                        : 'border-transparent hover:border-purple-200'
                    )}
                  >
                    <img
                      src={photo || '/placeholder.svg'}
                      alt={`${product.title} - ${index + 1}`}
                      className='w-full h-full object-cover'
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Details */}
          <div className='md:w-1/2 p-6 flex flex-col'>
            <div className='flex justify-between items-start'>
              <div>
                <span className='text-sm font-medium bg-purple-100 text-purple-700 px-2 py-1 rounded-full'>
                  {product.category}
                </span>
                <h1 className='text-2xl font-bold mt-2 text-gray-900'>
                  {product.title}
                </h1>
                <div className='text-sm text-gray-500 mt-1 flex items-center  gap-2 flex-wrap'>
                  <p>Brand: {product.brand}</p>
                  <div className='flex items-center gap-1'>
                    <StarRating rating={product.rating} />(
                    {product.reviews.length})
                  </div>
                </div>
              </div>
              <div className='bg-green-50 px-3 py-1 rounded-full text-green-600 text-sm font-medium'>
                Sotuvda mavjud: {product.stock.toLocaleString()}
              </div>
            </div>

            <div className='mt-6'>
              <h2 className='text-lg font-semibold'>Tavsif</h2>
              <p className='text-gray-600 mt-2 line-clamp-5'>
                {product.description}
              </p>
            </div>

            {/* Color Selection */}
            {product.colors && product.colors.length > 0 && (
              <div className='mt-6'>
                <h2 className='text-lg font-semibold'>Ranglar</h2>
                <div className='flex gap-2 mt-2 flex-wrap'>
                  {product.colors.map((color, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedColor(color)}
                      className={cn(
                        'w-8 h-8 rounded-full transition-all duration-200 flex items-center justify-center',
                        selectedColor?.name === color.name
                          ? 'ring-2 ring-offset-2 ring-purple-500'
                          : ''
                      )}
                    >
                      <span
                        className='w-6 h-6 rounded-full border-gray-300 border-2'
                        style={{ backgroundColor: color.value }}
                        title={color.name}
                      />
                    </button>
                  ))}
                </div>
                {selectedColor && (
                  <p className='text-sm text-gray-600 mt-2'>
                    Tanlangan rang: {selectedColor.name}
                  </p>
                )}
              </div>
            )}

            {/* Size Selection */}
            {product.sizes && product.sizes.length > 0 && (
              <div className='mt-6'>
                <h2 className='text-lg font-semibold'>O'lchamlar</h2>
                <div className='flex gap-2 mt-2 flex-wrap'>
                  {product.sizes.map((sizeObj, index) => {
                    const sizeValue =
                      typeof sizeObj === 'object' && sizeObj.size
                        ? sizeObj.size
                        : sizeObj
                    const isSelected = selectedSize
                      ? typeof selectedSize === 'object' && selectedSize.size
                        ? selectedSize.size === sizeValue
                        : selectedSize === sizeValue
                      : false

                    return (
                      <button
                        key={index}
                        onClick={() => setSelectedSize(sizeObj)}
                        className={cn(
                          'flex items-center gap-2 px-3 py-2 rounded-lg border-2 transition-all duration-200',
                          isSelected
                            ? 'border-blue-500 bg-blue-50 text-blue-700'
                            : 'border-gray-200 bg-white text-gray-700 hover:border-blue-300 hover:bg-blue-50'
                        )}
                      >
                        <div className='w-4 h-4 rounded-full bg-blue-500 flex items-center justify-center'>
                          <Ruler className='w-2.5 h-2.5 text-white' />
                        </div>
                        <span className='text-sm font-medium'>{sizeValue}</span>
                      </button>
                    )
                  })}
                </div>
                {!selectedSize && (
                  <p className='text-sm text-gray-600 mt-2'>
                    Tanlangan o'lcham:{' '}
                    {typeof selectedSize === 'object' && selectedSize.size
                      ? selectedSize.size
                      : selectedSize}
                  </p>
                )}
              </div>
            )}

            {/* Legacy Size Support */}
            {product.size && (!product.sizes || product.sizes.length === 0) && (
              <div className='mt-6'>
                <h2 className='text-lg font-semibold'>Hajmi</h2>
                <div className='mt-2 inline-block bg-gray-100 px-3 py-1 rounded-lg text-gray-700'>
                  {product.size}
                </div>
              </div>
            )}

            {/* Price Information */}
            <div className='mt-6'>
              <div className='flex items-center gap-2'>
                <span className='text-2xl font-bold text-purple-700'>
                  {priceWithSale.toLocaleString()} so'm
                </span>
                {product.sale > 0 && (
                  <>
                    <span className='text-sm text-gray-400 line-through'>
                      {product.out_price.toLocaleString()} so'm
                    </span>
                    <span className='bg-red-100 text-red-600 text-xs font-medium px-2 py-1 rounded-full'>
                      {product.sale}% OFF
                    </span>
                  </>
                )}
              </div>
            </div>

            {/* Quantity Selector */}
            <div className='mt-6'>
              <h2 className='text-lg font-semibold'>Miqdori</h2>
              <div className='flex items-center mt-2'>
                <button
                  onClick={decreaseQuantity}
                  disabled={quantity <= 1}
                  className={cn(
                    'p-2 rounded-l-lg border border-gray-300 transition-colors',
                    quantity <= 1
                      ? 'bg-gray-100 text-gray-400'
                      : 'hover:bg-gray-100'
                  )}
                >
                  <Minus className='w-4 h-4' />
                </button>
                <div className='px-4 py-2 border-t border-b border-gray-300 text-center min-w-[60px]'>
                  {quantity}
                </div>
                <button
                  onClick={increaseQuantity}
                  disabled={quantity >= product.stock}
                  className={cn(
                    'p-2 rounded-r-lg border border-gray-300 transition-colors',
                    quantity >= product.stock
                      ? 'bg-gray-100 text-gray-400'
                      : 'hover:bg-gray-100'
                  )}
                >
                  <Plus className='w-4 h-4' />
                </button>
                <div className='ml-4 text-gray-500 text-sm'>
                  Jami:{' '}
                  <span className='font-semibold text-purple-700'>
                    {totalPrice.toLocaleString()} so'm
                  </span>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className='mt-8 flex gap-4'>
              <button
                onClick={addToCart}
                disabled={isAddingToCart}
                className={cn(
                  'flex-1 py-3 rounded-lg text-sm font-medium flex items-center justify-center gap-2 transition-all duration-300',
                  isAddingToCart
                    ? 'bg-purple-200 text-purple-700'
                    : 'bg-purple-600 text-white hover:bg-purple-700 active:scale-[0.98]'
                )}
              >
                <ShoppingCart className='w-5 h-5' />
                {isAddingToCart ? "Qo'shilmoqda..." : 'Savatga'}
              </button>
              <Link
                to={`/product/${product._id}`}
                className='flex-1 py-3 rounded-lg text-sm font-medium flex items-center justify-center gap-2 bg-orange-500 text-white hover:bg-orange-600 transition-all duration-300 active:scale-[0.98]'
              >
                <InfoIcon className='w-5 h-5' />
                Ko'proq
              </Link>
            </div>

            {/* Additional Info */}
            <div className='mt-8 grid grid-cols-2 gap-4'>
              <div className='flex items-center gap-2 flex-wrap p-3 rounded-lg bg-gray-50'>
                <Truck className='w-5 h-5 text-purple-600' />
                <div>
                  <p className='text-sm font-medium'>Bepul yetkazib berish</p>
                  <p className='text-xs text-gray-500'>7~14 kun ichida</p>
                </div>
              </div>
              <div className='flex items-center gap-2 flex-wrap p-3 rounded-lg bg-gray-50'>
                <Shield className='w-5 h-5 text-purple-600' />
                <div>
                  <p className='text-sm font-medium'>3 oylik kafolat</p>
                  <p className='text-xs text-gray-500'>Rasmiy distribyutor</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
