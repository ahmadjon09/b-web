import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Link } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import Axios from '../Axios'
import { MoveRight } from 'lucide-react'

export const Profile = ({ onClose, onEdit }) => {
  const user = useSelector(state => state.user.data._id)
  const [isEditing, setIsEditing] = useState(false)
  const [error, setError] = useState('')
  const [imagePending, setImagePending] = useState(false)
  const fileInputRef = useRef(null)
  const dispatch = useDispatch()
  const [userData, setUserData] = useState({
    firstName: '',
    lastName: '',
    phoneNumber: '',
    avatar: '',
    liked: [],
    disliked: [],
    favorites: [],
    cart: [],
    newPassword: ''
  })
  const [isLoading, setIsLoading] = useState(false)
  const [previewAvatar, setPreviewAvatar] = useState('')
  const [a, setA] = useState([])

  useEffect(() => {
    if (user) {
      const getUser = async () => {
        try {
          setIsLoading(true)
          setError('')
          const response = await Axios.get(`client/${user}`)
          const userData = response.data.data

          setUserData({
            ...userData,
            newPassword: ''
          })

          setPreviewAvatar(userData.avatar || '')
        } catch (error) {
          setError(error.response?.data?.message || 'Сервер хатоси юз берди.')
        } finally {
          setIsLoading(false)
        }
      }
      getUser()
    }
  }, [user])

  const handleChange = e => {
    const { name, value } = e.target
    setUserData({ ...userData, [name]: value })
  }

  const handleEdit = () => {
    setIsEditing(true)
  }

  const handleSave = () => {
    setIsEditing(false)
    onEdit(userData)
  }

  const handleRemoveAvatar = indexToRemove => {
    if (!isEditing) return

    setUserData({
      ...userData,
      avatar: userData.avatar.filter((_, index) => index !== indexToRemove)
    })
  }

  const handleAddAvatar = async e => {
    if (!isEditing) return

    const files = e.target.files
    if (!files || files.length === 0) return
    const file = files[0]
    try {
      const userData = new userData()
      userData.append('image', file)

      const res = await fetch(
        `https://api.imgbb.com/1/upload?key=955f1e37f0aa643262e734c080305b10`,
        {
          method: 'POST',
          body: userData
        }
      )

      const result = await res.json()

      if (result.success) {
        const uploadedUrl = result.data.url

        setUserData({
          ...userData,
          avatar: [uploadedUrl]
        })
      } else {
        throw new Error('Yuklash muvaffaqiyatsiz bo‘ldi')
      }
    } catch (err) {
      console.error(err)
    }
  }

  const triggerFileInput = () => {
    if (isEditing) {
      fileInputRef.current.click()
    }
  }

  return (
    <AnimatePresence>
      <motion.div
        className='fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 px-4'
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <motion.div
          className='bg-white  p-8 rounded-3xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto'
          initial={{ scale: 0.8, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.8, opacity: 0, y: 20 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
        >
          <div className='flex justify-between items-center mb-8'>
            <h2 className='text-3xl font-bold text-gray-800'>
              {isEditing ? 'Profilni tahrirlash' : "Portfolio haqida ma'lumot"}
            </h2>
            <button
              onClick={onClose}
              className='text-gray-400 hover:text-red-500 transition-colors duration-200 w-10 h-10 rounded-full flex items-center justify-center hover:bg-gray-100'
              aria-label='Close'
            >
              <svg
                xmlns='http://www.w3.org/2000/svg'
                width='24'
                height='24'
                viewBox='0 0 24 24'
                fill='none'
                stroke='currentColor'
                strokeWidth='2'
                strokeLinecap='round'
                strokeLinejoin='round'
              >
                <line x1='18' y1='6' x2='6' y2='18'></line>
                <line x1='6' y1='6' x2='18' y2='18'></line>
              </svg>
            </button>
          </div>

          <div className='space-y-6'>
            {isEditing ? (
              <>
                <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                  {['firstName', 'lastName'].map(field => (
                    <div key={field}>
                      <label className='block text-gray-700 text-sm font-medium mb-2 capitalize'>
                        {field === 'firstName' ? 'Ism' : 'Familiya'}
                      </label>
                      <input
                        type='text'
                        name={field}
                        value={userData[field] || ''}
                        onChange={handleChange}
                        disabled={!isEditing}
                        className={`w-full p-3 rounded-xl border ${
                          isEditing
                            ? 'border-blue-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500'
                            : 'border-gray-200 bg-gray-50'
                        } outline-none transition-all duration-200`}
                      />
                    </div>
                  ))}
                </div>

                {['phoneNumber', 'password'].map(field => (
                  <div key={field}>
                    <label className='block text-gray-700 text-sm font-medium mb-2 capitalize'>
                      {field === 'phoneNumber' ? 'Telefon raqami' : 'Parol'}
                    </label>
                    <input
                      type={field === 'password' ? 'password' : 'text'}
                      name={field}
                      value={userData[field] || ''}
                      onChange={handleChange}
                      disabled={!isEditing}
                      className={`w-full p-3 rounded-xl border ${
                        isEditing
                          ? 'border-blue-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500'
                          : 'border-gray-200 bg-gray-50'
                      } outline-none transition-all duration-200`}
                    />
                  </div>
                ))}
              </>
            ) : null}

            <div>
              <label className='block text-gray-700 text-sm font-medium mb-3'>
                USER:
              </label>
              <div className='flex flex-wrap gap-4 items-center'>
                {userData.avatar &&
                  userData.avatar.map((url, idx) => (
                    <div key={idx} className='relative group'>
                      <img
                        src={url || '/placeholder.svg'}
                        alt={`avatar ${idx + 1}`}
                        className={`w-20 h-20 rounded-full object-cover border-2 ${
                          isEditing ? 'border-blue-300' : 'border-gray-200'
                        } transition-all duration-200 ${
                          isEditing ? 'hover:opacity-80' : ''
                        }`}
                      />
                      {isEditing && (
                        <button
                          onClick={() => handleRemoveAvatar(idx)}
                          className='absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 shadow-md'
                          aria-label='Remove avatar'
                        >
                          <svg
                            xmlns='http://www.w3.org/2000/svg'
                            width='14'
                            height='14'
                            viewBox='0 0 24 24'
                            fill='none'
                            stroke='currentColor'
                            strokeWidth='2'
                            strokeLinecap='round'
                            strokeLinejoin='round'
                          >
                            <line x1='18' y1='6' x2='6' y2='18'></line>
                            <line x1='6' y1='6' x2='18' y2='18'></line>
                          </svg>
                        </button>
                      )}
                    </div>
                  ))}

                {isEditing && (
                  <div
                    onClick={triggerFileInput}
                    className='w-20 h-20 rounded-full border-2 border-dashed border-blue-300 flex items-center justify-center cursor-pointer hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors duration-200'
                  >
                    <svg
                      xmlns='http://www.w3.org/2000/svg'
                      width='24'
                      height='24'
                      viewBox='0 0 24 24'
                      fill='none'
                      stroke='currentColor'
                      strokeWidth='2'
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      className='text-blue-500'
                    >
                      <line x1='12' y1='5' x2='12' y2='19'></line>
                      <line x1='5' y1='12' x2='19' y2='12'></line>
                    </svg>
                    <input
                      type='file'
                      ref={fileInputRef}
                      onChange={handleAddAvatar}
                      accept='image/*'
                      className='hidden'
                    />
                  </div>
                )}
                {!isEditing && (
                  <div className='flex flex-col items-start text-xl'>
                    <p>{userData.firstName}</p>
                    <p>{userData.lastName}</p>
                  </div>
                )}
              </div>
            </div>

            {!isEditing && (
              <>
                {['favorites', 'cart', 'liked', 'disliked'].map(list => (
                  <div key={list} className='bg-gray-50/50 p-4 rounded-xl'>
                    <label className='block text-gray-700 text-sm font-medium mb-2 capitalize'>
                      {
                        {
                          favorites: 'Sevimlilar',
                          cart: 'Savat',
                          liked: 'Yoqqanlar',
                          disliked: 'Yoqmaganlar'
                        }[list]
                      }
                    </label>
                    <Link
                      onClick={() => onClose(true)}
                      to={`/${list}`}
                      className='flex flex-wrap gap-2'
                    >
                      {userData[list] && userData[list].length > 0 ? (
                        <p className='text-gray-500 text-sm'>
                          {userData[list].length} ta
                        </p>
                      ) : (
                        <p className='text-gray-500 text-sm'>0</p>
                      )}
                    </Link>
                  </div>
                ))}
              </>
            )}

            {!isEditing && (
              <div className='bg-gray-50/50 p-4 rounded-xl text-gray-500 dark:text-gray-400 text-sm'>
                <div className='flex flex-col sm:flex-row sm:gap-6'>
                  <p>
                    <span className='font-semibold'>Hisob yaratilgan:</span>{' '}
                    {userData.createdAt
                      ? new Date(userData.createdAt).toLocaleString()
                      : 'N/A'}
                  </p>
                  <p>
                    <span className='font-semibold'>Hisob yangilandi:</span>{' '}
                    {userData.updatedAt
                      ? new Date(userData.updatedAt).toLocaleString()
                      : 'N/A'}
                  </p>
                </div>
              </div>
            )}

            <div className='flex flex-col sm:flex-row justify-end gap-3 mt-8 pt-4 border-t border-gray-100 dark:border-gray-700'>
              {!isEditing ? (
                <button
                  onClick={handleEdit}
                  className='bg-blue-500 text-white px-6 py-3 rounded-xl hover:bg-blue-600 transition-colors duration-200 shadow-md hover:shadow-lg w-full sm:w-auto font-medium'
                >
                  Profilni tahrirlash
                </button>
              ) : (
                <button
                  onClick={handleSave}
                  className='bg-green-500 text-white px-6 py-3 rounded-xl hover:bg-green-600 transition-colors duration-200 shadow-md hover:shadow-lg w-full sm:w-auto font-medium'
                >
                  Saqlash
                </button>
              )}
              <button
                onClick={onClose}
                className='px-6 py-3 rounded-xl border border-gray-300 hover:bg-gray-100 transition-colors duration-200 w-full sm:w-auto font-medium text-gray-700'
              >
                Bekor qilish
              </button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}
