import { useState } from 'react'
import { Check, Loader2 } from 'lucide-react'
import { cn } from '../lib/utils'

export default function OrderForm ({
  product,
  quantity,
  selectedColor,
  totalPrice,
  onClose
}) {
  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    address: '',
    paymentMethod: 'cash',
    notes: ''
  })
  const [errors, setErrors] = useState({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)

  // Handle input change
  const handleChange = e => {
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]: value
    })
    // Clear error when user types
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: ''
      })
    }
  }

  // Validate form
  const validateForm = () => {
    const newErrors = {}

    if (!formData.fullName.trim()) {
      newErrors.fullName = 'Ism-familiya kiritilishi shart'
    }

    if (!formData.phone.trim()) {
      newErrors.phone = 'Telefon raqam kiritilishi shart'
    } else if (!/^\+?[0-9]{9,15}$/.test(formData.phone.replace(/\s/g, ''))) {
      newErrors.phone = "Noto'g'ri telefon raqam formati"
    }

    if (!formData.address.trim()) {
      newErrors.address = 'Manzil kiritilishi shart'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  // Handle form submission
  const handleSubmit = e => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    setIsSubmitting(true)

    // Create order object based on the schema
    const orderData = {
      customer: 'user_id_here', // This would come from authentication
      products: [product._id],
      status: 'pending',
      totalPrice: totalPrice,
      quantity: quantity,
      orderDate: new Date(),
      // Additional data not in schema but useful
      customerDetails: {
        fullName: formData.fullName,
        phone: formData.phone,
        address: formData.address,
        notes: formData.notes
      },
      paymentMethod: formData.paymentMethod,
      selectedColor: selectedColor ? selectedColor.value : null
    }

    // Simulate API call
    console.log('Submitting order:', orderData)

    setTimeout(() => {
      setIsSubmitting(false)
      setIsSuccess(true)

      // Reset form after success
      setTimeout(() => {
        onClose()
      }, 2000)
    }, 1500)
  }

  if (isSuccess) {
    return (
      <div className='p-8 flex flex-col items-center justify-center'>
        <div className='w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4 animate-in zoom-in duration-300'>
          <Check className='w-8 h-8 text-green-600' />
        </div>
        <h2 className='text-xl font-bold text-center text-gray-900'>
          Buyurtmangiz qabul qilindi!
        </h2>
        <p className='text-gray-600 text-center mt-2'>
          Tez orada operatorlarimiz siz bilan bog'lanishadi
        </p>
        <button
          onClick={onClose}
          className='mt-6 px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors'
        >
          Yopish
        </button>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className='p-6'>
      {/* Product Summary */}
      <div className='bg-gray-50 p-4 rounded-lg mb-6'>
        <div className='flex gap-4'>
          <img
            src={product.photos[0] || '/placeholder.svg'}
            alt={product.title}
            className='w-16 h-16 object-cover rounded-lg'
          />
          <div>
            <h3 className='font-medium'>{product.title}</h3>
            <div className='text-sm text-gray-500 mt-1'>
              <span>Miqdor: {quantity}</span>
              {selectedColor && (
                <span className='ml-2'>
                  Rang:{' '}
                  <span
                    className='inline-block w-3 h-3 rounded-full ml-1'
                    style={{ backgroundColor: selectedColor.value }}
                  ></span>
                </span>
              )}
            </div>
            <div className='text-purple-700 font-medium mt-1'>
              {totalPrice.toLocaleString()} so'm
            </div>
          </div>
        </div>
      </div>

      {/* Customer Information */}
      <div className='space-y-4'>
        <div>
          <label
            htmlFor='fullName'
            className='block text-sm font-medium text-gray-700 mb-1'
          >
            Ism-familiya *
          </label>
          <input
            type='text'
            id='fullName'
            name='fullName'
            value={formData.fullName}
            onChange={handleChange}
            className={cn(
              'w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all',
              errors.fullName ? 'border-red-300' : 'border-gray-300'
            )}
            placeholder='Ism-familiyangizni kiriting'
          />
          {errors.fullName && (
            <p className='text-red-500 text-xs mt-1'>{errors.fullName}</p>
          )}
        </div>

        <div>
          <label
            htmlFor='phone'
            className='block text-sm font-medium text-gray-700 mb-1'
          >
            Telefon raqam *
          </label>
          <input
            type='tel'
            id='phone'
            name='phone'
            value={formData.phone}
            onChange={handleChange}
            className={cn(
              'w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all',
              errors.phone ? 'border-red-300' : 'border-gray-300'
            )}
            placeholder='+998 XX XXX XX XX'
          />
          {errors.phone && (
            <p className='text-red-500 text-xs mt-1'>{errors.phone}</p>
          )}
        </div>

        <div>
          <label
            htmlFor='address'
            className='block text-sm font-medium text-gray-700 mb-1'
          >
            Manzil *
          </label>
          <textarea
            id='address'
            name='address'
            value={formData.address}
            onChange={handleChange}
            rows='3'
            className={cn(
              'w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all',
              errors.address ? 'border-red-300' : 'border-gray-300'
            )}
            placeholder="To'liq manzilingizni kiriting"
          />
          {errors.address && (
            <p className='text-red-500 text-xs mt-1'>{errors.address}</p>
          )}
        </div>

        <div>
          <label className='block text-sm font-medium text-gray-700 mb-1'>
            To'lov usuli
          </label>
          <div className='grid grid-cols-2 gap-3'>
            <label
              className={cn(
                'flex items-center gap-2 border rounded-lg p-3 cursor-pointer transition-all',
                formData.paymentMethod === 'cash'
                  ? 'border-purple-500 bg-purple-50'
                  : 'border-gray-300 hover:border-purple-200'
              )}
            >
              <input
                type='radio'
                name='paymentMethod'
                value='cash'
                checked={formData.paymentMethod === 'cash'}
                onChange={handleChange}
                className='sr-only'
              />
              <span
                className={cn(
                  'w-4 h-4 rounded-full border flex items-center justify-center',
                  formData.paymentMethod === 'cash'
                    ? 'border-purple-500'
                    : 'border-gray-400'
                )}
              >
                {formData.paymentMethod === 'cash' && (
                  <span className='w-2 h-2 rounded-full bg-purple-500' />
                )}
              </span>
              <span>Naqd pul</span>
            </label>

            <label
              className={cn(
                'flex items-center gap-2 border rounded-lg p-3 cursor-pointer transition-all',
                formData.paymentMethod === 'card'
                  ? 'border-purple-500 bg-purple-50'
                  : 'border-gray-300 hover:border-purple-200'
              )}
            >
              <input
                type='radio'
                name='paymentMethod'
                value='card'
                checked={formData.paymentMethod === 'card'}
                onChange={handleChange}
                className='sr-only'
              />
              <span
                className={cn(
                  'w-4 h-4 rounded-full border flex items-center justify-center',
                  formData.paymentMethod === 'card'
                    ? 'border-purple-500'
                    : 'border-gray-400'
                )}
              >
                {formData.paymentMethod === 'card' && (
                  <span className='w-2 h-2 rounded-full bg-purple-500' />
                )}
              </span>
              <span>Karta orqali</span>
            </label>
          </div>
        </div>

        <div>
          <label
            htmlFor='notes'
            className='block text-sm font-medium text-gray-700 mb-1'
          >
            Qo'shimcha ma'lumot
          </label>
          <textarea
            id='notes'
            name='notes'
            value={formData.notes}
            onChange={handleChange}
            rows='2'
            className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all'
            placeholder="Qo'shimcha ma'lumot (ixtiyoriy)"
          />
        </div>
      </div>

      {/* Submit Button */}
      <div className='mt-8'>
        <button
          type='submit'
          disabled={isSubmitting}
          className={cn(
            'w-full py-3 rounded-lg font-medium flex items-center justify-center gap-2 transition-all duration-300',
            isSubmitting
              ? 'bg-purple-300 text-purple-700 cursor-not-allowed'
              : 'bg-purple-600 text-white hover:bg-purple-700 active:scale-[0.98]'
          )}
        >
          {isSubmitting ? (
            <>
              <Loader2 className='w-5 h-5 animate-spin' />
              Buyurtma qilinmoqda...
            </>
          ) : (
            'Buyurtma qilish'
          )}
        </button>
      </div>
    </form>
  )
}
