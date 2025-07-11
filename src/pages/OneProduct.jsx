'use client'

import { useState, useEffect } from 'react'
import {
  Star,
  Heart,
  Share2,
  Minus,
  Plus,
  ShoppingCart,
  Truck,
  Shield,
  RotateCcw,
  Package,
  Calendar,
  Info,
  ChevronLeft,
  ChevronRight,
  ArrowLeft,
  Eye,
  Award,
  Clock,
  Copy,
  Check,
  X
} from 'lucide-react'
import Axios from '../Axios'
import {} from '../middlewares/format'
import { cn } from '../lib/utils'
import { StarRating } from '../service/Stars'
import { useSelector, useDispatch } from 'react-redux'
import { useNavigate, useParams } from 'react-router-dom'

export default function ProductDetailPage () {
  const params = useParams()
  const router = useNavigate()
  const productId = params?.id
  const dispatch = useDispatch()
  const client = useSelector(state => state.user.data)

  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [selectedVariant, setSelectedVariant] = useState(null)
  const [selectedFlavor, setSelectedFlavor] = useState(null)
  const [quantity, setQuantity] = useState(1)
  const [isAddingToCart, setIsAddingToCart] = useState(false)
  const [totalPrice, setTotalPrice] = useState(0)
  const [showShareModal, setShowShareModal] = useState(false)
  const [copySuccess, setCopySuccess] = useState(false)

  useEffect(() => {
    const AxiosProduct = async () => {
      if (!productId) return
      try {
        setLoading(true)
        setError('')
        const { data } = await Axios.get(`/product/one/short/${productId}`)
        const productData = data.data
        setProduct(productData)
        if (productData.variants && productData.variants.length > 0) {
          setSelectedVariant(productData.variants[0])
        }
        if (productData.flavors && productData.flavors.length > 0) {
          setSelectedFlavor(productData.flavors[0])
        }
      } catch (err) {
        setError(
          err.response?.data?.message ||
            'Mahsulotni yuklashda xatolik yuz berdi'
        )
      } finally {
        setLoading(false)
      }
    }
    AxiosProduct()
  }, [productId])

  useEffect(() => {
    if (!product) return
    let price = 0
    if (selectedVariant) {
      price += selectedVariant.price || 0
    }
    if (selectedFlavor) {
      price += selectedFlavor.price || 0
    }
    if (product.sale > 0) {
      price = price * (1 - product.sale / 100)
    }
    setTotalPrice(price * quantity)
  }, [selectedVariant, selectedFlavor, quantity, product])

  const nextImage = () => {
    if (product?.photos && currentImageIndex < product.photos.length - 1) {
      setCurrentImageIndex(currentImageIndex + 1)
    }
  }

  const prevImage = () => {
    if (currentImageIndex > 0) {
      setCurrentImageIndex(currentImageIndex - 1)
    }
  }

  const getAvailableStock = () => {
    const variantStock = selectedVariant?.stock || 0
    const flavorStock = selectedFlavor?.stock || Number.POSITIVE_INFINITY
    return Math.min(variantStock, flavorStock)
  }

  const handleAddToCart = async () => {
    if (!selectedVariant) {
      alert('Iltimos, variant tanlang')
      return
    }
    try {
      setIsAddingToCart(true)
      const cartItem = {
        productId: product._id,
        title: product.title,
        image: product.photos?.[0] || '',
        variant: selectedVariant,
        flavor: selectedFlavor,
        quantity: quantity,
        price: totalPrice / quantity,
        totalPrice: totalPrice
      }
      const existingCart = JSON.parse(localStorage.getItem('cart') || '[]')
      const existingItemIndex = existingCart.findIndex(
        item =>
          item.productId === cartItem.productId &&
          JSON.stringify(item.variant) === JSON.stringify(cartItem.variant) &&
          JSON.stringify(item.flavor) === JSON.stringify(cartItem.flavor)
      )
      if (existingItemIndex > -1) {
        existingCart[existingItemIndex].quantity += quantity
        existingCart[existingItemIndex].totalPrice += totalPrice
      } else {
        existingCart.push(cartItem)
      }
      localStorage.setItem('cart', JSON.stringify(existingCart))
      alert("Mahsulot savatga qo'shildi!")
    } catch (err) {
      alert("Savatga qo'shishda xatolik yuz berdi")
    } finally {
      setIsAddingToCart(false)
    }
  }

  const toggleFavorite = async productId => {
    try {
      console.log('Toggle favorite for:', productId)
    } catch (err) {
      console.error('Error toggling favorite:', err)
    }
  }

  const shareProduct = () => {
    setShowShareModal(true)
  }

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href)
      setCopySuccess(true)
      setTimeout(() => setCopySuccess(false), 2000)
    } catch (err) {
      console.error('Failed to copy:', err)
    }
  }

  const shareToTelegram = () => {
    const text = `${product.title} - ${totalPrice} so'm`
    const url = `https://t.me/share/url?url=${encodeURIComponent(
      window.location.href
    )}&text=${encodeURIComponent(text)}`
    window.open(url, '_blank')
  }

  const shareToWhatsApp = () => {
    const text = `${product.title} - ${totalPrice} so'm\n${window.location.href}`
    const url = `https://wa.me/?text=${encodeURIComponent(text)}`
    window.open(url, '_blank')
  }

  const shareToInstagram = () => {
    // Instagram doesn't support direct sharing via URL, so we'll copy to clipboard
    copyToClipboard()
    alert("Link nusxalandi! Instagram'da ulashing.")
  }

  if (loading) {
    return (
      <div className='min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 to-blue-50'>
        <div className='text-center'>
          <div className='relative'>
            <div className='animate-spin rounded-full h-12 w-12 sm:h-16 sm:w-16 border-4 border-purple-200 border-t-purple-600 mx-auto mb-4'></div>
            <div className='absolute inset-0 rounded-full h-12 w-12 sm:h-16 sm:w-16 border-4 border-transparent border-r-blue-400 animate-pulse mx-auto'></div>
          </div>
          <p className='text-gray-600 font-medium text-sm sm:text-base'>
            Yuklanmoqda...
          </p>
        </div>
      </div>
    )
  }

  if (error || !product) {
    return (
      <div className='min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 to-orange-50 px-4'>
        <div className='text-center max-w-md mx-auto p-6 sm:p-8'>
          <div className='text-red-500 text-6xl sm:text-8xl mb-4 sm:mb-6'>
            ⚠️
          </div>
          <h2 className='text-2xl sm:text-3xl font-bold text-gray-800 mb-3 sm:mb-4'>
            Xatolik yuz berdi
          </h2>
          <p className='text-gray-600 mb-4 sm:mb-6 leading-relaxed text-sm sm:text-base'>
            {error || 'Mahsulot topilmadi'}
          </p>
          <button
            onClick={() => router('/')}
            className='px-4 sm:px-6 py-2 sm:py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-xl hover:from-purple-700 hover:to-blue-700 flex items-center gap-2 mx-auto transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1 text-sm sm:text-base'
          >
            <ArrowLeft className='w-4 h-4 sm:w-5 sm:h-5' />
            Orqaga qaytish
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className='min-h-screen mt-[70px] sm:mt-[120px] bg-gradient-to-br from-gray-50 to-blue-50'>
      {/* Share Modal */}
      {showShareModal && (
        <div className='fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4'>
          <div className='bg-white rounded-2xl p-6 w-full max-w-md mx-auto shadow-2xl'>
            <div className='flex items-center justify-between mb-6'>
              <h3 className='text-xl font-bold text-gray-800'>Ulashish</h3>
              <button
                onClick={() => setShowShareModal(false)}
                className='p-2 hover:bg-gray-100 rounded-full transition-colors'
              >
                <X className='w-5 h-5' />
              </button>
            </div>

            <div className='grid grid-cols-2 gap-4 mb-6'>
              <button
                onClick={shareToTelegram}
                className='flex flex-col items-center gap-3 p-4 border-2 border-blue-200 rounded-xl hover:border-blue-400 hover:bg-blue-50 transition-all duration-300'
              >
                <div className='w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center'>
                  <svg
                    className='w-6 h-6 text-white'
                    fill='currentColor'
                    viewBox='0 0 24 24'
                  >
                    <path d='M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.568 8.16l-1.58 7.44c-.12.539-.432.672-.864.42l-2.388-1.764-1.152 1.116c-.128.128-.236.236-.48.236l.168-2.388 4.332-3.912c.192-.168-.036-.264-.3-.096l-5.364 3.372-2.304-.72c-.504-.156-.516-.504.108-.744l8.988-3.456c.42-.156.792.096.636.744z' />
                  </svg>
                </div>
                <span className='text-sm font-medium text-gray-700'>
                  Telegram
                </span>
              </button>

              <button
                onClick={shareToWhatsApp}
                className='flex flex-col items-center gap-3 p-4 border-2 border-green-200 rounded-xl hover:border-green-400 hover:bg-green-50 transition-all duration-300'
              >
                <div className='w-12 h-12 bg-green-500 rounded-full flex items-center justify-center'>
                  <svg
                    className='w-6 h-6 text-white'
                    fill='currentColor'
                    viewBox='0 0 24 24'
                  >
                    <path d='M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488' />
                  </svg>
                </div>
                <span className='text-sm font-medium text-gray-700'>
                  WhatsApp
                </span>
              </button>

              <button
                onClick={shareToInstagram}
                className='flex flex-col items-center gap-3 p-4 border-2 border-pink-200 rounded-xl hover:border-pink-400 hover:bg-pink-50 transition-all duration-300'
              >
                <div className='w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center'>
                  <svg
                    className='w-6 h-6 text-white'
                    fill='currentColor'
                    viewBox='0 0 24 24'
                  >
                    <path d='M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z' />
                  </svg>
                </div>
                <span className='text-sm font-medium text-gray-700'>
                  Instagram
                </span>
              </button>

              <button
                onClick={copyToClipboard}
                className='flex flex-col items-center gap-3 p-4 border-2 border-gray-200 rounded-xl hover:border-gray-400 hover:bg-gray-50 transition-all duration-300'
              >
                <div className='w-12 h-12 bg-gray-500 rounded-full flex items-center justify-center'>
                  {copySuccess ? (
                    <Check className='w-6 h-6 text-white' />
                  ) : (
                    <Copy className='w-6 h-6 text-white' />
                  )}
                </div>
                <span className='text-sm font-medium text-gray-700'>
                  {copySuccess ? 'Nusxalandi!' : 'Link nusxalash'}
                </span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <div className='bg-white/80 backdrop-blur-md shadow-sm sticky top-0 z-40 border-b border-gray-200'>
        <div className='max-w-7xl mx-auto px-4 py-3 sm:py-4'>
          <div className='flex items-center justify-between'>
            <button
              onClick={() => router('/')}
              className='flex items-center gap-2 text-gray-600 hover:text-purple-600 transition-all duration-300 px-2 sm:px-3 py-2 rounded-lg hover:bg-purple-50'
            >
              <ArrowLeft className='w-4 h-4 sm:w-5 sm:h-5' />
              <span className='font-medium text-sm sm:text-base'>Orqaga</span>
            </button>
            <div className='flex items-center gap-2 sm:gap-3'>
              <button
                onClick={() => toggleFavorite(product._id)}
                className={cn(
                  'p-2 sm:p-3 rounded-full transition-all duration-300 shadow-md hover:shadow-lg transform hover:scale-105',
                  client?.favorites?.some(fav => fav._id === product._id)
                    ? 'text-red-500 bg-red-50 hover:bg-red-100'
                    : 'text-gray-500 hover:bg-gray-100 bg-white'
                )}
              >
                <Heart
                  className={cn(
                    'w-4 h-4 sm:w-5 sm:h-5',
                    client?.favorites?.some(fav => fav._id === product._id) &&
                      'fill-red-500'
                  )}
                />
              </button>
              <button
                onClick={shareProduct}
                className='p-2 sm:p-3 rounded-full text-gray-500 hover:bg-gray-100 bg-white transition-all duration-300 shadow-md hover:shadow-lg transform hover:scale-105'
              >
                <Share2 className='w-4 h-4 sm:w-5 sm:h-5' />
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className='max-w-7xl mx-auto px-4 py-4 sm:py-8'>
        {/* Breadcrumb */}
        <div className='flex items-center gap-2 text-xs sm:text-sm text-gray-600 mb-4 sm:mb-8 overflow-x-auto'>
          <button
            onClick={() => router.back()}
            className='hover:text-purple-600 transition-colors whitespace-nowrap'
          >
            Asosiy
          </button>
          <span className='text-gray-400'>/</span>
          <span className='text-gray-400 truncate'>{product.category}</span>
          <span className='text-gray-400'>/</span>
          <span className='text-gray-800 font-medium truncate'>
            {product.title}
          </span>
        </div>

        <div className='grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 lg:gap-12 mb-8 sm:mb-12'>
          {/* Image Gallery */}
          <div className='space-y-4 sm:space-y-6'>
            <div className='relative bg-white rounded-xl sm:rounded-2xl overflow-hidden shadow-xl border border-gray-100'>
              <img
                src={product.photos?.[currentImageIndex] || '/placeholder.svg'}
                alt={product.title}
                className='w-full h-[300px] sm:h-[400px] lg:h-[500px] object-contain p-2 sm:p-4'
              />
              {product.photos && product.photos.length > 1 && (
                <>
                  <button
                    onClick={prevImage}
                    disabled={currentImageIndex === 0}
                    className='absolute left-2 sm:left-4 top-1/2 transform -translate-y-1/2 bg-white/90 hover:bg-white rounded-full p-2 sm:p-3 disabled:opacity-50 shadow-lg transition-all duration-300 hover:scale-110'
                  >
                    <ChevronLeft className='w-4 h-4 sm:w-6 sm:h-6 text-gray-700' />
                  </button>
                  <button
                    onClick={nextImage}
                    disabled={currentImageIndex === product.photos.length - 1}
                    className='absolute right-2 sm:right-4 top-1/2 transform -translate-y-1/2 bg-white/90 hover:bg-white rounded-full p-2 sm:p-3 disabled:opacity-50 shadow-lg transition-all duration-300 hover:scale-110'
                  >
                    <ChevronRight className='w-4 h-4 sm:w-6 sm:h-6 text-gray-700' />
                  </button>
                </>
              )}
              {product.sale > 0 && (
                <div className='absolute top-3 sm:top-6 left-3 sm:left-6 bg-gradient-to-r from-red-500 to-pink-500 text-white px-2 sm:px-4 py-1 sm:py-2 rounded-full text-xs sm:text-sm font-bold shadow-lg'>
                  -{product.sale}% CHEGIRMA
                </div>
              )}
              <div className='absolute bottom-2 sm:bottom-4 right-2 sm:right-4 bg-black/50 text-white px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm backdrop-blur-sm'>
                {currentImageIndex + 1} / {product.photos?.length || 1}
              </div>
            </div>

            {/* Thumbnails */}
            {product.photos && product.photos.length > 1 && (
              <div className='flex gap-2 sm:gap-3 overflow-x-auto pb-2'>
                {product.photos.map((photo, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentImageIndex(index)}
                    className={`flex-shrink-0 w-16 h-16 sm:w-20 sm:h-20 rounded-lg sm:rounded-xl overflow-hidden border-2 sm:border-3 transition-all duration-300 ${
                      currentImageIndex === index
                        ? 'border-purple-500 shadow-lg transform scale-105'
                        : 'border-gray-200 hover:border-purple-300 hover:shadow-md'
                    }`}
                  >
                    <img
                      src={photo || '/placeholder.svg'}
                      alt={`${product.title} ${index + 1}`}
                      className='w-full h-full object-cover'
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className='space-y-4 sm:space-y-6 lg:space-y-8'>
            {/* Header Info */}
            <div className='bg-white rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-lg border border-gray-100'>
              <div className='flex flex-wrap items-center gap-2 sm:gap-3 mb-3 sm:mb-4'>
                <span className='text-xs sm:text-sm bg-gradient-to-r from-purple-100 to-blue-100 text-purple-700 px-3 sm:px-4 py-1 sm:py-2 rounded-full font-semibold'>
                  {product.category}
                </span>
                {product.brand && (
                  <span className='text-xs sm:text-sm bg-gray-100 text-gray-700 px-2 sm:px-3 py-1 rounded-full font-medium'>
                    {product.brand}
                  </span>
                )}
              </div>
              <h1 className='text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-3 sm:mb-4 leading-tight'>
                {product.title}
              </h1>
              <div className='flex flex-wrap items-center gap-3 sm:gap-6 mb-4 sm:mb-6'>
                <div className='flex items-center gap-2'>
                  <StarRating rating={product.rating || 5} />
                  <span className='text-sm sm:text-lg font-semibold text-gray-700'>
                    ({product.rating?.toFixed(1) || '5.0'})
                  </span>
                </div>
                <div className='h-4 sm:h-6 w-px bg-gray-300'></div>
                <span className='text-xs sm:text-sm text-gray-600 font-medium'>
                  ID: {product.ID}
                </span>
                <div className='h-4 sm:h-6 w-px bg-gray-300'></div>
                <div className='flex items-center gap-2'>
                  <Eye className='w-3 h-3 sm:w-4 sm:h-4 text-green-600' />
                  <span className='text-xs sm:text-sm text-green-600 font-semibold'>
                    Sotildi: {product.selled_count || 0}
                  </span>
                </div>
              </div>
              <p className='text-gray-600 leading-relaxed text-sm sm:text-base lg:text-lg'>
                {product.description}
              </p>
            </div>

            {/* Price */}
            <div className='bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-green-200 shadow-lg'>
              <div className='text-2xl sm:text-3xl lg:text-4xl font-bold text-green-600 mb-2'>
                {totalPrice} so'm
              </div>
              {product.sale > 0 && selectedVariant && (
                <div className='flex flex-wrap items-center gap-2 sm:gap-3'>
                  <span className='text-lg sm:text-xl text-gray-500 line-through'>
                    {(selectedVariant.price + (selectedFlavor?.price || 0)) *
                      quantity}{' '}
                    so'm
                  </span>
                  <span className='bg-red-100 text-red-600 px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-bold'>
                    {product.sale}% chegirma
                  </span>
                </div>
              )}
            </div>

            {/* Variants */}
            {product.variants && product.variants.length > 0 && (
              <div className='bg-white rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-lg border border-gray-100'>
                <h3 className='text-lg sm:text-xl font-bold text-gray-800 mb-3 sm:mb-4 flex items-center gap-2'>
                  <Package className='w-4 h-4 sm:w-5 sm:h-5 text-purple-600' />
                  Variant tanlang:
                </h3>
                <div className='grid grid-cols-1 gap-2 sm:gap-3'>
                  {product.variants.map((variant, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedVariant(variant)}
                      className={`p-3 sm:p-4 border-2 rounded-lg sm:rounded-xl text-left transition-all duration-300 ${
                        selectedVariant === variant
                          ? 'border-purple-500 bg-purple-50 shadow-md transform scale-[1.02]'
                          : 'border-gray-200 hover:border-purple-300 hover:bg-purple-25 hover:shadow-sm'
                      }`}
                    >
                      <div className='flex items-center justify-between'>
                        <div className='flex flex-wrap items-center gap-2 sm:gap-4'>
                          {variant.color && variant.color.name && (
                            <div className='flex items-center gap-2 sm:gap-3'>
                              <div
                                className='w-5 h-5 sm:w-6 sm:h-6 rounded-full border-2 border-gray-300 shadow-sm'
                                style={{ backgroundColor: variant.color.value }}
                              />
                              <span className='font-semibold text-gray-800 text-sm sm:text-base'>
                                {variant.color.name}
                              </span>
                            </div>
                          )}
                          {variant.weight && (
                            <span className='text-xs sm:text-sm bg-blue-100 text-blue-800 px-2 sm:px-3 py-1 rounded-full font-medium'>
                              {variant.weight}
                            </span>
                          )}
                        </div>
                        <div className='text-right'>
                          <div className='text-lg sm:text-xl font-bold text-green-600'>
                            {variant.price} so'm
                          </div>
                          <div className='text-xs sm:text-sm text-gray-500 flex items-center gap-1'>
                            <Package className='w-3 h-3' />
                            Zaxira: {variant.stock || 0}
                          </div>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Flavors */}
            {product.flavors && product.flavors.length > 0 && (
              <div className='bg-white rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-lg border border-gray-100'>
                <h3 className='text-lg sm:text-xl font-bold text-gray-800 mb-3 sm:mb-4 flex items-center gap-2'>
                  <Award className='w-4 h-4 sm:w-5 sm:h-5 text-orange-600' />
                  Flavor tanlang (ixtiyoriy):
                </h3>
                <div className='grid grid-cols-1 gap-2 sm:gap-3'>
                  <button
                    onClick={() => setSelectedFlavor(null)}
                    className={`p-3 sm:p-4 border-2 rounded-lg sm:rounded-xl text-left transition-all duration-300 ${
                      !selectedFlavor
                        ? 'border-purple-500 bg-purple-50 shadow-md transform scale-[1.02]'
                        : 'border-gray-200 hover:border-purple-300 hover:bg-purple-25 hover:shadow-sm'
                    }`}
                  >
                    <div className='font-semibold text-gray-800 text-sm sm:text-base'>
                      Flavorsiz
                    </div>
                    <div className='text-xs sm:text-sm text-gray-500'>
                      Qo'shimcha to'lov yo'q
                    </div>
                  </button>
                  {product.flavors.map((flavor, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedFlavor(flavor)}
                      className={`p-3 sm:p-4 border-2 rounded-lg sm:rounded-xl text-left transition-all duration-300 ${
                        selectedFlavor === flavor
                          ? 'border-purple-500 bg-purple-50 shadow-md transform scale-[1.02]'
                          : 'border-gray-200 hover:border-purple-300 hover:bg-purple-25 hover:shadow-sm'
                      }`}
                    >
                      <div className='flex items-center justify-between'>
                        <div>
                          <div className='font-semibold text-gray-800 text-sm sm:text-base'>
                            {flavor.name}
                          </div>
                          {flavor.ingredients &&
                            flavor.ingredients.length > 0 && (
                              <div className='text-xs sm:text-sm text-gray-500 mt-1'>
                                {flavor.ingredients.join(', ')}
                              </div>
                            )}
                        </div>
                        <div className='text-right'>
                          <div className='text-sm sm:text-lg font-bold text-green-600'>
                            +{flavor.price} so'm
                          </div>
                          <div className='text-xs sm:text-sm text-gray-500 flex items-center gap-1'>
                            <Package className='w-3 h-3' />
                            Zaxira: {flavor.stock || 0}
                          </div>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity */}
            <div className='bg-white rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-lg border border-gray-100'>
              <h3 className='text-lg sm:text-xl font-bold text-gray-800 mb-3 sm:mb-4'>
                Miqdor:
              </h3>
              <div className='flex flex-wrap items-center gap-4 sm:gap-6'>
                <div className='flex items-center border-2 border-gray-300 rounded-lg sm:rounded-xl overflow-hidden'>
                  <button
                    onClick={() => setQuantity(quantity - 1)}
                    disabled={quantity <= 1}
                    className='p-2 sm:p-3 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors'
                  >
                    <Minus className='w-4 h-4 sm:w-5 sm:h-5' />
                  </button>
                  <span className='px-4 sm:px-6 py-2 sm:py-3 font-bold text-lg sm:text-xl min-w-[60px] sm:min-w-[80px] text-center bg-gray-50'>
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    disabled={quantity >= getAvailableStock()}
                    className='p-2 sm:p-3 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors'
                  >
                    <Plus className='w-4 h-4 sm:w-5 sm:h-5' />
                  </button>
                </div>
                <div className='flex items-center gap-2 text-gray-600'>
                  <Package className='w-4 h-4 sm:w-5 sm:h-5' />
                  <span className='font-medium text-sm sm:text-base'>
                    Mavjud: {getAvailableStock()} dona
                  </span>
                </div>
              </div>
            </div>

            {/* Action Button */}
            <button
              onClick={handleAddToCart}
              disabled={
                isAddingToCart || getAvailableStock() === 0 || !selectedVariant
              }
              className='w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white py-3 sm:py-4 px-6 sm:px-8 rounded-xl sm:rounded-2xl font-bold text-base sm:text-lg hover:from-purple-700 hover:to-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 sm:gap-3 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1'
            >
              {isAddingToCart ? (
                <>
                  <div className='animate-spin rounded-full h-5 w-5 sm:h-6 sm:w-6 border-2 border-white border-t-transparent'></div>
                  Qo'shilmoqda...
                </>
              ) : (
                <>
                  <ShoppingCart className='w-5 h-5 sm:w-6 sm:h-6' />
                  Savatga qo'shish
                </>
              )}
            </button>

            {/* Services */}
            <div className='grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4'>
              <div className='bg-gradient-to-r from-green-50 to-emerald-50 p-3 sm:p-4 rounded-lg sm:rounded-xl border border-green-200'>
                <div className='flex items-center gap-2 sm:gap-3'>
                  <Truck className='w-5 h-5 sm:w-6 sm:h-6 text-green-600' />
                  <div>
                    <p className='font-semibold text-green-800 text-sm sm:text-base'>
                      Bepul yetkazib berish
                    </p>
                    <p className='text-xs sm:text-sm text-green-600'>
                      100,000 so'mdan yuqori
                    </p>
                  </div>
                </div>
              </div>
              <div className='bg-gradient-to-r from-blue-50 to-cyan-50 p-3 sm:p-4 rounded-lg sm:rounded-xl border border-blue-200'>
                <div className='flex items-center gap-2 sm:gap-3'>
                  <Shield className='w-5 h-5 sm:w-6 sm:h-6 text-blue-600' />
                  <div>
                    <p className='font-semibold text-blue-800 text-sm sm:text-base'>
                      Rasmiy kafolat
                    </p>
                    <p className='text-xs sm:text-sm text-blue-600'>
                      Rasmiy distribyutor
                    </p>
                  </div>
                </div>
              </div>
              <div className='bg-gradient-to-r from-orange-50 to-amber-50 p-3 sm:p-4 rounded-lg sm:rounded-xl border border-orange-200'>
                <div className='flex items-center gap-2 sm:gap-3'>
                  <RotateCcw className='w-5 h-5 sm:w-6 sm:h-6 text-orange-600' />
                  <div>
                    <p className='font-semibold text-orange-800 text-sm sm:text-base'>
                      14 kun qaytarish
                    </p>
                    <p className='text-xs sm:text-sm text-orange-600'>
                      Shartsiz qaytarish
                    </p>
                  </div>
                </div>
              </div>
              <div className='bg-gradient-to-r from-purple-50 to-pink-50 p-3 sm:p-4 rounded-lg sm:rounded-xl border border-purple-200'>
                <div className='flex items-center gap-2 sm:gap-3'>
                  <Clock className='w-5 h-5 sm:w-6 sm:h-6 text-purple-600' />
                  <div>
                    <p className='font-semibold text-purple-800 text-sm sm:text-base'>
                      Tezkor yetkazish
                    </p>
                    <p className='text-xs sm:text-sm text-purple-600'>
                      1-3 ish kuni
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Additional Info */}
        <div className='grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8'>
          {/* Ingredients */}
          {product.ingredients && product.ingredients.length > 0 && (
            <div className='bg-white rounded-xl sm:rounded-2xl p-6 sm:p-8 shadow-lg border border-gray-100'>
              <h3 className='text-xl sm:text-2xl font-bold text-gray-800 mb-4 sm:mb-6 flex items-center gap-2 sm:gap-3'>
                <Package className='w-5 h-5 sm:w-6 sm:h-6 text-orange-600' />
                Tarkib
              </h3>
              <div className='flex flex-wrap gap-2 sm:gap-3'>
                {product.ingredients.map((ingredient, index) => (
                  <span
                    key={index}
                    className='bg-gradient-to-r from-orange-100 to-amber-100 text-orange-800 px-3 sm:px-4 py-1 sm:py-2 rounded-full text-xs sm:text-sm font-medium border border-orange-200 shadow-sm'
                  >
                    {ingredient}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Product Details */}
          <div className='bg-white rounded-xl sm:rounded-2xl p-6 sm:p-8 shadow-lg border border-gray-100'>
            <h3 className='text-xl sm:text-2xl font-bold text-gray-800 mb-4 sm:mb-6 flex items-center gap-2 sm:gap-3'>
              <Info className='w-5 h-5 sm:w-6 sm:h-6 text-blue-600' />
              Mahsulot ma'lumotlari
            </h3>
            <div className='space-y-3 sm:space-y-4'>
              <div className='flex justify-between items-center py-2 border-b border-gray-100'>
                <span className='text-gray-600 font-medium text-sm sm:text-base'>
                  Kategoriya:
                </span>
                <span className='font-semibold text-gray-800 text-sm sm:text-base'>
                  {product.category}
                </span>
              </div>
              {product.brand && (
                <div className='flex justify-between items-center py-2 border-b border-gray-100'>
                  <span className='text-gray-600 font-medium text-sm sm:text-base'>
                    Brend:
                  </span>
                  <span className='font-semibold text-gray-800 text-sm sm:text-base'>
                    {product.brand}
                  </span>
                </div>
              )}
              {product.expiryDate && (
                <div className='flex justify-between items-center py-2 border-b border-gray-100'>
                  <span className='text-gray-600 font-medium text-sm sm:text-base'>
                    Yaroqlilik muddati:
                  </span>
                  <span className='font-semibold text-gray-800 flex items-center gap-2 text-sm sm:text-base'>
                    <Calendar className='w-3 h-3 sm:w-4 sm:h-4' />
                    {new Date(product.expiryDate).toLocaleDateString('uz-UZ')}
                  </span>
                </div>
              )}
              <div className='flex justify-between items-center py-2'>
                <span className='text-gray-600 font-medium text-sm sm:text-base'>
                  Reyting:
                </span>
                <div className='flex items-center gap-2'>
                  <Star className='w-4 h-4 sm:w-5 sm:h-5 text-yellow-500 fill-yellow-500' />
                  <span className='font-semibold text-gray-800 text-sm sm:text-base'>
                    {product.rating?.toFixed(1) || '5.0'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
